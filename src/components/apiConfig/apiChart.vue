<!--API状态-->
<template>
  <div class="apiChart-wrapper">
    <query-panel @getAllQuerychart="getAllchart" :isApi="true" v-show="isShowQueryPanel"></query-panel><!-- 查询面板 -->
    <div class="apiChartContent">
      <el-row :gutter="20" class="chartRow chartRowBusi">
        <el-col :span="18" class="busiChartBox">
          <el-col :span="20" style="padding-left:0px">
            <div class="chart-content"
                v-loading="businessLineLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
              <pienodata mystyle="linenodata" v-if="businessNodata"></pienodata>
              <div id="businessContainer"></div>
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
              <li class="listTitle">{{$t('lg.normalaccess')}}：</li>
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
        </el-col>
        <el-col :span="6">
          <div class="chart-content numBox txtOverflow">
            <!-- <p class="text-center numBoxTitle"><span v-if="checkDomain">-{{checkDomain}}</span> <span v-else>总数据量</span> <span v-if="checkUrl">-{{checkUrl}}</span></p> -->
            <p class="text-center numBoxTitle">{{$t('lg.totaldatav')}}</p>
            <div class="totalBox">
              <p class='numTitle'>{{$t('lg.totalrquestammount')}}</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>{{$t('lg.totalnormalaccess')}}</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
          </div>
        </el-col>
      </el-row>
      
      <el-row :gutter="10" class="chartRow">
        <el-col :span="14">
          <div class="chart-content"
              v-loading="urlVisitCtLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="urlVisitCtBarNodata"></pienodata>
            <div id="urlVisitCtBarContainer"></div>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="chart-content"
              v-loading="regionSunburstLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="regionSunburstNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="regionSunburstContainer"></div>
          </div>
        </el-col>
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
      
      <!-- API响应时间/Top10 -->
      <!-- <el-row :gutter="10" class="chartRow">
        <el-col :span="14">
          <div class="chart-content"
              v-loading="apiRespTimeBarLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="apiRespTimeBarNodata"></pienodata>
            <div id="apiRespTimeBarContainer"></div>
          </div>
        </el-col>
        <el-col :span="10">
        </el-col>
      </el-row> -->
    </div>

    <!-- 日志弹框 -->
    <el-dialog :title="logDialogTitle" :visible.sync="logDialogVisible" width="80%" :before-close="logDialogClose">
      <log-rebuild :tableKeyArr='tableKeyArrApi' :dynamicTag='chartLogsHeadData' @refilterColBy='refilterColByAccess' @requeryRowBy='requeryRowByAccess'></log-rebuild>
      <div v-if="chartLogsTotalNum==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="chartLogsTotalNum>0" class="logTableHeight">
        <log-tables ref="log_tables" :tabheadData="chartLogsHeadData" :tabodyData="chartLogsBodyData" :totalNum="chartLogsTotalNum" @getChangeLogData="getChangeLogData" :isLogLoding="false"></log-tables>
      </div>
    </el-dialog>
   
    <!-- <div :title="$t('lg.exportdatachart')" class="downBtn">
      <a href="javascript:;" @click="downLoadPdf"><i class="fa fa-cloud-download font-green"></i> {{$t('lg.exportchart')}}</a>
    </div> -->

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
import queryPanel from '@/components/home/queryPanel';
import {logskeys,logskeys2} from '@/assets/js/logskeys';
import logRebuild from "@/components/logs/logRebuild";
import logTables from '@/components/logs/logTables';
import Emitter from 'element-ui/src/mixins/emitter';
import {handleAccesslogData} from '@/assets/js/tool';
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
      fromTime:0,
      endTime:0,
      timeinterval:'',

      //顶部查询面板
      isFalg:false,
      checkDomain:'',
      checkUrl:'',
      filterObj:{"match_all": {}},

      //max min 
      wholeCtMax:0,
      wholeCtMin:0,
      normalCtMax:0,
      normalCtMin:0,

      businessLineLoading:false,
      urlVisitCtLoading:false,
      regionSunburstLoading:false,
      orgIpLineLoading:false,
      orgIpPieLoading:false,
      domainLineLoading:false,
      domainPieLoading:false,
      fingerPieLoading:false,
      autoToolPieLoading:false,
      apiRespTimeBarLoading:false,

      businessLineChart:null,
      urlVisitCtBarChart:null,
      regionSunburstChart:null,
      orgIpLineChart:null,
      orgIpPieChart:null,
      domainLineChart:null,
      domainPieChart:null,
      fingerPieChart:null,
      autoToolPieChart:null,
      // apiRespTimeBarChart:null,//Api响应时间表，域名下api的响应时间,查询面板中至少要选择了域名才有数据
      
      businessNodata:false,
      urlVisitCtBarNodata:false,
      regionSunburstNodata:false,
      orgIpLineNodata:false,
      orgIpPieNodata:false,
      domainLineNodata:false,
      domainPieNodata:false,
      fingerPieNodata:false,
      autoToolPieNodata:false,
      apiRespTimeBarNodata:false,
      
      totalNum:0,
      attackSumNum:0,

      isRegionPieOrg:false,
      isLineOrg:false,
      isOrgIpPieOrg:false,

      fingerPieLegendShow:false,

      //日志弹框参数
      popQueryObj:{"bool":{"must":[]}},
      logDialogVisible:false,
      logDialogTitle:'',
      isencn:'cn',
      tableKeyArrApi:[...logskeys.access],  //access.log总共（默认）显示的字段
      chartLogsHeadData:[],//access.log用户自定义显示的字段
      chartLogsBodyData:[],//传入logTables.vue子组件的表体数据
      chartLogsTotalNum:0,
      fromPage:0,
      pageSize:10,
      chartLogsTotalNum:0,
      requeryObj:null,//日志弹框里面的requery子组件的查询条件
      
      // 地域信息切换源IP、代理IP
      searchGeoip:'params._source.shadow.access.geoip',
      searchGeoip2:'shadow.access.geoip',
      mapScript:'geoip',

      searchIp:'',

      //大屏展示
      isShowQueryPanel:true,//上方查询面板大屏展示时要隐藏
      isShowGridMenu:true,//右下角菜单大屏展示时要隐藏
    }
  },
  created(){
    // this.$store.state.isShowTimerate = true;//采样频率选择
    // this.$store.state.mydatedata.interval = '5m';
    // this.$store.state.timerateValue='采样频率';
    this.isencn=localStorage.lang;
    if(this.isencn=="en"){
      this.tableKeyArrApi=logskeys2.access;
    }else{
      this.tableKeyArrApi=logskeys.access;
    }

    this.getCustomHeadData();
    // resize
    window.addEventListener("resize", () => {
      this.businessLineChart.resize();
      this.urlVisitCtBarChart.resize();
      this.regionSunburstChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      this.fingerPieChart.resize();
      this.autoToolPieChart.resize();
      // this.apiRespTimeBarChart.resize();
    });
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      this.handleTime();
      this.getAllchart();
    },
    '$store.state.isMenuShow':function(){
      this.businessLineChart.resize();
      this.urlVisitCtBarChart.resize();
      this.regionSunburstChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      this.fingerPieChart.resize();
      this.autoToolPieChart.resize();
      // this.apiRespTimeBarChart.resize();
    }
  },
  mounted(){
    this.handleTime();
    this.getAllchart();
  },
  methods:{
    //创建即执行
    getAllchart(querOobj){
      if(querOobj){
        this.isFalg=querOobj.isQuery;
        this.checkDomain=querOobj.domainName;
        this.checkUrl=querOobj.urlArr;

        this.filterObj=this.getFilterObj(this.isFalg);
      }
      this.drawBusinessLine();
      this.getRequestNum();
      this.attackSum();
      this.drawUrlVisitCtBar();
      this.drawRegionSunburst();
      this.drawOrgIpLine();
      this.drawOrgIpPie();
      this.drawDomainLine();
      this.drawDomainPie();
      this.drawFingerPie();
      this.drawAutoToolPie();
      // this.drawApiRespTimeBar();
    },
    getFilterObj(flag){//输入条件后手动查询，不输入查询条件则查询所有数据
      var _this=this;
      var filterObj ={"match_all": {}};
      if(flag){
        var domainVariable = _this.checkDomain;
        var urlVariable = _this.checkUrl;
        filterObj = {
          "bool": {
              "must":[
                {"query_string": {
                  "query": "shadow.access.domain:"+'\"'+domainVariable+'\"'
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
    getCustomHeadData(){ // 获取恶意访问日志弹框access.log表头（用户自定义的表头）
      var url = SERVER_API_URL + '/pe/shadow/kv/apiChartAccess';
      axios.get(url).then(res =>{
        if(!res.data.data){
          if(this.isencn=="en"){
            this.chartLogsHeadData = [...logskeys2.access];
          }else{
            this.chartLogsHeadData = [...logskeys.access];
          }        
        }else{
          this.chartLogsHeadData = res.data.data.value;
        }
      })
    },

    //图表
    drawBusinessLine(){
      var _this=this;
      _this.businessLineLoading=true;
      var businessDom=document.getElementById('businessContainer');
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
            color:['#27727b','#7eb00a'],
            title: {
              text: _this.$t('lg.normalaccesstobuspro'),
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
              data:[_this.$t('lg.totalrequests'),_this.$t('lg.normalaccess')],
              itemGap: 5
            },
            grid: {
              left: '5%',
              right: '4%',
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
              top:'10',
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
      function lineTimerFn(){
        // lineTimer().then((nodes)=>{
        //   var nodeArr=[];
        //   for(var n=0;n<nodes.aggregations.langs.buckets.length;n++){
        //     nodeArr.push(
        //       nodes.aggregations.langs.buckets[n].key
        //     )
        //   }
        client.search({
          index: "shadow-filebeat-*",
          body:  {
            "size":0,
            "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": [{
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/access.log"
                }
              },{
              "exists": {
                "field": "shadow.access.method"
              }
            },  {
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
          },
          "aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":_this.timeinterval,"extended_bounds":{"min":_this.fromTime,"max":_this.endTime}}}}
          }
        }).then((res2)=>{
          var tarResult2=res2.aggregations?res2.aggregations.time_histo.buckets:[];
          var valData2=[],xaxisData2=[];
          var legendData=[],seriesData=[];

          var wholeCtArr=[];//wholeCtNumSum=0,wholeCtTimesSum=0,wholeCtAvg=0
          
          for(var j2=0;j2<tarResult2.length;j2++){
            var dataJ2=tarResult2[j2];
            var dataJV2=dataJ2.doc_count;

            if(dataJV2!=0){
              wholeCtArr.push(dataJV2);
              // wholeCtNumSum+=dataJV2;
            }

            if(!dataJV2){
              dataJV2=0
            }
            valData2.push(dataJV2);
            xaxisData2.push(_this.transformMyDate(dataJ2.key));
          }

          // wholeCtTimesSum=wholeCtArr.length;
          // wholeCtAvg=(wholeCtNumSum/wholeCtTimesSum).toFixed(2) || 0;
          wholeCtArr.sort(function(a,b){//最小值
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
              // markLine: {} //平均数计算待讨论，先隐藏平均数显示
            }
          );

          // if(_this.checkUrl){
          //   seriesData[0].markLine={
          //     silent: true,
          //       data: [
          //         {
          //           yAxis: wholeCtAvg,
          //           name: _this.$t('lg.avgvalue'),
          //           label: {
          //             normal: {
          //               position: 'end',
          //               formatter: wholeCtAvg
          //             }
          //           }
          //         }
          //       ]
          //   }
          // }else{
          //   seriesData[0].markLine={}
          // }

          client.search({////////2
            index: "shadow-filebeat-*",
            body:  {
              "size":0,
              "query":{
                "bool":{
                  "filter": _this.filterObj,
                  "must": [
                    {
                      "query_string": {
                        "query": "shadow.access.response_code:200"
                      }
                    },
                    {
                      "query_string": {
                        "query": "shadow.access.error_code:0"
                      }
                    },
                    {
                      "query_string": {
                        "query": "shadow.access.decrypted:1"
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
                }
              },
              "aggs":{
                "time_histo":{
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
              // console.log(res);
              var tarResult=res.aggregations?res.aggregations.time_histo.buckets:[];
              var valData=[],normalCtArr=[];//normalCtNumSum=0,normalCtTimesSum=0,normalCtAvg=0

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
                  // normalCtNumSum+=dataJV2;
                }

                if(!dataJV2){
                  dataJV2=0
                }
                valData.push(dataJV2);
              }
              
              // normalCtTimesSum=normalCtArr.length;
              // normalCtAvg=(normalCtNumSum/normalCtTimesSum).toFixed(2) ||0;
              normalCtArr.sort(function(a,b){//最小值
                return a-b;
              });
              _this.normalCtMin=normalCtArr[0]||0;
              _this.normalCtMax=normalCtArr[normalCtArr.length-1]||0;

              // console.log(normalCtTimesSum)
              // console.log(normalCtNumSum)
              // console.log(normalCtAvg)

              seriesData.push(
                {
                  name:_this.$t('lg.normalaccess'),
                  type:'bar',
                  data:valData,
                  large: true,
                  barMaxWidth: 10,
                  // markLine: {}
                }
              );

              // if(_this.checkUrl){
              //   seriesData[1].markLine={
              //     silent: true,
              //       data: [
              //         {
              //           yAxis: normalCtAvg,
              //           name: _this.$t('lg.avgvalue'),
              //           label: {
              //             normal: {
              //               position: 'end',
              //               formatter: normalCtAvg
              //             }
              //           }
              //         }
              //       ]
              //   }
              // }else{
              //   seriesData[1].markLine={}
              // }

              // options.legend.data=legendData;
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

                    _this.$store.state.nowTimeVal=[new Date(tstart),new Date(tend)];//这五行是右上角时间跟他对应上
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
        // })
      }
      lineTimerFn();
    },
    getRequestNum(){//请求总量
      var _this=this;
      client.search({
        index:"shadow-filebeat-*",
        body:{
          "track_total_hits": true, 
          "sort": {
            "@timestamp": "desc"
          },
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": [{
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/access.log"
                }
              }, {
              "exists": {
                "field": "shadow.access.method"
              }
            }, {
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
          }
        }
      }).then((res)=>{
        _this.totalNum=res.hits.total.value;
        // console.log(_this.fromTime,_this.endTime)
      })
    },
    attackSum(){//正常访问总量
      var _this=this;
      client.search({
        index:"shadow-filebeat-*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must": [
                {
                  "query_string": {
                    "query": "shadow.access.response_code:200"
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.error_code:0"
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.decrypted:1"
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
            }
          }
        }
      }).then((res)=>{
        _this.attackSumNum=res.hits.total.value;
      })
    },
    drawUrlVisitCtBar(){
      var _this=this;
      _this.urlVisitCtLoading=true;
      _this.urlVisitCtBarChart = echarts.init(document.getElementById('urlVisitCtBarContainer'));
    
      //设置‘基于错误码统计的正常访问次数/Top10’图的显示文字
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
          // color:['#d95850'],
          color:['#4ea397'],
          title: {
            text: _this.$t('lg.urltop10'),
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
            var str = '';
            params.forEach(item=>{
              str = item.data.name+_this.$t('lg.numaccess')+':'+item.data.value+_this.$t('lg.count')
            })
            return str;
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
          data: [],
          inverse: true,//是否是反向坐标轴 （这里反向后数据降序排列）
        },
        series: []
      };

      function getUrlVisitCtData(type){
        client.search({
          index: "shadow-filebeat-*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
              }
            },
            "aggs": {
              "filterUrl": {
                "terms": {
                  "field": "shadow.access.org_url",//shadow_url
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          // /console.log(res);
          var resResult=res.aggregations?res.aggregations.filterUrl.buckets:[];
          // resResult=[
          //   {key: "/search.aspx", doc_count: 10},
          //   {key: "/MkWZsG4-RgQLRlzZ3Dy8BxHhXAqPUdGh1QnNkB0ysA1DTv-4BTqUZXdmrkxEQ57Hia9m3-WfLSnW9xO-Sj-79DNu_SkE4N8QlLCHSwfy2INcvhsnS_DD4LlF4cdbdDCI3uC109XvVVfIDkgGTFFImFnXOUl8f7wDSVRzN_-5SWQ=CBWsK9LAXW4FIBgGop8vhMKAVibSrQqdH8sgsA_NXeNJHBXCfVKMkXy8Wn1JtUivejq-SOeRIVmdRbNY3gS5eq9p-b5OTyL6XofOC7IpEa0qdgPL_A9GYaGmMkz0_NWD75-i2irEKyv_qQR-50r_YzfuNKaCarPZt_rKmXlyPyehGFujkufmdPFkbMvqvK2M0zwgMzm6Mn0=/924220@", doc_count: 3},
          //   {key: "/arch.aspx", doc_count: 2},
          //   {key: "/rch.aspx", doc_count: 5},
          //   {key: "/ch.aspx", doc_count: 8},
          // ]

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
            }else{
              sdata.push({
                name:"-",
                value:"-"
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

        _this.urlVisitCtBarChart.off("click");
        _this.urlVisitCtBarChart.on("click",(params)=>{
          // console.log(params)
          _this.logDialogVisible=true;
          _this.logDialogTitle=params.name;
          _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
          _this.popQueryObj.bool.must.push({
            "query_string": {
              "query":"shadow.access.response_code:200"
            }
          });
          _this.popQueryObj.bool.must.push({
            "query_string": {
              "query": "shadow.access.error_code:0"
            }
          });
          _this.popQueryObj.bool.must.push({
            "query_string": {
              "query": "shadow.access.decrypted:1"
            }
          });
          _this.popQueryObj.bool.must.push({
            "query_string": {
              "query":"shadow.access.org_url:"+_this.logDialogTitle.replace(/\//g,'\\/')
            } 
          });
          // console.log(_this.popQueryObj)
          _this.getOnepieceFromPie();
        });
      }
      getUrlVisitCtData();
    },
    drawRegionSunburst(){//地域信息
      var _this=this;
      _this.regionSunburstLoading=true;
      _this.regionSunburstChart = echarts.init(document.getElementById('regionSunburstContainer'));
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
        client.search({
           index: "shadow-filebeat-*",
           body:{
             "track_total_hits": true, 
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [{
                  "query_string": {
                    "query": "shadow.access.response_code:200"
                  }
                }, {
                  "query_string": {
                    "query": "shadow.access.error_code:0"
                  }
                },{
                  "query_string": {
                    "query": "shadow.access.decrypted:1"
                  }
                }, {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
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
                    "field": _this.searchGeoip2+".city_name",
                    "size": 10
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
            _this.regionSunburstNodata=true;
          }else{
            _this.regionSunburstNodata=false;
          }

          options.series.data=seriesData;
          _this.regionSunburstChart.setOption(options,true);
          _this.regionSunburstLoading=false;

          _this.regionSunburstChart.off("click");
          _this.regionSunburstChart.on("click",(params)=>{
            // console.log(params);
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.error_code:0"  
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.response_code:200"
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query": "shadow.access.decrypted:1"
                    }
            });

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
              _this.popQueryObj.bool.must.push({//有city_name 就用city_name查
              "query_string": {
                  "query":"shadow.access."+_this.mapScript+".city_name:"+_this.logDialogTitle
                }
              });
            }
            _this.getOnepieceFromPie();
          })

        });
      }
      getRegionSunburstData();

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
            text: _this.$t('lg.numaccesstop5'),
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
        let searchIp = '';
        if(type){
          _this.isLineOrg=false;
          searchIp="shadow.access.org_remote_ip";
          options.title.text=_this.$t('lg.numaccessproxytop5');
          options.toolbox.feature.myTool1.title=_this.$t('lg.sourceip');
        }else{
          _this.isLineOrg=true;
          searchIp="shadow.access.remote_ip";
          options.title.text=_this.$t('lg.numaccesstop5');
          options.toolbox.feature.myTool1.title=_this.$t('lg.agentip');
        }
        // lineTimer().then((nodes)=>{
        //   var nodeArr=[];
        //   for(var n=0;n<nodes.aggregations.langs.buckets.length;n++){
        //     nodeArr.push(
        //       nodes.aggregations.langs.buckets[n].key
        //     )
        //   }
          client.search({
            index: "shadow-filebeat-*",
            body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
              }
            },
            "aggs": {
              "ip": {
                "terms": {
                  "field": searchIp,//shadow.access.org_remote_ip
                  "size": 5
                },
                "aggs": {
                  "time_histo": {                  
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
              for(var j=0;j<dataI.time_histo.buckets.length;j++){
                var dataJ=dataI.time_histo.buckets[j];
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
                  data:valData
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
        // })
      }
      lineTimerFn();
    },
    drawOrgIpPie(){
      var _this=this;
      _this.orgIpPieLoading=true;
      _this.orgIpPieChart = echarts.init(document.getElementById('orgIpPieContainer'));
      var options={
          color:['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80','#8d98b3','#e5cf0d','#97b552','#95706d','#f58db2'],
          title : {
            text:_this.$t('lg.numaccessiptop10'),
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
                  getOrgIpPieData(_this.isOrgIpPieOrg)
                  // console.log(_this.isOrgIpPieOrg)
                }
              }
            }
          },
          series: [
            {
              name:_this.$t('lg.accesssource')+':',
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
          _this.isOrgIpPieOrg=false;
          _this.searchIp="shadow.access.org_remote_ip";
          options.title.text=_this.$t('lg.numaccessproxytop10');
          options.toolbox.feature.myTool1.title=_this.$t('lg.sourceip');
        }else{
          _this.isOrgIpPieOrg=true;
          _this.searchIp="shadow.access.remote_ip";
          options.title.text=_this.$t('lg.numaccessiptop10');
          options.toolbox.feature.myTool1.title=_this.$t('lg.agentip');
        }
        client.search({
          index: "shadow-filebeat-*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
            // console.log(params);
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            //{"bool":{"must":[{"bool":{"should": []}}]}}
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.access.error_code:0"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.access.response_code:200"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": "shadow.access.decrypted:1"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": _this.searchIp+":"+'\"'+_this.logDialogTitle+'\"'
              }
            });
            _this.getOnepieceFromPie();
          })
        });
      }
      getOrgIpPieData(); 
    },
    drawDomainLine(){
      var _this=this;
      _this.domainLineLoading=true;
      var domainDom=document.getElementById('domainLineContainer');
      _this.domainLineChart = echarts.init(domainDom);

      _this.domainLineChart.off('brushSelected');//一定要清除brush事件
      var brushFalg = false;//设置一个阀值，鼠标弹起时才触发
      domainDom.addEventListener("mousedown", () => {
        brushFalg=false;
      });
      domainDom.addEventListener("mouseup", () => {
        brushFalg=true;
      });

      var options = {
          color:['#b6a2de','#60c0dd','#e87c25','#9bca63','#3fb1e3'],
          title: {
            text: _this.$t('lg.normalaccdomaintop5'),
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
            top:'10',
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
      function lineTimerFn(){
        // lineTimer().then((nodes)=>{
        //   var nodeArr=[];
        //   for(var n=0;n<nodes.aggregations.langs.buckets.length;n++){
        //     nodeArr.push(
        //       nodes.aggregations.langs.buckets[n].key
        //     )
        //   }
          client.search({
            index: "shadow-filebeat-*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "filter": _this.filterObj,
                  "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
                }
              },
              "aggs": {
                "host": {
                  "terms": {
                    "field": "shadow.access.http_host",
                    "size": 5
                  },
                  "aggs": {
                    "time_histo": {                  
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
              for(var j=0;j<dataI.time_histo.buckets.length;j++){
                var dataJ=dataI.time_histo.buckets[j];
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
                  data:valData
                }
              );
            }
            options.legend.data=legendData;
            options.xAxis.data=xaxisData;
            options.series=seriesData;
            _this.domainLineChart.setOption(options,true);
            _this.domainLineLoading=false;

            //brush 操作
            _this.domainLineChart.on('brushSelected', function (params) {
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
        // })
      }
      lineTimerFn();
    },
    drawDomainPie(){
      var _this=this;
      _this.domainPieLoading=true;
      _this.domainPieChart = echarts.init(document.getElementById('domainPieContainer'));
      var options = {
            color:['#c6b38e','#a4d8c2','#f3d999','#d3758f','#dcc392','#b8d2c7','#3cb371','#d5b158','#38b6b6','#82b6e9'],
            title : {
              text: _this.$t('lg.normalaccdomaintop10'),
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
                name:_this.$t('lg.accesssource')+':',
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
        client.search({
          index: "shadow-filebeat-*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.error_code:0"
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.response_code:200"
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": "shadow.access.decrypted:1"
              }
            });
            _this.popQueryObj.bool.must.push({
                  "query_string": {
                      "query":"shadow.access.http_host:"+_this.logDialogTitle.replace(/:/g,'\\:')
                    }
            });
            _this.getOnepieceFromPie();
          })
        });
      }
      getDomainPieData();
    },
    drawFingerPie(){
      var _this=this;
      _this.fingerPieLoading=true;
      _this.fingerPieChart = echarts.init(document.getElementById('fingerPieContainer'));
      
      var option = {
        color:['#73a373','#73b9bc','#7289ab','#91ca8c','#f49f42','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78'],
        title : {
          text: _this.$t('lg.fpaccesstop10'),
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
            name: _this.$t('lg.accesssource'),
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
          }
        };

      function getFingerPieData(){
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.access.error_code:0"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.access.response_code:200"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": "shadow.access.decrypted:1"
              }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                  "query":"shadow.access.token:"+'\"'+_this.logDialogTitle+'\"'
                }
              });
            _this.getOnepieceFromPie();
          })
        });
      }
      getFingerPieData();
    },
    drawAutoToolPie(){
      var _this=this;
      _this.autoToolPieLoading=true;
      this.autoToolPieChart = echarts.init(document.getElementById('autoToolPieContainer'));
    
      var option = {
          title : {
            text: _this.$t('lg.userterminaltype'),
            x:'center',
            textStyle: {
            fontSize: '16',
            fontWeight: 'normal'
            }
          }, 
          color: ['#4ea397'],
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
                color: '#4ea397'
              },
              interval:0,//横轴信息全部显示  
              rotate:-30,//-30度角倾斜显示  
            }
          },
          yAxis: {
            show:false,
          },
          
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
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must": [
                  {
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.error_code:0"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.decrypted:1"
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
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.error_code:0"
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                      "query":"shadow.access.response_code:200"
                    }
            });
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query": "shadow.access.decrypted:1"
              }
            });
            _this.popQueryObj.bool.must.push({
                  "query_string": {
                      "query":"shadow.access.user_agent.name:"+'\"'+_this.logDialogTitle+'\"'
                    }
                });
            _this.getOnepieceFromPie();
          })

        });
      }
      getAutoToolPieData();
    },
   // drawApiRespTimeBar(){
    //   var _this=this;
    //   _this.apiRespTimeBarLoading=true;
    //   _this.apiRespTimeBarChart = echarts.init(document.getElementById('apiRespTimeBarContainer'));

    //   var option = {
    //         title: {
    //           text: 'API响应时间/Top10',
    //           x:'left',
    //           textStyle: {
    //             fontSize: '16',
    //             fontWeight: 'normal'
    //           }
    //         },
    //         color:['#626c91','#97b552'],
    //         tooltip: {
    //           trigger: 'axis',
    //           axisPointer: {
    //             type: 'cross',
    //           }
    //         },
    //         grid: {
    //           left: '5%',
    //           right: '4%',
    //           bottom:'4%',
    //           top:'20%',
    //           containLabel: true
    //         },
    //         legend: {
    //           show:false,
    //           top:'20px',
    //           data: ['响应时间', '次数']
    //         },
    //         toolbox: {
    //           right:'20',
    //           top:'10',
    //         },
    //         xAxis: {
    //           show:false,
    //           type: 'category',
    //           data: [],
    //           axisPointer: {
    //             type: 'shadow'
    //           },
    //           // axisLabel:{
    //           //   interval:2
    //           // }
    //         },
    //         yAxis: [
    //           { 
    //             show:false,
    //             type: 'value',
    //             name: '响应时间/ms',
    //             axisLabel: {
    //               formatter: '{value}'
    //             },
    //           },
    //           { 
    //             show:false,
    //             type: 'value',
    //             name: '次数',
    //             axisLabel: {
    //               formatter: '{value}'
    //             },
    //             minInterval: 1//保持y轴刻度只为整数
    //           }
    //         ],
    //         series: [
    //           {
    //             name: '响应时间',
    //             type: 'bar',
    //             barMaxWidth:20,
    //             data: []
    //           },
    //           {
    //             name: '次数',
    //             type: 'line',
    //             type: 'bar',
    //             barMaxWidth:20,
    //             yAxisIndex: 1,
    //             data: []
    //           }
    //         ]
    //     };
    //   function getApiRespTime(){
    //     client.search({
    //       index: "shadow-filebeat-*",
    //       body: {
    //         "size": 0,
    //         "query": {
    //           "bool": {
    //             "filter": _this.filterObj,
    //             "must": [
    //               {
    //                 "query_string": {
    //                   "query": "shadow.access.response_code:200"
    //                 }
    //               },
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
    //                 "range": {
    //                   "@timestamp": {
    //                     "gte": _this.fromTime,
    //                     "lte": _this.endTime
    //                   }
    //                 }
    //               }
    //             ]
    //           }
    //         },
    //         "aggs": {
    //           "GroupByDomain": {
    //             "terms": {
    //               "field": "shadow.access.domain",
    //               "min_doc_count": 1,
    //               "size": 500
    //             },
    //             "aggs": {
    //               "GroupByRespTime": {
    //                 "terms": {
    //                   "field": "shadow.access.org_url",
    //                   "min_doc_count": 1,
    //                   "size": 10
    //                 },
    //                 "aggs": {
    //                   "avg_time": {
    //                     "avg": {
    //                       "field": "shadow.access.upstream_time"
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }).then((res)=>{
    //       // console.log(res);
    //       var buckets=[];
    //       var domainBuckets=res.aggregations?res.aggregations.GroupByDomain.buckets:[];
    //       if(_this.checkDomain && domainBuckets.length>0){
    //         buckets=res.aggregations.GroupByDomain.buckets[0].GroupByRespTime.buckets;
    //       }else{//如果不选定域名，则该图表无法展示数据（数据维度不同）。用暂无数据替代
    //         buckets=[];
    //       }

    //       var xaxisData=[],respTimeData=[],respCountData=[];
    //       buckets.forEach(ele => {
    //         if(ele.avg_time.value){
    //           xaxisData.push(ele.key);
    //           respTimeData.push((ele.avg_time.value*1000).toFixed(2))//*1000由秒变成毫秒
    //           respCountData.push(ele.doc_count)
    //         }
    //       });

    //       if(!_this.checkDomain || xaxisData.length==0){
    //         option.xAxis.show=false;
    //         option.yAxis[0].show=false;
    //         option.yAxis[1].show=false;
    //         option.tooltip.show=false;
    //         _this.apiRespTimeBarNodata=true;
    //         option.legend.show=false;
    //       }else{
    //         option.xAxis.show=true;
    //         option.yAxis[0].show=true;
    //         option.yAxis[1].show=true;
    //         option.tooltip.show=true;
    //         option.legend.show=true;
    //         _this.apiRespTimeBarNodata=false;
    //       }
          
    //       option.xAxis.data=xaxisData;
    //       option.series[0].data=respTimeData;
    //       option.series[1].data=respCountData;

    //       _this.apiRespTimeBarChart.setOption(option,true);
    //       _this.apiRespTimeBarLoading=false;

    //       _this.apiRespTimeBarChart.off("click");
    //       _this.apiRespTimeBarChart.on("click",(params)=>{
    //         // console.log(params)
    //         _this.logDialogVisible=true;
    //         _this.logDialogTitle=params.name;
    //         _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
    //         _this.popQueryObj.bool.must.push({
    //           "query_string": {
    //             "query":"shadow.access.response_code:200"
    //           }
    //         });
    //         _this.popQueryObj.bool.must.push({
    //           "query_string": {
    //             "query": "shadow.access.error_code:0"
    //           }
    //         });
    //         _this.popQueryObj.bool.must.push({
    //           "query_string": {
    //             "query": "shadow.access.decrypted:1"
    //           }
    //         });
    //         _this.popQueryObj.bool.must.push({
    //           "query_string": {
    //             "query":"shadow.access.org_url:"+_this.logDialogTitle.replace(/\//g,'\\/')
    //           } 
    //         });
    //         _this.getOnepieceFromPie();
    //       });
    //     });
    //   }
    //   getApiRespTime();
   // },

    fullScreen(){//大屏展示
      var chartGridDom = document.getElementsByClassName('apiChart-wrapper');
      chartGridDom[0].requestFullscreen();

      window.addEventListener("fullscreenchange", (e) => {
        if (document.fullscreenElement) {
          this.isShowQueryPanel = false;
          this.isShowGridMenu = false;
        } else {
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
        const myChart2Str = this.urlVisitCtBarChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart3Str = this.regionSunburstChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart4Str = this.orgIpLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart5Str = this.orgIpPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart6Str = this.domainLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart7Str = this.domainPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart8Str = this.fingerPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart9Str = this.autoToolPieChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        // const myChart10Str = this.apiRespTimeBarChart.getDataURL({
        //   type:'jpeg',
        //   pixelRatio: 2,
        //   backgroundColor: '#fff',
        // }).replace("data:image/jpeg;base64,","");

        const myCharArray = [myChart1Str,myChart2Str,myChart3Str,myChart4Str,myChart5Str,myChart6Str,myChart7Str,myChart8Str,myChart9Str]; //myChart10Str
        const url = SERVER_API_URL + 'pe/download/conversion/jpg2pdf';
        axios.post(url,{
          base64StringList:myCharArray
        },{
          responseType:'blob'
        }).then((res)=>{
          //  console.log(res)
          if(res.status==200){
            var filename = this.$t('lg.zhengcfwshujtb')+'.pdf';
            this.$store.commit(types.MAKEPDF,{'pdfdata':res.data,'pdfname':filename});
          }
        }).catch((err)=>{
          console.log(err);
        });
      }else{
        this.$message.error(this.$t('lg.nodata'));
      }
    },
   
    //日志弹框
    getChangeLogData(pageObj){   //改变分页返回数据
      this.fromPage = pageObj.curPage-1;
      this.pageSize= pageObj.pageNum;
      this.requeryObj?this.getOnepieceFromPie(this.requeryObj):this.getOnepieceFromPie();
    },
    getOnepieceFromPie(requeryObj){
      var _this=this;
      // console.log(_this.popQueryObj);

      let clientQueryObj = JSON.parse(JSON.stringify(_this.popQueryObj));//清空（清空方法本身加的查询条件，但同时保存了外部查询条件）
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
      if(requeryObj){//双重过滤（顶部查询面板以及日志弹框里面的requery子组件查询。要把这两者的查询语句融汇在一起）
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
        index:"shadow-filebeat*",
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
        let logResArr=res2.hits.hits;

        // 获取access.log表体数据

        
        _this.chartLogsBodyData = handleAccesslogData(logResArr);
      })
    },
    requeryRowByAccess(obj){ //用户通过requery孙组件筛选access.log显示的行
      this.requeryObj=obj.requeryObj //记录用户再次查询日志的 查询语句
      this.fromPage=0;
      this.getOnepieceFromPie(this.requeryObj);
      if(this.$refs.log_tables) this.$refs.log_tables.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    refilterColByAccess(obj){  //用户通过refilter孙组件筛选access.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      var url = SERVER_API_URL + '/pe/shadow/kv';
      axios.post(url,{apiChartAccess:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{apiChartAccess:obj}).then(res=>{
          })
        }
      })
      this.chartLogsHeadData = obj;
    },
    logDialogClose(){
      this.logDialogVisible=false;
      this.logDialogTitle='';
      this.fromPage=0;
      this.chartLogsTotalNum=0;
      this.popQueryObj={"bool":{"must":[]}};
      this.broadcast('logRequery',"clearData");//清空孙组件里logRequry的查询条件输入框里的内容，要引入Emitter
      this.requeryObj=null;//清空孙组件里logRequry的被带入日志查询语句的查询条件
    },

    // 功能函数
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(d.getFullYear())+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());//+':' + pad(d.getSeconds())
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style>
.apiChart-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.apiChartContent{
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

#urlVisitCtBarContainer,#regionSunburstContainer,#orgIpLineContainer,#domainLineContainer,#orgIpPieContainer,#domainPieContainer,#fingerPieContainer,#autoToolPieContainer,#apiRespTimeBarContainer{
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
.totalList{
  margin-bottom: 20px;
}
.totalList li{
  color: #27727b;
  margin-bottom: 10px;
  line-height: 15px;
}
.someList li{
  color: #7eb00a;
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
  color: #606266; 
  padding-left: 10px;
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
  color: #2b821d;
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
/*.downBtn{
  position: fixed;
  bottom: 20px;
  right: 50px;
  padding: 5px;
}
.downBtn a{
  font-size: 15px;
}*/

/* loading 主要针对‘自定义图表’的loading */
.apiChart-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.apiChart-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
</style>

