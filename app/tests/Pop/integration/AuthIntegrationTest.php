<?php

use Woodling\Woodling;

class AuthIntegrationTest extends TestCase {

    public function testLoginSuccessReturnsUserObject()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/auth', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
    }

    // Should be able to login with username or password
    public function testLoginWithUsername()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/auth', [
            'email' => $user->username,
            'password' => 'password'
        ]);
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
    }

    public function testLoginFailureReturnsFailResponse()
    {
        $response = $this->call('POST', '/api/auth', [
            'email' => 'foo@bar.net',
            'password' => 'failme'
        ]);
        $this->assertResponse($response, 400);
    }

    public function testGetCurrentLoggedInUserReturnsUserObject()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/auth', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        $response = $this->call('GET', '/api/auth/current');
        $data = $this->assertResponse($response);
        $this->assertModel($user, $data);
    }

    public function testLogoutCurrentUserReturnsGuestUserObject()
    {
        $user = Woodling::saved('User');
        $response = $this->call('POST', '/api/auth', [
            'email' => $user->email,
            'password' => 'password'
        ]);
        $response = $this->call('DELETE', '/api/auth/me');
        $data = $this->assertResponse($response);
        $response = $this->call('GET', '/api/auth/me');
        $data = $this->assertResponse($response);
        $this->assertEmpty($data->id);
        $this->assertEquals('guest', $data->username);
    }

}