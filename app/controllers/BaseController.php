<?php

class BaseController extends Controller {

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}

	/**
	 * Return a error json response
	 * @param  array  $data Data to json encode
	 * @return json Response
	 */
	protected function responseError($data)
	{
		$data = (array) $data;
		return Response::json(array('errors' => $data), 400);
	}

}
