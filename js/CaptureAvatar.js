//截取头像
var can_obj = document.querySelector("#canvas"); //获取画板
var img_obj = document.querySelector("#canvas_img"); //获取需要截取的图片对象

let scaleValue = 1; //记录缩放的值
loadCapture();
console.log(img_obj)

function loadCapture() {
    //设置图片自适应大小及图片的居中显示
    autoResizeImage(img_obj);
    //为画布盒子增添监听事件
    document.querySelector("#canvas_div").addEventListener('touchstart', touch);
    document.querySelector("#canvas_div").addEventListener('touchmove', touch);
    //使用getContext()方法返回一个用于在画布上绘图的环境。
    var capture_img = can_obj.getContext("2d");
    // 'x':divObj.offsetLeft,'y':divObj.offsetTop
    capture_X = can_obj.offsetLeft;
    capture_Y = can_obj.offsetTop;
    // console.log(capture_X);
    // console.log(capture_Y);
    capture_img.drawImage(img_obj, capture_X, capture_Y, img_obj.width, img_obj.height); //初始化 canvas 加入图片

    //触摸移动事件
    function touch(e) {
        let event = e || window.event;
        event.preventDefault(); //阻止浏览器或body或者其他冒泡事件
        //手指坐标
        let fingerPos_x1 = event.touches[0].clientX;
        let fingerPos_y1 = event.touches[0].clientY;
        console.log(fingerPos_x1 + "fingerPos_x1");
        console.log(fingerPos_y1 + "fingerPos_y1");

        //图片坐标
        // let img_left = img_obj.left;
        // let img_top = img_obj.top;

        // 
        var left_x = 0,
            left_y = 0; //计算 偏移量 设置画布中的X，Y轴 (加偏移量)

        //单只手操作滑动
        if (event.touches.length == 1) {

            //开始移动
            if (event.type == "touchstart") {
                //获取img相对坐标
                posX = fingerPos_x1 - img_obj.offsetLeft;
                posY = fingerPos_y1 - img_obj.offsetTop;

                //获取手指开始移动的位置
                var startY = event.touches[0].pageY;
                var startX = event.touches[0].pageX;
            }
            //移动ing
            else if (event.type == "touchmove") {
                //获取手指结束的位置
                let endY = event.changedTouches[0].pageY;
                let endX = event.touches[0].pageX;
                //移动坐标
                var movX = fingerPos_x1 - posX;
                var movY = fingerPos_y1 - posY;
                //记录手指移动的方向及距离
                let disY = startY - endY;
                let disX = startX - endX;

                //右边界
                let boundaryRight;

                //获取画布距离右侧的距离
                canX = can_obj.offsetLeft;
                console.log(canX + "canX");
                //获取图片距离右侧的距离
                imgX = img_obj.offsetLeft;
                console.log(imgX + "imgX");
                console.log(canX - imgX + "hahah");
                //获取画布距离顶部的距离
                canY = can_obj.offsetTop;
                console.log(canY + "canY");
                //获取图片距离右侧的距离
                imgY = img_obj.offsetTop;

                //清除画布
                // capture_img.clearRect(0, 0, can_obj.width, can_obj.height);

                if (disX > disY) {
                    // img_obj.style.left = movX + "px";
                    console.log(movY + "movY");

                    img_obj.style.top = movY + "px";
                    //画布内图片移动
                    // capture_img.drawImage(img_obj, capture_X + disX, capture_Y, img_obj.width * scaleValue, img_obj.height * scaleValue);
                    // capture_img.drawImage(img_obj, capture_X, movY - parseFloat(can_obj.style.top) + left_y / 2, img_obj.width * scaleValue, img_obj.height * scaleValue);

                } else {
                    boundaryRight = img_obj.offsetWidth - canX - can_obj.offsetWidth;
                    console.log(boundaryRight + "boundaryRight");
                    console.log(img_obj.style.left + "img_obj.style.left");
                    // if (canX - imgX < 0) {
                    //     img_obj.style.left = "50%";
                    // } else if (canX - imgX > boundaryRight) {
                    //     img_obj.style.left = -canX + "px";
                    // } else {
                    img_obj.style.left = movX + "px";
                    // }

                    console.log(movX + "movX");
                    // img_obj.style.top = movY + "px";
                    // capture_img.drawImage(img_obj, -20 + movX + left_x / 2, capture_Y, img_obj.width * scaleValue, img_obj.height * scaleValue);

                }

            }
        }
        //双指操作
        else if (event.touches.length == 2) {
            if (event.type == "touchstart") {
                //获取在手指按下瞬间的放大缩小值（scale），作用:在移动时，记录上次移动的放大缩小值
                pre_scaleValue = img_obj.style.Transform == undefined ? 1 : parseFloat(img_obj.style.Transform.replace(/[^0-9^\.]/g, ""));
                //记录开始的坐标值,作用：在下次放大缩小后，去掉上次放大或缩小的值
                start_X1 = event.touches[0].clientX;
                start_Y1 = event.touches[0].clientY;
                start_X2 = event.touches[1].clientX;
                start_Y2 = event.touches[1].clientY;
                //获取在缩放时 当前缩放的值
                start_scaleValue = Math.sqrt((start_X2 - start_X1) * (start_X2 - start_X1) + (start_Y2 - start_Y1) * (start_Y2 - start_Y1)) / 200;
            } else if (event.type == "touchmove") {
                var mv_x2 = event.touches[1].clientX,
                    mv_y2 = event.touches[1].clientY;
                //动态获取上一次缩放值(随时变更)，在下次缩放时减去上一次的值，作用：防止累加之前的缩放
                var move_scaleValue = Math.sqrt((mv_x2 - mv_x1) * (mv_x2 - mv_x1) + (mv_y2 - mv_y1) * (mv_y2 - mv_y1)) / 200;
                //求出缩放值
                scaleValue = move_scaleValue - start_scaleValue + pre_scaleValue;
                img_obj.style.webkitTransform = "scale(" + scaleValue + ")"; //设置放大缩小
                img_obj.style.Transform = "scale(" + scaleValue + ")";
                capture_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
                var dImg_left = parseFloat(img_obj.style.left.replace("px", "")),
                    dImg_top = parseFloat(img_obj.style.top.replace("px", ""));
                var w = img_obj.width,
                    h = img_obj.height,
                    sw = w * sqrt,
                    sh = h * sqrt;
                left_x = w - sw; //计算 偏移量 设置画布中的X，Y轴 (加偏移量) 注：canvas 原点放大（canvas中图片左上角坐标），css3 scale 中点放大
                left_y = h - sh;
                capture_img.drawImage(img_obj, -20 + dImg_left + left_x / 2, dImg_top - parseFloat(can_obj.style.top.replace("px", "")) + left_y / 2, sw, sh); //画布内图片重置
            }
        }
    }

}



//让图片与画布等宽
function autoResizeImage(img_obj) {
    var img_w = img_obj.width;
    // console.log(img_w);
    var img_h = img_obj.height;
    // console.log(img_h);
    //获取图片宽高的比率
    let ratio = img_w / img_h;
    // console.log(ratio);

    if (ratio > 1) {
        //img_obj.height = 63.3;
        img_obj.style.height = '63.3vw'
        img_obj.style.width = 'auto'
    } else {
        //img_obj.width = 63.3;
        img_obj.style.width = '63.3vw'
        img_obj.style.height = 'auto'
    }
}



//阻止裁剪越界

function preventcrossing(can_obj, img_obj) {
    //获取画布距离右侧的距离
    canX = can_obj.offsetLeft;
    console.log(canX + "canX");
    //获取图片距离右侧的距离
    imgX = img_obj.offsetLeft;
    console.log(imgX + "imgX");
    //获取画布距离顶部的距离
    canY = can_obj.offsetTop;
    console.log(canY + "canY");
    //获取图片距离右侧的距离
    imgY = img_obj.offsetTop;
    console.log(imgY + "imgY");
    if (canX > imgX) {
        console.log("canX > imgX");
        img_obj.style.left = canX + "px";
    }
    if (canX < imgX) {
        console.log("canX < imgX");
        img_obj.style.left = canX + "px";
    }
    if (canY > imgY) {
        console.log("canY > imgY");
        img_obj.style.top = canY + "px";
    }
    if (canY < imgY) {
        console.log("canY < imgY");
        img_obj.style.top = canY + "px";
    }
}