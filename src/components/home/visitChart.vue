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
        <!-- <el-col :span="8">
          <div class="chart-content"
              v-loading="orgIpPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="orgIpPieNodata">
              <div class="layout middle">
                <div>
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
            <div id="orgIpPieContainer"></div>
          </div>
        </el-col> -->
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
        <!-- <el-col :span="8" class="busiNumBox2 chart-content">
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
        
        
      <el-row :gutter="10" class="chartRow" v-if="forFastShow">
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
      <el-row :gutter="10" class="chartRow" v-if="forFastShow">
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
      <p class="fastloadmore" v-if="!forFastShow" @click="forfastloadmore">{{$t('lg.dianjilookmore')}}</p>
    </div>
    </div>
    

    <!-- 日志弹框 -->
    <el-dialog :title="logDialogTitle" :visible.sync="logDialogVisible" width="80%" :before-close="logDialogClose">
      <log-rebuild :tableKeyArr='tableKeyArrAllAccess'  :dynamicTag='chartLogsHeadData' @refilterColBy='refilterColByAccess' @requeryRowBy='requeryRowByAccess'></log-rebuild>
      <div v-if="chartLogsTotalNum==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="chartLogsTotalNum>0" class="logTableHeight">
        <log-tables ref="log_tables" :tabheadData="chartLogsHeadData" :tabodyData="chartLogsBodyData" :totalNum="chartLogsTotalNum" @getChangePageLogData="getChangeLogData" :isLogLoding="false" :showSDURLMenu='showSDURLMenu'></log-tables>
      </div>
    </el-dialog>

    <!-- <div title="返回地图" class="goBackBtn">
      <router-link tag="a" to="/visit"><i class="fa fa-globe font-blue"></i> 返回地图</router-link>
    </div> 
    <div title="导出数据图表" class="downBtn">
      <a href="javascript:;" @click="downLoadPdf"><i class="fa fa-cloud-download font-green"></i> 导出图表</a>
    </div>  -->

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
      if(this.forFastShow){
        this.urlVisitCtBarChart.resize();
        this.regionBarChart.resize();
      }
      
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
      if(this.forFastShow){
        this.urlVisitCtBarChart.resize();
        this.regionBarChart.resize();
      }
    }
  },
  mounted(){
    if(!this.$route.query.timeInterval){
      this.handleTime();
      this.getAllchart();
    }

    // this.$refs.ipLineBox.oncontextmenu=()=>{
    //   var _this=this;
    //   this.alertTitle="恶意访问源IPTop5";
    //   this.alertMark="ipTop5"
    //   this.alertData=_this.cloneObj(_this.isIpAlertData);
    //   this.alertLine=this.isIpAlertLine;
    //   // console.log("ip  alertdata")
    //   // console.log(this.alertData)
    //   this.isAlertingShow=true;
    //   return false;
    // }
  },
  methods:{
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
      if(this.forFastShow){
       this.drawUrlVisitCtBar();
       this.drawRegionBar();//slow       
      }
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
      _this.timeinterval=_this.$store.state.mydatedata.interval || '10m';
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
              },
              // {
              //   "query_string": {
              //     "query": "shadow.access.shadow_learning_mode:1"
              //   }
              // },
               {
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
          console.log(_this.searchGeoip)
          console.log(_this.searchGeoip2)
        client.search({
           index: "shadow-filebeat-warn*",
           size:10,
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
                    // "script": {
                    //   "lang": "painless",
                    //   "source": _this.searchGeoip+".city_name+';'+"+_this.searchGeoip+".location.lon+', '+"+_this.searchGeoip+".location.lat"
                    // }, 
                    "field": _this.searchGeoip2+".city_name",
                    "size":10
                  }
                }
              }
          }

        }).then((res)=>{
          console.log(res);
          var buckets=res.aggregations?res.aggregations.GroupByGeo.buckets:[];
          var seriesData=[];
          buckets.forEach(element=>{//过滤掉没返回city_name的数据
              var ikeynamearr=element.key.split(";");
              var ikeyname=ikeynamearr[0];
            //  var ikey=ikeynamearr[1].split(",").map(keyitem=>{return parseInt(keyitem,10)});
              var ikeycount=element.doc_count;
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
        if(this.forFastShow){
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
        }

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

