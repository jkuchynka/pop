<?php namespace Pop;

use Jbizzay\Magma\Magma;
use Role;

class RoleController extends \BaseController {

    /**
     * Get a list of all roles
     */
    public function index()
    {
        return Magma::query('Role');
    }

    /**
     * Get a role record
     */
    public function show($id)
    {
        return Magma::read('Role', $id);
    }

    /**
     * Stores new role
     *
     */
    public function store()
    {
        return Magma::create('Role');
    }

    /**
     * Update a role
     */
    public function update($id)
    {
        return Magma::update('Role', $id);
    }

    /**
     * Delete a role
     * @param  integer $id Role id
     * @return json
     */
    public function destroy($id)
    {
        return Magma::delete('Role', $id);
    }

}
