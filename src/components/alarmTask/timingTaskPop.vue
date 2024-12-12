<template>
  <div>
    <el-dialog :title="editTaskId?$t('lg.editalerting')+'--'+myTaskTypeTxt:$t('lg.arrangealerting')+'--'+myTaskTypeTxt" :visible.sync="isShow" width="60%" :before-close="setTimingTaskClose">
      <!-- <p>报警任务类型：{{myTaskType}}</p> -->
      <el-form :model="timingTaskform" ref="timingTaskform" label-width="160px" :rules="timingTaskformRules">
        <div v-if="isNeedRefreshAddTask && myTaskType=='esSearch' && alertmark==''"><!--创建自定义查询的报警任务，要分两步走，其他类型的报警则一步就能完成-->
          <my-query ref="myQuery" :isCustomQuery="false" :isClickNext="isClickNext" @editQueryStep="editQueryStep" @getTimeTaskResult="showNextStep"></my-query>
        </div>
        <div v-show="!isNextStep">
          <!-- 共有 -->
          <el-form-item :label="$t('lg.notifytype')" prop="noticeMethods"><!--通知方式-->
            <el-select v-model="timingTaskform.noticeMethods" style="width:35%" :disabled="isChartEdit && isRunning">
              <el-option :label="$t('lg.email')" value="email"></el-option>
            </el-select>
          </el-form-item>
          <div v-for="(item,index) in timingTaskform.recipients" :key="index"><!--收件人-->
            <el-form-item :label="index==0?$t('lg.recipient'):''" :prop="'recipients.' + index + '.recAdress'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,message: $t('lg.invalidemail'), trigger: 'blur'}]">
              <el-input v-model.trim="item.recAdress" :placeholder="$t('lg.recipientadd')" style="width:60%" :disabled="isChartEdit && isRunning"></el-input>
              <span @click="isChartEdit && isRunning?'':addRecipients()" :title="$t('lg.addrecipient')"><i class="el-icon-circle-plus-outline cursor-pointer"></i></span>
              <span @click="isChartEdit && isRunning?'':delRecipients(index)" :title="$t('lg.deleterecipient')"><i class="el-icon-close cursor-pointer"></i></span>
            </el-form-item>
          </div>
          <el-form-item :label="$t('lg.emailtitle')" prop="noticeTitle"><!--邮件标题-->
            <el-input v-model="timingTaskform.noticeTitle" :placeholder="$t('lg.emailtitle')" style="width:100%" :disabled="isChartEdit && isRunning"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.zhixingpl')" prop="rate"><!--执行频率-->
            <el-input v-model="timingTaskform.rate" :placeholder="$t('lg.frequency')" style="width:35%" :disabled="isChartEdit && isRunning"></el-input>
            <el-select v-model="rateUnitValue" placeholder="$t('lg.select')" style="width:25%" :disabled="isChartEdit && isRunning">
              <el-option
                v-for="item in rateUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> /{{$t('lg.count')}}
          </el-form-item>
          
          <!-- 独有 -->
          <el-form-item :label="$t('lg.shujulaiyuan')" prop="urlType" v-if="myTaskType=='urlCompare'">
            <el-select v-model="timingTaskform.urlType" :placeholder="$t('lg.select')" style="width:60%">
              <template v-for="item in urlTypeArr">
                <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('lg.domain')" prop="domain" v-if="myTaskType=='tokenTime' || myTaskType=='tokenCount' || myTaskType=='urlCompare' || alertmark=='maliciousAccess' || alertmark=='maliciousAccessOrg' || alertmark=='maliciousAttack'" :rules="alertmark=='maliciousAccess' || alertmark=='maliciousAccessOrg' || alertmark=='maliciousAttack'?[]:domainRule1"><!--页面-->
            <el-select v-model="timingTaskform.domain" :placeholder="$t('lg.select')" @visible-change="getDomains($event,myTaskType)" style="width:100%" :loading="$store.state.getEsDomainArrLoading">
              <template v-for="item in $store.state.esDomainArr">
                <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
              </template>
            </el-select>
            <!-- <el-input v-model.trim="timingTaskform.domain" :placeholder="$t('lg.inputdomain')"></el-input> -->
          </el-form-item>

          <!--地域-->
          <!-- <el-form-item :label="$t('lg.area')" prop="geoip" v-if="myTaskType=='tokenTime'">
            <el-select v-model="timingTaskform.geoip" :placeholder="$t('lg.select')" style="width:100%" @visible-change="getGEOIP($event)"> 
              <template v-for="item in timingTaskform.taskGeoipArr">
                <el-option :key="item" :label="item" :value="item"></el-option>
              </template>
            </el-select>
          </el-form-item> -->
          <el-form-item :label="$t('lg.yemian')" prop="url" v-if="myTaskType=='tokenTime' || myTaskType=='tokenCount'"><!--页面-->
            <el-select v-model="timingTaskform.url" :placeholder="$t('lg.select')" style="width:100%" clearable @visible-change="getUrls($event)" :loading="$store.state.getEsUrlArrLoading">
              <template v-for="item in $store.state.esUrlArr">
                <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.timefactor')" prop="multiple" v-if="myTaskType=='tokenTime'"><!--时间系数-->
            <el-input v-model="timingTaskform.multiple" :placeholder="$t('lg.timefactor')" style="width:60%"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.counts')" prop="counts" v-if="myTaskType!='esSearch' && myTaskType!='urlCompare' && myTaskType!='apiScan'"><!--次数-->
            <el-input v-model="timingTaskform.counts" :placeholder="$t('lg.counts')" style="width:60%"></el-input>
          </el-form-item>

          <el-form-item :label="$t('lg.threshold')" prop="condition" v-if="alertmark" :rules="alertmark=='maliciousAccess' || alertmark=='maliciousAccessOrg' || alertmark=='maliciousAttack'?conditionRule1:conditionRule2"><!--阈值-->
            <el-input v-model="timingTaskform.condition" :placeholder="$t('lg.plzenter')" style="width:60%" :disabled="isChartEdit && isRunning"></el-input><span v-show="alertmark=='maliciousAccess' || alertmark=='maliciousAccessOrg' || alertmark=='maliciousAttack'">/{{$t('lg.count')}}</span> <span v-show="alertmark=='cpuMax' || alertmark=='memoryMax' || alertmark=='diskRootMax' || alertmark=='diskRoot01Max' || alertmark=='cpu_cmMax' || alertmark=='memory_cmMax' || alertmark=='diskRoot_cmMax'  || alertmark=='diskRoot01_cmMax'">%</span> <span v-show="alertmark=='networkMax'">M</span>
          </el-form-item>

          <el-form-item :label="$t('lg.queryinterval')" prop="timeInterval" v-if="myTaskType!='urlCompare'"><!--查询间隔-->
            <el-input v-model.trim="timingTaskform.timeInterval" :placeholder="$t('lg.queryinterval')" style="width:35%" :disabled="isChartEdit && isRunning"></el-input>
            <el-select v-model="timeIntervalUnitVal" :placeholder="$t('lg.select')" style="width:25%" :disabled="isChartEdit && isRunning">
              <el-option
                v-for="item in timeIntervalUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('lg.shifoufasongyouj')" prop="apiScanSwitch" v-if="myTaskType=='apiScan'" label-width="100px"><!--是否发送邮件-->
            <el-switch v-model="timingTaskform.apiScanSwitch" ></el-switch>
          </el-form-item>

          <el-form-item :label="$t('lg.shifouurljpz')" prop="addToConfigSwitch" v-if="myTaskType=='urlCompare'" label-width='130px'><!--是否发送邮件-->
            <el-switch v-model="timingTaskform.addToConfigSwitch" ></el-switch>
          </el-form-item>
          <div class="orderBoxJamb" v-if="timingTaskform.addToConfigSwitch">
            <el-form-item :label="$t('lg.shoudongdailifyszmrz')" prop="dfRequestTimeVal" v-if="myTaskType=='urlCompare'" label-width='180px'><!--是否发送邮件-->
              <el-input v-model="timingTaskform.dfRequestTimeVal" placeholder="$t('lg.shoudongdailifycs')" style="width:35%"></el-input>
              <el-select v-model="requestTimeUnitVal" :placeholder="$t('lg.select')" style="width:25%">
                <el-option
                  v-for="item in requestTimeUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lg.liulqcszbmrz')" prop="dfVerifyBrowserVal" v-if="myTaskType=='urlCompare'" label-width='180px'><!--浏览器参数指标-->
              <el-input v-model="timingTaskform.dfVerifyBrowserVal" :placeholder="$t('lg.liulqcszbmrz')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.yonghuxingweizbmrz')" prop="dfVerifyAgentVal" v-if="myTaskType=='urlCompare'" label-width='180px'><!--用户行为指标-->
              <el-input v-model="timingTaskform.dfVerifyAgentVal" :placeholder="$t('lg.yonghuxingweizbmrz')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.dongtaizhiwengnkaimr')" prop="dfVerifyTokenSwitch" v-if="myTaskType=='urlCompare'" label-width='180px'><!--开启动态指纹功能-->
              <el-switch v-model="timingTaskform.dfVerifyTokenSwitch" ></el-switch>
            </el-form-item>
          </div>
          <el-form-item :label="$t('lg.shijiand1')" prop="timeStrInterval" v-if="myTaskType=='urlCompare'"><!--时间段一-->
            <el-input v-model="timingTaskform.timeStrInterval" :placeholder="$t('lg.interval')" style="width:35%"></el-input>
            <el-select v-model="strIntervalUnitVal" :placeholder="$t('lg.select')" style="width:25%">
              <el-option
                v-for="item in timeIntervalUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.shijiand2')" prop="timeLteInterval" v-if="myTaskType=='urlCompare'"><!--时间段二-->
            <el-input v-model="timingTaskform.timeLteInterval" :placeholder="$t('lg.interval')" style="width:35%"></el-input>
            <el-select v-model="lteIntervalUnitVal" :placeholder="$t('lg.select')" style="width:25%">
              <el-option
                v-for="item in timeIntervalUnit"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span>({{$t('lg.zhu31')}})</span>
          </el-form-item>
          
          <!--性能监控图表上的报警任务 显示当前报警任务状态-->
          <el-form-item v-show="isChartEdit && !isRunning">
            <span class="el-icon-warning font-red" style="margin-right:20px"> <i></i> {{$t('lg.stop')}} </span>
            <el-button type="primary" @click="startTimingTask()"> {{$t('lg.startalerting')}}</el-button>
          </el-form-item>

          <el-form-item v-show="isChartEdit && isRunning">
            <span class="el-icon-success font-green" style="margin-right:20px"> <i></i> {{$t('lg.running')}} </span>
            <el-button type="primary" @click="stopAlertSetting()"> {{$t('lg.stopalerting')}}</el-button>
          </el-form-item>

          <el-form-item v-if="!isChartEdit && !isRunning">
            <el-button type="primary" @click="startTimingTask()">{{$t('lg.yes')}}</el-button>
            <el-button @click="setTimingTaskClose()">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </div>
      </el-form>  
      <loading v-show="opTaskPopLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import * as types from '@/store/types';
import {SERVER_API_URL} from '@/conf/constvar';
import client from "@/components/es/connection";
// import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import loading from '@/components/loading/loading';
import myQuery from '@/components/behavior/myQuery';
import prmoSearchStr from '@/assets/js/prmoSearch.js'//防护模式、监控模式 不同的查询条件 这里目前只用到防护模式

export default{
  components:{
    loading,
    myQuery
  },
  props:{
    isShow:{
      type:Boolean
    },
    isNeedRefreshAddTask:{
      type:Boolean
    },
    myTaskType:{//传入的报警任务的类型
      type:String
    },
    myTaskTypeTxt:{//传入的报警任务的类型对应的中文
      type:String
    },
    alertmark:{
      type:String
    },
    isRunning:{
      type:Boolean
    },
    isChartEdit:{
      type:Boolean
    },
    isOrgFlag:{//恶意访问有 源IP 和 代理IP 的区分，如果是
      type:Boolean
    },
    isShowTimingTaskEdit:{//作为watch的监控对象，存在则表示 ‘编辑’ 邮件报警任务
      type:Boolean
    },
    editData:{//被编辑的对象
      type:Object
    },
    editTaskId:{//编辑的对象的id
      type:String
    },
    querydata:{
      type:Object
    },
    qJsondata:{
      type:Object
    },
    hasNextStep:{
      type:Boolean
    }
  },
  data(){
    return{
      isNextStep:false,
      isNotCustomQuery:false,
      passDiyquery:'',
      passDiyparams:{},
      isClickNext:false,
      
      opTaskPopLoading:false,
      timingTaskform:{ 
        noticeMethods:'email',
        recipients:[{
          recAdress:''
        }],
        noticeTitle:'',
        
        domain:'',
        apiScanSwitch:false,
        // geoip:'',
        url:'',
        multiple:'',
        counts:'',
        // domainArr:[],
        // taskGeoipArr:[],
        // taskUrlArr:[],
        rate:'',
        timeInterval:'',

        urlType:0,
        timeStrInterval:'',
        timeLteInterval:'',
        addToConfigSwitch:false,
        dfRequestTimeVal:'',
        dfVerifyBrowserVal:'',
        dfVerifyAgentVal:'',
        dfVerifyTokenSwitch:false,

        query:'',
        logId:'',
        tmpsArray:[],
        metricId:'',
        symbol2Id:'',
        metricinputId:'',
        aggsId:'',
        monThreshold:'',//带单位的阈值
        condition:'',//阈值
        alertmark:''
      },

      urlTypeArr:[
        {
          value:0,
          label:this.$t('lg.yemian')
        },
        {
          value:1,
          label:this.$t('lg.apiinterface')
        }
      ],

      rateUnit:[
        {
          value: 'm',
          label: this.$t('lg.minite')
        }, 
        {
          value: 'h',
          label: this.$t('lg.hour')
        }, {
          value: 'd',
          label: this.$t('lg.day')
        }, {
          value: 'w',
          label: this.$t('lg.week')
        },{
          value: 'y',
          label: this.$t('lg.year')
        }
      ],
      rateUnitValue:'m',

      timeIntervalUnit:[
        {
          value: 's',
          label: this.$t('lg.second')
        }, 
        {
          value: 'm',
          label: this.$t('lg.minite')
        }, 
        {
          value: 'h',
          label: this.$t('lg.hour')
        }, {
          value: 'd',
          label: this.$t('lg.day')
        }
      ],
      timeIntervalUnitVal:'s',
      strIntervalUnitVal:'h',
      lteIntervalUnitVal:'h',
      requestTimeUnit:[{//手动代理防御设置 时间单位
        label:this.$t('lg.ms'),
        value:'ms'
      },{
        label:this.$t('lg.second'),
        value:'s'
      }],
      requestTimeUnitVal:'ms',
      
      timingTaskformRules:{
        noticeMethods:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'}
        ],
        noticeTitle:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'}
        ],

        urlType:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'}
        ],
        // domain: [
        //   {required: true, message: '请选择Domain', trigger: 'change'}
        // ],
        // geoip: [
        //   {required: true, message: this.$t('lg.select'), trigger: 'change'}
        // ],
        url: [
          // {required: true, message: this.$t('lg.select'), trigger: 'change'}
        ],
        multiple:[
          {required: true, message: this.$t('lg.inputtimefactor'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        counts:[
          {required: true, message: this.$t('lg.inputcounts'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        rate:[
          {required: true, message: this.$t('lg.inputfrequency'), trigger: 'change'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        timeInterval:[
          {required: true, message: this.$t('lg.inputinterval'), trigger: 'change'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],

        dfRequestTimeVal:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        dfVerifyBrowserVal:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        dfVerifyAgentVal:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        timeStrInterval:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        timeLteInterval:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        // condition:[
        //   {required: true, message: '请填写阈值', trigger: 'change'},
        //   {pattern:/^[1-9]\d*$/,message: '必须为大于0的整数数值', trigger: 'change'}
        // ]
      },
      domainRule1: [
        {required: true, message: this.$t('lg.select'), trigger: 'change'}
      ],
      conditionRule1:[
        {required: true, message: this.$t('lg.threshold'), trigger: 'change'},
        {pattern:/^[1-9]\d*$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
      ],
      conditionRule2:[
        {required: true, message: this.$t('lg.threshold'), trigger: 'change'},
        {pattern:/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
      ],
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        if(this.hasNextStep){
          this.isNextStep=true;
        }else{
          this.isNextStep=false;
        }
      }
    },
    "isShowTimingTaskEdit":function(){//给弹框赋值当前被编辑的对象
      if(this.isShowTimingTaskEdit){
        // console.log(this.editData); 
        var rate = this.editData.rate - 0;
        var rateUnitValue = this.editData.rateUnitValue;
        var mailRecipientArray = this.editData.params.mailRecipient,recipientsArray=[];
        mailRecipientArray.forEach(function(v,i){
          recipientsArray.push({
            recAdress:v
          })
        });
        this.timingTaskform.recipients = recipientsArray;
        this.timingTaskform.noticeTitle = this.editData.params.mailSubject;
        this.timingTaskform.rate = rate;
        this.rateUnitValue = rateUnitValue;
      
        if(this.myTaskType!="urlCompare"){
          var timeInterval = this.editData.params.timeInterval - 0;
          var timeIntervalUnitVal = this.editData.params.intervalUnitVal;
          this.timingTaskform.timeInterval = timeInterval;
          this.timeIntervalUnitVal = timeIntervalUnitVal;
        }

        if(this.myTaskType=="tokenTime"){
          this.timingTaskform.domain = this.editData.params.domain;
          this.timingTaskform.url = this.editData.params.url=='*'?'':this.editData.params.url;
          this.timingTaskform.multiple = this.editData.params.times - 0;
          this.timingTaskform.counts = this.editData.params.count - 0;
        }else if(this.myTaskType=="tokenCount"){
          this.timingTaskform.domain = this.editData.params.domain;
          this.timingTaskform.url = this.editData.params.url=='*'?'':this.editData.params.url;
          this.timingTaskform.counts = this.editData.params.count - 0;
        }else if(this.myTaskType=="esSearch"){//自定义查询的指纹黑名单,查询语句不能编辑但要在页面上展示，先保存下来，修改自定义查询报警任务时原样作为参数传入
          this.timingTaskform.query = this.editData.params.query;

          if(!this.editData.params.alertmark){//自定义查询报警
            this.timingTaskform.logId = this.editData.params.logId;
            this.timingTaskform.tmpsArray = this.editData.params.tmpsArray;
            this.timingTaskform.metricId = this.editData.params.metricId;
            this.timingTaskform.symbol2Id = this.editData.params.symbol2Id;
            this.timingTaskform.metricinputId = this.editData.params.metricinputId;
            this.timingTaskform.aggsId = this.editData.params.aggsId;
          }else{//图表报警 ：修改图表报警功能参数，图表报警功能的参数仅限于在这个组件里面修改。不能在此添加
            this.timingTaskform.alertmark = this.editData.params.alertmark;

            if(this.editData.params.domainName){
              this.timingTaskform.domain = this.editData.params.domainName;
            }

            var monThreshold =this.editData.params.monThreshold;
            if(monThreshold){ //针对性能监控阀值可能有百分号以及M单位的情况
              this.timingTaskform.monThreshold = monThreshold;
              if(monThreshold.indexOf('%')!=-1){
                this.timingTaskform.condition = monThreshold.replace('%','')
              }else if(monThreshold.indexOf('M')!=-1){
                this.timingTaskform.condition = monThreshold.replace('M','')
              }else{
                this.timingTaskform.condition = monThreshold;
              }
            }else if(this.editData.params.minDocCount){
              this.timingTaskform.condition = this.editData.params.minDocCount;
            }
          }
        }else if(this.myTaskType=="urlCompare"){
          this.timingTaskform.urlType = this.editData.params.apiIndicator;
          this.timingTaskform.domain = this.editData.params.domainName;

          this.timingTaskform.timeStrInterval =this.editData.params.timeStrInterval-0;
          this.strIntervalUnitVal = this.editData.params.strIntervalUnitVal;

          this.timingTaskform.timeLteInterval = this.editData.params.timeLteInterval-0;
          this.lteIntervalUnitVal = this.editData.params.lteIntervalUnitVal;

          const addToConfig = this.editData.params.addToConfig;
          this.timingTaskform.addToConfigSwitch = addToConfig;
          if(addToConfig){
            this.timingTaskform.dfRequestTimeVal = this.editData.params.dfRequestTimeVal;
            this.requestTimeUnitVal = this.editData.params.requestTimeUnitVal;
            this.timingTaskform.dfVerifyBrowserVal = this.editData.params.defaultVerifyBrowser;
            this.timingTaskform.dfVerifyAgentVal = this.editData.params.defaultVerifyAgent;
            this.timingTaskform.dfVerifyTokenSwitch = this.editData.params.defaultVerifyToken=='1'?true:false;
          }else{
            this.timingTaskform.dfRequestTimeVal = '';
            this.requestTimeUnitVal = 'ms';
            this.timingTaskform.dfVerifyBrowserVal = '';
            this.timingTaskform.dfVerifyAgentVal = '';
            this.timingTaskform.dfVerifyTokenSwitch = false;
          }

        }else if(this.myTaskType=="apiScan"){
          this.timingTaskform.apiScanSwitch = this.editData.params.notification;
        }
      }
    },
  },
  methods:{
    setTimingTaskClose(){//关闭弹框
      this.isClickNext=false;
      this.$refs['myQuery'] && this.$refs['myQuery'].customQueryClose();//调用子组件的方法，清空自定义的查询语句
      
      this.$refs['timingTaskform'].resetFields();
      this.timingTaskform.recipients.length=1;
      this.$emit('setTimingTaskClose',false);//关闭弹框
    },
    addRecipients(){//增加更多收件人
      this.timingTaskform.recipients.push({
        recAdress:''
      })
    },
    delRecipients(index){//删除多余收件人
      if(this.timingTaskform.recipients.length>1){
        this.timingTaskform.recipients.splice(index,1);
      }
    },
    getDomains(callback,type) {//获取域名数据
      if(callback){
        this.timingTaskform.domain='';
        this.timingTaskform.url="";
        if(type=='tokenTime' || type=='tokenCount'){
          this.$store.commit(types.GETESDOMAINS,true);
        }else{
          this.$store.commit(types.GETESDOMAINS);
        }
      }
    },
   // getGEOIP(callback){//基于访问时间获取区域数据
    //   if(callback){
    //     var _this=this;
    //     var sttime=_this.$store.state.mydatedata.starttime,
    //         edtime=_this.$store.state.mydatedata.endtime;
    //     var fromTime2=toISO8601(sttime),
    //         endTime2=toISO8601(edtime);
    //     var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
    //         endTime=endTime2 || toISO8601(new Date());
    //     var domainVal = _this.timingTaskform.domain;
    //         _this.timingTaskform.geoip="";
    //     client.search({
    //       index:"shadow-filebeat*",
    //       body:{
    //         "size": 0,
    //         "query": {
    //           "bool": {
    //             "must": [
    //               {
    //                 "query_string": {
    //                   "query": "shadow.access.error_code:0"
    //                 }
    //               },
    //               {
    //                 "query_string": {
    //                   "query": "shadow.access.decrypted:1"
    //                 }
    //               },
    //               {
    //                 "term": {
    //                   "shadow.access.domain": domainVal
    //                 }
    //               },
    //               {
    //                 "range": {
    //                   "@timestamp": {
    //                     "gte": fromTime,
    //                     "lte": endTime,
    //                   }
    //                 }
    //               }
    //             ],
    //             "must_not": [
    //               {
    //                 "match": {
    //                   "shadow.access.token": "00000000000000000000000000000000"
    //                 }
    //               },{
    //                 "match": {
    //                   "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    //                 }
    //               }
    //             ]
    //           }
    //         },
    //         "aggs": {
    //           "geo": {
    //             "terms": {
    //               "script": {
    //                 "inline": "params._source.shadow.access.geoip",
    //                 "lang": "painless"
    //               },
    //               "size": 100
    //             },
    //             "aggs": {
    //               "geoip": {
    //                 "scripted_metric": {
    //                   "init_script": "params._agg.geoip = []",
    //                   "map_script": "params._agg.geoip.add(params._source.shadow.access.geoip)",
    //                   "combine_script": "ArrayList list=new ArrayList(); for (s in params._agg.geoip) { list.add(s); } return list",
    //                   "reduce_script": "return params._aggs.get(0)"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }).then((res)=>{
    //       // console.log(res);
    //       var buckets=res.aggregations.geo.buckets;
    //       var result=[];
    //       for(var i=0;i<buckets.length;i++){
    //         var dataI=buckets[i];
    //         if(dataI.geoip.value[0].city_name){
    //           result.push(dataI.geoip.value[0].city_name)
    //         }
    //       }
    //       console.log(result);
    //       _this.timingTaskform.taskGeoipArr=result;
    //     });
    //   }
   // },
    getUrls(callback){//基于访问时间、访问次数获取页面数据 获取url数据
      if(callback){
        this.timingTaskform.url="";
        var domainVal = this.timingTaskform.domain;
        this.$store.commit(types.GETESURLS,{domain:domainVal,flag:true});
      }
    },
    startTimingTask(){//安排报警任务 || 修改报警任务
      this.$refs['timingTaskform'].validate((valid)=>{
        if(valid){
          var _this=this;
          _this.opTaskPopLoading=true;
          var frequency = _this.timingTaskform.rate + _this.rateUnitValue;
          var mailRecipientArray=_this.timingTaskform.recipients,mailRecipient=[];
          mailRecipientArray.forEach(function(v,i){
            mailRecipient.push(v.recAdress);
          })
          let params={};
          if(_this.myTaskType=="tokenTime"){
            params = {
              notificationType:_this.timingTaskform.noticeMethods,
              mailRecipient:mailRecipient,
              mailSubject:_this.timingTaskform.noticeTitle,
              "notificationTemplateType" : "EMTMP_Token",
              "notificationTemplateName" : "EMTMP-generic.html",
              "tokenTile" : _this.$t('lg.tokenblacklist'),
              "tokenDesc" : _this.$t('lg.tokenblacklistupdate'),
              domain: _this.timingTaskform.domain,
              url: _this.timingTaskform.url||'*',
              times: _this.timingTaskform.multiple,
              count: _this.timingTaskform.counts,
              interval:_this.timingTaskform.timeInterval + _this.timeIntervalUnitVal
            }
          }else if(_this.myTaskType=="tokenCount"){
            params = {
              notificationType:_this.timingTaskform.noticeMethods,
              mailRecipient:mailRecipient,
              mailSubject:_this.timingTaskform.noticeTitle,
              "notificationTemplateType" : "EMTMP_Token",
              "notificationTemplateName" : "EMTMP-generic.html",
              "tokenTile" : _this.$t('lg.tokenblacklist'),
              "tokenDesc" : _this.$t('lg.tokenblacklistupdate'),
              domain: _this.timingTaskform.domain,
              url: _this.timingTaskform.url||'*',
              count: _this.timingTaskform.counts,
              interval:_this.timingTaskform.timeInterval + _this.timeIntervalUnitVal
            }
          }else if(_this.myTaskType=="esSearch"){
            if(_this.editTaskId){//自定义查询的指纹黑名单,查询语句不能编辑但要在页面上展示，修改报警任务时把保存下来的查询语句作为参数原样传入
              params = {
                notificationType:_this.timingTaskform.noticeMethods,
                mailRecipient:mailRecipient,
                mailSubject:_this.timingTaskform.noticeTitle,
                // query:_this.timingTaskform.query,
                interval:_this.timingTaskform.timeInterval + _this.timeIntervalUnitVal,
              }

              if(!_this.timingTaskform.alertmark){ //自定义查询

                params.query=_this.timingTaskform.query;

                params.notificationTemplateType='EMTMP_ES';
                params.notificationTemplateName='EMTMP-es-query.html';
                params.esTitle=_this.$t('lg.zidingyi');

                params.logId=_this.timingTaskform.logId;//这里及以下主要用来作为报警任务里 任务参数 的展示数据。先把这些数据传给后台，等到查看报警任务页面再取出
                params.tmpsArray=_this.timingTaskform.tmpsArray;
                params.metricId=_this.timingTaskform.metricId;
                params.symbol2Id=_this.timingTaskform.symbol2Id;
                params.metricinputId=_this.timingTaskform.metricinputId;
                params.aggsId=_this.timingTaskform.aggsId;

                if(_this.timingTaskform.logId=='waf.log' || _this.timingTaskform.logId=='error.log'){
                  params.isLocalTimestamp=true;
                }
              }else{//图表报警 
                params.alertmark=_this.timingTaskform.alertmark;
                // console.log(_this.timingTaskform.alertmark) //maliciousAccess、maliciousAccessOrg、maliciousAttack、cpuMax、memoryMax、networkMax
                if(_this.timingTaskform.alertmark=='maliciousAccess' || _this.timingTaskform.alertmark=='maliciousAccessOrg'){

                  var queryObj = JSON.parse(_this.timingTaskform.query);
                  if(_this.timingTaskform.domain){
                    var queryDomain ='\"'+ _this.timingTaskform.domain+'\"'
                  }else{
                    var queryDomain ="*";
                  }
                  queryObj.query.bool.must[1].query_string.query="shadow.access.domain:"+queryDomain;
                  queryObj.aggs.groupByIp.aggs.groupByDomain.terms.min_doc_count=_this.timingTaskform.condition;

                  params.query=JSON.stringify(queryObj);
                  params.domainName= _this.timingTaskform.domain;
                  params.minDocCount=_this.timingTaskform.condition;
                  params.notificationTemplateType='EMTMP_Acc';
                  params.notificationTemplateName='EMTMP-access-alert.html';
                  params.accType=_this.$t('lg.fangwen');
                }else if(_this.timingTaskform.alertmark=='maliciousAttack'){

                  var queryObj = JSON.parse(_this.timingTaskform.query);
                  if(_this.timingTaskform.domain){
                    var queryDomain ='\"'+ _this.timingTaskform.domain+'\"'
                  }else{
                    var queryDomain ="*";
                  }
                  queryObj.query.bool.must[1].query_string.query="shadow.waf.host:"+queryDomain;
                  queryObj.aggs.groupByIp.aggs.groupByDomain.terms.min_doc_count=_this.timingTaskform.condition;

                  // console.log(JSON.stringify(queryObj));
                  params.query=JSON.stringify(queryObj);
                  params.domainName= _this.timingTaskform.domain;
                  params.minDocCount=_this.timingTaskform.condition;
                  params.notificationTemplateType='EMTMP_Acc';
                  params.notificationTemplateName='EMTMP-access-alert.html';
                  params.accType=_this.$t('lg.gongji');
                  params.isLocalTimestamp=true;
                }
                else if(_this.timingTaskform.alertmark=='cpuMax' || _this.timingTaskform.alertmark=='cpu_cmMax'){// params.query的修改：由于阀值能被修改，所有其对应的es查询语句也要修改，（阀值是对应的查询语句里面的变量，目前只有性能图表才设有阀值）

                  var queryObj = JSON.parse(_this.timingTaskform.query);
                  queryObj.aggs.groupbyhost.aggs.time_histo.aggs.avg_filter.bucket_selector.script="params.total_avg > "+ _this.timingTaskform.condition/100;
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType='CPU';

                  if(_this.alertmark=='cpuMax'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }

                }else if(_this.timingTaskform.alertmark=='memoryMax' || _this.timingTaskform.alertmark=='memory_cmMax'){

                  var queryObj = JSON.parse(_this.timingTaskform.query);
                  queryObj.aggs.groupbyhost.aggs.time_histo.aggs.avg_filter.bucket_selector.script="params.total_avg > "+ _this.timingTaskform.condition/100;
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.memory');
                  if(_this.alertmark=='memoryMax'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }
                }else if(_this.timingTaskform.alertmark=='networkMax'){
                  
                  // var queryObj = JSON.parse(_this.timingTaskform.query);//写法一
                  // queryObj.aggs.groupByHost.aggs.time_histo.aggs.avg_filter.bucket_selector.script="params.total_avg > "+_this.timingTaskform.condition*1024*1024;

                  //写法二
                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"from":"fromTimestamp","to":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"network"}},{"term":{"system.network.name":"eth0"}}]}},"aggs":{"groupByHost":{"terms":{"field":"host.hostname"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"10s"},"aggs":{"in_sum":{"avg":{"field":"system.network.in.bytes"}},"out_sum":{"avg":{"field":"system.network.out.bytes"}},"total_sum":{"bucket_script":{"buckets_path":{"in_sum":"in_sum","out_sum":"out_sum"},"script":"params.in_sum+params.out_sum"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg > "+_this.timingTaskform.condition*1024*1024}}}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'M';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.network');
                }else if(_this.timingTaskform.alertmark=='diskRootMax' || _this.timingTaskform.alertmark=='diskRoot01Max' || _this.timingTaskform.alertmark=='diskRoot_cmMax' || _this.timingTaskform.alertmark=='diskRoot01_cmMax'){
                  var mountPoint = '';
                  if(_this.timingTaskform.alertmark=='diskRootMax' || _this.timingTaskform.alertmark=='diskRoot_cmMax'){
                    mountPoint = '/';
                  }else if(_this.timingTaskform.alertmark=='diskRoot01Max' || _this.timingTaskform.alertmark=='diskRoot01_cmMax'){
                    mountPoint = '/home';
                  }
                  
                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"filesystem"}},{"term":{"system.filesystem.mount_point":mountPoint}}]}},"aggs":{"groupbyhost":{"terms":{"field":"host.hostname","min_doc_count":"0"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"5m"},"aggs":{"total_sum":{"max":{"field":"system.filesystem.used.pct"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg >"+_this.timingTaskform.condition/100}}}}}}}}
                  params.query=JSON.stringify(queryObj);
                  
                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.docsystem')+'('+mountPoint+')';

                  if(_this.alertmark=='diskRootMax' || _this.alertmark=='diskRoot01Max'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }
                }
              }
                  
            }else{
              params = {
                notificationType:_this.timingTaskform.noticeMethods,
                mailRecipient:mailRecipient,
                mailSubject:_this.timingTaskform.noticeTitle,
                // query:JSON.stringify(_this.qJsondata),
                interval:_this.timingTaskform.timeInterval + _this.timeIntervalUnitVal,
              }
                  
              if(!_this.alertmark){ //自定义查询
                
                params.notificationTemplateType='EMTMP_ES';
                params.notificationTemplateName='EMTMP-es-query.html';
                params.esTitle=_this.$t('lg.zidingyi');

                if(_this.isNotCustomQuery){//从邮件报警处安排
                  params.query=JSON.stringify(_this.passDiyquery),
                  params.logId=_this.passDiyparams.logId;//这里及以下主要用来作为报警任务里 任务参数 的展示数据。先把这些数据传给后台，等到查看报警任务页面再取出
                  params.tmpsArray=_this.passDiyparams.tmpsArray;
                  params.metricId=_this.passDiyparams.metricId;
                  params.symbol2Id=_this.passDiyparams.symbol2Id;
                  params.metricinputId=_this.passDiyparams.metricinputId;
                  params.aggsId=_this.passDiyparams.aggsId;
                  if(_this.passDiyparams.logId=='waf.log' || _this.passDiyparams.logId=='error.log'){
                    params.isLocalTimestamp=true;
                  }
                }else{//从自定义查询处安排
                  params.query=JSON.stringify(_this.qJsondata),
                  params.logId=_this.querydata.logId;//这里及以下主要用来作为报警任务里 任务参数 的展示数据。先把这些数据传给后台，等到查看报警任务页面再取出
                  params.tmpsArray=_this.querydata.tmpsArray;
                  params.metricId=_this.querydata.metricId;
                  params.symbol2Id=_this.querydata.symbol2Id;
                  params.metricinputId=_this.querydata.metricinputId;
                  params.aggsId=_this.querydata.aggsId;
                  if(_this.querydata.logId=='waf.log' || _this.querydata.logId=='error.log'){
                    params.isLocalTimestamp=true;
                  }
                }
                // console.log(params.query)
                // console.log(params)

              }else{//图表报警 
                params.alertmark=_this.alertmark;
                if(_this.alertmark=='maliciousAccess'){//恶意访问 源 IP 的报警任务

                  if(_this.timingTaskform.domain){
                    var queryDomain ='\"'+ _this.timingTaskform.domain+'\"'
                  }else{
                    var queryDomain ="*";
                  }
                  var queryObj={"size":0,"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp"}}}],"must":[{"query_string":{"query":"shadow.access.domain:"+queryDomain}}]}},"aggs":{"groupByIp":{"terms":{"field":"shadow.access.remote_ip"},"aggs":{"groupByDomain":{"terms":{"field":"shadow.access.domain","min_doc_count":_this.timingTaskform.condition}}}}}}
                  queryObj.query.bool.must.unshift(...prmoSearchStr['protectChart']['a1']); 
                  params.query=JSON.stringify(queryObj);

                  params.domainName= _this.timingTaskform.domain;
                  params.minDocCount=_this.timingTaskform.condition;
                  params.notificationTemplateType='EMTMP_Acc';
                  params.notificationTemplateName='EMTMP-access-alert.html';
                  params.accType=this.$t('lg.fangwen');
                }else if(_this.alertmark=='maliciousAccessOrg'){ //恶意访问 代理IP 的报警任务

                  if(_this.timingTaskform.domain){
                    var queryDomain ='\"'+ _this.timingTaskform.domain+'\"'
                  }else{
                    var queryDomain ="*";
                  }
                  var queryObj={"size":0,"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp"}}}],"must":[{"query_string":{"query":"shadow.access.domain:"+queryDomain}}]}},"aggs":{"groupByIp":{"terms":{"field":"shadow.access.org_remote_ip"},"aggs":{"groupByDomain":{"terms":{"field":"shadow.access.domain","min_doc_count":_this.timingTaskform.condition}}}}}}
                  queryObj.query.bool.must.unshift(...prmoSearchStr['protectChart']['a1']);
                 
                  params.query=JSON.stringify(queryObj);
                  
                  params.domainName= _this.timingTaskform.domain;
                  params.minDocCount=_this.timingTaskform.condition;
                  params.notificationTemplateType='EMTMP_Acc';
                  params.notificationTemplateName='EMTMP-access-alert.html';
                  params.accType=this.$t('lg.fangwen');
                }else if(_this.alertmark=='maliciousAttack'){//恶意攻击 的报警任务

                  if(_this.timingTaskform.domain){
                    var queryDomain ='\"'+ _this.timingTaskform.domain+'\"'
                  }else{
                    var queryDomain ="*";
                  }
                  var queryObj={"size":0,"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp"}}}],"must":[{"term":{"log.file.path":"/usr/local/shadow/logs/shadow_waf.log"}},{"query_string":{"query":"shadow.waf.host:"+queryDomain}}]}},"aggs":{"groupByIp":{"terms":{"field":"shadow.waf.clientip"},"aggs":{"groupByDomain":{"terms":{"field":"shadow.waf.host","min_doc_count":_this.timingTaskform.condition}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.domainName= _this.timingTaskform.domain;
                  params.minDocCount=_this.timingTaskform.condition;
                  params.notificationTemplateType='EMTMP_Acc';
                  params.notificationTemplateName='EMTMP-access-alert.html';
                  params.accType=this.$t('lg.gongji');
                  params.isLocalTimestamp=true;
                }else if(_this.alertmark=='cpuMax' || _this.alertmark=='cpu_cmMax'){ //cpu 邮件报警任务
                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"cpu"}}]}},"aggs":{"groupbyhost":{"terms":{"field":"host.hostname","min_doc_count":"0"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"5m"},"aggs":{"total_sum":{"avg":{"field":"system.cpu.system.pct"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg > "+_this.timingTaskform.condition/100}}}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType='CPU';

                  if(_this.alertmark=='cpuMax'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }
                  
                }else if(_this.alertmark=='memoryMax' || _this.alertmark=='memory_cmMax'){//内存 邮件报警任务

                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"memory"}}]}},"aggs":{"groupbyhost":{"terms":{"field":"host.hostname","min_doc_count":"0"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"5m"},"aggs":{"total_sum":{"avg":{"field":"system.memory.used.pct"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg > "+_this.timingTaskform.condition/100}}}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.memory');
                  if(_this.alertmark=='memoryMax'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }
                }else if(_this.alertmark=='networkMax'){//流量 邮件报警任务

                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"from":"fromTimestamp","to":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"network"}},{"term":{"system.network.name":"eth0"}}]}},"aggs":{"groupByHost":{"terms":{"field":"host.hostname"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"10s"},"aggs":{"in_sum":{"avg":{"field":"system.network.in.bytes"}},"out_sum":{"avg":{"field":"system.network.out.bytes"}},"total_sum":{"bucket_script":{"buckets_path":{"in_sum":"in_sum","out_sum":"out_sum"},"script":"params.in_sum+params.out_sum"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg > "+_this.timingTaskform.condition*1024*1024}}}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'M';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.network');
                }else if(_this.alertmark=='diskRootMax' || _this.alertmark=='diskRoot01Max' || _this.alertmark=='diskRoot_cmMax' || _this.alertmark=='diskRoot01_cmMax'){//磁盘空间 邮件报警任务
                  var mountPoint = '';
                  if(_this.alertmark=='diskRootMax' || _this.alertmark=='diskRoot_cmMax'){
                    mountPoint = '/';
                  }else if(_this.alertmark=='diskRoot01Max' || _this.alertmark=='diskRoot01_cmMax'){
                    mountPoint = '/home';
                  }

                  var queryObj = {"size":0,"sort":{"@timestamp":"desc"},"query":{"bool":{"filter":[{"range":{"@timestamp":{"gte":"fromTimestamp","lte":"toTimestamp","include_lower":true,"include_upper":true}}}],"must":[{"term":{"metricset.name":"filesystem"}},{"term":{"system.filesystem.mount_point":mountPoint}}]}},"aggs":{"groupbyhost":{"terms":{"field":"host.hostname","min_doc_count":"0"},"aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":"5m"},"aggs":{"total_sum":{"max":{"field":"system.filesystem.used.pct"}},"avg_filter":{"bucket_selector":{"buckets_path":{"total_avg":"total_sum"},"script":"params.total_avg >"+_this.timingTaskform.condition/100}}}}}}}}
                  params.query=JSON.stringify(queryObj);

                  params.monThreshold=_this.timingTaskform.condition+'%';
                  params.notificationTemplateType='EMTMP_Mon';
                  params.notificationTemplateName='EMTMP-monitoring-alert.html';
                  params.monType=this.$t('lg.docsystem')+'('+mountPoint+')';

                  if(_this.alertmark=='diskRootMax' || _this.alertmark=='diskRoot01Max'){
                    params.index="shadow-metricbeat*";
                  }else{
                    params.index="cm-metricbeat*";
                  }
                }
              }
            }
          }else if(_this.myTaskType=="urlCompare"){
            const addToConfig=_this.timingTaskform.addToConfigSwitch;
            params = {
              notificationType:_this.timingTaskform.noticeMethods,
              mailRecipient:mailRecipient,
              mailSubject:_this.timingTaskform.noticeTitle,
              "notificationTemplateType":"EMTMP_URLC",
              "notificationTemplateName":"EMTMP-generic.html",
              "urlCompTile":this.$t('lg.apifx'),
              "urlCompDesc":this.$t('lg.newapilistbelow')+"：",
              apiIndicator:_this.timingTaskform.urlType,//传数字类型
              domainName: _this.timingTaskform.domain,
              strInterval: _this.timingTaskform.timeStrInterval + _this.strIntervalUnitVal,
              lteInterval: _this.timingTaskform.timeLteInterval + _this.lteIntervalUnitVal,
              addToConfig:addToConfig,
            }
            if(addToConfig){
              params.defaultRequestTime = _this.timingTaskform.dfRequestTimeVal + _this.requestTimeUnitVal;
              params.defaultVerifyBrowser = _this.timingTaskform.dfVerifyBrowserVal;
              params.defaultVerifyAgent = _this.timingTaskform.dfVerifyAgentVal;
              params.defaultVerifyToken = _this.timingTaskform.dfVerifyTokenSwitch?"1":"0";
            }
          }else if(_this.myTaskType=="apiScan"){
            params = {
              "notification": _this.timingTaskform.apiScanSwitch,
              notificationType:_this.timingTaskform.noticeMethods,
              mailRecipient:mailRecipient,
              mailSubject:_this.timingTaskform.noticeTitle,
              "notificationTemplateType": "EMTMP_ApiScan",
              "notificationTemplateName": "EMTMP-api-scan-alert.html" ,
              interval:_this.timingTaskform.timeInterval + _this.timeIntervalUnitVal
            }
          }
          if(_this.editTaskId){//修改报警任务
            var url = SERVER_API_URL + "monitoring/scheduling/tasks/" + _this.editTaskId;
            axios.patch(url, {
              id: _this.editTaskId,
              frequency: frequency,
              params: params,
              schedulingType: "fixRate",
              taskType: _this.myTaskType
            }).then(res => {
              if (res.data.responseCode == 0) {
                _this.$message({
                  type: "success",
                  message: _this.$t('lg.success')
                });
                if(_this.isChartEdit){//从页面修改了报警任务，还得自动运行一下改报警任务
                  _this.startAlertSetting();
                }else{
                  _this.$emit('getTimingTask',_this.alertmark);
                }
                _this.setTimingTaskClose();
              } else {
                _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
              }
              _this.opTaskPopLoading=false;
            }).catch(err => {
              console.log(err);
            });
          }else{//安排报警任务
            var url=SERVER_API_URL+"monitoring/scheduling/tasks";
            axios.post(url,{
              frequency:frequency,
              params:params,
              schedulingType:'fixRate',
              taskType:_this.myTaskType
            }).then((res)=>{
              if(res.data.responseCode==0){
                _this.$message({
                  type: 'success',
                  message: _this.$t('lg.success')
                });
                if(_this.isNeedRefreshAddTask){//这里只有在邮件报警页面,以及图表报警页面添加报警任务才会执行
                  _this.$emit('getTimingTask',_this.alertmark);
                }
                _this.setTimingTaskClose();
              }else{
                _this.$message.error(_this.$t('lg.failed')+": "+ res.data.data.message);
              }
              _this.opTaskPopLoading=false;
            }).catch((err)=>{
              console.log(err)
            });
          }
        }
      });
    },
    stopAlertSetting(){//图表报警 能在当前页面取消报警任务
      let _this=this;
      let id=_this.editTaskId;
      var url=`${SERVER_API_URL}monitoring/scheduling/tasks/${id}?option=stop`;
      axios.post(url,{}).then(res => {
        if(res.data.responseCode == 0) {
          _this.$message({
            type: "success",
            message: _this.$t('lg.success')
          });
          // console.log(_this.alertmark)
          _this.$emit('getTimingTask',_this.alertmark);
          _this.isShow=true;
        }else {
          _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    startAlertSetting(){//图表报警 能在当前页面开启报警任务
      var _this=this;
      let id=_this.editTaskId;
      var url=`${SERVER_API_URL}monitoring/scheduling/tasks/${id}?option=start`;
      axios.post(url,{}).then(res => {
        if(res.data.responseCode == 0) {
          _this.$emit('getTimingTask',_this.alertmark);
        }else {
          _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    showNextStep(data){//基于‘自定义查询’报警
      // console.log(data)
      this.isNextStep=false;
      this.isClickNext=true;
      this.isNotCustomQuery=true;
      this.passDiyquery=data.queryjson;
      this.passDiyparams=data.queryform;
    },
    editQueryStep(){//基于‘自定义查询’报警
      this.isNextStep=true;
      this.isClickNext=false;
    }
  }
}
</script>