<?php namespace Pop;

use Exception;
use Upload;

class UploadController extends \BaseController {

  public function index()
  {
    return Upload::all();
  }

  /**
   * Stores new upload
   *
   */
  public function store()
  {
    $file = Input::file('file');

    $upload = new Upload;

    try {
      $upload->process($file);
    } catch(Exception $exception){
      // Something went wrong. Log it.
      Log::error($exception);
      // Return error
      return $this->responseError($exception->getMessage());
    }

    // If it now has an id, it should have been successful.
    if ( $upload->id ) {
      return $this->show($upload->id);
    } else {
      return $this->responseError("Error uploading file");
    }
  }

  public function show($id)
  {
    $file = Upload::find($id);
    if ($file) {
      return $file;
    }
    return $this->responseError("Couldn't find file.");
  }

  public function getData()
  {
    $uploads =  Upload::leftjoin('users', 'uploads.id', '=', 'users.id')
      ->select([
        'uploads.id', 'uploads.filename', 'uploads.path', 'uploads.extension',
        'uploads.size', 'uploads.mimetype', 'users.id as user_id', 'users.username as username'
      ]);

    return Datatables::of($uploads)
      ->remove_column('id')
      ->remove_column('user_id')
      ->edit_column('username', '<a href="{{ URL::to(\'admin/users/\'.$id.\'/edit\')}}">{{$username}}</a>')
      ->make();
  }

}
