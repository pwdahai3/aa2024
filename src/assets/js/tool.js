import {errorObj,errorObj2} from '@/assets/js/errorcode';
var isNormal="正常访问",isOtherexception="其他异常";
var errorObjforen=errorObj;
if(localStorage.lang=="en"){
  isNormal="Normal access";
  isOtherexception="Other exceptions";
  errorObjforen=errorObj2; 
}
export const handleAccesslogData = function(resArr){
  let bodyArr = [];
  resArr.forEach(ele => {
    const eleSource = ele._source;
    let aceLogsItem = {};

    //翻译动态过滤码
    const errorCodeNum = eleSource.shadow.access.error_code;
    let errorCodeStr='';
    if(errorCodeNum == 0){
      errorCodeStr = errorObjforen[0][eleSource.shadow.access.response_code] || isOtherexception
      if(eleSource.shadow.access.response_code=='200' && eleSource.shadow.access.org_url!=='/402.html') errorCodeStr=isNormal
    }else{
      errorCodeStr = errorObjforen[errorCodeNum] || isOtherexception
    }


    let isWebdriver="";
    const getWebd=eleSource.shadow.access.webdriver;
    if(getWebd=="false"){
      isWebdriver="正常浏览器";
    }else{
      isWebdriver="非正常浏览器(webdriver)";
    }

    aceLogsItem.date = toSdDate(eleSource["@timestamp"]);
   // aceLogsItem.hostname = eleSource.beat.hostname;
    aceLogsItem.hostname = eleSource.host.hostname;
    aceLogsItem.errorCode = errorCodeNum;
    aceLogsItem.errorCodeTxt = errorCodeStr;
    aceLogsItem.responseCode = eleSource.shadow.access.response_code;
    aceLogsItem.token = eleSource.shadow.access.token;
    aceLogsItem.httpVersion = eleSource.shadow.access.http_version || "--";
    aceLogsItem.device = (eleSource.shadow.access.user_agent && eleSource.shadow.access.user_agent.device.name) || "--";
    aceLogsItem.os = (eleSource.shadow.access.user_agent.os && eleSource.shadow.access.user_agent.os.name) || "--";
    aceLogsItem.name = (eleSource.shadow.access.user_agent && eleSource.shadow.access.user_agent.name) || "--";
    // aceLogsItem.upstreamTime = eleSource.shadow.access.upstream_time*1000 || "--";
    aceLogsItem.remoteIp = eleSource.shadow.access.remote_ip;
    aceLogsItem.cityName = (eleSource.shadow.access.geoip && eleSource.shadow.access.geoip.city_name) || "--";
    aceLogsItem.orgRemoteIp = eleSource.shadow.access.org_remote_ip || "--";
    aceLogsItem.orgCityName = (eleSource.shadow.access.org_geoip && eleSource.shadow.access.org_geoip.city_name) || "--";
    aceLogsItem.shadowUrl = eleSource.shadow.access.shadow_url;
    aceLogsItem.domain = eleSource.shadow.access.domain;
    aceLogsItem.http_host = eleSource.shadow.access.http_host;
    aceLogsItem.method = eleSource.shadow.access.method;
    aceLogsItem.orgUrl = eleSource.shadow.access.org_url;
    aceLogsItem.showUMenuList = false;

    aceLogsItem.cl_font_fp = eleSource.shadow.access.cl_font_fp || "--";
    aceLogsItem.cl_canvas_fp = eleSource.shadow.access.cl_canvas_fp || "--";
    aceLogsItem.request_id = eleSource.shadow.access.request_id || "--";
    aceLogsItem.shadow_learning_mode = eleSource.shadow.access.shadow_learning_mode || "--";
    aceLogsItem.cl_move_socre = eleSource.shadow.access.cl_move_socre || "--";
    aceLogsItem.cl_click_socre = eleSource.shadow.access.cl_click_socre || "--";
    aceLogsItem.cl_keyboard_score = eleSource.shadow.access.cl_keyboard_score || "--";
    aceLogsItem.upstream_response_time=eleSource.shadow.access.upstream_response_time || '--';
    aceLogsItem.upstream_response_status=eleSource.shadow.access.upstream_response_status || '--';


    aceLogsItem.agent = eleSource.shadow.access.agent;
    aceLogsItem.accept = eleSource.shadow.access.accept;
    aceLogsItem.accept_encoding = eleSource.shadow.access.accept_encoding;
    aceLogsItem.connection = eleSource.shadow.access.connection;
    aceLogsItem.accept_language = eleSource.shadow.access.accept_language;
    aceLogsItem.upstreamip = eleSource.shadow.access.upstream_ip;
    aceLogsItem.scheme = eleSource.shadow.access.scheme;
    aceLogsItem.request_body = eleSource.shadow.access.request_body;
    aceLogsItem.response_body = eleSource.shadow.access.response_body;
    aceLogsItem.webdriver = isWebdriver;
    bodyArr.push(aceLogsItem);
  });
  return bodyArr
}
export const handleWaflogData = function(resArr){
  let bodyArr = [];
  resArr.forEach(ele => {
    const eleSource = ele._source;
    let wafLogsItem = {};

    wafLogsItem.date = eleSource.shadow.waf.time;
   // wafLogsItem.hostname = eleSource.beat.hostname;
    wafLogsItem.hostname = eleSource.host.hostname;
    wafLogsItem.clientip = eleSource.shadow.waf.clientip;
    wafLogsItem.cityName =(eleSource.shadow.waf.geoip && eleSource.shadow.waf.geoip.city_name) || "--";
    wafLogsItem.mainruleid = eleSource.shadow.waf.mainruleid;
    wafLogsItem.attacktype = eleSource.shadow.waf.attacktype;
    wafLogsItem.host = eleSource.shadow.waf.host;
    wafLogsItem.uri = eleSource.shadow.waf.uri;
    wafLogsItem.supportid = eleSource.shadow.waf.supportid;
    wafLogsItem.attackcontent = eleSource.shadow.waf.attackcontent || "--";
    wafLogsItem.httpvariable = eleSource.shadow.waf.httpvariable || "--";
    wafLogsItem.zone = eleSource.shadow.waf.zone;

    bodyArr.push(wafLogsItem);
  });
  return bodyArr
}
function toSdDate(val) {
  if (!val) return;
  var d = new Date(val);
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return (d.getFullYear() +"/" +pad(parseInt(d.getMonth()) + 1) +"/" +pad(d.getDate()) +" " +pad(d.getHours()) +":" +pad(d.getMinutes()) +":" +pad(d.getSeconds()));
}

//access.log 
export const getTarResultArrLine = function(resCodeArr,flag){//，grap线图
  const list =[];
  function filterLineData(rcArr,flag){
    rcArr.forEach(item => {
      if (isChildren(item,flag)) {//
        const index = list.findIndex(el => {
          if (flag === 0) {
            if (!errorObjforen[0][item.key]) {
              return isOtherexception === el.key
            } else {
              return (errorObjforen[0][item.key] === el.key);//boolean
            }
          } else {
            if(!errorObjforen[flag]) {
              return isOtherexception === el.key
            } else {
              return (errorObjforen[flag] === el.key);//boolean
            }
          }
        })
        list[index]['doc_count'] += item.doc_count;//值相加
        const bucketsList=item.time_his.buckets || [];
        // console.log(vl.time_his.buckets,bucketsList,item)
        bucketsList.forEach((code,h)=>{  //同类型，时间点对应值相加
          // console.log(list[index]['time_his']['buckets'])
          const doc_count = list[index]['time_his']['buckets'][h].doc_count + code.doc_count;
          // console.log(doc_count)
          list[index]['time_his']['buckets'][h]={
            "key_as_string":code.key_as_string,
            "key":code.key,
            "doc_count":doc_count
          }
        }) 
      } else {
        const createdBuckes = Array(item.time_his.buckets.length);//创建一个固定长度（时间点数量）的数组
        item.time_his.buckets.forEach((vl,p)=>{
          if(createdBuckes[p]){
            createdBuckes[p]={
              "key_as_string": vl.key_as_string,
              "key": vl.key,
              "doc_count":createdBuckes[p]['doc_count']+vl.doc_count 
            }
          }else{
            createdBuckes[p]={
              "key_as_string": vl.key_as_string,
              "key": vl.key,
              "doc_count": vl.doc_count
            }
          }  
        })
      if(flag=== 0){
        if (!errorObjforen[0][item.key]) {//
          list.push({
            key: isOtherexception,
            doc_count: item.doc_count,
            "time_his":{
              "buckets":createdBuckes
            },
            // codeList: [{ errorCode: 0 ,respCode:item.key}]
          })
        } else {
        list.push({
          key: errorObj[0][item.key],
          doc_count: item.doc_count,
          "time_his":{
            "buckets":createdBuckes
          }
        })
        }
      }else{
        if (!errorObjforen[flag]) {
          list.push({
            key: isOtherexception,
            doc_count: item.doc_count,
            "time_his":{
              "buckets":createdBuckes
            },
          })
        } else {
            list.push({
              key: errorObj[flag],
              doc_count: item.doc_count,
              "time_his":{
                "buckets": createdBuckes
              }
            })
          }
        }
      }
    })
   }
  function isChildren(row,flag) {
    return list.some(el => {
      if (flag=== 0) {
        if (!errorObjforen[0][row.key]) {
          return isOtherexception === el.key
        } else {
          return (errorObjforen[0][row.key] === el.key);//boolean
        }
      } else {
        if(!errorObjforen[flag]) {
          return isOtherexception === el.key
        } else {
          return (errorObjforen[flag] === el.key);//boolean
        }
      }
    })
  }
  resCodeArr.forEach(item=>{
    if(item.key===0){
      filterLineData(item.groupbyresp.buckets, item.key)
    }else{
      filterLineData(item.groupbyresp.buckets, item.key)
    }
  })
  // console.log(list)
  return list
}
//access.log 动态
export const getTarResultArr = function(resCodeArr,flag){
  const list =[];
  function filterQueryData(rcArr,flag){
    // console.log(rcArr)
    rcArr.forEach(item => {
      if (item.key == 0) {
        filterQueryData(item.groupbyresp.buckets, item.key)
      } else {
        if (isChildren(item,flag)) {//（由一个动态过滤码组成一类型的情况都不进这里了）
          const index = list.findIndex(el => {
            if (flag=== 0) {
              if (!errorObjforen[0][item.key]){
                return isOtherexception=== el.key;
              }else{
                return errorObj[0][item.key] === el.key;
              }
            } else {
              if (!errorObjforen[item.key]){
                return isOtherexception === el.key;
              }
              else{
                return errorObj[item.key] === el.key;
              }
            }
          })
          list[index]['doc_count'] += item.doc_count;//值相加
          if(flag===0){
            list[index]['codeList'].push({ errorCode: 0,respCode:item.key });
          }else{
            list[index]['codeList'].push({ errorCode:  item.key });
          }
        } else {
          if(flag === 0){
            if (!errorObjforen[0][item.key]) {//就分为其他异常
              list.push({
                key: isOtherexception,
                doc_count: item.doc_count,
                codeList: [{ errorCode: 0 ,respCode:item.key}]
              })
            } else {
              list.push({
                key: errorObj[0][item.key],
                doc_count: item.doc_count,
                codeList: [{ errorCode: 0 ,respCode:item.key}]
              })
            }
          }else{
            if (!errorObjforen[item.key]) {//分为其他异常
              list.push({
                key: isOtherexception,
                doc_count: item.doc_count,
                codeList: [{ errorCode: item.key }]
              })
            } else {
              list.push({
                key: errorObj[item.key],
                doc_count: item.doc_count,
                codeList: [{ errorCode: item.key }]
              })
            }
          }
        }
      }
    })
    function isChildren(row,flag) {
      return list.some(el => {
        if (flag=== 0) {
          if (!errorObjforen[0][row.key]) {
            return isOtherexception === el.key
          } else {
            return (errorObjforen[0][row.key] === el.key);//boolean
          }
        } else {
          if(!errorObjforen[row.key]) {
            return isOtherexception === el.key
          } else {
            return (errorObjforen[row.key] === el.key);//boolean
          }
        }
      })
    }
  }
  filterQueryData(resCodeArr, flag)
  // console.log(list)
  return list
}

export const getTarResultArr2 = function(data){
  var aggarr=[];
  data.forEach(item=>{
    if(item.key=="0"){
      item.groupbyresp.buckets.forEach(item2=>{
        aggarr.push({
          "name":errorObjforen[0][item2.key],
          "value":item2.doc_count
        })
      })
    }else{
      aggarr.push({
        "name":errorObjforen[item.key],
        "value":item.doc_count
      })
    }
  });
  return aggarr;
}



export const handleConfigure = function(codeStr,textArr,flag){//
  if(!codeStr) return;
  const myConfCodeArr = codeStr.split(flag?'':'、');
  const myConfTextArr = myConfCodeArr.map(item=>{
    return textArr[item]
  })
  return myConfTextArr.join(flag?'、':'');
}