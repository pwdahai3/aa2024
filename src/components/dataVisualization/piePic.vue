<template>
  <div>
    <p class="nodataTxt"><span v-if="chartLoadingShow"><i class="el-icon-loading"></i> {{$t('lg.loading2')}}</span><span v-if="arrays.length==0 && !chartLoadingShow">{{$t('lg.nodata')}}</span></p>
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
    isPieChart:{
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
      arrays:[]
    }
  },
  created(){
    if(!this.isPieChart){//！！！如果父组件不是pieChart才触发
      this.getPieChartData();
    }
  },
  mounted(){//父组件为pieChart，预先画一下图,不然作图区域为空白的
    if(this.isPieChart){
      this.drawChart();
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        this.getPieChartData();
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
    getPieChartData(){
      const _this=this;
      _this.arrays=[];//!!!清空,不然数据会叠加
      _this.chartLoadingShow = true;
      const url = SERVER_API_URL+"dp/es/datachart/process"; 
      console.log(_this.itemParams)
      axios.post(url,{
        chartType:'pieChart',
        description:"",
        params:_this.itemParams,
        title:'pieChart'
      }).then(res=>{
        console.log(res);
        if(res.data.responseCode==0){
          let buckets = res.data.data.aggregations[2].buckets;
          listArray(buckets,this.arrays)
          _this.drawChart();
          _this.chartLoadingShow=false;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
          _this.chartLoadingShow=false;
        }
      }).catch(err=>{
        console.log(err);
        _this.chartLoadingShow=false;
      });

      function objModule(obj){
        this.children=[];
        this.value=obj.doc_count;
        this.name=obj.key;
        this.key_as_string=obj.key_as_string||'';
        this.AB=obj.key_as_string?'A':'b';
      }
      function listArray(arr,toArr){
        arr.forEach(element => {
          var listObj=new objModule(element);
          toArr.push(listObj);
          Object.keys(element).forEach(item=>{
            if(!isNaN(item)){
              if(element[item].buckets.length){
                listArray(element[item].buckets,listObj.children)
              }
            }
          })
        })
      }
      _this.$emit('changeFlag',false);//如果pieChart是父组件，在父组件里点击生成视图，要把myChartFlag 的值重新变成false，（以便Watch做监视 isShow变动才能触发getPieChartData）
    },
    drawChart(){
      const _this = this;
      const dom = document.getElementById("chartContainer");
      _this.myChart = echarts.init(dom);
      // console.log(_this.arrays)
      let option = {
        title: {
          text: 'Pie Chart',
          left:'20',
          textStyle:{
            fontSize:'16',
            fontWeight:'normal',
            color:'#606266'
          }
        },
        tooltip: {
          trigger: 'item',
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          formatter:function(params, ticket, callback){
            var str = '';
            params.treePathInfo.forEach((ele,index)=>{
              var name = ele.name;
              if(index!=0){
                if(String(name).length==13){
                  name=_this.transformMyDate(name);
                }
                str+='<tr style="background:transparent;"><td style="border:none;padding:0 10px;">'+_this.itemParams.aggs[index-1].field+'</td><td style="border:none;padding:0 10px;">'+ name +'</td><td style="border:none;padding:0 10px;">'+ ele.value +'('+(ele.value/params.treePathInfo[index-1].value*100).toFixed(2) +'%)</td></tr>'
              }
            })
            var myHtml = '<table style="border:none;color:#fff;">'+
                          '<thead style="color:#fff">'+
                          '<th style="border:none;padding:0 10px;">field</th>'+ 
                          '<th style="border:none;padding:0 10px;">value</th>'+ 
                          '<th style="border:none;padding:0 10px;">Count</th>'+ 
                          '</thead>'+
                          '<tbody>'+
                            str+
                          '</tbody>'+
                         '</table>'
            return myHtml;
          }
        },
        series: {
          type: 'sunburst',
          data: _this.arrays,
          radius: [0, '80%'],
          label: {
            show: false
          }
        }
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
