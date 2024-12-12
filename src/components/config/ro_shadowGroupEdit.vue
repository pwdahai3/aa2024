<template>
  <div class="sdGrppop-wrapper">
    <el-dialog width="55%" :title="$t('lg.edit')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGrpPopClose">
      <el-form ref="sdGrpfrom" :model="sdGrpfrom" :rules="sdGrpfromRules" :label-width="$store.state.isencn=='en'?'220px':'100px'">
        <el-form-item label="id" prop="id" style="display:none;">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.id"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.groupzuname')" prop="groupName">
          <el-input style="width:65%" v-model.trim="sdGrpfrom.groupName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveGroup">{{$t('lg.save')}}</el-button>
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
    data:{
      type:Object
    },
    updateRenderTree:{
      type:Function
    }
  },
  watch:{
    'isShow' (){
      this.sdGrpfrom.id=this.data.id;
      this.sdGrpfrom.groupName=this.data.groupName;
    }
  },
  data(){
    return{   
      sdGrpfrom:{
        id:'',
        groupName:''
      },
      sdGrpfromRules:{
        groupName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      },
      sdGrpPopLoading:false
    }
  },
  methods:{
    saveGroup(){
      const _this=this;
      this.$refs['sdGrpfrom'].validate((valid) => {
        if(valid){
          let data={
            "groupId":_this.sdGrpfrom.id,
            "groupName":_this.sdGrpfrom.groupName
          }
      const url2=SERVER_API_URL+"pe/shadow/configgroup/update";
      _this.sdGrpPopLoading=true;
      axios.post(url2,data).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
              message: this.$t('lg.success'),
              type: 'success'
            });  
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
        _this.sdGrpPopLoading=false;
      })
       }
    })
    },
    sdGrpPopClose(){
      this.$emit("editclose");//关闭弹框
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
