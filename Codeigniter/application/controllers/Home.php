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
        $timestamp = time();
        
        $data=array(
            'tasksAll' => $tasksAll,
            'timestamp'=> $timestamp,
        );
        $this->output
        ->set_content_type('application/json')
        ->set_output(json_encode($data));
    }
    

    public function dataStore()
    {
        // 変更されたタスクデータ
        $tasksAllNew = $this->input->post('taskDataNew');
        $timestamp = $this->input->post('timestamp');

        // 楽観ロックの実装
        $this->load->model('Home_model');
        $timestampNew = $this->Home_model->getUpdatedAt();
        if ( $timestampNew = 0 || $timestampNew <= date("Y-m-d H:i:s",$timestamp)) {
            // データの追加、更新、削除
            $this->load->model('Home_model');
            $result=$this->Home_model->processData($tasksAllNew);
            
            if($result === True) {
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['isOK'=>'全てのデータを保存しました。']));
            } else {
                $this->output
                ->set_content_type('application/json')
                ->set_output(json_encode(['isOK'=>'バリデーションに失敗。タスク名は必須で75文字以内に収めてください。コメントは3000文字以内です。']));
            }
        } else {
            $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode(['isOK'=>'データが他のユーザによって更新されています。']));
        }




    }
}
