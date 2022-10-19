//数组用来存放答案
let arr4 = [];

//利用循环将选中的节点内容替换
for (let x of all('.enterPK .highlight')) {
    arr4.push(x.innerText);
    x.setAttribute('contenteditable', true)
    x.setAttribute('tabindex', '-1')
    x.innerHTML = '请输入答案';
    // 点击可输入答案
    x.onclick = (e) => {
        answer(x);
        e.stopPropagation();
    };
    x.classList.add('input');
}

function answer(x) {
    for (let k of all('.enterPK .highlight')) {
        if (k.innerHTML == '')
            k.innerHTML = '请输入答案';
    }

    if (x.innerHTML == '请输入答案')
        x.innerHTML = ''
}

$('.head_nav_pk .back').onclick = () => {
    $('.enterPk').style.left = '-100%';
}