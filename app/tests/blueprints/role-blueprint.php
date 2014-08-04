<?php

use Woodling\Woodling;

Woodling::seed('Role', function ($blueprint) {
	$blueprint->sequence('name', function ($i) {
    	return 'role_'. $i;
  	});
});
