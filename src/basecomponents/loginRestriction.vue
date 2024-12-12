<!--继续访问页面 询问弹框-->
<template>
  <div>
    <el-dialog
      :title="$t('lg.logouttip')"
      :visible.sync="$store.state.loginResShow"
      width="25%"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      :before-close="handleClose">
      <p class="loginResTxt">{{$t('lg.logoutsecond')}}{{resVisibleTime}}{{$t('lg.secondafter')}}</p>
      <div class="text-right">
        <el-button @click="exitLogin">{{$t('lg.logout')}}</el-button>
        <el-button type="primary" @click="continueLogin">{{$t('lg.goonlogin')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as types from '@/store/types';
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import {showConfirm} from '../main.js'
export default {
  data(){
    return{
      resVisibleTime:60,
      loginTimeOut:null,
    }
  },
  watch:{
    '$store.state.loginResShow':function(){
      if(this.$store.state.loginResShow){
        this.loginInterval();           
      }else{
        this.loginTimeOut && clearInterval(this.loginTimeOut);
        this.loginTimeOut=null;
      }
    }
  },
  methods:{
    loginInterval(){//60s倒计时
      this.loginTimeOut=setInterval(()=>{
        this.resVisibleTime--;
        if(this.resVisibleTime==0){
          this.$store.state.restrictFlag = true;
          this.exitLogin();
        }
      },1000)
    },
    continueLogin(){//点击继续访问页面 功能：定时替换token （相当于token到期就询问用户是否替换token）
      var _this = this;

      _this.$store.state.loginResShow=false;
      clearInterval(_this.loginTimeOut);
      _this.loginTimeOut=null;
      _this.resVisibleTime=60;
      
      showConfirm();//在这里开启下一次询问弹框的显示；（只有点击取消才能有下一个弹框的出现的可能；点击确定就跳到登录页面了，不能再出现loginRestriction弹框了）

      // 请求新的token
      const oldRefreshToken = sessionStorage.getItem('refresh_token');
      var url=SERVER_API_URL+"uaa/oauth/token?refresh_token="+oldRefreshToken+"&grant_type=refresh_token";
      const instance = axios.create();//实例化，独立于拦截器
      instance.post(url,{},{
        headers: {
          'Authorization': 'Basic VUk6V0VScU0zWnVORFIxZEhWQw==',
        }
      }).then((res)=>{
        if(res.status==200){
          _this.$store.commit(types.LOGIN,res.data);//用vuex重新设置基本信息
        }
      }).catch((err)=>{
       // alert("请求出错,请重新登录");
       this.$message.error('failed');
        _this.$store.commit(types.LOGOUT);
      })
    },
    exitLogin(){//点击确定退出登录
      this.$store.state.loginResShow=false;
      clearInterval(this.loginTimeOut);//清除60s倒计时定时器
      this.loginTimeOut=null;
      this.resVisibleTime=60;
      this.$store.commit(types.LOGOUT);
    },
    handleClose(done){
      done();
    }
  }
}
</script>

<style>
.loginResTxt{
  margin-bottom: 20px;
}
</style>
