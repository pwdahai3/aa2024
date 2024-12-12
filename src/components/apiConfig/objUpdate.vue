<template>
  <div class="objUpdate-wrapper">
    <h2 class="breadcrumb">{{$t('lg.objfx')}}</h2>
    <el-form ref="searchObjform" class="form-bg" style="padding-bottom:0" :model="searchObjform" :rules="searchObjformRules" label-width="0">
      <p class="tips tipsBox">{{$t('lg.zhu32')}}</p>
      <el-row :gutter="10">

        <el-col :span="8">
          <el-form-item prop="paramType">
            <el-select v-model="searchObjform.paramType" :placeholder="$t('lg.select')" style="width:100%">
              <template v-for="item in urlTypeArr">
                <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
            <!-- <el-input v-model.trim="searchObjform.paramDomain" :placeholder="$t('lg.inputdomain')"></el-input> -->
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item prop="paramDomain">
            <el-select v-model="searchObjform.paramDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains($event)" style="width:100%" :loading="$store.state.getEsDomainArrLoading">
              <template v-for="item in $store.state.esDomainArr">
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
              placeholder="时间点一"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item prop="paramDeadline">
            <el-date-picker
              v-model="searchObjform.paramDeadline"
              type="datetime"
              placeholder="时间点二"
              style="width:100%">
            </el-date-picker>
          </el-form-item>
        </el-col> -->

        <el-col :span="4">
          <el-button type="primary" style="width:100%" @click="getObjData()" icon="el-icon-search">{{$t('lg.query')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查询结果数据展示 -->
    <div class="objtree-tips" v-if="objTreeNodeData.length>0">
      <p>{{$t('lg.zhu32')}}</p>
      <p>{{$t('lg.zhu33')}}</p>
      <p>{{$t('lg.zhu34')}}</p>
    </div>
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
      <el-button type="success" icon="el-icon-time" @click="isShowTimingTask=true">{{$t('lg.arrangealerting')}}</el-button>
      <!-- <el-button type="primary" @click="showSelectSnode()">{{$t('lg.checkaddprotectconfig')}}</el-button> -->
    </div>

    <!-- 查询url的参考配置信息 -->
    <url-refer-config ref="urlReferConfig" :isShow="isShowUrlReferConfigDialog" :urlReferConfigTitle="urlReferConfigTitle" @urlReferConfigDialogClose="isShowUrlReferConfigDialog=false"></url-refer-config>
    
    <!-- 安排报警任务 -->
    <timing-task-pop :isShow="isShowTimingTask" :myTaskType="'urlCompare'" :myTaskTypeTxt="$t('lg.objbased')" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>

    <!-- 选中增加保护配置 -->
    <!-- <el-dialog width="45%" :title="$t('lg.addconfiginstruction')" :visible.sync="isShowSnodeDialog" :close-on-click-modal="false" :before-close="snodeDialogClose">
      <el-form ref="snodefrom" :model="snodefrom" :rules="snodefromRules"  label-width="105px">
        <el-form-item :label="$t('lg.domain')" prop="paramDomain">
          <el-input v-model.trim="snodefrom.paramDomain" :placeholder="$t('lg.inputdomain')" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.port')" prop="paramPort">
          <el-input v-model.trim="snodefrom.paramPort" :placeholder="$t('lg.inputdomain')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
          <el-select v-model="snodefrom.shadownodes" :placeholder="$t('lg.select')">
            <template v-for="item in snodes">
              <el-option :label="item.isShadowGroup?item.hostName+'(集群)':item.hostName+'('+item.snodeId+')'" :value="item.snodeId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCheckedNodes">{{$t('lg.yes')}}</el-button>
          <el-button @click="snodeDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="addSubfilterLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog> -->

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
import timingTaskPop from '@/components/alarmTask/timingTaskPop';

let Base64 = require('js-base64').Base64;
export default {
  components:{
    urlReferConfig,
    timingTaskPop,
    loading
  },
  data(){
    return{
      searchObjform:{
        paramType:1,
        paramDomain:'',
        paramStrTime:'',
        paramDeadline:''
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
      urlTypeArr:[
        // {
        //   value:0,
        //   label:'URI白名单'
        // },
        {
          value:1,
          label:this.$t('lg.webapiinter')
        },
        {
          value:0,
          label:this.$t('lg.appipiinter')
        }
      ],

      //查询获取对比结果
      strTimestamp:null,//记录当前查询的参数
      lteTimestamp:null,
      domainName:'',
      apiIndicator:1,
      apiType:1,

      objTreeNodeData:[],//存储查询回来的结果
      objTreeProps:{
        children: 'children',
        label: 'label'
      },

      //url的参考配置建议
      isShowUrlReferConfigDialog:false,
      urlReferConfigTitle:'',

      //安排报警任务
      isShowTimingTask:false,

      //选中增加保护配置
      // isShowSnodeDialog:false,
      // snodes:'',
      // snodefrom:{
      //   paramDomain:'',
      //   paramPort:'',
      //   shadownodes:''
      // },
      // snodefromRules:{
      //   paramDomain:[
      //     {required:true, message:this.$t('lg.required'), trigger:'blur'},
      //   ],
      //   paramPort:[
      //     {required:true, message:this.$t('lg.required'), trigger:'blur'},
      //     {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
      //   ],
      //   shadownodes:[
      //     {required:true, message:this.$t('lg.required'), trigger:'blur'},
      //   ]
      // },
      // addSubfilterLoading:false,

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
    getDomains(callback){
      if(callback){
        this.searchObjform.paramDomain="";
        this.$store.commit(types.GETESDOMAINS);
      }
    },
    getObjData(){
      this.$refs['searchObjform'].validate((valid)=>{
        if(valid){
          var _this=this;
          _this.$store.state.contentLoading = true;
          let end = new Date().getTime()-3600 * 1000 * 24;
          let start = new Date().getTime() - 3600 * 1000 * 24 * 7;
          _this.strTimestamp=toISO8601(new Date(start));
          _this.lteTimestamp = toISO8601(new Date(end));
          console.log(_this.strTimestamp,_this.lteTimestamp)
          _this.domainName=_this.searchObjform.paramDomain;
        //  _this.apiIndicator=1;
          _this.apiType=_this.searchObjform.paramType;

          var url = SERVER_API_URL+"mc/esquery/urlcompare?strTimestamp="+_this.strTimestamp+"&lteTimestamp="+_this.lteTimestamp+"&domainName="+_this.domainName+"&apiIndicator="+_this.apiIndicator+"&apiType="+_this.apiType;
          axios.get(url).then((res)=>{
            // console.log(res);

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
              // console.log(resultArr)
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

    getUrlReferConfig(data,event){//请求接口 异步 这是调用子组件里的方法
      if(event) event.stopPropagation();//避免点击查看时触发列表展开收缩事件
      const locationName = data.label;
      const lteTimestamp = toISO8601(new Date());
      const referConfigParam={
        apiIndicator:this.apiIndicator,
        domainName:this.domainName,
        locationName:locationName,
        strTimestamp:this.strTimestamp,
      //  strTimestamp:this.searchObjform.paramStrTime,
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
                <el-button size="small" type="text" icon="el-icon-search" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.configproperty')}</el-button>
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
                <el-button size="small" type="text" icon="el-icon-search" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.configproperty')}</el-button>
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
                <el-button size="small" type="text" icon="el-icon-search" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.configproperty')}</el-button>
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
                <el-button size="small" type="text" icon="el-icon-search" on-click={ (event) => this.getUrlReferConfig(data, event) }>{this.$t('lg.configproperty')}</el-button>
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

    },

    //下载发现的数据 方法2
    // downloadConf(){
    //   var _this=this;
    //   var token = sessionStorage.getItem('mytoken');
    //   var lteTimestamp = toISO8601(new Date());
    //   var url=SERVER_API_URL+"mc/esquery/urldownload?fromTimestamp="+_this.strTimestamp+'&toTimestamp='+lteTimestamp+'&domainName='+_this.domainName+'&apiIndicator='+_this.apiIndicator+"&access_token="+token;
    //   var tgElement=_this.$refs.url_download;
    //   tgElement.setAttribute("href",url);
    // },


    //推送配置

    //选中增加保护配置
   // showSelectSnode(){
    //   var _this=this;
    //   var checkArr=this.$refs.tree.getCheckedNodes(false,true);
    //   if(checkArr.length==0){
    //     this.$message.error(_this.$t('lg.leastconfiginstruction'));
    //     return;
    //   }
    //   var url=SERVER_API_URL+"pe/shadow/snode";//查询当前所有业务节点
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode == 0){
    //       this.snodes=res.data.data;
    //       this.isShowSnodeDialog=true;
    //       this.snodefrom.paramDomain=this.searchObjform.paramDomain;
    //     }else{
    //       this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //   });
    // },
    // snodeDialogClose(){
    //   this.$refs['snodefrom'].resetFields();
    //   this.isShowSnodeDialog=false
    // },
    // getCheckedNodes(){
    //   var _this=this;
    //   this.$refs['snodefrom'].validate((valid)=>{
    //     if(valid){
    //       this.addSubfilterLoading=true;
    //       // console.log(this.$refs.tree.getCheckedNodes(false,true));
    //       var checkArr=this.$refs.tree.getCheckedNodes(false,true);

    //       var uriMap={},valLabel="";
    //       checkArr.forEach(element => {
    //         if(element.hasOwnProperty("childNew")){
    //           valLabel=element.label;
    //           uriMap[valLabel]=[];
    //         }else{
    //           uriMap[valLabel].push(element.label)
    //         }
    //       });
    //       // console.log(uriMap)

    //       var url = SERVER_API_URL+"/pe/shadow/subfilter/location/batch";
    //       var domainName=this.snodefrom.paramDomain;
    //       var domainPort=this.snodefrom.paramPort;
    //       var snodeId=this.snodefrom.shadownodes;
    //       axios.post(url,{
    //         domainName:domainName,
    //         domainPort:domainPort,
    //         snodeId:snodeId,
    //         uriMap:uriMap
    //       }).then((res)=>{
    //         // console.log(res);
    //         if(res.data.responseCode==0){
    //           this.snodeDialogClose();
    //         }else{
    //           this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //         }
    //         this.addSubfilterLoading=false;
    //       }).catch((err)=>{
    //         console.log(err)
    //       })

    //     }
    //   })
   // }
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
</style>
