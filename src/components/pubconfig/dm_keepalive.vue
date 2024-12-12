<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="isShow" :close-on-click-modal="false" :before-close="limReqmodalClose">
      <el-form ref="dmTransparentform" :model="dmTransparentform"  label-width="100px">

        <div class="orderBoxJamb" style="margin-bottom:20px">
          <el-form-item :label="$t('lg.kaiqi')" prop="ipTransparent">
            <el-switch v-model="dmTransparentform.ipTransparent"></el-switch>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="submitTransparent">{{$t('lg.queding')}}</el-button>
          <el-button @click="limReqmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
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
    }
  },
  data(){
    return{
      dmTransparentform:{
        ipTransparent:false
      }
    }
  },
  methods:{
    getDmkeepaliveData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port;
        let url;
        if(_this.isAuto){
          url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&autoconfig=true";
        }else if(_this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort;
        }
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            var resData=res.data.data;
            _this.dmTransparentform.ipTransparent=resData.keepalived=="on"?true:false;
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    limReqmodalClose(){
      this.$emit("setbydmkeepalivemodal",false);
      // this.$refs['dmLimReqform'].resetFields();
    },
    submitTransparent(){
      var _this=this;
        var snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/domain/keepalived?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort;
        }
        axios.patch(_this.url,{
          keepalived:_this.dmTransparentform.ipTransparent==true?"on":"off"
        }).then((res)=>{
          if(res.data.responseCode==0){
              this.$message({
                type: "success",
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+'：'+ res.data.data.message);
            }
        })
    },
    limReqSwitchEvent(){
      this.dmLimReqform.limReqReject=false;
    },
  },
  components:{
    loading
  }
}
</script>
<style scoped>
/* .rejectBox{
  padding-top: 20px; 
  border: 1px solid #dcdfe6;
  padding: 20px 20px 1px 0px;
  margin-bottom: 30px;
  position: relative;
  border-radius: 5px
} */
</style>

