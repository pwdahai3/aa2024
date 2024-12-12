<template>
  <div class="attackChart-wrapper">
    <query-panel @getAllQuerychart="getAllchart" @handleTime="handleTime" v-show="isShowQueryPanel"></query-panel><!-- 查询面板 -->
    <div class="attackChartContent">
      <el-row :gutter="10" class="chartRow">
        <el-col :span="14">
          <div class="chart-content" style="position:relative;"
              v-loading="urlAtckCtLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="urlAtckCtBarNodata"></pienodata>
            <div id="urlAtckCtContainer"></div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="chart-content numBox txtOverflow">
            <p class="text-center numBoxTitle">{{$t('lg.totaldatav')}}</p>
            <div class="totalBox">
              <p class='numTitle'>{{$t('lg.totalrquestammount')}}</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>{{$t('lg.totalattack')}}</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
          </div>
        </el-col>
        <!-- <el-col :span="10">
          <div class="chart-content" 
              v-loading="attackTypeLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="attackTypeNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="attackTypeContainer"></div>
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

      <el-row :gutter="10" class="chartRow lastChartRow">
        <el-col :span="14">
          <div class="chart-content" 
              v-loading="regionBarLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="regionBarNodata"></pienodata>
            <div id="regionBarContainer"></div>
          </div>
        </el-col>
         <el-col :span="10">
          <div class="chart-content" 
              v-loading="attackTypeLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <div class="adaptive-circle" v-if="attackTypeNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="attackTypeContainer"></div>
          </div>
        </el-col>
        <!-- <el-col :span="10">
          <div class="chart-content numBox txtOverflow">
            <p class="text-center numBoxTitle">{{$t('lg.totaldatav')}}</p>
            <div class="totalBox">
              <p class='numTitle'>{{$t('lg.totalrquestammount')}}</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>{{$t('lg.totalattack')}}</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
          </div>
        </el-col> -->
      </el-row>
      <el-row :gutter="20" class="chartRow chartRowBusi"  v-if="forFastShow">
        <!-- <el-col :span="18" class="busiChartBox"> -->
          <el-col :span="20" style="padding-left:0px">
            <div  class="chart-content" 
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
              <li class="listTitle">{{$t('lg.gongji')}}：</li>
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
        <!-- </el-col> -->
        <!-- <el-col :span="6">
          <div class="chart-content numBox txtOverflow">
            <p class="text-center numBoxTitle">{{$t('lg.totaldatav')}}</p>
            <div class="totalBox">
              <p class='numTitle'>{{$t('lg.totalrquestammount')}}</p>
              <p class="totalNum">{{totalNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
            <div class="abnormalBox">
              <p class='numTitle'>{{$t('lg.totalattack')}}</p>
              <p class="abnormalNum">{{attackSumNum}}<span class="uTxt">{{$t('lg.count')}}</span></p>
            </div>
          </div>
        </el-col> -->
      </el-row>
    </div>
    <p class="fastloadmore" v-if="!forFastShow" @click="forfastloadmore">{{$t('lg.dianjilookmore')}}</p>
    <!-- 日志弹框 -->
    <el-dialog :title="logDialogTitle" :visible.sync="logDialogVisible" width="80%" :before-close="logDialogClose">
      <log-rebuild :tableKeyArr='tableKeyArrWaf' :dynamicTag='chartLogsHeadData' @refilterColBy='refilterColByWaf' @requeryRowBy='requeryRowByWaf'></log-rebuild>
      <div v-if="chartLogsTotalNum==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="chartLogsTotalNum>0" class="logTableHeight">
        <log-tables ref="log_tables" :tabheadData="chartLogsHeadData" :tabodyData="chartLogsBodyData" :totalNum="chartLogsTotalNum" @getChangeLogData="getChangeLogData" :isLogLoding="false"></log-tables>
      </div>
    </el-dialog>

    <!-- <timing-task-pop  :isShow="isShowTimingTask" :myTaskType="'esSearch'" :myTaskTypeTxt="'基于‘恶意攻击源IP’报警'" :alertmark="'maliciousAttack'"  @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop> -->
    
    <!-- <div :title="$t('lg.returnmap')" class="goBackBtn">
      <router-link tag="a" to="/attack"><i class="fa fa-globe font-blue"></i> {{$t('lg.returnmap')}}</router-link>
    </div> 
    <div :title="$t('lg.exportchart')" class="downBtn">
      <a href="javascript:;" @click="downLoadPdf"><i class="fa fa-cloud-download font-green"></i> {{$t('lg.exportchart')}}</a>
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
             :alt="$t('lg.returnmap')"
             :title="$t('lg.returnmap')"
             @click="goBackMap">
      </li>
    </ul>

  </div>
</template>

<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import echarts from 'echarts';
import * as types from '@/store/types'
import client from "@/components/es/connection";
import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import queryPanel from './queryPanel';
import pienodata from '@/basecomponents/pienodata';
import {logskeys} from '@/assets/js/logskeys';
import logRebuild from "@/components/logs/logRebuild";
import logTables from '@/components/logs/logTables';
import Emitter from 'element-ui/src/mixins/emitter';
import {handleWaflogData} from '@/assets/js/tool';
// import timingTaskPop from '@/components/alarmTask/timingTaskPop';
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
      forFastShow:false,
      fromTime:0,
      endTime:0,
      fromTimeUTC:0,
      endTimeUTC:0,
      timeinterval:'',

      //顶部查询面板
      isFalg:false,//判断是否通过查询面板来查询的阀门
      checkDomain:'',
      checkUrl:'',
      filterObj:{"match_all": {}},

      //max min 
      wholeCtMax:0,
      wholeCtMin:0,
      normalCtMax:0,
      normalCtMin:0,

      businessLineLoading:false,
      urlAtckCtLoading:false,
      attackTypeLoading:false,
      orgIpLineLoading:false,
      orgIpPieLoading:false,
      domainLineLoading:false,
      domainPieLoading:false,
      regionBarLoading:false,

      businessLineChart:null,
      urlAtckCtBarChart:null,
      attackTypeChart:null,
      orgIpLineChart:null,
      orgIpPieChart:null,
      domainLineChart:null,
      domainPieChart:null,
      regionBarChart:null,
      
      businessNodata:false,
      urlAtckCtBarNodata:false,
      attackTypeNodata:false,
      orgIpLineNodata:false,
      orgIpPieNodata:false,
      domainLineNodata:false,
      domainPieNodata:false,
      regionBarNodata:false,
      
      totalNum:0,
      attackSumNum:0,

      //日志弹框参数
      popQueryObj:{"bool":{"must":[{"term":{"log.file.path":"/usr/local/shadow/logs/shadow_waf.log"}}]}},
      logDialogVisible:false,
      logDialogTitle:'',
      tableKeyArrWaf:[...logskeys.waf],//waf.log总共（默认）显示的字段
      chartLogsHeadData:[],//waf.log用户自定义显示的字段
      chartLogsBodyData:[],//传入logTables.vue子组件的表体数据
      chartLogsTotalNum:0,
      fromPage:0,
      pageSize:10,
      requeryObj:null,//日志弹框里面的requery子组件的查询条件
      
      // 报警任务
      // isShowTimingTask:false,

      // isAlertingShow:false,
      // alertMark:'',
      // alertTitle:'',
      // alertData:{},
      // alertLine:false,

      //大屏展示
      isShowQueryPanel:true,//上方查询面板大屏展示时要隐藏
      isShowGridMenu:true,//右下角菜单大屏展示时要隐藏

    }
  },
  created(){
    // this.$store.state.isShowTimerate = true;//采样频率选择
    // this.$store.state.mydatedata.interval = '5m';
    // this.$store.state.timerateValue='采样频率';

    this.getCustomHeadData();
    
    window.addEventListener("resize", () => {
      this.urlAtckCtBarChart.resize();//slow
      this.attackTypeChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      this.businessLineChart.resize();///slow
      this.regionBarChart.resize();//slow
    });
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      this.handleTime();
      this.getAllchart();
    },
    '$store.state.isMenuShow':function(){
      this.urlAtckCtBarChart.resize();
      this.attackTypeChart.resize();
      this.orgIpLineChart.resize();
      this.orgIpPieChart.resize();
      this.domainLineChart.resize();
      this.domainPieChart.resize();
      if(this.forFastShow){
        this.businessLineChart.resize();
      }
      this.regionBarChart.resize();
    }
  },
  mounted(){
    if(!this.$route.query.timeInterval){
      this.handleTime();
      this.getAllchart();
    }

    // this.$refs.domainlinebox.oncontextmenu=()=>{
    //   var _this=this;
    //   this.alertTitle="恶意攻击域名Top5";
    //   this.alertMark="attackDomainTop5"
    //   this.alertData=_this.cloneObj(_this.isDomainAlertData);
    //   this.alertLine=this.isDomainAlertLine;
    //   this.isAlertingShow=true;
    //   return false;
    // }
  },
  methods:{
    //创建即执行
    forfastloadmore(){
      this.forFastShow=true;
      this.$nextTick(()=>{
           this.drawBusinessLine();//slow
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
    getAllchart(querOobj){
      if(querOobj){//通过查询面板查询
        this.isFalg=querOobj.isQuery;
        this.checkDomain=querOobj.domainName;
        this.checkUrl=querOobj.urlArr;

        this.filterObj=this.getFilterObjWAF(this.isFalg);
      }
      if(this.forFastShow){
         this.drawBusinessLine();//slow
      }
      this.getRequestNum(this.isFalg);
      this.attackSum();
      this.drawUrlAtckCtBar();
      this.drawAttackTypePie();
      this.drawOrgIpLine();
      this.drawOrgIpPie();
      this.drawDomainLine();
      this.drawDomainPie();
      this.drawRegionBar();
    },
    getFilterObjWAF(flag,typeAccess){//输入条件后手动查询，不输入查询条件则查询所有数据
      var _this=this;
      var filterObj ={"match_all": {}};

      var queryStr1 = "shadow.waf.host:",queryStr2="shadow.waf.uri:";
      if(typeAccess){
        queryStr1="shadow.access.domain:";
        queryStr2="shadow.access.org_url:"
      }

      if(flag){
        var domainVariable = _this.checkDomain;
        var urlVariable = _this.checkUrl;
        filterObj = {
          "bool": {
              "must":[
                {"query_string": {
                  "query": queryStr1+'\"'+domainVariable+'\"'
                }}
              ]
            }
          }
          if(urlVariable){
            var regxpUrl=/(\/)+/g;
            var regUrlVariable =urlVariable.replace(regxpUrl,'\\$1');
            filterObj.bool.must.push({"query_string": {
              "query": queryStr2+'\"'+regUrlVariable+'\"'
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
      var fromTime2=toSddate(sttime),
          endTime2=toSddate(edtime);
      var fromTime=fromTime2 || toSddate(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toSddate(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;

      var fromTime3=toISO8601(sttime),//access.log -8小时
          endTime3=toISO8601(edtime);
      var fromTimeUTC=fromTime3 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTimeUTC=endTime3 || toISO8601(new Date());
      _this.fromTimeUTC=fromTimeUTC;
      _this.endTimeUTC=endTimeUTC;

      _this.timeinterval=_this.$store.state.mydatedata.interval || '5m';
    },
    getCustomHeadData(){ // 获取恶意访问日志弹框waf.log表头（用户自定义的表头）
      var url = SERVER_API_URL + '/pe/shadow/kv/attackChartWaf';
      axios.get(url).then(res =>{
        if(!res.data.data){
          this.chartLogsHeadData = [...logskeys.waf]
        }else{
          this.chartLogsHeadData = res.data.data.value;
        }
      })
    },
    drawBusinessLinePromise(){
      const _this=this;
      return new Promise((resolve,reject)=>{
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
              }, {
              "exists": {
                "field": "shadow.access.method"
              }
            }, {
                "range": {
                  "@timestamp": {
                    "from": _this.fromTimeUTC,
                    "to": _this.endTimeUTC,
                    "include_lower": true,
                    "include_upper": true
                  }
                }
              }]
            }
          },
          "aggs":{"time_histo":{"date_histogram":{"field":"@timestamp","interval":_this.timeinterval,"extended_bounds":{"min":_this.fromTimeUTC,"max":_this.endTimeUTC}}}}//时间轴
          }
        }).then((res)=>{
          var tarResult2=res.aggregations?res.aggregations.time_histo.buckets:[];
          resolve(tarResult2)
        })
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
          color:['#27727b','#d95850'],
          title: {
            text: _this.$t('lg.attackbusinessprotect'),
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
            data:[_this.$t('lg.totalrequests'),_this.$t('lg.gongji')],
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
    //  function lineTimerFn(){
        _this.drawBusinessLinePromise().then((tarResult2)=>{
         // var tarResult2=res.aggregations?res.aggregations.time_histo.buckets:[];
          var valData2=[],xaxisData2=[];
          var legendData=[],seriesData=[];
          var wholeCtArr=[];
          
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
              large: true
            }
          );

    let mustOptions=[{
        bool:{
          should:[],
          "minimum_should_match": 1
        }
      },
      {
        "term": {
        "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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

  client.search({////////2
          index: "shadow-filebeat-*",
          body:  {
            "size":0,
            "query": {
            "bool": {
              "filter": _this.filterObj,
              "must_not": {
                  "exists": {
                    "field": "error"
                  }
                },
              "must": [{
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
            //  console.log(res);
            var tarResult=res.aggregations?res.aggregations.time_histo.buckets:[];
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
                name:_this.$t('lg.gongji'),
                type:'bar',
                data:valData,
                barMaxWidth: 10,
                large: true
              }
            );

            // console.log(seriesData);
            options.xAxis.data=xaxisData2;
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
            })
        })
          });
        // })
     // }
    //  lineTimerFn();
    },
    getRequestNum(flag){//请求总量 slow
      var _this=this;
      var filterObj=_this.getFilterObjWAF(flag,true);
      let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },{
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
                    "from": _this.fromTimeUTC,
                    "to": _this.endTimeUTC,
                    "include_lower": true,
                    "include_upper": true
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
        index:"shadow-filebeat-*",
        body:{
         // "size": 0,
          "track_total_hits": true,
          "sort": {
            "@timestamp": "desc"
          },
          "query": {
            "bool": {
              "filter": filterObj,
              "must": mustOptions
            }
          }
        }
      }).then((res)=>{
        _this.totalNum=res.hits.total.value;
      })
})
    },
    attackSum(){
      var _this=this;
      let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },{
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
        index:"shadow-filebeat-*",
        body:{
         // "size": 0,
          "track_total_hits": true,
          "query": {
            "bool": {
              "filter": _this.filterObj,
              "must_not": {
                  "exists": {
                    "field": "error"
                  }
                },
              "must": mustOptions
            }
          }
        }
      }).then((res)=>{
        _this.attackSumNum=res.hits.total.value;
      })
})
    },
    drawUrlAtckCtBar(){
      var _this=this;
      _this.urlAtckCtLoading=true;
      _this.urlAtckCtBarChart = echarts.init(document.getElementById('urlAtckCtContainer'));
    
      //设置‘基于错误码统计的恶意攻击次数/Top10’图的显示文字
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
        color:['#c1232b'],
        title: {
          text: _this.$t('lg.numattacktop10'),
          x:'center',
          textStyle: {
            fontSize: '16',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          show:false,
          trigger: 'axis',
          confine:true,
          axisPointer: {
            type: 'shadow'
          },
          extraCssText:'white-space:normal;word-break: break-all',
          formatter:function(params, ticket, callback){
            var str = '';
            params.forEach(item=>{
              str = item.data.name+_this.$t('lg.numattackis')+':'+item.data.value+_this.$t('lg.count')
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
    //  function getUrlAtckCtData(){
  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
                    }
                  },
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime,
                      }
                    }
                  }
                ];
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
          index: "shadow-filebeat-*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter": _this.filterObj,
                "must_not": {
                  "exists": {
                    "field": "error"
                  }
                },
                "must": mustOptions
              }
            },
            "aggs": {
              "url": {
                "terms": {
                  "field": "shadow.waf.uri",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          var resResult=res.aggregations?res.aggregations.url.buckets:[];
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
            _this.urlAtckCtBarNodata=true;
          }else{
            option.xAxis.show=true;
            option.yAxis.show=true;
            option.tooltip.show=true;
            _this.urlAtckCtBarNodata=false;
          }
          _this.urlAtckCtBarChart.setOption(option,true);
          _this.urlAtckCtLoading=false;

           _this.urlAtckCtBarChart.off("click");
          _this.urlAtckCtBarChart.on("click",(params)=>{
            // console.log(params)
            _this.logDialogVisible=true;
            _this.logDialogTitle=params.name;
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj.bool.must.push({
              "query_string": {
                  "query":"shadow.waf.uri:"+_this.logDialogTitle.replace(/\//g,'\\/')
                } 
              });
            _this.getOnepieceFromPie();
        });

        });
    })
    //  }
     // getUrlAtckCtData();
    },
    drawAttackTypePie(){
      var _this=this;
      _this.attackTypeLoading=true;
      _this.attackTypeChart = echarts.init(document.getElementById('attackTypeContainer'));
      var options = {
        color:['#e87c25','#b5c334','#fe8463','#9bca63','#f3a43b','#60c0dd','#d7504b','#f0805a','#26c0c0'],
        title : {
          text: _this.$t('lg.numattacktypetop10'),
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
            name:_this.$t('lg.attacktype'),
            type:'pie',
            radius:['25%','35%'],
            // radius: '40%',
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
  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
     // function getAttackTypePieData(){
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
              "attacktype": {
                "terms": {
                  "field": "shadow.waf.attacktype",
                  "size": 10
                }
              }
            }

          }
        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.attacktype.buckets:[];
          var result=[],
              legendRlt=[];
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
            _this.attackTypeNodata=true;
          }else{
            _this.attackTypeNodata=false;
          }
          _this.attackTypeChart.setOption(options,true);
          _this.attackTypeLoading=false;

           _this.attackTypeChart.off("click");
            _this.attackTypeChart.on("click",(params)=>{
              // console.log(params);
              _this.logDialogVisible=true;
              _this.logDialogTitle=params.name;
              _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
              _this.popQueryObj.bool.must.push({
                    "query_string": {
                        "query":"shadow.waf.attacktype:"+_this.logDialogTitle
                      }
                });
              _this.getOnepieceFromPie();
            });
        });
    })
     // }
     // getAttackTypePieData();
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
            text: _this.$t('lg.numattacksiptop5'),
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
  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
              {
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
          "ip": {
            "terms": {
              "field": "shadow.waf.clientip",
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
        // console.log(res);
        var tarResult=res.aggregations?res.aggregations.ip.buckets:[];
        var legendData=[],
            seriesData=[];
        if(tarResult.length==0){
          options.xAxis.show=false;
          options.yAxis.show=false;
          options.toolbox.show=false;
          _this.orgIpLineNodata=true;
        }else{
          options.xAxis.show=true;
          options.yAxis.show=true;
          options.toolbox.show=true;
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
            xaxisData.push(_this.transformMyDate2(dataJ.key));
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
    })
    },
    drawOrgIpPie(){
      var _this=this;
      _this.orgIpPieLoading=true;
      _this.orgIpPieChart = echarts.init(document.getElementById('orgIpPieContainer'));
      var options = {
            color:['#516b91','#59c4e6','#edafda','#93b7e3','#a5e7f0','#4ea397','#22c3aa','#7bd9a5','#d0648a','#f58db2'],
            title : {
              text: _this.$t('lg.numattacksopcountstop10'),
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
                name:_this.$t('lg.accesssource'),
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
            ]
          };
     // function getOrgIpPieData(){// 绘制图表
  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
              "ip": {
                "terms": {
                  "field": "shadow.waf.clientip",
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
            _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
            _this.popQueryObj.bool.must.push({
              "query_string": {
                "query":"shadow.waf.clientip:"+'\"'+_this.logDialogTitle+'\"'
              }
            });
            _this.getOnepieceFromPie();
          });
        });
    })
     // }
     // getOrgIpPieData();
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
          color:['#c1232b','#27727b','#fcce10','#e87c25','#b5c334'],
          title: {
            text: _this.$t('lg.numattackdomaintop5'),
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
            show:true,
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

  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
              {
                "term": {
                  "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
      index: "shadow-filebeat-*",
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
              "field": "shadow.waf.host",
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
            xaxisData.push(_this.transformMyDate2(dataJ.key));
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

        // if(hasline.attackdomaintopline){
        //     seriesData=seriesData.map((item)=>{
        //       item.markLine= {
        //             symbol:"none",
        //             silent: true,
        //             lineStyle:{
        //                 type:'dashed',
        //                 color:'#893448'
        //             },
        //             data: [{
        //                 yAxis: _this.domainConditionData
        //             }]
        //         }
        //       return item;
        //     })
        //   }

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
  })
    },
    drawDomainPie(){
      var _this=this;
      _this.domainPieLoading=true;
      _this.domainPieChart = echarts.init(document.getElementById('domainPieContainer'));
      var options = {
            color:['#27727b','#fcce10','#e87c25','#b5c334','#60c0dd','#d7504b','#c6e579','#f0805a','#26c0c0','#c1232b'],
            title : {
              text: _this.$t('lg.attackdomaintop10'),
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
                name:_this.$t('lg.accesssource'),
                type:'pie',
                radius:['25%','35%'],
                // radius: '40%',
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
    //  function getDomainPieData(flag){
  let mustOptions=[
    {
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
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
              "host": {
                "terms": {
                  "field": "shadow.waf.host",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          // console.log(res);
          var tarResult=res.aggregations?res.aggregations.host.buckets:[];
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
                      "query":"shadow.waf.host:"+_this.logDialogTitle.replace(/:/g,'\\:')
                    }
              });
            _this.getOnepieceFromPie();
          });
        });
  })
    //  }
    //  getDomainPieData();
    },
    drawRegionBar(){
      var _this=this;
      _this.regionBarLoading=true;
      _this.regionBarChart = echarts.init(document.getElementById('regionBarContainer'));

      //设置‘基于错误码统计的恶意攻击次数/Top10’图的显示文字
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
            color:['#d95850'],
            title: {
              text: this.$t('lg.areainfo')+'/Top10',
              x:'center',
              textStyle: {
                fontSize: '16',
                fontWeight: 'normal'
              }
            },
            tooltip: {
              show:false,
              trigger: 'axis',
              confine:true,
              axisPointer: {
                type: 'shadow'
              },
              extraCssText:'white-space:normal;word-break: break-all',
              formatter:function(params, ticket, callback){
                var str = '';
                params.forEach(item=>{
                  str = item.data.name+this.$t('lg.faqieyigongjicish')+':'+item.data.value+_this.$t('lg.count')
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
              data: [],//['top5','top4','top3','top2','top1']
              inverse: true,//是否是反向坐标轴 （这里反向后数据降序排列）
            },
            series: []
          };
         // function getRegionData(){
  let mustOptions=[{
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                      {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
                      }
                    }, {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
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
                  "GroupByGeo": {
                    "terms": {
                      "script": {
                        "inline": 'params._source.shadow.waf.geoip',
                        "lang": "painless"
                      },
                      "size": 10
                    },
                    "aggs": {
                      "total_count": {
                        "scripted_metric": {
                          "init_script": "params._agg.count = []",
                          "map_script": "Map cnt = new HashMap();cnt.put('loc',params['_source']['shadow']['access']['geoip']);params._agg.count.add(cnt)",
                          "combine_script": "return params._agg.count.get(0)",
                          "reduce_script": "return params._aggs.get(0)"
                        }
                      }
                    }
                  }
                }
              }
            }).then((res)=>{
              // console.log(res);
              var resResult=res.aggregations?res.aggregations.GroupByGeo.buckets:[];

              let topArrays=[]              //存 ['top5','top4','top3','top2','top1']
              let topArray=resResult.length;               //取前面10位  top10
              for(var i=0;i<topArray;i++){   //遍历出top 数组
                topArrays.push(`top${i+1}`);
              } 
              option.yAxis.data=topArrays;

              var sdata=[];
              for(var i=0; i<topArrays.length;i++){
                if(resResult[i]){
                  const cityName = resResult[i].total_count.value.loc.city_name?resResult[i].total_count.value.loc.city_name:'['+resResult[i].total_count.value.loc.location.lon+','+resResult[i].total_count.value.loc.location.lat+']';
                  sdata.push({
                    value:resResult[i].doc_count,
                    name:cityName,
                  });
                }
              }
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
                _this.regionBarNodata=true;
              }else{
                option.xAxis.show=true;
                option.yAxis.show=true;
                option.tooltip.show=true;
                _this.regionBarNodata=false;
              }
              _this.regionBarChart.setOption(option,true);
              _this.regionBarLoading=false;

              _this.regionBarChart.off("click");
              _this.regionBarChart.on("click",(params)=>{
                // console.log(params)
                _this.logDialogVisible=true;
                _this.logDialogTitle=params.name;
                _this.popQueryObj.bool.filter=_this.filterObj;//把查询面板的域名等过滤条件带入日志查询
                
                // console.log(_this.logDialogTitle)
                if(/^\[.+\]$/.test(params.name)){//没有city_name 就用经纬度查
                  var locationArr = JSON.parse(params.name)
                  var lonNum = locationArr[0],latNum = locationArr[1];
                  var mapScriptStr = "shadow.waf.geoip.location";

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
                      "query":"shadow.waf.geoip.city_name:"+_this.logDialogTitle.replace(/:/g,'\\:')
                    }
                  });
                }

                _this.getOnepieceFromPie();
              });
            });
  })
       //   }
    //  getRegionData();
    },

    fullScreen(){//大屏展示
      var chartGridDom = document.getElementsByClassName('attackChart-wrapper');
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
      var _this=this;
      if(this.attackSumNum!=0){
        let myChart1Str;
        if(this.forFastShow){
         myChart1Str = this.businessLineChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");         
        }
        const myChart2Str = this.urlAtckCtBarChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        const myChart3Str = this.attackTypeChart.getDataURL({
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
        const myChart8Str = this.regionBarChart.getDataURL({
          type:'jpeg',
          pixelRatio: 2,
          backgroundColor: '#fff',
        }).replace("data:image/jpeg;base64,","");
        
        let myCharArray;
        if(myChart1Str){
          myCharArray = [myChart1Str,myChart2Str,myChart3Str,myChart4Str,myChart5Str,myChart6Str,myChart7Str,myChart8Str]; 
        }else{
          myCharArray = [myChart2Str,myChart3Str,myChart4Str,myChart5Str,myChart6Str,myChart7Str,myChart8Str]; 
        }
        const url = SERVER_API_URL + 'pe/download/conversion/jpg2pdf';
        axios.post(url,{
          base64StringList:myCharArray
        },{
          responseType:'blob'
        }).then((res)=>{
          //  console.log(res)
          if(res.status==200){
            var filename = _this.$t('lg.attackdatachart')+'.pdf';
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
      this.$router.push('/attack')
    },

    //日志弹框
    getChangeLogData(pageObj){   //改变分页返回数据
      this.fromPage = pageObj.curPage-1;
      this.pageSize= pageObj.pageNum;
      this.requeryObj?this.getOnepieceFromPie(this.requeryObj):this.getOnepieceFromPie();
    },
    getOnepieceFromPie(requeryObj){
      var _this=this;

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
        let logResArr = res2.hits.hits;

        // 获取waf.log表体数据
        _this.chartLogsBodyData = handleWaflogData(logResArr);
      })
    },
    requeryRowByWaf(obj){ //用户通过requery孙组件筛选waf.log显示的行
      this.requeryObj=obj.requeryObj;
      this.fromPage=0;
      this.getOnepieceFromPie(this.requeryObj);
      if(this.$refs.log_tables) this.$refs.log_tables.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    refilterColByWaf(obj){ //用户通过refilter孙组件筛选waf.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      var url = SERVER_API_URL + '/pe/shadow/kv';
      axios.post(url,{attackChartWaf:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{attackChartWaf:obj}).then(res=>{
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
      this.popQueryObj={"bool":{"must":[{"term":{"log.file.path":"/usr/local/shadow/logs/shadow_waf.log"}}]}};
      this.broadcast('logRequery',"clearData");//清空孙组件里logRequry的查询条件输入框里的内容，要引入Emitter
      this.requeryObj=null;//清空孙组件里logRequry的被带入日志查询语句的查询条件
    },

    //数据加工函数
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(d.getFullYear())+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    transformMyDate2(d){
      d=new Date(d-8*60*60*1000);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(d.getFullYear())+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());
    },

  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style>
.fastloadmore{text-align:center; background-color:#f5f5f5; padding:10px; cursor:pointer}
.attackChart-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.attackChartContent{
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

#urlAtckCtContainer,#attackTypeContainer,#orgIpLineContainer,#domainLineContainer,#orgIpPieContainer,#domainPieContainer,#regionBarContainer{
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
  color: #d95850;
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
  color: #333;
  font-size: 16px;
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
  color: #c1232b;
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
  top:12%;
  left:40%;
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
.attackChart-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.attackChart-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
</style>
