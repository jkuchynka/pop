<?php namespace Pop;

use Confide;
use Lang;
use User;

class AuthController extends \BaseController {
  
  /**
   * Attempt to log a user in
   */
  public function store()
  {
    $input = [
      'email'    => \Input::get('email'), // May be the username too
      'username' => \Input::get('email'), // so we have to pass both
      'password' => \Input::get('password'),
      'remember' => \Input::get('remember'),
    ];

    if (Confide::logAttempt($input, \Config::get('confide::signup_confirm'))) {
      // Success
      return $this->show('current');
    } else {
      $user = new User;

      // Check if there was too many login attempts
      if (Confide::isThrottled($input)) {
        $errMsg = Lang::get('confide::confide.alerts.too_many_attempts');
      } elseif ($user->checkUserExists($input) && ! $user->isConfirmed($input)) {
        $errMsg = Lang::get('confide::confide.alerts.not_confirmed');
      } else {
        $errMsg = Lang::get('confide::confide.alerts.wrong_credentials');
      }

      return $this->responseError($errMsg);
    }
  }

  /**
   * Show the currently logged in (or not) user
   */
  public function show($id)
  {
    if ($user = \Confide::user()) {
      $ctrl = new UserController;
      return $ctrl->show($user->id);
    }
    return [
      'id' => null,
      'username' => 'guest'
    ];
  }

  /**
   * Log the user out
   */
  public function destroy()
  {
    Confide::logout();
    return ['success' => 'OK'];
  }

}