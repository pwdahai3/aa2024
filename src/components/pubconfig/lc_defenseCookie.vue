<template><!--可删组件-->
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="defenseCookiemodalClose">
      <el-form ref="defenseCookieform" label-width="150px">
        <el-form-item :label="$t('lg.startDynamicdfcookie')">
          <el-switch v-model="defenseCookieform.defenseCookieStatus" ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveDefenseCookie">{{$t('lg.save')}}</el-button>
          <el-button @click="defenseCookiemodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="defenseCookiemodalLoading" :title="$t('lg.handling')"></loading>
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
      defenseCookieform:{
        defenseCookieStatus:true,
      },
      defenseCookiemodalLoading:false
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        if(this.data.shadow_server_cookie=="on"){
          this.defenseCookieform.defenseCookieStatus=true;
        }else{
          this.defenseCookieform.defenseCookieStatus=false;
        }
      }
    }
  },
  methods:{
    defenseCookiemodalClose(){
      this.$emit("setbylcDefenseCookiemodal",false);
    },
    saveDefenseCookie(){//开启或者关闭页面动态Cookie防御功能
      var _this=this;
      if(!this.data.shadow_server_cookie_num){
        this.$message.error(_this.$t('lg.dynamiccookieconfigtips'));
        this.defenseCookieform.defenseCookieStatus=false;
        return;
      }
      this.defenseCookiemodalLoading=true;
      var domainName=this.domainObj.domainName,domainPort=this.domainObj.port,
          locationName=this.locationObj.name,locationType=this.locationObj.type,
          snodeId=this.shadowObj.snodeId;
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }
      var onoff=this.defenseCookieform.defenseCookieStatus;
      axios.patch(url,{
        isEnabled:onoff
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRenderTree");
          this.defenseCookiemodalClose();
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
        }
        this.defenseCookiemodalLoading=false
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

