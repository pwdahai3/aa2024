<!-- 用户管理列表 -->
<template>
  <div class="users-wrapper">
    <h2 class="breadcrumb">{{$t('lg.yonghugl')}}</h2>
    <div class="btn-bg">
      <el-button type="primary" @click="addUser">{{$t('lg.adduser')}}</el-button>
    </div>
    <div class="usersContent">
      <p class="nodata-box" v-if="users.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="users.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.account')}}</th>
            <th>{{$t('lg.permission')}}</th>
            <th>{{$t('lg.expirationDay')}}</th>
            <th width="330"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users">
            <td>{{item.userName}}</td>
            <td><span class="spanrole" v-for="items in item.roles"> {{items}} </span></td>
            <td>{{item.validDay || '-'}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="distributeDomain(item.userName)" v-show="item.roles=='USER'"><i class="el-icon-edit"></i>{{$t('lg.domaindistrmang')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="editUser(item,'editGradeShow')"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="editPwd(item.userName)"><i class="el-icon-edit-outline"></i>{{$t('lg.update')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delUser(item.userName)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
 
    <domain-distribute ref="domain_distribute" :isShow="distributeDomainShow" :currentUser="currentUser" @distributeDomainClose="distributeDomainShow=false"></domain-distribute>
    <adduser :isShow="addShow" @addclose="addShow=false" @hasadduser="getUsers"></adduser>
    <edituser :isPwdShow="editPwdShow" @editPwdclose="editPwdShow=false" :isGradeShow="editGradeShow" @editGradeclose="editGradeShow=false" :userData="userInfo" @hasadduser="getUsers"></edituser>

    <div class="text-right">
      <el-button type="primary" @click="getIntervalPeriod"> {{$t('lg.addcongig')}} </el-button>
    </div>
    <el-dialog width="40%" :title="$t('lg.editpwdtimejiange')" :visible.sync="isShowUsDialog" :close-on-click-modal="false" :before-close="usDialogClose">
      <el-form ref="userSettingform" :model="userSettingform" :rules="userSettingformRules" class="usDrawerContent" label-width="80px">
        <el-form-item :label="$t('lg.tixinginterval')" prop="pwInterval">
          <el-input v-model="userSettingform.pwInterval">
            <template slot="append">/{{$t('lg.day')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setIntervalPeriod('gradeform')">{{$t('lg.confirm')}}</el-button>
          <el-button @click="usDialogClose()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="userSetingloading" title="loading..."></loading>
    </el-dialog>

    <el-dialog width="420px" title="确定删除此用户" :visible.sync="popslidershow" :close-on-click-modal="false" :before-close="sliderClose">
      <div>
        <slider2
              ref="dragVerify"
              :width="380"
              :height="40"
              progressBarBg="#FFA500"
              background="#F5F5F5"
              :text="$t('lg.pressslier')"
              :successText="$t('lg.passed')"
              :isPassing.sync="isPassing"
              handlerIcon="el-icon-d-arrow-right"
              successIcon="el-icon-circle-check"
              @passcallback="passcallback2">
          </slider2>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import domainDistribute from './domainDistribute';
import adduser from './userAdd.vue';
import edituser from './userEdit.vue';
import slider2 from '@/components/login/slider2'
export default {
  components:{
    domainDistribute,
    adduser,
    edituser,
    loading,
    slider2
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getUsers();
  },
  data(){
    return{
      issliderItem:'',
      isPassing:false,
      popslidershow:false,
      users:[],
      addShow:false,

      editPwdShow:false,
      editGradeShow:false,
      userInfo:{},

      // 域名分配管理
      distributeDomainShow:false,
      currentUser:'',//当前用户

      //高级设置
      isShowUsDialog:false,
      needPostRequest:false,//如果 获取的 ‘用户帐号密码’修改提醒时间间隔 为 null,则设置 ‘用户帐号密码’修改提醒时间间隔时 要先用post请求提交
      userSettingform:{ 
        pwInterval:null,
      },
      userSettingformRules:{
        pwInterval:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ]
      },
      userSetingloading:false,

    }
  },
  methods:{
    reset() {
        this.isPassing = false;
        if(this.$refs.dragVerify != undefined){
          this.$refs.dragVerify.reset();
        }
      },
    passcallback2() {
      console.log(1111)
        this.isPassing=true;

        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"uaa/user/"+this.issliderItem;
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.popslidershow=false;
           this.sliderClose();
            this.getUsers();
            
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.$store.state.contentLoading=false;
        }).catch((err)=>{
          console.log(err)
        })
    },
    editPwd(item){
     // console.log(item)
      this.$router.push({path: '/editpwd',query:{
        userName:item
      }});
    },
    getUsers(){
      var url=SERVER_API_URL+"uaa/user";
      axios.get(url).then((res)=>{
        if(res.status==200){
          var resArray=res.data.data;
          this.users=resArray;
          this.$store.state.contentLoading=false;
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    addUser(){
      this.addShow=true;
    },

    distributeDomain(userName){//域名分配管理
      this.$refs.domain_distribute.getDistributeDomainData(userName).then((resolvedata)=>{
        this.currentUser=userName;
        this.distributeDomainShow=true;
      })
    },
    editUser(item,type){//flag为true表示更新密码，为false表示修改权限
      // console.log(item)
      this.userInfo=item;
      this[type]=true;
    },
    delUser(item){
      this.$confirm(this.$t('lg.isdeleteUser'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.issliderItem=item;
        this.popslidershow=true;

        // this.$store.state.contentLoading=true;
        // var url=SERVER_API_URL+"uaa/user/"+item;
        // axios.delete(url).then((res)=>{
        //   if(res.data.responseCode==0){
        //     this.getUsers();
        //     this.$message({
        //       type: 'success',
        //       message: this.$t('lg.success')
        //     });
        //   }else{
        //     this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        //   }
        //   this.$store.state.contentLoading=false;
        // }).catch((err)=>{
        //   console.log(err)
        // })


      }).catch(()=>{
        this.$message({
          type: 'info',
          message: this.$t('lg.canceled')
        });
      })
    },

    getIntervalPeriod(){//获取 ‘用户帐号密码’修改提醒时间间隔，显示设置弹框
      var url=SERVER_API_URL+"pe/shadow/kv/uaaIntervalPeriod";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resData=res.data.data;
          if(!resData){
            this.needPostRequest=true;
          }else{
            this.needPostRequest=false;
          }
          this.userSettingform.pwInterval=resData?resData.value:90;
          this.isShowUsDialog=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    setIntervalPeriod(){//设置 ‘用户帐号密码’修改提醒时间间隔
      this.$refs['userSettingform'].validate((valid) => {
        if(valid){
          const url=SERVER_API_URL+"pe/shadow/kv";
          let requestMethod=this.needPostRequest?'post':'patch';
          this.userSetingloading=true;

          axios[requestMethod](url,{
            uaaIntervalPeriod:this.userSettingform.pwInterval-0
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.usDialogClose();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
            }
            this.userSetingloading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    usDialogClose(){
      this.isShowUsDialog=false;
    },
    sliderClose(){
      this.popslidershow=false;
      this.reset();
    },

    usDrawerClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
          done();
        // })
        // .catch(_ => {});
    }
  }
}
</script>
<style scoped>
.users-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
.usersContent{
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
}


/*抽屉 设置*/
.userSettingBox{
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.usDrawerTitle{
  background-color: #4a5166;
  font-weight: 800;
  color: #fff;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 20px;
  box-sizing: border-box;
}
.usDrawerContent{
  flex: 1;
}
.usFooterBtn{
  display: flex;
}
.usFooterBtn button {
  flex: 1;
}
.spanrole{ display: inline-block; margin: 0 10px;}
</style>