<?php

class Home_model extends CI_Model {

    public function getTaskData()
    {
        // DBからタスク情報を取得
        $tasksParent = $this->db->query('select * from tasks_parent')->result();
        $tasksChild  = $this->db->query('select * from tasks_child')->result();
        
        // タスクの構成を再編成
        $tasksAll = $this->structData($tasksParent,$tasksChild);

        return $tasksAll;
    }

    public function processData($tasksAllNew)
    {
        // 新規作成
        foreach($tasksAllNew as $taskParentNew){
            // 親タスクの新規作成
            if($taskParentNew['id'] < 0) {
                $data = [
                    'name' => htmlspecialchars($taskParentNew['name']),
                    'comment' => htmlspecialchars($taskParentNew['comment']),
                    'check_flag' => (int)$taskParentNew['check_flag'],
                    'delete_flag' => (int)$taskParentNew['delete_flag'],
                ];

                $this->db->insert('tasks_parent',$data);
                $insertedId=$this->db->insert_id();

                // 新規作成された親タスクに子タスクも作成されていた場合
                if(isset($taskParentNew['children'])) {
                    foreach($taskParentNew['children'] as $childIncluded){
                        $data = [
                            'name' => htmlspecialchars($childIncluded['name']),
                            'comment' => htmlspecialchars($childIncluded['comment']),
                            'check_flag' => (int)$childIncluded['check_flag'],
                            'delete_flag' => (int)$childIncluded['delete_flag'],
                            'parent_id' => $insertedId, //新規作成した親タスクのID
                        ];
                        $this->db->insert('tasks_child', $data);
                    }
                }
          

            // 親タスク削除 and 更新
            } else {
                $data = [
                    'name' => htmlspecialchars($taskParentNew['name']),
                    'comment' => htmlspecialchars($taskParentNew['comment']),
                    'check_flag' => (int)$taskParentNew['check_flag'],
                    'delete_flag' => (int)$taskParentNew['delete_flag'],
                ];
                $this->db->where('id', $taskParentNew['id']);
                $this->db->update('tasks_parent', $data);
            }

            if(isset($taskParentNew['children'])) {
                foreach($taskParentNew['children'] as $task_child_new){
                    // 子タスクの新規作成
                    if($task_child_new['id'] < 0 && $task_child_new['parent_id'] > 0) {
                        $data = [
                            'name' => htmlspecialchars($task_child_new['name']),
                            'comment' => htmlspecialchars($task_child_new['comment']),
                            'check_flag' => (int)$task_child_new['check_flag'],
                            'delete_flag' =>(int)$task_child_new['delete_flag'],
                            'parent_id' => (int)$task_child_new['parent_id'],
                        ];
                        $this->db->insert('tasks_child', $data);
                    // 子タスク削除 and 更新
                    } else {
                        $data = [
                            'name' => htmlspecialchars($task_child_new['name']),
                            'comment' => htmlspecialchars($task_child_new['comment']),
                            'check_flag' => (int)$task_child_new['check_flag'],
                            'delete_flag' => (int)$task_child_new['delete_flag'],
                        ];
                        $this->db->where('id', $task_child_new['id']);
                        $this->db->update('tasks_child', $data);
                    }
    
                }
            }
        
        }
        return;
    }


    private function structData($tasks_parent,$tasks_child){
        // タスクの構成を再編成
        $tasks_all = [];
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