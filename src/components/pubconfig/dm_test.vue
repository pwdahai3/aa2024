<template>
  <div>
    <el-dialog width="40%" title="appdemo.underriver.cn:80" :visible.sync="dmTestmodalShow" :close-on-click-modal="false" :before-close="editmodalClose">
      <div class="domainBox">
        <span class="titleSpan">APP环境感知功能</span>
        <el-form :model="editDomainObj" ref="editDomainObj" label-width="80px" :rules="editmodalformRules">
          <!-- <el-form-item :label="$t('lg.httpout')">
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
          </el-form-item> -->
          
          <el-form-item label="采集选项">
              <el-checkbox-group v-model="checkList">
                    <el-checkbox label="模拟器设备">模拟器设备</el-checkbox>
                    <el-checkbox label="黑客工具设备">黑客工具设备</el-checkbox>
                    <el-checkbox label="虚拟定位检测">虚拟定位检测</el-checkbox>
                    <el-checkbox label="虚拟相机检测">虚拟相机检测</el-checkbox>
                    <el-checkbox label="面具检测">面具检测</el-checkbox>
                    <el-checkbox label="调用栈检测">调用栈检测</el-checkbox>
                    <el-checkbox label="手机屏幕方向">手机屏幕方向</el-checkbox>
                    <el-checkbox label="设备名称">设备名称</el-checkbox>
                    <el-checkbox label="设备厂商">设备厂商</el-checkbox>
                    <el-checkbox label="手机电池电量">手机电池电量</el-checkbox>
                    <el-checkbox label="充电状态">充电状态</el-checkbox>
                    <el-checkbox label="GPS位置">GPS位置</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="editDomainObj.enableXFF"></el-switch>
          </el-form-item>
          <!-- <div class="gradeSettingBox"> 
            <p class="gradeSettingTxt text-right"><span class="gradeSetting font-blue" @click="gradeSetting()"><i :class="isShowHgSettingBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>高级配置</span></p>
            <div v-show="isShowHgSettingBox" class="gradeSettinginner">
              <el-form-item label="开启x-forwarded-for功能" label-width="190px" prop="enableXFF">
                <el-switch v-model="editDomainObj.enableXFF"></el-switch>
              </el-form-item>
              <el-form-item :label="$t('lg.customport')" prop="serverPort" label-width="190px">
                <el-input v-model.trim="editDomainObj.serverPort" auto-complete="off" :placeholder="editDomainObj.serverPort?'请输入代理后的主机端口':'暂未设代理后的主机端口'"></el-input>
              </el-form-item>
            </div>
          </div> -->

          <el-form-item>
            <el-button type="primary" @click="updateDomainName('editDomainObj')">{{$t('lg.yes')}}</el-button>
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
    dmTestmodalShow:{
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
      editmodalformRules:{
        domainName:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message:this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ],
        sslCrt:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        sslKey:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        serverPort:[
          {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
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
                ipListenConfs:ip_v46
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

