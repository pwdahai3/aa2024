<template>
  <div class="quickconfig-wrapper">
    <el-form ref="queryPanelform" class="queryPanelBox" style="padding-bottom:0" :model="queryPanelform" :rules="queryPanelformRules"  label-width="100px">
      <el-row :gutter="10">
        <el-col :span="16">
            <el-form-item  label="时间范围" prop="selectedDate">
              <el-date-picker
              v-model="queryPanelform.value4"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false">
            </el-date-picker>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="16">
            <el-form-item prop="checkDomain"  label="域名">
              <el-select  v-model="queryPanelform.checkDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains()" style="width:100%">
                <template v-for="item in getDms">
                  <el-option :key="item" :label="item" :value="item"></el-option>
                </template>
              </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="6">
            <el-form-item prop="level" label="层级">
              <el-input v-model.trim="queryPanelform.level"  placeholder="层级"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-button @click="generateConf">生成配置</el-button>
    </el-form>
    <div>
      <div v-if="treeData.length==0" style="margin-top:20px;text-align:center;">
        暂无数据
      </div>
      <div class="deomo" v-else>
         <el-tree
         class="tree-line"
            :data="treeData"
            node-key="id"
            :props="treeProps"
             :indent="0"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
      </div>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
import client from "@/components/es/connection";
let Base64 = require('js-base64').Base64;
import toISO8601 from "@/assets/js/iso8601";
import * as types from '@/store/types';
export default {
  components:{
    loading
  },
  data(){
    return{
      treeProps: {
        label: 'name', // 修改为你想要的数据标签属性名
        
      },
      data4:[{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }],
      
      treeData:[],
      getDms:[],
      getPors:[],
      queryPanelform:{
        checkDomain:'',
        port:'',
        level:0,
        value4: [new Date().getTime()-3600 * 1000 * 24*30,new Date()]
      },
      queryPanelformRules:{
        checkDomain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        level:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
           { pattern: /^(0|[1-9]\d*)$/, message: '请输入大于等于0的整数', trigger: 'blur' }
        ]
      },
    }
  },
  created(){
   
  },
  methods:{
    renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" on-click={ () => this.append(data) }>编辑</el-button>            
            </span>
          </span>);
      },
    generateConf(){
      this.$refs.queryPanelform.validate(valid => {
        if (valid) {
          let fromTimestamp=toISO8601(new Date(this.queryPanelform.value4[0]));
          let toTimestamp=toISO8601(new Date(this.queryPanelform.value4[1]));
          let domainnPort=this.queryPanelform.checkDomain;
         let splitDmPt=domainnPort.split(":");
          let domainName=splitDmPt[0];
          let domainPort=splitDmPt[1];
          let level=this.queryPanelform.level;
          const url=SERVER_API_URL+"mc/esquery/i-config/url/tree?"+"fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp+"&domainName="+domainName+"&domainPort="+domainPort+"&level="+level;
          axios.get(url).then((res)=>{
            if(res.data.responseCode==0){
              this.treeData=res.data.data;
            }
            console.log(res)
          })



        } else {
          return false;
        }
      });
    },
    getDomains(){
      this.$refs.loading.showLoading();
      client.search({
          index: "shadow-filebeat-*",
          body:  {

            "size": 0,
            "aggs": {
              "domains": {
                "terms": {
                  "field": "shadow.access.domain",
                  "size": 50
                },
                "aggs": {
                  "ports": {
                    "terms": {
                      "field": "shadow.access.server_port",
                      "size": 50
                    }
                  }
                }
              }
            }

          }
        }).then((res2)=>{
          this.$refs.loading.hideLoading();
          console.log(res2);
          let data=res2.aggregations.domains;
        //  this.getDms=tarResult2;

          const transformedArray = [];

          data.buckets.forEach(bucket => {
            const { key: host, ports } = bucket;

          //  if (ports.buckets.length === 0) {
          //    transformedArray.push(host);
          //  } else {
              ports.buckets.forEach(portBucket => {
                const { key: port } = portBucket;
                transformedArray.push(`${host}:${port}`);
              });
          //  }
          });
          this.getDms=transformedArray;
          

        });
       
    },
  }
}
</script>

<style scoped>
.quickconfig-wrapper{
     width:100%;
    height: 100%;
    position: relative;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;  
}
/deep/ .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
/deep/ .tree-line .el-tree-node {
  position: relative;
  padding-left: 16px; /* 缩进量 */
}

/deep/ .tree-line .el-tree-node__children {
  padding-left: 16px; /* 缩进量 */
}

/* 竖线 */
/deep/ .tree-line .el-tree-node::before {
  content: "";
  height: 100%;
  width: 1px;
  position: absolute;
  left: -3px;
  top: -26px;
  border-width: 1px;
  border-left: 1px dashed #52627C;
}

/* 当前层最后一个节点的竖线高度固定 */
/deep/ .tree-line .el-tree-node:last-child::before {
  height: 38px; /* 可以自己调节到合适数值 */
}

/* 横线 */
/deep/ .tree-line .el-tree-node::after {
  content: "";
  width: 24px;
  height: 20px;
  position: absolute;
  left: -3px;
  top: 12px;
  border-width: 1px;
  border-top: 1px dashed #52627C;
}

/* 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了 */
/deep/ .tree-line > .el-tree-node::after {
  border-top: none;
}

/deep/ .tree-line > .el-tree-node::before {
  border-left: none;
}

/* 展开关闭的icon */
/deep/ .tree-line .el-tree-node__expand-icon {
  font-size: 16px;
}

/* 叶子节点（无子节点） */
/deep/ .tree-line .el-tree-node__expand-icon.is-leaf {
  color: transparent;
}

</style>
