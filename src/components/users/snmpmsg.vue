<!-- 用户管理列表 -->
<template>
  <div class="users-wrapper">
    <div class="btn-bg">
      <el-button type="primary" @click="addSnmp">{{$t('lg.add')}}</el-button>
    </div>
    <div style="margin-bottom:12px">
      <el-select v-model="shadownodeVal" :placeholder="$t('lg.selectshadownode')" @change="getShadownodeData">
        <el-option
          v-for="item in shadownodeOpts"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>

      <div style="margin-top:12px;line-height:22px">
        <p>{{$t('lg.status')}}：{{snmpOnOff?$t('lg.statuson'):$t('lg.off')}}</p>
        <div style="margin:12px 0">
          <el-button size="mini" v-if="!snmpOnOff" @click="turnOnOff">{{$t('lg.kaiqi')}}</el-button><el-button size="mini" v-else  @click="turnOnOff">{{$t('lg.off')}}</el-button><el-button size="mini" v-if="snmpOnOff" @click="restart">{{$t('lg.restart')}}</el-button>
        </div>
      </div>
      <!-- <el-switch
        v-model="snmpOnOff"
        @change="turnOnOff">
      </el-switch> -->

    </div>
    <div class="usersContent" v-if="users.length>0">
      <table>
        <thead>
          <tr>
            <th>nodeId</th>
            <th>{{$t('lg.username')}}</th>
            <th>{{$t('lg.jianquanleixing')}}</th>
            <th>{{$t('lg.authpwd')}}</th>
            <th>{{$t('lg.enctype')}}</th>
            <th>{{$t('lg.encpwd')}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in users" :key="index">
            <td>{{item.nodeId}}</td>
            <td> {{item.lastName}}</td>
            <td> {{item.authType}}</td>
            <td> {{item.authPass}}</td>
            <td> {{item.encryptType}}</td>
            <td> {{item.encryptPass}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="shadoweditNtp(item)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delsnmp(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p class="nodata-box">{{$t('lg.nodata')}}</p>
    </div>
    <snmpedit :shadownode="shadownodeVal"  :editShow="shadoweditShow" @eidtclose="shadoweditShow=false" :ntpData="shadowntpData"  @haseditshadow="getShadownodeData"></snmpedit>
    <snmpadd :isShow="addSnmpShow"  :shadownodes="shadownodeOpts" @addclose="addSnmpShow=false" @addDone="getSnmp"></snmpadd>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import snmpedit from './snmpEdit.vue'
import snmpadd from './snmpAdd.vue'
export default {
  components:{
    snmpedit,
    snmpadd,
    loading
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getSnmp();
   // this.getShadownode();
  },
  data(){
    return{
      addSnmpShow:false,
      snmpOnOff:false,
      shadownodeVal:'',
      shadownodeOpts:[],
      shadownodeData:{},
      users:{},
      addShow:false,
      shadowaddShow:false,
      editShow:false,
      ntpData:{},
      editIndex:0,

      shadoweditShow:false,
      shadowntpData:{},
      shadoweditIndex:0,
      userSetingloading:false,

    }
  },
  methods:{
    addSnmp(){
      this.getShadownode().then((resolve,reject)=>{
        this.addSnmpShow=true;
      })
      
    },
    delsnmp(item){
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"pe/shadow/snmpConf/delete";
        axios.delete(url,{data:{
          srcLastName: item.lastName,
          nodeId: item.nodeId
        }}).then((res)=>{
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
    turnOnOff(){
      let onoff=this.snmpOnOff?'stop':'start';
      var url=SERVER_API_URL+"pe/shadow/process/operate/"+this.shadownodeVal+"/snmpd/"+onoff;
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.snmpOnOff=!this.snmpOnOff;
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed'));
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        this.$message.error(err.data);
        this.$store.state.contentLoading=false;
      });
    },
    restart(){
      var url=SERVER_API_URL+"pe/shadow/process/operate/"+this.shadownodeVal+"/snmpd/restart";
      axios.post(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error(this.$t('lg.failed'));
            }
            this.$store.state.contentLoading=false;
          }).catch((err)=>{
            this.$message.error(err.data);
            this.$store.state.contentLoading=false;
          });
    },
    getShadownodeData(item){
      let sdid=item || this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/snmpConf/list/"+sdid;
      this.getSnmpStatus();
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
    getShadownode(){
      return new Promise((resolve,reject)=>{
        var url=SERVER_API_URL+"pe/shadow/nodeId/all";
        axios.get(url).then((res)=>{
          if(res.status==200){
            var resArray=res.data.data;
            this.shadownodeOpts=resArray;
            if(this.shadownodeOpts.length>0){
              this.shadownodeVal=this.shadownodeOpts[0];
            }
            resolve(resArray)
          }
        }).catch((err)=>{
          reject(err)
        });
      })
    },
    getSnmp(){
      this.getShadownode().then((resolve,reject)=>{
       this.getSnmpStatus();
        var url=SERVER_API_URL+"pe/shadow/snmpConf/list/"+resolve[0];
        axios.get(url).then((res)=>{
          if(res.status==200){
            var resArray=res.data.data;
            this.users=resArray;
            this.$store.state.contentLoading=false;
          }
        }).catch((err)=>{
          console.log(err);
        });        
      })
    },
    getSnmpStatus(){
      var url=SERVER_API_URL+"/pe/shadow/process/status/"+this.shadownodeVal+"/snmpd";
        axios.get(url).then((res)=>{
          if(res.status==200){
            var resArray=res.data.data;
            this.snmpOnOff=resArray;
            this.$store.state.contentLoading=false;
          }
        }).catch((err)=>{
          console.log(err);
        });  
    },
    addCM(){
      this.addShow=true;
    },
    editNtp(users){
     // this.editIndex=index;
      this.ntpData=users;
      this.editShow=true;
    },
    shadoweditNtp(users){
      this.shadowntpData=users;
      this.shadoweditShow=true;
    },
    usDialogClose(){
      this.isShowUsDialog=false;
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