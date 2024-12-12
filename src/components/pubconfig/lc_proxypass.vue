<template><!--可删组件-->
  <div>
    <el-dialog width="45%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="proxyPassmodalClose">
      <el-form ref="proxypassform" :model="proxypassform" :rules="proxypassformRules" label-width="125px">

        <el-form-item :label="$t('lg.kaiqiproxyps')" label-width="140px">  
          <el-switch
            v-model="proxyPassSwitch"
            :title="proxyPassSwitch?$t('lg.clickoff'):''"
            @change="switchEvent()">
          </el-switch>
        </el-form-item>

        <div class="orderBoxJamb">
          
          <el-form-item :label="$t('lg.protocol')" prop="proxyHttp">
            <el-select v-model="proxypassform.proxyHttp" style="width:50%">
                <template>
                  <el-option label="http" value="http"></el-option>
                  <el-option label="https" value="https"></el-option>
                </template>
              </el-select>
          </el-form-item>
          
          <el-form-item :label="$t('lg.customizeproxypass')" prop="proxyPass"> 
            <el-input v-model.trim="proxypassform.proxyPass" placeholder="/proxypass" :disabled="locationObj.type=='suffixMatch'" :style="locationObj.type=='suffixMatch'?'width:90%':'width:100%'"></el-input>
            <el-popover
              v-show="locationObj.type=='suffixMatch'"
              placement="top-start"
              :title="$t('lg.zhu2')"
              width="200"
              trigger="hover"
              :content="$t('lg.zhu3')">
              <i slot="reference" style="margin-left:5px;width:6px" class="cursor-pointer el-icon-warning"></i>
            </el-popover>
          </el-form-item>

          <el-form-item :label="$t('lg.zidingyiups')" prop="proxyUpstream">
            <el-select v-model="proxypassform.proxyUpstream" clearable :placeholder="$t('lg.select')" @visible-change="getUpstream($event)" :loading="getUpstreamLoading" style="width:70%">
              <el-option 
                v-for="item in upstreamOptArr"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </div>

        <el-form-item>
          <el-button type="primary" @click="saveLcProxyPass">{{proxyPassSwitch?$t('lg.edit'):$t('lg.save')}}</el-button>
          <el-button @click="proxyPassmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="proxyPassModalLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
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
      url:'',
      proxyPassSwitch:false,
      proxypassform:{
        proxyHttp:'http',
        proxyPass:'',
        proxyUpstream:'',
      },
      upstreamOptArr:[],
      proxypassformRules:{
        proxyPass:[
          {pattern:/^\/([^\u4e00-\u9fa5\s])*$/, message: this.$t('lg.reg1'), trigger: 'blur'} //proxyPass 
        ]  
      },

      getUpstreamLoading:false,
      proxyPassModalLoading:false
    }
  },
  methods:{
    getLcProxyPassData(){
      return new Promise((resolve,reject)=>{
        var domainName=this.domainObj.domainName,domainPort=this.domainObj.port,
            locationName=this.locationObj.name,locationType=this.locationObj.type,
            snodeId=this.shadowObj.snodeId;
        if(locationType=='suffixMatch'){//传入url里要编译
          locationName = encodeURI(locationName)
        }     

        if(this.isAuto){
          this.url=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"autoconfig=true";
        }else if(this.isEditConfig){
          this.url=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"savedConfig=true";
        }else{
          this.url=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
        }
        axios.get(this.url).then((res)=>{
          if(res.data.responseCode==0){
            var resData=res.data.data?res.data.data:{};
            if(resData.protocol){
              this.proxyPassSwitch=true;
              this.proxypassform.proxyHttp=resData.protocol;
              this.proxypassform.proxyPass=resData.path;
              this.proxypassform.proxyUpstream=resData.domain;
            }else{
              this.proxyPassSwitch=false;
              this.proxypassform.proxyHttp='http';
              this.proxypassform.proxyPass='';
              this.proxypassform.proxyUpstream='';
            }
            resolve(resData);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    proxyPassmodalClose(){
      // this.$refs['proxypassform'].resetFields();
      this.$emit("setbylcProxypassmodal",false);
    },
    getUpstream(callback){//设置poxypass时获取Upstream
      if(callback){
        this.getUpstreamLoading=true;

        var snodeId=this.shadowObj.snodeId;
        var url='';// 查询当前所有业务节点
        if(this.isAuto){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId;
        }
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resArray = res.data.data?res.data.data:[];
            let upstreamList=[];
            resArray.forEach(ele=>{
              upstreamList.push({
                value:ele.upstream
              })
            })
            this.upstreamOptArr=upstreamList;
          }else{
            this.$message.error('failed: '+ res.data.data.message);
          }
          this.getUpstreamLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    saveLcProxyPass(){//更改
      var _this=this;
      this.$refs['proxypassform'].validate((valid) => {
        if (valid) {
          this.proxyPassModalLoading=true;
          axios.patch(this.url,{
            protocol: this.proxypassform.proxyHttp,   
            domain: this.proxypassform.proxyUpstream,
            path: this.proxypassform.proxyPass
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.proxyPassSwitch=true;
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            this.proxyPassModalLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    switchEvent(){
      let _this=this;
      if(!_this.proxyPassSwitch){
        _this.$confirm(_this.$t('lg.zhu4'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.proxyPassModalLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.proxyPassmodalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.proxyPassModalLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.proxyPassSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.proxyPassSwitch=false;
        _this.$message.error(this.$t('lg.zhu5'));
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

