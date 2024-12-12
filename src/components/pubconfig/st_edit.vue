<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName" :visible.sync="dmEditmodalShow" :close-on-click-modal="false" :before-close="editmodalClose">
      <div class="domainBox">
        <span class="titleSpan">{{$t('lg.editbs')}}</span>
        <el-form :model="editDomainObj" ref="editDomainObj" label-width="80px" :rules="editmodalformRules">
           <el-form-item :label="$t('lg.name')" prop="streamName">
            <el-input v-model.trim="editDomainObj.streamName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.bsport')" prop="streamPort">
            <el-input v-model.trim="editDomainObj.streamPort" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.remark')" prop="remark">
            <el-input v-model.trim="editDomainObj.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.ipversion')">
              <el-checkbox-group v-model="checkList" :min="1">
                    <el-checkbox label="ipv4">IPV4</el-checkbox>
                    <el-checkbox label="ipv6">IPV6</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateDomainName('editDomainObj')">{{$t('lg.yes')}}</el-button>
            <el-button @click="editmodalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <loading :title="$t('lg.handling')" v-show="editmodalLoading"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isAuto:{
      type:Boolean
    }, 
    isEditConfig:{
      type:Boolean
    },
    data:{
      type:Object
    },
    dmEditmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    diplomas:{
      type:Array
    },
    keys:{
      type:Array
    },
  },
  data(){
    return{
      editmodalLoading:false,
      originEditDomainObj:{},
      editDomainObj:{},
      checkList:[],
      editmodalformRules:{
        domainName:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }
          },
          trigger: 'blur'
        }
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message:this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ],
        serverPort:[
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }
          },
          trigger: 'blur'
        }
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ]
      },
      isShowHgSettingBox:false,
    }
  },
  watch:{
    "data":function(){
      this.originEditDomainObj = JSON.parse(JSON.stringify(this.data));//将请求返回的数据克隆到editDomainObj里面
      this.editDomainObj=this.data;
      this.checkList=this.editDomainObj.ipListenConfs.split("|");
    }
  },
  methods:{
    editmodalClose(){
      this.$refs['editDomainObj'].resetFields();
      this.$emit("setbydmEditmodal",false);
      this.isShowHgSettingBox=false;
    },
    gradeSetting(){
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
    },
    updateDomainName(formname){// 业务编辑
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          if(_this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/stream?autoconfig=true";
          }else if(_this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/stream?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/stream";
          }
          var snodeId=_this.shadowObj.snodeId,
              streamPort=_this.originEditDomainObj.streamPort,
              domainName=_this.domainObj.domainName;
              _this.editmodalLoading=true;
          var ip_v46;
          var ipv46=_this.checkList;
          if(ipv46.length==1){
            ip_v46=ipv46[0]
          }else if(ipv46.length==2){
            ip_v46=ipv46[0]+"|"+ipv46[1];
          }
          var dataJson={
                snodeId:snodeId,
                streamName:_this.editDomainObj.streamName,
                streamPort:_this.editDomainObj.streamPort,
                srcStreamPort:streamPort,
                srcStreamName:domainName,
                remark:_this.editDomainObj.remark,
                ipListenConfs:ip_v46
              }
          axios.patch(url,dataJson).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message:_this.$t('lg.success')
              });
              _this.$emit("updateRenderTree");
              _this.editmodalClose();
            }else if(res.data.responseCode==8){
              _this.$message.error(_this.$t('lg.failed')+":"+res.data.data);
            }else{
              _this.$message.error(_this.$t('lg.failed')+":"+res.data.data.message);
            }
            _this.editmodalLoading=false;
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    },
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.domainBox{
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 30px 20px 10px 20px;
  position: relative;
}

/*高级配置*/
.gradeSettingBox{
  margin-bottom: 20px;
}
.gradeSetting{
  cursor: pointer;
}
.gradeSettinginner{
  border: 1px dashed #dcdfe6;
  padding: 20px 20px 1px 0px;
  margin-bottom: 30px;
  position: relative;
  border-radius: 5px;
}
.gradeSettingTxt{
  margin: 20px 0 10px 0;
}
</style>

