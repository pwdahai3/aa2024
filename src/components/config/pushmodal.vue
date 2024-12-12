<template>
  <div>
    <el-dialog width="50%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="pushmodalShow" :close-on-click-modal="false" :before-close="pushmodalResetForm">
      <el-form ref="pushmodalform" :model="pushmodalform" :rules="pushmodalRules"  label-width="125px">
        <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
          <el-select v-model="pushmodalform.shadownodes" :placeholder="$t('lg.xuanzeshadownode')">
            <template v-for="item in data">
              <el-option :label="item.isShadowGroup?item.hostName+'('+$t('lg.group')+')':item.hostName+'('+item.snodeId+')'" :value="item.isShadowGroup?item.hostName+'('+$t('lg.group')+' gId:'+item.groupId+')':item.hostName+'('+item.snodeId+')'"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pushmodalFn('pushmodalform')">{{$t('lg.pushconfig')}}</el-button>
          <!-- <el-button type="primary" @click="pushmodalFn('pushmodalform','pushall')">{{$t('lg.pushcompletely')}}</el-button> -->
          <el-button @click="pushmodalResetForm">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="pushmodalLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    data:{
      type:Array
    },
    pushmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      pushmodalform:{
        shadownodes:this.data
      },
      pushmodalRules:{
        shadownodes:[{required: true, message: this.$t('lg.required'), trigger: 'change'}]
      },
      pushmodalLoading:false
    }
  },
  methods:{
    pushmodalResetForm(){
      this.$refs['pushmodalform'].resetFields();
      this.$emit("setbypushmodal",false)
    },
    pushmodalFn(formname){
      var _this=this;
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.pushmodalLoading=true;
         // var url=SERVER_API_URL+"pe/push";
          var srcId=this.shadowObj.snodeId;
          var srcName=this.shadowObj.name;
          var srcGid=this.shadowObj.groupId;
          var dstId=this.pushmodalform.shadownodes;
          var srcIsGroup=false;
          var dstIsGroup=false;
          var regExp = /\(([^)]+)\)/;
          var matches = regExp.exec(dstId);
          dstId=matches[1];

          if(srcGid){
            srcIsGroup=true;
          }
          if(dstId.indexOf(_this.$t('lg.group'))!=-1){
            dstIsGroup=true;
            dstId=dstId.split(":")[1];
          }
          let postData,postUrl;
          if(srcIsGroup && dstIsGroup){
            postUrl=SERVER_API_URL+"pe/push/group2group";
           // console.log(dstOid);return;
            postData={
              "srcConfigGroupId": srcGid,
              "dstConfigGroupId": dstId
            }
          }else if(!srcIsGroup && dstIsGroup){
            postUrl=SERVER_API_URL+"pe/push/shadow2group";
            postData={
              "srcSnodeId": srcId,
              "dstConfigGroupId":dstId 
            }
          }else if(!srcIsGroup && !dstIsGroup){
            postUrl=SERVER_API_URL+"pe/push";
            postData={
              "srcSnodeId": srcId,
              "dstSnodeId":dstId 
            }
          }else{
            this.$message.error(_this.$t('lg.failed')+': '+_this.$t('lg.peizhizunopushnode'));
            this.pushmodalLoading=false;
            return;
          }

          
          axios.post(postUrl,postData).then((res)=>{
            if(res.data.responseCode=="0"){
              this.$message({
                type: 'success',
                message:  _this.$t('lg.success')
              });
              this.$emit("updateRenderTree");
              this.pushmodalResetForm();
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            this.pushmodalLoading=false;
          }).catch((err)=>{
            console.log(err);
            this.pushmodalLoading=false;
          });
        }
      });
    }
  },
  components:{
    loading
  }
}
</script>
