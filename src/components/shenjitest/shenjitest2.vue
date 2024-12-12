<template>
  <div class="apiChart-wrapper">
    <iframe src="https://192.168.2.2/shadow-dashboard/d/fe779232-2d64-4537-9e4c-daa258e8104e/shadow?orgId=1&refresh=30s&from=now-30d&to=now" frameborder="0" style="width:100%; height:100%"></iframe>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
import client from "@/components/es/connection";
let Base64 = require('js-base64').Base64;
import toISO8601 from "@/assets/js/iso8601";
export default{
  components:{
    loading
  },
  data(){
    return{
      todayData:[],
      yesterdayData:[],
      getDms:[],
      queryPanelform:{
        checkDomain:'',
        port:'',
        value4: [new Date().getTime()-3600 * 1000 * 24*30,new Date()]
      },
      queryPanelformRules:{
        checkDomain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },
    }
  },
  methods:{
    generateConf(){
      this.$refs.queryPanelform.validate(valid => {
        if (valid) {
          let domainnPort=this.queryPanelform.checkDomain;
          let splitDmPt=domainnPort.split(":");
          let domainName=splitDmPt[0];
          let domainPort=splitDmPt[1];
          let boolObj={
              "must": [{
                    "term": {
                      "shadow.access.non_atag_indicator": 1
                    }
                  },
                  // {
                  //   "term": {
                  //     "shadow.access.server_port": domainPort
                  //   }
                  // },
                  {
                    "term": {
                      "shadow.access.domain": domainName
                    }
                  }]
                };
          if(domainPort){
            boolObj["must"].push({
              "term": {
                "shadow.access.server_port": domainPort
              }
            })
          }
          client.search({
            index:"shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": boolObj
              },
              "aggs": {
                "today": {
                  "filter": {
                    "range": {
                      "@timestamp": {
                        "gte": "now/d",
                        "lte": "now/d"
                      }
                    }
                  },
                  "aggs": {
                    "org_urls_today": {
                      "terms": {
                        "field": "shadow.access.org_url"
                      }
                    }
                  }
                },
                "yesterday": {
                  "filter": {
                    "range": {
                      "@timestamp": {
                        "gte": "now-1d/d",
                        "lte": "now-1d/d"
                      }
                    }
                  },
                  "aggs": {
                    "org_urls_yesterday": {
                      "terms": {
                        "field": "shadow.access.org_url"
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            console.log(res)
            let resAgg=res.aggregations;
            let todayData=resAgg.today
            let yesterdayData=resAgg.yesterday;
            console.log(todayData)
            if(todayData.org_urls_today && todayData.org_urls_today.buckets){
              this.todayData=todayData.org_urls_today.buckets;
            }
            if(yesterdayData.org_urls_yesterday && yesterdayData.org_urls_yesterday.buckets){
              this.yesterdayData=yesterdayData.org_urls_yesterday.buckets;
            }
          })
        } else {
          return false;
        }
      });
    },
    getDomains(){
      const _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
     // _this.queryPanelform.checkDomain="";
      _this.$refs.loading.showLoading();
      client.search({
          index: "shadow-filebeat-*",
          body:  {
            "size": 0,
            "query": {
              "bool": {
                "must": [
                   {
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
              "domains": {
                "terms": {
                  "field": "shadow.access.domain",
                  "size": 50
                },
                "aggs": {
                  "ports": {
                    "terms": {
                      "field": "shadow.access.server_port",
                      "size": 50
                    }
                  }
                }
              }
            }

          }
        }).then((res2)=>{
          this.$refs.loading.hideLoading();
          let data=res2.aggregations.domains;
          var result = [];
          if(data.buckets.length==0){
            _this.queryPanelform.checkDomain="";
          }
          data.buckets.forEach(function(bucket) {
            if (_this.isValidKey(bucket.key) && bucket.ports.buckets.length > 0) {
              bucket.ports.buckets.forEach(function(portBucket) {
                result.push(bucket.key + ':' + portBucket.key);
              });
            }
          });
          _this.getDms=result;
        });  
    },
    isValidKey(key) {
      var ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      var domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return ipPattern.test(key) || domainPattern.test(key);
    }
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
.table-container {
  width: 100%;
  margin:10px auto 20px auto;
  border-collapse: collapse;
}

/* 表头 */
.table-container thead {
  background-color: #f2f2f2;
}

.table-container th,
.table-container td {
  padding: 10px;
  border: 1px solid #ddd; /* 添加边框 */
}

/* 表体 */
.table-container tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* 鼠标悬停效果 */
.table-container tbody tr:hover {
  background-color: #e0e0e0;
}

/* 响应式表格，适应小屏幕 */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  .table-container th,
  .table-container td {
    white-space: nowrap;
  }
}
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
.h2title{
  font-size: 14px;margin-bottom: 0; color: #000;
}
</style>

