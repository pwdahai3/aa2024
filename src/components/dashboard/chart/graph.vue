<!-- 曲线图（柱状图、折线图双切换） -->
<template>
  <div class="chart-wrapper">
    <div class="chartNodataBox" v-if='!flag'>
      <div class="chartNodataInner">
        <img src="static/icon/lineNoData.png" :alt="$t('lg.nodata')">
        <p>{{$t('lg.nodata')}}</p>
      </div>
    </div>
    <div id="graphContainer" v-else></div>
  </div>
</template>

<script>
import echarts from 'echarts';
import * as types from '@/store/types';
export default {
  props:{
    graphOption:[Object],
    numb:[String,Number]
  },
  data(){
    return{
      graphChart:null,
    }
  },
  computed:{
    flag(){
      return !!this.numb
    }
  },
  watch:{
    graphOption:{
      handler(newName, oldName) {
        var _this=this;
        if(!!this.numb){
          _this.$nextTick(()=>{
            _this.drawGraph();//从父组件传入'变动的数据'时触发
          })
        }else if(!this.numb && !!_this.graphChart){//清除之前的数据
          this.$nextTick(()=>{
            _this.graphChart.clear();
          })
        }
      },
      immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep:true
    },
    '$store.state.isMenuShow':function(){
      this.graphChart.resize();
    }
  },
  created(){
    window.addEventListener("resize", () => {
      this.graphChart.resize();
    });
  },
  mounted(){

    //拉动中间分隔线,同时图表要resize
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let element = document.querySelector('.chartPanelTop')//获取的是父组件的元素
    const observer = new MutationObserver((mutationList) => {
      this.graphChart.resize();
    })
    // console.log(observer)
    observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true})

  },
  methods:{
    drawGraph(){
      var _this=this;
      var graphDom=document.getElementById('graphContainer');
      _this.graphChart = echarts.init(graphDom);

      _this.graphChart.off('brushSelected');//一定要清除brush事件
      var brushFalg = false;//设置一个阀值，鼠标弹起时才触发
      graphDom.addEventListener("mousedown", () => {
        var graphDom=document.getElementById('graphContainer');
        brushFalg=false;
      });
      graphDom.addEventListener("mouseup", () => {
        brushFalg=true;
      });  

      _this.graphChart.setOption(this.graphOption,true);
      const xaxisData2 =this.graphOption.xAxis.data;
      //brush 操作
      _this.graphChart.on('brushSelected', function (params) {
        // console.log(params)
        if(brushFalg){
          if(params.batch && params.batch[0].areas[0]){
            // console.log(params.batch[0])
            var startIndex=params.batch[0].areas[0].coordRange[0]=='-0'||params.batch[0].areas[0].coordRange[0]<0?0:params.batch[0].areas[0].coordRange[0];//拿到x时间轴对应的坐标点（index）
            var endIndex=params.batch[0].areas[0].coordRange[1];
            var tstart=xaxisData2[startIndex],tend=xaxisData2[endIndex]?xaxisData2[endIndex]:xaxisData2[endIndex-1];//利用上面取得的index，拿到选取的x时间轴对应的开始时间以及结束时间点
            // console.log(tstart,tend);
            if(tstart==tend){ //采样频率稍大时（为'5m'时很容易出现这个问题）,如果用户选定的范围只在一个采样点内（只拉动一个阴影格），会导致起始查询时间和截止查询时间一致，这时在这个时间点上可能没有数据（但看起来应该有数据，采样频率导致的），因此遇到这种情况就把起始时间的范围以及截止时间的范围都各自扩大一个采样点，这样保证了用户只选取一个阴影格的时候也会有数据。
              // console.log(tstart,tend,'相等');
              var adTstart=new Date(tstart).getTime(),adTend=new Date(tend).getTime();
              if(_this.$store.state.mydatedata.interval=='5m'){//其他情况如：interval=='1d' 或者 '1h'时，用户只动一个阴影格的可能性很小，因此没写了 //无处理
                adTstart-=5*60*1000;
                adTend+=5*60*1000;
              }else if(_this.$store.state.mydatedata.interval=='10s'){
                adTstart-=10*1000;
                adTend+=10*1000;
              }else if(_this.$store.state.mydatedata.interval=='1s'){ //interval=='1s' 采样频率精确到1s，在往下拉也会一直有数据，因此也没写了 //无处理 
                // adTstart-=1*1000
                // adTend+=1*1000
              }
              tstart = _this.transformMyDate(adTstart);
              tend = _this.transformMyDate(adTend);
            }
            // console.log(tstart,tend);

            _this.$store.state.nowTimeVal=[new Date(tstart),new Date(tend)];//改变右上角时间（跟拉到的时间保持一致）
            clearTimeout(_this.$store.state.refreshTimeout);//图表轮询定时器 清除按时刷新数据的定时器
            _this.$store.state.refreshAble=true;//禁用自动刷新
            setTimeout(()=>{
              _this.$store.commit(types.MYDATEPICKER);
            },0)
          }
        }
      });
    },
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getFullYear()))+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>

<style scoped>
.chart-wrapper{
  width: 100%;
  height: 100%;
}
#graphContainer{
  width: 100%;
  height: 100%;
}
.chartNodataBox{
  width: 100%;
  height: 100%;
  position: relative;
}
.chartNodataInner{
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -32px;
}
</style>
