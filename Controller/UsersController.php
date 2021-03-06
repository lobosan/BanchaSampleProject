<?php
/**
 * Users Controller file
 *
 * Bancha Sample Project
 * Copyright 2011-2012 Roland Schuetz
 *
 * @package       BanchaSampleProject
 * @subpackage    Model
 * @copyright     Copyright 2011-2012 Roland Schuetz
 * @link          http://banchaproject.org Bancha Project
 * @author        Roland Schuetz <mail@rolandschuetz.at>
 * @since         v 1.0
 */

App::uses('AppController', 'Controller');
/**
 * Users Controller
 *
 * @property User $User
 */
class UsersController extends AppController {
/**
 * Hide the password while paginating (you can also use blacklisting)
 */
	public $paginate = array(
		'fields' => array('id', 'username', 'name', 'email', 'role') // hide password from Bancha
	);

	public function beforeFilter() {
		$this->Auth->allow('login','logout');
	}
/**
 * User Management
 *
 * @banchaRemotable
 * 
 * @return for Bancha: user record if logged in, otherwise false
 */
	public function login($data = null) {
		
		// send Bancha the logging in user data
		if(isset($this->request->params['isBancha']) && $this->request->params['isBancha']) {
			// prepare data (more elegant with form post)
			$this->request->data = array('User' => $data);
			if ($this->Auth->login()) {
				return array('User'=>$this->Auth->user()); // success
			} else {
				return false; // invalid
			}
		}
			
		
		
		// normal login handling
    	if ($this->request->is('post')) {
        	if ($this->Auth->login()) {			
            	return $this->redirect($this->Auth->redirect());
        	} else {
            	$this->Session->setFlash(__('Username or password is incorrect'), 'default', array(), 'auth');
        	}
    	}
	}
	public function logout() {
	    $this->redirect($this->Auth->logout());
	}



// CRUD functions below

/**
 * index method
 *
 * @return void
 */
	public function index() {
		$this->User->recursive = 0;
		$users = $this->paginate();
		$this->set('users', $users);
		
		return array_merge($this->request['paging']['User'],array('records'=>$users));
	}

/**
 * view method
 *
 * @param string $id
 * @return void
 */
	public function view($id = null) {
		$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		$this->set('user', $this->User->read(null, $id));
		
		// don't send the password
		$this->User->data['User']['password'] = '';
		
		return $this->User->data;
	}

/**
 * add method
 *
 * @return void
 */
	public function add() {
		
		if ($this->request->is('post')) {
			$this->User->create();
			
			if(isset($this->request->params['isBancha']) && $this->request->params['isBancha']) return $this->User->saveFieldsAndReturn($this->request->data);
			
			if ($this->User->save($this->request->data)) {
				$this->flash(__('User saved.'), array('action' => 'index'));
			} else {
			}
		}
	}

/**
 * edit method
 *
 * @param string $id
 * @return void
 */
	public function edit($id = null) {
		$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		
		if(isset($this->request->params['isBancha']) && $this->request->params['isBancha']) return $this->User->saveFieldsAndReturn($this->request->data);
		
		
		if ($this->request->is('post') || $this->request->is('put')) {
			if ($this->User->save($this->request->data)) {
				$this->flash(__('The user has been saved.'), array('action' => 'index'));
			} else {
			}
		} else {
			$this->request->data = $this->User->read(null, $id);
		}
	}

/**
 * delete method
 *
 * @param string $id
 * @return void
 */
	public function delete($id = null) {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}
		$this->User->id = $id;
		if (!$this->User->exists()) {
			throw new NotFoundException(__('Invalid user'));
		}
		
		if(isset($this->request->params['isBancha']) && $this->request->params['isBancha']) return $this->User->deleteAndReturn();
		
		
		if ($this->User->delete()) {
			$this->flash(__('User deleted'), array('action' => 'index'));
		}
		$this->flash(__('User was not deleted'), array('action' => 'index'));
		$this->redirect(array('action' => 'index'));
	}
}
