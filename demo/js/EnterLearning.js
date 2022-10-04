// import { $, ajax } from './base.js'

function $(selectors) {
    if (document.querySelectorAll(selectors).length != 1)
        return document.querySelectorAll(selectors);
    else
        return document.querySelector(selectors);
}

//为数组对象添加自定义方法remove,可通过元素的值查找元素并删除
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};


//数组用来存放被选中的节点
let arr1 = [];
//数组用来存放答案
let arr2 = [];
for(let x of $('.highlight')){
    arr1.push(x);
    arr2.push(x.innerHTML);
}

let btns = $('.header_btn');
flag = true;
flag1 = true;
//点击进入答题模式
btns[1].onclick = () => {
    if (flag) {
        btns[1].classList.add('btn_current');
        btns[2].classList.remove('btn_current');
        btns[3].classList.remove('hidden');
        reset();
        //利用循环将选中的节点内容替换
        for (let x of arr1) {
            x.innerHTML = '请输入答案';
            // 点击可输入答案
            x.onclick = (e) => {
                if (x.innerHTML == '请输入答案')
                    x.innerHTML = ''
                e.stopPropagation();
            }
            x.classList.add('input');
        }
        flag = false;
        flag1 = true;
    } else {
        // 再次点击退出答题模式
        btns[1].classList.remove('btn_current');
        btns[3].classList.add('hidden');
        reset();
        flag = true;
    }
}

//点击页面其他地方时，如果填入内容为空则将内容修改
document.onclick = () => {
    for (let x of arr1) {
        if (x.innerHTML == '')
            x.innerHTML = '请输入答案';
    }
}

//点击进入背诵模式
btns[2].onclick = () => {
    if (flag1) {
        btns[1].classList.remove('btn_current');
        btns[2].classList.add('btn_current');
        btns[3].classList.add('hidden');
        reset();
        //利用循环将选中的节点添加类
        for (let x of arr1) {
            x.classList.add('recite');
            x.onclick = () => {
                x.classList.toggle('recite');
            }
        }
        flag1 = false;
        flag = true;
    } else {
        btns[2].classList.remove('btn_current');
        reset();
        flag1 = true;
    }
}

//点击提交答案
btns[3].onclick = () => {
    flag = true;
    btns[1].classList.remove('btn_current');
    let n = 0, sum = 0;
    for (let x of arr1) {
        if (x.innerHTML == arr2[n]) {
            sum++;
        }
        n++;
    }
    alert('正确率：' + (sum / n) * 100 + '%');
    reset();
    btns[3].classList.add('hidden');
}

//将节点重置回原本状态
function reset() {
    let n = 0;
    for (let x of arr1) {
        x.className = 'highlight';
        x.innerHTML = arr2[n];
        n++;
        x.onclick = null;
    }
}

let textPage = $('.text_page');
let numberOfPages = $('.number_of_pages');
let pages = textPage.length;
let pageNow = 0;
// 页数
numberOfPages.innerHTML = `1/${pages}`
//将页面排序显示
for (let i = 0; i < pages; i++) {
    textPage[i].style.zIndex = `${pages - i}`;
}

//点击翻上一页
$('.pageUp').onclick = () => {
    if (pageNow > 0) {
        textPage[pageNow - 1].style.zIndex = pages - pageNow + 1;
        textPage[pageNow - 1].style.transform = 'rotateY(0)';
        pageNow--;
        numberOfPages.innerHTML = `${pageNow + 1}/${pages}`
    }
}

//点击翻下一页
$('.pageDown').onclick = () => {
    if (pageNow < pages - 1) {
        textPage[pageNow].style.zIndex = 0;
        textPage[pageNow].style.transform = 'rotateY(-360deg)';
        pageNow++;
        numberOfPages.innerHTML = `${pageNow + 1}/${pages}`
    }
}



