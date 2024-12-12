import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import {handleConfigure} from '@/assets/js/tool';

function getLocationInstruct(_this,data,flag,type,isAuto,isEditConfig){//flag为true时，代表批量操作配置指令,并且type,isAuto,isEditConfig这三个参数都不必要再传入（注：有些指令在单个location下只能设置一条，不能重复设置，但批量操作里会出现多条，因此以下一些遍历不是多余的）
  return new Promise((resolve,reject)=>{
    let url="";
    let cmdParams=null;
    let LocationInstructObj={};

    if(flag){
      url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch?snodeId="+data.shadowObj.snodeId;
    }else{
      if(isAuto){
        url=SERVER_API_URL+"directive";
      }else if(isEditConfig){
        url=SERVER_API_URL+"directive?savedConfig=true";
      }else{
        url=SERVER_API_URL+"directive";
      }
      cmdParams={
        params:{
          snodeId:data.shadowObj.snodeId,
          domainName:data.domainObj.domainName,
          domainPort:data.domainObj.port,
          locationName:data.locationObj.name,
          locationType:data.locationObj.type
        }
      }
    }
    axios.get(url,cmdParams).then((res)=>{
      // console.log(res)
      if(res.data.responseCode==0){
        let insertJsFlag=false;//区分普通插入js(两条保护指令)和用户输入的保护指令shadow_sub_filter
        // res.data.data.forEach(function(val,index){//如果点选了js增强功能，则会自动增加一条不需要显示的保护配置，这里把它截取删掉
        //   if(val["shadow_sub_filter"]=="PC90aXRsZT4=|PC90aXRsZT48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzIj48L3NjcmlwdD4=|NTAwcw==|MQ==|cg==|"){
        //     res.data.data.splice(index,1)
        //     insertJsFlag=true;
        //   }
        // })
        
        const tgData = res.data.data.filter(val=>{//把js增强功能的普通插入选项插入的两条保护指令过滤掉
          if(val["shadow_sub_filter"]!=="PC90aXRsZT4=|PC90aXRsZT48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzIj48L3NjcmlwdD4=|NTAwcw==|MQ==|cg==|" && val["shadow_sub_filter"]!=="PGhlYWQ-|PGhlYWQ-PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL2NvbmZpZy5qcyI-PC9zY3JpcHQ-|NTAwcw==|MQ==|cg==|"){
            return val
          }else{
            insertJsFlag=true;
          }
        })

        const resDataObj={};
        var shadowsubfilterV=[],shadowsubfilterEXV=[],shadowlocationV=[],shadowsubTypeV=[],addHeaderV=[],shadowmodifyheaderV=[],
        shadowrequesttimeV=[],shadowverifyBrowserV=[],shadowverifyAgentV=[],shadowcustomV=[],shadowverifyTokenV=[],shadowUriDecryptedV=[],shadowEncryptKeyV=[],
        shadowVerifyCookieMd5V=[],shadowSetRejectHeaderV=[],shadowMustHaveCookieV=[],enhanceV=[];

        if(insertJsFlag){//代表js增强功能 js普通插入
          enhanceV.push('tow_shadow_sub_filter');//普通插入js是两条保护指令，暂时用tow_shadow_sub_filter代表普通插入
        }
        
        for(var i=0;i<tgData.length;i++){
          const tgdataI=tgData[i];
          if(tgdataI.hasOwnProperty("shadow_sub_filter")){//保护配置
            const tgiArr=tgdataI["shadow_sub_filter"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            if(decodeArr.length==4){
              decodeArr.push("");
            }
            
            //处理超时时间的时间单位
            // console.log(decodeArr[2].match(/(\d*)(\w*)/)[2]);
            switch(decodeArr[2].match(/(\d*)(\w*)/)[2])
            {
              case "y":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.year');
                break;
              case "M":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.month');
                break;
              case "w":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.week');
                break;
              case "d":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.day');
                break;	
              case "h":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.hour');
                break;
              case "m":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.minite');
                break;
              case "s":
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.second');
                break;
              default:
                decodeArr[2]=decodeArr[2].match(/(\d*)(\w*)/)[1]+_this.$t('lg.ms');
            };

            //处理配置属性
            const configureArr={//配置属性转换成文本文字
              'r':'替换配置',
              'a':'允许访问原URI',
              'e':'二次加密',
              's':'绝对路径',
              'x':'正则'
            }
            decodeArr[4]=handleConfigure(decodeArr[4],configureArr,true);
            // console.log(decodeArr);
            shadowsubfilterV.push(decodeArr);
          }else if(tgdataI.hasOwnProperty("shadow_sub_filter_ex")){//特殊保护配置
            const tgiArr=tgdataI["shadow_sub_filter_ex"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            if(decodeArr.length==5){
              decodeArr.push("");
            }

            //处理超时时间的时间单位
            // console.log(decodeArr[3].match(/(\d*)(\w*)/)[2]);
            switch(decodeArr[3].match(/(\d*)(\w*)/)[2])
              {
              case "y":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.year');
                break;
              case "M":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.month');
                break;
              case "w":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.week');
                break;
              case "d":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.day');
                break;	
              case "h":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.hour');
                break;
              case "m":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.minite');
                break;
              case "s":
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.second');
                break;
              default:
                decodeArr[3]=decodeArr[3].match(/(\d*)(\w*)/)[1]+_this.$t('lg.ms');
            };

            //处理配置属性
            const configureArr={//配置属性转换成文本文字
              'e':'二次加密',
              's':'绝对路径',
              'p':'路径加密',
              'a':'允许访问原URI',
              'x':'正则'
            }
            decodeArr[5]=handleConfigure(decodeArr[5],configureArr,true);
            // console.log(decodeArr);
            shadowsubfilterEXV.push(decodeArr);
          }else if(tgdataI.hasOwnProperty("shadow_location")){//跳转配置
            const tgiArr=tgdataI["shadow_location"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            shadowlocationV.push(decodeArr);
          }else if(tgdataI.hasOwnProperty("shadow_sub_filter_types")){//特殊文件类型
            const tgiArr=tgdataI["shadow_sub_filter_types"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            shadowsubTypeV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("add_header")){//Header补全
            const tgiArr=tgdataI["add_header"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            addHeaderV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_modify_header")){//Header修改
            const tgiArr=tgdataI["shadow_modify_header"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            shadowmodifyheaderV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_request_time")){//手动代理防御设置
            const tgiArr=tgdataI["shadow_request_time"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            if(flag){
              switch(decodeArr[0].match(/(\d*)(\w*)/)[2])
              {
                case "s":
                  decodeArr[0]=decodeArr[0].match(/(\d*)(\w*)/)[1]+_this.$t('lg.second');
                  break;
                default:
                  decodeArr[0]=decodeArr[0].match(/(\d*)(\w*)/)[1]+_this.$t('lg.ms');
              }
            }
            shadowrequesttimeV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_verify_browser")){//浏览器参数指标 批量操作的时候可能有多条，单个location只能设置一条，因此需要遍历
            const tgiArrBrowser=tgdataI["shadow_verify_browser"].split("|");
            let browserArr=[];
            for(var j=0;j<tgiArrBrowser.length-1;j++){
              browserArr.push(Base64.decode(tgiArrBrowser[j]));
            }
            shadowverifyBrowserV.push([browserArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_verify_agent")){//用户行为指标 批量操作的时候可能有多条，单个location只能设置一条，因此需要遍历
            const tgiArrAgent=tgdataI["shadow_verify_agent"].split("|");
            let agentArr=[];
            for(var j=0;j<tgiArrAgent.length-1;j++){
              agentArr.push(Base64.decode(tgiArrAgent[j]));
            }
            shadowverifyAgentV.push([agentArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_verify_token")){//动态指纹功能 批量操作、单个location 始终只有开启状态下才显示，所以最终只有一条结果,因此没加遍历
            const decodeArr=tgdataI["shadow_verify_token"].split("|");
            shadowverifyTokenV.push(Base64.decode(decodeArr));
          }
          // else if(tgdataI.hasOwnProperty("shadow_uri_decrypted")){//动态URI功能  暂时停用
          //   const decodeArr=tgdataI["shadow_uri_decrypted"].split("|");
          //   shadowUriDecryptedV.push(Base64.decode(decodeArr));
          // }
          else if(tgdataI.hasOwnProperty("shadow_encrypt_key")){//body加密功能
            const tgiArrAgent=tgdataI["shadow_encrypt_key"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArrAgent.length-1;j++){
              decodeArr.push(Base64.decode(tgiArrAgent[j]));
            }
            shadowEncryptKeyV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_verify_cookie_md5")){//Cookie 篡改防护功能
            const decodeArr=tgdataI["shadow_verify_cookie_md5"].split("|");
            shadowVerifyCookieMd5V.push(Base64.decode(decodeArr));
          }else if(tgdataI.hasOwnProperty("shadow_set_reject_header")){//拒绝头域名功能
            const decodeArr=tgdataI["shadow_set_reject_header"].split("|");
            shadowSetRejectHeaderV.push(Base64.decode(decodeArr));
          }else if(tgdataI.hasOwnProperty("shadow_insert_js_ex")){//Js增强功能 插入的指令名字为：shadow_insert_js_ex
            const tgiArrJs=tgdataI["shadow_insert_js_ex"].split("|");
            var decodeArrJs=[];
            for(var j=0;j<tgiArrJs.length-1;j++){
              decodeArrJs.push(Base64.decode(tgiArrJs[j]));
            }
            enhanceV.push(decodeArrJs);
            // console.log(enhanceV)
          }else if(tgdataI.hasOwnProperty("shadow_must_have_cookie")){//Js Cookie验证功能
            const decodeArr=tgdataI["shadow_must_have_cookie"].split("|");
            shadowMustHaveCookieV.push(Base64.decode(decodeArr));
          }else{//自定义配置
            let decodeObj={};
            decodeObj.customName=Object.keys(tgdataI)[0];

            const cParams=tgdataI[Object.keys(tgdataI)[0]];
            let cParamsArr = cParams.split("|");
            let decodeArr=[];
            for(var j=0;j<cParamsArr.length-1;j++){
              decodeArr.push(Base64.decode(cParamsArr[j]));
            }
            decodeObj.customParams=decodeArr.join(" ");

            shadowcustomV.push(decodeObj);
          }
        }

        if(shadowsubfilterV.length>0){
          resDataObj['shadow_sub_filter']=shadowsubfilterV;
        }
        if(shadowsubfilterEXV.length>0){
          resDataObj['shadow_sub_filter_ex']=shadowsubfilterEXV;
        }
        if(shadowlocationV.length>0){
          resDataObj['shadow_location']=shadowlocationV;
        }
        if(shadowcustomV.length>0){
          resDataObj['shadow_custom']=shadowcustomV;
        }

        // 高级配置 
        if(shadowsubTypeV.length>0){
          resDataObj['shadow_sub_filter_types']=shadowsubTypeV;
        }
        if(addHeaderV.length>0){
          resDataObj['add_header']=addHeaderV;
        }
        if(shadowmodifyheaderV.length>0){
          resDataObj['shadow_modify_header']=shadowmodifyheaderV;
        }
        if(shadowrequesttimeV.length>0){
          resDataObj['shadow_request_time']=shadowrequesttimeV;
        }
        if(shadowverifyBrowserV.length>0){
          resDataObj['shadow_verify_browser']=shadowverifyBrowserV;
        }
        if(shadowverifyAgentV.length>0){
          resDataObj['shadow_verify_agent']=shadowverifyAgentV;
        }
        if(shadowverifyTokenV.length>0){
          resDataObj['shadow_verify_token']=shadowverifyTokenV;
        }
        // if(shadowUriDecryptedV.length>0){
        //   resDataObj['shadow_uri_decrypted']=shadowUriDecryptedV;
        // }
        if(shadowEncryptKeyV.length>0){
          resDataObj['shadow_encrypt_key']=shadowEncryptKeyV;
        }
        if(shadowVerifyCookieMd5V.length>0){
          resDataObj['shadow_verify_cookie_md5']=shadowVerifyCookieMd5V;
        }
        if(shadowSetRejectHeaderV.length>0){
          resDataObj['shadow_set_reject_header']=shadowSetRejectHeaderV;
        }
        if(shadowMustHaveCookieV.length>0){
          resDataObj['shadow_must_have_cookie']=shadowMustHaveCookieV;
        }
        if(enhanceV.length>0){
          resDataObj['shadow_insert_js_ex']=enhanceV;
        }

        LocationInstructObj=resDataObj;
        // console.log(LocationInstructObj)
        // console.log(LocationInstructObj[type])
        if(flag){
          resolve(LocationInstructObj);//对象
        }else{
          resolve(LocationInstructObj[type]||[]);//数组
        }
      }else{
        _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
      }
    }).catch((err)=>{
      console.log(err)
    });
  })
}

export default getLocationInstruct;