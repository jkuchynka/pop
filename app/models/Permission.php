<?php

use Zizaco\Entrust\EntrustPermission;

class Permission extends EntrustPermission
{

	public static $relationsData = [
		'roles' => [SELF::BELONGS_TO_MANY, 'Role', 'table' => 'assigned_roles']
	];

	public function roles()
	{
		return $this->belongsToMany('Role');		
	}

	public static $accessRules = [
		
	];

}
