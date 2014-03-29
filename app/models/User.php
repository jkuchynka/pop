<?php

use Zizaco\Confide\ConfideUser;
use Zizaco\Entrust\HasRole;

class User extends ConfideUser {
  use HasRole;

  public $autoPurgeRedundantAttributes = true;

 	public static $rules = array(
	  'username' => 'required|alpha_dash|unique:users',
	  'email' => 'required|email|unique:users',
	  'password' => 'required|min:4|confirmed',
    'password_confirmation' => 'min:4',
	);

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'password_confirmation', 'confirmation_code');

	public function image()
	{
		return $this->hasOne('Upload', 'user_id', 'id')->where('uploads.upload_type', 'userimage');
	}

	/**
	 * Get the unique identifier for the user.
	 *
	 * @return mixed
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 *
	 * @return string
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 *
	 * @return string
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

	/**
	 * Save roles for this user
	 * @param  array $roles Role IDs
	 */
	public function saveRoles($roles) {
		if ( ! empty($roles)) {
			$save = array();
			foreach ($roles as $role) {
				$save[] = $role['id'];
			}
			$this->roles()->sync($save);
		} else {
			$this->roles()->detach();
		}
	}

}
