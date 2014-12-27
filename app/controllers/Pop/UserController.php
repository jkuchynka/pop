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
        return Magma::query('User');
    }

    /**
     * Get a user record
     */
    public function show($id)
    {
        return Magma::read('User', $id);
    }

    /**
     * Stores new account
     */
    public function store()
    {
        return Magma::create('User');
    }

    /**
     * Update user record
     */
    public function update($id)
    {
        return Magma::update('User', $id);
    }

    /**
     * Delete user record
     */
    public function destroy($id)
    {
        return Magma::delete('User', $id);
    }

    /**
     * Attempt to confirm account with code
     */
    public function putConfirm()
    {
        $code = Input::get('code');
        $user = User::where('confirmation_code', $code)->first();
        if ($user && Confide::confirm($code)) {
            $user->confirmed = true;
            $user->updateUniques();
            \Session::forget('guest');
            \Auth::login($user);
            return $user;
        } else {
            return $this->responseError("Wrong confirmation code");
        }
    }

    /**
     * Determine if valid reset token
     */
    public function getResetToken()
    {
        $exists = DB::table('password_reminders')
            ->where('token', Input::get('token'))
            ->pluck('email');
        if ($exists) {
            return ['success' => 'OK'];
        }
        return $this->responseError("Invalid reset token.");
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
     * Handles the actual upload
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
