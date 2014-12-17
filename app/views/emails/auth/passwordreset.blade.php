<!DOCTYPE html>
<html lang="en-US">
    <head>
        <meta charset="utf-8">
    </head>
    <body>

        <h1>Password reset</h1>

        <p>Hello {{ $user->username }} !</p>

        <p>Please access the link below to reset your password.</p>

        <a href='{{{ URL::to("users/reset/{$token}") }}}'>
            {{{ URL::to("users/reset/{$token}") }}}
        </a>

    </body>
</html>
