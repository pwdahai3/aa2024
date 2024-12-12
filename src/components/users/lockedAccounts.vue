<!-- 查看被锁定用户帐号列表 -->
<template>
  <div class="lockedAccounts-wrapper">
    <h2 class="breadcrumb">{{$t('lg.lockdownaccmang')}}</h2>
   
    <div class="lokActContent">
      <p class="nodata-box" v-if="lokActData.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="lokActData.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.account')}}</th>
            <th>{{$t('lg.accloginfailedcount')}}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in lokActData">
            <td>{{item.userName}}</td>
            <td>{{item.failureCount}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="delLockedAccounts(item.userName)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="text-right">
      <el-button type="primary" @click="getRetryCount">{{$t('lg.addcongig')}}</el-button>
    </div>

    <!-- <el-drawer
      :visible.sync="isShowLokActDrawer"
      :before-close="usDrawerClose"
      size='300px'
      ref="usDrawer">

      <div class="userSettingBox">
        <h2 class="usDrawerTitle">高级设置</h2>

        <el-form :model="lokActSettingform" class="usDrawerContent">
          <el-form-item label="提醒密码修改间隔">
            <el-input v-model="lokActSettingform.retryCount">
              <template slot="append">/天</template>
            </el-input>
          </el-form-item>
        </el-form>

        <div class="usFooterBtn">
          <el-button type="primary" @click="$refs.usDrawer.closeDrawer()">确定</el-button>
          <el-button @click="$refs.usDrawer.closeDrawer()">取消</el-button>
        </div>
      </div>
    </el-drawer> -->

    <el-dialog width="40%" :title="$t('lg.accloginfailedcsett')" :visible.sync="isShowLokActDrawer" :close-on-click-modal="false" :before-close="lokActDialogClose">
      <el-form ref="lokActSettingform" :model="lokActSettingform" :rules="lokActSettingformRules" class="usDrawerContent" label-width="80px">
        <el-form-item :label="$t('lg.limitcount')" prop="retryCount">
          <el-input v-model="lokActSettingform.retryCount">
            <template slot="append">/{{$t('lg.count')}}</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="setRetryCount('gradeform')">{{$t('lg.confirm')}}</el-button>
          <el-button @click="lokActDialogClose()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="lokActSetingloading" title="loading..."></loading>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';

export default {
  components:{
    loading
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getLockedAccounts();
  },
  data(){
    return{
      lokActData:[],

      isShowLokActDrawer:false,
      needPostRequest:false,//如果 获取的 ‘用户帐号密码’修改提醒时间间隔 为 null,则设置 ‘用户帐号密码’修改提醒时间间隔时 要先用post请求提交
      lokActSettingform:{ 
        retryCount:null,
      },
      lokActSettingformRules:{
        retryCount:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ]
      },
      lokActSetingloading:false,

    }
  },
  methods:{
    getLockedAccounts(){
      var url=SERVER_API_URL+"uaa/user/accountstatus";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          const resArray=res.data.data;
          this.lokActData=resArray;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    delLockedAccounts(item){
      this.$confirm(this.$t('lg.isdeleteUser'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"uaa/user/"+item+"/accountstatus";
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.getLockedAccounts();
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
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: this.$t('lg.canceled')
        });
      })
    },

    getRetryCount(){//获取 ‘用户帐号密码’修改提醒时间间隔，显示设置弹框
      var url=SERVER_API_URL+"pe/shadow/kv/uaaRetryCount";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resData=res.data.data;
          if(!resData){
            this.needPostRequest=true;
          }else{
            this.needPostRequest=false;
          }
          this.lokActSettingform.retryCount=resData?resData.value:10;
          this.isShowLokActDrawer=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    setRetryCount(){//设置 ‘用户帐号密码’修改提醒时间间隔
      this.$refs['lokActSettingform'].validate((valid) => {
        if(valid){
          const url=SERVER_API_URL+"pe/shadow/kv";
          let requestMethod=this.needPostRequest?'post':'patch';
          this.lokActSetingloading=true;

          axios[requestMethod](url,{
            uaaRetryCount:this.lokActSettingform.retryCount-0
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.lokActDialogClose();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
            }
            this.lokActSetingloading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
      

    },
    lokActDialogClose(){
      this.isShowLokActDrawer=false;
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
.lockedAccounts-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
.lokActContent{
  margin-top: 10px;
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

</style>