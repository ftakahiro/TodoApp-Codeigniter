<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$config = array(
    'task_parent' => array(
            array(
                    'field' => 'id',
                    'rules' => 'required|integer'
            ),
            array(
                    'field' => 'name',
                    'rules' => 'required|max_length[75]'
            ),
            array(
                    'field' => 'comment',
                    'rules' => 'max_length[3000]'
            ),
            array(
                    'field' => 'check_flag',
                    'rules' => 'required|integer'
            ),
            array(
                    'field' => 'delete_flag',
                    'rules' => 'required|integer'
            )
        ),
    'task_child' => array(
            array(
                    'field' => 'id',
                    'rules' => 'required|integer'
            ),
            array(
                    'field' => 'name',
                    'rules' => 'required|max_length[75]'
            ),
            array(
                    'field' => 'comment',
                    'rules' => 'max_length[3000]'
            ),
            array(
                    'field' => 'parent_id',
                    'rules' => 'required|integer'
            ),
            array(
                    'field' => 'check_flag',
                    'rules' => 'required|integer'
            ),
            array(
                    'field' => 'delete_flag',
                    'rules' => 'required|integer'
            )
    )
);