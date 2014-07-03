<?php namespace Pop;

use Confide;
use DB;
use Input;
use User;

use Jbizzay\Magma\Magma;

class UserController extends \BaseController {

  /**
   * Get a list of user records
   */
  public function index()
  {
    // @todo: Access check
    return Magma::query('User');
  }

  /**
   * Get a user record
   */
  public function show($id)
  {
    // @todo: Access check
    return Magma::find('User', $id);
  }

  /**
   * Stores new account
   */
  public function store()
  {
    // @todo: Access check
    return Magma::store('User', [
      'confirmation_code' => md5( uniqid(mt_rand(), true) )
    ]);
  }

  /**
   * Update user record
   */
  public function update($id)
  {
    // @todo: Access check
    return Magma::update('User', $id, [], function ($user) {
      // Attach any roles
      if (Input::has('roles')) {
        $user->saveRoles(Input::get('roles'));
      }
      // Save user image
      $all = Input::all();
      if (array_key_exists('image', $all)) {
        $image = Input::get('image');
        if ($image['id']) {
          // Delete previous userimages
          \Upload::where('user_id', $user->id)
            ->where('upload_type', 'userimage')
            ->where('id', '<>', $image['id'])
            ->delete();
          $upload = \Upload::find($image['id']);
          $upload->upload_type = 'userimage';
          $upload->update();
        } else {
          // Delete all userimages
          \Upload::where('user_id', $user->id)
            ->where('upload_type', 'userimage')
            ->delete();
        }
      }
    });
  }

  /**
   * Delete user record
   */
  public function destroy($id)
  {
    // @todo: Access check
    return Magma::destroy('User', $id, function ($user) {
      DB::delete('delete from assigned_roles where user_id = ?', array($user->id));
    });
  }

  /**
   * Attempt to confirm account with code
   */
  public function putConfirm()
  {
    if (Confide::confirm(Input::get('code'))) {
      return ['success' => 'OK'];
    } else {
      return $this->responseError("Wrong confirmation code");
    }
  }


  /**
   * Attempt to send change password link to the given email
   *
   */
  public function postForgot()
  {
    if (Confide::forgotPassword(Input::get('email'))) {
      return ['success' => 'OK'];
    }
    return $this->responseError("Invalid email");
  }

  /**
   * Attempt change password of the user
   *
   */
  public function postReset()
  {
    $input = [
      'token' => Input::get('token'),
      'password' => Input::get('password'),
      'password_confirmation' => Input::get('password_confirmation'),
    ];

    // By passing an array with the token, password and confirmation
    if (Confide::resetPassword($input)) {
      return ['success' => 'OK'];
    } else {
      if ($input['password'] != $input['password_confirmation']) {
        return $this->responseError("Passwords don't match.");
      }
      return $this->responseError("Couldn't reset password.");
    }
  }

  public function getCurrent()
  {
    if ($user = Confide::user()) {
      return $this->show($user->id);
    }
    return [
      'id' => null,
      'username' => 'guest'
    ];
  }

  /**
   * Save a user image
   */
  public function postImage($id)
  {
    $file = Input::file('file');

    $upload = new \Upload;
    // Set owner of file to passed user
    $upload->user_id = $id;
    // Set to temp for now
    $upload->upload_type = 'temp';

    try {
      $upload->process($file);
    } catch(Exception $exception){
      // Something went wrong. Log it.
      Log::error($exception);
      // Return error
      return $this->responseError($exception->getMessage());
    }

    // If it now has an id, it should have been successful.
    if ( $upload->id ) {
      return $upload;
    } else {
      return $this->responseError("Error uploading file");
    }

  }

}
