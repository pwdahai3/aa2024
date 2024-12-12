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
    isVerticalBarChart:{
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
    if(!this.isVerticalBarChart){//！！！如果父组件不是verticalBarChart才触发
      this.getVerticalBarChartData();
    }
  },
  mounted(){//父组件为verticalBarChart，预先画一下图,不然作图区域为空白的
    if(this.isVerticalBarChart){
      this.drawChart();
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        this.getVerticalBarChartData();
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
    },
  },
  methods:{
    getVerticalBarChartData(){
      const _this=this;
      _this.chartLoadingShow = true;
      const url = SERVER_API_URL+"dp/es/datachart/process"; 
      console.log(_this.itemParams)
      axios.post(url,{
        chartType:'verticalBarChart',
        description:"",
        params:_this.itemParams,
        title:'verticalBarChart'
      }).then(res=>{
        console.log(res);
        if(res.data.responseCode==0){
          let buckets = res.data.data.aggregations[2].buckets;
          let xAxisArray=[];
          let yAxisArray=[];
          let legendValues=[];//legend

          let yAxisObj={};//用来存放代表y轴折线的数组，有多个数组代表多条折线
          let countArr=[];//用来存放count的数据，当Y-Axis内选有count时，要显示count的数据

          const verticalBarChartYAxisArr = _this.itemParams.y;//取出来做遍历，以便获取legend
          var countFlag=false; //做标记 如果Y-Axis内选有count时， 有count时在最后得到的legend里push'count'、yAxisArray里push包含count数据的对象
          verticalBarChartYAxisArr.forEach((ele,i)=>{
            if(ele.agg=='count'){
              countFlag=true;
            }else{
              legendValues.push(ele.field+'('+ ele.agg +')');
            }
          })
          
          buckets.forEach(element=>{
            countArr.push(element.doc_count);

            //x轴
            var xAxisVal= _this.transformMyDate(element.key);
            if(xAxisArray.indexOf(xAxisVal)==-1){
              xAxisArray.push(xAxisVal);
            }

            //把每一条折线放入对象yAxisObj
            Object.keys(element).forEach(item=>{
              if(!isNaN(item)){//如果是数字键，（同一个数字键对应的元素组成的数组代表一条坐标轴上的线,Y轴的值会由图表根据线对应的值自动感应出一个值的范围，有多条折线就代表有多个对应的Y轴值范围）
                if(yAxisObj[item]){
                  yAxisObj[item].push(element[item].value);
                }else{
                  yAxisObj[item]=[element[item].value];
                }
              }
            })
          })
          
          legendValues.forEach((val,index)=>{
            yAxisArray.push({
              name:val,
              type:'bar',
              data:yAxisObj[index+3]//对应上yAxisObj的键
            })
          })
          console.log(yAxisObj)
          console.log(legendValues)

          if(countFlag){//如果Y-Axis内选有count时，多家一条count的折线，对应的legend也要多加一个元素‘count’
            yAxisArray.push({  
              name:'count',
              type:'bar',
              data:countArr
            });
            legendValues.push('count');
          }

          _this.xAxisData=xAxisArray;
          _this.yAxisData=yAxisArray;
          _this.legendData=legendValues;
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
      _this.$emit('changeFlag',false);//如果verticalBarChart是父组件，在父组件里点击生成视图，要把myChartFlag 的值重新变成false，（以便Watch做监视 isShow变动才能触发getVerticalBarChartData）
    },
    drawChart(){
      const _this = this;
      const dom = document.getElementById("chartContainer");
      _this.myChart = echarts.init(dom);

      let  option = {
        title: {
          text: 'Vertical Bar Chart',
          left:'20',
          textStyle:{
            fontSize:'16',
            fontWeight:'normal',
            color:'#606266'
          }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
        },
        legend: {
          data:_this.legendData//
        },
        grid: {
          left: '3%',
          right: '5%',
          top:'8%',
          bottom:'4%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: _this.xAxisData//
        },
        yAxis: {
            type: 'value'
        },
        series: _this.yAxisData//
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
