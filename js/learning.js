//将页面重置回原本状态
function learnReset() {
    if (document.querySelector('.learn_page .highlight')) {
        for (let x of all('.learn_page .highlight')) {
            x.removeAttribute('contenteditable');
            x.className = 'highlight';
            x.onclick = null;
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
//点击进入默写模式
$('.moxie').onclick = () => {
    if (learn_flag_1 && document.querySelector('.learn_page .highlight')) {
        Ltimeend = new Date().getTime();
        if (Ltimestart != 0)
            Alltime += (Ltimeend - Ltimestart) / 1000;
        console.log(Alltime);
        Ltimestart = new Date().getTime();
        learnReset();
        $('.moxie').classList.add('choice');
        arr2 = [];
        //利用循环将选中的节点内容替换
        for (let x of all('.learn_page .highlight')) {
            arr2.push(x.innerText);
            x.setAttribute('contenteditable', true)
            x.innerHTML = '请输入答案';

            // 点击可输入答案
            x.onclick = (e) => {
                answer(x);
                e.stopPropagation();
            }
            x.classList.add('input');
        }

        function answer(x) {
            for (let k of all('.learn_page .highlight')) {
                if (k.innerHTML == '')
                    k.innerHTML = '请输入答案';
            }
            if (x.innerHTML == '请输入答案')
                x.innerHTML = '';
        }
        learn_flag_1 = false;
        learn_flag_2 = true;
    } else {
        // 再次点击退出答题模式
        learnReset()
        answerReset()
        Ltimeend = new Date().getTime();
        Alltime += (Ltimeend - Ltimestart) / 1000;
        Ltimestart = 0;
        console.log(Alltime);
        learn_flag_1 = true;
    }
}

//点击页面其他地方时，如果填入内容为空则将内容修改
$('.learn_page').onclick = () => {
    if (document.querySelector('.learn_page .highlight')) {
        for (let x of all('.learn_page .input')) {
            if (x.innerHTML == '')
                x.innerHTML = '请输入答案';
        }
    }
    $('.learn_page .label_menu').style.transform = 'scale(0)';
    label_flag1 = true;
}
//点击进入背诵模式
$('.beisong').onclick = () => {
    if (learn_flag_2 && document.querySelector('.learn_page .highlight')) {
        Ltimeend = new Date().getTime();
        if (Ltimestart != 0)
            Alltime += (Ltimeend - Ltimestart) / 1000;
        console.log(Alltime);
        Ltimestart = new Date().getTime();
        if (!learn_flag_1) {
            answerReset()
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
        Ltimeend = new Date().getTime();
        Alltime += (Ltimeend - Ltimestart) / 1000;
        Ltimestart = 0;
        learn_flag_2 = true;
    }
}
//点击提交答案
$('.tijiao').onclick = () => {
    if (!learn_flag_1) {
        learn_flag_1 = true;
        let data = {}
        for(let i = 0;i < all('.learn_page .highlight').length;i++){
            data[arr2[i]] = all('.learn_page .highlight')[i].innerHTML;
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
                if(msg.content == '计算成功'){
                    let score = msg.data.accuracy.split('%')[0];
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
                }
            },
            fail: function (status) {
                // 此处放失败后执行的代码
                console.log(status);
                
            }
        });

        //如果正在复习
        if (flag_review) {
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
                        fxPeriod();
                    }
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });

        } else {
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
        }
        // studyNums++;
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
        getStoreDSSD(false)
        answerReset();
        learnReset();
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
}
