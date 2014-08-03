<?php

use Zizaco\Confide\ConfideUser;
use Zizaco\Entrust\HasRole;

class User extends ConfideUser {
	use HasRole;

	public $autoHydrateEntityFromInput = true;

	public $forceEntityHydrationFromInput = true;

	public $autoPurgeRedundantAttributes = true;

	/**
	 * Properties that can be filled through Input or mass-assigned
	 */
	protected $fillable = [
		'username',
		'email',
		'password',
		'password_confirmation'
	];

	/**
	 * Ardent's validation rules
	 */
 	public static $rules = [
	  	'username' => 'required|alpha_dash|unique:users',
	  	'email' => 'required|email|unique:users',
	  	'password' => 'required|min:4|confirmed',
    	'password_confirmation' => 'min:4',
	];


	/**
	 * The database table used by the model.
	 */
	protected $table = 'users';

	/**
	 * The attributes excluded from the model's JSON form.
	 */
	protected $hidden = ['password', 'password_confirmation', 'confirmation_code'];

	public function assertions()
	{
		return [
			'equals' => [
				'id', 'username', 'email'
			],
			'not_set' => [
				'password', 'password_confirmation', 'confirmation_code'
			],
			'not_empty' => [
				'created_at', 'updated_at'
			]
		];
	}

	public function image()
	{
		return $this->hasOne('Upload', 'user_id', 'id')->where('uploads.upload_type', 'userimage');
	}

	/**
	 * Get the unique identifier for the user.
	 */
	public function getAuthIdentifier()
	{
		return $this->getKey();
	}

	/**
	 * Get the password for the user.
	 */
	public function getAuthPassword()
	{
		return $this->password;
	}

	/**
	 * Get the e-mail address where password reminders are sent.
	 */
	public function getReminderEmail()
	{
		return $this->email;
	}

	/**
	 * Save roles for this user
	 * @param array $roles Role IDs
	 */
	public function saveRoles($roles) 
	{
		if ( ! empty($roles)) {
			$save = [];
			foreach ($roles as $role) {
				$save[] = $role['id'];
			}
			$this->roles()->sync($save);
		} else {
			$this->roles()->detach();
		}
	}

}
