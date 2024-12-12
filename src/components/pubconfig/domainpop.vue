
<!-- 双击domain节点增加被保护页面 -->
<template>
  <div>
    <el-dialog width="45%" :title="domainObj.domainName" :visible.sync="domainDialogVisible" :close-on-click-modal="false" :before-close="locationResetForm">
      <el-form ref="domainform" :model="domainform" :rules="domainPopRules" label-width="145px">
        <el-form-item :label="$t('lg.matchtype')" prop="locationType">
          <el-select v-model="domainform.locationType" :placeholder="$t('lg.matchtype')" class="farAvtiveUrl" @change="checkMate">
            <el-option :label="$t('lg.exactmatch')" value="accurateMatch"></el-option>
            <el-option :label="$t('lg.suffixmatch')" value="suffixMatch"></el-option>
            <el-option :label="$t('lg.patchmatch')" value="pathMatch"></el-option>
            <el-option :label="$t('lg.dynamicurl')" value="dynamicMatch"></el-option>
            <el-option :label="$t('lg.tongyongpp')" value="/"></el-option>
            <el-option :label="$t('lg.zidingyipz')" value="customMatch"></el-option>
          </el-select>
          <span class="el-icon-document pub_guide" title="$t('lg.matchguide')" @click="dmGuideShow"><i>{{$t('lg.guide')}}</i></span>
          <!-- <el-checkbox v-model="actChecked" v-if="isShowchecked">动态URL</el-checkbox> -->
        </el-form-item>
        <el-form-item :label="$t('lg.protectedpos')" prop="location">
          <el-input v-model.trim="domainform.location" :disabled="domainform.locationType=='/'"></el-input>
        </el-form-item>

        <div class="gradeSettingBox">
          <p class="gradeSettingTxt text-right"><span class="gradeSetting font-blue" @click="gradeSetting()"><i :class="isShowHgSettingBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>{{$t('lg.highconfig')}}</span></p>
          <div v-show="isShowHgSettingBox" class="gradeSettinginner">
            <div class="wafOutBox" >
              <el-form-item :label="$t('lg.wafpassivedefense')" :label-width="gSlableWidth">
                <el-switch v-model="domainform.wafCheck"></el-switch>
                <!-- <a class='addRulesetHref' href="javascript:;" @click="showCheckRuleset"><i v-if="domainform.checkedRulesets.length==0">选择Ruleset</i><i v-else>更改Ruleset</i></a> -->
              </el-form-item>
              <el-form-item :label="$t('lg.selectedruleset')" v-show="domainform.checkedRulesets.length!=0" :label-width="gSlableWidth">
                <div class="wafBox" >
                  <el-checkbox-group v-model="domainform.checkedRulesets">
                    <el-checkbox v-for="item in domainform.checkedRulesets" :label="item" :key="item" disabled>{{item}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>
            </div> 
            <el-form-item :label="$t('lg.websocketsupport')" :label-width="gSlableWidth">
              <el-switch v-model="domainform.websocketCheck"></el-switch>
            </el-form-item>

            <!-- <el-form-item label="ntlm长连接" prop="ntlmSwitch" :label-width="gSlableWidth" class="ntlmTipBox">
              <el-switch v-model="domainform.ntlmSwitch" :disabled="ntlmSettingAble"></el-switch>
              <div class="ntlmTip" v-show="ntlmSettingAble">
                <el-popover
                  placement="top-start"
                  title="Tips"
                  width="350"
                  trigger="hover"
                  content="如需开启被保护对象的ntlm长连接功能，请先在对应业务的‘管理服务器 >> 高级配置’里设置其ntlm长连接参数">
                  <span slot="reference"><i class="el-icon-info"></i></span>
                </el-popover>
              </div>
            </el-form-item>

            <el-form-item label="自定义代理后的主机端口" label-width="170px" prop="hostPort">
              <el-input v-model.trim="domainform.hostPort" placeholder="请输入代理后的主机端口" clearable></el-input>
            </el-form-item> -->

            <!-- ProxyPass功能 -->
            <el-form-item label="ProxyPass" :label-width="gSlableWidth">
              <el-switch v-model="isShowProxyPassBox" @click="proxyPassCheck()"></el-switch>
            </el-form-item>
            <div v-if="isShowProxyPassBox" class="orderBoxJamb" style="margin-top:-20px;">
              <el-form-item :label="$t('lg.protocol')" prop="proxyHttp" :label-width="gSlableWidth">
                <el-select v-model="domainform.proxyHttp" style="width:50%">
                    <template>
                      <el-option label="http" value="http"></el-option>
                      <el-option label="https" value="https"></el-option>
                    </template>
                  </el-select>
              </el-form-item>
              <el-form-item :label="$t('lg.customizeproxypass')" prop="proxyPass" :label-width="gSlableWidth">
                <el-input v-model.trim="domainform.proxyPass" placeholder="/proxypass" :disabled="domainform.locationType=='suffixMatch'"></el-input>
              </el-form-item>
              <el-form-item :label="$t('lg.zidingyiups')" prop="proxyUpstream" :label-width="gSlableWidth">
                <el-select v-model="domainform.proxyUpstream" :placeholder="$t('lg.select')" @visible-change="getUpstream($event)" :loading="getUpstreamLoading" style="width:50%">
                  <el-option 
                    v-for="item in upstreamOptArr"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <span>（请确保设置了自定义的Upstream）</span> -->
              </el-form-item>
            </div>
            <el-form-item :label="$t('lg.jujuefw')" :label-width="gSlableWidth">
              <el-switch v-model="domainform.accessDenied"></el-switch>
            </el-form-item>
            <el-form-item label="蜜罐" :label-width="gSlableWidth">
              <el-switch v-model="domainform.accessDenied9"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('lg.wangzhanml')" prop="locationRoot" :label-width="gSlableWidth">
              <el-input v-model.trim="domainform.locationRoot" placeholder="/root"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          <el-button type="primary" @click="addLocation('domainform')">{{$t('lg.add')}}</el-button>
          <el-button @click="locationResetForm()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="locationLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>

    <el-dialog width="40%" :title="$t('lg.selectruleset')" :visible.sync="isCheckRulesetShow" :close-on-click-modal="false" :before-close="checkRulesetClose">
      <el-form ref="rulesetform" :model="rulesetform" label-width="100px">
        <el-form-item :label="$t('lg.gourules')">
          <el-checkbox-group v-model="rulesetform.ruleset">
            <el-checkbox v-for="item in $store.state.allRulesetData" :label="item.fileName" :key="item.id">{{item.fileName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="checkRulesetEnsure">{{$t('lg.yes')}}</el-button>
        <el-button @click="checkRulesetClose">{{$t('lg.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog width="60%" :title="$t('lg.matchguide')" :visible.sync="isdmGuideShow" :before-close="dmGuideClose"><!--匹配方式说明指南-->
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.exactmatch')}}
          </template>
          <div>
            <p>1、{{$t('lg.mguide1')}}。</p>
            <p>2、{{$t('lg.mguide2')}}。</p>
            <p>3、{{$t('lg.eg')}}：<img class="guidePic" src="static/domain_guide/jq-sl.jpg" alt=""></p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.suffixmatch')}} 
          </template>
          <div>
            <p>1、{{$t('lg.mguide3')}}。</p>
            <p>2、{{$t('lg.mguide4')}}。</p>
            <p>3、{{$t('lg.eg')}}：<img class="guidePic" src="static/domain_guide/hz-sl.jpg" alt=""></p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.patchmatch')}} 
          </template>
          <div>
            <p>1、{{$t('lg.mguide5')}}</p>
            <p>2、{{$t('lg.mguide6')}}。</p>
            <p>3、{{$t('lg.eg')}}：<img class="guidePic" src="static/domain_guide/lj-sl.jpg" alt=""></p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp;  {{$t('lg.dynamicurl')}} 
          </template>
          <div>
            <p>1、{{$t('lg.mguide7')}}</p>
            <p>2、{{$t('lg.mguide8')}}。</p>
            <p>3、{{$t('lg.eg')}}：<img class="guidePic" src="static/domain_guide/dt-sl.jpg" alt=""></p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="primary" style="margin-top:40px" @click="isdmGuideShow=false">{{$t('lg.yes')}}</el-button>
    </el-dialog>    
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import * as types from '@/store/types';
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    },
    domainDialogVisible:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    }
  },
  data(){
    var checkLocation = (rule,value,callback)=>{
          if(!value){
            callback(new Error(this.$t('lg.required')));
          }
          if(value=="deny_url"){
            callback(new Error(this.$t('lg.denyurl1')));
          }else{
            if(!(/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/.test(value))){
              callback(new Error(this.$t('lg.invalidformat')));
            }
            callback();
          }
        };
    return{
      // actChecked:false,
      // isShowchecked:false,
      isdmGuideShow:false,
      locationLoading:false,

      isShowProxyPassBox:false,

      domainform:{
        locationType:'',
        location:'',
        wafCheck:false,
        checkedRulesets:[],
        websocketCheck:false,
        proxyHttp:'http',
        proxyPass:'',
        proxyUpstream:'',
        locationRoot:'',
        accessDenied:false,
        accessDenied9:false
        // ntlmSwitch:false,
        // hostPort:'',
      },
      upstreamOptArr:[],
      domainPopRules:{
        locationType:[ 
          { required: true, message: this.$t('lg.required'), trigger: 'change' }
        ],
        location:[
         // {validator: checkLocation, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        proxyPass:[
          {pattern:/^\/([^\u4e00-\u9fa5\s])*$/, message: this.$t('lg.reg1'), trigger: 'blur'} //必须以"/"为首字母
        ],
        locationRoot:[
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },

      gSlableWidth:'125px',

      getUpstreamLoading:false,

      isCheckRulesetShow:false,
      rulesetform:{
        ruleset:[]
      },
      
      isShowHgSettingBox:false,
      // ntlmSettingAble:false,
    }
  },
  methods:{
    locationResetForm() {
      this.domainform.checkedRulesets=[];
      this.rulesetform.ruleset=[];
      this.domainform.wafCheck=false;
      this.domainform.websocketCheck=false;
      this.domainform.accessDenied=false;
      this.$refs['domainform'].resetFields();
      this.$emit('setbydomainpopchild',false);
      this.isShowHgSettingBox = false;
    },
    checkMate(v){
      // var _this = this;
      // if(v=='pathMatch'){
      //     _this.isShowchecked = true;
      //     _this.actChecked=false; 
      // }else{
      //     _this.isShowchecked = false; 
      //     _this.actChecked=false;
      // }

      v=='/'?this.domainform.location="/":this.domainform.location="";
    },
    dmGuideShow(){
      this.isdmGuideShow=true;
    },
    dmGuideClose(){
      this.isdmGuideShow=false;
    },
    showCheckRuleset(){
      this.$store.commit(types.GETALLRULESET);//查看全部WAF规则集
      this.isCheckRulesetShow=true;
    },
    checkRulesetEnsure(){
      const checkedRs = this.rulesetform.ruleset;
      this.domainform.checkedRulesets = checkedRs;
      this.checkRulesetClose()
    },
    checkRulesetClose(){
      this.rulesetform.ruleset = this.domainform.checkedRulesets;
      this.isCheckRulesetShow=false;
    },
    gradeSetting(){//显示/隐藏高级配置
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
      // if(!this.isShowHgSettingBox){

      //   if(this.isAuto){//查询是否该业务配置了ntlm长连接 ~查询业务的配置信息 
      //     var url=SERVER_API_URL+"pe/shadow/domain?autoconfig=true";
      //   }else if(this.isEditConfig){
      //     var url=SERVER_API_URL+"pe/shadow/domain?savedConfig=true";
      //   }else{
      //     var url=SERVER_API_URL+"pe/shadow/domain";
      //   }

      //   axios.get(url,{
      //     params:{
      //       snodeId:this.shadowObj.snodeId,
      //       domainName:this.domainObj.domainName,
      //       domainPort:this.domainObj.port
      //     }
      //   }).then((res)=>{
      //     // console.log(res);
      //     if(res.data.responseCode==0){
      //       var thisdomainObj = res.data.data.domains;
      //       // this.ntlmSettingAble=!thisdomainObj.enableNTLM;
      //       this.isShowHgSettingBox=true;
      //     }else{
      //       this.$message.error('操作失败: '+ res.data.data.message);
      //     }
      //   }).catch((err)=>{
      //     console.log(err)
      //   });
      // }else{
      //   this.isShowHgSettingBox=false;
      // }
    },
    proxyPassCheck(){//切换proxypass参数框显示
      this.isShowProxyPassBox=!this.isShowProxyPassBox;
    },
    getUpstream(callback){//设置poxypass时获取Upstream
      if(callback){
        this.getUpstreamLoading=true;

        var snodeId=this.shadowObj.snodeId;
        var url='';// 查询当前所有业务节点
        if(this.isAuto){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId;
        }
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resArray = res.data.data?res.data.data:[];
            let upstreamList=[];
            resArray.forEach(ele=>{
              upstreamList.push({
                value:ele.upstream
              })
            })
            this.upstreamOptArr=upstreamList;
          }else{
            this.$message.error('failed: '+ res.data.data.message);
          }
          this.getUpstreamLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    addLocation(formname){//增加被保护的页面
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if (valid) {
          _this.locationLoading=true;
          var snodeId=_this.shadowObj.snodeId,
              domainName=_this.domainObj.domainName,
              port=_this.domainObj.port;
          if(_this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/location?autoconfig=true";
          }else if(_this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/location?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/location";
          }
          
          var locationType=_this.domainform.locationType;
          var location=_this.domainform.location;
          var wafCheck=_this.domainform.wafCheck;
          var wafRuleset=_this.domainform.checkedRulesets;
          var websocketCheck = _this.domainform.websocketCheck;
          var accessDenied = _this.domainform.accessDenied==false?"off":"on";
          var proxyPass = {
                "protocol": _this.domainform.proxyHttp,
                "domain": _this.domainform.proxyUpstream,
                "path": _this.domainform.proxyPass
              }
          var root = _this.domainform.locationRoot;
          // var hostPort = this.domainform.hostPort;
          // var enableNTLM=this.domainform.ntlmSwitch;

          if(locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则
            if(location=="/"){
              location="(.*\\/)+$"              
            }else{
              location="\\.("+location+")$"
            }
          }

          // var obfus;
          if(wafCheck==false){
            wafCheck="off";
          }else{
            wafCheck="on";
          }
          if(websocketCheck==false){
            websocketCheck="off";
          }else{
            websocketCheck="on";
          }
          // if(this.actChecked==false){
          //     obfus="off"
          // }else{
          //     obfus="on"
          // }
          let dataJson={
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            locationType:locationType,
            locationName:location,
            waf:wafCheck,
            wafRuleset:wafRuleset,
            webSocket:websocketCheck,
            accessDenied:accessDenied,
            // proxyPass:proxyPass,
            root:root,
            // obfuscate: obfus,
            // hostPort:hostPort,
            // enableNTLM:enableNTLM
          };
          if(this.isShowProxyPassBox)dataJson.proxyPass=proxyPass;//打开proxyPass开关才送proxyPass参数

          axios.post(url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
              this.$emit("updateRenderTree");
              this.locationResetForm();
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.locationLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.farAvtiveUrl{
  margin-right:10px
}
.addRulesetHref{
  font-size: 12px;
  margin-left: 10px;
  text-decoration:underline;
  color: #409EFF;
}

.gradeSettingBox{
  margin-bottom: 20px;
}
.gradeSetting{
  cursor: pointer;
}
.gradeSettingTxt{
  margin: 20px 0 10px 0;
}
.gradeSettinginner{
  padding:20px 20px 0 20px;
  margin-bottom: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
}

/*ntlm tip*/
/* .ntlmTipBox{
  position: relative;
}
.ntlmTip{
  position: absolute;
  top: 1px;
  left: 60px;
  cursor: pointer;
  color: #F56C6C;
} */

.wafOutBox{
  /* padding-top: 10px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  margin-bottom: 20px; */
}
.wafBox{
  border: 1px solid #dcdfe6;
  padding: 0px 20px;
  border-radius: 5px;
  margin-right: 20px;
}
</style>