<?php

use Zizaco\Entrust\HasRole;
use Zizaco\Confide\ConfideUser;
use LaravelBook\Ardent\Ardent;

class User extends ConfideUser {
	use HasRole;

	public $autoHydrateEntityFromInput = true;

	public $forceEntityHydrationFromInput = true;

	public $autoPurgeRedundantAttributes = true;

	public static $assertions = [
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
	 * The attributes excluded from the model's JSON form.
	 */
	protected $hidden = ['password', 'password_confirmation', 'confirmation_code', 'remember_token'];

	public static $relationsData = [
		'image' => [self::HAS_ONE, 'Upload'],
		'roles' => [self::BELONGS_TO_MANY, 'Role', 'table' => 'assigned_roles']
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

/*
	public function image()
	{
		return $this->hasOne('Upload', 'user_id', 'id')->where('uploads.upload_type', 'userimage');
	}
*/

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

/*
	public function beforeSave($forced = true)
	{
		echo ' in test: '. $GLOBALS['PHPUNIT_TEST'] .', before save '. PHP_EOL;
		parent::beforeSave($forced);
	}


	public static function boot()
	{
		parent::boot();

		static::saving(function ($content) {
			
      		// beforeSave() not always getting called?
      		// set confirmation code for new users
      		if ( ! $content->id && ! $content->confirmation_code) {
      			$content->confirmation_code = md5( uniqid(mt_rand(), true) );
      		}
      		return true;
    	});

	}
	*/

}
