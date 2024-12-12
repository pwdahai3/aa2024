<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="dmEditmodalShow" :close-on-click-modal="false" :before-close="editmodalClose">
      <div class="domainBox">
        <span class="titleSpan">{{$t('lg.editbs')}}</span>
        <el-form :model="editDomainObj" ref="editDomainObj" label-width="136px" :rules="editmodalformRules">
          <el-form-item :label="$t('lg.domainType')">
            <el-select v-model="editDomainObj.domainType" style="width:100%">
              <template>
                <el-option label="web" value="web"></el-option>
                      <el-option label="小程序" value="applet"></el-option>
                      <el-option label="app" value="app"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.httpout')">
            <el-select v-model="editDomainObj.outHttp" style="width:100%">
              <template>
                <el-option label="http" value="http"></el-option>
                <el-option label="https" value="https"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.selectcer')" prop="sslCrt" v-if="editDomainObj.outHttp=='https'">
            <el-select v-model="editDomainObj.sslCrt" :placeholder="$t('lg.selectcer')">
              <template v-for="item in diplomas">
                <el-option :label="item.name" :value="item.name"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.selectsec')" prop="sslKey" v-if="editDomainObj.outHttp=='https'">
            <el-select v-model="editDomainObj.sslKey" :placeholder="$t('lg.selectsec')">
              <template v-for="item in keys">
                <el-option :label="item.name" :value="item.name"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.httpin')">
            <el-select v-model="editDomainObj.serverScheme" style="width:100%">
              <template>
                <el-option label="http" value="http"></el-option>
                <el-option label="https" value="https"></el-option>
              </template>
            </el-select>
          </el-form-item>
           <el-form-item :label="$t('lg.bsdomain')" prop="domainName">
            <el-input v-model.trim="editDomainObj.domainName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.bsport')" prop="domainPort">
            <el-input v-model.trim="editDomainObj.domainPort" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="" style="margin-bottom:0">
            <el-checkbox v-model="http2">http2</el-checkbox>
         </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="proxy_protocol">proxy_protocol</el-checkbox>
         </el-form-item>
          <el-form-item :label="$t('lg.remark')" prop="remark">
            <el-input v-model.trim="editDomainObj.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.ipversion')">
              <el-checkbox-group v-model="checkList" :min="1">
                    <el-checkbox label="ipv4">IPV4</el-checkbox>
                    <el-checkbox label="ipv6">IPV6</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <div class="gradeSettingBox"> <!-- 高级配置 -->
            <p class="gradeSettingTxt text-right"><span class="gradeSetting font-blue" @click="gradeSetting()"><i :class="isShowHgSettingBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>{{$t('lg.gaojipeiz')}}</span></p>
            <div v-show="isShowHgSettingBox" class="gradeSettinginner">
              <el-form-item :label="$t('lg.kaiqixforward')" label-width="190px" prop="enableXFF">
                <el-switch v-model="editDomainObj.enableXFF"></el-switch>
              </el-form-item>
              <el-form-item :label="$t('lg.customport')" prop="serverPort" :label-width="$store.state.isencn=='en'?'280px':'190px'">
                <el-input v-model.trim="editDomainObj.serverPort" auto-complete="off" :placeholder="editDomainObj.serverPort?$t('lg.qingshurport1'):$t('lg.znaweizhujiport')"></el-input>
              </el-form-item>
            </div>
          </div>

          <el-form-item>
            <el-button type="primary" @click="updateDomainName('editDomainObj')">{{$t('lg.save')}}</el-button>
            <el-button @click="editmodalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <loading :title="$t('lg.handling')" v-show="editmodalLoading"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isAuto:{
      type:Boolean
    }, 
    isEditConfig:{
      type:Boolean
    },
    data:{
      type:Object
    },
    dmEditmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    diplomas:{
      type:Array
    },
    keys:{
      type:Array
    },
  },
  data(){
    return{
      editmodalLoading:false,
      editDomainObj:{},
      checkList:[],
      proxy_protocol:false,
      http2:'',
      editmodalformRules:{
        domainName:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {
            validator: this.validatePort,
            trigger: 'blur'
          }
        ],
        sslCrt:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        sslKey:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        serverPort:[
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!value || (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) ) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }
          },
          trigger: 'blur'
        }
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ]
      },
      isShowHgSettingBox:false,
    }
  },
  watch:{
    "data":function(){
      this.editDomainObj = JSON.parse(JSON.stringify(this.data));//将请求返回的数据克隆到editDomainObj里面
      // console.log(this.editDomainObj);
      this.checkList=this.editDomainObj.ipListenConfs.split("|");
      this.proxy_protocol=this.editDomainObj.proxyProtocol?true:false;
      this.http2=this.editDomainObj.http2?true:false;
    },
    // 'editDomainObj.outHttp':function(){
    //   if(this.editDomainObj.outHttp=='https'){
    //     this.editDomainObj.domainPort=443;
    //   }else{
    //     this.editDomainObj.domainPort=80;
    //   }
    // }
  },
  methods:{
    validatePort(rule, value, callback) {
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
        callback(); // 验证通过
      } else {
        callback(new Error(this.$t('lg.qingshuru1') )); // 验证失败
      }
    },
    editmodalClose(){
      this.$refs['editDomainObj'].resetFields();
      this.$emit("setbydmEditmodal",false);
      this.isShowHgSettingBox=false;
    },
    gradeSetting(){
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
    },
    updateDomainName(formname){// 业务编辑
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          if(_this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain?autoconfig=true";
          }else if(_this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain";
          }
          var snodeId=_this.shadowObj.snodeId,
              domainName=_this.domainObj.domainName,
              port=_this.domainObj.port;
              _this.editmodalLoading=true;
          var ip_v46;
          var ipv46=_this.checkList;
          if(ipv46.length==1){
            ip_v46=ipv46[0]
          }else if(ipv46.length==2){
            ip_v46=ipv46[0]+"|"+ipv46[1];
          }
          var dataJson={
                snodeId:snodeId,
                domainName:_this.editDomainObj.domainName,
                domainPort:_this.editDomainObj.domainPort,
                srcDomainName:domainName,
                srcDomainPort:port,
                remark:_this.editDomainObj.remark,
                ssl:'off',
                enableXFF:_this.editDomainObj.enableXFF,
                serverScheme:_this.editDomainObj.serverScheme,
                serverPort:_this.editDomainObj.serverPort,
                ipListenConfs:ip_v46,
                proxyProtocol:_this.proxy_protocol?"proxy_protocol":"",
                http2:_this.http2?"http2":"",
                domainType:_this.editDomainObj.domainType,
              }
          if(_this.editDomainObj.outHttp=="https"){
            dataJson.ssl="on";
            dataJson.crt=_this.editDomainObj.sslCrt;
            dataJson.key=_this.editDomainObj.sslKey;
          }
          axios.patch(url,dataJson).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message:_this.$t('lg.success')
              });
              _this.$emit("updateRenderTree");
              _this.editmodalClose();
            }else if(res.data.responseCode==8){
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data);
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.editmodalLoading=false;
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    },
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.domainBox{
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 30px 20px 10px 20px;
  position: relative;
}

/*高级配置*/
.gradeSettingBox{
  margin-bottom: 20px;
}
.gradeSetting{
  cursor: pointer;
}
.gradeSettinginner{
  border: 1px dashed #dcdfe6;
  padding: 20px 20px 1px 0px;
  margin-bottom: 30px;
  position: relative;
  border-radius: 5px;
}
.gradeSettingTxt{
  margin: 20px 0 10px 0;
}
</style>

