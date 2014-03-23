<?php

class RoleIntegrationTest extends TestCase {

	public function testIndex()
	{
		$this->setupTestRoles();
		$response = $this->call('GET', 'api/role');
		$roles = json_decode($response->getContent());
		$this->assertRoleFields($this->getTestRoles(1), $roles[0]);
		$this->assertRoleFields($this->getTestRoles(2), $roles[1]);
	}

	public function testStore()
	{
		$expect = $this->getTestRoles(1);
		$response = $this->call('POST', 'api/role', array(
			'name' => $expect['name']
		));
		$role = json_decode($response->getContent());
		$this->assertRoleFields($expect, $role);
	}

	public function testStoreFailValidationReturnsError()
	{
		$response = $this->call('POST', 'api/role', array(
			'name' => '',
		));
		$this->assertResponseStatus(401);
		$response = json_decode($response->getContent());
		$this->assertNotEmpty($response->errors->name);	
	}

	public function testShow()
	{
		$this->setupTestRoles();
		$expect = $this->getTestRoles(1);
		$response = $this->call('GET', 'api/role/'. $expect['id']);
		$this->assertRoleFields($expect, json_decode($response->getContent()));
	}

	public function testUpdate()
	{
		$this->setupTestRoles();
		$expect = $this->getTestRoles(1);
		$changes = array('name' => 'Writer');
		$expect = array_merge($expect, $changes);
		$response = $this->call('PUT', 'api/role/'. $expect['id'], $changes);
		$this->assertRoleFields($expect, json_decode($response->getContent()));
	}

	public function testUpdateFailValidationReturnsError()
	{
		$this->setupTestRoles();
		$expects = $this->getTestRoles();
		// Try to change role name to already existing name
		$response = $this->call('PUT', 'api/role/'. $expects[1]['id'], array(
			'name' => $expects[2]['name']
		));
		$response = json_decode($response->getContent());
		$this->assertResponseStatus(401);
		$this->assertNotEmpty($response->errors->name);
	}

	public function testDestroy()
	{
		$this->setupTestRoles();
		$expect = $this->getTestRoles(1);
		$response = $this->call('DELETE', 'api/role/'. $expect['id']);
		$response = json_decode($response->getContent());
		// @todo: Determine a common response to use here
		$this->assertEquals('OK', $response->success);
		$id = DB::table('roles')->where('id', $expect['id'])->pluck('id');
		$this->assertEmpty($id);
	}

}