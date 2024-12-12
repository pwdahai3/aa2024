<template>
  <div class="users-wrapper">
    <h2 class="breadcrumb">{{$t('lg.logbackset')}}</h2>
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
    <div class="usersContent">
      <p class="nodata-box" v-if="shadownodeData.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="shadownodeData.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.backuplog')}}</th>
            <th>{{$t('lg.savetime')}}</th>
            <th width="280"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{$t('lg.accesslog')}}</td>
            <td> 
              <el-input v-model="shadownodeData[0].accessReserveTime"></el-input>
            </td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="updateAcc"><i class="el-icon-edit"></i>{{$t('lg.update')}}</a>
            </td>
          </tr>
          <tr>
            <td>{{$t('lg.errorlog')}}</td>
            <td> <el-input v-model="shadownodeData[1].errorReserveTime"></el-input></td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="updateErr"><i class="el-icon-edit"></i>{{$t('lg.update')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   <loading v-show="isLoading" title="loading..."></loading>
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
    this.getShadownode();
  },
  data(){
    return{
      shadownodeOpts:[],
      shadownodeVal:'',
      shadownodeData:[],
      orginaccessVal:'',
      orginErrorVal:'',
      isLoading:false
    }
  },
  methods:{
    updateAcc(){
      if(!this.shadownodeData[0].accessReserveTime.match(/^\d+$/g)){
        this.$message.error(this.$t('lg.qingshurushuzi'));
        return;
      }
      let data={
        "newAccessReserveTime": this.shadownodeData[0].accessReserveTime,
        "oldAccessReserveTime": this.orginaccessVal,
        "type": 1
      }
      this.update(data);
    },
    updateErr(){
      if(!this.shadownodeData[1].errorReserveTime.match(/^\d+$/g)){
        this.$message.error(this.$t('lg.qingshurushuzi'));
        return;
      }
      let data={
        "newErrorReserveTime": this.shadownodeData[1].errorReserveTime,
        "oldErrorReserveTime": this.orginErrorVal,
        "type": 2
      }
      this.update(data);
    },
    update(data){
      var url=SERVER_API_URL+"pe/shadow/changeSavelogConf/post/"+this.shadownodeVal;
      this.isLoading=true;
      axios.post(url,data).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.orginaccessVal=JSON.parse(JSON.stringify(this.shadownodeData[0].accessReserveTime));
              this.orginErrorVal=JSON.parse(JSON.stringify(this.shadownodeData[1].errorReserveTime))
            }else{
              this.$message.error(this.$t('lg.failed'));
            }
            this.isLoading=false;
          }).catch((err)=>{
         //   this.$message.error('操作失败');
           // this.userloading=false;
          });
    },
    getShadownode(){
      var url=SERVER_API_URL+"pe/shadow/nodeId/all";
      this.isLoading=true;
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          this.shadownodeOpts=resArray;
          if(this.shadownodeOpts.length>0){
            this.shadownodeVal=this.shadownodeOpts[0];
          }
          this.getShadownodeData();
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getShadownodeData(item){
      item=item || this.shadownodeVal;
      var url=SERVER_API_URL+"pe/shadow/changeSavelogConf/get/"+item;
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          this.shadownodeData=resArray;
          this.orginaccessVal=JSON.parse(JSON.stringify(this.shadownodeData[0].accessReserveTime));
          this.orginErrorVal=JSON.parse(JSON.stringify(this.shadownodeData[1].errorReserveTime))
          this.isLoading=false;
        }
      }).catch((err)=>{
        console.log(err);
      });
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


</style>