<?php

use Woodling\Woodling;

class TestCase extends Illuminate\Foundation\Testing\TestCase {

    /**
     * Setup before all tests
     */
    public static function setUpBeforeClass()
    {

    }

    /**
     * Creates the application.
     *
     * @return \Symfony\Component\HttpKernel\HttpKernelInterface
     */
    public function createApplication()
    {
        $unitTesting = true;
        $testEnvironment = 'testing';
        return require __DIR__.'/../../bootstrap/start.php';
    }

    /**
     * Setup runs before each individual test
     */
    public function setUp()
    {
        parent::setUp();
        // Set test name in globals
        $GLOBALS['PHPUNIT_TEST'] = $this->getName();
        // Set skip magma permission
        //$GLOBALS['MAGMA_SKIP_ACCESS'] = true;
        $models = [];
        $files = File::glob(app_path() .'/models/*.php');
        foreach ($files as $file) {
          $class = basename($file, '.php');
          // Reset event listeners and re-register them
          call_user_func(array($class, 'flushEventListeners'));
          call_user_func(array($class, 'boot'));
        }

        // Migrate the database
        Artisan::call('migrate');

        // Set the mailer to pretend
        Mail::pretend(true);
    }

    protected function assertModel($expect, $compare) {
        $fail = function () use ($expect) {
            $className = get_class($expect);
            return $className .': ';
        };
        if ( ! empty($expect::$assertions)) {
            $assertions = $expect::$assertions;
            if ( ! empty($assertions['equals'])) {
                // These fields should match
                foreach ($assertions['equals'] as $field) {
                    $this->assertEquals($expect->$field, $compare->$field, $fail());
                }
            }
            if ( ! empty($assertions['not_set'])) {
                // These fields shouldn't be set
                foreach ($assertions['not_set'] as $field) {
                    $this->assertObjectNotHasAttribute($field, $compare, $fail());
                }
            }
            if ( ! empty($assertions['not_empty'])) {
                // These fields should have a value
                foreach ($assertions['not_empty'] as $field) {
                    $this->assertObjectHasAttribute($field, $compare, $fail());
                    $this->assertNotEmpty($compare->$field, $fail());
                }
            }
        } else {
            $this->fail("Model has no function assertions.");
        }
    }

    /**
     * Assert against an api response
     * @param  object  $response
     * @param  boolean $fail
     * @return array $data
     */
    protected function assertResponse($response, $statusCode = 200)
    {
        // Check status code
        $this->assertEquals( (integer) $statusCode, $response->getStatusCode(), "Response: ". $response->getContent());

        // Response should be json
        $data = json_decode($response->getContent());
        $this->assertNotEmpty($data, "Response was not JSON: ". $response->getContent());

        // If fail response
        if (strpos('40', (string) $response->getStatusCode())) {
            // Error responses should contain error(s)
            $this->assertTrue( ! empty($data->errors) || ! empty($data->error), "Error response should contain error(s). Response: ". print_r($data, 1));
        }

        return $data;
    }

    public function helperCreateUserAndLogin($roleName = null)
    {
        // If role doesn't exist, create it
        if ($roleName && ! $roleId = DB::table('roles')->where('name', $roleName)->pluck('id')) {
            $role = new Role();
            $role->name = $roleName;
            $role->save();
            $roleId = $role->id;
        }
        // Create test user
        $user = Woodling::saved('User');
        if ($roleName) {
            $user->roles()->sync([$roleId]);
        }
        Auth::login($user);
        return $user;
    }

    public function helperAttachUserRoles($user, $roles)
    {
        foreach ($roles as $role) {
            DB::insert('insert into assigned_roles (role_id, user_id) values (?, ?)',
                [$role->id, $user->id]);
        }
    }

    public function createAdminUser()
    {
        // Create admin user
        $user = new User([
            'email' => 'admin@mail.net',
            'username' => 'admin',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $user->save();
        return $user;
    }

    public function loginUser($user)
    {
        return Auth::login($user);
    }

}
