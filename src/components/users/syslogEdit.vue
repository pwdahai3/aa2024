<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.edit')" :visible.sync="editShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules" label-width="140px">
        <el-form-item :label="$t('lg.serverip')" prop="server">
          <el-input v-model.trim="addform.server"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveNtp('addform')">{{$t('lg.save')}}</el-button>
          <el-button @click="resetForm()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="userloading" :title="$t('lg.loading2')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
let Base64 = require('js-base64').Base64;
export default{
  props:{
    editShow:{
      type:Boolean
    },
    ntpData:{
      type:Object
    },
    shadownode:{
      type:String
    }
  },
  watch:{
    "editShow":function(){
        this.addform.server=this.ntpData.server;
    }
  },
  data(){
    return{
      userloading:false,
      addform:{
        server:''
      },
      addformRules:{
        server:[ 
        //  {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    saveNtp(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          this.userloading=true;
          let data={
            "server": this.addform.server
          }
          let url=SERVER_API_URL+"pe/shadow/syslogConf/post/"+this.shadownode;
          axios.post(url,data).then((res)=>{
            if(res.data.responseCode==0){
              this.$emit("hasadduser");
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.resetForm();
            }else{
              this.$message.error(this.$t('lg.failed'));
            }
            this.userloading=false;
          }).catch((err)=>{
            this.$message.error(err.data);
            this.userloading=false;
          });
        }
      })
    },
    resetForm(){
      this.$refs['addform'].resetFields();
      this.$emit("eidtclose")
    }
  },
  components:{
    loading
  }
}
</script>
