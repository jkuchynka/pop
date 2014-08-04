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

    public static $rules = [
        'name' => 'required|between:4,128|unique:roles'
    ];

}
