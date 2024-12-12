<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.add')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules" :label-width="$store.state.isencn=='en'?'220px':'140px'">
        <el-form-item :label="$t('lg.node')" prop="nodeId">
          <el-select v-model="addform.nodeId" :placeholder="$t('lg.selectshadownode')" @change="getShadownodeData">
            <el-option
              v-for="item in shadownodes"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.username')" prop="lastName">
          <el-input v-model.trim="addform.lastName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.jianquanleixing')" prop="authType">
          <!-- <el-input v-model.trim="addform.authType"></el-input> -->
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
          <!-- <el-input v-model.trim="addform.encryptType"></el-input> -->
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
    isShow:{
      type:Boolean
    },
    shadownodes:{
      type:Array
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {
      if(!(/^[0-9a-zA-Z!@#$%^&*\.]{8,}$/.test(value))){
        callback(new Error(this.$t('lg.passwordtip')));
      }else{
        callback();
      }
          
    };
    return{
      srcLastName:'',
      userloading:false,
      authTypes:["MD5","SHA"],
      encryptTypes:["DES","AES"],
      addform:{
        nodeId:'',
        lastName:'',
        authType: 'MD5',
        authPass: '',
        encryptType: 'DES',
        encryptPass:''
      },
      addformRules:{
        lastName:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        authType:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        authPass:[ 
          {required:true,validator: validatePass, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        encryptType:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        encryptPass:[ 
          {required:true,validator: validatePass, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        nodeId:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    getShadownodeData(){

    },
    saveNtp(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          this.userloading=true;
          let data={
            "lastName": this.addform.lastName,
            "authType": this.addform.authType,
            "authPass": this.addform.authPass,
            "encryptType": this.addform.encryptType,
            "encryptPass":this.addform.encryptPass,
            "nodeId":this.addform.nodeId
          }
          let url=SERVER_API_URL+"pe/shadow/snmpConf/add";
          axios.put(url,data).then((res)=>{
            if(res.data.responseCode==0){
              this.$emit("addDone");
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
      this.$emit("addclose");
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
</style>
