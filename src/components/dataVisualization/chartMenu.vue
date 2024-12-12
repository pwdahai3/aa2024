<template>
  <div class="chartMenu-wrapper clearfix">
    <div>
      <ul class="chartMenuList">
        <li>
          <router-link tag="div" to="/chartMenu/areaChart" class="chartImgBox"><img src="static/fedoraCore_img/area_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/areaChart" class="chartTxt">Area Chart</router-link></div>
        </li>
        <li>
          <router-link tag="div" to="/chartMenu/lineChart" class="chartImgBox"><img src="static/fedoraCore_img/line_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/lineChart" class="chartTxt">Line Chart</router-link></div>
        </li>
        <li>
          <router-link tag="div" to="/chartMenu/pieChart" class="chartImgBox"><img src="static/fedoraCore_img/pie_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/pieChart" class="chartTxt">Pie Chart</router-link></div>
        </li>
        <li>
          <router-link tag="div" to="/chartMenu/heatmapChart" class="chartImgBox"><img src="static/fedoraCore_img/heatmap_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/heatmapChart" class="chartTxt">Heatmap</router-link></div>
        </li>
        <li>
          <router-link tag="div" to="/chartMenu/verticalBarChart" class="chartImgBox"><img src="static/fedoraCore_img/bar_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/verticalBarChart" class="chartTxt">Vertical Bar Chart</router-link></div>
        </li>
        <li>
          <router-link tag="div" to="/chartMenu/dataTable" class="chartImgBox"><img src="static/fedoraCore_img/data_echarts.png" alt="" class="chartImg"></router-link>
          <div class="chartTxtBox"><router-link tag="span" to="/chartMenu/dataTable" class="chartTxt">Data Table</router-link></div>
        </li>
      </ul>
    </div>
    <div><router-view/></div>
  </div>
</template>
<script>
export default {
  created(){
    this.$store.state.contentLoading=false;
  }
}
</script>
<style scoped>
.chartMenu-wrapper{
  position: relative;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  padding: 5% 10% 50px 22%;
  background: #f7f7f7;
}  
.chartMenuList{
}
.chartMenuList li{
  width: 50%;
  box-sizing: border-box;
  float: left;
  padding-top: 20px;
  padding-bottom: 40px;
  display: flex;
  justify-content: flex-start;
}
.chartImgBox{
  width: 35%;
  border: 2px solid #999;
  border-radius: 10%;
  cursor: pointer;
  padding: 3%;
  box-sizing: border-box;
  background: #fff;
}
.chartImg{/*图片尺寸1173*650*/
  width: 100%;
  height: 100%;
  border-radius: 10%;
}
.chartImg:hover{
  transform: scale(1.23)
}
.chartTxtBox{
  width: 75%;
  padding-top: 9%;
}
.chartTxt{
  font-size: 22px;
  padding-left: 10px;
  cursor: pointer;
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}
</style>
