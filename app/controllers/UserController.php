<?php

class UserController extends BaseController {

  /**
   * Get a list of user records
   */
  public function getIndex()
  {
    $users = User::with('roles')->get();
    return $users;
  }

  /**
   * Get a user record
   */
  public function getShow($id)
  {
    if (is_numeric($id)) {
      return User::with('roles')->find($id);
    } else {
      return User::with('roles')->where('username', $id)->first();
    }
  }

  /**
   * Stores new account
   *
   */
  public function postIndex()
  {
    $user = new User;

    $user->username = Input::get( 'username' );
    $user->email = Input::get( 'email' );
    $user->password = Input::get( 'password' );

    // The password confirmation will be removed from model
    // before saving. This field will be used in Ardent's
    // auto validation.
    $user->password_confirmation = Input::get( 'password_confirmation' );

    // Save if valid. Password field will be hashed before save
    $user->save();

    if ( $user->id )
    {
      // Return newly created user object
      return $this->show($user->id);
    }
    else
    {
      return Response::json(array(
        $user->errors()
      ), 400);
    }
  }

  /**
   * Attempt to do login
   *
   */
  public function postLogin()
  {
    $input = array(
      'email'    => Input::get( 'email' ), // May be the username too
      'username' => Input::get( 'email' ), // so we have to pass both
      'password' => Input::get( 'password' ),
      'remember' => Input::get( 'remember' ),
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
   *
   * @param  string  $code
   */
  public function getConfirm( $code )
  {
      if ( Confide::confirm( $code ) )
      {
          $notice_msg = Lang::get('confide::confide.alerts.confirmation');
                      return Redirect::to('user/login')
                          ->with( 'notice', $notice_msg );
      }
      else
      {
          $error_msg = Lang::get('confide::confide.alerts.wrong_confirmation');
                      return Redirect::to('user/login')
                          ->with( 'error', $error_msg );
      }
  }


  /**
   * Attempt to send change password link to the given email
   *
   */
  public function postForgot()
  {
    if( Confide::forgotPassword( Input::get( 'email' ) ) )
    {
      $notice_msg = Lang::get('confide::confide.alerts.password_forgot');
      return array(
        $notice_msg
      );
    }
    else
    {
      $error_msg = Lang::get('confide::confide.alerts.wrong_password_forgot');
      return Response::json(array(
        'error' => $error_msg
      ), 400);
    }
  }

  /**
   * Shows the change password form with the given token
   *
   */
  public function getReset( $token )
  {
      return View::make(Config::get('confide::reset_password_form'))
              ->with('token', $token);
  }

  /**
   * Attempt change password of the user
   *
   */
  public function postReset()
  {
    $input = array(
      'token'=>Input::get( 'token' ),
      'password'=>Input::get( 'password' ),
      'password_confirmation'=>Input::get( 'password_confirmation' ),
    );

    // By passing an array with the token, password and confirmation
    if( Confide::resetPassword( $input ) )
    {
      $notice_msg = Lang::get('confide::confide.alerts.password_reset');
      return array(
        $notice_msg
      );
    }
    else
    {
      $error_msg = Lang::get('confide::confide.alerts.wrong_password_reset');
      return Response::json(array(
        'error' => $error_msg
      ), 400);
    }
  }

  public function getCurrent()
  {
    if ($user = Confide::user()) {
      return $this->getShow($user->id);
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
    return array();
  }

}
