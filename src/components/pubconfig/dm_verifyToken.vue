<!--shadow_verify_token指令 动态指纹功能  可删组件 -->
<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="isShow" :close-on-click-modal="false" :before-close="verifTokenmodalClose">
      <el-form ref="vrfTokenform" label-width="100px">
        <el-form-item :label="$t('lg.dongtaizwgn')">
          <el-switch v-model="vrfTokenform.vrfTokenSwitch" ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateVrfToken">{{$t('lg.save')}}</el-button>
          <el-button @click="verifTokenmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="verifTokenmodalLoading"></loading>
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
      url:'',//请求的路径
      vrfTokenform:{
        vrfTokenSwitch:false
      },
      verifTokenmodalLoading:false,
    }
  },
  methods:{
    getDmVerifyTokenData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/domain/token/verify?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/domain/token/verify?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/domain/token/verify?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort;
        }
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data.num;
            if(resData==1){
              _this.vrfTokenform.vrfTokenSwitch=true;
            }else{
              _this.vrfTokenform.vrfTokenSwitch=false;
            }
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    verifTokenmodalClose(){
      //this.$refs['vrfTokenform'].resetFields();
      this.$emit("setbydmverifyTokenmodal",false);
    },
    updateVrfToken(){//更改
      var _this=this;
      _this.verifTokenmodalLoading=true;
      const num = _this.vrfTokenform.vrfTokenSwitch?1:0;
      axios.post(_this.url,{
        num:num
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.verifTokenmodalClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.verifTokenmodalLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    }
  },
  components:{
    loading
  }
}
</script>
