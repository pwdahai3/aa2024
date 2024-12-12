<template>
  <div class="users-wrapper">
    <h2 class="breadcrumb">{{$t('lg.firewallconfig')}}</h2>
    <div style="margin:22px 0">
      <el-button type="primary" @click="addIP">{{$t('lg.addipconfig')}}</el-button><el-button type="primary" @click="addMAC">{{$t('lg.addmacconfig')}}</el-button>
    </div>
    <div class="usersContent">
      <h3 class="ftitle">{{$t('lg.ipconfiglist')}}:</h3>
      <p class="nodata-box" v-if="ips.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="ips.length>0">
        <thead>
          <tr>
            <th>id</th>
            <th>ip</th>
            <th>{{$t('lg.yanma')}}</th>
            <th>{{$t('lg.protocol')}}</th>
            <th>{{$t('lg.port')}}</th>
            <th>{{$t('lg.xingwei')}}</th>
            <th width="120"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ips">
            <td>{{item.id}}</td>
            <td>{{item.ip}}</td>
            <td>{{item.networkPrefix}}</td>
            <td>{{item.protocol}}</td>
            <td>{{item.port}}</td>
            <td>{{item.type}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editIp(item)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delIp(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:22px">
        <h3 class="ftitle">{{$t('lg.macconfiglist')}}:</h3>
        <p class="nodata-box" v-if="macs.length==0">{{$t('lg.nodata')}}</p>
        <table v-if="macs.length>0">
        <thead>
          <tr>
            <th>id</th>
            <th>mac</th>
            <th>{{$t('lg.protocol')}}</th>
            <th>{{$t('lg.port')}}</th>
            <th>{{$t('lg.xingwei')}}</th>
            <th width="120"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in macs">
            <td>{{item.id}}</td>
            <td>{{item.mac}}</td>
            <td>{{item.protocol}}</td>
            <td>{{item.port}}</td>
            <td>{{item.type}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editMac(item)"><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delMac(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
    <addip :isIpShow="addipshow" @addclose="addipshow=false;" @hasadduser="getIps"></addip>
    <editip :isIpShow="editipshow" :ipData="ipData" @addclose="editipshow=false;"  @hasadduser="getIps"></editip>
    <addmac :isMacShow="addmacshow" @addclose="addmacshow=false" @hasaddmac="getMacs"></addmac>
    <editmac :isMacShow="editmacshow" :ipData="ipData" @addclose="editmacshow=false;"  @hasaddmac="getMacs"></editmac>
    <loading v-show="isLoading" title="loading..."></loading>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import addip from './ipAdd.vue';
import addmac from './macAdd.vue';
import editip from './ipEdit.vue'
import editmac from './macEdit.vue'
export default {
  components:{
    addip,
    addmac,
    editip,
    editmac,
    loading
  },
  created(){
    this.getIps();
    this.getMacs();
  },
  data(){
    return{
      ips:[],
      macs:[],
      users:[],
      addipshow:false,
      editipshow:false,
      addmacshow:false,
      editmacshow:false,
      isLoading:false,
      ipData:{}
    }
  },
  methods:{
    editMac(item){
      this.editmacshow=true;
      this.ipData=item;
    },
    editIp(item){
      this.editipshow=true;
      this.ipData=item;
    },
    getIps(){
      var url=SERVER_API_URL+"pe/shadow/firewallip/list";
      this.isLoading=true;
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          this.ips=resArray;
          this.isLoading=false;
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getMacs(){
      var url=SERVER_API_URL+"pe/shadow/firewallmac/list";
      this.isLoading=true;
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          this.macs=resArray;
          this.isLoading=false;
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    addIP(){
      this.addipshow=true;
    },
    addMAC(){
      this.addmacshow=true;
    },
    delIp(item){
      let data={
        "id": item.id,
        "oldIp": item.ip,
        "oldNetworkPrefix": item.networkPrefix,
        "oldPort": item.port,
        "oldProtocol": item.protocol,
        "oldType": item.type
      };
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.isLoading=true;
        var url=SERVER_API_URL+"pe/shadow/firewallip/delete";
        axios.delete(url,{data:data}).then((res)=>{
          if(res.data.responseCode==0){
            this.getIps();
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
          }else{
            this.$message.error(this.$t('lg.failed'));
          }
          this.isLoading=false;
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
    delMac(item){
      console.log(item);
      let data={
        "id": item.id,
        "oldMac": item.mac,
        "oldPort": item.port,
        "oldProtocol": item.protocol,
        "oldType": item.type
      };
      this.$confirm(this.$t('lg.isdelete'),this.$t('lg.tip'),{
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        this.isLoading=true;
        var url=SERVER_API_URL+"pe/shadow/firewallmac/delete";
        axios.delete(url,{data:data}).then((res)=>{
          if(res.data.responseCode==0){
            this.getMacs();
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
          }else{
            this.$message.error(this.$t('lg.failed'));
          }
          this.isLoading=false;
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
    usDialogClose(){
      this.isShowUsDialog=false;
    }
  }
}
</script>
<style scoped>
.ftitle{
  margin-bottom: 12px;
  font-weight: 500;
}
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