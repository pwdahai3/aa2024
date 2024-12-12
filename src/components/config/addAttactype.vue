
<template>
  <div>
    <el-dialog width="60%" :title="$t('lg.addattacktype')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="attClose">
      <el-form ref="addattfrom" :model="addattfrom" :rules="addattfromRules" label-width="100px">
        <el-form-item :label="$t('lg.attacktype')" prop="attackType">
          <el-input v-model.trim="addattfrom.attackType"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.remark')" prop="remark">
          <el-input v-model.trim="addattfrom.remark"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.score')" prop="score">
          <el-input v-model.trim="addattfrom.score"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addattype">{{$t('lg.add')}}</el-button>
          <el-button @click="attClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="asloading" title="loading..."></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';

export default{
  components:{
    loading
  },
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      asloading:false,
      addattfrom:{
        attackType:'',
        remark:'',
        score:8
      },
      addattfromRules:{
          attackType:[
            {required:true, message:this.$t('lg.required'), trigger:'blur'}
          ],
          score:[
            {required:true, message:this.$t('lg.required'), trigger:'blur'},
           {pattern:/^[0-9]+$/,message: this.$t('lg.number'), trigger: 'change'}
          ]
        }
    }
  },
  methods:{
    attClose(){
      this.$refs['addattfrom'].resetFields();
      this.$emit("addattactypeclose",false);
    },
    addattype(){
      var _this=this;
      _this.$refs['addattfrom'].validate((valid) => {
        if (valid) {
          _this.asloading=true;
          let url=SERVER_API_URL+"waf/attacktype";
          axios.put(url,{
            attackType:_this.addattfrom.attackType,
            remark:_this.addattfrom.remark,
            score:_this.addattfrom.score
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.attClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.$emit("addattdone");
            }else{
              this.$message.error(res.data.data.message);
            }
             _this.asloading=false;
          }).catch((err)=>{
            console.log(err)
          });
        }
      })
    }
  }
}
</script>
<style scoped>
.addSdGrpBtn{
  position: absolute;
  right: 20px;
  top: 50px;
}
.sdGrpTable{
  margin-top: 15px;
}
.sdGrpParamsList li{
  line-height: 20px;
}
</style>

