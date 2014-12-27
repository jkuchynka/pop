<?php

use Woodling\Woodling;

Woodling::seed('Upload', function ($blueprint) {
    $blueprint->path = 'uploads';
    $blueprint->sequence('filename', function ($i) {
        return 'test-upload-' . $i . '.jpg';
    });
});
