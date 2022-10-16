$('.personal .exit').onclick = () => {
    if (!curr.auto) {
        window.localStorage.clear();
    }
    location.href = './login.html';
}

// 随机排列数组
let arr12 = ['qwe', '23e', 'q123', '32we', '423we', '3242']
arr12.sort(function () {
    return 0.5 - Math.random();
})
// 取数组随机排列后的前三个元素放在另一个数组，之后将这三个元素作为li的索引值
let newArr = arr12.slice(0, 3);
console.log(newArr);

let modifyNum = 0;
let modifyArr = ['修改昵称', '修改手机号', '修改密码'];
for (let i = 0; i < $('.modify_lis').length; i++) {
    $('.modify_lis')[i].onclick = () => {
        $('.modify_what').innerHTML = modifyArr[i];
        $('.personal .modify').style.left = '0';
        if (i < 2)
            $('.Modify_interface input').value = $('.modify_value')[i].innerHTML; 4
        modifyNum = i;
    }
}

$('.modify_title .left').onclick = () => {
    $('.personal .modify').style.left = '100%';
    $('.Modify_interface input').value = '';
}

let nameReg = /^[0-9a-zA-Z\u4e00-\u9fa5]{1,6}$/;
let phoneReg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;
let passwordReg = /^[a-zA-Z0-9_]{6,16}$/;
$('.modify .confirm').onclick = () => {
    let modify_value = $('.Modify_interface input').value;
    if (modifyNum == 0 && nameReg.test(modify_value)) {
        ajax(`http://8.134.104.234:8080/ReciteMemory/user.do/ChangeNickname?Nickname=${modify_value}&userId=${userInfo.userId}`, 'get', '', (str) => {
            let newstr = JSON.parse(str).msg;
            console.log(newstr);
        }, true);
    }

    if (modifyNum == 1 && phoneReg.test(modify_value)) {
        ajax(`http://8.134.104.234:8080/ReciteMemory/user.do/ChangePhone?phone=${modify_value}&userId=${userInfo.userId}`, 'get', '', (str) => {
            let newstr = JSON.parse(str).msg;
            console.log(newstr);
        }, true);
    }

    if (modifyNum == 2 && passwordReg.test(modify_value)) {
        ajax(`http://8.134.104.234:8080/ReciteMemory/user.do/ChangePswd?password=${modify_value}&userId=${userInfo.userId}`, 'get', '', (str) => {
            let newstr = JSON.parse(str).msg;
            console.log(newstr);
        }, true);
    }
}