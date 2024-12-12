<!--域名分配管理-->
<template>
  <div>
    <el-dialog width="55%" :title="$t('lg.domaindistrmang')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="resetForm">
      <div class="tips">
        <p>{{$t('lg.zhu81')}}</p>
      </div>
      <div class="orderBoxJamb">
        <el-form ref="permitDomainform" :model="permitDomainform" :rules="permitDomainformRules" label-width="60px">
          <el-form-item :label="$t('lg.domain')" prop="domains">
            <el-input type="textarea" :autosize="{ minRows: 4 }" v-model.trim="permitDomainform.domains" style="width:60%;margin-right:10px"></el-input>
            <el-button type="primary" size="mini" @click="addPermitDomain('permitDomainform')">{{$t('lg.add')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <p class="nodata-box" v-if="permitDomainData.length==0">{{$t('lg.nodata')}}</p>
        <div v-if="permitDomainData.length>0" class="permitDomainBox">
          <table>
            <thead>
              <tr>
                <th>{{$t('lg.serialnumber')}}</th>
                <th>{{$t('lg.kemandoamin')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in permitDomainData" :key="index">
                <td>{{index+1}}</td>
                <td>{{item}}</td>
                <td class="text-center">
                  <!-- <a href="javascript:;" class="edit-del-a" @click="editWhiteIp(item,index)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
                  <a href="javascript:;" class="edit-del-a" @click="delPermitDomain(item,index)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <loading v-show="permitDomainloading" :title="$t('lg.loading2')"></loading>
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
    },
    currentUser:{
      type:String
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {
        // console.log(value)
        if (value === '') {
          callback(new Error(this.$t('lg.required')));
        } else {
          const valArr = value.split(',')
          for(var i=0;i<valArr.length;i++){
            const valStr = valArr[i].replace(/^\s*|\s*$/g,"");//去除两侧空格
            if(valStr && !(/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/.test(valStr))){
              callback(new Error(this.$t('lg.inpufuheguifdomain')));
              break;
            }
          }
          callback();
        }
      };
    return{
      // 增加允许操作域名
      permitDomainform:{
        domains:'',
      },
      permitDomainformRules:{
        domains:[ 
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
          { validator: validatePass, trigger: 'blur' },
        ]
      },

      // 允许操作域名数据
      permitDomainData:[],
      addFlag:false,//是否第一次新增

      permitDomainloading:false,
    }
  },
  methods:{
    getDistributeDomainData(userName){//获取用户可管理域名
      return new Promise((resolve,reject)=>{
        const url=SERVER_API_URL+'pe/shadow/user/accessdomain/'+userName;
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            let resData = [];
            if(res.data.data){
              resData = res.data.data.domains;
              this.addFlag = false;
            }else{
              this.addFlag = true;
            }
            this.permitDomainData=resData;
            resolve(resData);
          }
        })
      })
    },
    addPermitDomain(formname){
      this.$refs[formname].validate((valid)=>{
        if(valid){
          var userName=this.currentUser,
              domainArr=[];
          const permitDomain=this.permitDomainform.domains;
          domainArr=permitDomain.split(',')
         
          const url=SERVER_API_URL+"pe/shadow/user/accessdomain";
          const requestMethod=this.addFlag?'post':'patch';
          this.permitDomainloading=true;
          axios[requestMethod](url,[{
            userName:userName,
            domains:domainArr,
          }]).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.$refs['permitDomainform'].resetFields();
              this.getDistributeDomainData(userName);
            }else{
              this.$message.error(this.$t('lg.failed'));
            }
            this.permitDomainloading=false;
          }).catch((err)=>{
            this.$message.error(err.data);
            this.permitDomainloading=false;
          });
        }
      })
    },
    delPermitDomain(item){
      console.log(item)
      const userName=this.currentUser;
      const url=SERVER_API_URL+"pe/shadow/user/accessdomain/"+userName+"?domainList="+item;
      axios.delete(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.getDistributeDomainData(userName);
        }
      })
    },
    resetForm(){
      this.$refs['permitDomainform'].resetFields();
      this.$emit("distributeDomainClose")
    }
  },
  components:{
    loading
  }
}
</script>

<style scoped>
.permitDomainBox{
  max-height: 370px;
  overflow-y: auto;
}
</style>

