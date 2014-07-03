<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
    <div>
      @foreach ($input as $key => $value)
        <p><b>{{ $key }}:</b> {{ $value }}</p>
      @endforeach
    </div>
	</body>
</html>
