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
    $this->prepareForTests();
    // Start off clean
    $this->setupCleanTables();
  }

  /**
   * Empty out test tables
   */
  protected function setupCleanTables()
  {
    DB::table('assigned_roles')->delete();
    DB::table('users')->delete();
    DB::table('roles')->delete();
  }


  /**
   * Attach a user to a role in the db
   * @param  integer $user_id
   * @param  integer $role_id
   */
  protected function setupAttachUserToRole($user_id, $role_id) {
    DB::table('assigned_roles')->insert(array(
      'user_id' => $user_id, 'role_id' => $role_id
    ));
  }

  /**
   * Test data for roles
   */
  protected function getTestRoles($id = null) {
    $roles = array(
      1 => array(
        'id' => 1, 'name' => 'Admin', 'created_at' => $this->now, 'updated_at' => $this->now
      ),
      2 => array(
        'id' => 2, 'name' => 'Editor', 'created_at' => $this->now, 'updated_at' => $this->now
      )
    );
    if ($id) {
      return $roles[$id];
    }
    return $roles;
  }

  /**
   * Test data for users
   */
  protected function getTestUsers($id = null) {
    $users = array(
      1 => array(
        'id' => 1, 'username' => 'test@mail.net', 'email' => 'test@mail.net',
        'password' => Hash::make('password'), 'created_at' => $this->now, 'updated_at' => $this->now,
        'first_name' => 'First', 'last_name' => 'Last', 'confirmed' => 1,
        'address' => '123 First Dr', 'address_2' => 'Apt K123', 'city' => 'Spokane', 'state' => 'WA',
        'phone' => '5091231234', 'status' => 1,
        'confirmation_code' => 12345, 'country' => 'US'
      ),
      2 => array(
        'id' => 2, 'username' => 'test2@mail.net', 'email' => 'test2@mail.net',
        'password' => Hash::make('password'), 'created_at' => $this->now, 'updated_at' => $this->now,
        'first_name' => 'First2', 'last_name' => 'Last2', 'confirmed' => 1,
        'address' => '91919 E Main st.', 'address_2' => 'Suite 5132', 'city' => 'Spangle', 'state' => 'OH',
        'phone' => '2069193818', 'status' => 1,
        'confirmation_code' => 54321, 'country' => 'Canada'
      )
    );
    if ($id) {
      return $users[$id];
    }
    return $users;
  }

  protected function getTestAccounts($id = null)
  {
    $accounts = array(
      1 => array(
        'id' => 1,
        'title' => 'Surge',
        'active' => 1,
        'created_at' => $this->now,
        'updated_at' => $this->now
      ),
      2 => array(
        'id' => 2,
        'title' => 'Test Account',
        'active' => 0,
        'created_at' => $this->now,
        'updated_at' => $this->now
      )
    );
    if ($id) {
      return $accounts[$id];
    }
    return $accounts;
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
   * Migrate the database and set the mailer to pretend
   */
  protected function prepareForTests()
  {
    Artisan::call('migrate');
    Mail::pretend(true);
  }

  /**
   * Assertion helper, check valid fields and match test data for accounts
   * @param  array $expect Expected account
   * @param  object $account Account object returned
   */
  protected function assertAccountFields($expect, $account)
  {
    $err = 'Failed assertion in account object: ';
    $this->assertEquals($expect['id'], $account->id, $err .' ->id');
    $this->assertEquals($expect['title'], $account->title, $err .' ->title');
    $this->assertEquals($expect['active'], $account->active, $err .' ->active');
    $this->assertNotEmpty($account->created_at, $err .' ->created_at');
    $this->assertNotEmpty($account->updated_at, $err .' ->updated_at');
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

    $equals = array(
      'id', 'username', 'email'
    );
    foreach ($equals as $field) {
      if (empty($user->$field) || ($expect[$field] != $user->$field)) {
        $this->fail("User fields don't match: ". $expect[$field] ." should match ". $user->$field ." ". print_r($user, 1));
      }
    }
    $notSet = array(
      'password', 'password_confirmation', 'confirmation_code'
    );
    foreach ($notSet as $field) {
      if (isset($user->$field)) {
        $this->fail("User field shouldn't be set: ". $field);
      }
    }
    $isSet = array(
      'created_at', 'updated_at'
    );
    foreach ($isSet as $field) {
      if (empty($user->$field)) {
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
    $this->assertResponseStatus($status);
    // Response is json?
    $data = json_decode($response->getContent());
    $this->assertNotEmpty($data, "Response was not JSON");
    // Fail responses should contain error(s)
    if ($fail) {
      $this->assertTrue( ! empty($data->errors) || ! empty($data->error), "Fail response should contain error(s)");
    }
    return $data;
  }

}
