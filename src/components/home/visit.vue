<template>
  <div class="visit-wrapper">
    <div class="regionSelectBox">
      <i :title="$t('lg.targetlocation')" class="el-icon-location-outline regionIcon"></i>
      <el-select v-model="targetLocation" :placeholder="$t('lg.select')" style="width:42%;" @change="changeTargetLc(targetLocation)">
        <el-option
          v-for="item in targetValue"
          :key="item.val"
          :label="item.val"
          :value="item.val">
        </el-option>
      </el-select>
    </div>

    <div class="mapMenuBox">
      <ul class="mapMenuList">
        <li><a href="javascript:" :class="isOrgFlag?'iptextBtn activeIp':'iptextBtn'" @click="changeOrgIP(true)">{{$t('lg.sourceip')}}</a></li>
        <li><a href="javascript:" :class="!isOrgFlag?'iptextBtn activeIp':'iptextBtn'" @click="changeOrgIP(false)">{{$t('lg.agentip')}}</a></li>
      </ul>
    </div>
    
    <div v-if='targetLcFlage' id="mapContainer"></div> <!-- v-if='targetLcFlage' 解决缩小放大浏览器窗口或地图后，目标地点定位不准bug-->

    <div class="msgBox">
      <p class="msgTitle">{{$t('lg.halfhouraccessdata')}}&nbsp;&nbsp;&nbsp;</p>
      <p class="nodataTxt" v-if="msgTxtData.length==0">{{$t('lg.nodata')}}</p>
      <ul class="msgList">
        <li v-for="item in msgTxtData"><i class="fa fa-commenting"></i> <span>{{item.mIp}}</span> {{$t('lg.aimat')}} <span>{{item.mDomian}}</span> {{$t('lg.initaccess')}}<span>{{item.mCountNum}}次，</span>{{$t('lg.fpis')}} <span>{{item.mFinger}}</span></li>
      </ul>
    </div>

    <div class="toChart">
      <router-link class="chatLink" tag="a" to="/visitChart"><i class="fa fa-area-chart"></i>{{$t('lg.viewdatachart')}}</router-link>
    </div>
    <timing-task-pop :isNeedRefreshAddTask="true" :isShow="isShowTimingTask" :myTaskType="'esSearch'" :myTaskTypeTxt="taskTypeTxt" :alertmark="alertMark" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>   
  </div>
</template>
<script>
import axios from "axios";
import { SERVER_API_URL } from "@/conf/constvar";
import client from "@/components/es/connection";
// import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import echarts from 'echarts';
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
      objCity2:[],
      msgTxtData:[],

      isOrgFlag:true,//默认查询源IP
      searchIp:'shadow.access.remote_ip',
      searchGeoip:'params._source.shadow.access.geoip',
      searchGeoip2:'shadow.access.geoip',
      mapScript:'geoip',

      // 报警任务
      isShowTimingTask:false,
      taskTypeTxt:this.$t('lg.maccessyuanipbased'),
      alertMark:'maliciousAccess',

      // 编辑报警任务
      isShowTimingTaskEdit:false,
      editTaskId: null, //编辑当前任务的id
      timingTaskform:{},//存储被修改项
      isRunning:false,//任务的运行状态（图表报警都能在当前页面进行编辑）当运行状态为true时，是不能进行编辑操作的
      // isChartEdit:true,//如果把这个值传给子组件，表示此时的子组件是在 图表报警的父组件里调用的 这时，报警任务可以进行开启和暂停
    }
  },
  beforeRouteLeave(to,from,next){
    this.mapChart=null;
    next()
  },
  created(){
    this.$store.state.contentLoading = true;
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
      this.getVisitMsg();
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
    this.getTargetLc();
    this.getVisitMsg();
  },
  methods:{
    changeOrgIP(type){
      var _this=this;
      this.$store.state.contentLoading = true;
      this.isRunning=false;
      if(type){
        this.isOrgFlag=true;
        this.searchIp='shadow.access.remote_ip';
        this.searchGeoip='params._source.shadow.access.geoip';
        this.searchGeoip2='shadow.access.geoip';
        this.mapScript='geoip';
        this.alertMark='maliciousAccess';
        this.taskTypeTxt=_this.$t('lg.maccessyuanipbased');
        // this.getTimingTask('maliciousAccess');
      }else{
        this.isOrgFlag=false;
        this.searchIp='shadow.access.org_remote_ip';
        this.searchGeoip='params._source.shadow.access.org_geoip';
        this.searchGeoip2='shadow.access.org_geoip';
        this.mapScript='org_geoip';
        this.alertMark='maliciousAccessOrg';
        this.taskTypeTxt=_this.$t('lg.maccessorgipbased');
        // this.getTimingTask('maliciousAccessOrg');
      }
      _this.drawMap();
      this.changeTargetLc(this.targetLocation);
      this.getVisitMsg();
    },
    changeTargetLc(val){
      const url = SERVER_API_URL+"pe/shadow/kv";
      this.targetLcFlage=false;
      axios.post(url,{myTargetlocation:val}).then((res)=>{//存入目标地点
        if(Object.keys(res.data.data.Failure)){//判断不起作用，这里不严谨，如果有myTargetlocation则调更改接口
          axios.patch(url,{myTargetlocation:val}).then(res=>{
            this.targetLcFlage=true;
            setTimeout(()=>{
              this.$nextTick(()=>{
                this.drawMap();
              })
            },0)
          })
        }
      });
    },
    getTargetLc(){//获取目标地点
      const url = SERVER_API_URL+"pe/shadow/kv/myTargetlocation";
      axios.get(url).then((res)=>{
        if(res.data.data){
          const tLcName=res.data.data.value;
          this.targetLocation=tLcName;
        }else{
          this.targetLocation=this.$t('lg.guangzhou')
        }
        this.drawMap();
      })
    },
    runCityData(data,str) {  //str '广州'  data 后台返回数据
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
        },{name: str}]);
        this.objCity[buckets[0].total_count.value.loc.city_name||`[${buckets[0].total_count.value.loc.location.lon},${buckets[0].total_count.value.loc.location.lat}]`]=sonArry
      })
      return resArray;
    },
    runCityIp(data,obj) { //目前没有完整的世界所有国家的城市数据（只有写死的大部分中国的，并且后台只返回发起地的数据），这里可以把后台返回的‘发起地’添加到现有数据里，就算有国外城市发起攻击也能在地图上展示出具体城市来
      data.forEach(item=>{
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
      // console.log(_this.searchIp,_this.searchGeoip,_this.mapScript);
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
      function getMapData(){
        var sttime=_this.$store.state.mydatedata.starttime,
              edtime=_this.$store.state.mydatedata.endtime;
          var fromTime2=toISO8601(sttime),
              endTime2=toISO8601(edtime);
          var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
              endTime=endTime2 || toISO8601(new Date());
        let passqueryStringObj={
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
                bool:{
                  should:[],
                  "minimum_should_match": 1
                }
              }
            ]
          }
          };
       
///////////  
        return new Promise((resolve,reject)=>{
           _this.getUserDm().then((reslovedata)=>{
          if(sessionStorage.getItem("myRoles")=="ADMIN"){
            passqueryStringObj.bool.must.shift();
          }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            passqueryStringObj.bool.must[0].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }
    //////////////////////         
          client.search({
            index: "shadow-filebeat-warn*",
            body:{
              "size": 0,
              "query": passqueryStringObj,
              "aggs": {
                "GroupByGeo": {
                  "terms": {
                    "script": {
                      "lang": "painless",
                    //"source": "params._source.shadow.access.geoip.city_name+';'+params._source.shadow.access.geoip.location.lon+', '+params._source.shadow.access.geoip.location.lat"
                      "source": _this.searchGeoip+".city_name+';'+"+_this.searchGeoip+".location.lon+', '+"+_this.searchGeoip+".location.lat"
                    }, 
                    "field": _this.searchGeoip2+".city_name",
                    "size": 10
                  },
                  "aggs": {
                    "GroupByIp": {
                      "terms": {
                        "field": _this.searchIp,
                        "size": 10
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
            var buckets=res.aggregations?res.aggregations.GroupByGeo.buckets:[];
            var bucketFirstKeys=[];
            var bucketsArr=[];
            buckets.forEach(element=>{//过滤掉没返回city_name的数据
              var ikeynamearr=element.key.split(";");
              var ikeyname=ikeynamearr[0];
              var ikey=ikeynamearr[1].split(",").map(keyitem=>{return parseInt(keyitem,10)});
              var ikeycount=element.doc_count;
             // var ikey=element.key.match(/-*\d+(\.\d+)*/g).map(keyitem=>{return parseInt(keyitem,10)});
              bucketFirstKeys.push({
               // "name":JSON.stringify(ikey),
                "name":ikeyname,
                "value":ikey,
                "count":ikeycount
              });
              var eleArr = element.GroupByIp.buckets;
              eleArr.forEach(item=>{
                // if(item.total_count.value.loc.city_name){
                  item.lonlat=ikey;
                  item.cityname=ikeyname;
                //  item.cityname=JSON.stringify(ikey);
                  bucketsArr.push(item);
                // }
              })
            });
            resolve({bucketFirstKeys,bucketsArr});
          });
          });
        });
      }
      function handleMapData(){//处理数据
        getMapData().then((resolvedata)=>{
          var convertData = function() {
            var res = [];
            var fromCoord,toCoord;
            var data=resolvedata.bucketsArr
            data.forEach(item=>{
              fromCoord=item.lonlat;
              if(localStorage.lang=="en"){
                toCoord=geoCoordMap2[_this.targetLocation];
              }else{
                toCoord=geoCoordMap[_this.targetLocation];
              }
              
              res.push([{
                  coord: fromCoord,
                  value: item.doc_count
                },
                {
                  coord: toCoord
                }
                ]);
            })
            return res;
          };
          var series1Data=convertData();
          var getDataFromName=function(name){
            var data=resolvedata.bucketsArr;
            var dataarr=[];
            data.map((item)=>{
              if(item.cityname==name){
                dataarr.push(item)
              }
            })
            return dataarr;
          }
          
          var option = {
            backgroundColor: '#000',//#404A59
            title : {
              text: _this.$t('lg.accessdisplay'),
              x:'center',
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
                 if(geoCoordMap.hasOwnProperty(name) || geoCoordMap2.hasOwnProperty(name)){
                   return;
                 }
                 if(name && name.length!=0){
                 
                 var list=[];
                  list=getDataFromName(name);
                  var totalNum = 0;
                  res = name + "</span><br/>"
                  for(var i=0;i<list.length;i++){
                    totalNum+=list[i].doc_count;
                    res += list[i].key + '，'+_this.$t('lg.access') + list[i].doc_count + _this.$t('lg.counts') + "</span><br/>";
                  }
                   res += _this.$t('lg.totalaccess')+':'+totalNum+_this.$t('lg.counts');
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
            series: [{
		"type": "lines",
		"zlevel": 2,
		"effect": {
			"show": true,
			"period": 4,
			"trailLength": 0.02,
			"symbol": "arrow",
			"symbolSize": 5
		},
		"lineStyle": {
			"normal": {
				"width": 1,
				"opacity": 0,
				"curveness": 0.3
			}
		},
		"data": series1Data
	},
	{
		"type": "effectScatter",
		"coordinateSystem": "geo",
		"zlevel": 2,
		"rippleEffect": {
			"period": 4,
			"brushType": "stroke",
			"scale": 3
		},
		"label": {
			"normal": {
				"show": true,
				"position": "right",
				"offset": [5,0],
				"formatter": "{b}"
			},
			"emphasis": {
				"show": true
			}
		},
		"symbol": "circle",
		"itemStyle": {
			"normal": {
				"show": false
			}
		},
		"data": resolvedata.bucketFirstKeys
	},
	{
		"type": "scatter",
		"coordinateSystem": "geo",
		"zlevel": 2,
		"rippleEffect": {
			"period": 4,
			"brushType": "stroke",
			"scale": 4
		},
		"label": {
			"normal": {
				"show": true,
				"position": "right",
				"color": "#00ffff",
				"formatter": "{b}",
				"textStyle": {
					"color": "#0bc7f3"
				}
			},
			"emphasis": {
				"show": true
			}
		},
		"symbol": "pin",
		"symbolSize": 30,
		"itemStyle": {
			"normal": {
				"show": true,
				"color": "#9966cc"
			}
		},
		"data": [{
			"name": _this.targetLocation,
			"value": geoCoordMap[_this.targetLocation],
			"visualMap": false
		}]
	}]
          };
          _this.mapChart.setOption(option,true);
          _this.$store.state.contentLoading=false;
        });
      }
      handleMapData();
    },
    getVisitMsg(){//实时信息公布
      var _this=this;
      var fromTime=toISO8601(new Date(Date.now()-1800000)),
          endTime=toISO8601(new Date(Date.now()));
      // console.log(fromTime,endTime)
      client.search({
        index:"shadow-filebeat-warn*",
        body:{
          "size": 0,
          "query": {
            "bool": {
              "filter":[
                {
                  "range": {
                    "@timestamp": {
                      "gte": fromTime,
                      "lte": endTime
                    }
                  }
                }
              ],
              "must_not": [
                  {
                    "match": {
                      "shadow.access.token":"00000000000000000000000000000000"
                    }
                  },{
                    "match": {
                      "shadow.access.token":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                    }
                  }
                ]
              // "must": [
              //   ...prmoSearchStr['protectChart']['a1']
              // ]
            }
          },
          "aggs": {
            "groupByIp": {
              "terms": {
                "field": _this.searchIp
              },
              "aggs": {
                "groupByDomain": {
                  "terms": {
                    "field": "shadow.access.http_host"
                  },
                  "aggs": {
                    "groupByToken": {
                      "terms": {
                        "field": "shadow.access.token",
                        "min_doc_count": 30
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }).then((res)=>{
        var msgArr=res.aggregations?res.aggregations.groupByIp.buckets:[];
        var resbucketsArr=[];
        msgArr.forEach(item=>{  
          var itemArr = item.groupByDomain.buckets;
          itemArr.forEach(val=>{
            var valArr = val.groupByToken.buckets;
            valArr.forEach(v=>{
              resbucketsArr.push({mIp:item.key,mDomian:val.key,mFinger:v.key,mCountNum:v.doc_count});
            })
          })
        })
        _this.msgTxtData=resbucketsArr;
      })
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style scoped>
.visit-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  overflow: hidden;
}

/**/
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
}
.mapMenuList li{
  text-align: right;
  margin-bottom: 15px;
}
.iptextBtn{
  color: #b7b7b7;
  font-weight: 700;
  cursor: pointer;
}
.iptextBtn:hover{
  color: #00bbdd;
}
.activeIp{
  color: #00bbdd;
  font-size: 18px;
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

#mapContainer{
  position: absolute;
  top: 0;
  left: 0;
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
  cursor: pointer;
}
.msgList{
  display: block;
  height: 140px;
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
