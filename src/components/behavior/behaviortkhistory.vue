<template>
  <div class="behavior-wrapper">
    <h2 class="breadcrumb">{{$t('lg.jiyujilu')}}</h2>
    <el-form ref="behaviorform" class="form-bg" style="padding-bottom:0" :model="behaviorform" :rules="behaviorformRules"  label-width="0">
      <el-row :gutter="10">
        <el-col :span="20">
          <div class="grid-content">
            <el-form-item prop="token">
              <el-input v-model.trim="behaviorform.token" :placeholder="$t('lg.fp')" style="width:100%"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content">
            <el-button type="primary"  style="width:100%" @click="getTokenhistory()">{{$t('lg.query')}}</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <div class="query-result">
      <div v-if="queryTkhistoryData.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <table class="q-table" v-if="queryTkhistoryData.length>0">
        <thead>
          <tr>
            <th style="min-width:100px">{{$t('lg.nodeip')}}</th>
            <th style="min-width:100px"><span v-if="isOrg">{{$t('lg.sourceip')}}</span><span v-else>{{$t('lg.agentip')}}</span><el-button class="swicthIPBtn" :title="$t('lg.switchsourceip')" type="success" size="mini" @click="getTokenhistory(isOrg)"><i class="fa fa-exchange"></i></el-button></th>
            <th style="min-width:200px">HOST</th>
            <th>URI</th>
            <th style="min-width:100px">{{$t('lg.time')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in queryTkhistoryData">
            <td>{{item.shadowIP}}</td>
            <td>{{item.ip}}</td>
            <td>{{item.host}}</td>
            <td>{{item.uri}}</td>
            <td>{{item.time}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import client from "@/components/es/connection";
// import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import * as types from '@/store/types';
export default {
  data(){
    return{
      queryTkhistoryData:[],
      behaviorform:{
        token:''
      },
      behaviorformRules:{
        token: [
          {required: true, message:this.$t('lg.required'), trigger: 'blur' },
          {min: 32, max: 32, message: this.$t('lg.length32'), trigger: 'blur' },
          {pattern:/^([0-9|a-f|A-F]*)$/,message: this.$t('lg.invalidtoken'), trigger: 'change'},//十六进制0-9，a-f,A-F
        ]
      },
      isOrg:true,
    }
  },
  methods:{
    getTokenhistory(type){
      var _this=this;
      this.$refs['behaviorform'].validate((valid)=>{
        if(valid){
          var sttime=this.$store.state.mydatedata.starttime,
              edtime=this.$store.state.mydatedata.endtime;
          var fromTime2=toISO8601(sttime),
              endTime2=toISO8601(edtime);
          var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
              endTime=endTime2 || toISO8601(new Date());  

          let searchIp = '';
          if(type){
            _this.isOrg=false;
            searchIp="shadow.access.org_remote_ip";
          }else{
            _this.isOrg=true;
            searchIp="shadow.access.remote_ip";
          }
          
          var tokenV=this.behaviorform.token;
          this.$store.state.contentLoading=true;
          client.search({
            index:"shadow-filebeat*",
            body:{
              "size": 0,
              // "sort": [
              //     {
              //       "@timestamp": {
              //         "order": "desc"
              //       }
              //     }
              //   ],
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
                        "query":"shadow.access.token:"+tokenV
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": fromTime,
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
                        "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "groupbyip": {
                  "terms": {
                    "field": searchIp
                  },
                  "aggs": {
                    "groupbyhost": {
                      "terms": {
                        "field": "shadow.access.http_host"
                      },
                      "aggs": {
                        "groupbyuri": {
                          "terms": {
                            "field": "shadow.access.org_url"
                          },
                          "aggs": {
                            "groupbytime": {
                              "terms": {
                                "field": "shadow.access.rec_time",
                                "size": 100
                              },
                              "aggs": {
                                "groupbybeathost": {
                                  "terms": {
                                    "field": "host.hostname"
                                  }
                                }
                              }
                            }
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
            this.$store.state.contentLoading=false;
            var buckets=res.aggregations.groupbyip.buckets;
            var bucketsArr=[];
            for(var i=0;i<buckets.length;i++){
              var bucketsI=buckets[i];
              var key=bucketsI.key;//ip
              for(var j=0;j<bucketsI.groupbyhost.buckets.length;j++){
                var bucketsJ=bucketsI.groupbyhost.buckets[j];//host
                for(var k=0;k<bucketsJ.groupbyuri.buckets.length;k++){
                  var bucketsK=bucketsJ.groupbyuri.buckets[k];//uri
                  for(var t=0;t<bucketsK.groupbytime.buckets.length;t++){
                    var bucketsT=bucketsK.groupbytime.buckets[t];//time
                    for(var p=0;p<bucketsT.groupbybeathost.buckets.length;p++){
                      var bucketsP=bucketsT.groupbybeathost.buckets[p];//shadowIP
                      bucketsArr.push({ip:key,host:bucketsJ.key,uri:bucketsK.key,time:transformDate(bucketsT.key-0),shadowIP:bucketsP.key});
                    }
                  }
                }
              }
            }

            bucketsArr.sort(function(a,b){//按照时间排序
              return new Date(a.time) - new Date(b.time);
            });
            // console.log(bucketsArr)
            this.queryTkhistoryData=bucketsArr;
            function transformDate(d){
              if(!d) return;
              function pad(n){
                return n<10 ? '0'+n : n
              }
              d=new Date(d);
              return d.getFullYear()+'-'+ pad(d.getMonth()+1)+'-'+ pad(d.getDate())+' '+ pad(d.getHours())+':'+ pad(d.getMinutes())+':'+ pad(d.getSeconds());
            }
          });
        }
      });
    }
  }
}
</script>
<style lang="stylus" scoped>
.behavior-wrapper
  width 100%
  height 100%
  position relative
  padding 15px
  box-sizing border-box
  display flex
  flex-direction column
  .query-result
    flex 1
    overflow-y auto
    .swicthIPBtn
      position relative
      vertical-align bottom
      margin-left 10px
      i
        position absolute
        top -1px
        left 28%
        font-size 14px
</style>
