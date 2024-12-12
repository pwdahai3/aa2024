<!-- url的参考配置 -->
<template>
  <div class="urlReferConfig-wrapper">
    <el-dialog width="55%" :title="urlReferConfigTitle" :visible.sync="isShow" :close-on-click-modal="false" :before-close="urlRfCfDialogClose">
      <div class="urlTagBox">
        <span class="titleSpan">{{$t('lg.duiyingbiaoq')}}</span>
        <el-tag
          v-for="tag in urlTagData"
          :key="tag.key">
          {{tag.key}}
        </el-tag>
      </div>
      <div class="urlReferConfigBox">
        <!-- 查询返回的参考配置 -->
        <div class="referenceBox">
          <p class="urlRfConfigTitle">{{$t('lg.cankaopz')}}</p>
          <ul class="referParamList">
            <li>{{$t('lg.shoudongdlsz')}}：{{urlReferConfigfrom.reqeustTime!=null ? urlReferConfigfrom.reqeustTime+$t('lg.ms') : $t('lg.zanwuppz')}}</li>
            <li>{{$t('lg.browserParams')}}：{{urlReferConfigfrom.verifyBrowser!=null? urlReferConfigfrom.verifyBrowser : $t('lg.zanwuppz') }}</li>
            <li>{{$t('lg.userBhIndct')}}：{{urlReferConfigfrom.verifyAgent!=null? urlReferConfigfrom.verifyAgent : $t('lg.zanwuppz')}}</li>
            <li>{{$t('lg.dongtaizwgn')}}：{{urlReferConfigfrom.verifyTokenRate ? $t('lg.dongtaizhiwenz')+urlReferConfigfrom.verifyTokenRate+'%' : $t('lg.dongtaizhiwenz')+'0%'}}  </li>
            <li></li>
          </ul>
        </div>
        <!-- 建议配置 -->
        <div class="suggestBox">
          <p class="urlRfConfigTitle">{{$t('lg.jianyipz')}}</p>
          <el-form ref="urlSugConfigfrom" :model="urlSugConfigfrom" :rules="urlSugConfigfromRules" label-width="125px">

            <el-row :gutter="10">
              <el-col :span="18" >
                <el-form-item :label="$t('lg.shoudongdlsz')" prop="reqeustTime">
                  <el-input v-model.trim="urlSugConfigfrom.reqeustTime" :placeholder="$t('lg.plzenter')"></el-input>
                </el-form-item>
              </el-col> 
              <el-col :span="6">
                <el-form-item label-width="0px">
                  <el-select v-model="requestTimeUnit" :placeholder="$t('lg.select')" style="width:100%">
                    <el-option
                      v-for="item in rqTimeUnitOpt"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col> 
            </el-row> 

            <el-form-item :label="$t('lg.browserParams')" prop="verifyBrowser">
              <el-input v-model.trim="urlSugConfigfrom.verifyBrowser" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.userBhIndct')" prop="verifyAgent">
              <el-input v-model.trim="urlSugConfigfrom.verifyAgent" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>

            <el-form-item :label="$t('lg.kaiqidtzwgg')">
              <el-switch v-model="urlSugConfigfrom.verifyToken"></el-switch><span style="margin-left:20px">({{$t('lg.zhu36')}})</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="selectSnode()">{{$t('lg.tuisongdjd')}}</el-button>
              <el-button @click="urlRfCfDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <!-- 选择推送的节点 -->
    <el-dialog width="45%" :title="$t('lg.pushconfig')" :visible.sync="selectSnodeShow" :close-on-click-modal="false" :before-close="selectSnodeClose">
      <el-form ref="shadowNodesform" :model="shadowNodesform" label-width="125px" :rules="shadowNodesformRules">
        <el-form-item :label="$t('lg.shadownode')" prop="snodeId">
          <el-select v-model="shadowNodesform.snodeId" :placeholder="$t('lg.select')" style="width:100%" @change="checkDomainPort(shadowNodesform.snodeId)">
            <template v-for="n in snodeData">
              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <!-- 当前节点下有当前域名才显示 -->
        <el-row :gutter="10" v-show="shadowNodesform.snodeId && !noDomainShow">
          <el-col :span="18" >
            <el-form-item :label="$t('lg.bsdomain')">
              <el-input v-model.trim="shadowNodesform.domainName" disabled></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="6">
            <el-form-item label-width="0px">
              <el-select v-model="shadowNodesform.domainPort" :placeholder="$t('lg.select')" style="width:100%">
                <el-option
                  v-for="item in domainData"
                  :key="item.domainPort"
                  :label="item.domainPort"
                  :value="item.domainPort">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> 
        </el-row> 

        <el-form-item :label="$t('lg.protectedpos')" v-show="shadowNodesform.snodeId && !noDomainShow">
          <el-input v-model.trim="shadowNodesform.locationName" disabled></el-input>
        </el-form-item>

        <p class="noDomainTips" v-show="shadowNodesform.snodeId && noDomainShow">{{$t('lg.zhu37')}}：{{shadowNodesform.domainName}}，{{$t('lg.zhu38')}}</p>

        <el-form-item>
          <el-button type="primary" @click="ensurePushConfig('shadowNodesform')" :disabled="shadowNodesform.snodeId!='' && noDomainShow">{{$t('lg.push')}}</el-button>
          <el-button @click="selectSnodeClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>

      <loading v-show="pushConfigLoading"></loading>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import client from "@/components/es/connection";
import loading from '@/components/loading/loading';
export default {
  components:{
    loading
  },
  props:{
    isShow:{
      type:Boolean
    },
    urlReferConfigTitle:{
      type:String
    }
  },
  data(){
    return{
      urlTagData:[],

      // 参考配置
      urlReferConfigfrom:{
        reqeustTime:null,
        verifyBrowser:null,
        verifyAgent:null,
        verifyTokenRate:null,//占比
      },
      
      //建议配置
      urlSugConfigfrom:{
        reqeustTime:null,
        verifyBrowser:null,
        verifyAgent:null,
        verifyToken:false,
      },
      urlSugConfigfromRules:{
        reqeustTime:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        verifyBrowser:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        verifyAgent:[
          {pattern:/^[\-?0-9]+$/,message: this.$t('lg.bixuweinum'), trigger: 'change'}//必须为正整数
        ]
      },

      requestTimeUnit:'ms',
      rqTimeUnitOpt:[{
        label:this.$t('lg.ms'),
        value:'ms'
      },{
        label:this.$t('lg.second'),
        value:'s'
      }],

      // 推送到节点
      selectSnodeShow:false,
      shadowNodesform:{
        snodeId:'',
        domainName:'',
        domainPort:'',//选中的端口
        locationName:''
      },
      shadowNodesformRules:{
        snodeId:[
          { required: true, message: this.$t('lg.required'), trigger: 'change' }
        ]
      },
      snodeData:[],
      noDomainShow:false,//如果当前节点下没有当前域名，则提示需先去配置里创建域名
      domainData:[],//当前节点下的domain
      
      pushConfigLoading:false,

    }
  },
  methods:{
    getUrlReferConfigData(referConfigParam){//多个请求获取不同数据
     //  console.log(referConfigParam)

      this.shadowNodesform.domainName=referConfigParam.domainName;//把当前domainName保存下来，用来查找对应端口
      this.shadowNodesform.locationName=referConfigParam.locationName;//把当前locationName保存下来，用来查询locationName是否存在于当前节点下的domain上
      // 多个请求
      const esQqueryObj={//公用
        "bool": {
          "filter":[{
              "range": {
                "@timestamp": {
                  "gte": referConfigParam.strTimestamp,
                  "lte": referConfigParam.lteTimestamp
                }
              }
            },
            {
          "range": {
            "shadow.access.cl_score": {
              "gte": "0"
            }
          }
        },{
          "range": {
            "shadow.access.cl_browser_score": {
              "gte": "0"
            }
          }
        }],
          "must_not": [
            {
              "query_string": {
                "query": "shadow.access.org_url:\\/40*\\.html"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.org_url:\\/"
              }
            },
            {
				"query_string": {
					"query": "shadow.access.cl_score:100000"
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
              "query_string": {
                "query": "shadow.access.decrypted:0"
              }
            },
            {
              "query_string": {
                "query": "shadow.access.api_indicator:"+referConfigParam.apiIndicator
              }
            },
            {
              "query_string": {
                "query": "shadow.access.domain:"+referConfigParam.domainName
              }
            },
            {
          "query_string": {
            "query": "shadow.access.non_atag_indicator:1"
          }
        }
            // {
            //   "term": {
            //     "shadow.access.url_indicator": referConfigParam.locationName
            //   }
            // }
          ]
        }
      }

      let p1 = new Promise((resolve,reject)=>{//reqeust time
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size": 0, 
            "query":esQqueryObj,
            "aggs": {
              "GroupByDomain": {
                "terms": {
                  "field": "shadow.access.http_host",
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
                  }
                }
              }
            }
          }
        }).then((res)=>{
          const resData = res.aggregations && res.aggregations.GroupByDomain && res.aggregations.GroupByDomain.buckets[0]?res.aggregations.GroupByDomain.buckets[0].avg_time.value : null;
          this.urlReferConfigfrom.reqeustTime=resData;
          this.urlSugConfigfrom.reqeustTime=(resData!=null && resData>0)?Math.ceil(resData):null;
          resolve(resData);
        })
      }) 
      
      let p2 = new Promise((resolve,reject)=>{//浏览器环境指标
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size":0,
            "query":esQqueryObj,
            "aggs":{
              "GroupByBrowserScore":{
                "avg":{
                  "field":"shadow.access.cl_browser_score"
                }
              }
            }
          }
        }).then((res)=>{
          const resData = res.aggregations && res.aggregations.GroupByBrowserScore && res.aggregations.GroupByBrowserScore.value;
          this.urlReferConfigfrom.verifyBrowser=resData;
          this.urlSugConfigfrom.verifyBrowser=resData!=null?Math.floor(resData):null;
          resolve({resData});
        })
      }) 

      let p3 = new Promise((resolve,reject)=>{//用户行为指标
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size":0,
            "query":esQqueryObj,
            "aggs":{
              "GroupByScore":{
                "avg":{
                  "field":"shadow.access.cl_score"
                }
              }
            }
          }
        }).then((res)=>{
          const resData = res.aggregations && res.aggregations.GroupByScore && res.aggregations.GroupByScore.value;
          this.urlReferConfigfrom.verifyAgent=resData;
          this.urlSugConfigfrom.verifyAgent=resData!=null?Math.floor(resData):null;
          resolve(resData);
        })
      }) 

      let p4 = new Promise((resolve,reject)=>{//动态指纹
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size":0,
            "query":esQqueryObj,
            "aggs":{
              "GroupByTokenIndicator":{
                "terms":{
                  "field":"shadow.access.token_indicator",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          const hitsTotal = res.hits.total.value;
          const resData = res.aggregations && res.aggregations.GroupByTokenIndicator&& res.aggregations.GroupByTokenIndicator.buckets;

          let vTokenRate=0;
          resData.forEach((ele)=>{
            if(ele.key){
              vTokenRate=ele.doc_count/hitsTotal;
            }
          })

          if(resData.length>0){//参考配置那里显示占比
            this.urlReferConfigfrom.verifyTokenRate=(vTokenRate*100).toFixed(2);
          }else{
            this.urlReferConfigfrom.verifyTokenRate=null;
          }
          
          const openFlag=vTokenRate>0.1?true:false;
          this.urlSugConfigfrom.verifyToken=openFlag;
          resolve({openFlag});
        })
      }) 

      let p5 = new Promise((resolve,reject)=>{//页面标签
        client.search({
          index: "shadow-filebeat-*",
          body:{
            "size": 0, 
            "query": {
              "bool": {
                "must": [
                  {
                    "term": {
                      "shadow.access.domain": referConfigParam.domainName
                    }
                  },
                  // {
                  //   "term": {
                  //     "shadow.access.url_indicator": referConfigParam.locationName
                  //   }
                  // }
                ]
              }
            },
            "aggs": {
              "GroupByTag": {
                "terms": {
                  "field": "shadow.access.tag_name",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
          const resData=res.aggregations?res.aggregations.GroupByTag.buckets:[];
          let urlTagArr=[];
          
          resData.forEach(ele=>{
            if(ele.key && ele.key!=='-'){
              urlTagArr.push({
                key:Base64.decode(ele.key),
                docCount:ele.doc_count
              })
            }
          })

          if(urlTagArr.length==0){
            urlTagArr=[{
              docCount: 0,
              key: "暂无匹配标签"
            }]
          }

          // console.log(urlTagArr)
          this.urlTagData=urlTagArr;
          resolve(urlTagArr);
        })
      }) 

      return Promise.all([p1,p2,p3,p4,p5])
    },
    urlRfCfDialogClose(){
      this.$emit("urlReferConfigDialogClose",false);
    },

    //推送到节点 
    selectSnode(){//选择节点 
      var _this=this;
      var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          const resData=res.data.data;
          // const resData = [
          //   {
          //     "snodeId":"192.168.2.220:61002",
          //     "hostName":"shadow-v2.0.1",
          //     "isShadowGroup":false
          //   },
          //   {
          //     "snodeId": "aaa",
          //     "hostName": "aaa",
          //     "isShadowGroup": true,
          //     "masterNode": "192.168.2.1:61004",
          //     "backupNodes": [
          //       "192.168.2.2:61005" 
          //     ],
          //     "virtualIPs": [
          //       "1.1.1.1" 
          //     ]
          //   }
          // ]

          _this.snodeData=resData;
          _this.selectSnodeShow=true;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    //查询当前节点下的域名，找出当前域名对应的端口。再用端口来查询location是否存在
    checkDomainPort(snode){
      var url=SERVER_API_URL+"pe/shadow/domain?snodeId="+snode;
      const thisDomain = this.shadowNodesform.domainName;
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){
          // console.log(res);
          const resData = res.data.data.domains;
          const domainArr = resData.filter((item)=>{
            return item.domainName.includes(thisDomain)
          })

          if(domainArr.length>0){//当前节点下有当前域名
            this.noDomainShow=false;
            this.shadowNodesform.domainPort=domainArr[0].domainPort;//设置一个默认选中值
            this.domainData=domainArr;
          }else{
            this.noDomainShow=true;
          }
         
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });

    },

    // 查询拓扑图里该节点该域名下是否包含该location，如果包含则直接推送，否则需先在拓扑图里生成该location（还需调用一次生成location的接口）
    checkLocation(){
      return new Promise((resolve,reject)=>{
        const snode = this.shadowNodesform.snodeId;
        const thisDomain = this.shadowNodesform.domainName;
        const prot = this.shadowNodesform.domainPort;
        const url = SERVER_API_URL+"pe/shadow/domain/location?snodeId="+snode+"&domainName="+thisDomain+"&domainPort="+prot;// 查询当前所有业务节点
        axios.get(url).then((res)=>{
          if(res.data.responseCode == 0){
            // console.log(res);
            const resData = res.data.data;

            let lcFlag=false;
            const thisLocation = this.shadowNodesform.locationName;
            resData.forEach(ele=>{
              if(ele.locationName==thisLocation) lcFlag=true;
            })

            resolve(lcFlag);
          
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err) => {
          console.log(err)
        });
      })
    },
    
    //如果location不存在于当前节点当前域名当前端口下的拓扑图里，则要先推送当前location
    pushLocation(){
      return new Promise ((resolve,reject)=>{
        const url = SERVER_API_URL+"pe/shadow/domain/location";

        const snodeId=this.shadowNodesform.snodeId;
        const domainName=this.shadowNodesform.domainName;
        const port=this.shadowNodesform.domainPort;
        const locationName=this.shadowNodesform.locationName;

        axios.post(url,{
          snodeId:snodeId,
          domainName:domainName,
          domainPort:port,
          locationType:'accurateMatch',
          locationName:locationName,
          waf:'off',
          // wafRuleset:[],
          // webSocket:'off',
          // root:'',
        }).then((res)=>{
          if(res.data.responseCode == 0){
            resolve(true);
          }
        }).catch((err) => {
          console.log(err)
        });
      })
    },

    // 生成location配置 为location加入建议指令
    pushDirective(){
      this.pushConfigLoading=true;
      const url = SERVER_API_URL+"pe/shadow/domain/location/directive";

      const snodeId=this.shadowNodesform.snodeId;
      const domainName=this.shadowNodesform.domainName;
      const port=this.shadowNodesform.domainPort;
      const locationName=this.shadowNodesform.locationName;

      //指令参数
      let directives=[];
      if(this.urlSugConfigfrom.reqeustTime && this.urlSugConfigfrom.reqeustTime!=''){
        const str = Base64.encode(this.urlSugConfigfrom.reqeustTime+this.requestTimeUnit);
        directives.push({
          'shadow_request_time':str
        })
      }
      if(this.urlSugConfigfrom.verifyBrowser && this.urlSugConfigfrom.verifyBrowser!=''){
        const str = Base64.encode(this.urlSugConfigfrom.verifyBrowser);
        directives.push({
          'shadow_verify_browser':str
        })
      }
      if(this.urlSugConfigfrom.verifyAgent && this.urlSugConfigfrom.verifyAgent!=''){
        const str = Base64.encode(this.urlSugConfigfrom.verifyAgent);
        directives.push({
          'shadow_verify_agent':str
        })
      }
      if(this.urlSugConfigfrom.verifyToken){
        directives.push({
          'shadow_verify_token':"MQ=="
        })
      }

      axios.post(url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:port,
        locationType:'accurateMatch',
        locationName:locationName,
        directives:directives
      }).then((res)=>{
        if(res.data.responseCode == 0){
          this.$message({
            message: this.$t('lg.success'),
            type: 'success'
          });
          this.pushConfigLoading=false;
          this.selectSnodeClose();
        }
      }).catch((err) => {
        console.log(err)
      });

    },

    //确认推送
    ensurePushConfig(formname){
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.checkLocation().then((resolvedata)=>{
            if(resolvedata){//发一次请求
              this.pushDirective();

            }else{//发两次请求
              this.pushLocation().then((resolvedata)=>{
                this.pushDirective();
              })
            }
          })
        }
      });
    },

    //关闭推送弹框
    selectSnodeClose(){
      this.$refs['shadowNodesform'].resetFields();
      this.selectSnodeShow=false;
      this.noDomainShow=false;
    }
  }
}
</script>

<style scoped>
.urlReferConfig-wrapper{
  overflow: hidden;
}
.urlTagBox{
  position: relative;
  border: 1px solid #dcdfe6;
  padding: 30px 20px 10px 20px;
  border-radius: 5px;
}
.urlReferConfigBox{
  display: flex;
  margin: 20px 0 30px;
}
.urlRfConfigTitle{
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 15px;
}
.referenceBox{
  width: 32%;
  background:#eee;
  margin-right: 10px;
  border: 1px solid #dcdfe6;
  padding: 15px;
  border-radius: 5px;
}
.referParamList{
  margin-top: 30px;
}
.referParamList li{
  margin-bottom: 40px;
  line-height: 20px;
}

.suggestBox{
  flex: 1;
  border: 1px solid #dcdfe6;
  padding: 15px;
  border-radius: 15px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 15px;
}
.noDomainTips{
  color: #606266;
  margin:0 0 30px 30px;
  line-height: 16px;
  color: #F56C6C;
  line-height: 22px;
}
</style>
