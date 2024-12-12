<template>
  <div class="sdGrppop-wrapper">
    <el-dialog width="55%" :title="isGrpEdit?sdGrpfrom.groupName:'shadow Group Add'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpPopClose">
      
      <el-form ref="sdGrpfrom" :model="sdGrpfrom" :rules="sdGrpfromRules" label-width="100px">
        <el-form-item label="集群名" prop="groupName">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.groupName" :disabled="sdGrpNamedisabled"></el-input>
        </el-form-item>
        <el-form-item label="虚拟路由id" prop="routerId">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.routerId"></el-input>
        </el-form-item>
        <el-form-item label="主节点" prop="masterNodeId">
          <el-select clearable style="width:50%" v-model="sdGrpfrom.masterNodeId"  @change='haldSelect' :placeholder="$t('lg.select')">
            <template v-for="n in slctNodesdata">
              <el-option :label="n.label" :value="n.key" :disabled="n.disabled"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="网卡名" prop="masterNodeNetcardName">
          <el-select style="width:50%" v-model="sdGrpfrom.masterNodeNetcardName" :placeholder="$t('lg.select')">
              <el-option v-for="(item,idex) in sdGrpfrom.masterNodeNetcards" :key="idex" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="从节点" prop="backupNodes">
          <el-checkbox-group v-model="sdGrpfrom.backupNodes" @change="checkboxChecked">
            <el-checkbox v-for="item in transfNodesdata" :label="item.label" :disabled="item.disabled"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="网卡名">
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

        <el-form-item :label="$t('lg.virtualIP')" prop="virtualIPs">
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
    }
  },
  watch:{
    'isShow' (){
      if(this.isShow && !this.isGrpEdit) this.getShadowNodes();
    },
    'isGrpEdit' (){
      if(this.isGrpEdit && this.editGrpObj.groupName){
        this.sdGrpNamedisabled=true;//集群名不可修改 
        this.getShadowNodes().then((resolvedata)=>{// 异步 getShadowNodes请求返回的只有剩下没被设置成群组的节点,但是编辑的时候,当前被编辑的群组里面的节点也要作为可选项
          const editGroupItem = this.editGrpObj;
          this.sdGrpfrom.groupName=editGroupItem.groupName;
          this.sdGrpfrom.routerId=editGroupItem.routerId;
          this.sdGrpfrom.masterNodeId=editGroupItem.masterNode.snodeId;
          this.sdGrpfrom.masterNodeNetcardName=editGroupItem.masterNode.networkCardName;
          this.sdGrpfrom.virtualIPs=editGroupItem.virtualIPs;

          this.getNetcardFromNode(editGroupItem.masterNode.snodeId);

          const masterNodeVal=editGroupItem.masterNode;
          this.slctNodesdata.push({
            key:masterNodeVal.snodeId,
            label:masterNodeVal.snodeId +' ('+masterNodeVal.hostName+')',
            disabled:false
          })
          this.transfNodesdata.push({
            key:masterNodeVal.snodeId,
            label:masterNodeVal.snodeId +' ('+masterNodeVal.hostName+')',
            disabled:true
          })
          this.nodesdata.push({
            key:masterNodeVal.snodeId,
            label:masterNodeVal.snodeId +' ('+masterNodeVal.hostName+')',
            disabled:false
          })

          const backupNodesArr = editGroupItem.backupNodes;
          let sdGrpfromBackupNodesArr = [];
          backupNodesArr.forEach(ele=>{
            sdGrpfromBackupNodesArr.push(ele.snodeId);//获取transfer 的v-model 固定格式：[a,b,c]

            let backupNodesObj = {};
            backupNodesObj.key=ele.snodeId;
            backupNodesObj.label=ele.snodeId +' ('+ele.hostName+')';
            backupNodesObj.disabled=false;

            let backupNodesObj2 = {};
            backupNodesObj2.key=ele.snodeId;
            backupNodesObj2.label=ele.snodeId +' ('+ele.hostName+')';
            backupNodesObj2.disabled=true;

            this.slctNodesdata.push(backupNodesObj2);
            this.transfNodesdata.push(backupNodesObj);
            this.nodesdata.push(backupNodesObj);
          })
          this.sdGrpfrom.backupNodes=sdGrpfromBackupNodesArr;
        });
      }else{
        this.sdGrpNamedisabled=false;
      }
    }
  },
  data(){
    var validatorRange=(min, max) => (rule, value, callback) =>{
        if(value >= min && value <= max) return callback();
        else{
          return callback(new Error(`请输入${min}到${max}的数字`))
        } 
      };
    return{
      
      sdGrpfrom:{
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
        // virtualIPs:[
        //   {required:true, message:this.$t('lg.required'), trigger:'blur'},
        // ]
      },

      sdGrpPopLoading:false,

      sdGrpNamedisabled:false,//编辑群组时，群组名字不可修改
    }
  },
  methods:{
    sdGrpPopClose(){
      this.$refs['sdGrpfrom'].resetFields();//清空
      this.transfNodesdata=[];//清空Transfer左侧列表元素，不清空的话回记录上次的选中状态
      this.sdGrpfrom.masterNodeNetcards=[];
      this.sdGrpfrom.secNodesCheced=[];
      this.$emit("sdGrpPopclose");//关闭弹框
      let _this=this;
      for(let i=0;i<10;i++){
        _this.sdGrpfrom["secNodeNetcardName"+i]="";
        _this.sdGrpfrom["secNodeNetcards"+i]=[];
      }
    },
    getShadowNodes(){
      return new Promise((resolve,reject)=>{
        const _this=this;
        const url=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
        axios.get(url).then((res)=>{
          // console.log(res);
          if(res.data.responseCode == 0){
            const resArr = res.data.data;
            const nodesArr = resArr.filter(item=>{//过滤出 不是集群的节点
              if(!item.isShadowGroup) return item;
            })
            // console.log(nodesArr)
            let nodesdataArr =[];
            nodesArr.forEach(ele=>{
              nodesdataArr.push({
                key: ele.snodeId,
                label: ele.snodeId+' ('+ele.hostName+')',
                disabled:false
              })
            })
            // console.log(nodesdataArr)
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
      let _this=this;
      _this.sdGrpfrom.secNodesCheced=a;
      let list = JSON.parse(JSON.stringify(_this.nodesdata)); //全部可用的节点
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
          _this.sdGrpPopLoading=true;
          const url = SERVER_API_URL+'/pe/shadow/group';
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
          axios[requestMethod](url,{
           // backupNodes:_this.sdGrpfrom.backupNodes,
            backupNodeList:backupNodeList0,
            backupNodes:backupNodes0,
            groupName:_this.sdGrpfrom.groupName,
            routerId:_this.sdGrpfrom.routerId,
            masterNode:_this.sdGrpfrom.masterNodeId,
            masterNodeNetworkCardName:_this.sdGrpfrom.masterNodeNetcardName,
            virtualIPs:_this.sdGrpfrom.virtualIPs,
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
