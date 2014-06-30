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
    $this->assertUser($user, $data);
  }

  // Should be able to login with username or password
  public function testLoginWithUsername()
  {
    $user = Woodling::saved('User');
    $response = $this->call('POST', '/api/auth', array(
      'email' => $user->username,
      'password' => 'password'
    )); 
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data);
  }

  public function testLoginFailureReturnsFailResponse()
  {
    $response = $this->call('POST', '/api/auth', array(
      'email' => 'foo@bar.net',
      'password' => 'failme'
    ));
    $this->assertResponse($response, true);
  }

  public function testGetCurrentLoggedInUserReturnsUserObject()
  {
    $user = Woodling::saved('User');
    $response = $this->call('POST', '/api/auth', array(
      'email' => $user->email,
      'password' => 'password'
    ));
    $response = $this->call('GET', '/api/auth/current');
    $data = $this->assertResponse($response);
    $this->assertUser($user, $data);
  }

  public function testLogoutCurrentUserReturnsGuestUserObject()
  {
    $user = Woodling::saved('User');
    $response = $this->call('POST', '/api/auth', array(
      'email' => $user->email,
      'password' => 'password'
    ));
    $response = $this->call('GET', '/api/auth/logout');
    $data = $this->assertResponse($response);
    $response = $this->call('GET', '/api/auth/current');
    $data = $this->assertResponse($response);
    $this->assertEmpty($data->id);
    $this->assertEquals('guest', $data->username);
  }

}