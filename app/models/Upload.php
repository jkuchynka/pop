<?php

use Andrew13\Cabinet\CabinetUpload;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class Upload extends CabinetUpload {

    protected $softDelete = true;

    public function process(UploadedFile $file)
    {
        // File extension
        $this->extension = $file->getClientOriginalExtension();
        // Mimetype for the file
        $this->mimetype = $file->getMimeType();
        // If user hasn't already been set, Current user or 0
        if ( ! $this->user_id) {
            $this->user_id = (Auth::user() ? Auth::user()->id : 0);
        }

        $this->size = $file->getSize();

        list($this->path, $this->filename) = $this->upload($file);

        $this->save();
    }

}
