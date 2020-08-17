<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

    public function index()
    {
		$this->smarty->view('home.tpl');
    }
    

    public function getData()
    {
        // DBからタスク情報を取得
        $this->load->model('Home_model');
        $tasksAll = $this->Home_model->getTaskData();

        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode($tasksAll));
    }
    

    public function dataStore()
    {
        // フロントに渡した時と同じタスクデータ
        $tasks_all_org=$this->input->post('taskDataOrg');
        // 変更されたタスクデータ
        $tasksAllNew=$this->input->post('taskDataNew');

        // データの追加、更新、削除
        $this->load->model('Home_model');
        $this->Home_model->processData($tasksAllNew);

        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode(['isOK'=>'ok']));
    }
}
