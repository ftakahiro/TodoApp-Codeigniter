<?php
/* Smarty version 3.1.34-dev-7, created on 2020-08-20 03:08:18
  from '/var/www/Codeigniter/application/views/templates/home.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.34-dev-7',
  'unifunc' => 'content_5f3de922e15651_84428589',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '1a9af2047aef33f713a76ef3c05d2dbcf628c071' => 
    array (
      0 => '/var/www/Codeigniter/application/views/templates/home.tpl',
      1 => 1597892892,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
    'file:elements/header.tpl' => 1,
    'file:elements/footer.tpl' => 1,
    'file:modals/make_task.tpl' => 1,
    'file:modals/modal_overlay.tpl' => 1,
  ),
),false)) {
function content_5f3de922e15651_84428589 (Smarty_Internal_Template $_smarty_tpl) {
?><!Doctype html>
<head>
    <title>Todo App</title>
    <!-- fontawesome -->
    <?php echo '<script'; ?>
 src="https://kit.fontawesome.com/d3cf446c37.js" crossorigin="anonymous"><?php echo '</script'; ?>
>

    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/home.css">
    <?php echo '<script'; ?>
 type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 type="text/javascript" src="js/home.js"><?php echo '</script'; ?>
>
</head>
<body>
<?php $_smarty_tpl->_subTemplateRender("file:elements/header.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>
<main>
<div class="container">
    <div id="area_all_tasks">
        <div id="area_tasks_parent">
            <div class="tasks-header"></div>
            <div id="tasks_parent"></div>
            <div class="tasks-footer">
                <button id="bt_add_parent_task" class="bt-add" onclick="openModal(0, 0 ,null, null)">追加</button>
            </div>
        </div>
        <div id="area_tasks_child">
            <div class="tasks-header"></div>
            <div id="tasks_child"></div>
            <div class="tasks-footer">
                <button id="bt_add_child_task" class="bt-add" onclick="openModal(0, 1, this.dataset.parentId, null)">追加</button>
            </div>
        </div>
    </div>
    <div id="area_comment">
        <div class="row-comment">
            <div class="comment-header">タスク名</div>
            <textarea class="comment" onchange="updateComment(this)">コメント</textarea>
        </div>
    </div>
</div>
</main>
<?php $_smarty_tpl->_subTemplateRender("file:elements/footer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
$_smarty_tpl->_subTemplateRender("file:modals/make_task.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
$_smarty_tpl->_subTemplateRender("file:modals/modal_overlay.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, 0, $_smarty_tpl->cache_lifetime, array(), 0, false);
?>
</body>
</html><?php }
}
