let interactive = document.querySelectorAll(".inter_box");

var dainzan = document.querySelectorAll(".dainzan");
let jifen = document.querySelectorAll(".jifen");

var menu = document.querySelectorAll(".menu");
Array.from(menu).forEach((x, i) => {
    x.addEventListener('click', function (event) {
        for (let k of interactive) {
            k.style.width = "0";
        }
        if (interactive[i].offsetWidth == '0') {
            interactive[i].style.width = "44vw";
        } else {
            interactive[i].style.width = "0";
        }


        event.stopPropagation(); //阻止冒泡
    })
})

Array.from(dainzan).forEach((x, i) => {
    x.addEventListener('click', function (event) {
        //如果模板被收藏
        if (x.classList.contains('yellow')) {
            //对比循环收藏库中的模板找出对应模板
            for (let k of all('.collection_base .modleId')) {
                if (k.innerHTML == all('.community_ul .modleId')[i].innerHTML) {
                    ajax(`http://8.134.104.234:8080/ReciteMemory/modle/CancelCollet?userId=${curr.userId}&modleId=${all('.community_ul .modleId')[i].innerHTML}&mStatus=1`, 'get', '', (str) => {
                        let newstr = JSON.parse(str).msg;
                        console.log(newstr);
                        $('.collection_base .base_lis').removeChild(all('.collection_base li')[i]);
                        //刷新仓库
                        $('.footer_nav li')[0].onclick();
                    }, true);

                }
            }
            // 模板未收藏
        } else {
            ajax(`http://8.134.104.234:8080/ReciteMemory/modle/Collection?userId=${curr.userId}&modleId=${all('.community_ul .modleId')[i].innerHTML}&mStatus=1`, 'get', '', (str) => {
                let newstr = JSON.parse(str).msg;
                console.log(newstr);
                newTP(all('.community_ul .title')[i].innerHTML, all('.community_ul .info')[i].innerHTML, all('.community_ul .modleId')[i].innerHTML, false);
                //刷新仓库
                $('.footer_nav li')[0].onclick();
            }, true);

        }
        if (x.classList.contains("yellow")) {
            x.classList.remove("yellow");
        } else {
            x.classList.add("yellow");
        }
        setTimeout(() => interactive[i].style.width = "0", 600);
        event.stopPropagation(); //阻止冒泡

    })
})

Array.from(jifen).forEach((x, i) => {
    x.addEventListener('click', function (event) {
        if (jifen[i].classList.contains("yellow")) {
            jifen[i].classList.remove("yellow");
        } else {
            jifen[i].classList.add("yellow");
        }
        setTimeout(() => interactive[i].style.width = "0", 600);
        event.stopPropagation(); //阻止冒泡
    })
})

document.addEventListener('click', function (event) {
    for (let k of interactive) {
        k.style.width = "0";
    }
    event.stopPropagation(); //阻止冒泡

});

ajax(`http://8.134.104.234:8080/ReciteMemory/inf.get/getModlesByTag?modleLabel=1&pageIndex=1`, 'get', '', (str) => {
    let newstr = JSON.parse(str).msg;
    console.log(newstr);
    // comTP(title, context, modleId)
}, true);