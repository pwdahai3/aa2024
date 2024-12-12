<template>
  <div>
    <el-dialog width="90%" :title="$t('lg.duibi')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="resetForm">
        <div class="block">
            <el-date-picker
            v-model="value4"
            type="datetimerange"
            :range-separator="$t('lg.to')"
            :start-placeholder="$t('lg.startdate')"
            :end-placeholder="$t('lg.enddate')">
            </el-date-picker>
            &nbsp;this.$t('lg.duibi')&nbsp;
            <el-date-picker
            v-model="value5"
            type="datetimerange"
            :range-separator="$t('lg.to')"
            :start-placeholder="$t('lg.startdate')"
            :end-placeholder="$t('lg.enddate')">
            </el-date-picker>&nbsp;
            <el-button type="primary" @click="getAll">{{$t('lg.save')}}</el-button>
        </div>
        <div style="margin-top:20px">
          <el-row :gutter="10" class="chartRow">
        <el-col :span="12">
          <div class="chart-content"
                v-loading="networkLoading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="line5Nodata"></pienodata>
            <div id="networkLine" class="chartBox"></div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="chart-content"
                v-loading="networkLoading2"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="line6Nodata"></pienodata>
            <div id="networkLine2" class="chartBox"></div>
          </div>
        </el-col>
      </el-row>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import echarts from 'echarts';
import client from "@/components/es/connection";
export default{
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
        value4: [new Date(new Date().getTime()-24*60*60*1000), new Date()],
        value5: [new Date(new Date().getTime()-48*60*60*1000),new Date(new Date().getTime()-24*60*60*1000)],
        myChart5:null,
         myChart6:null,
        flowTimeInterval:'600s',
        line5Nodata:false,
        line6Nodata:false,
        networkLoading:false,
        networkLoading2:false
        
    }
  },
  methods:{
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    getAll(){
      this.line5();
      this.line6();
    },
    line5(){//流量
      var _this=this;
      _this.networkLoading=true;
      _this.myChart5 = echarts.init(document.getElementById('networkLine'));
      var options = {
            color:['#008acd','#b6a2de','#2ec7c9','#ffb980','#d87a80','#8d98b3','#97b552','#95706d','#dc69aa','#c05050'],
            title: {
              text: _this.$t('lg.network'),
              x:'center'
            },
            tooltip: {
              trigger: 'axis'
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
              name:'M/秒',
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
                        "from": _this.value4[0],
                        "to": _this.value4[1],
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
                  }
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
          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.myChart5.setOption(options,true);
          _this.networkLoading=false;
        });
      }
      lineTimerFn();
    },
    line6(){//流量
      var _this=this;
      _this.networkLoading2=true;
      _this.myChart6 = echarts.init(document.getElementById('networkLine2'));
      var options = {
            color:['#008acd','#b6a2de','#2ec7c9','#ffb980','#d87a80','#8d98b3','#97b552','#95706d','#dc69aa','#c05050'],
            title: {
              text: _this.$t('lg.network'),
              x:'center'
            },
            tooltip: {
              trigger: 'axis'
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
              name:'M/秒',
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
                        "from": _this.value5[0],
                        "to": _this.value5[1],
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
                  }
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
            _this.line6Nodata=true;//暂无数据
          }else{
            options.xAxis.show=true;
            options.yAxis.show=true;
            _this.line6Nodata=false;//有数据
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
          options.legend.data=legendData;
          options.xAxis.data=xaxisData;
          options.series=seriesData;
          _this.myChart6.setOption(options,true);
          _this.networkLoading2=false;
        });
      }
      lineTimerFn();
    },
    resetForm(){
      this.myChart5=null;
      this.myChart6=null;
      this.$emit("isDone")
    }
  },
  components:{

  }
}
</script>
<style scoped>
.networklinebox{
  display: flex;
}
.chartBox{
  flex: 1;
}
</style>
