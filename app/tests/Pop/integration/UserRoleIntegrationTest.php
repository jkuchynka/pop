<?php

use Woodling\Woodling;

class UserRoleIntegrationTest extends TestCase {

  protected $user;

  public function setup()
  {
    //$this->user = Woodling::saved('User');
  }

  protected function assertUserHasRoles($user, $roles)
  {
    $uRoles = array();
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

  public function testGetUsersRolesAreAttached()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    print_r($user);
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        array($role->id, $user->id));
    }
    // Call get users
    $response = $this->call('GET', '/api/users');
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data[0]);
    $this->assertUserHasRoles($data[0], $roles);
    // Role format should only have id, name
    $roles = (array) $data[0]->roles;
    foreach ($roles as $role) {
      $role = (array) $role;
      unset($role['id']);
      unset($role['name']);
      $this->assertEmpty($role);
    }
  }

  public function testGetUserRecordRolesAreAttached()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        array($role->id, $user->id));
    }
    // Call get users
    $response = $this->call('GET', '/api/users/'. $user->id);
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data);
    $this->assertUserHasRoles($data, $roles);
    // Role format should only have id, name
    $roles = (array) $data->roles;
    foreach ($roles as $role) {
      $role = (array) $role;
      unset($role['id']);
      unset($role['name']);
      $this->assertEmpty($role);
    }
  }

  public function testAttachUserToRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    $data = $user->toArray();
    // Add roles to data to send to update
    $data['roles'] = array(
      array(
        'id' => $roles[0]->id,
        'name' => $roles[0]->name,
      ),
      array(
        'id' => $roles[1]->id,
        'name' => $roles[1]->name,
      ),
      array(
        'id' => $roles[2]->id,
        'name' => $roles[2]->name
      )
    );
    $response = $this->call('PUT', '/api/users/'. $user->id, $data);
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data);
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
    $data['roles'] = array();
    $response = $this->call('PUT', '/api/users/'. $user->id, $data);
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data);
    $this->assertEmpty($data->roles);
  }

  public function testDeleteUserWithRoles()
  {
    $roles = Woodling::savedList('Role', 3);
    $user = Woodling::saved('User');
    foreach ($roles as $role) {
      DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
        array($role->id, $user->id));
    }
    $response = $this->call('DELETE', '/api/users/'. $user->id);
    $this->assertResponse($response);
  }

}
