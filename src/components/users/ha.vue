<template>
  <div class="wrapper">
      <el-button class="addSdGrpBtn" type="primary" size="mini" @click="showSdGrpPop()">{{$t('lg.createkeepaliveg')}}</el-button>
      <div v-if="sdGrpData.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
      <table v-else class="sdGrpTable">
        <thead>
          <tr>  
            <th>{{$t('lg.groupid')}}</th>
            <th>{{$t('lg.shadowgroupname')}}</th>
            <th>{{$t('lg.masterNode')}}</th>
            <th>{{$t('lg.nodelist')}}</th>
            <th>{{$t('lg.viplist')}}</th>
            <th>{{$t('lg.vrouterid')}}</th>
            <th>{{$t('lg.yanma')}}</th>
            <th :style="{width:($store.state.isencn=='en'?'240px':'190px')}">{{$t('lg.emailnotify')}}</th>
            <th width="114"></th>
            <th width="70"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sdGrpData" :key="item">
            <td>{{item.groupId}}</td>
            <td>{{item.groupName}}</td>
            <td>{{noPort22(item.masterNode)}} </td>
            <td>
              <table>
                <tr v-for="items in item.backupNodes" :key="items">
                  <td>{{noPort33(items.snodeId)}}</td>
                  <td>{{items.hostName}}</td>
                  <td>{{items.networkCardName}}</td>
                </tr>
              </table>
              <!-- <ul class="sdGrpParamsList">
                <li v-for="items in item.backupNodes">
                  {{items.snodeId}}&nbsp;&nbsp;|&nbsp;&nbsp;{{items.hostName}}&nbsp;&nbsp;|&nbsp;&nbsp;{{items.networkCardName}}
                </li>
              </ul> -->
            </td>
            <td>
              <p v-if="item.virtualIPs.length==0">--</p>
              <ul class="sdGrpParamsList" v-else>
                <li v-for="items in item.virtualIPs" class="sdGrpParamsListli">{{items}}</li>
              </ul>
            </td>
            <td>{{item.routerId}}</td>
            <td>{{item.mask}}</td>
            <td style="min-width:190px">
              <div style="margin-bottom:12px">
                <span>{{item.notifySwitch=='on'?$t('lg.opened'):$t('lg.unopened')}}</span>&nbsp;&nbsp;|&nbsp;&nbsp;<el-button size="mini" @click="emailConf(item)">{{$t('lg.peizhi')}}</el-button><el-button size="mini" :disabled="item.notifySwitch=='off'" @click="offEmail(item)">{{$t('lg.off')}}</el-button>
              </div>
              <div class="mgbb" v-if="item.notifySwitch=='on'">
                <p class="fontg">{{$t('lg.fajiangren')}}：</p>
                <p>{{item.fromEmail}}</p>
              </div>
              <div v-if="item.notifySwitch=='on'">
                <p class="fontg">{{$t('lg.recipient')}}：</p>
                <p class="mgb12" v-html="toHtml(item.toEmails)"></p>
              </div> 
            </td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="humanCtrl(item)"><i class="el-icon-setting"></i>{{$t('lg.humanctrl')}}</a>
            </td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="delSingleSdGrp(item.groupName)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody> 
      </table>
      <div v-show="sdGrpLoading">
        <loading ref="loading"></loading>
      </div>
    <!-- <ro-shadow-group-pop :isShow="sdGrpPopVisible" :isGrpEdit="isEdit" :editGrpObj="editGroup" @updateSdGrpData="getSdGrpData" @sdGrpPopclose="sdGrpPopVisible=false;isEdit=false"></ro-shadow-group-pop> -->
    <ro-shadow-group-pop :isShow="sdGrpPopVisible" :gData="sdGrpData"  @updateSdGrpData="getSdGrpData" @sdGrpPopclose="sdGrpPopVisible=false;"></ro-shadow-group-pop>
  
  <el-dialog width="40%" :title="currentGroupName" :visible.sync="hummanCtrlShow" :close-on-click-modal="false" :before-close="hummanCtrlShowClose">
    <div style="margin-bottom:8px">
      <el-button type="primary" size="mini" :disabled="!currentMasterNode"  @click="offMasterNode">{{$t('lg.offhumanctrl')}}</el-button>
    </div> 
    <div v-if="backupNodesListPop.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
    <table v-else>
        <thead>
          <tr>  
            <th>{{$t('lg.node')}}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,idx) in backupNodesListPop" :key="idx">
            <td>{{item.snodeId.split(":")[0]}} &nbsp; (&nbsp; {{item.hostName}}&nbsp; )</td>
            <td><el-button type="primary" size="mini" :disabled="item.snodeId==currentMasterNode" @click="setMasterNode(item)">{{$t('lg.setmaskter')}}</el-button></td>
          </tr>
        </tbody> 
      </table>
</el-dialog>
<el-dialog width="50%" :title="currentGroupName" :visible.sync="emailConfShow" :close-on-click-modal="false" :before-close="emailConfShowClose">
   <el-form ref="sdGrpfrom" :model="sdGrpfrom" label-width="140px">
   <el-form-item :label="$t('lg.shoujianrenemail')" prop="fromEmail" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
        <el-input style="width:85%" v-model="sdGrpfrom.fromEmail"></el-input>
    </el-form-item>
    <div v-for="(items,n) in sdGrpfrom.tmpsArray" :key="n">
      <el-form-item :label="n>0?'':$t('lg.jieshourenemail')" :prop="'tmpsArray.' + n + '.keyinputId'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
          <el-input style="width:85%" v-model="items.keyinputId"></el-input>&nbsp;&nbsp;<i class="el-icon-plus" @click="addQuery"></i>&nbsp;&nbsp;<i class="el-icon-minus" @click="delTmp(n)"></i>
      </el-form-item>
    </div> 
    <el-form-item>
          <el-button type="primary" @click="saveEmail">{{$t('lg.save')}}</el-button>
    </el-form-item>
   </el-form>
</el-dialog>
<loading ref="loading"></loading>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/gptloading';
import {SERVER_API_URL} from '@/conf/constvar';
import roShadowGroupPop from '@/components/users/ro_shadowGroupPop';
export default{
  components:{
    loading,
    roShadowGroupPop
  },
  created(){
    this.getSdGrpData();
  },
  data(){
    return{
      sdGrpfromRules:{
        
      },
      fromEmail:'',
      sdGrpfrom:{
        fromEmail:'',
        tmpsArray:[
          {
            keyId: '',
            keyinputId:''
          }
        ]
      },
      sdGrpPopVisible:false,
      sdGrpData:[],
      isEdit:false,//代表编辑操作
      editGroup:{},
      sdGrpLoading:false,
      hummanCtrlShow:false,
      backupNodesListPop:[],
      currentGroupName:'',
      currentMasterNode:'',
      currentBackupNodes:[],
      emailConfShow:false,
    }
  },
  methods:{
    noPort22(val){
      if(!val){
        return this.$t('lg.nosettp')
      }else{
        return val.split(":")[0]+" ("+this.$t('lg.enforceselectig')+")";
      }
    },
    saveEmail(){
      var _this=this;
      this.$refs['sdGrpfrom'].validate((valid) => {
        if (valid) {
          this.$refs.loading.showLoading();
          const url = SERVER_API_URL+"pe/shadow/keepalived/group/email/update";
      let backupNodes=[];
      for(let i=0;i<this.currentBackupNodes.length;i++){
        backupNodes.push({
          "backupNode":this.currentBackupNodes[i].snodeId
        })
      }
      let dataI="",toEmails="";
      for(let i=0;i<this.sdGrpfrom.tmpsArray.length;i++){
        dataI=this.sdGrpfrom.tmpsArray[i].keyinputId;
        toEmails+=dataI+",";
      }
      toEmails=toEmails.slice(0,-1);
      let data={
          "backupNodeList": backupNodes,
          "groupName": this.currentGroupName,
          "fromEmail": this.sdGrpfrom.fromEmail,
          "toEmails": toEmails
      };
      axios.post(url,data).then((res)=>{
        if(res.data.responseCode==0){
          this.emailConfShowClose();
          this.getSdGrpData();
          this.$message({
            message: this.$t('lg.success'),
            type: 'success'
          });
          this.$refs.loading.hideLoading();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      })

        }
      });
    },
    addQuery(){
      this.sdGrpfrom.tmpsArray.push({
        keyId: '',
        keyinputId:''
      });
    },
    delTmp(index){
      if(this.sdGrpfrom.tmpsArray.length>1){
        this.sdGrpfrom.tmpsArray.splice(index,1);
      }
    },
    emailConf(item){
     // console.log(item);
      this.sdGrpfrom.fromEmail=item.fromEmail;
      let oriToemails=item.toEmails;
      oriToemails=oriToemails.split(",");
      for(let i=0;i<oriToemails.length;i++){
        if(i==0){
          this.sdGrpfrom.tmpsArray[0].keyinputId=oriToemails[0]
        }else{
          this.sdGrpfrom.tmpsArray.push({
            keyId: '',
            keyinputId:oriToemails[i]
          });
        }   
      }
     // console.log(this.sdGrpfrom.tmpsArray)
      this.currentGroupName=item.groupName;
      this.currentMasterNode=item.masterNode;
      this.currentBackupNodes=item.backupNodes;
      this.emailConfShow=true;
    },
    emailConfShowClose(){
      this.emailConfShow=false;
      this.sdGrpfrom={
        fromEmail:'',
        tmpsArray:[
          {
            keyId: '',
            keyinputId:''
          }
        ]
      };
    },
    offEmail(item){
    //  console.log(item);
      const url = SERVER_API_URL+"pe/shadow/keepalived/group/email/delete";
      let backupNodes=[];
      let backupNodesI;
      for(let i=0;i<item.backupNodes.length;i++){
        backupNodesI=item.backupNodes[i];
        console.log(backupNodesI)
        backupNodes.push({
          "backupNode":backupNodesI.snodeId
        })
      }
      let data={
        "backupNodeList":backupNodes,
        "groupName": item.groupName
      }
      axios.post(url,data).then((res)=>{
        if(res.data.responseCode==0){
         /// this.hummanCtrlShowClose();
          this.getSdGrpData();
          this.$message({
            message: this.$t('lg.success'),
            type: 'success'
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    offMasterNode(){
      this.$refs.loading.showLoading();
      const url = SERVER_API_URL+"pe/shadow/keepalived/group/delmaster/"+this.currentGroupName+"/"+this.currentMasterNode;
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.hummanCtrlShowClose();
          this.getSdGrpData();
          this.$message({
            message: this.$t('lg.success'),
            type: 'success'
          });
          this.$refs.loading.hideLoading();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    setMasterNode(item){
      this.$refs.loading.showLoading();
      const url = SERVER_API_URL+"pe/shadow/keepalived/group/setmaster/"+this.currentGroupName+"/"+item.snodeId;
        axios.post(url).then((res)=>{
          if(res.data.responseCode==0){
            this.hummanCtrlShowClose();
            this.getSdGrpData();
            this.$message({
              message: this.$t('lg.success'),
              type: 'success'
            });
            this.$refs.loading.hideLoading();
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
    },
    hummanCtrlShowClose(){
      this.hummanCtrlShow=false;
    },
    humanCtrl(item){
     // console.log(item);
      this.currentGroupName=item.groupName;
      this.currentMasterNode=item.masterNode;
      this.backupNodesListPop=item.backupNodes;
      this.hummanCtrlShow=true;
    },
    toHtml(value){
      if (!value) return '';
      value = value.toString();
      return value.replace(',', '<br/>');
    },
    getSdGrpData(){//查询所有shadow集群数据
        const url = SERVER_API_URL+"pe/shadow/keepalived/group/list";
        axios.get(url).then((res)=>{
          // console.log(res.data.data.content)
          if(res.data.responseCode==0){
            let resArr = res.data.data.content;
            this.sdGrpData = resArr;
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
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
       this.$refs.loading.showLoading();
        const url = SERVER_API_URL+"pe/shadow/keepalived/group/"+nameVal;
        axios.delete(url).then((res)=>{
          if(res.data.responseCode==0){
            this.getSdGrpData();
            this.$message({
              message: this.$t('lg.success'),
              type: 'success'
            });
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.$refs.loading.hideLoading();
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
    noPort33(val){
      if(!val){
        return this.$t('lg.nodata')
      }else{
        return val.split(":")[0];
      }
    },
  },
  filters:{
    changeToN(value){
      if (!value) return '';
      value = value.toString();
      return value.replace(',', '<br/>');
    },
    offon(value){
      return value=="on"?this.$t('lg.kaiqi'):this.$t('lg.off')
    },
    noPort(val){
      if(!val){
        return this.$t('lg.nodata')
      }else{
        return val.split(":")[0];
      }
    },
    noPort2(val){
      if(!val){
        return this.$t('lg.nosettp')
      }else{
        return val.split(":")[0]+" ("+this.$t('lg.enforceselectig')+")";
      }
    }
  }
}
</script>
<style scoped>
.wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
}
.addSdGrpBtn{
}
.sdGrpTable{
  margin-top: 15px;
}
.sdGrpParamsList{

}
.sdGrpParamsList li{
 border-bottom: 1px dashed #ccc; margin-bottom: 14px; padding-bottom: 12px; line-height: 18px;
}
.sdGrpParamsList li:last-child{border-bottom: none;margin-bottom:0; padding-bottom: 0;}
.sdGrpParamsList li .sp{ display: inline-block; color: #666; background-color:#f1f1f1 ;}
.sdGrpParamsList li p{ color: #666; margin-bottom: 2px;}
.mgb12{ line-height: 20px;}
.noset{ font-size: 12px; color: #888;}
.mgbb{margin-bottom:8px; padding-bottom:6px; border-bottom:1px dashed #ccc}
.fontg{ font-size: 12px; color: #888; margin-bottom: 4px;}
</style>

