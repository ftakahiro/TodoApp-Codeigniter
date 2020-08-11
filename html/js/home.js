$(function(){
    // タスクデータを取得
    $.ajax({
        url:'/home/getdata',
        method:'GET',
        dataType:'json',
    })
    .done(function(data){
        window.taskData=data;
        setParentTask(taskData);
        console.log(taskData);
    });
    
    // 親タスクを設置
    function setParentTask(taskData){
        $("#tasks_parent").empty();
        taskData.forEach((element)=>{
            let rowTask=`
            <div id="row_parent_${element.id}" class="row-task task-parent" data-id="${element.id}" data-name="${element.name}" data-comment="${element.comment}" onclick="setChildTask(${element.id});setParentComment(${element.id})">
                <div class="row_task_name">
                    <input id="parent_${element.id}" type="checkbox" data-id="${element.id}" disabled="disabled" ${(element.check_flag=="1")? 'checked="checked"':''}>
                    <label for="parent_${element.id}">${element.name}</label>
                </div>
                <div class="area-option">
                    <img class="icon-option" src="/img/option.png" alt="option icon" onclick="toggleParentOption(${element.id})">
                    <div class="options" id="optionParent${element.id}">
                        <div data-parent-id="${element.id}" onclick="deleteParentTask(${element.id})">削除</div>
                        <div data-parent-id="${element.id}" onclick="openModal(1,0,${element.id},null)">編集</div>
                    </div>
                </div>
            </div>`;
            $("#tasks_parent").append(rowTask);
        });
    }

    // 親タスククリック時に子タスクを設置
    var parentFocused;
    window.setChildTask=function setChildTask(parentId){
        // 子タスクを内包する親タスクを検索
        let targetParentTask;
        targetParentTask=taskData.filter((item,index)=>{
            if(item.id==parentId) return true;
        })[0];

        // 親タスクにフォーカスを当てる
        if(parentFocused){
            $(parentFocused).css('background-color','white');
        }
        parentFocused=`#row_parent_${targetParentTask.id}`
        $(parentFocused).css('background-color','#FEE715');
        
        // 子タスクを設置
        $("#tasks_child").empty();
        targetParentTask.children.forEach((element)=>{
            let rowTask=`
                <div id="row_child_${element.id}" class="row-task" data-parent="${targetParentTask.name}" data-child="${element.name}" data-child-id="${element.id}" data-parent-id="${targetParentTask.id}" data-comment="${element.comment}"  onclick="setChildComment(this)">
                    <div class="row_task_name">
                        <input class="child_checkbox" id="child_${element.id}" type="checkbox" ${(element.check_flag=="1")? 'checked="checked"':''} data-id="${element.id}" onchange="childCheckEvent(this.checked,${element.id},${element.parent_id})">
                        <label for="child_${element.id}">${element.name}</label>
                    </div>
                    <div class="area-option">
                        <img class="icon-option" src="/img/option.png" alt="option icon" onclick="toggleChildOption(${element.id})">
                        <div class="options" id="optionChild${element.id}">
                            <div data-parent-id="${element.id}" onclick="deleteChildTask(${targetParentTask.id},${element.id})">削除</div>
                            <div data-parent-id="${element.id}" onclick="openModal(1,1,${targetParentTask.id},${element.id})">編集</div>
                        </div>
                    </div>
                </div>`;
            $("#tasks_child").append(rowTask);
        });

        // 子タスク作成ボタンに親タスクの情報を埋め込み
        $('#bt_add_child_task').attr({
            'data-parent-id':targetParentTask.id,
        });
        
    }

    // 親タスクのコメントをセット
    window.setParentComment=function setParentComment(id){
        const dataSet=getParentRecord(id);
        $('.comment-header').text(dataSet.name);
        $('.comment').val(dataSet.comment);
        $('.comment').attr({
            'data-flag':'0', // 親タスクのコメントであることを示すフラグ
            'data-id':`${dataSet.id}`,
        });
    }

    // 子タスクのコメントをセット
    var childFocused;
    window.setChildComment=function setChildComment(element){
        // 子タスクにフォーカスを当てる
        if(childFocused){
            $(childFocused).css('background-color','white');
        }
        childFocused=`#row_child_${element.dataset.childId}`;
        $(childFocused).css('background-color','#FEE715');

        $('.comment-header').text(`${element.dataset.parent} > ${element.dataset.child}`);
        $('.comment').val(element.dataset.comment);
        $('.comment').attr({
            'data-flag':'1', // 子タスクのコメントであることを示すフラグ
            'data-child-id':`${element.dataset.childId}`,
            'data-parent-id':`${element.dataset.parentId}`,
        });
       

    }

    // コメントが変更された時
    window.updateComment=function updateComment(element){
        if(element.dataset.flag=="0"){
            console.log('parent comment changed');
            updateParentData(element.dataset.id,null,element.value);
        }
        if(element.dataset.flag=="1"){
            console.log('child comment changed');
            console.log(element);
            updateChildData(element.dataset.childId,element.dataset.parentId,null,null,element.value);
        }

    }
   


    // 子タスク、チェック時の処理
    window.childCheckEvent=function childCheckEvent(isChecked,childId,parentId){
        // jsonデータをアップデート
        updateChildData(childId,parentId,isChecked,null,null);
    };

    // 親タスクデータアップデート
    function updateParentData(id,name,comment){
        console.log(`${id},${comment}`);
        for(i=0;i<taskData.length;i++){
            if(taskData[i].id==id){
                if(name){
                    taskData[i].name=name;
                }
                taskData[i].comment=comment;
                break;
            }
        }
    }

    // 親タスクのチェックを切替
    function checkParent(parentId){
        for(i=0; i<taskData.length; i++){
            let numChildren;
            let counter=0;
            if(taskData[i].id == parentId){
                numChildren=taskData[i].children.length;
                 // 子タスクの内チェックされている物の数を数える
                 taskData[i].children.forEach((element)=>{
                    if(element.check_flag=="1"){
                        counter += 1;
                    }
                });
                // 親タスクのcheck_flagを更新
                if(numChildren==counter){
                    taskData[i].check_flag="1";
                } else {
                    taskData[i].check_flag="0";
                }
                console.log(`alldata:${taskData}`);
                break;
            }

        }

    }


    // 子タスクデータのアップデート
    function updateChildData(childId, parentId, isChecked, name,comment){
        taskData.forEach((elParent, indexParent)=>{
            if(elParent.id==parentId){
                taskData[indexParent].children.map((elChild,indexChild)=>{
                    if(elChild.id==childId){
                        if(isChecked!=null){
                            // 子タスクのcheck_flagを更新
                            taskData[indexParent].children[indexChild].check_flag=isChecked ? "1": "0";
                        }
                        if(comment){
                            // 子タスクのcommentを更新
                            taskData[indexParent].children[indexChild].comment=comment;
                        }
                        if(name){
                            // 子タスクのnameを更新
                            taskData[indexParent].children[indexChild].name=name;
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
    let countParentNewTask=-1;
    let countChildNewTask =-1;
    // タスク追加ボタンをクリック
    window.makeTask=function makeTask(element){
        // 親タスクを追加
        if(element.dataset.flag==0){
            console.log($('#task_name').val());
            const data={id:countParentNewTask,name:$('#task_name').val(),check_flag:'0',comment:$('#task_comment').val(),del_flag:'0',children:[]};
            taskData.push(data);
            countParentNewTask--;
            console.log(taskData);
            setParentTask(taskData);
            closeModal();
        // 子タスクを追加
        }else if(element.dataset.flag==1){
            const data={id:countChildNewTask,name:$('#task_name').val(),parent_id:element.dataset.parentId,check_flag:'0',comment:$('#task_comment').val(),del_flag:'0'};
            for(i=0;i<taskData.length;i++){
                if(taskData[i].id==element.dataset.parentId){
                    // 親タスクに新規作成した子タスクを追加
                    taskData[i].children.push(data);
                    countChildNewTask--;
                    console.log(taskData);
                    setChildTask(element.dataset.parentId);
                    closeModal();
                    break;
                }
            }

        }

    }
    // タスク編集ボタンをクリック
    window.editTask=function editTask(element){
        // 親タスクを編集
        if(element.dataset.flag==0){
            updateParentData(element.dataset.parentId,$('#task_name').val(),$('#task_comment').val());
            setParentTask(taskData);
            closeModal();
        // 子タスクを追加
        }else if(element.dataset.flag==1){
            updateChildData(element.dataset.parentId,element.dataset.childId,null,$('#task_name').val(),$('#task_comment').val());
            closeModal();
        }

    }
    // データ抽出
    function getParentRecord(id){
        for(i=0;i<taskData.length;i++){
            if(taskData[i].id==id){
                return taskData[i];
            }
        }
    }
    function getChildRecord(parentId,childId){
        for(ip=0; ip<taskData.length;ip++){
            if(taskData[ip].id==parentId){
                for(ic=0; ic<taskData[ip].children.length; ic++){
                    if(taskData[ip].children[ic].id==childId){
                        return taskData[ip].children[ic];
                    }
                }
                break;
            }
        }
    }

    // 親タスクoption表示の切替
    window.toggleParentOption=function toggleParentOption(parentId){
        const id=`#optionParent${parentId}`;
        $(id).toggle();

    }
    // 子タスクoption表示の切替
    window.toggleChildOption=function toggleChildOption(childId){
        const id=`#optionChild${childId}`;
        $(id).toggle();

    }

    // タスク削除
    window.deleteParentTask=function deleteParentTask(parentId){
        for(i=0; i<taskData.length; i++){
            if(taskData[i].id==parentId){
                taskData.splice(i,1);
                break;
            }
        }
        console.log(taskData);
        setParentTask(taskData);
        $("#tasks_child").empty();

    }
    window.deleteChildTask=function deleteChildTask(parentId,childId){
        for(pi=0; pi<taskData.length; pi++){
            if(taskData[pi].id==parentId){
                for(ci=0; ci<taskData[pi].children.length; ci++ ){
                    if(taskData[pi].children[ci].id==childId){
                        taskData[pi].children.splice(ci,1);
                        break;
                    }
                }
                break;
            }
        }
        setChildTask(parentId);

    }
   
    // タスク作成,編集モーダルを開く openModal(追加、編集を判別する,親タスク、子タスクを判別,parentId,childId)
    window.openModal=function openModal(typeFlag,flag,parentId,childId){
        // 新規タスク追加
        if(typeFlag==0){
            console.log(parentId);
            // 親タスクを作成するモーダル
            if(flag==0){
                $('#task_name').val('');
                $('#task_comment').val('');
                $(".make-task-header").text('');
                $("#modal_overlay").css('display','block');
                $("#modal_make_task").css('display','block');
                $('#task_name').val('');
                $('#task_comment').val('');
                $('.bt-task-add').text('追加');
                $('.bt-task-add').attr({
                    'onclick':'makeTask(this)',
                    // 親タスクを追加することを示すflag
                    'data-flag':0,
                });
    
            // 子タスクを作成するモーダル
            }else if(flag==1){
                if(parentId){
                    const data=getParentRecord(parentId);
                    console.log(data);
                    $('#task_name').val('');
                    $('#task_comment').val('');
                    $("#modal_overlay").css('display','block');
                    $("#modal_make_task").css('display','block');
                    $(".make-task-header").text(`${data.name}に作成`);
                    $('.bt-task-add').text('追加');
                    $('.bt-task-add').attr({
                        'onclick':'makeTask(this)',
                        //  子タスクを追加することを示すフラグ
                        'data-flag':1,
                        'data-parent-id': parentId,
                    });
                }else{
                    alert('タスクを選択して下さい');
                }
    
            }
        }
        // タスク編集用モーダル
        if(typeFlag==1){
            console.log(parentId);
            // 親タスクを編集するモーダル
            if(flag==0){
                const data=getParentRecord(parentId);
                $('#task_name').val(data.name);
                $('#task_comment').val(data.comment);
                $(".make-task-header").text(`${data.name}の編集`);
                $("#modal_overlay").css('display','block');
                $("#modal_make_task").css('display','block');
                $('.bt-task-add').text('編集');
                // 親タスクを追加することを示すflag
                $('.bt-task-add').attr({
                    'onclick':'editTask(this)',
                    'data-flag':0,
                    'data-parent-id':parentId,
                });

            // 子タスクを編集するモーダル
            }else if(flag==1){
                if(parentId){
                    const data=getChildRecord(parentId,childId);
                    console.log(data);
                    $('#task_name').val(data.name);
                    $('#task_comment').val(data.comment);
                    $("#modal_overlay").css('display','block');
                    $("#modal_make_task").css('display','block');
                    $(".make-task-header").text(`${data.name}を編集`);
                    $('.bt-task-add').text('編集');
                    $('.bt-task-add').attr({
                        'onclick':'editTask(this)',
                        //  子タスクを追加することを示すフラグ
                        'data-flag':1,
                        'data-parent-id': parentId,
                        'data-child-id':childId,
                    });
                }else{
                    alert('タスクを選択して下さい');
                }

            }
        }
    }

    // モーダルを閉じる
    $('#modal_overlay').click(()=>{
        closeModal()
    });
    window.closeModal=function closeModal(){
        $('#modal_overlay').css('display','none');
        $('#modal_make_task').css('display','none');
    }


    // データをバックエンドに送信
    window.submitData= function submitData(){
        $.ajax({
            url: "/dataStore",
            type:'POST',
            dataType: 'json',
            data : taskData,
            timeout:3000,
        }).done(function(data) {
                          alert("ok");
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
                         alert("error");
        })
    }







});

// 引数にスペース
// 命名をわかりやすく 単語3つまで