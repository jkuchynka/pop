<?php

/**
 * Integration test for Auth
 */
class AuthIntegrationTest extends TestCase {

	public function testCurrentUserGuest()
	{
		// Call the service that returns the current loggedin user
		// Shouldn't be logged in yet
		$response = $this->call('GET', '/api/auth');
		$this->assertResponseOk();
		$user = json_decode($response->getContent());
		$this->assertEquals('guest', $user->username);
	}

	public function testLoginSuccessReturnsUserObject()
	{
		$this->setupTestUsers();
		$this->setupTestRoles();
		$this->setupAttachUserToRole(1, 1);
		$expect = $this->getTestUsers(1);
		$expect['roles'] = array(array(
			'id' => 1,
			'name' => 'Admin'
		));
		// Log the user in
		$response = $this->call('POST', '/api/auth', array(
			'email' => $expect['email'],
			'password' => 'password'
		));
		$this->assertResponseOk("Can't login");
		$user = json_decode($response->getContent());
		$this->assertUserFields($expect, $user);
	}

	public function testLoginDirectCurrentUserAuth()
	{
		$this->setupTestUsers();
		$this->setupTestRoles();
		$this->setupAttachUserToRole(1, 1);
		$this->setupAttachUserToRole(1, 2);
		$expect = $this->getTestUsers(1);
		$expect['roles'] = array(array(
			'id' => 1,
			'name' => 'Admin'
		), array(
			'id' => 2,
			'name' => 'Editor'
		));
		// Log the user in
		$attempt = Confide::logAttempt(array(
			'email' => $expect['email'],
			'password' => 'password',
			'remember' => 1
		));
		$user = Confide::user();
		$ctrl = new AuthController;
		$response = $ctrl->callAction('show_current', array($user->id));
		$data = json_decode($response->getContent());
		$this->assertUserFields($expect, $data);
	}

	public function testUserCanLoginAndGetCurrentUserAuth()
	{
		$this->setupTestUsers();
		$this->setupTestRoles();
		$this->setupAttachUserToRole(1, 1);
		$expect = $this->getTestUsers(1);
		$expect['roles'] = array(array(
			'id' => 1,
			'name' => 'Admin'
		));
		// Log the user in
		$response = $this->call('POST', '/api/auth', array(
			'email' => $expect['email'],
			'password' => 'password'
		));
		// Get current user through api call
		$response = $this->call('GET', '/api/auth');
		$user = json_decode($response->getContent());
		$this->assertUserFields($expect, $user);
	}

	public function testLoginFailureReturns401()
	{
		$response = $this->call('POST', '/api/auth', array(
			'email' => 'none@mail.net',
			'password' => 'password'
		));
		$this->assertResponseStatus(401);
	}

	public function testUserCanLogout()
	{
		$this->setupTestUsers();
		$expect = $this->getTestUsers(1);
		$expect['roles'] = array();
		// Log the user in
		$response = $this->call('POST', '/api/auth', array(
			'email' => $expect['email'],
			'password' => 'password'
		));
		$this->assertResponseOk();
		$response = $this->call('GET', '/api/auth/logout');
		$this->assertResponseOk();
		// Shouldn't be current user
		$response = $this->call('GET', '/api/auth');
		$this->assertResponseOk();
		$user = json_decode($response->getContent());
		$this->assertEquals('guest', $user->username);
	}

}
