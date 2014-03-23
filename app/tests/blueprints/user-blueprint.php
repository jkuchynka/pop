<?php

use Woodling\Woodling;

Woodling::seed('User', function ($blueprint) {
  $blueprint->sequence('email', function($i) {
    return 'testing_'. $i . '@mail.net';
  });
  $blueprint->sequence('username', function($i) {
    return 'test_'. $i;
  });
  $blueprint->password = $blueprint->password_confirmation = 'password';
  $blueprint->confirmed = 1;
});
