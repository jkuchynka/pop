<?php

class Upload extends Model {

    protected $table = 'uploads';

    protected $uploadDirectory = 'files';

    public static $rules = [
        'user_id' => 'required',
        'path' => 'required',
        'filename' => 'required'
    ];

    protected $fillable = ['user_id', 'path', 'filename'];

    public static $accessRules = [
        'create' => [
            'display_name' => 'Create Uploads',
            'roles' => 'authed'
        ],
        'read' => [
            'display_name' => 'Read Uploads',
            'roles' => 'authed'
        ],
        'update' => [
            'display_name' => 'Update Uploads',
            'roles' => 'authed'
        ],
        'delete' => [
            'display_name' => 'Delete Uploads',
            'roles' => 'authed'
        ]
    ];

    public static function directoryExists($directory)
    {
        if ( ! File::isDirectory($directory)) {
            File::makeDirectory($directory, 0775, true);
        }
    }

    /**
     * Upload an image
     * Validates is an image
     * Saves image through intervention, optimizing and constraining to max size
     * Saves to public/uploads directory, with unique filename
     * @return string $image filename | throws Exception on error
     */
    public function process($file)
    {
        // Make sure upload directory exists
        static::directoryExists(public_path() .'/'. $this->uploadDirectory);
        // Validate file is image
        $validation = Validator::make(['file' => $file], ['file' => 'mimes:jpeg,png,gif']);
        if ( ! $validation->fails()) {
            $destination = public_path() .'/'. $this->uploadDirectory .'/'. $file->getClientOriginalName();
            if (File::isFile($destination)) {
                $basename = basename((isset($file->fileSystemName) ? $file->fileSystemName : $file->getClientOriginalName()), $file->getClientOriginalExtension());
                // Remove trailing period
                $basename = rtrim($basename, '.');
                // Append 1 and recheck
                $counter = 1;
                $destination = public_path() .'/'. $this->uploadDirectory .'/'. $basename .'_'. $counter .'.'. $file->getClientOriginalExtension();
                while (File::isFile($destination)) {
                    $counter++;
                    $destination = public_path() .'/'. $this->uploadDirectory .'/'. $basename .'_'. $counter .'.'. $file->getClientOriginalExtension();
                }
            }
            // Constrain image to maximum width if needed, respecting aspect ratio
            Image::make($file)->widen(1200, function ($constraint) {
                $constraint->upsize();
            })->save($destination);
            // Image has been saved to it's destination, set attributes
            if (empty($this->user_id)) {
                $user = Confide::user();
                $this->user_id = $user->id;
            }
            $this->path = $this->uploadDirectory;
            $this->filename = str_replace(public_path() .'/'. $this->uploadDirectory .'/', '', $destination);
            $this->save();
            return;
        }
        throw new Exception("There was an error uploading the image. Please upload an image with jpg, png or gif filetype");
    }

    public static function boot()
    {
        parent::boot();

        // Deleting an upload record should delete the file as well
        static::deleting(function ($upload) {
            $file = public_path() .'/'. $upload->path .'/' . $upload->filename;
            File::delete($file);
        });
    }

}
