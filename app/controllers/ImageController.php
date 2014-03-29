<?php

class ImageController extends BaseController {

  public function getImage($size, $filename)
  {
    $response = Response::make(
      Image::resize($filename, $size),
      200
    );
    $response->header(
      'Content-Type',
      Image::getMimeType($filename)
    );
    return $response;
  }

}
