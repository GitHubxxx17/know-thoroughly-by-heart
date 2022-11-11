let interactive = document.querySelectorAll(".inter_box");

var dainzan = document.querySelectorAll(".dainzan");
let jifen = document.querySelectorAll(".jifen");

var menu = document.querySelectorAll(".menu");
let commonArr = [];
let searchcom = false;
let browse = null;

//封装社区模板所有事件函数
function communityTP() {
    //社区模板点击菜单出现
    // Array.from(all('.menu')).forEach((x, i) => {
    //     x.addEventListener('click', function(event) {
    //         for (let k of all('.inter_box')) {
    //             k.style.width = "0";
    //         }
    //         if (all('.inter_box')[i].offsetWidth == '0') {
    //             all('.inter_box')[i].style.width = "44vw";
    //         } else {
    //             all('.inter_box')[i].style.width = "0";
    //         }
    //         event.stopPropagation(); //阻止冒泡
    //     })
    // });

    //点击收藏
    Array.from(all('.community_ul .shoucang')).forEach((x, i) => {
        for (let k of all('.collection_base .modleId')) {
            if (k.innerHTML == x.parentNode.parentNode.parentNode.previousElementSibling.innerHTML) {
                x.querySelector('.iconfont').classList.add("icon-shoucang");
                x.querySelector('.iconfont').classList.remove("icon-shoucang1");
                x.classList.add("orange");
            }
        }

        x.addEventListener('click', function (event) {
            //如果模板被收藏
            if (x.classList.contains('orange')) {
                //对比循环收藏库中的模板找出对应模板
                for (let k of all('.collection_base .modleId')) {
                    if (k.innerHTML == all('.community_ul .modleId')[i].innerHTML) {
                        ajax({
                            url: "http://8.134.104.234:8080/ReciteMemory/modle/Collection",
                            type: "get",
                            data: {
                                userId: curr.userId,
                                modleId: k.innerHTML,
                                mStatus: 0
                            },
                            dataType: "json",
                            flag: true,
                            success: function (res, xml) {
                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                $('.collection_base .base_lis').removeChild(k.parentNode.parentNode);
                                //刷新仓库
                                resetbase();
                            },
                            fail: function (status) {
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
                        userId: curr.userId,
                        modleId: all('.community_ul .modleId')[i].innerHTML,
                        mStatus: 1
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
                        let msg = JSON.parse(res).msg;
                        console.log(msg);
                        newTP(all('.community_ul .title')[i].innerHTML, all('.community_ul .info')[i].innerHTML, all('.community_ul .modleId')[i].innerHTML, all('.community_ul .label')[i].querySelectorAll('span')[1].innerHTML, 1, '未学习', false);
                        //刷新仓库
                        resetbase();
                    },
                    fail: function (status) {
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
        x.addEventListener('click', function (e) {
            if (x.classList.contains('orange')) {
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                    type: "get",
                    data: {
                        userId: curr.userId,
                        modleId: all('.community_ul .modleId')[i].innerHTML,
                        likeStatus: false
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
                        let newres = JSON.parse(res);
                        console.log(newres);
                        x.querySelector('.wenzi').innerHTML = '点赞';
                        for (let x of commonArr) {
                            for (let k of x) {
                                if (k.modleId == all('.community_ul .modleId')[i].innerHTML) {
                                    k.likeStatus = false;
                                }
                            }
                        }
                    },
                    fail: function (status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
            } else {
                ajax({
                    url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                    type: "get",
                    data: {
                        userId: curr.userId,
                        modleId: all('.community_ul .modleId')[i].innerHTML,
                        likeStatus: true
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
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
                    },
                    fail: function (status) {
                        // 此处放失败后执行的代码
                        console.log(status);
                    }
                });
            }

            x.classList.toggle("scale");
            x.querySelector(".circle").style.display = 'block';
            x.querySelector(".circle").classList.toggle("blink_circle");

            setTimeout(() => {
                x.classList.toggle("orange");
                x.querySelector('.iconfont').classList.toggle("icon-dianzan");
                x.querySelector('.iconfont').classList.toggle("icon-dianzan1");
            }, 450)
            setTimeout(() => {
                x.classList.toggle("scale");
            }, 500)
            setTimeout(() => {
                x.querySelector(".circle").style.display = 'none';
            }, 800)
            e.stopPropagation(); //阻止冒泡
        })
    });

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
                    userId: curr.userId,
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    common: 0
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
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
                fail: function (status) {
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
                                userId: curr.userId,
                                modleId: k.innerHTML,
                                mStatus: 0
                            },
                            dataType: "json",
                            flag: true,
                            success: function (res, xml) {
                                let msg = JSON.parse(res).msg;
                                console.log(msg);
                                $('.collection_base .base_lis').removeChild(k.parentNode.parentNode);
                                //刷新仓库
                                resetbase();
                            },
                            fail: function (status) {
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
                        userId: curr.userId,
                        modleId: $('.viewTemplate .modleId').innerHTML,
                        mStatus: 1
                    },
                    dataType: "json",
                    flag: true,
                    success: function (res, xml) {
                        let msg = JSON.parse(res).msg;
                        console.log(msg);
                        newTP($('.viewTemplate .title').innerHTML, $('.viewTemplate .text_box').innerHTML, $('.viewTemplate .modleId').innerHTML, $('.viewTemplate .label').innerHTML, 1, '未学习', false);
                        //刷新仓库
                        resetbase();
                    },
                    fail: function (status) {
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
                    userId: curr.userId,
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    likeStatus: false
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let newres = JSON.parse(res);
                    console.log(newres);
                    $('.viewTemplate .dainzan .vt_text').innerHTML = '点赞';
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
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        } else {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/LikeOrDisLike",
                type: "get",
                data: {
                    userId: curr.userId,
                    modleId: $('.viewTemplate .modleId').innerHTML,
                    likeStatus: true
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
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
                fail: function (status) {
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
                    userId: curr.userId,
                    modleId: modleId,
                    common: 0
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
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
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        })
    })

}
communityTP();
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
    commonArr[0] = [];

    for (let i = 1; i <= 3; i++) {
        setTimeout(() => {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/inf.get/getModlesByTag",
                type: "get",
                data: {
                    userId: curr.userId,
                    modleLabel: i,
                    pageIndex: 0
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.content != '参数获取失败') {
                        let comarr = [];
                        for (let x of msg.data.modleList) {
                            if (x.common != 0) {
                                comarr.push(x);
                            }
                        }
                        commonArr[i] = comarr;
                        console.log(comarr, commonArr);
                        if (comarr.length != 0) {
                            for (let x of comarr) {
                                if (x.userId == 50)
                                    commonArr[0].push(x);
                            }
                        }
                    }
                    communityTP();
                    $('.community header .label li')[0].onclick();
                    $('.com_loading').style.display = 'none';
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        },10);
        
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

//上传到社区
$('.uploadMP').onclick = () => {
    Array.from(all('.upload_page .select .circle')).forEach((x, i) => {
        let modleId = all('.upload_page li')[i].querySelector('.modleId').innerHTML;
        let common = 0;
        if (x.classList.contains('selected')) {
            common = 1;
        }



        setTimeout(() => {
            ajax({
                url: "http://8.134.104.234:8080/ReciteMemory/modle/toCommunity",
                type: "post",
                data: {
                    userId: curr.userId,
                    modleId: modleId,
                    common: common
                },
                dataType: "json",
                flag: true,
                success: function (res, xml) {
                    let msg = JSON.parse(res).msg;
                    console.log(msg);
                    if (msg.code == '200') {
                        $('.upload_page .back').onclick();
                    }
                    for (let k of all('.my_base li')) {
                        if (k.querySelector('.modleId').innerHTML == modleId) {
                            k.querySelector('.common').innerHTML = common
                        }
                    }
                },
                fail: function (status) {
                    // 此处放失败后执行的代码
                    console.log(status);
                }
            });
        }, 10);

        for (let k of all('.my_base .tp_inner')) {
            if (x.classList.contains('selected')) {
                k.querySelector('.common').innerHTML = '1';
            } else {
                k.querySelector('.common').innerHTML = '0';
            }
        }

        if (i == all('.upload_page .select .circle').length - 1) {
            setTimeout(() => {
                $('.community_ul').innerHTML = '<li class="footer"></li>';
                xrcomTP();
            },50);

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
        if (i == 0 && commonArr[0].length != 0) {
            for (let k of commonArr[0]) {
                let name_flag = true;
                if (k.nickName == curr.userInfo.nickName)
                    name_flag = false;
                let newcont = k.content.replace(/<空格>/g, '&nbsp;');

                comTP(k.modleTitle, newcont, k.modleId, k.modleLabel, k.base64, k.nickName, k.likeNum, k.likeStatus, name_flag);
            }
        }
        if (commonArr[labelId1(x.innerText)] && i != 0) {
            for (let k of commonArr[labelId1(x.innerText)]) {
                let name_flag = true;
                if (k.nickName == curr.userInfo.nickName)
                    name_flag = false;
                let newcont = k.content.replace(/<空格>/g, '&nbsp;');
                comTP(k.modleTitle, newcont, k.modleId, k.modleLabel, k.base64, k.nickName, k.likeNum, k.likeStatus, name_flag);
            }
        }
        communityTP();
    }
})