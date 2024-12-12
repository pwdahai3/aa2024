<template>
  <div class="objUpdate-wrapper">
    <h2 class="breadcrumb">{{$t('lg.uriwihite')}}</h2>
    <el-form ref="searchObjform" class="form-bg" style="padding-bottom:0" :model="searchObjform" :rules="searchObjformRules" label-width="0">
      <el-row :gutter="10">

        <!-- <el-col :span="4">
          <el-form-item prop="paramType">
            <el-select v-model="searchObjform.paramType" :placeholder="$t('lg.select')" style="width:100%">
              <template v-for="item in urlTypeArr">
                <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col> -->

        <el-col :span="9">
          <el-form-item prop="paramDomain">
            <el-select v-model="searchObjform.paramDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains($event)" style="width:100%" :loading="domainLoading">
              <template v-for="item in searchObjform.esDomainArr">
                <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
              </template>
            </el-select>
            <!-- <el-input v-model.trim="searchObjform.paramDomain" :placeholder="$t('lg.inputdomain')"></el-input> -->
          </el-form-item>
        </el-col>

        <!-- <el-col :span="5">
          <el-form-item prop="paramStrTime">
            <el-date-picker
              v-model="searchObjform.paramStrTime"
              type="datetime"
              placeholder="开始时间"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col> -->

        <!-- <el-col :span="5">
          <el-form-item prop="paramDeadline">
            <el-date-picker
              v-model="searchObjform.paramDeadline"
              type="datetime"
              placeholder="时间点二"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col> -->

        <el-col :span="3">
          <el-button type="primary" style="width:100%" @click="getObjData()" icon="el-icon-search">{{$t('lg.query')}}</el-button>
        </el-col>
        <el-col :span="6">
          <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadActionUri"
          :headers="uploadheader"
          :before-upload="beforeupload"
          :on-success="onsuccess"
          :auto-upload="true"
          :file-list="fileList"
          >
          <el-button type="primary">{{$t('lg.daoruuriwhitepz')}}</el-button>
        </el-upload>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="downloadURI">{{$t('lg.xiazaiuriwhitemb')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查询结果数据展示 -->
    <div class="objTreeBox">
      <el-tree
        :data="objTreeNodeData"
        :props="objTreeProps"
        ref="tree"
        :render-content="objRenderContent"><!--show-checkbox-->
      </el-tree>
    </div>

    <div class="text-right">
      <el-button type="primary" icon="el-icon-setting" @click="forPush()" v-if="objTreeNodeData.length>0">{{$t('lg.push')}}</el-button>
      <el-button type="primary" icon="el-icon-download" @click="urlDownload()" v-if="objTreeNodeData.length>0">{{$t('lg.downloaddata')}}</el-button>
      <!-- <a ref="url_download" href="javascript:;" @click="downloadConf()" class="edit-del-a"><i class="el-icon-download"></i>下载发现的数据</a> -->
      <!-- <el-button type="success" icon="el-icon-time" @click="isShowTimingTask=true">{{$t('lg.arrangealerting')}}</el-button> -->
      <!-- <el-button type="primary" @click="showSelectSnode()">{{$t('lg.checkaddprotectconfig')}}</el-button> -->
    </div>

    <!-- 查询url的参考配置信息 -->
    <url-refer-config ref="urlReferConfig" :isShow="isShowUrlReferConfigDialog" :urlReferConfigTitle="urlReferConfigTitle" @urlReferConfigDialogClose="isShowUrlReferConfigDialog=false"></url-refer-config>
    
    <!-- 安排报警任务 -->
    <!-- <timing-task-pop :isShow="isShowTimingTask" :myTaskType="'urlCompare'" :myTaskTypeTxt="$t('lg.objbased')" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop> -->

    

  </div>
</template>

<script>
import axios from 'axios';
import * as types from '@/store/types';
import client from "@/components/es/connection";
import {SERVER_API_URL} from '@/conf/constvar';
import toISO8601 from '@/assets/js/iso8601';
import loading from '@/components/loading/loading';

import urlReferConfig from '@/components/apiConfig/urlReferConfig';
// import timingTaskPop from '@/components/alarmTask/timingTaskPop';

let Base64 = require('js-base64').Base64;
export default {
  components:{
    urlReferConfig,
   // timingTaskPop,
    loading
  },
  data(){
    return{
      fileList:[],
      uploadActionUri:SERVER_API_URL+'pe/shadow/domain/location/import',
      uploadheader:{
        Authorization:'Bearer '+sessionStorage.getItem('mytoken')
      },
      domainLoading:true,
      searchObjform:{
        paramType:1,
        paramDomain:'',
        paramStrTime:'',
        paramDeadline:'',
        esDomainArr:[]
      },
      searchObjformRules:{
        paramType:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        paramDomain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        paramStrTime:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        paramDeadline:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },
      // urlTypeArr:[
      //   {
      //     value:0,
      //     label:'URI白名单'
      //   },
      //   {
      //     value:1,
      //     label:'API接口'
      //   }
      // ],

      //查询获取对比结果
      strTimestamp:null,//记录当前查询的参数
      lteTimestamp:null,
      domainName:'',
      apiIndicator:0,

      objTreeNodeData:[],//存储查询回来的结果
      objTreeProps:{
        children: 'children',
        label: 'label'
      },

      //url的参考配置建议
      isShowUrlReferConfigDialog:false,
      urlReferConfigTitle:'',

      //安排报警任务
      isShowTimingTask:false

    }
  },
  mounted(){//这里是：当从报警任务点击查看按钮跳转到这个页面时，把报警任务里面的参数通过router传值传过来，使得它们再作为查询的参数，并把查询的结果展示给用户
    // console.log(this.$route.query);
    if(this.$route.query.domain){
      var paramUrl = this.$route.query;
      this.searchObjform.paramType=paramUrl.urlType;
      this.searchObjform.paramDomain=paramUrl.domain;
      
      var dataNow = new Date().getTime();
      var strIntervalNum = paramUrl.timeStrInterval.match(/(\d*)(\w*)/)[1];
      var strIntervalUnit = paramUrl.timeStrInterval.match(/(\d*)(\w*)/)[2];

      var endIntervalNum = paramUrl.timeLteInterval.match(/(\d*)(\w*)/)[1];
      var endIntervalUnit = paramUrl.timeLteInterval.match(/(\d*)(\w*)/)[2];

      var timeStrVal = 0, timeEndVal=0;
      switch(strIntervalUnit)
      {
        case "m":
        timeStrVal = dataNow - strIntervalNum*60*1000;
        break;
        case "h":
        timeStrVal = dataNow - strIntervalNum*60*60*1000;
        break;
        default:
        timeStrVal = dataNow - strIntervalNum*24*60*60*1000;
      };
      switch(endIntervalUnit)
      { 
        case "m":
        timeEndVal = dataNow - endIntervalNum*60*1000;
        break;
        case "h":
        timeEndVal = dataNow - endIntervalNum*60*60*1000;
        break;
        default:
        timeEndVal = dataNow - endIntervalNum*24*60*60*1000;
      };
      this.searchObjform.paramStrTime=new Date(timeStrVal);
      this.searchObjform.paramDeadline=new Date(timeEndVal);
      this.getObjData();
    }
  },
  methods:{
    downloadURI(){
      let _this=this;
      var filename=this.$t('lg.xiazaiuriwhitemb')+".xlsx";
      var url=SERVER_API_URL+"pe/shadow/domain/location/importtemplate";
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        })
        .then((response) => {
          var blob=new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
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
    beforeupload(file){
      // console.log(file);
      var _this=this;
      const theFile = file.name;
      var arr=theFile.split(".");
      var getSuffix=arr[1];
      var fileName=arr[0];
      if(getSuffix=="xlsx" || getSuffix=="xlx"){
        return true;
      }else{
        this.$message.error(this.$t('lg.geshiwrong'));
        return false;
      }
    },
    onsuccess(res, file, fileList){
      // console.log(res)
      var _this=this;
      var fileType = file.name.split(".")[1];//上传文件的类型 crt, key, conf ,pem
      if(res.responseCode==0){
        this.$message({
          type: 'success',
          message: _this.$t('lg.success')
        });
      //  this.$emit("updateRoDoclist",fileType);
       // this.roUploadfileClose();
      }else{
        this.$message.error(_this.$t('lg.failed')+': '+ res.data.message);
      }
      this.fileList = [];
    },
    getDomains(callback){  
      let _this=this;
      const sttime=_this.$store.state.mydatedata.starttime,
            edtime=_this.$store.state.mydatedata.endtime;
      const fromTime2=toISO8601(sttime),
            endTime2=toISO8601(edtime);
      _this.domainLoading=true;
      client.search({
        index:"shadow-filebeat*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "filter":[
                {
                  "range": {
                    "@timestamp": {
                      "gte":fromTime2,
                      "lte":endTime2,
                    }
                  }
                }
              ],
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
        _this.domainLoading=false;
        const resData=res.aggregations?res.aggregations.GroupByDomain.buckets:[];
        _this.searchObjform.esDomainArr=resData;
      });
      // if(callback){
      //   this.searchObjform.paramDomain="";
      //   this.$store.commit(types.GETESDOMAINS);
      // }
    },
    getObjData(){
      this.$refs['searchObjform'].validate((valid)=>{
        if(valid){
          var _this=this;
          _this.$store.state.contentLoading = true;
       //   _this.strTimestamp=toISO8601(_this.searchObjform.paramStrTime);
        //  _this.lteTimestamp = toISO8601(_this.searchObjform.paramDeadline);
        _this.strTimestamp=toISO8601(_this.$store.state.mydatedata.starttime);
        _this.lteTimestamp = toISO8601(_this.$store.state.mydatedata.endtime);
          _this.domainName=_this.searchObjform.paramDomain;
          _this.apiIndicator=_this.searchObjform.paramType;

        //  var url = SERVER_API_URL+"mc/esquery/urlcompare?strTimestamp="+_this.strTimestamp+"&lteTimestamp="+_this.lteTimestamp+"&domainName="+_this.domainName+"&apiIndicator="+_this.apiIndicator;
          var url = SERVER_API_URL+"mc/esquery/uriwhite?strTimestamp="+_this.strTimestamp+"&lteTimestamp="+_this.lteTimestamp+"&domainName="+_this.domainName;
          axios.get(url).then((res)=>{
            if(res.data.responseCode==0){
              var resData = res.data.data;
              var resultArr =[];
              for(var key in resData){
                var itemObj={
                      label:key,
                      new:resData[key].new,
                      children:[]
                    };
                var isChildNew = false; 
                var childrenObj = resData[key].refMap;
                for(var item in childrenObj){
                  if(childrenObj[item]){
                    isChildNew=true;
                  }
                  itemObj.children.push({
                    label:item,
                    new:childrenObj[item]
                  })
                }
                itemObj.childNew=isChildNew;
                resultArr.push(itemObj);
              }
              _this.objTreeNodeData=resultArr;
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.$store.state.contentLoading = false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },

    getUrlReferConfig2(data,event){//请求接口 异步 这是调用子组件里的方法
      if(event) event.stopPropagation();//避免点击查看时触发列表展开收缩事件
      const locationName = data.label;
      const lteTimestamp = toISO8601(new Date());
      const referConfigParam={
        apiIndicator:this.apiIndicator,
        domainName:this.domainName,
        locationName:locationName,
       // strTimestamp:this.lteTimestamp,
        strTimestamp:this.searchObjform.paramStrTime,
        lteTimestamp:lteTimestamp
      }

      this.urlReferConfigTitle=locationName;

      this.$refs.urlReferConfig.getUrlReferConfigData(referConfigParam).then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.isShowUrlReferConfigDialog=true; //打开弹框
      }).catch((error) => {
        this.$message.error(this.$t('lg.failed'));
        console.log(error)
      });
    },
    getUrlReferConfig(data,event){//请求接口 异步 这是调用子组件里的方法
    let _this=this;
      if(event) event.stopPropagation();//避免点击查看时触发列表展开收缩事件
      const locationName = data.label;
      let url=SERVER_API_URL+"pe/shadow/domain/location/urlcompare?domainName="+_this.domainName+"&urlList="+locationName;
     axios.get(url).then((res)=>{
       if(res.data.responseCode == 0){
         this.$message({
                type: "success",
                message: _this.$t('lg.success')
              });
       }else{
         this.$message.error(_this.$t('lg.failed'));
       }
     });
     
    },

    objRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容
      // console.log(data)
      if(data.new && data.childNew){
        if(data.children){
          return (
            <span class="obj-tree-node">
              <span class="nodeTxt">{node.label}
                <span class="el-icon-warning font-blue newPoint"></span>
                <img class="newImg" src="./static/icon/newIcon.png"/>
              </span>
              <span>
                <el-button size="small" type="text" icon="el-icon-setting" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.tuisongpz')}</el-button>
              </span>
            </span>
          );
        }else{
          return (
            <span class="obj-tree-node">
              <span class="nodeTxt"> <i class="refererTxt">[ HTTP Referer ]</i> {node.label}
                <span class="el-icon-warning font-blue newPoint"></span>
                <img class="newImg" src="./static/icon/newIcon.png"/>
              </span>
            </span>
          );
        }
      }else if(data.new && !data.childNew){
        if(data.children){
          return (
            <span class="obj-tree-node">
              <span class="nodeTxt">{node.label}
                <img class="newImg" src="./static/icon/newIcon.png"/>
              </span>
              <span>
                <el-button size="small" type="text" icon="el-icon-setting" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.tuisongpz')}</el-button>
              </span>
            </span>
          );
        }else{
          return (
            <span class="obj-tree-node">
              <span class="nodeTxt"> <i class="refererTxt">[ HTTP Referer ]</i> {node.label}
                <img class="newImg" src="./static/icon/newIcon.png"/>
              </span>
            </span>
          );
        }
      }else if(!data.new && data.childNew){
        if(data.children){
          return (
            <span class="obj-tree-node">
              <span>{node.label}
                <span class="el-icon-warning font-blue newPoint"></span>
              </span>
              <span>
                <el-button size="small" type="text" icon="el-icon-setting" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.tuisongpz')}</el-button>
              </span>
            </span>
          );
        }else{
          return (
            <span class="obj-tree-node">
              <span> <i class="refererTxt">[ HTTP Referer ]</i> {node.label}
                <span class="el-icon-warning font-blue newPoint"></span>
              </span>
            </span>
          );
        }
      }else{
        if(data.children){
          return (
            <span class="obj-tree-node">
              <span>{node.label}</span>
              <span>
                <el-button size="small" type="text" icon="el-icon-setting" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.tuisongpz')}</el-button>
              </span>
            </span>
          );
        }else{
          return (
            <span class="obj-tree-node">
              <span> <i class="refererTxt">[ HTTP Referer ]</i> {node.label}</span>
            </span>
          );
        }
      }
    },

    //下载发现的数据 方法1
    urlDownload(){
      var _this=this;
      var lteTimestamp = toISO8601(new Date());
      var token = sessionStorage.getItem('mytoken');//下载数据要在下载url里带上授权token
      var url=SERVER_API_URL+"mc/esquery/urldownload?fromTimestamp="+_this.strTimestamp+'&toTimestamp='+lteTimestamp+'&domainName='+_this.domainName+'&apiIndicator='+_this.apiIndicator+"&access_token="+token;
      window.open(url,'_self');
    },

    forPush(){
      let _this=this;
      let str="";
    //  let str=[];
      for(let i=0;i<_this.objTreeNodeData.length;i++){
        str+=_this.objTreeNodeData[i].label+",";
       // str.push(_this.objTreeNodeData[i].label)
      }
      str=str.slice(0,-1);
     let url=SERVER_API_URL+"pe/shadow/domain/location/urlcompare?domainName="+_this.domainName+"&urlList="+str;
     axios.get(url).then((res)=>{
       if(res.data.responseCode == 0){
         this.$message({
                type: "success",
                message: _this.$t('lg.success')
              });
       }else{
         this.$message.error(_this.$t('lg.failed'));
       }
     })

    }
  }
  
}
</script>

<style>
.objUpdate-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.objtree-tips{
  line-height: 1.6;
  font-size: 12px;
  margin-bottom: 10px
}
.objTreeBox{
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px
}
.obj-tree-node{
  white-space: normal;
  word-break: break-all;
  margin: 8px;
  line-height: 20px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nodeTxt{
  position: relative;
  margin-right: 30px;
}
.refererTxt{
  font-weight: 600;
}
.newPoint{
  margin-left: 8px;
}
.newImg{
  position: absolute;
  bottom: 0px;
  width: 30px;
  height: 30px;
}
.el-upload{width: 100%;}
</style>
