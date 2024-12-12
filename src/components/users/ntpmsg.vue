<!-- 用户管理列表 -->
<template>
  <div class="users-wrapper">
    <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
      <el-tab-pane label="CM" name="CM">

        <div class="btn-bg">
      <el-button type="primary" @click="addCM">{{$t('lg.add')}}</el-button>
    </div>
    <div class="usersContent">
      <p class="nodata-box" v-if="users.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="users.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.timeserverip')}}</th>
            <th>{{$t('lg.type')}}</th>
            <th width="280"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in users" :key="index">
            <td>{{item.server}}</td>
            <td> {{item.type}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editNtp(item,index)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delNtp(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      </el-tab-pane>
      <el-tab-pane label="SHADOW" name="SHADOW">
        
    <div style="margin-bottom:12px">
      <el-select v-model="shadownodeVal" :placeholder="$t('lg.select')" @change="getShadownodeData">
        <el-option
          v-for="item in shadownodeOpts"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>
    <div class="btn-bg">
      <el-button type="primary" @click="addShadow">{{$t('lg.add')}}</el-button>
    </div>
    <div class="usersContent">
      <p class="nodata-box" v-if="shadownodeData.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="shadownodeData.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.timeserverip')}}</th>
            <th>{{$t('lg.type')}}</th>
            <th width="280"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in shadownodeData" :key="index">
            <td>{{item.server}}</td>
            <td> {{item.type}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="shadoweditNtp(item,index)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="shadowdelNtp(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


      </el-tab-pane>
    </el-tabs>

    
    <ntpadd :isShow="addShow" @addclose="addShow=false" @hasadduser="getCmNtp"></ntpadd>
    <ntpedit :editShow="editShow" @eidtclose="editShow=false" :allData="users" :ntpData="ntpData" :editindex="editIndex" @hasadduser="getCmNtp"></ntpedit>
    <shadowntpadd :shadownode="shadownodeVal" :isShow="shadowaddShow" @addclose="shadowaddShow=false" @hasaddshadow="getShadownodeData"></shadowntpadd>
    <shadowntpedit :shadownode="shadownodeVal"  :editShow="shadoweditShow" @eidtclose="shadoweditShow=false" :allData="shadownodeData" :ntpData="shadowntpData" :editindex="shadoweditIndex" @haseditshadow="getShadownodeData"></shadowntpedit>
  
  
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import ntpadd from './ntpAdd.vue';
import ntpedit from './ntpEdit.vue';
import shadowntpadd from './shadowntpAdd.vue';
import shadowntpedit from './shadowntpEdit.vue';
export default {
  components:{
    ntpadd,
    ntpedit,
    loading,
    shadowntpadd,
    shadowntpedit
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getCmNtp();
   // this.getShadownode();
  },
  data(){
    return{
      tabActiveName:'CM',
      shadownodeVal:'',
      shadownodeOpts:[],
      shadownodeData:[],
      users:[],
      addShow:false,
      shadowaddShow:false,
      editShow:false,
      ntpData:{},
      editIndex:0,

      shadoweditShow:false,
      shadowntpData:{},
      shadoweditIndex:0,
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
    handleClick(tab, event){
      //console.log(tab, event);
      this.getShadownode();
      this.getShadownodeData()
    },
    getShadownodeData(item){
      item=item || this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/ntpConf/get/"+item;
      axios.get(url).then((res)=>{
        if(res.status==200){
          var resArray=res.data.data;
          this.shadownodeData=resArray;
          this.$store.state.contentLoading=false;
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getShadownode(){
      var url=SERVER_API_URL+"pe/shadow/nodeId/all";
      axios.get(url).then((res)=>{
        if(res.status==200){
          var resArray=res.data.data;
          this.shadownodeOpts=resArray;
          if(this.shadownodeOpts.length>0){
            this.shadownodeVal=this.shadownodeOpts[0];
          }
          
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getCmNtp(){
      var url=SERVER_API_URL+"pe/shadow/ntpConf/get";
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
    addCM(){
      this.addShow=true;
    },
    addShadow(){
      if(!this.shadownodeVal){
        this.$message.error(this.$t('lg.selectshadownode'));
        return;
      }
      this.shadowaddShow=true;
    },
    editNtp(item,index){
      this.editIndex=index;
      this.ntpData=item;
      this.editShow=true;
    },
    shadoweditNtp(item,index){
      this.shadoweditIndex=index;
      this.shadowntpData=item;
      this.shadoweditShow=true;
    },
    delNtp(item){
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"pe/shadow/ntpConf/delete";
        axios.delete(url,{data:{oldServer:item.server,oldType:item.type}}).then((res)=>{
          if(res.data.responseCode==0){
            this.getCmNtp();
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
    shadowdelNtp(item){
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"pe/shadow/ntpConf/delete/"+this.shadownodeVal;
        axios.delete(url,{data:{oldServer:item.server,oldType:item.type}}).then((res)=>{
          if(res.data.responseCode==0){
            this.getShadownodeData();
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

</style>