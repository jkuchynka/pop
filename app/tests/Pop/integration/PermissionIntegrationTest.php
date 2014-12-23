<?php

use Woodling\Woodling;

use Jbizzay\Magma\Magma;
use Jbizzay\Magma\MagmaAccess;

class PermissionIntegrationTest extends TestCase {

	public function testGetPermissions()
	{
		// Should get crud permissions for each model
		$perms = MagmaAccess::getAccessRules();
	}

}
