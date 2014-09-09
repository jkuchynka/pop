<?php namespace Pop;

use Permission;
use Jbizzay\Magma\MagmaAccess;

class PermissionController extends \BaseController {
	
	public function index()
	{
		return MagmaAccess::getAccessRules();
	}

}