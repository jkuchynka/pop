<?php

class RoleController extends BaseController {

  /**
   * Get a list of all roles
   */
  public function getIndex()
  {
    return Role::all();
  }

  /**
   * Get a role record
   */
  public function getShow($id)
  {
    if (is_numeric($id)) {
      return Role::find($id);
    } else {
      return Role::where('name', $id)->first();
    }
  }

  /**
   * Stores new role
   *
   */
  public function postIndex()
  {
    $role = new Role;
    $role->name = Input::get('name');
    $role->save();
    if ($role->id) {
      // Return newly created user object
      return $this->getShow($role->id);
    } else {
      return $this->responseError($role->errors());
    }
  }

  /**
   * Update a role
   * @param  integer $id Role id
   * @return json Role object
   */
  public function putIndex($id)
  {
    $role = Role::find($id);
    $role->name = Input::get('name');
    if ($role->updateUniques()) {
      return $this->getShow($role->id);
    } else {
      return $this->responseError($role->errors());
    }

  }

  /**
   * Delete a role
   * @param  integer $id Role id
   * @return json
   */
  public function deleteIndex($id)
  {
    $role = Role::find($id);
     if ($role->delete()) {
      return array('success' => 'OK');
     } else {
      return $this->responseError($role->errors());
     }
  }

}
