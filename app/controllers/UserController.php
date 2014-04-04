<?php

class UserController extends BaseController {

  /**
   * Get a list of user records
   */
  public function index($id = null)
  {
    $users = User::with('roles')->with('image')->get();
    $data = $users->toArray();
    foreach ($data as &$user) {
      $roles = array();
      if ( ! empty($user['roles'])) {
        foreach ($user['roles'] as $role) {
          $roles[] = array(
            'id' => $role['id'],
            'name' => $role['name']
          );
        }
      }
      $image = array();
      if ( ! empty($user['image'])) {
        $image = array(
          'id' => $user['image']['id'],
          'uri' => str_replace('/public', '', $user['image']['path']) . $user['image']['filename']
        );
      }
      $user['roles'] = $roles;
      $user['image'] = $image;
    }
    return $data;
  }

  /**
   * Get a user record
   */
  public function show($id)
  {
    if (is_numeric($id)) {
      $user = User::with('roles')->with('image')->find($id);
    } else {
      $user = User::with('roles')->with('image')->where('username', $id)->first();
    }
    if ($user) {
      $data = $user->toArray();
      $roles = array();
      if ( ! empty($data['roles'])) {
        foreach ($data['roles'] as $role) {
          $roles[] = array(
            'id' => $role['id'],
            'name' => $role['name']
          );
        }
      }
      $data['roles'] = $roles;
      if ( ! empty($data['image'])) {
        $data['image'] = array(
          'id' => $data['image']['id'],
          'uri' => str_replace('/public', '', $data['image']['path']) . $data['image']['filename']
        );
      }
      return $data;
    }
    return $this->responseError("User not found");
  }

  /**
   * Stores new account
   */
  public function store()
  {
    $user = new User;

    $user->username = Input::get('username');
    $user->email = Input::get('email');
    $user->password = Input::get('password');
    $user->password_confirmation = Input::get('password_confirmation');
    $user->confirmation_code = md5( uniqid(mt_rand(), true) );

    // Save if valid. Password field will be hashed before save
    $user->save();

    if ($user->id) {
      // Return newly created user object
      return $this->show($user->id);
    } else {
      return $this->responseError($user->errors()->all(':message'));
    }
  }

  /**
   * Update user record
   */
  public function update($id)
  {
    $user = User::find($id);

    if ( ! $user) {
      return $this->responseError("User not found");
    }

    $user->username = Input::get('username');
    $user->email = Input::get('email');

    if (Input::get('password')) {
      $user->password = Input::get('password');
      $user->password_confirmation = Input::get('password_confirmation');
    }

    try {
      $updated = $user->updateUniques();
    }
    catch (Exception $e) {
      $updated = false;
    }

    if ($updated) {
      // Attach any roles
      if (Input::has('roles')) {
        $user->saveRoles(Input::get('roles'));
      }
      // Save user image
      if (Input::has('image')) {
        $image = Input::get('image');
        if ($image['id']) {
          $upload = Upload::find($image['id']);
          $upload->upload_type = 'userimage';
          $upload->update();
        }
      }
      return $this->show($user->id);
    }
    return $this->responseError($user->errors()->all(':message'));
  }

  /**
   * Delete user record
   */
  public function destroy($id)
  {
    $user = User::find($id);
    DB::delete('delete from assigned_roles where user_id = ?', array($id));
    if ($user->delete()) {
      return array('success' => 'OK');
    }
    return $this->responseError("Couldn't delete user");
  }

  /**
   * Attempt to do login
   */
  public function postLogin()
  {
    $input = array(
      'email'    => Input::get('email'), // May be the username too
      'username' => Input::get('email'), // so we have to pass both
      'password' => Input::get('password'),
      'remember' => Input::get('remember'),
    );

    // If you wish to only allow login from confirmed users, call logAttempt
    // with the second parameter as true.
    // logAttempt will check if the 'email' perhaps is the username.
    // Get the value from the config file instead of changing the controller
    //if ( Confide::logAttempt( $input, Config::get('confide::signup_confirm') ) )
    if ( Confide::logAttempt( $input, false ) )
    {
      // Success
      return $this->getCurrent();
    }
    else
    {
      $user = new User;

      // Check if there was too many login attempts
      if( Confide::isThrottled( $input ) )
      {
        $err_msg = Lang::get('confide::confide.alerts.too_many_attempts');
      }
      elseif( $user->checkUserExists( $input ) and ! $user->isConfirmed( $input ) )
      {
        $err_msg = Lang::get('confide::confide.alerts.not_confirmed');
      }
      else
      {
        $err_msg = Lang::get('confide::confide.alerts.wrong_credentials');
      }

      return Response::json(array(
        'error' => $err_msg
      ), 400);
    }
  }

  /**
   * Attempt to confirm account with code
   */
  public function putConfirm()
  {
    if (Confide::confirm(Input::get('code'))) {
      return array('success' => 'OK');
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
      return array('success' => 'OK');
    }
    return $this->responseError("Invalid email");
  }

  /**
   * Attempt change password of the user
   *
   */
  public function postReset()
  {
    $input = array(
      'token' => Input::get('token'),
      'password' => Input::get('password'),
      'password_confirmation' => Input::get('password_confirmation'),
    );

    // By passing an array with the token, password and confirmation
    if (Confide::resetPassword($input)) {
      return array('success' => 'OK');
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
    return array(
      'id' => null,
      'username' => 'guest'
    );
  }

  /**
   * Log the user out of the application.
   *
   */
  public function getLogout()
  {
    Confide::logout();
    return array('success' => 'OK');
  }

  /**
   * Save a user image
   */
  public function postImage($id)
  {
    $file = Input::file('file');

    $upload = new Upload;
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
      // Return user record, which should have new image attached
      return array(
        'id' => $upload->id,
        'uri' => str_replace('/public', '', $upload->path) . $upload->filename
      );
    } else {
      return $this->responseError("Error uploading file");
    }

  }

}
