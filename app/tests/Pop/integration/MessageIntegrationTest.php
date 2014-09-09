<?php

class MessageIntegrationTest extends TestCase {
	
	public function testContactMissingFieldsReturnsError()
	{
		$response = $this->call('POST', '/api/contact', [
			'message' => 'test 123'
		]);
		$data = $this->assertResponse($response, 400);
		$this->assertContains('required', $data->errors[0]);
	}

	public function testContact()
	{
		$response = $this->call('POST', '/api/contact', [
			'message' => 'test 123',
			'subject' => 'Subject',
			'email' => 'test@mail.net',
			'name' => 'Test User'
		]);
		$data = $this->assertResponse($response);
	}

}