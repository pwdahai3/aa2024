<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.edit')" :visible.sync="editShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules" label-width="140px">
        <el-form-item :label="$t('lg.username')" prop="lastName">
          <el-input v-model.trim="addform.lastName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.jianquanleixing')" prop="authType">
          <el-select v-model="addform.authType" placeholder="">
            <el-option
              v-for="item in authTypes"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.authpwd')" prop="authPass">
          <el-input v-model.trim="addform.authPass"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.enctype')" prop="encryptType">
          <el-select v-model="addform.encryptType" placeholder="">
            <el-option
              v-for="item in encryptTypes"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.encpwd')" prop="encryptPass">
          <el-input v-model.trim="addform.encryptPass"></el-input>
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
      if(this.ntpData){
        this.srcLastName=String(this.ntpData.lastName);
        this.addform.lastName=this.ntpData.lastName;
        this.addform.authType=this.ntpData.authType;
        this.addform.authPass=this.ntpData.authPass;
        this.addform.encryptType=this.ntpData.encryptType;
        this.addform.encryptPass=this.ntpData.encryptPass;
      }

    }
  },
  data(){
    return{
      authTypes:["MD5","SHA"],
      encryptTypes:["DES","AES"],
      srcLastName:'',
      userloading:false,
      addform:{
        lastName:'',
        authType: '',
        authPass: '',
        encryptType: '',
        encryptPass:''
      },
      addformRules:{
        lastName:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
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
            "srcLastName":this.srcLastName,
            "lastName": this.addform.lastName,
            "authType": this.addform.authType,
            "authPass": this.addform.authPass,
            "encryptType": this.addform.encryptType,
            "encryptPass":this.addform.encryptPass,
            "nodeId":this.shadownode
          }
          let url=SERVER_API_URL+"pe/shadow/snmpConf/update";
          axios.post(url,data).then((res)=>{
            if(res.data.responseCode==0){
              this.$emit("haseditshadow");
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
     // this.$refs['addform'].resetFields();
      this.$emit("eidtclose")
    }
  },
  components:{
    loading
  }
}
</script>
