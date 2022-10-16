$('.personal .exit').onclick = () => {
    if(!curr.auto){
        window.localStorage.clear();
    }
    location.href = './login.html';
}

// 随机排列数组
let arr12 = ['qwe','23e','q123','32we','423we','3242']
arr12.sort(function () {
    return 0.5 - Math.random();
})
// 取数组随机排列后的前三个元素放在另一个数组，之后将这三个元素作为li的索引值
let newArr = arr12.slice(0, 3);
console.log(newArr);