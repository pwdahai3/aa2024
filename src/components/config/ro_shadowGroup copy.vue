<template>
  <div>
    <el-dialog width="60%" title="shadow Group" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpClose">
      <el-button class="addSdGrpBtn" type="primary" size="mini" @click="showSdGrpPop()">{{$t('lg.addSdGrp')}}</el-button>
      <div v-if="sdGrpData.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
      <table v-else class="sdGrpTable">
        <thead>
          <tr>  
            <th>{{$t('lg.clusterName')}}</th>
            <th>{{$t('lg.masterNode')}}</th>
            <th>{{$t('lg.backupNode')}}</th>
            <th>{{$t('lg.virtualIP')}}</th>
            <th width="80"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sdGrpData">
            <td>{{item.groupName}}</td>
            <td>{{item.masterNode.snodeId}} ({{item.masterNode.hostName}})</td>
            <td>
              <ul class="sdGrpParamsList">
                <li v-for="items in item.backupNodes">{{items.snodeId}} ({{items.hostName}})</li>
              </ul>
            </td>
            <td>
              <ul class="sdGrpParamsList">
                <li v-for="items in item.virtualIPs">{{items}}</li>
              </ul>
            </td>
            <td class="text-center">
              <!-- <a href="javascript:;" class="edit-del-a" @click="showSdGrpPop(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
              <a href="javascript:;" class="edit-del-a" @click="delSingleSdGrp(item.groupName)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody> 
      </table>
      <div v-show="sdGrpLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <ro-shadow-group-pop :isShow="sdGrpPopVisible" :isGrpEdit="isEdit" :editGrpObj="editGroup" @updateSdGrpData="getSdGrpData" @sdGrpPopclose="sdGrpPopVisible=false;isEdit=false" @updateConfigTree="updateConfigTree"></ro-shadow-group-pop>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';

import roShadowGroupPop from '@/components/config/ro_shadowGroupPop';
export default{
  components:{
    loading,
    roShadowGroupPop
  },
  props:{
    isShow:{
      type:Boolean
    },
    updateRenderTree:{
      type:Function
    }
  },
  data(){
    return{
      sdGrpPopVisible:false,
      sdGrpData:[],

      isEdit:false,//代表编辑操作
      editGroup:{},

      sdGrpLoading:false,
    }
  },
  methods:{
    getSdGrpData(){//查询所有shadow集群数据
      return new Promise((resolve,reject)=>{
        const url = SERVER_API_URL+"pe/shadow/group/m1";
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            let resArr = res.data.data.content;
            this.sdGrpData = resArr;
            resolve(resArr);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      })
    },

    sdGrpClose(){//关闭shadow集群列表弹框
      this.$emit("rootShadowGroupclose",false);
    },

    showSdGrpPop(item){//显示操作（新增、编辑）shadow集群弹框
      if(item){
        this.isEdit=true;
        this.editGroup=item;
      }else{
        this.isEdit=false;
      };
      this.sdGrpPopVisible=true;
    },
    updateConfigTree(){
      this.updateRenderTree(true);
    },
    delSingleSdGrp(nameVal){//删除一个现有的shadow集群
      this.$confirm(this.$t('lg.itdelete')+ nameVal+', '+ this.$t('lg.continue')+'?', this.$t('lg.tips'), {
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        this.sdGrpLoading=true;
        const url = SERVER_API_URL+"pe/shadow/group/"+nameVal;
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.getSdGrpData();
            this.updateConfigTree();
            this.$message({
              message: this.$t('lg.success'),
              type: 'success'
            });
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.sdGrpLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('lg.canceled')
        });          
      });
    }
  }
}
</script>
<style scoped>
.addSdGrpBtn{
  position: absolute;
  right: 20px;
  top: 50px;
}
.sdGrpTable{
  margin-top: 15px;
}
.sdGrpParamsList{

}
.sdGrpParamsList li{
  line-height: 20px;
}
</style>

