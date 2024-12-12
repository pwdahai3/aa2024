<template>
    <div>
    <el-dialog :title="$t('lg.editrecipient')" :visible.sync="isShow2" width="55%" :before-close="closePop">
      <el-form :model="recipientsForm" ref="recipientsForm" label-width="90px" :rules="recipientsFormRules">
        <div v-for="(item,index) in recipientsForm.recipients" :key="index">
          <el-form-item :label="index==0?$t('lg.recipient'):''" :prop="'recipients.' + index + '.recAdress'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
            <el-input v-model.trim="item.recAdress" :placeholder="$t('lg.recipientadd')" style="width:50%"></el-input>
            <span @click="addRecipients()" :title="$t('lg.addrecipient')"><i class="el-icon-circle-plus-outline cursor-pointer"></i></span>
            <span @click="delRecipients(index)" :title="$t('lg.deleterecipient')"><i class="el-icon-close cursor-pointer"></i></span>
          </el-form-item>
        </div>
        <el-form-item :label="$t('lg.emailtitle')" prop="mailSubject">
          <el-input v-model="recipientsForm.mailSubject" :placeholder="$t('lg.emailtitle')" style="width:100%"></el-input>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="addFn()">{{$t('lg.save')}}</el-button>
          <el-button @click="closePop()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>     
      </el-form>  
      <loading v-show="editloading" title="loading..."></loading>
    </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { SERVER_API_URL } from "@/conf/constvar";
import loading from '@/components/loading/loading';
export default {
  components:{
    loading
  },
    props:{
        isShow2:{
            type:Boolean
        },
        data:{
            type:Object
        }
    },
    data(){
        return{
            recipientsForm:{ 
                recipients:[{
                recAdress:''
                }],
                mailSubject:'',
                componentName: "",
                nodeName: "",
                subComponentName: "",
                enableDaemon: false,
                enableNotification: false
            },
            recipientsFormRules:{},
            editloading:false
        }     
    },
    watch: {
        "data":function(){
            var _this=this;
            if(_this.data.params){
                let arr=[];
                _this.recipientsForm.mailSubject=_this.data.params.mailSubject;
                _this.data.params.mailRecipient.forEach((v,i)=>{
                    arr.push({
                        recAdress:v
                    })
                });
                _this.recipientsForm.recipients=arr;
            }
            _this.recipientsForm.componentName=_this.data.componentName;
            _this.recipientsForm.nodeName=_this.data.nodeName;
            _this.recipientsForm.subComponentName=_this.data.subComponentName;
            _this.recipientsForm.enableDaemon=_this.data.enableDaemon;
            _this.recipientsForm.enableNotification=_this.data.enableNotification;
        }
    },
    methods: {
        closePop(){
            this.recipientsForm={ 
                recipients:[{
                recAdress:''
                }],
                mailSubject:''
            };
            this.$emit('setClose',false)
        },
        addRecipients(){
            this.recipientsForm.recipients.push({
                recAdress:''
            })
        },
        delRecipients(index){
            if(this.recipientsForm.recipients.length>1){
                this.recipientsForm.recipients.splice(index,1);
            }
        },
        addFn(){
            let _this=this;
            this.editloading=true;
            let url=SERVER_API_URL+"/monitoring/component";
            let arr=[];
            for(let i=0;i<_this.recipientsForm.recipients.length;i++){
                arr.push(_this.recipientsForm.recipients[i].recAdress)
            }
            let data=[{
                "componentName": _this.recipientsForm.componentName,
                "nodeName": _this.recipientsForm.nodeName,
                "subComponentName": _this.recipientsForm.subComponentName,
                "enableDaemon": _this.recipientsForm.enableDaemon,
                "params" : {
                    "mailRecipient" :arr,
                    "notificationType" : "email",
                    "mailSubject" : _this.recipientsForm.mailSubject
                }
            }];
            axios.post(url,data).then((res)=>{
                if(res.data.responseCode==0){
                    _this.$emit("updateRec")
                     _this.$message({
                        type: 'success',
                        message: _this.$t('lg.success')
                    });
                    _this.recipientsForm={ 
                            recipients:[{
                            recAdress:''
                            }],
                            mailSubject:''
                        };
                    _this.$emit('setClose',false)
                }else{
                    _this.$message.error(_this.$t('lg.failed'));
                }
                this.editloading=false;
            })
        }
    }
}
</script>
