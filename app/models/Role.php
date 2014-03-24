<?php

use Zizaco\Entrust\EntrustRole;

class Role extends EntrustRole
{

  public static $rules = array(
    'name' => 'required|between:4,128|unique:roles'
  );


}
