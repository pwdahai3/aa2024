<template><!-- 新增or修改黑名单指纹 -->
  <div>
    <el-dialog width="40%" :title="$t('lg.addblacklist')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="bwclose">

      <el-form ref="bwpopform" :model="bwpopform" :rules="bwpopformRules" label-width="90px">

        <div style="position: relative;">
          <div class="orderBoxJamb" v-for="(item,index) in bwpopform.tokenList" :key="index">
            <span class="delTk" @click="delToken(index)" v-show="isAddTk"><i class="el-icon-close"></i></span>
            <el-form-item :label="$t('lg.shifoubeifugai')">
              <el-switch v-model="item.keep"></el-switch>
            </el-form-item>  
            <el-form-item label="TOKEN" :prop="'tokenList.' + index + '.token'" :rules="bwpopformRules.token">
              <el-input type="text" v-model.trim="item.token"></el-input>
            </el-form-item>
          </div>
          <span class="addTk" @click="addToken" :title="$t('lg.addmoreinternalbs')" v-show="isAddTk"><i class="el-icon-circle-plus-outline"></i></span>
        </div>
        
        <!-- <el-form-item label="NODES" prop="nodes">
          <el-select v-model="bwpopform.nodes" multiple :placeholder="$t('lg.select')" @visible-change="getNodes($event)" @change="selectAll" style="width:100%" :loading="getNodesLoading">
            <el-option
              v-for="item in nodesdata"
              :key="item.snodeId"
              :label="item.isShadowGroup?item.hostName+'(集群)':item.hostName+'('+item.snodeId+')'"
              :value="item.snodeId">
            </el-option>
          </el-select>
        </el-form-item> -->
        
        <el-form-item>
          <el-button type="primary" @click="addBlackTk('bwpopform')">{{isAddTk?$t('lg.add'):$t('lg.save')}}</el-button>
          <el-button @click="bwclose()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="locationLoading" title="loading..."></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isShow:{
      type:Boolean
    },
    isAddTk:{
      type:Boolean
    },
    // editTkItem:{
    //   type:Object
    // }
  },
  data(){
    return{
      locationLoading:false,
      bwpopform:{
        tokenList:[
          {
            token:'',
            keep:false,
          }
        ],
        // nodes:[],
      },
      nodesdata:[],
      getNodesLoading:false,
      oldOptions :[{}],
      bwpopformRules:{
        token:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {min: 32, max: 32, message: this.$t('lg.changdu32'), trigger: 'blur' },
          {pattern:/^([0-9|a-f|A-F]*)$/,message: this.$t('lg.tokenzuhegeshi'), trigger: 'change'},//十六进制0-9，a-f,A-F
        ],
        // nodes:[{required:true, message:'不能为空', trigger:'blur'}]
      },
    }
  },
  // watch:{
  //   'isShow':function(){
  //     if(this.isShow && !this.isAddTk){
  //       this.bwpopform.tokenList=[
  //         {
  //           token:this.editTkItem.token,
  //           keep:this.editTkItem.keep=='Y'?true:false,
  //         }
  //       ]
  //     }
  //   }
  // },
  methods:{
    delToken(index){
      if(this.bwpopform.tokenList.length==1){
        return;
      }
      this.bwpopform.tokenList.splice(index,1);
    },
    addToken(){
      this.bwpopform.tokenList.push({
        token:'',
        keep:false,
      })
    },
   // getNodes(callback){
    //   if(callback){
    //     this.getNodesLoading=true;
    //     var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
    //     axios.get(nodesurl).then((res)=>{
    //       if(res.data.responseCode==0){
    //         const resArray = res.data.data;
    //         resArray.unshift({
    //           hostName:"所有选项",
    //           snodeId:"allOptions"
    //         })
    //         this.nodesdata=resArray;
    //       }else{
    //         this.$message.error('操作失败: '+ res.data.data.message);
    //       }
    //       this.getNodesLoading=false;
    //     }).catch((err)=>{
    //       console.log(err)
    //     });
    //   }
   // },
   // selectAll(val){ //选取多个节点功能
    //   // console.log(val)
    //   const _this = this;
    //   let allValues = [];
    //   //保留所有值
    //   for (let item of _this.nodesdata) {
    //     allValues.push(item.snodeId)
    //   }

    //   // 用来储存上一次的值，可以进行对比
    //   const oldVal = _this.oldOptions.length === 1 ?[]: _this.oldOptions[1];

    //   // 若是全部选择
    //   if (val.includes('allOptions')){
    //     _this.bwpopform.nodes = allValues;
    //   } 

    //   // 取消全部选中  上次有 当前没有 表示取消全选
    //   if (oldVal.includes('allOptions') && !val.includes('allOptions')) {
    //     _this.bwpopform.nodes = [];
    //   }

    //   // 点击非全部选中  需要排除全部选中 以及 当前点击的选项 
    //   // 新老数据都有全部选中 
    //   if (oldVal.includes('allOptions') && val.includes('allOptions')) {
    //     const index = val.indexOf('allOptions')
    //     val.splice(index, 1) // 排除全选选项
    //     _this.bwpopform.nodes = val
    //   }

    //   //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
    //   if (!oldVal.includes('allOptions') && !val.includes('allOptions')) {
    //     if (val.length === allValues.length - 1){
    //       _this.bwpopform.nodes = ['allOptions'].concat(val)
    //     } 
    //   }

    //   //储存当前最后的结果 作为下次的老数据 
    //   _this.oldOptions[1] = _this.bwpopform.nodes;
   // },
    bwclose() {
      this.$refs['bwpopform'].resetFields();
      this.bwpopform.tokenList=[{
        token:'',
        keep:false,
      }];
      this.$emit('bwclose',false);
    },
    addBlackTk(formname){//加入黑名单
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/token/blacklist";
      // var tokenArray=[]; // snodeIds=[]
      const tokenArray=_this.bwpopform.tokenList;
      // if(_this.bwpopform.nodes.includes('allOptions')){//去掉 所有选项 
      //   _this.bwpopform.nodes.shift();
      // }
      // _this.bwpopform.nodes.map((item)=>{
      //   snodeIds.push({
      //     snodeId:item
      //   });
      // });
      var tokenBlacklistList=[];
      tokenArray.forEach(ele=>{
        tokenBlacklistList.push(
          {
            token:ele.token,
            "source": ["ui"],
            keep:ele.keep?'N':'Y'
          }
        )
      })
      // console.log(tokenBlacklistList);
      _this.$refs[formname].validate((valid)=>{
        if(valid){
          _this.locationLoading=true;
          // let requestMethod='post';
          // if(!_this.isAddTk){requestMethod='patch'} //修改
          axios.post(url,{
            tokenBlacklistList:tokenBlacklistList
          }).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$emit("getBwlist");
              _this.bwclose();
            }else{
              const msgList = res.data.data;
              const msgStr = _this.handleMsg(msgList);
              _this.$message.error(this.$t('lg.failed')+": "+msgStr);
            }
            _this.locationLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      });
    },
    handleMsg(arr){//处理返回的错误提示信息
      let msgStr='';
      arr.forEach(ele=>{
        for(let key in ele){
          msgStr+=key+':'+ele[key].data.message+';'
        }
      })
      // console.log(msgStr)
      return msgStr
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.addTk{
  display: block;
  position: absolute;
  right: 3px;
  bottom: -25px;
  cursor: pointer;
  z-index: 1;
}
.delTk{
  position: absolute;
  right: 3px;
  top: 2px;
  cursor: pointer;
}
</style>

