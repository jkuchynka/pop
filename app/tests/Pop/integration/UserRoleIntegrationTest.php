<?php

use Woodling\Woodling;

class UserRoleIntegrationTest extends TestCase {

  protected function assertUserHasRoles($user, $roles)
  {
    $uRoles = [];
    foreach ($user->roles as $role) {
      $uRoles[$role->id] = $role->name;
    }
    foreach ($roles as $role) {
      if ( ! isset($uRoles[$role->id])) {
        $this->fail("User record missing expected role: ". $role->name);
      } else {
        $this->assertEquals($role->name, $uRoles[$role->id], "User record missing expected role: ". $role->name);
      }
    }
  }

  public function testGetUsersRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        [$role->id, $user->id]);
    }
    // Call get users, with magma query
    $response = $this->call('GET', '/api/users?with[]=roles,image');
    $data = $this->assertResponse($response);
    $this->assertModel($user, $data[0]);
    $this->assertUserHasRoles($data[0], $roles);
  }

  public function testGetUserRecordRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        array($role->id, $user->id));
    }
    // Call get users, with magma query
    $response = $this->call('GET', '/api/users/'. $user->id .'?with[]=roles,image');
    $data = $this->assertResponse($response);
    $this->assertModel($user, $data);
    $this->assertUserHasRoles($data, $roles);
  }

  public function testAttachUserToRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    $data = $user->toArray();
    // Add roles to data to send to update
    $data['roles'] = [
      $roles[0]->id,
      $roles[1]->id,
      $roles[2]->id
    ];
    $response = $this->call('PUT', '/api/users/'. $user->id, $data);
    $data = $this->assertResponse($response);
    $this->assertModel($user, $data);
    $this->assertUserHasRoles($data, $roles);
  }

  public function testDetachUserFromRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        array($role->id, $user->id));
    }
    $data = $user->toArray();
    // With an empty roles array, all roles should be removed
    $data['roles'] = [];
    $response = $this->call('PUT', '/api/users/'. $user->id, $data);
    $data = $this->assertResponse($response);
    $this->assertModel($user, $data);
    $this->assertEmpty($data->roles);
  }

  public function testDeleteUserWithRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        [$role->id, $user->id]);
    }
    $response = $this->call('DELETE', '/api/users/'. $user->id);
    $this->assertResponse($response);
  }

}
