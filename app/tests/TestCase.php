<?php

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
        $GLOBALS['PHPUNIT_TEST'] = $this->getName();
        $models = array();
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
    protected function assertResponse($response, $fail = false)
    {
        // Is correct http status?
        if ($fail) {
            $this->assertContains('40', (string) $response->getStatusCode(), "Response: ". $response->getContent());  
        } else {
            $this->assertEquals(200, $response->getStatusCode(), "Response: ". $response->getContent());
        }
        // Response is json?
        $data = json_decode($response->getContent());
        $this->assertNotEmpty($data, "Response was not JSON");
        // Fail responses should contain error(s)
        if ($fail) {
            $this->assertTrue( ! empty($data->errors) || ! empty($data->error), "Fail response should contain error(s). Response: ". print_r($data, 1));
        }
        return $data;
    }

}
