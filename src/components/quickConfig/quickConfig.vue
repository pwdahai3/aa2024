<template>
  <div class="quickconfig-wrapper">
    <h2 class="breadcrumb">{{$t('lg.quickconfigguid')}}</h2>
    <div class="form-bg">
      <el-steps :active="currentStep" finish-status="success">
        <el-step :title="$t('lg.step1')"  :description="$t('lg.selectnode')"></el-step>
        <el-step :title="$t('lg.step2')" :description="$t('lg.addbs')"></el-step>
        <el-step :title="$t('lg.step3')" :description="$t('lg.createbeibaohuduix')"></el-step>
        <el-step :title="$t('lg.step4')" :description="$t('lg.configsantollfanyugon')"></el-step>
      </el-steps>
    </div>

    <ul class="stepContent">
      <li v-show="currentStep==1" ><!-- 步骤一 选择节点 -->
        <h2 class="stepTitle">{{$t('lg.selectnewaddconfignode')}}</h2>
        <el-form ref="shadownodesform" :model="shadownodesform" label-width="130px" :rules="shadownodesformRules" class="orderBoxJamb">
          <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
            <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" style="width:50%">
              <template v-for="n in nodesdata">
                <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-form>
      </li>
      <li v-show="currentStep==2"> <!-- 步骤二 添加domain -->
        <h2 class="stepTitle">{{$t('lg.weiselectnodeaddbs')}}</h2>
        <el-form ref="domainform" :model="domainform" label-width="140px" :rules="domainformRules" class="domainformBox">
          <div class="outBorder box1">
            <span class="titleSpan qkConfigtitleSpan">{{$t('lg.externalserviceconf')}}</span>
            <el-form-item :label="$t('lg.domainType')">
                  <el-select v-model="domainform.domainType" style="width:100%">
                    <template>
                      <el-option label="web" value="web"></el-option>
                      <el-option label="小程序" value="applet"></el-option>
                      <el-option label="app" value="app"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
            <el-form-item :label="$t('lg.httpout')">
              <el-select v-model="domainform.http" style="width:100%">
                <template>
                  <el-option label="http" value="http"></el-option>
                  <el-option label="https" value="https"></el-option>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('lg.bsdomain')" prop="domain">
              <el-input v-model.trim="domainform.domain"></el-input>
            </el-form-item>

            <el-form-item :label="$t('lg.bsport')" prop="domainPort">
              <el-input v-model.trim="domainform.domainPort"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.remark')" prop="remark">
              <el-input v-model.trim="domainform.remark"></el-input>
            </el-form-item>

            <el-form-item :label="$t('lg.selectcer')" prop="diplomas" v-if="domainform.http=='https'">
              <el-select v-model="domainform.diplomas" :placeholder="$t('lg.selectcer')" @visible-change='getCrts'>
                <template v-for="item in diplomas">
                  <el-option :label="item.name" :value="item.name"></el-option>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('lg.selectsec')" prop="keys" v-if="domainform.http=='https'">
              <el-select v-model="domainform.keys" :placeholder="$t('lg.selectsec')" @visible-change='getKeys'>
                <template v-for="item in keys">
                  <el-option :label="item.name" :value="item.name"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item>
                  <el-checkbox-group v-model="domainform.checkList" :min="1">
                    <el-checkbox label="ipv4">IPV4</el-checkbox>
                    <el-checkbox label="ipv6">IPV6</el-checkbox>
                  </el-checkbox-group>
            </el-form-item>

          </div>

          <div class="outBorder box2">
            <span class="titleSpan qkConfigtitleSpan">{{$t('lg.internalserviceconf')}}</span>
            <el-form-item :label="$t('lg.httpin')" :label-width="ipLabelWidth">
              <el-select v-model="domainform.innerHttp" style="width:100%">
                <template>
                  <el-option label="http" value="http"></el-option>
                  <el-option label="https" value="https"></el-option>
                </template>
              </el-select>
            </el-form-item>

            <div style="position: relative;">
              <div class="inBorder" v-for='(item,index) in domainform.configArray' :key="index">    
                <span class="delIp" @click="delDomainBox(index)"><i class="el-icon-close"></i></span>  
                <el-form-item label="IP" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ip'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}, {pattern:/^([\w\-. *!$@?^()<>{}[\]=%&:\;/~+#`,])+$/, message: $t('lg.invalidformat'), trigger: 'blur'}]"><!--既能输域名又能输IP //不能输入中文、单双引号及少部分特殊字符 有空格-->
                  <el-input v-model.trim="item.ip"></el-input>
                </el-form-item>
                <el-form-item :label="$t('lg.port')" :label-width="ipLabelWidth" :prop="'configArray.' + index + '.ipPort'" 
                :rules="rules.checkport">
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
              <el-radio-group v-model="checkedTactics">
                <el-radio v-for="item in ipTactics" :label="item.value" :key="item.value">{{item.name}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>   
        </el-form>
      </li>
      <li v-show="currentStep==3"><!-- 步骤三 创建location -->
        <h2 class="stepTitle">{{$t('lg.geinewbscreatecuspreobj')}}</h2>
        <el-form ref="locationform" :model="locationform" :rules="locationformRules" label-width="180px" class="orderBoxJamb">
          <el-form-item :label="$t('lg.matchtype')" prop="locationType">
            <el-select v-model="locationform.locationType" :placeholder="$t('lg.matchtype')">
              <!-- <el-option :label="$t('lg.exactmatch')" value="accurateMatch"></el-option>
              <el-option :label="$t('lg.suffixmatch')" value="suffixMatch"></el-option>
              <el-option :label="$t('lg.patchmatch')" value="pathMatch"></el-option>
              <el-option :label="$t('lg.dynamicurl')" value="dynamicMatch"></el-option> -->
              <el-option :label="$t('lg.tongyongpp')" value="/"></el-option>
            </el-select>
            <!-- <el-checkbox v-model="actChecked" v-if="isShowchecked">动态URL</el-checkbox> -->
          </el-form-item>
          <el-form-item :label="$t('lg.protectedpos')" prop="locationName">
            <el-input v-model.trim="locationform.locationName" :disabled="locationform.locationType=='/'" style="width:50%"></el-input>
          </el-form-item>
        </el-form>
      </li>
      <li v-show="currentStep==4"><!-- 步骤四 设置location高级配置 扫描工具防御 -->
        <h2 class="stepTitle">{{$t('lg.configcommprotectsantooldefgn')}}</h2>
        <el-form ref="lcbotconfform" :model="lcbotconfform" :rules="lcbotconfformRules"  :label-width="isencn=='en'?'290px':'170px'" class="orderBoxJamb">
          <el-form-item :label="$t('lg.kaiqisantooldefgn')" prop="botconfVal">
            <el-switch v-model="lcbotconfform.botconfVal"></el-switch>
          </el-form-item>
        </el-form>
      </li>
    </ul>

    <div class="stepBtn">
      <el-button @click="lastStep" :disabled="currentStep==1">{{$t('lg.prevstep')}}</el-button>
      <el-button type="primary" @click="nextStep">{{currentStep==4?$t('lg.done'):$t('lg.next')}}</el-button>
    </div>

    <loading v-show="quickConfigLoading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
export default {
  components:{
    loading
  },
  data(){
    return{
      rules:{
        checkport:[{trigger:"blur",validator:this.validaport}]
      },
      isencn:'cn',
      quickConfigLoading:false,
      currentStep:1,//当前所在步骤
      stepFormList:['shadownodesform','domainform','locationform','lcbotconfform'],//所有表单
      currentForm:'shadownodesform',//当前表单

      //步骤一
      shadownodesform:{ 
        shadownodes:''
      },
      nodesdata:[],
      shadownodesformRules:{
        shadownodes:[{ required: true, message: this.$t('lg.required'), trigger: 'change' }]
      },

      //步骤二
      domainform:{
        domainType:'web',
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
        checkList: ['ipv4']
      },
      domainformRules:{
        domain:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        domainPort:[
         {required:true, message:this.$t('lg.required'), trigger:'blur'},
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error(this.$t('lg.qingshuru1'))); // 验证失败
            }
          },
          trigger: 'blur'
        }
       ],
        diplomas:[
          {required:true, message:this.$t('lg.select'), trigger:'blur'},
        ],
        keys:[
          {required:true, message:this.$t('lg.select'), trigger:'blur'},
        ]
      },
      crts:[],
      diplomas:[],//证书 pems 和 crts 证书的合并
      keys:[],//秘钥 查询key文件
      // 负载均衡
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
      ipLabelWidth:'100px',

      // 步骤三
      locationform:{
        locationType:'/',
        locationName:'/',
      },
      locationformRules:{
        locationType:[ 
          { required: true, message: this.$t('lg.required'), trigger: 'change' }
        ],
        locationName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },

      // 步骤四
      lcbotconfform:{
        botconfVal:false
      },
      lcbotconfformRules:{
        botconfVal:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },
    }
  },
  created(){
    if(localStorage.lang=="en"){
      this.isencn="en";
    }
    this.getShadowNodes();
  },
  watch:{
    'domainform.http':function(){
      this.domainform.domainPort = this.domainform.http=='https'?443:80;
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
    //步骤一
    getShadowNodes(){//获取节点
      var _this=this;
      var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          _this.nodesdata=res.data.data;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },

    //步骤二
    getCrts(callback){//证书管理 查询crt文件
      if(!callback) return false
      const snodeId=this.shadownodesform.shadownodes;
      if(snodeId){
        var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/crt";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.crts=res.data.data;
            this.getPems();
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    getPems(callback){//证书管理 查询pem文件
      const snodeId=this.shadownodesform.shadownodes;
      if(snodeId){
        const url=SERVER_API_URL+"pe/file/client/"+snodeId+"/pem";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const pems=res.data.data;
            this.diplomas = this.crts.concat(pems);//合并crt、pem证书传入shadowpop.vue
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    getKeys(callback){//证书管理 查询key文件
      if(!callback) return false
      const snodeId=this.shadownodesform.shadownodes;
      if(snodeId){
        const url=SERVER_API_URL+"pe/file/client/"+snodeId+"/key";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.keys=res.data.data;
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    addDomainBox(){//增加更多内部业务
      this.domainform.configArray.push({
        ip:'',
        ipPort:'',
        ipWeight:''
      })
    },
    delDomainBox(index){//删除多个业务添加框，至少保留一个
      if(this.domainform.configArray.length==1){
        return;
      }
      this.domainform.configArray.splice(index,1);
    },

    //步骤三

    //步骤四
  
    // ----------------------------------------------------------------
    lastStep(){//上一步
      // console.log(this.currentStep)
      // console.log(this.currentForm)
      this.currentStep>=2?this.currentStep-=1:'';
      this.currentForm=this.stepFormList[this.currentStep-1];
    },
    nextStep(){//下一步
      this.$refs[this.currentForm].validate((valid) => {
        if(valid){
          // console.log(this.currentStep)
          // console.log(this.currentForm)
          if(this.currentStep==4){
            this.$confirm(this.$t('lg.zhu80'), this.$t('lg.tip'), {
              confirmButtonText: this.$t('lg.queding'),
              cancelButtonText: this.$t('lg.cancel'),
              type: 'success'
            }).then(() => {
              this.submitQuickConfig();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('lg.cancel')
              });          
            });
          }else{
            this.currentStep+=1;
            this.currentForm=this.stepFormList[this.currentStep-1];
          }
        }
      })
    },
    submitQuickConfig(){//完成快速配置，一次需调用多个接口，（必须先调用创建domain的接口生成了domain，才能调用创建location的接口生成location，最后对location插入指令，节点的高级配置接口调用顺序可随意）
      const _this=this;
      _this.quickConfigLoading=true;
      let [snodeId,domainType,myhttp,domainName,domainPort,remark,uphttp,domainCmdData,myTactics]=[_this.shadownodesform.shadownodes,_this.domainform.domainType,_this.domainform.http, _this.domainform.domain, _this.domainform.domainPort,_this.domainform.remark, _this.domainform.innerHttp, [..._this.domainform.configArray], _this.checkedTactics]

      // 融入负载均衡
      let serverData=[];
      let LoadBalance = '';
      serverData = domainCmdData.map(element=>{
        if(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(element.ip) && !/^\[|\]$/.test(element.ip)){
              element.ip='['+element.ip+']';
            }
        if(myTactics=='ip_weight'){
          LoadBalance = element.ip+':'+element.ipPort+' '+'weight='+element.ipWeight;
          return {"server":LoadBalance}
        }else{
          LoadBalance = element.ip+':'+element.ipPort;
          return {"server":LoadBalance}
        }
      })
      if(myTactics!=='polling' && myTactics!=='ip_weight'){
        serverData.push({
          [myTactics]:''
        })
      }
      // console.log(serverData)
      var ip_v46;
      var ipv46=_this.domainform.checkList;
      if(ipv46.length==1){
        ip_v46=ipv46[0]
      }else if(ipv46.length==2){
        ip_v46=ipv46[0]+"|"+ipv46[1];
      }

      const domainUrl = SERVER_API_URL+"pe/shadow/domain";
      let dataJson = {
        snodeId:snodeId,
        domainType:domainType,
        domainName:domainName,
        domainPort:domainPort,
        remark:remark,
        serverScheme:uphttp,
        servers:serverData,
        ssl:'off',
        ipListenConfs:ip_v46
      }
      if(myhttp=='https'){
        dataJson.ssl="on";
        dataJson.key=_this.domainform.keys;
        dataJson.crt=_this.domainform.diplomas;
      }

      axios.post(domainUrl,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.addLocation();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': ('+_this.$t('lg.rightip')+')'+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
        _this.$message.error(_this.$t('lg.failed')+': '+ err.response.data.data.message);
      })
    },
    
    addLocation(){//增加被保护的页面
      const _this=this;
      const locationUrl = SERVER_API_URL+"pe/shadow/domain/location";

      let [snodeId,domainName,domainPort,locationType,locationName]=[_this.shadownodesform.shadownodes, _this.domainform.domain, _this.domainform.domainPort, _this.locationform.locationType, _this.locationform.locationName];

      // if(locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则
      //   if(locationName=="/"){
      //     locationName="(.*\\/)+$"              
      //   }else{
      //     locationName="\\.("+locationName+")$"
      //   }
      // }

      let dataJson = {
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        locationType:locationType,
        locationName:locationName,
        waf:'off',//接口要求必须有此值
        wafRuleset:[]//接口要求必须有此值
      }

      axios.post(locationUrl,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.sdShadowlib().then((resolvedata)=>{
            _this.lcInsertJs().then((resolvedata)=>{
              _this.lcBotconf();
            })
          })
        }else{
          this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },

    // 三个高级配置接口不能用promise.all 同时调用（同时更改配置文件会出错）
    sdShadowlib(){//节点的Js配置选项
      return new Promise((resolve,reject)=>{
        let [snodeId,domainName] = [this.shadownodesform.shadownodes, this.domainform.domain];
        const sdLibUrl = SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId;
        let shadowlibObj = {};
      //  const targetKey= (domainName.split('.').join('_')).split(':').join('_');// ‘_’取代用户输入域名里的‘.’
      let targetKey=Base64.encode(domainName);
        shadowlibObj[targetKey]={
          "aclick": false,
          "crossdomain": "",
          "bodye": false,
          "isws": false,
          "acookieorencpyt": false
        };
        axios.patch(sdLibUrl,shadowlibObj).then((res)=>{
          if(res.data.responseCode==0){
            resolve(true);
          }else{
            this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      })
    },
    lcInsertJs(){//location的js增强功能 (默认配置成：增强插入)
      return new Promise((resolve,reject)=>{
        let [snodeId,domainName,domainPort,locationType,locationName] = [this.shadownodesform.shadownodes, this.domainform.domain, this.domainform.domainPort, this.locationform.locationType, this.locationform.locationName];

        // if(locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则
        //   if(locationName=="/"){
        //     locationName="(.*\\/)+$"              
        //   }else{
        //     locationName="\\.("+locationName+")$"
        //   }
        // }

        const insertJsUrl = SERVER_API_URL+"pe/shadow/domain/location/directive";
        let str="pes 10s 1 '<head>' '<head><script src=\"' 'formvalidator/config.js' '\"><\/script>'";
        let str2="pes 10s 1 '</title>' '</title><script src=\"' 'formvalidator/shadowlib.js' '\"><\/script>'";
        str = Base64.encode(str);
        str2 = Base64.encode(str2);
        let directivesArr=[{
              shadow_insert_js_ex:str
            },{
              shadow_insert_js_ex:str2
            }]
        axios.post(insertJsUrl,{
          snodeId:snodeId,
          domainName:domainName,
          domainPort:domainPort,
          locationType:locationType,
          locationName:locationName,
          directives:directivesArr
        }).then((res)=>{
          if(res.data.responseCode==0){
            resolve(true);
          }else{
            this.$message.error(this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err);
        })
      })
    },
    lcBotconf(){//locationType 为通用匹配时，要默认开启botconf （扫描工具防御功能）
      let [snodeId,domainName,domainPort,locationType,locationName,botConf] = [this.shadownodesform.shadownodes, this.domainform.domain, this.domainform.domainPort, this.locationform.locationType, this.locationform.locationName, this.lcbotconfform.botconfVal?'on':'off'];
      
      // locationName=locationType=='suffixMatch'?encodeURI(locationName):locationName;

      const botconfUrl = SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      axios.patch(botconfUrl,{
        botConf:botConf,
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
        this.quickConfigLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    
  }
}
</script>

<style lang="stylus" scoped>
  .quickconfig-wrapper
    width 100%
    height 100%
    position relative
    padding 15px
    box-sizing border-box
    display flex
    flex-direction: column;
    .stepContent
      flex 1
      overflow-y auto
      overflow-x hidden
      padding 15px
      box-sizing border-box 
      background #f7f7f7
      .stepTitle
        font-size 16px
        margin-bottom 15px
        padding-left 8px
      .domainformBox
        display flex
        justify-content space-between
        margin-top 30px
        .outBorder
          padding 35px 20px 1px 0px
          border 1px solid #ccc
          border-radius 5px
          position relative
          .qkConfigtitleSpan
            background #f7f7f7 
        .box1
          width 35%
          margin-right 15px
        .box2
          flex 1
          .el-radio-group
            margin-left 10px
            vertical-align text-top
            .el-radio
              margin: 5px 25px 5px 0px;
          .inBorder
            border 1px dashed #dcdfe6
            padding 20px 20px 1px 0px
            margin-bottom 20px
            margin-left 20px
            position relative
            border-radius 5px
            .delIp
              position absolute
              right 3px
              top 2px
              cursor pointer
          .inBorder:nth-last-of-type(1)
            margin-bottom: 30px;
          .addIp
            display block
            position absolute
            right 3px
            bottom -25px
            cursor pointer
            z-index 1
    .stepBtn
      padding 15px
      box-sizing border-box 
      text-align right 
      background #f7f7f7 
</style>
