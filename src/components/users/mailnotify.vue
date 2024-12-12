<!--邮件管理-->
<template>
  <div class="mailnotify-wrapper">
    <div class="mailnotifyBox">
      <p class="maillable"><i class="fa fa-envelope-o"></i> {{$t('lg.emailparams')}}</p>
      <el-form ref="mailParamForm" :model="mailParamForm" :rules="mailParamFormRules" :label-width="$store.state.isencn=='en'?'220px':'100px'">
        <el-form-item :label="$t('lg.senderemail')" prop="smtpUsername">
          <el-input v-model="mailParamForm.smtpUsername" style="width:70%" :disabled="eidtDisabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.password')" prop="smtpPassword">
          <el-input type="password" v-model="mailParamForm.smtpPassword" :disabled="eidtDisabled" show-password></el-input>
        </el-form-item>
        <div v-for="(item,index) in mailParamForm.recipient.defaultRecipient" :key="index">
          <el-form-item :label="index==0?$t('lg.jieshourenemail'):''" :prop="'recipient.defaultRecipient.' + index + '.defaultAdress'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
            <el-input v-model.trim="item.defaultAdress" style="width:70%" :disabled="eidtDisabled"></el-input>
            <span class="cursor-pointer" @click="eidtDisabled?'':addRecipients()" :title="$t('lg.addmorerecipe')"><i class="el-icon-circle-plus-outline"></i></span>
            <span class="cursor-pointer" @click="eidtDisabled?'':delRecipients(index)" :title="$t('lg.deleterecipient')"><i class="el-icon-close"></i></span>
          </el-form-item>
        </div>  
        <el-form-item :label="$t('lg.smtp')" prop="smtpHost">
          <el-input v-model="mailParamForm.smtpHost" :disabled="eidtDisabled"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.port')" prop="smtpPort">
          <el-input v-model="mailParamForm.smtpPort" :disabled="eidtDisabled"></el-input>
        </el-form-item>
        
        <div class="text-right" v-if="eidtDisabled">
          <el-button type="primary" @click="editEmail" size="small"> <span v-if="!noEmaildata">{{$t('lg.edit')}}</span> <span v-else>{{$t('lg.add')}}</span> </el-button>
        </div>
        <div class="text-right" v-else>
          <el-button type="success" @click="saveMailparams" size="small">{{$t('lg.save')}}</el-button>
          <el-button @click="roMailnotify" size="small">{{$t('lg.cancel')}}</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  data(){
    return{
      noEmaildata:false,
      eidtDisabled:true,
      mailid:'',
      mailParamForm:{
        enabled:true,//传入后台值需为true
        smtpHost:'',
        smtpPort:'',
        smtpUsername:'',
        smtpPassword:'',
        recipient:{
          defaultRecipient:[
            {
              defaultAdress:''
            }
          ]
        }
      },
      mailParamFormRules:{
        smtpUsername:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: this.$t('lg.invalidemail'), trigger: 'blur'}
        ],
        smtpPassword:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        smtpHost:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        smtpPort:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
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
        //  {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ]
      },
    }
  },
  created(){
    this.$store.state.contentLoading=true;
    this.roMailnotify();
  },
  methods:{
    roMailnotify(){//获取邮件通知参数
      var url=SERVER_API_URL+"monitoring/mailparam";
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          // this.mailParamForm=res.data.data.mailParam;
          var mailParam=res.data.data.mailParam;
          this.mailid=res.data.data.id;
          this.mailParamForm.smtpHost=mailParam.smtpHost;
          this.mailParamForm.smtpPort=mailParam.smtpPort;
          this.mailParamForm.smtpPassword=mailParam.smtpPassword;
          this.mailParamForm.smtpUsername=mailParam.smtpUsername;

          var defaultRecipientArray = mailParam.recipient.defaultRecipient||[],diskArray=[];
          defaultRecipientArray.forEach(function(v,i){
            diskArray.push({
              defaultAdress:v
            })
          });
          if(diskArray.length==0){//当用户没有填写接收人时
            diskArray=[{
              defaultAdress:''
            }]
          }
          this.mailParamForm.recipient.defaultRecipient=diskArray;

          if(!this.mailParamForm.smtpHost && !this.mailParamForm.smtpPort && !this.mailParamForm.smtpPassword && !this.mailParamForm.smtpUsername && this.mailParamForm.recipient.defaultRecipient.length==0){
            this.noEmaildata=true;
          }else{
            this.noEmaildata=false;
          }

        }else{
          this.$message.error(this.$t('lg.failed')+": "+ res.data.data.message);
        }
        this.$store.state.contentLoading=false;
        this.eidtDisabled=true;
      }).catch((err)=>{
        console.log(err)
      });
    },
    addRecipients(){//增加邮件接收人
      this.mailParamForm.recipient.defaultRecipient.push({
        defaultAdress:''
      })
    },
    delRecipients(index){//删减邮件接收人
      if(this.mailParamForm.recipient.defaultRecipient.length>1){
        this.mailParamForm.recipient.defaultRecipient.splice(index,1);
      }
    },
    editEmail(){
      this.eidtDisabled=false;
    },
    saveMailparams(){//保存
      this.$refs['mailParamForm'].validate((valid)=>{
        if(valid){
          // console.log(this.mailParamForm)
          this.$store.state.contentLoading=true;
          var url=SERVER_API_URL+"monitoring/mailparam";
          var defaultRecipientArray = this.mailParamForm.recipient.defaultRecipient,
              defaultRecipient=[];
              defaultRecipientArray.forEach(function(val,index){
                defaultRecipient.push(val.defaultAdress);
              });
          var dataObj={};
          dataObj.mailParam=JSON.parse(JSON.stringify(this.mailParamForm));//深拷贝
          dataObj.mailParam.recipient.defaultRecipient=defaultRecipient;
          dataObj.id=this.mailid;
          // console.log(dataObj)
          axios.post(url,dataObj).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              this.roMailnotify();
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.eidtDisabled=true;
            }else{
              this.$message.error(this.$t('lg.failed')+": "+ res.data.data.message);
            }
            this.$store.state.contentLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      });
    }
  }
}
</script>
<style scoped>
.mailnotify-wrapper{
  width: 100%;
  height: 100%;
  padding: 8% 22%;
  box-sizing: border-box;
}
.mailnotifyBox{
  box-shadow: 2px 2px 8px #ccc;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 45px;
}
.maillable{
  padding:0 0 20px 20px;
  margin-bottom: 30px;
  font-size: 18px;
  border-bottom: 1px dashed #ccc;
  color: #303133;
}
</style>
