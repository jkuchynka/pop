<?php

use Woodling\Woodling;

Woodling::seed('User', function ($blueprint) {
    $blueprint->sequence('email', function($i) {
        return 'testing_'. $i . '@mail.net';
    });
    $blueprint->sequence('username', function($i) {
        return 'test_'. $i;
    });
    $blueprint->password = 'password';
    $blueprint->password_confirmation = 'password';
    $blueprint->confirmation_code = rand(100, 1000);
    $blueprint->confirmed = 1;
    $blueprint->status = 1;
});
