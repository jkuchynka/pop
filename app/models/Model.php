<?php

use LaravelBook\Ardent\Ardent;

class Model extends Ardent {

    public $autoHydrateEntityFromInput = true;

    public $forceEntityHydrationFromInput = true;

    public $autoPurgeRedundantAttributes = true;

    public static $relationsData = [];

    protected $serializable;



}
