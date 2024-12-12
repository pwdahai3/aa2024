<template>
  <div v-if="data.length>0">
    <div>
      <span>{{$t('lg.frequency')}}：</span>
      <el-select v-model="qinterval" :placeholder="$t('lg.frequency')" @change="intervalChange">
        <el-option
          v-for="(item,index) in intervals"
          :key="index"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="search-result-wrapper">
      <div class="search-result" style="margin-right:20px;">
        <table>
          <thead>
            <tr>
              <th width="80%">key</th>
              <th>doc_count</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data">
              <td>{{item.key}}</td>
              <td>{{item.doc_count}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="search-result">
        <div id="piechart" style="height:260px;width: 100%"></div>
      </div>
    </div>
    <div style="margin-top:20px;">
      <div id="linechart" style="height:320px;width: 100%"></div>
    </div>
  </div>
</template>
<script>

let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip') // 提示框
require('echarts/lib/component/title')
require('echarts/lib/component/legend') // 图例
export default {
  props:{
    data:{
      type:Array
    },
    piedata:{
      type:Object
    },
    linechartdata:{
      type:Object
    }
  },
  watch: {
    'data':function(){
      if(this.data.length>0){
        let _this=this;
        _this.piechart(_this.piedata.legend,_this.piedata.data);
        _this.linechart(_this.linechartdata.legend,_this.linechartdata.xaxisdata,_this.linechartdata.seriesdata);
      }
    },
    '$store.state.isMenuShow':function(){
      this.pieChart.resize();
      this.lineChart.resize();
    }
  },
  mounted() {
    let _this=this;
    if(_this.data.length>0){
      _this.piechart(_this.piedata.legend,_this.piedata.data);
      _this.linechart(_this.linechartdata.legend,_this.linechartdata.xaxisdata,_this.linechartdata.seriesdata);
    }
    window.addEventListener("resize", () => {
      _this.pieChart.resize();
      _this.lineChart.resize();
    });
  },
  data(){
    return{
      intervals:[
        {
          value:"5m",
          name:this.$t('lg.minus5')
        },{
          value:"30m",
          name:this.$t('lg.minus30')
        },{
          value:"1h",
          name:this.$t('lg.hour1')
        },{
          value:"5h",
          name:this.$t('lg.hour5')
        },{
          value:"1d",
          name:this.$t('lg.day1')
        },{
          value:"7d",
          name:this.$t('lg.day7')
        },{
          value:"1M",
          name:this.$t('lg.month1')
        }
      ],
      qinterval:'5m',
      pieChart:null,
      lineChart:null
    }
  },
  methods: {
    intervalChange(){//改变采样频率，则再次触发查询
      this.$emit("getChangeLogInterval",this.qinterval)
    },
    piechart(legend,data){
      this.pieChart=echarts.init(document.getElementById('piechart'));
      let options = {
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'left',
              //data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
              data:legend
            },
            series: [
              {
                name:this.$t('lg.zhanbi'),
                type:'pie',
                radius: ['45%', '60%'],
                center: ['70%', '35%'],
                avoidLabelOverlap: false,
                label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: false,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              // data:[
              //     {value:335, name:'直接访问'},
              // ]
              data:data
            }
          ]
        };
      //console.log(options)
      this.pieChart.setOption(options,true);
    },
    linechart(legend,xData,seriesData){
      this.lineChart=echarts.init(document.getElementById('linechart'));
      var options = {
            title: {
              // text: '折线图堆叠'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              //data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
              data:legend
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              // boundaryGap: false,
              // data: ['周一','周二','周三','周四','周五','周六','周日']
              data:xData
            },
            yAxis: {
              type: 'value'
            },
            // series: [
            //     {
            //         name:'邮件营销',
            //         type:'line',
            //         stack: '总量',
            //         data:[120, 132, 101, 134, 90, 230, 210]
            //     },
            // ]
            series:seriesData
        };
      this.lineChart.setOption(options,true);
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style>
.icon-row{line-height: 40px}
.icon-row i{cursor: pointer; margin-right: 8px;}
.search-result-wrapper{display: flex;margin-top: 20px;}
.search-result{flex:1;}
</style>
