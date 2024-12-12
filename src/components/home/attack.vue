<template>
  <div class="attack-wrapper">
    <div class="regionSelectBox">
      <i :title="$t('lg.targetlocation')" class="el-icon-location-outline regionIcon"></i>
      <el-select v-model="targetLocation" :placeholder="$t('lg.select')" style="width:42%;background:#000" @change="changeTargetLc(targetLocation)">
        <el-option
          v-for="item in targetValue"
          :key="item.val"
          :label="item.val"
          :value="item.val">
        </el-option>
      </el-select>
    </div>

    <!-- <div class="mapMenuBox">
      <ul class="mapMenuList">
        <li class="alarmBtn">
          <p @click="isShowTimingTask=true" v-show="!editTaskId"><img class="alarmImg" src="../../../static/icon/stopWtBell.png"> <span>报警任务</span></p>
          <p @click="isShowTimingTaskEdit=true" v-show="editTaskId && !isRunning"><img class="alarmImg" src="../../../static/icon/stopWtBell.png"> <span>报警任务</span></p>
          <p @click="isShowTimingTaskEdit=true" v-show="isRunning"><img class="alarmImg" src="../../../static/icon/startBell.png"> <span>报警任务</span></p>
        </li>
      </ul>
    </div> -->

    <div v-if='targetLcFlage' id="mapContainer"></div> <!-- v-if='targetLcFlage' 解决那个缩小放大地图后改变目标地点，目标地点定位不准bug-->

    <div class="msgBox">
      <p class="msgTitle">{{$t('lg.halfhourattackdata')}}</p>
      <p class="nodataTxt" v-if="msgTxtData.length==0">{{$t('lg.nodata')}}</p>
      <ul class="msgList">
        <li v-for="item in msgTxtData"><i class="fa fa-commenting"></i> <span>{{item.mIp}}</span> {{$t('lg.aimat')}} <span>{{item.mDomian}}</span> {{$t('lg.Initaattack')}}<span>{{item.mCountNum}}{{$t('lg.counts')}}，</span>{{$t('lg.itsruleidis')}} <span>{{item.mainruleid}}</span></li>
      </ul>
    </div>

    <div class="toChart">
      <router-link class="chatLink" tag="a" to="/attackChart"><i class="fa fa-area-chart"></i>{{$t('lg.viewdatachart')}}</router-link>
    </div>

    <timing-task-pop :isNeedRefreshAddTask="true" :isShow="isShowTimingTask" :myTaskType="'esSearch'" :myTaskTypeTxt="$t('lg.mattackyuanipbased')" :alertmark="'maliciousAttack'" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>
    <!-- <timing-task-pop :isRunning="isRunning" :isChartEdit='isChartEdit' :editData="timingTaskform" :editTaskId="editTaskId" :isShow="isShowTimingTaskEdit" :isShowTimingTaskEdit="isShowTimingTaskEdit" :myTaskType="timingTaskform.taskType" :myTaskTypeTxt="'基于‘恶意攻击源IP’报警'" :alertmark="'maliciousAttack'" @getTimingTask="getTimingTask" @setTimingTaskClose="isShowTimingTaskEdit=false"></timing-task-pop> -->
    
  </div>
</template>

<script>
import axios from "axios";
import { SERVER_API_URL } from "@/conf/constvar";
import client from "@/components/es/connection";
import toSddate from '@/assets/js/tosddate';
// import toISO8601 from '@/assets/js/iso8601';
import echarts from 'echarts'
import World from '@/assets/json/world.json';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
export default {
  components:{
    timingTaskPop
  },
  data(){
    return{
      targetLcFlage:true,
      // targetValue:[
      //   {
      //     val:'北京'
      //   },{
      //     val:'上海'
      //   },{
      //     val:'广州'
      //   },{
      //     val:'深圳'
      //   },{
      //     val:'杭州'
      //   },{
      //     val:'武汉'
      //   },{
      //     val:'成都'
      //   },{
      //     val:'重庆'
      //   },{
      //     val:'东莞'
      //   },{
      //     val:'佛山'
      //   },{
      //     val:'郑州'
      //   },{
      //     val:'长春'
      //   },{
      //     val:'大连'
      //   },{
      //     val:'南京'
      //   },{
      //     val:'贵阳'
      //   },{
      //     val:'嘉兴'
      //   },{
      //     val:'长沙'
      //   }
      // ],
      targetValue:[
        {
          val:this.$t('lg.beijing')
        },{
          val:this.$t('lg.shanghai')
        },{
          val:this.$t('lg.guangzhou')
        },{
          val:this.$t('lg.shenzhen')
        },{
          val:this.$t('lg.hangzhou')
        },{
          val:this.$t('lg.wuhan')
        },{
          val:this.$t('lg.chengdu')
        },{
          val:this.$t('lg.chongqing')
        },{
          val:this.$t('lg.dongguan')
        },{
          val:this.$t('lg.foshan')
        },{
          val:this.$t('lg.zhengzhou')
        },{
          val:this.$t('lg.changchun')
        },{
          val:this.$t('lg.dalian')
        },{
          val:this.$t('lg.nanjing')
        },{
          val:this.$t('lg.guiyang')
        },{
          val:this.$t('lg.jiaxing')
        },{
          val:this.$t('lg.changsha')
        }
      ],
      targetLocation:'',//从存储接口获取
      mapChart:null,
      objCity:{},//保存地图触碰数据[ip+value]

      msgTxtData:[],

      // 报警任务
      isShowTimingTask:false,

      // 编辑报警任务
      isShowTimingTaskEdit:false,
      editTaskId: null, //编辑当前任务的id
      timingTaskform:{},//存储被修改项
      isRunning:false,//任务的运行状态（图表报警都能在当前页面进行编辑）当运行状态为true时，是不能进行编辑操作的
      isChartEdit:true,//如果把这个值传给子组件，表示此时的子组件是在 图表报警的父组件里调用的 这时，报警任务可以进行开启和暂停
    }
  },
  beforeRouteLeave(to,from,next){
    this.mapChart=null;
    next()
  },
  created(){
    this.$store.state.contentLoading=true;
    window.addEventListener("resize", () => {
      // if(this.mapChart){
      //   this.mapChart.resize();
      // }
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.drawMap();
          this.mapChart.resize();
        })
      },0)
    });
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
      if(!this.$store.state.refreshFalg){
        this.$store.state.contentLoading = true;
      }
      this.drawMap();
      this.getAttackMsg();
    },
    '$store.state.isMenuShow':function(){
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.drawMap();
          this.mapChart.resize();
        })
      },0)
    }
  },
  mounted(){
    // if(this.$route.query.timeInterval){//从邮件报警页面点击查看跳转过来，要根据邮件报警的查询间隔时间来改变右上角时间
    //   var paramUrl = this.$route.query;
    //   var dataNow = new Date().getTime();

    //   var timeIntervalNum = paramUrl.timeInterval.match(/(\d*)(\w*)/)[1];
    //   var timeIntervalUnit = paramUrl.timeInterval.match(/(\d*)(\w*)/)[2];

    //   var timeStrVal = 0;
    //   switch(timeIntervalUnit)
    //   { 
    //     case "m":
    //     timeStrVal = dataNow - timeIntervalNum*60*1000;
    //     break;
    //     case "h":
    //     timeStrVal = dataNow - timeIntervalNum*60*60*1000;
    //     break;
    //     default:
    //     timeStrVal = dataNow - timeIntervalNum*24*60*60*1000;
    //   };
    //   this.$store.state.nowTimeVal=[new Date(timeStrVal),new Date(dataNow)];
    //   this.$store.state.refreshAble=true;//禁用自动刷新
    //   this.$store.commit(types.MYDATEPICKER);
    // }
    
    this.getTargetLc();
    this.getAttackMsg();
    // this.getTimingTask();
  },
  methods:{
    changeTargetLc(val){
      const url = SERVER_API_URL+"pe/shadow/kv";
      this.targetLcFlage=false;
      axios.post(url,{myTargetlocation:val}).then((res)=>{
        if(Object.keys(res.data.data.Failure)){
          axios.patch(url,{myTargetlocation:val}).then(res=>{
            this.targetLcFlage=true;
            setTimeout(()=>{
              this.$nextTick(()=>{
                this.drawMap();
              })
            },0)
          })
        }
      })
    },
    getTargetLc(){//获取目标地点
      const url = SERVER_API_URL+"pe/shadow/kv/myTargetlocation";
      axios.get(url).then((res)=>{
        if(res.data.data){
          const tLcName=res.data.data.value;
          this.targetLocation=tLcName;
        }else{
          this.targetLocation='广州'
        }
        this.drawMap();
      })
    },
    runCityData(data,str) {  //str '上海'  data 后台返回数据
      let resArray = [];
      data.forEach((item, index) => {
        let buckets=item.GroupByIp.buckets;
        let sonArry=[]
        buckets.forEach((bucket,i)=>{
          sonArry.push({
            ip:bucket.key,
            value:bucket.doc_count
          })
        })
        resArray.push([{ 
          name:buckets[0].total_count.value.loc.city_name||`[${buckets[0].total_count.value.loc.location.lon},${buckets[0].total_count.value.loc.location.lat}]`,
          value:item.doc_count  //总共的值
        },{name: str}])
        this.objCity[buckets[0].total_count.value.loc.city_name||`[${buckets[0].total_count.value.loc.location.lon},${buckets[0].total_count.value.loc.location.lat}]`]=sonArry
      })
      return resArray;
    },
    runCityIp(data,obj) { //目前没有完整的世界所有国家的城市数据（只有写死的大部分中国的，并且后台只返回发起地的数据），这里可以把后台返回的‘发起地’添加到现有数据里，就算有国外城市发起攻击也能在地图上展示出具体城市来
      data.forEach(item=>{
        // obj[item.GroupByIp.buckets[0].total_count.value.loc.city_name]=[item.GroupByIp.buckets[0].total_count.value.loc.location.lon,item.GroupByIp.buckets[0].total_count.value.loc.location.lat]
        obj[item.GroupByIp.buckets[0].total_count.value.loc.city_name||`[${item.GroupByIp.buckets[0].total_count.value.loc.location.lon},${item.GroupByIp.buckets[0].total_count.value.loc.location.lat}]`]=[item.GroupByIp.buckets[0].total_count.value.loc.location.lon,item.GroupByIp.buckets[0].total_count.value.loc.location.lat]
      })
    },
    getUserDm(){
      return new Promise((resolve,reject)=>{
        let name=sessionStorage.getItem("myname");
        var url = SERVER_API_URL + 'pe/shadow/user/accessdomain/'+name;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resdata=res.data.data;
            let resdatadm;
            if(resdata && resdata.domains){
              resdatadm=resdata.domains || [];
            }
            resolve(resdatadm || [])
          }else{
            reject("error")
          }
        })
      });
    },
    drawMap(){//地图
      var _this=this;
      echarts.registerMap('world', World);
      var dom = document.getElementById("mapContainer");
      _this.mapChart = echarts.init(dom);
      var geoCoordMap = {
            "上海": [121.4648, 31.2891],
            '东莞': [113.8953,22.901],
            '佛山': [112.8955,23.1097],
            '北京': [116.4551,40.2539],
            '南京': [118.8062,31.9208],
            '嘉兴': [120.9155,30.6354],
            '大连': [122.2229,39.4409],
            '广州': [113.5107,23.2196],
            '成都': [103.9526,30.7617],
            '杭州': [119.5313,29.8773],
            '武汉': [114.3896,30.6628],
            '深圳': [114.5435,22.5439],
            '贵阳': [106.6992,26.7682],
            '郑州': [113.4668,34.6234],
            '重庆': [107.7539,30.1904],
            '长春': [125.8154,44.2584],
            '长沙': [113.0823,28.2568],
          };
        var geoCoordMap2 = {
        'shanghai': [121.4648, 31.2891],
        'dongguan': [113.8953,22.901],
        'foshan': [112.8955,23.1097],
        'beijing': [116.4551,40.2539],
        'nanjing': [118.8062,31.9208],
        'jiaxing': [120.9155,30.6354],
        'dalian': [122.2229,39.4409],
        'guangzhou': [113.5107,23.2196],
        'chengdu': [103.9526,30.7617],
        'hangzhou': [119.5313,29.8773],
       'wuhan': [114.3896,30.6628],
        'shenzhen': [114.5435,22.5439],
        'guiyang': [106.6992,26.7682],
        'zhengzhou': [113.4668,34.6234],
        'chongqing': [107.7539,30.1904],
        'changchun': [125.8154,44.2584],
        'changsha': [113.0823,28.2568],
      };
      function getMapData(){//查询es获取数据
        return new Promise((resolve,reject)=>{
          var sttime=_this.$store.state.mydatedata.starttime,
              edtime=_this.$store.state.mydatedata.endtime;
          var fromTime2=toSddate(sttime),
              endTime2=toSddate(edtime);
          var fromTime=fromTime2 || toSddate(new Date(Date.now()-_this.$store.state.dateTimeLong)),
              endTime=endTime2 || toSddate(new Date());
    let mustOptions=[];
    mustOptions=[
      {
        bool:{
          should:[],
          "minimum_should_match": 1
        }
      },
          {
            "term": {
              "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
            }
          }
    ];

  _this.getUserDm().then((reslovedata)=>{
          // if(sessionStorage.getItem("myRoles")=="ADMIN"){
          //   passqueryStringObj.bool.must.shift();
          // }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
          client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "sort": [
              {
                "@timestamp": {
                  "order": "desc"
                }
              }
              ],
              "query": {
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "from": fromTime,
                        "to": endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": mustOptions
              }
              },
              "aggs": {
                "GroupByGeo": {
                  "terms": {
                    "script": {
                      "inline": "params._source.shadow.waf.geoip",
                      "lang": "painless"
                      }
                  },
                  "aggs": {
                    "GroupByIp": {
                      "terms": {
                        "field": "shadow.waf.clientip"
                      },
                      "aggs": {
                        "total_count": {
                          "scripted_metric": {
                            "init_script": "params._agg.count = []",
                            "map_script": "Map cnt = new HashMap();cnt.put('loc',params['_source']['shadow']['waf']['geoip']);params._agg.count.add(cnt)",
                            "combine_script": "return params._agg.count.get(0)",
                            "reduce_script": "return params._aggs.get(0)"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            // console.log(res);
            var buckets=res.aggregations?res.aggregations.GroupByGeo.buckets:[];
            var bucketsArr=[];
            buckets.forEach(element=>{//过滤掉没返回city_name的数据
              var eleArr = element.GroupByIp.buckets;
              eleArr.forEach(item=>{
                // if(item.total_count.value.loc.city_name){
                  bucketsArr.push(element);
                // }
              })
            })
            resolve(bucketsArr);
          })
        })
      })
      }
      function handleMapData(){//处理数据
        getMapData().then((resolvedata)=>{
          // var BJData = [
          //     [{
          //         name: "尼日利亚",
          //         value: 9100
          //     }, {
          //         name: "上海"
          //     }],
          //     [{
          //         name: "美国洛杉矶",
          //         value: 2370
          //     }, {
          //         name: "上海"
          //     }],
          // ];
          let BJData= _this.runCityData(resolvedata,_this.targetLocation);
          if(localStorage.lang=="en"){
             _this.runCityIp(resolvedata,geoCoordMap2)
          }else{
             _this.runCityIp(resolvedata,geoCoordMap)
          }
         //把后台的数据加入到geoCoordMap

          var convertData = function(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
              var dataItem = data[i];
              if(localStorage.lang=="en"){
                var fromCoord = geoCoordMap2[dataItem[0].name];
              var toCoord = geoCoordMap2[dataItem[1].name];
              }else{
                var fromCoord = geoCoordMap[dataItem[0].name];
              var toCoord = geoCoordMap[dataItem[1].name];
              }
              
              if (fromCoord && toCoord) {
                res.push([{
                  coord: fromCoord,
                  value: dataItem[0].value
                },
                {
                  coord: toCoord
                }
                ]);
              }
            }
            return res;
          };
          var series = [];
          [
            [_this.targetLocation, BJData]
          ].forEach(function(item, i) {
            series.push({
              type: "lines",
              zlevel: 2,
              effect: {
                show: true,
                period: 4, //箭头指向速度，值越小速度越快
                trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                symbol: "arrow", //箭头图标
                symbolSize: 5 //图标大小
              },
              lineStyle: {
                normal: {
                  width: 1, //尾迹线条宽度
                  opacity: 0, //尾迹线条透明度
                  curveness: 0.3 //尾迹线条曲直度
                }
              },
              data: convertData(item[1])
            }, 
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              zlevel: 2,
              rippleEffect: {//涟漪特效
                period: 4, //动画时间，值越小速度越快
                brushType: "stroke", //波纹绘制方式 stroke, fill
                scale: 3 //波纹圆环最大限制，值越大波纹越大
              },
              label: {
                normal: {
                  show: true,
                  position: "right", //显示位置
                  offset: [5, 0], //偏移设置
                  formatter: "{b}" //圆环显示文字
                },
                emphasis: {
                  show: true
                }
              },
              symbol: "circle",
              symbolSize: function(val) {
                if(val[2]<=10000){
                  return 4 + val[2] / 2000; //圆环大小
                }else{
                  return 10;
                }
              },
              itemStyle: {
                normal: {
                  show: false,
                }
              },
              data: item[1].map(function(dataItem) {
                if(localStorage.lang=="en"){
                  return {
                  name: dataItem[0].name,
                  value: geoCoordMap2[dataItem[0].name].concat([dataItem[0].value])
                };
                }else{
                  return {
                  name: dataItem[0].name,
                  value: geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                };
                }
                
              })
            },
            {//被攻击点
              type: "scatter",
              coordinateSystem: "geo",
              zlevel: 2,
              rippleEffect: {
                period: 4,
                brushType: "stroke",
                scale: 4
              },
              label: {
                normal: {
                  show: true,
                  position: "right",
                  color: "#00ffff",
                  formatter: "{b}",
                  textStyle: {
                    color: "#0bc7f3"
                  }
                },
                emphasis: {
                  show: true
                }
              },
              symbol: "pin",
              symbolSize: 30,
              itemStyle: {
                normal: {
                  show: true,
                  color: "#9966cc"//#F56C6C
                }
              },
              data: [{
                name: item[0],
                value: geoCoordMap[item[0]].concat([100]),
                visualMap:false
              }]
            });
          });
          var option = {
            backgroundColor: '#000',//#404A59
            title : {
              text: _this.$t('lg.mattackdisplay'),
              //subtext: 'From Gapminder',
              left: 'center',
              top: '20px',
              textStyle: {
                color: '#fff'
              }
            },
            tooltip: {
              trigger: "item",
              backgroundColor: "#1540a1",
              borderColor: "#FFFFCC",
              showDelay: 0,
              hideDelay: 0,
              enterable: true,
              transitionDuration: 0,
              extraCssText: "z-index:100",
              formatter: function(params, ticket, callback) {//根据业务自己拓展要显示的内容
                var res = "";
                var name = params.name;
                var value = params.value[params.seriesIndex + 1];
                if(value){
                  var list =_this.objCity[name];
                  var totalNum = 0;
                  res = name + "</span><br/>"
                  for(var i=0;i<list.length;i++){
                    totalNum+=list[i].value;
                    res += list[i].ip + '，'+_this.$t('lg.attack') + list[i].value + _this.$t('lg.counts') + "</span><br/>";
                  }
                  res += _this.$t('lg.totalattack')+':'+totalNum+_this.$t('lg.counts');
                  return res;
                }
              }
            },
            visualMap: {//图例值控制
              min: 0,
              max: 5000,
              show: false,
              calculable: true,
              textStyle: {
                color: "#fff"
              },
              // inRange:{
              //   color: ["#0bc7f3"]
              // },
            },
            geo: {
              map: "world",
              label: {
                emphasis: {
                  show: false
                }
              },
              roam: true, //是否允许缩放
              layoutCenter: ["50%", "48%"], //地图位置
              layoutSize: "140%",
              itemStyle: {
                normal: {
                  color: "#04284e", //地图背景色//#323c48
                  borderColor: "#5bc1c9" //省市边界线
                },
                emphasis: {
                  color: "rgba(37, 43, 61, .5)" //悬浮背景
                }
              }
            },
            series: series
          };
          _this.$store.state.contentLoading=false
          _this.mapChart.setOption(option, true);
        });
      }
      handleMapData();
    },
    getAttackMsg(){//实时信息公布
      var _this=this;
      var fromTime=toSddate(new Date(Date.now()-1800000)),
          endTime=toSddate(new Date(Date.now()));
      let mustOptions=[
          {
          bool:{
            should:[],
            "minimum_should_match": 1
          }
        },
          {
            "term": {
              "log.file.path": "/usr/local/shadow/logs/shadow_waf.log"
            }
          }
      ];
      _this.getUserDm().then((reslovedata)=>{
          // if(sessionStorage.getItem("myRoles")=="ADMIN"){
          //   passqueryStringObj.bool.must.shift();
          // }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            mustOptions[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }

      client.search({
        index:"shadow-filebeat-*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "filter":[{
                  "range": {
                    "@timestamp": {
                      "gte": fromTime,
                      "lte": endTime
                    }
                  }
                }],
              "must_not": {
                "exists": {
                  "field": "error"
                }
              },
              "must": mustOptions
            }
          },
          "aggs": {
            "groupByIp": {
              "terms": {
                "field": "shadow.waf.clientip"
              },
              "aggs": {
                "groupByDomain": {
                  "terms": {
                    "field": "shadow.waf.host"
                  },
                  "aggs": {
                    "groupBySID": {
                      "terms": {
                        "field": "shadow.waf.mainruleid",
                        "min_doc_count": 1
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
        var msgArr=res.aggregations?res.aggregations.groupByIp.buckets:[];

        var resbucketsArr=[];
        msgArr.forEach(item=>{  
          var itemArr = item.groupByDomain.buckets;
          itemArr.forEach(val=>{
            var valArr = val.groupBySID.buckets;
            valArr.forEach(v=>{
              resbucketsArr.push({mIp:item.key,mDomian:val.key,mainruleid:v.key,mCountNum:v.doc_count});
            })
          })
        })
        _this.msgTxtData=resbucketsArr;
      })
    })
    },
    
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style scoped>
.attack-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;
}
/*输入目标地点*/
.regionSelectBox{
  position: absolute;
  top: 55px;
  left: 20px;
  z-index: 11;
}
.regionIcon{
  position: absolute;
  top: 12px;
  left: 22%;
  font-size: 16px;
  color: #9966cc;
  cursor: pointer;
  font-weight: 700;
  z-index: 12;
}

/*地图右上菜单*/
.mapMenuBox{
  position: absolute;
  top: 55px;
  right: 20px;
  z-index: 11;
}
.mapMenuList{
  /* background: pink; */
}
.mapMenuList li{
  text-align: right;
  margin-bottom: 15px;
}
.alarmBtn{
  color: #b7b7b7;
  font-weight: 700;
  cursor: pointer;
}
.alarmImg{
  width: 20px;
  height: 20px;
  vertical-align: text-bottom;
}

/**/
#mapContainer{
  width: 100%;
  height: 100%;
}
.toChart{
  position: absolute;
  right: 20px;
  bottom: 30px;
  padding: 5px;
  z-index:3000;
}
.chatLink{
  color: #eee;
  cursor: pointer;
  font-size: 16px;
}
.msgBox{
  /* background: #ccc; */
  position: absolute;
  bottom: 0;
  left: 0;
  padding:0 15px 20px 15px;
}
.msgTitle{
  font-size: 16px;
  color: #00bbdd;
  margin-bottom: 10px;
}
.nodataTxt{
  color: #b7b7b7;
  text-align: center;
}
.taskBtn{
  color: #ffffff;
}
.msgList{
  display: block;
  height: 140px;
  /* max-height: 30%; */
  overflow-y: auto;
}
.msgList::-webkit-scrollbar {
 width: 0px;
 height: 0px;
}
.msgList .-o-scrollbar{
  -moz-appearance: none !important;   
  background: rgba(0,255,0,0) !important;  
}
.msgList { -ms-overflow-style: none; }/*IE 10+*/
.msgList li{
  font-size: 12px;
  color: #00bbdd;
  line-height: 25px;
}

</style>
