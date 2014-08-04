<?php namespace Pop;

use Role;

class RoleController extends \BaseController {

    /**
     * Get a list of all roles
     */
    public function index()
    {
        return Role::all();
    }

    /**
     * Get a role record
     */
    public function show($id)
    {
        $role = Role::find($id);
        if ($role) {
            return $role;
        }
        return $this->responseError("Role not found");
    }

    /**
     * Stores new role
     *
     */
    public function store()
    {
        $role = new Role;
        if ($role->save()) {
            // Return newly created object
            return $this->show($role->id);
        } else {
            return $this->responseError($role->errors()->all(':message'));
        }
    }

    /**
     * Update a role
     * @param  integer $id Role id
     * @return json Role object
     */
    public function update($id)
    {
        $role = Role::find($id);
        if ($role->updateUniques()) {
            return $this->show($role->id);
        } else {
            return $this->responseError($role->errors()->all(':message'));
        }
    }

    /**
     * Delete a role
     * @param  integer $id Role id
     * @return json
     */
    public function destroy($id)
    {
        $role = Role::find($id);
        if ($role->delete()) {
            return ['success' => 'OK'];
        } else {
            return $this->responseError($role->errors());
        }
    }

}
