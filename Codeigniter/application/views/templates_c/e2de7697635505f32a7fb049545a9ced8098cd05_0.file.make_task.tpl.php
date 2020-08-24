<?php
/* Smarty version 3.1.34-dev-7, created on 2020-08-17 09:28:06
  from '/var/www/Codeigniter/application/views/templates/modals/make_task.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_5f3a4da61ba839_04571044',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'e2de7697635505f32a7fb049545a9ced8098cd05' => 
    array (
      0 => '/var/www/Codeigniter/application/views/templates/modals/make_task.tpl',
      1 => 1597656156,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5f3a4da61ba839_04571044 (Smarty_Internal_Template $_smarty_tpl) {
?><div id="modal_make_task">
    <div class="make-task-header">
    </div>
    <div class="make-task-content">
        <div class="modal-area-name">
            <div class="label-modal">タスク名</div>
            <input type="text" placeholder="タスク名" id="task_name">
        </div>
        <div class="modal-area-comment">
            <div class="label-modal">コメント</div>
            <textarea placeholder="コメント" id="task_comment"></textarea>
        </div>
    </div>
    <div class="make-task-footer">
        <button class="bt-task-add" onclick="makeTask(this)">追加</button>
    </div>
</div><?php }
}
