<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

    	// Seeding refreshes all data
    	DB::table('assigned_roles')->delete();
    	DB::table('roles')->delete();
    	DB::table('users')->delete();

    	$this->call('RolePermissionSeeder');
		$this->call('UserSeeder');
	}

}
