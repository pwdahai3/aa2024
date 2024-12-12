<template>
  <div class="layout_container">
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="asideMenuWidth">
        <aside-menu></aside-menu>
      </el-aside>
      <el-container class="right-container">
        <el-header class="myheader">
          <vheader @toggleMenu="toggleAsideMenu"></vheader>
        </el-header>
        <el-main>
          <loading class="main-loading-c" v-if="$store.state.contentLoading"></loading>
          <router-view @updateRenderTree="updateLicenceStatus"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <loginRestriction></loginRestriction>
    <edituser :isPwdShow="$store.state.showEditUsersPswdDialog" @editPwdclose="$store.state.showEditUsersPswdDialog=false" :userData="$store.state.userInfo"></edituser> <!-- 修改密码全局弹框 -->
    <!-- <loading class="main-loading-c" v-if="$store.state.contentLoading"></loading> -->
  </div>
</template>

<script>
import * as types from '@/store/types';
import asideMenu from '@/components/vmenu/asideMenu'
import vheader from '@/components/vheader/header'
import loginRestriction from '@/basecomponents/loginRestriction'
import edituser from '@/components/users/userEdit.vue'
import loading from '@/components/loading/loading'
export default {
  components:{
    vheader,
    asideMenu,
    loginRestriction,
    edituser,
    loading
  },
  data(){
    return{
      asideMenuWidth: '234px',
    }
  },
  methods:{
    updateLicenceStatus(val){
      console.log(val)
    },
    toggleAsideMenu(){
      this.$store.state.isMenuShow = !this.$store.state.isMenuShow;
      this.asideMenuWidth = this.$store.state.isMenuShow ? '65px' : '210px';
    }
  }
}
</script>

<style lang="stylus" scoped>
.layout_container
  width 100%
  height 100%
  .el-container
    width 100%
    height 100%
    // 左侧菜单栏
    .el-aside 
      background-color #28333e
      color #fff
    // 右侧主体栏
    .right-container
      padding 15px
      background-color #f1f1f2
      // 头部
      .myheader
        height: auto !important
        padding 0 
        margin-bottom 15px
      // 页面主体
      .el-main
        padding 0px
        position relative
        background-color #fff
</style>
