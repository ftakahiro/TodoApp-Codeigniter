<?php

class Home_model extends CI_Model {

    public function getTaskData()
    {
        // DBからタスク情報を取得
        $this->load->library('repositories/task_repository');
        $tasksParent = $this->task_repository->getAllParent();
        $tasksChild = $this->task_repository->getAllChild();
        
        // タスクの構成を再編成
        $tasksAll = $this->structData($tasksParent, $tasksChild); 

        return $tasksAll;
    }

    // 楽観ロック用にデータの中で最も新しいものを取得
    public function getUpdatedAt()
    {
        $this->load->library('repositories/Task_repository');
        $taskParent = $this->task_repository->getNewParentTop();
        $taskChild  = $this->task_repository->getNewChildTop();

        if (!isset($taskParent) && !isset($taskChild)) {
            return 0;
        } elseif (isset($taskParent->updated_at) && !isset($taskChild->updated_at)) {
            return $taskParent->updated_at;
        } elseif (!isset($taskParent->updated_at) && isset($taskChild->updated_at)) {
            return $taskChild->updated_at;
        } else {
            if($taskParent->updated_at >= $taskChild->updated_at) {
                return $taskParent->updated_at;
            } else {
                return $taskChild->updated_at;
            }
        }
    }
    //TOdo
    public function processData($tasksAllNew)
    {
        $this->load->library('form_validation');
        // 新規作成
        $this->load->library('repositories/task_repository');
        $this->task_repository->transactionStart(); 

        foreach($tasksAllNew as $taskParentNew) {
            // バリデーション
            if (!$this->form_validation->set_data($taskParentNew)->run('task_parent')) {
                return False;
            }
            
            // 親タスクの新規作成
            if ($taskParentNew['id'] < 0) {
                // サニタイズ
                if (preg_match('/[<>"]/', $taskParentNew['name'])) {
                    $taskParentNew['name'] = htmlspecialchars($taskParentNew['name']);
                } elseif (preg_match('/[<>"]/', $taskParentNew['comment'])) {
                    $taskParentNew['comment'] = htmlspecialchars($taskParentNew['comment']);
                }

                $data = [
                    'name' => $taskParentNew['name'],
                    'comment' => $taskParentNew['comment'],
                    'check_flag' => (int)$taskParentNew['check_flag'],
                    'delete_flag' => (int)$taskParentNew['delete_flag'],
                ];

                $insertedId = $this->task_repository->insertParent($data);

                // 新規作成された親タスクに子タスクも作成されていた場合
                if (isset($taskParentNew['children'])) {
                    foreach($taskParentNew['children'] as $childIncluded) {
                        // バリデーション
                        if (!$this->form_validation->set_data($childIncluded)->run('task_child')) {
                            return False;
                        }
                        if (preg_match('/[<>"]/', $childIncluded['name'])) {
                            $childIncluded['name'] = htmlspecialchars($childIncluded['name']);
                        } elseif (preg_match('/[<>"]/', $childIncluded['comment'])) {
                            $childIncluded['comment'] = htmlspecialchars($childIncluded['comment']);
                        }
                        $data = [
                            'name' => $childIncluded['name'],
                            'comment' => $childIncluded['comment'],
                            'check_flag' => (int)$childIncluded['check_flag'],
                            'delete_flag' => (int)$childIncluded['delete_flag'],
                            'parent_id' => $insertedId, //新規作成した親タスクのID
                        ];
                        $this->task_repository->insertChild($data);
                        
                    }
                }
          

            // 親タスク削除 and 更新
            } else {
                // サニタイズ
                if (preg_match('/[<>"]/', $taskParentNew['name'])) {
                    $taskParentNew['name'] = htmlspecialchars($taskParentNew['name']);
                } elseif (preg_match('/[<>"]/', $taskParentNew['comment'])) {
                    $taskParentNew['comment'] = htmlspecialchars($taskParentNew['comment']);
                }
                $data = [
                    'name' => $taskParentNew['name'],
                    'comment' => $taskParentNew['comment'],
                    'check_flag' => (int)$taskParentNew['check_flag'],
                    'delete_flag' => (int)$taskParentNew['delete_flag'],
                    'updated_at' => date("Y-m-d H:i:s", time()),
                ];
                $this->task_repository->updateParentById($taskParentNew['id'], $data);
            }

            if (isset($taskParentNew['children'])) {
                foreach($taskParentNew['children'] as $taskChildNew) {
                    // バリデーション
                    if (!$this->form_validation->set_data($taskChildNew)->run('task_parent')) {
                        return False;
                    }
                    if (preg_match('/[<>"]/', $taskChildNew['name'])) {
                        $taskChildNew['name'] = htmlspecialchars($taskChildNew['name']);
                    } elseif (preg_match('/[<>"]/', $taskChildNew['comment'])) {
                        $taskChildNew['comment'] = htmlspecialchars($taskChildNew['comment']);
                    }
                    // 子タスクの新規作成
                    if ($taskChildNew['id'] < 0 && $taskChildNew['parent_id'] > 0) {
                        $data = [
                            'name' => $taskChildNew['name'],
                            'comment' => $taskChildNew['comment'],
                            'check_flag' => (int)$taskChildNew['check_flag'],
                            'delete_flag' =>(int)$taskChildNew['delete_flag'],
                            'parent_id' => (int)$taskChildNew['parent_id'],
                            'updated_at' => date("Y-m-d H:i:s", time()),
                        ];
                        $insertedId = $this->task_repository->insertChild($data);
                    // 子タスク削除 and 更新
                    } else {
                        $data = [
                            'name' => $taskChildNew['name'],
                            'comment' => $taskChildNew['comment'],
                            'check_flag' => (int)$taskChildNew['check_flag'],
                            'delete_flag' => (int)$taskChildNew['delete_flag'],
                            'updated_at' => date("Y-m-d H:i:s", time()),
                        ];
                        $insertedId = $this->task_repository->updateChildById($taskChildNew['id'], $data);
                    }
    
                }
            }
        
        }
        $this->task_repository->transactionComplete();
        return True;
    }


    private function structData($tasks_parent, $tasks_child) {
        // タスクの構成を再編成
        $tasksAll = [];
        // 親タスクそれぞれのオブジェクトに、関係する子タスクの配列を追加
        foreach($tasks_parent as $task_parent) {
            $childrens= [];
            foreach($tasks_child as $task_child) {
                if ($task_child->parent_id < $task_parent->id) {
                    continue;
                } elseif ($task_child->parent_id > $task_parent->id) {
                    break;
                } else {
                    // 親タスクに関係する子タスクを配列にまとめる
                    $childrens[] = $task_child;
                }
            }
            $task_parent->children = $childrens;
            $tasksAll[] = $task_parent;
        }
        return $tasksAll;
    }
}
