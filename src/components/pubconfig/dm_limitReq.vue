<!--shadow_limit_req指令-->
<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="isShow" :close-on-click-modal="false" :before-close="limReqmodalClose">
      <p class="tips">{{$t('lg.remarkj1')}}</p>
      <el-form ref="dmLimReqform" :model="dmLimReqform" :rules="dmLimReqformRules" label-width="110px">

        <div class="orderBoxJamb" style="margin-bottom:20px">
          <el-form-item :label="$t('lg.reject')" prop="limReqReject">
            <el-switch v-model="dmLimReqform.limReqReject" @change="rejectSwitchEvent()"></el-switch>
          </el-form-item>
          
          <!--暂时不用-->
          <!-- <div class="rejectBox"> 
            <el-form-item label="队列长度">
              <el-input v-model.trim="dmLimReqform.limReqBurst" style="width:50%" placeholder="burst"></el-input>
            </el-form-item>

            <el-form-item label="超时时间">
              <el-input v-model.trim="dmLimReqform.limReqDelay" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
              <el-select v-model="rateUnit" style="width:30%">
                <el-option v-for="item in rateUnitOpt" 
                  :key="item.value"
                  :label="item.label" 
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="nodelay">
              <el-switch v-model="dmLimReqform.limReqNodelay" ></el-switch>
            </el-form-item>
          </div> -->
        </div>

        <div class="orderBoxJamb">
          <el-form-item :label="$t('lg.xiangliu')"> 
            <el-switch
              v-model="dmLimReqSwitch"
              :title="dmLimReqSwitch?$t('lg.clickoff'):''"
              @change="limReqSwitchEvent()">
            </el-switch>
          </el-form-item>
          <el-form-item :label="$t('lg.rate')" prop="limReqRate" v-if="dmLimReqSwitch">
            <el-input v-model.trim="dmLimReqform.limReqRate" style="width:60%" :placeholder="$t('lg.rate')"></el-input>
            <el-select v-model="rateUnit" style="width:38%">
              <el-option v-for="item in rateUnitOpt" 
                :key="item.value"
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item>
          <!-- <el-button type="primary" v-if="dmLimReqSwitch" @click="submitLimReq">{{$t('lg.edit')}}</el-button> -->
          <el-button type="primary" @click="submitLimReq">{{$t('lg.save')}}</el-button>
          <el-button @click="limReqmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="limReqmodalLoading"></loading>
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

      dmLimReqSwitch:false,
      dmLimReqform:{
        limReqRate:'',
        limReqReject:false,

        limReqBurst:'',
        limReqDelay:'',
        limReqNodelay:false,
      },
      rateUnit:'r/s',
      rateUnitOpt:[{
        label:this.$t('lg.rrss'),
        value:'r/s'
      },
      {
        label:this.$t('lg.rrmm'),
        value:'r/m'
      }],
      dmLimReqformRules:{
        limReqRate:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },

      limReqmodalLoading:false,
    }
  },
  methods:{
    getDmLimReqData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/domain/limit/req?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/domain/limit/req?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/domain/limit/req?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort;
        }
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data;
            if(resData.reject=='Y'){
              _this.dmLimReqSwitch=false;
              _this.dmLimReqform.limReqRate='';
              _this.rateUnit='r/s';
              _this.dmLimReqform.limReqReject=true;
            }else if(resData.reject=='N'){
              _this.dmLimReqSwitch=true;
              _this.dmLimReqform.limReqRate=/^(\d+)(.*)/.exec(resData.rate)[1];
              _this.rateUnit=/^(\d+)(.*)/.exec(resData.rate)[2];
              _this.dmLimReqform.limReqReject=false;
            }else{
              _this.dmLimReqSwitch=false;
              _this.dmLimReqform.limReqRate='';
              _this.rateUnit='r/s';
              _this.dmLimReqform.limReqReject=false;
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
    limReqmodalClose(){
      this.$emit("setbydmlimReqmodal",false);
      // this.$refs['dmLimReqform'].resetFields();
    },
    submitLimReq(){//更改
      this.$refs['dmLimReqform'].validate((valid) => {
        if (valid) {
          var _this=this;
          _this.limReqmodalLoading=true;
          let delFlag=false;//为true时表示删除
          let dataJson={};

          if(_this.dmLimReqform.limReqReject){
            dataJson={
              rate:'10r/s',
              reject:'Y'
            }
          }else{
            if(_this.dmLimReqSwitch){
              dataJson={
                rate:_this.dmLimReqform.limReqRate+_this.rateUnit,
                reject:'N'
              }
            }else{
              delFlag=true;
            }
          }

          let requestMethod='post';
          if(delFlag)requestMethod='delete';

          axios[requestMethod](_this.url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.limReqmodalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.limReqmodalLoading=false;
          }).catch((err)=>{
            console.log(err)
          });
        }
      })
    },
    rejectSwitchEvent(){
      this.dmLimReqSwitch=false;
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

