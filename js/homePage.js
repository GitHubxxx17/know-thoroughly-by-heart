var startY, endY;
document.addEventListener('touchstart', function(e) {
    startY = e.touches[0].pageY;
}, false);
document.addEventListener('touchmove', function(e) {
    endY = e.changedTouches[0].pageY;
    moveLoad();
}, false);

function moveLoad() {
    var movY = endY - startY;
    var nav = document.getElementById("nav");
    if (movY > 0) {
        nav.style.height = "5rem";
    } else {
        if (document.documentElement.scrollTop > 82) {
            nav.style.height = "0rem";
        }
        console.log(document.documentElement.scrollTop);

    }
}

window.onscroll = function() {
    let pics = document.querySelectorAll(".pic_com");
    let container = document.getElementById("container");
    let threeGrid = document.getElementById("three_grid");
    for (let i = 0; i < pics.length; i++) {
        // 用元素距离最顶部的高度减去页面可视区域的高度就是元素到可视区域的高度
        let picsTop = pics[i].offsetTop - document.documentElement.clientHeight;
        if (window.scrollY > picsTop) {
            if (i % 2 == 0) {
                pics[i].classList.add('appearRight');
            } else {
                pics[i].classList.add('appearLeft');
            }

        } else {
            if (i % 2 == 0) {
                pics[i].classList.remove('appearRight');
            } else {
                pics[i].classList.remove('appearLeft');
            }
        }
    }
    let threeGridTop = container.offsetTop - document.documentElement.clientHeight;
    if (window.scrollY > threeGridTop) {
        console.log(threeGrid.classList)
        threeGrid.classList.add("fadeIn");
        console.log(threeGrid.classList)
    } else {
        threeGrid.classList.remove("fadeIn");
    }
};