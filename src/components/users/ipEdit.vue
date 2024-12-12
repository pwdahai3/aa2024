<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.editipconfig')" :visible.sync="isIpShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules" label-width="100px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model.trim="addform.ip"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.yanma')" prop="networkPrefix">
          <el-input v-model.trim="addform.networkPrefix"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.port')" prop="port">
          <el-input v-model.trim="addform.port"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.protocol')" prop="protocol">
          <el-select v-model="addform.protocolValue" :placeholder="$t('lg.select')" >
            <el-option 
            v-for="item in addform.protocolOptions"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.xingwei')" prop="type">
          <el-select v-model="addform.typeValue" :placeholder="$t('lg.select')" >
            <el-option 
            v-for="item in addform.typeOptions"
            :key="item"
            :label="item"
            :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="update('addform')">{{$t('lg.update')}}</el-button>
          <el-button @click="resetForm()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="addloading" :title="$t('lg.loading2')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
export default{
  props:{
    isIpShow:{
      type:Boolean
    },
    ipData:{
      type:Object
    }
  },
  watch:{
    "isIpShow":function(){
      this.originData=JSON.parse(JSON.stringify(this.ipData));
      this.addform.id=this.ipData.id;
      this.addform.ip=this.ipData.ip;
      this.addform.networkPrefix=this.ipData.networkPrefix;
      this.addform.port=this.ipData.port;
      this.addform.protocolValue=this.ipData.protocol;
      this.addform.typeValue=this.ipData.type
    }
  },
  data(){
    return{
      originData:{},
      addloading:false,
      addform:{
        id:'',
        ip:'',
        networkPrefix:'',
        port:'',
        protocolOptions: ['tcp','udp'],
        protocolValue: 'tcp',
        typeOptions:['accept','drop','reject'],
        typeValue:'accept'
      },
      addformRules:{
        ip:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        networkPrefix:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        ],
        port:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    update(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          var ip=this.addform.ip,
              id=this.addform.id,
              networkPrefix=this.addform.networkPrefix,
              port=this.addform.port,
              protocolValue=this.addform.protocolValue,
              typeValue=this.addform.typeValue;
          var url=SERVER_API_URL+"pe/shadow/firewallip/update";
          this.addloading=true;
          axios.put(url,{
            "id":id,
            "oldIp": this.originData.ip,
            "oldNetworkPrefix": this.originData.networkPrefix,
            "oldPort": this.originData.port,
            "oldProtocol": this.originData.protocol,
            "oldType": this.originData.type,
            "ip":ip,
            "networkPrefix":networkPrefix,
            "port":port,
            "protocol":protocolValue,
            "type":typeValue
          }).then((res)=>{
            // console.log(res)
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
            this.addloading=false;
          }).catch((err)=>{
            this.$message.error(err.data);
            this.addloading=false;
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
