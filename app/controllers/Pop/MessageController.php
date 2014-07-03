<?php namespace Pop;

class MessageController extends \BaseController {
  
  public function contact()
  {
    $data = [
      'msg' => \Input::get('message'),
      'input' => \Input::all()
    ];
    // Email to user
    \Mail::send('emails.contact.contact-user', $data, function ($message) {
      $subject = 'App Contact: ' . \Input::get('subject');
      $message
        ->to( \Input::get('email'), \Input::get('name') )
        ->subject($subject);
    });
    // Email to app admin
    $data['msg'] = 
    \Mail::send('emails.contact.contact-admin', $data, function ($message) {
      $subject = 'App Contact: ' . \Input::get('subject');
      $message
        ->to( \Config::get('mail.from.address'), \Config::get('mail.from.name') )
        ->subject($subject);
    });
    return ['success' => 'OK'];
  }

}