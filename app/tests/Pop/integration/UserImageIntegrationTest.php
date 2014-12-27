<?php

use Woodling\Woodling;

class UserImageIntegrationTest extends TestCase {

    // ========= UPDATE ============

    // UPDATE - as authed

    public function testAuthedUpdateOwnUserImageWithNoExistingImageWithImageID()
    {
        $user = $this->helperCreateUserAndLogin();
        $upload = Woodling::saved('Upload', [ 'user_id' => $user->id ]);
        $this->assertNotEmpty($upload->id);
        $response = $this->call('PUT', '/api/users/'. $user->id, [ 'image' => $upload->id ]);
        $data = $this->assertResponse($response);
        $this->assertEquals($upload->id, $data->image->id);
    }

    public function testAuthedUpdateOwnUserImageWithExistingImage()
    {
        $user = $this->helperCreateUserAndLogin();
        $upload = Woodling::saved('Upload', [ 'user_id' => $user->id ]);
        $user->image = $upload->id;
        $user->updateUniques();
        $uploadNew = Woodling::saved('Upload', [ 'user_id' => $user->id ]);
        $this->assertNotEmpty($uploadNew->id);
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'image' => $uploadNew->toArray() ]);
        $data = $this->assertResponse($response);
        $this->assertEquals($uploadNew->id, $data->image->id);
    }

    public function testAuthedUpdateOwnUserImageWithExistingImageSetToEmpty()
    {
        $user = $this->helperCreateUserAndLogin();
        $upload = Woodling::saved('Upload', [ 'user_id' => $user->id ]);
        $user->image = $upload->id;
        $user->updateUniques();
        $response = $this->call('PUT', '/api/users/' . $user->id, [ 'image' => null ]);
        $data = $this->assertResponse($response);
        $this->assertEmpty($data->image);
    }

}
