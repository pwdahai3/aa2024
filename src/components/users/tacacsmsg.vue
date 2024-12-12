<!-- 用户管理列表 -->
<template>
  <div class="users-wrapper">
    <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
      <el-tab-pane label="CM" name="CM">
    <div class="usersContent">
      <table>
        <thead>
          <tr>
            <th>{{$t('lg.tacacsserverip')}}</th>
            <th>{{$t('lg.shouquanma')}}</th>
            <th width="180"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{users && users.server}}</td>
            <td> {{users && users.authCode}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editNtp(users)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

      </el-tab-pane>
      <el-tab-pane label="SHADOW" name="SHADOW">
        
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
    <div class="usersContent">
      <table>
        <thead>
          <tr>
            <th>{{$t('lg.tacacsserverip')}}</th>
            <th>{{$t('lg.shouquanma')}}</th>
            <th width="280"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{shadownodeData && shadownodeData.server}}</td>
            <td> {{shadownodeData && shadownodeData.authCode}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="shadoweditNtp(shadownodeData)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </el-tab-pane>
    </el-tabs>

    <tacacsedit :editShow="editShow" @eidtclose="editShow=false" :ntpData="users" @hasadduser="getCmTacacs"></tacacsedit>
    <shadowtacacsedit :shadownode="shadownodeVal"  :editShow="shadoweditShow" @eidtclose="shadoweditShow=false" :ntpData="shadowntpData"  @haseditshadow="getShadownodeData"></shadowtacacsedit>
  
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import tacacsedit from './tacacsEdit.vue'
import shadowtacacsedit from './shadowtacacsEdit.vue';
export default {
  components:{
    tacacsedit,
    loading,
    shadowtacacsedit
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getCmTacacs();
   // this.getShadownode();
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
    handleClick(tab, event){
      //console.log(tab, event);
      this.getShadownode();
      this.getShadownodeData()
    },
    getShadownodeData(item){
      let sdid=item || this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/tacacsConf/get/"+sdid;
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
    getCmTacacs(){
      var url=SERVER_API_URL+"pe/shadow/tacacsConf/get";
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
      this.ntpData=users;
      this.editShow=true;
    },
    shadoweditNtp(shadownodeData){
      this.shadowntpData=shadownodeData;
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