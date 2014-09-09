<?php

use Zizaco\Entrust\HasRole;
use Zizaco\Confide\ConfideUser;
use LaravelBook\Ardent\Ardent;

class User extends ConfideUser {
	use HasRole;

	public $autoHydrateEntityFromInput = true;

	public $forceEntityHydrationFromInput = true;

	public $autoPurgeRedundantAttributes = true;

	/**
	 * Set the assertions to run on model attributes
	 * when run with unit tests and assertModel()
	 */
	public static $assertions = [
		'equals' => [
			'id', 'username', 'email', 'status'
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
		'password_confirmation',
		'status'
	];

	/**
	 * The attributes excluded from the model's JSON form.
	 */
	protected $hidden = ['password', 'password_confirmation', 'confirmation_code', 'remember_token'];

	/**
	 * Define relations for Ardent
	 */
	public static $relationsData = [
		'image' => [self::HAS_ONE, 'Upload'],
		'roles' => [self::BELONGS_TO_MANY, 'Role', 'table' => 'assigned_roles']
	];

	/**
	 * Define validation rules for Ardent
	 */
 	public static $rules = [
	  	'username' => 'required|alpha_dash|unique:users',
	  	'email' => 'required|email|unique:users',
	  	'password' => 'required|min:4|confirmed',
    	'password_confirmation' => 'min:4',
	];

	/**
	 * Define access rules for Magma
	 */
	public static $accessRules = [
		'create' => [
			'display_name' => 'Create Users',
			'roles' => ['admin', 'manager']
		],
		'read' => [
			'display_name' => 'Read Users',
			'roles' => '*'
		],
		'update' => [
			'display_name' => 'Update Users',
			'roles' => ['admin', 'manager', 'owner']
		],
		'delete' => [
			'display_name' => 'Delete Users',
			'roles' => ['admin', 'manager', 'owner']
		]
	];

	/**
	 * Define field level access rules for Magma
	 */
	public static $accessRulesFields = [
		'status' => [
			'read' => [
				'display_name' => 'Read User Status',
				'roles' => ['admin', 'manager']
			],
			'update' => [
				'display_name' => 'Update User Status',
				'roles' => ['admin', 'manager']
			]
		]
	];

	/**
	 * The database table used by the model.
	 */
	protected $table = 'users';

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

}
