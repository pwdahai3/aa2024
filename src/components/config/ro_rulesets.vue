<template>
  <div>
    <el-dialog width="68%" title="RuleSets" :visible.sync="isShow" :close-on-click-modal="false" :before-close="roRulesetsClose">
      <!-- <el-form ref="rulesetsform" label-width="100px">
          <el-row>
              <el-col :span="9">
                  <div class="grid-content" style="margin-right:12px;">
                      <el-input
                          placeholder="RULESET_DESC"
                          v-model="rulesetsform.desc">
                      </el-input>
                  </div>
              </el-col>
              <el-col :span="9">
                  <div class="grid-content" style="margin-right:12px">
                      <el-input
                          placeholder="ruleset_name.rules"
                          v-model="rulesetsform.name">
                      </el-input>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div class="grid-content">
                      <el-button type="primary" @click="addRuleset">Add Ruleset</el-button>
                  </div>
              </el-col>
          </el-row>
      </el-form> -->
      <a href="javascript:;" class="edit-del-a" @click="downloadRuleset()"><i class="el-icon-download"></i>{{$t('lg.download2')}}</a>
      <a href="javascript:;" class="edit-del-a" @click="importRuleset()"><i class="el-icon-d-arrow-right"></i>{{$t('lg.import')}}</a>
      <div style="margin-top:20px"> <!-- style="margin-top:30px" -->
        <p v-if="data.length==0">{{$t('lg.nodata')}}</p>
        <table class="rulesets-table" v-if="data.length>0">
          <thead>
            <tr>  
              <th>DESC</th>
              <th>FILE</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data">
              <td>{{item.remarks}}</td>
              <td>{{item.name}}</td>
              <td width="280" class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="showRulesInRuleset(item.name)"><i class="el-icon-document"></i>{{$t('lg.rules')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="viewRuleset(item.name)"><i class="el-icon-tickets"></i>{{$t('lg.detail')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="exportRuleset(item.name)"><i class="el-icon-upload2"></i>{{$t('lg.push')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>

    <el-dialog width="68%" title="RuleSets" :visible.sync="viewrulesetShow" :close-on-click-modal="false" :before-close="back">
      <div class="show-rulesetcontent">
        <div class="ruleset-c">
          <p v-if="!rulesethtml">{{$t('lg.nodata')}}</p>
          <div v-if="rulesethtml" v-html="rulesethtml"></div>
        </div>
        <div class="ruleset-back-btn">
          <el-button type="primary" @click="back">{{$t('lg.back')}}</el-button>
        </div>
      </div>
    </el-dialog>
    <div class="rulesinrulesets" v-if="rulesinrulesetsShow">
      <ro-rules :isShow="rulesinrulesetsShow" :data="ruleData" :rulesetdata="rootrulesetData" :backbtnShow="nobackbtnShow" @rootrulesclose="rulesinrulesetsShow=false"></ro-rules>
    </div>
    <importruleset :isShow="importRulesetShow" @importclose="importRulesetShow=false"></importruleset>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import roRules from '@/components/config/ro_rules'
import importruleset from '@/components/config/importRuleset'
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isShow:{
      type:Boolean
    },
    data:{
      type:Array
    }
  },
  data(){
    return{
      rulesetsform:{
        desc:'',
        name:''
      },
      ruleData:[],
      rootrulesetData:[],
      rulesinrulesetsShow:false,
      nobackbtnShow:false,
      viewrulesetShow:false,//View弹框
      rulesethtml:'',
      importRulesetShow:false
    }
  },
  mounted(){
    // var url2=SERVER_API_URL+"waf/ruleset";
    // axios.get(url2).then((res)=>{
    //     if(res.data.responseCode==0){
    //          this.rootrulesetData=res.data.data;
    //          console.log(444)
    //     }else{
    //         this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    // }).catch((err)=>{
    //     console.log(err)
    // });
  },
  watch:{
    "data":function(){
      this.rootrulesetData=this.data
    },
  },
  methods:{
    roRulesetsClose(){
      // this.$refs['rulesetsform'].resetFields();
      this.viewrulesetShow=false;
      this.$emit("rootrulesetsclose");
    },
    addRuleset(){// Add Ruleset
    var _this=this;
      var name=this.rulesetsform.name,
          desc=this.rulesetsform.desc;
      if(!name){
        this.$message.error(_this.$t('lg.required'));
        return;
      }
      if(!/(\.rules)$/.test(name)){
        this.$message.error(_this.$t('lg.rulesetnametips'));
        return;
      }
      var url=SERVER_API_URL+"waf/ruleset/"+name;
      var rulesetData={
            fileName: name,
            name: name,
            remarks: desc,
            timestamp: Date.now()
          };
      axios.put(url,rulesetData).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRulesets")
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          this.rulesetsform.name = "";//清空
          this.rulesetsform.desc = "";
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    showRulesInRuleset(name){//Rules
    var _this=this;
      var url=SERVER_API_URL+"waf/ruleset/"+name+"/rules";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          this.ruleData=res.data.data;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      this.rulesinrulesetsShow=true;
    },
    viewRuleset(name){//View
    var _this=this;
      this.rulesethtml="";
      this.viewrulesetShow=true;
      var url=SERVER_API_URL+"waf/ruleset/"+name+"/view";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          var thehtml=res.data.data.data;
          if(thehtml){
            this.rulesethtml=thehtml.replace(/\n/g,"<br/>");
          }
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    back(){
      this.viewrulesetShow=false;
    },
    importRuleset(){
      this.importRulesetShow=true;
    },
    downloadRuleset(){
      var url=SERVER_API_URL+"waf/rule/export";
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        }).then((res)=>{
        const content = res.data;
        const blob = new Blob([content]);
        var dates=new Date();
        var year=dates.getFullYear();
        var month=parseInt(dates.getMonth())+1;
        var day=dates.getDay();
        const fileName = this.$t('lg.allrules')+"_"+year+"-"+month+"-"+day+".xlsx";
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }
      })
    },
    exportRuleset(name){
      var _this=this;
      var url=SERVER_API_URL+"waf/ruleset/"+name+"/export";
      this.$confirm(_this.$t('lg.rulesetconfirm'), _this.$t('lg.tips'), {
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
          }else{
            //  this.$message.error('操作失败: '+ res.data.data.message);
            this.$message.error(_this.$t('lg.failed'));
          }
        }).catch((err)=>{
          console.log(err)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: _this.$t('lg.canceled')
        });          
      });
    } 
  },
  components:{
    loading,
    roRules,
    importruleset
  }
}
</script>
<style scoped>
.rulesets-table .handlectrl{ text-align: right;}
.show-rulesetcontent{
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  position: absolute;
  left:0; top: 50px;
  padding: 20px 20px 80px;
  box-sizing: border-box;
}
.show-rulesetcontent .ruleset-c{ padding:20px;min-height: 100%;
  max-height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-all;
  word-wrap:break-word;}
.ruleset-back-btn{ position: absolute; left:50%; margin-left: -20px; bottom: 14px}
</style>
