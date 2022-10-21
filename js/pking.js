//封装创建pk的函数
function createWebSocket() {
    let ws = new WebSocket(`ws://8.134.104.234:8080/ReciteMemory/PK/${curr.userId}/104/3`)
    console.log(ws.readyState);

    ws.onopen = function() {
        console.log('连接成功...');
        ws.send("START");
    }

    ws.onerror = function() {
        console.log('连接失败...')
            // reConnect();
    }

    ws.onmessage = (event) => {
        if (event.data) {
            let res = JSON.parse(event.data).socketMsg.datas;
            console.log(res);

            if (res.MATCH_SUCCESS) {
                $('.other .other_name').innerHTML = res.enemyInf.nickName;
                ws.send("Ready");
            }
            if (res.isReady) {

            }
        }
    }

    ws.onclose = function(event) {
        console.log('连接已关闭...')
        console.log('websocket 断开: ' + event.code + ' ' + event.reason + ' ' + event.wasClean)
    }
}

let data = {
    "enemyInf": {
        "birthday": "2000-01-01 00:00:00",
        "cityId": 1,
        "image": "",
        "nickName": "psm",
        "points": 0,
        "sex": "其他",
        "stars": 0,
        "userId": 49
    }
}
$('.other .other_name').innerHTML = data.enemyInf.nickName;