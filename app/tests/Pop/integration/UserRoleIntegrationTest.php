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

    // ========== QUERY =================

    // QUERY - as unauthed

    public function testUnauthedQueryUsersRolesNotShown()
    {
        Woodling::savedList('User', 3);
        $response = $this->call('GET', '/api/users', [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertObjectNotHasAttribute('roles', $data[0]);
    }

    // QUERY - as authed

    public function testAuthedQueryUsersRolesEmptyUnlessOwner()
    {
        $users = Woodling::savedList('User', 3);
        $roles = Woodling::savedList('Role', 3);
        foreach ($users as $user) {
            $this->helperAttachUserRoles($user, $roles);
        }
        $user = $this->helperCreateUserAndLogin();
        $this->helperAttachUserRoles($user, $roles);
        $response = $this->call('GET', '/api/users', [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        foreach ($data as $retUser) {
            if ($retUser->id == $user->id) {
                $this->assertObjectHasAttribute('roles', $retUser);
                $this->assertEquals(3, count($retUser->roles));
            } else {
                $this->assertObjectNotHasAttribute('roles', $retUser);
            }
        }
    }

    // QUERY - as admin

    public function testAdminQueryUsersWithRoles()
    {
        $users = Woodling::savedList('User', 3);
        $roles = Woodling::savedList('Role', 3);
        foreach ($users as $user) {
            $this->helperAttachUserRoles($user, $roles);
        }
        $user = $this->helperCreateUserAndLogin('admin');
        $response = $this->call('GET', '/api/users', [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertEquals(3, count($data[0]->roles));
    }


    // =========== CREATE ==================

    // CREATE - as unauthed

    public function testUnauthedCreateUserRolesNotAllowed()
    {
        $user = Woodling::retrieve('User');
        $params = $user->toArray();
        $params['password'] = $params['password_confirmation'] = 'password';
        $params['roles'] = Woodling::savedList('Role', 3);
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response);
        $this->assertNotEmpty($data->id);
        $ret = DB::table('assigned_roles')->where('user_id', $data->id)->get();
        $this->assertEquals(0, count($ret));
    }

    // CREATE - as admin

    public function testAdminCreateUserRoles()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $user = Woodling::retrieve('User');
        $params = $user->toArray();
        $params['password'] = $params['password_confirmation'] = 'password';
        $params['roles'] = Woodling::savedList('Role', 3);
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response);
        $ret = DB::table('assigned_roles')->where('user_id', $data->id)->get();
        $this->assertEquals(3, count($ret));
        $this->assertEquals(3, count($data->roles));
    }

    // =========== READ ====================

    // READ - as unauthed

    public function testUnauthedGetOtherUserRolesReturnsEmpty()
    {
        $user = Woodling::saved('User');
        $this->helperAttachUserRoles($user, Woodling::savedList('Role', 3));
        $response = $this->call('GET', '/api/users/' . $user->id, [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertObjectNotHasAttribute('roles', $data);
    }

    public function testUnauthedReadOtherUserStatusNotAllowed()
    {
        $user = Woodling::saved('User');
        $response = $this->call('GET', '/api/users/' . $user->id, [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertObjectNotHasAttribute('status', $data);
    }

    // READ - as authed

    public function testAuthedGetUserRoles()
    {
        $user = $this->helperCreateUserAndLogin();
        $this->helperAttachUserRoles($user, Woodling::savedList('Role', 3));
        $roles = Woodling::savedList('Role', 3);
        $this->helperAttachUserRoles($user, $roles);
        $response = $this->call('GET', '/api/users/' . $user->id, [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
        $this->assertUserHasRoles($data, $roles);
    }

    public function testAuthedGetOtherUserRolesReturnsEmpty()
    {
        $user = $this->helperCreateUserAndLogin();
        $otherUser = Woodling::saved('User');
        $this->helperAttachUserRoles($otherUser, Woodling::savedList('Role', 3));
        $response = $this->call('GET', '/api/users/' . $otherUser->id, [ 'with' => 'roles' ]);
        $data = $this->assertResponse($response);
        $this->assertObjectNotHasAttribute('roles', $data);
    }

    // =========== UPDATE ==================

    // UPDATE - as unauthed

    public function testUnauthedUpdateOtherUsersRoleDenied()
    {
        $user = Woodling::saved('User');
        $roles = Woodling::savedList('Role', 3);
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => $roles ]);
        $this->assertResponse($response, 401);
        $ret = DB::table('assigned_roles')->where('user_id', $user->id)->get();
        $this->assertEquals(0, count($ret));
    }

    // UPDATE - as authed

    public function testAuthedUpdateUnableToUpdateRoles()
    {
        $roles = Woodling::savedList('Role', 3);
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => $roles ]);
        $data = $this->assertResponse($response);
        $this->assertTrue(empty($data->roles));
    }

    // UPDATE - as admin

    public function testAdminUpdateUserRoles()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $roles = Woodling::savedList('Role', 3);
        $user = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => $roles ]);
        // Update and set to 1 role
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => [$roles[1]]] );
        $data = $this->assertResponse($response);
        $this->assertEquals($roles[1]->id, $data->roles[0]->id);
    }

    public function testAdminUpdateClearUserRoles()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $roles = Woodling::savedList('Role', 3);
        $user = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => $roles ]);
        // Update and clear roles
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => [] ]);
        $data = $this->assertResponse($response);
        $this->assertObjectHasAttribute('roles', $data);
        $this->assertEmpty($data->roles);
    }

    // ============ DELETE ===============

    // DELETE - as admin

    public function testAdminDeleteUserCleansAssignedRoles()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $user = Woodling::saved('User');
        $roles = Woodling::savedList('Role', 3);
        $this->call('PUT', '/api/users/' . $user->id, [ 'roles' => $roles ]);
        $response = $this->call('DELETE', '/api/users/' . $user->id);
        $assigned = DB::table('assigned_roles')->where('user_id', $user->id)->get();
        $this->assertEquals(0, count($assigned));
    }

}
