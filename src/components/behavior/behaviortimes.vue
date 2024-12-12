<!-- 基于访问次数 -->
<template>
  <div class="behavior-wrapper">
    <h2 class="breadcrumb">{{$t('lg.jiyucishu')}}</h2>
    <el-form ref="behaviorform" class="form-bg" style="padding-bottom:0" :model="behaviorform" :rules="behaviorformRules"  label-width="0">
      <el-row :gutter="10">
        <el-col :span="8">
          <div class="grid-content">
            <el-form-item prop="domain">
              <el-select v-model="behaviorform.domain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains($event)" style="width:100%" :loading="$store.state.getEsDomainArrLoading">
                <template v-for="item in $store.state.esDomainArr">
                  <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
                </template>
              </el-select>
              <!-- <el-input v-model.trim="behaviorform.domain" style="width:100%" :placeholder="$t('lg.inputdomain')"></el-input> -->
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">
            <el-form-item prop="url">
              <el-select v-model="behaviorform.url" :placeholder="$t('lg.selecturl')" style="width:100%" clearable @visible-change="getUrls($event)" :loading="$store.state.getEsUrlArrLoading">
                <template v-for="item in $store.state.esUrlArr">
                  <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <el-form-item prop="prenum">
              <el-input v-model="behaviorform.prenum" :placeholder="$t('lg.countstobe')" style="width:100%"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <el-button type="primary"  style="width:100%" @click="getTokenTimesData">{{$t('lg.query')}}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 查询结果数据展示 -->
    <div class="myTreeBox">
      <el-tree
        :data="querytimesData"
        :props="queryTimesTreeProps"
        ref="tree"
        :render-content="queryTimesRenderContent"><!-- show-checkbox -->
      </el-tree>
    </div>

    <el-row class="text-right">
      <el-button type="success" icon="el-icon-time" @click="isShowTimingTask=true">{{$t('lg.arrangealerting')}}</el-button>
    </el-row>
    <timing-task-pop :isShow="isShowTimingTask" :myTaskType="'tokenCount'" :myTaskTypeTxt="$t('lg.tokencountbased')" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>
  </div>
</template>
<script>
import axios from 'axios';
import * as types from '@/store/types';
import client from "@/components/es/connection";
// import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import {SERVER_API_URL} from '@/conf/constvar';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
export default {
  data(){
    return{
      behaviorform:{
        domain:'',
        url:'',
        prenum:'',
        // domainArr:[],
        // urlArr:[]
      },
      behaviorformRules:{
        domain: [
          {required:true, message:this.$t('lg.inputdomain'), trigger:'blur'}
        ],
        url: [
          // {required:true, message:this.$t('lg.selecturl'), trigger:'blur'}
        ],
        prenum:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message:this.$t('lg.requirepositive'), trigger:'change'}
        ]
      },

      querytimesData:[],
      queryTimesTreeProps:{
        children: 'children',
        label: 'label'
      },

      isShowTimingTask:false,
    }
  },
  methods:{
    getDomains(callback){//获取域名数据
      if(callback){
        this.behaviorform.domain="";
        this.behaviorform.url="";
        this.$store.commit(types.GETESDOMAINS,true);
      }
    },
    getUrls(callback){//获取url数据
      if(callback){
        this.behaviorform.url="";
        var domainVal = this.behaviorform.domain;
        this.$store.commit(types.GETESURLS,{domain:domainVal,flag:true});
      }
    },
    getTokenTimesData(){//查询
      this.$refs['behaviorform'].validate((valid)=>{
        if(valid){
          var _this=this;
          var domainVal=_this.behaviorform.domain,
              urlVal=_this.behaviorform.url?'\"'+_this.behaviorform.url+'\"':'*',
              prenum=_this.behaviorform.prenum;
          var sttime=_this.$store.state.mydatedata.starttime,
              edtime=_this.$store.state.mydatedata.endtime;
          var fromTime2=toISO8601(sttime),
              endTime2=toISO8601(edtime);
          var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
              endTime=endTime2 || toISO8601(new Date());  
          _this.$store.state.contentLoading=true;
          client.search({
            index:"shadow-filebeat*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "filter":[{
                      "range": {
                        "@timestamp": {
                          "gte": fromTime,
                          "lte": endTime,
                        }
                      }
                    }],
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
                      "term": {
                        "shadow.access.http_host":domainVal
                      }
                    },
                    {
                      "query_string": {
                        "query": "shadow.access.org_url:"+urlVal
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
                "GroupByUrl": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 500
                  },
                  "aggs": {
                    "GroupByToken": {
                      "terms": {
                        "field": "shadow.access.token",
                        "min_doc_count": prenum,
                        "size": 500
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            // console.log(res);
            let resultArr=[];
            const buckets=res.aggregations.GroupByUrl.buckets;
            buckets.forEach(ele=>{
              let itemObj={
                    label:ele.key,
                    children:[]
                  };
              const childrenObj=ele.GroupByToken.buckets;
              childrenObj.forEach(val=>{
                itemObj.children.push({
                  label:val.key,
                  counts:val.doc_count,
                })
              })
              if(itemObj.children.length>0){
                resultArr.push(itemObj)
              }
            })

            this.querytimesData=resultArr;
            this.$store.state.contentLoading=false;
          })
        }
      })
    },
    queryTimesRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容 
      if(data.children){
        return (
          <span class="my-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }else{
        return (
          <p class="my-tree-node">
            <span>{this.$t('lg.token')}：{node.label}，{this.$t('lg.qipingjufwshwe')}：{data.counts}{this.$t('lg.count')}</span>
          </p>
        );
      }
    }
  },
  components:{
    timingTaskPop
  }
}
</script>
<style lang="stylus" scoped>
.behavior-wrapper
  width 100%
  height 100%
  position relative
  padding 15px;
  box-sizing border-box
  display flex
  flex-direction column
  overflow hidden
  .myTreeBox
    flex 1
    overflow-y auto
    margin-bottom 10px
    .my-tree-node
      white-space normal
      word-break break-all
      margin 8px
      line-height 20px
</style>
