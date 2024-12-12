<template>
  <div class="sdGrppop-wrapper">
    <el-dialog width="75%" :title="isGrpEdit?sdGrpfrom.groupName:$t('lg.add')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpPopClose">
      
      <el-form ref="sdGrpfrom" :model="sdGrpfrom" :rules="sdGrpfromRules" label-width="170px">
        <el-form-item :label="$t('lg.shadowgroupname')" prop="groupName">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.groupName" :disabled="sdGrpNamedisabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.vrouterid')" prop="routerId">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.routerId"></el-input>
        </el-form-item>
        <!-- <el-form-item label="主节点id" prop="masterNodeId">
          <el-select clearable style="width:50%" v-model="sdGrpfrom.masterNodeId"  @change='haldSelect' :placeholder="$t('lg.select')">
            <template v-for="n in slctNodesdata">
              <el-option :label="n.label" :value="n.key" :disabled="n.disabled"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="主节点keepalived网卡" prop="masterNodeNetcardName">
          <el-select style="width:50%" v-model="sdGrpfrom.masterNodeNetcardName" :placeholder="$t('lg.select')">
              <el-option v-for="(item,idex) in sdGrpfrom.masterNodeNetcards" :key="idex" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="节点列表" prop="backupNodes">
          <el-checkbox-group v-model="sdGrpfrom.backupNodes" @change="checkboxChecked">
            <el-checkbox v-for="item in transfNodesdata" :label="item.label" :disabled="item.disabled"></el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
        <el-form-item :label="$t('lg.nodelist')" prop="checkedmodel">
          <el-checkbox-group v-model="checkedmodel" @change="checkboxChecked">
            <el-checkbox v-for="item in newnodesdata" :key="item" :label="item.label" :disabled="item.disabled"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('lg.networkname')">
          <div class="transferBox">
            <div v-for="(item,index) in sdGrpfrom.secNodesCheced" :key="index" class="mgb14">
              <p class="lh18p">{{item}}</p>
              <el-select style="width:50%" v-model="sdGrpfrom['secNodeNetcardName'+index]" :placeholder="$t('lg.select')">
                <template v-for="(n,idxn) in sdGrpfrom['secNodeNetcards'+index]">
                  <el-option :label="n" :value="n"></el-option>
                </template>
              </el-select>
            </div>
          </div>
        </el-form-item>
      
        <!-- <el-form-item label="从节点" prop="backupNodes">
          <div class="transferBox">
            <el-transfer :titles="[$t('lg.optionalNode'), $t('lg.backupNode')]" v-model="sdGrpfrom.backupNodes" :data="transfNodesdata" @left-check-change='checkTransfer' @change='checkTransfer'></el-transfer>
          </div>
        </el-form-item> -->

        <el-form-item :label="$t('lg.viplist')" prop="virtualIPs">
          <div class="transferBox tagBox">
            <el-tag
              :key="index"
              v-for="(tag,index) in sdGrpfrom.virtualIPs"
              closable
              :disable-transitions="false"
              @close="handleTagClose(index)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleTagInputConfirm"
              @blur="handleTagInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ Add IP</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('lg.emailnotifiyon')">
          <el-switch v-model="notifySwitch"></el-switch>
        </el-form-item>
        <el-form-item :label="$t('lg.shoujianrenemail')" v-if="notifySwitch" prop="fromEmail" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
            <el-input style="width:65%" v-model="sdGrpfrom.fromEmail"></el-input>
        </el-form-item>
        <div v-for="(items,n) in sdGrpfrom.tmpsArray" :key="n" v-if="notifySwitch">
          <el-form-item :label="n>0?'':$t('lg.jieshourenemail')" :prop="'tmpsArray.' + n + '.keyinputId'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
              <el-input style="width:65%" v-model="items.keyinputId"></el-input>&nbsp;&nbsp;<i class="el-icon-plus" @click="addQuery"></i>&nbsp;&nbsp;<i class="el-icon-minus" @click="delTmp(n)"></i>
          </el-form-item>
        </div>
        <el-form-item :label="$t('lg.yanma')" prop="mask">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.mask"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSingleSdGrp">{{$t('lg.save')}}</el-button>
          <el-button @click="sdGrpPopClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      
   
      <div v-show="sdGrpPopLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
export default {
  components:{
    loading,
  },
  props:{
    isShow:{
      type:Boolean
    },
    isGrpEdit:{
      type:Boolean
    },
    editGrpObj:{
      type:Object
    },
    gData:{
      type:Array
    }
  },
  watch:{
    'isShow' (){
      if(this.isShow && !this.isGrpEdit) this.getShadowNodes();
    },
  },
  data(){
    var validatorRange=(min, max) => (rule, value, callback) =>{
        if(value >= min && value <= max) return callback();
        else{
          return callback(new Error(this.$t('lg.plzenter')+`${min}`+this.$t('lg.to')+`${max}`))
        } 
      };
    return{
      queryform:{   
        tmpsArray:[
          {
            keyId: '',
            keyinputId:''
          }
        ]
      },
      toEmails:'',
      fromEmail:'',
      notifySwitch:false,
      checkedmodel:[],
      sdGrpfrom:{
        mask:24,
        fromEmail:'',
        toEmails:'',
        tmpsArray:[
          {
            keyId: '',
            keyinputId:''
          }
        ],
        groupName:'',
        routerId:1,
        masterNodeId:'',
        backupNodes:[],
        virtualIPs:[],
        masterNodeNetcardName:'',
        masterNodeNetcards:[],

        secNodesCheced:[],
        
        secNodeNetcardName0:'',
        secNodeNetcardName1:'',
        secNodeNetcardName2:'',
        secNodeNetcardName3:'',
        secNodeNetcardName4:'',
        secNodeNetcardName5:'',
        secNodeNetcardName6:'',
        secNodeNetcardName7:'',
        secNodeNetcardName8:'',
        secNodeNetcardName9:'',
        secNodeNetcardName10:'',
        secNodeNetcardName11:'',
        secNodeNetcardName12:'',
        secNodeNetcardName13:'',
        secNodeNetcardName14:'',
        secNodeNetcardName15:'',
        secNodeNetcardName16:'',
        secNodeNetcardName17:'',
        secNodeNetcardName18:'',
        secNodeNetcardName19:'',
        secNodeNetcards0:[],
        secNodeNetcards1:[],
        secNodeNetcards2:[],
        secNodeNetcards3:[],
        secNodeNetcards4:[],
        secNodeNetcards5:[],
        secNodeNetcards6:[],
        secNodeNetcards7:[],
        secNodeNetcards8:[],
        secNodeNetcards9:[],
        secNodeNetcards10:[],
        secNodeNetcards11:[],
        secNodeNetcards12:[],
        secNodeNetcards13:[],
        secNodeNetcards14:[],
        secNodeNetcards15:[],
        secNodeNetcards16:[],
        secNodeNetcards17:[],
        secNodeNetcards18:[],
        secNodeNetcards19:[],

      },
      nodesdata:[],
      slctNodesdata:[],
      transfNodesdata:[],
      newnodesdata:[],
      inputVisible: false,
      inputValue: '',

      sdGrpfromRules:{
        
        groupName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        routerId:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {validator: validatorRange(1,255), trigger: 'blur'}
        ],
        masterNodeId:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        masterNodeNetcardName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        backupNodes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        mask:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        // virtualIPs:[
        //   {required:true, message:this.$t('lg.required'), trigger:'blur'},
        // ]
      },

      sdGrpPopLoading:false,

      sdGrpNamedisabled:false,//编辑群组时，群组名字不可修改 
    }
  },
  methods:{
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
    sdGrpPopClose(){
      this.$refs['sdGrpfrom'].resetFields();//清空
      // this.sdGrpfrom={
      //   tmpsArray:[
      //     {
      //       keyId: '',
      //       keyinputId:''
      //     }
      //   ]
      // };
      this.transfNodesdata=[];//清空Transfer左侧列表元素，不清空的话回记录上次的选中状态
      this.sdGrpfrom.masterNodeNetcards=[];
      this.sdGrpfrom.secNodesCheced=[];
      this.checkedmodel=[];
      this.$emit("sdGrpPopclose");//关闭弹框
      let _this=this;
      for(let i=0;i<10;i++){
        _this.sdGrpfrom["secNodeNetcardName"+i]="";
        _this.sdGrpfrom["secNodeNetcards"+i]=[];
      }
    },
    ar_shadow_isurlinrray(urlToCheck, urlArray) {
        if (urlArray.indexOf(urlToCheck) > -1) {
        return true;
        } else {
          return false;
        }
    },
    getShadowNodes(){
      const _this=this;
      let dataFromGdata=[];
      for(let i=0;i<this.gData.length;i++){
        let gdataI=this.gData[i];
        let gdataIBck=gdataI.backupNodes;
        if(gdataIBck){
          let gdataIBckJ,snodeIdNoPort;
          for(let j=0;j<gdataIBck.length;j++){
            gdataIBckJ=gdataIBck[j];
            snodeIdNoPort=gdataIBckJ.snodeId;
            dataFromGdata.push(snodeIdNoPort)
          }
        }
      }
    //  console.log(dataFromGdata)
      return new Promise((resolve,reject)=>{   
        const url=SERVER_API_URL+"pe/shadow/snode/v1";// 查询当前所有业务节点
        axios.get(url).then((res)=>{
          let nodesdataArr=[];
          if(res.data.responseCode == 0){
            let resdata = res.data.data;
            let snodeIdNoPort;
            resdata.forEach(ele=>{
              snodeIdNoPort=ele.snodeId;
              nodesdataArr.push({
                key: ele.snodeId,
                label: snodeIdNoPort+' ('+ele.hostName+')',
                disabled:_this.ar_shadow_isurlinrray(snodeIdNoPort,dataFromGdata)
              })
            });
            this.newnodesdata=nodesdataArr;
            resolve(nodesdataArr);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err) => {
          console.log(err)
        });
      })
    },
    getShadowNodes2(){
      return new Promise((resolve,reject)=>{
        const _this=this;
        const url=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
        axios.get(url).then((res)=>{
          if(res.data.responseCode == 0){
            const resArr = res.data.data;
            const nodesArr = resArr.filter(item=>{//过滤出 不是集群的节点
              if(!item.isShadowGroup) return item;
            })
            let nodesdataArr =[];
            nodesArr.forEach(ele=>{
              nodesdataArr.push({
                key: ele.snodeId,
                label: ele.snodeId+' ('+ele.hostName+')',
                disabled:false
              })
            })
            _this.nodesdata=nodesdataArr;
            _this.slctNodesdata=JSON.parse(JSON.stringify(nodesdataArr));
            _this.transfNodesdata=JSON.parse(JSON.stringify(nodesdataArr));
            resolve(nodesdataArr);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err) => {
          console.log(err)
        });
      })
    },
    getNetcardFromNode(a,index){
    // console.log(a,index)
      let _this=this;
      if(!a || index>19){return;}
      let url=SERVER_API_URL+"pe/shadow/networkCard/name/"+a;  
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data;
          if(typeof index === 'undefined'){
            _this.sdGrpfrom.masterNodeNetcards=resData;
          }else{
            this.sdGrpfrom["secNodeNetcards"+index]=resData;
            this.sdGrpfrom["secNodeNetcardName"+index]=resData[0];
          }
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
        }
      })
    },
    haldSelect(a){//选择了主节点后，该主节点不能再作为从节点
      const list =JSON.parse(JSON.stringify(this.nodesdata));
      list.forEach((el,index)=>{
        if(el.key===a) el.disabled=true;
      })
      this.transfNodesdata=list;
      this.sdGrpfrom.masterNodeNetcardName="";
       this.sdGrpfrom.masterNodeNetcards=[];  
      this.getNetcardFromNode(a);
    },
    checkboxChecked(a){
      console.log(a)
      let _this=this;
      _this.sdGrpfrom.secNodesCheced=a;
      let list = JSON.parse(JSON.stringify(_this.newnodesdata)); //全部可用的节点
      let itemName="";
      a.forEach((item,idx)=>{
        itemName=item.split("(")[0];
        list.forEach((el,index)=>{
         if(el.label===item) el.disabled=true;
        });
        _this.getNetcardFromNode(itemName,idx);
      });
      this.slctNodesdata=list;
    },
    checkTransfer(a){//Transfer左侧列表元素被用户选中/取消选中时触发 && 右侧列表元素变化时触发  //选择了从节点后，这些从节点不能再作为主节点
      a = [...a, ...this.sdGrpfrom.backupNodes] //不能再作为主节点的项 当前el-transfer左侧选中的项加右侧已经被选中的项
      let list = JSON.parse(JSON.stringify(this.nodesdata)); //全部可用的节点

      a.forEach(item=>{
        list.forEach((el,index)=>{
         if(el.key===item) el.disabled=true;
        })
      })
      this.slctNodesdata=list;
    },
    handleTagClose(i) {
      this.sdGrpfrom.virtualIPs.splice(i, 1);
    },
    showTagInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleTagInputConfirm() {
      let inputValue = this.inputValue;
      const regu =/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;//只能输入ip
      if (regu.test(inputValue)) {
        this.sdGrpfrom.virtualIPs.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },

    saveSingleSdGrp(){//新增保存、编辑保存
      var _this=this;
      this.$refs['sdGrpfrom'].validate((valid) => {
        if (valid) {
          if(_this.checkedmodel.length<2){
            _this.$message.error(this.$t('lg.selectmin2'));
            return;
          }
          _this.sdGrpPopLoading=true;
          const url = SERVER_API_URL+'pe/shadow/keepalived/group';
          let requestMethod='post';
          if(_this.isGrpEdit){ requestMethod='put'} //添加

          let backupNodes0=[],backupNodeList0=[];
          let snodeIdHostname;
          let snodeId0;
          let networkCardName0;
          _this.sdGrpfrom.secNodesCheced.forEach((item,index)=>{
            snodeIdHostname=item.split(" (");
            snodeId0=snodeIdHostname[0];
            networkCardName0=_this.sdGrpfrom['secNodeNetcardName'+index];
            backupNodeList0.push({
              "backupNode": snodeId0,
              "backupNodeNetworkCardName": networkCardName0,
            });
            backupNodes0.push(snodeId0)
          });
          let dataI="",toEmails="";
          for(let i=0;i<_this.sdGrpfrom.tmpsArray.length;i++){
            dataI=_this.sdGrpfrom.tmpsArray[i].keyinputId;
            toEmails+=dataI+",";
          }
          toEmails=toEmails.slice(0,-1);
          axios[requestMethod](url,{
           // backupNodes:_this.sdGrpfrom.backupNodes,
            backupNodeList:backupNodeList0,
            backupNodes:backupNodes0,
            groupName:_this.sdGrpfrom.groupName,
            routerId:_this.sdGrpfrom.routerId,
            mask:_this.sdGrpfrom.mask,
           // masterNode:_this.sdGrpfrom.masterNodeId,
           // masterNodeNetworkCardName:_this.sdGrpfrom.masterNodeNetcardName,
            virtualIPs:_this.sdGrpfrom.virtualIPs,
            notifySwitch: _this.notifySwitch?'on':'off',
            fromEmail: _this.sdGrpfrom.fromEmail,
            toEmails: toEmails
          }).then((res)=>{
            // if(res.data.responseCode==0){
              _this.$emit("updateSdGrpData");
              _this.$emit("updateConfigTree");
              _this.sdGrpPopClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            // }else{
            //   _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            // }
            _this.sdGrpPopLoading=false
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    }
  }
}
</script>

<style>
/* element 样式重写*/
.sdGrppop-wrapper .el-transfer{
  display: flex;
  justify-content: space-between;
}
.sdGrppop-wrapper .el-transfer-panel{
  width: 50%;
}
.sdGrppop-wrapper .el-transfer__buttons{
  padding: 0 20px;
  padding-top: 10%;
}
.sdGrppop-wrapper .el-checkbox__label{
  font-size: 14px;
}
.sdGrppop-wrapper .el-checkbox{
  margin-right: 10px;
}
.sdGrppop-wrapper .el-transfer-panel__item{
  height: auto;
}
.sdGrppop-wrapper .el-transfer-panel__item.el-checkbox .el-checkbox__label{
  padding-left: 20px;
  white-space: normal;
  word-break: break-all;
  overflow: visible;
}
.sdGrppop-wrapper .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label{
  font-size: 14px;
}

.sdGrppop-wrapper .el-tag {
  margin-right: 10px;
}
.sdGrppop-wrapper .button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.sdGrppop-wrapper .input-new-tag {
  width: 90px;
  vertical-align: bottom;
}
/*end*/
.transferBox{
  border: 1px dashed #ccc;
  border-radius: 5px;
  padding: 15px;
}
.tagBox{
  padding: 10px 15px;
}
</style>
