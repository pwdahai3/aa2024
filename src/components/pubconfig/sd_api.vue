<!--shadow_api API防护设置--><!--可删组件-->
<template>
  <div>
    <el-dialog width="45%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdApiModalClose">
      <div class="grid-content">
        <el-form :model="sdApiform" :rules="sdApiformRules" ref="sdApiform" label-width="60px">
          <el-form-item :label="$t('lg.kaiqiapi')" label-width="100px"> 
            <el-switch
              v-model="sdApiSwitch"
              :title="sdApiSwitch?$t('lg.clickoff'):''"
              @change="switchEvent()">
            </el-switch>
          </el-form-item>

          <div class="orderBoxJamb">
            <el-form-item :label="$t('lg.counts')" prop="sdApiTimes">
              <el-input v-model.trim="sdApiform.sdApiTimes" style="width:40%" :placeholder="$t('lg.counts')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.time')" prop="sdApiTime">
              <el-input v-model.trim="sdApiform.sdApiTime" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
              <el-select v-model="sdApiTimeUnit" style="width:30%">
                <el-option v-for="item in apiUnitOpt" 
                  :key="item.value"
                  :label="item.label" 
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>          
          
          <el-form-item>
            <el-button type="primary" @click="submitSdApi()">{{sdApiSwitch?$t('lg.editparams'):$t('lg.addparams')}}</el-button>
            <el-button @click="sdApiModalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <loading :title="$t('lg.handling')" v-show="sdApiLoading"></loading>
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

      sdApiTimeUnit:'s',
      apiUnitOpt:[{
        label:this.$t('lg.second'),
        value:'s'
      }],

      sdApiSwitch:false,
      sdApiLoading:false,
      sdApiform: {
        sdApiTime:'',
        sdApiTimes:''
      },
      sdApiformRules:{
        sdApiTime:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        sdApiTimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
    }
  },
  methods:{//增删改查cookie都需要把cookie参数都传给后台，后台只对数据进行覆盖
    getSdApiData(){
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
              _this.sdApiSwitch=true;
              _this.sdApiform.sdApiTimes=resData.num;
              _this.sdApiform.sdApiTime=resData.time.match(/(\d*)(\w*)/)[1];
              _this.sdApiTimeUnit=resData.time.match(/(\d*)(\w*)/)[2];
            }else{
              _this.sdApiSwitch=false;
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
    sdApiModalClose(){//关闭defenseCookie弹框
      this.$refs['sdApiform'].resetFields();
      this.$emit('setbysdApimodal',false);
    },
    switchEvent(){//开关事件 删除API防护设置
      let _this=this;
      if(!_this.sdApiSwitch){
        _this.$confirm(_this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.sdApiLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.sdApiModalClose();
            }else{
              _this.sdApiSwitch=true;
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.sdApiLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.sdApiSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.sdApiSwitch=false;
        _this.$message.error(_this.$t('lg.zhu11'));
      }
    },
    submitSdApi(){//添加shadow_api API防护设置
      this.$refs['sdApiform'].validate((valid) => {
        if (valid) {
          this.sdApiLoading=true;
          axios.post(this.url,{
            num:this.sdApiform.sdApiTimes,
            time:this.sdApiform.sdApiTime+this.sdApiTimeUnit
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.sdApiSwitch=true;
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.sdApiLoading=false;
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