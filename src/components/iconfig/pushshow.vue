<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="60%" title="" :visible.sync="show" :close-on-click-modal="false" :before-close="handleClose">
     <el-form ref="form" :model="form" label-width="80px" :rules="pushRules">
      <el-form-item label="域名" prop="domainName">
        <el-input v-model="form.domainName"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="domainPort">
        <el-input v-model="form.domainPort"></el-input>
      </el-form-item>
      <el-form-item label="节点" prop="snodeId">
        <el-select v-model="form.snodeId" placeholder="请选择节点">
          <template v-for="n in nodesdata">
            <el-option :label="n.isShadowGroup?n.hostName+'(集群)':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="savePush('form')">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
    </el-dialog>
    <loading ref="loadingc"></loading>
  </div>
</template>
<script>
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
export default{
  components:{
    loading
  },
  props:{
    show:{
      type:Boolean
    },
    id:{
        type:Number
    },
    nodesdata:{
      type:Array
    }
  },
  data(){
    return{
      form:{
        domainName:'',
        domainPort:'',
        snodeId:'',     
      },
      pushRules:{
        domainName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        domainPort:[
          { required: true, message: this.$t('lg.required'), trigger: 'blur' },
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
        ],
        snodeId:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      }
    }
  },
  methods:{
    savePush(formname){
      const _this=this;
      _this.$refs[formname].validate((valid) => {
        if (valid) {
          let data={
            domainName:_this.form.domainName,
            domainPort:_this.form.domainPort,
            snodeId:_this.form.snodeId
          };
          console.log(data);
      const url=SERVER_API_URL+"pe/shadow/i-config/push";
      _this.$refs.loadingc.showLoading();
      axios.post(url,data).then((res)=>{
        console.log(res)
        if(res.data.responseCode == 0){
            _this.$message({
              type: "success",
              message: this.$t('lg.success')
            });
          
            _this.handleClose();
          _this.$refs.loadingc.hideLoading();
          }else{
            this.$message.error(this.$t('lg.failed')+": " + res.data.data.message);
          }
      })

      }})
    },
    handleClose() {
      this.$emit("pushClose", false);
    },
    handleClick(){

    }, 
  },
  filters: {

  }
}
</script>
<style scoped>

</style>

