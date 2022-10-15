for (let i = 0; i < $('.footer_nav li').length; i++) {
    $('.footer_nav li')[i].onclick = () => {
        for(let x of $('.footer_nav li'))
            x.style.color = '#9fa7ba'
        $('.footer_nav li')[i].style.color = '#5184ff';
        pageReset();
        if(i == 0){
            $('.memory_base header').classList.remove('scroll_top');
        }else if(i == 1){
            $('.pk_page .pk_footer').classList.remove('scroll_top');
        }
        if(i == 3)
            return;
        $('.main_page')[i].classList.remove('scroll_top');
        
    }
}
$('.footer_nav li')[0].onclick();
function pageReset() {
    $('.memory_base header').classList.add('scroll_top');
    $('.pk_page .pk_footer').classList.add('scroll_top');
    for(let x of $('.main_page')) {
        x.classList.add('scroll_top');
    }
}
//页面开始记忆库模板的动画
window.onload = () => {
    for (let x of $('.my_base li')) {
        x.classList.add('baseLis_fadeIn');
    }
}
//模板向左滑动出现按钮
var title = null;
var info = null;
var flag_learn = false;
Array.from($('.tp_inner')).forEach((x,i) => {
    x.ontouchstart = (e) => {
        let l = 0;
        e.stopPropagation();
        // 点击模板将所有模板left改为0
        for (let k of $('.tp_inner')) {
            k.style.left = '0';
        }
        let disX = e.changedTouches[0].clientX;
        // 滑动模板出现按钮
        x.addEventListener('touchmove', function (e) {
            l = e.changedTouches[0].clientX - disX;
            if (l < -40)
                x.style.left = '-40vw';
            if (l > 10)
                x.style.left = '0';
        })
        //如果没有滑动则进入学习页面
        x.parentNode.ontouchend = () => {
            $('.learn_page .title_name').innerHTML = $('.tp_inner .title')[i].innerHTML;
            $('.learn_page .text_box').innerHTML = $('.tp_inner .info')[i].innerHTML;
            if(l == 0 && x.offsetLeft == '0'){
                $('.learn_page').style.left = '0';
                flag_learn = true;
            }
               
        }
        //点击编辑进入编辑页面
        $('.template_btn .edit')[i].onclick = () => {
            title = $('.tp_inner .title')[i];
            info = $('.tp_inner .info')[i];
            $('.edit_page .title_name').value = $('.tp_inner .title')[i].innerHTML;
            $('.edit_page .text_page').innerHTML = $('.tp_inner .info')[i].innerHTML;
            $('.edit_page').style.left = '0';
        }
        //点击删除模板
        $('.template_btn .del')[i].onclick = () => {
            x.parentNode.classList.add('baseLis_del');
        }
    }
});
//模板按钮阻止冒泡
for (let x of $('.template_btn')) {
    x.ontouchstart = (e) => e.stopPropagation();
}

document.ontouchstart = () => {
    for (let k of $('.tp_inner')) {
        k.style.left = '0';
    }
}

// 点击切换收藏
let timer = null;
$('.icon_btn').onclick = () => {
    timer = null;
    for (let x of $('.collection_base li')) {
        x.classList.remove('baseLis_fadeIn');
    }
    for (let x of $('.my_base li')) {
        x.classList.toggle('baseLis_fadeIn');
    }
    timer = setTimeout(() => {
        if ($('.icon_btn .icon').classList.contains('icon-shoucang')) {
            $('.icon_btn .icon').classList.add('icon-jiyi');
            $('.icon_btn .icon').classList.remove('icon-shoucang');
            $('.my_base').style.transform = 'scale(0)';
            $('.collection_base').style.transform = 'scale(1)';
        }else{
            $('.icon_btn .icon').classList.remove('icon-jiyi');
            $('.icon_btn .icon').classList.add('icon-shoucang');
            $('.my_base').style.transform = 'scale(1)';
            $('.collection_base').style.transform = 'scale(0)';
        }

    }, 500);
    $('.collection_base').classList.toggle('clip_path_change');
    $('.icon_btn').classList.add('change_ani');
    $('.icon_btn').addEventListener('animationend', () => {
        $('.icon_btn').classList.remove('change_ani');
        for (let x of $('.collection_base li')) {
            x.classList.add('baseLis_fadeIn');
        }
        
    })
}

//点击返回隐藏学习页面
$('.learn_page .header_left').onclick = () => {
    $('.learn_page').style.left = '100%';
}

//点击出现打卡页面
$('.memory_base .header_left').onclick = () => {
    $('.calendar_page').style.top = '0';
}

//打卡页面点击返回
$('.calendar_page .left').onclick = () => {
    $('.calendar_page').style.top = '-100%';
}

