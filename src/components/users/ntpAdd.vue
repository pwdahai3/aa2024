<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.add')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules" label-width="140px">
        <el-form-item :label="$t('lg.timeserverip')" prop="server">
          <el-input v-model.trim="addform.server"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.type')" prop="type">
          <el-select v-model="addform.type" :placeholder="$t('lg.select')" >
            <el-option 
            v-for="item in addform.typeOptions"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNtp('addform')">{{$t('lg.add')}}</el-button>
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
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      userloading:false,
      addform:{
        server:'',
        typeOptions: ['prefer','iburst'],
        type: 'prefer',
      },
      addformRules:{
        server:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    addNtp(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          var server=this.addform.server,
              type = this.addform.type;
          var url=SERVER_API_URL+"pe/shadow/ntpConf/add";
          let jsonData={newServer:server,
            newType:type
            };
          this.userloading=true;
          axios.put(url,jsonData).then((res)=>{
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
      this.$emit("addclose")
    }
  },
  components:{
    loading
  }
}
</script>
