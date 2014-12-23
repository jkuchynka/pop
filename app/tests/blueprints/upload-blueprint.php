<?php

use Woodling\Woodling;

Woodling::seed('Upload', function ($blueprint) {
    $blueprint->path = 'uploads';
    $blueprint->sequence('filenamme', function ($i) {
        'test-upload-' . $i . '.jpg';
    });
});
