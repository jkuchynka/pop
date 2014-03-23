<?php

/**
 * Integration test for Accounts
 * Runs tests against a sqllite database to make sure apis
 * are interacting with the database correctly and returning correct responses
 */
class AccountIntegrationTest extends TestCase {

	public function testIndex() 
	{
		$this->setupTestAccounts();
		$response = $this->call('GET', 'api/account');
		$this->assertResponseOk();
		$accounts = json_decode($response->getContent());
		$expect = $this->getTestAccounts();
		$this->assertAccountFields($expect[1], $accounts[0]);
		$this->assertAccountFields($expect[1], $accounts[0]);
	}

	public function testStore()
	{
		$expect = $this->getTestAccounts(1);
		$response = $this->call('POST', 'api/account', array(
			'title' => $expect['title'],
			'active' => $expect['active']
		));
		$account = json_decode($response->getContent());
		$this->assertAccountFields($expect, $account);
	}

	public function testStoreFailValidationReturnsError()
	{
		$response = $this->call('POST', 'api/account', array(
			'title' => '123', // Title should be longer
		));
		$return = json_decode($response->getContent());
		$this->assertResponseStatus(401);
		$this->assertNotEmpty($return->errors->title);
	}

	public function testShow()
	{
		$this->setupTestAccounts();
		$expect = $this->getTestAccounts(1);
		$response = $this->call('GET', 'api/account/'. $expect['id']);
		$this->assertResponseOk();
		$account = json_decode($response->getContent());
		$this->assertAccountFields($expect, $account);
	}

	public function testUpdate()
	{
		$this->setupTestAccounts();
		$changes = array(
			'title' => 'Foobar',
			'active' => 0
		);
		$expect = array_merge($this->getTestAccounts(1), $changes);
		$response = $this->call('PUT', 'api/account/'. $expect['id'], $changes);
		$this->assertResponseOk();
		$account = json_decode($response->getContent());
		$this->assertAccountFields($expect, $account);
	}

	public function testUpdateFailValidationReturnsError()
	{
		$this->setupTestAccounts();
		$expect = $this->getTestAccounts(1);
		$response = $this->call('PUT', 'api/account/'. $expect['id'], array('title' => '123'));
		$return = json_decode($response->getContent());
		$this->assertResponseStatus(401);
		$this->assertNotEmpty($return->errors->title);
	}

	public function testDestroy()
	{
		// @todo: Implement soft delete?
		$this->setupTestAccounts();
		$expect = $this->getTestAccounts(1);
		$response = $this->call('DELETE', 'api/account/'. $expect['id']);
		$this->assertResponseOk();
		$response = json_decode($response->getContent());
		// @todo: Determine a common response to use here
		$this->assertEquals('OK', $response->success);
		$id = DB::table('accounts')->where('id', $expect['id'])->pluck('id');
		$this->assertEmpty($id);
	}

	public function testAddUserToAccount()
	{
		$this->setupTestUsers();
		$this->setupTestAccounts();
		$account = $this->getTestAccounts(1);
		$user = $this->getTestUsers(1);
		$response = $this->call('POST', 'api/account/'. $account['id'] .'/add_user', array(
			'user_id' => $user['id']
		));
		$this->assertResponseOk();
	}

	public function testGetAccountUsers()
	{
		$this->setupTestUsers();
		$this->setupTestAccounts();
		$account = $this->getTestAccounts(1);
		$account = Account::find($account['id']);
		$users = $this->getTestUsers();
		foreach ($users as $user) {
			$account->add_user($user['id']);
		}
		$response = $this->call('GET', 'api/account/'. $account->id .'/users');
		$users = json_decode($response->getContent());
		$expect = $this->getTestUsers(1);
		$expect['roles'] = array();
		$this->assertUserFields($expect, $users[0]);
		$expect = $this->getTestUsers(2);
		$expect['roles'] = array();
		$this->assertUserFields($expect, $users[1]);
	}

}