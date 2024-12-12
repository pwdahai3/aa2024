<template>
  <div>
    <p class="nodataTxt"><span v-if="chartLoadingShow"><i class="el-icon-loading"></i> {{$t('lg.loading2')}}</span><span v-if="yAxisData.length==0 && !chartLoadingShow">{{$t('lg.nodata')}}</span></p>
    <div id="chartContainer" class="chartContainer"></div>
  </div>
</template>
<script>
import axios from "axios";
import * as types from '@/store/types';
import { SERVER_API_URL } from "@/conf/constvar";
import echarts from 'echarts';
export default {
  props:{
    isShow:{
      type:Boolean
    },
    isHeatmapChart:{
      type:Boolean
    },
    itemParams:{
      type:Object
    }
  },
  data(){
    return{
      chartLoadingShow:false,
      myChart:null,
      legendData:[],
      xAxisData:[],
      yAxisData:[],
    }
  },
  created(){
    if(!this.isHeatmapChart){//！！！如果父组件不是heatmapChart才触发
      this.getHeatmapChartData();
    }
  },
  mounted(){//父组件为heatmapChart，预先画一下图,不然作图区域为空白的
    if(this.isHeatmapChart){
      this.drawChart();
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        this.getHeatmapChartData();
        if(this.myChart){
          this.myChart.resize();//关闭弹框后窗口大小改变又再次打开弹框，视图还要做一次resize
          window.addEventListener("resize", () => {//弹框打开，监视浏览器窗口大小改变，视图resize
            this.myChart.resize();
          });
        }
      }else{
        if(this.myChart){
          this.myChart.clear();//关闭视图时清空视图，解决前一次数据闪现问题
        }
      }
    }
  },
  methods:{
    getHeatmapChartData(){
      const _this=this;
      _this.chartLoadingShow = true;
      const url = SERVER_API_URL+"dp/es/datachart/process"; 
      console.log(_this.itemParams)
      axios.post(url,{
        chartType:'heatmapChart',
        description:"",
        params:_this.itemParams,
        title:'heatmapChart'
      }).then(res=>{
        if(res.data.responseCode==0){
          console.log(res.data.data);
          let buckets = res.data.data.aggregations[2].buckets;
          let xAxisArray=[];
          let yAxisArray=[];
          let resValues=[];
          buckets.forEach(element=>{
            var  xAxisVal= _this.transformMyDate(element.key);
            if(xAxisArray.indexOf(xAxisVal)==-1){
              xAxisArray.push(xAxisVal);
            }
            element[3].buckets.forEach(item=>{
              var yAxisVal = item.key;
              if(item.key_as_string){
                yAxisVal = _this.transformMyDate(yAxisVal);
              }
              if(yAxisArray.indexOf(yAxisVal)==-1){
                yAxisArray.push(yAxisVal);
              }
              resValues.push([_this.findIndex(yAxisVal,yAxisArray),_this.findIndex(xAxisVal,xAxisArray),item.doc_count])
            })
          })
         
          _this.xAxisData=xAxisArray;
          _this.yAxisData=yAxisArray;
          _this.myChartData=resValues;
          _this.drawChart();
          _this.chartLoadingShow = false;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
          _this.chartLoadingShow = false;
        }
      }).catch(err=>{
        console.log(err);
        _this.chartLoadingShow = false;
      })
      _this.$emit('changeFlag',false);//如果heatmapChart是父组件，在父组件里点击生成视图，要把myChartFlag 的值重新变成false，（以便Watch做监视 isShow变动才能触发getHeatmapChartData）
    },
    drawChart(){
      const _this = this;
      const dom = document.getElementById("chartContainer");
      _this.myChart = echarts.init(dom);

      var hours = _this.xAxisData;
      var days = _this.yAxisData;
      var data = _this.myChartData;
      if(data){
        data = data.map(function (item) {
          return [item[1], item[0], item[2] || '-'];
        });
      }

      let option = {
        title: {
          text: 'Heatmap Chart',
          left:'20',
          textStyle:{
            fontSize:'16',
            fontWeight:'normal',
            color:'#606266'
          }
        },
        tooltip: {
          trigger: 'item',
          // formatter: "{b}: {c}",
          formatter:function(params, ticket, callback){
            // console.log(params);
            var str='';
            // params.forEach((ele,index)=>{
            //   console.log(index)
            //   str = ele.axisValue + ele.value[2];
            // })
            str = _this.itemParams.y[0].field+ ': ' +_this.itemParams.y[0].order['_count'] +'</br> '+
            'Count: ' + params.data[2];
            return str
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        animation: false,
        grid: {
          left: '7%',
          right: '5%',
          top:'6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: hours,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: days,
          splitArea: {
              show: true
          }
        },
        // dataZoom: [
        //   {
        //     type: 'slider',
        //     show: true,
        //     xAxisIndex: [0],
        //     start: 0,
        //     end: 100,
        //     bottom:'8%'
        //   },
        //   {
        //     type: 'slider',
        //     show: true,
        //     yAxisIndex: [0],
        //     left: '96%',
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     type: 'inside',
        //     xAxisIndex: [0],
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     type: 'inside',
        //     yAxisIndex: [0],
        //     start: 0,
        //     end: 100
        //   }
        // ],
        visualMap: {
          type:'piecewise',
          maxOpen:'single',
          min: 0,
          max: 500,
          // itemHeight:400,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0%'
        },
        series: [{
          name: 'Punch Card',
          type: 'heatmap',
          data: data,
          label: {
            // normal: {
            //     show: true
            // }
            show:false
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      };
      _this.myChart.clear();
      _this.myChart.setOption(option);
    },
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return d.getFullYear()+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    findIndex(str,arr){
      return  arr.findIndex((item)=>{
        return item==str;
      })
    }
  }
}
</script>
<style scoped>
.chartContainer{
  width: 100%;
  height: 650px;
}
.nodataTxt{
  position: absolute;
  top: 40%;
  left: 48%;
  color:#888;
}
</style>
