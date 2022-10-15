setInterval(() => {
    $('.loading_icon').src = './images/gif小人/红色小人.gif';
}, 600);

//拉取排行榜
let laqu = document.getElementById("laiqu");
let rankingList = document.getElementById("ranking_list");
let judge = true;
laqu.onclick = function() {
    if (judge) {
        rankingList.style.top = "28.582278vw";
        judge = false;
    } else {
        rankingList.style.top = "126.58227848vw";
        judge = true;
    }
}