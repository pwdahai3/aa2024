<template><!-- 这个组件暂时没用了 ntml 只配置到 domain里面 --><!--可删组件-->
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isShow" :close-on-click-modal="false" :before-close="ntlmModalClose">
      <el-form ref="ntlmform" label-width="90px">
        <el-form-item :label="$t('lg.ntlmlong')">
          <el-switch v-model="ntlmform.ntlmSwitch" ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveNtlm">{{$t('lg.save')}}</el-button>
          <el-button @click="ntlmModalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="ntlmModalLoading" :title="$t('lg.handling')"></loading>
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
      ntlmform:{
        ntlmSwitch:false,
      },
      serverEnableNTLM:false,//是否能进行长连接操作
      ntlmModalLoading:false
    }
  },
  methods:{
    getNtlmData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        if(this.isAuto){
          var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm?autoconfig=true";
        }else if(this.isEditConfig){
          var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm?savedConfig=true";
        }else{
          var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm";
        }
        var domainO=this.domainObj,
            locationO=this.locationObj;
        axios.get(url,{
          params:{
            snodeId:this.shadowObj.snodeId,
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type
          }
        }).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data;
            this.ntlmform.ntlmSwitch=resData.enableNTLM;
            this.serverEnableNTLM=resData.serverEnableNTLM
            resolve(resData);
          }else{
            this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    ntlmModalClose(){//关闭弹框
      this.$emit("setbylcNtlmmodal",false);
    },
    saveNtlm(){//开启或者关闭页面ntlm长连接功能
    var _this=this;
      if(!this.serverEnableNTLM){
        this.$message.error(_this.$t('lg.ntlmtips2'));
        this.ntlmform.ntlmSwitch=false;
        return;
      }
      this.ntlmModalLoading=true;

      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/ntlm";
      }
      axios.patch(url,{
        snodeId:this.shadowObj.snodeId,
        domainName:this.domainObj.domainName,
        domainPort:this.domainObj.port,
        locationName:this.locationObj.name,
        locationType:this.locationObj.type,
        enableNTLM:this.ntlmform.ntlmSwitch
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRenderTree");
          this.ntlmModalClose();
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
        }
        this.ntlmModalLoading=false
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

