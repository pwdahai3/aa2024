<template>
  <div>
    <el-dialog width="45%" :title="$t('lg.savefile')" :visible.sync="saveconfmodalShow" :close-on-click-modal="false" :before-close="saveconfResetForm">
      <el-form ref="saveconfform" :model="saveconfform" :rules="saveconfformRules" label-width="100px">
        <el-form-item :label="$t('lg.filename')" prop="name">
          <el-input v-model.trim="saveconfform.name" auto-complete="off" :placeholder="$t('lg.suffixconf')" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveConf('saveconfform')">{{$t('lg.save')}}</el-button>
          <el-button @click="saveconfResetForm()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="saveconfLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
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
    saveconfmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      saveconfform:{
        name:''
      },
      saveconfformRules:{
        name:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/(\.conf)$/,message: this.$t('lg.confsuffix'), trigger: 'blur'},
        ]
      },
      saveconfLoading:false
    }
  },
  methods:{
    saveconfResetForm(){
      this.$refs['saveconfform'].resetFields();
      this.$emit('setbysaveconfmodal',false);
    },
    saveConf(formname){//保存配置文件 snode配置保存到文件
    var _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var confName=this.saveconfform.name;
          this.saveconfLoading=true;
          if(this.isAuto){
            var url=SERVER_API_URL+"pe/file/autoconfig/save?targetFileName="+ confName +'&snodeId='+this.$store.state.autoconfigsnodeid;
          }else{
            var url=SERVER_API_URL+"pe/file/"+this.shadowObj.snodeId+"/"+confName;
          }
          axios.post(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.saveconfLoading=false;
              this.saveconfResetForm();
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          });
        }else {
          console.log("error");
          return false;
        }
      });
    }
  },
  components:{
    loading
  }
}
</script>
