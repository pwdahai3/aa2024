export const defaultChart = {
  "access": [
    {
      "key":'mvChart1576407777812',
      "value": {
        "option": {
          color:['#27727b','#e87c25'],
          title: {
            text: '恶意访问业务防护',
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          grid: {
            top:'18%',
            left: '5%',
            right: '3%',
            bottom:'18%',
            // containLabel: true
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          legend: {
            itemGap: 5,
            left:'3%',
            right:'3%',
            bottom:5,
            height:'12%',
            data:['总请求数','恶意访问']
          },
          brush: {
            // toolbox: ['lineX'],
            xAxisIndex: "all",
            transformable:false,
            throttleType:'debounce',
            throttleDelay: 1000,
            brushStyle:{
              borderWidth: 0,
            }
          },
          toolbox: {
            top:20,
            right:'20',
            feature:{
              brush:{
                type:['lineX']
              }
            },
          },
          xAxis: {
            data : []
          },
          yAxis: {
            name:'次数',
          },
          series : []
        },
        "searchQuery": "{\"index\":\"shadow-filebeat-*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"term\":{\"log.file.path\":\"/usr/local/shadow/logs/access.log\"}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-08T16:00:00Z\",\"to\":\"2019-09-17T16:00:00Z\",\"include_lower\":true,\"include_upper\":true}}},{\"exists\":{\"field\":\"shadow.access.method\"}}]}},\"aggs\":{\"GroupByMe\":{\"date_histogram\":{\"field\":\"@timestamp\",\"interval\":\"5m\",\"extended_bounds\":{\"min\":\"2019-09-08T16:00:00Z\",\"max\":\"2019-09-17T16:00:00Z\"}}}}}}",//请求总数
        "searchQuery2":"{\"index\":\"shadow-filebeat-*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"bool\":{\"should\":[{\"query_string\":{\"query\":\"shadow.access.error_code:>0\"}},{\"query_string\":{\"query\":\"shadow.access.response_code:(444 OR 404)\"}}]}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-08T16:00:00Z\",\"to\":\"2019-09-17T16:00:00Z\",\"include_lower\":true,\"include_upper\":true}}}]}},\"aggs\":{\"GroupByMe\":{\"date_histogram\":{\"field\":\"@timestamp\",\"interval\":\"5m\",\"extended_bounds\":{\"min\":\"2019-09-08T16:00:00Z\",\"max\":\"2019-09-17T16:00:00Z\"}}}}}}",//恶意访问总数
        "type": "special",
        "size": {
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 8,
          "i": "mvChart1576407777812",
          "moved": false
        },
        "vzActiveName": "graph",
        "data": {
          "origTotalNum": 0,
          "generalform":{
            titleText:"恶意访问业务防护"//导出csv要用到
          }
        }
      }
    },
    {
      key:'mvChart1576407777813',
      "value": {
        "option": {
          color:['#eb8146'],
          title: {
            text: '被恶意访问的url次数/Top10',
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            confine:true,
            axisPointer: {
              type: 'shadow'
            },
            extraCssText:'white-space:normal;word-break: break-all',
          },
          // legend: {
          //   data: [],
          //   top:'30px',
          //   inactiveColor:'#606060',
          // },
          grid: {
            top:'18%',
            left: '8%',
            right:'5%',
            bottom:'4%',
            containLabel: false
          },
          xAxis: {
            type: 'value',
            position:'top',
            name:'次数',
            boundaryGap: [0,0.01],
            // splitLine:{
            //   show:false
            // },
            minInterval: 1//保持x轴刻度只为整数
          },
          yAxis: { 
            type: 'category',
            inverse: true,//是否是反向坐标轴 （这里反向后数据降序排列）
            data: [],//topArrays
          },
          series: {
            type: 'bar',
            label: {
              normal: {
                color:'#fff',
                distance: 10,
                position: "insideLeft",
                rotate: 0,
                show: true,
                textBorderColor: "#eb8146"
              }
            },
            data:[],
            barMaxWidth:35,
          }
        },
        "searchQuery": "{\"index\":\"shadow-filebeat-*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"query_string\":{\"query\":\"shadow.access.error_code:>0\"}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-08T16:00:00Z\",\"to\":\"2019-09-17T16:00:00Z\",\"include_lower\":true,\"include_upper\":true}}},{\"query_string\":{\"query\":\"shadow.access.domain:*\"}},{\"query_string\":{\"query\":\"shadow.access.org_url:*\"}}]}},\"aggs\":{\"GroupByMe\":{\"terms\":{\"field\":\"shadow.access.shadow_url\",\"size\":10}}}}}",
        "type": "special",
        "size": {
          "x": 0,
          "y": 10,
          "w": 6,
          "h": 8,
          "i": "mvChart1576407777813",
          "moved": false
        },
        "vzActiveName": "barGauge",
        "data": {
          "origTotalNum": 0,
          "queryform":{
            "aggsId":"shadow.access.shadow_url"
          },
          "generalform":{
            titleText:"被恶意访问的url次数/Top10"
          }
       }
      }
    },
    {
      "key": "mvChart1578648953275",
      "value": {
				"option": {
					"title": {
						"text": "恶意访问类型Top10",
						"subtext": "",
						"x": "center",
						"textStyle": {
							"fontSize": "14",
							"fontWeight": "normal"
						}
					},
					"color": ["#4ea397", "#fcce10", "#e87c25", "#b5c334", "#60c0dd"],
					"tooltip": {
						"show": true,
						"trigger": "item",
						"formatter": "{a} <br/>{b}: {c} ({d}%)"
					},
					"legend": {
						"show": true,
						"type": "scroll",
						"orient": "horizontal",
            "data": [],
						"bottom": "10"
					},
					"series": {
						"name": "访问来源",
						"type": "pie",
						"radius": ["40%", "50%"],
						"center": ["50%", "45%"],
						"avoidLabelOverlap": false,
						"roseType": true,
						"clockwise": true,
						"label": {
							"show": true,
							"formatter": "{b}",
							"emphasis": {
								"textStyle": {
									"fontSize": "14",
									"fontWeight": "bold"
								}
							}
						},
						"labelLine": {
							"show": true,
							"smooth": 0,
							"length": 25,
							"length2": 15,
							"emphasis": {
								"lineStyle": {
									"width": "2"
								}
							}
						},
						"data": []
					}
				},
				"searchQuery": "{\"index\":\"shadow-filebeat*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"term\":{\"log.file.path\":\"/usr/local/shadow/logs/access.log\"}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-08T16:00:00Z\",\"to\":\"2019-09-17T16:00:00Z\",\"include_lower\":true,\"include_upper\":true}}},{\"bool\":{\"should\":[{\"query_string\":{\"query\":\"shadow.access.error_code:>0\"}},{\"query_string\":{\"query\":\"shadow.access.response_code:(444 OR 404)\"}}]}},{\"exists\":{\"field\":\"shadow.access.method\"}}]}},\"aggs\":{\"GroupByMe\":{\"terms\":{\"field\":\"shadow.access.error_code\",\"min_doc_count\":1,\"size\":10},\"aggs\":{\"groupbyresp\":{\"terms\":{\"field\":\"shadow.access.response_code\",\"size\":10}}}}}}}",
				"type": "normal",
				"size": {
					"x": 0,
					"y": 0,
					"w": 6,
					"h": 8,
					"i": "mvChart1578648953275",
					"moved": false
				},
				"vzActiveName": "pie",
				"data": {
          "origTotalNum": 0,
          "queryform":{
            "aggsId": "shadow.access.error_code",
          },
          "generalform":{
            titleText:"恶意访问类型Top10"
          }
				}
			}
    },
  ],
  "waf": [
    {
      "key":'maChart1576407777812',
      "value": {
        "option": {
          color:['#27727b','#d95850'],
          title: {
            text: '恶意攻击业务防护',
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          grid: {
            top:'18%',
            left: '5%',
            right: '3%',
            bottom:'18%',
            // containLabel: true
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            }
          },
          legend: {
            itemGap: 5,
            left:'3%',
            right:'3%',
            bottom:5,
            height:'12%',
            data:['总请求数','恶意攻击']
          },
          brush: {
            // toolbox: ['lineX'],
            xAxisIndex: "all",
            transformable:false,
            throttleType:'debounce',
            throttleDelay: 1000,
            brushStyle:{
              borderWidth: 0,
            }
          },
          toolbox: {
            top:20,
            right:'20',
            feature:{
              brush:{
                type:['lineX']
              }
            },
          },
          xAxis: {
            data : []
          },
          yAxis: {
            name:'次数',
          },
          series : []
        },
        "searchQuery": "{\"index\":\"shadow-filebeat-*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"term\":{\"log.file.path\":\"/usr/local/shadow/logs/access.log\"}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-08T16:00:00Z\",\"to\":\"2019-09-17T16:00:00Z\",\"include_lower\":true,\"include_upper\":true}}},{\"exists\":{\"field\":\"shadow.access.method\"}}]}},\"aggs\":{\"GroupByMe\":{\"date_histogram\":{\"field\":\"@timestamp\",\"interval\":\"5m\",\"extended_bounds\":{\"min\":\"2019-09-08T16:00:00Z\",\"max\":\"2019-09-17T16:00:00Z\"}}}}}}",//请求总数
        "searchQuery2":"{\"index\":\"shadow-filebeat-*\",\"body\":{\"size\":0,\"query\":{\"bool\":{\"must\":[{\"term\":{\"log.file.path\":\"/usr/local/shadow/logs/shadow_waf.log\"}},{\"range\":{\"@timestamp\":{\"from\":\"2019-09-09T00:00:00Z\",\"to\":\"2019-09-18T00:00:00Z\",\"include_lower\":true,\"include_upper\":true}}}],\"must_not\":{\"exists\":{\"field\":\"error\"}}}},\"aggs\":{\"GroupByMe\":{\"date_histogram\":{\"field\":\"@timestamp\",\"interval\":\"5m\",\"extended_bounds\":{\"min\":\"2019-09-09T00:00:00Z\",\"max\":\"2019-09-18T00:00:00Z\"}}}}}}",//恶意攻击总数
        "type": "special",
        "size": {
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 8,
          "i": "maChart1576407777812",
          "moved": false
        },
        "vzActiveName": "graph",
        "data": {
          "origTotalNum": 0,
          "generalform":{
            titleText:"恶意攻击业务防护"
          }
        }
      }
    }
  ]
}


