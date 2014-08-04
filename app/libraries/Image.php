<?php namespace App\Libraries\Image;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;

class Image {

    protected static $imagine;

    // We instantiate the Imagine library with Imagick or GD
    protected static function getImagine()
    {
        if ( ! static::$imagine) {
            if (class_exists('Imagick')) {
                static::$imagine = new \Imagine\Imagick\Imagine();
            } else {
                static::$imagine = new \Imagine\Gd\Imagine();
            }
        }
        return static::$imagine;
    }

    /*
     * Resize function.
     * @param string filename
     * @param string sizeString
     *
     * @return blob image contents.
     */
    public static function resize($filename, $sizeString)
    {
        // Where to put resized images
        $outputDir = 'image/'. $sizeString;

        // Create an output file path from the size and the filename.
        $outputFile = public_path() .'/image/'. $sizeString .'/'. $filename;

        $inputFile = base_path() .'/'. $filename;

        // If the resized file already exists we will just return it.
        if (File::isFile($outputFile)) {
            return File::get($outputFile);
        }

        // Get the width and the height of the chosen size from the Config file.
        $sizeArr = Config::get('assets.images.sizes.' . $sizeString);
        $width = $sizeArr['width'];
        $height = $sizeArr['height'];

        // We want to crop the image so we set the resize mode and size.
        $size = new \Imagine\Image\Box($width, $height);
        $mode = \Imagine\Image\ImageInterface::THUMBNAIL_OUTBOUND;

        // Create the output directory if it doesn't exist yet.
        $destDir = dirname($outputFile);
        if ( ! File::isDirectory($destDir)) {
            File::makeDirectory($destDir, 0755, true);
        }

        // Open the file, resize it and save it.
        $imagine = static::getImagine();
        $imagine->open($inputFile)
            ->thumbnail($size, $mode)
            ->save($outputFile, ['quality' => 90]);

        // Return the resized file.
        return File::get($outputFile);
    }

    /**
     * @param string $filename
     * @return string mimetype
     */
    public function getMimeType($filename) {

        // Make the input file path.
        $inputFile = base_path() .'/'.  $filename;

        // Get the file mimetype using the Symfony File class.
        $file = new \Symfony\Component\HttpFoundation\File\File($inputFile);
        return $file->getMimeType();
    }

}
