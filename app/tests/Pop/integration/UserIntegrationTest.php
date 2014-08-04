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

	public function testStoreNewUserReturnsUserObject()
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

	public function testStoreNewUserValidationFailure()
	{
		// Passwords don't match
		$response = $this->call('POST', '/api/users', [
			'email' => 'foo@bar.net',
			'username' => 'foobar',
			'password' => 'alpha',
			'password_confirmation' => 'beta'
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('password', $data->errors[0]);
	}

	public function testStoreNewUserEmailExists()
	{
		$user = Woodling::saved('User');
		$response = $this->call('POST', '/api/users', [
			'email' => $user->email,
			'username' => 'foobar123',
			'password' => 'password',
			'password_confirmation' => 'password'
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('taken', $data->errors[0]);
	}

	public function testShowReturnsUserRecord()
	{
		$user = Woodling::saved('User');
		$response = $this->call('GET', '/api/users/'. $user->id);
		$data = $this->assertResponse($response);
		$this->assertModel($user, $data);
	}

	public function testShowNonExistantUserReturnsError()
	{
		$response = $this->call('GET', '/api/users/99999');
		$data = $this->assertResponse($response, true);
		$this->assertContains('found', $data->errors[0]);
	}

	public function testUpdateUserRecordReturnsUserObject()
	{
		$user = Woodling::saved('User');
		$changed = Woodling::retrieve('User', [
			'id' => $user->id
		]);
		$response = $this->call('PUT', '/api/users/'. $user->id, $changed->toArray());
		$data = $this->assertResponse($response);
		$this->assertModel($changed, $data);
	}

	public function testUpdateUserPassword()
	{
		$user = Woodling::saved('User');
		$params = $user->toArray();
		$params['password'] = 'foobar123';
		$params['password_confirmation'] = 'foobar123';
		$response = $this->call('PUT', '/api/users/'. $user->id, $params);
		$this->assertResponse($response);
		$response = $this->call('POST', '/api/auth', [
			'email' => $user->email,
			'password' => 'foobar123'
		]);
		$data = $this->assertResponse($response);
		$this->assertModel($user, $data);
	}

	public function testUpdateNonExistantUserReturnsError()
	{
		$response = $this->call('PUT', '/api/users/9999', [
			'email' => 'foobar@mail.net'
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('found', $data->errors[0]);
	}

	public function testUpdateEmailAlreadyExistsReturnsError()
	{
		$users = Woodling::savedList('User', 2);
		$response = $this->call('PUT', '/api/users/'. $users[1]->id, [
			'email' => $users[0]->email,
			'username' => $users[1]->username
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('taken', $data->errors[0]);
	}

	public function testUpdateUsernameAlreadyExistsReturnsError()
	{
		$users = Woodling::savedList('User', 2);
		$response = $this->call('PUT', '/api/users/'. $users[1]->id, [
			'email' => $users[1]->email,
			'username' => $users[0]->username
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('taken', $data->errors[0]);
	}

	public function testDeleteUserReturnsSuccess()
	{
		$user = Woodling::saved('User');
		$response = $this->call('DELETE', '/api/users/'. $user->id);
		$data = $this->assertResponse($response);
		$id = DB::table('users')->where('id', $user->id)->pluck('id');
		$this->assertEmpty($id);
	}

	public function testConfirmUserWithConfirmationCode()
	{
		$user = Woodling::saved('User', [
			'confirmed' => 0
		]);
		$code = DB::table('users')->where('id', $user->id)->pluck('confirmation_code');
		$response = $this->call('PUT', '/api/users/confirm', [
			'code' => $code
		]);
		$data = $this->assertResponse($response);
		$confirmed = DB::table('users')->where('id', $user->id)->pluck('confirmed');
		$this->assertEquals(1, $confirmed);
	}

	public function testConfirmUserWithInvalidConfirmationCode()
	{
		$user = Woodling::saved('User', [
			'confirmed' => 0
		]);
		$response = $this->call('PUT', '/api/users/confirm', [
			'code' => '9999'
		]);
		$data = $this->assertResponse($response, true);
		$this->assertContains('code', $data->errors[0]);
		$confirmed = DB::table('users')->where('id', $user->id)->pluck('confirmed');
		$this->assertEquals(0, $confirmed);
	}

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
			'email' => $user->email,
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
		$data = $this->assertResponse($response, true);
		$this->assertContains('email', $data->errors[0]);
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
		$data = $this->assertResponse($response, true);
		$this->assertContains('reset', $data->errors[0]);
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
		$data = $this->assertResponse($response, true);
		$this->assertContains('match', $data->errors[0]);
	}

}
