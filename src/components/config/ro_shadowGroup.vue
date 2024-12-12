<template>
  <div>
    <el-dialog width="80%" title="shadow Group" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpClose">
      <el-button class="addSdGrpBtn" type="primary" size="mini" @click="showSdGrpPop()">{{$t('lg.addSdGrp')}}</el-button>
      <div v-if="sdGrpData.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
      <table v-else class="sdGrpTable">
        <thead>
          <tr>  
            <th>id</th>
            <th>{{$t('lg.groupname')}}</th>
            <th>{{$t('lg.status')}}</th>
            <th>{{$t('lg.remark')}}</th>
            <th width="48%">{{$t('lg.grouplist')}}</th>
            <th width="60"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sdGrpData">
            <td>{{item.id}}</td>
            <td>{{item.groupName}}</td>
            <td>{{tStatus2(item.status)}}</td>
            <td>{{item.remark}}</td>
            <td>
              <div v-if="item.configGroupDetailList.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
              <table v-else>
                <thead>
                  <tr>  
                    <!-- <th>群组id</th> -->
                    <th>shadow id</th>
                    <th>{{$t('lg.status')}}</th>
                    <th>{{$t('lg.remark')}}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="items in item.configGroupDetailList">
                    <!-- <td> {{items.groupId}} </td> -->
                    <td>{{items.shadowId}} </td>
                    <td>{{tStatus2(items.status)}} </td>
                    <td>{{items.remark}} </td>
                    <td><a href="javascript:;" class="edit-del-a" @click="delNodeByid(items)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a></td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="edtSingleSdGrp(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="addSingleSdGrp(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.add')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delSingleSdGrp(item.id)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody> 
      </table>
      <div v-show="sdGrpLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <ro-shadow-group-pop :isShow="sdGrpPopVisible" :editGrpObj="editGroup"  :updateRenderTree="updateRenderTree" @updateSdGrpData="getSdGrpData" @sdGrpPopclose="sdGrpPopVisible=false" @updateConfigTree="updateConfigTree"></ro-shadow-group-pop>
    <roshadowgroupedit :isShow="iseditshow" :data="editData" @editclose="iseditshow=false"></roshadowgroupedit>
    <roshadowaddbygroupid :data="addbygroupidData" :isShow="addbygroupidShow"   @updateSdGrpData="getSdGrpData" @forpandp="forEmitOnly" @sdGrpPopclose="addbygroupidShow=false"></roshadowaddbygroupid>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import roshadowgroupedit from '@/components/config/ro_shadowGroupEdit';
import roShadowGroupPop from '@/components/config/ro_shadowGroupPop';
import roshadowaddbygroupid from '@/components/config/ro_addPopByGroupid';
export default{
  components:{
    loading,
    roShadowGroupPop,
    roshadowgroupedit,
    roshadowaddbygroupid
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
      editGroup:{},
      iseditshow:false,
      editData:{},
      sdGrpLoading:false,
      addbygroupidShow:false,
      addbygroupidData:{}
    }
  },
  methods:{ 
    tStatus2(item){
      let itemName=item==0?this.$t('lg.wuxiao'):item==1?this.$t('lg.youxiao'):this.$t('lg.parteffect');
      return itemName;
    },  
    forEmitOnly(){
this.$emit("delgroupemit");
    },
    delNodeByid(item){
      this.$confirm(this.$t('lg.isdelete'), this.$t('lg.tips'), {
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        this.sdGrpLoading=true;
        const url = SERVER_API_URL+"pe/shadow/configgroupdetail/delete";
        let data={
          "configGroupDetailList": [
            {
              "shadowId": item.shadowId
            }
          ],
          "groupId": item.groupId
        };
        axios.delete(url,{data:data}).then((res)=>{
          if(res.data.responseCode==0){
            this.getSdGrpData();
           // this.updateConfigTree();
            this.$emit("delgroupemit")
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
    },
    addSingleSdGrp(item){
      this.addbygroupidShow=true;
      this.addbygroupidData=item;
    },
    getSdGrpData(){//查询所有shadow集群数据
      return new Promise((resolve,reject)=>{
        const url = SERVER_API_URL+"pe/shadow/configgroup/list";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resArr = res.data.data;
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
      this.updateRenderTree();
    },
    edtSingleSdGrp(item){
      this.iseditshow=true;
      this.editData=item
    },
    delSingleSdGrp(nameVal){
      this.$confirm(this.$t('lg.isdelete'), this.$t('lg.tips'), {
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        this.sdGrpLoading=true;
        const url = SERVER_API_URL+"pe/shadow/configgroup/delete/"+nameVal;
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.getSdGrpData();
            this.updateConfigTree();
            this.$emit("updateleftshow")///
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
  },
  filters:{
    tStatus(item){
      let itemName=item==0?this.$t('lg.wuxiao'):item==1?this.$t('lg.youxiao'):this.$t('lg.parteffect');
      return itemName;
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

.sdGrpParamsList li{
  line-height: 20px;
}
.edit-del-a{ display: inline-block; height: 24px; line-height: 24px;}
</style>

