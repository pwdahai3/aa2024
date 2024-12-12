var websock = null;
var serverUrl='www.baidu.com:5000'

function webSocketServer(){
  var _this=this;
  _this.websock='';              //实例socket
  _this.init=function(serverUrl){         //链接后台服务
    var wsuri = serverUrl;
    _this.websock = new WebSocket(wsuri);
  
    _this.websock.onclose = function(callback){
      _this.websocketClose();
    }
  
    _this.websock.onopen = function () {
      // 使用 send() 方法发送数据
      _this.websocketOpen()
    };

    _this.websock.onmessage = function (evt) {
      _this.websocketmessage()(evt.data)
    };

    //连接发生错误的回调方法
    _this.websock.onerror = function () {
      console.log("WebSocket连接发生错误");
      _this.websocketerror()
    }
  }

  _this.websocketOpen=function(callback){//
    callback()
  }
  _this.websocketClose=function(callback){//
    callback()
  }
  _this.websocketmessage=function(callback){//
    return  callback
  }
  _this.websocketerror=function(callback){//
    callback()
  }


  //数据发送
  _this.websocketsend=function(agentData){
    _this.websock.send(JSON.stringify(agentData));
  }

  //关闭
  _this.websocketclose=function(e){  
    _this.websock.close()
  }

  _this.sendSock=function(agentData){  
    if (_this.websock.readyState === _this.websock.OPEN) {//若是ws开启状态
      _this.websocketsend(agentData);
    }else if (_this.websock.readyState === _this.websock.CONNECTING) {// 若是 正在开启状态，则等待1s后重新调用
      setTimeout(function () {
        _this.sendSock(agentData,callback);
      }, 1000);
    }else {// 若未开启 ，则等待1s后重新调用
      _this.init();
      setTimeout(function () {
        _this.sendSock(agentData,callback);
      }, 1000);
    }
  }
}
 
// 实际调用的方法

// import websock from 'web.js';
// websock.init('www.baidu.com');  //开启链接  参数 是链接地址
// websock.websocketOpen(function(){   //开启的时候 时候监听

// })
// websock.websocketClose(function(){   //关闭的时候 时候监听

// })
// websock.websocketmessage(function(data){   //接受信息的时候 时候监听  data为后台返回的数据

// })
// websock.websocketerror(function(){   //出错的时候 时候监听

// })
// websock.websocketclose()  //关闭连接
// websock.sendSock('fjasldjflas')   //参数 要发送的数据


export default new webSocketServer();

