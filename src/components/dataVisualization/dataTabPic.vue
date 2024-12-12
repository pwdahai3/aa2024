<template>
  <div>
    <p class="chartName">Data Table</p>
    <!-- <p class="nodataTxt"><span v-if="chartLoadingShow"><i class="el-icon-loading"></i> 数据加载中...</span><span v-if="tableHead.length==0 && !chartLoadingShow">暂无数据</span></p> -->
    <div class="tableBox">  
      <el-table height="560" :empty-text="chartLoadingShow?$t('lg.loading2'):$t('lg.nodata')" :data="tableBody.slice((curPage-1)*pageSize,curPage*pageSize)" @sort-change="sort_change"><!-- element 表格 每列自带排序功能 、暂无数据功能-->
        <template v-for="items in tableHead">
          <el-table-column min-width="340" :prop="items" :label="items" sortable="custom"></el-table-column>
        </template>
      </el-table>
      <div class="mypage">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="curPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal"></el-pagination>
      </div>
    </div>
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
    isDataTable:{
      type:Boolean
    },
    itemParams:{
      type:Object
    }
  },
  data(){
    return{
      chartLoadingShow:false,
      tableHead:[],
      tableBody:[],

      curPage:1,
      pageSize:10,
      tableDataTotal:0,
    }
  },
  created(){
    if(!this.isDataTable){//！！！如果父组件不是dataTable才触发
      this.getDataTableData();
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        this.getDataTableData();
      }
    }
  },
  methods:{
    getDataTableData(){
      const _this=this;
      _this.tableHead=[];//清空
      _this.tableBody=[];
      _this.chartLoadingShow = true;
      const url = SERVER_API_URL+"dp/es/datachart/process"; 
      console.log(_this.itemParams)
      axios.post(url,{
        chartType:'dataTable',
        description:"",
        params:_this.itemParams,
        title:'dataTable'
      }).then(res=>{
        console.log(res);
        if(res.data.responseCode==0){
          let buckets = res.data.data.aggregations[2].buckets;
          let tableHeadArray = [],tableHeadIndexArray=[], tableBodyArray = [];

          //表头
          const splitRows = _this.itemParams.aggs;
          splitRows.forEach((element,index)=>{
            if(element.agg=='date_histogram'){
              switch(element.interval.match(/(\d*)(\w*)/)[2]){
                case "s":
                tableHeadArray.push("@timestamp per "+ element.interval.match(/(\d*)(\w*)/)[1] +" seconds")
                break;
                case "m":
                tableHeadArray.push("@timestamp per "+ element.interval +" minutes")
                break;
                case "h":
                tableHeadArray.push("@timestamp per "+ element.interval +" hours")
                break;
                case "d":
                tableHeadArray.push("@timestamp per "+ element.interval + " days")
                break;
                case "w":
                tableHeadArray.push("@timestamp per "+ element.interval + " weeks")
                break;
                case "M":
                tableHeadArray.push("@timestamp per " + element.interval + " months")
                break;
                default:
                tableHeadArray.push("@timestamp per " + element.interval + " years")
              }
            }else if(element.agg=='terms'){
              tableHeadArray.push(element.field);
            }
          })
          tableHeadArray.push('count');

          //表体
          function getListArray(arr,headArry,obj,i){
            if(arr.length!=0){
              arr.forEach((element,index) => {
                obj=Object.assign({},obj);
                var flag=false;
                Object.keys(element).forEach(key=>{
                  if(!isNaN(key)){
                    flag=true;
                    if(element.key_as_string){//有key_as_string,表示key值是时间，需要转换时间戳
                      var timeKey = _this.transformMyDate(element.key);
                      obj[headArry[i++]]=timeKey;
                    }else{
                      obj[headArry[i++]]=element.key;
                    }
                    getListArray(element[key].buckets,headArry,obj,i)
                    i--;
                  }
                })
                if(!flag){
                    obj=Object.assign({},obj);
                    if(element.key_as_string){//转换时间戳
                      var timeKey = _this.transformMyDate(element.key);
                      obj[headArry[i]]=timeKey;
                    }else{
                      obj[headArry[i]]=element.key;
                    }
                    obj['count']=element.doc_count;
                    tableBodyArray.push(obj);
                  }
              });
            }
          }
          var mapTableHeadArray=tableHeadArray.map(item=>{//elelmnet 组件 <el-table> prop 不识别'.'符号（被认为对象属性）
            if(item.indexOf('.')){
              return item.split('.').join(' ');
            }
          })

          getListArray(buckets,mapTableHeadArray,{},0);

          // console.log(tableBodyArray)
          _this.tableHead = mapTableHeadArray;
          _this.tableBody=tableBodyArray;
          _this.tableDataTotal=tableBodyArray.length;
          _this.chartLoadingShow = false;

        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
          _this.chartLoadingShow = false;
        }
      }).catch(err=>{
        console.log(err);
        _this.chartLoadingShow = false;
      });
      _this.$emit('changeFlag',false);//如果dataTable是父组件，在父组件里点击生成视图，要把myChartFlag 的值重新变成false，（以便Watch做监视 isShow变动才能触发getDataTableData）
    },
    handleCurrentChange(){
      console.log(this.curPage)
      console.log(this.pageSize)
    },
    sort_change(column,prop,order){//整体数据排序
      if(column.order=="descending"){
        this.tableBody.sort(function(a,b){
          if(isNaN(a[column.prop])){
            return new Date(a[column.prop]).getTime() - new Date(b[column.prop]).getTime();
          }else{
            return a[column.prop] - b[column.prop];
          }
        });
      }else if(column.order=="ascending"){
        this.tableBody.sort(function(a,b){
          if(isNaN(a[column.prop])){
            return Date.parse(new Date(b[column.prop])) - Date.parse(new Date(a[column.prop]));
          }else{
            return b[column.prop] - a[column.prop];
          }
        });
      }
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
.chartName{
  font-size: 16px;
  color: #606266;
  padding-left: 10px;
  margin-bottom: 20px;
}
.tableBox{
  overflow-x: auto;
  height: 650px;
}
.mypage{
  padding-top: 30px;
  float: right;
}
.backBtn{
  float: right;
}
/* .nodataTxt{
  position: absolute;
  top: 40%;
  left: 48%;
  color:#888;
} */
</style>
