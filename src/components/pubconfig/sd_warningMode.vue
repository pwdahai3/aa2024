<!--shadow_warning_mode 监控模式-->
<template>
  <div>
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdWarningModeModalClose">
      <el-form ref="warningModeform" :model="warningModeform" label-width="110px">
        <el-form-item :label="$t('lg.monitormode')"> 
          <el-switch v-model="warningModeform.warningModeSwitch"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateWarningMode">{{$t('lg.save')}}</el-button>
          <el-button @click="sdWarningModeModalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="warningModeModalLoading"></loading>
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
    }
  },
  data(){
    return{
      url:'',//请求的路径
      warningModeform:{
        warningModeSwitch:false,
      },
      warningModeModalLoading:false,
    }
  },
  methods:{
    getSdWarningModeData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/warning/"+snodeId+"?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/warning/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/warning/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          if(res.data.responseCode==0){
            var resData=res.data.data;
            console.log(resData)
            if(resData=='on'){
              _this.warningModeform.warningModeSwitch=true;
            }else{
              _this.warningModeform.warningModeSwitch=false;
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
    sdWarningModeModalClose(){//关闭弹框
      // this.$refs['warningModeform'].resetFields();
      this.$emit("setbysdWarningModemodal",false);
    },
    updateWarningMode(){//更改
      this.$refs['warningModeform'].validate((valid) => {
        if(valid){
          var _this=this;
          _this.warningModeModalLoading=true;
          var warningMdSwitch=_this.warningModeform.warningModeSwitch?'on':'off';
          axios.post(_this.url,{
            shadow_warning_mode:warningMdSwitch
          }).then((res)=>{
            if(res.data.responseCode==0){
              // this.warningModeform.warningModeSwitch=true;
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.sdWarningModeModalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.warningModeModalLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    }
  },
  components:{
    loading
  }
}
</script>
<style>
</style>

