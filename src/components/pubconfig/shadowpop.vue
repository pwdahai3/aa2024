<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="72%" :title="shadowObj.snodeId+' ['+shadowObj.name+']'" :visible.sync="shadowDialogVisible" :close-on-click-modal="false" :before-close="handleShadowClose">
      <el-row>
        <el-col :span="12">
          <div class="grid-content" style="margin-right:30px">
            <el-form :model="shadowform" :rules="shadowPopRules" ref="shadowform" label-width="140px">
              <div class="outBorder">
                <span class="titleSpan">{{$t('lg.externalserviceconf')}}</span>
                <el-form-item :label="$t('lg.domainType')">
                  <el-select v-model="shadowform.domainType" style="width:100%" :disabled="domainDisable">
                    <template>
                      <el-option label="web" value="web"></el-option>
                      <el-option label="小程序" value="applet"></el-option>
                      <el-option label="app" value="app"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('lg.httpout')">
                  <el-select v-model="shadowform.http" style="width:100%" :disabled="domainDisable">
                    <template>
                      <el-option label="http" value="http"></el-option>
                      <el-option label="https" value="https"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('lg.bsdomain')" prop="domain">
                  <el-input v-model.trim="shadowform.domain" :disabled="domainDisable"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.bsport')" prop="domainPort">
                  <el-input v-model.trim="shadowform.domainPort" :disabled="domainDisable"></el-input>
                </el-form-item>
                <el-form-item label="" style="margin-bottom:0">
                  <el-checkbox v-model="shadowform.http2">http2</el-checkbox>
                </el-form-item>
                <el-form-item label="">
                  <el-checkbox v-model="shadowform.proxy_protocol">proxy_protocol</el-checkbox>
                </el-form-item>
                <el-form-item :label="$t('lg.remark')" prop="remark">
                  <el-input v-model.trim="shadowform.remark" :disabled="domainDisable" :placeholder="$t('lg.remark')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.selectcer')" prop="diplomas" v-if="shadowform.http=='https'">
                  <el-select v-model="shadowform.diplomas" :placeholder="$t('lg.selectcer')" :disabled="domainDisable">
                    <template v-for="item in diplomas">
                      <el-option :label="item.name" :value="item.name"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('lg.selectsec')" prop="keys" v-if="shadowform.http=='https'">
                  <el-select v-model="shadowform.keys" :placeholder="$t('lg.selectsec')" :disabled="domainDisable">
                    <template v-for="item in keys">
                      <el-option :label="item.name" :value="item.name"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-checkbox-group v-model="shadowform.checkList" :min="1"  :disabled="domainDisable">
                    <el-checkbox label="ipv4">IPV4</el-checkbox>
                    <el-checkbox label="ipv6">IPV6</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

              </div>

              <div class="outBorder">
                <span class="titleSpan">{{$t('lg.internalserviceconf')}}</span>

                <el-form-item :label="$t('lg.httpin')" :label-width="ipLabelWidth">
                  <el-select v-model="shadowform.innerHttp" style="width:100%" :disabled="domainDisable">
                    <template>
                      <el-option label="http" value="http"></el-option>
                      <el-option label="https" value="https"></el-option>
                    </template>
                  </el-select>
                </el-form-item>

                <div style="position: relative;">
                  <div class="inBorder" v-for='(item,index) in shadowform.configArray' :key="index">    
                    <span class="delIp" @click="delDomainBox(index)"><i class="el-icon-close"></i></span>  
                    <el-form-item label="IP" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ip'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}, {pattern:/^([\w\-. *!$@?^()<>{}[\]=%&:\;/~+#`,])+$/, message: $t('lg.invalidformat'), trigger: 'blur'}]"><!--既能输域名又能输IP //不能输入中文、单双引号及少部分特殊字符 有空格-->
                      <el-input v-model.trim="item.ip"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.port')" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ipPort'" 
                    :rules="[
                        { required: true, message: $t('lg.required'), trigger: 'blur' },
                        {
                          validator: validatePort,
                          trigger: 'blur'
                        }
                      ]">
                      <el-input v-model.trim="item.ipPort"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.weights')" :label-width="ipLabelWidth" v-if="checkedTactics=='ip_weight'" :prop="'configArray.' + index + '.ipWeight'" :rules="[{required: true, message:$t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
                      <el-input v-model.trim="item.ipWeight"></el-input>
                    </el-form-item>
                  </div>
                  <span class="addIp" @click="addDomainBox" :title="$t('lg.addmoreinternalbs')"><i class="el-icon-circle-plus-outline"></i></span>
                </div>

                <!-- 负载均衡策略 -->
                <el-form-item :label="$t('lg.balancestrategy')" :label-width="isencn=='en'?'200px':'130px'">
                  <el-radio-group v-model="checkedTactics" :disabled="domainDisable">
                    <el-radio v-for="item in ipTactics" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <!-- 服务器健康管理 -->
                <div class="serverCheckBox">
                  <el-form-item :label="$t('lg.serverhealth')" :label-width="isencn=='en'?'200px':'130px'">
                    <el-switch v-model="isShowServerCheckBox" @click="serverCheck()" :disabled="domainDisable"></el-switch>
                  </el-form-item>
                  <div v-if="isShowServerCheckBox" class="serverCheckinner">

                    <el-form-item :label="$t('lg.checkinterval')" label-width="90px" prop="scInterval">
                      <el-row>
                        <el-col :span="14">
                          <el-input v-model.trim="shadowform.scInterval" auto-complete="off" :placeholder="$t('lg.plzenter')" :disabled="domainDisable" style="width:98%"></el-input>
                        </el-col>
                        <el-col :span="10">
                          <el-select v-model="scIntervalUnitVal" :placeholder="$t('lg.select')" :disabled="domainDisable">
                            <template v-for="item in scTimeIntervalUnit">
                              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </template>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item :label="$t('lg.serverstopcounts')" label-width="145px" prop="scFall">
                      <el-input v-model.trim="shadowform.scFall" :placeholder="$t('lg.plzenter')" :disabled="domainDisable"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.serverstartcounts')" label-width="145px" prop="scRise">
                      <el-input v-model.trim="shadowform.scRise" :placeholder="$t('lg.plzenter')" :disabled="domainDisable"></el-input>
                    </el-form-item>

                    <el-form-item :label="$t('lg.timeoutset')" label-width="120px" prop="scTimeout">
                      <el-row>
                        <el-col :span="14">
                          <el-input v-model.trim="shadowform.scTimeout" :placeholder="$t('lg.plzenter')" :disabled="domainDisable" style="width:98%"></el-input>
                        </el-col>
                        <el-col :span="10">
                          <el-select v-model="scTimeoutUnitVal" :placeholder="$t('lg.select')" :disabled="domainDisable">
                            <template v-for="item in scTimeIntervalUnit">
                              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </template>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item :label="$t('lg.protocolused')" label-width="145px" prop="scTypeUnit">
                      <el-select v-model="shadowform.scType" :placeholder="$t('lg.select')" style="width:60%" :disabled="domainDisable">
                        <template v-for="item in scTypeUnit">
                          <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>

                    <el-form-item :label="$t('lg.httpcheck')" label-width="145px" v-if="shadowform.scType=='http'" prop="checkHttpSendTxt">
                      <el-input :placeholder="$t('lg.plzenter')" v-model="shadowform.checkHttpSendTxt" :disabled="domainDisable">
                        <el-select v-model="shadowform.checkHttpSendType" slot="prepend" :placeholder="$t('lg.select')" style="width:90px" :disabled="domainDisable">
                          <template v-for="item in ckHtpSendUnit">
                            <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                        </el-select>
                      </el-input>
                    </el-form-item>

                    <el-form-item :label="$t('lg.httpcheckexptected')" label-width="175px" v-if="shadowform.scType=='http'" prop="checkHttpExpectAlive">
                      <el-select v-model="shadowform.checkHttpExpectAlive" :placeholder="$t('lg.select')" style="width:60%" :disabled="domainDisable" multiple>
                        <template v-for="item in ckHtpExpAliveUnit">
                          <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </template>
                      </el-select>
                    </el-form-item>

                  </div>
                </div>
               
                <!-- 高级配置 -->
                <div class="gradeSettingBox">
                  <p class="gradeSettingTxt text-right"><span class="cursor-pointer font-blue" @click="gradeSetting()"><i :class="isShowHgSettingBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>{{$t('lg.highconfig')}}</span></p>
                  <div v-show="isShowHgSettingBox" class="gradeSettinginner">
                    <el-form-item :label="$t('lg.kaiqixforward')" :label-width="$store.state.isencn=='en'?'220px':'190px'" prop="enableXff">
                      <el-switch v-model="shadowform.enableXff" :disabled="domainDisable"></el-switch>
                    </el-form-item>
                    <el-form-item :label="$t('lg.customport')" label-width="180px" prop="hostPort" class="labelme">
                      <el-input v-model.trim="shadowform.hostPort" :placeholder="$t('lg.plzenter')" :disabled="domainDisable"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.ntlmlong')" :label-width="$store.state.isencn=='en'?'170px':'110px'" prop="ntlmValue">
                      <el-input v-model.trim="shadowform.ntlmValue" :placeholder="$t('lg.inputnumber')" :disabled="domainDisable"></el-input>
                    </el-form-item>
                  </div>
                </div>
                
              </div>   

              <el-form-item>
                <el-button type="primary" @click="addDomainCmd('shadowform')">{{$t('lg.addbs')}}</el-button>
                <el-button @click="handleShadowClose">{{$t('lg.cancel')}}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <div v-if="domainCmdData.length>0">
              <h2 class="domaincmd-title">{{shadowform.http}}://{{shadowform.domain}}:{{shadowform.domainPort}} &nbsp;({{shadowform.remark}} ) &nbsp;[ {{shadowform.checkList[0]}}<span v-if="shadowform.checkList[1]"> | {{shadowform.checkList[1]}}</span> ]</h2>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>IP</th>
                      <th>PORT</th>
                      <th v-if="isShowWeight">{{$t('lg.weights')}}</th>
                      <th width="44"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in domainCmdData">
                      <!-- <td>{{item.server.split(":")[0]}}</td>
                      <td>{{item.server.split(":")[1]}}</td> -->
                      <td>{{item.ip}}</td>
                      <td>{{item.ipPort}}</td>
                      <td v-if="isShowWeight">{{item.ipWeight}}</td>
                      <td class="text-center font-red fsize-12 cursor-pointer" @click="deleCmd(item)">{{$t('lg.delete')}}</td>
                    </tr>
                  </tbody>
                </table>
                <p class="loadBaTypeTxt">{{$t('lg.curloadbalance')}}：<i class="el-icon-success font-green"></i> {{loadBalancingTypeTxt}}</p>
                <div class="margin-tb text-right"><el-button type="primary" @click="submitDomainCmd">{{$t('lg.confirmadd')}}</el-button></div>
              </div>
            </div>
            <div v-else>
              <p class="text-center">{{$t('lg.nodata')}}</p>
            </div>    
          </div>
        </el-col>
      </el-row>
      <div v-show="domainCmdLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
import * as types from '@/store/types'
let Base64 = require('js-base64').Base64;
export default{
  props:{
    isEditConfig:{
      type:Boolean
    },
    diplomas:{
      type:Array
    },
    keys:{
      type:Array
    },
    shadowObj:{
      type:Object
    },
    shadowDialogVisible:{
      type:Boolean
    }
  },
  watch:{
    'shadowform.http':function(){
      this.shadowform.domainPort = this.shadowform.http=='https'?443:80
    }
  },
  computed:{
    isShowWeight(){
      if(this.checkedTactics=='ip_weight'){
        return true;
      }else {
        return false;
      }
    },
    loadBalancingTypeTxt(){
      switch(this.checkedTactics){
        case 'polling':
          return this.$t('lg.polling');
          break;
        case 'least_conn':
          return this.$t('lg.leastcon');
          break;
        case 'ip_weight':
          return this.$t('lg.weights');
          break;
        case 'ip_hash':
          return 'ip_hash';
          break;
        default:
          return 'xff_hash';
      }
    }
  },
  created(){
    if(localStorage.lang=="en"){
      this.isencn="en";
    }else{
      this.isencn="cn";
    }
  },
  data(){
    return{
      isencn:'cn',
      abc:'',
      domainCmdLoading:false,
      domainDisable:false,
      domainCmdData:[],
      domainObj:{
        domainName:'',
        port:80
      },
      shadowform: {
        domainType:'web',
        http2:'',
        proxy_protocol:false,
        http:'http',
        domain: '',
        domainPort: 80,
        remark:'',
        diplomas:'',
        keys:'',
        innerHttp:'http',
        configArray:[{
          ip:'',
          ipPort:'',
          ipWeight:''
        }],

        //服务器健康检查 serverCheck
        scInterval:null,
        scFall:null,
        scRise:null,
        scTimeout:null,
        scType:'tcp',
        checkHttpSendType:'GET',
        checkHttpSendTxt:'/',
        checkHttpExpectAlive:[],

        //高级配置
        hostPort:'', //端口
        ntlmValue:null,//数字
        enableXff:false,//x-forwarded-for功能
        checkList: ['ipv4']
      },
      
      //服务器健康检查
      scTimeIntervalUnit:[
        {
          value: 's',
          label: '秒'
        }
      ],
      scIntervalUnitVal:'s',
      scTimeoutUnitVal:'s',
      scTypeUnit:[
        {
          value: 'tcp',
          label: 'tcp'
        },{
          value: 'http',
          label: 'http'
        },{
          value: 'ssl_hello',
          label: 'ssl_hello'
        },
      ],
      ckHtpSendUnit:[
        {
          value: 'GET',
          label: 'GET'
        },{
          value: 'HEAD',
          label: 'HEAD'
        }
      ],
      ckHtpExpAliveUnit:[
        {
          value: 'http_2xx',
          label: 'http_2xx'
        },{
          value: 'http_3xx',
          label: 'http_3xx'
        },{
          value: 'http_4xx',
          label: 'http_4xx'
        },{
          value: 'http_5xx',
          label: 'http_5xx'
        }
      ],

      isShowServerCheckBox:false,//健康检查
      isShowHgSettingBox:false,//高级配置
      
      checkedTactics:'polling',
      ipTactics:[{
        value:'polling',
        name:this.$t('lg.polling')
      },{
        value:'least_conn',
        name:this.$t('lg.leastcon')
      },{
        value:'ip_weight',
        name:this.$t('lg.weights')
      },{
        value:'ip_hash',
        name:'ip_hash'
      },{
        value:'xxf_hash',
        name:'xff_hash'
      }],
     
      shadowPopRules:{
        domain:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {
            validator: this.validatePort,
            trigger: 'blur'
          }
         // {pattern:/^(?!0)([1-9]\d{0,4}|[1-5]\d{4}|6[0-5][0-5][0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'blur'}//端口正则
        ],
        diplomas:[
          {required:true, message:this.$t('lg.select'), trigger:'blur'},
        ],
        keys:[
          {required:true, message:this.$t('lg.select'), trigger:'blur'},
        ],

        // 服务器健康检查
        scInterval:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scFall:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scRise:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scTimeout:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        checkHttpSendTxt:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-.\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invaidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        checkHttpExpectAlive:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],

        // 高级配置
        hostPort:[
          {pattern:/^(?!0)([1-9]\d{0,4}|[1-5]\d{4}|6[0-5][0-5][0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'blur'}//端口正则
      //  {
      //     validator:this.validatePort,
      //     trigger: 'blur'
      //   }
       ],
        ntlmValue:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      ipLabelWidth:'100px'
    }
  },
  methods:{
    validatePort(rule, value, callback) {
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
        callback(); // 验证通过
      } else {
        callback(new Error(this.$t('lg.qingshuru1'))); // 验证失败
      }
    },
    handleShadowClose(){//关闭shadowpop
    this.shadowform.http2 = "";
      this.domainDisable=false;
      this.domainCmdData=[];
      this.shadowform.http = "http";
      this.$refs['shadowform'].resetFields();
      this.$emit('setbyshadowpopchild',false);
      this.shadowform.configArray.length=1;
      this.shadowform.checkList=['ipv4'];
      this.checkedTactics='polling';
      this.isShowServerCheckBox=false;
      this.isShowHgSettingBox = false;
      this.proxy_protocol=false;
    },
    addDomainBox(){//增加更多内部业务
      this.shadowform.configArray.push({
        ip:'',
        ipPort:'',
        ipWeight:''
      })
    },
    delDomainBox(index){//删除多个业务添加框，至少保留一个
      if(this.shadowform.configArray.length==1){
        return;
      }
      this.shadowform.configArray.splice(index,1);
    },
    serverCheck(){
      this.isShowServerCheckBox=!this.isShowServerCheckBox;
    },
    gradeSetting(){
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
    },
    addDomainCmd(formname){//添加服务器到预览表格

      var _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var thisShdowForm=this.shadowform;
          // console.log(thisShdowForm);
          var domainType=thisShdowForm.domainType;
          var isAddValid=true;
          if(domainType=="web"){
            isAddValid=parseInt(_this.$store.state.licenceinfo.domainLimit)-parseInt(_this.$store.state.licenceinfo.currentDomains)>0?true:false;
          }else if(domainType=="applet"){
            isAddValid=parseInt(_this.$store.state.licenceinfo.appletDomainLimit)-parseInt(_this.$store.state.licenceinfo.currentAppletDomains)>0?true:false;
          }else if(domainType=="app"){
            isAddValid=parseInt(_this.$store.state.licenceinfo.appDomainLimit)-parseInt(_this.$store.state.licenceinfo.currentAppDomains)>0?true:false;
          }
          if(!isAddValid)
          {
            _this.$message.error(this.$t('lg.failed')+": "+this.$t('lg.overdmlimitnum'));
            return;
          }

          var htp=thisShdowForm.http,
              domain=thisShdowForm.domain,
              domainPort=thisShdowForm.domainPort,
              diploma=thisShdowForm.diplomas,
              key=thisShdowForm.keys,
              http2=thisShdowForm.http2,
              proxy_protocol=thisShdowForm.proxy_protocol?"proxy_protocol":"",
              ipListenConfs=thisShdowForm.checkList;
          if(htp=="https"){
            this.domainObj.key=key;
            this.domainObj.diploma=diploma;
          }
          this.domainObj.domainName=domain;
          this.domainObj.port=domainPort;
          thisShdowForm.configArray.forEach(element => {
            this.domainCmdData.push(element);
          });
          // this.domainCmdData.push({"server":ip+":"+ipPort});
          this.domainDisable=true;
          this.shadowform.configArray=[{
            ip:'',
            ipPort:'',
            ipWeight:''
          }]
        }
      });
    },
    deleCmd(item){
      this.domainCmdData.splice(this.domainCmdData.indexOf(item),1);
      if(this.domainCmdData.length==0){
        this.domainDisable=false;
      }
    },
    submitDomainCmd(){//增加domain 增加业务
      var _this=this;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;
      var port=_this.domainObj.port;
      var remark=_this.shadowform.remark;
      var myhttp=_this.shadowform.http;
      var uphttp=_this.shadowform.innerHttp;
      var enableXFF=_this.shadowform.enableXff;
      var serverPort=_this.shadowform.hostPort || 0;
      var ntlmVal = _this.shadowform.ntlmValue;
      var enableNTLM=ntlmVal?true:false;
      var proxy_protocol=_this.shadowform.proxy_protocol?"proxy_protocol":"";
      var http2=_this.shadowform.http2?'http2':'';
      var domainType = _this.shadowform.domainType;

      var serverCheckAble=_this.isShowServerCheckBox;
      var ip_v46;
      var ipv46=_this.shadowform.checkList;
      if(ipv46.length==1){
        ip_v46=ipv46[0]
      }else if(ipv46.length==2){
        ip_v46=ipv46[0]+"|"+ipv46[1];
      }

      // 融入负载均衡
      var serverData=[];
      let LoadBalance = '';
      serverData = _this.domainCmdData.map(element=>{
        if(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(element.ip) && !/^\[|\]$/.test(element.ip)){
              element.ip='['+element.ip+']';
            }
        if(_this.checkedTactics=='ip_weight'){
          LoadBalance = element.ip+':'+element.ipPort+' '+'weight='+element.ipWeight;
          return {"server":LoadBalance}
        }else{
          LoadBalance = element.ip+':'+element.ipPort;
          return {"server":LoadBalance}
        }
      })
      if(_this.checkedTactics!=='polling' && _this.checkedTactics!=='ip_weight'){
        serverData.push({
          [_this.checkedTactics]:''
        })
      }
      // console.log(serverData)

      if(enableNTLM){
        serverData.push({
          "ntlm":ntlmVal
        })
      }

      if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain";
      }
      var dataJson={
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            remark:remark,
            serverScheme:uphttp,
            servers:serverData,
            ssl:'off',
            enableXFF:enableXFF,
            serverPort:serverPort,
            enableNTLM:enableNTLM,
            ipListenConfs:ip_v46,
            proxyProtocol:proxy_protocol,
            http2:http2,
            domainType:domainType
          };
      if(myhttp=="https"){
        dataJson.ssl="on";
        dataJson.key=_this.domainObj.key;
        dataJson.crt=_this.domainObj.diploma;
      }
      // console.log(serverCheckAble)
      if(serverCheckAble){ //如果开启健康检查 则还需传入健康检查的参数
        let serverCheckObj={
              enabled:true,
              param:{}
            };
        serverCheckObj.enabled=serverCheckAble;
        serverCheckObj.param.interval=_this.shadowform.scInterval*1000;//转化成毫秒
        serverCheckObj.param.fall=_this.shadowform.scFall;
        serverCheckObj.param.rise=_this.shadowform.scRise;
        serverCheckObj.param.timeout=_this.shadowform.scTimeout*1000;
        serverCheckObj.param.type=_this.shadowform.scType;

        if(_this.shadowform.scType=='http'){
          serverCheckObj.param.check_http_send='\"' + _this.shadowform.checkHttpSendType + ' ' + `${_this.shadowform.checkHttpSendTxt || '/'}` + ' ' + 'HTTP/1.0\\r\\n\\r\\n' + '\"';
          serverCheckObj.param.check_http_expect_alive=_this.shadowform.checkHttpExpectAlive.join(' ');
        }

        dataJson.serverCheck=serverCheckObj;
      }
      // console.log(dataJson)
      _this.domainCmdLoading=true;
      axios.post(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$emit("updateRenderTree");
          this.$store.commit(types.GETLICENCEINFO);
         // _this.$emit("updateLicenceStatus",12);
          _this.handleShadowClose();//关闭弹窗
        }else if(res.data.responseCode==8){
          _this.$message.error(_this.$t('lg.failed')+":"+res.data.data);
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
        _this.domainCmdLoading=false;
      }).catch((err)=>{
        console.log(err)
        _this.$message.error(this.$t('lg.failed'));
        _this.domainCmdLoading=false;
      })
    }    
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.labelme /deep/ .el-form-item__label{ line-height: 20px;}
.el-radio-group{
  margin-left: 10px;
  vertical-align: text-top;
}
.el-radio{
  margin: 5px 25px 5px 0px;
}

.outBorder{
  padding: 30px 20px 1px 0px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: relative;
}

.loadBaTypeTxt{
  margin-top: 10px;
}

.inBorder{
  border: 1px dashed #dcdfe6;
  padding: 20px 20px 1px 0px;
  margin-bottom: 20px;
  margin-left: 20px;
  position: relative;
  border-radius: 5px;
}
.inBorder:nth-last-of-type(1){
  margin-bottom: 30px;
}
.delIp{
  position: absolute;
  right: 3px;
  top: 2px;
  cursor: pointer;
}
.addIp{
  display: block;
  position: absolute;
  right: 3px;
  bottom: -25px;
  cursor: pointer;
  z-index: 1;
}

/*服务器健康检查*/
/*高级配置*/
.serverCheckBox, .gradeSettingBox{
  margin-bottom: 20px;
}
.serverCheckinner, .gradeSettinginner{
  border: 1px solid #dcdfe6;
  padding: 30px 20px 10px 0px;
  margin-bottom: 30px;
  margin-left: 20px;
  position: relative;
  border-radius: 5px;
  /* box-sizing: border-box; */
}
.serverCheckinner{
  margin-top: -20px;
}
.serverCheckTxt, .gradeSettingTxt{
  margin: 20px 0 10px 20px;
}
</style>

