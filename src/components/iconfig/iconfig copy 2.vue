<template>
  <div class="quickconfig-wrapper">
    <el-form ref="queryPanelform" class="queryPanelBox" style="padding-bottom:0" :model="queryPanelform" :rules="queryPanelformRules"  label-width="100px">
      <!-- <el-row :gutter="10">
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
      </el-row> -->
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
      <el-button type="primary" @click="generateConf">生成配置</el-button>
    </el-form>
    <div>
      <div v-if="accurateData.length==0" style="margin-top:20px;text-align:center;">
        暂无数据
      </div>
      <div v-else>
         <table  class="table-container">
          <tr v-for="(item,index) in accurateData" :key="'acc-'+index">
            <td>{{item.url}}</td>
            <td>
              <ul>
                <li class="tagli" v-for="(tag, tagIndex) in item.tagName" :key="tagIndex" v-if="tag!='-'">
                   {{ tag | customFilter}}
                </li>
              </ul>
            </td>
            <td>
              <a href="javascript:;" class="editdel" @click="editShow(item,'accurtate','acc-'+index)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'accurtate',index)">删除</a>
            </td>
          </tr>
          <tr v-for="(item,index1) in pathData" :key="'pat-'+index1">
            <td colspan="2">{{item}}</td>
            <td>
              <a href="javascript:;" class="editdel" @click="editShow(item,'path','pat-'+index1)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'path',index1)">删除</a>
            </td>
          </tr>
          <tr v-for="(item,index2) in suffixData" :key="'suff-'+index2">
            <td colspan="2">{{item}}</td>
            <td>
              <a href="javascript:;" class="editdel" @click="editShow(item,'suffix','suff-'+index2)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'suffix',index2)">删除</a>
            </td>
          </tr>
         </table>
         <div style="text-align:center;margin:42px 0 20px 0;">
            <el-button type="primary" @click="saveAll">保存全部</el-button>
         </div>
      </div>
    </div>
    <loading ref="loading"></loading>
    <editshow
      :editShow="iseditShow"
      @toClose="iseditShow=false"
      :title="currentTitle"
      :data="editshowData"
      :type="currentEditType"
      :index="currentEditIndex"
      @save-edited-data="saveEditedData"
    ></editshow>

    <el-dialog
      title="输入配置集名称"
      :visible.sync="savelallDialogVisible"
      width="30%"
      :before-close="saveallWinClose">
      <el-form ref="savelallWinForm" :model="savelallWinForm" :rules="savelallWinRules" label-width="0" class="demo-ruleForm">
      <el-form-item label="" prop="name">
        <el-input v-model="savelallWinForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOutput">保存</el-button>
      </el-form-item>
      </el-form>
    </el-dialog>

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
import editshow from './eidtshow.vue'
export default {
  components:{
    loading,
    editshow
  },
  data(){
    return{
      isloading1:false,
      isloading2:false,
      outputObject:{
        name:'',
        accurate: [],
        path: [],
        suffix: []
      },
      savelallWinForm:{
        name:'',
      },
      currentTitle:{},
      savelallDialogVisible:false,
      iseditShow: false,
      editshowData: {},
      currentEditType: "",
      currentEditIndex: null,
      editedData: [], // 用来保存编辑的数据
      accurateData:[],
      pathData:[],
      suffixData:[],
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
      savelallWinRules:{
        name:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
      }
    }
  },
  created(){
   
  },
  methods:{
    deleteItem(item,type,index){
      if(type=="accurtate"){
        this.accurateData.splice(index,1)
      }else if(type=="path"){
        this.pathData.splice(index,1)
      }else if(type=="suffix"){
        this.suffixData.splice(index,1)
      }
    },
    saveOutput(){
      const _this=this;
      _this.$refs['savelallWinForm'].validate((valid) => {
        if (valid) {
          this.$refs.loading.showLoading();
          _this.outputObject.name=_this.savelallWinForm.name;
          const url=SERVER_API_URL+'pe/shadow/i-config/add';
          axios.post(url,_this.outputObject).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.$refs.loading.hideLoading();
              _this.$router.push('/iconfigset')
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
          })

        }})
    },
    saveallWinClose(){
      this.savelallDialogVisible=false;
    },
    editShow(item, type, index) {
      this.currentTitle=item;
      this.currentEditType = type;
      this.currentEditIndex = index;
      // 获取当前编辑的数据项，如果是新的编辑，则创建一个新对象
      this.editshowData = index !== null ? { ...this.editedData[index] } : {};
      this.iseditShow = true;
    },
    saveEditedData(editedItem, index) {
      const _this=this;
      if (index !== null) {
        // 如果有索引，表示是编辑已有的数据，更新对应索引的数据
        this.$set(this.editedData, index, editedItem);
      } else {
        // 如果索引为 null，表示是新的编辑数据，添加到数组中
        this.editedData.push(editedItem);
      }
    },
  saveAll(){
    const _this=this;
    _this.outputObject = {
      name:'',
      accurate: [],
      path: [],
      suffix: []
    };
    let newItem = {};
    for (const key in _this.editedData) {
      if (_this.editedData.hasOwnProperty(key)) {
        const value = _this.editedData[key];
        newItem = {
          directive: [
            {
              paramverify: value.param_verify_switch ? "on" : "off",
              type: "param_verify",
            },
            {
              botConf: value.bot_conf_switch ? "on" : "off",
              type: "bot_conf",
            },
            // {
            //   directives: [
            //     {
            //       shadow_request_time: Base64.encode(value.shadow_request_time),
            //     },
            //   ],
            //   type: "shadow_request_time",
            // },
            {
              directives: [
                {
                  shadow_verify_browser: Base64.encode(value.shadow_verify_browser),
                },
              ],
              type: "shadow_verify_browser",
            },
            {
              directives: [
                {
                  shadow_verify_agent: Base64.encode(value.shadow_verify_agent),
                },
              ],
              type: "shadow_verify_agent",
            },
            {
              directives: value.insertJsType === "3" ? [] : value.insertJsType === "2"?[{"shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybXZhbGlkYXRvci9jb25maWcuanMnICciPjwvc2NyaXB0Pic="},{"shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"}]:[{"shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="},{"shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy"}],
              type: "js_insert",
            },
          ],
          locationName: value.url,
        };
        if(value.tagName) {
          newItem.tagNames = value.tagName.map((tagName) => {
            if(tagName=="-"){
              tagName=Base64.encode(tagName)
            }
            return {tag_name: tagName }
          });
        }
        if(value.shadow_request_time_switch){
          newItem.directive.push(
            {
              directives: [
                {
                  shadow_request_time: Base64.encode(value.shadow_request_time),
                },
              ],
              type: "shadow_request_time",
            }
          )
        }

          if(key.startsWith("acc-")) {
            _this.outputObject.accurate.push(newItem);
          }else if (key.startsWith("suff-")) {
            _this.outputObject.suffix.push(newItem);
          }else if (key.startsWith("pat-")) {
            _this.outputObject.path.push(newItem);
          }
      }
    }
  _this.savelallDialogVisible=true;
},
    generateConf(){
      this.isloading1=false;
      this.isloading2=false;
      this.$refs.queryPanelform.validate(valid => {
        if (valid) {
         // let fromTimestamp=toISO8601(new Date(this.queryPanelform.value4[0]));
         // let toTimestamp=toISO8601(new Date(this.queryPanelform.value4[1]));

          const sttime=this.$store.state.mydatedata.starttime,
          edtime=this.$store.state.mydatedata.endtime;
          const fromTimestamp=toISO8601(sttime),
          toTimestamp=toISO8601(edtime);

          let domainnPort=this.queryPanelform.checkDomain;
         let splitDmPt=domainnPort.split(":");
          let domainName=splitDmPt[0];
          let domainPort=splitDmPt[1];
          let level=this.queryPanelform.level;
          const url0=SERVER_API_URL+"mc/esquery/i-config/url/accurate?"+"fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp+"&domainName="+domainName+"&domainPort="+domainPort;
          const url1=SERVER_API_URL+"mc/esquery/i-config/url/path-and-suffix?"+"fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp+"&domainName="+domainName+"&domainPort="+domainPort+"&level="+level;
          this.$refs.loading.showLoading();
          axios.get(url0).then((res)=>{
          //  console.log(res)
            if(res.data.responseCode==0){
             // this.treeData=res.data.data;
             this.isloading1=true;
             this.accurateData=res.data.data
             if(this.isloading1 && this.isloading2){
              this.$refs.loading.hideLoading();
             }
            }
          });

          axios.get(url1).then((res)=>{
           // console.log(res)
            if(res.data.responseCode==0){
              this.isloading2=true;
              let resData=res.data.data;
             this.pathData=resData.path;
             this.suffixData=resData.suffix;
             if(this.isloading1 && this.isloading2){
              this.$refs.loading.hideLoading();
             }
            }
          });
        } else {
          return false;
        }
      });
    },
    isValidKey(key) {
      var ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      var domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return ipPattern.test(key) || domainPattern.test(key);
    },
    getDomains(){
      const _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
     // _this.queryPanelform.checkDomain="";
      _this.$refs.loading.showLoading();
      client.search({
          index: "shadow-filebeat-*",
          body:  {
            "size": 0,
            "query": {
              "bool": {
                "must": [
                   {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
              }
            },
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
          let data=res2.aggregations.domains;
          var result = [];
          if(data.buckets.length==0){
            _this.queryPanelform.checkDomain="";
          }
          data.buckets.forEach(function(bucket) {
            if (_this.isValidKey(bucket.key) && bucket.ports.buckets.length > 0) {
              bucket.ports.buckets.forEach(function(portBucket) {
                result.push(bucket.key + ':' + portBucket.key);
              });
            }
          });
          _this.getDms=result;
        });

       
    },
  },
  filters: {
    customFilter(value) {
      const decoded = Base64.decode(value);
      return decoded;
    }
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
.tagli{display: inline-block; margin-right: 18px;}
.table-container {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

/* 表头 */
.table-container thead {
  background-color: #f2f2f2;
}

.table-container th,
.table-container td {
  padding: 10px;
  border: 1px solid #ddd; /* 添加边框 */
}

/* 表体 */
.table-container tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* 鼠标悬停效果 */
.table-container tbody tr:hover {
  background-color: #e0e0e0;
}

/* 响应式表格，适应小屏幕 */
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  .table-container th,
  .table-container td {
    white-space: nowrap;
  }
}
a.editdel{ display: inline-block; margin: 6px; font-size: 12px;}
a.editdel:hover{text-decoration: underline;}
</style>
