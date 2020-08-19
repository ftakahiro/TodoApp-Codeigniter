<!Doctype html>
<head>
    <title>Todo App</title>
    <!-- fontawesome -->
    <script src="https://kit.fontawesome.com/d3cf446c37.js" crossorigin="anonymous"></script>

    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/home.css">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script type="text/javascript" src="js/home.js"></script>
</head>
<body>
{include file="elements/header.tpl"}
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
                <button id="bt_add_child_task" class="bt-add" onclick="openModal(0, 1, this.dataset.parentId)">追加</button>
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
{include file="elements/footer.tpl"}
{include file="modals/make_task.tpl"}
{include file="modals/modal_overlay.tpl"}
</body>
</html>