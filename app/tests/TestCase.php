<?php

class TestCase extends Illuminate\Foundation\Testing\TestCase {

  /**
   * Setup before all tests
   */
  public static function setUpBeforeClass()
  {

  }

  /**
   * Setup runs before each individual test
   */
  public function setUp()
  {
    parent::setUp();
    // Migrate the database
    Artisan::call('migrate');
    // Set the mailer to pretend
    Mail::pretend(true);
    // Start off clean
    $this->setupCleanTables();
  }

  /**
   * Empty out test tables
   */
  protected function setupCleanTables()
  {
    DB::table('assigned_roles')->delete();
    DB::table('password_reminders')->delete();
    DB::table('users')->delete();
    DB::table('roles')->delete();
  }

	/**
	 * Creates the application.
	 *
	 * @return \Symfony\Component\HttpKernel\HttpKernelInterface
	 */
	public function createApplication()
	{
		$unitTesting = true;
		$testEnvironment = 'testing';
		return require __DIR__.'/../../bootstrap/start.php';
	}

  /**
   * Assert role fields
   * @param  array $expect Expected role
   * @param  object $role  Role object to check
   */
  protected function assertRoleFields($expect, $role) {
    $err = 'Failed assertion in role object: ';
    $this->assertEquals($expect['id'], $role->id, $err .' ->id');
    $this->assertEquals($expect['name'], $role->name, $err .' ->name');
    $this->assertNotEmpty($role->created_at, $err .' ->created_at');
    $this->assertNotEmpty($role->updated_at, $err .' ->updated_at');
  }

  /**
   * Assertion helper, check valid fields and match test data for users
   * @param  array $expect Expected user
   * @param  object $user User object returned
   */
  protected function assertUser($expect, $user)
  {
    // Fields that should match
    $equals = array(
      'id', 'username', 'email'
    );
    foreach ($equals as $field) {
      if (empty($user->$field) || ($expect[$field] != $user->$field)) {
        $this->assertEquals($expect[$field], $user->$field, "User field $field doesn't match");
      }
    }
    // Fields that shouldn't be set in the api response
    $notSet = array(
      'password', 'password_confirmation', 'confirmation_code'
    );
    foreach ($notSet as $field) {
      if (isset($user->$field)) {
        $this->fail("User field shouldn't be set: ". $field);
      }
    }
    // Fields that shouldn't be empty in the api response
    $isSet = array(
      'created_at', 'updated_at', 'roles'
    );
    foreach ($isSet as $field) {
      if ( ! isset($user->$field)) {
        $this->fail("User field ". $field ." should be non empty");
      }
    }

/*
    $roles = array();
    if ( ! empty($expect['roles'])) {
      foreach ($expect['roles'] as $role) {
        $roles[] = (object) $role;
      }
    }
    */
  }

  protected function assertRole($expect, $role)
  {
    // Fields that should match
    $equals = array(
      'id', 'name'
    );
    foreach ($equals as $field) {
      if (empty($role->$field) || ($expect[$field] != $role->$field)) {
        $this->assertEquals($expect[$field], $role->$field, "Role field $field doesn't match");
      }
    }
  }

  /**
   * Assert against an api response
   * @param  object  $response
   * @param  boolean $fail
   * @return array $data
   */
  protected function assertResponse($response, $fail = false)
  {
    // Is correct http status?
    $status = $fail ? 400 : 200;
    $this->assertEquals($status, $response->getStatusCode(), "Response: ". $response->getContent());
    // Response is json?
    $data = json_decode($response->getContent());
    $this->assertNotEmpty($data, "Response was not JSON");
    // Fail responses should contain error(s)
    if ($fail) {
      $this->assertTrue( ! empty($data->errors) || ! empty($data->error), "Fail response should contain error(s). Response: ". print_r($data, 1));
    }
    return $data;
  }

}
