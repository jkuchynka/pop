<?php

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{

    public $autoHydrateEntityFromInput = true;

    public $forceEntityHydrationFromInput = true;

    public $autoPurgeRedundantAttributes = true;

    public static $assertions = [
        'equals' => [
            'id', 'name'
        ]
    ];

    protected $fillable = [
        'name'
    ];

    public static $relationsData = [
        'users' => [self::BELONGS_TO_MANY, 'User', 'table' => 'assigned_roles'],
        // Not really using the permissions table, so this will be removed when
        // we remove Entrust
        'perms' => [self::BELONGS_TO_MANY, 'Permission', 'table' => 'permission_role']
    ];

    public static $rules = [
        'name' => 'required|between:4,128|unique:roles'
    ];

}
