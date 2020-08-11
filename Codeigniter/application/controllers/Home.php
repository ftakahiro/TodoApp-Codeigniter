<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

	public function index(){
		$this->smarty->view('home.tpl');
    }
    
    public function getdata(){
        // DBからタスク情報を取得
        $tasks_parent=$this->db->query('select * from tasks_parent')->result();
        $tasks_child=$this->db->query('select * from tasks_child')->result();
        
        // タスクの構成を再編成
        $tasks_all=[];
        // 親タスクそれぞれのオブジェクトに、関係する子タスクの配列を追加
        foreach($tasks_parent as $task_parent){
            $childrens=[];
            foreach($tasks_child as $task_child){
                if($task_child->parent_id==$task_parent->id){
                    // 親タスクに関係する子タスクを配列にまとめる
                    $childrens[]=$task_child;
                }
            }
            $task_parent->children=$childrens;
            $tasks_all[]=$task_parent;
        }

        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode($tasks_all));
    }
}