let ws;

function ConnectionClicked() {
    try {
        ws = new WebSocket(`ws://8.134.104.234:8080/ReciteMemory/PK/${curr.userId}/160/3`) //连接服务器
        ws.onopen = function(event) {
            console.log("已经与服务器建立了连接当前连接状态：" + this.readyState);
        };

        let msgCount = 0; //接收信息的次数

        ws.onmessage = function(event) {
            console.log("接收到服务器发送的数据：" + event.data + "haha" + msgCount);
            i++;
            if (event.data) {
                let res = JSON.parse(event.data).socketMsg.datas;
                console.log(res);
                //当连接成功后发送START开始游戏
                if (res.CONNECTION && msgCount == 1) {
                    this.send("START");
                    console.log("已经向服务器发送START信号！")
                }
                //当匹配成功后获取双方信息渲染，并且发送Ready开始答题
                if (res.MATCH_SUCCESS) {
                    $('.other .other_name').innerHTML = res.enemyInf.nickName;
                    ws.send("Ready");
                    console.log("已经向服务器发送Ready信号！");
                }
                //判断匹配是否成功，成功后渲染挖空内容和答题的答案,当isReady为true即可进入pk界面
                if (res.isReady) {
                    console.log("我已经准备好啦！");
                }
            }

        };
        ws.onclose = function(event) {
            console.log("已经与服务器断开连接当前连接状态：" + this.readyState);
        };
        ws.onerror = function(event) {
            console.log("WebSocket异常！");
        };
    } catch (ex) {
        alert(ex.message);
    }
};

function SendData() {
    try {
        ws.send("beston");
    } catch (ex) {
        alert(ex.message);
    }
};

function seestate() {
    alert(ws.readyState);
}