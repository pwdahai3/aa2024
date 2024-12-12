<!-- 用户管理列表 -->
<template>
  <div class="users-wrapper">
    <div class="usersContent">
      <div style="margin-bottom:12px">
        <el-select v-model="shadownodeVal" :placeholder="$t('lg.selectshadownode')" @change="getShadownodeData">
          <el-option
            v-for="item in shadownodeOpts"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>

      <table>
        <thead>
          <tr>
            <th>{{$t('lg.serverip')}}</th>
            <th>{{$t('lg.configswitfch')}}</th>
            <th width="280"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{users.server || '----'}}</td>
            <td> {{users.syslogSwitch}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editNtp(users)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delNtp(users)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <syslogedit :editShow="editShow" @eidtclose="editShow=false" :ntpData="users" @hasadduser="getSyslog"  :shadownode="shadownodeVal"></syslogedit>

  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import syslogedit from './syslogEdit.vue'
import shadowtacacsedit from './shadowtacacsEdit.vue';
export default {
  components:{
    syslogedit,
    loading,
    shadowtacacsedit
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getShadownode();
  //  this.getShadownodeData();
  },
  data(){
    return{
      tabActiveName:'CM',
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
    getShadownodeData(item){
      let sdid=item || this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/syslogConf/get/"+sdid;
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
      var url=SERVER_API_URL+"pe/shadow/nodeId/all";
      axios.get(url).then((res)=>{
        if(res.status==200){
          var resArray=res.data.data;
          this.shadownodeOpts=resArray;
          if(this.shadownodeOpts.length>0){
            this.shadownodeVal=this.shadownodeOpts[0];
            this.getShadownodeData();
          }  
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getSyslog(){
      let sdid=this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/syslogConf/get/"+sdid;
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
    editNtp(users){
     // this.editIndex=index;
     console.log(users)
      this.ntpData=users;
      this.editShow=true;
    },
    shadoweditNtp(shadownodeData){
      this.shadowntpData=shadownodeData;
      this.shadoweditShow=true;
    },
    usDialogClose(){
      this.isShowUsDialog=false;
    },
    delNtp(item){
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.$store.state.contentLoading=true;
        var url=SERVER_API_URL+"pe/shadow/syslogConf/delete/"+this.shadownodeVal;
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.getSyslog();
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