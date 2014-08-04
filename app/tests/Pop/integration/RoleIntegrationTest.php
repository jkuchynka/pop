<?php

use Woodling\Woodling;

class RoleIntegrationTest extends TestCase {

	public function testGetRoles()
	{
		$roles = Woodling::savedList('Role', 5);
		$response = $this->call('GET', '/api/roles');
		$data = $this->assertResponse($response);
		foreach ($data as $key => $role) {
			$this->assertModel($roles[$key], $role);
		}
	}

	public function testShowReturnsRoleRecord()
	{
		$roles = Woodling::savedList('Role', 5);
		$response = $this->call('GET', '/api/roles/'. $roles[2]->id);
		$data = $this->assertResponse($response);
		$this->assertModel($roles[2], $data);
	}

	public function testShowNonExistentRoleReturnsError()
	{
		$response = $this->call('GET', '/api/roles/999');
		$data = $this->assertResponse($response, true);
		$this->assertContains('found', $data->errors[0]);
	}

	public function testStoreNewRoleReturnsRoleObject()
	{
		$role = Woodling::retrieve('Role');
		$response = $this->call('POST', '/api/roles', $role->toArray());
		$data = $this->assertResponse($response);
		$role->id = $data->id;
		$this->assertModel($role, $data);
	}

	public function testStoreExistingRoleReturnsError()
	{
		$role = Woodling::saved('Role');
		$response = $this->call('POST', '/api/roles', [
			'name' => $role->name
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('taken', $data->errors[0]);
	}

	public function testUpdateRole()
	{
		$role = Woodling::saved('Role');
		$response = $this->call('PUT', '/api/roles/'. $role->id, [
			'name' => 'foobar'
		]);
		$role->name = 'foobar';
		$data = $this->assertResponse($response);
		$this->assertModel($role, $data);
	}

	public function testUpdateExistingRoleReturnsError()
	{
		$roles = Woodling::savedList('Role', 3);
		$response = $this->call('PUT', '/api/roles/'. $roles[2]->id, [
			'name' => $roles[1]->name
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('taken', $data->errors[0]);
	}

	public function testDeleteRole()
	{
		$role = Woodling::saved('Role');
		$response = $this->call('DELETE', '/api/roles/'. $role->id);
		$data = $this->assertResponse($response);
		$id = DB::table('roles')->where('id', $role->id)->pluck('id');
		$this->assertEmpty($id);
	}

}
