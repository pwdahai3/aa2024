<template>
  <div class="logs-wrapper" @click="hideSDURLMenu">
    <el-tabs v-model="logsActiveName" @tab-click="logsHandleClick" class="big-tabs"> 
      <el-tab-pane :label="$t('lg.logrecord')" name="allaccess" v-if="adminRoles || !auditRoles">
        <log-rebuild :tableKeyArr='tableKeyArrAllAccess' :dynamicTag='allAceLogsHeadData' :key='1' @refilterColBy='refilterColByAllAccess' @requeryRowBy='requeryRowByAllAccess'></log-rebuild>
        <log-tables ref="log_tablesAllAccess" :isZhEn="isen" :logType="logsActiveName" :key='2' :tabheadData="allAceLogsHeadData" :tabodyData="allAceLogsBodyData" :totalNum="allAceTotalNum" @getChangeLogData="getAllAccesslogs" :passquerystring="passQuerystring" :isLogLoding="allAccessLoading"></log-tables>
      </el-tab-pane>

      <el-tab-pane :label="$t('lg.gongji')" name="waf" v-if="adminRoles || !auditRoles">
        <log-rebuild :tableKeyArr='tableKeyArrWaf' :dynamicTag='wafLogsHeadData' :key='3' @refilterColBy='refilterColByWaf' @requeryRowBy='requeryRowByWaf'></log-rebuild>
        <log-tables ref="log_tablesWaf" :isZhEn="isen" :logType="logsActiveName" :key='4' :tabheadData="wafLogsHeadData" :tabodyData="wafLogsBodyData" :totalNum="wafTotalNum" @getChangeLogData="getWaflogs" :isLogLoding="wafLoading"></log-tables>
      </el-tab-pane>

      <el-tab-pane :label="$t('lg.fangwen')" name="access" v-if="adminRoles || !auditRoles">
        <log-rebuild :tableKeyArr='tableKeyArrAccess' :dynamicTag='aceLogsHeadData' :key='5' @refilterColBy='refilterColByAccess' @requeryRowBy='requeryRowByAccess'></log-rebuild>
        <log-tables ref="log_tablesAccess" :isZhEn="isen" :logType="logsActiveName" :key='6' :tabheadData="aceLogsHeadData" :tabodyData="aceLogsBodyData" :totalNum="aceTotalNum" @getChangeLogData="getAccesslogs" :isLogLoding="accessLoading" :passquerystring="passQuerystring" :showSDURLMenu='showSDURLMenu'></log-tables>
      </el-tab-pane>

      <el-tab-pane :label="$t('lg.shenjiriz')" name="audit" v-if="adminRoles || auditRoles">
        <log-rebuild :tableKeyArr='tableKeyArrAudit' :dynamicTag='audLogsHeadData' :key='7' :newtype="logsActiveName" @refilterColBy='refilterColByAudit' @requeryRowBy='requeryRowByAudit'></log-rebuild>
        <log-tables ref="log_tablesAudit" :isZhEn="isen" :logType="logsActiveName" :key='8' :tabheadData="audLogsHeadData" :tabodyData="audLogsBodyData" :totalNum="audTotalNum"  @getChangeLogData="getAuditlogs" :isLogLoding="auditLoading"></log-tables>
      </el-tab-pane>

      <el-tab-pane :label="$t('lg.errorlog')" name="error" v-if="adminRoles || !auditRoles">
        <log-tables :logType="logsActiveName" :isZhEn="isen" :key='3' :tabheadData="errLogsHeadData" :tabodyData="errLogsBodyData" :totalNum="errTotalNum"  @getChangeLogData="getErrorlogs" :isLogLoding="errorLoading"></log-tables>
      </el-tab-pane>
      <!-- <el-tab-pane :label="$t('lg.systemlog')" name="system" v-if="adminRoles || !auditRoles">
        <log-tables :logType="logsActiveName" :isZhEn="isen" :key='3' :tabheadData="systemLogsHeadData" :tabodyData="systemLogsBodyData" :totalNum="systemTotalNum"  @getChangeLogData="getSystemlogs" :isLogLoding="systemLoading"></log-tables>
      </el-tab-pane>
      <el-tab-pane :label="$t('lg.managepllog')" name="cm" v-if="adminRoles || !auditRoles">
        <el-form ref="cmform" :model="cmform" label-width="80px">
        <el-form-item :label="$t('lg.loglevel')">
          <el-select v-model="cmform.level" :placeholder="$t('lg.select')" @change="cmlogs">
            <el-option label="INFO" value="INFO"></el-option>
            <el-option label="WARN" value="WARN"></el-option>
            <el-option label="ERROR" value="ERROR"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
        <log-tables :logType="logsActiveName" :isZhEn="isen" :tabheadData="cmLogsHeadData" :isShowPage="isShowPage" :tabodyData="cmLogsBodyData" :totalNum="cmTotalNum"  @getChangeLogData="getCmlogs" :isLogLoding="cmLoading"></log-tables>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from "@/store/types";
import client from "@/components/es/connection";
import toSddate from "@/assets/js/tosddate";
import toISO8601 from "@/assets/js/iso8601";
import Emitter from "element-ui/src/mixins/emitter"; //使得其子孙组件能直接调用父组件的方法等等作用  
import {logskeys,logskeys2} from "@/assets/js/logskeys";
import logTables from "@/components/logs/logTables";
import logRebuild from "@/components/logs/logRebuild";
import prmoSearchStr from '@/assets/js/prmoSearch.js'//防护模式、监控模式 不同的查询条件 这里目前只用到防护模式
import {handleAccesslogData , handleWaflogData} from '@/assets/js/tool';
export default {
  mixins: [Emitter],
  componentName: "logs", //给父组件取名，以供后辈组件找到这个父辈组件
  components: {
    logRebuild,
    logTables
  },
  // this.boradcast('ElRadioGroup', 'handleChange', this.model),
  // provide(){   //传值给子孙组件，对应 inject 使用 ，不能传响应式的数据（可把数据改变之后再传给后辈组件）
  //   return{chr:this.logsActiveName}
  // },

  created() {
    this.isencn=localStorage.lang;
    if(this.isencn=="en"){
      this.tableKeyArrAllAccess=logskeys2.access;
      this.tableKeyArrWaf=logskeys2.waf;
      this.tableKeyArrAccess=logskeys2.access;
    }else{
      this.tableKeyArrAllAccess=logskeys.access;
      this.tableKeyArrWaf=logskeys.waf;
      this.tableKeyArrAccess=logskeys.access;
    }
    
    var myRole=sessionStorage.getItem('myRoles');//用户为管理员时，可以有最大权限。为审计时，只能查看日志里面的审计日志，为普通用户时，可查看除审计日志外的其他日志。
    if(myRole=='ADMIN'){
      this.adminRoles=true;
      this.auditRoles=false;
    }else if(myRole=='USER'){
      this.adminRoles=false;
      this.auditRoles=false;
    }else if(myRole=='AUDIT'){
      this.adminRoles=false;
      this.auditRoles=true;
      this.logsActiveName='audit';
      this.getAuditlogs({curPage: this.allAceCurPage, pageNum: this.allAcePageNum})
    }

    this.getCustomHeadData();
    this.getAllAccesslogs({curPage: this.allAceCurPage, pageNum: this.allAcePageNum});
    this.isen=localStorage.getItem('lang')=="en"?true:false;
  },
  watch: {
    "$store.state.mydatedata.timestampnow": function() {
      this.logsHandleClick({name:this.logsActiveName})
    }
  },
  data() {
    return {
      isencn:'cn',
      dewhea:[
    { 
      propName:'hostname',
      colWidth:'130',
      "field":"host.hostname",
      "zh":"攻击的节点名",
      "em":"hostname",
      "type":"keyword"
    },
    { 
      propName:'clientip',
      colWidth:'120',
      "field":"shadow.waf.clientip",
      "zh":"攻击的源IP",
      "em":"clientip",
      "type":"keyword"
    },
    { 
      propName:'cityName',
      colWidth:'100',
      "field":"shadow.waf.geoip.city_name",
      "zh":"地域",
      "em":"city_name",
      "type":"keyword"
    },
    { 
      propName:'attacktype',
      colWidth:'110',
      "field":"shadow.waf.attacktype",
      "zh":"攻击方法",
      "em":"attacktype",
      "type":"keyword"
    },
    { 
      propName:'host',
      colWidth:'150',
      "field":"shadow.waf.host",
      "zh":"攻击的业务域名",
      "em":"host",
      "type":"keyword"
    },
    { 
      propName:'uri',
      colWidth:'260',
      "field":"shadow.waf.uri",
      "zh":"攻击的URI",
      "em":"waf-uri",
      "type":"keyword"
    },
    { 
      propName:'attackcontent',
      colWidth:'120',
      "field":"shadow.waf.attackcontent",
      "zh":"攻击的对象",
      "em":"attack-content",
      "type":"keyword"
    }
  ],
      deauheader:[
    { 
      propName:'name',
      colWidth:'100',

      "field":"json.userName",
      "zh":"用户名",
      "em":"name",
      "type":"keyword"
    },
    { 
      propName:'method',
      colWidth:'100',

      "field":"json.method",
      "zh":"请求方式",
      "em":"method",
      "type":"text"
    },
    { 
      propName:'queryPara',
      colWidth:'200',

      "field":"json.urlParam",
      "zh":"请求参数",
      "em":"query Paramters",
      "type":"text"
    },
    { 
      propName:'bodyParam',
      colWidth:'200',

      "field":"json.bodyParam",
      "zh":"请求内容",
      "em":"body Paramters",
      "type":"text"
    },
    { 
      propName:'remoteAddress',
      colWidth:'120',

      "field":"json.ip",
      "zh":"源ip",
      "em":"remoteAddress",
      "type":"text"
    },
    { 
      propName:'uri',
      colWidth:'300',

      "field":"json.uri",
      "zh":"API接口",
      "em":"request api",
      "type":"text"
    },
    { 
      propName:'status',
      colWidth:'100',

      "field":"json.status",
      "zh":"响应码",
      "em":"response status",
      "type":"text"
    }
  ],
      defHeaderData:[
        { 
          propName:'hostname',
          colWidth:'130',
          "field":"host.hostname",
          "zh":this.$t('lg.visitnodename'),
          "em":"hostname",
          "type":"keyword"
        },
        {
      propName:'errorCodeTxt',
      colWidth:'200',
      "field":"shadow.access.error_code_txt",
      "zh":this.$t('lg.accesstype'),
      "em":"error_code_txt",
      "type":"long"
    },
    {
      propName:'responseCode',
      colWidth:'110',
      "field":"shadow.access.response_code",
      "zh":this.$t('lg.rscode'),
      "em":"response_code",
      "type":"long"
    },
    { 
      propName:'scheme',
      colWidth:'200',
      "field":"shadow.access.scheme",
      "zh":"scheme",
      "em":"scheme",
      "type":"keyword"
    },
    { 
      propName:'method',
      colWidth:'110',
      "field":"shadow.access.method",
      "zh":this.$t('lg.request'),
      "em":"method",
      "type":"keyword"
    },
    {
      propName:'domain',
      colWidth:'200',
      "field":"shadow.access.domain",
      "zh":this.$t('lg.accessbsdomain'),
      "em":"domain",
      "type":"keyword"
    },
    {
      propName:'shadowUrl',
      colWidth:'450',  
      "field":"shadow.access.shadow_url",
      "zh":this.$t('lg.userrequesturl'),
      "em":"shadow_url",
      "type":"keyword"
    },
    {
      propName:'errorCode',
      colWidth:'120',
      "field":"shadow.access.error_code",
      "zh":this.$t('lg.dynamicfilter'),
      "em":"error_code",
      "type":"long"
    },
    { 
      propName:'remoteIp',
      colWidth:'130',
      "field":"shadow.access.remote_ip",
      "zh":this.$t('lg.sourceip'),
      "em":"remote_ip",
      "type":"keyword"
    }
      ],
      adminRoles:false,
      auditRoles:false,
      logsActiveName: "allaccess",
      allAccessLoading: false,
      tableKeyArrAllAccess:[...logskeys.access],
      allAceLogsHeadData: [],
      allAceLogsBodyData: [],
      allAceCurPage: 1, //当前页码
      allAcePageNum: 10, //每页条数
      allAceTotalNum: 0, //总条数

      passQuerystring:{},

      // waf.log
      wafLoading: false,//loading
      tableKeyArrWaf:[...logskeys.waf],
      wafLogsHeadData: [], 
      wafLogsBodyData: [], 
      wafCurPage: 1, //当前页码
      wafPageNum: 10, //每页条数
      wafTotalNum: 0, //总条数

      //access.log
      accessLoading: false,
      tableKeyArrAccess:[...logskeys.access],
      aceLogsHeadData: [],
      aceLogsBodyData: [],
      aceCurPage: 1, //当前页码
      acePageNum: 10, //每页条数
      aceTotalNum: 0, //总条数

      //audit.log
      auditLoading:false,
      tableKeyArrAudit:[...logskeys.audit],
      audLogsHeadData: [],
      audLogsBodyData: [],
      audCurPage: 1, //当前页码
      audPageNum: 10, //每页条数
      audTotalNum: 0, //总条数

      //error.log
      errorLoading: false, 
      errLogsHeadData: [],
      errLogsBodyData: [],
      errCurPage: 1, //当前页码
      errPageNum: 10, //每页条数
      errTotalNum: 0, //总条数

      systemLoading: false, 
      systemLogsHeadData:[],
      systemLogsBodyData:[],
      systemCurPage: 1, //当前页码
      systemPageNum: 10, //每页条数
      systemTotalNum: 0, //总条数

      cmLoading: false, 
      cmLogsHeadData:[],
      cmLogsBodyData:[],
      cmCurPage: 1, //当前页码
      cmPageNum: 10, //每页条数
      cmTotalNum: 0, //总条数
      cmform:{
        level:''
      },
      isShowPage:false,
      filterObj: {"match_all": {}}, 
      keyObj:{
        allaccess:'logsAllAccess',
        waf:'logsWaf',
        access:'logsAccess',
        audit:'logsAudit'
      },
      isen:false
    };
  },
  methods: {
    logsHandleClick(tab, event) {
      if(event){
        this.allAceLogsBodyData = [];
        this.wafLogsBodyData = []; 
        this.aceLogsBodyData = [];
        this.audLogsBodyData = [];
        this.errLogsBodyData = [];
        this.systemLogsBodyData=[];
        this.cmLogsBodyData=[];
        this.cmform.level="";
        this.isShowPage=false;
        this.broadcast('logRequery',"clearData");//for the query and nothing is 
        this.filterObj = {"match_all": {}};
      }

      const tabName = tab.name;
      const funLogObj = {
        allaccess: {
          curPage: this.allAceCurPage,
          pageNum: this.allAcePageNum,
          getLogsFun: this.getAllAccesslogs
        },
        waf: {
          curPage: this.wafCurPage,
          pageNum: this.wafPageNum,
          getLogsFun: this.getWaflogs
        },
        access: {
          curPage: this.aceCurPage,
          pageNum: this.acePageNum,
          getLogsFun: this.getAccesslogs
        },
        audit: {
          curPage: this.audCurPage,
          pageNum: this.audPageNum,
          getLogsFun: this.getAuditlogs
        },
        error: {
          curPage: this.errCurPage,
          pageNum: this.errPageNum,
          getLogsFun: this.getErrorlogs
        },
        system: {
          curPage: this.systemCurPage,
          pageNum: this.systemPageNum,
          getLogsFun: this.getSystemlogs
        },
        cm: {
          curPage: this.cmCurPage,
          pageNum: this.cmPageNum,
          getLogsFun: this.getCmlogs
        }
      }
      this.$nextTick(() => {
        funLogObj[tabName].getLogsFun({curPage: funLogObj[tabName].curPage, pageNum: funLogObj[tabName].pageNum})
      })
    },
    getUserDm(){
      return new Promise((resolve,reject)=>{
        let name=sessionStorage.getItem("myname");
        var url = SERVER_API_URL + 'pe/shadow/user/accessdomain/'+name;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resdata=res.data.data;
            let resdatadm;
            if(resdata && resdata.domains){
              resdatadm=resdata.domains || [];
            }
            resolve(resdatadm || [])
          }else{
            reject("error")
          }
        })
      });
    },
    getCustomHeadData() {
      var url = SERVER_API_URL + `pe/shadow/kv/${this.keyObj.allaccess}`;
      axios.get(url).then(res =>{
        if(!res.data.data){
          this.allAceLogsHeadData = this.defHeaderData;
        }else{
          this.allAceLogsHeadData = res.data.data.value;
        }
      })
      var url = SERVER_API_URL + `pe/shadow/kv/${this.keyObj.waf}`;
      axios.get(url).then(res =>{
        if(!res.data.data){
          this.wafLogsHeadData = this.dewhea;
        }else{
          this.wafLogsHeadData = res.data.data.value;
        }
      })
      var url2 = SERVER_API_URL + `pe/shadow/kv/${this.keyObj.access}`
      axios.get(url2).then(res =>{
        if(!res.data.data){
          this.aceLogsHeadData = this.defHeaderData;
        }else{
          this.aceLogsHeadData = res.data.data.value;
        }
      })
      var url3 = SERVER_API_URL + `pe/shadow/kv/${this.keyObj.audit}`
      axios.get(url3).then(res =>{
        if(!res.data.data){
         this.audLogsHeadData = this.deauheader;
        }else{
          this.audLogsHeadData = res.data.data.value;
        }
      })
    },
    getAllAccesslogs(pageObj) {
     // console.log("-------")
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;//获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.allAccessLoading = true;
      let passqueryStringObj={
          "track_total_hits": true, 
          sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              filter: _this.filterObj,
              must: [
                {
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                {
                  exists: {
                    field: "shadow.access.method"
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      gte: fromTime,
                      lte: endTime
                    }
                  }
                }
              ]
            }
          }
        };
      _this.passQuerystring=JSON.stringify(passqueryStringObj);
      this.getUserDm().then((reslovedata)=>{
        if(sessionStorage.getItem("myRoles")=="ADMIN"){
          passqueryStringObj.query.bool.must.shift();
        }
        let ri;
        for(let i=0;i<reslovedata.length;i++){
          ri=reslovedata[i];
          passqueryStringObj.query.bool.must[0].bool.should.push(
            {
              "match":{
                "shadow.access.http_host":ri
              }
            }
          )
        }
      _this.passQuerystring=JSON.stringify(passqueryStringObj);

      client.search({
        index: "shadow-filebeat*",
        from: fromNum,
        size: sizeNum,
        body: passqueryStringObj
      }).then(res => {
       //  console.log(res)
        _this.allAceTotalNum = res.hits.total.value;
        let logResArr = res.hits.hits;
        // 获取access.log表体数据 
        _this.allAceLogsBodyData = handleAccesslogData(logResArr);
        _this.allAccessLoading = false;
      }).catch(err => {
        console.log(err);
      });
      });
    },
    getWaflogs(pageObj) {//恶意攻击 获取waf.log表体数据
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;//获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toSddate(sttime),
          endTime2 = toSddate(edtime);
      var fromTime =fromTime2 ||toSddate(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toSddate(new Date());
      _this.wafLoading = true;
      let passqueryStringObj={
        sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              filter: _this.filterObj,
              must_not: {
                exists: {
                  field: "error"
                }
              },
              must: [
                {
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                {
                  term: {
                    "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      from: fromTime,
                      to: endTime,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }
              ]
            }
          }
      };
    this.getUserDm().then((reslovedata)=>{
      if(sessionStorage.getItem("myRoles")=="ADMIN"){
          passqueryStringObj.query.bool.must.shift();
      }
      let ri;
      for(let i=0;i<reslovedata.length;i++){
        ri=reslovedata[i];
        passqueryStringObj.query.bool.must[0].bool.should.push(
          {
            "match":{
              "shadow.access.http_host":ri
            }
          }
        )
      }
      client.search({
        index: "shadow-filebeat*",
        from: fromNum,
        size: sizeNum,
        body: passqueryStringObj
      }).then(res => {
        // console.log(res)
        _this.wafTotalNum = res.hits.total.value;
        let logResArr = res.hits.hits;

        // 获取waf.log表体
        _this.wafLogsBodyData = handleWaflogData(logResArr);
        _this.wafLoading = false;
      }).catch(err => {
        console.log(err);
      });
    });

    },
    getAccesslogs(pageObj) {//恶意访问 获取access.log表体数据
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;//获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.accessLoading = true;
      let passqueryStringObj={
          sort: {
            "@timestamp": "desc"
          },
          "track_total_hits": true, 
          query: {
            bool: {
              filter: _this.filterObj,
              must: [
               // ...prmoSearchStr['protectChart']['a1'],
               {
                  bool:{
                    should:[],
                    "minimum_should_match": 1
                  }
                },
                {
                  exists: {
                    field: "shadow.access.method"
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      gte: fromTime,
                      lte: endTime
                    }
                  }
                }
              ]
            }
          }
        };
        _this.passQuerystring=JSON.stringify(passqueryStringObj);

      this.getUserDm().then((reslovedata)=>{
        if(sessionStorage.getItem("myRoles")=="ADMIN"){
            passqueryStringObj.query.bool.must.shift();
        }
        let ri;
        for(let i=0;i<reslovedata.length;i++){
          ri=reslovedata[i];
          passqueryStringObj.query.bool.must[0].bool.should.push(
            {
              "match":{
                "shadow.access.http_host":ri
              }
            }
          )
        }
        _this.passQuerystring=JSON.stringify(passqueryStringObj);
      client.search({
        index: "shadow-filebeat-warn*",
        from: fromNum,
        size: sizeNum,
        body: passqueryStringObj
      }).then(res => {
        _this.aceTotalNum = res.hits.total.value;
      //  console.log(_this.aceTotalNum)
        let logResArr = res.hits.hits;
        // 获取access.log表体数据
        _this.aceLogsBodyData = handleAccesslogData(logResArr);

        _this.accessLoading = false;
      }).catch(err => {
        console.log(err);
      });
    });

    },
    getAuditlogs(pageObj){
      var _this = this;
      var fromNum = 0, sizeNum = 0;  //获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.auditLoading = true;

      var searchAuditObj={
          // size: 10,
          "sort": [
            {
              "json.timestamp": {
                "order": "desc"
              }
            }
          ],
          "query": {
            "bool": {
              filter: _this.filterObj,
              "must": [
                {
                  "term": {
                    "tags":  "audit"
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      gte: fromTime,
                      lte: endTime
                    }
                  }
                }
              ]
            }
          }
        };

       client.search({
        index: "cm-audit-*",
        from: fromNum,
        size: sizeNum,
        body: {
          // size: 10,
          // sort: {
          //   "@timestamp": "desc"
          // },
          query: {
            bool: {
              filter: _this.filterObj,
              "must": [
                {
                  range: {
                    "@timestamp": {
                      gte: fromTime,
                      lte: endTime
                    }
                  }
                }
              ]
            }
          }
        }
      }).then(res => {
       //  console.log(res)
        // _this.audTotalNum = res.data.data.hits.total.value;
         // let logResArr = res.data.data.hits.hits;

          _this.audTotalNum = res.hits.total.value;
          let logResArr = res.hits.hits;

          // 获取audit.log表体数据
          var iso8601 = _this.$options.filters["iso8601"]; //获取使用局部的filter
          var toSdDate=_this.$options.filters["toSdDate"];
          let bodyArr = [];

          logResArr.forEach(ele => {
            // console.log(ele)
            var eleSource = ele._source.json;
            var audLogsItem = {};

           // audLogsItem.date = iso8601(eleSource["timestamp"]);
            audLogsItem.date = toSdDate(eleSource["timestamp"]);
            audLogsItem.name = eleSource.userName;
            audLogsItem.method = eleSource.method;
            audLogsItem.queryPara = eleSource.urlParam;
            audLogsItem.bodyParam = eleSource.bodyParam;
            audLogsItem.remoteAddress = eleSource.ip;
            // audLogsItem.uri = eleSource.request.uri;
            audLogsItem.uri = eleSource.desc?eleSource.uri+'（说明:'+eleSource.desc+'）':eleSource.uri;
            audLogsItem.status = eleSource.status;
           // audLogsItem.timeTaken = eleSource.timeTaken;

            bodyArr.push(audLogsItem);
          });
         //  console.log(bodyArr)
          _this.audLogsBodyData = bodyArr;
          _this.auditLoading = false;
      }).catch(err => {
        console.log(err);
      });

      
    },
    getAuditlogs444(pageObj){ //
      var _this = this;
      var fromNum = 0, sizeNum = 0;  //获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.auditLoading = true;

      var searchAuditObj={
          // size: 10,
          "sort": [
            {
              "json.timestamp": {
                "order": "desc"
              }
            }
          ],
          "query": {
            "bool": {
              filter: _this.filterObj,
              "must": [
                {
                  "term": {
                    "tags":  "audit"
                  }
                },
                {
                  range: {
                    "@timestamp": {
                      gte: fromTime,
                      lte: endTime
                    }
                  }
                }
              ]
            }
          }
        };

      var url = SERVER_API_URL + 'pe/shadow/audit?page='+fromNum+'&size='+sizeNum;
      axios.post(url,searchAuditObj).then(res=>{
        // console.log(res)
        if(res.data.responseCode==0){
          _this.audTotalNum = res.data.data.hits.total.value;
          let logResArr = res.data.data.hits.hits;

          // 获取audit.log表体数据
          var iso8601 = _this.$options.filters["iso8601"]; //获取使用局部的filter
          var toSdDate=_this.$options.filters["toSdDate"];
          let bodyArr = [];

          logResArr.forEach(ele => {
            // console.log(ele)
            var eleSource = ele._source.json;
            var audLogsItem = {};

           // audLogsItem.date = iso8601(eleSource["timestamp"]);
            audLogsItem.date = toSdDate(eleSource["timestamp"]);
            audLogsItem.name = eleSource.principal.name;
            audLogsItem.method = eleSource.request.method;
            audLogsItem.queryPara = eleSource.request.queryPara;
            audLogsItem.remoteAddress = eleSource.request.remoteAddress;
            // audLogsItem.uri = eleSource.request.uri;
            audLogsItem.uri = eleSource.request.description?eleSource.request.uri+'（说明:'+eleSource.request.description+'）':eleSource.request.uri;
            audLogsItem.status = eleSource.response.status;
            audLogsItem.timeTaken = eleSource.timeTaken;

            bodyArr.push(audLogsItem);
          });
          // console.log(bodyArr)
          _this.audLogsBodyData = bodyArr;
          _this.auditLoading = false;
         
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getErrorlogs(pageObj) {//错误日志
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;  //获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toSddate(sttime),
          endTime2 = toSddate(edtime);
      var fromTime = fromTime2 || toSddate(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toSddate(new Date());
      _this.errorLoading = true;
      client.search({
        index: "shadow-filebeat*",
        from: fromNum,
        size: sizeNum,
        body: {
          // size: 10,
          sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              "filter":[
                {
                  range: {
                    "@timestamp": {
                      from: fromTime,
                      to: endTime,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }
              ],
              must: [
                {
                  term: {
                    "log.file.path": "/usr/local/shadow/logs/error.log"
                  }
                }
              ],
              must_not: [
                {
                  match: {
                    "shadow.access.token":"00000000000000000000000000000000"
                  }
                },
                {
                  match: {
                    "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                  }
                },
                {
                  match: {
                    "shadow.error.level": "notcie"
                  }
                },
                {
                  exists: {
                    field: "error"
                  }
                }
              ]
            }
          }
        }
      }).then(res => {
        // console.log(res)
        _this.errTotalNum = res.hits.total.value;
        let logResArr = res.hits.hits;

        // 获取error.log表头数据
        let errArr = logskeys.error;
        _this.errLogsHeadData = errArr;

        // 获取error.log表体数据
        var toSdDate = _this.$options.filters["toSdDate"]; //获取使用局部的filter
        let bodyArr = [];
        logResArr.forEach(ele => {
          // console.log(ele)
          var eleSource = ele._source;
          var errLogsItem = {};

          errLogsItem.date = toSdDate(eleSource["read_timestamp"]);
          errLogsItem.level = eleSource.shadow.error.level;
          errLogsItem.message = eleSource.shadow.error.message;

          bodyArr.push(errLogsItem);
        });
        _this.errLogsBodyData = bodyArr;
        _this.errorLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },
    getSystemlogs(pageObj) {//system日志
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;  //获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.systemLoading = true;
      client.search({
        index: "cm-system-*",
        from: fromNum,
        size: sizeNum,
        body: {
          // size: 10,
          sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              "filter":[
                {
                  range: {
                    "@timestamp": {
                      from: fromTime,
                      to: endTime,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }
              ]
            }
          }
        }
      }).then(res => {
       //  console.log(res)
         _this.systemTotalNum = res.hits.total.value;
         let logResArr = res.hits.hits;

        // 获取error.log表头数据
        let systemArr = logskeys.system;
        _this.systemLogsHeadData = systemArr;

        // 获取error.log表体数据
        var toSdDate = _this.$options.filters["toSdDate"]; //获取使用局部的filter
        let bodyArr = [];
        logResArr.forEach(ele => {
          // console.log(ele)
          var eleSource = ele._source;
          var errLogsItem = {};

          errLogsItem.date = toSdDate(eleSource["@timestamp"]);
          errLogsItem.name = eleSource.process.name;
          errLogsItem.message = eleSource.message;

          bodyArr.push(errLogsItem);
        });
        _this.systemLogsBodyData = bodyArr;
        _this.systemLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },
    cmlogs(item){
      var _this = this;
      // let pageObj={curPage: 1, pageNum: 1000};
      // var fromNum = 0, sizeNum = 0;  //获取页面参数
      // fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      // sizeNum = pageObj.pageNum;
      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.cmLoading = true;
      _this.cmLogsBodyData =[];
      client.search({
        index: "cm-log-*",
        from: 0,
        size: 1000,
        body: {
          // size: 10,
          sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              "filter":[
                {
                  range: {
                    "@timestamp": {
                      from: fromTime,
                      to: endTime,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }
              ],
              must: [
                {
                  match: {
                    "cm.level":item
                  }
                }
              ],
            }
          }
        }
      }).then(res => {
       //  console.log(res)
         _this.cmTotalNum = 0;
         _this.isShowPage=true;
         let logResArr = res.hits.hits;

        // 获取error.log表头数据
        let systemArr = logskeys.cm;
        _this.cmLogsHeadData = systemArr;

        // 获取error.log表体数据
        var toSdDate = _this.$options.filters["toSdDate"]; //获取使用局部的filter
        let bodyArr = [];
        var eleSource;
        var errLogsItem;
        logResArr.forEach(ele => {
          errLogsItem = {};
          eleSource = ele._source;
          if(eleSource.cm){
            errLogsItem.date = toSdDate(eleSource["@timestamp"]);
            errLogsItem.pid = eleSource.cm.pid;
            errLogsItem.level = eleSource.cm.level;
            errLogsItem.message = eleSource.cm.message;
            errLogsItem.system_info = eleSource.cm.system_info;
            errLogsItem.class_name = eleSource.cm.class_name;
            _this.cmLogsBodyData.push(errLogsItem);
          }
          
        });
       // _this.cmLogsBodyData = bodyArr;
        _this.cmLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },
    getCmlogs(pageObj) {//cm日志
      // console.log(pageObj)
      var _this = this;
      var fromNum = 0, sizeNum = 0;  //获取页面参数
      fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
      sizeNum = pageObj.pageNum;

      var sttime = _this.$store.state.mydatedata.starttime,
          edtime = _this.$store.state.mydatedata.endtime;
      var fromTime2 = toISO8601(sttime),
          endTime2 = toISO8601(edtime);
      var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
          endTime = endTime2 || toISO8601(new Date());
      _this.cmLoading = true;
      _this.cmLogsBodyData =[];
      let bodyArr = [];
      client.search({
        index: "cm-log-*",
        from: fromNum,
        size: sizeNum,
        body: {
          // size: 10,
          sort: {
            "@timestamp": "desc"
          },
          query: {
            bool: {
              "filter":[
                {
                  range: {
                    "@timestamp": {
                      from: fromTime,
                      to: endTime,
                      include_lower: true,
                      include_upper: true
                    }
                  }
                }
              ]
            }
          }
        }
      }).then(res => {
       //  console.log(res)
         _this.cmTotalNum = res.hits.total.value;
        // _this.isCmPageShowByQ=false;
         let logResArr = res.hits.hits;

        // 获取error.log表头数据
        let systemArr = logskeys.cm;
        _this.cmLogsHeadData = systemArr;

        // 获取error.log表体数据
        var toSdDate = _this.$options.filters["toSdDate"]; //获取使用局部的filter
        
        var eleSource;
        var errLogsItem;
        logResArr.forEach(ele => {
          errLogsItem = {};
          eleSource = ele._source;
          if(eleSource.cm){
            errLogsItem.date = toSdDate(eleSource["@timestamp"]);
            errLogsItem.pid = eleSource.cm.pid;
            errLogsItem.level = eleSource.cm.level;
            errLogsItem.message = eleSource.cm.message;
            errLogsItem.system_info = eleSource.cm.system_info;
            errLogsItem.class_name = eleSource.cm.class_name;
            _this.cmLogsBodyData.push(errLogsItem);
          }
          
        });
       // _this.cmLogsBodyData = bodyArr;
        _this.cmLoading = false;
      }).catch(err => {
        console.log(err);
      });
    },
    requeryRowByAllAccess(obj){ //用户通过requery孙组件筛选access.log显示的行
      this.filterObj=obj.requeryObj;
      this.getAllAccesslogs({curPage: this.allAceCurPage, pageNum: this.allAcePageNum});
      if(this.$refs.log_tablesAllAccess) this.$refs.log_tablesAllAccess.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    requeryRowByWaf(obj){ //用户通过requery孙组件筛选waf.log显示的行
      this.filterObj=obj.requeryObj;//拿到查询条件
      this.getWaflogs({curPage: this.wafCurPage, pageNum: this.wafPageNum });//再次调用查询
      if(this.$refs.log_tablesWaf) this.$refs.log_tablesWaf.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    requeryRowByAccess(obj){ //用户通过requery孙组件筛选access.log显示的行
      this.filterObj=obj.requeryObj;
      this.getAccesslogs({curPage: this.aceCurPage, pageNum: this.acePageNum });
      if(this.$refs.log_tablesAccess) this.$refs.log_tablesAccess.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    requeryRowByAudit(obj){ //用户通过requery孙组件筛选audit.log显示的行
      this.filterObj=obj.requeryObj;
      this.getAuditlogs({curPage: this.audCurPage, pageNum: this.audPageNum });
      if(this.$refs.log_tablesAudit) this.$refs.log_tablesAudit.tabCurPage=1;//当用户点击查询后，查询结果的页码要回到第一页
    },
    refilterColByAllAccess(obj){
      var url = SERVER_API_URL + `pe/shadow/kv`;
      axios.post(url,{logsAllAccess:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{logsAllAccess:obj}).then(res=>{
          })
        }
      })
      this.allAceLogsHeadData = obj;
    },
    refilterColByWaf(obj){ //用户通过refilter孙组件筛选waf.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      var url = SERVER_API_URL + `pe/shadow/kv`;
      axios.post(url,{logsWaf:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{logsWaf:obj}).then(res=>{
          })
        }
      })
      this.wafLogsHeadData = obj;
    },
    refilterColByAccess(obj){ //用户通过refilter孙组件筛选access.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      var url = SERVER_API_URL + `pe/shadow/kv`;
      axios.post(url,{logsAccess:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{logsAccess:obj}).then(res=>{
          })
        }
      })
      this.aceLogsHeadData = obj;
    },
    refilterColByAudit(obj){//用户通过refilter孙组件筛选audit.log显示的列，删除或者增加字段显示的时候变化头部，发送用户增删请求
      var url = SERVER_API_URL + `pe/shadow/kv`;
      axios.post(url,{logsAudit:obj}).then(res=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{logsAudit:obj}).then(res=>{
          })
        }
      })
      this.audLogsHeadData = obj;
    },

    showSDURLMenu(index) { //右键点击对应字段 显示 表里面该字段的菜单
      this.aceLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
      // this.accesslogsData[index].showUMenuList=true;
      this.$set(this.aceLogsBodyData[index], "showUMenuList", true);
    },
    hideSDURLMenu() { //左键任意点击全局 隐藏 表里面字段的菜单
      this.aceLogsBodyData.forEach(items => {
        items.showUMenuList = false;
      });
    }
  },
  filters: {
    toSdDate(val) {
      if (!val) return;
      var d = new Date(val);
      function pad(n) {
        return n < 10 ? "0" + n : n;
      }
      return (d.getFullYear() +"/" +pad(parseInt(d.getMonth()) + 1) +"/" +pad(d.getDate()) +" " +pad(d.getHours()) +":" +pad(d.getMinutes()) +":" +pad(d.getSeconds()));
    },
    iso8601(val) {
      if(!val) return;
      var d = new Date(val);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return (d.getUTCFullYear()+'/' + pad(d.getUTCMonth()+1)+'/' + pad(d.getUTCDate())+' ' + pad(d.getUTCHours())+':' + pad(d.getUTCMinutes())+':' + pad(d.getUTCSeconds()));
    }
  }
};
</script>
<style>
.logs-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 5px 15px 15px;
  box-sizing: border-box;
  overflow: hidden;
}
.logs-wrapper .big-tabs{
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.logs-wrapper .el-tabs__content{
  flex:1;
}
.logs-wrapper .el-tab-pane{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.icon-row {
  line-height: 40px;
}
.icon-row i {
  cursor: pointer;
  margin-right: 8px;
}
</style>
