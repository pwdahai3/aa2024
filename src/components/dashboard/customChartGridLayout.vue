<!-- 自定义可缩放图表 包含恶意访问图表（防护模式、监控模式）、恶意攻击图表-->
<template>
  <div class="cgl-wrapper"
       @click='hideChartMenu'
       id="chartGridLayout">
    <grid-layout class="gridContainer"
                 :layout.sync="layout"
                 :col-num="12"
                 :row-height="30"
                 :is-draggable="true"
                 :is-resizable="true"
                 :is-mirrored="false"
                 :vertical-compact="true"
                 :margin="[10, 10]"
                 :use-css-transforms="true"
                 v-if="layout.length>0">

      <grid-item v-for="(item,index) in chartDataList"
                 :id='"gridBox"+item.key'
                 :x="item.value.size.x"
                 :y="item.value.size.y"
                 :w="item.value.size.w"
                 :h="item.value.size.h"
                 :i="item.value.size.i"
                 :key="item.value.size.i"
                 drag-ignore-from='.disableDiv'
                 @resized="resizedEvent"
                 @moved="movedEvent"
                 v-loading="item.showLoading"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0)"
                 class="gridChart">
        <div :class="item.isShowChartMenu?'chartMenuNav chartMenuNavShow':'chartMenuNav'"
             @dblclick="showChartMenu(item,index)"></div>
        <i class="el-icon-close addPanelCloseBtn disableDiv"
           v-show="item.value.size.i=='createdBox'"
           @click.stop="deleteAddPanel(index)"></i>
        <ul class="chartMenuList userSelectNo"
            v-show="item.isShowChartMenu">
          <li @click.stop='editCahrt(item.key,item.value.data.queryform.logId,index)' v-show="item.value.type!='special'">
            <i class="el-icon-edit"></i> {{$t('lg.edit')}}</li>
          <li @click="downloadCSV(item)">
            <i class="el-icon-download"></i> {{$t('lg.exportcsv')}}</li>
          <li @click="deleteCahrt(item.key,index)">
            <i class="el-icon-delete"></i> {{$t('lg.delete')}}</li>
        </ul>

        <!-- 暂无数据 -->
        <div class="chartNodataBox"
             v-show="item.key && item.value.data.origTotalNum==0">
          <div class="chartNodataInner">
            <img src="static/icon/lineNoData.png"
                 :alt="$t('lg.nodata')">
            <p>{{$t('lg.nodata')}}</p>
          </div>
        </div>

        <!-- 图表 -->
        <div v-if="item.key && item.value.vzActiveName!='table'"
             :id='"charts"+item.key'
             class="disableDiv"></div>

        <!-- 表格 -->
        <log-tables v-if="item.key && item.value.vzActiveName=='table'"
                    :ischart='true'
                    :tableTitle='item.value.data.generalform.titleText'
                    :aggsField='item.value.data.queryform.aggsId'
                    class="disableDiv"
                    :id='"charts"+item.key'
                    :tabheadData="item.value.data.dynamicTags"
                    :tabodyData="item.value.option.tabodyData"
                    :totalNum="item.value.option.totalNum"
                    @getChangeLogData='(obj)=>changeTableData(obj,index)'></log-tables>

        <div v-if="!item.key"
             class="addPanelBox disableDiv">
          <!-- 新增图表或表格入口 -->
          <router-link tag="a"
                       :to="{path:'/customChartPanel',query:{size:JSON.stringify(layout[layout.length-1])}}">
            <i class="el-icon-picture addImg"></i>
            <p class="addTxt">Create new charts</p>
          </router-link>
        </div>

      </grid-item>
    </grid-layout>

    <!-- 右侧操作列表 -->
    <ul class="operationBtnUl"
        v-show="isShowGridMenu">
      <li>
        <img src="static/icon/addChart.png"
             :alt="$t('lg.addchart')"
             :title="$t('lg.addchart')"
             @click="showAddPanel">
      </li>
      <li>
        <img src="static/icon/fullScreen.png"
             :alt="$t('lg.dapinzhans')"
             :title="$t('lg.dapinzhans')"
             @click="fullScreen">
      </li>
      <li>
        <img src="static/icon/saveChart.png"
             :alt="$t('lg.save')"
             :title="$t('lg.save')"
             @click="savePosition(true)">
      </li>
      <li>
        <img src="static/icon/downpdfChart.png"
             :alt="$t('lg.daochupdf')"
             :title="$t('lg.daochupdf')"
             @click="downLoadPdf">
      </li>
    </ul>

    <!-- 日志弹框 -->
    <el-dialog :title="logDialogTitle"
               :visible.sync="logDialogVisible"
               width="80%"
               :before-close="logDialogClose">
      <log-rebuild :tableKeyArr='tableKeyArrLog'
                   :dynamicTag='chartLogsHeadData'
                   @refilterColBy='refilterColByRefilter'
                   @requeryRowBy='requeryRowByRequery'></log-rebuild>
      <div v-if="chartLogsTotalNum==0"
           class="nodata-box">{{$t('lg.nodata')}}</div>
      <div v-if="chartLogsTotalNum>0" class="logTableHeight">
        <log-tables ref="log_tables"
                    :tabheadData="chartLogsHeadData"
                    :tabodyData="chartLogsBodyData"
                    :totalNum="chartLogsTotalNum"
                    @getChangeLogData="getChangeLogData"
                    :isLogLoding="false"
                    :showSDURLMenu='showSDURLMenu'></log-tables>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts';
import axios from 'axios';
import { SERVER_API_URL } from '@/conf/constvar';
import client from "@/components/es/connection";
import VueGridLayout from 'vue-grid-layout';
import toSddate from '@/assets/js/tosddate';
import * as types from '@/store/types';
import toISO8601 from '@/assets/js/iso8601';
import { logskeys } from '@/assets/js/logskeys';
// import {defaultChart} from '@/assets/js/chart';
import logRebuild from "@/components/logs/logRebuild";
import logTables from "@/components/logs/logTables";

import Emitter from 'element-ui/src/mixins/emitter';

import prmoSearchStr from '@/assets/js/prmoSearch.js'//防护模式、监控模式 不同的查询条件

import {handleAccesslogData, handleWaflogData, getTarResultArrLine, getTarResultArr} from '@/assets/js/tool';

export default{
  mixins: [Emitter],
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    logRebuild,
    logTables
  },
  data(){
    return {
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
      logDialogVisible: false,
      logDialogTitle: '',
      tableKeyArrLog: [],//access.log or waf.log总共（默认）显示的字段
      chartLogsHeadData: [],//用户自定义显示的字段
      chartLogsBodyData: [],//传入logTables.vue子组件的表体数据
      chartLogsTotalNum: 0,
      fromPage: 0,
      pageSize: 10,
      requeryObj: null,//日志弹框里面的requery子组件的查询条件

    }
  },
  created(){
    this.$store.state.contentLoading = true;//避免页面还没渲染完，用户就点击新增图表按钮（会打乱图表布局）
    window.addEventListener("resize", this.throttle(this.resizeMove));
  },
  mounted(){
    this.getChartGridData();
  },
  watch:{
    '$store.state.mydatedata.timestampnow': function (newData) {//右上角时间改变要重新请求图表数据
      this.handChartsRefesh();
    },
    '$store.state.isMenuShow':function(){
      this.throttle(this.resizeMove)();
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
        // console.log(res)
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
                  const gridBoxDom = document.getElementById('gridBox' + item.key);//栅格盒子
                  var contentHeight = gridBoxDom.offsetHeight;//拿到栅格盒子的宽高
                  var contentWidth = gridBoxDom.offsetWidth;
                  const myChartDom = document.getElementById('charts' + item.key);
                  myChartDom.style.height = contentHeight + 'px';//把栅格盒子的宽高赋值到图表的宽高
                  myChartDom.style.width = contentWidth + 'px';

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
          _this.logDialogVisible = true;
          _this.logDialogTitle = params.name;

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
                    "query": aggsField + ":" + '\"' + _this.logDialogTitle.replace(/:/g, '\\:') + '\"'
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
                  "query": aggsField + ":" + '\"' + _this.logDialogTitle.replace(/:/g, '\\:') + '\"'
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
    logDialogClose(){//关闭日志弹框
      this.logDialogVisible = false;
      this.logDialogTitle = '';
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
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>

<style>
.cgl-wrapper {
  padding: 5px;
  overflow-y: auto;
  overflow-x: hidden;
}
.gridContainer {

}
.gridChart {
  /* border: 1px solid #000; */
  position: relative;
  /* box-shadow: 2px 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
  background: #f7f7f7;
  overflow: hidden;
}
.chartMenuNav {
  width: 100%;
  height: 22px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  cursor: move;
}
.chartMenuNav:hover {
  background: #000;
  opacity: 0.2;
}
.chartMenuNavShow {
  background: #000;
  opacity: 0.2;
}
/* .chartMenuNavGraph{
  width: 96%;
} */

.addPanelCloseBtn {
  color: #4d555d;
  font-size: 16px;
  position: absolute;
  top: 5px;
  right: 10px;
  cursor: pointer;
  z-index: 1001;
}

.chartMenuList {
  position: absolute;
  top: 25px;
  left: 45%;
  z-index: 1002;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 95px;
}
.chartMenuList li {
  line-height: 16px;
  padding: 0 15px;
  margin: 6px 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;
  display: block;
}
.chartMenuList li:hover {
  background-color: #ecf5ff;
  color: #66b1ff;
}

.chartNodataBox {
  width: 100%;
  height: 100%;
}
.chartNodataInner {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -32px;
}

.addPanelBox {
  width: 100%;
  height: 100%;
  position: relative;
}
.addPanelBox a {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -54px;
  margin-left: -90px;
  padding: 20px;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 10px;
}
.addPanelBox .addImg {
  font-size: 48px;
}
.addPanelBox .addTxt {
  font-size: 16px;
}

/* loading 主要针对‘自定义图表’的loading */
.cgl-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.cgl-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
</style>
