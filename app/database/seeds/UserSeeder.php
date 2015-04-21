<?php

class UserSeeder extends Seeder {

    public function run()
    {
        $roles = Role::all();
        // Create users
        $users = [
            'admin' => [
                'email' => 'jason.kuchynka@gmail.com',
                'roles' => $roles->toArray()
            ],
            'jason' => [
                'email' => 'jason.kuchynka+jason@gmail.com',
                'roles' => []
            ],
            'test1' => [
                'email' => 'jason.kuchynka+test1@gmail.com',
                'roles' => []
            ],
            'test2' => [
                'email' => 'jason.kuchynka+test2@gmail.com',
                'roles' => []
            ]
        ];
        foreach ($users as $username => $data) {
            $user = new User;
            $user->username = $username;
            $user->email = $data['email'];
            $user->password = $user->password_confirmation = 'password';
            $user->created_at = $user->updated_at = new DateTime;
            $user->confirmed = 1;
            $user->status = 1;
            $user->save();
            if ($data['roles']) {
                $r_ids = [];
                foreach ($data['roles'] as $role) {
                    $r_ids[] = $role['id'];
                }
                $user->roles()->sync($r_ids);
            }
        }
    }

}
