<template>
  <div class="headerContainer">
    <div class="header-mgt">
      <ul class="header-mgt-left">
        <li @click="toggleMenu" class="cursor-pointer">
          <i :class="$store.state.isMenuShow?'fa fa-indent':'fa fa-dedent'"></i>
        </li>
        <li @click="toggleRefresh" class="cursor-pointer">
          <i class="fa fa-refresh"></i>
        </li>
      </ul>
      <ul class="header-mgt-right">
        <li><!-- 时间选择+自动刷新 -->
          <sddate></sddate>
        </li>
        <li class="cursor-pointer">
          <el-dropdown @command="handleUserCommand">
            <span class="el-dropdown-link">{{username}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">{{$t('lg.logout')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>

    </div>
    <div class="header-info">
      <span class="spanblock" :style="[{color:$store.state.licenceinfo.istobeexpired?'red':'#4a5166'},{marginRight:$store.state.licenceinfo.istobeexpired?0:'14px'}]" :title="$store.state.licenceinfo.istobeexpired?$t('lg.licenceceexpired'):$t('lg.licencevalid')"> <span class="sf">{{$t('lg.authdate')}}:</span> {{transformDate($store.state.licenceinfo.expireDate)}}</span>
      <span class="spanblock" v-show="$store.state.licenceinfo.istobeexpired"><i class="el-icon-bell" style="color:red;font-weight:800" :title="$t('lg.licenceout')"></i></span>
      <span class="spanblock"><span class="sf">{{$t('lg.authstatus')}}:</span> {{$store.state.licenceinfo.licenseValid===true?$t('lg.youxiao'):$t('lg.wuxiao')}}</span>
      <!-- <span>{{$t('lg.authflow')}}: {{$store.state.licenceinfo.quota || 0}}(M)</span> -->
      <span class="spanblock"><span class="sf">{{$t('lg.authnodes')}}:</span> {{$store.state.licenceinfo.shadowInstances || 0}}</span>

      <span class="spanblock"><span class="sf">{{$t('lg.webdmlimitnum1')}}:</span> <em :title="$t('lg.currentDomains')">{{$store.state.licenceinfo.currentDomains || 0}}</em>/ <em  :title="$t('lg.webdmlimitnum')">{{$store.state.licenceinfo.domainLimit || 0}}</em></span>
      <span class="spanblock"><span class="sf">{{$t('lg.wxdmlimitnum1')}}:</span>  <em :title="$t('lg.currentAppletDomains')">{{$store.state.licenceinfo.currentAppletDomains || 0}}</em>/ <em  :title="$t('lg.wxdmlimitnum')">{{$store.state.licenceinfo.appletDomainLimit || 0}}</em></span>
      <span class="spanblock"><span class="sf">{{$t('lg.appdmlimitnum1')}}:</span>  <em :title="$t('lg.currentAppDomains')">{{$store.state.licenceinfo.currentAppDomains || 0}}</em>/ <em  :title="$t('lg.appdmlimitnum')">{{$store.state.licenceinfo.appDomainLimit || 0}}</em></span>
    </div>

    <!-- 采样频率 -->
    <!-- <div class="rate-info">
      <timerate v-if="$store.state.isShowTimerate"></timerate>
    </div> -->

    <!-- 中英文切换 -->
    <!-- <div class="zhen">
      <el-select v-model="selectValue" @change="langChange" size="mini" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
      </el-select>
    </div> -->
  </div>
</template>
<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar'
import * as types from '@/store/types'
import sddate from '@/basecomponents/sddate'
// import timerate from '@/basecomponents/timerate'
export default {
  components:{
    sddate,
    // timerate
  },
  created(){
    this.selectValue = localStorage.lang == undefined?'cn':localStorage.lang
    this.$store.commit(types.GETVERSION);
    this.$store.commit(types.GETLICENCEINFO);
   // this.getLicenceInfo();
  },
  computed:{
    username(){
      return this.$store.state.user.name || sessionStorage.getItem('myname')
    }
  },
  data(){
    return{
      licenceinfo:{},
      selectValue:'',
      options:[
        {
          value: 'cn',
          label: '中文'
        }, {
          value: 'en',
          label: 'English'
        }
      ],
      checked:false
    }
  },
  methods:{
    getLicenceInfo(){
      const url=SERVER_API_URL+"license/status";
        let nowTime=new Date().getTime();
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
             let resData=res.data.data;
             this.$store.state.licenceinfo=resData;
             if(resData.expireDate-nowTime<7*24*60*60*1000)
             {
              this.$store.state.licenceinfo.istobeexpired=true;
             }else{
              this.$store.state.licenceinfo.istobeexpired=false;
             }
            this.$emit('isheaderemit',resData)
          }
        }); 
    },
    toggleMenu(){
      this.$emit("toggleMenu");
    },
    toggleRefresh(){
      location.reload();
    },
    handleUserCommand(command) {
      const funUserObj = {
        logout: this.logout
      }
      this.$nextTick(() => {
        funUserObj[command]()
      })
    },
    logout(){
      var url=SERVER_API_URL+"uaa/logout";
      const instance = axios.create();//
      instance.post(url,{},{
        headers: {
          'Authorization': 'Bearer '+sessionStorage.getItem('mytoken')
        }
      }).then((res)=>{
        // console.log(res)
        if(res.status===200){
          this.$store.commit(types.LOGOUT);
        }else{
          this.$message.error(this.$t('lg.failed'));
        }
      }).catch((err)=>{
        this.$store.commit(types.LOGOUT);
      })
    },
    transformDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return d.getFullYear()+'-'+ pad(parseInt(d.getMonth())+1)+'-'+ pad(d.getDate());
    },
    
    // updateNotification(){//更新流量监控邮件通知参数配置
    //   const url=SERVER_API_URL+'monitoring/quota/param';
    //   axios.patch(url,{
    //     "notification": this.$store.state.myNotification
    //   }).then((res)=>{
    //     if(res.data.responseCode==0){
    //       setTimeout(()=>{
    //         this.$message({
    //           type: 'success',
    //           message:  this.$t('lg.success')
    //         });
    //       },1000)
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //       this.$store.state.myNotification=!this.$store.state.myNotification;
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
    // },
    
    langChange(e){
      this.$router.go(0);
      localStorage.setItem('lang',e);
      this.$i18n.locale = e;
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~@/assets/css/var.styl"
.headerContainer
  background-color #fff
  .header-mgt
    padding 2px 15px
    height 40px
    line-height 40px
    display flex
    justify-content space-between 
    border-bottom 1px solid #f1f1f1
    overflow hidden
    .header-mgt-left
      li
        float left
        margin-right 20px
        .fa
          vertical-align middle
          font-size 18px
    .header-mgt-right
      overflow hidden
      li
        float left
        margin-left 20px
  .header-info
    line-height 30px
    padding-left 15px
    box-sizing border-box
    span.spanblock
      margin-right 14px
      color #28333e
      display inline-block
      .sf
        margin-right 4px
        color #888
        text-decoration: none
</style>
