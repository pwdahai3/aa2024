<template><!--可删组件-->
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="websocketmodalClose">
      <el-form ref="websocketform" label-width="125px">
        <el-form-item :label="$t('lg.websocketsupport')">
          <el-switch v-model="websocketform.websocketStatus" ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveLcWebsocket">{{$t('lg.save')}}</el-button>
          <el-button @click="websocketmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="websocketmodalLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    }, 
    isShow:{
      type:Boolean
    },
    data:{
      type:Object
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    locationObj:{
      type:Object
    }
  },
  data(){
    return{
      websocketform:{
        websocketStatus:true,
      },
      websocketmodalLoading:false
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        if(this.data.webSocket=="on"){
          this.websocketform.websocketStatus=true;
        }else{
          this.websocketform.websocketStatus=false;
        }
      }
    }
  },
  methods:{
    websocketmodalClose(){
      this.$emit("setbylcWebsocketmodal",false);
    },
    saveLcWebsocket(){//开启或者关闭页面的web socket支持
      var _this=this;
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/websocket?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/websocket?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/websocket";
      }
      this.websocketmodalLoading=true;
      var onoff=this.websocketform.websocketStatus==true?"on":"off";
      axios.patch(url,{
        snodeId:this.shadowObj.snodeId,
        domainName:this.domainObj.domainName,
        domainPort:this.domainObj.port,
        locationName:this.locationObj.name,
        locationType:this.locationObj.type,
        webSocket:onoff,
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRenderTree");//?
          this.websocketmodalClose();
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
        }
        this.websocketmodalLoading=false
      }).catch((err)=>{
        console.log(err);
      });
    }
  },
  components:{
    loading
  }
}
</script>
<style>
</style>

