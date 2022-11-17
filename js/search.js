//搜索功能的实现
let header_search_memory = document.getElementById("header_search_memory");
let ul_context = $(".search_lis");

function createTemp(judge_personal) { //judge_personal：用于去判断是否是社区
    //获取记忆库的模板
    let tp_inner;
    let arr = [];
    $(".search_page .empty").style.display = 'none';
    if (judge_personal) {
        tp_inner = all(".me_base .tp_inner");
        console.log("记忆库搜索")
        for (let x of tp_inner) {
            let model_id = x.childNodes[1];
            let model_title = x.querySelector('.title');
            let model_label = x.querySelector('.label_title');
            let model_info = x.querySelector('.info');
            arr.push({ model_id: model_id.innerHTML, model_title: model_title.innerHTML, model_label: model_label.innerHTML, model_info: model_info.innerHTML })
        }
    } else {
        tp_inner = all(".community .community_ul li");
        console.log("社区搜索");
        for (let x of commonArr) {
            for (let k of x) {
                let model_id = k.modleId;
                let model_title = k.modleTitle;
                let model_label = labelId2(k.modleLabel);
                let model_info = k.content.replace(/<空格>/g, '&nbsp;');
                let judge_add = true;
                for (let a of arr) {
                    if (a.model_id == k.modleId) {
                        judge_add = false;
                        break;
                    }
                }
                if (judge_add) {
                    arr.push({ model_id: model_id, model_title: model_title, model_label: model_label, model_info: model_info });
                }
            }
        }
    }



    //获取搜索框的值
    var search_value = header_search_memory.value;

    let arrnew = arr.map((item, index) => {
        //Object.assign方法用来将源对象（source）的所有可枚举属性，复制到目标对象（target）。
        return Object.assign({}, {
            'model_title': item.model_title,
            'model_id': item.model_id,
            'judgeUse': false,
        })

    });
    //filter()方法用于过滤数组元素。该方法创建一个新数组, 其中包含通过所提供函数实现的测试的所有元素。filter()不会对空数组进行检测，也不会改变原始数组。
    var newData = arrnew.filter(item => {
        if (item.model_title.indexOf(search_value) > -1) { //indexOf方法中如果xxx.indexOf("")返回值为0
            //console.log(item);
            item.judgeUse = true;
            return item;
        }
        return newData;
    });
    //如果没用完全匹配的话就模糊搜索
    for (let x of arrnew) {
        if (hasSameCharacter(x.model_title, search_value)) {
            if (!x.judgeUse) {
                newData.push(x);
            }

        }
    }

    if (newData.length == 0) {
        $(".search_page .empty").style.display = 'block';
        if (judge_personal) {
            $(".search_page .personal_empty").style.display = 'block';
            $(".search_page .community_empty").style.display = 'none';
        } else {
            $(".search_page .personal_empty").style.display = 'none';
            $(".search_page .community_empty").style.display = 'block';
        }
    }

    let content = "";
    if (newData.length > 0) {
        for (var i = 0; i < newData.length; i++) {
            for (let x of arr) {
                if (x.model_title === newData[i].model_title) {
                    for (let i = 0; i < search_value.length; i++) {
                        if (search_value[i] == ' ' || search_value[i] == `.`) {
                            continue;
                        }
                        //匹配字符
                        // g ：表示全局（global）模式，即模式将被应用于所有字符串，而非在发现第一个匹配项时立即停止；
                        //i： 表示不区分大小写（case -insensitive） 模式， 即在确定匹配项时忽略模式与字符串的大小写；
                        let pattern = new RegExp(`${search_value[i]}`, "gi");
                        let pattern_span1 = new RegExp(`<span class="searched">`, "gi");
                        let pattern_span2 = new RegExp(`</span>`, "gi");
                        let pattern_span3 = new RegExp(`m`, "gi");
                        let pattern_span4 = new RegExp(`k`, "gi");
                        let judge_change = false;

                        if (search_value[i] == 's' || search_value[i] == 'p' || search_value[i] == 'a' || search_value[i] == 'n' || search_value[i] == 'c' || search_value[i] == 'l' || search_value[i] == 'e' || search_value[i] == 'r' || search_value[i] == 'h' || search_value[i] == 'd' || search_value[i] == '>' || search_value[i] == '<' || search_value[i] == '/') {
                            if (x.model_title.indexOf(`<span class="searched">`)) {
                                console.log("sdgsdgs");
                            }
                            new_title = x.model_title.replace(pattern_span1, `m`);
                            new_title = new_title.replace(pattern_span2, `k`);
                            // new_title = x.model_title.replace(`</span>`, `   `);
                            judge_change = true;
                        }
                        if (judge_change) {
                            new_title = new_title.replace(pattern, match => `<span class="searched">${match}</span>`);
                            new_title = new_title.replace(pattern_span3, `<span class="searched">`);
                            new_title = new_title.replace(pattern_span4, `</span>`);
                            judge_change = false;
                        } else {
                            new_title = x.model_title.replace(pattern, match => `<span class="searched">${match}</span>`);
                        }
                        x.model_title = new_title;
                    }

                    content += `
                    <li class="baseLis_fadeIn">
                        <div class="tp_inner">
                            <div class="modleId">${x.model_id}</div>
                            <div class="content">
                                <h3 class="title ellipsis">${x.model_title}</h3>
                            </div>
                            <div class="bottom_box">
                                <div class="info ellipsis">${x.model_info}</div>
                                <div class="tip">
                                    <div class="date">2022-10-15</div>
                                    <div class="label">
                                        <span class="iconfont icon-shuqianguanli"></span>
                                        <span>${x.model_label}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="common"></div>
                        </div>
                    </li>
                    `
                }
            }
        }
    }
    ul_context.innerHTML = content;
    if (judge_personal) {
        memsearchTP();
    } else {
        comsearchTP();
    }

    //标签合并
    if (all(".search_page .title").length >= 1) {
        for (let x of all(".search_page .title")) {
            for (let n of x.children) {
                n.innerHTML = n.innerText;
            }
            let k = x.children;
            console.log(k);
            let searchNum = k.length;
            for (let i = 0; i < searchNum - 1; i++) {
                hbbq(k, i, x);
            }

            function hbbq(k, i, x) {
                if (k[i].nextSibling == k[i + 1] && k[i].nextSibling != null) {
                    k[i].innerHTML += k[i + 1].innerHTML;
                    x.removeChild(k[i + 1]);
                    searchNum--;
                    if (k[i].nextSibling == k[i + 1]) {
                        hbbq(k, i, x);
                    }
                }
            }
        }
    }
}

//判断是否含有相同字符串
function hasSameCharacter(str1, str2) {
    let sum = 0;
    for (let i = 0; i < str1.length; i++) {
        if (str2.indexOf(str1[i]) > -1) {
            sum++;
        }
    }
    if (sum > 0) {
        return true;
    } else {
        return false;
    }
}

let judeg = true;
//记忆库点击进入搜索
$('.memory_base .header_search').onclick = () => {
    $('.search_page').style.display = 'block';
    header_search_memory.focus();
    judeg = true;
}

//社区点击进入搜索
$('.community .header_search').onclick = () => {
    $('.search_page').style.display = 'block';
    header_search_memory.focus();
    judeg = false;
}

header_search_memory.onchange = () => {
    if (header_search_memory.value != "") {
        createTemp(judeg);
    }
}

//退出搜索
$('.search_page .header_left').onclick = () => {
    header_search_memory.value = '';
    ul_context.innerHTML = '';
    $(".search_page .empty").style.display = 'none';
    $('.search_page').style.display = 'none';
    $('.memory_base .header_search input').value = '';
    $('.community  .header_search input').value = '';
}

//为模板添加事件
function memsearchTP() {
    Array.from(all('.search_page .tp_inner')).forEach((x, i) => {
        x.ontouchstart = (e) => {
            let l = 0;
            e.stopPropagation();
            let disX = e.changedTouches[0].clientX;
            // 滑动模板出现按钮
            x.addEventListener('touchmove', function(e) {
                    l = e.changedTouches[0].clientX - disX;
                })
                //如果没有滑动则进入学习页面
            x.parentNode.ontouchend = () => {
                if (l == 0) {
                    console.log(3);
                    title = all('.search_page .tp_inner .title')[i];
                    info = all('.search_page .tp_inner .info')[i];
                    modleId = all('.search_page .tp_inner .modleId')[i];
                    label = all('.search_page .tp_inner .label')[i];
                    $('.learn_page .title').value = title.innerText;
                    $('.learn_page .text_box').innerHTML = info.innerHTML;
                    $('.learn_page .label').innerHTML = all('.search_page .tp_inner .label')[i].querySelectorAll('span')[1].innerHTML;
                    $('.learn_page').style.left = '0';
                    $('.learn_page header').style.left = '0';
                    $('.learn_page header').style.opacity = '1';

                    flag_learn = true;
                }


            }
        }
    });
}

function comsearchTP() {
    Array.from(all('.search_page .tp_inner')).forEach((x, i) => {
        x.ontouchstart = (e) => {
            let l = 0;
            e.stopPropagation();
            let disX = e.changedTouches[0].clientX;
            // 滑动模板出现按钮
            x.addEventListener('touchmove', function(e) {
                    l = e.changedTouches[0].clientX - disX;
                })
                //如果没有滑动则进入学习页面
            x.parentNode.ontouchend = () => {
                if (l == 0) {
                    modleId = all('.search_page .tp_inner .modleId')[i].innerHTML;
                    $('.viewTemplate').classList.remove('scroll_top');
                    $('.viewTemplate footer').classList.remove('scroll_top');
                    for (let x of commonArr) {
                        for (let k of x) {
                            if (modleId == k.modleId) {
                                $('.viewTemplate .idname').innerHTML = k.nickName;
                                $('.viewTemplate .title').innerHTML = k.modleTitle;
                                $('.viewTemplate .text_box').innerHTML = k.content;
                                $('.viewTemplate .label').innerHTML = labelId2(k.modleLabel);
                                $('.viewTemplate .modleId').innerHTML = k.modleId;
                                if (k.base64 == '') {
                                    $('.viewTemplate .head_portrait img').src = './images/头像/头像-女学生2.png';
                                } else {
                                    $('.viewTemplate .head_portrait img').src = k.base64;
                                }

                                if (k.nickName == curr.userInfo.nickName) {
                                    $('.viewTemplate footer .shoucang .iconfont').classList.add('icon-a-shanchulajitong');
                                    $('.viewTemplate footer .shoucang .iconfont').classList.remove('icon-shoucang1');
                                    $('.viewTemplate footer .shoucang .vt_text').innerHTML = '删除';

                                } else {
                                    $('.viewTemplate footer .shoucang .iconfont').classList.remove('icon-a-shanchulajitong');
                                    $('.viewTemplate footer .shoucang .iconfont').classList.add('icon-shoucang1');
                                    $('.viewTemplate footer .shoucang .vt_text').innerHTML = '收藏';

                                    for (let n of all('.collection_base .modleId')) {

                                        if (n.innerHTML == k.modleId) {
                                            $('.viewTemplate .shoucang .iconfont').classList.add('icon-shoucang');
                                            $('.viewTemplate .shoucang .iconfont').classList.remove('icon-shoucang1');
                                            $('.viewTemplate .shoucang .vt_text').classList.add('orange');
                                        }
                                    }

                                }
                                searchcom = true;
                                //渲染浏览页面的点赞
                                if (k.likeStatus) {
                                    $('.viewTemplate .dainzan .iconfont').classList.remove('icon-dianzan');
                                    $('.viewTemplate .dainzan .iconfont').classList.add('icon-dianzan1');
                                    $('.viewTemplate .dainzan .vt_text').classList.add('orange');
                                    $('.viewTemplate .dainzan .vt_text').innerHTML = k.likeNum;

                                }

                                communityTP();
                            }
                        }
                    }
                }


            }
        }
    });
}