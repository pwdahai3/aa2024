<!-- 管理服务器 -->
<template>
  <div>
    <el-dialog width="55%" :title="domainObj.domainName" :visible.sync="isShow" :close-on-click-modal="false" :before-close="upstreamlistmodalClose">
      <el-button class="addIpBtn" type="primary" size="mini" @click="dmUpstreamModal()">{{$t('lg.addserver')}}</el-button>
      <div>
        <table class="ipTable">
          <thead>
            <tr>
              <th>IP</th>
              <th>PORT</th>
              <th v-if="loadBalancingType=='ip_weight'">{{$t('lg.weights')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in upstreamlist">
              <td>{{item.ip}}</td>
              <td>{{item.port}}</td>
              <td v-if="loadBalancingType=='ip_weight'">{{item.ipWeight}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editCmd(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="delCmd(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="myBalance"><span>{{$t('lg.curloadbalance')}}：<i class="el-icon-success font-green"></i> {{loadBalancingTypeTxt}}</span><span class="changeBalance font-blue" @click="changeBalance()"><i :class="isShowChangeBalanceBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>{{$t('lg.editstrategy')}}</span></p>
        <div v-show="isShowChangeBalanceBox" class="changeBalanceBox">
          <el-radio-group v-model="checkedTactics"> <!-- @change="changeBalanceEnsure()" -->
            <el-radio v-for="item in ipTactics" :label="item.value" :key="item.value">{{item.name}}</el-radio>
          </el-radio-group>
          <el-button size="mini" type="primary" style="marginLeft:10px;" @click="changeBalanceEnsure()">{{$t('lg.save')}}</el-button>
        </div>
      </div>
      <loading v-show="upstreamlistmodalLoading"></loading>
    </el-dialog>

    <!-- 添加服务器弹框 -->
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="addStreamlistmodalShow" :close-on-click-modal="false" :before-close="addStreamlistmodalClose">
      <el-row>
        <el-col :span="12">
          <el-form :model="upstreamform" :rules="upstreamformRules" ref="upstreamform" label-width="60px" style="margin-right:30px">
            <el-form-item label="IP" prop="ip">
              <el-input v-model.trim="upstreamform.ip" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.port')" prop="ipPort">
              <el-input v-model.trim="upstreamform.ipPort" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.weights')" prop="ipWeight" v-if="loadBalancingType=='ip_weight'">
              <el-input v-model.trim="upstreamform.ipWeight" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addUpstreamCmd('upstreamform')">{{$t('lg.add')}}</el-button>
              <el-button @click="addStreamlistmodalClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div>
            <p class="nodata-box" v-if="upstreamCmdData.length==0">{{$t('lg.nodata')}}</p>
            <div v-if="upstreamCmdData.length>0">
              <table>
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>PORT</th>
                    <th v-if="loadBalancingType=='ip_weight'">{{$t('lg.weights')}}</th>
                    <th width="44"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in upstreamCmdData">
                    <td>{{item.ip}}</td>
                    <td>{{item.ipPort}}</td>
                    <td v-if="loadBalancingType=='ip_weight'">{{item.ipWeight}}</td>
                    <td class="text-center font-red fsize-12 cursor-pointer" @click="deleAddCmd(item)">{{$t('lg.delete')}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="margin-tb text-right"><el-button type="primary" @click="submitupstreamCmd">{{$t('lg.confirm')}}</el-button></div>
            </div>
          </div>    
        </el-col>
      </el-row>
      <loading v-show="addStreamlistLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog width="40%" :title="domainObj.domainName" :visible.sync="isShowEditCmd" :close-on-click-modal="false" :before-close="isEditCmdClose">
      <el-form :model="editCmdform" ref="editCmdform" :rules="editCmdformRules" label-width="60px">
        <el-form-item label="IP" prop="ip">
          <el-input v-model.trim="editCmdform.ip" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.port')" prop="port">
          <el-input v-model.trim="editCmdform.port" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.weights')" prop="ipWeight" v-if="loadBalancingType=='ip_weight'">
          <el-input v-model.trim="editCmdform.ipWeight" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editCmdEnsure('editCmdform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="isEditCmdClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editStreamlistLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>

    <!-- 权重弹框 -->
    <el-dialog width="40%" :title="domainObj.domainName" :visible.sync="isIpWeight" :close-on-click-modal="false" :before-close="isweightCmdformClose">
      <el-row>
        <el-form :model="weightCmdform" ref="weightCmdform" label-width="60px">
          <div class="grid-content weightIpBox" v-for="(item,index) in weightCmdform.weightCmdArray" :key="index">
            <el-form-item label="IP" :prop="'weightCmdArray.' + index + '.ip'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([\w\-. *!$@?^()<>{}[\]=%&:\;/~+#`,])+$/, message: $t('lg.invalidformat'), trigger: 'blur'}]"><!--既能输域名又能输IP //不能输入中文、单双引号及少部分特殊字符 有空格-->
              <el-input v-model.trim="item.ip" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.port')" :prop="'weightCmdArray.' + index + '.port'" :rules="rules.checkport">
              <el-input v-model.trim="item.port" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.weights')" :prop="'weightCmdArray.' + index + '.ipWeight'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
              <el-input v-model.trim="item.ipWeight" auto-complete="off" ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="dialog-footer text-center">
          <el-button type="primary" @click="changeEnsure('weightCmdform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="isweightCmdformClose">{{$t('lg.cancel')}}</el-button>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  components:{
    loading
  },
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      rules:{
        checkport:[{trigger:"blur",validator:this.validaport}]
      },
      upstreamlist:[],
      upstreamServerCheck:{},//服务器健康检查
      loadBalancingType:'',//查看服务器，当前服务器负载均衡类型,
      upstreamObj:{//以后有其他高级配置都可以加到这个对象里
        ntlmVal:''// ntlm长连接参数
      },

      upstreamlistmodalLoading:false,
      isShowChangeBalanceBox:false,
      isShowEditCmd:false,
      isIpWeight:false,//编辑负载均衡策略，权重弹框
      checkedTactics:'',
      ipTactics:[
        {
          value:'polling',
          name:this.$t('lg.polling')
        },{
          value:'least_conn',
          name:this.$t('lg.leastcon')
        },{
          value:'ip_weight',
          name:this.$t('lg.weights')
        }
      ],
      addStreamlistLoading:false,
      addStreamlistmodalShow:false,//添加服务器弹框
      upstreamform: {
        ip:'',
        ipPort:80,
        ipWeight:''
      },
      editStreamlistLoading:false,
      editCmdOldform:{},//编辑服务器临时容器,被编辑的当前IP
      editCmdform:{},//编辑服务器临时容器，编辑过的当前IP 
      weightCmdform:{//点选权重临时容器
        "weightCmdArray":[]
      },
      sureWeightArray:[],
      upstreamformRules:{
        ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        ipPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
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
        ],
        ipWeight:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      editCmdformRules:{
        ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        port:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
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
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ],
        ipWeight:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      
      upstreamCmdData:[],

      // 修改服务器健康检查参数
      isShowServerCheckBox:false,//健康检查显隐
      enableScCk:false,//是否开启了健康检查功能
      editSvCkfrom:{
        scInterval:null,
        scFall:null,
        scRise:null,
        scTimeout:null,
        scType:'tcp',
        checkHttpSendType:'GET',
        checkHttpSendTxt:'/',
        checkHttpExpectAlive:[],
      },
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
      editSvCkfromRules:{
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
          {pattern:/^([\w\-.\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.feiguifgs'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        checkHttpExpectAlive:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
      },

      //修改设置
      isShowHgSettingBox:false,//修改配置显隐
      editGradeSetform:{
        ntlmValule:'',
      },

      editGradeSetformRules:{
        ntlmValule:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
    }
  },
  watch:{
    //负载均衡策略
    "isShowChangeBalanceBox"(){
      if(this.isShowChangeBalanceBox){
        this.checkedTactics=this.loadBalancingType;
      }
    },
    "isShow"(){//监视弹框打开
      if(this.isShow){
        this.enableScCk = this.upstreamServerCheck.enabled || false;
        if(this.upstreamServerCheck.param){
          const upServerCheck = this.upstreamServerCheck.param;
          this.editSvCkfrom.scInterval = upServerCheck.interval/1000;
          this.editSvCkfrom.scFall = upServerCheck.fall;
          this.editSvCkfrom.scRise = upServerCheck.rise;
          this.editSvCkfrom.scTimeout = upServerCheck.timeout/1000;
          this.editSvCkfrom.scType = upServerCheck.type;
          if(upServerCheck.type=='http'){
            let sendTypeStr = upServerCheck.check_http_send;
            // console.log(sendTypeStr);
            let sendTypeArr = /^"(\S+)\s(\S+)/g.exec(sendTypeStr);
            // console.log(sendTypeArr)
            this.editSvCkfrom.checkHttpSendType = sendTypeArr[1];
            this.editSvCkfrom.checkHttpSendTxt = sendTypeArr[2];
            this.editSvCkfrom.checkHttpExpectAlive = upServerCheck.check_http_expect_alive.split(' ');
          }
        }
      }else{//清空 editSvCkfrom
          this.editSvCkfrom.scInterval = null;
          this.editSvCkfrom.scFall = null;
          this.editSvCkfrom.scRise = null;
          this.editSvCkfrom.scTimeout = null;
          this.editSvCkfrom.scType = 'tcp';
          this.editSvCkfrom.checkHttpSendType = 'GET';
          this.editSvCkfrom.checkHttpSendTxt = '/';
          this.editSvCkfrom.checkHttpExpectAlive = [];
        }
    },
    //修改配置
    "isShowHgSettingBox"(){
      if(this.isShowHgSettingBox){
        this.editGradeSetform.ntlmValule = this.upstreamObj.ntlmVal;
      }
    }
  },
  computed:{
    loadBalancingTypeTxt(){
      switch(this.loadBalancingType){
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
  methods:{
    validaport(rule, value, callback){
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }

    },
    getDmUpstreamlistData(){//查看服务器=>管理服务器
      return new Promise((resolve,reject)=>{
        var _this=this;
        if(_this.isAuto){
          var url=SERVER_API_URL+"pe/shadow/stream/server?autoconfig=true";
        }else if(_this.isEditConfig){
          var url=SERVER_API_URL+"pe/shadow/stream/server?savedConfig=true";
        }else{
          var url=SERVER_API_URL+"pe/shadow/stream/server";
        }

        axios.get(url,{
          params:{
            snodeId:_this.shadowObj.snodeId,
            streamName:_this.domainObj.domainName
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            var resArray=res.data.data;
            var totallist = [], ntlmVal = '', serverCheckObj={};
            // console.log(resArray[resArray.length-1])
            // console.log(Object.keys(resArray[resArray.length-1])[0]);
            resArray.forEach((item,index)=>{//如果有 ntlm长连接 得先把它从数组里面删除，并记录下它的值 //如果有 服务器健康检查 得先把它从数组里面删除，并记录下它的值
              if(item.hasOwnProperty('ntlm')){
             //   console.log("ntlm")
             //   console.log(item)
                ntlmVal=item.ntlm;
                resArray.splice(index,1);
              }
            })
            resArray.forEach((item,index)=>{//如果有 健康检查 得先把它从数组里面删除，并记录下它的值 //如果有 服务器健康检查 得先把它从数组里面删除，并记录下它的值
              if(item.hasOwnProperty('serverCheck')){
                 
                serverCheckObj=item.serverCheck;
                resArray.splice(index,1);
              }
            })

            // console.log(ntlmVal)
            // console.log(serverCheckObj)
            _this.upstreamObj.ntlmVal=ntlmVal;
            _this.upstreamServerCheck=serverCheckObj;
          //  console.log(Object.keys(resArray[resArray.length-1]))
            if(Object.keys(resArray[resArray.length-1])[0]=='server'){
              if(/\weight/.test(resArray[0]['server'])){
                _this.loadBalancingType='ip_weight';
                var reg = /(.*):(\d+)\s(?:weight=(.*))/;
                resArray.forEach(function(v,i){
                  var ipValue=reg.exec(v.server);
                  totallist.push({
                    ip:ipValue[1],
                    port:ipValue[2],
                    ipWeight:ipValue[3]
                  })
                })
              }else{
                _this.loadBalancingType='polling';
                resArray.forEach(function(v,i){
                  var vsip,vsport,vsipport;
                  if(v.server.indexOf("]:")>-1){
                    vsipport=v.server.split(']:');
                    vsip=vsipport[0]+"]";
                    vsport=vsipport[1];
                  }else{
                    vsipport=v.server.split(':');
                    vsip=vsipport[0];
                    vsport=vsipport[1];
                  }
                  totallist.push({
                    ip:vsip,
                    port:vsport
                  })
                })
              }
            }else if(Object.keys(resArray[resArray.length-1])[0]=='least_conn' || Object.keys(resArray[resArray.length-1])[0]=='ip_hash' || Object.keys(resArray[resArray.length-1])[0]=='xxf_hash'){
              _this.loadBalancingType=Object.keys(resArray[resArray.length-1])[0];
              resArray.splice(resArray.length-1,1);
              resArray.forEach(function(v,i){
                var vsip,vsport,vsipport;
                  if(v.server.indexOf("]:")>-1){
                    vsipport=v.server.split(']:');
                    vsip=vsipport[0]+"]";
                    vsport=vsipport[1];
                  }else{
                    vsipport=v.server.split(':');
                    vsip=vsipport[0];
                    vsport=vsipport[1];
                  }
                totallist.push({
                  ip:vsip,
                  port:vsport
                })
              })
            }

            // console.log(_this.loadBalancingType)
            // console.log(totallist)
            _this.upstreamlist=totallist;

            resolve(true);
          }else{
            _this.$message.error(_this.$t('lg.failed'));
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    upstreamlistmodalClose(){
      // this.$refs['editSvCkfrom'].resetFields();//不起作用
      this.$emit("setbyupstreamlistmodal",false);
      this.isShowChangeBalanceBox=false;
      this.isShowServerCheckBox=false;
      this.isShowHgSettingBox=false;
    },

    //添加负载均衡
    dmUpstreamModal(){//显示添加弹框
      this.addStreamlistmodalShow=true;
    },
    addStreamlistmodalClose(){//关闭添加弹框 取消
      this.upstreamCmdData=[];
      this.$refs['upstreamform'].resetFields();
      this.addStreamlistmodalShow=false;
    },
    addUpstreamCmd(formname){//加入预览表格
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.upstreamCmdData.push(this.upstreamform);
          this.upstreamform={//清空
            ip:'',
            ipPort:'',
            ipWeight:''
          }
        }
      });
    },
    deleAddCmd(item){//删除预览列表的服务器
      this.upstreamCmdData.splice(this.upstreamCmdData.indexOf(item),1);
    },
    submitupstreamCmd(){//确认添加
      var _this=this;
      _this.addStreamlistLoading=true;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;

      // 融入负载均衡
      var serverData=[];
      let LoadBalance = '';
      serverData = _this.upstreamCmdData.map(element=>{
        if(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(element.ip) && !/^\[|\]$/.test(element.ip)){
              element.ip='['+element.ip+']';
            }
        if(_this.loadBalancingType=='ip_weight'){
          LoadBalance = element.ip+':'+element.ipPort+' '+'weight='+element.ipWeight;
          return {"server":LoadBalance}
        }else{
          LoadBalance = element.ip+':'+element.ipPort;
          return {"server":LoadBalance}
        }
      })
      if(_this.loadBalancingType!=='polling' && _this.loadBalancingType!=='ip_weight'){
        serverData.push({
          [_this.loadBalancingType]:''
        })
      }
        
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/stream/server?autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/stream/server?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/stream/server";
      }
      var dataJson={
            snodeId:snodeId,
            streamName:domainName,
            servers:serverData
          };
      axios.post(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getDmUpstreamlistData();
          _this.addStreamlistmodalClose();
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
        _this.addStreamlistLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    //编辑服务器
    editCmd(item){//编辑负载均衡 编辑服务器
      this.isShowEditCmd=true;
      this.editCmdOldform=item;
      this.editCmdform=Object.assign({},item);//克隆对象  this.editCmdform=item;改变了原对象
    },
    isEditCmdClose(){
      this.isShowEditCmd=false;
    },
    editCmdEnsure(formname){//确认编辑
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.editStreamlistLoading=true;
          var snodeId=this.shadowObj.snodeId;
          var domainName=this.domainObj.domainName;
          var editOldObj = this.editCmdOldform;
          var editObj = this.editCmdform;
          if(this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/stream/server?autoconfig=true";
          }else if(this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/stream/server?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/stream/server";
          }

          var cmdData=[],srcParam='';
          if(this.loadBalancingType=='ip_weight'){
            var LoadBalance = editObj.ip+':'+editObj.port+' weight='+editObj.ipWeight;
            cmdData.push({
              "server":LoadBalance
            });
            srcParam = editOldObj.ip+':'+editOldObj.port+' weight='+editOldObj.ipWeight;
          }else{
            var LoadBalance = editObj.ip+':'+editObj.port;
            cmdData.push({
              "server":LoadBalance,
            });
            srcParam = editOldObj.ip+':'+editOldObj.port;
          }
          var dataJson={
              snodeId:snodeId,
              streamName:domainName,
              srcKey:'server',
              servers:cmdData,
              srcParam:srcParam
          };
          axios.patch(url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.getDmUpstreamlistData();
              this.isEditCmdClose();
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.editStreamlistLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    
    //删除服务器
    delCmd(item){//删除负载均衡 
      var _this=this;
      if(_this.upstreamlist.length==1){
        _this.$message.error(_this.$t('lg.leastinbs'));
        return;
      }
      _this.upstreamlistmodalLoading=true;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;
      var domainPort=_this.domainObj.port;
      if(item.ipWeight){
        var serversAtr = item.ip+":"+item.port+" weight="+item.ipWeight;
      }else{
        var serversAtr = item.ip+":"+item.port;
      }
      var serversObj={},
          serversArry=[];
      serversObj.server = serversAtr;
      serversArry.push(serversObj);
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/stream/server?autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/stream/server?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/stream/server";
      }
      var dataJson={
            data:{
              snodeId:snodeId,
              streamName:domainName,
              domainPort:domainPort,
              servers:serversArry
            }
          };
      axios.delete(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.upstreamlist.splice(_this.upstreamlist.indexOf(item),1);
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
        _this.upstreamlistmodalLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    
    //更改负载均衡策略
    changeBalance(){//显示所有策略选项
      this.isShowChangeBalanceBox=!this.isShowChangeBalanceBox;
    },
    isweightCmdformClose(){//关闭权重弹框
      this.isIpWeight=false;
      //this.$refs['weightCmdform'].resetFields();
      this.sureWeightArray=[];
      this.checkedTactics=this.loadBalancingType;
    },
    changeEnsure(formname){//权重弹框确认
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.sureWeightArray=this.weightCmdform.weightCmdArray.map(function(v){
            return {server:v.ip+':'+v.port+' weight='+v.ipWeight}
          });
          this.changeBalanceEnsure();
          this.isIpWeight=false;
        }
      });
    },
    changeBalanceEnsure(){//确认更改
      var _this = this;
      var balanceType=_this.checkedTactics;
      if(balanceType==_this.loadBalancingType){
        _this.$message.error(_this.$t('lg.selectdstategy'));
        return;
      }
      
      _this.upstreamlistmodalLoading=true;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;
      var cmdData=_this.upstreamlist;
      var newCmdData=[];

      cmdData.forEach(element=>{
        var newCmdStr = element.ip+':'+element.port;
        newCmdData.push({'server':newCmdStr});
      })

      if(balanceType=='ip_weight'){//当前选项为权重时
        if(_this.sureWeightArray.length==0){
          _this.upstreamlistmodalLoading=false;
          _this.weightCmdform.weightCmdArray =JSON.parse(JSON.stringify(_this.upstreamlist));
          _this.isIpWeight=true;
          return;
        }else{
          newCmdData =_this.sureWeightArray
        }
      }else if(balanceType!=='polling'){
        newCmdData.push({
          [balanceType]:''
        })
      }
      // console.log(newCmdData);
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/stream/server?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/stream/server?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/stream/server";
      }
      var dataJson={
            snodeId:snodeId,
            streamName:domainName,
            servers:newCmdData,
            srcKey:'',
            srcParam:'',
          };
      // console.log(dataJson)
      axios.patch(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.sureWeightArray=[];
          _this.getDmUpstreamlistData();
        }else{
          _this.$message.error(_this.$t('lg.failed'));
        }
        _this.upstreamlistmodalLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    
    // 服务器健康检查
    changeSverCheck(){
      this.isShowServerCheckBox=!this.isShowServerCheckBox;
    },
    editSvCkEnsure(flag){
      this.$refs['editSvCkfrom'].validate((valid) => {
        if(valid){
          const _this=this;
          var snodeId=_this.shadowObj.snodeId;
          var domainName=_this.domainObj.domainName;
          var port=_this.domainObj.port;

          _this.upstreamlistmodalLoading=true;

          if(_this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/server?autoconfig=true";
          }else if(_this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/server?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/server";
          }

          let serverCheckObj={};
          serverCheckObj={
            enabled:flag,
            param:{
              interval:_this.editSvCkfrom.scInterval*1000,//转化成毫秒
              fall:_this.editSvCkfrom.scFall,
              rise:_this.editSvCkfrom.scRise,
              timeout:_this.editSvCkfrom.scTimeout*1000,
              type:_this.editSvCkfrom.scType
            }
          }
          if(_this.editSvCkfrom.scType=='http'){
            serverCheckObj.param.check_http_send='\"' + _this.editSvCkfrom.checkHttpSendType + ' ' + `${_this.editSvCkfrom.checkHttpSendTxt || '/'}` + ' ' + 'HTTP/1.0\\r\\n\\r\\n' + '\"';
            serverCheckObj.param.check_http_expect_alive=_this.editSvCkfrom.checkHttpExpectAlive.join(' ');
          }    

          var dataJson={
                snodeId:snodeId,
                domainName:domainName,
                domainPort:port,
                serverCheck:serverCheckObj
              };
              
          // console.log(dataJson)
          axios.patch(url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              _this.enableScCk=flag;
              _this.getDmUpstreamlistData();
              _this.isShowServerCheckBox=false;
            }else{
              _this.$message.error(_this.$t('lg.failed'));
            }
            _this.upstreamlistmodalLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      });
    },

    // 高级配置
    gradeSetting(){
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
    },
    editGSEnsure(formname){
      this.$refs[formname].validate((valid) => {
        if(valid){
          const _this=this;

          _this.upstreamlistmodalLoading=true;

          var snodeId=_this.shadowObj.snodeId;
          var domainName=_this.domainObj.domainName;
          var port=_this.domainObj.port;
          // this.changeBalanceEnsure(true);

          if(this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/server?autoconfig=true";
          }else if(this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/server?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/server";
          }

          var ntlmVal='',newCmdData=[];
          ntlmVal=_this.editGradeSetform.ntlmValule;
          var enableNTLM=ntlmVal?true:false;

          ntlmVal && newCmdData.push({
            "ntlm":ntlmVal
          })

          var dataJson={
                snodeId:snodeId,
                domainName:domainName,
                domainPort:port,
                servers:newCmdData,
                enableNTLM:enableNTLM
              };
          axios.patch(url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getDmUpstreamlistData();
            }else{
              _this.$message.error(_this.$t('lg.failed'));
            }
            _this.upstreamlistmodalLoading=false;
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
.el-radio-group{
  margin-left: 10px;
  margin-bottom: 10px;
  vertical-align: baseline;
}
.el-radio{
  margin: 5px 25px 5px 0px;
}

.addIpBtn{
  position: absolute;
  right: 20px;
  top: 50px;
}
.myBalance,.myServerCheck{
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.ipTable{
  margin-top: 15px;
}
.changeBalance{
  cursor: pointer;
}
.changeBalanceBox,.serverCheckBox{
  border: 1px solid #ebeef5;
  padding: 20px 20px 20px 10px;
  margin-top: 20px;
}
.weightIpBox{
  padding: 20px;
  margin-bottom: 20px;
  border: 1px dashed #ccc;
}

/*服务器健康检查*/
/*高级配置*/
.gradeSettingBox{
  margin-top: 30px;
}
.gradeSettinginner{
  border: 1px solid #ebeef5;
  padding: 20px 20px 1px 0px;
  margin-bottom: 30px;
  position: relative;
}
.serverCheckTxt, .gradeSettingTxt{
  margin: 20px 0 10px 0;
}
</style>
