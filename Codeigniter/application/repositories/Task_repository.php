<?php

class Task_repository extends CI_Model {

    public function getAllParent() 
    {
         $tasksParent = $this->db->query('SELECT * FROM tasks_parent ORDER BY id ASC')->result();
         return $tasksParent;
    }

    public function getAllChild()
    {
        $tasksChild  = $this->db->query('SELECT * FROM tasks_child ORDER BY parent_id ASC')->result();
        return $tasksChild;
    }

    public function getNewParentTop()
    {
        $taskParent = $this->db->query('SELECT * FROM tasks_parent ORDER BY updated_at DESC LIMIT 1')->row();
        return $taskParent;
    }

    public function getNewChildTop()
    {
        $taskChild  = $this->db->query('SELECT * FROM tasks_child  ORDER BY updated_at DESC LIMIT 1')->row();
        return $taskChild;
    }

    public function insertParent($data)
    {
        $this->db->insert('tasks_parent', $data);
        $insertedId = $this->db->insert_id();
        return $insertedId;
    }

    public function insertChild($data)
    {
        $this->db->insert('tasks_child', $data);
    }

    public function updateParentById($id, $data)
    {
        $this->db->where('id', $id);
        $this->db->update('tasks_parent', $data);
    }

    public function updateChildById($id, $data)
    {
        $this->db->where('id', $id);
        $this->db->update('tasks_child', $data);
    }

}