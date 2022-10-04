// import { $, ajax } from './base.js'

function $(selectors) {
    if (document.querySelectorAll(selectors).length != 1)
        return document.querySelectorAll(selectors);
    else
        return document.querySelector(selectors);
}

// $('.text_page').onclick = (e) => {
//     let containerLength = e.target.clientHeight;  //当前容器的宽度
//     let textLength = e.target.scrollHeight;
//     console.log(containerLength, textLength);
// }

//为数组对象添加自定义方法remove,可通过元素的值查找元素并删除
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

let btns = $('.header_btn');
//点击编辑让其他按钮出现，编辑隐藏
btns[3].onclick = (e) => {
    for (let x of $('.header_right .hidden')) {
        x.classList.remove('hidden');
    }
    e.target.classList.add('hidden');
}

//防止对已选中的文本进行多次挖空
let flag = true;
//防止退出选择模式后可选择节点
let flag1 = true;
//数组用来存放被选中的节点
let arr = [];

//点击挖空进入挖空模式
btns[2].onclick = () => {
    btns[2].classList.toggle('hollow');
    //当长按屏幕触屏结束时，选中文本 
    $('.total_text').ontouchend = (e) => {
        //判断当前是否为挖空模式
        if (btns[2].classList.contains('hollow')) {
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
            //创造id为merge的新节点并将选中文本放进去
            let newNode = document.createElement("div");
            newNode.setAttribute('class', 'highlight');
            newNode.setAttribute('id', 'merge');
            newNode.innerHTML = range.toString();
            //如果选中范围在div里面直接终止点击事件
            if (txt.anchorNode.parentNode === txt.focusNode.parentNode && txt.anchorNode.parentNode.className != 'text_page' && txt.focusNode.parentNode.className != 'text_page') {
                return;
            }
            //循环存储之前被选中的节点
            for (let x of arr) {
                //防止出现空节点
                if (!(x instanceof Node)) {
                    arr.remove(x);
                }//选中文本包含之前被选中的节点的全部
                else if (txt.containsNode(x, false)) {
                    continue;
                }//选中文本包含之前被选中的节点的一部分时，给之前被选中的节点添加id可标识
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
                    $('.total_text').removeChild(div[i]);
                }
                // 移除id
                div[0].removeAttribute('id');
            } else {
                div.removeAttribute('id');
            }
            flag = false;
        }
        // 将原数组清空，重新将选中节点添加进数组中
        arr = [];
        if ($('.highlight').length > 0) {
            for (let y of $('.highlight')) {
                arr.push(y);
            }
        } else {
            arr.push($('.highlight'));
        }
    }
}

//点击进入选择模式
btns[1].onclick = () => {
    // 当页面有可选择的节点时
    if ($('.highlight')) {
        // 退出挖空模式
        flag = false;
        btns[2].classList.remove('hollow');

        $('.header_choice').classList.remove('hidden');
        flag1 = true;
        //如果可选择的节点为数组
        if ($('.highlight').length > 0) {
            for (let x of $('.highlight')) {
                x.addEventListener('click', (e) => {
                    if (flag1)
                        CancelHollowing(e.target, false);
                });
            }
        } else {
            $('.highlight').addEventListener('click', (e) => {
                if (flag1)
                    CancelHollowing(e.target, false);
            });
        }
    }

}

//点击退出选择模式
btns[6].onclick = () => {
    flag1 = false;
    $('.header_choice').classList.add('hidden');
}

//选择节点函数点击选中div中所有内容，点击取消挖空,参数e为选中节点，n为判断是否自动点击
function CancelHollowing(e, n) {
    //防止多次点击事件
    let flag2 = true;
    //获取当前选中的文本对象
    let txt = window.getSelection();
    let range = txt.getRangeAt(0);
    //将选中区域改成节点的文本内容
    range.selectNodeContents(e);
    btns[7].onclick = () => {
        if (flag2) {
            //将选中节点从数组中删除
            arr.remove(e);
            //将选中节点的文本内容克隆一份
            let str = range.cloneContents();
            //将选中节点区域扩大到整个节点
            range.selectNode(e);
            //将选中节点删除
            txt.deleteFromDocument();
            //在原来的位置重新将文本插入
            range.insertNode(str);
        }
        flag2 = false;
    }
    //如果n为true则自动执行点击事件
    if (n) {
        btns[7].click();
    }
}

let textPage = $('.text_page');
let numberOfPages = $('.number_of_pages');
let pages = textPage.length;
let pageNow = 0;
numberOfPages.innerHTML = `1/${pages}`
for (let i = 0; i < pages; i++) {
    textPage[i].style.zIndex = `${pages - i}`;
}

$('.pageUp').onclick = () => {
    if (pageNow > 0) {
        textPage[pageNow - 1].style.zIndex = pages - pageNow + 1;
        textPage[pageNow - 1].style.transform = 'rotateY(0)';
        pageNow--;
        numberOfPages.innerHTML = `${pageNow + 1}/${pages}`
    }
}

$('.pageDown').onclick = () => {
    if (pageNow < pages - 1) {
        textPage[pageNow].style.zIndex = 0;
        textPage[pageNow].style.transform = 'rotateY(360deg)';
        pageNow++;
        numberOfPages.innerHTML = `${pageNow + 1}/${pages}`
    }
}

// let reg = /\n/
// let text = textPage[0].innerHTML;
// for(let i = 0;i < text.length;i++){
//     console.log(reg.test(text[i]));
// }

