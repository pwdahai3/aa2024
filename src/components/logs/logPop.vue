<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="50%" :title="$t('lg.lookdetail')" :visible.sync="logdVisible" :close-on-click-modal="false" :before-close="handleClose">
      <div style="margin-bottom:20px">
        <p class="logp"> {{data.scheme || "--"}}://{{data.domain || "--"}}</p>
        <p class="logp"> <span class="bb">{{$t('lg.logid')}}：</span>{{data.request_id}}</p>
        <p class="logp"> <span class="bb">{{$t('lg.visitip')}}：</span>{{data.remoteIp || "--"}}</p>
        <p class="logp"> <span class="bb">{{$t('lg.fromnode')}}：</span>{{data.hostname || "--"}}</p>
        <p class="logp"> <span class="bb">{{$t('lg.visittime')}}：</span>{{data.date || "--"}}</p>
      </div>
      <div>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('lg.requesbaowen')" name="first">
            <div>
              <p class="logp"><span class="spa">{{data.method || "--"}}</span><span class="spa">{{data.shadowUrl || "--"}}</span><span class="spa">HTTP/{{data.httpVersion}}</span></p>
              <p class="logp"><span class="bb">Host：</span>{{data.domain || "--"}}</p>
              <p class="logp"><span class="bb">User-Agent：</span>{{data.agent || "--"}}</p>
              <p class="logp"><span class="bb">Accept：</span>{{data.accept || "--"}}</p>
              <p class="logp"><span class="bb">Accept_Encoding：</span>{{data.accept_encoding || "--"}}</p>
              <p class="logp"><span class="bb">Connection：</span>{{data.connection || "--"}}</p>
              <p class="logp"><span class="bb">Accept-Language：</span>{{data.accept_language || "--"}}</p>
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item title="request_body" name="1">
                  <pre class="pre-wrap" style="white-space: pre-wrap;word-wrap: break-word;">{{ data.request_body  | responsebodyFormat}}</pre>
                </el-collapse-item>
              </el-collapse>
            </div>

          </el-tab-pane>
          <el-tab-pane :label="$t('lg.resbaowen')" name="second">
            <div>
              <p class="logp"><span class="bb">status：</span>{{data.responseCode || "--"}}</p>
              <p class="logp"><span class="bb">upstream_response_ip：</span>{{data.upstream_ip || "--"}}</p>
              <p class="logp"><span class="bb">upstream_response_status：</span>{{data.upstream_response_status || "--"}}</p>
              <p class="logp"><span class="bb">upstream_response_time：</span>{{data.upstream_response_time || "--"}}</p>
              <el-collapse v-model="activeNames" @change="handleChange2">
                <el-collapse-item title="response_body" name="2">
                  <pre class="pre-wrap" style="white-space: pre-wrap;word-wrap: break-word;">{{data.response_body | responsebodyFormat}}</pre>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default{
  props:{
    data:{
      type:Object
    },
    logdVisible:{
      type:Boolean
    }
  },
  data(){
    return{
     activeNames:[],
     activeName2: 'first'
    }
  },
  computed: {
    parsedRequestBody() {
      return this.data.request_body;
  }
  },
  methods:{
    handleChange2(val) {
      },
    handleChange(val) {
    },
    handleClick(){
    },
    handleClose(){
      this.activeName2="first"
      this.$emit('logdClose',false);
    }  
  },
  filters:{
    responsebodyFormat(a){
      var telReg=/1[3-9]\d{9}/;
      var idReg=/[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/;
      if(a){
        a=a.replace(telReg,"***********");
        a=a.replace(idReg,"******************");
        return a;
      }else{
        return "--"
      }
    }
  }
}
</script>
<style scoped>
  .logp{
    margin:6px 0;
    text-overflow: ellipsis;
    line-height: 20px;
  }
  .bb{ color: #dd8527;}
  .spa{display: inline-block; margin-right: 10px;}
  /deep/ .el-collapse-item__header{
    padding: 0; color: #dd8527;
  }
  /deep/ .el-collapse-item__arrow{
    margin: 0;
  }
  .pre-wrap {
  white-space: pre-wrap;
}
</style>

