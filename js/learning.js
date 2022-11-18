//将页面重置回原本状态
function learnReset() {
    if (document.querySelector('.learn_page .highlight')) {
        for (let x of all('.learn_page .highlight')) {
            x.removeAttribute('contenteditable');
            x.className = 'highlight';
            x.onclick = null;
            x.onkeydown = null;
            x.onkeyup = null;
            x.onfocus = null;
            x.onblur = null;
            x.style.userSelect = '';
        }
    }
    for (let x of $('.learn_page footer li')) {
        x.classList.remove('choice');
    }
    $('.learn_page .footer_1').style.display = 'block';
    $('.learn_page .footer_2').style.display = 'none';
    $('.learn_page .text_box').setAttribute('contenteditable', false);
    // $('.learn_page .text_box').classList.remove('canwrite');
    $('.learn_page .text_box').classList.remove('del');
    $('.learn_page .title').disabled = true;
    flag = false;
    flag1 = false;
    learn_flag_1 = true;
    learn_flag_2 = true;
    // moxiele = false;
    //背诵睁眼闭眼
    $('.beisong .icon').classList.add('icon-yanjing');
    $('.beisong .icon').classList.remove('icon-biyanjing');
    //如果是新建模板
    if (newTPFlag) {
        mid = all('.my_base li')[0].querySelector('.modleId').innerHTML;
    } else {
        mid = modleId.innerHTML;
    }

}

//数组用来存放被选中的节点
let arr1 = [];
//数组用来存放答案
let arr2 = [];
let Ltimestart = 0;
let Ltimeend = 0;
let btn = $('.learn_page .header_right li');
let learn_flag_1 = true;
let learn_flag_2 = true;
let moxiele = false;
//存放用户的输入的答案 
let userAnswer;
let tempAnswer;
let timerm = null;
//判断是否是复习学习记录
let judge_ifReviewRecord = 0;
//判断是否是第一次进入编辑页面
let judge_firstEdit = true;
//判断是否要保存本次的学习记录
let judge_ifSave = 1;
//判断是否重新开始学习
let judge_restart = 1;
//判断上次是否有学习记录
let judeg_hasRecord = 0;
//判断已经复习过了
let judeg_isreview = false;

//点击进入默写模式
$('.moxie').onclick = () => {
    if (learn_flag_1 && document.querySelector('.learn_page .highlight')) {

        if (judge_firstEdit) {
            arr2 = [];
            for (let x of all('.learn_page .highlight')) {
                arr2.push(x.innerText);
                console.log(arr2);
            }
            infiMoxie();
            judge_firstEdit = false;
            //发送检测学习记录的ajax
            judge_hasRecord_ajax();
            console.log(judeg_hasRecord == 1)
        } else {
            //如果不是第一次就渲染
            infiMoxie();
            console.log(userAnswer);
            if (userAnswer) {
                fill_userAnswer(tempAnswer);
                console.log("渲染当前答案")
            }
        }
    } else {
        // 再次点击退出答题模式
        if (moxiele) {
            getUserAnswer();
            console.log("默写了，保存当前答案！")
        }
        learnReset()
        answerReset()
        if (document.querySelector('.learn_page .highlight')) {
            Ltimeend = new Date().getTime();
            Alltime += (Ltimeend - Ltimestart) / 1000;
        }

        Ltimestart = 0;
        console.log(Alltime);
        learn_flag_1 = true;
    }
}

//默写的初始化
function infiMoxie() {
    //计时
    Ltimeend = new Date().getTime();
    if (Ltimestart != 0)
        Alltime += (Ltimeend - Ltimestart) / 1000;
    console.log(Alltime);
    Ltimestart = new Date().getTime();
    //重置状态
    learnReset();
    $('.moxie').classList.add('choice');

    //利用循环将选中的节点内容替换
    for (let i = 0; i < all('.learn_page .highlight').length; i++) {
        let x = all('.learn_page .highlight')[i];
        x.setAttribute('data-after', arr2[i]);
        x.setAttribute('contenteditable', true)
        let Firstmoxie = true;
        x.innerHTML = ''
        x.classList.add('input');
        // 点击可输入答案
        x.onclick = (e) => {
            if (Firstmoxie && x.innerHTML == '') {
                x.innerHTML = ' ';
                Firstmoxie = false;
            }
            e.stopPropagation();
        }

        x.onfocus = () => {
            $('.learn_page footer').style.display = 'none';
            $('.learn_page .text_box').style.height = 'calc(100vh - 18vw)';
            let text = x.innerText;
            x.onkeyup = (e) => {
                text = x.innerText;
                console.log(arr2[i].substring(text.length), text.length, 'onkeyup');
            }
            x.onkeydown = (e) => {
                moxiele = true;
                console.log(arr2[i].substring(text.length), text.length);
                x.setAttribute('data-after', arr2[i].substring(text.length));
            }

        }
        x.onblur = () => {
            $('.learn_page footer').style.display = 'block';
            $('.learn_page .text_box').style.height = 'calc(100vh - 38vw)';
            x.onkeydown = null;
            x.onkeyup = null;
            timerm = null;
        }
    }
    save_learning = true;
    learn_flag_1 = false;
    learn_flag_2 = true;
}


//点击页面其他地方时，隐藏弹窗标签
$('.learn_page').onclick = () => {
    $('.learn_page .label_menu').style.transform = 'scale(0)';
    label_flag1 = true;
}

//点击进入背诵模式
$('.beisong').onclick = () => {
    if (learn_flag_2 && document.querySelector('.learn_page .highlight')) {
        if (!learn_flag_1) {
            getUserAnswer();
            console.log("默写了，保存当前答案！")
            console.log(userAnswer);
        }

        Ltimeend = new Date().getTime();
        if (Ltimestart != 0)
            Alltime += (Ltimeend - Ltimestart) / 1000;
        console.log(Alltime);
        Ltimestart = new Date().getTime();

        if (!learn_flag_1) {
            answerReset();
        }
        learnReset()
        $('.beisong .icon').classList.remove('icon-yanjing');
        $('.beisong .icon').classList.add('icon-biyanjing');
        $('.beisong').classList.add('choice');
        //利用循环将选中的节点添加类
        let n = 0;
        for (let x of all('.learn_page .highlight')) {
            x.classList.add('recite');
            x.onclick = () => {
                x.classList.toggle('recite');
            }
            x.style.userSelect = 'none';
        }
        learn_flag_2 = false;
        learn_flag_1 = true;
    } else {
        learnReset();
        if (document.querySelector('.learn_page .highlight')) {
            Ltimeend = new Date().getTime();
            Alltime += (Ltimeend - Ltimestart) / 1000;
        }
        Ltimestart = 0;
        learn_flag_2 = true;
    }
};

//点击提交答案
$('.tijiao').onclick = () => {
    if (!learn_flag_1) {


        //如果正在复习
        if (flag_review) {
            $(".popup3").style.display = 'block';
            $(".popup3 .save_tips").innerHTML = "您已经答完了吗";

            $(".popup3 .selection .yes").onclick = () => {
                judeg_isreview = true;
                if (moxiele) {
                    getUserAnswer();
                    console.log("默写了，保存当前答案！")
                }
                //ajax请求
                judge_restart = 1;
                get_learn_ajax();
                //更改复习周期
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/review/FinishOnceReview",
                    type: "get",
                    data: {
                        modleId: modleId.innerHTML
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
                        let content = JSON.parse(res).msg.content;
                        console.log(content);
                        if (content == '恭喜你完成这个周期的复习啦，下个周期见吧') {
                            flag_review = false;
                            getStoreDSSD(true)
                        }
                    },
                    fail: function (status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
                getAccuracy();
                Savetime();
                $('.moxie').classList.remove('choice');
                flag = false;
                flag1 = false;
                learn_flag_1 = true;
                learn_flag_2 = true;
                $(".popup3").style.display = 'none';

            }

            $(".popup3 .selection .no").onclick = () => {
                $(".popup3").style.display = 'none';
            }


        } else {
            $(".popup3").style.display = 'block';
            $(".popup3 .save_tips").innerHTML = "您已经答完了吗";

            $(".popup3 .selection .yes").onclick = () => {
                if (moxiele) {
                    getUserAnswer();
                    console.log("默写了，保存当前答案！")
                }
                if (label.nextElementSibling.querySelector('span').innerText != '复习中') {
                    //更改学习状态
                    ajax({
                        url: "http://8.134.104.234:8080/ReciteMemory/review/JoinThePlane",
                        type: "get",
                        data: {
                            modleId: mid,
                            studyStatus: '复习中'
                        },
                        dataType: "json",
                        flag: true,
                        success: function (res, xml) {
                            let content = JSON.parse(res).msg.content;
                            console.log(content);
                            label.nextElementSibling.querySelector('span').innerText = '复习中';
                            label.nextElementSibling.className = 'learning reviewing';
                        },
                        fail: function (status) {
                            // 此处放失败后执行的代码
                            console.log(status);
                        }
                    });
                }
                getAccuracy();
                Savetime();
                getStoreDSSD(false);

                $('.moxie').classList.remove('choice');
                flag = false;
                flag1 = false;
                learn_flag_1 = true;
                learn_flag_2 = true;
                $(".popup3").style.display = 'none';
            }

            $(".popup3 .selection .no").onclick = () => {
                $(".popup3").style.display = 'none';
            }

        }

        //保存学习时长
        function Savetime() {
            Ltimeend = new Date().getTime();
            Alltime += (Ltimeend - Ltimestart) / 1000;
            Ltimestart = 0;
            console.log(Alltime);
            if (Alltime >= 60) {
                console.log(Alltime);
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/user.do/storeDSSD",
                    type: "post",
                    data: {
                        studyTime: Math.round(Alltime / 60)
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
                        let msg = JSON.parse(res).msg;
                        console.log(msg);
                    },
                    fail: function (status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
            }
        }

        //获取正确率
        function getAccuracy() {
            let data = {}
            for (let i = 0; i < all('.learn_page .highlight').length; i++) {
                data[arr2[i]] = all('.learn_page .highlight')[i].innerHTML.replace(/&nbsp;/g, '');
            }
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/inf.get/getAccuracy",
                type: "post",
                data: {
                    matchStr: JSON.stringify(data)
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.content == '计算成功') {
                        let score = msg.data.total;
                        let accuracy = msg.data.accuracy;
                        console.log(score);
                        $('.learn_page .popup .popup_box .score').innerHTML = score;
                        $('.learn_page .popup .popup_box .score_title').innerHTML = `本次正确率：${score}%`;
                        if (score < 60) {
                            $('.learn_page .popup .popup_box .left').style.background = `conic-gradient(#fda71c ${score}%, #fef6ea 0%)`
                            $('.learn_page .popup .popup_box .circle').innerHTML = '陌生'
                        } else if (score < 80) {
                            $('.learn_page .popup .popup_box .left').style.background = `conic-gradient(#02c287 ${score}%, #e1fbf2 0%)`
                            $('.learn_page .popup .popup_box .circle').innerHTML = '一般'
                        } else {
                            $('.learn_page .popup .popup_box .left').style.background = `conic-gradient(#5133febc ${score}%, #bcb0ffbc 0%)`
                            $('.learn_page .popup .popup_box .circle').innerHTML = '熟练'
                        }
                        $('.learn_page .popup').style.display = 'block';

                        for (let i = 0; i < all('.learn_page .highlight').length; i++) {

                            let x = all('.learn_page .highlight')[i];
                            x.onkeydown = null;
                            x.onkeyup = null;
                            x.onfocus = null;
                            x.onblur = null;
                            x.removeAttribute('contenteditable');
                            let flag = false;
                            console.log(arr2[i]);
                            if (x.innerHTML != '') {
                                // x.setAttribute('data-after', arr2[i].substring(x.innerHTML.length));
                                x.onclick = () => {
                                    if (flag) {
                                        x.innerHTML = arr2[i];
                                        x.classList.add('rightAnswer');
                                        removeColor(x);
                                        flag = false;
                                    } else {
                                        x.innerHTML = data[arr2[i]];
                                        addColor(x, accuracy[i]);
                                        x.classList.remove('rightAnswer');
                                        flag = true;
                                    }
                                    // x.setAttribute('data-after', arr2[i].substring(x.innerHTML.length));
                                }
                                x.onclick();
                            } else {
                                x.onclick = null;
                                x.innerHTML = arr2[i];
                                x.classList.add('rightAnswer');
                                x.removeAttribute('data-after');
                            }


                            //移除颜色
                            function removeColor(x) {
                                for (let i = 1; i < 7; i++) {
                                    x.classList.remove(`myAnswer${i}`);
                                }
                            }

                            //添加颜色
                            function addColor(x, accuracy) {
                                if (accuracy <= 20) {
                                    removeColor(x)
                                    x.classList.add('myAnswer1');
                                }
                                else if (accuracy <= 40) {
                                    removeColor(x)
                                    x.classList.add('myAnswer2');
                                }
                                else if (accuracy <= 50) {
                                    removeColor(x)
                                    x.classList.add('myAnswer3');
                                }
                                else if (accuracy <= 70) {
                                    removeColor(x)
                                    x.classList.add('myAnswer4');
                                }
                                else if (accuracy <= 90) {
                                    removeColor(x)
                                    x.classList.add('myAnswer5');
                                }
                                else if (accuracy <= 100) {
                                    removeColor(x)
                                    x.classList.add('myAnswer6');
                                }
                            }
                        }
                    }
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);

                }
            });
        }

        // answerReset();

    }

}

//填入答案
function answerReset() {
    for (let i = 0; i < all('.learn_page .highlight').length; i++) {
        all('.learn_page .highlight')[i].innerHTML = arr2[i];
    }
}

//点击关闭弹窗
$('.learn_page .popup').onclick = () => $('.learn_page .popup').style.display = 'none';
//阻止事件冒泡
$('.learn_page .popup .popup_box').onclick = (e) => e.stopPropagation();
//点击关闭弹窗
$('.learn_page .popup2').onclick = () => $('.learn_page .popup2').style.display = 'none';
//阻止事件冒泡
$('.learn_page .popup2 .popup_box').onclick = (e) => e.stopPropagation();

//点击返回隐藏学习页面
$('.learn_page .header_left').onclick = () => {
    if (zidingyi) {
        $(".popup3").style.display = 'block';
        $(".popup3 .save_tips").innerHTML = "是否退出自定义模式？";
        $(".popup3 .selection .yes").onclick = () => {
            $('.learn_page .footer_1').style.display = 'block';
            $('.learn_page .footer_2').style.display = 'none';
            editReset()
            zidingyi = false;
            $(".popup3").style.display = 'none';
        }
        $(".popup3 .selection .no").onclick = () => {
            $(".popup3").style.display = 'none';
        }

    } else {
        judge_firstEdit = true;
        console.log(userAnswer)

        if (moxiele) {
            if (judeg_isreview) {
                exitlearning();
                return;
            }
            console.log(userAnswer);
            $(".popup3").style.display = 'block';
            $(".popup3 .save_tips").innerHTML = "是否要保存当前的学习记录？";
            if (flag_review)
                $(".popup3 .save_tips").innerHTML = "是否要保存当前的复习记录？";
            $(".popup3 .selection .yes").onclick = () => {
                judge_ifSave = 1;
                console.log("请求保存记录" + judge_ifSave);
                getUserAnswer();
                //ajax请求
                save_learn_ajax(userAnswer);
                exitlearning();
            }
            $(".popup3 .selection .no").onclick = () => {
                console.log("不本次保存记录" + judge_ifSave);
                judge_ifSave = 0;
                //ajax请求
                userAnswer = { arr: [] };
                save_learn_ajax(userAnswer);
                exitlearning();
            }
        } else {
            exitlearning();
        }

    }
}

function exitlearning() {
    moxiele = false;
    $('.learn_page').style.left = '100%';
    $('.learn_page header').style.left = '100%';
    $('.learn_page header').style.opacity = '0';
    learnReset()
    if (!learn_flag_1 && label.nextElementSibling.querySelector('span').innerText == '未学习') {
        ajax({
            url: "http://8.134.104.234:8080/ReciteMemory/review/JoinThePlane",
            type: "get",
            data: {
                modleId: mid,
                studyStatus: '复习中'
            },
            dataType: "json",
            flag: true,
            success: function (res, xml) {
                let content = JSON.parse(res).msg.content;
                console.log(content);
                label.nextElementSibling.querySelector('span').innerText = '学习中';
                label.nextElementSibling.className = 'learning startlearn';
            },
            fail: function (status) {
                // 此处放失败后执行的代码
                console.log(status);
            }
        });
    }
    $(".popup3").style.display = 'none';
}

//获取用户输入的答案
function getUserAnswer() {
    tempAnswer = [];
    for (let i = 0; i < all('.learn_page .highlight').length; i++) {
        tempAnswer.push(all('.learn_page .highlight')[i].innerHTML.replace(/&nbsp;/g, ''));
    }
    userAnswer = { arr: tempAnswer };
    console.log(userAnswer);
}

//渲染学习记录
function fill_userAnswer(userAnswer) {
    for (let i = 0; i < userAnswer.length; i++) {
        let x = all('.learn_page .highlight')[i];
        x.innerHTML = userAnswer[i];
        x.setAttribute('data-after', arr2[i].substring(userAnswer[i].length));
    }

}

//判断是否有学习记录ajax
function judge_hasRecord_ajax() {
    if (flag_review)
        judge_ifReviewRecord = 1;
    ajax({
        url: "http://8.134.104.234:8080/ReciteMemory/modle/JudgeStudyRecord",
        type: "get",
        data: {
            modleId: modleId.innerHTML,
            ifReviewRecord: judge_ifReviewRecord
        },
        dataType: "json",
        flag: true,
        success: function (res, xml) {
            let msg = JSON.parse(res).msg;
            console.log(msg.data.haveRecord);
            if (zidingyi) {
                judeg_hasRecord = msg.data.haveRecord ? 1 : 0;
            } else {
                if (msg.data.haveRecord) {
                    judeg_hasRecord = 1;
                    $(".popup3").style.display = 'block';
                    $(".popup3 .save_tips").innerHTML = "检测到您有学习记录，请问是否继续上次的学习？";
                    if (flag_review)
                        $(".popup3 .save_tips").innerHTML = "检测到您有复习记录，请问是否继续上次的学习？";
                    $(".popup3 .selection .yes").onclick = () => {
                        judge_restart = 0;
                        console.log("接着上次的学习" + judge_restart);
                        //ajax请求
                        get_learn_ajax();
                    }
                    $(".popup3 .selection .no").onclick = () => {
                        judge_restart = 1;
                        console.log("重新开始学习" + judge_restart);
                        $(".popup3").style.display = 'none';
                        get_learn_ajax();
                    }
                } else {
                    judeg_hasRecord = 0;
                    $(".popup3").style.display = 'none';
                }
            }

            console.log("检测学习记录成功");
        },
        fail: function (status) {
            // 此处放失败后执行的代码
            console.log(status);
        }
    });
};

//保存学习记录的ajax封装函数
function save_learn_ajax(blankArr) {
    let url = 'http://8.134.104.234:8080/ReciteMemory/modle/SaveStudyRecord';
    if (flag_review) {
        url = 'http://8.134.104.234:8080/ReciteMemory/review/SaveReviewRecord';
    }
    ajax({
        url: url,
        type: "post",
        data: {
            modleId: modleId.innerHTML,
            blanks: JSON.stringify(blankArr),
            ifSave: judge_ifSave
        },
        dataType: "json",
        flag: true,
        success: function (res, xml) {
            let msg = JSON.parse(res).msg;
            console.log(msg);
            console.log("保存成功");
        },
        fail: function (status) {
            // 此处放失败后执行的代码
            console.log(status);
        }
    });
};

//获取学习记录
function get_learn_ajax() {
    let url = 'http://8.134.104.234:8080/ReciteMemory/modle/GetStudyRecord';
    if (flag_review) {
        url = 'http://8.134.104.234:8080/ReciteMemory/review/GetReviewRecord';
    }
    ajax({
        url: url,
        type: "get",
        data: {
            modleId: modleId.innerHTML,
            restart: judge_restart
        },
        dataType: "json",
        flag: true,
        success: function (res, xml) {
            let msg = JSON.parse(res).msg;
            console.log(msg);
            if (msg.data.record) {
                fill_userAnswer(msg.data.record);
            }

            // if (msg.data.record == false) {
            //     console.log(msg.content)
            // } else {
            //     fill_userAnswer(msg.data.record);
            //     console.log("获取记录成功");
            // }
            $(".popup3").style.display = 'none';

        },
        fail: function (status) {
            // 此处放失败后执行的代码
            console.log(status);
        }
    });
}