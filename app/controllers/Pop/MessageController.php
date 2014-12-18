<?php namespace Pop;

use Input;
use Mail;
use Config;

class MessageController extends \BaseController {

    public function contact()
    {
        $all = Input::all();
        $data = [
            'msg' => Input::get('message'),
            'input' => Input::all()
        ];
        foreach (['message', 'subject', 'email', 'name'] as $key) {
            if (empty($all[$key])) {
                return $this->responseError("Missing required field: $key");
            }
        }
        // Email to user
        Mail::send('emails.contact.contact-user', $data, function ($message) {
        $subject = 'Pop Contact: ' . Input::get('subject');
        $message
            ->to(Input::get('email'), Input::get('name'))
            ->subject($subject);
        });
        // Email to app admin
        $data['msg'] =
            Mail::send('emails.contact.contact-admin', $data, function ($message) {
                $subject = 'Pop Contact: ' . Input::get('subject');
                $message
                    ->to(Config::get('mail.from.address'), Config::get('mail.from.name'))
                    ->subject($subject);
            });
        return ['success' => 'OK'];
    }

}
