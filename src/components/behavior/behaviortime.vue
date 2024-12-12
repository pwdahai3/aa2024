<template>
  <div class="behavior-wrapper">
    <h2 class="breadcrumb">{{$t('lg.jiyushijiang')}}</h2>
    <el-form class="form-bg" style="padding-bottom:0" ref="behaviorform" :model="behaviorform" :rules="behaviorformRules"  label-width="0">
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
        <el-col :span="4">
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
              <el-form-item prop="multiple">
                <el-input v-model="behaviorform.multiple" :placeholder="$t('lg.timefactor')" style="width:100%"></el-input>
              </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
              <el-form-item prop="counts">
                <el-input v-model="behaviorform.counts" :placeholder="$t('lg.counts')" style="width:100%"></el-input>
              </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <el-button type="primary" style="width:100%" @click="getTokenTimeData" icon="el-icon-search">{{$t('lg.query')}}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    
    <!-- 查询结果数据展示 -->
    <div class="myTreeBox">
      <el-tree
        :data="queryTimeData"
        :props="queryTimeTreeProps"
        ref="tree"
        :render-content="queryTimeRenderContent"><!-- show-checkbox -->
      </el-tree>
    </div>

    <div class="text-right">
      <el-button type="success" icon="el-icon-time" @click="isShowTimingTask=true">{{$t('lg.arrangealerting')}}</el-button>
    </div>
    <timing-task-pop :isShow="isShowTimingTask" :myTaskType="'tokenTime'" :myTaskTypeTxt="$t('lg.tokentimebased')" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>
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
        multiple:'',
        counts:'',
        // domainArr:[],
        // urlArr:[],
      },
      behaviorformRules:{
        domain: [
          {required: true, message: this.$t('lg.inputdomain'), trigger: 'blur'}
        ],
        url: [
          // {required: true, message: this.$t('lg.selectarea'), trigger: 'blur'}
        ],
        multiple:[
          {required: true, message: this.$t('lg.inputtimefactor'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        counts:[
          {required: true, message: this.$t('lg.inputcounts'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message:this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },

      queryTimeData:[],
      queryTimeTreeProps:{
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
   // getGEOIP(callback){//获取区域数据
    //   // console.log(callback)
    //   if(callback){
    //     var _this=this;
    //     var sttime=_this.$store.state.mydatedata.starttime,
    //         edtime=_this.$store.state.mydatedata.endtime;
    //     var fromTime2=toISO8601(sttime),
    //         endTime2=toISO8601(edtime);
    //     var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
    //         endTime=endTime2 || toISO8601(new Date());
    //     var domainVal = _this.behaviorform.domain;
    //       _this.behaviorform.geoip="";
    //     client.search({
    //       index:"shadow-filebeat*",
    //       body:{
    //         "size": 0,
    //         "query": {
    //           "bool": {
    //             "must": [
    //               {
    //                 "query_string": {
    //                   "query": "shadow.access.error_code:0"
    //                 }
    //               },
    //               {
    //                 "query_string": {
    //                   "query": "shadow.access.decrypted:1"
    //                 }
    //               },
    //               {
    //                 "term": {
    //                   "shadow.access.domain": domainVal
    //                 }
    //               },
    //               {
    //                 "range": {
    //                   "@timestamp": {
    //                     "gte": fromTime,
    //                     "lte": endTime,
    //                   }
    //                 }
    //               }
    //             ],
    //             "must_not": [
    //               {
    //                 "match": {
    //                   "shadow.access.token": "00000000000000000000000000000000"
    //                 }
    //               },{
    //                 "match": {
    //                   "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    //                 }
    //               }
    //             ]
    //           }
    //         },
    //         "aggs": {
    //           "geo": {
    //             "terms": {
    //               "script": {
    //                 "inline": "params._source.shadow.access.geoip",
    //                 "lang": "painless"
    //               },
    //               "size": 100
    //             },
    //             "aggs": {
    //               "geoip": {
    //                 "scripted_metric": {
    //                   "init_script": "params._agg.geoip = []",
    //                   "map_script": "params._agg.geoip.add(params._source.shadow.access.geoip)",
    //                   "combine_script": "ArrayList list=new ArrayList(); for (s in params._agg.geoip) { list.add(s); } return list",
    //                   "reduce_script": "return params._aggs.get(0)"
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }).then((res)=>{
    //       // console.log(res);
    //       var buckets=res.aggregations.geo.buckets;
    //       var result=[];
    //       for(var i=0;i<buckets.length;i++){
    //         var dataI=buckets[i];
    //         if(dataI.geoip.value[0].city_name){
    //           result.push(dataI.geoip.value[0].city_name)
    //         }
    //       }
    //       _this.behaviorform.urlArr=result;
    //     });
    //   }
   // },
    getUrls(callback){//获取url数据
      if(callback){
        this.behaviorform.url="";
        var domainVal = this.behaviorform.domain;
        this.$store.commit(types.GETESURLS,{domain:domainVal,flag:true});
      }
    },
    getTokenTimeData(){//查询
      this.$refs['behaviorform'].validate((valid)=>{
        if(valid){
          var _this=this;
          var domainVal=_this.behaviorform.domain,
              urlVal=_this.behaviorform.url?'\"'+_this.behaviorform.url+'\"':'*',
              multiple=_this.behaviorform.multiple,
              counts=_this.behaviorform.counts;
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
                  "filter":[
                    {
                      "range": {
                        "@timestamp": {
                          "gte": fromTime,
                          "lte": endTime,
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
                        "shadow.access.http_host": domainVal
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
                    },{
                      "match": {
                        "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "GroupByUrl":{
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 500
                  },
                  "aggs": {
                    "GroupByToken": {
                      "terms": {
                        "field": "shadow.access.token",
                        "size": 500
                      },
                      "aggs": {
                        "avg_starttime": {
                          "avg": {
                            "field": "shadow.access.send_time"
                          }
                        },
                        "avg_endtime": {
                          "avg": {
                            "field": "shadow.access.rec_time"
                          }
                        },
                        "avg_time": {
                          "bucket_script": {
                            "buckets_path": {
                              "avg_starttime": "avg_starttime",
                              "avg_endtime": "avg_endtime"
                            },
                            "script": "params.avg_endtime-params.avg_starttime"
                          }
                        },
                        "suspects": {
                          "scripted_metric": {
                            "init_script": "params._agg.suspects=[]",
                            "map_script": "params._agg.suspects.add(Long.parseLong(params._source.shadow.access.rec_time)-Long.parseLong(params._source.shadow.access.send_time))",
                            "combine_script": "ArrayList list=new ArrayList();for(s in params._agg.suspects){list.add(s);}return list",
                            "reduce_script": `double total_time=0;int length=0;for(a in params._aggs){for(i in a){total_time+=i;length+=1;}}double avg_time=total_time/length;int count=0;for(a in params._aggs){for(i in a){if(i>(avg_time*${multiple})){count+=1;}}}if(count>=${counts}){return count;}else{return null;}`
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            // console.log(res)
            let resultArr=[];
            const buckets=res.aggregations.GroupByUrl.buckets;
            buckets.forEach(ele=>{
              let itemObj={
                    label:ele.key,
                    children:[]
                  };
              const childrenObj=ele.GroupByToken.buckets;
              childrenObj.forEach(val=>{
                if(val.suspects.value){
                  itemObj.children.push({
                    label:val.key,
                    counts:val.doc_count,
                    avgTime:(val.avg_time.value/1000).toFixed(2),
                    suspects:val.suspects.value
                  })
                }
              })
              if(itemObj.children.length>0){
                resultArr.push(itemObj)
              }
            })

            // console.log(resultArr)
            _this.queryTimeData=resultArr;
            _this.$store.state.contentLoading=false;

          });
        }
      })
    },
    queryTimeRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容 
      if(data.children){
        return (
          <span class="my-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }else{
        //  <div class="my-tree-node">
        //      <table>
        //       <thead>
        //         <tr>
        //           <th>浏览器指纹</th>
        //           <th>平均时间</th>
        //           <th>次数</th>
        //         </tr>
        //       </thead>
        //       <tbody>
        //         <tr>
        //           <td>{data.label}</td>
        //           <td>{data.avgTime}</td>
        //           <td>{data.counts}</td>
        //         </tr>
        //       </tbody>
        //     </table>
        //   </div>
        return (
          <p class="my-tree-node">
            <span>{this.$t('lg.token')}：{node.label}，{this.$t('lg.qipingjufwshwe')}：{data.avgTime}{this.$t('lg.second')}，{this.$t('lg.fanwencisw')}：{data.counts}{this.$t('lg.count')}</span>
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
<style lang="stylus">
.behavior-wrapper
  width 100%
  height 100%
  position relative
  padding 15px
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
