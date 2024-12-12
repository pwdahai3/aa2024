<!--shadow_limit_req_status 暂时停用--><!--可删组件-->
<template>
  <div>
    <el-dialog width="45%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdLimReqStuModalClose">
      <div class="grid-content">
        <el-form :model="sdLimReqStuform" :rules="sdLimReqStuformRules" ref="sdLimReqStuform">
          <el-form-item label="limit req status:"> 
            <el-switch
              v-model="sdLimReqStuSwitch"
              :title="sdLimReqStuSwitch?$t('lg.clickoff'):''"
              @change="switchEvent()">
            </el-switch>
          </el-form-item>
          <el-form-item label="code" label-width="115px" prop="sdCode">
            <el-input v-model.trim="sdLimReqStuform.sdCode" style="width:40%" :placeholder="$t('lg.counts')"></el-input>
          </el-form-item>
          <el-form-item label-width="115px">
            <el-button type="primary" @click="submitSdLimZone()">{{sdLimReqStuSwitch?$t('lg.editparams'):$t('lg.addparams')}}</el-button>
            <el-button @click="sdLimReqStuModalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <loading :title="$t('lg.handling')" v-show="sdLimReqStuLoading"></loading>
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

      sdLimReqStuSwitch:false,
      sdLimReqStuLoading:false,
      sdLimReqStuform: {
        sdCodesdCode:'',
      },
      sdLimReqStuformRules:{
        sdCode:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
    }
  },
  methods:{//增删改查cookie都需要把cookie参数都传给后台，后台只对数据进行覆盖
    getSdLimReqStuData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId+"?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data;
            console.log(resData)
            if(resData){
              _this.sdLimReqStuSwitch=true;
              _this.sdLimReqStuform.sdCode=resData.time.match(/(\d*)(\w*)/)[1];
            }else{
              _this.sdLimReqStuSwitch=false;
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
    sdLimReqStuModalClose(){//关闭defenseCookie弹框
      this.$refs['sdLimReqStuform'].resetFields();
      this.$emit('setbysdLimReqStumodal',false);
    },
    switchEvent(){//开关事件 删除API防护设置
      let _this=this;
      if(!_this.sdLimReqStuSwitch){
        _this.$confirm(this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.sdLimReqStuLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.sdLimReqStuModalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.sdLimReqStuLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.sdLimReqStuSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.sdLimReqStuSwitch=false;
        _this.$message.error(_this.$t('lg.zhu11'));
      }
    },
    submitSdLimZone(){//添加shadow_api API防护设置
      this.$refs['sdLimReqStuform'].validate((valid) => {
        if (valid) {
          this.sdLimReqStuLoading=true;
          axios.post(this.url,{
            num:this.sdLimReqStuform.sdCode,
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.sdLimReqStuSwitch=true;
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.sdLimReqStuLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    }
  },
  components:{
    loading
  }
}
</script>