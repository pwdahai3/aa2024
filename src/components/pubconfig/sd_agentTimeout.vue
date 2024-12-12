<!--请求超时时间--><!--可删组件-->
<template>
  <div>
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdAgtTimeoutModalClose">
      <!-- <p class="tips">注：关闭下面的开关将删除‘请求超时时间’这条配置指令</p> -->
      <el-form ref="agtTimeoutform" :model="agtTimeoutform" :rules="agtTimeoutformRules">
        <el-form-item :label="$t('lg.kaiqiqingqcs')"> 
          <el-switch
            v-model="agtTimeoutSwitch"
            :title="agtTimeoutSwitch?$t('lg.clickdel'):''"
            @change="switchEvent()">
          </el-switch>
        </el-form-item>
        <div class="orderBoxJamb">
          <el-row :gutter="10">
            <el-col :span="16">
              <el-form-item :label="$t('lg.qingqsjtz')" prop="agtTimeoutVal" label-width="140px">
                <el-input v-model="agtTimeoutform.agtTimeoutVal" :placeholder="$t('lg.requestime')"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="8">
              <el-form-item>
                <el-select v-model="agtTimeoutform.agtTimeoutUnit" :placeholder="$t('lg.select')">
                  <el-option
                    v-for="item in agtTimeoutform.agtTimeoutUnitOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row> 
        </div>
        
        <el-form-item label-width="140px" >
          <el-button type="primary" @click="saveAgtTimeout">{{agtTimeoutSwitch?$t('lg.edit'):$t('lg.save')}}</el-button>
          <el-button @click="sdAgtTimeoutModalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="agtTimeoutModalLoading"></loading>
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

      agtTimeoutform:{
        agtTimeoutVal:null,
        agtTimeoutUnit:'s',
        agtTimeoutUnitOpt:[{
          label:this.$t('lg.ms'),
          value:'ms'
        },{
          label:this.$t('lg.second'),
          value:'s'
        }],
      },
      agtTimeoutSwitch:false,
      agtTimeoutModalLoading:false,
      agtTimeoutformRules:{
        agtTimeoutVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
    }
  },
  methods:{
    getSdAgtTimeoutData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId+"?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data;
            // console.log(resData)
            if(resData){
              _this.agtTimeoutSwitch=true;
              _this.agtTimeoutform.agtTimeoutVal=resData.match(/(\d*)(\w*)/)[1];
              _this.agtTimeoutform.agtTimeoutUnit=resData.match(/(\d*)(\w*)/)[2];
            }else{
              _this.agtTimeoutSwitch=false;
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
    sdAgtTimeoutModalClose(){//关闭弹框
      this.$refs['agtTimeoutform'].resetFields();
      this.$emit("setbysdAgentTimeoutmodal",false);
    },
    saveAgtTimeout(){//更改请求超时时间
      this.$refs['agtTimeoutform'].validate((valid) => {
        if(valid){
          var _this=this;
          _this.agtTimeoutModalLoading=true;
          axios.post(_this.url,{
            shadow_agent_timeout:_this.agtTimeoutform.agtTimeoutVal+_this.agtTimeoutform.agtTimeoutUnit,
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.agtTimeoutSwitch=true;
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.agtTimeoutModalLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    switchEvent(){//开关事件 删除请求超时时间配置
      var _this = this;
      if(!_this.agtTimeoutSwitch){
        _this.$confirm(_this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.agtTimeoutModalLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.sdAgtTimeoutModalClose();
            }else{
              _this.agtTimeoutSwitch=true;
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.agtTimeoutModalLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.agtTimeoutSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.agtTimeoutSwitch=false;
        _this.$message.error(this.$t('lg.zhu11'));
      }
    }
  },
  components:{
    loading
  }
}
</script>
<style>
</style>

