<?php

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{

  public $autoHydrateEntityFromInput = true;

  public $forceEntityHydrationFromInput = true;

  public $autoPurgeRedundantAttributes = true;

  protected $fillable = [
    'name'
  ];

  public static $rules = [
    'name' => 'required|between:4,128|unique:roles'
  ];

  /**
   * When running tests and asserting an instance of this model,
   * Determine how the fields should be defined in the api response
   *
   * @var array
   */
  public function assertions() {
    return [
      // Fields that should match test object
      'equals' => [
        'id', 'name'
      ]
    ];
  }


}
