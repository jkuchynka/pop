<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="utf-8">
    </head>
    <body>

        <h1>Welcome to Pop!</h1>

        <p>Hello {$user->username} !</p>

        <p>Please access the link below to confirm your account.</p>

        <a href='{{{ URL::to("users/confirm/{$user->confirmation_code}") }}}'>
            {{{ URL::to("users/confirm/{$user->confirmation_code}") }}}
        </a>

    </body>
</html>
