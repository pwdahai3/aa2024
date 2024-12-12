<template>
  <div class="chartHistory-wrapper">
    <div v-if="chartHistoryList.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
    <table v-if="chartHistoryList.length>0">
      <thead>
        <tr>
          <th>ID</th>
          <th>{{$t('lg.shituleix')}}</th>
          <th>{{$t('lg.shitumiaos')}}</th>
          <th style="max-width:260px">{{$t('lg.shituchans')}}</th>
          <th style="min-width:30px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in chartHistoryList" :key="item.id">
          <td>{{item.id}}</td>
          <td>{{item.chartType}}</td>
          <td>{{item.description}}</td>
          <td class="chartParamsTd" v-if="item.chartType=='areaChart' || item.chartType=='lineChart' || item.chartType=='verticalBarChart' || item.chartType=='heatmapChart'">
            <p class="paramTitle">X-Axis</p>
            <p><span>Aggregation: </span>{{item.params.x.agg}}</p>
            <p><span>Field: </span>{{item.params.x.field}}</p>
            <p><span>Interval: </span>{{item.params.x.interval}}</p>
            <p class="paramTitle">Y-Axis</p>
            <div class="innerLoop" v-for="(items,index) in item.params.y" :key="index">
              <p><span>Aggregation: </span>{{items.agg}}</p>
              <p v-if="items.field"><span>Field: </span>{{items.field}}</p>
            </div>
          </td>
          <td class="chartParamsTd" v-if="item.chartType=='pieChart' || item.chartType=='dataTable'">
            <p v-if="item.chartType=='pieChart'" class="paramTitle">Slice Size</p>
            <p v-else class="paramTitle">Metric</p>
            <p><span>Aggregation: </span>Count</p>
            <p v-if="item.chartType=='pieChart'" class="paramTitle">Split Slice</p>
            <p v-else class="paramTitle">Split Rows</p>
            <div class="innerLoop" v-for="(items,index) in item.params.aggs" :key="index">
              <p><span>Aggregation: </span>{{items.agg}}</p>
              <p><span>Field: </span>{{items.field}}</p>
              <p v-if="items.interval"><span>Interval: </span>{{items.interval}}</p>
              <p v-if="items.order"><span>Order: </span>{{items.order['_count']}}</p>
              <p v-if="items.size"><span>Size: </span>{{items.size}}</p>
            </div>
          </td>
          <td class="text-center">
            <a href="javascript:;" class="edit-del-a" @click="getChartData(item)"><i class="fa fa-play font-blue"> 生成视图</i></a>
            <a href="javascript:;" class="edit-del-a" @click="deleteChart(item.id)"><i class="el-icon-delete"> 删除</i></a>
          </td>
        </tr>
      </tbody>
    </table>
    <el-dialog :visible.sync="isMyChartShow" width="65%" :before-close="myChartClose"><!--视图弹框-->
      <area-pic v-if="chartType=='areaChart'" :isShow="isMyChartShow" :itemParams="itemParams"></area-pic>
      <line-pic v-if="chartType=='lineChart'" :isShow="isMyChartShow" :itemParams="itemParams"></line-pic>
      <vertical-bar-pic v-if="chartType=='verticalBarChart'" :isShow="isMyChartShow" :itemParams="itemParams"></vertical-bar-pic>
      <heatmap-pic v-if="chartType=='heatmapChart'" :isShow="isMyChartShow" :itemParams="itemParams"></heatmap-pic>
      <pie-pic v-if="chartType=='pieChart'" :isShow="isMyChartShow" :itemParams="itemParams"></pie-pic>
      <data-tab-pic v-if="chartType=='dataTable'" :isShow="isMyChartShow" :itemParams="itemParams"></data-tab-pic>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import * as types from '@/store/types';
import { SERVER_API_URL } from "@/conf/constvar";
//视图组件
import areaPic from '@/components/dataVisualization/areaPic';
import linePic from '@/components/dataVisualization/linePic';
import verticalBarPic from '@/components/dataVisualization/verticalBarPic';
import heatmapPic from '@/components/dataVisualization/heatmapPic';
import piePic from '@/components/dataVisualization/piePic';
import dataTabPic from '@/components/dataVisualization/dataTabPic';
export default {
  data(){
    return{
      chartHistoryList:[],
      isMyChartShow:false,//视图弹框显隐
      chartType:'',//视图类型
      itemParams:{},//存储视图参数传给areaPic子组件
    }
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getchartHistoryList();
  },
  methods:{
    getchartHistoryList(){
      const _this = this;
      const url = SERVER_API_URL + "dp/es/datachart";
      axios.get(url).then(res=>{
        console.log(res)
        if(res.data.responseCode==0){
          const resArray = res.data.data;
          console.log(resArray);
          _this.chartHistoryList=resArray;
          _this.$store.state.contentLoading=false;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': ' + res.data.data.message);
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    myChartClose(){
      this.isMyChartShow=false;
    },
    getChartData(item){//生成视图    
      const _this = this;
      console.log(item);
      const sttime=_this.$store.state.mydatedata.starttime,
            edtime=_this.$store.state.mydatedata.endtime;
      const fromTime=sttime.getTime(),
            endTime=edtime.getTime();

      let paramsObj = item.params;//替换一下视图参数里面的查询时间，替换成右上角的时间段
      paramsObj.timeRange.from = fromTime;
      paramsObj.timeRange.to = endTime;
      _this.itemParams=paramsObj;//传入视图组件，作为参数调用视图数据webSocket接口。以便作图
      _this.chartType=item.chartType;
      _this.isMyChartShow=true;
    },
    deleteChart(id){//删除一条记录
      const _this = this;
      _this.$confirm(_this.$t('lg.isdelete'),_this.$t('lg.tips'),{
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        const url = SERVER_API_URL + "dp/es/datachart/" + id;
        axios.delete(url).then(res => {
          if(res.data.responseCode == 0){
            _this.$message({
              type: "success",
              message: _this.$t('lg.success')
            });
            _this.getchartHistoryList();
          }else{
            _this.$message.error(_this.$t('lg.failed')+': ' + res.data.data.message);
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(()=>{
        _this.$message({
          type: 'info',
          message: _this.$t('lg.canceled')
        });
      })
    }
  },
  components:{
    areaPic,
    linePic,
    verticalBarPic,
    heatmapPic,
    piePic,
    dataTabPic
  }
}
</script>
<style scoped>
.chartHistory-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding:20px;
  box-sizing: border-box;
}
.chartParamsTd p{
  padding: 3px 0px;
  line-height: 18px;
}
.paramTitle{
  font-weight: 700;
}
.innerLoop{
  border-bottom: 1px dashed #ccc;
  padding: 5px 0;
}
.innerLoop:nth-last-of-type(1){
  border: none
}
</style>
