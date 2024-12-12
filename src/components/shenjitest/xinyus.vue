<template>
  <div class="">
    <h2 style="padding:20px 0 10px 20px">信誉库</h2>
    <div class="apiChart-wrapper">
      <div class="apiChartContent">
          <table>
        <thead>
          <tr>
            <th>IP</th>
            <th>分值</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12.18.2.14</td>
            <td>10</td>
            <td>恶意访问IP</td>
          </tr>
          <tr>
            <td>19.68.23.24</td>
            <td>60</td>
            <td>已知爬虫IP</td>
          </tr>
          <tr>
            <td>92.168.2.43</td>
            <td>80</td>
            <td>黑产IP</td>
          </tr>
          <tr>
            <td>44.68.23.4</td>
            <td>7</td>
            <td>黑产IP</td>
          </tr>
          <tr>
            <td>92.68.2.18</td>
            <td>44</td>
            <td>已知爬虫IP</td>
          </tr>
          <tr>
            <td>22.18.21.22</td>
            <td>34</td>
            <td>黑产IP</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="apiChartContent" style=" margin-left:20px">
        <h2 style="padding:0 0 10px 0">策略管理</h2>
<table>
        <thead>
          <tr>
            <th>IP</th>
            <th>分值</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0-60</td>
            <td><el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></td>
          </tr>
          <tr>
            <td>60-80</td>
            <td><el-select v-model="value1" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></td>
          </tr>
          <tr>
            <td>80-100</td>
            <td><el-select v-model="value2" placeholder="请选择">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select></td>
          </tr>
          
        </tbody>
      </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';

export default{
  components:{
    loading
  },
  data(){
    return{
      options: [{
          value: '拦截',
          label: '拦截'
        }, {
          value: '按比例拦截',
          label: '按比例拦截'
        }, {
          value: '通行',
          label: '通行'
        }],
        value: '',
        value1: '',
        value2: ''
    }
  },
  methods:{
  
  }

}
</script>

<style>
.apiChart-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
}
.apiChartContent{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/*图表*/
.chartRow{
  margin-bottom: 10px;
}
.chartRowBusi{
  margin-left: 0px!important;
}

#urlVisitCtBarContainer,#regionSunburstContainer,#orgIpLineContainer,#domainLineContainer,#orgIpPieContainer,#domainPieContainer,#fingerPieContainer,#autoToolPieContainer,#apiRespTimeBarContainer{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
}
/*业务表 max min*/
.busiChartBox{
  padding: 10px;
  box-sizing: border-box;
  background: #f7f7f7;
}
#businessContainer{
  width: 100%;
  height: 290px;
}
.busiNumBox{
  background: #fff;
  height: 290px;
  padding: 30px 10px !important;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.totalList{
  margin-bottom: 20px;
}
.totalList li{
  color: #27727b;
  margin-bottom: 10px;
  line-height: 15px;
}
.someList li{
  color: #7eb00a;
  margin-bottom: 10px;
  line-height: 15px;
}
.totalList .listTitle,.someList .listTitle{
  color: #606266;
  margin-bottom: 15px;
  padding-left: 0px;
}
.liLable{
  font-size: 12px;
  font-style:italic;
  padding-left: 10px;
}
.liValue{
  text-align: center;
  font-size: 1.2vw;
}
/*次数显示&业务表*/
.numBox{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
  /* box-shadow: 2px 2px 5px #ccc; */
}
.numBoxTitle{
  font-size: 16px;
  color: #333;
}
.totalBox {
  margin-top: 20px;
  height: 80px;
}
.abnormalBox{
  margin-top: 30px;
  height: 100px;
}
.numTitle{
  color: #606266; 
  padding-left: 10px;
}
.totalNum{
  margin-left: 20%;
  font-size: 2.5vw;
  color: #516b91;
  line-height: 60px;
}
.abnormalNum{
  text-align: center;
  font-size: 4vw;
  color: #2b821d;
  line-height: 90px;
}
.uTxt{
  font-size: 14px;
  color: #606266;
}

/*pei图暂无数据*/
.adaptive-circle {
  margin: 50px auto 0;
  width: 22%;
  height: 0;
  padding-top: 22%;
  border-radius: 100%;
  box-sizing: border-box;
  background:#fff;
  position:absolute;
  top:15%;
  left:40%;
}
.fingerPie-circle{
  margin: 0;
  width: 15%;
  left:42%;
  top:30%;
  padding-top: 15%;
}
.adaptive-circle .layout {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;
}
.adaptive-circle .layout.middle:before {
  display: inline-block;
  vertical-align: middle;
  content: '';
  height: 100%;
  width: 0;
  overflow: hidden;
}
.adaptive-circle .layout.middle div:first-child {
  display: inline-block;
  vertical-align: middle;
}

/*导出数据图表*/
/*.downBtn{
  position: fixed;
  bottom: 20px;
  right: 50px;
  padding: 5px;
}
.downBtn a{
  font-size: 15px;
}*/
.table-container {
  width: 100%;
  margin:10px auto 20px auto;
  border-collapse: collapse;
}

/* 表头 */
.table-container thead {
  background-color: #f2f2f2;
}

.table-container th,
.table-container td {
  padding: 10px;
  border: 1px solid #ddd; /* 添加边框 */
}

/* 表体 */
.table-container tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* 鼠标悬停效果 */
.table-container tbody tr:hover {
  background-color: #e0e0e0;
}

/* 响应式表格，适应小屏幕 */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  .table-container th,
  .table-container td {
    white-space: nowrap;
  }
}
/* loading 主要针对‘自定义图表’的loading */
.apiChart-wrapper .el-loading-spinner{
  padding: 3px;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  text-align: right;
  margin-top: 0;
}
.apiChart-wrapper .el-loading-spinner i{
  color: #242222;
  font-size: 18px;
}
.h2title{
  font-size: 14px;margin-bottom: 0; color: #000;
}
</style>

