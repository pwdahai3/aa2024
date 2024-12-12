<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="redirectmodalShow" :close-on-click-modal="false" :before-close="redirectmodalClose">
      <el-form :model="redirectmodalform" ref="redirectmodalform" label-width="80px" :rules="redirectmodalformRules">
        <el-form-item :label="$t('lg.url2')" prop="url">
          <el-input v-model.trim="redirectmodalform.url" @change="setRedirectInput($event)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateRedirect('redirectmodalform')">{{$t('lg.save')}}</el-button>
          <el-button @click="redirectmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="redirectmodalLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    }, 
    data:{
      type:String
    },
    redirectmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    }
  },
  data(){
    return{
      redirectmodalLoading:false,
      redirectmodalform:{
        url:this.data
      },
      redirectmodalformRules:{
        url:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      }
    }
  },
  watch:{
    "data":function(){
      this.redirectmodalform.url=this.data;
    } 
  },
  methods:{
    redirectmodalClose(){
      //this.$refs['redirectmodalform'].resetFields();
      this.$emit("setbyredictmodal",false);
    },
    setRedirectInput(v){
      this.$emit('setredirect',v)
    },
    updateRedirect(formname){//  redirect地址编辑
    var _this=this;
      this.$refs[formname].validate((valid) => {
        if(valid){
          // var uri=this.data;
          if(this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/redirect?autoconfig=true";
          }else if(this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/redirect?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/redirect";
          }
          var snodeId=this.shadowObj.snodeId,
              domainName=this.domainObj.domainName,
              port=this.domainObj.port;
              this.redirectmodalLoading=true;
          axios.post(url,{
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            redirect:this.redirectmodalform.url
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.redirectmodalLoading=false;
              this.redirectmodalClose();
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
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
