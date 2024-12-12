<template>
  <div class="visitChart-wrapper" @click="hideSDURLMenu">
    <query-panel @getAllQuerychart="getAllchart" @getChartTypeAllQuery='getChartTypeAllQuery' @handleTime="handleTime" :myChartType='myChartType' v-show="isShowQueryPanel"></query-panel><!-- 查询面板 -->
    
    <div class="visitChartContent">
       <el-row :gutter="10" class="chartRow chartRowBusi">
          <el-col :span="20" style="padding-left:0px">
            <div class="chart-content" 
                v-loading="businessLineLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)" style="padding:15px;box-sizing:border-box;">
              <pienodata mystyle="linenodata" v-if="businessNodata"></pienodata>
              <div ref="businessContainer" id="businessContainer"></div>
            </div>
          </el-col>
          <el-col :span="4" class="busiNumBox">
            <ul class="totalList">
              <li class="listTitle">{{$t('lg.totalrequests')}}：</li>
              <li>
                <i class="liLable">MAX:</i>
                <p class="liValue">{{wholeCtMax}}</p>
              </li>
              <li>
                <i class="liLable">MIN:</i>
                <p class="liValue">{{wholeCtMin}}</p>
              </li>
            </ul>
            <ul class="someList">
              <li class="listTitle">{{$t('lg.fangwen')}}：</li>
              <li>
                <i class="liLable">MAX:</i>
                <p class="liValue">{{normalCtMax}}</p>
              </li>
              <li>
                <i class="liLable">MIN:</i>
                <p class="liValue">{{normalCtMin}}</p>
              </li>
            </ul>
          </el-col>
         <!-- <el-col :span="6">
         <div class="chart-content numBox txtOverflow">
            <p class="text-center numBoxTitle">总数据量</p>
            <div class="totalBox">
              <p class='numTitle'>请求总量</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">次</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>恶意访问总量</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">次</span></p>
            </div>
          </div>
        </el-col> -->
      </el-row>
      <el-row :gutter="10" class="chartRow">
        <el-col :span="16">
          <div class="chart-content"
              v-loading="orgIpLineLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata  mystyle="linenodata" v-if="orgIpLineNodata"></pienodata>
            <div id="orgIpLineContainer"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-content numBox txtOverflow">
            <p class="text-center numBoxTitle" style="padding-top:10px">{{$t('lg.totaldatav')}}</p>
            <div class="totalBox">
              <p class='numTitle'>{{$t('lg.totalrquestammount')}}</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>{{$t('lg.totalaccess2')}}</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
          </div>
          </el-col>
      </el-row>

      <el-row :gutter="10" class="chartRow">
        <el-col :span="16">
          <div class="chart-content"
              v-loading="domainLineLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata  mystyle="linenodata" v-if="domainLineNodata"></pienodata>
            <div id="domainLineContainer"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-content"
              v-loading="domainPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="domainPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="domainPieContainer"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="chartRow">
        <el-col :span="16">
          <div class="chart-content"
              v-loading="eCodeTypeLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="eCodeTypeNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="eCodeTypeContainer"></div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="chart-content"
              v-loading="orgIpPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="orgIpPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="orgIpPieContainer"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="chartRow">
        <el-col :span="14">
          <div class="chart-content"
              v-loading="fingerPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle fingerPie-circle" v-if="fingerPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="fingerPieContainer"></div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="chart-content"
              v-loading="autoToolPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="autoToolPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="autoToolPieContainer"></div>
          </div>
        </el-col>
      </el-row>
        
        
      <el-row :gutter="10" class="chartRow">
        <el-col :span="24">
          <div class="chart-content"
              v-loading="urlVisitCtLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="urlVisitCtBarNodata"></pienodata>
            <div id="urlVisitCtBarContainer"></div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="chartRow">
        <el-col :span="12">
          <div class="chart-content"
              v-loading="regionBarLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <!-- <pienodata mystyle="linenodata" v-if="regionBarNodata"></pienodata> -->
            <div class="adaptive-circle" v-if="regionBarNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="regionBarContainer"></div>
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row>
      <div>
      
    </div>
    </div>

    <div v-for="(item,index) in chartDataList">
      <div style="width:50%;height:300px" v-if="item.key && item.value.vzActiveName!='table'"
             :id='"charts"+item.key'
             class="disableDiv"></div>
    </div>
    
    <!-- 日志弹框 -->
    <el-dialog :title="logDialogTitle" :visible.sync="logDialogVisible" width="80%" :before-close="logDialogClose">
      <log-rebuild :tableKeyArr='tableKeyArrAllAccess'  :dynamicTag='chartLogsHeadData' @refilterColBy='refilterColByAccess' @requeryRowBy='requeryRowByAccess'></log-rebuild>
      <div v-if="chartLogsTotalNum==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="chartLogsTotalNum>0" class="logTableHeight">
        <log-tables ref="log_tables" :tabheadData="chartLogsHeadData" :tabodyData="chartLogsBodyData" :totalNum="chartLogsTotalNum" @getChangePageLogData="getChangeLogData" :isLogLoding="false" :showSDURLMenu='showSDURLMenu'></log-tables>
      </div>
    </el-dialog>

    <!-- 右侧操作列表 -->
    <ul class="operationBtnUl"
        v-show="isShowGridMenu">
      <li>
        <img src="static/icon/fullScreen.png"
             :alt="$t('lg.dapinzhans')"
             :title="$t('lg.dapinzhans')"
             @click="fullScreen">
      </li>
      
      <li>
        <img src="static/icon/downpdfChart.png"
             :alt="$t('lg.daochupdf')"
             :title="$t('lg.daochupdf')"
             @click="downLoadPdf">
      </li>
      <li>
        <img src="static/icon/map.png"
             alt="$t('lg.returnmap')"
             title="$t('lg.returnmap')"
             @click="goBackMap">
      </li>
    </ul>

  </div>
</template>

<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import client from "@/components/es/connection";
import * as types from '@/store/types';
import pienodata from '@/basecomponents/pienodata';
import toISO8601 from '@/assets/js/iso8601';
import echarts from 'echarts';
import queryPanel from './queryPanel';
import {logskeys} from '@/assets/js/logskeys';
import logRebuild from "@/components/logs/logRebuild";
import logTables from '@/components/home/logTables';
import Emitter from 'element-ui/src/mixins/emitter';
import prmoSearchStr from '@/assets/js/prmoSearch.js'//防护模式、监控模式 不同的查询条件  
import {handleAccesslogData, getTarResultArr} from '@/assets/js/tool';
import {errorObj,errorObj2} from '@/assets/js/errorcode';

export default {
  mixins: [Emitter],
  components:{
    pienodata,
    queryPanel,
    logRebuild,
    logTables,
  },
  data(){
    return{
      layout: [],
      chartDataList: [],
      chartDataListMap:[],
      listChart: [],
      createdBoxSize: { "x": 0, "y": 0, "w": 6, "h": 8, i: 'createdBox' },
      // obj:null,

      isShowGridMenu: true,//右下角菜单大屏展示时要隐藏

      graphList: [],//用来存储坐标轴图。坐标轴图能选取x轴时间,

      pieAndBarGaugeList: [],//用来存储坐标轴图。点击能弹出对应的日志数据,

      //日志弹框参数
      mySourceLog:'access.log',//点击出现弹框时记录当前图表日志来源
      logPopQueryObj: {},//查询语句
      logDialogVisible9: false,
      logDialogTitle9: '',
      tableKeyArrLog: [],//access.log or waf.log总共（默认）显示的字段
      chartLogsHeadData: [],//用户自定义显示的字段
      chartLogsBodyData: [],//传入logTables.vue子组件的表体数据
      chartLogsTotalNum: 0,
      fromPage: 0,
      pageSize: 10,
      requeryObj: null,//////////////////////
      isencn:'cn',
      forFastShow:false,
      mustOptions:[],
      fromTime:0,
      endTime:0,
      timeinterval:'',

      //两种类型图表 防护模式、监控模式
      myChartType:'protectChart',

      //顶部查询面板
      isFalg:false,//判断是否通过查询面板来查询的阀门
      checkDomain:'',
      checkUrl:'',
      filterObj:{"match_all": {}},//顶部查询面板的查询条件

      //max min 
      wholeCtMax:0,
      wholeCtMin:0,
      normalCtMax:0,
      normalCtMin:0,

      businessLineLoading:false,
      urlVisitCtLoading:false,
      eCodeTypeLoading:false,
      orgIpLineLoading:false,
      orgIpPieLoading:false,
      domainLineLoading:false,
      domainPieLoading:false,
      fingerPieLoading:false,
      autoToolPieLoading:false,
      regionBarLoading:false,

      businessLineChart:null,
      urlVisitCtBarChart:null,
      eCodeTypeChart:null,
      orgIpLineChart:null,
      orgIpPieChart:null,
      domainLineChart:null,
      domainPieChart:null,
      fingerPieChart:null,
      autoToolPieChart:null,
      regionBarChart:null,
      
      businessNodata:false,
      urlVisitCtBarNodata:false,
      eCodeTypeNodata:false,
      orgIpLineNodata:false,
      orgIpPieNodata:false,
      domainLineNodata:false,
      domainPieNodata:false,
      fingerPieNodata:false,
      autoToolPieNodata:false,
      regionBarNodata:false,
      
      totalNum:0,
      attackSumNum:0,
      isRegionBarOrg:false,
      isLineOrg:false,
      isPieOrg:false,

      fingerPieLegendShow:false,
      //日志弹框参数
      popQueryObj:{"bool":{"must":[{"bool":{"should": []}}]}},
      logDialogVisible:false,
      logDialogTitle:'',
      tableKeyArrAccess:[...logskeys.access], //access.log总共（默认）显示的字段
      defHeaderData:[
        { 
          propName:'hostname',
          colWidth:'130',
          "field":"host.hostname",
          "zh":this.$t('lg.visitnodename'),
          "type":"keyword"
        },
        {
          propName:'errorCodeTxt',
          colWidth:'200',
          "field":"shadow.access.error_code_txt",
          "zh":this.$t('lg.accesstype'),
          "type":"long"
        },
        {
          propName:'responseCode',
          colWidth:'110',
          "field":"shadow.access.response_code",
          "zh":this.$t('lg.rscode'),
          "type":"long"
        },
        { 
          propName:'scheme',
          colWidth:'200',
          "field":"shadow.access.scheme",
          "zh":"scheme",
          "type":"keyword"
        },
        { 
          propName:'method',
          colWidth:'110',
          "field":"shadow.access.method",
          "zh":this.$t('lg.request'),
          "type":"keyword"
        },
        {
          propName:'domain',
          colWidth:'200',
          "field":"shadow.access.domain",
          "zh":this.$t('lg.accessbsdomain'),
          "type":"keyword"
        },
        {
          propName:'shadowUrl',
          colWidth:'450',  
          "field":"shadow.access.shadow_url",
          "zh":this.$t('lg.userrequesturl'),
          "type":"keyword"
        },
        {
          propName:'errorCode',
          colWidth:'120',
          "field":"shadow.access.error_code",
          "zh":this.$t('lg.dynamicfilter'),
          "type":"long"
        },
        { 
          propName:'remoteIp',
          colWidth:'130',
          "field":"shadow.access.remote_ip",
          "zh":this.$t('lg.sourceip'),
          "type":"keyword"
        }
      ],
      tableKeyArrAllAccess:[...logskeys.access],
      chartLogsHeadData:[],
      chartLogsBodyData:[],
      chartLogsTotalNum:0,
      fromPage:0,
      pageSize:10,
      requeryObj:null,

      // 地域信息切换源IP、代理IP
      searchGeoip:'params._source.shadow.access.geoip',
      searchGeoip2:'shadow.access.geoip',
      mapScript:'geoip',

      searchIp:'',

      // 被恶意访问的url次数/Top10 触发es查询时做节流，（鼠标触摸时只触发一次查询，否则将产生多次重复查询）
      esSearchTimer:null,

      //大屏展示
      isShowQueryPanel:true,//隐藏
      isShowGridMenu:true,//隐藏
    }
  },
  created(){
    // this.$store.state.isShowTimerate = true;//采样频率选择
    // this.$store.state.mydatedata.interval = '5m';
    // this.$store.state.timerateValue='采样频率';
this.isencn=localStorage.lang;
    if(this.isencn=="en"){
      this.tableKeyArrAllAccess=logskeys2.access;
    }else{
      this.tableKeyArrAllAccess=logskeys.access;
    }
    this.getCustomHeadData();
    
    // resize
    window.addEventListener("resize", () => {
      this.eCodeTypeChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      this.fingerPieChart.resize();
      this.autoToolPieChart.resize();
      this.businessLineChart.resize();
     // if(this.forFastShow){
        this.urlVisitCtBarChart.resize();
        this.regionBarChart.resize();
     // }
      
    });
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      this.handleTime();
      this.getAllchart();
    },
    '$store.state.isMenuShow':function(){
      this.eCodeTypeChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      this.fingerPieChart.resize();
      this.autoToolPieChart.resize();
      this.businessLineChart.resize();
    //  if(this.forFastShow){
        this.urlVisitCtBarChart.resize();
        this.regionBarChart.resize();
     // }
    }
  },
  mounted(){
    this.getChartGridData();
    if(!this.$route.query.timeInterval){
      this.handleTime();
      this.getAllchart();
    }
  },
  methods:{
    //.start 处理重新请求回来的数据，不同图表类型，所需的数据结构也不同
    opitongGraphData(data, num, item){//处理坐标图 graph的数据
      // console.log(data);
      const aggsField = item.value.data.queryform.aggsId;//聚合
      const sourceLog = item.value.data.queryform.logId;
      const xAxisData = [];
      let legendData = [];
      let seriesData = []
      if (!aggsField) {
        legendData = ['all'];
        let seriesDataArr = [];
        data.forEach((val, index) => {
          if (sourceLog == "access.log") {//access.log日志查询出来的时间不用减去8小时
            xAxisData.push(this.transformMyDate(val.key))
          } else {
            xAxisData.push(this.transformMyDate2(val.key))
          }
          seriesDataArr.push({value:val.doc_count});
        })
        if (item.value.data.optBar) {
          const stackBarVal = item.value.data.optStack ? 'bar' : null;
          seriesData.push({
            name: 'all',
            type: 'bar',
            stack: stackBarVal,
            data: seriesDataArr,
            large: true,
            barMaxWidth: 10,
          })
        }

        // console.log(JSON.stringify(seriesData))

        if (item.value.data.optLine) {
          const stackLineVal = item.value.data.optStack ? 'line' : null;
          seriesData.push({
            name: 'all',
            type: 'line',
            stack: stackLineVal,
            step: item.value.data.optStaircase,
            symbolSize: 0.1,
            lineStyle: {
              width: item.value.data.lineWidthValue * 10
            },
            areaStyle: {
              opacity: item.value.data.fillValue
            },
            data: seriesDataArr,

          })
        }

        if (item.value.data.optPoint) {
          const stackPointVal = item.value.data.optStack ? 'point' : null;
          seriesData.push({
            name: 'all',
            type: 'line',
            stack: stackPointVal,
            symbol: item.value.data.symbolValue,
            symbolSize: item.value.data.symbolSizeVal,
            lineStyle: {
              width: 0
            },
            areaStyle: {
              opacity: 0
            },
            data: seriesDataArr
          })
        }

      } else {
        const arrs = data.length ? data[0].time_his.buckets : [];//时间轴取一个即可
        arrs.forEach(val => {
          xAxisData.push(this.transformMyDate(val.key))
        })
        data.forEach((el) => {
          legendData.push(String(el.key));
          const itemArr = el.time_his.buckets;
          let seriesDataArr = [];

          itemArr.forEach(val => {
            seriesDataArr.push({value:val.doc_count});
          })
          if (item.value.data.optBar) {
            const stackBarVal = item.value.data.optStack ? 'bar' : null;
            seriesData.push({
              name: el.key,
              type: 'bar',
              stack: stackBarVal,
              data: seriesDataArr,
              large: true,
              barMaxWidth: 10,
            })
          }

          // console.log(JSON.stringify(seriesData))

          if (item.value.data.optLine) {
            const stackLineVal = item.value.data.optStack ? 'line' : null;
            seriesData.push({
              name: el.key,
              type: 'line',
              stack: stackLineVal,
              step: item.value.data.optStaircase,
              symbolSize: 0.1,
              lineStyle: {
                width: item.value.data.lineWidthValue * 10
              },
              areaStyle: {
                opacity: item.value.data.fillValue
              },
              data: seriesDataArr,

            })
          }

          if (item.value.data.optPoint) {
            const stackPointVal = item.value.data.optStack ? 'point' : null;
            seriesData.push({
              name: el.key,
              type: 'line',
              stack: stackPointVal,
              symbol: item.value.data.symbolValue,
              symbolSize: item.value.data.symbolSizeVal,
              lineStyle: {
                width: 0
              },
              areaStyle: {
                opacity: 0
              },
              data: seriesDataArr
            })
          }
        })
      }
      if (item.chart) {
        item.value.data.origTotalNum = num;
        item.value.option.legend.data = legendData;
        item.value.option.xAxis.data = xAxisData;
        item.value.option.series = seriesData;
        item.chart.setOption(item.value.option, true);//重新渲染\
        // console.log(item.value.option)
        this.graphHandBrush();
      }
    },
    opitongSinglestatData(num, item){//仪表盘 数据处理
      if (item.chart) {
        //.start 这里无法将option里面的函数通过保存的方式取出来，只能后期再把这个函数加入
        item.value.option.series[0].detail.formatter = function (value) {
          let str = '{prefixStyle|' + item.value.data.prefixVal + '}{statStyle|' + value + '}{postfixStyle|' + item.value.data.postfixVal + '}';
          return str;
        };
        //.end
        item.value.data.origTotalNum = num;
        item.value.option.series[0].data[0].value = num;
        item.chart.setOption(item.value.option, true);
      }
    },
    opitongPieData(data, num, item){//处理饼图 pie的数据
      const aggsField = item.value.data.queryform.aggsId;//聚合
      let legendData = [];
      let seriesData = [];
      if (!aggsField) {
        legendData = ['all'];
        seriesData.push({
          name: 'all',
          value: num
        })
      } else {
        data.forEach(val => {
          legendData.push(val.key);
          seriesData.push({
            name: val.key,
            value: val.doc_count,
            keyCode:val.codeList//动态过滤码字段特有，用于点击弹框日志查询语句 其他字段这个list为undefined
          })
        })
      }
      if (item.chart) {
        //.start 这里无法将option里面的函数通过保存的方式取出来，只能后期再把这个函数加入
        item.value.option.series.label.formatter = function (params) {
          const str = params.data.name;               
          if(str.length>32){
            return str.substring(0,10)+"......"+str.substring(str.length-5,str.length);
          }else{
            return str;
          }
        };
        //.end
        item.value.data.origTotalNum = num;
        item.value.option.legend.data = legendData;
        item.value.option.series.data = seriesData;
        item.chart.setOption(item.value.option, true);
        this.pieHandeClick();
      }
    },
    opitongbarGaugeData(data, num, item){//处理 排序图 barGauge的数据
      console.log(data,num,item);
      const aggsField = item.value.data.queryform.aggsId;//聚合
      let yAxisData = [];
      let seriesData = [];
      if (!aggsField) {
        yAxisData = ['Top1'];
        seriesData = [{
          name: 'all',
          value: num
        }]
      } else {
        data.forEach(val => {
          seriesData.push({
            name: val.key,
            value: val.doc_count,
            keyCode:val.codeList//动态过滤码字段特有，用于点击弹框日志查询语句 其他字段这个list为undefined
          })
        })
        for (var i = 0; i < data.length; i++) {
          yAxisData.push(`Top${i + 1}`)
        }
      }
      if (item.chart) {
        item.value.data.origTotalNum = num;
        item.value.option.yAxis.data = yAxisData;
        item.value.option.series.data = seriesData;
        //.start 这里无法将option里面的函数通过保存的方式取出来，只能后期再把这个函数加入
        item.value.option.tooltip.formatter = function (params, ticket, callback) {
          var str = '';
          params.forEach(item => {
            str = item.data.name + ':' + item.data.value + this.$t('lg.count')
          })
          return str;
        };
        item.value.option.series.label.normal.formatter = function (params) {
          const str = params.data.name;
          if(str.length>60){
            return str.substring(0,35)+"......"+str.substring(str.length-20,str.length);
          }else{
            return str;
          }
          // return str;
        };
        if(item.value.type=="special"){//找到密文对应的明文
          item.value.option.tooltip.formatter=function (params, ticket, callback){
              // console.log(params);
              var str = '', name = '', urlTxt='';
              params.forEach(item=>{
                name=item.name;
                str = item.data.name+this.$t('lg.numaccessis')+' ：'+item.data.value+this.$t('lg.count')
              })

              var paramName = '\"'+name+'\"';
              // console.log(paramName)
              client.search({
                index: "shadow-filebeat-*",
                body: {
                  "size": 1,
                  "query": {
                    "bool": {
                      "must": [
                        {
                          "query_string": {
                            "query": "shadow.access.response_code:200"
                          }
                        },
                        {
                          "query_string": {
                            "query":"shadow.access.shadow_url:"+paramName
                          }
                        }
                      ],
                      "must_not": {
                        "query_string": {
                          "query": "shadow.access.org_url:\\/40*\\.html"
                        }
                      }
                    }
                  },
                  "_source": ["shadow.access.org_url"]
                }
              }).then((res)=>{
                // console.log(res);
                if(res.hits.hits[0]){
                  urlTxt=res.hits.hits[0]._source.shadow.access.org_url;
                  var str2=this.$t('lg.plaintext')+'：'+urlTxt+'</br>'+str
                  callback(ticket, str2);
                }else{
                  var str2=this.$t('lg.plaintext')+'：-</br>'+str
                  callback(ticket, str2);
                }
              });
              return '<i class="el-icon-loading"></i>Loading...';
            }
        }
        //.end
        item.chart.setOption(item.value.option, true);
        this.pieHandeClick();
      }
    },
    opitongTableData(data, num, item){//处理 表格数据
      const sourceLog = item.value.data.queryform.logId;
      item.value.option.tabheadData = [];
      item.value.option.tabodyData = [];

      const aggsField = item.value.data.queryform.aggsId;//聚合

      item.value.data.origTotalNum = num;
      item.value.option.totalNum = num;//获取总数，用于计算分页

      if (!aggsField) {
        if (sourceLog == 'access.log') {
          // 获取waf.log表头数据
          item.value.option.tabheadData = [...logskeys.access];

          // 获取access.log表体数据
          item.value.option.tabodyData = handleAccesslogData(data);
        } else {
          // 获取waf.log表头数据
          item.value.option.tabheadData = [...logskeys.waf];

          // 获取waf.log表体数据
          item.value.option.tabodyData = handleWaflogData(data);
        }
      } else {
        item.value.option.tabheadData = [
          {
            propName: 'key',
            colWidth: '100',
            "zh": "key",
          },
          {
            propName: 'value',
            colWidth: '200',
            "zh": "value",
          }
        ]
        data.forEach(val => {
          item.value.option.tabodyData.push({
            key: val.key,
            value: val.doc_count,
          })
        })
      }
      // console.log(item)
    },
    //.end
    getChartGridData(){//获取数据（用户自定义的图表），这里获取的图表数据并不渲染入页面。（每个图表的查询时间不一定一致（图表的查询语句是用户创建该图表的时候保存的），这么统一采用右上角的时间来取数据）
      var _this = this;
      var url = SERVER_API_URL + "pe/shadow/kv?keyFilter=customChart";
      axios.get(url).then((res) => {
         console.log(res);
         return;
        if (res.data.responseCode == 0) {
          var resContent=res.data.data.content;
          var tarResult=[];

          if(resContent.length){
            tarResult = [].concat(resContent);
          }

          if (resContent.length > 0) {
            tarResult.forEach((item, index) => {
              item.isShowChartMenu = false;//增加菜单是否显示属性
              item.showLoading = false;//增加loading是否显示属性
              _this.layout.push(item.value.size);
            })
            _this.chartDataList = tarResult;//这里的数据用做更改，不做储存
            _this.chartDataListMap = JSON.parse(JSON.stringify(tarResult));//深拷贝存入的原始数据，不保存请求结果，用户保存图表位置时用这个数据，只改变其size，减少不必要的数据存储
            _this.$nextTick(() => {
              setTimeout(() => {
                _this.chartDataList.forEach((item, index) => {
                  // const gridBoxDom = document.getElementById('gridBox' + item.key);//栅格盒子
                  // var contentHeight = gridBoxDom.offsetHeight;//拿到栅格盒子的宽高
                  // var contentWidth = gridBoxDom.offsetWidth;
                  const myChartDom = document.getElementById('charts' + item.key);
                 // myChartDom.style.height = contentHeight + 'px';//把栅格盒子的宽高赋值到图表的宽高
                //  myChartDom.style.width = contentWidth + 'px';

                  if (item.value.vzActiveName !== 'table') {
                    const myChart = echarts.init(myChartDom);
                    _this.listChart.push(myChart);
                    item.chart = myChart;//!!!  一定要保存这个，echarts里面的事件渲染都基于这个 //全局搜item.chart
                    if (item.value.vzActiveName === 'graph') {
                      _this.graphList.push({ itemObj: item, dom: myChartDom });//chart:myChart,
                    } else if (item.value.vzActiveName === 'pie' || item.value.vzActiveName === 'barGauge') {
                      _this.pieAndBarGaugeList.push(item)
                    }
                  }
                })
                _this.handChartsRefesh();//用户进入页面立即把右上角的时间带入所有图表的查询语句中，并重新发送请求
              }, 100)
            })
          } else {
            _this.showAddPanel();
          }
        }
        this.$store.state.contentLoading = false;
      }).catch((err) => {
        console.log(err)
      })
    },

    handChartsRefesh(){//把右上角时间替换掉查询语句里面的时间，再用被替换时间的查询语句去重新请求数据
      var setTimeInterval = this.$store.state.mydatedata.interval || '5m';//当查询用到聚合时会生成图表，图表会受到采样频率影响显示
      this.chartDataList.forEach(item => {
        const time = this.handleTime(item.value.data.queryform.logId);
        // console.log(item)
        if (item.value.size.i !== 'createdBox') {
          const queryString = JSON.parse(item.value.searchQuery)

          //.start把右上角时间替换掉查询语句里面的时间
          if (!!queryString.body.query.bool && queryString.body.query.bool.must[1] && queryString.body.query.bool.must[1].range['@timestamp']) {
            queryString.body.query.bool.must[1].range['@timestamp'].from = time.from;
            queryString.body.query.bool.must[1].range['@timestamp'].to = time.to;
          }
          if (queryString.body.aggs.GroupByMe && queryString.body.aggs.GroupByMe.date_histogram) {//无聚合字段 则默认时间作为聚合 //针对graph坐标图
            queryString.body.aggs.GroupByMe.date_histogram.extended_bounds.min = time.from;
            queryString.body.aggs.GroupByMe.date_histogram.extended_bounds.max = time.to;
            queryString.body.aggs.GroupByMe.date_histogram.interval = setTimeInterval;//采样频率
          } else if (queryString.body.aggs.GroupByMe && queryString.body.aggs.GroupByMe.aggs) {//有聚合字段
            if(queryString.body.aggs.GroupByMe.aggs.time_his){
              queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.extended_bounds.min = time.from;
              queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.extended_bounds.max = time.to;
              queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.interval = setTimeInterval;//采样频率
            }else if(queryString.body.aggs.GroupByMe.aggs.groupbyresp && queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs && queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his){//有聚合字段 动态过滤码，又需特殊对待
              queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.extended_bounds.min = time.from;
              queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.extended_bounds.max = time.to;
              queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.interval = setTimeInterval;//采样频率
            }
          } 
          //.end
          this.getChartUpdate(queryString, item);//调用请求
          // console.log(queryString)
        }
      })
    },
    changeTableData(obj, index){//表格分页
      // console.log(obj)
      const item = this.chartDataList[index];
      const time = this.handleTime(item.value.data.queryform.logId);
      // console.log(item)
      if (item.value.size.i !== 'createdBox') {
        const queryString = JSON.parse(item.value.searchQuery)
        // console.log(queryString,time)
        //.start改变存入的查询语句的查询时间
        if (!!queryString.body.query.bool && queryString.body.query.bool.must[1] && queryString.body.query.bool.must[1].range['@timestamp']) {
          queryString.body.query.bool.must[1].range['@timestamp'].from = time.from;
          queryString.body.query.bool.must[1].range['@timestamp'].to = time.to;
        }
        //.end
        queryString.from = (obj.curPage - 1) * obj.pageNum;
        queryString.size = obj.pageNum;
        this.getChartUpdate(queryString, item);//调用请求
      }
    },
   
    getChartUpdate(data, item){//重新请求数据
      const _this = this;
      // console.log(data);
      // console.log(item);
      item.showLoading = true;//显示loading
      client.search(data).then(res => {
        // console.log(res)
        const aggsField = item.value.data.queryform.aggsId;//聚合
        // if(tarResult.length>0){
        let tarResult = [];
        let tarResultNum = 0;
        item.showLoading = false;
        if (item.value.vzActiveName == 'graph') {
          // if(!aggsField){
          tarResult = res.aggregations.GroupByMe.buckets;
          tarResultNum = _this.countTotalNum(tarResult);
          // }else{
          // tarResult = res.aggregations.GroupByMe.buckets;
          // }
          tarResult=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArrLine(tarResult,1):tarResult;
          _this.opitongGraphData(tarResult, tarResultNum, item);
        } else if (item.value.vzActiveName == 'singlestat') {
          if (!aggsField) {
            tarResult = [];
            tarResultNum = res.hits.total.value;
          } else {
            tarResult = res.aggregations.GroupByMe.buckets;
            tarResultNum = _this.countTotalNum(tarResult);
          }
          _this.opitongSinglestatData(tarResultNum, item);
        } else if (item.value.vzActiveName == 'pie') {
          if (!aggsField) {
            tarResult = [];
            tarResultNum = res.hits.total.value;
          } else {
            tarResult = res.aggregations.GroupByMe.buckets;
            tarResultNum = _this.countTotalNum(tarResult);
          }
          tarResult=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
          _this.opitongPieData(tarResult, tarResultNum, item);
        } else if (item.value.vzActiveName == 'barGauge') {
          if (!aggsField) {
            tarResult = [];
            tarResultNum = res.hits.total.value;
          } else {
            tarResult = res.aggregations.GroupByMe.buckets;
            tarResultNum = _this.countTotalNum(tarResult);
          }
          tarResult=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
          _this.opitongbarGaugeData(tarResult, tarResultNum, item);
        } else if (item.value.vzActiveName == 'table') {
          if (!aggsField) {
            tarResult = res.hits.hits;
            tarResultNum = res.hits.total.value;//总数
          } else {
            tarResult = res.aggregations.GroupByMe.buckets;
            tarResultNum = tarResult.length;
          }
          tarResult=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
          _this.opitongTableData(tarResult, tarResultNum, item);
        }
      })
    },
    
    countTotalNum(data){ //计算es查询返回数据的总值，聚合时不能直接取res.hits.total(不准确),而应该把每一项的doc_count相加得到总值
      let countNumber = 0
      data.forEach((val, index) => {
        countNumber += val.doc_count
      })
      return countNumber
    },

    //.start 不同图表的特殊功能
    graphHandBrush(){//graph坐标轴图表的x轴时间拉动
      const _this = this;
      _this.graphList.forEach(item => {
        const xaxisData = item.itemObj.value.option.xAxis.data;
        item.itemObj.chart.off('brushSelected');//一定要清除brush事件

        var brushFalg = false;//设置一个阀值，鼠标弹起时才触发
        item.dom.addEventListener("mousedown", () => {
          brushFalg = false;
        });
        item.dom.addEventListener("mouseup", () => {
          brushFalg = true;
        });

        item.itemObj.chart.on('brushSelected', function (params) {
          if (brushFalg) {//如果鼠标弹起
            if (params.batch && params.batch[0].areas[0]) {
              // console.log(params.batch[0])
              var startIndex = params.batch[0].areas[0].coordRange[0] == '-0' || params.batch[0].areas[0].coordRange[0] < 0 ? 0 : params.batch[0].areas[0].coordRange[0];//拿到x时间轴对应的坐标点（index）
              var endIndex = params.batch[0].areas[0].coordRange[1];
              var tstart = xaxisData[startIndex], tend = xaxisData[endIndex] ? xaxisData[endIndex] : xaxisData[endIndex - 1];//利用上面取得的index，拿到选取的x时间轴对应的开始时间以及结束时间点
              //  console.log(tstart,tend)
              if (tstart == tend) { //采样频率稍大时（为'5m、10s'时很容易出现这个问题）,如果用户选定的范围只在一个采样点内（只拉动一个阴影格），会导致起始查询时间和截止查询时间一致，这时在这个时间点上可能没有数据（但看起来应该有数据，采样频率导致的），因此遇到这种情况就把起始时间的范围以及截止时间的范围都各自扩大一个采样点，这样保证了用户只选取一个阴影格的时候也会有数据。
                // console.log(tstart,tend,'相等');
                var adTstart = new Date(tstart).getTime(), adTend = new Date(tend).getTime();
                if (_this.$store.state.mydatedata.interval == '5m') {//其他情况如：interval=='1d' 或者 '1h'时，用户只动一个阴影格的可能性很小，因此没写了 //无处理
                  adTstart -= 5 * 60 * 1000;
                  adTend += 5 * 60 * 1000;
                } else if (_this.$store.state.mydatedata.interval == '10s') {
                  adTstart -= 10 * 1000;
                  adTend += 10 * 1000;
                } else if (_this.$store.state.mydatedata.interval == '1s') { //interval=='1s' 采样频率精确到1s，在往下拉也会一直有数据，因此也没写了 //无处理
                  // adTstart-=1*1000
                  // adTend+=1*1000
                }
                tstart = _this.transformMyDate(adTstart);
                tend = _this.transformMyDate(adTend);
              }
              // console.log(tstart,tend)
              _this.$store.state.nowTimeVal = [new Date(tstart), new Date(tend)];//改变右上角时间（跟拉到的时间保持一致）
              clearTimeout(_this.$store.state.refreshTimeout);//图表轮询定时器 清除按时刷新数据的定时器
              _this.$store.state.refreshAble = true;//禁用自动刷新
              setTimeout(() => {
                _this.$store.commit(types.MYDATEPICKER);
              }, 0)
            }
          }
        });

      })
    },

    //日志弹框功能 
    pieHandeClick(){//pie、barGauge图表以点击的某项作为过滤，弹出对应的日志内容 ，这里根据不同选项确定查询语句
      const _this = this;
      _this.pieAndBarGaugeList.forEach(item => {
        item.chart.off('click');//一定要清除click事件

        item.chart.on("click", (params) => {
          // console.log(params);
          _this.logDialogVisible9 = true;
          _this.logDialogTitle9 = params.name;

          const aggsField = item.value.data.queryform.aggsId;//聚合
          const sourceLog = item.value.data.queryform.logId;//日志来源
          this.mySourceLog = sourceLog;//点击时记录当前图表日志来源
          this.getLogHeadData(sourceLog);// 获取access.log or waf.log日志弹框表头（用户自定义的表头）

          if (sourceLog == 'access.log') {

            const myAccessType = item.value.data.queryform.accessType;//access日志分不同模式

            if (!aggsField) {
              _this.logPopQueryObj.bool.must.push(...prmoSearchStr[myAccessType]['a1']);
              _this.logPopQueryObj.bool.must.push({
                "exists": {
                  "field": "shadow.access.method"
                }
              })
            }else{
              if(aggsField == 'shadow.access.error_code'){
                let codeArr = params.data.keyCode;
                console.log(codeArr);
                let boolObj = {
                  "bool": {
                    "filter": {"match_all": {}},
                    "must": [
                      {
                        "bool": { "should": [] }
                      }
                    ]
                  }
                };
                for (let i = 0; i < codeArr.length; i++) {
                  if(codeArr[i].errorCode==0){//单防护模式，监控模式不会有errorCode=0这种情况
                    boolObj.bool.must[0].bool.should.push({
                      "bool":{
                        "must": [
                          {
                            "query_string": {
                              "query": "shadow.access.error_code:0"
                            }
                          },
                          {
                            "query_string": {
                              "query": "shadow.access.response_code:"+codeArr[0].respCode
                            }
                          }
                        ]
                      }
                    })
                    // if(codeArr[0].respCode==200){
                    //   boolObj.bool.must[0].bool.should[0].bool.must.push({
                    //     "query_string": {
                    //       "query": "shadow.access.org_url:\\/402\\.html"
                    //     }
                    //   })
                    // }
                  }else{//既有防护模式又有监控模式
                    if(myAccessType=='protectChart'){
                      boolObj.bool.must[0].bool.should.push({
                        "bool":{
                          "must": [
                            {
                              "query_string": {
                                "query": "shadow.access.error_code:"+codeArr[i].errorCode
                              }
                            },
                            {
                              "query_string": {
                                "query": "shadow.access.response_code:(400 OR 444 OR 404 OR 405)"
                              }
                            }
                          ]
                        }
                      })
                    }

                    if(myAccessType=='monitorChart'){
                      boolObj.bool.must[0].bool.should.push({
                        "bool":{
                          "must": [
                            {
                              "query_string": {
                                "query": "shadow.access.error_code:"+codeArr[i].errorCode
                              }
                            },
                            {
                              "query_string": {
                                "query": "shadow.access.response_code:200"
                              }
                            }
                          ]
                        }
                      })
                    }
                  }
                }
              
                _this.logPopQueryObj = boolObj;

              }else {
                _this.logPopQueryObj.bool.must.push(...prmoSearchStr[myAccessType]['a1']);
                _this.logPopQueryObj.bool.must.push({
                  "query_string": {
                    "query": aggsField + ":" + '\"' + _this.logDialogTitle9.replace(/:/g, '\\:') + '\"'
                  }
                });
              }
            }
          } else if (sourceLog == 'waf.log') {
            if (!aggsField) {
              _this.logPopQueryObj.bool.must_not = {
                "exists": {
                  "field": "error"
                }
              }
            } else {
              _this.logPopQueryObj.bool.must.push({
                "query_string": {
                  "query": aggsField + ":" + '\"' + _this.logDialogTitle9.replace(/:/g, '\\:') + '\"'
                }
              });
            }
          }
          // console.log(_this.logPopQueryObj)
          _this.getOnepieceFromPie(sourceLog);
        })
      })
    },
    getLogHeadData(sourceLog){ //初始化不同日志数据
      if (sourceLog == 'access.log') {
        
        this.logPopQueryObj = { "bool": { "must": [] } };//设置基础查询语句
        this.tableKeyArrLog = [...logskeys.access];//获取access.log日志全部字段 （select选项要显示所有字段）

        // 获取恶意访问日志弹框access.log表头（用户自定义的表头）
        var url = SERVER_API_URL + '/pe/shadow/kv/gridAccessTbHead';
        axios.get(url).then(res => {
          if (!res.data.data) {
            this.chartLogsHeadData = [...logskeys.access]//用户未自定义则默认显示全部字段
          } else {
            this.chartLogsHeadData = res.data.data.value;
          }
        })

      } else if (sourceLog == 'waf.log') {
        
        this.logPopQueryObj = { "bool": { "must": [{ "term": { "log.file.path": "/usr/local/shadow/logs/shadow_waf.log" } }] } };//设置基础查询语句
        this.tableKeyArrLog = [...logskeys.waf];//获取access.log or waf.log日志全部字段 （select选项要显示所有字段）

        // 获取恶意访问日志弹框waf.log表头（用户自定义的表头）
        var url = SERVER_API_URL + '/pe/shadow/kv/gridWafTbHead';
        axios.get(url).then(res => {
          if (!res.data.data) {
            this.chartLogsHeadData = [...logskeys.waf]
          } else {
            this.chartLogsHeadData = res.data.data.value;
          }
        })

      }
    },
    getChangeLogData(pageObj){ //改变分页返回数据
      console.log(pageObj)
      this.fromPage = pageObj.curPage - 1;
      this.pageSize = pageObj.pageNum;
      this.requeryObj ? this.getOnepieceFromPie(this.mySourceLog,this.requeryObj) : this.getOnepieceFromPie(this.mySourceLog);
    },
    getOnepieceFromPie(sourceLog,requeryObj){//发起es查询，获取access.log、waf.log表体数据
      var _this = this;
      const time = _this.handleTime(sourceLog);

      // console.log(_this.logPopQueryObj);
      let clientQueryObj = JSON.parse(JSON.stringify(_this.logPopQueryObj));//清空（清空方法本身加的查询条件，但同时保存了外部查询条件）
      clientQueryObj.bool.must.push(
        {
          "range": {
            "@timestamp": {
              "gte": time.from,
              "lte": time.to,
            }
          }
        }
      );
      // console.log(JSON.stringify(clientQueryObj))

      if (requeryObj) {//再次过滤（日志弹框里面的requery子组件查询。要把这两者的查询语句融汇在一起）
        // console.log(requeryObj)
        const requeryArr = requeryObj.bool.must;
        clientQueryObj.bool.filter = { "bool": { "must": [] } };
        requeryArr.forEach((item) => {
          clientQueryObj.bool.filter.bool.must.push(item);
        })
      }

      client.search({
        index: "shadow-filebeat*",
        from: _this.fromPage * _this.pageSize,
        size: _this.pageSize,
        body: {
          "sort": {
            "@timestamp": "desc"
          },
          "query": clientQueryObj
        }
      }).then((res2) => {
        // console.log(res2)
        _this.chartLogsTotalNum = res2.hits.total.value;
        let logResArr = res2.hits.hits;
        let bodyArr = [];

        if (sourceLog == "access.log") {
          // 获取access.log表体数据
          bodyArr = handleAccesslogData(logResArr);
        } else if (sourceLog == "waf.log") {
          // 获取waf.log表体数据
          bodyArr = handleWaflogData(logResArr);
        }
        _this.chartLogsBodyData = bodyArr;
        _this.$store.state.contentLoading = false;
      })
    },
    requeryRowByRequery(obj){ //用户通过requery孙组件筛选access.log显示的行
      this.requeryObj = obj.requeryObj //记录用户再次查询日志的 查询语句
      this.fromPage = 0;
      this.getOnepieceFromPie(this.mySourceLog,this.requeryObj);
      if (this.$refs.log_tables) this.$refs.log_tables.tabCurPage = 1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    refilterColByRefilter(obj){ //用户通过refilter孙组件筛选access.log显示的纵列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      if (this.mySourceLog == 'access.log') {
        var url = SERVER_API_URL + '/pe/shadow/kv';
        axios.post(url, { gridAccessTbHead: obj }).then(res => {
          if (Object.keys(res.data.data.Failure)) {
            axios.patch(url, { gridAccessTbHead: obj }).then(res => {
            })
          }
        })
      } else if (this.mySourceLog == 'waf.log') {
        var url = SERVER_API_URL + '/pe/shadow/kv';
        axios.post(url, { gridWafTbHead: obj }).then(res => {
          if (Object.keys(res.data.data.Failure)) {
            axios.patch(url, { gridWafTbHead: obj }).then(res => {
            })
          }
        })
      }
      this.chartLogsHeadData = obj;
    },
    showSDURLMenu(index){ //右键点击对应字段 显示 该字段的操作菜单 （access.log 用户请求的URL独有该功能）
      this.chartLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
      // this.accesslogsData[index].showUMenuList=true;
      this.$set(this.chartLogsBodyData[index], "showUMenuList", true);
    },
    hideSDURLMenu(){ //左键任意点击全局 隐藏 表里面字段的菜单
      this.chartLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
    },
    logDialogClose9(){//关闭日志弹框
      this.logDialogVisible9 = false;
      this.logDialogTitle9 = '';
      this.fromPage = 0;

      // this.chartLogsHeadData=[];不清空显示纵列，
      this.chartLogsBodyData = [];//清空显示内容
      this.chartLogsTotalNum = 0;

      if (this.mySourceLog == 'access.log') {
        this.logPopQueryObj = { "bool": { "must": [] } };
      } else if (this.mySourceLog == 'waf.log') {
        this.logPopQueryObj = { "bool": { "must": [{ "term": { "log.file.path": "/usr/local/shadow/logs/shadow_waf.log" } }] } };
      }
      this.broadcast('logRequery', "clearData");//清空孙组件里logRequry的查询条件输入框里的内容，要引入Emitter
      this.requeryObj = null;//清空孙组件里logRequry的被带入日志查询语句的查询条件
    },
    //.end

    handleTime(sourceLog){//处理右上角时间
      var _this = this;
      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      // console.log(sttime,edtime)
      var fromTime2, endTime2, fromTime, endTime;
      if (sourceLog == "access.log") {//access.log日志查询的时间要减去8小时
        fromTime2 = toISO8601(sttime);
        endTime2 = toISO8601(edtime);
        fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong));
        endTime = endTime2 || toISO8601(new Date());
      } else if (sourceLog == "waf.log") {
        fromTime2 = toSddate(sttime);
        endTime2 = toSddate(edtime);
        fromTime = fromTime2 || toSddate(new Date(Date.now() - _this.$store.state.dateTimeLong));
        endTime = endTime2 || toSddate(new Date());
      }
      // console.log(fromTime,endTime)
      return { from: fromTime, to: endTime }
    },
    transformMyDate(d){
      d = new Date(d);
      function pad (n) {
        return n < 10 ? '0' + n : n
      }
      return pad(d.getFullYear()) + "-" + pad(parseInt(d.getMonth()) + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());//+':' + pad(d.getSeconds())
    },
    transformMyDate2(d){
      d = new Date(d - 8 * 60 * 60 * 1000);
      function pad (n) {
        return n < 10 ? '0' + n : n
      }
      return pad(d.getFullYear()) + "-" + pad(parseInt(d.getMonth()) + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
    },

    resizedEvent(){
      setTimeout(() => {
        this.resizeMove()
      }, 0)
      // console.log(this.layout);
    },
    movedEvent(){
      setTimeout(() => {
        this.resizeMove()
      }, 0)
      // console.log(this.layout);
    },
    resizeMove(){//图表resize封装  
      this.chartDataList.forEach((item, index) => {
        if (item.key) {
          const gridBoxDom = document.getElementById('gridBox' + item.key);//栅格盒子
          var contentHeight = gridBoxDom.offsetHeight;//拿到栅格盒子的宽高
          var contentWidth = gridBoxDom.offsetWidth;
          const myChartDom = document.getElementById('charts' + item.key);
          myChartDom.style.height = contentHeight + 'px';//把栅格盒子的宽高赋值到图表的宽高
          myChartDom.style.width = contentWidth + 'px';
        }
      })
      this.listChart.forEach((item, index) => {//栅格盒子 被拉动改变大小时，里面的图表也要随之改变大小
        item.resize();
      })
    },
    throttle(fn){//节流 只触发一次resize 
      let canRun = true; // 通过闭包保存一个标记
      return function(){
        if(!canRun) return;// 在函数开头判断标记是否为true，不为true则return
        canRun = false;// 立即设置为false
        setTimeout(()=>{ // 将外部传入的函数的执行放在setTimeout中
          fn.apply(this,arguments);// 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。
          canRun = true; // 当定时器没有执行的时候标记永远是false，在开头被return掉
        }, 100);
      }
    },

    showChartMenu(item){//显示图表菜单
      this.hideChartMenu();
      item.isShowChartMenu = true;
    },
    hideChartMenu(){//隐藏图表菜单
      this.chartDataList.forEach(ele => {
        ele.isShowChartMenu = false;
      })
    },
    editCahrt(keyName,myLogId,index){//编辑图表
      // console.log(this.layout[index],this.chartDataList[index].value.size);
      this.$router.push({ path: '/customChartPanel', query: { key: keyName, myLog:myLogId, size: JSON.stringify(this.chartDataList[index].value.size) } })
    },
    downloadCSV(item){//下载CSV文件
      const _this = this;
      const url = SERVER_API_URL + "pe/download/conversion/es2csv";
      const time = _this.handleTime(item.value.data.queryform.logId);
      var setTimeInterval = _this.$store.state.mydatedata.interval || '5m';//当查询用到聚合时会生成图表，图表会受到采样频率影响显示

      const queryString = JSON.parse(item.value.searchQuery);
      //.start改变存入的查询语句的查询时间
      if (!!queryString.body.query.bool && queryString.body.query.bool.must[1] && queryString.body.query.bool.must[1].range['@timestamp']) {
        queryString.body.query.bool.must[1].range['@timestamp'].from = time.from;
        queryString.body.query.bool.must[1].range['@timestamp'].to = time.to;
      }
      if (queryString.body.aggs.GroupByMe && queryString.body.aggs.GroupByMe.date_histogram) {//无聚合字段 则默认时间作为聚合 //针对graph坐标图
        queryString.body.aggs.GroupByMe.date_histogram.extended_bounds.min = time.from;
        queryString.body.aggs.GroupByMe.date_histogram.extended_bounds.max = time.to;
        queryString.body.aggs.GroupByMe.date_histogram.interval = setTimeInterval;//采样频率
      } else if (queryString.body.aggs.GroupByMe && queryString.body.aggs.GroupByMe.aggs) {//有聚合字段
        if(queryString.body.aggs.GroupByMe.aggs.time_his){
          queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.extended_bounds.min = time.from;
          queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.extended_bounds.max = time.to;
          queryString.body.aggs.GroupByMe.aggs.time_his.date_histogram.interval = setTimeInterval;//采样频率
        }else if(queryString.body.aggs.GroupByMe.aggs.groupbyresp && queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs && queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his){//有聚合字段 动态过滤码，又需特殊对待
          queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.extended_bounds.min = time.from;
          queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.extended_bounds.max = time.to;
          queryString.body.aggs.GroupByMe.aggs.groupbyresp.aggs.time_his.date_histogram.interval = setTimeInterval;//采样频率
        }
      } 
      //.end
      getCsvData(queryString)//如果只有一个查询语句，则调用这一遍就可

      function getCsvData(queryStr){
        client.search(queryStr).then(res => {//先通过当前图表的查询语句拿到其对应的查询结果
          const dataSourceString = JSON.stringify(res);

          axios.post(url, {//再把上面拿到的结果作为参数发起下载CSV的请求
            dataSourceString: dataSourceString,
            queryString: JSON.stringify(queryStr.body),
            // responseType: 'blob'
          }).then((res) => {
            if (res.data.reasonCode && res.data.reasonCode == 'PE0044') {
              _this.$message.error(_this.$t('lg.nosupportcsvfile'));
              return false
            } else if (res.data.reasonCode) {
              _this.$message.error(_this.$t('lg.failed'));
              return false
            }
            if (!res.data.responseCode) {
              const content = res.data;
              const blob = new Blob([content]);
              const fileName = item.value.data.generalform.titleText+'.csv';
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
            }
            // var filename = '恶意访问数据图表.pdf';
            // this.$store.commit(types.MAKEPDF,{'pdfdata':content,'pdfname':filename});
          }).catch((err) => {
            console.log(err)
          })
        })
      }
  
    },
    deleteCahrt(keyName, index){//删除某个图表
      const url = SERVER_API_URL + "pe/shadow/kv/" + keyName;
      axios.delete(url).then(res => {
        this.chartDataList.splice(index, 1);
        this.chartDataListMap.splice(index, 1);//这里也一定要删除一下
        this.layout.splice(index, 1);
        this.$message({
          type: 'success',
          message: this.$t('lg.success')
        });
      }).catch((err) => {
        console.log(err)
      });
    },

    showAddPanel(){//新建一个装图表的栅格盒子
      const _this = this;
      const addPanel = _this.chartDataList.find(item => item.value.size.i === 'createdBox')
      if (addPanel) {
        // this.$message.error('已经新增了');
        return false
      }
      _this.layout.push(_this.createdBoxSize);
      _this.chartDataList.push({
        value: {
          size: _this.createdBoxSize,
        },
      })
      // console.log(_this.chartDataList,_this.layout)
    },
    deleteAddPanel(index){//删除新增图表面板
      this.chartDataList.splice(index, 1);
      this.layout.splice(index, 1);
    },
    fullScreen(){//大屏展示
      var chartGridDom = document.getElementById('chartGridLayout');
      chartGridDom.requestFullscreen();

      window.addEventListener("fullscreenchange", (e) => {
        if (document.fullscreenElement) {
          // console.log('进入全屏')
          this.isShowGridMenu = false;
        } else {
          // console.log('退出全屏')
          this.isShowGridMenu = true;
        }
      })
    },
    savePosition(){//保存图表在页面的位置、大小
      var _this = this;
      _this.$confirm(this.$t('lg.confirm11'), this.$t('lg.tip'), {
        confirmButtonText: this.$t('lg.save'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        const url = SERVER_API_URL + "pe/shadow/kv";
        const myPositionArr = {};
        console.log(this.chartDataListMap);
        this.chartDataListMap.forEach((ele,index) => {
          if (ele.key) {
            myPositionArr[ele.key] = Object.assign({},ele.value,{size:this.chartDataList[index].value.size});//只改变深拷贝对象里面的size,减少不必要数据存储
          }
        })
        console.log(myPositionArr);
        axios.patch(url, myPositionArr).then(res => {
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }).catch((err) => {
          console.log(err)
        });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '不保存图表'
        // });      
      });
    },
    downLoadPdf(){//导出数据图为pdf文件
      let myCharArray = [];
      this.chartDataList.forEach(item => {
        if (item.value.vzActiveName == 'table') {
          return false
        }
        const dataURL = item.chart.getDataURL({
          type: 'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,", "");
        myCharArray.push(dataURL);
      })
      const url = SERVER_API_URL + 'pe/download/conversion/jpg2pdf';
      // console.log(myCharArray)
      axios.post(url, {
        base64StringList: myCharArray
      }, {
        responseType: 'blob'
      }).then((res) => {
        //  console.log(res)
        if (res.status == 200) {
          var filename = this.$t('lg.customchart')+'.pdf';
          this.$store.commit(types.MAKEPDF, { 'pdfdata': res.data, 'pdfname': filename });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
    getChartTypeAllQuery(val){
      this.myChartType=val;
      this.getAllchart();
    },
    forfastloadmore(){
      this.forFastShow=true;
      this.$nextTick(()=>{
          //this.drawBusinessLine();//slow
          this.drawUrlVisitCtBar();//这个图查询语句相对特殊//slow
          this.drawRegionBar();//slow
        }); 
    },
    getUserDm(){
      return new Promise((resolve,reject)=>{
        let name=sessionStorage.getItem("myname");
        var url = SERVER_API_URL + 'pe/shadow/user/accessdomain/'+name;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resdata=res.data.data;
            let resdatadm;
            if(resdata && resdata.domains){
              resdatadm=resdata.domains || [];
            }
            resolve(resdatadm || [])
          }else{
            reject("error")
          }
        })
      });
    },
    //创建即执行
    getAllchart(querOobj){
      if(querOobj){
        this.isFalg=querOobj.isQuery;
        this.checkDomain=querOobj.domainName;
        this.checkUrl=querOobj.urlArr;
        this.filterObj=this.getFilterObj(this.isFalg);
      }
      this.getRequestNum();
      this.attackSum();
      this.drawECodeTypePie();
      this.drawOrgIpLine();
      this.drawOrgIpPie();
      this.drawDomainLine();
      this.drawDomainPie();
      this.drawFingerPie();
      this.drawAutoToolPie();
      this.drawBusinessLine();//slow
    //  if(this.forFastShow){
       this.drawUrlVisitCtBar();
       this.drawRegionBar();//slow       
     // }
    },
    getFilterObj(flag){
      var _this=this;
      var filterObj ={"match_all": {}};
      if(flag){
        var domainVariable = _this.checkDomain;
        var urlVariable = _this.checkUrl;
        filterObj = {
          "bool": {
            "must":[
              {
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {"query_string": {     
                "query": "shadow.access.http_host:"+'\"'+domainVariable+'\"'
              }}
            ]
          }
        }
        if(urlVariable){
          var regxpUrl=/(\/)+/g;
          var regUrlVariable =urlVariable.replace(regxpUrl,'\\$1');
          filterObj.bool.must.push({"query_string": {
            "query": "shadow.access.org_url:"+'\"'+regUrlVariable+'\"'
          }})
        }
      }else{
        filterObj ={"match_all": {}};
      }
      return filterObj;
    },
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
    },
    getCustomHeadData(){ 
      var url = SERVER_API_URL + '/pe/shadow/kv/visitChartAccess';
      axios.get(url).then(res =>{
        if(!res.data.data){
          this.chartLogsHeadData =this.defHeaderData;
        }else{
          this.chartLogsHeadData = res.data.data.value;
        }
      })
    },
    drawBusinessLinePromise(){
      var _this=this;
      return new Promise((resolve,reject)=>{
        client.search({
          index: "shadow-filebeat-*",
          body:  {
            "size":0,
            "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": [
                {
                  "term": {
                    "log.file.path": "/usr/local/shadow/logs/access.log"
                  }
                },
                {"query_string":{"query":"shadow.access.shadow_learning_mode:1"}},
                {
                  "range": {
                    "@timestamp": {
                      "from": _this.fromTime,
                      "to": _this.endTime,
                      "include_lower": true,
                      "include_upper": true
                    }
                  }
                },
                {
                  "exists": {
                    "field": "shadow.access.method"
                  }
                }
              ]
            }
          },
          "aggs":{"GroupByMe":{"date_histogram":{"field":"@timestamp","interval":_this.timeinterval,"extended_bounds":{"min":_this.fromTime,"max":_this.endTime}}}}
          }
        }).then((res2)=>{
          let tarResult2=res2.aggregations?res2.aggregations.GroupByMe.buckets:[];
          resolve(tarResult2)
        });
      });
    },

    //图表
    drawBusinessLine(){//slow
      var _this=this;
      _this.businessLineLoading=true;
      var businessDom=document.getElementById('businessContainer');
     // var businessDom= _this.$refs.businessContainer;
      _this.businessLineChart = echarts.init(businessDom);
      _this.businessLineChart.off('brushSelected');//一定要清除brush事件
      var brushFalg = false;//设置一个阀值，鼠标弹起时才触发
      businessDom.addEventListener("mousedown", () => {
        brushFalg=false;
      });
      businessDom.addEventListener("mouseup", () => {
        brushFalg=true;
      });
      var options = {
          color:['#27727b','#e87c25'],
          title: {
            text: _this.$t('lg.maccessbsprotect'),
            x:'left',
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          legend: {
            top:'20px',
            data:[_this.$t('lg.totalrequests'),_this.$t('lg.fangwen')],
            itemGap: 5
          },
          grid: {
            left: '5%',
            right: '3%',
            bottom:'4%',
            top:'20%',
            containLabel: true
          },
          brush: {
            toolbox: ['lineX'],
            xAxisIndex: "all",
            transformable:false,
            throttleType:'debounce',
            throttleDelay: 1000,
            brushStyle:{
              borderWidth: 0,
            }
          },
          toolbox: {
            right:'20',
            top:'10'
          },
          xAxis: {
            show:false,
            data : []
          },
          yAxis: {
            show:false,
            name:_this.$t('lg.counts'),
          },
          series : []
      };

      _this.drawBusinessLinePromise().then((tarResult2)=>{
         // var tarResult2=res2.aggregations?res2.aggregations.GroupByMe.buckets:[];
          var valData2=[],xaxisData2=[];
          var legendData=[],seriesData=[];
          var wholeCtArr=[];
          let mustOptions=[];

          for(var j2=0;j2<tarResult2.length;j2++){
            var dataJ2=tarResult2[j2];
            var dataJV2=dataJ2.doc_count;

            if(dataJV2!=0){
              wholeCtArr.push(dataJV2);
            }

            if(!dataJV2){
              dataJV2=0
            }
            valData2.push(dataJV2);
            xaxisData2.push(_this.transformMyDate(dataJ2.key));
          }

          wholeCtArr.sort(function(a,b){//min max
            return a-b;
          });
          _this.wholeCtMin=wholeCtArr[0]||0;
          _this.wholeCtMax=wholeCtArr[wholeCtArr.length-1]||0;

          seriesData.push(
            {
              name:_this.$t('lg.totalrequests'),
              type:'bar',
              data:valData2,
              barMaxWidth: 10,
              large: true,
            }
          );
          var indexName="shadow-filebeat-*";
          if(_this.myChartType=='protectChart'){
            indexName="shadow-filebeat-warn*";
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                      "range": {
                        "@timestamp": {
                          "from": _this.fromTime,
                          "to": _this.endTime,
                          "include_lower": true,
                          "include_upper": true
                        }
                      }
                    }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.error_code:>0"
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.response_code:200"
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
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
            ]
          };


  _this.getUserDm().then((reslovedata)=>{

    if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }

  
       ////////////
          client.search({////////2
            index: indexName,
            body:  {
              "size":0,
              "query":{
                "bool":{
                  "filter": _this.filterObj,
                  "must": mustOptions
                }
              },
              "aggs":{
                "GroupByMe":{
                  "date_histogram":{
                    "field":"@timestamp",
                    "interval":_this.timeinterval,
                    "extended_bounds":{
                      "min":_this.fromTime,
                      "max":_this.endTime
                    }
                }}}
              }
            }).then((res)=>{
              //  console.log(res);
              var tarResult=res.aggregations?res.aggregations.GroupByMe.buckets:[];
              var valData=[],normalCtArr=[];

              if(tarResult.length==0){
                options.xAxis.show=false;
                options.yAxis.show=false;
                _this.businessNodata=true;
              }else{
                options.xAxis.show=true;
                options.yAxis.show=true;
                _this.businessNodata=false;
              }

              for(var j2=0;j2<tarResult.length;j2++){
                var dataJ2=tarResult[j2];
                var dataJV2=dataJ2.doc_count;

                if(dataJV2!=0){
                  normalCtArr.push(dataJV2);
                }

                if(!dataJV2){
                  dataJV2=0
                }
                valData.push(dataJV2);
              }

              normalCtArr.sort(function(a,b){//最小值
                return a-b;
              });
              _this.normalCtMin=normalCtArr[0]||0;
              _this.normalCtMax=normalCtArr[normalCtArr.length-1]||0;

              seriesData.push(
                {
                  name:_this.$t('lg.fangwen'),
                  type:'bar',
                  data:valData,
                  large: true,
                  barMaxWidth: 10,
                }
              );
              options.xAxis.data=xaxisData2;//x轴
              options.series=seriesData;
              
              _this.businessLineChart.setOption(options,true);
              _this.businessLineLoading=false;
              
              //brush 操作
              _this.businessLineChart.on('brushSelected', function (params) {
                // console.log(params)
                if(brushFalg){
                  if(params.batch && params.batch[0].areas[0]){
                    // console.log(params.batch[0])
                    var startIndex=params.batch[0].areas[0].coordRange[0]=='-0'||params.batch[0].areas[0].coordRange[0]<0?0:params.batch[0].areas[0].coordRange[0];
                    var endIndex=params.batch[0].areas[0].coordRange[1];
                    var tstart=xaxisData2[startIndex],tend=xaxisData2[endIndex]?xaxisData2[endIndex]:xaxisData2[endIndex-1];
                    
                    if(tstart==tend){ //采样频率稍大时（为'5m'时很容易出现这个问题）,如果用户选定的范围只在一个采样点内（只拉动一个阴影格），会导致起始查询时间和截止查询时间一致，这时在这个时间点上可能没有数据（但看起来应该有数据，采样频率导致的），因此遇到这种情况就把起始时间的范围以及截止时间的范围都各自扩大一个采样点，这样保证了用户只选取一个阴影格的时候也会有数据。
                      // console.log(tstart,tend,'相等');
                      var adTstart=new Date(tstart).getTime(),adTend=new Date(tend).getTime();
                      if(_this.$store.state.mydatedata.interval=='5m'){//此时interval=='1d' 或者 '1h'的可能性很小，因此没写了
                        adTstart-=5*60*1000;
                        adTend+=5*60*1000;
                      }else if(_this.$store.state.mydatedata.interval=='10s'){
                        adTstart-=10*1000;
                        adTend+=10*1000;
                      }else if(_this.$store.state.mydatedata.interval=='1s'){ //interval=='1s' 采样频率精确到1s，在往下拉也会一直有数据，因此也没写了
                        // adTstart-=1*1000
                        // adTend+=1*1000
                      }
                      tstart = _this.transformMyDate(adTstart);
                      tend = _this.transformMyDate(adTend);
                    }
                    // console.log(tstart,tend);

                    _this.$store.state.nowTimeVal=[new Date(tstart),new Date(tend)];//改变右上角时间（跟拉到的时间保持一致）
                    clearTimeout(_this.$store.state.refreshTimeout)//图表轮询定时器 清除按时刷新数据的定时器
                    _this.$store.state.refreshAble=true;//禁用自动刷新
                    setTimeout(()=>{
                      _this.$store.commit(types.MYDATEPICKER);
                    },0)
                  }
                }
              });
            });

      });
      });

    },
    getRequestNum(){//请求总量
      var _this=this;

      let passqueryStringObj={
            "bool": {
              "filter": _this.filterObj,
              "must": [
                {
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                {
                  "term": {
                    "log.file.path": "/usr/local/shadow/logs/access.log"
                  }
                },
                {
                  "exists": {
                    "field": "shadow.access.method"
                  }
                }, 
                {
                    "range": {
                      "@timestamp": {
                        "from": _this.fromTime,
                        "to": _this.endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }]
            }
      };
      _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            passqueryStringObj.bool.must.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            passqueryStringObj.bool.must[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
      
        client.search({
          index:"shadow-filebeat-*",
          body:{
            "track_total_hits": true, 
            // "sort": {
            //   "@timestamp": "desc"
            // },
            "query": passqueryStringObj
          }
        }).then((res)=>{
        
          _this.totalNum=res.hits.total.value;
          // console.log(_this.fromTime,_this.endTime)
        });
      });
    },
    attackSum(){//恶意访问总量
      var _this=this;
      var indexName="shadow-filebeat-*";
      let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
      }else if(_this.myChartType=='monitorChart'){
            mustOptions=[
              {
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.error_code:>0"
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.response_code:200"
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
              {
                "range": {
                  "@timestamp": {
                    "gte": _this.fromTime,
                    "lte": _this.endTime
                  }
                }
              }
            ]
          };
  _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
  
      client.search({
        index:indexName,
        body:{
          "track_total_hits": true, 
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": mustOptions
            }
          }
        }
      }).then((res)=>{
        _this.attackSumNum=res.hits.total.value;
      })
  });

  },
    
    drawUrlVisitCtBar(){//slow
      var _this=this;
      _this.urlVisitCtLoading=true;
      _this.urlVisitCtBarChart = echarts.init(document.getElementById('urlVisitCtBarContainer'));
    
      //设置‘基于错误码统计的恶意访问次数/Top10’图的显示文字
      var labelOption = {
          normal: {
          show: true,
          rotate: 0,
          align: 'left',
          verticalAlign: 'middle',
          position: 'insideLeft',
          distance: 10,
          // color:'#000',
          formatter:function(params){
            // console.log(params)
            const str = params.data.name;               
            return str;
          },
          fontSize: 12,
        }
      };
      var option = {
            color:['#eb8146'],
            title: {
              text: _this.$t('lg.numaccesstop10'),
              x:'center',
              textStyle: {
                fontSize: '16',
                fontWeight: 'normal'
              }
            },
            tooltip: {
              show:true,
              trigger: 'axis',
              confine:true,
              axisPointer: {
                type: 'shadow'
              },
              // extraCssText:'white-space:pre-wrap',
              extraCssText:'white-space:normal;word-break: break-all',
              formatter: function (params, ticket, callback){
                // console.log(params)
                // console.log(ticket);
                // console.log(callback)
                
                if(_this.myChartType=='protectChart'){//如果为防护模式则要查询密文对应的明文
                  
                  if(_this.esSearchTimer){
                    clearTimeout(_this.esSearchTimer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
                  }
      
                  _this.esSearchTimer = setTimeout(function(){
                    var str = '', name = '', urlTxt='';
                    params.forEach(item=>{
                      name=item.name;
                      str = item.data.name+_this.$t('lg.numaccessis')+':'+item.data.value+_this.$t('lg.count')
                    })
                    var paramName = '\"'+name+'\"';
                    // console.log(paramName)

                    client.search({
                      index: "shadow-filebeat-*",
                      body: {
                        "size": 0,
                        "query": {
                          "bool": {
                            "must": [
                              {
                                "query_string": {
                                  "query": "shadow.access.response_code:200"
                                }
                              },
                              {
                                "query_string": {
                                  "query": "shadow.access.response_code:302"
                                }
                              },
                              {
                                "query_string": {
                                  "query":"shadow.access.shadow_url:"+paramName
                                }
                              }
                            ],
                            "must_not": {
                              "query_string": {
                                "query": "shadow.access.org_url:\\/40*\\.html"
                              }
                            }
                          }
                        },
                        "_source": ["shadow.access.org_url"]
                      }
                    }).then((res)=>{
                      // console.log(res);
                      if(res.hits.hits[0]){
                        urlTxt=res.hits.hits[0]._source.shadow.access.org_url;
                        var str2=_this.$t('lg.plaintext')+'：'+urlTxt+'</br>'+str
                        callback(ticket, str2);
                      }else{
                        var str2=_this.$t('lg.plaintext')+'：-</br>'+str
                        callback(ticket, str2);
                      }
                    });  
                  },1000)
                  
                  return '<i class="el-icon-loading"></i>Loading...';
                }else{
                  var str = '';
                  params.forEach(item=>{
                    str = item.data.name+_this.$t('lg.numaccessis')+':'+item.data.value+_this.$t('lg.count')
                  })
                  return str;
                }
              }
            },
            // legend: {
            //   data: [],
            //   top:'30px',
            // },
            grid: {
              top:'12%',
              left: '0',
              right: '50',
              bottom: '2%',
              containLabel: true
            },
            xAxis: {
              show:false,
              type: 'value',
              name:_this.$t('lg.counts'),
              boundaryGap: [0,0.01],
              position:'top',
              splitLine:{
                show:false
              },
              minInterval: 1//保持x轴刻度只为整数
            },
            yAxis: { 
              show:false,
              type: 'category',
              data: [],//topArrays
              inverse: true,//是否是反向坐标轴 （这里反向后数据降序排列）
            },
            series: []
          };
      
    //  function getUrlVisitCtData(){
        let aggsUrl = '';//防护模式、监控模式 查询语句的聚合条件不一样
        if(_this.myChartType=='protectChart'){
          aggsUrl='shadow.access.shadow_url'
        }else{//monitorChart
          aggsUrl='shadow.access.org_url'
        }
        let mustOptions=[];
        mustOptions=[
         // ...prmoSearchStr[_this.myChartType]['a2'],
         {
            "bool": {
              "should": [
                {
                  "bool": {
                    "must": [
                      {
                        "query_string": {
                          "query": "shadow.access.error_code:>0"
                        }
                      },
                      {
                        "query_string": {
                          "query": "shadow.access.response_code:400"
                        }
                      },
                      {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              }
                    ]
                  }
                },
                {
                  "bool": { //error_code=0
                    "must": [{
                      "query_string": {
                        "query": "shadow.access.response_code:200"
                      }
                    }, {
                      "query_string": {
                        "query": "shadow.access.org_url:\\/402\\.html"
                      }
                    }]
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.response_code:444"
                  }
                }
              ]
            }
          },
          // {
          //   "query_string": {
          //     "query": "shadow.access.http_host:*"
          //   }
          // },
          {
            "query_string": {
              "query": "shadow.access.org_url:*"
            }
          },
          {
            "range": {
              "@timestamp": {
                "gte": _this.fromTime,
                "lte": _this.endTime
              }
            }
          }
        ];

  _this.getUserDm().then((reslovedata)=>{
        //  if(sessionStorage.getItem("myRoles")=="ADMIN"){
        //    mustOptions.shift();
        //  }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
    

        client.search({
          index: "shadow-filebeat-*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": mustOptions
              }
            },
            "aggs": {
              "GroupByMe": {
                "terms": {
                  "field": aggsUrl,
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res);
          var resResult=res.aggregations?res.aggregations.GroupByMe.buckets:[];
          let topArrays=[];              //存 ['top5','top4','top3','top2','top1']
          let topArray=resResult.length;               //取前面10位  top10
          for(var i=0;i<topArray;i++){   //遍历出top 数组
            topArrays.push(`top${i+1}`);
          } 
          // topArrays.reverse();//反序
          option.yAxis.data=topArrays;

          var sdata=[];
          for(var i=0; i<topArrays.length;i++){
            if(resResult[i]){
              sdata.push({
                value:resResult[i].doc_count,
                name:resResult[i].key,
              });
            }
          }
          // sdata.sort(function(a,b){return b.value-a.value});
          // sdata.reverse();//反序
          option.series=[{          
            type: 'bar',
            label: labelOption,
            data:sdata,
            barMaxWidth:30,
          }]
        
          // console.log(option.series)
          if(resResult.length==0){
            option.xAxis.show=false;
            option.yAxis.show=false;
            option.tooltip.show=false;
            _this.urlVisitCtBarNodata=true;
          }else{
            option.xAxis.show=true;
            option.yAxis.show=true;
            option.tooltip.show=true;
            _this.urlVisitCtBarNodata=false;
          }
          _this.urlVisitCtBarChart.setOption(option,true);
          _this.urlVisitCtLoading=false;
        });
});
        _this.urlVisitCtBarChart.off("click");
        _this.urlVisitCtBarChart.on("click",(params)=>{
          // console.log(params)
          _this.logDialogVisible=true;
          _this.logDialogTitle=params.name;
          _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询

          _this.popQueryObj.bool.must= JSON.parse(JSON.stringify(prmoSearchStr[_this.myChartType]['a2']));
          _this.popQueryObj.bool.must.push({
            "query_string": {
              "query":aggsUrl+":"+_this.logDialogTitle.replace(/\//g,'\\/')
            } 
          });
          _this.getOnepieceFromPie();
        });
     // }
     // getUrlVisitCtData();
    },
    drawECodeTypePie(){
      var _this=this;
      _this.eCodeTypeLoading=true;
      _this.eCodeTypeChart = echarts.init(document.getElementById('eCodeTypeContainer'));
      var options = {
        color:['#2b821d','#e6b600','#339ca8','#c12e34','#0098d9','#005eaa','#97b552','#cc70af'],
        title : {
          text: _this.$t('lg.accesstypedisplaytop10'),
          x:'center',
          textStyle: {
            fontSize: '16',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        // legend: {
        //   orient: 'horizontal',
        //   bottom:'0px',
        //   data:[]
        // },
        series: [
          {
            name:_this.$t('lg.accesstype')+'：',
            type:'pie',
            radius:['25%','35%'],
            // radius:'35%',
            // center: ['50%', '50%'],
            data:[].sort(function (a, b) { return a.value - b.value; }),
            // roseType: 'radius',//area radius
            // avoidLabelOverlap: false,
            label: {
              position:'outside',
              normal: {
                textStyle: {
                  fontSize: '12',  
                },
                formatter: "{b}: {c}"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                smooth: 0,
                length: 10,
                length2: 20,
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
     // function getECodeTypeData(){
        var indexName="shadow-filebeat-*";
        let mustOptions=[];
        if(_this.myChartType=='protectChart'){
          indexName="shadow-filebeat-warn*";
          mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
      }else if(_this.myChartType=='monitorChart'){
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
              "range": {
                "@timestamp": {
                  "gte": _this.fromTime,
                  "lte": _this.endTime
                }
              }
            }
          ]
      };

  _this.getUserDm().then((reslovedata)=>{
      if(sessionStorage.getItem("myRoles")=="ADMIN"){
        mustOptions.shift();
      }
      let ri;
      for(let i=0;i<reslovedata.length;i++){
        ri=reslovedata[i];
        mustOptions[0].bool.should.push(
          {
            "match":{
              "shadow.access.http_host":ri
            }
          }
        )
      }

  
        client.search({
          index: indexName,
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must":mustOptions
              }
            },
            "aggs": {
              "groupbyerrorcode":{
                "terms": {
                  "field": "shadow.access.error_code", 
                  "size": 10
                },
                "aggs": {
                  "groupbyresp": {
                    "terms": {
                      "field": "shadow.access.response_code",
                      "size": 10
                    }
                  }
                }
              }
            }
        }
        }).then((res)=>{
          var tarResult=res.aggregations?res.aggregations.groupbyerrorcode.buckets:[];
          var aggarr=[];
          tarResult.forEach(item=>{
            var key=item.key;
            var etype=""
            if(key=="0"){
              item.groupbyresp.buckets.forEach(item2=>{
                var key2=item2.key;
                if(this.isencn=="en"){
                  if(!errorObj2[0].hasOwnProperty(key2)){
                    etype=_this.$t('lg.othereror');
                  }else{
                    etype=errorObj2[0][key2];
                  }
                }else{
                  if(!errorObj[0].hasOwnProperty(key2)){
                    etype=_this.$t('lg.othereror');
                  }else{
                    etype=errorObj[0][key2];
                  }
                }
                
                aggarr.push({
                  "key":[key,key2],
                  "name":etype,
                  "value":item2.doc_count
                })
              })
            }else{
              if(this.isencn=="en"){
                if(!errorObj2.hasOwnProperty(key)){
                etype=_this.$t('lg.othereror');
              }else{
                etype=errorObj2[key];
              }
              }else{
                if(!errorObj.hasOwnProperty(key)){
                etype=_this.$t('lg.othereror');
              }else{
                etype=errorObj[key];
              }
              }
              
              aggarr.push({
                "key":[key],
                "name":etype,
                "value":item.doc_count
              })
            }
          });
          options.series[0].data=aggarr;
          // options.legend.data=legendRlt;
          if(aggarr.length==0){
            _this.eCodeTypeNodata=true;
          }else{
            _this.eCodeTypeNodata=false;
          }
          _this.eCodeTypeChart.setOption(options,true);
          _this.eCodeTypeLoading=false;

          _this.eCodeTypeChart.off("click");
          _this.eCodeTypeChart.on("click",(params)=>{//恶意访问类型展示图表，点出日志弹框特殊处理
            // console.log(params);
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;

            //let codeArr=params.data.code;
            var paramsCode=params.data.key;
            let codeArr=paramsCode[0];
            let boolObj={
                  "bool":{
                    "filter":{"match_all": {}},
                    "must":[
                      {
                        "bool":{"should": []}
                      }
                    ]
                  }
                };

            if(codeArr=="0"){//单防护模式，监控模式不会有errorCode=0这种情况
                boolObj.bool.must[0].bool.should.push({
                  "bool":{
                    "must": [
                      {
                        "query_string": {
                          "query": "shadow.access.error_code:0"
                        }
                      },
                      {
                        "query_string": {
                          "query": "shadow.access.response_code:"+paramsCode[1]
                        }
                      }
                    ]
                  }
                })
                if(paramsCode[1]=="200"){
                  boolObj.bool.must[0].bool.should[0].bool.must.push({
                    "query_string": {
                      "query": "shadow.access.org_url:\\/402\\.html"
                    }
                  })
                }
            }else{//既有防护模式又有监控模式
              let qyObj={};
              let qyMsObj={
                          "query_string": {
                            "query": "shadow.access.error_code:"+codeArr
                          }
                        };
                if(codeArr=="105" || codeArr=="116" || codeArr=="132"){
                  qyObj={
                    "bool":{
                      "must": [
                        qyMsObj
                      ]
                    }
                  }
                }else{
                  qyObj={
                    "bool":{
                      "must": [
                        qyMsObj,
                        {
                          "query_string": {
                           // "query": "shadow.access.response_code:(400 OR 444 OR 404 OR 405)"
                           "query": "shadow.access.shadow_learning_mode:0"
                          }
                        }
                      ]
                    }
                  }
                }
                if(_this.myChartType=='protectChart'){
                  boolObj.bool.must[0].bool.should.push(qyObj)
                }
                
                if(_this.myChartType=='monitorChart'){
                  boolObj.bool.must[0].bool.should.push({
                    "bool":{
                      "must": [
                        qyMsObj,
                        {
                          "query_string": {
                           // "query": "shadow.access.response_code:200"
                           "query": "shadow.access.shadow_learning_mode:1"
                          }
                        }
                      ]
                    }
                  })
                }
            }

            boolObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj=boolObj;
            _this.getOnepieceFromPie();
          });
        });

    });
    //  }
    //  getECodeTypeData();
    },
    drawOrgIpLine(){
      var _this=this;
      _this.orgIpLineLoading=true;
      var orgIpDom=document.getElementById('orgIpLineContainer');
      _this.orgIpLineChart = echarts.init(orgIpDom);

      _this.orgIpLineChart.off('brushSelected');//一定要清除brush事件
      var brushFalg = false;//设置一个阀值，鼠标弹起时才触发
      orgIpDom.addEventListener("mousedown", () => {
        brushFalg=false;
      });
      orgIpDom.addEventListener("mouseup", () => {
        brushFalg=true;
      });

      var options = {
          color:['#4ea397','#22c3aa','#7bd9a5','#d0648a','#f58db2'],
          title: {
            text: _this.$t('lg.accesssiptop5'),
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          legend: {
            top:'20px',
            data:[],
          },
          grid: {
            left: '5%',
            right: '3%',
            bottom:'4%',
            top:'25%',
            containLabel: true
          },
          brush: {
            toolbox: ['switchOrg'],
            xAxisIndex: "all",
            transformable:false,
            throttleType:'debounce',
            throttleDelay: 1000,
            brushStyle:{
              borderWidth: 0,
            }
          },
          toolbox: {
            right:'10',
            top:'10',
            feature: {
              myTool1: {
                name:'switchOrg',
                show: true,
                title: _this.$t('lg.agentip'),
                icon: 'image://static/icon/switch.png',
                onclick: function (){
                  lineTimerFn(_this.isLineOrg)
                }
              }
            }
          },
          xAxis: {
            show:false,
            type: 'category',
            //data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: [],
          },
          yAxis: {
            show:false,
            type: 'value',
            name:_this.$t('lg.counts'),
            minInterval: 1//保持y轴刻度只为整数
          },
          series: [
            // {
            //     name:'Step Start',
            //     type:'line',
            //     step: 'start',
            //     data:[120, 132, 101, 134, 90, 230, 210]
            // },
            // {
            //     name:'Step Middle',
            //     type:'line',
            //     step: 'middle',
            //     data:[220, 282, 201, 234, 290, 430, 410]
            // },
          ]
        };
      function lineTimerFn(type){
        if(type){
          _this.isLineOrg=false;
          _this.searchIp="shadow.access.org_remote_ip";//查代理IP
          options.title.text=_this.$t('lg.accesspiptop5');
          options.toolbox.feature.myTool1.title=_this.$t('lg.sourceip');
        }else{
          _this.isLineOrg=true;
          _this.searchIp="shadow.access.remote_ip";//查源IP
          options.title.text=_this.$t('lg.accesssiptop5');//////////
          options.toolbox.feature.myTool1.title=_this.$t('lg.agentip');
        }

      var indexName="shadow-filebeat-*";
      let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };
 _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
        client.search({
          index: indexName,
          body: {
          "size": 0,
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must":mustOptions
            }
          },
          "aggs": {
            "ip": {
              "terms": {
                "field": _this.searchIp,//shadow.access.org_remote_ip
                "size": 5
              },
              "aggs": {
                "time_his": {                  
                  "date_histogram": {
                    "field": "@timestamp",
                    "interval": _this.timeinterval,
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
          var tarResult=res.aggregations?res.aggregations.ip.buckets:[];
          var legendData=[],seriesData=[];
          if(tarResult.length==0){
            options.xAxis.show=false;
            options.yAxis.show=false;
            options.brush.toolbox=['switchOrg'];
            _this.orgIpLineNodata=true;
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            options.brush.toolbox=['lineX','switchOrg'];
            _this.orgIpLineNodata=false;
          }
          for(var i=0;i<tarResult.length;i++){
            var xaxisData=[],valData=[];
            var dataI=tarResult[i];
            legendData.push(dataI.key);
            for(var j=0;j<dataI.time_his.buckets.length;j++){
              var dataJ=dataI.time_his.buckets[j];
              var dataJV=dataJ.doc_count;
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
                data:valData,
              }
            );
          }
          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.orgIpLineChart.setOption(options,true);
          _this.orgIpLineLoading=false;

          //brush 操作
          _this.orgIpLineChart.on('brushSelected', function (params) {
            // console.log(params)
            if(brushFalg){
              if(params.batch && params.batch[0].areas[0]){
                // console.log(params.batch[0])
                var startIndex=params.batch[0].areas[0].coordRange[0]=='-0'||params.batch[0].areas[0].coordRange[0]<0?0:params.batch[0].areas[0].coordRange[0];
                var endIndex=params.batch[0].areas[0].coordRange[1];
                var tstart=xaxisData[startIndex],tend=xaxisData[endIndex]?xaxisData[endIndex]:xaxisData[endIndex-1];

                if(tstart==tend){ //采样频率稍大时（为'5m'时很容易出现这个问题）,如果用户选定的范围只在一个采样点内（只拉动一个阴影格），会导致起始查询时间和截止查询时间一致，这时在这个时间点上可能没有数据（但看起来应该有数据，采样频率导致的），因此遇到这种情况就把起始时间的范围以及截止时间的范围都各自扩大一个采样点，这样保证了用户只选取一个阴影格的时候也会有数据。
                  // console.log(tstart,tend,'相等');
                  var adTstart=new Date(tstart).getTime(),adTend=new Date(tend).getTime();
                  if(_this.$store.state.mydatedata.interval=='5m'){//此时interval=='1d' 或者 '1h'的可能性很小，因此没写了
                    adTstart-=5*60*1000;
                    adTend+=5*60*1000;
                  }else if(_this.$store.state.mydatedata.interval=='10s'){
                    adTstart-=10*1000;
                    adTend+=10*1000;
                  }else if(_this.$store.state.mydatedata.interval=='1s'){ //interval=='1s' 采样频率精确到1s，在往下拉也会一直有数据，因此也没写了
                    // adTstart-=1*1000
                    // adTend+=1*1000
                  }
                  tstart = _this.transformMyDate(adTstart);
                  tend = _this.transformMyDate(adTend);
                }
                // console.log(tstart,tend);

                _this.$store.state.nowTimeVal=[new Date(tstart),new Date(tend)];//改变右上角时间（跟拉到的时间保持一致）
                clearTimeout(_this.$store.state.refreshTimeout)//图表轮询定时器 清除按时刷新数据的定时器
                _this.$store.state.refreshAble=true;//禁用自动刷新
                setTimeout(()=>{
                  _this.$store.commit(types.MYDATEPICKER);
                },0)
              }
            }
          });
        });
      })
      
      }
      lineTimerFn();
    },
    drawOrgIpPie(){
      var _this=this;
      _this.orgIpPieLoading=true;
      _this.orgIpPieChart = echarts.init(document.getElementById('orgIpPieContainer'));
      var options={
          color:['#516b91','#59c4e6','#edafda','#93b7e3','#a5e7f0','#4ea397','#22c3aa','#7bd9a5','#d0648a','#f58db2'],
          title : {
            text: _this.$t('lg.numaccesssiptop10'),
            x:'center',
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          toolbox: {
            right:'10',
            top:'10',
            feature: {
              myTool1: {
                show: true,
                title: _this.$t('lg.agentip'),
                icon: 'image://static/icon/switch.png',
                onclick: function (){
                  getOrgIpPieData(_this.isPieOrg)
                  // console.log(_this.isPieOrg)
                }
              }
            }
          },
          series: [
            {
              name:this.$t('lg.accesssource')+'：',
              type:'pie',
              radius:['25%','35%'],
              // radius: '40%',
              // center: ['50%', '50%'],
              data:[
                // {value:335, name:'直接访问'},
                // {value:310, name:'邮件营销'},
              ].sort(function (a, b) { return a.value - b.value; }),
              // roseType: 'radius',//area radius
              label: {
                position:'outside',
                normal: {
                  textStyle: {
                    fontSize: '12',  
                  },
                  formatter: "{b}: {c}"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal',
                  },
                }
              },
              labelLine: {
                normal: {
                  smooth: 0,
                  length: 10,
                  length2: 20,
                },
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ],
        };
      function getOrgIpPieData(type){// 绘制图表
       // let searchIp = '';
        if(type){
          _this.isPieOrg=false;
          _this.searchIp="shadow.access.org_remote_ip";
          options.title.text=_this.$t('lg.numaccesspiptop10');
          options.toolbox.feature.myTool1.title=_this.$t('lg.sourceip');
        }else{
          _this.isPieOrg=true;
          _this.searchIp="shadow.access.remote_ip";
          options.title.text=_this.$t('lg.numaccesssiptop10');
          options.toolbox.feature.myTool1.title=_this.$t('lg.agentip');
        }
      var indexName="shadow-filebeat-*";
      let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };
   _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
        client.search({
          index: indexName,
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": mustOptions
              }
            },
            "aggs": {
              "ip": {
                "terms": {
                  "field": _this.searchIp,
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.ip.buckets:[];
          var result=[],legendRlt=[];
          for(var i=0;i<tarResult.length;i++){
            var dataI=tarResult[i];
            result.push(
              {
                value:dataI["doc_count"],
                name:dataI["key"]
              }
            );
            legendRlt.push(dataI["key"])
          }
          options.series[0].data=result;
          // options.legend.data=legendRlt;
          if(result.length==0){
            _this.orgIpPieNodata=true;
          }else{
            _this.orgIpPieNodata=false;
          }
          _this.orgIpPieChart.setOption(options,true);
          _this.orgIpPieLoading=false;

          _this.orgIpPieChart.off("click");
          _this.orgIpPieChart.on("click",(params)=>{
            //console.log(params);
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            //{"bool":{"must":[{"bool":{"should": []}}]}}
            _this.popQueryObj.bool.filter=_this.filterObj;//

          //  _this.popQueryObj.bool.must=JSON.parse(JSON.stringify(prmoSearchStr[_this.myChartType]['a1']));
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": _this.searchIp+":"+'\"'+_this.logDialogTitle+'\"'
              }
            });
            _this.popQueryObj.bool.must.push({
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              });
            _this.getOnepieceFromPie();
          })
        });
      });
      }
      getOrgIpPieData(); 
    },
    drawDomainLine(){
      var _this=this;
      _this.domainLineLoading=true;
      var domainDom=document.getElementById('domainLineContainer');
      _this.domainLineChart = echarts.init(domainDom);

      _this.domainLineChart.off('brushSelected');
      var brushFalg = false;
      domainDom.addEventListener("mousedown", () => {
        brushFalg=false;
      });
      domainDom.addEventListener("mouseup", () => {
        brushFalg=true;
      });

      var options = {
          color:['#c1232b','#27727b','#fcce10','#e87c25','#b5c334'],
          title: {
            text: _this.$t('lg.numaccessdomaintop5'),
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          legend: {
            top:'20px',
            data:[],
          },
          grid: {
            left: '5%',
            right: '3%',
            bottom:'4%',
            top:'25%',
            containLabel: true
          },
          brush: {
            toolbox: ['lineX'],
            xAxisIndex: "all",
            transformable:false,
            throttleType:'debounce',
            throttleDelay: 1000,
            brushStyle:{
              borderWidth: 0,
            }
          },
          toolbox: {
            show:false,
            right:'10',
            top:'10'
          },
          xAxis: {
            show:false,
            type: 'category',
            data: [],
          },
          yAxis: {
            show:false,
            type: 'value',
            name:_this.$t('lg.counts'),
            minInterval: 1//保持y轴刻度只为整数
          },
          series: [
            // {
            //     name:'Step Start',
            //     type:'line',
            //     step: 'start',
            //     data:[120, 132, 101, 134, 90, 230, 210]
            // },
            // {
            //     name:'Step Middle',
            //     type:'line',
            //     step: 'middle',
            //     data:[220, 282, 201, 234, 290, 430, 410]
            // },
          ]
      };
      var indexName="shadow-filebeat-*";
      let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[
              {
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };
  _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
      client.search({
        index: indexName,
        body:  {
          "size": 0,
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": mustOptions
            }
          },
          "aggs": {
            "host": {
              "terms": {
                "field": "shadow.access.http_host",
                "size": 5
              },
              "aggs": {
                "time_his": {                  
                  "date_histogram": {
                    "field": "@timestamp",
                    "interval": _this.timeinterval,
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
        var tarResult=res.aggregations?res.aggregations.host.buckets:[];
        var legendData=[],seriesData=[];
        if(tarResult.length==0){
          options.xAxis.show=false;
          options.yAxis.show=false;
          options.toolbox.show=false;
          _this.domainLineNodata=true;
        }else{
          options.xAxis.show=true;
          options.yAxis.show=true;
          options.toolbox.show=true;
          _this.domainLineNodata=false;
        }
        for(var i=0;i<tarResult.length;i++){
          var xaxisData=[],valData=[];
          var dataI=tarResult[i];
          legendData.push(dataI.key);
          for(var j=0;j<dataI.time_his.buckets.length;j++){
            var dataJ=dataI.time_his.buckets[j];
            var dataJV=dataJ.doc_count;
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
              // markLine: {
              //     silent: true,
              //     lineStyle:{
              //         type:'solid'
              //     },
              //     data: [{
              //         yAxis: 2
              //     }]
              // },
              data:valData
            }
          );
        }

        // if(hasline.domiantopline){
        //   seriesData=seriesData.map((item)=>{
        //     item.markLine= {
        //           symbol:"none",
        //           silent: true,
        //           lineStyle:{
        //               type:'dashed',
        //               color:'#893448'
        //           },
        //           data: [{
        //               yAxis: _this.domainConditionData
        //           }]
        //       }
        //     return item;
        //   })
        // }

        options.legend.data=legendData;
        options.xAxis.data=xaxisData;
        options.series=seriesData;

        //console.log(JSON.stringify(options))
        _this.domainLineChart.setOption(options,true);
        _this.domainLineLoading=false;

        //操作
        _this.domainLineChart.on('brushSelected', function (params) {
          // console.log(params)
          if(brushFalg){
            if(params.batch && params.batch[0].areas[0]){
              // console.log(params.batch[0])
              var startIndex=params.batch[0].areas[0].coordRange[0]=='-0'||params.batch[0].areas[0].coordRange[0]<0?0:params.batch[0].areas[0].coordRange[0];
              var endIndex=params.batch[0].areas[0].coordRange[1];
              var tstart=xaxisData[startIndex],tend=xaxisData[endIndex]?xaxisData[endIndex]:xaxisData[endIndex-1];

              if(tstart==tend){ 
                // console.log(tstart,tend,'相等');
                var adTstart=new Date(tstart).getTime(),adTend=new Date(tend).getTime();
                if(_this.$store.state.mydatedata.interval=='5m'){//此时interval=='1d' 或者 '1h'的可能性很小，因此没写了
                  adTstart-=5*60*1000;
                  adTend+=5*60*1000;
                }else if(_this.$store.state.mydatedata.interval=='10s'){
                  adTstart-=10*1000;
                  adTend+=10*1000;
                }else if(_this.$store.state.mydatedata.interval=='1s'){ //interval=='1s' 采样频率精确到1s，在往下拉也会一直有数据，因此也没写了
                  // adTstart-=1*1000
                  // adTend+=1*1000
                }
                tstart = _this.transformMyDate(adTstart);
                tend = _this.transformMyDate(adTend);
              }
              // console.log(tstart,tend);

              _this.$store.state.nowTimeVal=[new Date(tstart),new Date(tend)];//改变右上角时间（跟拉到的时间保持一致）
              clearTimeout(_this.$store.state.refreshTimeout)//图表轮询定时器 清除按时刷新数据的定时器
              _this.$store.state.refreshAble=true;//禁用自动刷新
              setTimeout(()=>{
                _this.$store.commit(types.MYDATEPICKER);
              },0)
            }
          }
        });
      });    
    })    
    },
    drawDomainPie(){
      var _this=this;
      _this.domainPieLoading=true;
      _this.domainPieChart = echarts.init(document.getElementById('domainPieContainer'));
      var options = {
            color:['#27727b','#fcce10','#e87c25','#b5c334','#60c0dd','#d7504b','#c6e579','#f0805a','#26c0c0','#c1232b'],
            title : {
              text: _this.$t('lg.numaccessdomaintop10'),
              // subtext: 'TOP10',
              // top:'20px',
              x:'center',
              textStyle: {
                fontSize: '16',
                fontWeight: 'normal'
              }
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            // legend: {
            //   orient: 'horizontal',
            //   bottom:'0px',
            //   data:[]
            // },
            series: [
              {
                name:_this.$t('lg.accesssource')+'：',
                type:'pie',
                radius:['25%','35%'],
                // radius:'40%',
                // center: ['50%', '50%'],
                data:[].sort(function (a, b) { return a.value - b.value; }),
                // roseType: 'radius',//area radius
                label: {
                  position:'outside',
                  normal: {
                    textStyle: {
                      fontSize: '12',  
                    },
                    formatter: "{b}: {c}"
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '14',
                      fontWeight: 'normal'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    smooth: 0,
                    length: 10,
                    length2: 20,
                  },
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                  return Math.random() * 200;
                }
              }
            ]
          };
      function getDomainPieData(){
        var indexName="shadow-filebeat-*";
        let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[
              {
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };

  _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }

        client.search({
          index: indexName,
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": mustOptions
              }
            },
            "aggs": {
              "url": {
                "terms": {
                  "field": "shadow.access.http_host",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.url.buckets:[];
          var result=[],legendRlt=[];
          for(var i=0;i<tarResult.length;i++){
            var dataI=tarResult[i];
            result.push(
              {
                value:dataI["doc_count"],
                name:dataI["key"]
              }
            );
            legendRlt.push(dataI["key"])
          }
          options.series[0].data=result;
          // options.legend.data=legendRlt;
          
          // console.log(tarResult)
          // console.log(result)

          if(result.length==0){
            _this.domainPieNodata=true;
          }else{
            _this.domainPieNodata=false;
          }
          _this.domainPieChart.setOption(options,true);
          _this.domainPieLoading=false;
         
          _this.domainPieChart.off("click");
          _this.domainPieChart.on("click",(params)=>{
            // console.log(params);
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            _this.popQueryObj.bool.filter=_this.filterObj;//把 

           // _this.popQueryObj.bool.must=JSON.parse(JSON.stringify(prmoSearchStr[_this.myChartType]['a1']));
            _this.popQueryObj.bool.must.push({
              "query_string": {
                  "query":"shadow.access.http_host:"+'\"'+_this.logDialogTitle.replace(/:/g,'\\:')+'\"'
                },
                
            });
             _this.popQueryObj.bool.must.push({
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              });
            _this.getOnepieceFromPie();
          })
        });
      })
      }
      getDomainPieData();
    },
    drawFingerPie(){
      var _this=this;
      _this.fingerPieLoading=true;
      _this.fingerPieChart = echarts.init(document.getElementById('fingerPieContainer'));
      var option = {
        // color:['#9a7fd1','#588dd5','#f5994e','#c05050','#59678c','#c9ab00','#7eb00a','#6f5553','#c14089','#07a2a4'],
        color:['#b6a2de','#5ab1ef','#ffb980','#d87a80','#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa','#07a2a4'],
        title : {
          text: _this.$t('lg.jiyujilu')+'/Top10',
          x:'center',
          textStyle: {
          fontSize: '16',
          fontWeight: 'normal'
          }
        }, 
        tooltip : {    
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show:_this.fingerPieLegendShow,
          backgroundColor:'#fff',
          orient: 'vertical',
          top:'30',
          right:'right',
          data: []//['视频广告']
        },
        series: 
          {
            name:_this.$t('lg.accesssource'),
            type: 'pie',
            radius : '40%',
            center: ['50%', '50%'],
            data:[],//[{value:135, name:'视频广告'}],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              position:'outside',
              normal: {
                textStyle: {
                  fontSize: '12',  
                },
                formatter: "{b}: {c}"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                smooth: 0,
                length: 10,
                length2: 20,
              },
            },
          }
        };

      function getFingerPieData(){
        var indexName="shadow-filebeat-*";
        let mustOptions=[];
      if(_this.myChartType=='protectChart'){
        indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[
              {
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };

  _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }

        client.search({
          index: indexName,
          body:{
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": mustOptions,
                "must_not": [
                    {
                      "match": {
                        "shadow.access.token": "00000000000000000000000000000000"
                      }
                    },
                    {
                      "match": {
                        "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                      }
                    },
                    {
                      "prefix": {
                        "shadow.access.token": "browserValid0000"
                      }
                    }
                  ]
              }
            },
            "aggs": {
              "tokenName": {
                "terms": {"field" : "shadow.access.token","size": 10}
              }
            }
          }
        }).then((res)=>{
          var tarResult=[],
          tarResult=res.aggregations?res.aggregations.tokenName.buckets:[];
          if(tarResult.length==0){
            _this.fingerPieNodata=true;
          }else{
            _this.fingerPieNodata=false;
          }
          var result=[],legendRlt=[]; 
          for(var i=0;i<tarResult.length;i++){
            var dataI=tarResult[i];
              result.push(
              {
                value:dataI["doc_count"],
                name:dataI["key"]
              }
            );
           legendRlt.push(dataI["key"])
          }
          
          option.series.data=result;
          option.legend.data=legendRlt;
          _this.fingerPieChart.setOption(option,true);
          _this.fingerPieLoading=false;
         
          _this.fingerPieChart.off("click");
          _this.fingerPieChart.on("click",(params)=>{
            // console.log(params)
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
           
            _this.popQueryObj.bool.must=JSON.parse(JSON.stringify(prmoSearchStr[_this.myChartType]['a1']));
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.access.token:"+'\"'+_this.logDialogTitle+'\"'
              }
            });
            _this.getOnepieceFromPie();
          })
        });
      })
      }
      getFingerPieData();
    },
    drawAutoToolPie(){
      var _this=this;
      _this.autoToolPieLoading=true;
      _this.autoToolPieChart = echarts.init(document.getElementById('autoToolPieContainer'));
      var option = {
          title : {
            text: _this.$t('lg.autotop10'),
            x:'center',
            textStyle: {
            fontSize: '16',
            fontWeight: 'normal'
            }
          }, 
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: function (params) {
              return params[0].name + ': ' + params[0].value;
            }
          },
          grid: {
            top:'12%',
            left: '-10',
            right: '5%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            show:false,
            data: [],
            axisTick: {show: true},
            axisLine: {show: true},
            axisLabel: {
              textStyle: {
                color: '#e54035',
              },
              interval:0,//横轴信息全部显示  
              rotate:-30,//-30度角倾斜显示  
              // align:'right',

              // formatter:function(value,index)  
              //   {  
              //       debugger  
              //       if (index % 2 != 0) {  
              //           return '\n\n' + value;  
              //       }  
              //       else {  
              //           return value;  
              //       }  
              //   }  
            }
          },
          yAxis: {
            show:false,
          },
          color: ['#e54035'],
          series: [{
            name: 'hill',
            type: 'pictorialBar',
            barCategoryGap: '-5%',
            symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
            itemStyle: {
              normal: {
                opacity: 0.6
              },
              emphasis: {
                opacity: 1
              }
            },
            data: [],
            // label:{
            //   normal: {
            //     show: true,
            //     position:'top',
            //     color:'#e54035'
            //   }
            // },
            z: 10
          }, {
            name: 'glyph',
            type: 'pictorialBar',
            barGap: '-100%',
            symbolPosition: 'end',
            symbolSize: 5,
            symbolOffset: [0, '-120%'],
            data: []
          }]
        };

       function getAutoToolPieData(){
         var indexName="shadow-filebeat-*";
         let mustOptions=[];
        if(_this.myChartType=='protectChart'){
            indexName="shadow-filebeat-warn*"
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
          }else if(_this.myChartType=='monitorChart'){
            mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },
              {
              "query_string": {
                "query": "shadow.access.error_code:>0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.response_code:200"
              }
            },
            {
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              },
            {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }
            ]
          };
 _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
        client.search({
          index: indexName,
          body:{
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must":mustOptions
              }
            },
            "aggs": {
              "user_agent": {
                "terms": {"field" : "shadow.access.user_agent.name","size": 10}
              }
            }
          }

        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.user_agent.buckets:[];
          // tarResult=[
          //   {key: "Chrome", doc_count: 778},{key: "aws", doc_count: 199},
          //   {key: "IE", doc_count: 19},{key: "OP", doc_count: 1918},
          //   {key: "BAI", doc_count: 879},{key: "fox", doc_count: 198},
          // ];
          var seriesData1=[],seriesData2=[],xAxisData=[];
          
          if(tarResult.length>0){
            _this.autoToolPieNodata=false;
            option.xAxis.show=true;
            
            tarResult.forEach(element => {
              xAxisData.push(element.key);
              seriesData1.push(element.doc_count)
              seriesData2.push({value:element.doc_count})
            });

          }else{
            _this.autoToolPieNodata=true;
            option.xAxis.show=false;
          }

          option.series[0].data=seriesData1;
          option.series[1].data=seriesData2;
          option.xAxis.data=xAxisData;

          _this.autoToolPieChart.setOption(option,true);
          _this.autoToolPieLoading=false;
         
          _this.autoToolPieChart.off("click");
          _this.autoToolPieChart.on("click",(params)=>{
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
         
            //_this.popQueryObj.bool.must=JSON.parse(JSON.stringify(prmoSearchStr[_this.myChartType]['a1']));
            _this.popQueryObj.bool.must.push({
                  "query_string": {
                      "query":"shadow.access.user_agent.name:"+'\"'+_this.logDialogTitle+'\"'  
                    }
                });
                _this.popQueryObj.bool.must.push({
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              });
            _this.getOnepieceFromPie2();
          })

        });
       })
      }
      getAutoToolPieData();
    },
    drawRegionBar(){//地域信息
      var _this=this;
      _this.regionBarLoading=true;
      _this.regionBarChart = echarts.init(document.getElementById('regionBarContainer'));
      var options = {
          color:['#3fb1e3','#6be6c1','#626c91','#a0a7e6','#91ca8c','#96dee8','#4ea397','#22c3aa','#97b552','#9a7fd1'],
          title: {
            text: _this.$t('lg.geographicinfosourceip'),
            x:'center',
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          toolbox: {
            right:'10',
            top:'10',
            feature: {
              myTool1: {
                show: true,
                title: _this.$t('lg.agentip'),
                icon: 'image://static/icon/switch.png',
                onclick: function (){
                  getRegionSunburstData(_this.isRegionPieOrg)
                }
              }
            }
          },
          series: {
            type:'pie',
            radius:['25%','35%'],
            data: [].sort(function (a, b) { return a.value - b.value; }),
            label: {
              position:'outside',
              normal: {
                textStyle: {
                  fontSize: '12',  
                },
                formatter: "{b}: {c}"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'normal'
                }
              }
            },
            labelLine: {
              normal: {
                smooth: 0,
                length: 10,
                length2: 20,
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        };

      function getRegionSunburstData(type){
        if(type){
          _this.isRegionPieOrg=false;
          _this.searchGeoip="params._source.shadow.access.org_geoip";
          _this.mapScript='org_geoip';
          options.title.text=_this.$t('lg.geographicinfoproxyip');
          options.toolbox.feature.myTool1.title=_this.$t('lg.sourceip');
        }else{
          _this.isRegionPieOrg=true;
          _this.searchGeoip="params._source.shadow.access.geoip";
          _this.mapScript='geoip';
          options.title.text=_this.$t('lg.geographicinfosourceip');
          options.toolbox.feature.myTool1.title=_this.$t('lg.agentip');
        }

    let mustOptions=[];
     mustOptions=[{
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              },{
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              }, {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }];
   _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            mustOptions.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
        client.search({
           index: "shadow-filebeat-warn*",
           body:{
             "track_total_hits": true, 
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": mustOptions
              }
            },
            "aggs": {
                "GroupByGeo": {
                  "terms": {
                    "script": {
                      "lang": "painless",
                    //"source": "params._source.shadow.access.geoip.city_name+';'+params._source.shadow.access.geoip.location.lon+', '+params._source.shadow.access.geoip.location.lat"
                      "source": _this.searchGeoip+".city_name+';'+"+_this.searchGeoip+".location.lon+', '+"+_this.searchGeoip+".location.lat"
                    }, 
                    "field": _this.searchGeoip2+".city_name"
                  }//,
                  // "aggs": {
                  //   "GroupByIp": {
                  //     "terms": {
                  //       "field": _this.searchIp,
                  //       "size": 10
                  //     }
                  //   }
                  // }
                }
              }
          }

        }).then((res)=>{
          var buckets=res.aggregations?res.aggregations.GroupByGeo.buckets:[];
          var seriesData=[];
          buckets.forEach(element=>{//过滤掉没返回city_name的数据
              var ikeynamearr=element.key.split(";");
              var ikeyname=ikeynamearr[0];
              var ikey=ikeynamearr[1].split(",").map(keyitem=>{return parseInt(keyitem,10)});
              var ikeycount=element.doc_count;
             // var ikey=element.key.match(/-*\d+(\.\d+)*/g).map(keyitem=>{return parseInt(keyitem,10)});
              seriesData.push({
               // "name":JSON.stringify(ikey),
                "name":ikeyname,
                "value":ikeycount
              });
             
            });
          if(seriesData.length==0){
            _this.regionBarNodata=true;
          }else{
            _this.regionBarNodata=false;
          }

          options.series.data=seriesData;
          _this.regionBarChart.setOption(options,true);
          _this.regionBarLoading=false;

          _this.regionBarChart.off("click");
          _this.regionBarChart.on("click",(params)=>{
            _this.logDialogVisible=true;
            let pname=params.name;
            _this.logDialogTitle=pname;
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
    
            // console.log(_this.logDialogTitle)
            if(/^\[.+\]$/.test(params.name)){//没有city_name 就用经纬度查
              var locationArr = JSON.parse(params.name)
              var lonNum = locationArr[0],latNum = locationArr[1];
              var mapScriptStr = "shadow.access."+_this.mapScript+".location";

              var filterGeo ={};
              filterGeo.distance="1mm";
              filterGeo[mapScriptStr]={
                "lat" : latNum,
                "lon" : lonNum
              }

              if(!_this.popQueryObj.bool.filter.bool){//如果没有查询面板的过滤条件
                _this.popQueryObj.bool.filter={"bool":{"must":[]}}
                _this.popQueryObj.bool.filter.bool.must.push({
                  "geo_distance" : filterGeo
                });
              }else{
                _this.popQueryObj.bool.filter.bool.must.push({
                  "geo_distance" : filterGeo
                });
              }
            }else{
              let objkey="shadow.access."+_this.mapScript+".city_name";
              let keyobj={match:{}};
              keyobj['match'][objkey]=_this.logDialogTitle;


              _this.popQueryObj.bool.must.push(//有city_name 就用city_name查
               // {
              // "query_string": {
              //     "query":"shadow.access."+_this.mapScript+".city_name:"+_this.logDialogTitle
              //   }
             // }
              keyobj
             );
            }
            _this.popQueryObj.bool.must.push({
                "query_string": {
                  "query": "shadow.access.shadow_learning_mode:1"
                }
              });
            _this.getOnepieceFromPie();
          })

        });

      })


      }
      getRegionSunburstData();

    },

    fullScreen(){//大屏展示
      var chartGridDom = document.getElementsByClassName('visitChart-wrapper');
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
    downLoadPdf(){//导出数据图为pdf文件
      if(this.attackSumNum!=0){
        const myChart1Str = this.businessLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        let myChart2Str;
        let myChart11Str;
       // if(this.forFastShow){
          myChart2Str = this.urlVisitCtBarChart.getDataURL({
            type:'jpeg',
            pixelRatio: 2,
            backgroundColor: '#fff',
          }).replace("data:image/jpeg;base64,","");
          myChart11Str = this.regionBarChart.getDataURL({
            type:'jpeg',
            pixelRatio: 2,
            backgroundColor: '#fff',
          }).replace("data:image/jpeg;base64,","");
      //  }

        const myChart3Str = this.eCodeTypeChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart5Str = this.orgIpLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart6Str = this.orgIpPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart7Str = this.domainLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart8Str = this.domainPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart9Str = this.fingerPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart10Str = this.autoToolPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        
        let myCharArray;
        if(myChart2Str && myChart11Str){
          myCharArray = [myChart1Str,myChart2Str,myChart3Str,myChart5Str,myChart6Str,myChart7Str,myChart8Str,myChart9Str,myChart10Str,myChart11Str]; 
        }else{
          myCharArray = [myChart1Str,myChart3Str,myChart5Str,myChart6Str,myChart7Str,myChart8Str,myChart9Str,myChart10Str]; 
        }
        const url = SERVER_API_URL + 'pe/download/conversion/jpg2pdf';
        axios.post(url,{
          base64StringList:myCharArray
        },{
          responseType:'blob'
        }).then((res)=>{
          //  console.log(res)
          if(res.status==200){
            var filename = _this.$t('lg.accessdatachart')+'.pdf';
            this.$store.commit(types.MAKEPDF,{'pdfdata':res.data,'pdfname':filename});
          }
        }).catch((err)=>{
          console.log(err);
        });
      }else{
        this.$message.error(_this.$t('lg.nodata'));
      }
    },
    goBackMap(){//返回地图
      this.$router.push('/visit')
    },
    
    //日志弹框
    getChangeLogData(pageObj){ //改变分页返回数据
      this.fromPage = pageObj.curPage-1;
      this.pageSize= pageObj.pageNum;
      this.requeryObj?this.getOnepieceFromPie(this.requeryObj):this.getOnepieceFromPie();
    },
    getChangeLogData(pageObj){ 
      this.fromPage = pageObj.curPage-1;
      this.pageSize= pageObj.pageNum;
      this.requeryObj?this.getOnepieceFromPie2(this.requeryObj):this.getOnepieceFromPie2();
    },
    getOnepieceFromPie(requeryObj){//恶意访问
      var _this=this;
      // console.log(_this.popQueryObj);

      let clientQueryObj = JSON.parse(JSON.stringify(_this.popQueryObj));//
      clientQueryObj.bool.must.push(
        {
          "range": {
            "@timestamp": {
              "gte": _this.fromTime,
              "lte": _this.endTime
            }
          }
        }
      );
      if(requeryObj){//
        // console.log(requeryObj);
        const requeryArr = requeryObj.bool.must;
        // _this.popQueryObj.bool.filter={..._this.popQueryObj.bool.filter,...requeryObj}

        if(clientQueryObj.bool.filter.bool){
          requeryArr.forEach((item)=>{
            clientQueryObj.bool.filter.bool.must.push(item);
          })
        }else{
          clientQueryObj.bool.filter={"bool":{"must":[]}}
          requeryArr.forEach((item)=>{
            clientQueryObj.bool.filter.bool.must.push(item);
          })
        }
      }
      // console.log(clientQueryObj)
      client.search({
        index:"shadow-filebeat-warn*",
        body:{
          "from":_this.fromPage*_this.pageSize,
          "size": _this.pageSize,
          "sort": {
            "@timestamp": "desc"
          },
          "query": clientQueryObj
        }
      }).then((res2)=>{
        _this.chartLogsTotalNum=res2.hits.total.value;
        let logResArr = res2.hits.hits;

        // 获取access.log表体数据
        _this.chartLogsBodyData = handleAccesslogData(logResArr);
      })
    },
    getOnepieceFromPie2(requeryObj){//恶意访问 获取access.log表体数据
      var _this=this;
      // console.log(_this.popQueryObj);

      let clientQueryObj = JSON.parse(JSON.stringify(_this.popQueryObj));//
      clientQueryObj.bool.must.push(
        {
          "range": {
            "@timestamp": {
              "gte": _this.fromTime,
              "lte": _this.endTime
            }
          }
        }
      );
      if(requeryObj){//询语句融汇在一起）
        // console.log(requeryObj);
        const requeryArr = requeryObj.bool.must;
        // _this.popQueryObj.bool.filter={..._this.popQueryObj.bool.filter,...requeryObj}

        if(clientQueryObj.bool.filter.bool){
          requeryArr.forEach((item)=>{
            clientQueryObj.bool.filter.bool.must.push(item);
          })
        }else{
          clientQueryObj.bool.filter={"bool":{"must":[]}}
          requeryArr.forEach((item)=>{
            clientQueryObj.bool.filter.bool.must.push(item);
          })
        }
      }
      // console.log(clientQueryObj)
      client.search({
        index:"shadow-filebeat-warn*",
        body:{
          "from":_this.fromPage*_this.pageSize,
          "size": _this.pageSize,
          "sort": {
            "@timestamp": "desc"
          },
          "query": clientQueryObj
        }
      }).then((res2)=>{
        _this.chartLogsTotalNum=res2.hits.total.value;
        let logResArr = res2.hits.hits;
        // 获取access.log表体数据
        _this.chartLogsBodyData = handleAccesslogData(logResArr);
      })
    },
    requeryRowByAccess(obj){
      this.requeryObj=obj.requeryObj; 
      this.fromPage=0;
      this.getOnepieceFromPie(this.requeryObj);
      if(this.$refs.log_tables) this.$refs.log_tables.tabCurPage=1;
    },
    refilterColByAccess(obj){  //发送用户增删请求
      var url = SERVER_API_URL + '/pe/shadow/kv';
      axios.post(url,{visitChartAccess:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{visitChartAccess:obj}).then(res=>{
          })
        }
      })
      this.chartLogsHeadData = obj;
    },
    showSDURLMenu(index) { //表里面该字段的菜单
      this.chartLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
      // this.accesslogsData[index].showUMenuList=true;
      this.$set(this.chartLogsBodyData[index], "showUMenuList", true);
    },
    hideSDURLMenu() { //表里面字段的菜单
      this.chartLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
    },
    logDialogClose(){//关闭日志弹框
      this.logDialogVisible=false;
      this.logDialogTitle='';
      this.fromPage=0;
      this.chartLogsTotalNum=0;
      this.popQueryObj={"bool":{"must":[{"bool":{"should": []}}]}};
      this.broadcast('logRequery',"clearData");//要引入
      this.requeryObj=null;//
    },
    //数据处理函数
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(d.getFullYear())+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());//+':' + pad(d.getSeconds())
    },
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style>
.fastloadmore{text-align:center; background-color:#f5f5f5; padding:10px; cursor:pointer}
.visitChart-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.visitChartContent{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
}

/*图表*/
.chartRow{
  margin-bottom: 10px;
}
.chartRowBusi{
  margin-left: 0px!important;
}
#urlVisitCtBarContainer,#eCodeTypeContainer,#orgIpLineContainer,#domainLineContainer,#orgIpPieContainer,#domainPieContainer,#fingerPieContainer,#autoToolPieContainer,#regionBarContainer{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
}
/*业务表 max min*/
.busiChartBox{
  padding: 10px;
  box-sizing: border-box;
  background: #f7f7f7;
}
#businessContainer{
  width: 100%;
  height: 290px;
}
.busiNumBox{
  background: #fff;
  height: 290px;
  padding: 30px 10px !important;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.busiNumBox2{
  background: #f7f7f7;
  height: 310px;
  padding: 30px !important;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.totalList{
  margin-bottom: 20px;
}
.totalList li{
  color: #27727b;
  margin-bottom: 10px;
  line-height: 15px;
}
.someList li{
  color: #e87c25;
  margin-bottom: 10px;
  line-height: 15px;
}
.totalList .listTitle,.someList .listTitle{
  color: #606266;
  margin-bottom: 15px;
  padding-left: 0px;
}
.liLable{
  font-size: 12px;
  font-style:italic;
  padding-left: 10px;
}
.liValue{
  text-align: center;
  font-size: 1.2vw;
}
/*次数显示&业务表*/
.numBox{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
  /* box-shadow: 2px 2px 5px #ccc; */
}
.numBoxTitle{
  font-size: 16px;
  color: #333;
}
.totalBox {
  margin-top: 20px;
  height: 80px;
}
.abnormalBox{
  margin-top: 30px;
  height: 100px;
}
.numTitle{
  padding-left: 10px;
  color: #606266; 
}
.totalNum{
  margin-left: 20%;
  font-size: 2.5vw;
  color: #516b91;
  line-height: 60px;
}
.abnormalNum{
  text-align: center;
  font-size: 4vw;
  color: #d95850;
  line-height: 90px;
}
.uTxt{
  font-size: 14px;
  color: #606266;
}

/*pei图暂无数据*/
.adaptive-circle {
  margin: 50px auto 0;
  width: 22%;
  height: 0;
  padding-top: 22%;
  border-radius: 100%;
  box-sizing: border-box;
  background:#fff;
  position:absolute;
  top:15%;
  left:40%;
}
.fingerPie-circle{
  margin: 0;
  width: 15%;
  left:42%;
  top:30%;
  padding-top: 15%;
}
.adaptive-circle .layout {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
}
.adaptive-circle .layout.middle:before {
  display: inline-block;
  vertical-align: middle;
  content: '';
  height: 100%;
  width: 0;
  overflow: hidden;
}
.adaptive-circle .layout.middle div:first-child {
  display: inline-block;
  vertical-align: middle;
}

/*导出数据图表*/
/* .downBtn{
  position: fixed;
  bottom: 20px;
  right: 50px;
  padding: 5px;
}
.goBackBtn{
  position: fixed;
  bottom: 50px;
  right: 50px;
  padding: 5px;
}
.downBtn a,.goBackBtn a{
  font-size: 15px;
} */

/* loading 主要针对‘自定义图表’的loading */
.visitChart-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.visitChart-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
</style>

