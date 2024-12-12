<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="80%" :title="name" :visible.sync="detailShow" :close-on-click-modal="false" :before-close="handleClose">
      <!-- <div v-if="data && (data.accurate.length>0 || data.path.length>0 || data.suffix.length>0)"> -->
      <table  class="table-container">
          <tr v-for="(item,index) in data.accurate" :key="'acc-'+index">
            <td>{{item.locationName}}</td>
            <td>
              <ul>
                <li class="tagli" v-for="(tag, tagIndex) in item.tagNames" :key="tagIndex" v-if="tag.tag_name!='-'">
                   {{ tag.tag_name | customFilter}}
                </li>
              </ul>
            </td>
            <td>{{item.remark}}</td>
            <td width="80">
              <a href="javascript:;" class="editdel" @click="openDialog(item,'accurtate','acc-'+index)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'accurtate',index)">删除</a>
            </td>
          </tr>
          <tr v-for="(item,index1) in data.path" :key="'pat-'+index1">
            <td colspan="2">{{item.locationName}}</td>
            <td>{{item.remark}}</td>
            <td>
              <a href="javascript:;" class="editdel" @click="openDialog(item,'path','pat-'+index1)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'path',index1)">删除</a>
            </td>
          </tr>
          <tr v-for="(item,index2) in data.suffix" :key="'suff-'+index2">
            <td colspan="2">{{item.locationName}}</td>
            <td>{{item.remark}}</td>
            <td>
              <a href="javascript:;" class="editdel" @click="openDialog(item,'suffix','suff-'+index2)">编辑</a><a href="javascript:;" class="editdel" @click="deleteItem(item,'suffix',index2)">删除</a>
            </td>
          </tr>
         </table>
         <div>
          <el-button type="primary" @click="saveAll()">保存全部</el-button>
         </div>
        <!-- </div>
        <div v-if="data & data.accurate.length==0 && data.path.length==0 &&data.suffix.length==0">
          暂无数据
        </div> -->
    </el-dialog>
    <detailshow :detailShow="isdetailshow" @toClose="isdetailshow=false" :currentEditData="currentEditData" :currentIndex="currentIndex" @save-data="handleSave"></detailshow>
    <loading ref="loading"></loading>
  </div>
</template>
<script>
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import detailshow from '@/components/iconfig/detailshow.vue'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
import Loading from '../loading/loading.vue';
export default{
  components:{
    detailshow,
    loading
  },
  props:{
    data:{
      type:Object
    },
    detailShow:{
      type:Boolean
    },
    name:{
        type:String
    },
    id:{
        type:Number
    }
  },
  
  data(){
    return{
        currentTitle:{},
        savelallDialogVisible:false,
        iseditShow: false,
        editshowData: {},
        currentEditType: "",
        currentEditIndex: null,
        editedData: [], // 用来保存编辑的数据
        isdetailshow:false,

        listData: [/* 原始数据 */],
        tempData: {}, // 使用对象而不是数组，使得检查是否有数据更为简单
        showDialog: false, // 控制编辑框的显示与隐藏
        currentIndex: null, // 当前编辑的条目索引
        currentEditData:{}

    }
  },
  methods:{
    saveAll(){
      this.$refs.loading.showLoading();
      const aData=this.mergeData();

      let reqBodyData={
        "iConfigId":this.id,
        "name":this.name,
        "accurate":aData.accurate,
        "path":aData.path,
        "suffix":aData.suffix
      };
      const url=SERVER_API_URL+"pe/shadow/i-config/detail/update";
      axios.patch(url,reqBodyData).then((res)=>{
        if(res.data.responseCode == 0){
            this.$message({
              type: "success",
              message: this.$t('lg.success')
            });
            this.handleClose();
            this.$refs.loading.hideLoading();
           // this.getIconfigset()
          }else{
            this.$message.error(this.$t('lg.failed')+": " + res.data.data.message);
          }
      })


    },
    mergeData() {
      let mergedData = JSON.parse(JSON.stringify(this.data));  // 深复制 listData

      mergedData.accurate.forEach((item) => {
        delete item.id;
        delete item.iConfigId;
        delete item.locationType;
        delete item.createDateStr;
        delete item.modDateStr;
        delete item.remark;
      });

      // 遍历并删除suffix数组中的字段
      mergedData.suffix.forEach((item) => {
        delete item.id;
        delete item.iConfigId;
        delete item.locationType;
        delete item.createDateStr;
        delete item.modDateStr;
        delete item.remark;
        delete item.tagNames;
      });

      mergedData.path.forEach((item) => {
        delete item.id;
        delete item.iConfigId;
        delete item.locationType;
        delete item.createDateStr;
        delete item.modDateStr;
        delete item.remark;
      });

      for (let key in this.tempData) {
        let [type, index] = key.split('-');  // 例如：'acc-0' -> ['acc', '0']

        // 转换 tempData 格式到 listData 格式
        let convertedData = this.convertTempDataToOriginal(this.tempData[key]);

        if (type === 'acc') {
          Object.assign(mergedData.accurate[index], convertedData);
        }
        else if (type === 'pat') {
          Object.assign(mergedData.path[index], convertedData);
        }
        else if (type === 'suff') {
          Object.assign(mergedData.suffix[index], convertedData);
        }
        // 可以继续为其他类型添加更多条件
      }

      return mergedData;
    },
    convertTempDataToOriginal(tempDataItem) {
     // console.log(tempDataItem)
      const result = {
        directive: [
          {
            type: 'shadow_request_time',
            directives: [{ shadow_request_time: Base64.encode(tempDataItem.shadow_request_time) }]
          },
          {
            type: 'param_verify',
            paramverify: tempDataItem.param_verify_switch ? 'on' : 'off'
          },
          {
            type: 'bot_conf',
            botConf: tempDataItem.bot_conf_switch ? 'on' : 'off'
          },
          {
            type: 'shadow_verify_browser',
            directives: [{ shadow_verify_browser: Base64.encode(tempDataItem.shadow_verify_browser) }]
          },
          {
            type: 'shadow_verify_agent',
            directives: [{ shadow_verify_agent: Base64.encode(tempDataItem.shadow_verify_agent) }]
          },
          {
            type: 'js_insert',
            directives: [] // 根据 tempData 中的数据，此处似乎没有具体的指令
          }
          // ... 可能还有其他的指令转换
        ]
      };
      if (!tempDataItem.shadow_request_time || tempDataItem.shadow_request_time === 0) {
        result.directive.splice(0, 1);
      }
      // 根据 tempDataItem.insertJsType 的不同值设置不同的 directives
      if (tempDataItem.insertJsType == 1) {
        result.directive.find(item => item.type === 'js_insert').directives = [
          {
            "shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="
          },
          {
            "shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMS"
          }
        ];
      } else if (tempDataItem.insertJsType == 2) {
        result.directive.find(item => item.type === 'js_insert').directives = [
          {
            "shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybX2"
          },
          {
            "shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"
          }
        ];
      } else if (tempDataItem.insertJsType == 3) {
        // 当 tempDataItem.insertJsType 等于 3 时，将对应的 directives 设置为空数组
        result.directive.find(item => item.type === 'js_insert').directives = [];
      }
      return result;
    },
    deleteItem(item,type,index){
      if(type=="accurtate"){
        this.data.accurate.splice(index,1)
      }else if(type=="path"){
        this.data.path.splice(index,1)
      }else if(type=="suffix"){
        this.data.suffix.splice(index,1)
      }
    },
    handleSave(index, data) {
    // 这里，我们可以直接更新listData，因为我们想要保存编辑后的数据
  //  this.listData[index] = Object.assign({}, data);

    // 如果你还想更新tempData，可以这样做
   // this.tempData[index] = Object.assign({}, data);

   //this.currentEditData[index] = Object.assign({}, data);
    this.$set(this.tempData, index, data);
    // console.log("trigger save,tempadata")
    // console.log(this.tempData)
  },
    openDialog(item,type,index) {
        this.currentIndex = index;
        this.currentEditData = {};
        // 使用提供的item数据，而不是直接修改listData
        let rawData = item;
      //  console.log("rawData:",JSON.stringify(rawData) )
      //  console.log("tempadat: ",JSON.stringify(this.tempData))
        let getshadow_request_time,getshadow_verify_browser,getshadow_verify_agent;
        if (this.tempData.hasOwnProperty(index)) {
            // 加载临时数组中的数据到编辑框
            rawData = this.tempData[index];
            getshadow_verify_browser=rawData.shadow_verify_browser;
            getshadow_verify_agent=rawData.shadow_verify_agent;
            this.currentEditData = {
              shadow_request_time:rawData.shadow_request_time,
              shadow_request_time_switch: rawData.shadow_request_time>0?true:false,
              shadow_verify_browser: parseInt(getshadow_verify_browser),
              shadow_verify_agent: parseInt(getshadow_verify_agent),
              param_verify_switch: rawData.param_verify_switch,
              bot_conf_switch: rawData.bot_conf_switch,
              insertJsType: rawData.insertJsType || '3' // 默认为'3'
          }
     //   console.log("from temp")
      //  console.log(JSON.stringify(this.currentEditData))
        }else{
          getshadow_request_time=this.getDirectiveValue2(rawData, 'shadow_request_time', 'shadow_request_time');
          getshadow_verify_browser=Base64.decode(this.getDirectiveValue2(rawData, 'shadow_verify_browser', 'shadow_verify_browser')) 
          getshadow_verify_agent=Base64.decode(this.getDirectiveValue2(rawData, 'shadow_verify_agent', 'shadow_verify_agent'))
          this.currentEditData = {
              // 从rawData中提取数据并进行转换
              shadow_request_time:getshadow_request_time && Base64.decode(getshadow_request_time),
              shadow_request_time_switch: getshadow_request_time && Base64.decode(getshadow_request_time)>0?true:false,
              shadow_verify_browser:parseInt(getshadow_verify_browser),
              shadow_verify_agent: parseInt(getshadow_verify_agent),
              param_verify_switch: this.getDirectiveValue2(rawData, 'param_verify', 'paramverify')=="on",
              bot_conf_switch: this.getDirectiveValue2(rawData, 'bot_conf', 'botConf')=="on",
              insertJsType: this.getDirectiveValue2(rawData, 'js_insert', 'jsInsertType')
          } 
          //    console.log("from raw")
       // console.log(JSON.stringify(this.currentEditData))  
        };
        
        this.isdetailshow = true;
    },
    editShow(item, type,index) {
      this.listData[index]=item;
      this.currentIndex = index;
      let rawData = this.listData[index];
      // 检查临时数组中是否有数据
      if (this.tempData.hasOwnProperty(index)) {
        // 加载临时数组中的数据到编辑框
        this.currentEditData = Object.assign({}, this.tempData[index]);
      } else {
        // 加载原始数组中的数据到编辑框
        this.currentEditData = Object.assign({}, this.listData[index]);
      }
     this.currentEditData = {
        // ... 其他属性
        shadow_request_time_switch: this.getDirectiveValue(rawData, 'param_verify', 'paramverify') === 'on',
        shadow_verify_browser: parseInt(this.getDirectiveValue(rawData, 'shadow_verify_browser', 'shadow_verify_browser')),
        // ... 其他转换
    };

      this.isdetailshow = true;
    },
    getDirectiveValue(data, type, key) {
        let directive = data.directive.find(d => d.type === type);
        if(type=="js_insert"){
          let jsinserttype="1";
          if (directive) {
            if(directive.directives.length==0){
              jsinserttype="3"
            }else{
              if(directive.directives[0].hasOwnProperty("shadow_insert_js_ex")){
                jsinserttype="2"
              }else if(directive.directives[0].hasOwnProperty("shadow_sub_filter")){
                jsinserttype="1"
              }
            }
          }
          return jsinserttype;

          
        }else{
          if(type=="param_verify" || type=="bot_conf"){
            if (directive) {
                return directive[key];
            }
          }else{
            if (directive && directive.directives[0] && directive.directives[0][key]) {
                return directive.directives[0][key];
            }
          }
        }
        return null;
    },
    getDirectiveValue2(data, type, key) {
        let directive = data.directive.find(d => d.type === type);
        if(type!="js_insert"){
          if (directive && directive.directives[0] && directive.directives[0][key]) {
              return directive.directives[0][key];
          }
        }else{
          let jsinserttype="1";
          if (directive) {
            if(directive.directives.length==0){
              jsinserttype="3"
            }else{
              if(directive.directives[0].hasOwnProperty("shadow_insert_js_ex")){
                jsinserttype="2"
              }else if(directive.directives[0].hasOwnProperty("shadow_sub_filter")){
                jsinserttype="1"
              }
            }
          }
          return jsinserttype;
        }
        return null;
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
    handleClose() {
      this.$emit("toClose", false);
    },
    handleClick(){

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
.tagli{display: inline-block; margin-right: 18px;}
</style>

