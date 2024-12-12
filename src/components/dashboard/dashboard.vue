<template>
  <div class="dashboard-wrapper">

    <div class="changePanel" v-show="isShowQueryPanel">
      <div class="changeBox">
        <el-select v-model="chartType" :placeholder="$t('lg.select')" @change="chartTypeChange">
          <el-option :label="$t('lg.fanyunode')" value="shadow"></el-option>
          <el-option :label="$t('lg.manageplatfomr')" value="cm"></el-option>
        </el-select>
      </div>
    </div>
    <div class="dashboardContent">
      <el-row :gutter="10" class="chartRow">
        <el-col :span="12">
          <div  class="chart-content" 
                v-loading="cpuLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="cpuLineNodata"></pienodata>
            <div id="cpuLineContainer" class="chartBox"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-content"
                v-loading="memoryLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata  mystyle="linenodata" v-if="memoryLineNodata"></pienodata>
            <div id="memoryLineContainer" class="chartBox"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="chartRow" v-if="chartType=='shadow'">
        <el-col :span="12">
          <div class="chart-content"
                v-loading="tcpLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata  mystyle="linenodata" v-if="line3Nodata"></pienodata>
            <div id="myLine3" class="chartBox"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-content"
                v-loading="httprequestLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata  mystyle="linenodata" v-if="line4Nodata"></pienodata>
            <div id="myLine4" class="chartBox"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="chartRow">
        <el-col :span="12" v-if="chartType=='shadow'">
          <div class="chart-content"
                v-loading="networkLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="line5Nodata"></pienodata>
            <div id="myLine5" class="chartBox"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="mountpointbox">
            <h3 class="mountpointtitle">{{$t('lg.cipankongjzhanbi')}}</h3>
            <p class="line6Nodata" v-if="line6Nodata">{{$t('lg.nodata')}}</p>
            <div class="mountpoint" v-else>
              <table>
                <thead>
                  <th></th>
                  <th>{{$t('lg.zongkongj')}}(GB)</th>
                  <th>{{$t('lg.yiyongkongj')}}(GB)</th>
                  <th>{{$t('lg.keyongkongj')}}(GB)</th>
                  <th>{{$t('lg.shiyonglv')}}</th>
                </thead>
                <tbody>
                  <tr v-for="item in mountPointData">
                    <td><span v-if="item._source && item._source.system && item._source.system.filesystem">{{item._source.system.filesystem.mount_point}}</span></td>
                    <td><span v-if="item._source && item._source.system && item._source.system.filesystem">{{item._source.system.filesystem.total|gbFormat}}</span></td>
                    <td><span v-if="item._source && item._source.system && item._source.system.filesystem && item._source.system.filesystem.used">{{item._source.system.filesystem.used.bytes|gbFormat}}</span></td>
                    
                    <td><span v-if="item._source && item._source.system && item._source.system.filesystem">{{item._source.system.filesystem.available|gbFormat}}</span></td>
                    <td><span v-if="item._source && item._source.system && item._source.system.filesystem && item._source.system.filesystem.used">{{item._source.system.filesystem.used.pct|percentFormat}}</span></td>                    
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    
    <!-- 添加报警任务 -->
    <timing-task-pop :isNeedRefreshAddTask="true" :isShow="isShowTimingTask" :myTaskType="'esSearch'" :myTaskTypeTxt="taskTypeTxt" :alertmark="alertMark" @getTimingTask="getAllchart" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>
    <!-- 编辑报警任务 -->
    <timing-task-pop :isRunning="isRunning" :isChartEdit='isChartEdit' :editData="timingTaskform" :editTaskId="editTaskId" :isShow="isShowTimingTaskEdit" :isShowTimingTaskEdit="isShowTimingTaskEdit" :myTaskType="timingTaskform.taskType" :myTaskTypeTxt="taskTypeTxt" :alertmark="alertMark" @getTimingTask="getAllchart" @setTimingTaskClose="isShowTimingTaskEdit=false"></timing-task-pop>
    

    <networkcp :isShow="networkcpShow" @isDone="networkcpShow=false"></networkcp>
    <!-- 右侧操作列表 -->
    <ul class="operationBtnUl"
        v-show="isShowGridMenu">
      <li>
        <img src="static/icon/fullScreen.png"
             :alt="$t('lg.dapinzhans')"
             :title="$t('lg.dapinzhans')"
             @click="fullScreen">
      </li>
    </ul>

  </div>
</template>
<script>
import echarts from 'echarts';
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import client from "@/components/es/connection";
import * as types from '@/store/types';
import pienodata from '@/basecomponents/pienodata';
// import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
import networkcp from '@/components/pubconfig/networkCompare'
export default {
  components:{
    pienodata,
    timingTaskPop,
    networkcp
  },
  data() {
    return {
      networkcpShow:false,
      mountPointData:[],
      chartType:'shadow',//两种图表 一种cm、一种es 切换显示

      fromTime:0,
      endTime:0,
      timeinterval:'',
      flowTimeInterval:'',

      cpuLineNodata:false,
      memoryLineNodata:false,
      line3Nodata:false,
      line4Nodata:false,
      line5Nodata:false,
      line6Nodata:false,
      diskRootLineNodata:false,
      diskRoot01LineNodata:false,
     
      cpuLineChart:null,
      memoryLineChart:null,
      myChart3:null,
      myChart4:null,
      myChart5:null,
      diskRootLineChart:null,
      diskRoot01LineChart:null,
      
      cpuLoading:false,
      memoryLoading:false,//memory
      diskRootLoading:false,//磁盘空间（/）
      diskRoot01Loading:false,
      tcpLoading:false,
      httprequestLoading:false,
      networkLoading:false,
      
      // isAlertingShow:false,
      // alertMark:'',
      // alertTitle:'',
      // alertData:{},
      // alertLine:false,

    // 报警任务
      isShowTimingTask:false,
      taskTypeTxt:'',
      alertMark:'',

      // 编辑报警任务
      isShowTimingTaskEdit:false,
      editTaskId: null, //编辑当前任务的id
      timingTaskform:{},//存储被修改项
      isRunning:false,//任务的运行状态（图表报警都能在当前页面进行编辑）当运行状态为true时，是不能进行编辑操作的
      isChartEdit:true,//如果把这个值传给子组件，表示此时的子组件是在 图表报警的父组件里调用的 这时，报警任务可以进行开启和暂停

      isNetworkAlertLine:false,//为true则代表当前图表有报警任务,需要做标记线  //流量
      isNetworkAlertData:{},
      networkConditionData:0,
      isNetworkRunning:false,

      publicChart:{
        shadow:{
          searchIndex:'shadow-metricbeat*',//shadow

          isCpuAlertLine:false,//为true则代表当前图表有报警任务,需要做标记线
          isCpuAlertData:{},//储存邮件报警参数
          cpuConditionData:0,//划线数值
          isCpuRunning:false,//记录单个任务的运行状态

          isMemoryAlertLine:false,
          isMemoryAlertData:{},
          memoryConditionData:0,
          isMemoryRunning:false,
        
          isDiskRootAlertLine:false,
          isDiskRootAlertData:{},
          diskRootConditionData:0,
          isDiskRootRunning:false,

          isDiskRoot01AlertLine:false,
          isDiskRoot01AlertData:{},
          diskRoot01ConditionData:0,
          isDiskRoot01Running:false,

          alertMarkCpu:'cpuMax',
          taskTypeTxtCpu:this.$t('lg.cpubased'),
          alertMarkMemory:'memoryMax',
          taskTypeTxtMemory:this.$t('lg.memorybased'),
          alertMarkDiskRoot:'diskRootMax',
          taskTypeTxtDiskRoot:this.$t('lg.diskRootbased'),
          alertMarkDiskRoot01:'diskRoot01Max',
          taskTypeTxtDiskRoot01:this.$t('lg.diskRoot01based'),
        },
        cm:{
          searchIndex:'cm-metricbeat*',//cm

          isCpuAlertLine:false,//为true则代表当前图表有报警任务,需要做标记线   
          isCpuAlertData:{},//储存邮件报警参数
          cpuConditionData:0,//划线数值
          isCpuRunning:false,//记录单个任务的运行状态

          isMemoryAlertLine:false,  
          isMemoryAlertData:{},
          memoryConditionData:0,
          isMemoryRunning:false,

          isDiskRootAlertLine:false,  
          isDiskRootAlertData:{},
          diskRootConditionData:0,
          isDiskRootRunning:false,

          isDiskRoot01AlertLine:false, 
          isDiskRoot01AlertData:{},
          diskRoot01ConditionData:0,
          isDiskRoot01Running:false,

          alertMarkCpu:'cpu_cmMax',
          taskTypeTxtCpu:this.$t('lg.jiyuglptcpu'),
          alertMarkMemory:'memory_cmMax',
          taskTypeTxtMemory:this.$t('lg.jiyuglptmemory'),
          alertMarkDiskRoot:'diskRoot_cmMax',
          taskTypeTxtDiskRoot:this.$t('lg.jiyuglptdisc'),
          alertMarkDiskRoot01:'diskRoot01_cmMax',
          taskTypeTxtDiskRoot01:this.$t('lg.jiyuglptdischome'),
        },
      },

      //大屏展示
      isShowQueryPanel:true,//上方查询面板大屏展示时要隐藏
      isShowGridMenu:true,//右下角菜单大屏展示时要隐藏
    }
  },
  created(){
   // this.getMountpoint();
    // this.$store.state.isShowTimerate = true;//采样频率选择
    // this.$store.state.mydatedata.interval = '5m';
    // this.$store.state.mydatedata.flowInterval = '10s';
    // this.$store.state.timerateValue='采样频率';
    this.$store.state.nowTimeVal=[new Date(new Date().getTime()-24*60*60*1000), new Date()];//这个页面时间范围默认取回一天
   
    window.addEventListener("resize", () => {
      this.cpuLineChart.resize();
      this.memoryLineChart.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
     // this.diskRootLineChart.resize();
     // this.diskRoot01LineChart.resize();
    });
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      this.handleTime();
      this.getAllchart();
     // this.getMountpoint();
    },
    '$store.state.isMenuShow':function(){
      this.cpuLineChart.resize();
      this.memoryLineChart.resize();
      this.myChart3.resize();
      this.myChart4.resize();
      this.myChart5.resize();
     // this.diskRootLineChart.resize();
     // this.diskRoot01LineChart.resize();
    }
  },
  mounted() {
    if(this.$route.query.timeInterval){//从邮件报警页面点击查看跳转过来，要根据邮件报警的查询间隔时间来改变右上角时间
      var paramUrl = this.$route.query;
      var dataNow = new Date().getTime();

      var timeIntervalNum = paramUrl.timeInterval.match(/(\d*)(\w*)/)[1];
      var timeIntervalUnit = paramUrl.timeInterval.match(/(\d*)(\w*)/)[2];

      var timeStrVal = 0;
      switch(timeIntervalUnit)
      { 
        case "m":
        timeStrVal = dataNow - timeIntervalNum*60*1000;
        break;
        case "h":
        timeStrVal = dataNow - timeIntervalNum*60*60*1000;
        break;
        default:
        timeStrVal = dataNow - timeIntervalNum*24*60*60*1000;
      };
      this.$store.state.nowTimeVal=[new Date(timeStrVal),new Date(dataNow)];
      this.$store.state.refreshAble=true;//禁用自动刷新
      this.$store.commit(types.MYDATEPICKER);
    }

    //从邮件报警页面点击查看跳转过来，要根据路由上的theChartType来显示防御节点或管理平台的表
    if(this.$route.query.theChartType=='cpu_cmMax' || this.$route.query.theChartType=='memory_cmMax' || this.$route.query.theChartType=='diskRoot_cmMax' || this.$route.query.theChartType=='diskRoot01_cmMax'){
      this.chartType='cm';
    }else{
      this.chartType='shadow';
    }
    // this.$nextTick(()=>{
      // console.log(this.$route.query.theChartType)
      this.handleTime();
      this.getAllchart();
    // })
  },
  methods: {
    chartTypeChange(val){
      this.getAllchart();
    },
    getAllchart(taskType){
      if(this.chartType=='shadow'){
        if(!taskType){
          this.getTimingTask().then((nodes)=>{
            this.drawCpuLine();
            this.drawMemoryLine();
            this.getMountpoint();
            this.line3();
            this.line4();
            this.line5();
          //  this.drawDiskRootLine();
           // this.drawDiskRoot01Line();
          })
        }else{
          if(taskType=='cpuMax'){
            this.getTimingTask(taskType).then((nodes)=>{
              this.drawCpuLine();
            })
          }else if(taskType=='memoryMax'){
            this.getTimingTask(taskType).then((nodes)=>{
              this.drawMemoryLine();
            })
          }else if(taskType=='networkMax'){
            this.getTimingTask(taskType).then((nodes)=>{
              this.line5();
            })  
          }//else if(taskType=='diskRootMax'){
          //   this.getTimingTask(taskType).then((nodes)=>{
          //     this.drawDiskRootLine();
          //   }) 
          // }
          else if(taskType=='diskRoot01Max'){
            this.getTimingTask(taskType).then((nodes)=>{
            //  this.drawDiskRoot01Line();
            this.getMountpoint();
            }) 
          }
        }
      }else{
        if(!taskType){
          this.getTimingTask().then((nodes)=>{
            this.drawCpuLine();
            this.drawMemoryLine();
            this.getMountpoint();
          //  this.drawDiskRootLine();
          //  this.drawDiskRoot01Line();
          })
        }else{
          if(taskType=='cpu_cmMax'){
            this.getTimingTask(taskType).then((nodes)=>{
              this.drawCpuLine();
            }) 
          }else if(taskType=='memory_cmMax'){
            this.getTimingTask(taskType).then((nodes)=>{
              this.drawMemoryLine();
            }) 
          }//else if(taskType=='diskRoot_cmMax'){
          //   this.getTimingTask(taskType).then((nodes)=>{
          //     this.drawDiskRootLine();
          //   }) 
          // }
          else if(taskType=='diskRoot01_cmMax'){
            this.getTimingTask(taskType).then((nodes)=>{
             // this.drawDiskRoot01Line();
             this.getMountpoint();
            }) 
          }
        }
      }
    },
    //.start cm shadow共有图表
    drawCpuLine(){
      var _this=this;
      _this.cpuLoading=true;
      _this.cpuLineChart = echarts.init(document.getElementById('cpuLineContainer'));
      
      var options = {
            color:['#3fb1e3','#6be6c1','#626c91','#a0a7e6','#96dee8'],
            title: {
              text: 'CPU',
              x:'center'
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+" ( "+ Math.round(params[i].value*10000)/100+'%'+" ) "+'<br />' 
                }
                return str;
              },
            },
            toolbox: {
              right:'10',
              top:'10',
              feature: {
                myTool1: {
                  show: !_this.publicChart[_this.chartType].isCpuAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/stopBell.png',
                  onclick: function (){
                    _this.alertMark=_this.publicChart[_this.chartType].alertMarkCpu;
                    _this.taskTypeTxt=_this.publicChart[_this.chartType].taskTypeTxtCpu;
                    _this.isShowTimingTask=true;
                  }
                },
                myTool2: {
                  show: _this.publicChart[_this.chartType].isCpuAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/startBell.png',
                  onclick: function (){
                    _this.upSingleTaskData(_this.publicChart[_this.chartType].isCpuAlertData,_this.publicChart[_this.chartType].alertMarkCpu,_this.publicChart[_this.chartType].taskTypeTxtCpu);
                  }
                }
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'category',
              data: []
            },
            yAxis: {
              show:false,
              type: 'value',
              name:'%',
              axisLabel: {
                formatter: function (val) {
                  return Math.round(val*10000)/100
                }
              }
            },
            series: [
              // {
              //     name:'Step Start',
              //     type:'line',
              //     step: 'start',
              //     data:[120, 132, 101, 134, 90, 230, 210]
              // },
            ]
          };
      // myChart.setOption(options);
      _this.lineTimer().then((nodes)=>{
        var nodeArr=[];
        for(var n=0;n<nodes.length;n++){
          nodeArr.push(
            nodes[n].key
          )
        }
        
        client.search({
          index: _this.publicChart[_this.chartType].searchIndex,
          body: {
            "size": 0,
            "sort": {
              "@timestamp": "desc"
            },
            "query":{
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "term": {
                      "metricset.name": "cpu"
                    }
                  },
                  {
                    "terms": {
                      "host.name":nodeArr
                    }
                  }
                ]
              }
            },
            "aggs": {
              "groupbyhost":{
                "terms": {
                  "field": "host.hostname",
                  "min_doc_count": 0
                },
                "aggs": {
                  "time_histo": {                  
                    "date_histogram": {
                      "field": "@timestamp",
                      "interval": _this.flowTimeInterval,
                      "extended_bounds": {
                        "min": _this.fromTime,
                        "max": _this.endTime
                      }
                    },
                    "aggs": {
                      "total_sum": {
                        "avg": {
                          "field": "system.cpu.system.pct"
                        }
                      },
                      "difference": {
                        "serial_diff": {                
                          "buckets_path": "total_sum",
                          "lag" : 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res)

          // if(!res.aggregations){//当数据没打到metricbeat上时，可能连aggregations属性都没有，这时只能显示暂无数据
          //   _this.cpuLineChart.clear();
          //   _this.cpuLineNodata=true;
          //   _this.cpuLoading=false;
          //   return false;
          // }
         
          //数据打到了metricbeat上（再分两种情况=>有数据，暂无数据）
          var tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];
          var legendData=[],seriesData=[];
          if(tarResult.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.cpuLineNodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.cpuLineNodata=false;//有数据
          }
          for(var i=0;i<tarResult.length;i++){
            var xaxisData=[],valData=[];
            var dataI=tarResult[i];
            legendData.push(dataI.key);
            for(var j=0;j<dataI.time_histo.buckets.length;j++){
              var dataJ=dataI.time_histo.buckets[j];
              var dataJV=dataJ.total_sum.value;
              if(!dataJV){
                dataJV=0
              }
              xaxisData.push(_this.transformMyDate(dataJ.key));
              valData.push(dataJV);
            }
            seriesData.push(
              {
                name:dataI.key,
                // areaStyle: {},
                type:'line',
                data:valData
              }
            );
          }
          if(_this.publicChart[_this.chartType].isCpuAlertLine && _this.publicChart[_this.chartType].isCpuRunning){
            seriesData=seriesData.map((item)=>{
              item.markLine= {
                "symbol":"none",
                "silent": true,
                "lineStyle":{
                  "type":'dashed',
                  "color":"#893448"
                },
                "data": [{
                    "yAxis": _this.publicChart[_this.chartType].cpuConditionData/100+'',
                    "label":{
                      formatter:function(params){
                        return params.value*100+'%'
                      }
                    }
                }]
              }
              return item;
            })
          }else if(_this.publicChart[_this.chartType].isCpuAlertLine && !_this.publicChart[_this.chartType].isCpuRunning){
            options.toolbox.feature.myTool2.icon='image://static/icon/stopBell.png';
          }

          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.cpuLineChart.setOption(options,true);
          _this.cpuLoading=false;
        });
      })
    },
    drawMemoryLine(){
      var _this=this;
      _this.memoryLoading=true;
      _this.memoryLineChart = echarts.init(document.getElementById('memoryLineContainer'));
      
      var options = {
            color:['#2b821d','#22c3aa','#96dee8','#7bd9a5','#22c3aa'],
            title: {
              text: 'MEMORY',
              x:'center'
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+"   ( "+ Math.round(params[i].value*10000)/100+'%'+" ) "+'<br />' 
                }
                return str;
              },
            },
            toolbox: {
              right:'10',
              top:'10',
              feature: {
                myTool1: {
                  show: !_this.publicChart[_this.chartType].isMemoryAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/stopBell.png',
                  onclick: function (){
                    _this.alertMark=_this.publicChart[_this.chartType].alertMarkMemory;
                    _this.taskTypeTxt=_this.publicChart[_this.chartType].taskTypeTxtMemory;
                    _this.isShowTimingTask=true;
                  }
                },
                myTool2: {
                  show: _this.publicChart[_this.chartType].isMemoryAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/startBell.png',
                  onclick: function (){
                    _this.upSingleTaskData(_this.publicChart[_this.chartType].isMemoryAlertData,_this.publicChart[_this.chartType].alertMarkMemory,_this.publicChart[_this.chartType].taskTypeTxtMemory);
                  }
                }
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'category',
              data: []
            },
            yAxis: {
              show:false,
              type: 'value',
              name:'%',
              axisLabel: {
                formatter: function (val) {
                  return Math.round(val*10000)/100
                }
              }
            },
            series: []
          };
     
        _this.lineTimer().then((nodes)=>{
          var nodeArr=[];
          for(var n=0;n<nodes.length;n++){
            nodeArr.push(
              nodes[n].key
            )
          }
          client.search({
            index: _this.publicChart[_this.chartType].searchIndex,
            body: {
              "size": 0,
              "sort": {
                "@timestamp": "desc"
              },
              "query":{
                "bool": {
                  "filter":[{ "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }}],
                  "must": [
                    {
                      "term": {
                        "metricset.name": "memory"
                      }
                    },{
                      "terms": {
                        "host.hostname":nodeArr
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "groupbyhost":{
                  "terms": {
                    "field": "host.hostname",
                    "min_doc_count": 0
                  },
                  "aggs": {
                    "time_histo": {                  
                      "date_histogram": {
                        "field": "@timestamp",
                        "interval": _this.flowTimeInterval,
                        "extended_bounds": {
                          "min": _this.fromTime,
                          "max": _this.endTime
                        }
                      },
                      "aggs": {
                        "total_sum": {
                          "avg": {
                            "field": "system.memory.actual.used.pct"
                          }
                        },
                        "difference": {
                          "serial_diff": {                
                            "buckets_path": "total_sum",
                            "lag" : 1
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            // console.log(res)
            // if(!res.aggregations){//当数据没打到metricbeat上时，可能连aggregations属性都没有，这时只能显示暂无数据，并且给个错误提示
            //   _this.memoryLineChart.clear();
            //   _this.memoryLineNodata=true;
            //   _this.memoryLoading=false;
            //   return false;
            // }

            var tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];
            var legendData=[],seriesData=[];
            if(tarResult.length==0){
              options.xAxis.show=false;
              options.yAxis.show=false;
              _this.memoryLineNodata=true;//暂无数据
            }else{
              options.xAxis.show=true;
              options.yAxis.show=true;
              _this.memoryLineNodata=false;//有数据
            }
            for(var i=0;i<tarResult.length;i++){
              var xaxisData=[],valData=[];
              var dataI=tarResult[i];
              legendData.push(dataI.key);
              for(var j=0;j<dataI.time_histo.buckets.length;j++){
                var dataJ=dataI.time_histo.buckets[j];
                var dataJV=dataJ.total_sum.value;
                if(!dataJV){
                  dataJV=0;
                }
                xaxisData.push(_this.transformMyDate(dataJ.key));
                valData.push(dataJV);
              }
              seriesData.push(
                {
                  name:dataI.key,
                  type:'line',
                  data:valData
                }
              );
            }

            if(_this.publicChart[_this.chartType].isMemoryAlertLine && _this.publicChart[_this.chartType].isMemoryRunning){
              seriesData=seriesData.map((item)=>{
                item.markLine= {
                  "symbol":"none",
                  "silent": true,
                  "lineStyle":{
                    "type":'dashed',
                    "color":"#893448"
                  },
                  "data": [{
                    "yAxis": _this.publicChart[_this.chartType].memoryConditionData/100,
                    "label":{
                      formatter:function(params){
                        return params.value*100+'%'
                      }
                    }
                  }]
                }
                return item;
              })
            }else if(_this.publicChart[_this.chartType].isMemoryAlertLine && !_this.publicChart[_this.chartType].isMemoryRunning){
              options.toolbox.feature.myTool2.icon='image://static/icon/stopBell.png';
            }

            options.legend.data=legendData;
            options.xAxis.data=xaxisData;
            options.series=seriesData;
            _this.memoryLineChart.setOption(options,true);
            _this.memoryLoading=false;
          });
        })
    },
    drawDiskRootLine(){
      var _this=this;
      _this.diskRootLoading=true;
      _this.diskRootLineChart = echarts.init(document.getElementById('diskRootLineContainer'));
      var options = {
            title: {
              text: '磁盘空间（/）',
              x:'center'
            },
            color:['#93b7e3','#59c4e6','#edafda','#cbb0e3','#3fb1e3'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'none'
              },
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+" ( "+ Math.round(params[i].value*10000)/100+'%'+" ) "+'<br />' 
                }
                return str;
              }
            },
            toolbox: {
              right:'10',
              top:'10',
              feature: {
                myTool1: {
                  show: !_this.publicChart[_this.chartType].isDiskRootAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/stopBell.png',
                  onclick: function (){
                    _this.alertMark=_this.publicChart[_this.chartType].alertMarkDiskRoot;
                    _this.taskTypeTxt=_this.publicChart[_this.chartType].taskTypeTxtDiskRoot;
                    _this.isShowTimingTask=true;
                  }
                },
                myTool2: {
                  show: _this.publicChart[_this.chartType].isDiskRootAlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/startBell.png',
                  onclick: function (){
                    _this.upSingleTaskData(_this.publicChart[_this.chartType].isDiskRootAlertData,_this.publicChart[_this.chartType].alertMarkDiskRoot,_this.publicChart[_this.chartType].taskTypeTxtDiskRoot);
                  }
                }
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: { 
              show:false,
              type: 'category',
              data:[]
            },
            yAxis: { 
              show:false,
              name:'%',
              axisLabel: {
                formatter: function (val) {
                  return Math.round(val*10000)/100
                }
              }
            },
            series: [
              // {
              //     type: 'line',
              //     name:'Matcha Latte',
              //     data:[41.1, 30.4, 65.1, 53.3,15],
              // },
            ]
          };

      _this.lineTimer().then((nodes)=>{
        var nodeArr=[];
        for(var n=0;n<nodes.length;n++){
          nodeArr.push(
            nodes[n].key
          )
        }
        client.search({
          index: _this.publicChart[_this.chartType].searchIndex,
          body: {
            "size": 0,
            "sort": {
              "@timestamp": "desc"
            },
            "query": {
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "term": {
                      "metricset.name": "filesystem"
                    }
                  },
                  {
                    "bool": {
                      "should": [
                        {
                          "term": {
                            "system.filesystem.mount_point": "/"
                          }
                        }
                      ]
                    }
                  },
                  {
                    "terms": {
                      "host.hostname":nodeArr
                    }
                  }
                ]
              }
            },
            "aggs": {
              "groupbyhost": {
                "terms": {
                  "field": "host.hostname",
                  "min_doc_count": 0
                },
                "aggs": {
          
          "groupbymountpoint": {
                    "terms": {
                      "field": "system.filesystem.mount_point",
                      "min_doc_count": 1
                    },
                    "aggs": {
                      "time_histo": {
                        "date_histogram": {
                          "field": "@timestamp",
                          "interval": _this.flowTimeInterval,//_this.timeinterval
                          "extended_bounds": {
                            "min": _this.fromTime,
                            "max": _this.endTime
                          }
                        },
                        "aggs": {
                          "total_sum": {
                            "max": {
                              "field": "system.filesystem.used.pct"
                            }
                          },
                          "difference": {
                            "serial_diff": {
                              "buckets_path": "total_sum",
                              "lag": 1
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((res)=>{
          const tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];

          let legendData=[],seriesData=[],xaxisData=[];
          if(tarResult[0].groupbymountpoint.buckets.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.diskRootLineNodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.diskRootLineNodata=false;//有数据
          }
          tarResult.forEach(ele=>{
            const eleBuckets=ele.groupbymountpoint.buckets;
            eleBuckets.forEach(item=>{
              xaxisData=[];
              let valData=[];
              legendData.push(ele.key+'（'+item.key+'）');

              const itemBuckets=item.time_histo.buckets;
              itemBuckets.forEach(v=>{
                let sumVal = v.total_sum.value
                if(!sumVal){
                  sumVal=0;
                }
                valData.push(sumVal);
                xaxisData.push(_this.transformMyDate(v.key));
              })
          
              seriesData.push({
                name:ele.key+'（'+item.key+'）',
                type: 'line',
                data:valData,
              })
              
            })
          })

          if(_this.publicChart[_this.chartType].isDiskRootAlertLine && _this.publicChart[_this.chartType].isDiskRootRunning){
            seriesData=seriesData.map((item)=>{
              item.markLine= {
                symbol:"none",
                silent: true,
                lineStyle:{
                  type:'dashed',
                  color:'#893448'
                },
                data: [{
                  yAxis: _this.publicChart[_this.chartType].diskRootConditionData/100,
                  "label":{
                    formatter:function(params){
                      return params.value*100+'%'
                    }
                  }
                }]
              }
              return item;
            })
          }else if(_this.publicChart[_this.chartType].isDiskRootAlertLine && !_this.publicChart[_this.chartType].isDiskRootRunning){
            options.toolbox.feature.myTool2.icon='image://static/icon/stopBell.png';
          }
          // console.log(legendData)
          // console.log(xaxisData)
          // console.log(seriesData)
          // console.log(options)
          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.diskRootLineChart.setOption(options,true);
          _this.diskRootLoading=false;
        });
      })
    },
    drawDiskRoot01Line(){
      var _this=this;
      _this.diskRoot01Loading=true;
      _this.diskRoot01LineChart = echarts.init(document.getElementById('diskRoot01LineContainer'));
      var options = {
            title: {
              text: this.$t('lg.cipiankongj')+'（/home）',
              x:'center'
            },
            color:['#cda819','#0098d9','#2b821d','#005eaa','#339ca8'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'none'
              },
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+" ( "+ Math.round(params[i].value*10000)/100+'%'+" ) "+'<br />' 
                }
                return str;
              }
            },
            toolbox: {
              right:'10',
              top:'10',
              feature: {
                myTool1: {
                  show: !_this.publicChart[_this.chartType].isDiskRoot01AlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/stopBell.png',
                  onclick: function (){
                    _this.alertMark=_this.publicChart[_this.chartType].alertMarkDiskRoot01;
                    _this.taskTypeTxt=_this.publicChart[_this.chartType].taskTypeTxtDiskRoot01;
                    _this.isShowTimingTask=true;
                  }
                },
                myTool2: {
                  show: _this.publicChart[_this.chartType].isDiskRoot01AlertLine,
                  title: _this.$t('lg.alertingtask'),
                  icon: 'image://static/icon/startBell.png',
                  onclick: function (){
                    _this.upSingleTaskData(_this.publicChart[_this.chartType].isDiskRoot01AlertData,_this.publicChart[_this.chartType].alertMarkDiskRoot01,_this.publicChart[_this.chartType].taskTypeTxtDiskRoot01);
                  }
                }
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: { 
              show:false,
              type: 'category',
              data:[]
            },
            yAxis: { 
              show:false,
              name:'%',
              axisLabel: {
                formatter: function (val) {
                  return Math.round(val*10000)/100
                }
              }
            },
            series: [
              // {
              //     type: 'line',
              //     name:'Matcha Latte',
              //     data:[41.1, 30.4, 65.1, 53.3,15],
              // },
            ]
          };

        _this.lineTimer().then((nodes)=>{
          var nodeArr=[];
          for(var n=0;n<nodes.length;n++){
            nodeArr.push(
              nodes[n].key
            )
          }
          client.search({
            index: _this.publicChart[_this.chartType].searchIndex,
            body: {
              "size": 0,
              "sort": {
                "@timestamp": "desc"
              },
              "query": {
                "bool": {
                  "filter":[
                    {
                      "range": {
                        "@timestamp": {
                          "from": _this.fromTime,
                          "to": _this.endTime,
                          "include_lower": true,
                          "include_upper": true
                        }
                      }
                    }
                  ],
                  "must": [
                    {
                      "term": {
                        "metricset.name": "filesystem"
                      }
                    },
                    {
                      "bool": {
                        "should": [
                          {
                            "term": {
                              "system.filesystem.mount_point": "/home"
                            }
                          }
                        ]
                      }
                    },
                    {
                      "terms": {
                        "host.hostname":nodeArr
                      }
                    }
                  ]
                }
              },
            "aggs": {
              "groupbyhost": {
                "terms": {
                  "field": "host.hostname",
                  "min_doc_count": 0
                },
                "aggs": {
                  "groupbymountpoint": {
                    "terms": {
                      "field": "system.filesystem.mount_point",
                      "min_doc_count": 1
                    },
                    "aggs": {
                      "time_histo": {
                        "date_histogram": {
                          "field": "@timestamp",
                          "interval": _this.flowTimeInterval,
                          "extended_bounds": {
                            "min": _this.fromTime,
                            "max": _this.endTime
                          }
                        },
                        "aggs": {
                          "total_sum": {
                            "max": {
                              "field": "system.filesystem.used.pct"
                            }
                          },
                          "difference": {
                            "serial_diff": {
                              "buckets_path": "total_sum",
                              "lag": 1
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((res)=>{
          console.log(">>>>>>>")
           console.log(res);
          // if(!res.aggregations){//当数据没打到metricbeat上时，可能连aggregations属性都没有，这时只能显示暂无数据
          //   _this.diskRoot01LineChart.clear();
          //   _this.diskRoot01LineNodata=true;
          //   _this.diskRoot01Loading=false;
          //   return false;
          // }
          const tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];
          let legendData=[],seriesData=[],xaxisData=[];
          if(tarResult[0].groupbymountpoint.buckets.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.diskRoot01LineNodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.diskRoot01LineNodata=false;//有数据
          }
          tarResult.forEach(ele=>{
            const eleBuckets=ele.groupbymountpoint.buckets;
            eleBuckets.forEach(item=>{
              xaxisData=[];
              let valData=[];
              legendData.push(ele.key+'（'+item.key+'）');

              const itemBuckets=item.time_histo.buckets;
              itemBuckets.forEach(v=>{
                let sumVal = v.total_sum.value
                if(!sumVal){
                  sumVal=0;
                }
                valData.push(sumVal);
                xaxisData.push(_this.transformMyDate(v.key));
              })
           
              seriesData.push({
                name:ele.key+'（'+item.key+'）',
                type: 'line',
                data:valData,
              })
           
            })
          })

          if(_this.publicChart[_this.chartType].isDiskRoot01AlertLine && _this.publicChart[_this.chartType].isDiskRoot01Running){
            seriesData=seriesData.map((item)=>{
              item.markLine= {
                symbol:"none",
                silent: true,
                lineStyle:{
                  type:'dashed',
                  color:'#893448'
                },
                data: [{
                  yAxis: _this.publicChart[_this.chartType].diskRoot01ConditionData/100,
                  "label":{
                    formatter:function(params){
                      return params.value*100+'%'
                    }
                  }
                }]
              }
              return item;
            })
          }else if(_this.publicChart[_this.chartType].isDiskRoot01AlertLine && !_this.publicChart[_this.chartType].isDiskRoot01Running){
            options.toolbox.feature.myTool2.icon='image://static/icon/stopBell.png';
          }

          // console.log(legendData)
          // console.log(xaxisData)
          // console.log(seriesData)
          // console.log(options)
          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.diskRoot01LineChart.setOption(options,true);
          _this.diskRoot01Loading=false;
        });
      })
    },
    //.end
    //.start shadow独有图表
    line3(){
      var _this=this;
      _this.tcpLoading=true;
      _this.myChart3 = echarts.init(document.getElementById('myLine3'));
      
      var options = {
            color:['#893448','#e6b600','#27727b','#fcce10','#e87c25','#60c0dd'],
            title: {
              text: 'TCP',
              x:'center'
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+"   ( "+ params[i].value+" ) "+'<br />' 
                }
                return str;
              },
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'category',
              //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              data: []
            },
            yAxis: {
              show:false,
              type : 'value',
              name:this.$t('lg.count'),
              // minInterval: 1,//保持y轴刻度只为整数
              scale:true,
              axisLabel : {
                formatter: '{value}'
              }
            },
            series: []
          };
     
      _this.lineTimer().then((nodes)=>{
        var nodeArr=[];
        for(var n=0;n<nodes.length;n++){
          nodeArr.push(
            nodes[n].key
          )
        }
        client.search({
          index: "shadow-metricbeat*",
          body: {
            "size": 0,
            "sort": {
              "@timestamp": "desc"
            },
            "query":{
              "bool": {
                "filter":[
                    { 
                    "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "term": {
                      "metricset.name": "socket"
                    }
                  },
                  {
                    "terms": {
                      "host.hostname": nodeArr
                    }
                  }
                ]
              }
            },
            "aggs": {
              "groupbyhost": {
                "terms": {
                  "field": "host.hostname",
                  "min_doc_count": 0
                },
                "aggs": {
                  "time_histo": {                  
                    "date_histogram": {
                      "field": "@timestamp",
                      "interval": _this.flowTimeInterval,
                      "extended_bounds": {
                        "min": _this.fromTime,
                        "max": _this.endTime
                      }
                    },
                    "aggs": {
                      "total_sum": {
                        "cardinality": {
                          "field": "process.pid"
                        }
                      },
                      "difference": {
                        "serial_diff": {                
                          "buckets_path": "total_sum",
                          "lag" : 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((res)=>{
          var tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];
          var legendData=[],seriesData=[];
          if(tarResult.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.line3Nodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.line3Nodata=false;//有数据
          }
          for(var i=0;i<tarResult.length;i++){
            var xaxisData=[],valData=[];
            var dataI=tarResult[i];
            legendData.push(dataI.key);
            for(var j=0;j<dataI.time_histo.buckets.length;j++){
              var dataJ=dataI.time_histo.buckets[j];
              var dataJV=dataJ.total_sum.value;
              if(!dataJV){
                dataJV=0
              }
              xaxisData.push(_this.transformMyDate(dataJ.key));
              valData.push(dataJV);
            }
            seriesData.push(
              {
                name:dataI.key,
                type:'line',
                data:valData
              }
            );
          }

          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.myChart3.setOption(options,true);
          _this.tcpLoading=false;
        });
      })
    },
    line4(){//http请求数
      var _this=this;
      _this.httprequestLoading=true;
      _this.myChart4 = echarts.init(document.getElementById('myLine4'));
      
      var options = {
            color:['#7cb4cc','#61a0a8','#e098c7','#9b8bba','#8fd3e8'],
            title: {
              text: _this.$t('lg.httprequests'),
              x:'center'
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                var str="";
                for(var i=0;i<params.length;i++){
                  str+=params[i].marker+params[i].seriesName+": " + params[i].name+"   ( "+ params[i].value+" ) "+'<br />' 
                }
                return str;
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'category',
              data: []
            },
            yAxis: {
              show:false,
              type: 'value',
              name:this.$t('lg.count')+'/'+this.$t('lg.second'),
              // minInterval: 1,//保持y轴刻度只为整数
            },
            series: []
        };
 
      _this.lineTimer().then((nodes)=>{
        var nodeArr=[];
        for(var n=0;n<nodes.length;n++){
          nodeArr.push(
            nodes[n].key
          )
        }
        client.search({
          index: "shadow-filebeat*",
          body: {
            "size": 0,
            "sort": {
              "@timestamp": "desc"
            },
            "query":{
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/access.log"
                    }
                  },
                  {
                    "terms": {
                      "host.hostname":nodeArr
                    }
                  }
                ]
              }
            },
            "aggs": {
              "groupbyhost":{
                "terms": {
                  "field": "host.hostname",
                  "min_doc_count": 0
                },
                "aggs": {
                  "time_histo": {                  
                    "date_histogram": {
                      "field": "@timestamp",
                      "interval": _this.flowTimeInterval,
                      "extended_bounds": {
                        "min": _this.fromTime,
                        "max": _this.endTime
                      }
                    }
                  }        
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res)
          var tarResult=res.aggregations?res.aggregations.groupbyhost.buckets:[];
          var legendData=[],seriesData=[];
          if(tarResult.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.line4Nodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.line4Nodata=false;//有数据
          }
          for(var i=0;i<tarResult.length;i++){
            var xaxisData=[],valData=[];
            var dataI=tarResult[i];
            legendData.push(dataI.key);
            for(var j=0;j<dataI.time_histo.buckets.length;j++){
              var dataJ=dataI.time_histo.buckets[j];
              xaxisData.push(_this.transformMyDate(dataJ.key));
              valData.push(Math.floor(dataJ.doc_count/10));
            }
            seriesData.push(
              {
                name:dataI.key,
                type:'line',
                data:valData
              }
            );
          }

          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.myChart4.setOption(options,true);
          _this.httprequestLoading=false;
        });
      })
    },
    line5(){//流量
      var _this=this;
      _this.networkLoading=true;
      _this.myChart5 = echarts.init(document.getElementById('myLine5'));
      var options = {
            color:['#008acd','#b6a2de','#2ec7c9','#ffb980','#d87a80','#8d98b3','#97b552','#95706d','#dc69aa','#c05050'],
            title: {
              text: _this.$t('lg.network'),
              x:'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            toolbox: { //流量图表报警暂时弃用
              right:'10',
              top:'10',
              feature: {
                myTool1: {
                  show: true,
                  title: "对比",
                  icon: 'image://static/icon/search.png',
                  onclick: function (){
                  //  _this.alertMark="networkMax";
                   // _this.taskTypeTxt=_this.$t('lg.networkbased');
                    _this.networkcpShow=true;
                  }
                },
                // myTool2: {
                //   show: _this.isNetworkAlertLine,
                //   title: _this.$t('lg.alertingtask'),
                //   icon: 'image://static/icon/startBell.png',
                //   onclick: function (){
                //     _this.upSingleTaskData(_this.isNetworkAlertData,'networkMax',_this.$t('lg.networkbased'));
                //   }
                // }
              }
            },
            legend: {
              type:'scroll',
              itemGap: 5,
              left:'3%',
              right:'5%',
              bottom:'0',
              data:[]
            },
            grid: {
              top:'16%',
              left: '4%',
              right: '5%',
              bottom: '10%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'category',
              data: []
            },
            yAxis: {
              show:false,
              type: 'value',
              name:'M/'+this.$t('lg.second'),
            },
            series: []
          };
          
      function lineTimerFn(){
        client.search({
          index: "shadow-metricbeat*",
          body:{
            "size": 0,
            "sort": {
              "@timestamp": "desc"
            },
            "query": {
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "term": {
                      "metricset.name": "network"
                    }
                  }//,
                  // {
                  //   "term": {
                  //     "system.network.name": "eth0"
                  //     }
                  //   }
                ]
              }
            },
            "aggs":{
              "groupByHost":{
                "terms": {
                  "field": "host.hostname"
                },
                "aggs": {
                  "time_histo": {
                    "date_histogram": {
                      "field": "@timestamp",
                      "interval": _this.flowTimeInterval
                    },
                    "aggs": {
                      "in_sum": {
                        "avg": {
                          "field": "system.network.in.bytes"
                        }
                      },
                      "out_sum": {
                        "avg": {
                          "field": "system.network.out.bytes"
                        }
                      },
                      "total_sum": {
                        "bucket_script": {
                          "buckets_path": {
                            "in_sum": "in_sum",
                            "out_sum": "out_sum"
                          },
                          "script": "params.in_sum+params.out_sum"
                        }
                      },
                      "difference": {
                        "serial_diff": {
                          "buckets_path": "total_sum",
                          "lag": 1
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.groupByHost.buckets:[];
          var legendData=[],sumLegendData=[],
              seriesData=[],sumSeriesData=[];
          if(tarResult.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            _this.line5Nodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.line5Nodata=false;//有数据
          }
          for(var i=0;i<tarResult.length;i++){
            var xaxisData=[],valData=[];
            var dataI=tarResult[i];
            legendData.push(dataI.key);
            for(var j=0;j<dataI.time_histo.buckets.length;j++){
              var dataJ=dataI.time_histo.buckets[j];
              // xaxisData.push(_this.transformMyDate(dataJ.key));
              // valData.push(dataJ.doc_count);
              if(dataJ.difference){
                xaxisData.push(_this.transformMyDate(dataJ.key));
                var Mdifference = Math.floor(dataJ.difference.value/1024/1024)/10
                valData.push(Mdifference);
              }
            }
            // console.log(valData)
            seriesData.push(
              {
                name:dataI.key,
                type:'line',
                data:valData
              }
            );
          }

          //流量图表报警暂时弃用
          // if(_this.isNetworkAlertLine && _this.isNetworkRunning){
          //   seriesData=seriesData.map((item)=>{
          //     item.markLine= {
          //       symbol:"none",
          //       silent: true,
          //       lineStyle:{
          //           type:'dashed',
          //           color:'#893448'
          //       },
          //       data: [{
          //         yAxis: _this.networkConditionData,
          //         "label":{
          //           formatter:function(params){
          //             return params.value+'M'
          //           }
          //         }
          //       }]
          //     }
          //     return item;
          //   })
          // }else if(_this.isNetworkAlertLine && !_this.isNetworkRunning){
          //   options.toolbox.feature.myTool2.icon='image://static/icon/stopBell.png';
          // }

          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.myChart5.setOption(options,true);
          _this.networkLoading=false;
        });
      }
      lineTimerFn();
    },
    //.end 
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    // transformMyDate2(d){
    //   d=new Date(d-8*60*60*1000);
    //   function pad(n){
    //     return n<10 ? '0'+n : n
    //   }
    //   return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes());
    // }
    handleTime(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      _this.timeinterval=_this.$store.state.mydatedata.interval || '5m';
      _this.flowTimeInterval=_this.$store.state.mydatedata.flowInterval || '600s';
    },
    getTimingTask(taskType){//获取 邮件报警任务
      let _this=this;
      var url = SERVER_API_URL + "monitoring/scheduling/tasks";
      _this.editTaskId=null;
      return new Promise((resolve,reject)=>{
        axios.get(url).then((res)=>{
          let data=res.data.data;
          data.forEach((item,index)=>{
            // console.log(item)
            if(item.params){
              if(item.params.alertmark=='cpuMax' || item.params.alertmark=='memoryMax' || item.params.alertmark=='networkMax' || item.params.alertmark=='diskRootMax' || item.params.alertmark=='diskRoot01Max' || item.params.alertmark=='cpu_cmMax' || item.params.alertmark=='memory_cmMax' || item.params.alertmark=='diskRoot_cmMax' || item.params.alertmark=='diskRoot01_cmMax' ){
                var editItem = data[index];
                editItem.rate = editItem.frequency.match(/(\d*)(\w*)/)[1];
                editItem.rateUnitValue = editItem.frequency.match(/(\d*)(\w*)/)[2];
                switch(editItem.rateUnitValue)
                {
                  case "h":
                  editItem.rateUnitValueTxt=_this.$t('lg.hour');
                  break;
                  case "d":
                  editItem.rateUnitValueTxt=_this.$t('lg.day');
                  break;
                  case "w":
                  editItem.rateUnitValueTxt=_this.$t('lg.week');
                  break;
                  default:
                  editItem.rateUnitValueTxt=_this.$t('lg.year');
                };

                editItem.params.timeInterval = editItem.params.interval.match(/(\d*)(\w*)/)[1];
                editItem.params.intervalUnitVal = editItem.params.interval.match(/(\d*)(\w*)/)[2];
                switch(editItem.params.intervalUnitVal)
                { 
                  case "m":
                  editItem.params.intervalUnitValTxt=_this.$t('lg.minite');
                  case "h":
                  editItem.params.intervalUnitValTxt=_this.$t('lg.hour');
                  break;
                  default:
                  editItem.params.intervalUnitValTxt=_this.$t('lg.day');
                };

                if(item.params.alertmark=='cpuMax'){
                  if(item.status=='running'){
                    _this.publicChart['shadow'].isCpuRunning = true;
                    if(taskType == 'cpuMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['shadow'].isCpuRunning = false;
                    if(taskType == 'cpuMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }
                  _this.publicChart['shadow'].isCpuAlertLine=true;
                  _this.publicChart['shadow'].isCpuAlertData=editItem;
                  _this.publicChart['shadow'].cpuConditionData=editItem.params.monThreshold.replace('%','');
                  
                }else if(item.params.alertmark=='memoryMax'){
                  if(item.status=='running'){
                    _this.publicChart['shadow'].isMemoryRunning = true;
                    if(taskType == 'memoryMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['shadow'].isMemoryRunning = false;
                    if(taskType == 'memoryMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }
                  _this.publicChart['shadow'].isMemoryAlertLine=true;
                  _this.publicChart['shadow'].isMemoryAlertData=editItem;
                  _this.publicChart['shadow'].memoryConditionData=editItem.params.monThreshold.replace('%','');
                
                }else if(item.params.alertmark=='networkMax'){

                  if(item.status=='running'){
                    _this.isNetworkRunning = true;
                    if(taskType == 'networkMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.isNetworkRunning = false;
                    if(taskType == 'networkMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }
                  _this.isNetworkAlertLine=true;
                  _this.isNetworkAlertData=editItem;
                  _this.networkConditionData=_this.isNetworkAlertData.params.monThreshold.replace('M','');
                }else if(item.params.alertmark=='diskRootMax'){
                 
                  if(item.status=='running'){
                    _this.publicChart['shadow'].isDiskRootRunning = true;
                    if(taskType == 'diskRootMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['shadow'].isDiskRootRunning = false;
                    if(taskType == 'diskRootMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }

                  _this.publicChart['shadow'].isDiskRootAlertLine=true;
                  _this.publicChart['shadow'].isDiskRootAlertData=editItem;
                  _this.publicChart['shadow'].diskRootConditionData=editItem.params.monThreshold.replace('%','');

                }else if(item.params.alertmark=='diskRoot01Max'){
                  
                  if(item.status=='running'){
                    _this.publicChart['shadow'].isDiskRoot01Running = true;
                    if(taskType == 'diskRoot01Max'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['shadow'].isDiskRoot01Running = false;
                    if(taskType == 'diskRoot01Max'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }

                  _this.publicChart['shadow'].isDiskRoot01AlertLine=true;
                  _this.publicChart['shadow'].isDiskRoot01AlertData=editItem;
                  _this.publicChart['shadow'].diskRoot01ConditionData=editItem.params.monThreshold.replace('%','');

                }else if(item.params.alertmark=='cpu_cmMax'){//cm
                  if(item.status=='running'){
                    _this.publicChart['cm'].isCpuRunning = true;  
                   
                    if(taskType == 'cpu_cmMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['cm'].isCpuRunning = false;  
                    if(taskType == 'cpu_cmMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }
                  _this.publicChart['cm'].isCpuAlertLine=true;
                  _this.publicChart['cm'].isCpuAlertData=editItem;
                  _this.publicChart['cm'].cpuConditionData=editItem.params.monThreshold.replace('%','');
                }else if(item.params.alertmark=='memory_cmMax'){
                  if(item.status=='running'){
                    _this.publicChart['cm'].isMemoryRunning = true;
                    if(taskType == 'memory_cmMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['cm'].isMemoryRunning = false;
                    if(taskType == 'memory_cmMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }
                  _this.publicChart['cm'].isMemoryAlertLine=true;
                  _this.publicChart['cm'].isMemoryAlertData=editItem;
                  _this.publicChart['cm'].memoryConditionData=editItem.params.monThreshold.replace('%','');
                }else if(item.params.alertmark=='diskRoot_cmMax'){
                  if(item.status=='running'){
                    _this.publicChart['cm'].isDiskRootRunning = true;
                    if(item.params.alertmark=='diskRoot_cmMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['cm'].isDiskRootRunning = false;
                    if(item.params.alertmark=='diskRoot_cmMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }

                  _this.publicChart['cm'].isDiskRootAlertLine=true;
                  _this.publicChart['cm'].isDiskRootAlertData=editItem;
                  _this.publicChart['cm'].diskRootConditionData=editItem.params.monThreshold.replace('%','');
                }else if(item.params.alertmark=='diskRoot01_cmMax'){
                  if(item.status=='running'){
                    _this.publicChart['cm'].isDiskRoot01Running = true;
                    if(item.params.alertmark=='diskRoot01_cmMax'){
                      _this.isRunning=true;
                      _this.editTaskId=editItem.id;
                    }
                  }else{
                    _this.publicChart['cm'].isDiskRoot01Running = false;
                    if(item.params.alertmark=='diskRoot01_cmMax'){
                      _this.isRunning=false;
                      _this.editTaskId=editItem.id;
                    }
                  }

                  _this.publicChart['cm'].isDiskRoot01AlertLine=true;
                  _this.publicChart['cm'].isDiskRoot01AlertData=editItem;
                  _this.publicChart['cm'].diskRoot01ConditionData=editItem.params.monThreshold.replace('%','');
                }     
              }
            }
          });
          resolve({
            cpuline:_this.isCpuAlertLine,
            memoryline:_this.isMemoryAlertLine,
            networkline:_this.isNetworkAlertLine,
            diskRootLine:_this.isDiskRootAlertLine,
            diskRoot01Line:_this.isDiskRoot01AlertLine,
          })    
        });
      })
    },
    upSingleTaskData(taskObj,taskMark,taskName){//把当前任务传入timingTaskPop子组件
      var _this=this;
      if(taskObj.status=='running'){
        _this.isRunning=true;
      }else{
        _this.isRunning=false;
      }
      _this.alertMark=taskMark;
      _this.taskTypeTxt=taskName;
      _this.timingTaskform=taskObj;
      _this.editTaskId=taskObj.id;
      _this.isShowTimingTaskEdit=true;
    },
    lineTimer(){
      return new Promise((resolve,reject)=>{
        client.search({
          index:this.publicChart[this.chartType].searchIndex,
          body:{
            "size": 0,
            "aggs" : {
              "langs" : {
                "terms" : {
                  "field" : "host.hostname"
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res)
          if(!res.aggregations){//如果metricbeat上数据有问题就会导致aggregations这段无返回
            resolve([]);
          }else{//保证系统安装无误的情况下
            resolve(res.aggregations.langs.buckets);
          }
        })
      })
    },
    aggMountpoint(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var sttime=_this.$store.state.mydatedata.starttime,
            edtime=_this.$store.state.mydatedata.endtime;
        var fromTime2=toISO8601(sttime),
            endTime2=toISO8601(edtime);
        var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
            endTime=endTime2 || toISO8601(new Date()); 
        client.search({
          index:this.publicChart[this.chartType].searchIndex,
          body:{
            "size": 0,
            "query": {
                "bool": {
                  "filter": [{
                    "range": {
                      "@timestamp": {
                        "from": fromTime,
                        "to": endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }]
                }
              },
                "aggs" : {
                  "langs" : {
                    "terms" : {
                      "field" : "system.filesystem.mount_point"
                    },
                    "aggs": {
                      "totalpercent": {
                        "avg": {
                          "field": "system.filesystem.used.pct"
                        }
                      }
                    }
                  }
                }
          }
        }).then((res)=>{
          let resolveBuckets=[];
          if(res.aggregations && res.aggregations.langs){
            resolveBuckets=res.aggregations.langs.buckets;
          }
           if(resolveBuckets.length==0){
            this.line6Nodata=true;
           }else{
            this.line6Nodata=false;
           }
           resolve(resolveBuckets);     
        });

      })
    },
    getMountpoint(){
      const _this=this;
      _this.aggMountpoint().then((data)=>{
        let datai;
        this.mountPointData=[];
        for(let i=0;i<data.length;i++){
          datai=data[i];
          _this.getMatchMountpoint(datai.key).then((resolvedata)=>{
            let redata=resolvedata.hits.hits;
            this.mountPointData.push(...redata)
          });
        }
      })
    },
    getMatchMountpoint(item){
      return new Promise((resolve,reject)=>{
        client.search({
            index:this.publicChart[this.chartType].searchIndex,
            body:{
              "size": 1,
              "sort": {
                  "@timestamp": "desc"
                },
              "query": {
                "bool": {
                  "must": [
                    {
                      "match": {
                        "system.filesystem.mount_point": item
                      }
                    }
                  ]
                }
              }
            }
          }).then((res)=>{
            resolve(res);
          })
      });

    },
    getMountpoint2(){
     let fromTime=toISO8601(new Date(Date.now()-30000)),
          endTime=toISO8601(new Date()); 
        client.search({
          index:this.publicChart[this.chartType].searchIndex,
          body:{
            "size": 0,
            "query": {
                "bool": {
                  "filter": [{
                    "range": {
                      "@timestamp": {
                        "from": fromTime,
                        "to": endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }]
                }
              },
                "aggs" : {
                  "langs" : {
                    "terms" : {
                      "field" : "system.filesystem.mount_point"
                    },
                    "aggs": {
                      "totalpercent": {
                        "avg": {
                          "field": "system.filesystem.used.pct"
                        }
                      }
                    }
                  }
                }
          }
        }).then((res)=>{
            let resolveBuckets=[];
            if(res.aggregations && res.aggregations.langs){
              resolveBuckets=res.aggregations.langs.buckets;
            }
           if(resolveBuckets.length==0){
             this.line6Nodata=true;
           }else{
             this.mountPointData=resolveBuckets;
             this.line6Nodata=false;
           }
           
        })
    },
    fullScreen(){//大屏展示
      var chartGridDom = document.getElementsByClassName('dashboard-wrapper');
      chartGridDom[0].requestFullscreen();

      window.addEventListener("fullscreenchange", (e) => {
        if (document.fullscreenElement) {
          // console.log('进入全屏')
          this.isShowQueryPanel = false;
          this.isShowGridMenu = false;
        } else {
          // console.log('退出全屏')
          this.isShowQueryPanel = true;
          this.isShowGridMenu = true;
        }
      })
    },


  },
  filters:{
    percentFormat(num){
      return (num*100).toFixed(1)+"%"
    },
    gbFormat(item){
      return (item/1073741824).toFixed(2)
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
};
</script>
<style>
.dashboard-wrapper{
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
.changePanel{
  width: 100%;
  margin-bottom: 15px;
}
.changeBox{
  padding:15px;
  background: #f7f7f7;
  border: 1px solid #eee;
  /* box-shadow: 2px 2px 5px #ccc; */
  box-sizing: border-box;
}
.dashboardContent{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
}

.chartRow{
  margin-bottom: 10px;
}
.chartBox{
  height: 300px;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  /* box-shadow: 2px 2px 5px #ccc; */
}

/* loading 主要针对‘自定义图表’的loading */
.dashboard-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.dashboard-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
.mountpointbox{
  border: 1px solid #f7f7f7;
}
.mountpointtitle{
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  color: #000;
  line-height: 28px;
  padding: 12px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid #f7f7f7;
  
}
.mountpoint{
  display: flex;
  padding:12px;
  border-bottom: 1px solid #f7f7f7;
}
.mountpoint:last-child{
  border-bottom: none;
}
.mountpoint .item{
  flex:1
}
.line6Nodata{
  text-align: center;
  line-height: 28px;
}
</style>