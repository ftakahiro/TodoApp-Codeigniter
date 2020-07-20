<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		
		// $query=$this->db->query('select * from tasks_parent');
		// foreach ($query->result() as $row){
		// 	$result=$row->name;
		// }
		// $data['test']='hellow samary';
		// $data['result']=strval($result);
		// $this->smarty->view('test.tpl',$data);
		$this->load->view('welcome_message');
	}
}
