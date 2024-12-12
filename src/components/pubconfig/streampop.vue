<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="72%" :title="shadowObj.snodeId+' ['+shadowObj.name+']'" :visible.sync="streamShow" :close-on-click-modal="false" :before-close="handleShadowClose">
      <el-row>
        <el-col :span="12">
          <div class="grid-content" style="margin-right:30px">
            <el-form :model="shadowform" :rules="shadowPopRules" ref="shadowform" label-width="120px">
              <div class="outBorder">
                <span class="titleSpan">{{$t('lg.externalserviceconf')}}</span>
                <el-form-item :label="$t('lg.name')" prop="domain">
                  <el-input v-model.trim="shadowform.domain" :disabled="domainDisable"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.bsport')" prop="domainPort">
                  <el-input v-model.trim="shadowform.domainPort" :disabled="domainDisable"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.remark')" prop="remark">
                  <el-input v-model.trim="shadowform.remark" :disabled="domainDisable" :placeholder="$t('lg.plzenter')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.selectcer')" prop="diplomas" v-if="shadowform.http=='https'">
                  <el-select v-model="shadowform.diplomas" :placeholder="$t('lg.selectcer')" :disabled="domainDisable">
                    <template v-for="item in diplomas">
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
                <div style="position: relative;">
                  <div class="inBorder" v-for='(item,index) in shadowform.configArray' :key="index">    
                    <span class="delIp" @click="delDomainBox(index)"><i class="el-icon-close"></i></span>  
                    <el-form-item label="IP" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ip'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}, {pattern:/^([\w\-. *!$@?^()<>{}[\]=%&:\;/~+#`,])+$/, message: $t('lg.invalidformat'), trigger: 'blur'}]"><!--既能输域名又能输IP //不能输入中文、单双引号及少部分特殊字符 有空格-->
                      <el-input v-model.trim="item.ip"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.port')" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ipPort'" :rules="rules.checkport">
                      <el-input v-model.trim="item.ipPort"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('lg.weights')" :label-width="ipLabelWidth" v-if="checkedTactics=='ip_weight'" :prop="'configArray.' + index + '.ipWeight'" :rules="[{required: true, message:$t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
                      <el-input v-model.trim="item.ipWeight"></el-input>
                    </el-form-item>
                  </div>
                  <span class="addIp" @click="addDomainBox" :title="$t('lg.addmoreinternalbs')"><i class="el-icon-circle-plus-outline"></i></span>
                </div>
                <!-- 负载均衡策略 -->
                <el-form-item :label="$t('lg.balancestrategy')" label-width="200px">
                  <el-radio-group v-model="checkedTactics" :disabled="domainDisable">
                    <el-radio v-for="item in ipTactics" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>   

              <el-form-item>
                <el-button type="primary" @click="addDomainCmd('shadowform')">{{$t('lg.add')}}</el-button>
                <el-button @click="handleShadowClose">{{$t('lg.cancel')}}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <div v-if="domainCmdData.length>0">
              <h2 class="domaincmd-title">[{{shadowform.domain}} &nbsp;-&nbsp;{{shadowform.domainPort}} &nbsp;-&nbsp; {{shadowform.remark}} &nbsp;-&nbsp; {{shadowform.checkList[0]}}<span v-if="shadowform.checkList[1]"> | {{shadowform.checkList[1]}}</span> ]</h2>
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
    streamShow:{
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
  data(){
    return{
      rules:{
        checkport:[{trigger:"blur",validator:this.validaport}]
      },
      abc:'',
      domainCmdLoading:false,
      domainDisable:false,
      domainCmdData:[],
      domainObj:{
        domainName:'',
        port:80
      },
      shadowform: {
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
          label: this.$t('lg.second')
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
      }],
     
      shadowPopRules:{
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {
            validator: this.validatePort,
            trigger: 'blur'
          }
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
          //{pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ],
        ntlmValue:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      ipLabelWidth:'100px'
    }
  },
  methods:{
    validaport(rule, value, callback){
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }

    },
    validatePort(rule, value, callback) {
      const numericValue = Number(value);
      if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
        callback(); // 验证通过
      } else {
        callback(new Error(this.$t('lg.qingshuru1'))); // 验证失败
      }
    },
    handleShadowClose(){//关闭shadowpop
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
          var domain=thisShdowForm.domain,
              domainPort=thisShdowForm.domainPort,
              diploma=thisShdowForm.diplomas,
              key=thisShdowForm.keys,
              ipListenConfs=thisShdowForm.checkList;
          this.domainObj.domainName=domain;
          this.domainObj.port=domainPort;
          thisShdowForm.configArray.forEach(element => {
          //  console.log(element)
            
            this.domainCmdData.push(element);
            console.log(this.domainCmdData)
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
      let url=SERVER_API_URL+"pe/shadow/stream"
      var dataJson={
            snodeId:snodeId,
            streamName:domainName,
            streamPort:port,
            remark:remark,
            servers:serverData,
            ipListenConfs:ip_v46
          };
      _this.domainCmdLoading=true;
      axios.post(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$emit("updateRenderTree");
          _this.handleShadowClose();//关闭弹窗
        }else if(res.data.responseCode==8){
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data);
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

