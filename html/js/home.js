$(function(){
    const FLAG_ON = 1;
    const FLAG_OFF = 0;

    // タスクデータを取得
    $.ajax({
        url: '/home/getdata',
        method: 'GET',
        dataType: 'json',
    })
    .done(function(data) {
        window.taskDataOrg = data.tasksAll;
        window.taskData = data.tasksAll;　
        window.timestamp = data.timestamp;
        console.log(timestamp);
        setParentTask(taskData);
        console.log(taskData);
    });
    
    // 親タスクを設置
    function setParentTask(taskData) {
        $("#tasks_parent").empty();
        taskData.forEach((element) => {
            if(Number(element.delete_flag) !== FLAG_ON) {
                console.log(typeof element.delete_flag);
                let rowTask = `
                <div id="row_parent_${element.id}" class="row-task task-parent" data-id="${element.id}" data-name="${element.name}" data-comment="${element.comment}" onclick="setChildTask(${element.id});setParentComment(${element.id})">
                    <div class="row-task-name">
                    <label for="parent_${element.id}">
                        <input id="parent_${element.id}" type="checkbox" data-id="${element.id}" disabled="disabled" ${(Number(element.check_flag) === FLAG_ON)? 'checked="checked"': ''}>
                        ${element.name}
                    </label>
                    </div>
                    <div class="area-option">
                        <img class="icon-option" src="/img/option.png" alt="option icon" onclick="toggleParentOption(${element.id})">
                        <div class="options" id="optionParent${element.id}">
                            <div data-parent-id="${element.id}" onclick="deleteParentTask(${element.id})">削除</div>
                            <div data-parent-id="${element.id}" onclick="openModal(${FLAG_ON}, ${FLAG_OFF}, ${element.id}, null)">編集</div>
                        </div>
                    </div>
                </div>`;
                $("#tasks_parent").append(rowTask);
            }
        });
    }

    // 親タスククリック時に子タスクを設置
    var parentFocused;
    window.setChildTask = function setChildTask(parentId) {
        // 子タスクを内包する親タスクを検索
        let targetParentTask;
        targetParentTask = taskData.filter((item, index) => {
            if(Number(item.id) === Number(parentId)) return true;
        })[0];

        // 親タスクにフォーカスを当てる
        if(parentFocused) {
            $(parentFocused).css('background-color', 'white');
        }
        parentFocused =`#row_parent_${targetParentTask.id}`
        $(parentFocused).css('background-color', '#FEE715');
        
        // 子タスクを設置
        $("#tasks_child").empty();
        targetParentTask.children.forEach((element) => {
            if(Number(element.delete_flag) !== FLAG_ON) {
                let rowTask = `
                    <div id="row_child_${element.id}" class="row-task" data-parent="${targetParentTask.name}" data-child="${element.name}" data-child-id="${element.id}" data-parent-id="${targetParentTask.id}" data-comment="${element.comment}"  onclick="setChildComment(this)">
                        <div class="row-task-name">
                            <input class="child_checkbox" id="child_${element.id}" type="checkbox" ${(Number(element.check_flag) === FLAG_ON)? 'checked="checked"': ''} data-id="${element.id}" onchange="childCheckEvent(this.checked, ${element.id}, ${element.parent_id})">
                            <label for="child_${element.id}">${element.name}</label>
                        </div>
                        <div class="area-option">
                            <img class="icon-option" src="/img/option.png" alt="option icon" onclick="toggleChildOption(${element.id})">
                            <div class="options" id="optionChild${element.id}">
                                <div data-parent-id="${element.id}" onclick="deleteChildTask(${targetParentTask.id}, ${element.id})">削除</div>
                                <div data-parent-id="${element.id}" onclick="openModal(${FLAG_ON}, ${FLAG_ON}, ${targetParentTask.id}, ${element.id})">編集</div>
                            </div>
                        </div>
                    </div>`;
                $("#tasks_child").append(rowTask);
            }
        });

        // 子タスク作成ボタンに親タスクの情報を埋め込み
        $('#bt_add_child_task').attr({
            'data-parent-id': targetParentTask.id,
        });
        
    }

    // 親タスクのコメントをセット
    window.setParentComment = function setParentComment(id) {
        const dataSet = getParentRecord(id);
        $('.comment-header').html(dataSet.name);
        $('.comment').val(dataSet.comment);
        $('.comment').attr({
            'data-flag': FLAG_OFF, // 親タスクのコメントであることを示すフラグ
            'data-id': `${dataSet.id}`,
        });
    }

    // 子タスクのコメントをセット
    var childFocused;
    window.setChildComment = function setChildComment(element) {
        // 子タスクにフォーカスを当てる
        const parentRecord = getParentRecord(element.dataset.parentId);
        const childRecord = getChildRecord(element.dataset.parentId,element.dataset.childId);
        if(childFocused) {
            $(childFocused).css('background-color', 'white');
        }
        childFocused =`#row_child_${element.dataset.childId}`;
        $(childFocused).css('background-color', '#FEE715');

        $('.comment-header').html(`${parentRecord.name} > ${childRecord.name}`);
        $('.comment').val(reverseSanitize(childRecord.comment));
        $('.comment').attr({
            'data-flag': FLAG_ON, // 子タスクのコメントであることを示すフラグ
            'data-child-id': `${element.dataset.childId}`,
            'data-parent-id': `${element.dataset.parentId}`,
        });
       

    }

    // コメントが変更された時
    window.updateComment = function updateComment(element) {
        if(Number(element.dataset.flag) === FLAG_OFF) {
            console.log('parent comment changed');
            updateParentData(element.dataset.id, null, element.value);
        }
        if(Number(element.dataset.flag) === FLAG_ON) {
            console.log('child comment changed');
            console.log(element);
            updateChildData(element.dataset.childId, element.dataset.parentId, null, null, element.value);
        }

    }
   


    // 子タスク、チェック時の処理
    window.childCheckEvent = function childCheckEvent(isChecked, childId, parentId) {
        // jsonデータをアップデート
        updateChildData(childId, parentId, isChecked, null, null);
    };

    // 親タスクデータアップデート
    function updateParentData(id, name, comment) {
        console.log(`${id}, ${comment}`);
        for(i=0;i<taskData.length;i++) {
            if(Number(taskData[i].id) === Number(id)) {
                if(name) {
                    taskData[i].name = name;
                }
                taskData[i].comment = comment;
                break;
            }
        }
    }

    // 親タスクのチェックを切替
    function checkParent(parentId) {
        for(i=0; i<taskData.length; i++) {
            let numChildren;
            let counter = 0;
            if(Number(taskData[i].id)  ===  Number(parentId)) {
                numChildren =taskData[i].children.filter(function(el) {return Number(el.delete_flag) !== FLAG_ON}).length;
                 // 子タスクの内チェックされている物の数を数える
                 taskData[i].children.forEach((element) => {
                    if(Number(element.delete_flag) !== FLAG_ON && Number(element.check_flag) === FLAG_ON) {
                        counter += 1;
                    }
                });
                // 親タスクのcheck_flagを更新
                if(numChildren !== 0 && numChildren === counter) {
                    taskData[i].check_flag = FLAG_ON;
                } else {
                    taskData[i].check_flag = FLAG_OFF;
                }
                console.log(`alldata: ${taskData}`);
                break;
            }

        }

    }


    // 子タスクデータのアップデート
    function updateChildData(childId, parentId, isChecked, name, comment) {
        taskData.forEach((elParent, indexParent) => {
            if(Number(elParent.id) === Number(parentId)) {
                taskData[indexParent].children.map((elChild, indexChild) => {
                    if(Number(elChild.id) == Number(childId)) {
                        if(isChecked != null) {
                            // 子タスクのcheck_flagを更新
                            taskData[indexParent].children[indexChild].check_flag = isChecked ? FLAG_ON: FLAG_OFF;
                        }
                        if(comment) {
                            // 子タスクのcommentを更新
                            taskData[indexParent].children[indexChild].comment = comment;
                        }
                        if(name) {
                            // 子タスクのnameを更新
                            taskData[indexParent].children[indexChild].name = name;
                        }
                    }
                });
            }
            // 親タスクにチェックをつけるかどうか
            checkParent(parentId);
            // タスクデータを変更したので再びセット
            setParentTask(taskData);
            setChildTask(parentId);
            
        });
        console.log(taskData);
    }

    // 新規作成したタスクのidは一時的にマイナス値に設定 (例) -1,-2,-3....
    let countParentNewTask = -1;
    let countChildNewTask = -1;
    // タスク追加ボタンをクリック
    window.makeTask = function makeTask(element) {
        // 親タスクを追加
        if(Number(element.dataset.flag) === FLAG_OFF) {
            console.log($('#task_name').val());
            const data = {id: countParentNewTask, name: sanitize($('#task_name').val()), check_flag: FLAG_OFF, comment: sanitize($('#task_comment').val()), delete_flag: FLAG_OFF, children: []};
            taskData.push(data);
            countParentNewTask--;
            console.log(taskData);
            setParentTask(taskData);
            closeModal();
        // 子タスクを追加
        }else if(Number(element.dataset.flag) === FLAG_ON) {
            console.log('ok');
            const data = {id: countChildNewTask, name: sanitize($('#task_name').val()), parent_id: element.dataset.parentId, check_flag: FLAG_OFF, comment: sanitize($('#task_comment').val()), delete_flag: FLAG_OFF};
            for(i = 0; i < taskData.length; i++) {
                if(Number(taskData[i].id) === Number(element.dataset.parentId)) {
                    // 親タスクに新規作成した子タスクを追加
                    taskData[i].children.push(data);
                    countChildNewTask--;
                    console.log(taskData);
                    // 親タスクにチェックをつけるか？
                    checkParent(element.dataset.parentId);
                    setParentTask(taskData);
                    setChildTask(element.dataset.parentId);
                    closeModal();
                    break;
                }
            }

        }

    }
    // タスク編集ボタンをクリック
    window.editTask = function editTask(element) {
        // 親タスクを編集
        if(Number(element.dataset.flag) === FLAG_OFF) {
            updateParentData(element.dataset.parentId, sanitize($('#task_name').val()), sanitize($('#task_comment').val()));
            setParentTask(taskData);
            closeModal();
        // 子タスクを編集
        }else if(Number(element.dataset.flag) === FLAG_ON) {
            updateChildData(element.dataset.childId, element.dataset.parentId, null, sanitize($('#task_name').val()), sanitize($('#task_comment').val()));
            closeModal();
        }

    }
    // データ抽出
    function getParentRecord(id) {
        for(i = 0; i < taskData.length; i++) {
            if(Number(taskData[i].id) === Number(id)) {
                return taskData[i];
            }
        }
    }
    function getChildRecord(parentId, childId) {
        for(ip = 0; ip<taskData.length; ip++) {
            if(Number(taskData[ip].id) === Number(parentId)) {
                for(ic = 0; ic < taskData[ip].children.length; ic++) {
                    if(Number(taskData[ip].children[ic].id) === Number(childId)) {
                        return taskData[ip].children[ic];
                    }
                }
                break;
            }
        }
    }

    // 親タスクoption表示の切替
    window.toggleParentOption = function toggleParentOption(parentId) {
        const id = `#optionParent${parentId}`;
        $(id).toggle();

    }
    // 子タスクoption表示の切替
    window.toggleChildOption = function toggleChildOption(childId) {
        const id = `#optionChild${childId}`;
        $(id).toggle();

    }

    // タスク削除
    window.deleteParentTask = function deleteParentTask(parentId) {
        for(i = 0; i<taskData.length; i++) {
            if(Number(taskData[i].id) === Number(parentId)) {
                taskData[i].delete_flag = FLAG_ON;
                // 内包する子タスク全てを削除
                for(ic = 0; ic<taskData[i].children.length; ic++) {
                    taskData[i].children[ic].delete_flag = FLAG_ON;
                }
                break;
            }
        }
        $("#tasks_child").empty();
        $(".comment").val("");
        setParentTask(taskData);
        console.log(taskData);
    }
    window.deleteChildTask = function deleteChildTask(parentId, childId) {
        for(pi = 0; pi<taskData.length; pi++) {
            if(Number(taskData[pi].id) === Number(parentId)) {
                for(ci = 0; ci < taskData[pi].children.length; ci++ ) {
                    if(Number(taskData[pi].children[ci].id) === Number(childId)) {
                        taskData[pi].children[ci].delete_flag = FLAG_ON;
                        break;
                    }
                }
                break;
            }
        }
        checkParent(parentId);
        setParentTask(taskData);
        setChildTask(parentId);
        $(".comment").val("");

    }
   
    // タスク作成,編集モーダルを開く openModal(追加、編集を判別する,親タスク、子タスクを判別,parentId,childId)
    window.openModal = function openModal(typeFlag, flag, parentId, childId) {
        // 新規タスク追加
        if(typeFlag === FLAG_OFF) {
            console.log(parentId);
            // 親タスクを作成するモーダル
            if(flag === FLAG_OFF) {
                $('#task_name').val('');
                $('#task_comment').val('');
                $(".make-task-header").text('新規親タスク作成');
                $("#modal_overlay").css('display', 'block');
                $("#modal_make_task").css('display', 'block');
                $('#task_name').val('');
                $('#task_comment').val('');
                $('.bt-task-add').text('追加');
                $('.bt-task-add').attr({
                    'onclick': 'makeTask(this)',
                    // 親タスクを追加することを示すflag
                    'data-flag': FLAG_OFF,
                });
    
            // 子タスクを作成するモーダル
            } else if (flag === FLAG_ON) {
                if(parentId) {
                    console.log(parentId);
                    const data = getParentRecord(parentId);
                    console.log(data);
                    $('#task_name').val('');
                    $('#task_comment').val('');
                    $("#modal_overlay").css('display', 'block');
                    $("#modal_make_task").css('display', 'block');
                    $(".make-task-header").html(`${data.name}に作成`);
                    $('.bt-task-add').text('追加');
                    $('.bt-task-add').attr({
                        'onclick': 'makeTask(this)',
                        //  子タスクを追加することを示すフラグ
                        'data-flag': FLAG_ON,
                        'data-parent-id': parentId,
                    });
                } else {
                    alert('タスクを選択して下さい');
                }
    
            }
        }
        // タスク編集用モーダル
        if(typeFlag === FLAG_ON) {
            console.log(parentId);
            // 親タスクを編集するモーダル
            if(flag === FLAG_OFF) {
                const data=getParentRecord(parentId);
                $('#task_name').val(reverseSanitize(data.name));
                $('#task_comment').val(reverseSanitize(data.comment));
                $(".make-task-header").html(`${data.name}の編集`);
                $("#modal_overlay").css('display', 'block');
                $("#modal_make_task").css('display', 'block');
                $('.bt-task-add').text('編集');
                // 親タスクを追加することを示すflag
                $('.bt-task-add').attr({
                    'onclick': 'editTask(this)',
                    'data-flag': FLAG_OFF,
                    'data-parent-id': parentId,
                });

            // 子タスクを編集するモーダル
            } else if (flag === FLAG_ON) { 
                if(parentId) {
                    const data = getChildRecord(parentId, childId);
                    console.log(data);
                    $('#task_name').val(reverseSanitize(data.name));
                    $('#task_comment').val(reverseSanitize(data.comment));
                    $("#modal_overlay").css('display', 'block');
                    $("#modal_make_task").css('display', 'block');
                    $(".make-task-header").html(`${data.name}を編集`);
                    $('.bt-task-add').text('編集');
                    $('.bt-task-add').attr({
                        'onclick': 'editTask(this)',
                        //  子タスクを追加することを示すフラグ
                        'data-flag': FLAG_ON,
                        'data-parent-id': parentId,
                        'data-child-id': childId,
                    });
                } else {
                    alert('タスクを選択して下さい');
                }

            }
        }
    }

    // モーダルを閉じる
    $('#modal_overlay').click(() => {
        closeModal()
    });
    window.closeModal = function closeModal() {
        $('#modal_overlay').css('display', 'none');
        $('#modal_make_task').css('display', 'none');
    }


    // データをバックエンドに送信
    window.submitData = function submitData() {
        $.ajax({
            url: "/home/dataStore",
            type: 'POST',
            dataType: 'json',
            data: {taskDataNew: taskData, taskDataOrg: taskDataOrg, timestamp: timestamp},
        }).done(function(data) {
            console.log(data);
            alert(data.isOK);
            location.reload();
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(errorThrown);
            alert('変更の保存に失敗しました。');
        })
    }

    // サニタイズ
    function sanitize(str) {
        return String(str).replace(/&/g,"&amp;")
          .replace(/"/g,"&quot;")
          .replace(/</g,"&lt;")
          .replace(/>/g,"&gt;")
    }
    // リバースサニタイズ
    function reverseSanitize(str) {
        return String(str).replace(/&amp;/g,"&")
          .replace(/&quot;/g,'"')
          .replace(/&lt;/g,"<")
          .replace(/&gt;/g,">")
    }
});
