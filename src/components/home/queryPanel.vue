<template>
  <div class="queryPanel-wrapper">
    <el-form ref="queryPanelform" class="queryPanelBox" style="padding-bottom:0" :model="queryPanelform" :rules="queryPanelformRules"  label-width="0">
      <el-row :gutter="10">

        <el-col :span="1.5" v-show="$route.path=='/visitChart'"><!-- 只有恶意访问才用到 -->
          <el-select v-model="chartType" :placeholder="$t('lg.selecturl')" style="width:100%" @change="chartTypeChange(chartType)">
            <el-option :label="$t('lg.protection')" value="protectChart"></el-option>
            <el-option :label="$t('lg.monitor')" value="monitorChart"></el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <div class="grid-content">
            <el-form-item prop="checkDomain">
              <el-select v-model="queryPanelform.checkDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains($event)" style="width:100%" :loading="$store.state.getEsDomainArrLoading">
                <template v-for="item in $store.state.esDomainArr">
                  <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
                </template>
              </el-select>
              <!-- <el-input v-model.trim="queryPanelform.checkDomain" style="width:100%" :placeholder="$t('lg.inputdomain')"></el-input> -->
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" v-if="isApi"><!-- 只有Api状态才用到 -->
          <div class="grid-content">
            <el-form-item prop="checkUrl">
              <el-select v-model="queryPanelform.checkUrl" :placeholder="$t('lg.selecturl')" style="width:100%" @visible-change="getUrls($event)" :loading="$store.state.getEsUrlArrLoading">
                <el-option v-for="item in $store.state.esUrlArr" :key="item.key" :label="item.key" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="queryBtnbox">
            <el-button type="primary" style="width:100%" @click="getFilterChart()" size="small">{{$t('lg.query')}}</el-button>
          </div>
        </el-col>
        <el-col :span="1.5">
          <div class="queryBtnbox">
            <el-button style="width:100%" @click="getAllChart()" size="small">{{$t('lg.reset')}}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
import * as types from '@/store/types';
import client from "@/components/es/connection";
import toISO8601 from '@/assets/js/iso8601';
export default {
   props:{
    isApi:{
      type:Boolean
    },
    myChartType:{
      type:String
    }
  },
  data(){
    return{
      queryPanelform:{
        checkDomain:'',
        checkUrl:''
      },
      chartType:this.myChartType,
      queryPanelformRules:{
        checkDomain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },
      // resUrlArr:[],
    }
  },
  mounted(){
    if(this.$route.query.timeInterval){//从邮件报警页面点击查看跳转过来，要根据邮件报警的查询间隔时间来改变右上角时间

      var paramUrl = this.$route.query;
      var dataNow = new Date().getTime();

      var timeIntervalNum = paramUrl.timeInterval.match(/(\d*)(\w*)/)[1];
      var timeIntervalUnit = paramUrl.timeInterval.match(/(\d*)(\w*)/)[2];

      var timeStrVal = 0;
      switch(timeIntervalUnit)
      { 
        case "m":
        timeStrVal = dataNow - timeIntervalNum*60*1000;
        break;
        case "h":
        timeStrVal = dataNow - timeIntervalNum*60*60*1000;
        break;
        default:
        timeStrVal = dataNow - timeIntervalNum*24*60*60*1000;
      };
      this.$store.state.nowTimeVal=[new Date(timeStrVal),new Date(dataNow)];
      this.$store.state.refreshAble=true;//禁用自动刷新
      this.$store.commit(types.MYDATEPICKER);

      this.$emit("handleTime");

      if(this.$route.query.theDomian){
        this.queryPanelform.checkDomain=this.$route.query.theDomian;
        this.getFilterChart();
      }
      
    }
  },
  methods:{
    chartTypeChange(val){
      this.$emit("getChartTypeAllQuery",val)
      // this.$emit("getAllQuerychart")
    },
    getFilterChart(){//输入查询条件查询图表
      this.$refs['queryPanelform'].validate((valid)=>{
        if(valid){
          var domainNameStr = this.queryPanelform.checkDomain;
          var escapeDomainName=domainNameStr.replace(":",'\\:');
          var dataObj={
            domainName:escapeDomainName,
            urlArr:this.queryPanelform.checkUrl,
            isQuery:true
          };
          this.$emit("getAllQuerychart",dataObj)
        }
      })
    },
    getAllChart(){//还原所有数据图表
      this.$refs['queryPanelform'].resetFields();
      var dataObj={
          domainName:'',
          urlArr:'',
          isQuery:false
      };
      this.$emit("getAllQuerychart",dataObj)
    },
    getDomains(callback){//获取域名数据 
    console.log(callback)
      if(callback){
        this.queryPanelform.checkDomain="";
        this.queryPanelform.checkUrl='';
        this.$store.commit(types.GETESDOMAINS);
      }
    },
    getUrls(callback){//获取url数据
      if(callback){
        this.$refs['queryPanelform'].validate((valid)=>{
          if(valid){
            this.queryPanelform.checkUrl='';
            var domainVal = this.queryPanelform.checkDomain;
            this.$store.commit(types.GETESURLS,{domain:domainVal});
          }
        })
      }
    },
  }
}
</script>

<style scoped>
.queryPanel-wrapper{
  width: 100%;
  margin-bottom: 15px;
}
.queryPanelBox{
  padding:15px;
  background: #f7f7f7;
  border: 1px solid #eee;
  box-sizing: border-box;
}
.queryBtnbox{
  padding-top: 3px;
}
</style>
