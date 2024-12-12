<template>
  <div class="dynamic-wrapper" v-if="isShow">
    <div class="dynamic-triangle"></div>
      <el-switch v-model="dynamicStatus" :inactive-text="$t('lg.zidongbianhzt')" :active-text="dynamicStatusTxt" @change="updateDynamicStatus"></el-switch>
      <div>
      <el-button type="primary" size="small" @click="openD" class="dynamicChangeBtn" :title="!dynamicStatus?$t('lg.xiangkaiqizidongbianh'):''">{{$t('lg.lijibianh')}}</el-button>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/gptloading';
import {SERVER_API_URL} from '@/conf/constvar';
export default {
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      dynamicStatus:false,
      dynamicStatusTxt:this.$t('lg.yiguan'),
    }
  },
  components:{
loading
  },
  methods:{
    getDynamicStatus(){
      return new Promise((resolve,reject)=>{
        const url = SERVER_API_URL+"mc/dynamic/configuration/status";     
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const resData=res.data.data;
            this.dynamicStatus=resData;
            this.dynamicStatusTxt=resData?this.$t('lg.yikai'):this.$t('lg.yiguan');
            resolve(resData);
          }else{
            reject("error")
           // this.$message.error('操作失败:'+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      })
    },
    updateDynamicStatus(){
      const url = SERVER_API_URL+"mc/dynamic/configuration/status?option="+this.dynamicStatus;
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.dynamicStatusTxt=this.dynamicStatus?this.$t('lg.yikai'):this.$t('lg.yiguan');
        }else{
          this.dynamicStatus=!this.dynamicStatus;
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    offDynamicStatus(){
      const url = SERVER_API_URL+"mc/dynamic/configuration/status?option=false";
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.dynamicStatus=false;
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.dynamicStatusTxt=this.dynamicStatus?this.$t('lg.yikai'):this.$t('lg.yiguan');
        }else{
          this.dynamicStatus=!this.dynamicStatus;
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    openDs(){
      return new Promise((resolve,reject)=>{
        const url = SERVER_API_URL+"mc/dynamic/configuration/status?option=true";
        axios.post(url).then((res)=>{
          if(res.data.responseCode==0){
            resolve("success")
          }else{
            reject("error")
          }
        }).catch((err)=>{
          console.log(err);
        })
      })
    },
    openD(){      
      if(!this.dynamicStatus){
        this.openDs().then(()=>{
          this.getDynamicStatus().then((resolvedata)=>{
            this.dynamicChanges().then((resolvedata2)=>{
              this.offDynamicStatus();
            });
          })
        })
      }else{
        this.dynamicChanges();
      }
    },
    dynamicChanges(){//动态变换
      const url = SERVER_API_URL+"mc/dynamic/configuration";
      this.$refs.loading.showLoading();
      return new Promise((resolve,reject)=>{
          axios.post(url,{}).then((res)=>{
          if(res.data.responseCode==0){
            this.$refs.loading.hideLoading();
            //this.offDynamicStatus();
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
            resolve("success")
          }else{
            reject("error")
           // this.$message.error('操作失败:'+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      });
         
    }
  }
}
</script>

<style scoped>
.dynamic-wrapper{
  position: absolute;
  top: 84px;
  right: 400px;
  width: 300px;
  background: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 5px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 15px 20px 0px;
  box-sizing: border-box;
  z-index: 999;
  
}
/* .dynamic-triangle{
  width:0;
  height:0;
  border-left:5px solid transparent;
  border-right:5px solid transparent;
  border-bottom:8px solid #fff;
  position: absolute;
  top: -8px;
  right: 80px;
} */
.dynamicChangeBtn{
  margin: 20px 0 20px;
}
</style>
