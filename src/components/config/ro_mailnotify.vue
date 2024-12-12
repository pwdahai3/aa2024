<template><!--可删组件-->
  <div>
    <el-dialog width="50%" :title="$t('lg.emailparams')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="rootmailClose">
      <el-form ref="rootmailform" :model="rootmailform" :rules="rootmailformRules" label-width="150px">
        <!-- <p>{{maildata}}</p> -->
        <el-form-item :label="$t('lg.smtp')" prop="smtpHost">
          <el-input v-model="rootmailform.mailParam.smtpHost" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.senderemail')">
          <el-input v-model="rootmailform.mailParam.smtpUsername" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.password')">
          <el-input v-model="rootmailform.mailParam.smtpPassword" auto-complete="off" ></el-input>
        </el-form-item>
        <div v-for="(item,index) in rootmailform.mailParam.recipient.wafRecipient">
          <el-form-item :label="index==0?$t('lg.wafmonitorrecipient'):''" :prop="'mailParam.recipient.wafRecipient.' + index + '.wafAdress'" :rules="[{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: this.$t('lg.invalidemail'), trigger: 'blur'}]">
            <el-input v-model.trim="item.wafAdress" auto-complete="off" style="width:50%"></el-input>
            <span class="addrecipients" @click="addRecipients('waf')" :title="$t('lg.addrecipient')"><i class="el-icon-circle-plus-outline"></i></span>
            <span class="delrecipients" @click="delRecipients('waf',index)" :title="$t('lg.deleterecipient')"><i class="el-icon-close"></i></span>
          </el-form-item>
        </div>
        <div v-for="(item,index) in rootmailform.mailParam.recipient.diskRecipient">
          <el-form-item :label="index==0?$t('lg.diskmonitorrecipient'):''" :prop="'mailParam.recipient.diskRecipient.' + index + '.diskAdress'" :rules="[{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: this.$t('lg.invalidemail'), trigger: 'blur'}]">
            <el-input v-model.trim="item.diskAdress" auto-complete="off" style="width:60%"></el-input>
            <span class="addrecipients" @click="addRecipients('disk')" :title="$t('lg.addrecipient')"><i class="el-icon-circle-plus-outline"></i></span>
            <span class="delrecipients" @click="delRecipients('disk',index)" :title="$t('lg.deleterecipient')"><i class="el-icon-close"></i></span>
          </el-form-item>
        </div>    
        <el-form-item :label="$t('lg.wafmonitorsubject')">
          <el-input v-model="rootmailform.mailParam.subject.wafAlertSubject" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.diskmonitorsubject')">
          <el-input v-model="rootmailform.mailParam.subject.diskAlertSubject" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.onoff')">
          <el-switch v-model="rootmailform.mailParam.enabled"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveMailparams">{{$t('lg.save')}}</el-button>
          <el-button @click="rootmailClose()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="rootmailLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isShow:{
      type:Boolean
    },
    maildata:{
      type:Object
    }
  },
  data(){
    return{
      rootmailform:{
        id:'',
        mailParam:{
          smtpHost:'',
          enabled:'',
          smtpPassword:'',
          smtpUsername:'',
          recipient:{
            diskRecipient:[
              {
                diskAdress:''
              }
            ],
            wafRecipient:[
              {
                wafAdress:''
              }
            ]
          },
          subject:{
            diskAlertSubject:'',
            wafAlertSubject:''
          }
        }
      },
      rootmailformRules:{},
      rootmailLoading:false
    }
  },
  watch:{
    "isShow":function(){
      if(this.maildata){
        this.rootmailform.id=this.maildata.id;
        this.rootmailform.mailParam.smtpHost=this.maildata.mailParam.smtpHost;
        this.rootmailform.mailParam.smtpPassword=this.maildata.mailParam.smtpPassword;
        this.rootmailform.mailParam.smtpUsername=this.maildata.mailParam.smtpUsername;
        var diskRecipientArray = this.maildata.mailParam.recipient.diskRecipient,diskArray=[];
            diskRecipientArray.forEach(function(v,i){
              diskArray.push({
                diskAdress:v
              })
            });
        var wafRecipientArray = this.maildata.mailParam.recipient.wafRecipient,wafArray=[];
            wafRecipientArray.forEach(function(v,i){
              wafArray.push({
                wafAdress:v
              })
            });
        this.rootmailform.mailParam.recipient.wafRecipient=wafArray;
        this.rootmailform.mailParam.recipient.diskRecipient=diskArray;
        this.rootmailform.mailParam.subject.wafAlertSubject=this.maildata.mailParam.subject.wafAlertSubject;
        this.rootmailform.mailParam.subject.diskAlertSubject=this.maildata.mailParam.subject.diskAlertSubject;
      }
    }
  },
  methods:{
    rootmailClose() {
      // this.$refs['rootmailform'].resetFields();
      this.$emit('rootmailclose',false);
    },
    addRecipients(type){
      if(type=='waf'){
        this.rootmailform.mailParam.recipient.wafRecipient.push({
          wafAdress:''
        })
      }else if(type=='disk'){
        this.rootmailform.mailParam.recipient.diskRecipient.push({
          diskAdress:''
        })
      }
    },
    delRecipients(type,index){
      if(type=='waf'){
        if(this.rootmailform.mailParam.recipient.wafRecipient.length>1){
          this.rootmailform.mailParam.recipient.wafRecipient.splice(index,1);
        }
      }else if(type=='disk'){
        if(this.rootmailform.mailParam.recipient.diskRecipient.length>1){
          this.rootmailform.mailParam.recipient.diskRecipient.splice(index,1);
        }
      }
    },
    saveMailparams(){
      var _this=this;
      this.$refs['rootmailform'].validate((valid)=>{
        if(valid){
          this.rootmailLoading=true;
          var url=SERVER_API_URL+"monitoring/mailparam";
          var diskRecipientArray = this.rootmailform.mailParam.recipient.diskRecipient,
              diskRecipient=[],
              wafRecipientArray = this.rootmailform.mailParam.recipient.wafRecipient,
              wafRecipient=[];
          diskRecipientArray.forEach(function(val,index){
            diskRecipient.push(val.diskAdress);
          });
          wafRecipientArray.forEach(function(v,i){
            wafRecipient.push(v.wafAdress);
          });
          // var dataObj=this.rootmailform;
          var dataObj=JSON.parse(JSON.stringify(this.rootmailform));//深拷贝

          dataObj.mailParam.recipient.diskRecipient=diskRecipient;
          dataObj.mailParam.recipient.wafRecipient=wafRecipient;
          axios.post(url,dataObj).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            this.rootmailLoading=false;
          }).catch((err)=>{
            this.$message.error(_this.$t('lg.failed'));
            console.log(err);
          })
        }
      });
    }
  },
  components:{
    loading
  }
}
</script>
