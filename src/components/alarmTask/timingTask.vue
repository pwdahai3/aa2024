<template>
  <div class="timingTask-wrapper">
    <h2 class="breadcrumb">{{$t('lg.youjiang')}}</h2>
    <add-alarm-task ref="addAlarmTask" :taskTypeDisabledObj="taskTypeDisabledObj" @getTimingTask="getTimingTask"></add-alarm-task>
    <div class="timingTaskContent">
      <div v-if="timingTask.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <table v-if="timingTask.length>0">
        <thead>
          <tr>
            <th>{{$t('lg.id')}}</th>
            <th>{{$t('lg.type')}}</th>
            <th>{{$t('lg.zhixingpl')}}</th>
            <th>{{$t('lg.params')}}</th>
            <th style="min-width:80px">{{$t('lg.status')}}</th>
            <th style="min-width:60px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in timingTask" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.taskTypeTxt}}</td>
            <td>{{item.rate}}{{item.rateUnitValueTxt}}/{{$t('lg.count')}}</td>
            <td class="taskDetailTd" v-if="item.taskType=='tokenTime'">
              <p><span>{{$t('lg.notifytype')}}: </span>{{item.params.notificationType}}</p>
              <p>
                <span>{{$t('lg.recipient')}}: </span>
                <span v-for="(items,index) in item.params.mailRecipient" :key="index"><i v-if="index>0">、</i>{{items}}</span>
              </p>
              <p><span>{{$t('lg.emailtitle')}}: </span>{{item.params.mailSubject}}</p>
              <p><span>{{$t('lg.domain')}}: </span>{{item.params.domain}}</p>
              <p><span>{{$t('lg.yemian')}}: </span>{{!item.params.url || item.params.url=='*'?$t('lg.weizhiding'):item.params.url}}</p>
              <p><span>{{$t('lg.timefactor')}}: </span>{{item.params.times}}</p>
              <p><span>{{$t('lg.counts')}}: </span>{{item.params.count}}</p>
              <p><span>{{$t('lg.queryinterval')}}: </span>{{item.params.timeInterval}}{{item.params.intervalUnitValTxt}}</p>
            </td>
            <td class="taskDetailTd" v-if="item.taskType=='tokenCount'">
              <p><span>{{$t('lg.notifytype')}}: </span>{{item.params.notificationType}}</p>
              <p>
                <span>{{$t('lg.recipient')}}: </span>
                <span v-for="(items,index) in item.params.mailRecipient" :key="index"><i v-if="index>0">、</i>{{items}}</span>
              </p>
              <p><span>{{$t('lg.emailtitle')}}: </span>{{item.params.mailSubject}}</p>
              <p><span>{{$t('lg.domain')}}: </span>{{item.params.domain}}</p>
              <p><span>{{$t('lg.yemian')}}: </span>{{!item.params.url || item.params.url=='*'?$t('lg.weizhiding'):item.params.url}}</p>
              <p><span>{{$t('lg.counts')}}: </span>{{item.params.count}}</p>
              <p><span>{{$t('lg.queryinterval')}}: </span>{{item.params.timeInterval}}{{item.params.intervalUnitValTxt}}</p>
            </td>
            <td class="taskDetailTd" v-if="item.taskType=='esSearch'">
              <p><span>{{$t('lg.notifytype')}}: </span>{{item.params.notificationType}}</p>
              <p>
                <span>{{$t('lg.recipient')}}: </span>
                <span v-for="(items,index) in item.params.mailRecipient" :key="index"><i v-if="index>0">、</i>{{items}}</span>
              </p>
              <p><span>{{$t('lg.emailtitle')}}: </span>{{item.params.mailSubject}}</p>
              <!-- 以下得符合条件才展示 （报警任务的taskType也为esSearch但是报警任务的某些参数不需要展示出来)-->
              <p v-if="item.params.logId"><span>{{$t('lg.logsource')}}: </span>{{item.params.logId}}</p>
              <p v-if="item.params.tmpsArray">
                <span>{{$t('lg.queryc')}}: </span>
                <span v-for="(items,index) in item.params.tmpsArray" :key="index">{{items.keyId}} {{items.symbolId}} {{items.keyinputId}} {{items.andorId}} </span>
              </p>
              <p v-if="item.params.aggsId"><span>{{$t('lg.aggfield')}}: </span><span>{{item.params.aggsId}}</span></p>
              <p v-if="item.params.aggsId"><span>{{$t('lg.metric')}}: </span><span>{{item.params.metricId}} {{item.params.symbol2Id}} {{item.params.metricinputId}}</span></p>
              <p v-if="item.params.domainName"><span>{{$t('lg.domain')}}: </span><span>{{item.params.domainName}}</span></p>
              <p v-if="item.params.monThreshold"><span>{{$t('lg.threshold')}}: </span><span>{{item.params.monThreshold}}</span></p>
              <p v-if="item.params.minDocCount"><span>{{$t('lg.threshold')}}: </span><span>{{item.params.minDocCount}}{{$t('lg.counts')}}</span></p>
              <p><span>{{$t('lg.queryinterval')}}: </span>{{item.params.timeInterval}}{{item.params.intervalUnitValTxt}}</p>
            </td>
            <td class="taskDetailTd" v-if="item.taskType=='urlCompare'">
              <p><span>{{$t('lg.notifytype')}}: </span>{{item.params.notificationType}}</p>
              <p>
                <span>{{$t('lg.recipient')}}: </span>
                <span v-for="(items,index) in item.params.mailRecipient" :key="index"><i v-if="index>0">、</i>{{items}}</span>
              </p>
              <p><span>{{$t('lg.emailtitle')}}: </span>{{item.params.mailSubject}}</p>
              <p><span>{{$t('lg.shujulaiyuan')}}: </span>{{item.params.apiIndicator=='0'?$t('lg.yemian'):$t('lg.apiinterface')}}</p>
              <p><span>{{$t('lg.domain')}}: </span>{{item.params.domainName}}</p>

              <p><span>{{$t('lg.shifouurljpz')}}: </span>{{item.params.addToConfig?$t('lg.shi'):$t('lg.fou')}}</p>
              <p v-show="item.params.addToConfig"><span>{{$t('lg.shoudongdailifyszmrz')}}: </span>{{item.params.dfRequestTimeVal}}{{item.params.requestTimeUnitValTxt}}</p>
              <p v-show="item.params.addToConfig"><span>{{$t('lg.liulqcszbmrz')}}: </span>{{item.params.defaultVerifyBrowser}}</p>
              <p v-show="item.params.addToConfig"><span>{{$t('lg.yonghuxingweizbmrz')}}: </span>{{item.params.defaultVerifyAgent}}</p>
              <p v-show="item.params.addToConfig"><span>{{$t('lg.dongtaizhiwengnkaimr')}}: </span>{{item.params.defaultVerifyToken=='1'?$t('lg.opened'):$t('lg.unopened')}}</p>

              <p><span>{{$t('lg.shijiand1')}}: </span>{{item.params.timeStrInterval}}{{item.params.strIntervalUnitValTxt}}</p>
              <p><span>{{$t('lg.shijiand2')}}: </span>{{item.params.timeLteInterval}}{{item.params.lteIntervalUnitValTxt}}</p>
            </td>
            <td class="taskDetailTd" v-if="item.taskType=='apiScan'">
              <p><span>{{$t('lg.notifytype')}}: </span>{{item.params.notificationType}}</p>
              <p>
                <span>{{$t('lg.recipient')}}: </span>
                <span v-for="(items,index) in item.params.mailRecipient" :key="index"><i v-if="index>0">、</i>{{items}}</span>
              </p>
              <p><span>{{$t('lg.emailtitle')}}: </span>{{item.params.mailSubject}}</p>
              <p><span>{{$t('lg.shifoufasongyouj')}}: </span>{{item.params.notification?$t('lg.shi'):$t('lg.fou')}}</p>
              <p><span>{{$t('lg.queryinterval')}}: </span>{{item.params.timeInterval}}{{item.params.intervalUnitValTxt}}</p>
            </td>

            <td><span :class="item.taskStatu==$t('lg.running')?'font-green':''"><i :class="{'el-icon-loading':item.taskStatu==$t('lg.caozuozhong'),'el-icon-success shadow-icon-color-success':item.taskStatu==$t('lg.running')+'...','el-icon-warning':item.taskStatu==$t('lg.stop')}"></i> {{item.taskStatu}}</span></td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="item.params.aggsId?searchTime(item,'5m'):searchTime(item,{curPage:1,pageNum:10})" v-if="item.taskType!='urlCompare' && !item.params.alertmark && item.taskType!='apiScan'" ><i class="el-icon-search"></i>{{$t('lg.query')}}</a>
              <router-link :to="{path:'/objUpdate',query: {urlType:item.params.apiIndicator,domain:item.params.domainName,timeStrInterval:item.params.strInterval,timeLteInterval:item.params.lteInterval}}" class="edit-del-a" tag="a" v-if="item.taskType=='urlCompare'"><i class="el-icon-search"></i>{{$t('lg.query')}}</router-link>
              <router-link :to="{path:'/visitChart',query:{timeInterval:item.params.interval,theDomian:item.params.domainName,ipType:item.params.alertmark}}" class="edit-del-a" tag="a" v-if="item.params.alertmark=='maliciousAccess' || item.params.alertmark=='maliciousAccessOrg'"><i class="el-icon-search"></i>{{$t('lg.detail')}}</router-link>
              <router-link :to="{path:'/attackChart',query:{timeInterval:item.params.interval,theDomian:item.params.domainName}}" class="edit-del-a" tag="a" v-if="item.params.alertmark=='maliciousAttack'"><i class="el-icon-search"></i>{{$t('lg.detail')}}</router-link>
              <router-link :to="{path:'/dashboard',query:{timeInterval:item.params.interval,theChartType:item.params.alertmark}}" class="edit-del-a" tag="a" v-if="item.params.alertmark=='cpuMax' || item.params.alertmark=='memoryMax' || item.params.alertmark=='networkMax' || item.params.alertmark=='diskRootMax' || item.params.alertmark=='diskRoot01Max' || item.params.alertmark=='cpu_cmMax' || item.params.alertmark=='memory_cmMax' || item.params.alertmark=='diskRoot_cmMax' || item.params.alertmark=='diskRoot01_cmMax'"><i class="el-icon-search"></i>{{$t('lg.detail')}}</router-link>

              <a href="javascript:;" class="edit-del-a" @click="operationTask(item)"><i :class="item.status=='stop'?'el-icon-circle-check font-green':'el-icon-circle-close font-red'"></i><span v-if="item.status=='stop'" :title="$t('lg.dianjikaishirenw')">{{$t('lg.start')}}</span><span v-if="item.status=='running'" :title="$t('lg.ting')">{{$t('lg.ting')}}</span></a>
              <a href="javascript:;" class="edit-del-a" @click="editTask(item)"><i class="el-icon-edit-outline font-blue">{{$t('lg.edit')}}</i></a>
              <a href="javascript:;" class="edit-del-a" @click="deleteTask(item)"><i class="el-icon-delete">{{$t('lg.delete')}}</i></a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-dialog :title="$t('lg.jiyushijiang')" :visible.sync="timeVisible" width="60%" :before-close="timeClose">
      <div class="myTreeBox">
        <el-tree
          :data="queryTimeData"
          :props="queryTimeTreeProps"
          ref="tree"
          :render-content="queryTimeRenderContent"><!-- show-checkbox -->
        </el-tree>
      </div>
    </el-dialog>
    <el-dialog :title="$t('lg.jiyucishu')" :visible.sync="timesVisible" width="60%" :before-close="timesClose">
      <div class="myTreeBox">
        <el-tree
          :data="querytimesData"
          :props="queryTimesTreeProps"
          ref="tree"
          :render-content="queryTimesRenderContent"><!-- show-checkbox -->
        </el-tree>
      </div>
    </el-dialog>
    <el-dialog :title="$t('lg.zidingyi')" :visible.sync="esSearchVisible" width="80%" :before-close="esSearchClose">
      <log-rebuild v-if="!isQueryOrAggs && logId!='error.log'" :tableKeyArr='tableKeyArrTask' :dynamicTag='taskLogsHeadData' @refilterColBy='refilterColByTask' @requeryRowBy='requeryRowByTask'></log-rebuild>
      <div v-if="tbodyArr.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="tbodyArr.length>0" class="logTableHeight">
        <logagg v-if="isQueryOrAggs" :data="tbodyArr" :piedata="piedata" :linechartdata="linechartdata" @getChangeLogInterval="esSearchDataChange"></logagg>
        <log-tables v-else ref="log_tables" :logType="logId" :tabheadData="taskLogsHeadData" :tabodyData="taskLogsBodyData" :totalNum="taskTotalNum" @getChangeLogData="esSearchDataChange" :isLogLoding="false" :showSDURLMenu='showSDURLMenu'></log-tables>
      </div>
    </el-dialog>
    <timing-task-pop :editData="editTaskItem" :editTaskId="editTaskId" :isShow="isShowTimingTaskEdit" :isShowTimingTaskEdit="isShowTimingTaskEdit" :myTaskType="editTaskItem.taskType" :myTaskTypeTxt="editTaskItem.taskTypeTxt" :alertmark="alertMark" @getTimingTask="getTimingTask" @setTimingTaskClose="isShowTimingTaskEdit=false"></timing-task-pop>
  </div>
</template>
<script>
import axios from "axios";
import * as types from '@/store/types';
import client from "@/components/es/connection";
import toSddate from "@/assets/js/tosddate";
import toISO8601 from '@/assets/js/iso8601';
import { SERVER_API_URL } from "@/conf/constvar";
import addAlarmTask from '@/components/alarmTask/addAlarmTask';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';

import {logskeys} from '@/assets/js/logskeys';
import logRebuild from "@/components/logs/logRebuild";
import logTables from '@/components/logs/logTables';
import logagg from '@/components/behavior/logagg';
import Emitter from 'element-ui/src/mixins/emitter';

import {handleAccesslogData , handleWaflogData} from '@/assets/js/tool';
export default {
  mixins: [Emitter],
  components: {
    addAlarmTask,
    timingTaskPop,
    logRebuild,
    logagg,
    logTables,
  },
  data() {
    return {
      timeVisible: false, //基于时间的查询结果
      timesVisible: false, //基于次数的查询结果
      esSearchVisible:false,//基于自定义查询结果
      isShowTimingTaskEdit: false, //编辑任务弹框显隐
      editTaskId: null, //编辑当前任务的id

      queryTimeData: [],
      queryTimeTreeProps:{
        children: 'children',
        label: 'label'
      },

      querytimesData: [],
      queryTimesTreeProps:{
        children: 'children',
        label: 'label'
      },

      timingTask: [],
      editTaskItem: {},//存储被修改项
      alertMark:'',
      
      //存储自定义类型的查询结果
      logId:'',
      tbodyArr:[],

      tableKeyArrTask:[],//waf.log总共（默认）显示的字段
      taskLogsHeadData:[],
      taskLogsBodyData:[],
      taskTotalNum:0,

      piedata:{},
      linechartdata:{},

      isQueryOrAggsObj:'',//记录当前查询的对象（只记录基于自定义查询的对象: 有聚合的对象，用于频率改变再次调用查询，无聚合的对象，则用户翻页时再次调用查询）
      isQueryOrAggs:false,//是否聚合
     
      // select 禁用选项
      taskTypeDisabledObj:{
        cpuMax:false,
        memoryMax:false,
        networkMax:false,
        diskRootMax:false,
        diskRoot01Max:false,

        cpu_cmMax:false,
        memory_cmMax:false,
        diskRoot_cmMax:false,
        diskRoot01_cmMax:false
      },

      filterObj:{"match_all": {}},
      itemInfo:{},
    }
  },
  created() {
    this.$store.state.contentLoading=true;
    this.getTimingTask();
  },
  methods: {
    getCustomHeadData(logId){ // 获取waf.log、access.log表头（用户自定义的表头）
      if(logId=="waf.log"){
        this.tableKeyArrTask=[...logskeys.waf];
        var url = SERVER_API_URL + '/pe/shadow/kv/taskWaf';
        axios.get(url).then(res =>{
          if(!res.data.data){
            this.taskLogsHeadData = [...logskeys.waf];
          }else{
            this.taskLogsHeadData = res.data.data.value;
          }
        })
      }else if(logId=="access.log"){
        this.tableKeyArrTask=[...logskeys.access];
        var url2 = SERVER_API_URL + '/pe/shadow/kv/taskAccess';
        axios.get(url2).then(res =>{
          if(!res.data.data){
            this.taskLogsHeadData = [...logskeys.access]
          }else{
            this.taskLogsHeadData = res.data.data.value;
          }
        })
      }
    },
    refilterColByTask(obj){
      if(this.logId ==='waf.log'){
        var url = SERVER_API_URL + `/pe/shadow/kv`;
        if(!obj.length) return false
          axios.post(url,{taskWaf:obj}).then(res=>{
          if(Object.keys(res.data.data.Failure)){
            axios.patch(url,{taskWaf:obj}).then(res=>{
            })
          }
        })
        this.taskLogsHeadData = obj;
      }else if(this.logId ==='access.log'){
        var url = SERVER_API_URL + `/pe/shadow/kv`;
        axios.post(url,{taskAccess:obj}).then(res=>{
          if(Object.keys(res.data.data.Failure)){
            axios.patch(url,{taskAccess:obj}).then(res=>{
            })
          }
        })
        this.taskLogsHeadData = obj;
      }
    },
    requeryRowByTask(obj){
      // console.log(this.taskLogsHeadData)
      this.filterObj=obj.requeryObj;
      this.searchTime(this.itemInfo,{curPage:1,pageNum:10},true);
      if(this.$refs.log_tables) this.$refs.log_tables.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    getTimingTask() {//查看所有报警任务
      var _this = this;
      var url = SERVER_API_URL + "monitoring/scheduling/tasks";

      _this.taskTypeDisabledObj={//先还原
        cpuMax:false,
        memoryMax:false,
        networkMax:false,
        diskRootMax:false,
        diskRoot01Max:false,

        cpu_cmMax:false,//cm
        memory_cmMax:false,
        diskRoot_cmMax:false,
        diskRoot01_cmMax:false
      }
      axios.get(url).then(res =>{
        // console.log(res);
        if (res.data.responseCode == 0){
          var resArray = res.data.data;
          resArray.map(function(v, i){
            // console.log(v)
            v.rate = v.frequency.match(/(\d*)(\w*)/)[1];
            v.rateUnitValue = v.frequency.match(/(\d*)(\w*)/)[2];
            switch(v.rateUnitValue)
            { 
              case "m":
              v.rateUnitValueTxt=_this.$t('lg.minite');
              break;
              case "h":
              v.rateUnitValueTxt=_this.$t('lg.hour');
              break;
              case "d":
              v.rateUnitValueTxt=_this.$t('lg.day');
              break;
              case "w":
              v.rateUnitValueTxt=_this.$t('lg.week');
              break;
              default:
              v.rateUnitValueTxt=_this.$t('lg.year');
            };

            if(v.taskType == "urlCompare"){
              v.params.timeStrInterval = v.params.strInterval.match(/(\d*)(\w*)/)[1];
              v.params.strIntervalUnitVal = v.params.strInterval.match(/(\d*)(\w*)/)[2];
              switch(v.params.strIntervalUnitVal)
              { 
                case "s":
                v.params.strIntervalUnitValTxt=_this.$t('lg.second');
                break;
                case "m":
                v.params.strIntervalUnitValTxt=_this.$t('lg.minite');
                break;
                case "h":
                v.params.strIntervalUnitValTxt=_this.$t('lg.hour');
                break;
                default:
                v.params.strIntervalUnitValTxt=_this.$t('lg.day');
              };

              v.params.timeLteInterval = v.params.lteInterval.match(/(\d*)(\w*)/)[1];
              v.params.lteIntervalUnitVal = v.params.lteInterval.match(/(\d*)(\w*)/)[2];
              switch(v.params.lteIntervalUnitVal)
              { 
                case "s":
                v.params.lteIntervalUnitValTxt=_this.$t('lg.second');
                break;
                case "m":
                v.params.lteIntervalUnitValTxt=_this.$t('lg.minite');
                break;
                case "h":
                v.params.lteIntervalUnitValTxt=_this.$t('lg.hour');
                break;
                default:
                v.params.lteIntervalUnitValTxt=_this.$t('lg.day');
              };

              if(v.params.addToConfig){
                v.params.dfRequestTimeVal = v.params.defaultRequestTime.match(/(\d*)(\w*)/)[1];
                v.params.requestTimeUnitVal = v.params.defaultRequestTime.match(/(\d*)(\w*)/)[2];
                switch(v.params.requestTimeUnitVal)
                { 
                  case "ms":
                  v.params.requestTimeUnitValTxt=_this.$t('lg.ms');
                  break;
                  default:
                  v.params.requestTimeUnitValTxt=_this.$t('lg.second');
                };
              }

            }else{
              v.params.timeInterval = v.params.interval.match(/(\d*)(\w*)/)[1];
              v.params.intervalUnitVal = v.params.interval.match(/(\d*)(\w*)/)[2];
              switch(v.params.intervalUnitVal)
              { 
                case "s":
                v.params.intervalUnitValTxt=_this.$t('lg.second');
                break;
                case "m":
                v.params.intervalUnitValTxt=_this.$t('lg.minite');
                break;
                case "h":
                v.params.intervalUnitValTxt=_this.$t('lg.hour');
                break;
                default:
                v.params.intervalUnitValTxt=_this.$t('lg.day');
              };
            }

            if(v.status == "stop") {
              v.taskStatu = _this.$t('lg.stop');
            } else if (v.status == "running"){
              v.taskStatu = _this.$t('lg.running');
            }
            if(v.taskType == "tokenTime") {
              v.taskTypeTxt = _this.$t('lg.tokentimebased');
            }else if(v.taskType == "tokenCount") {
              v.taskTypeTxt = _this.$t('lg.tokencountbased');
            }else if(v.taskType=='esSearch'){
              switch(v.params.alertmark)
              { 
                case 'maliciousAccess':
                v.taskTypeTxt = _this.$t('lg.maccessyuanipbased');
                break;
                case 'maliciousAccessOrg':
                v.taskTypeTxt = _this.$t('lg.maccessorgipbased');
                break;

                case "maliciousAttack":
                v.taskTypeTxt = _this.$t('lg.mattackyuanipbased');
                break;

                case "cpuMax":
                v.taskTypeTxt = _this.$t('lg.cpubased');
                _this.taskTypeDisabledObj.cpuMax=true;
                break;

                case "cpu_cmMax":
                v.taskTypeTxt = _this.$t('lg.jiyuglptcpu');
                _this.taskTypeDisabledObj.cpu_cmMax=true;
                break;

                case "memoryMax":
                v.taskTypeTxt = _this.$t('lg.memorybased');
                _this.taskTypeDisabledObj.memoryMax=true;
                break;

                case "memory_cmMax":
                v.taskTypeTxt = _this.$t('lg.jiyuglptmemory');
                _this.taskTypeDisabledObj.memory_cmMax=true;
                break;
                // case "socketMax":
                // v.taskTypeTxt = "基于‘TCP’报警";
                // break;
                // case "httpMax":
                // v.taskTypeTxt = "基于‘HTTP请求数’报警";
                // break;
                case "networkMax":
                v.taskTypeTxt = _this.$t('lg.networkbased');
                _this.taskTypeDisabledObj.networkMax=true;
                break;

                case "diskRootMax":
                v.taskTypeTxt = _this.$t('lg.diskRootbased');
                _this.taskTypeDisabledObj.diskRootMax=true;
                break;

                case "diskRoot_cmMax":
                v.taskTypeTxt = _this.$t('lg.jiyuglptdisc');
                _this.taskTypeDisabledObj.diskRoot_cmMax=true;
                break;

                case "diskRoot01Max":
                v.taskTypeTxt = _this.$t('lg.diskRoot01based');
                _this.taskTypeDisabledObj.diskRoot01Max=true;
                break;

                case "diskRoot01_cmMax":
                v.taskTypeTxt = _this.$t('lg.jiyuglptdischome');
                _this.taskTypeDisabledObj.diskRoot01_cmMax=true;
                break;

                default:
                v.taskTypeTxt = _this.$t('lg.customesqbased');
              };
            }else if(v.taskType == "urlCompare"){
              v.taskTypeTxt = _this.$t('lg.objbased');
            }else if(v.taskType == "apiScan"){
              v.taskTypeTxt = _this.$t('lg.apiScanbased');
            }
          });
          _this.timingTask = resArray;
          _this.$store.state.contentLoading=false;
        }else {
          _this.$message.error(_this.$t('lg.failed')+': ' + res.data.data.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    esSearchDataChange(params){//改变采样频率，则再次触发查询 //基于自定义查询
      this.searchTime(this.isQueryOrAggsObj,params);
    },
    searchTime(item,params,flag){//查询 查询时间fromTime拿当前时间-查询间隔，endTime拿当前时间  注意： params 可能是采样频率（当使用了聚合字段会使查询结果为图表，这时可以改变折线图的采样频率，传入 params 表示查询发生在改变‘采样频率’时），params 也可能是一个对象 （不使用聚合字段会使查询结果为表格，表格有分页功能，此时params表示用户进行分页操作时传入的 分页信息）
      // console.log(this.taskLogsHeadData)
      this.itemInfo={...item}
      if(params){
        var fromNum = 0, sizeNum =0,timeDot='5m';
        if(params.curPage){ //如果是params时表示分页信息的对象 
          fromNum = (params.curPage-1)* params.pageNum;
          sizeNum= params.pageNum;
        }else{//否则为聚合时用户选择的采样频率
          timeDot=params;
        }
      }

      var intervalTime=0;//目前只有三个时间单位 h 和 d 、m
      switch(item.params.intervalUnitVal)
        { 
          case "m":
            intervalTime=item.params.timeInterval*60*1000;
            break;
          case "h":
            intervalTime=item.params.timeInterval*60*60*1000;
            break;
          default:
            intervalTime=item.params.timeInterval*24*60*60*1000;
        };
      var sttime = new Date(Date.now()-intervalTime),
          edtime = new Date(Date.now());
      this.isQueryOrAggs=false;

      if(item.taskType == "tokenTime") {
        var fromTime=toISO8601(sttime),
            endTime=toISO8601(edtime);    
        var domainVal = item.params.domain,
            urlVal = item.params.url=='*'?'*':'\"'+item.params.url+'\"',
            multiple = item.params.times,
            counts = item.params.count;
        client.search({
          index: "shadow-filebeat*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "gte": fromTime,
                        "lte": endTime,
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "bool": {
                      "should": [
                        {
                          "query_string": {
                            "query": "shadow.access.decrypted:1"
                          }
                        },
                        {
                          "query_string": {
                            "query": "shadow.access.api_indicator:1"
                          }
                        }
                      ]
                    }
                  },
                  {
                    "term": {
                     "shadow.access.http_host": domainVal
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.org_url:"+urlVal
                    }
                  }
                ],
                "must_not": [
                  {
                    "match": {
                      "shadow.access.token":"00000000000000000000000000000000"
                    }
                  },{
                    "match": {
                      "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                    }
                  }
                ]
              }
            },
            "aggs": {
              "GroupByUrl":{
                "terms": {
                  "field": "shadow.access.org_url",
                  "size": 500
                },
                "aggs": {
                  "GroupByToken": {
                    "terms": {
                      "field": "shadow.access.token",
                      "size": 500
                    },
                    "aggs": {
                      "avg_starttime": {
                        "avg": {
                          "field": "shadow.access.send_time"
                        }
                      },
                      "avg_endtime": {
                        "avg": {
                          "field": "shadow.access.rec_time"
                        }
                      },
                      "avg_time": {
                        "bucket_script": {
                          "buckets_path": {
                            "avg_starttime": "avg_starttime",
                            "avg_endtime": "avg_endtime"
                          },
                          "script": "params.avg_endtime-params.avg_starttime"
                        }
                      },
                      "suspects": {
                        "scripted_metric": {
                          "init_script": "params._agg.suspects=[]",
                          "map_script": "params._agg.suspects.add(Long.parseLong(params._source.shadow.access.rec_time)-Long.parseLong(params._source.shadow.access.send_time))",
                          "combine_script": "ArrayList list=new ArrayList();for(s in params._agg.suspects){list.add(s);}return list",
                          "reduce_script": `double total_time=0;int length=0;for(a in params._aggs){for(i in a){total_time+=i;length+=1;}}double avg_time=total_time/length;int count=0;for(a in params._aggs){for(i in a){if(i>(avg_time*${multiple})){count+=1;}}}if(count>=${counts}){return count;}else{return null;}`
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then(res => {
          // console.log(res)
          let resultArr = [];
          const buckets=res.aggregations.GroupByUrl.buckets;

          buckets.forEach(ele=>{
            let itemObj={
                  label:ele.key,
                  children:[]
                };
            const childrenObj=ele.GroupByToken.buckets;
            childrenObj.forEach(val=>{
              if(val.suspects.value){
                itemObj.children.push({
                  label:val.key,
                  counts:val.doc_count,
                  avgTime:(val.avg_time.value/1000).toFixed(2),
                  suspects:val.suspects.value
                })
              }
            })
            resultArr.push(itemObj)
          })
          
          this.queryTimeData = resultArr;
          this.timeVisible = true;
        });
      }else if(item.taskType == "tokenCount"){
        var fromTime=toISO8601(sttime),
            endTime=toISO8601(edtime);    
        var domainVal = item.params.domain,
            urlVal = item.params.url=='*'?'*':'\"'+item.params.url+'\"',
            prenum = item.params.count;
        client.search({
          index: "shadow-filebeat*",
          body: {
            "size": 10,
            "query": {
              "bool": {
                "filter":[
                    {
                    "range": {
                      "@timestamp": {
                        "gte": fromTime,
                        "lte": endTime,
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "bool": {
                      "should": [
                        {
                          "query_string": {
                            "query": "shadow.access.decrypted:1"
                          }
                        },
                        {
                          "query_string": {
                            "query": "shadow.access.api_indicator:1"
                          }
                        }
                      ]
                    }
                  },
                  {
                    "term": {
                      "shadow.access.http_host": domainVal
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.org_url:"+urlVal
                    }
                  }
                ],
                "must_not": [
                  {
                    "match": {
                      "shadow.access.token":"00000000000000000000000000000000"
                    }
                  },{
                    "match": {
                      "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                    }
                  }
                ]
              }
            },
            "aggs": {
              "GroupByUrl": {
                "terms": {
                  "field": "shadow.access.org_url",
                  "size": 500
                },
                "aggs": {
                  "GroupByToken": {
                    "terms": {
                      "field": "shadow.access.token",
                      "min_doc_count": prenum,
                      "size": 500
                    }
                  }
                }
              }
            }
          }
        }).then(res => {
          // console.log(res)
          let resultArr=[];
          const buckets=res.aggregations.GroupByUrl.buckets;
          buckets.forEach(ele=>{
            let itemObj={
                  label:ele.key,
                  children:[]
                };
            const childrenObj=ele.GroupByToken.buckets;
            childrenObj.forEach(val=>{
              itemObj.children.push({
                label:val.key,
                counts:val.doc_count,
              })
            })
            if(itemObj.children.length>0){
              resultArr.push(itemObj)
            }
          })

          this.querytimesData=resultArr;
          this.timesVisible = true;
        });
      }else if(item.taskType == "esSearch"){
        var _this =this;
        _this.logId=item.params.logId;//记录当前自定义查询查询的是哪个日志
        if(!flag)_this.getCustomHeadData(item.params.logId);
        _this.isQueryOrAggsObj=item;//记录当前对象
        
        if(item.params.logId=="access.log"){//access.log日志查询的时间要减去8小时
          var fromTime=toISO8601(sttime),
              endTime=toISO8601(edtime); 
        }else{
          var fromTime=toSddate(sttime),
              endTime=toSddate(edtime);    
        }
        
        var getLogId=item.params.logId=="waf.log"?"shadow_"+item.params.logId:item.params.logId;
        var getLogIdStr=`/usr/local/shadow/logs/${getLogId}`;

        var sumaryArrLen=item.params.tmpsArray.length;
        var mustShould=[];
        var wildcardMatch=[];
        for(let i=0;i<sumaryArrLen;i++){
          var andorIdI=item.params.tmpsArray[i].andorId;
          if(andorIdI==="OR"){
            mustShould[i]="should"
          }else if(andorIdI==="AND"){
            mustShould[i]="must"
          }else{
            mustShould[i]="must"
          }
          var symbolIdI=item.params.tmpsArray[i].symbolId || this.$t('lg.dengyu');
          if(symbolIdI==this.$t('lg.contain')){
            wildcardMatch[i]="wildcard"
          }else if(symbolIdI==this.$t('lg.dengyu')){
            wildcardMatch[i]="match"
          }
        }
        if(sumaryArrLen>=2){
          mustShould[sumaryArrLen-1]=mustShould[sumaryArrLen-2];
        }

        var myQueryJson={
          "must": [
            {
              "term": {
                "log.file.path": getLogIdStr
              }
            },{
              "range": {
              "@timestamp": {
                "from":fromTime,
                "to":endTime,
                "include_lower": true,
                "include_upper": true
              }
            }
            }
          ],
          "should": [],
          "filter": _this.filterObj
        };
        if(item.params.logId=="access.log"){
          myQueryJson.must.push({
            "exists": {
              "field": "shadow.access.method"
            }
          })
        }else{
          myQueryJson.must_not={//过滤掉格式错误的数据 适用于waf.log 以及error.log
            "exists": {
              "field": "error"
            }
          }
        }

        for(let i=0;i<sumaryArrLen;i++){
          var mustShouldK=mustShould[i];
          var keyId=item.params.tmpsArray[i].keyId;
          var keyinputId=item.params.tmpsArray[i].keyinputId;
          var wildcardmatchJson={};
          if(wildcardMatch[i]=="wildcard"){
            var kyinputIdX=`*${keyinputId}*`;
            wildcardmatchJson[keyId]=kyinputIdX;
            myQueryJson[mustShouldK].push({
              "wildcard": wildcardmatchJson
            });
          }else if(wildcardMatch[i]=="match"){
            wildcardmatchJson[keyId]=keyinputId;
            myQueryJson[mustShouldK].push({
              "match": wildcardmatchJson   
            });
          }
        }
        // console.log(JSON.stringify(myQueryJson));

        var aggsField=item.params.aggsId;//聚合
        var aggsObj={};
        if(aggsField){//如果使用聚合
          var setTimeInterval=timeDot;//当查询用到聚合时会生成图表，图表会受到采样频率影响显示
          var aggsCount=parseInt(item.params.metricinputId) || 1;
          aggsObj={
            "GroupByMe":{
              "terms":{
                "field":aggsField,
                "min_doc_count":aggsCount,
                "size":5
              },
              "aggs":{
                "time_his":{
                  "date_histogram":{
                    "field":"@timestamp",
                    "interval":setTimeInterval,
                    "min_doc_count":0
                  }
                }
              }
            }
          }
          _this.isQueryOrAggs=true;
        }

        var searchObj = {
              index:"shadow-filebeat*",
              body:{
                "size": 10,
                "query": {
                  "bool": myQueryJson
                },
                "aggs": aggsObj 
              }
            }
        
        if(!aggsField){
          searchObj.from=fromNum;
          searchObj.size=sizeNum;
        }

        client.search(searchObj).then((res)=>{
          // console.log(res)
          _this.esSearchVisible = true;
          if(aggsField){
            if(res.aggregations.GroupByMe.buckets.length>0){
              let tarResult=res.aggregations.GroupByMe.buckets;
              _this.tbodyArr=tarResult;//聚合里面的表格数据
              var legend=[],pieData=[],seriesData=[],xaxisData=[],tmpxaxisData=[];
              for(var i=0;i<tarResult.length;i++){
                var dataI=tarResult[i];
                for(var j=0;j<dataI.time_his.buckets.length;j++){
                  var dataJ=dataI.time_his.buckets[j];
                  if(!tmpxaxisData.includes(dataJ.key)){
                    tmpxaxisData.push(dataJ.key); 
                  }
                }
              }
              tmpxaxisData.sort((a,b)=>{
                return a-b;
              })

              const LEGEND_STRING_LEN=40;
              const LEGEND_LAST_STRING=4;

              for(let ii=0;ii<tarResult.length;ii++){
                let dataII=tarResult[ii];
                let seriesItemData=[];

                var arr0=tmpxaxisData.map((v)=>{return 0});

                let bucketsKey;
                if(dataII.key){
                  bucketsKey=dataII.key.toString();
                }else{
                  bucketsKey=" ";
                }

                if(bucketsKey.length>LEGEND_STRING_LEN){
                  bucketsKey=bucketsKey.slice(0,LEGEND_STRING_LEN-LEGEND_LAST_STRING)+"..."+bucketsKey.slice(bucketsKey.length-LEGEND_LAST_STRING-1);
                }

                legend.push(bucketsKey);
                pieData.push({
                  value:dataII.doc_count,
                  name:bucketsKey
                });

                for(let jj=0;jj<dataII.time_his.buckets.length;jj++){
                  var dataJJ=dataII.time_his.buckets[jj];
                  arr0[tmpxaxisData.indexOf(dataJJ.key)]=dataJJ.doc_count;
                }

                seriesData.push(
                  {
                    name:bucketsKey,
                    type:'line',
                    data:arr0
                  }
                );
              }

              if(item.params.logId=="access.log"){//access.log日志查询出来的时间不用减去8小时
                xaxisData=tmpxaxisData.map((v)=>{
                  return _this.transformMyDate(v)
                });
              }else{
                xaxisData=tmpxaxisData.map((v)=>{
                  return _this.transformMyDate2(v)
                });
              }
              //把拿到的数据传入子组件
              _this.piedata={"legend":legend,"data":pieData};
              _this.linechartdata={"legend":legend,"xaxisdata":xaxisData,"seriesdata":seriesData};
            }
          }else{
            let logResArr = res.hits.hits;
            _this.tbodyArr=logResArr;
            _this.taskTotalNum=res.hits.total.value;
            if(res.hits.total.value>0){
              // 获取waf.log表体
              _this.taskLogsBodyData=[];
              let bodyArr=[];
              if(item.params.logId=="waf.log"){
                // 获取waf.log表体数据
                bodyArr = handleWaflogData(logResArr);
              }else if(item.params.logId=="access.log"){
                // 获取access.log表体数据
                bodyArr = handleAccesslogData(logResArr);
              }else if(item.params.logId=="error.log"){
                var toSdDate = _this.$options.filters['toSdDate'];//获取使用局部的filter
                logResArr.forEach((ele)=>{
                  var eleSource = ele._source;

                  var errLogsItem={};
                  errLogsItem.date=toSdDate(eleSource['read_timestamp']);
                  errLogsItem.level=eleSource.shadow.error.level;
                  errLogsItem.message=eleSource.shadow.error.message;

                  bodyArr.push(errLogsItem);
                })
              }
              _this.taskLogsBodyData=bodyArr;
            }
          }
        }).catch((err)=>{
          console.log(err);
        });           
      }
    },
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes());
    },
    transformMyDate2(d){
      d=new Date(d-8*60*60*1000);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes());
    },
    operationTask(item) {//启动&停止报警任务
      var _this = this;
      item.taskStatu = _this.$t('lg.handling');
      
      var taskId = item.id;
      var thisStatus = "";
      if(item.status == "stop"){
        thisStatus = "start";
      }else if(item.status == "running") {
        thisStatus = "stop";
      }
      var url = SERVER_API_URL +"monitoring/scheduling/tasks/"+taskId+"?option="+thisStatus;
      axios.post(url,{}).then(res => {
        if(res.data.responseCode == 0) {
          _this.$message({
            type: "success",
            message: _this.$t('lg.success')
          });
          _this.getTimingTask();
        }else {
          _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    editTask(item) {//编辑报警任务 打开弹框
      // console.log(item)
      var _this = this;
      if(item.status == "running") {
        _this.$message.error(_this.$t('lg.isrunningandstop'));
        return;
      }
      _this.editTaskId = item.id;
      _this.editTaskItem = Object.assign({},item);//克隆对象  this.editTaskItem=item;改变了原对象
      if(item.params.alertmark){
        _this.alertMark=item.params.alertmark;
      }else{
        _this.alertMark='';
      }
      _this.isShowTimingTaskEdit = true;
    },
    deleteTask(item) {//删除当前定时报警任务
      var _this = this;
      if(item.status == "running") {
        _this.$message.error(_this.$t('lg.isrunningandstop'));
        return;
      }
      _this.$confirm(_this.$t('lg.isdelete'),_this.$t('lg.tip'),{
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        _this.$store.state.contentLoading=true;
        var url = SERVER_API_URL + "monitoring/scheduling/tasks/" + item.id;
        axios.delete(url).then(res => {
          if(res.data.responseCode == 0){
            _this.getTimingTask();
            _this.$message({
              type: "success",
              message: _this.$t('lg.success')
            });
            _this.$refs.addAlarmTask.isShowSelect=false;
          }else{
            _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
          }
          _this.$store.state.contentLoading=false;
        }).catch(err => {
          console.log(err);
        });
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: _this.$t('lg.cancel')
        });
      })
    },
    timeClose() {//关闭查询弹框
      this.timeVisible = false;
      this.queryTimeData=[];
    },
    timesClose() {//关闭查询弹框
      this.timesVisible = false;
      this.querytimesData=[];
    },
    esSearchClose(){//关闭查询弹框
      this.esSearchVisible = false;
      this.isQueryOrAggsObj='';
      this.qinterval='5m';
      this.tbodyArr=[];
      this.broadcast('logRequery',"clearData");//清空孙组件里logRequry的查询条件输入框里的内容，要引入Emitter
      this.filterObj={"match_all": {}};//清空孙组件里logRequry的被带入日志查询语句的查询条件
    },
    showSDURLMenu(index){
      this.taskLogsBodyData.forEach(items=>{
        items.showUMenuList=false;
      })
      // this.taskLogsBodyData[index].showUMenuList=true;
      this.$set(this.taskLogsBodyData[index],'showUMenuList',true)
    },
    hideSDURLMenu(){
      this.taskLogsBodyData.forEach(items=>{
        items.showUMenuList=false;
      })
    },

    queryTimeRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容 基于访问时间 // {node.token}{node.counts}{data.avgTime}{data.suspects}
      if(data.children){
        return (
          <span class="my-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }else{
        return (
          <span class="my-tree-node">
            <span>$t('lg.token')：{node.label}，$t('lg.qipingjufwshwe')：{data.avgTime}$t('lg.second')，$t('lg.fanwencisw')：{data.counts}$t('lg.count')</span>
          </span>
        );
      }
    },
    queryTimesRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容 基于访问次数
      if(data.children){
        return (
          <span class="my-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }else{
        return (
          <p class="my-tree-node">
            <span>$t('lg.token')：{node.label}，$t('lg.fanwencisw')：{data.counts}$t('lg.count')</span>
          </p>
        );
      }
    }
  },
  filters:{
    toSdDate(val){
      if(!val) return;
      var d=new Date(val);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return d.getFullYear()+"/"+pad(parseInt(d.getMonth())+1)+"/"+pad(d.getDate())+" "+pad(d.getHours())+':'+pad(d.getMinutes())+":"+pad(d.getSeconds());
    }
  },
};
</script>
<style>
.timingTask-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.timingTaskContent{
  flex: 1;
  overflow-y: auto;
}
.taskDetailTd{
  max-width: 260px;
}
.taskDetailTd p {
  padding: 3px 0px;
  line-height: 18px;
}
.my-tree-node{ 
  white-space: normal;
  word-break: break-all;
  margin: 8px;
  line-height: 20px!important;
}
</style>
