<?php

return [

    'default' => 'testing',

    'connections' => [

        'setup' => [
            'driver' => 'sqlite',
            'database' => __DIR__ .'/../../database/testing/stubdb.sqlite',
            'prefix' => ''
        ],

        'testing' => [
            'driver' => 'sqlite',
            'database' => __DIR__ .'/../../database/testing/testdb.sqlite',
            'prefix' => ''
        ],

        'sqlite' => [
            'driver' => 'sqlite',
            'database' => ':memory:',
            'prefix' => ''
        ]

    ],

    'migrations' => 'migrations'

];
