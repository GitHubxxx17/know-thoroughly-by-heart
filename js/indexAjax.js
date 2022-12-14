//上传文件
let newtitle = null;
let newcontext = null;
let newlabel = null;
var newTPFlag = false;
let pk = [];
let scModleId = []; //收藏的模板id
let hasrecords = []; //保存返回的没有记录的模板

//获取用户模板
function UserMemory() {
    ajax({
        url: "http://8.134.104.234:8080/ReciteMemory/modle/UserMemory",
        type: "GET",
        data: {},
        flag: true,
        dataType: "json",
        flag: true,
        success: function(res, xml) {
            let msg = JSON.parse(res).msg;
            console.log(msg)
                // console.log(msg.data.haveRecord)
                // hasrecords = [];
                // for (e in msg.data.haveRecord) {
                //     if (msg.data.haveRecord[e] == true) {
                //         hasrecords.push(e);
                //         console.log(hasrecords);
                //     }
                // }

            if (msg.data.userModle) {
                let tparr = msg.data.userModle;
                let fxnum = 0;
                for (let x of tparr) {
                    let newcon = x.content.replace(/<空格>/g, '&nbsp;').replace(/<\/p>/g, '').replace(/<p>/g, '');
                    if (x.MStatus == '0')
                        newTP(x.modleTitle, newcon, x.modleId, labelId2(x.modleLabel), x.common, x.studyStatus, true);
                    else
                        newTP(x.modleTitle, newcon, x.modleId, labelId2(x.modleLabel), x.common, x.studyStatus, false);

                    if (x.studyStatus == '复习中') {
                        fxnum++;
                        console.log(x, x.studyStatus);
                    }

                }
                // $('.numOfArticles').innerHTML = `${fxnum} 篇`;
                $('.footer_nav li')[0].onclick();
            } else {
                //刷新仓库
                $('.footer_nav li')[0].onclick();
            }
        },
        fail: function(status) {
            // 此处放失败后执行的代码
            console.log(status);
        }
    });

}
UserMemory();
//获取用户信息
ajax({
    url: "http://8.134.104.234:8080/ReciteMemory/user.do/UserMsg",
    type: "GET",
    data: {},
    dataType: "json",
    flag: true,
    success: function(res, xml) {
        let msg = JSON.parse(res).msg;
        let userInfo = msg.data.user;
        curr['userInfo'] = userInfo;
        console.log(curr);
        if (auto) {
            localSaveData('current_user', curr);
        } else {
            sessionSaveData('current_user', curr);
        }
        //个人页面渲染
        for (let x of $('.idname'))
            x.innerHTML = curr.userInfo.nickName;
        $('.personal_box .phone').innerHTML = curr.phone;

        rlRendering()
        if (curr.userInfo.base64 == '') {
            return;
        } else {
            let img = 'data:image/jpeg;base64,' + curr.userInfo.base64;
            for (let x of $('.head_portrait img')) {
                x.src = curr.userInfo.base64;
            }
        }
    },
    fail: function(status) {
        // 此处放失败后执行的代码
        console.log(status);
    }
});


//获取用户学习信息
var Alltime = 0;
var studyNums = 0;
getStoreDSSD(true)

function getStoreDSSD(flag) {
    ajax({
        url: "http://8.134.104.234:8080/ReciteMemory/inf.get/studyData",
        type: "GET",
        data: {},
        dataType: "json",
        flag: true,
        success: function(res, xml) {
            let msg = JSON.parse(res).msg;
            console.log(msg);
            if (msg.content == "获取失败") {
                $('.plan_box .record_box .cur_data')[0].innerHTML = 0;
                $('.plan_box .record_box .cur_data')[1].innerHTML = 0;
                $('.today_review .cur').innerHTML = 0;
            } else {
                let studyData = msg.data.studyData;
                $('.plan_box .record_box .cur_data')[0].innerHTML = studyData.studyTime;
                $('.plan_box .record_box .cur_data')[1].innerHTML = studyData.studyNums;
                $('.today_review .cur').innerHTML = studyData.reviewNums;
                Alltime = studyData.studyTime*60;
                studyNums = studyData.studyNums;
            }
            if (flag)
                fxPeriod();
        },
        fail: function(status) {
            // 此处放失败后执行的代码
            console.log(status);
        }
    });
}


//上传文件
$('.Making_page .header_left input').onchange = function(e) {
    console.log(e.target.files);
    let file = e.target.files[0];
    if (e.target.files.length != 0) {
        $('.Making_page .loading').style.display = 'block';
        let fd = new FormData($('.upload_form'));
        ajax({
            url: `http://8.134.104.234:8080/ReciteMemory/upload/parseContent?kuohao=${kuohao}`,
            type: "post",
            data: fd,
            dataType: "json",
            flag: false,
            success: function(res, xml) {
                $('.Making_page .loading').style.display = 'none';
                let msg = JSON.parse(res).msg;
                let context = msg.data.context;
                let newcon = context.replace(/<\/p>/g, '').replace(/<p>/g, '');
                //将文件内容渲染到页面
                $('.Making_page .title input').value = file.name;
                $('.Making_page .text_box').innerHTML = newcon;
                e.target.value = '';
            },
            fail: function(status) {
                // 此处放失败后执行的代码
                console.log(status);
                $('.Making_page .loading').style.display = 'none';
                $('.Making_page .popup2 .popup_box').innerHTML = '文件解析失败';
                $('.Making_page .popup2').style.display = 'block';
            }
        });
    }
}

//点击出现弹窗
$('.Making_page .header_right').onclick = () => {
    //标题和文本内容不能为空
    if ($('.Making_page .title input').value == '' || $('.Making_page .text_box').innerHTML == '') {
        $('.Making_page .popup2 .popup_box').innerHTML = '内容不能为空';
        $('.Making_page .popup2').style.display = 'block';
        return;
    }

    //标签不能为空
    if ($('.Making_page .label_cont').innerText == '标签 ') {
        $('.Making_page .popup2 .popup_box').innerHTML = '请选择标签';
        $('.Making_page .popup2').style.display = 'block';
        return;
    }

    // 标题一致就取消保存并提醒
    for (let x of all('.my_base .title')) {
        if (x.innerHTML == $('.Making_page .title input').value) {
            $('.Making_page .popup2 .popup_box').innerHTML = '标题不能重复';
            $('.Making_page .popup2').style.display = 'block';
            return;
        }
    }
    $('.Making_page .popup').style.display = 'block';
    newtitle = $('.Making_page .title input').value;
    newcontext = $('.Making_page .text_box').innerHTML;
    newlabel = $('.Making_page .label_cont').innerHTML;
};
//点击关闭弹窗
$('.Making_page .popup').onclick = () => $('.Making_page .popup').style.display = 'none';
$('.Making_page .popup2').onclick = () => $('.Making_page .popup2').style.display = 'none';
//阻止事件冒泡
$('.Making_page .popup .popup_box').onclick = (e) => e.stopPropagation();
$('.Making_page .popup2 .popup_box').onclick = (e) => e.stopPropagation();

//点击保存文件
$('.Making_page .popup .popup_box button')[0].onclick = () => {

    // 如果标题和内容不为空
    if (newtitle != '' && newcontext != '') {
        //创建模板
        let newcon = newcontext.replace(/&nbsp;/g, '<空格>');
        let contect = encodeURI(newcon);

        ajax({
            url: "http://8.134.104.234:8080/ReciteMemory/modle/MakeModle",
            type: "post",
            data: {
                context: contect,
                modleTitle: newtitle,
                overWrite: 0,
                modleLabel: labelId1(newlabel)
            },
            dataType: "json",
            flag: true,
            success: function(res, xml) {
                let msg = JSON.parse(res).msg;
                let modle = msg.data.modle;
                console.log(msg)
                newTP(newtitle, newcontext, modle.modleId, newlabel, 0, '未学习', true);
                resetbase();
                MakingTP();
                $('.Making_page .popup').style.display = 'none';
                $('.Making_page .popup2 .popup_box').innerHTML = '保存成功';
                $('.Making_page .popup2').style.display = 'block';
            },
            fail: function(status) {
                // 此处放失败后执行的代码
                $('.Making_page .popup').style.display = 'none';
                $('.Making_page .popup2 .popup_box').innerHTML = '保存失败';
                $('.Making_page .popup2').style.display = 'block';
                console.log(status);
            }
        });
    }
}

//点击进入编辑页面
$('.Making_page .popup_box button')[1].onclick = () => {
    // 如果标题和内容不为空
    if (newtitle != '' && newcontext != '') {
        //创建模板
        let newcon = newcontext.replace(/&nbsp;/g, '<空格>').replace(/<div>/g, '').replace(/<\/div>/g, '');

        ajax({
            url: "http://8.134.104.234:8080/ReciteMemory/modle/MakeModle",
            type: "post",
            data: {
                context: newcon,
                modleTitle: newtitle,
                overWrite: 0,
                modleLabel: labelId1(newlabel)
            },
            dataType: "json",
            flag: true,
            success: function(res, xml) {
                let msg = JSON.parse(res).msg;
                let modle = msg.data.modle;
                newTPFlag = true;
                newTP(newtitle, newcon, modle.modleId, newlabel, 0, '未学习', true);
                //刷新仓库
                $('.footer_nav li')[0].onclick();
                $('.learn_page .title').value = newtitle;
                $('.learn_page .text_box').innerHTML = newcontext;
                $('.learn_page .label').innerHTML = newlabel;
                $('.learn_page').style.left = '0';
                $('.learn_page header').style.left = '0';
                $('.learn_page header').style.opacity = '1';
                MakingTP();
            },
            fail: function(status) {
                // 此处放失败后执行的代码
                console.log(status);
            }
        });
    }
    $('.Making_page .popup').style.display = 'none';
}

//编辑页面回复默认
function MakingTP() {
    $('.Making_page .title input').value = '';
    $('.Making_page .text_box').innerHTML = '';
    $('.Making_page .label_cont').innerHTML = `<span>标签</span>
    <span class="icon iconfont icon-xiangxiajiantou"></span>`
}