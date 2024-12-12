<!-- 单态统计、仪表盘 -->
<template>
  <div class="chart-wrapper">
    <div class="chartNodataBox" v-if='!flag'>
      <div class="chartNodataInner">
        <img src="static/icon/lineNoData.png" alt="">
        <p>{{$t('lg.nodata')}}</p>
      </div>
    </div>
    <div id="singlestatContainer" v-else></div>
  </div>
</template>

<script>
import echarts from 'echarts';
export default {
  props:{
    singlestatOption:[Object],
      numb:[String,Number]
  },
  data(){
    return{
      singlestatChart:null,
    }
  },
  computed:{
    flag(){
      return !!this.numb
    }
  },
  watch:{
    singlestatOption:{
      handler(newName, oldName) {
        var _this=this;
        if(!!this.numb){
          _this.$nextTick(()=>{
            _this.drawSinglestat();
          })
        }else if(!this.numb && !!_this.singlestatChart){//清除之前的数据
          this.$nextTick(()=>{
            _this.singlestatChart.clear();
          })
        }
      },
      immediate: true,// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
      deep:true
    },
    '$store.state.isMenuShow':function(){
      this.singlestatChart.resize();
    }
  },
  created(){
    window.addEventListener("resize", () => {
      this.singlestatChart.resize();
    });
  },
  mounted(){
    //拉动中间分隔线,同时图表要resize
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    let element = document.querySelector('.chartPanelTop')//获取的是父组件的元素
    const observer = new MutationObserver((mutationList) => {
      this.singlestatChart.resize();
    })
    // console.log(observer)
    observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true})
  },
  methods:{
    drawSinglestat(){
      var _this=this;
      var singlestatDom=document.getElementById('singlestatContainer');
      _this.singlestatChart = echarts.init(singlestatDom);
      
      _this.singlestatChart.setOption(this.singlestatOption,true);
    }
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
#singlestatContainer{
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

