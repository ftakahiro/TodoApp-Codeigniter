<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller {

	public function index(){
		$this->smarty->view('home.tpl');
    }
    
    public function getData(){
        // DBからタスク情報を取得
        $tasks_parent=$this->db->query('select * from tasks_parent')->result();
        $tasks_child=$this->db->query('select * from tasks_child')->result();
        
        // タスクの構成を再編成
        $tasks_all=$this->structData($tasks_parent,$tasks_child);


        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode($tasks_all));
    }

    public function dataStore(){
        // フロントに渡した時と同じタスクデータ
        $tasks_all_org=$this->input->post('taskDataOrg');
        // 変更されたタスクデータ
        $tasks_all_new=$this->input->post('taskDataNew');

        // 新規作成
        foreach($tasks_all_new as $task_parent_new){
            // 親タスクの新規作成
            if($task_parent_new['id'] < 0){
                $data=[
                    'name'=>htmlspecialchars($task_parent_new['name']),
                    'comment'=>htmlspecialchars($task_parent_new['comment']),
                    'check_flag'=>(int)$task_parent_new['check_flag'],
                ];
                $this->db->insert('tasks_parent',$data);
            }
            // 子タスクの新規作成
            if(!empty($task_parent_new['children'])){
                foreach($task_parent_new['children'] as $task_child_new){
                    if($task_child_new['id'] < 0){
                        $data=[
                            'name'=>htmlspecialchars($task_child_new['name']),
                            'comment'=>htmlspecialchars($task_child_new['comment']),
                            'check_flag'=>(int)$task_child_new['check_flag'],
                            'parent_id'=>$task_child_new['parent_id'],
                        ];
                        $this->db->insert('tasks_child',$data);
                    }
    
                }
            }
        }
        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode(['isOK'=>'ok']));
        
        


    }
    private function structData($tasks_parent,$tasks_child){
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

        return $tasks_all;
    }
}