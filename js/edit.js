function editReset() {
    for (let x of all('.learn_page .highlight')) {
        x.removeAttribute('contenteditable');
        x.className = 'highlight';
        x.onclick = null;
        x.style.userSelect = '';
    }
    $('.learn_page .text_box').removeAttribute('contenteditable');
    $('.learn_page .text_box').classList.remove('del');
    // $('.learn_page .title').classList.remove('canwrite');
    flag = false;
    flag1 = false;
    learn_flag_1 = true;
    learn_flag_2 = true;
    $('.learn_page .title').disabled = true;
}

let bianji = false;
let zidingyi = false;
//点击自定义
$('.zidingyi').onclick = () => {
    if (moxiele) {
        getUserAnswer();
        console.log("默写了，保存当前答案！")
    }
    zidingyi = true;
    judge_hasRecord_ajax();
    if (!judge_firstEdit) {
        answerReset()
    }
    learnReset();
    $('.learn_page .footer_1').style.display = 'none';
    $('.learn_page .footer_2').style.display = 'block';

}

//点击编辑
$('.bianji').onclick = () => {
    editReset();
    $('.wakong').classList.remove('choice');
    $('.bianji').classList.toggle('choice');
    // $('.learn_page .title').classList.add('canwrite');
    if ($('.bianji').classList.contains('choice')) {
        $('.learn_page .title').disabled = false;
        $('.learn_page .text_box').setAttribute('contenteditable', true);
        bianji = true;
        let keycode = 0;
        //当用户按下回车时
        $(".learn_page .text_box").onkeyup = (e) => {

            //将嵌套在高亮标签中的br拿到外面，并删除该标签
            for (let x of all(".learn_page .highlight")) {
                if (x.innerHTML == '<br>') {
                    $('.learn_page .text_box').insertBefore(x.childNodes[0], x);
                    $(".learn_page .text_box").removeChild(x);
                }

            }
            //如果是回车则删除富文本编辑器自动添加的div
            if (e.keyCode == 13) {

                let txt = window.getSelection();
                let range = txt.getRangeAt(0);

                for (let x of all(".learn_page .text_box div")) {
                    if (!x.classList.contains('highlight')) {
                        let br = document.createElement("br");
                        range.setStartBefore(x)
                        range.insertNode(br);
                        range.setStartAfter(br);
                        range.setEndAfter(br);
                        //将节点放入数组并逐个插入
                        let arrr = [];
                        for (let k of x.childNodes) {
                            if (k.nodeType == '3' && (k.textContent == '\n' || k.textContent == ''))
                                continue;
                            arrr.push(k);
                        }

                        for (let i = 0; i < arrr.length; i++) {
                            if (i == arrr.length - 1 && arrr[i].nodeName == 'BR')
                                continue;
                            console.log(arrr[i]);
                            $('.learn_page .text_box').insertBefore(arrr[i], x);
                        }
                        if (keycode == 13) {
                            $(".learn_page .text_box").removeChild(br);
                        }
                        $(".learn_page .text_box").removeChild(x);
                    }
                }
            }

            keycode = e.keyCode;
        }

        $(".learn_page .text_box").onclick = () => {
            keycode = 0;
        }
    }
}

//防止对已选中的文本进行多次挖空
let flag = true;
//防止退出选择模式后可选择节点
let flag1 = true;
//数组用来存放被选中的节点
let arr = [];

//点击挖空进入挖空模式
$('.wakong').onclick = () => {
    if (judeg_hasRecord == 1) {
        $(".popup3").style.height = 164/3.95 + 'px';
        $(".popup3").style.display = 'block';
        $(".popup3 .save_tips").innerHTML = "检测到您有学习记录，重新挖空后会将学习记录清除，您确定要继续吗？";
        $(".popup3 .selection .yes").onclick = () => {
            $(".popup3").style.height = 136/3.95 + 'px';
            judge_firstEdit = true
            judge_restart = 1;
            get_learn_ajax();
            editReset();
            $('.wakong').classList.add('choice');
            flag = true;
            $(".popup3").style.display = 'none';
        }
        $(".popup3 .selection .no").onclick = () => {
            $(".popup3").style.height = 136/3.95 + 'px';
            $('.wakong').classList.remove('choice');
            flag = false;
            $(".popup3").style.display = 'none';
        }
    } else {
        editReset();
        $('.wakong').classList.add('choice');
        flag = true;
    }



    $('.bianji').classList.remove('choice');
    //当长按屏幕触屏结束时，选中文本 
    $('.learn_page .text_box').ontouchstart = () => {
        $('.learn_page .text_box').style.userSelect = '';
    }
    $('.learn_page .text_box').onmousedown = () => {
        $('.learn_page .text_box').style.userSelect = '';
    }
    $('.learn_page .text_box').ontouchend = wakong;
    $('.learn_page .text_box').onmouseup = wakong;

    function wakong() {
        //判断当前是否为挖空模式
        if ($('.wakong').classList.contains('choice')) {
            flag = true;
        } else {
            flag = false;
        }
        //获取当前选中的文本对象
        let txt = window.getSelection();
        //如果选中文本不为空且为挖空模式时

        if (txt.toString().length > 0 && flag) {
            //判断是否需要合并div
            let n = 0;
            // 获取当前selection对象下的range对象
            let range = txt.getRangeAt(0);
            // 创造id为merge的新节点并将选中文本放进去
            let newNode = document.createElement("div");
            newNode.setAttribute('class', 'highlight');
            newNode.setAttribute('id', 'merge');
            newNode.innerHTML = range.toString();
            //如果选中范围在div里面直接终止点击事件
            if (txt.anchorNode.parentNode === txt.focusNode.parentNode && txt.anchorNode.parentNode.className != 'text_box' && txt.focusNode.parentNode.className != 'text_box') {
                CancelHollowing(txt.anchorNode.parentNode, false);
                return;
            }
            if (txt.anchorNode.parentNode.className == 'container' || txt.focusNode.parentNode.className == 'container') {
                return;
            }
            //循环存储之前被选中的节点
            for (let x of arr) {
                //防止出现空节点
                if (!(x instanceof Node)) {
                    arr.remove(x);
                } //选中文本包含之前被选中的节点的全部
                else if (txt.containsNode(x, false)) {
                    continue;
                } //选中文本包含之前被选中的节点的一部分时，给之前被选中的节点添加id可标识
                else if (txt.containsNode(x, true)) {
                    x.setAttribute('id', 'merge');
                    n++;
                }
            }

            //将选中的文本区域在页面删除并插入新节点
            txt.deleteFromDocument();
            range.insertNode(newNode);
            //获取已标记的节点
            let div = $('#merge');

            // 当n大于0时，需要合并节点
            if (n > 0) {
                for (let i = 1; i < div.length; i++) {
                    // 将第二个节点到最后一个节点合并到第一个节点中，并且从数组和页面中删除
                    if (div.length > 1) {
                        div[0].innerHTML += div[i].innerHTML;
                    }
                    arr.remove(div[i]);
                    $('.learn_page .text_box').removeChild(div[i]);
                }
                // 移除id
                div[0].removeAttribute('id');
            } else {
                div.removeAttribute('id');
            }
            flag = false;

            // 将原数组清空，重新将选中节点添加进数组中
            arr = [];
            //清除空标签
            for (let x of all('.learn_page .highlight')) {
                if (x.innerHTML == '')
                    $('.learn_page .text_box').removeChild(x);
            }
            let len = all('.learn_page .highlight').length;
            for (let i = 0; i < len; i++) {
                let x = all('.learn_page .highlight')[i];
                //清除高亮标签后面的空文本
                function clean() {
                    if (x.nextSibling) {
                        if (x.nextSibling.textContent == '') {
                            $('.learn_page .text_box').removeChild(x.nextSibling);
                        }
                    }

                }
                clean();
                //如果两个标签相邻时合并
                if (x.nextSibling.className == 'highlight') {
                    x.innerHTML += all('.learn_page .highlight')[i + 1].innerHTML;
                    len--;
                    $('.learn_page .text_box').removeChild(all('.learn_page .highlight')[i + 1]);
                    clean();
                    console.log(all('.learn_page .highlight')[i + 1], x.nextSibling);
                    //如果合并后下一个标签还是相邻，就把标签合并
                    if (x.nextSibling.className == 'highlight') {

                        x.innerHTML += all('.learn_page .highlight')[i + 1].innerHTML;
                        len--;
                        $('.learn_page .text_box').removeChild(all('.learn_page .highlight')[i + 1]);
                    }

                    arr.push(x);
                } else {
                    arr.push(x);
                }

            }

        }
        //取消文本选择
        // $('.learn_page .text_box').style.userSelect = 'none';
    }
}

//点击弹出系统挖空弹窗
$('.xtwakong').onclick = () => {
    editReset();
    if (judeg_hasRecord == 1) {
        $(".popup3").style.height = 164/3.95 + 'px';
        $(".popup3").style.display = 'block';
        $(".popup3 .save_tips").innerHTML = "检测到您有学习记录，重新挖空后会将学习记录清除，您确定要继续吗？";
        $(".popup3 .selection .yes").onclick = () => {
            $(".popup3").style.height = 136/3.95 + 'px';
            judge_firstEdit = true
            judge_restart = 1;
            get_learn_ajax();
            $('.learn_page .popup4').style.display = 'block';
            $(".popup3").style.display = 'none';
        }
        $(".popup3 .selection .no").onclick = () => {
            $(".popup3").style.height = 136/3.95 + 'px';
            $(".popup3").style.display = 'none';
        }
    } else {
        $('.learn_page .popup4').style.display = 'block';
    }
}

let mid = null;
//点击保存
$('.learn_page .finish').onclick = () => {

    let title1 = $('.learn_page .title').value;
    let info1 = $('.learn_page .text_box').innerHTML;
    let label1 = $('.learn_page .label').innerHTML;
    let fal = true;

    //标题和文本内容不能为空
    if (title1 == '' || info1 == '') {
        $('.learn_page .popup2 .popup_box').innerHTML = '内容不能为空';
        $('.learn_page .popup2').style.display = 'block';
        fal = false;
        return;
    }

    editReset();

    //如果是新建模板
    if (newTPFlag) {
        mid = all('.my_base li')[0].querySelector('.modleId').innerHTML;
    } else {
        mid = modleId.innerHTML;
    }


    // 标题一致就取消保存并提醒
    Array.from(all('.my_base .title')).forEach((x, i) => {
        if (x.innerHTML == title1 && mid != all('.my_base li')[i].querySelector('.modleId').innerHTML) {
            $('.learn_page .popup2 .popup_box').innerHTML = '标题不能重复';
            $('.learn_page .popup2').style.display = 'block';
            fal = false;
            return;
        }
    })

    if (fal) {
        $(".popup3").style.display = 'block';
        $(".popup3 .save_tips").innerHTML = "是否保存当前挖空？";
        $(".popup3 .selection .yes").onclick = () => {
            if (mStatus == '0') {
                if (newTPFlag) {
                    all('.my_base li')[0].querySelector('.title').innerHTML = title1;
                    all('.my_base li')[0].querySelector('.info').innerHTML = info1;
                    all('.my_base li')[0].querySelector('.label_title').innerHTML = label1;
                } else {
                    title.innerHTML = title1;
                    info.innerHTML = info1;
                    label.querySelectorAll('span')[1].innerHTML = label1;
                }
            }
            let newinfo = info1.replace(/&nbsp;/g, '<空格>');
            console.log(newinfo);
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/MakeModle",
                type: "post",
                data: {
                    context: newinfo,
                    modleTitle: title1,
                    overWrite: 1 - mStatus,
                    modleLabel: labelId1(label1),
                    modleId: mid
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    zidingyi = false;
                    bianji = false;
                    $('.learn_page .popup2 .popup_box').innerHTML = '保存成功';
                    $('.learn_page .popup2').style.display = 'block';
                    $('.learn_page .footer_1').style.display = 'block';
                    $('.learn_page .footer_2').style.display = 'none';
                    if (mStatus == 1) {
                        let modle = msg.data.modle;
                        newTPFlag = true;
                        newTP(title1, info1, modle.modleId, label1, 0, '未学习', true);
                        mStatus = 0;
                        $('.footer_nav li')[0].onclick();


                    } else {
                        xrcomTP();
                    }
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                    $('.learn_page .popup2 .popup_box').innerHTML = '保存失败';
                    $('.learn_page .popup2').style.display = 'block';
                }
            });
            $(".popup3").style.display = 'none';
        }
        $(".popup3 .selection .no").onclick = () => {
            $(".popup3").style.display = 'none';
        }

    }

}

//点击关闭弹窗
$('.learn_page .popup4').onclick = () => $('.learn_page .popup4').style.display = 'none';
//阻止事件冒泡
$('.learn_page .popup4 .popup_box').onclick = (e) => e.stopPropagation();

//选择难度
for (let x of $('.select_diff .com')) {
    x.onclick = () => {
        editReset();
        for (let k of $('.select_diff .com')) {
            k.classList.remove('active');
        }
        x.classList.add('active');
    }
}

//选中进入系统挖空
$('.learn_page .popup4 .context').onclick = () => {
    for (let x of $('.select_diff .com')) {
        if (x.classList.contains('active')) {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/autoDig",
                type: "post",
                data: {
                    difficulty: difficulty(x.innerHTML),
                    modleId: modleId.innerHTML
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.content == '挖空成功') {
                        $('.learn_page .text_box').innerHTML = msg.data.content;
                        for (let k of all('.learn_page .text_box div')) {
                            k.classList.add('highlight');
                        }

                    }
                    $('.learn_page .popup4').style.display = 'none';
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                    $('.learn_page .popup4').style.display = 'none';
                }
            });
        }

    }


    function difficulty(str) {
        if (str == '简单') {
            return 'easy';
        } else if (str == '中等') {
            return 'normal';
        } else if (str == '困难') {
            return 'hard';
        }
    }
}

//选择节点函数点击选中div中所有内容，点击取消挖空,参数e为选中节点，n为判断是否自动点击
function CancelHollowing(e, n) {
    //防止多次点击事件
    let flag2 = true;
    //获取当前选中的文本对象
    let txt = window.getSelection();
    let range = txt.getRangeAt(0);

    // //将选中节点的文本内容克隆一份
    let nonestr = document.createTextNode('');
    let text = document.createTextNode(range.toString());
    // //将选中节点删除
    txt.deleteFromDocument();
    // //在原来的位置重新将文本插入
    range.insertNode(nonestr);
    let textArr = e.childNodes;

    //在原标签前面插入新节点
    function newNode(i) {
        let newNode = document.createElement("div");
        newNode.setAttribute('class', 'highlight');
        newNode.innerHTML = textArr[i].textContent;
        $('.learn_page .text_box').insertBefore(newNode, e);
    }

    if (textArr[0].textContent == '') {
        $('.learn_page .text_box').insertBefore(text, e);
        newNode(2);
        $('.learn_page .text_box').removeChild(e);
    } else {
        newNode(0);
        $('.learn_page .text_box').insertBefore(text, e);
        if (textArr[1].textContent == '' && textArr[2].textContent != '') {
            newNode(2);
        }
        $('.learn_page .text_box').removeChild(e);
    }


    //取消文本选择
    $('.learn_page .text_box').style.userSelect = 'none';
}

//点击返回记忆库
$('.edit_page .header_left').onclick = () => {
    $('.edit_page').style.left = '100%'
    learnReset()
}



let label_flag1 = true;
//点击出现下拉列表
$('.learn_page .label').onclick = (e) => {
    e.stopPropagation();
    if (bianji) {
        if (label_flag1) {
            $('.learn_page .label_menu').style.transform = 'scale(1)';
            label_flag1 = false;
        } else {
            $('.learn_page .label_menu').style.transform = 'scale(0)';
            label_flag1 = true;
        }
    }

}

//事件委托，为li绑定事件
$('.learn_page .label_menu ul').onclick = (e) => {
    if (e.target.tagName == 'LI') {
        $('.learn_page .header_right .label').innerHTML = e.target.innerHTML;
    }
}

//富文本防注入
$(".learn_page .text_box").onpaste = () => {
    setTimeout(() => {
        $(".learn_page .text_box").innerHTML = clearHtml($(".learn_page .text_box").innerHTML);
    }, 10);
}

