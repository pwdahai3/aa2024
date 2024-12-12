<template>
  <div class="customQuery-wrapper" @click="hideSDURLMenu">
    <h2 class="breadcrumb">{{$t('lg.zidingyi')}}</h2>
   
    <!-- 自定义查询字段 -->
    <my-query ref="myQuery" @clearQueryData='clearQueryData' :isCustomQuery='true' @getMultiQueryResult="getMultiQueryResult" @restoreQinterval="restoreQinterval" @getTimeTaskResult="getTimeTaskResult" @queryLoadingStart="queryLoadingStart" @queryLoadingStop="queryLoadingStop"></my-query>

    <!-- 查询结果数据展示 -->
    <log-rebuild v-if="(!this.isaggs && this.logtype=='waf.log') || (!this.isaggs && this.logtype=='access.log') " :tableKeyArr='tableKeyArrCustom' :dynamicTag='cstQryLogsHeadData' @refilterColBy='refilterColByCustom' @requeryRowBy='requeryRowByCustom'></log-rebuild><!-- 查询结果非聚合时 -->
    <div v-if="queryLoading" class="nodata-box"><i class="el-icon-loading"></i> {{$t('lg.loading2')}}</div>
    <div v-if="cstQryDataRes.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
    <div v-if="cstQryDataRes.length>0" class="logTableHeight">
      <log-tables ref="log_tables" v-if="!isaggs" :logType="logtype" :tabheadData="cstQryLogsHeadData" :tabodyData="cstQryLogsBodyData" :totalNum="cstQryTotalNum" @getChangeLogData="customQueryMultiQuery" :isLogLoding="queryLoading" :showSDURLMenu='showSDURLMenu'></log-tables>
      <logagg ref="log_agg" v-if="isaggs" :data="cstQryDataRes" :piedata="piedata" :linechartdata="linechartdata" @getChangeLogInterval="customQueryMultiQuery"></logagg>
    </div>

    <!-- 报警任务 -->
    <timing-task-pop :isShow="isQueryPopShow" :myTaskType="'esSearch'" :myTaskTypeTxt="$t('lg.customesqbased')" :querydata="queryform" :qJsondata="qJson" @setTimingTaskClose="isQueryPopShow=false"></timing-task-pop>
    
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import myQuery from '@/components/behavior/myQuery';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
import {logskeys} from '@/assets/js/logskeys';
import logRebuild from "@/components/logs/logRebuild";
import logTables from '@/components/logs/logTables';
import logagg from '@/components/behavior/logagg';
import Emitter from 'element-ui/src/mixins/emitter';
export default {
  mixins: [Emitter],
  components:{
    myQuery,
    logRebuild,
    logTables,
    logagg,
    timingTaskPop
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      this.$refs['myQuery'].multiQuery({curPage:1,pageNum:10},true);
    }
  },
  data(){
    return{
      queryLoading:false,
      logtype:'',
      data:{},
      cstQryDataRes:[],
      
      tableKeyArrCustom:[],//waf.log总共（默认）显示的字段
      cstQryLogsHeadData:[],
      cstQryLogsBodyData:[],
      cstQryTotalNum:0,

      isaggs:false,
      piedata:{},
      linechartdata:{},

      //定时任务
      isQueryPopShow:false,
      qJson:{},
      queryform:{},

    }
  },
  methods:{
    clearQueryData(data){
      this.tableKeyArrCustom=data.tableKeyArrCustom;
      this.cstQryLogsHeadData=data.cstQryLogsHeadData;
      this.cstQryLogsBodyData=data.cstQryLogsBodyData;
      this.logtype=data.type;
      this.broadcast('logRequery',"clearData");//清空孙组件里logRequry的查询条件输入框里的内容，要引入Emitter
    },
    queryLoadingStart(){
      this.queryLoading=true;
    },
    queryLoadingStop(){
      this.queryLoading=false;
    },
    getMultiQueryResult(data){
      this.logtype=data.type;
      this.cstQryDataRes=data.tableRes;
      this.tableKeyArrCustom=data.tableKeyArrCustom;
      this.cstQryLogsHeadData=data.cstQryLogsHeadData;
      this.cstQryLogsBodyData=data.cstQryLogsBodyData;
      this.cstQryTotalNum=data.cstQryTotalNum;
      this.isaggs=data.isaggs;
      this.piedata=data.piedata;
      this.linechartdata=data.linechartdata;
      this.queryLoading=false;
    },
    restoreQinterval(){
      if(this.$refs['log_agg']) this.$refs['log_agg'].qinterval='5m';//改变采样频率后，若换个聚合条件再次查询 则得把子组件logagg 的采样频率显示重新归为 5分钟（只能当其兄弟组件（或当前组件的watch）调用multiQuery方法时才调用这个）
    },
    getTimeTaskResult(data){
      // console.log(data)
      this.qJson=data.queryjson
      this.queryform=data.queryform
      this.isQueryPopShow=true;
    },
    customQueryMultiQuery(params){//改变采样频率，则再次触发查询
      this.$refs['myQuery'].multiQuery(params);
    },
    requeryRowByCustom(obj){ //用户通过requery孙组件筛选waf.log或access.log显示的行
      this.$refs['myQuery'].filterObj=obj.requeryObj;
      this.$refs['myQuery'].multiQuery({curPage:0,pageNum:10});
      if(this.$refs.log_tables) this.$refs.log_tables.tabCurPage=1;//当再次用户点击子组件logRequery的查询后，查询结果的页码要回到第一页
    },
    refilterColByCustom(obj){ //用户通过refilter孙组件筛选waf.log或access.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
     if(!obj.length) return false
     if(this.logtype ==='waf.log'){
         var url = SERVER_API_URL + `/pe/shadow/kv`;
          axios.post(url,{customQueryWaf:obj}).then(res=>{
          if(Object.keys(res.data.data.Failure)){
            axios.patch(url,{customQueryWaf:obj}).then(res=>{
            })
          }
        })
        this.cstQryLogsHeadData = obj;
      }else if(this.logtype ==='access.log'){
         var url = SERVER_API_URL + `/pe/shadow/kv`;
        axios.post(url,{customQueryAccess:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{customQueryAccess:obj}).then(res=>{

          })
        }
      })
      this.cstQryLogsHeadData = obj;
      }
     
    },
    showSDURLMenu(index){
      this.cstQryLogsBodyData.forEach(items=>{
        items.showUMenuList=false;
      })
      // this.cstQryLogsBodyData[index].showUMenuList=true;
      this.$set(this.cstQryLogsBodyData[index],'showUMenuList',true)
    },
    hideSDURLMenu(){
      this.cstQryLogsBodyData.forEach(items=>{
        items.showUMenuList=false;
      })
    }
  }
}
</script>
<style scoped>
.customQuery-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
}
</style>
