//封装一个可以获取CSS选择器的函数
function $(selectors) {
    if (document.querySelectorAll(selectors).length != 1)
        return document.querySelectorAll(selectors);
    else
        return document.querySelector(selectors);
}

//封装一个发送ajax请求和处理数据的的函数
function ajax(url,method,req,funC) {
    //1.创建Ajax对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }
    else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //2.连接服务器
    xhr.open(method,url);
    //3.设置请求头
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //4.发送请求
    xhr.send(req);
    //5.接收服务器的返回
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                funC(xhr.responseText);
            }
        }
    }
}


export {$,ajax};


