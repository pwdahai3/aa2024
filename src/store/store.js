import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import axios from 'axios'
import {SERVER_API_URL,SERVER_API_URL2} from '@/conf/constvar';
import client from "@/components/es/connection";
import toISO8601 from '@/assets/js/iso8601';
import { Loading } from 'element-ui';
import {handleConfigure} from '@/assets/js/tool';
import { Message } from 'element-ui';
import router from '@/router';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isencn:'cn',
    productName:'',
    user: {
      name:''
    },
    useTime:'',//当前token使用时间，每个token只能用固定的时间，目前是二十分钟（token有效期由服务器来定）
    refresh_token: '',
    token: "",

    pswdreminder:null,//修改密码提示
    showEditUsersPswdDialog:false,//从修改密码提示 进入修改密码弹框
    userInfo:{},

    contentLoading:false,//外层loading

    myVersion:'',//版本信息
    myNotification:false,//为是否开启邮件通知
    title: '',
    isMenuShow:false,//监视菜单显隐状态，调用echars resize
    // isShowTimerate:false,//采样频率
    // mytimeInterval:300000,//数据展示发请求的时间间隔300000
    // mapMagterval:60000,//地图半小时数据展示发请求的时间间隔60000
    
    alreadyhasdomian:false,//作为 ‘判断是否需要进行基础配置’ 的依据 被抓取业务的端口与域名在拓扑图上存在则不需要再进行一次基础配置，否则则需要
    autoconfigport:'',//保存自动化配置当前被抓取业务的端口 作为判断是否需要进行基础配置的依据
    autoconfiginput:'',//保存自动化配置当前被抓取业务的域名/ip 作为判断是否需要进行基础配置的依据
    autoconfigsnodeid:'',

    licenseTimer:null,
    licenceinfo:{},
    
    nowTimeVal:[new Date(new Date().getTime()-24*60*60*1000), new Date()],
    
    mydatedata:{
      starttime:'',
      endtime:'',
      interval:'5m',//其他表，默认5m采样一次(随右上角选定时间段长短来决定，详细见MYDATEPICKER)
      flowInterval:'600s',//流量表，默认10s采样一次
      timestampnow:''
    },
    timerateOptions: [{//采样频率
      value: '5m',
      label: '5分钟'
    }, {
      value: '1h',
      label: '一小时'
    }, {
      value: '1d',
      label: '一天'
    }
    ],
    timerateValue: '',
    dateTimeLong:24*60*60*1000,
   
    configServerUrl:'',//搜索配置拓扑图的接口url

    allRulesetData:[],

    //数据可视化
    fieldYOptions:[],
    
    //退出登录倒计时
    loginResShow:false,//登录限制弹框显隐
    LoginResTime:null,//定时器，每隔一个token有效期打开一遍loginRestriction弹框
    restrictFlag:false,//如果是倒计时结束后的自动退出
    
    // 自动刷新
    refreshTimeout:null,//自动刷新定时器
    refreshAble:false,//时间默认取最近一天，默认不禁用 （自动刷新图表针对于最近时间 最近一小时 最近一天 ，最近三个月，最近一年等等有效，对具体时间段无效（过去的某一个时间段数据是不会改变了的，这种情况下还自动刷新会占用流量））
    refreshFalg:false,//自动刷新不开启loading的开关（地图页面的loading）

    //es公用查询
    esDomainArr:[],//获取域名
    getEsDomainArrLoading:false,

    esUrlArr:[],//获取某个域名下的url
    getEsUrlArrLoading:false,

  },
  mutations:{
    [types.LOGIN]:(state,data)=>{//登录
      //console.log(data)
      state.token=data.access_token;
      state.useTime=data.expires_in;
      state.refresh_token=data.refresh_token;
      sessionStorage.setItem('mytoken',data.access_token);
      sessionStorage.setItem('refresh_token',data.refresh_token);
      sessionStorage.setItem('expires_in',data.expires_in);
      state.isMenuShow=false;
      state.isencn=localStorage.lang;
    },
    [types.LOGOUT]:(state)=>{//退出登录
      // sessionStorage.removeItem('mytoken');
      // window.localStorage.clear();
      window.sessionStorage.clear();
      clearTimeout(state.LoginResTime);
      clearTimeout(state.refreshTimeout);
      clearTimeout(state.licenseTimer);
      state.user.name='';
      state.token='';
      state.contentLoading=false;
      if(state.restrictFlag){//如果是自动被踢出登录
        setTimeout(() => {
        //  alert('登录超时，请重新登录');
        var logoutMes="登录超时，请重新登录";
        if(localStorage.lang=="en"){
          logoutMes="Login timeout, please log in again";
        }else{
          logoutMes="登录超时，请重新登录";
        }
        Message({
            showClose: true,
            message: logoutMes,
            type: 'error',
            duration:6000,
            center:true
          });
        },0);
        state.restrictFlag = false;
      }
      router.replace({
        path: 'login',
        query: { redirect: router.currentRoute.fullPath }//
      });
    },
    [types.USERNAME]:(state,data)=>{//
      sessionStorage.setItem('myname',data);
      state.user.name=data;
    },
    [types.GETLICENCEINFO]:(state,data)=>{//
      // axios.get(url).then((res)=>{
      //   if(res.data.responseCode==0){
      //     // console.log(res)
      //     state.licenceinfo=res.data.data;
      //   }
      // }); 
      var url=SERVER_API_URL+"license/status";
      state.licenseTimer=null;
      function _timeFn(){
        let nowTime=new Date().getTime();
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
             let resData=res.data.data;
             state.licenceinfo=resData;
             if(resData.expireDate-nowTime<7*24*60*60*1000)
             {
              state.licenceinfo.istobeexpired=true;
             }else{
              state.licenceinfo.istobeexpired=false;
             }
            
            state.licenseTimer=setTimeout(()=>{
              _timeFn()
            },60000)
          }
        }); 
      }
      _timeFn();
    },
    [types.GETVERSION]:(state,data)=>{//
      var url=SERVER_API_URL+"pe/version";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          state.myVersion=res.data.data;
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    [types.PRODUCTNAME]:(state,data)=>{//信息
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          const resData=res.data.data;
          if(localStorage.lang=="en"){
            state.productName=resData.enName;
          }else{
            state.productName=resData.cnName;
          }
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
    // [types.GETNOTIFICATION]:(state,data)=>{//查看流量监控邮件通知参数配置 notification
    //   var url=SERVER_API_URL+"monitoring/quota/param";
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //       state.myNotification=res.data.data.notification;
    //     }
    //   }).catch((err)=>{
    //     console.log(err);
    //   })
    // },

    // [types.LICENCEINFO]:(state,data)=>{w
    //   state.licenceinfo=data;
    // },
    [types.MYDATEPICKER]:(state)=>{
      state.mydatedata.starttime=state.nowTimeVal[0];
      state.mydatedata.endtime=state.nowTimeVal[1]; 
      var sTime = state.nowTimeVal[0].getTime();
      var eTIme = state.nowTimeVal[1].getTime();
      var differenceValue = eTIme-sTime;
      if(differenceValue>5*365*24*60*60*1000){//>5年 ~365
        state.mydatedata.interval="5d";
      }else if(differenceValue<=5*365*24*60*60*1000 && differenceValue>2*365*24*60*60*1000){//<=五年 && >两年 1825~730
        state.mydatedata.interval="1d";
      }else if(differenceValue<=2*365*24*60*60*1000 && differenceValue>365*24*60*60*1000){//<=两年 && >一年 3504~1752
        state.mydatedata.interval="5h";
      }else if(differenceValue<=365*24*60*60*1000 && differenceValue>180*24*60*60*1000){//<=一年 && >半年 8760~4380
        state.mydatedata.interval="1h";
      }else if(differenceValue<=180*24*60*60*1000 && differenceValue>90*24*60*60*1000){//<=半年 && >三个月 8640~4320
        state.mydatedata.interval="30m";
      }else if(differenceValue<=90*24*60*60*1000 && differenceValue>30*24*60*60*1000){//<=三个月 && >一个月 8640~2880
        state.mydatedata.interval="15m";
      }else if(differenceValue<=30*24*60*60*1000 && differenceValue>1*60*60*1000){//<=一个月 && >一小时 8640~30
        state.mydatedata.interval="5m";
      }else if(differenceValue<=1*60*60*1000 && differenceValue>10*60*1000){//<=1小时 && >10分钟 360~60
        state.mydatedata.interval="10s";
      }else if(differenceValue<=10*60*1000 && differenceValue>=0){//<=10分钟 >=0 600~0
        state.mydatedata.interval="1s";
      }
      // console.log(state.mydatedata.interval);
     
      // state.mydatedata.flowInterval=state.mydatedata.flowInterval;
      state.mydatedata.timestampnow=new Date().getTime();
    },
    // [types.CONTENTICONLOADING]:(state,flag)=>{
    //   state.CONTENTICONLOADING=flag;
    // },
    [types.MAKEPDF]:(state,data)=>{
      const blob = new Blob([data.pdfdata],{type: "application/pdf"});
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, data.pdfname);
      } else {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = data.pdfname;
        document.body.appendChild(link);
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);
        document.body.removeChild(link);
      }
    },

    //查看全部WAF规则集
    [types.GETALLRULESET]:(state,type)=>{
      state.allRulesetData=[];
      const url=SERVER_API_URL+"waf/ruleset";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          state.allRulesetData=res.data.data;
        }else{
          // this.$message.error('操作失败: '+ res.data.data.message);
          Message({
            message:'failed:'+ res.data.data.message,
            type:'error'
          })
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    //数据可视化
    [types.GETFIELDOPTIONS]:(state,type)=>{//获取fieldYOptions
      // console.log(type);
      state.fieldYOptions=[]//清空
      if(type=='date_histogram'){
        state.fieldYOptions=[{
          value:'Data',
          disabled: true
        },{
          value:'@timestamp'
        }]
      }else{
        const url =SERVER_API_URL+"dp/es/fieldcaps";
        axios.get(url).then(res => {
          // console.log(res);
          if(res.data.responseCode==0){
            const numberArray = res.data.data.Number;
            const stringArray = res.data.data.String;

            if(type=="terms" || type=="max" || type=="min" || type=='cardinality'){
              state.fieldYOptions.push({
                value:'Data',
                disabled: true
              },{
                value:'@timestamp'
              })
            }
           
            if(numberArray.length!=0){
              state.fieldYOptions.push({
                value:'Number',
                disabled: true
              });
              numberArray.forEach(element => {
                state.fieldYOptions.push({
                  value:element
                })
              });
            };

            if(type=='terms' || type=='cardinality'){
              if(stringArray.length!=0){
                state.fieldYOptions.push({
                  value:'String',
                  disabled: true
                });
                stringArray.forEach(element => {
                  state.fieldYOptions.push({
                    value:element
                  })
                });
              }
            }
          }
        }).catch(err=>{
          console.log(err);
        })
      }
    },

    //es公用查询语句
    [types.GETESDOMAINS]:(state,flag)=>{//查询域名
      state.esDomainArr=[];
      state.getEsDomainArrLoading=true;
      const sttime=state.mydatedata.starttime,
            edtime=state.mydatedata.endtime;
      const fromTime2=toISO8601(sttime),
            endTime2=toISO8601(edtime);
      const fromTime=fromTime2 || toISO8601(new Date(Date.now()-state.dateTimeLong)),
            endTime=endTime2 || toISO8601(new Date());

      let decryptedObj={
            // "query_string": {
            //   "query": "shadow.access.decrypted:1"
            // }
          };
      let mustObj=[];
      if(flag){//行为分析-基于访问时间、基于访问次数要满足decrypted:1 or api_indicator:1 
        mustObj=[
          {
            "query_string": {
              "query": "shadow.access.error_code:0"
            }
          },
          {
            "query_string": {
              "query": "shadow.access.response_code:200"
            }
          },
          {
            "bool": {
              "should": [
                {
                  "query_string": {
                    "query": "shadow.access.decrypted:1"
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.api_indicator:1"
                  }
                }
              ]
            }
          },
          {
            "range": {
              "@timestamp": {
                "gte":fromTime,
                "lte":endTime,
              }
            }
          }
        ]
      }else{
        mustObj=[
          {
            "query_string": {
              "query": "shadow.access.error_code:0"
            }
          },
          {
            "query_string": {
              "query": "shadow.access.response_code:200"
            }
          },
          {
            "range": {
              "@timestamp": {
                "gte":fromTime,
                "lte":endTime,
              }
            }
          }
        ]
      };
      
      client.search({
        index:"shadow-filebeat*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "must": mustObj,
              "must_not": [
                {
                  "match": {
                    "shadow.access.token": "00000000000000000000000000000000"
                  }
                },
                {
                  "match": {
                    "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                  }
                }
              ]
            }
          },
          "aggs": {
            "GroupByDomain": {
              "terms": {
                "field": "shadow.access.http_host",
                "size": 100
              }
            }
          }
        }
      }).then((res)=>{
        // console.log(res)
        state.getEsDomainArrLoading=false;
        // const resData=[{
        //   "key": "mall.geely.com",
        //   "doc_count": 326
        // }, {
        //   "key": "www.sherry.com",
        //   "doc_count": 68
        // }, {
        //   "key": "www.lensy.com",
        //   "doc_count": 2
        // }]
        const resData=res.aggregations?res.aggregations.GroupByDomain.buckets:[];
        state.esDomainArr=resData;
      });

    },
    [types.GETESURLS]:(state,data)=>{
      // console.log(data);
      state.esUrlArr=[];
      state.getEsUrlArrLoading=true;
      const sttime=state.mydatedata.starttime,
            edtime=state.mydatedata.endtime;
      const fromTime2=toISO8601(sttime),
            endTime2=toISO8601(edtime);
      const fromTime=fromTime2 || toISO8601(new Date(Date.now()-state.dateTimeLong)),
            endTime=endTime2 || toISO8601(new Date());
      const domainVal = data.domain;

      let decryptedObj={
        "query_string": {
          "query": "shadow.access.decrypted:1"
        }
      };
      if(data.flag){
        decryptedObj={
          "bool": {
            "should": [
              {
                "query_string": {
                  "query": "shadow.access.decrypted:1"
                }
              },
              {
                "query_string": {
                  "query": "shadow.access.api_indicator:1"
                }
              }
            ]
          }
        }
      };

      client.search({
        index:"shadow-filebeat*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "must": [
                {
                  "query_string": {
                    "query": "shadow.access.error_code:0"
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.response_code:200"
                  }
                },
                decryptedObj,
                {
                  "term": {
                    "shadow.access.http_host": domainVal
                  }
                },
                {
                  "range": {
                    "@timestamp": {
                      "gte":fromTime,
                      "lte": endTime,
                    }
                  }
                }
              ],
              "must_not": [
                {
                  "match": {
                    "shadow.access.token": "00000000000000000000000000000000"
                  }
                },
                {
                  "match": {
                    "shadow.token.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                  }
                },
                {
                  "query_string": {
                    "query": "shadow.access.org_url:\\/40*\\.html"
                  }
                }
              ]
            }
          },
          "aggs": {
            "GroupByUrl": {
              "terms": {
                "field": "shadow.access.org_url",
                "size": 100
              }
            }
          }
        }
      }).then((res)=>{
        // console.log(res)
        state.getEsUrlArrLoading=false;
        const resData=res.aggregations.GroupByUrl.buckets;
        // const resData=[
        //   {
        //     "key": "/getapi",
        //     "doc_count": 37
        //   },
        //   {
        //     "key": "/pe/shadow/snode",
        //     "doc_count": 13
        //   },
        // ]
        state.esUrlArr=resData;
      });
    },
  }
});