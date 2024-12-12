<template>
  <div class="aside-menu">
    <div class="avatar">
      <img class="logocls" :class="$store.state.isMenuShow?'avatarImg':''" :src="avatarUrl" alt="">
    </div>
    <div class="slogon">
      <h1 class="logo-title">{{productName}}</h1>
      <p class="auth-date">{{$store.state.myVersion}} {{$t('lg.version')}}</p> <!-- {{$store.state.myVersion}} 3.0-->
    </div>
    <el-scrollbar>
      <el-menu :default-active="activeMenusValue" background-color="#28333e" text-color="#fff" active-text-color="#ffd04b" :collapse-transition="false" :collapse="$store.state.isMenuShow" router>
        <el-submenu index="1">
          <template slot="title">
            <i class="fa fa-bar-chart"></i>
            <span slot="title">{{$t('lg.shujuzhanshi')}}</span>
          </template>
          <el-menu-item index="gr">可视化大屏</el-menu-item>
          <el-menu-item index="visit">{{$t('lg.fangwen')}}</el-menu-item>
          <!-- <el-menu-item index="attack">{{$t('lg.gongji')}}</el-menu-item> -->
          <el-menu-item index="dashboard">{{$t('lg.xingneng')}}</el-menu-item>
          <el-menu-item index="customChartGridLayout">智能检测</el-menu-item><!-- {{$t('lg.customchart1')}} -->
        </el-submenu>

        <!-- <el-submenu index="configs9" v-if="!auditRoles">
          <template slot="title">
            <i class="fa fa-cog"></i>
            <span slot="title">防护配置</span>
          </template>
          <el-menu-item index="configs91">防护配置</el-menu-item>
          <el-menu-item index="configs92">站点配置</el-menu-item>
          <el-menu-item index="configs93">全剧配置</el-menu-item>
          <el-menu-item index="configs94">证书管理</el-menu-item>
        </el-submenu> -->

        <!-- <el-submenu index="2" v-if="adminRoles">
          <template slot="title">
            <i class="fa fa-compress"></i>
            <span slot="title">{{$t('lg.objMonitor')}}</span>
          </template>
          <el-menu-item index="objUpdate">{{$t('lg.objfx')}}</el-menu-item>
          <el-menu-item index="apiChart">{{$t('lg.apizt')}}</el-menu-item>
        </el-submenu> -->

        <el-submenu index="configs" v-if="!auditRoles">
          <template slot="title">
            <i class="fa fa-cog"></i>
            <span slot="title">{{$t('lg.peizhi1')}}</span>
          </template>
          <el-menu-item index="quickConfig">{{$t('lg.jichupeizhi')}}</el-menu-item>
          <el-menu-item index="config">{{$t('lg.gaojipeiz1')}}</el-menu-item>
          <el-menu-item index="iconfig">Iconfig</el-menu-item>
          <el-menu-item index="iconfigset">{{$t('lg.configset1')}}</el-menu-item>
        </el-submenu>

        <!-- <el-menu-item index="autoconfig" v-if="adminRoles">
          <i class="fa fa-sitemap"></i>
          <span slot="title">自动化配置</span>
        </el-menu-item> -->

        <!-- <el-menu-item index="quickConfig" v-if="adminRoles">
          <i class="fa fa-compass"></i>
          <span slot="title">快速配置向导</span>
        </el-menu-item>
        <el-menu-item index="autoquickconfig" v-if="adminRoles">
          <i class="fa fa-compass"></i>
          <span slot="title">智能化配置</span>
        </el-menu-item>

        <el-menu-item index="config" v-if="!auditRoles">
          <i class="fa fa-cog"></i>
          <span slot="title">配置</span>
        </el-menu-item> -->
        <!-- <el-menu-item index="apimsg" v-if="adminRoles">
          <i class="fa fa-cog"></i>
          <span slot="title">{{$t('lg.apimang')}}</span>
        </el-menu-item> -->
        <el-submenu index="apimsg" v-if="adminRoles">
          <template slot="title">
            <i class="fa fa-cog"></i>
            <span slot="title">{{$t('lg.apimang')}}</span>
          </template>
          <el-menu-item index="apimsg">{{$t('lg.apimang')}}</el-menu-item>
          <el-menu-item index="objUpdate2">API发现</el-menu-item>
        </el-submenu>
        <el-menu-item index="uriwhite" v-if="adminRoles">
          <i class="fa fa-file"></i>
          <span slot="title">{{$t('lg.uriwihite')}}</span>
        </el-menu-item>

        <el-menu-item index="logs">
          <i class="fa fa-file"></i>
          <span slot="title">{{$t('lg.rizhi')}}</span>
        </el-menu-item>
        <!-- <el-menu-item index="logs2">
          <i class="fa fa-file"></i>
          <span slot="title">日志2</span>
        </el-menu-item> -->

        <el-submenu index="6" v-if="adminRoles">
          <template slot="title">
            <i class="fa fa-user-plus"></i>
            <span slot="title">{{$t('lg.xingwei2')}}</span>
          </template>
          <!-- <el-menu-item index="behaviortime">{{$t('lg.jiyushijiang')}}</el-menu-item> -->
          <el-menu-item index="behaviortimes">{{$t('lg.jiyucishu')}}</el-menu-item>
          <el-menu-item index="behaviortkhistory">{{$t('lg.jiyujilu')}}</el-menu-item>
          <el-menu-item index="customQuery">{{$t('lg.zidingyi')}}</el-menu-item>
          <el-menu-item index="bwlist">{{$t('lg.zwHeimingdan')}}</el-menu-item>
        </el-submenu>
        <el-menu-item index="timingTask" v-if="adminRoles">
          <i class="fa fa-envelope"></i>
          <span slot="title">{{$t('lg.youjiang')}}</span>
        </el-menu-item>

        <el-menu-item index="cmonitor" v-if="adminRoles">
          <i class="fa fa-exchange"></i>
          <span slot="title">{{$t('lg.componentmonitor')}}</span>
        </el-menu-item>

        <el-submenu index="9" v-if="adminRoles">
          <template slot="title">
            <i class="fa fa-cog"></i>
            <span slot="title">{{$t('lg.xitong')}}</span>
          </template>
          <el-menu-item index="ha">{{$t('lg.hafn1')}}</el-menu-item>
          <el-menu-item index="users">{{$t('lg.yonghugl')}}</el-menu-item>
          <el-menu-item index="lockedAccounts">{{$t('lg.lockaccmng')}}</el-menu-item>
          <el-menu-item index="updateui">{{$t('lg.systemupdate1')}}</el-menu-item>
          <el-menu-item index="logbackup">{{$t('lg.logbackset')}}</el-menu-item>
          <el-menu-item index="firewall">{{$t('lg.accctrl')}}</el-menu-item>
          <el-menu-item index="license">{{$t('lg.licensegl')}}</el-menu-item>
          <el-menu-item index="imexport">导出导入</el-menu-item>
          <!-- <el-menu-item index="mailnotify">邮件管理</el-menu-item>
          <el-menu-item index="ntpmsg">ntp配置管理</el-menu-item>
          <el-menu-item index="radiusmsg">radius配置管理</el-menu-item>
          <el-menu-item index="tacacsmsg">tacacs配置管理</el-menu-item>
          <el-menu-item index="syslogmsg">syslog配置管理</el-menu-item>
          <el-menu-item index="snmpmsg">snmp配置管理</el-menu-item> -->
        </el-submenu>
        <el-submenu index="10" v-if="adminRoles">
          <template slot="title">
            <i class="fa fa-users"></i>
            <span slot="title">{{$t('lg.systemservice1')}}</span>
          </template>
          <el-menu-item index="mailnotify">{{$t('lg.youjianggl')}}</el-menu-item>
          <el-menu-item index="packetcapture">抓包管理</el-menu-item>
          <el-menu-item index="ntpmsg">{{$t('lg.ntpconfigmng1')}}</el-menu-item>
          <el-menu-item index="radiusmsg">{{$t('lg.radiusconfigmng1')}}</el-menu-item>
          <el-menu-item index="tacacsmsg">{{$t('lg.tacacsconfigmng1')}}</el-menu-item>
          <el-menu-item index="syslogmsg">{{$t('lg.syslogconfigmng1')}}</el-menu-item>
          <el-menu-item index="snmpmsg">{{$t('lg.snmpconfigmng1')}}</el-menu-item>
        </el-submenu>
        <el-menu-item index="shenjitest" v-if="adminRoles">
          <i class="fa fa-cog"></i>
          <span slot="title">{{$t('lg.shenjitest')}}</span>
        </el-menu-item>
        <el-menu-item index="xinyus" v-if="adminRoles">
          <i class="fa fa-cog"></i>
          <span slot="title">信誉酷</span>
        </el-menu-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import * as types from '@/store/types';
import {SERVER_API_URL2} from '@/conf/constvar';
import store from '../../store/store';
import axios from 'axios';
export default {
  created(){
  //  if(!this.$store.state.productName){
      this.getProductname();
   // }
    var myRole=sessionStorage.getItem('myRoles');
    if(myRole=='ADMIN'){
      this.adminRoles=true;
      this.auditRoles=false;
    }else if(myRole=='USER'){
      this.adminRoles=false;
      this.auditRoles=false;
    }else if(myRole=='AUDIT'){
      this.adminRoles=false;
      this.auditRoles=true;
    }
  },
  data(){
    return{
      productName:store.state.productName,
      avatarUrl:require('@/assets/img/logo.png'),
      adminRoles:false,//
      auditRoles:false,//显示审计日志内容
    }
  },
  methods:{
    getProductname(){
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data
          if(localStorage.lang=="en"){
            this.productName=resData.enName;
            this.$store.state.productName=resData.enName;
          }else{
            this.productName=resData.cnName;
            this.$store.state.productName=resData.cnName;
          }
         // document.title = this.productName;
        }
      })
    },
  },
  computed:{
    activeMenusValue(){//当前页面对应的菜单栏
      return this.$route.path.slice(1)
    }
  }
}
</script>

<style scoped>
 .el-submenu .el-menu-item{
  padding-left: 58px!important;
}
.aside-menu{
  height: 100%; 
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.aside-menu .avatar{
  width: 100%;
    text-align: center;
    margin: 25px 0;
}
.logocls{max-width: 172px}
.avatarImg{height:55px}
.slogon{
    color: #fff;
    text-align: center;
    margin-bottom: 10px;
  }
    
    .logo-title{
      font-size: 14px;
      margin-bottom: 15px;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 18px;
      padding:0 4px;
    }
      
    .auth-date{font-size:12px;}
      
  .el-scrollbar{height:100%}
    .el-scrollbar .el-menu {flex: 1;
      border-right:none;}
    
   .el-scrollbar .fa{margin:0 10px 0 6px;
      font-size:18px}
    
      
</style>
