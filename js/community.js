let interactive = document.querySelectorAll(".inter_box");

var dainzan = document.querySelectorAll(".dainzan");
let jifen = document.querySelectorAll(".jifen");

var menu = document.querySelectorAll(".menu");
let commonArr = [];


//封装社区模板所有事件函数
function communityTP() {
    //社区模板点击菜单出现
    Array.from(all('.menu')).forEach((x, i) => {
        x.addEventListener('click', function (event) {
            for (let k of all('.inter_box')) {
                k.style.width = "0";
            }
            if (all('.inter_box')[i].offsetWidth == '0') {
                all('.inter_box')[i].style.width = "44vw";
            } else {
                all('.inter_box')[i].style.width = "0";
            }
            event.stopPropagation(); //阻止冒泡
        })
    })
    //点击收藏
    Array.from(all('.community_ul .dainzan')).forEach((x, i) => {
        for (let k of all('.collection_base .modleId')) {
            if (k.innerHTML == all('.community_ul .modleId')[i].innerHTML) {
                x.classList.add("yellow");
            }
        }

        x.addEventListener('click', function (event) {
            //如果模板被收藏
            if (x.classList.contains('yellow')) {
                //对比循环收藏库中的模板找出对应模板
                for (let k of all('.collection_base .modleId')) {
                    if (k.innerHTML == all('.community_ul .modleId')[i].innerHTML) {
                        ajax(`http://8.134.104.234:8080/ReciteMemory/modle/CancelCollet?userId=${curr.userId}&modleId=${k.innerHTML}&mStatus=0`, 'get', '', (str) => {
                            let newstr = JSON.parse(str).msg;
                            console.log(newstr);
                            $('.collection_base .base_lis').removeChild(all('.collection_base li')[i]);
                            //刷新仓库
                            resetbase();
                        }, true);

                    }
                }
                // 模板未收藏
            } else {
                ajax(`http://8.134.104.234:8080/ReciteMemory/modle/Collection?userId=${curr.userId}&modleId=${all('.community_ul .modleId')[i].innerHTML}&mStatus=1`, 'get', '', (str) => {
                    let newstr = JSON.parse(str).msg;
                    console.log(newstr);
                    newTP(all('.community_ul .title')[i].innerHTML, all('.community_ul .info')[i].innerHTML, all('.community_ul .modleId')[i].innerHTML, all('.community_ul .label')[i].querySelectorAll('span')[1].innerHTML, false);
                    //刷新仓库
                    resetbase();
                }, true);

            }

            x.classList.toggle("yellow");
            setTimeout(() => all('.inter_box')[i].style.width = "0", 600);
            event.stopPropagation(); //阻止冒泡

        })
    })
    //点赞
    Array.from(all('.jifen')).forEach((x, i) => {
        x.addEventListener('click', function (event) {
            if (x.classList.contains("yellow")) {
                x.classList.remove("yellow");
            } else {
                x.classList.add("yellow");
            }
            setTimeout(() => all('.inter_box')[i].style.width = "0", 600);
            event.stopPropagation(); //阻止冒泡
        })
    })
    //点击页面隐藏菜单
    document.addEventListener('click', function (event) {
        for (let k of all('.inter_box')) {
            k.style.width = "0";
        }
        event.stopPropagation(); //阻止冒泡

    });
    //点击浏览模板
    Array.from(all('.community_ul .content')).forEach((x, i) => {
        x.addEventListener('click', function (event) {
            if(x.nextElementSibling.querySelector('.dainzan').classList.contains('yellow')){
                $('.viewTemplate .dainzan .iconfont').classList.add('yellow');
            }
            $('.viewTemplate footer').style.display = 'block';
            if(x.parentNode.querySelector('.idname1').innerHTML == curr.userInfo.nickName){
                $('.viewTemplate footer').style.display = 'none';
            }
            $('.viewTemplate').classList.remove('scroll_top');
            $('.viewTemplate footer').classList.remove('scroll_top');
            $('.viewTemplate .idname').innerHTML = $('.community_ul .idname1')[i].innerHTML;
            $('.viewTemplate .title').innerHTML = $('.community_ul .title')[i].innerHTML;
            $('.viewTemplate .text_box').innerHTML = $('.community_ul .info')[i].innerHTML;
            $('.viewTemplate .label').innerHTML = $('.community_ul .label')[i].innerHTML;
            event.stopPropagation(); //阻止冒泡
        })
    })

    //点击删除上传的模板
    Array.from(all('.community_ul .shanchu')).forEach((x, i) => {
        x.addEventListener('click', function (event) {
            if (x.classList.contains("yellow")) {
                x.classList.remove("yellow");
            } else {
                x.classList.add("yellow");
            }
            setTimeout(() => all('.inter_box')[i].style.width = "0", 600);
            event.stopPropagation(); //阻止冒泡

            let modleId = x.parentNode.parentNode.parentNode.parentNode.previousElementSibling.innerHTML;
            console.log(modleId);
            ajax(`http://8.134.104.234:8080/ReciteMemory/modle/toCommunity`, 'post', `modleId=${modleId}&common=${0}`, (str) => {
                let newstr = JSON.parse(str).msg;
                console.log(newstr);
                if (newstr.code == '200') {
                    $('.community header .label li')[0].onclick();
                }
            }, true);

        })
    })

}
communityTP()
//浏览页面点击返回
$('.viewTemplate .back').onclick = () => {
    $('.viewTemplate').classList.add('scroll_top');
    $('.viewTemplate footer').classList.add('scroll_top');
}
//渲染社区模板
commonArr[0] = [];
for (let i = 1; i <= 3; i++) {
    setTimeout(() => {
        ajax(`http://8.134.104.234:8080/ReciteMemory/inf.get/getModlesByTag?modleLabel=${i}&pageIndex=0`, 'get', '', (str) => {
            let newstr = JSON.parse(str).msg;
            console.log(newstr);
            if(newstr.content != '参数获取失败'){
                let comarr = newstr.data.modleList;
                commonArr[i] = comarr;
                console.log(comarr, commonArr);
                if(comarr.length != 0){
                    for(let x of comarr){
                        let name_flag = true;
                        commonArr[0].push(x);
                        let newcont = x.content.replace(/<缩进>/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
                        if(x.nickName == curr.userInfo.nickName)
                        name_flag = false;
                        comTP(x.modleTitle, newcont, x.modleId, x.modleLabel,x.nickName,name_flag);
                    }
                    communityTP();

                }
            }
            
        }, true);
    }, 100);
}



//点击进入上传页面
$('.community .upload').onclick = () => {
    $('.upload_page').classList.remove('scroll_top');
    for (let x of all('.my_base .tp_inner')) {
        let modleId = x.querySelector('.modleId').innerHTML;
        let title = x.querySelector('.title').innerHTML;
        let context = x.querySelector('.info').innerHTML;
        let label = x.querySelector('.label').innerHTML;
        UploadTP(title, context, modleId, label);
    }
    setTimeout(() => {
        for (let x of all('.upload_page li')) {
            x.classList.add('uploadLis_fadeIn');
        }
        for (let x of all('.upload_page .select .circle')) {
            x.onclick = () => {
                x.classList.toggle('selected');
            }
        }
    }, 50);

}

//上传到社区
$('.uploadMP').onclick = () => {
    Array.from(all('.upload_page .select .circle')).forEach((x, i) => {
        if (x.classList.contains('selected')) {
            let modleId = all('.upload_page li')[i].querySelector('.modleId').innerHTML;

            ajax(`http://8.134.104.234:8080/ReciteMemory/modle/toCommunity`, 'post', `modleId=${modleId}&common=${1}`, (str) => {
                let newstr = JSON.parse(str).msg;
                console.log(newstr);
                if (newstr.code == '200') {
                    $('.upload_page .back').onclick();
                    console.log($('.community header .label li')[0]);
                    $('.community header .label li')[0].onclick();
                }
            }, true);
        }
    })
}
//上传页面点击返回
$('.upload_page .back').onclick = () => {
    $('.upload_page').classList.add('scroll_top');
    $('.upload_page ul').innerHTML = ''
}

//切换标签
Array.from($('.community header .label li')).forEach((x, i) => {
    x.onclick = () => {
        $('.community_ul').innerHTML = '<li class="footer"></li>';
        for (let k of $('.community header .label li')) {
            k.classList.remove('active');
        }
        x.classList.add('active');
        if(i == 0 && commonArr[0].length != 0){
            for (let k of commonArr[0]) {
                let newcont = k.content.replace(/<缩进>/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
                comTP(k.modleTitle, newcont, k.modleId, k.modleLabel,k.nickName);
            }
        }
        if(commonArr[labelId1(x.innerText)] && i != 0){
            for (let k of commonArr[labelId1(x.innerText)]) {
                let newcont = k.content.replace(/<缩进>/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
                comTP(k.modleTitle, newcont, k.modleId, k.modleLabel,k.nickName);
            }
        }
        communityTP();
    }
})