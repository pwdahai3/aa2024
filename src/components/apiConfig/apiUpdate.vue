<template><!--可删组件-->
  <div class="apiUpdate-wrapper">
    <h2 class="breadcrumb">{{$t('lg.apifx')}}</h2>
    <el-form ref="searchApiform" class="form-bg" style="padding-bottom:0" :model="searchApiform" label-width="0">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="paramDomain">
            <el-select v-model="searchApiform.paramDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains($event)" style="width:100%" :loading="$store.state.getEsDomainArrLoading">
              <template v-for="item in $store.state.esDomainArr">
                <el-option :key="item.key" :label="item.key" :value="item.key"></el-option>
              </template>
            </el-select>
            <!-- <el-input v-model.trim="searchApiform.paramDomain" :placeholder="$t('lg.inputdomain')"></el-input> -->
          </el-form-item>
        </el-col>

        <el-col :span="2.5">
          <el-button type="primary" @click="checkApiData()" icon="el-icon-search">{{$t('lg.query')}}</el-button>
        </el-col>
        
        <el-col :span="2">
          <el-button @click="getApiData">{{$t('lg.reset')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- <div class="apitree-tips" v-if="apiTreeNodeData.length>0">
      <p>注：1、输入域名和时间段，查询出所有新发现的接口。点开接口前面的小三角形，里面是HTTP Referer。表示发现的新接口是从这个页面链接过来的。</p>
      <p>2、蓝色感叹号：表示这个接口的HTTP Referer有一部分是新增的，有一部分是旧的。</p>
      <p>3、蓝色感叹号和红色NEW：表示所有的HTTP Referer都是新增的。</p>
    </div> -->
    <div class="apiTreeBox">
      <el-tree
        :data="apiTreeNodeData"
        :props="apiTreeProps"
        ref="tree"
        :render-content="apiRenderContent"><!-- show-checkbox -->
      </el-tree>
    </div>
  
    <div class="footerBtn">
      <el-button type="success" icon="el-icon-time" @click="isShowTimingTask=true">{{$t('lg.arrangealerting')}}</el-button>
      <el-button type="success" @click="updateDenyUrl">{{$t('lg.updatedenyurlshadowpz')}}</el-button>
    </div>

    <!-- 安排报警任务 -->
    <timing-task-pop :isShow="isShowTimingTask" :myTaskType="'apiScan'" :myTaskTypeTxt="$t('lg.apibased')" @setTimingTaskClose="isShowTimingTask=false"></timing-task-pop>
    
  </div>
</template>

<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
import client from "@/components/es/connection";
import toISO8601 from '@/assets/js/iso8601';
import loading from '@/components/loading/loading';
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
export default {
  components:{
    timingTaskPop,
    loading
  },
  data(){
    return{
      searchApiform:{
        paramDomain:'',
      },
      apiTreeNodeData:[],
      apiTreeProps:{
        children: 'children',
        label: 'label'
      },

      //安排报警任务
      isShowTimingTask:false,
    }
  },
  mounted(){
    this.getApiData();
  },
  methods:{
    getDomains(callback){//获取域名数据
      if(callback){
        this.searchApiform.paramDomain="";
        this.$store.commit(types.GETESDOMAINS);
      }
    },
    getApiData(){
      var _this=this;
      _this.$store.state.contentLoading = true;
      var url = SERVER_API_URL+"/pe/shadow/api/deny";
      axios.get(url).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          const resData = res.data.data?res.data.data:[];
          let resultArr =[];
          resData.forEach(ele=>{
            let itemObj={
              label:ele.domain,
              children:[]
            };
            const childrenObj=ele.urls;
            childrenObj.forEach(val=>{
              itemObj.children.push({
                label:val.url,
                isIgnore:val.ignore=='Y'?true:false
              })
            })
            resultArr.push(itemObj)
          })
          _this.apiTreeNodeData=resultArr;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.$store.state.contentLoading = false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    checkApiData(){//根据用户输入域名查找对应的结果
      // this.$refs['searchApiform'].validate((valid)=>{
      //   if(valid){
          var domainVal=this.searchApiform.paramDomain;
          if(domainVal){
            const allApiData=this.apiTreeNodeData;
            this.apiTreeNodeData=allApiData.filter(el=>{
              // return el.label.includes(domainVal)
              return el.label==domainVal;
            })
          }
      //   }
      // })
    },
    remove(node, data, urlFlag,event) {//urlFlag 区分删除‘域名（包含的一组url）’还是‘单个url’
      if(event) event.stopPropagation();//避免点击删除时触发列表展开收缩事件
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);

      var url = SERVER_API_URL+"/pe/shadow/api/deny";
      let shadowApiScanList=[];
      if(urlFlag){
        shadowApiScanList=[
          {
            urls:[{
              url: data.label,
              ignore: data.isIgnore?'Y':'N'
            }],
            domain: node.parent.data.label
          }
        ];
      }else{
        const childrenArr=data.children.map(ele=>{
          return {
            url:ele.label,
            ignore:ele.isIgnore?'Y':'N'
          }
        });
        shadowApiScanList=[
          {
            urls:childrenArr,
            domain:data.label
          }
        ]
      }
     
      axios.delete(url,{
        data:{
          shadowApiScanList:shadowApiScanList
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.getApiData();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    ignore(node, data){
      var url = SERVER_API_URL+"/pe/shadow/api/deny";
      let shadowApiScanList=[];
      shadowApiScanList=[
          {
            urls:[{
              url: data.label,
              ignore: data.isIgnore?'N':'Y'//要取相反值
            }],
            domain: node.parent.data.label
          }
        ];
      // console.log(shadowApiScanList)
      axios.patch(url,{
        shadowApiScanList:shadowApiScanList
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          data.isIgnore=!data.isIgnore
          // this.getApiData();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    apiRenderContent(h, { node, data, store }){//重新渲染 自定义节点内容
      if(data.children){
        return (
          <span class="api-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="small" type="text" icon="el-icon-delete" on-click={ (event) => this.remove(node, data, false,event) }>删除</el-button>
            </span>
          </span>
        );
      }else{
        return (
          <span class="api-tree-node">
            <span>{node.label}{node.isIgnore}{data.isIgnore}</span>
            <span>
              <el-checkbox value={data.isIgnore} title={data.isIgnore?$t('lg.hulcurl'):$t('lg.unignore')} on-change={ () => this.ignore(node, data) }>$t('lg.hulcurl')</el-checkbox>
              <i class='splitline'>|</i>
              <el-button size="small" type="text" icon="el-icon-delete" on-click={ () => this.remove(node, data, true) }>$t('lg.delete')</el-button>
            </span>
          </span>
        );
      }
    },
    updateDenyUrl(){
      var url = SERVER_API_URL+"/pe/shadow/api/deny";
      this.$store.state.contentLoading=true;
      axios.post(url,{
        "deny_url": "update" 
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
  }
}
</script>

<style>
.apiUpdate-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding:20px;
  box-sizing: border-box;
}
.apiTreeBox{
  height: 78%;
  overflow-y: auto;
  padding-bottom: 30px;
  box-sizing: border-box;
}
.api-tree-node{
  white-space: normal;
  word-break: break-all;
  margin: 2px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.api-tree-node .el-checkbox__label{
  padding-left: 5px;
  font-size: 13px;
}
.api-tree-node .el-checkbox{
  margin-right: 0;
  font-size: 13px;
}
.splitline{
  margin:0 8px;
  color: #ccc;
}
.footerBtn{
  position: absolute;
  bottom: 10px;
  right: 40px;
  z-index: 1;
}
/* .apitree-tips{line-height: 1.8} */
</style>
