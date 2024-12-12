<template>
  <div>
    <el-dialog width="68%" title="Waf Rules" :visible.sync="isShow" :close-on-click-modal="false" :before-close="roRulesClose">
      <div class="rules-container">
        <p v-if="data.length==0">{{$t('lg.nodata')}}</p>
        <table v-if="data.length>0">
          <tbody>
            <tr v-for="(item,index) in data">
              <td>{{item.message}}</td>
              <td width="170" class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="eidtRule(item,index)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="viewRule(item)"><i class="el-icon-tickets"></i>{{$t('lg.detail')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deleteRule(item)"><i class="el-icon-delete"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </el-dialog>

    <el-dialog width="68%" title="Waf Rules" :visible.sync="isEdit" :close-on-click-modal="false" :before-close="roRulesEditClose">
      <div class="editrule-wrapper">
        <div class="editrule-content">
          <el-form ref="editruleform"  :model="editruleform" :rules="editruleformRules" label-width="100px">
            <el-form-item :label="$t('lg.description')" prop="msg">
              <el-input v-model="editruleform.msg" auto-complete="off" ></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.rules')" prop="detect">
              <el-input v-model="editruleform.detect" auto-complete="off" ></el-input>
            </el-form-item>
            <div class="checkflexbox">
              <div class="checkflex-item">
                <el-form-item label="Mz">
                  <el-checkbox-group v-model="editruleform.checkedMzs">
                    <el-checkbox v-for="item in editruleform.mzlist" :label="item" :key="item">{{item}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div class="checkflex-item ckitem-box">
                <!-- <div class="ck-item-item">
                  <el-form-item label="Score">
                    <el-checkbox-group v-model="editruleform.checkedscs">
                      <el-checkbox v-for="item in editruleform.sclist" :label="item.name" :key="item.name">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                <div class="ck-item-item-num">
                  <label class="num-label"  v-for="(item,index) in editruleform.sclist">
                    <el-input auto-complete="off" :disabled="true" :value="item.val" style="width:40px;" ></el-input>
                  </label>
                </div> -->

                <el-form-item label="Score">
                <el-checkbox-group v-model="attactype">
                  <el-checkbox v-for="item in attactypeData" :label="item.attackType +':'+ item.score" :key="item.id">
                    {{item.attackType}}<i class="spani">{{item.score}}</i>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>


              </div>
            </div>
            <el-form-item :label="$t('lg.remark')" prop="remarks">
              <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model="editruleform.remarks">
              </el-input>
            </el-form-item>
            <el-form-item label="RuleSet" prop="ruleset">
              <el-select v-model="editruleform.ruleset" :placeholder="$t('lg.selectruleset')" @visible-change="getRuleset($event)">
                <template v-for="item in $store.state.allRulesetData">
                  <el-option :label="item.name" :value="item.name"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lg.onoff')">
              <el-switch v-model="editruleform.active"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="back-btn">
          <el-button type="success" @click="roRulesEditClose" v-if="backbtnShow">{{$t('lg.back')}}</el-button>
          <el-button type="primary" @click="saveRule">{{$t('lg.save')}}</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog width="45%" title="Waf Rules" class="myView" :visible.sync="isView" :close-on-click-modal="false" :before-close="roRulesViewClose">
      <div class="viewrule-wrapper">
        <div class="viewrule-content" v-if="viewRuleData">
          {{viewRuleData}}
        </div>
        <div class="back-btn">
          <el-button type="primary" @click="roRulesViewClose">{{$t('lg.back')}}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import loading from "@/components/loading/loading";
import { SERVER_API_URL } from "@/conf/constvar";
import * as types from '@/store/types';
export default {
  props: {
    isShow: {
      type: Boolean
    },
    data: {
      type: Array
    },
    backbtnShow: {
      type: Boolean,
      default: true
    }
  },
  created(){
    this.getAttactypeData();
  },
  data() {
    return {
      isEdit: false,
      isView: false,
      viewRuleData: "",
      attactypeData:[],
      attactype:[],
      editruleform: {
        sid: "",
        id: "",
        timestamp: "",
        active: "",
        ruleType: "",
        negative: "",
        msg: "",
        detect: "",
        remarks: "",
        ruleset: "",
        checkedMzs: [],
        checkedscs: [],
        mzlist: [
          "BODY",
          "URL",
          "ARGS",
          "FILE_EXT",
          "$HEADERS_VAR:User-Agent ",
          "HEADERS",
          "$HEADERS_VAR:Connection",
          "$HEADERS_VAR:Cookie",
          "$HEADERS_VAR:Content-Type",
          "$HEADERS_VAR:Accept-Encoding",
          "$HEADERS_VAR:X-Forward-For"
        ],
        sclist: [
          { name: "$SQL", val: 8 },
          { name: "$RFI", val: 8 },
          { name: "$TRAVERSAL", val: 8 },
          { name: "$EVADE", val: 8 },
          { name: "$XSS", val: 8 },
          { name: "$UWA", val: 8 },
          { name: "$ATTACK", val: 8 }
        ]
      },
      editruleformRules: {
        msg: [{ required: true, message: this.$t('lg.required'), trigger: "blur" }],
        detect: [{ required: true, message: this.$t('lg.required'), trigger: "blur" }]
      }
    };
  },
  methods: {
    getAttactypeData(){
     return new Promise((resolve,reject)=>{
        var url=SERVER_API_URL+"waf/attacktype";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let attactypeData=res.data.data;
          this.attactypeData=attactypeData;
          resolve(attactypeData)
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      })
    },
    getRuleset(callback){//下拉时获取全部WAF规则集
      if(callback){
        this.$store.commit(types.GETALLRULESET);
      }
    },
    roRulesClose() {
      this.editruleform.checkedMzs = [];
      this.editruleform.checkedscs = [];
      this.$emit("rootrulesclose");
    },
    roRulesEditClose() {
      this.isEdit = false;
    },
    roRulesViewClose() {
      this.isView = false;
    },
    eidtRule(item, index) {
       console.log(item);
      this.getAttactypeData().then((resolvedata)=>{
        this.isView = false;
      this.isEdit = true;
      this.editruleform.sid = item.sid;
      this.editruleform.id = item.id;
      this.editruleform.timestamp = item.timestamp;
      this.editruleform.active = item.active == 1 ? true : false;
      this.editruleform.ruleType = item.ruleType;
      this.editruleform.negative = item.negative;
      this.editruleform.msg = item.message;
      this.editruleform.detect = item.detection;
      this.editruleform.remarks = item.remarks;
      if (item.matchZone) {
        this.editruleform.checkedMzs = item.matchZone.split("|");
      }
      if (item.score) {
        this.attactype = item.score.split(",");
      }
      this.editruleform.ruleset = item.ruleset;



      })



      
    },
    viewRule(item) {
      this.isEdit = false;
      this.isView = true;
      var url = SERVER_API_URL + "waf/rule/" + item.sid + "/view";
      axios.get(url).then(res => {
        this.viewRuleData = res.data.data;
      });
    },
    saveRule() {
      var _this=this;
      this.$refs["editruleform"].validate(valid => {
        if (valid) {
          var url = SERVER_API_URL + "waf/rule/" + this.editruleform.sid;
          var mzselectedstr = "";
          if (this.editruleform.checkedMzs.length > 0) {
            mzselectedstr = this.editruleform.checkedMzs.join("|");
          }
          // var scselectedstr = "";
          // for (var i = 0; i < this.editruleform.checkedscs.length; i++) {
          //   scselectedstr += this.editruleform.checkedscs[i] + ":8,";
          // }
          // scselectedstr = scselectedstr.substring(0, scselectedstr.length - 1);
          var scselectedstr=_this.attactype.join();
          var id = this.editruleform.id,
              sid = this.editruleform.sid,
              ison = this.editruleform.active == true ? 1 : 0;
          axios.post(url, {
            active: ison,
            detection: this.editruleform.detect,
            id: id,
            matchZone: mzselectedstr,
            message: this.editruleform.msg,
            negative: this.editruleform.negative,
            remarks: this.editruleform.remarks,
            ruleType: this.editruleform.ruleType,
            ruleset: this.editruleform.ruleset,
            score: scselectedstr,
            sid: sid,
            timestamp: this.editruleform.timestamp
          }).then(res => {
            // console.log(res)
            if(res.data.responseCode==0){
              this.$emit("updateRootRule");
              this.$message({
                type: "success",
                message: _this.$t('lg.success')
              });
              this.roRulesEditClose();
            }else{
              this.$message.error(_this.$t('lg.failed')+'：'+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    },
    deleteRule(item) {
      var _this=this;
      var url = SERVER_API_URL + "waf/rule/" + item.sid;
      axios.delete(url).then(res => {
        this.$emit("updateRootRule");
        this.isView = false;
        this.isEdit = false;
        this.$message({
          type: "success",
          message: _this.$t('lg.success')
        });
      });
    }
  },
  components: {
    loading
  }
};
</script>
<style scoped>
.rules-container {
  max-height: 500px;
  overflow-y: auto;
}
.rules-container .handlecontrl {
  font-size: 12px;
  text-align: right;
}
.rules-container .handlecontrl a {
  color: #fa5555;
  padding: 0 4px;
}
.editrule-wrapper,
.viewrule-wrapper {
  background-color: #ffffff;
  width: 100%;
  min-height: 100%;
  position: absolute;
  left: 0;
  top: 50px;
  padding-bottom: 60px;
  box-sizing: border-box;
}
.editrule-content,
.viewrule-content {
  padding: 20px;
  position: relative;
}
.viewrule-content {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  word-break: break-all;
  word-wrap: break-word;
}
.back-btn {
  text-align: center;
  position: absolute;
  bottom: 14px;
  left: 50%;
  margin-left: -150px;
  width: 300px;
}
.checkflexbox {
  display: flex;
}
.checkflex-item {
  flex: 1;
}
.ckitem-box {
  display: flex;
}
.ckitem-box .ck-item-item {
  flex: 1;
}
.ckitem-box .ck-item-item-num {
  flex: 0 0 40px;
  width: 40px;
}
.ckitem-box .ck-item-item-num .num-label {
  display: block;
}
.el-checkbox {
  display: block;
}
.el-checkbox {
  margin-left: 0;
}
.myView{
  margin-top: 15vh;
}
/deep/ span.el-checkbox__label{
  width: 180px;
  position: relative;
}
/deep/ .spani{ position: absolute;
right: 4px;}
</style>
