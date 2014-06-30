<?php namespace Pop;

class ImageController extends \BaseController {

  public function getImage($size, $filename)
  {
    //$filename = str_replace('public/', '', $filename);
    $response = \Response::make(
      \Image::resize($filename, $size),
      200
    );
    $response->header(
      'Content-Type',
      \Image::getMimeType($filename)
    );
    return $response;
  }

}
