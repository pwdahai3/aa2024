<template>
  <div class="test">
    <input type="text" v-model="myWorld"><br>
    <button @click="websocketsend">发送</button>
  </div>
</template>
<script>
export default { 
  name : 'test',
  data() {
    return {
      myWorld:'',
      reply:'',
      websocket: null,
    }
  },
  mounted() {     
    this.initWebSocket();
  },
  destroyed() {
    this.websocket.close() //离开路由之后断开websocket连接
  },   
  methods: {
    initWebSocket(){ //初始化weosocket
      const wsuri = "ws://192.168.2.240:61001/log";
      this.websocket = new WebSocket(wsuri);
      this.websocket.onerror = this.websocketonerror; //连接错误
      this.websocket.onopen = this.websocketonopen; //连接成功
      this.websocket.onmessage = this.websocketonmessage; //收到消息的回调
      this.websocket.onclose = this.websocketclose; //连接关闭的回调
    },
    websocketonerror(){//连接建立失败重连 
      this.initWebSocket();
    },
    websocketonopen(){ //连接建立
      this.data = "WebSocket连接成功" + '   状态码：' + this.websocket.readyState;
    },
    websocketonmessage(e){ //数据接收
      console.log(e)
      // const redata = JSON.parse(e.data); 
      // console.log(redata);
      this.reply=e.data;
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
    },
    websocketsend(Data){//数据发送
      const actions = this.myWorld;        
      this.websocket.send(JSON.stringify(actions));
    },
  },
}
</script>

