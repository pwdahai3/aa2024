<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.edit')" :visible.sync="editShow" :close-on-click-modal="false" :before-close="resetForm">
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
    allData:{
      type:Array
    },
    editindex:{
      type:Number
    },
    shadownode:{
      type:String
    }
  },
  watch:{
    "editShow":function(){
        this.addform.server=this.ntpData.server;
        this.addform.type=this.ntpData.type;
        this.editOriginData0=JSON.stringify(this.allData);
    }
  },
  data(){
    return{
      userloading:false,
      addform:{
        server:'',
        typeOptions: ['prefer','iburst'],
        type: '',
      },
      editOriginData0:'',
      editOriginData1:'',
      addformRules:{
        server:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    saveNtp(formname){
     // console.log(JSON.parse(this.editOriginData0) );return;
      this.$refs[formname].validate((valid)=>{
        if(valid){
          let arr0=JSON.parse(this.editOriginData0);
          let arr1=[];
          let server0,type0;
          arr0.forEach((item)=>{
            server0=item.server;
            type0=item.type;
            arr1.push(
              {
               newServer:server0,
               newType:type0, 
               oldServer:server0,
               oldType:type0
              }
            )
          })


         // this.editOriginData1=JSON.parse(this.editOriginData0);
         this.editOriginData1=arr1;
          var server=this.addform.server,
              type = this.addform.type;
          var url=SERVER_API_URL+"pe/shadow/ntpConf/post/"+this.shadownode;
          this.editOriginData1[this.editindex]={
            newServer:server,
            newType:type,
            oldServer:this.editOriginData1[this.editindex]['oldServer'],
            oldType:this.editOriginData1[this.editindex]['oldType']
            };
         // console.log(this.editOriginData1);return;

          this.userloading=true;
          axios.post(url,this.editOriginData1).then((res)=>{
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
      this.$refs['addform'].resetFields();
      this.$emit("eidtclose")
    }
  },
  components:{
    loading
  }
}
</script>
