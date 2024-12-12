<template>
  <div class="sdGrppop-wrapper">
    <el-dialog width="55%" :title="isGrpEdit?sdGrpfrom.groupName:'shadow Group Add'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpPopClose">
      <el-form ref="sdGrpfrom" :model="sdGrpfrom" :rules="sdGrpfromRules" :label-width="$store.state.isencn=='en'?'222px':'100px'">
        <el-form-item :label="$t('lg.groupzuname')" prop="groupName">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.groupName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.node')" prop="nodesckdata">
          <el-checkbox-group v-model="nodesckdata">
            <el-checkbox v-for="item in nodesdata" :key="item.snodeId" :label="item.snodeId"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGroup">{{$t('lg.save')}}</el-button>
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
    updateRenderTree:{
      type:Function
    }
  },
  watch:{
    'isShow' (){
      if(this.isShow && !this.isGrpEdit) this.getShadowNodes();
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
        routerId:1
      },
      nodesckdata:[],
      nodesdata:[],
      sdGrpfromRules:{
        groupName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      },
      sdGrpPopLoading:false
    }
  },
  methods:{
    addGroup(){
      const _this=this;
      this.$refs['sdGrpfrom'].validate((valid) => {
        if(valid){
      const url2=SERVER_API_URL+"pe/shadow/configgroup/add/check";
      let nodesArr=[];
      for(let i=0;i<_this.nodesckdata.length;i++){
        nodesArr.push({
          "shadowId":_this.nodesckdata[i]
        })
      }
      axios.post(url2,{"configGroupDetailList":nodesArr}).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data;
          if(resData.length==0){
             _this.addGroupconfig();
          }else{
            _this.$confirm(_this.$t('lg.shifouclearallconfig'), this.$t('lg.tips'), {
              confirmButtonText: this.$t('lg.yes'),
              cancelButtonText: this.$t('lg.cancel'),
              type: 'warning'
            }).then(() => {
              _this.addGroupconfig();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('lg.canceled')
              });          
            });
          }
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
      })
       }
    })
    },
    addGroupconfig(){
      const _this=this;
          const url=SERVER_API_URL+"pe/shadow/configgroup/add";
          let nodesArr=[];
          for(let i=0;i<_this.nodesckdata.length;i++){
            nodesArr.push({
              "shadowId":_this.nodesckdata[i]
            })
          }
          let data={
            "groupName":_this.sdGrpfrom.groupName,
            "configGroupDetailList":nodesArr
          }
          _this.sdGrpPopLoading=true;
          axios.post(url,data).then((res)=>{
            if(res.data.responseCode==0){
              _this.sdGrpPopClose();
              this.updateRenderTree(true);
              _this.$emit("updateSdGrpData");
              _this.sdGrpPopLoading=false;
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed'));
            }
          })
     
    },
    sdGrpPopClose(){
      this.$refs['sdGrpfrom'].resetFields();//清空
      this.nodesckdata=[];
      this.$emit("sdGrpPopclose");//关闭弹框
    },
    getShadowNodes(){
      return new Promise((resolve,reject)=>{
        const _this=this;
        const url=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
        axios.get(url).then((res)=>{
         //  console.log(res);
          if(res.data.responseCode == 0){
            let resArr = res.data.data;
            resArr=resArr.filter((item)=>{
              return !item.isShadowGroup
            })
            _this.nodesdata=resArr;
            resolve(resArr);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err) => {
          console.log(err)
        });
      })
    },
    isGroupconfig(){
      return new Promise((resolve,reject)=>{
        const _this=this;
        const url=SERVER_API_URL+"pe/shadow/configgroup/add/check";
        axios.get(url).then((res)=>{
          // console.log(res);
          if(res.data.responseCode == 0){
            const resArr = res.data.data;
            _this.nodesdata=resArr;
            resolve(resArr);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err) => {
          console.log(err)
        });
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
