<?php

class RolePermissionSeeder extends Seeder {

  public function run()
  {
    // Seed roles & permissions
    $roles = array(
      'admin' => array()
    );
    foreach ($roles as $name => $perms) {
      $role = new Role;
      $role->name = $name;
      $role->save();
    }
  }

}
