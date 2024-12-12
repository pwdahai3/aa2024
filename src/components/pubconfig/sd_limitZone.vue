<!--shadow_limit_zone 暂时停用--><!--可删组件-->
<template>
  <div>
    <el-dialog width="45%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdLimZoneModalClose">
      <div class="grid-content">
        <el-form :model="sdLimZoneform" :rules="sdLimZoneformRules" ref="sdLimZoneform">
          <el-form-item label="limit zone:"> 
            <el-switch
              v-model="sdLimZoneSwitch"
              :title="sdLimZoneSwitch?$t('lg.clickoff'):''"
              @change="switchEvent()">
            </el-switch>
          </el-form-item>
          <el-form-item :label="$t('lg.fenzu')" :label-width="formLabelWidth" prop="sdZone">
            <el-input v-model.trim="sdLimZoneform.sdZone" style="width:40%" :placeholder="$t('lg.counts')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.rate')" :label-width="formLabelWidth" prop="sdZoneRate">
            <el-input v-model.trim="sdLimZoneform.sdZoneRate" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
            <el-select v-model="lzRateUnit" style="width:30%">
              <el-option v-for="item in lzRateUnitOpt" 
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth">
            <el-button type="primary" @click="submitSdLimZone()">{{sdLimZoneSwitch?$t('lg.editparams'):$t('lg.addparams')}}</el-button>
            <el-button @click="sdLimZoneModalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <loading :title="$t('lg.handling')" v-show="sdLimzoneLoading"></loading>
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

      lzRateUnit:'s',
      lzRateUnitOpt:[{
        label:this.$t('lg.second'),
        value:'s'
      }],

      sdLimZoneSwitch:false,
      sdLimzoneLoading:false,
      sdLimZoneform: {
        sdZone:'',
        sdZoneRate:''
      },
      sdLimZoneformRules:{
        sdZone:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        sdZoneRate:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      formLabelWidth:'80px',
    }
  },
  methods:{//增删改查cookie都需要把cookie参数都传给后台，后台只对数据进行覆盖
    getSdLimZoneData(){
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
              _this.sdLimZoneSwitch=true;
              _this.sdLimZoneform.sdZoneRate=resData.num;
              _this.sdLimZoneform.sdZone=resData.time.match(/(\d*)(\w*)/)[1];
              _this.lzRateUnit=resData.time.match(/(\d*)(\w*)/)[2];
            }else{
              _this.sdLimZoneSwitch=false;
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
    sdLimZoneModalClose(){//关闭defenseCookie弹框
      this.$refs['sdLimZoneform'].resetFields();
      this.$emit('setbysdLimZonemodal',false);
    },
    switchEvent(){//开关事件 删除API防护设置
      let _this=this;
      if(!_this.sdLimZoneSwitch){
        _this.$confirm(this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.sdLimzoneLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.sdLimZoneModalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.sdLimzoneLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.sdLimZoneSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.sdLimZoneSwitch=false;
        _this.$message.error(this.$t('lg.zhu11'));
      }
    },
    submitSdLimZone(){//添加shadow_api API防护设置
      this.$refs['sdLimZoneform'].validate((valid) => {
        if (valid) {
          this.sdLimzoneLoading=true;
          axios.post(this.url,{
            num:this.sdLimZoneform.sdZoneRate,
            time:this.sdLimZoneform.sdZone+this.lzRateUnit
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.sdLimZoneSwitch=true;
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.sdLimzoneLoading=false;
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