<template>
  <div class='table-list'>
    <div v-if="tabodyData.length==0" class="nodata-box"><span v-if="isLogLoding"><i class="el-icon-loading"></i> {{$t('loading')}}...</span><span v-else>{{$t('lg.nodata')}}</span></div>
    <h2 v-if="ischart && tabodyData.length>0" class="table-title">{{tableTitle}}</h2>
    <!-- <div v-if="tabodyData.length>0" class="child-box"> -->
    <el-table  
      v-if="transformedTabodyData.length>0 && anewFlag"
      :data="transformedTabodyData"
      border
      height="100%"
      >
      <el-table-column label=" ">
      <template slot-scope="scope">
        <span>{{ifIsPrivate(scope.row.response_body)}}</span>
      </template>
    </el-table-column>
      <el-table-column v-for="(items, index) in tabheadDatas"
        :key="index"
        :prop="items.propName"
        :label="isZhEn?items.field:items.zh"
        :min-width="items.colWidth"
        sortable>
        <template slot-scope="scope, $index" class="menuTd">
          <span v-if='items.propName=="response_body"'> {{scope.row[`${items.propName}`] | responsebodyFormat}}</span>
          <span v-else-if='items.propName=="request_body"'> {{scope.row[`${items.propName}`] | responsebodyFormat}}</span>
          <div v-else-if='items.propName=="shadowUrl"'>
            <span class="cursor-pointer" @contextmenu.prevent="showSdurlMenu(scope.$index)">{{scope.row[`${items.propName}`]}}</span>
            <ul class="td-menuList" v-if="scope.row.showUMenuList">
              <li class="item" @click="addSubFilterEx(scope.row)">{{$t('lg.naked')}}</li>
            </ul>
          </div>
          <span v-else> {{scope.row[`${items.propName}`]}}</span>
        </template>
      </el-table-column>
      <el-table-column label=" " width="100" v-if="logType=='allaccess' || logType=='access' || logType=='waf'">
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="getDetail(scope.row)">{{$t('lg.lookdetail')}}</el-button>
      </template>
    </el-table-column>
    </el-table>
    <!-- </div> -->
    <div class="mypage" v-if="tabodyData.length>0 && !isShowPage">
      <el-pagination @current-change="getPaginationlogs" :current-page.sync="tabCurPage" :page-size="tabPageNum" layout="prev, pager, next, jumper" :total="totalNums"></el-pagination>
      <p class="mypageTip txtOverflow" v-if="totalNum>=maxNum" :title="$t('lg.pagetip')">{{$t('lg.pagetip')}}</p>
    </div>
    <p style="text-align:right"><a href="javascript:;" @click="downloadLog" v-if="tabodyData.length>0 && (logType=='allaccess' || logType=='access' )">{{$t('lg.logdownload')}}</a></p>
   <p style="text-align:right"><a href="javascript:;" @click="downloadAutiLog" v-if="tabodyData.length>0 && logType=='audit'">{{$t('lg.logdownload')}}</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:;" @click="deleteAutiLog" v-if="tabodyData.length>0 && logType=='audit'">{{$t('lg.logdelete')}}</a></p>
  <logpop :logdVisible="centerDialogVisible" :data="detailStr" @logdClose="centerDialogVisible=false"></logpop>
  </div>
</template>
<script>
import * as types from '@/store/types';
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import logpop from '@/components/logs/logPop';
export default {
  props:{
    isShowPage:{
      type:Boolean
    },
    ischart:{
      type:Boolean
    },
    aggsField:{
      type:String,
      default:null
    },
    tableTitle:{
      type:String,
      default:null
    },
    passquerystring:{
      type:String,
      dafault:null
    },
    tabheadData:{
      type:Array,
      default:[]
    },
    tabodyData:{
      type:Array
    },
    logType:{
      type:String,
      dafault:null
    },
    // 分页 总数据量
    totalNum:{
      type:Number
    },
    tabPageNum:{
      type:Number,
      default:10
    },
    showSDURLMenu:{
      type:Function
    },

    //加载状态
    isLogLoding:{
      type:Boolean
    },
    isZhEn:{
      type:Boolean
    }
  },
  components:{
logpop
  },
  created(){
    if(this.aggsField){
      this.tabheadDatas=[
        ...this.tabheadData
      ]
    }else{
      this.tabheadDatas=[
        {
          propName: "date",
          colWidth: '175',
          zh: this.$t('lg.time')
        },
        ...this.tabheadData
      ]
    }
  },
  watch:{
    '$store.state.mydatedata.timestampnow'(){
      this.tabCurPage=1;
    },
    tabheadData(newData){
      this.anewFlag=false;
      if(this.aggsField){
        this.$nextTick(()=>{
          this.tabheadDatas=[
          ...newData
        ]
          this.anewFlag=true;
        })
      }else{
        this.$nextTick(()=>{
          this.tabheadDatas=[
            {
              propName: "date",
              colWidth: '175',
              zh: this.$t('lg.time')
            },
            ...newData
          ]
          this.anewFlag=true;
        })
      }
    }
  },
  data() {
    return {
      centerDialogVisible:false,
      detailStr:{},
      tabCurPage:1,
      maxNum:10000,
      tabheadDatas:[],
      anewFlag:true,
    }
  },
  computed:{
    totalNums(){
      return  this.totalNum>=this.maxNum?this.maxNum:this.totalNum
    },
    transformedTabodyData() {
      return this.tabodyData.map(item => {
        if(item.request_body && item.request_body.indexOf("\\22")!=-1){
        try {
          const requestBody = JSON.parse(item.request_body.replace(/\\x22/g, '"'));
          item.request_body = JSON.stringify(requestBody);
        } catch (error) {
          console.error('Error parsing request_body:', error);
        }          
        }

        return item;
      });
    }
  },
  methods:{
    getDetail(row){
      this.centerDialogVisible=true;
      this.detailStr=row
    //  console.log(row);
    },
    getPaginationlogs(){
      this.$emit("getChangeLogData",{curPage:this.tabCurPage,pageNum:this.tabPageNum})
    },
    showSdurlMenu(index){
      this.showSDURLMenu(index)
    },
    addSubFilterEx(item){
      // console.log(item)
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/snode/v1";
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){
          var shadownodes=res.data.data;
          var itemSnodeId='';
          var shadownodeName = item.hostname;
          shadownodes.forEach(element => {
            if(element.hostName==shadownodeName){
              itemSnodeId=element.snodeId
            }
          })
          var itemUrl = item.shadowUrl;
          var url2 = SERVER_API_URL+"pe/shadow/domain/location/directive/subfilter";
          axios.post(url2,{
            snodeId:itemSnodeId,
            url:itemUrl
          }).then((res)=>{
            if(res.data.responseCode == 0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            item.showUMenuList=false;
          }).catch((err) => {
            console.log(err)
          });
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    deleteAutiLog(){
      
      var _this = this;
      _this.$confirm(_this.$t('lg.delete'),_this.$t('lg.tip'),{
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        let url=SERVER_API_URL+"pe/shadow/audit/delete";
        axios.delete(url).then(res => {
          if(res.data.responseCode == 0){
            _this.tabodyData=[];
            _this.$message({
              type: "success",
              message: _this.$t('lg.success')
            });
            _this.$refs.addAlarmTask.isShowSelect=false;
          }else{
            _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: _this.$t('lg.cancel')
        });
      })
    },
    downloadAutiLog(){
      let data={"size": 10,"sort": [{"json.timestamp": {"order": "desc"}}],"query": {"match_all": {}}};
      data=JSON.stringify(data)
     let base64querystr=Base64.encode(data);
      let url=SERVER_API_URL+"pe/shadow/audit/export?query="+base64querystr;
      var newdate=new Date();
      var year1=newdate.getFullYear();
      var month1=newdate.getMonth()+1;
      var day1=newdate.getDate();
      var filename=this.$t('lg.shenjiriz')+"_"+year1+"-"+month1+"-"+day1+".csv";
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        }).then((res)=>{
        var blob=new Blob([res.data]);
          const url = window.URL.createObjectURL(blob);
         // var filename=new Date().getTime()+".csv"
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, filename);
          }else{
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);    
          }  
      })
    },
    downloadLog(){
      let _this=this;
      let base64querystr=Base64.encode(_this.passquerystring);
      //console.log(_this.passquerystring)
      let logtype=_this.logType=='allaccess'?1:3;
      var filename1=_this.logType=='allaccess'?this.$t('lg.logrecord'):this.$t('lg.fangwen');
      var newdate=new Date();
      var year1=newdate.getFullYear();
      var month1=newdate.getMonth()+1;
      var day1=newdate.getDate();
      var filename=filename1+"_"+year1+"-"+month1+"-"+day1+".csv";
      var langtype=localStorage.lang=="en"?2:1;
      let url=SERVER_API_URL+"mc/esquery/download/conversion/es2csv?exportType="+logtype+"&query="+base64querystr+"&languageType="+langtype;
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        })
        .then((response) => {
          var blob=new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
         // var filename=new Date().getTime()+".csv"
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, filename);
          }else{
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);    
          }  
        })

    },
    ifIsPrivate(a){
      var telReg=/1[3-9]\d{9}/;
      var idReg=/[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/;
      if(a){
        if(typeof a==="object"){
          a=JSON.stringify(a);
        }
          if(a.match(telReg)){
            return this.$t('lg.telphones');
          }else if(a.match(idReg)){
            return this.$t('lg.ids');
          }else{
            return '';
          }
      }else{
        return ''
      }
      
    }
  },
  filters:{
    responsebodyFormat(a){
      var telReg=/1[3-9]\d{9}/;
      var idReg=/[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/;
      if(a){
        if(typeof a==="object"){
          a=JSON.stringify(a);
        }
        a=a.replace(telReg,"***********");
        a=a.replace(idReg,"******************");
        if(a.length>60){
          return a.substring(0,60)+"...";
        }else{
          return a;
        }
        
      }
    },
    isPrivate(a){
      var telReg=/1[3-9]\d{9}/;
      var idReg=/[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/;
      if(a.match(telReg) || a.match(idReg)){
        return '敏感';
      }else{
        return '';
      }
    }
  }
  
}
</script>
<style scoped>
/*用户请求的url 右键菜单*/
.table-list{
  height: 100%;
  /* flex:1; */ /* 设置flex:1，会导致日志弹框样式出现问题*/
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.table-title{
  text-align:center;
  line-height:22px;
  margin-bottom:3px;
}
/* .child-box{
  flex:1;
  overflow: auto;
} */
.menuTd{
  position: relative;
}
.td-menuList{
  position: absolute;
  top: 60%;
  left: 10%;
  z-index: 1002;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 150px;
  /* display: none; */
}
.td-menuList li{
  list-style: none;
  line-height: 22px;
  padding: 0 15px;
  margin: 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;
  display: block;
}
.td-menuList li:hover{background-color: #ecf5ff;color: #66b1ff;}

/*分页*/
.mypage{margin-top: 10px; margin-bottom:10px;font-size: 12px;display: flex;justify-content: flex-start;}
.mypageTip{color: #F56C6C;line-height: 30px;margin-left: 10px;}

</style>

