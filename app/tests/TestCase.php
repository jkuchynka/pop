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

  protected function assertModel($expect, $compare) {
    $fail = function () use ($expect) {
      $className = get_class($expect);
      return $className .': ';
    };
    if (method_exists($expect, 'assertions')) {
      $assertions = $expect->assertions();
      if ( ! empty($assertions['equals'])) {
        // These fields should match
        foreach ($assertions['equals'] as $field) {
          $this->assertEquals($expect->$field, $compare->$field, $fail());
        }
      }
    } else {
      $this->fail("Model has no function assertions.");
    }
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
      $this->assertObjectHasAttribute($field, $user, "User field should be set: $field .");
      $this->assertEquals($expect->$field, $user->$field, "User field doesn't match: $field .");
    }
    // Fields that shouldn't be set in the api response
    $notSet = array(
      'password', 'password_confirmation', 'confirmation_code'
    );
    foreach ($notSet as $field) {
      $this->assertObjectNotHasAttribute($field, $user, "User field shouldn't be set: $field .");
    }
    // Fields that shouldn't be empty in the api response
    $notEmpty = array(
      'created_at', 'updated_at'
    );
    foreach ($notEmpty as $field) {
      if (empty($user->$field)) {
        $this->fail("User field shouldn't be empty: $field .");
      }
    }
    // Fields that should be set (allows empty)
    $isSet = array(
      'roles'
    );
    foreach ($isSet as $field) {
      $this->assertObjectHasAttribute($field, $user, "User field should be set: $field .");
    }
  }

  protected function assertRole($expect, $role)
  {
    // Fields that should match
    $equals = array(
      'id', 'name'
    );
    foreach ($equals as $field) {
      $this->assertEquals($expect->field, $role->field, "Role field doesn't match: $field .");
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
