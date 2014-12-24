<?php

use Woodling\Woodling;

class UserIntegrationTest extends TestCase {

    public function testGetUsers()
    {
        $users = Woodling::savedList('User', 5);
        $response = $this->call('GET', '/api/users');
        $data = $this->assertResponse($response);
        foreach ($users as $key => $user) {
            $this->assertModel($user, $data[$key]);
        }
    }

    // =========== CREATE ==================

    // CREATE - as unauthed

    public function testUnauthPostNewUser()
    {
        $user = Woodling::retrieve('User');
        $params = $user->toArray();
        $params['password'] = 'password';
        $params['password_confirmation'] = 'password';
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response);
        $user->id = $data->id;
        $this->assertModel($user, $data);
    }

    public function testUnauthPostNewUserInvalidPassword()
    {
        // Passwords don't match
        $user = Woodling::retrieve('User');
        $params = $user->toArray();
        $params['password'] = 'password';
        $params['password_confirmation'] = 'other_password';
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response, 403);
    }

    public function testUnauthPostNewUserEmailExistsReturnsError()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/users', [
            'email' => $user->email,
            'username' => 'foobar123',
            'password' => 'password',
            'password_confirmation' => 'password'
        ]);
        $data = $this->assertResponse($response, 403);
    }

    // CREATE - as authed

    public function testAuthedPostNewUserReturnError()
    {
        $user = $this->helperCreateUserAndLogin();
        $newUser = Woodling::retrieve('User');
        $params = $newUser->toArray();
        $params['password'] = 'password';
        $params['password_confirmation'] = 'password';
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response, 401);
    }


    // CREATE - as admin

    public function testAdminPostNewUser()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $newUser = Woodling::retrieve('User');
        $params = $newUser->toArray();
        $params['password'] = 'password';
        $params['password_confirmation'] = 'password';
        $response = $this->call('POST', '/api/users', $params);
        $data = $this->assertResponse($response);
        $newUser->id = $data->id;
        $this->assertModel($newUser, $data);
    }


    // ======== READ ================

    // READ - as authed user

    public function testAuthedShowUserWithRelations()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('GET', '/api/users/'. $user->id, [
            'with[]' => 'image', 'with[]' => 'roles' ]);
        $this->assertResponse($response);
    }

    public function testAuthedShowNonExistantUserReturnsError()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('GET', '/api/users/99999');
        $this->assertResponse($response, 403);
    }


    // ======== UPDATE ==================

    // UPDATE - as unauthed user

    public function testUnauthUpdateNonExistUserReturnsError()
    {
        $response = $this->call('PUT', '/api/users/9999', [ 'email' => 'foobar@mail.net' ]);
        $this->assertResponse($response, 403);
    }

    public function testUnauthUpdateUserRecordReturnsError()
    {
        $user = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'email' => 'foobar@mail.net' ]);
        $this->assertResponse($response, 401);
    }

    // UPDATE - as authed user

    public function testAuthedUpdateOtherUserReturnsError()
    {
        $current = $this->helperCreateUserAndLogin();
        $user = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/'. $user->id);
        $this->assertResponse($response, 401);
    }

    public function testAuthedUpdateOwnUserPasswordAndLogin()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'password' => 'Pass1234', 'password_confirmation' => 'Pass1234' ]);
        $this->assertResponse($response);
        $response = $this->call('POST', '/api/auth', [ 'username' => $user->email, 'password' => 'Pass1234' ]);
        $this->assertResponse($response);
    }

    public function testAuthedUpdateOwnUserEmailAlreadyExistsReturnsError()
    {
        $user = $this->helperCreateUserAndLogin();
        $otherUser = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'email' => $otherUser->email ]);
        $data = $this->assertResponse($response, 403);
    }

    public function testAuthedUpdateOwnUserUsernameAlreadyExistsReturnsError()
    {
        $user = $this->helperCreateUserAndLogin();
        $otherUser = Woodling::saved('User');
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'username' => $otherUser->username ]);
        $data = $this->assertResponse($response, 403);
    }

    public function testAuthedUpdateUserStatusNotAllowed()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'status' => 0 ]);
        $this->assertResponse($response);
        $this->assertEquals(1, DB::table('users')->where('id', $user->id)->pluck('status'));
    }

    public function testAuthedUpdateUserImageRecord()
    {
        $user = $this->helperCreateUserAndLogin();
        $upload = Woodling::saved('Upload', [ 'user_id' => $user->id ]);
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'image' => $upload->toArray() ]);
        $data = $this->assertResponse($response);
        $this->assertEquals($upload->id, $data->image['id']);
    }

    public function testAuthedUpdateUserPurge()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('PUT', '/api/users/' . $user->id, [ '/api/users/' . $user->id => '']);
        $this->assertResponse($response);
    }

    // UPDATE - as admin user

    public function testAdminUpdateUser()
    {
        $admin = $this->helperCreateUserAndLogin('admin');
        $user = Woodling::saved('User');
        $user->email = 'someotheremail@mail.net';
        $user->status = 0;
        $params = $user->toArray();
        $response = $this->call('PUT', '/api/users/'. $user->id, $params);
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
    }

    // =========== DELETE =================

    // DELETE - as unauthed user

    public function testUnauthedDeleteUserReturnsError()
    {
        $user = Woodling::saved('User');
        $response = $this->call('DELETE', '/api/users/'. $user->id);
        $this->assertResponse($response, 401);
    }

    // DELETE - as authed user

    public function testAuthedDeleteOwnUserReturnsSuccess()
    {
        $user = $this->helperCreateUserAndLogin();
        $response = $this->call('DELETE', '/api/users/'. $user->id);
        $data = $this->assertResponse($response);
        $id = DB::table('users')->where('id', $user->id)->pluck('id');
        $this->assertEmpty($id);
    }

    public function testAuthedDeleteOtherUserReturnsError()
    {
        $user = $this->helperCreateUserAndLogin();
        $otherUser = Woodling::saved('User');
        $response = $this->call('DELETE', '/api/users/' . $otherUser->id);
        $this->assertResponse($response, 401);
    }

    // DELETE - as admin user

    public function testAdminDeleteOtherUser()
    {
        $user = $this->helperCreateUserAndLogin('admin');
        $otherUser = Woodling::saved('User');
        $response = $this->call('DELETE', '/api/users/'. $otherUser->id);
        $data = $this->assertResponse($response);
        $id = DB::table('users')->where('id', $otherUser->id)->pluck('id');
        $this->assertEmpty($id);
    }


    // ========= CONFIRM ====================

    public function testConfirmUserWithConfirmationCode()
    {
        $user = Woodling::saved('User', [ 'confirmed' => 0 ]);
        $code = DB::table('users')->where('id', $user->id)->pluck('confirmation_code');
        $response = $this->call('PUT', '/api/users/confirm', [ 'code' => $code ]);
        $data = $this->assertResponse($response);
        $confirmed = DB::table('users')->where('id', $user->id)->pluck('confirmed');
        $this->assertEquals(1, $confirmed);
    }

    public function testConfirmUserWithInvalidConfirmationCode()
    {
        $user = Woodling::saved('User', [ 'confirmed' => 0 ]);
        $response = $this->call('PUT', '/api/users/confirm', [ 'code' => '9999' ]);
        $data = $this->assertResponse($response, 400);
        $this->assertContains('code', $data->errors[0]);
        $confirmed = DB::table('users')->where('id', $user->id)->pluck('confirmed');
        $this->assertEquals(0, $confirmed);
    }

    // ========= RESET ======================

    public function testForgotPasswordResetPasswordLogin()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/users/forgot', [
            'email' => $user->email
        ]);
        $data = $this->assertResponse($response);
        $token = DB::table('password_reminders')->where('email', $user->email)->pluck('token');
        $response = $this->call('POST', '/api/users/reset', [
            'token' => $token,
            'password' => 'newpassword2',
            'password_confirmation' => 'newpassword2'
        ]);
        $this->assertResponse($response);
        $response = $this->call('POST', '/api/auth', [
            'username' => $user->email,
            'password' => 'newpassword2'
        ]);
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
    }

    public function testForgotPasswordInvalidEmail()
    {
        $response = $this->call('POST', '/api/users/forgot', [
            'email' => 'foobar@mail.net'
        ]);
        $data = $this->assertResponse($response, 400);
    }

    public function testResetPasswordInvalidToken()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/users/forgot', [
            'email' => $user->email
        ]);
        $data = $this->assertResponse($response);
        $response = $this->call('POST', '/api/users/reset', [
            'token' => 999,
            'password' => 'newpassword',
            'password_confirmation' => 'newpassword'
        ]);
        $data = $this->assertResponse($response, 400);
    }

    public function testResetPasswordInvalidPassword()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/users/forgot', [
            'email' => $user->email
        ]);
        $data = $this->assertResponse($response);
        $token = DB::table('password_reminders')->where('email', $user->email)->pluck('token');
        $response = $this->call('POST', '/api/users/reset', [
            'token' => $token,
            'password' => 'newpassword',
            'password_confirmation' => 'foobar'
        ]);
        $data = $this->assertResponse($response, 400);
    }

}
