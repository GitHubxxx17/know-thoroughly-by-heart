//封装一个可以获取CSS选择器的函数
function $(selectors) {
    if (document.querySelectorAll(selectors).length != 1)
        return document.querySelectorAll(selectors);
    else
        return document.querySelector(selectors);
}

//封装一个返回数组的函数
function all(selectors) {
    return document.querySelectorAll(selectors);
}
let auto1 = localGetData('auto');
let curr1 = {};
if(auto1){
    curr1 = localGetData('current_user');
}else{
    curr1 = sessionGetData('current_user');
}

function ajax(options) {
    options.type = (options.type || "GET").toUpperCase();
    let params = null;
    if (options.flag) {
        params = formatParams(options.data);
    } else {
        params = options.data;
    }

    let xhr = null;
    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }
    //连接 和 发送 - 第二步

    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        if (curr1.length != 0) {
            xhr.setRequestHeader("authorization", curr1.userId);
        }
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        if (options.flag)
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (curr1.length != 0) {
            xhr.setRequestHeader("authorization", curr1.userId);
        }
        
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    let arr = [];
    for (let name in data) {
        arr.push(name + "=" + data[name]);
    }
    return arr.join("&");
}

//读取本地存储数据
function localGetData(name) {
    let data = localStorage.getItem(name);
    if (data !== null) {
        //把字符串转换成对象
        return JSON.parse(data);
    } else {
        return [];
    }
}
//读取session中的数据
function sessionGetData(name) {
    let data = sessionStorage.getItem(name);
    if (data !== null) {
        //把字符串转换成对象
        return JSON.parse(data);
    } else {
        return [];
    }
}

//保存本地存储数据
function localSaveData(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}
//保存session存储
function sessionSaveData(name, data) {
    sessionStorage.setItem(name, JSON.stringify(data));
}

//为数组对象添加自定义方法remove,可通过元素的值查找元素并删除
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//新建模板到仓库
function newTP(title, context, modleId, label, common, studyStatus, flag) {
    let li = document.createElement('li');
    let studyS = `<div class="learning">
                    <span>${studyStatus}</span>
                </div>`
    if (studyStatus == '学习中') {
        studyS = `<div class="learning startlearn">
                    <span>${studyStatus}</span>
                </div>`
    } else if (studyStatus == '复习中') {
        studyS = `<div class="learning reviewing">
                    <span>${studyStatus}</span>
                </div>`
    } else if (studyStatus == '已学习') {
        studyS = `<div class="learning learned">
                    <span>${studyStatus}</span>
                </div>`
    }
    li.innerHTML = `<div class="tp_inner">
                        <div class="modleId">${modleId}</div>
                        <div class="content">
                            <h4 class="title ellipsis">${title}</h4>
                            <div class="info ellipsis">${context}</div>
                        </div>
                        <div class="select"><i class="iconfont icon-xuanze1"></i></div>
                        <div class="tip">
                            <div class="label">
                                <span class="iconfont icon-shuqianguanli"></span>
                                <span class="label_title">${label}</span>
                            </div>
                            ${studyS}
                        </div>
                        <div class="common">${common}</div>
                    </div>`
    if (flag) {
        $('.my_base .base_lis').prepend(li);
    } else {
        $('.collection_base .base_lis').prepend(li);
    }
}

//社区渲染
function comTP(title, context, modleId, label, base64, username, likeNum, likeStatus, name_flag) {
    //点赞状态
    let dz = ''
    let like = ''
    if(likeNum == 0){
        like = '点赞'
    }else{
        like = likeNum;
    }

    if (likeStatus) {
        dz = `<span class="dainzan orange">
                <i class="iconfont icon-dianzan1"></i>
                <i class="wenzi">${like}</i>
                <span class="circle blink_circle"></span>
            </span>`
    } else {
        dz = `<span class="dainzan">
                <i class="iconfont icon-dianzan"></i>
                <i class="wenzi">${like}</i>
                <span class="circle"></span>
            </span>`
    }


    //自己和别人的
    let toolbar_right = '';
    let right = '';
    if (name_flag) {
        toolbar_right = `<div class="toolbar_right">
                            <span class="shoucang ">
                                <i class="iconfont icon-shoucang1"></i> 
                                <i class="wenzi">收藏</i>
                            </span>
                            ${dz}
                        </div>`;
    } else {
        toolbar_right = `<div class="toolbar_right">
                            <span></span>
                            ${dz}
                        </div>`;
        right = `
            <div class="right">
                <div class="iconfont icon-shixincaidan"></div>
                <div class="del" style="display: none;">删除</div>
            </div>
        `
    }
    let img = `./images/头像/头像-女学生2.png`;
    if (base64 != '') {
        img = base64;
    }

    let li = document.createElement('li');
    li.innerHTML = `<div class="modleId">${modleId}</div>
                        <div class="color">
                            <div class="upper">
                                <div class="left">
                                    <div class="head_portrait">
                                        <img src="${img}" alt="">
                                    </div>
                                    <div class="idname1">${username}</div>
                                </div>
                                ${right}
                            </div>

                            <div class="content">
                                <h4 class="title ellipsis">${title}</h4>
                                <div class="info_box">
                                    <div class="info ellipsis">${context}</div>
                                </div>
                            </div>
                            <div class="click">
                                <div class="label">
                                    <span class="iconfont icon-shuqianguanli"></span>
                                    <span class="label_title">${labelId2(label)}</span>
                                </div>
                                ${toolbar_right}
                                
                            </div>
                        </div>`

    if (nextcom)
        $('.community_ul').insertBefore(li, $('.community_ul .footer'));
    else
        $('.community_ul').prepend(li);
    if (refreshcom)
        li.classList.add('comlifadein');
}

//上传页面渲染模板
function UploadTP(title, context, modleId, label, common) {
    let li = document.createElement('li');
    li.innerHTML = `<div class="modleId">${modleId}</div>
                    <div class="content">
                        <div class="title_label">
                            <h4 class="title ellipsis">${title}</h4>
                            <div class="label">${label}</div>
                        </div>
                        <div class="info_box">
                            <div class="info ellipsis">${context}</div>
                        </div>
                    </div>
                    <div class="select">
                        <div class="circle">
                            <i class="iconfont icon-xuanze1"></i>
                        </div>
                    </div>`
    if (common == 1)
        $('.upload_page .Uploaded ul').prepend(li);
    else
        $('.upload_page .notUploaded ul').prepend(li);
}





//转换标签成id
function labelId1(str) {
    if(str == '系统模板'){
         return 0;
    } 
    else if (str == '教资')
        return 1;
    else if (str == '考研')
        return 2;
    else if (str == '通识课')
        return 3;
    else if (str == '热门推荐'){
        return 4;
    }

}

//转换id成标签
function labelId2(num) {
    if (num == 1)
        return '教资';
    if (num == 2)
        return '考研';
    if (num == 3)
        return '通识课';
}