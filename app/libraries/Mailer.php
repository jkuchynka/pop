<?php namespace App\Libraries;

use Illuminate\Mail\Mailer as IllMailer;

class Mailer extends IllMailer {

    protected function sendSwiftMessage($message)
    {

        // Allow for pretending on a case by case basis
        // If send to emails match an allow pattern, let it through
        if (\Config::get('mail.allowed_patterns')) {

            $pretendMessage = clone $message;

            // Split out allowed to addresses
            $allowed = $this->parseAllowed($message->getTo());

            // Set allowed main to addresses
            $message->setTo($allowed);
            // Don't send main message if no main addresses to send to
            if ($allowed) {

                // Set allowed cc addresses
                $message->setCc( $this->parseAllowed($message->getCc()) );

                // Set allowed bcc addresses
                $message->setBcc( $this->parseAllowed($message->getBcc()) );

                $ret = $this->swift->send($message, $this->failedRecipients);
            }

            if ($this->pretending && isset($this->logger)) {
                $this->logMessage($pretendMessage);
            }

            return 1;
        };

        if ( ! $this->pretending)
        {
            $this->swift->send($message, $this->failedRecipients);
        }
        elseif (isset($this->logger))
        {
            $this->logMessage($message);

            return 1;
        }
    }

    protected function parseAllowed($to)
    {
        $allowed = [];
        $patterns = \Config::get('mail.allowed_patterns');
        if ( ! empty($to)) {
            foreach ($to as $email => $name) {
                $match = false;
                foreach ($patterns as $pattern) {
                    if (preg_match('~' . $pattern .'~xi', $email)) {
                        $match = true;
                    }
                }
                if ($match) {
                    $allowed[$email] = $name;
                }
            }
        }
        return $allowed;
    }

}
