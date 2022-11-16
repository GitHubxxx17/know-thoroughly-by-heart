let interactive = document.querySelectorAll(".inter_box");

var dainzan = document.querySelectorAll(".dainzan");
let jifen = document.querySelectorAll(".jifen");

var menu = document.querySelectorAll(".menu");
let commonArr = [];
let searchcom = false;
let browse = null;

//封装社区模板所有事件函数
function communityTP() {
    //点击收藏
    Array.from(all('.community_ul .shoucang')).forEach((x, i) => {
        for (let k of all('.collection_base .modleId')) {
            if (k.innerHTML == x.parentNode.parentNode.parentNode.previousElementSibling.innerHTML) {
                x.querySelector('.iconfont').classList.add("icon-shoucang");
                x.querySelector('.iconfont').classList.remove("icon-shoucang1");
                x.classList.add("orange");
            }
        }

        x.addEventListener('click', function(event) {
            //如果模板被收藏
            if (x.classList.contains('orange')) {
                //对比循环收藏库中的模板找出对应模板
                for (let k of all('.collection_base .modleId')) {
                    if (k.innerHTML == all('.community_ul .modleId')[i].innerHTML) {
                        ajax({
                            url: "http://8.134.104.234:8080/ReciteMemory/modle/Collection",
                            type: "get",
                            data: {
                                modleId: k.innerHTML,
                                mStatus: 0
                            },
                            dataType: "json",
                            flag: true,
                            success: function(res, xml) {
                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                $('.collection_base .base_lis').removeChild(k.parentNode.parentNode);
                                //刷新仓库
                                resetbase();
                            },
                            fail: function(status) {
                                // 此处放失败后执行的代码
                                console.log(status);
                            }
                        });

                    }
                }
                // 模板未收藏
            } else {
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/modle/Collection",
                    type: "get",
                    data: {
                        modleId: all('.community_ul .modleId')[i].innerHTML,
                        mStatus: 1
                    },
                    dataType: "json",
                    flag: true,
                    success: function(res, xml) {
                        let msg = JSON.parse(res).msg;
                        console.log(msg);
                        newTP(all('.community_ul .title')[i].innerHTML, all('.community_ul .info')[i].innerHTML, all('.community_ul .modleId')[i].innerHTML, all('.community_ul .label')[i].querySelectorAll('span')[1].innerHTML, 1, '未学习', false);
                        //刷新仓库
                        resetbase();
                    },
                    fail: function(status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
            }

            x.classList.toggle("orange");
            x.querySelector('.iconfont').classList.toggle("icon-shoucang");
            x.querySelector('.iconfont').classList.toggle("icon-shoucang1");
            // setTimeout(() => all('.inter_box')[i].style.width = "0", 600);
            event.stopPropagation(); //阻止冒泡

        })
    });

    //点赞
    Array.from(all('.community_ul .dainzan')).forEach((x, i) => {
        let isclick = true;
        x.addEventListener('click', function(e) {
            if (isclick) {
                // isclick = false;
                if (x.classList.contains('orange')) {
                    console.log("取消点赞成功！！！！")
                    ajax({
                        url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                        type: "get",
                        data: {
                            modleId: all('.community_ul .modleId')[i].innerHTML,
                            likeStatus: false
                        },
                        dataType: "json",
                        flag: true,
                        success: function(res, xml) {
                            let newres = JSON.parse(res);
                            console.log(newres);
                            console.log(parseInt(x.querySelector('.wenzi').innerText), x.querySelector('.wenzi').innerText);
                            if(parseInt(x.querySelector('.wenzi').innerText) - 1 == 0){
                                x.querySelector('.wenzi').innerHTML = '点赞'
                            }
                            else if (parseInt(x.querySelector('.wenzi').innerText) - 1 < 1000) {
                                x.querySelector('.wenzi').innerHTML = `&nbsp;${parseInt(x.querySelector('.wenzi').innerText) - 1}&nbsp;&nbsp;`;
                            } else {
                                x.querySelector('.wenzi').innerHTML = `${parseInt(x.querySelector('.wenzi').innerText) - 1}`;
                            }
                            for (let x of commonArr) {
                                for (let k of x) {
                                    if (k.modleId == all('.community_ul .modleId')[i].innerHTML) {
                                        k.likeStatus = false;
                                    }
                                }
                            }
                            setTimeout(() => {
                                isclick = true;
                            }, 450)
                        },
                        fail: function(status) {
                            // 此处放失败后执行的代码
                            console.log(status);
                        }
                    });
                } else {
                    console.log("点赞成功！！！！")

                    ajax({
                        url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                        type: "get",
                        data: {
                            modleId: all('.community_ul .modleId')[i].innerHTML,
                            likeStatus: true
                        },
                        dataType: "json",
                        flag: true,
                        success: function(res, xml) {
                            let msg = JSON.parse(res).msg;
                            console.log(msg);

                            if (msg.data.likeNum < 1000) {
                                x.querySelector('.wenzi').innerHTML = `&nbsp;${msg.data.likeNum}&nbsp;&nbsp;`;
                            } else {
                                x.querySelector('.wenzi').innerHTML = `${msg.data.likeNum}`;
                            }

                            for (let x of commonArr) {
                                for (let k of x) {
                                    if (k.modleId == all('.community_ul .modleId')[i].innerHTML) {
                                        k.likeStatus = true;
                                        k.likeNum = msg.data.likeNum;
                                    }
                                }
                            }
                            setTimeout(() => {
                                isclick = true;
                            }, 500);
                        },
                        fail: function(status) {
                            // 此处放失败后执行的代码
                            console.log(status);
                        }
                    });
                }

                x.classList.toggle("scale");
                x.querySelector(".circle").style.display = 'block';
                x.querySelector(".circle").classList.toggle("blink_circle");
                x.classList.toggle("orange");
                x.querySelector('.iconfont').classList.toggle("icon-dianzan");
                x.querySelector('.iconfont').classList.toggle("icon-dianzan1");
                // setTimeout(() => {

                // }, 450)
                setTimeout(() => {
                    x.classList.toggle("scale");
                }, 500)
                setTimeout(() => {
                    x.querySelector(".circle").style.display = 'none';
                }, 800)
                e.stopPropagation(); //阻止冒泡
            } else {
                console.log("不能重复点赞");
                $('.community .popup_box').innerHTML = '请勿操作过快';
                $('.community .popup_box').style.display = 'block';
            }

        })
    });

    //点击页面隐藏菜单
    document.addEventListener('click', function(event) {
        for (let k of all('.inter_box')) {
            k.style.width = "0";
        }
        event.stopPropagation(); //阻止冒泡

    });

    //点击浏览模板
    Array.from(all('.community_ul .content')).forEach((x, i) => {
        x.addEventListener('click', function(event) {
            searchcom = false;
            $('.viewTemplate .modleId').innerHTML = all('.community_ul .modleId')[i].innerHTML;
            $('.community').onclick();
            if (x.parentNode.querySelector('.idname1').innerHTML == curr.userInfo.nickName) {
                $('.viewTemplate footer .shoucang .iconfont').classList.add('icon-a-shanchulajitong');
                $('.viewTemplate footer .shoucang .iconfont').classList.remove('icon-shoucang1');
                $('.viewTemplate footer .shoucang .vt_text').innerHTML = '删除';
            } else {
                $('.viewTemplate footer .shoucang .iconfont').classList.remove('icon-a-shanchulajitong');
                $('.viewTemplate footer .shoucang .iconfont').classList.add('icon-shoucang1');
                $('.viewTemplate footer .shoucang .vt_text').innerHTML = '收藏';

                //渲染浏览页面的收藏
                if (x.nextElementSibling.querySelector('.shoucang .iconfont').classList.contains('icon-shoucang')) {
                    $('.viewTemplate .shoucang .iconfont').classList.add('icon-shoucang');
                    $('.viewTemplate .shoucang .iconfont').classList.remove('icon-shoucang1');
                    $('.viewTemplate .shoucang .vt_text').classList.add('orange');
                }
            }

            //渲染浏览页面的点赞
            if (x.nextElementSibling.querySelector('.dainzan .iconfont').classList.contains('icon-dianzan1')) {
                $('.viewTemplate .dainzan .iconfont').classList.remove('icon-dianzan');
                $('.viewTemplate .dainzan .iconfont').classList.add('icon-dianzan1');
                $('.viewTemplate .dainzan .vt_text').classList.add('orange');
                $('.viewTemplate .dainzan .vt_text').innerHTML = x.nextElementSibling.querySelector('.dainzan .wenzi').innerHTML;
            }else{
                $('.viewTemplate .dainzan .vt_text').innerHTML = x.nextElementSibling.querySelector('.dainzan .wenzi').innerHTML;
            }

            $('.viewTemplate').classList.remove('scroll_top');
            $('.viewTemplate footer').classList.remove('scroll_top');
            $('.viewTemplate .idname').innerHTML = all('.community_ul .idname1')[i].innerHTML;
            $('.viewTemplate .title').innerHTML = all('.community_ul .title')[i].innerHTML;
            $('.viewTemplate .text_box').innerHTML = all('.community_ul .info')[i].innerHTML;
            $('.viewTemplate .label').innerHTML = all('.community_ul .label')[i].innerHTML;
            $('.viewTemplate .head_portrait').innerHTML = all('.community_ul .head_portrait')[i].innerHTML;
            event.stopPropagation(); //阻止冒泡

            browse = x.nextElementSibling;
        });
    })


    //浏览模板点击收藏或删除
    $('.viewTemplate .shoucang').onclick = () => {

        if ($('.viewTemplate footer .shoucang .vt_text').innerHTML == '删除') {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/toCommunity",
                type: "post",
                data: {
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    common: 0
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.code == '200') {
                        for (let k of all('.my_base .tp_inner')) {
                            if (k.innerHTML == modleId) {
                                k.querySelector('.common').innerHTML = '0';
                            }
                        }
                        xrcomTP();
                        $('.viewTemplate .back').onclick();
                        $('.community header .label li')[0].onclick();
                        if (searchcom) {
                            for (let x of all('.search_page li')) {
                                if (x.querySelector('.modleId').innerHTML == $('.viewTemplate .modleId').innerHTML) {
                                    $('.search_page ul').removeChild(x);
                                }
                            }
                        }
                    }
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });

        } else {
            //如果模板被收藏
            if ($('.viewTemplate .shoucang .iconfont').classList.contains('icon-shoucang')) {
                //对比循环收藏库中的模板找出对应模板
                for (let k of all('.collection_base .modleId')) {
                    if (k.innerHTML == $('.viewTemplate .modleId').innerHTML) {
                        ajax({
                            url: "http://8.134.104.234:8080/ReciteMemory/modle/Collection",
                            type: "get",
                            data: {
                                modleId: k.innerHTML,
                                mStatus: 0
                            },
                            dataType: "json",
                            flag: true,
                            success: function(res, xml) {
                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                $('.collection_base .base_lis').removeChild(k.parentNode.parentNode);
                                //刷新仓库
                                resetbase();
                            },
                            fail: function(status) {
                                // 此处放失败后执行的代码
                                console.log(status);
                            }
                        });
                    }
                }
                // 模板未收藏
            } else {
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/modle/Collection",
                    type: "get",
                    data: {
                        modleId: $('.viewTemplate .modleId').innerHTML,
                        mStatus: 1
                    },
                    dataType: "json",
                    flag: true,
                    success: function(res, xml) {
                        let msg = JSON.parse(res).msg;
                        console.log(msg);
                        newTP($('.viewTemplate .title').innerHTML, $('.viewTemplate .text_box').innerHTML, $('.viewTemplate .modleId').innerHTML, $('.viewTemplate .label').innerHTML, 1, '未学习', false);
                        //刷新仓库
                        resetbase();
                    },
                    fail: function(status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
            }
            $('.viewTemplate .shoucang .iconfont').classList.toggle('icon-shoucang');
            $('.viewTemplate .shoucang .iconfont').classList.toggle('icon-shoucang1');
            $('.viewTemplate .shoucang .vt_text').classList.toggle('orange');

            if (!searchcom) {
                if ($('.viewTemplate .shoucang .vt_text').classList.contains('orange')) {
                    browse.querySelector('.shoucang').classList.add("orange");
                    browse.querySelector('.shoucang .iconfont').classList.add("icon-shoucang");
                    browse.querySelector('.shoucang .iconfont').classList.remove("icon-shoucang1");
                } else {
                    browse.querySelector('.shoucang').classList.remove("orange");
                    browse.querySelector('.shoucang .iconfont').classList.remove("icon-shoucang");
                    browse.querySelector('.shoucang .iconfont').classList.add("icon-shoucang1");
                }
            }

        }
    }

    //浏览模板点赞
    $('.viewTemplate .dainzan').onclick = () => {
        if ($('.viewTemplate .dainzan .iconfont').classList.contains('icon-dianzan1')) {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                type: "get",
                data: {
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    likeStatus: false
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let newres = JSON.parse(res);
                    console.log(newres);
                    console.log(parseInt($('.viewTemplate .dainzan .vt_text').innerText));
                    if(parseInt($('.viewTemplate .dainzan .vt_text').innerText) - 1 == 0){
                        $('.viewTemplate .dainzan .vt_text').innerHTML = '点赞'
                    }
                    else if (parseInt($('.viewTemplate .dainzan .vt_text').innerText) - 1 < 1000) {
                        $('.viewTemplate .dainzan .vt_text').innerHTML = `&nbsp;${parseInt($('.viewTemplate .dainzan .vt_text').innerText) - 1}&nbsp;&nbsp;`;
                    } else {
                        $('.viewTemplate .dainzan .vt_text').innerHTML = `${parseInt($('.viewTemplate .dainzan .vt_text').innerText) - 1}`;
                    }
                    if (!searchcom)
                        browse.querySelector('.dainzan .wenzi').innerHTML = '点赞';
                    for (let x of commonArr) {
                        for (let k of x) {
                            if (k.modleId == $('.viewTemplate .modleId').innerHTML) {
                                k.likeStatus = false;
                            }
                        }
                    }
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        } else {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                type: "get",
                data: {
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    likeStatus: true
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.data.likeNum < 1000) {
                        $('.viewTemplate .dainzan .vt_text').innerHTML = `&nbsp;${msg.data.likeNum}&nbsp;&nbsp;`;
                    } else {
                        $('.viewTemplate .dainzan .vt_text').innerHTML = `${msg.data.likeNum}`;
                    }
                    if (!searchcom)
                        browse.querySelector('.dainzan .wenzi').innerHTML = msg.data.likeNum;
                    for (let x of commonArr) {
                        for (let k of x) {
                            if (k.modleId == $('.viewTemplate .modleId').innerHTML) {
                                k.likeStatus = true;
                                k.likeNum = msg.data.likeNum;
                            }
                        }
                    }
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        }
        $('.viewTemplate .dainzan .iconfont').classList.toggle('icon-dianzan');
        $('.viewTemplate .dainzan .iconfont').classList.toggle('icon-dianzan1');
        $('.viewTemplate .dainzan .vt_text').classList.toggle('orange');

        if (!searchcom) {
            if ($('.viewTemplate .dainzan .vt_text').classList.contains('orange')) {
                browse.querySelector('.dainzan').classList.add("orange");
                browse.querySelector('.dainzan .iconfont').classList.add("icon-dianzan1");
                browse.querySelector('.dainzan .iconfont').classList.remove("icon-dianzan");
            } else {
                browse.querySelector('.dainzan').classList.remove("orange");
                browse.querySelector('.dainzan .iconfont').classList.remove("icon-dianzan1");
                browse.querySelector('.dainzan .iconfont').classList.add("icon-dianzan");
            }
        }
    }

    //点击出现删除
    Array.from(all('.community_ul .right')).forEach((x, i) => {
        x.querySelector('.icon-shixincaidan').onclick = (e) => {
            if (x.querySelector('.del').style.display == "none") {
                x.querySelector('.del').style.display = "block";
            } else {
                x.querySelector('.del').style.display = "none";
            }
            e.stopPropagation();
        }
    });

    //点击删除上传的模板
    Array.from(all('.community_ul .del')).forEach((x, i) => {
        x.addEventListener('click', (e) => {
            e.stopPropagation(); //阻止冒泡
            let modleId = x.parentNode.parentNode.parentNode.previousElementSibling.innerHTML;
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/toCommunity",
                type: "post",
                data: {
                    modleId: modleId,
                    common: 0
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.code == '200') {
                        for (let k of all('.my_base .tp_inner')) {
                            if (k.innerHTML == modleId) {
                                k.querySelector('.common').innerHTML = '0';
                            }
                        }
                        xrcomTP();
                        $('.community header .label li')[0].onclick();
                    }
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        })
    })

}

//浏览页面点击返回
$('.viewTemplate .back').onclick = () => {
    $('.viewTemplate').classList.add('scroll_top');
    $('.viewTemplate footer').classList.add('scroll_top');
    $('.viewTemplate .shoucang .vt_text').classList.remove('orange');
    $('.viewTemplate .shoucang .iconfont').classList.remove('icon-shoucang');
    $('.viewTemplate .dainzan .iconfont').classList.remove('icon-dianzan1');
    $('.viewTemplate .dainzan .iconfont').classList.add('icon-dianzan');
    $('.viewTemplate .dainzan .vt_text').classList.remove('orange');
    $('.viewTemplate .dainzan .vt_text').innerHTML = '点赞';

    if (searchcom) {
        $('.community header .label li')[0].onclick();
    }
};
//渲染社区模板
function xrcomTP() {
    $('.community_ul').innerHTML = '<li class="footer"></li>';
    commonArr = [];
    let index = 0;
    AllLabelcomTP();

    function AllLabelcomTP() {
        if (index >= 4) {
            return;
        } else {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/inf.get/getModlesByTag",
                type: "get",
                data: {
                    modleLabel: index,
                    pageIndex: 0
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.content != '参数获取失败') {
                        let comarr = [];
                        for (let x of msg.data.modleList) {
                            if (x.common != 0) {
                                comarr.unshift(x);
                            }
                        }
                        commonArr[index] = comarr;
                        console.log(comarr, commonArr);
                    }
                    communityTP();
                    $('.com_loading').style.display = 'none';
                    index++;
                    AllLabelcomTP();
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        }

        ajax({
            url: "http://8.134.104.234:8080/ReciteMemory/inf.get/getHotModle",
            type: "get",
            data: {
                pageIndex: 0
            },
            dataType: "json",
            flag: true,
            success: function(res, xml) {
                let msg = JSON.parse(res).msg;
                console.log(msg);
                if (msg.content == '获取成功') {
                    let comarr = [];
                    if (msg.data.selectSuccess) {
                        for (let x of msg.data.modleList) {
                            if (x.common != 0) {
                                comarr.unshift(x);
                            }
                        }
                        commonArr[4] = comarr;
                    }

                }
                communityTP();
                $('.com_loading').style.display = 'none';
            },
            fail: function(status) {
                // 此处放失败后执行的代码
                console.log(status);
            }
        });
    }


}
xrcomTP();
$('.community').onclick = () => {
    for (let x of all('.community_ul .del')) {
        x.style.display = 'none';
    }
}

//点击进入上传页面
$('.community .upload').onclick = () => {
    $('.upload_page').classList.remove('scroll_top');
    for (let x of all('.my_base .tp_inner')) {
        let modleId = x.querySelector('.modleId').innerHTML;
        let title = x.querySelector('.title').innerHTML;
        let context = x.querySelector('.info').innerHTML;
        let label = x.querySelector('.label').innerHTML;
        let common = x.querySelector('.common').innerHTML;
        UploadTP(title, context, modleId, label, common);
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

//上传页面切换按钮
for (let i = 0; i < $('.sb_btn').length; i++) {
    $('.sb_btn')[i].onclick = () => {
        let x = -100 * i;
        $('.upload_page .container_scroll').style.left = `${x}vw`;
        for (let k of $('.sb_btn')) {
            k.classList.remove('sbtn_line')
        }
        $('.sb_btn')[i].classList.add('sbtn_line')
        if (i == 0) {
            $('.uploadMP').innerHTML = '上传';
        } else {
            $('.uploadMP').innerHTML = '删除';
        }
    }
}

//批量上传或删除社区模板
$('.uploadMP').onclick = () => {
    let common = 0;
    let index = 0;
    let modleIdArr = [];
    if ($('.uploadMP').innerHTML == '上传') {
        for (let x of all('.upload_page .notUploaded li')) {
            if (x.querySelector('.select .circle').classList.contains('selected')) {
                modleIdArr.push(x.querySelector('.modleId').innerHTML);
            }
        }
        common = 1;
    } else {
        for (let x of all('.upload_page .Uploaded li')) {
            if (x.querySelector('.select .circle').classList.contains('selected')) {
                modleIdArr.push(x.querySelector('.modleId').innerHTML);
            }
        }
    }
    console.log(modleIdArr);
    batchUploadTP();

    function batchUploadTP() {
        if (index >= modleIdArr.length) {
            if (common == 1) {
                $('.community .popup_box').innerHTML = '上传成功';
            } else {
                $('.community .popup_box').innerHTML = '取消上传成功';
            }
            $('.community .popup_box').style.display = 'block';
            $('.upload_page .back').onclick();
            return;
        } else {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/toCommunity",
                type: "post",
                data: {
                    modleId: modleIdArr[index],
                    common: common
                },
                dataType: "json",
                flag: true,
                success: function(res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    for (let k of all('.my_base li')) {
                        if (k.querySelector('.modleId').innerHTML == modleIdArr[index]) {
                            k.querySelector('.common').innerHTML = common
                            break;
                        }
                    }
                    index++;
                    batchUploadTP();
                },
                fail: function(status) {
                    // 此处放失败后执行的代码
                    $('.community .popup_box').innerHTML = '上传失败';
                    $('.community .popup_box').style.display = 'block';
                    console.log(status);
                }
            });
        }

    }
}

//上传页面点击返回
$('.upload_page .back').onclick = () => {
    $('.upload_page').classList.add('scroll_top');
    $('.upload_page .Uploaded ul').innerHTML = ''
    $('.upload_page .notUploaded ul').innerHTML = ''
    $('.sb_btn')[0].onclick();
}

let nextpage = [];
let refreshcom = false;
let nextcom = false;
//切换标签
Array.from($('.community header .label li')).forEach((x, i) => {
    nextpage[i] = 0;
    x.onclick = () => {
        nextcom = false;
        $('.community_ul').innerHTML = `<li class="footer">
                                            <div class="footer_loading">
                                                <span class="icon iconfont icon-a-zhongzhishuaxin"></span>
                                                <span>正在加载中······</span>
                                            </div>
                                            <div class="footer_end">(～￣▽￣)～已经到底啦~~</div>
                                        </li>`;
        for (let k of $('.community header .label li')) {
            k.classList.remove('active');
        }
        x.classList.add('active');
        if (commonArr[labelId1(x.innerText)]) {
            for (let k of commonArr[labelId1(x.innerText)]) {
                let name_flag = true;
                if (k.nickName == curr.userInfo.nickName)
                    name_flag = false;

                let newcont = ''
                if (k.content) {
                    newcont = k.content.replace(/<空格>/g, '&nbsp;');
                }

                comTP(k.modleTitle, newcont, k.modleId, k.modleLabel, k.base64, k.nickName, k.likeNum, k.likeStatus, name_flag);
            }
        }
        communityTP();
        refreshcom = false;

        // if (commonArr[labelId1(x.innerText)].length >= 5) {
        //     $('.footer_loading').style.display = 'flex';
        // }
    }
})



let timer11 = null;
let timer12 = null;
let timer13 = null;
let timer14 = null;
//社区向下拉动刷新
$('.community_ul').ontouchstart = (e) => {
    let touch_s = e.changedTouches[0].clientY;
    let touch_e1 = 0;
    clearTimeout(timer11);
    clearTimeout(timer12);
    // clearTimeout(timer12);
    clearTimeout(timer14);
    if ($('.community_ul').scrollTop == 0) {
        $('.com_loading_up').style.transition = '';
    }
    $('.community_ul').ontouchmove = (e) => {
        
        if ($('.community_ul').scrollTop == 0) {
            touch_e1 = e.changedTouches[0].clientY;
            if (touch_e1 - touch_s > 10 && touch_e1 - touch_s < 110) {
                for (let x of $('.community header .label li')) {
                    if (x.classList.contains('active') && labelId1(x.querySelector('span').innerHTML) != 4){
                        $('.com_loading_up').style.top = (touch_e1 - touch_s + 40) / 3.95 + 'vw';
                        $('.com_loading_up').style.opacity = (touch_e1 - touch_s + 40) / 150;
                    }
                }
            }
        }
        if (Math.abs($('.community_ul').scrollTop + $('.community_ul').offsetHeight - $('.community_ul').lastChild.offsetTop - $('.community_ul').lastChild.offsetHeight) <= 1) {
            $('.footer_loading').style.display = 'flex';
            $('.community_ul .footer').style.height = '46vw';
            // console.log($('.community_ul .footer').offsetHeight);
        }
    }

    $('.community_ul').ontouchend = (e) => {
        //下拉刷新模板
        if (touch_e1 - touch_s >= 110 && $('.community_ul').scrollTop == 0) {
            $('.community_ul').ontouchmove = null;
            $('.com_loading_up .icon').classList.add('rotateLoading');

            for (let x of $('.community header .label li')) {
                    if (x.classList.contains('active') && labelId1(x.querySelector('span').innerHTML) != 4) {
                        ajax({
                            url: "http://8.134.104.234:8080/ReciteMemory/inf.get/getRandomModles",
                            type: "get",
                            data: {
                                modleLabel: labelId1(x.querySelector('span').innerHTML),
                            },
                            dataType: "json",
                            flag: true,
                            success: function(res, xml) {
                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                if (msg.content != '参数获取失败') {
                                    nextpage[labelId1(x.querySelector('span').innerHTML)] = 0;
                                    let comarr = [];
                                    for (let x of msg.data.modle) {
                                        if (x.common != 0) {
                                            comarr.unshift(x);
                                        }
                                    }
                                    commonArr[labelId1(x.querySelector('span').innerHTML)] = comarr;
                                    console.log(comarr, commonArr);
                                }
                                timer11 = setTimeout(() => {
                                    $('.com_loading_up').style.transition = 'all .5s';
                                    $('.com_loading_up').style.top = '10vw';
                                    $('.com_loading_up').style.opacity = '0';
                                    $('.com_loading_up .icon').classList.remove('rotateLoading');
                                    clearTimeout(timer11);
                                }, 1000);
                                communityTP();
                                refreshcom = true;
                                x.onclick();
                                $('.com_loading').style.display = 'none';
                            },
                            fail: function(status) {
                                // 此处放失败后执行的代码
                                console.log(status);
                            }
                        });
                    }
            }


        } else {
            $('.com_loading_up').style.transition = 'all .3s';
            $('.com_loading_up').style.top = '10vw';
            $('.com_loading_up').style.opacity = '0';

        }
        //划到底部获取模板
        console.log($('.community_ul li').length, $('.community_ul .footer').offsetHeight, 46 * document.body.clientWidth / 100);
        timer14 = setTimeout(() => {
            let community_url;
            if ($('.community_ul li').length >= 5 && Math.abs($('.community_ul .footer').offsetHeight - 46 * document.body.clientWidth / 100) <= 1) {
                let ul_stop = $('.community_ul').scrollTop;
                $('.community_ul').ontouchmove = null;
                $('.footer_loading .icon').classList.add('rotateLoading');
                for (let x of $('.community header .label li')) {
                    if (labelId1(x.querySelector('span').innerHTML) == 4) {
                        community_url = "http://8.134.104.234:8080/ReciteMemory/inf.get/getHotModle";
                    } else {
                        community_url = "http://8.134.104.234:8080/ReciteMemory/inf.get/getModlesByTag"
                    }
                    if (x.classList.contains('active')) {
                        if (nextpage[labelId1(x.querySelector('span').innerHTML)] == 0)
                            nextpage[labelId1(x.querySelector('span').innerHTML)]++;
                        ajax({
                            url: community_url,
                            type: "get",
                            data: {
                                modleLabel: labelId1(x.querySelector('span').innerHTML),
                                pageIndex: nextpage[labelId1(x.querySelector('span').innerHTML)]
                            },
                            dataType: "json",
                            flag: true,
                            success: function(res, xml) {

                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                nextcom = true;
                                if (msg.content == '无模板') {
                                    $('.community_ul .footer').style.height = '46vw';
                                    $('.footer_end').style.display = 'flex';
                                    $('.footer_loading').style.display = 'none';
                                    return;
                                }
                                if (msg.content != '参数获取失败') {
                                    nextpage[labelId1(x.querySelector('span').innerHTML)]++;
                                    let len = 0;
                                    for (let k of msg.data.modleList) {
                                        let flag = true;
                                        for (let n of commonArr[labelId1(x.querySelector('span').innerHTML)]) {
                                            if (k.modleId == n.modleId) {
                                                flag = false;
                                                break;
                                            }

                                        }
                                        if (flag){
                                            commonArr[labelId1(x.querySelector('span').innerHTML)].unshift(k);
                                            len++;
                                        }     
                                    }
                                    console.log(commonArr[labelId1(x.querySelector('span').innerHTML)].length % 5);
                                    for (let i = len - 1; i >= 0; i--) {
                                        let k = commonArr[labelId1(x.querySelector('span').innerHTML)][i];
                                        let name_flag = true;
                                        if (k.nickName == curr.userInfo.nickName)
                                            name_flag = false;
                                        let newcont = k.content.replace(/<空格>/g, '&nbsp;');
                                        comTP(k.modleTitle, newcont, k.modleId, k.modleLabel, k.base64, k.nickName, k.likeNum, k.likeStatus, name_flag);
                                    }
                                    communityTP();
                                    timer12 = setTimeout(() => {
                                        $('.community_ul').scrollTop = ul_stop;
                                        $('.community_ul .footer').style.height = '32vw';
                                        $('.footer_loading .icon').classList.remove('rotateLoading');
                                        clearTimeout(timer12);
                                    }, 1000);
                                } else {
                                    $('.community_ul .footer').style.height = '46vw';
                                    $('.footer_end').style.display = 'flex';
                                    $('.footer_loading').style.display = 'none';
                                }


                            },
                            fail: function(status) {
                                // 此处放失败后执行的代码
                                console.log(status);
                            }
                        });
                    }
                }
            } else {

                if ($('.community_ul li').length >= 3 && $('.community_ul li').length <= 5 && Math.abs($('.community_ul .footer').offsetHeight - 46 * document.body.clientWidth / 100) <= 1) {
                    $('.community_ul .footer').style.height = '46vw';
                    $('.footer_end').style.display = 'flex';
                    $('.footer_loading').style.display = 'none';
                }

            }
        }, 300);
    }


}

//点赞过快的弹窗动画监听
let dianzan_fast = document.querySelector(".dianzan_fast");

function endAnimation() {
    console.log("dianzan_fast-animationend");
    $('.community .popup_box').style.display = 'none';
}

//dianzan_fast
dianzan_fast.addEventListener("webkitAnimationEnd", endAnimation, false);
dianzan_fast.addEventListener("mozAnimationEnd", endAnimation, false);
dianzan_fast.addEventListener("MSAnimationEnd", endAnimation, false);
dianzan_fast.addEventListener("oanimationend", endAnimation, false);
dianzan_fast.addEventListener("animationend", endAnimation, false);