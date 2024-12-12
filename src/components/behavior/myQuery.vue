<template>
  <div>
    <el-form class="form-bg" ref="queryform" :model="queryform" :rules="queryformformRules" :label-width="$store.state.isencn=='en'?'100px':'55px'">
      <el-form-item :label="$t('lg.rizhi')+':'" prop='logId'>
        <el-select v-model="queryform.logId" :placeholder="$t('lg.selectlog')" @change="getFields()" :disabled="isClickNext">
          <el-option
            v-for="(item,index) in queryform.logarr"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>    
      </el-form-item>
      <div v-for="(items,n) in queryform.tmpsArray" :key="n">
        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item :label="n==0?$t('lg.query')+':':''" :prop="'tmpsArray.' + n + '.keyId'" :rules="{required: true, message: $t('lg.required'), trigger: 'blur'}">
              <el-select v-model="items.keyId" :placeholder="$t('lg.field')" @change="queryType(items.keyId,n)" style="width:100%" :disabled="isClickNext">
                <el-option
                  v-for="(item,index) in queryform.keyarr"
                  :key="index"
                  :label="item.zh"
                  :value="item.field">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="0px" :prop="'tmpsArray.' + n + '.symbolId'" :rules="{required: true, message: $t('lg.required'), trigger: 'blur'}">
              <el-select v-model="items.symbolId" :placeholder="$t('lg.operator')" :disabled="isClickNext">
                <el-option
                  v-for="(item,index) in queryform.tmpsArray[n].symbol"
                  :key="index"
                  :label="item.value"
                  :value="item.lable">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="0px" :prop="'tmpsArray.' + n + '.keyinputId'" :rules="items.queryTypes=='long'?keyinputIdRulesNum:keyinputIdRules">
              <el-input v-model.trim="items.keyinputId" placeholder="" :disabled="isClickNext"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-select v-model="items.andorId" :disabled="isClickNext">
              <el-option
                v-for="(item,index) in queryform.andor"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3" class="icon-row">
            <i class="el-icon-plus" @click="isClickNext?'':addQuery()"></i>
            <i class="el-icon-minus" @click="isClickNext?'':delTmp(n)"></i>
          </el-col>
        </el-row>
      </div>
        
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item :label="$t('lg.aggregation')+':'" prop='aggsId'>
              <el-select v-model="queryform.aggsId" :placeholder="$t('lg.aggfield')" clearable style="width:100%" :disabled="isClickNext">
              <el-option
                v-for="(item,index) in queryform.keyarr"
                :key="index"
                :label="item.zh"
                :value="item.field">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       
      <el-row :gutter="10" v-if="queryform.aggsId">
        <el-col :span="13">
          <el-form-item :label="$t('lg.metric')+':'" prop="metricId">
            <el-select v-model="queryform.metricId" :placeholder="$t('lg.select')" style="width:100%" :disabled="isClickNext">
              <el-option
                v-for="(item,index) in queryform.metrics"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0px" prop="symbol2Id">
            <el-select v-model="queryform.symbol2Id" :placeholder="$t('lg.operator')" style="width:100%" :disabled="isClickNext">
              <el-option
                v-for="(item,index) in queryform.symbol2"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label-width="0px" prop="metricinputId">
            <el-input v-model="queryform.metricinputId" placeholder="" :disabled="isClickNext"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="isCustomQuery">
        <el-button type="primary" @click="multiQuery({curPage:myQryCurPage,pageNum:myQryPageNum},true)">{{$t('lg.query')}}</el-button>
        <el-button type="primary" @click="timeTask">{{$t('lg.astask')}}</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button type="success" @click="timeTask" size="small" v-show="!isClickNext">{{$t('lg.next')}} <i class="el-icon-d-arrow-right"></i></el-button>
        <el-button type="success" @click="editQueryStep" size="small" v-show="isClickNext"><i class="el-icon-d-arrow-left"></i> {{$t('lg.edit')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import client from "@/components/es/connection";
import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import {logskeys} from '@/assets/js/logskeys';
import {handleAccesslogData , handleWaflogData} from '@/assets/js/tool';
export default {
  props:{
    isCustomQuery:{
      type:Boolean,
    },
    isClickNext:{
      type:Boolean,
    }
  },
  data() {
    return {
      queryform:{
        logarr:['waf.log','access.log','error.log'],
        logId:'',
        aggsId:'',
        tmpsArray:[
          {
            keyId:'',
            queryTypes:'',//判断keyId是keyworld类型还是long类型，long类型时，运算符只能为equals并且对应的查询内容只能是数字
            symbolId:'',
            keyinputId:'',
            andorId:'',
            symbol:[],
          }
        ],
        keyarr:[],
        andor:[
          {
            value:'AND',
            lable:'and'
          },{
            value:'OR',
            lable:'or'
          }
        ],
        metricId:this.$t('lg.quantity'),
        metrics:[this.$t('lg.quantity')],
        symbol2Id:'>',
        symbol2:[
          {
            value:'>',
            lable:'>'
          }
        ],
        metricinputId:1,
      },
      tbodyArr:[],//接收查询结果，用于表格展示
      
      tabHeadArr:[],//传入对应日志的表头数据
      myQryLogsHeadData:[],
      myQryLogsBodyData:[],
      myQryTotalNum:0,
      myQryCurPage:1,//当前页码
      myQryPageNum:10,//每页条数

      isQueryOrAggs:false,//判断是否使用了聚合，使用了聚合，查询结果就用图表展示
      qJson:'',//保存查询语句，用于安排报警任务
      queryformformRules:{
        logId:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'}
        ],
        metricinputId:[
          {pattern:/^[1-9]\d*$/,message:this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },

      keyinputIdRules:[{required: true, message: this.$t('lg.required'), trigger: 'blur'}],
      keyinputIdRulesNum:[{required: true, message: this.$t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: this.$t('lg.number'), trigger: 'change'}],

      filterObj:{"match_all": {}},
      isen:false
    }
  },
  watch:{
    "queryform.tmpsArray.length":function(){//查询条件与查询条件之间的关系，默认OR
      if(this.queryform.tmpsArray.length>1){
        var tLength=this.queryform.tmpsArray.length-2;
        if(this.queryform.tmpsArray[tLength].andorId==''){
          this.queryform.tmpsArray[tLength].andorId='OR';
        }
      }else if(this.queryform.tmpsArray.length==1){
        this.queryform.tmpsArray[0].andorId='';
      }
    },
  },
  methods: {
    // getCustomHeadData(logId){ // 获取waf.log、access.log表头（用户自定义的表头）
    //   if(logId=="waf.log"){
    //       var url = SERVER_API_URL + '/pe/shadow/kv/customQueryWaf';
    //       axios.get(url).then(res =>{
    //         if(!res.data.data){
    //           this.myQryLogsHeadData = [...logskeys.waf]
    //         }else{
    //           this.myQryLogsHeadData = res.data.data.value;
    //         }
    //       })
    //     }else if(logId=="access.log"){
    //       var url2 = SERVER_API_URL + '/pe/shadow/kv/customQueryAccess';
    //       axios.get(url2).then(res =>{
    //         if(!res.data.data){
    //           this.myQryLogsHeadData = [...logskeys.access]
    //         }else{
    //           this.myQryLogsHeadData = res.data.data.value;
    //         }
    //       })
    //     }
    // },
    customQueryClose(){//清空自定义的查询语句，邮件报警页面增加自定义查询报警时（关闭增加自定义查询类型的报警弹框）才用到
      this.$refs['queryform'].resetFields();
    },
    editQueryStep(){//增加自定义查询类型的报警任务时，可以回过头来修改已经创建好的查询语句
      this.$emit("editQueryStep");
    },
    getFields(){//选择日志
      var _this=this;
      let zhen=localStorage.getItem('lang');
      if(zhen=='en'){
        _this.isen=true;
      }
      var logId=_this.queryform.logId;
      if(logId){
        //清空部分查询语句
        _this.queryform.tmpsArray.map(function(v,i){
          v.keyId='';
          v.keyinputId='';
          v.andorId='';
          v.symbolId='';
          v.symbol=[];
        })
        _this.queryform.aggsId='';
        _this.queryform.metricinputId=1;
        
        //选择不同的日志，里面的字段也不同
        let arr=[];
        if(logId=="waf.log"){
          arr=logskeys.waf;
          _this.tabHeadArr=[...logskeys.waf]
        }else if(logId=="access.log"){
          arr=logskeys.access;
           _this.tabHeadArr=[...logskeys.access]
        }else if(logId=="error.log"){
          arr=logskeys.error;
        };
        _this.queryform.keyarr=arr;
        _this.queryform.tmpsArray.length=1;

        // _this.getCustomHeadData(logId);
        if(logId=="waf.log"){
          var url = SERVER_API_URL + '/pe/shadow/kv/customQueryWaf';// 获取waf.log表头（用户自定义的表头）
          axios.get(url).then(res =>{
            if(!res.data.data){
              this.myQryLogsHeadData = [...logskeys.waf]
            }else{
              this.myQryLogsHeadData = res.data.data.value;
            }
            _this.$emit("clearQueryData",{//清空
              "tableKeyArrCustom":arr,
              "cstQryLogsHeadData":this.myQryLogsHeadData,
              "cstQryLogsBodyData":[],
              "type":logId
            });
          })
        }else if(logId=="access.log"){
          var url2 = SERVER_API_URL + '/pe/shadow/kv/customQueryAccess';// 获取access.log表头（用户自定义的表头）
          axios.get(url2).then(res =>{
            if(!res.data.data){
              this.myQryLogsHeadData = [...logskeys.access]
            }else{
              this.myQryLogsHeadData = res.data.data.value;
            }
            _this.$emit("clearQueryData",{
              "tableKeyArrCustom":arr,
              "cstQryLogsHeadData":this.myQryLogsHeadData,
              "cstQryLogsBodyData":[],
              "type":logId
            });
          })
        }else{
          this.myQryLogsHeadData = [...logskeys.error]
          _this.$emit("clearQueryData",{
            "tableKeyArrCustom":arr,
            "cstQryLogsHeadData":this.myQryLogsHeadData,
            "cstQryLogsBodyData":[],
            "type":logId
          });
        }
      }
    },
    queryType(val,i){//判断是keyworld类型还是long类型，long类型时，运算符只能为equals并且对应的查询内容只能是数字
      const keyarr = this.queryform.keyarr;
      this.queryform.tmpsArray[i].symbolId='';//清空
      let queryTypes='';
      keyarr.forEach(function(v){
        if(v.field==val){
          queryTypes=v.type;
        }
      })
      if(queryTypes=='long'){
        this.queryform.tmpsArray[i].symbol=[{
          value:this.$t('lg.dengyu'),
          lable:'equals'
        },
        {
          value:this.$t('lg.budengyu'),
          lable:'notequals'
        }]
      }else{
        this.queryform.tmpsArray[i].symbol=[{
          value:this.$t('lg.dengyu'),
          lable:'equals'
        },{
          value:this.$t('lg.budengyu'),
          lable:'notequals'
        },
        {
          value:this.$t('lg.contain'),
          lable:'contains'
        },
        {
          value:this.$t('lg.nocontain'),
          lable:'notcontains'
        }]
      }
      this.queryform.tmpsArray[i].queryTypes=queryTypes;
    },
    addQuery(){//增加一个查询条件
      this.queryform.tmpsArray.push({
        keyId: '',
        symbolId:'',
        keyinputId:'',
        andorId:'',
        symbol:[]
      });
    },
    delTmp(index){//删除一个查询条件，并至少保留一个查询条件
      if(this.queryform.tmpsArray.length>1){
        this.queryform.tmpsArray.splice(index,1);
      }
    },
    multiQuery(params,loadingFalg){//查询。 注意： params 可能是采样频率（当使用了聚合字段会使查询结果为图表，这时可以改变折线图的采样频率，传入 params 表示查询发生在改变‘采样频率’时），params 也可能是一个对象 （不使用聚合字段会使查询结果为表格，表格有分页功能，此时params表示用户进行分页操作时传入的 分页信息）
      this.$refs['queryform'].validate((valid)=>{
        if(valid){
          //获取页面参数
          // console.log(params)
          var _this=this;
          var fromNum = 0, sizeNum =10,timeDot='5m';
          if(params.curPage){ //如果是params时表示分页信息的对象 
            fromNum = (params.curPage-1)* params.pageNum;
            sizeNum= params.pageNum;
          }else{//否则为聚合时用户选择的采样频率
            timeDot=params;
          }

          if(loadingFalg){ //从当前组件（或其父组件的watch）调用该方法时显示loading以及还原采样频率为5m；从其兄弟组件（改变采样频率、翻页）调用该方法则不
            _this.$emit("queryLoadingStart");//显示loading
            _this.$emit('restoreQinterval');//改变采样频率后，若换个聚合条件再次查询 则得把子组件logagg 的采样频率显示重新归为 5分钟
          }
         
          _this.isQueryOrAggs=false;//还原
          var sttime=_this.$store.state.mydatedata.starttime,
              edtime=_this.$store.state.mydatedata.endtime;
              
          var fromTime2,endTime2,fromTime,endTime;
          if(_this.queryform.logId=="access.log"){//access.log日志查询的时间要减去8小时
            fromTime2=toISO8601(sttime),
            endTime2=toISO8601(edtime);
            fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
            endTime=endTime2 || toISO8601(new Date());  
          }else{
            fromTime2=toSddate(sttime),
            endTime2=toSddate(edtime);
            fromTime=fromTime2 || toSddate(new Date(Date.now()-_this.$store.state.dateTimeLong)),
            endTime=endTime2 || toSddate(new Date()); 
          }
          
          var getLogId=_this.queryform.logId=="waf.log"?"shadow_"+_this.queryform.logId:_this.queryform.logId;
          var getLogIdStr=`/usr/local/shadow/logs/${getLogId}`;

          // var sumaryArrLen=_this.queryform.tmpsArray.length;
          // var mustShould=[];
          // var wildcardMatch=[];
          // for(let i=0;i<sumaryArrLen;i++){
          //   var andorIdI=_this.queryform.tmpsArray[i].andorId;
          //   var mustornot=_this.queryform.tmpsArray[i].symbol;
      
          //   if(andorIdI==="OR"){
          //     mustShould[i]="should"
          //   }else if(andorIdI==="AND"){
          //     mustShould[i]="must"
          //   }else{
          //     mustShould[i]="must"
          //   }
          //   let iszhenequals=localStorage.getItem("lang")=="en"?'equals':'等于';
          //   var symbolIdI=_this.queryform.tmpsArray[i].symbolId || iszhenequals;
          //   if(symbolIdI=="包含" || symbolIdI=="contains"){
          //     wildcardMatch[i]="wildcard"
          //   }else if(symbolIdI=="等于" || symbolIdI=="equals"){
          //     wildcardMatch[i]="match"
          //   }
          // }
          // if(sumaryArrLen>=2){
          //   mustShould[sumaryArrLen-1]=mustShould[sumaryArrLen-2];
          // }

          // var myQueryJson2={
          //     "must": [
          //       {
          //         "term": {
          //           "log.file.path": getLogIdStr
          //         }
          //       },
          //       {
          //         "range": {
          //           "@timestamp": {
          //             "from":fromTime,
          //             "to":endTime,
          //             "include_lower": true,
          //             "include_upper": true
          //           }
          //         }
          //       },{
          //         "bool":{
          //           "should": []
          //         }
          //       }
          //     ],
          //     // "should": [], 
          //     "filter": this.filterObj//用来接收后辈组件logRequery组件传出来的查询条件
          // };

          var myQueryJson={
              "must": [
                {
                  "term": {
                    "log.file.path": getLogIdStr
                  }
                }
              ],
              "must_not":[],
              "should": [],
              "filter":[{
                  "range": {
                    "@timestamp": {
                      "from":fromTime,
                      "to":endTime,
                      "include_lower": true,
                      "include_upper": true
                    }
                  }
                }]
              // "should": [], 
            //  "filter": this.filterObj//用来接收后辈组件logRequery组件传出来的查询条件
          };

          let querytmpArr=_this.queryform.tmpsArray;
          let querytmpArrLen=querytmpArr.length;
          for(let i=0;i<querytmpArrLen;i++){
            let querytmpArrI=querytmpArr[i];
            let querytmpAndOr=querytmpArrI["andorId"];
            if(querytmpArrLen==1){
              querytmpAndOr="AND"
            }else{
              querytmpArr[querytmpArrLen-1]["andorId"]=querytmpArr[querytmpArrLen-2]["andorId"];
            }
            let querytmpObj={};
            let wildcardmatchJson={};
            querytmpObj[querytmpArrI.keyId]=querytmpArrI["keyinputId"];
            if(querytmpArrI.symbolId=="notequals"){
              myQueryJson["must_not"].push({
                "match":querytmpObj
              });
            }else if(querytmpArrI.symbolId=="equals"){
              if(querytmpAndOr=="AND"){
                myQueryJson["must"].push({
                  "match":querytmpObj
                });
              }else{
                myQueryJson["should"].push({
                  "match":querytmpObj
                });
              }
            }else if(querytmpArrI.symbolId=="contains"){
              let wildcardskeyinput=querytmpArrI["keyinputId"];
              wildcardmatchJson[querytmpArrI.keyId]=`*${wildcardskeyinput}*`;
              if(querytmpAndOr=="AND"){
                myQueryJson["must"].push({
                  "wildcard":wildcardmatchJson
                });
              }else{
                myQueryJson["should"].push({
                  "wildcard":wildcardmatchJson
                });
              }
            }else if(querytmpArrI.symbolId=="notcontains"){
              let wildcardskeyinput=querytmpArrI["keyinputId"];
              wildcardmatchJson[querytmpArrI.keyId]=`*${wildcardskeyinput}*`;
              myQueryJson["must_not"].push({
                  "wildcard":wildcardmatchJson
                });
            }
          };
          if(_this.queryform.logId=="access.log"){
            myQueryJson.must.push({
              "exists": {
                "field": "shadow.access.method"
              }
            })
          }else{
            myQueryJson.must_not={//过滤掉格式错误的数据 适用于waf.log 以及error.log
              "exists": {
                "field": "error"
              }
            }
          }
          // console.log(mustShould)
          // for(let i=0;i<sumaryArrLen;i++){
          //   var mustShouldK=mustShould[i];
          //   var keyId=_this.queryform.tmpsArray[i].keyId;
          //   var keyinputId=_this.queryform.tmpsArray[i].keyinputId;
          //   var wildcardmatchJson={};
          //   if(wildcardMatch[i]=="wildcard"){
          //     var kyinputIdX=`*${keyinputId}*`;
          //     wildcardmatchJson[keyId]=kyinputIdX;

          //     // myQueryJson[mustShouldK].push({
          //     //   "wildcard": wildcardmatchJson
          //     // });

          //     if(mustShouldK=="must"){
          //       myQueryJson.must.push({
          //         "wildcard": wildcardmatchJson
          //       });
          //     }else if(mustShouldK=="should"){
          //       let shouldObj = myQueryJson.must.find(item=>{
          //         return item.bool
          //       });
          //       shouldObj.bool.should.push({
          //         "wildcard": wildcardmatchJson
          //       })
          //     }

          //   }else if(wildcardMatch[i]=="match"){
          //     wildcardmatchJson[keyId]=keyinputId;

          //     // myQueryJson[mustShouldK].push({
          //     //   "match": wildcardmatchJson   
          //     // });

          //     if(mustShouldK=="must"){
          //       myQueryJson.must.push({
          //         "match": wildcardmatchJson 
          //       });
          //     }else if(mustShouldK=="should"){
          //       let shouldObj = myQueryJson.must.find(item=>{
          //         return item.bool
          //       });
          //       shouldObj.bool.should.push({
          //        "match": wildcardmatchJson 
          //       })
          //     }

          //   }
          // }
          var aggsField=_this.queryform.aggsId;//聚合
          var aggsObj={};
          if(aggsField){//如果使用聚合
            var setTimeInterval=timeDot;//当查询用到聚合时会生成图表，图表会受到采样频率影响显示
            var aggsCount=parseInt(_this.queryform.metricinputId) || 1;
            aggsObj={
              "GroupByMe": {
                "terms": {
                  "field": aggsField,
                  "min_doc_count": aggsCount, 
                  "size": 5
                },
                "aggs": {
                  "time_his": {
                    "date_histogram": {
                    "field": "@timestamp",
                    "interval": setTimeInterval,
                    "min_doc_count": 0
                    }
                  }
                }
              }
            }
            this.isQueryOrAggs=true;
          }

          var searchObj = {
                index:"shadow-filebeat*",
                body:{
                  "size": 10,
                  "query": {
                    "bool": myQueryJson
                  },
                  "aggs": aggsObj 
                }
              }

          if(!this.isQueryOrAggs){
            searchObj.from=fromNum;
            searchObj.size=sizeNum;
          }
          this.$emit('setSearchObj',searchObj)// 可删?
          client.search(searchObj).then((res)=>{
            // console.log(res);
            _this.tbodyArr=[];//清空
            var legend=[],pieData=[],seriesData=[],xaxisData=[],tmpxaxisData=[];//接收聚合的查询结果，用于图表展示
            if(this.isQueryOrAggs){
              if(res.aggregations.GroupByMe.buckets.length>0){
                let tarResult=res.aggregations.GroupByMe.buckets;
                _this.tbodyArr=tarResult;//聚合里面的表格数据
          
                for(var i=0;i<tarResult.length;i++){
                  var dataI=tarResult[i];
                  for(var j=0;j<dataI.time_his.buckets.length;j++){
                    var dataJ=dataI.time_his.buckets[j];
                    if(!tmpxaxisData.includes(dataJ.key)){
                      tmpxaxisData.push(dataJ.key); 
                    }
                  }
                }
                tmpxaxisData.sort((a,b)=>{
                  return a-b;
                })

                const LEGEND_STRING_LEN=40;//图例过长，就截取掉一部分，并用省略号代替被截取部分
                const LEGEND_LAST_STRING=4;

                for(let ii=0;ii<tarResult.length;ii++){
                  let dataII=tarResult[ii];
                  let seriesItemData=[];

                  var arr0=tmpxaxisData.map((v)=>{return 0});

                  let bucketsKey;
                  // if(dataII.key){
                    bucketsKey=dataII.key.toString();
                  // }else{
                  //   bucketsKey=" ";
                  // }

                  if(bucketsKey.length>LEGEND_STRING_LEN){
                    bucketsKey=bucketsKey.slice(0,LEGEND_STRING_LEN-LEGEND_LAST_STRING)+"..."+bucketsKey.slice(bucketsKey.length-LEGEND_LAST_STRING-1);
                  }
                  
                  legend.push(bucketsKey);
                  pieData.push({
                    value:dataII.doc_count,
                    name:bucketsKey
                  });

                  for(let jj=0;jj<dataII.time_his.buckets.length;jj++){
                    var dataJJ=dataII.time_his.buckets[jj];
                    arr0[tmpxaxisData.indexOf(dataJJ.key)]=dataJJ.doc_count;
                  }

                  seriesData.push(
                    {
                      name:bucketsKey,
                      type:'line',
                      data:arr0
                    }
                  );
                }
                
                if(_this.queryform.logId=="access.log"){//access.log日志查询出来的时间不用减去8小时
                  xaxisData=tmpxaxisData.map((v)=>{
                    return _this.transformMyDate(v)
                  });
                }else{
                  xaxisData=tmpxaxisData.map((v)=>{
                    return _this.transformMyDate2(v)
                  });
                }
              }
            }else{
              if(res.hits.hits.length>0){
               
                _this.myQryTotalNum=res.hits.total.value;

                let logResArr = res.hits.hits;
                _this.tbodyArr = logResArr;

                // 存表体数据
                let bodyArr=[];

                if(_this.queryform.logId=="waf.log"){
                  // 获取waf.log表体数据
                  bodyArr = handleWaflogData(logResArr);
                }else if(_this.queryform.logId=="access.log"){
                  // 获取access.log表体数据
                  bodyArr = handleAccesslogData(logResArr);
                }else if(_this.queryform.logId=="error.log"){
                  // 获取error.log表体数据
                  var toSdDate = _this.$options.filters['toSdDate'];//获取使用局部的filter
                  logResArr.forEach((ele)=>{
                    var eleSource = ele._source;

                    var errLogsItem={};
                    errLogsItem.date=toSdDate(eleSource['read_timestamp']);
                    errLogsItem.level=eleSource.shadow.error.level;
                    errLogsItem.message=eleSource.shadow.error.message;

                    bodyArr.push(errLogsItem);
                  })
                }
                _this.myQryLogsBodyData=bodyArr;
              }
            }

            //把拿到的数据传入父组件，再由其父组件传入其兄弟组件
            _this.$emit("getMultiQueryResult",{
              "tableKeyArrCustom":_this.tabHeadArr,
              "cstQryLogsHeadData":_this.myQryLogsHeadData,
              "cstQryLogsBodyData":_this.myQryLogsBodyData,
              "cstQryTotalNum":_this.myQryTotalNum,
              
              "tableRes":_this.tbodyArr,
              "type":_this.queryform.logId,
              "isaggs":_this.isQueryOrAggs,

              "piedata":{"legend":legend,"data":pieData},
              "linechartdata":{"legend":legend,"xaxisdata":xaxisData,"seriesdata":seriesData}
            });


            _this.$emit("queryLoadingStop");//停止loading
          })
        }
      });
    },
    timeTask(){
      this.$refs['queryform'].validate((valid)=>{
        if(valid){
          var _this=this;
          var getLogId=_this.queryform.logId=="waf.log"?"shadow_"+_this.queryform.logId:_this.queryform.logId;
          var getLogIdStr=`/usr/local/shadow/logs/${getLogId}`;

          var sumaryArrLen=_this.queryform.tmpsArray.length;
          var mustShould=[];
          var wildcardMatch=[];
          for(let i=0;i<sumaryArrLen;i++){
            var andorIdI=_this.queryform.tmpsArray[i].andorId;
            if(andorIdI==="OR"){
              mustShould[i]="should"
            }else if(andorIdI==="AND"){
              mustShould[i]="must"
            }else{
              mustShould[i]="must"
            }
            let iszhenequals=localStorage.getItem("lang")=="en"?'equals':'等于';
            var symbolIdI=_this.queryform.tmpsArray[i].symbolId || iszhenequals;
            if(symbolIdI=="包含" || symbolIdI=="contains" || symbolIdI=="contain"){
              wildcardMatch[i]="wildcard"
            }else if(symbolIdI=="等于" || symbolIdI=="equals"){
              wildcardMatch[i]="match"
            }
          }
           console.log(mustShould)
          if(sumaryArrLen>=2){
            mustShould[sumaryArrLen-1]=mustShould[sumaryArrLen-2];
          }

          var myQueryJson={
              "must": [
                {
                  "term": {
                    "log.file.path": getLogIdStr
                  }
                },{
                  "range": {
                    "@timestamp": {
                      "from":'fromTimestamp',
                      "to":'toTimestamp',
                      "include_lower": true,
                      "include_upper": true
                    }
                  }
                },{
                  "bool":{
                    "should": []
                  }
                }
              ],
              // "should": []
            };
          if(_this.queryform.logId=="access.log"){
            myQueryJson.must.push({
              "exists": {
                "field": "shadow.access.method"
              }
            })
          }else{
            myQueryJson.must_not={//过滤掉格式错误的数据 适用于waf.log 以及error.log
              "exists": {
                "field": "error"
              }
            }
          }

          for(let i=0;i<sumaryArrLen;i++){
            var mustShouldK=mustShould[i];
            var keyId=_this.queryform.tmpsArray[i].keyId;
            var keyinputId=_this.queryform.tmpsArray[i].keyinputId;
            var wildcardmatchJson={};
            if(wildcardMatch[i]=="wildcard"){
              var kyinputIdX=`*${keyinputId}*`;
              wildcardmatchJson[keyId]=kyinputIdX;
              // myQueryJson[mustShouldK].push({
              //   "wildcard": wildcardmatchJson
              // });

              if(mustShouldK=="must"){
                myQueryJson.must.push({
                  "wildcard": wildcardmatchJson
                });
              }else if(mustShouldK=="should"){
                let shouldObj = myQueryJson.must.find(item=>{
                  return item.bool
                });
                shouldObj.bool.should.push({
                  "wildcard": wildcardmatchJson
                })
              }

            }else if(wildcardMatch[i]=="match"){
              wildcardmatchJson[keyId]=keyinputId
              // myQueryJson[mustShouldK].push({
              //   "match": wildcardmatchJson   
              // });

              if(mustShouldK=="must"){
                myQueryJson.must.push({
                  "match": wildcardmatchJson 
                });
              }else if(mustShouldK=="should"){
                let shouldObj = myQueryJson.must.find(item=>{
                  return item.bool
                });
                shouldObj.bool.should.push({
                 "match": wildcardmatchJson 
                })
              }

            }
          }

          var aggsField=_this.queryform.aggsId;
          var aggsObj={};
          if(aggsField){
            var aggsCount=parseInt(_this.queryform.metricinputId) || 1;
            aggsObj={
              "GroupByMe": {
                "terms": {
                  "field": aggsField,
                  "min_doc_count": aggsCount, 
                  "size": 5
                }
              }
            }
          }

          _this.qJson={
            "size": 10,
            "query": {
              "bool": myQueryJson
            },
            "aggs": aggsObj
          };
          _this.$emit("getTimeTaskResult",{
            "queryjson":_this.qJson,
            "queryform":_this.queryform,
          });
        }
      })
    },
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes());
    },
    transformMyDate2(d){
      d=new Date(d-8*60*60*1000);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes());
    }
  },
  filters:{
    toSdDate(val){
      if(!val) return;
      var d=new Date(val);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return d.getFullYear()+"/"+pad(parseInt(d.getMonth())+1)+"/"+pad(d.getDate())+" "+pad(d.getHours())+':'+pad(d.getMinutes())+":"+pad(d.getSeconds());
    }
  },
}
</script>
<style scoped>
.icon-row{line-height: 40px}
.icon-row i{cursor: pointer; margin-right: 8px;}
</style>
