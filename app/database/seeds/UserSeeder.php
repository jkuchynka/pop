<?php

class UserSeeder extends Seeder {

  public function run()
  {
    $roles = Role::all();
    // Create users
    $users = array(
      'admin' => array(
        'email' => 'jason.kuchynka@gmail.com',
        'roles' => $roles->toArray()
      ),
      'jason' => array(
        'email' => 'jason.kuchynka+jason@gmail.com',
        'roles' => array()
      ),
      'test1' => array(
        'email' => 'jason.kuchynka+test1@gmail.com',
        'roles' => array()
      ),
      'test2' => array(
        'email' => 'jason.kuchynka+test2@gmail.com',
        'roles' => array()
      )
    );
    foreach ($users as $username => $data) {
      $user = new User;
      $user->username = $username;
      $user->email = $data['email'];
      $user->password = $user->password_confirmation = 'password';
      $user->created_at = $user->updated_at = time();
      $user->confirmed = 1;
      $user->updateUniques();
      $user->saveRoles($data['roles']);
    }
  }

}
