<template>
  <div>
    <el-dialog width="68%" title="Add Waf Rule" :visible.sync="isShow" :close-on-click-modal="false" :before-close="roAddRuleClose">
      <el-form ref="addruleform"  :model="addruleform" :rules="addruleformRules" label-width="100px">
        <el-form-item label="Id" prop="sid">
          <el-input v-model="sid" auto-complete="off"  :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.description')" prop="msg">
          <el-input v-model="addruleform.msg" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.rules')" prop="detect">
          <el-input v-model="addruleform.detect" auto-complete="off" ></el-input>
        </el-form-item>
        <div class="checkflexbox">
          <div class="checkflex-item">
            <el-form-item label="Mz">
              <el-checkbox-group v-model="addruleform.checkedMzs">
                <el-checkbox v-for="item in addruleform.mzlist" :label="item" :key="item">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div class="checkflex-item ckitem-box">
            <div class="ck-item-item">
              <!-- <el-form-item label="Score">
                <el-checkbox-group v-model="addruleform.checkedscs">
                  <el-checkbox v-for="item in addruleform.sclist" :label="item.name" :key="item.name">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item> -->
              <el-form-item label="Score">
                <el-checkbox-group v-model="attactype">
                  <el-checkbox v-for="item in attypedata" :label="item.attackType +':'+ item.score" :key="item.id">
                    {{item.attackType}}<i class="spani">{{item.score}}</i>
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <!-- <div class="ck-item-item-num">
              <label class="num-label"  v-for="(item,index) in addruleform.sclist">
                <el-input auto-complete="off" :disabled="true" :value="item.val" style="width:40px;" ></el-input>
              </label>
            </div> -->
          </div>
        </div>
        <el-form-item :label="$t('lg.remark')" prop="remarks">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="addruleform.remarks">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="风险级别" prop="ruleset2">
          <el-select v-model="addruleform.ruleset2" :placeholder="$t('lg.select')">
              <el-option label="提示" value="提示"></el-option>
              <el-option label="次要" value="次要"></el-option>
              <el-option label="重要紧急" value="重要紧急"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="策略执行动作" >
          <el-radio v-model="addruleform.radio" label="1">仅记录不阻断</el-radio>
          <el-radio v-model="addruleform.radio" label="2">阻断</el-radio>
        </el-form-item> -->
        <el-form-item label="RuleSet" prop="ruleset">
          <el-select v-model="addruleform.ruleset" :placeholder="$t('lg.select')" @visible-change="getRuleset($event)">
            <template v-for="item in $store.state.allRulesetData">
              <el-option :label="item.name" :value="item.name"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.onoff')">
          <el-switch v-model="addruleform.ison"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addRule">{{$t('lg.add')}}</el-button>
          <el-button @click="roAddRuleClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
export default{
  props:{
    isShow:{
      type:Boolean
    },
    sid:{
      type:String
    },
    attypedata:{
      type:Array
    }
  },
  data(){
    return{
      attactype:[],
      attactypeData:[],
      addruleform:{
        sid:this.sid,
        id:'',
        timestamp:'',
        active:'',
        ruleType:'',
        negative:'',
        msg:'',
        detect:'',
        remarks:'',
        ruleset:'',
        ruleset2:this.$t('lg.tip'),
        radio:'1',
        ison:true,
        checkedMzs:[],
        checkedscs:[],
        mzlist:["BODY","URL","ARGS","FILE_EXT","$HEADERS_VAR:User-Agent ","HEADERS","$HEADERS_VAR:Connection","$HEADERS_VAR:Cookie","$HEADERS_VAR:Content-Type","$HEADERS_VAR:Accept-Encoding","$HEADERS_VAR:X-Forward-For"],
        sclist:[{name:"$SQL",val:8},{name:"$RFI",val:8},{name:"$TRAVERSAL",val:8},{name:"$EVADE",val:8},{name:"$XSS",val:8},{name:"$UWA",val:8},{name:"$ATTACK",val:8}]
      },
      addruleformRules:{
        msg:[{required:true, message:this.$t('lg.required'), trigger:'blur'}],
        detect:[{required:true, message:this.$t('lg.required'), trigger:'blur'}],
        ruleset:[{required:true, message:this.$t('lg.required'), trigger:'change'}]
      }
    }
  },
  methods:{
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
    roAddRuleClose(){
      this.addruleform.checkedMzs=[];
      this.addruleform.checkedscs=[];
      this.attactype=[];
      this.$refs['addruleform'].resetFields();
      this.$emit("rootaddruleclose");
    },
    addRule(){
      var _this=this;
      this.$refs['addruleform'].validate((valid)=>{
        if(valid){
          var url=SERVER_API_URL+"waf/rule/"+this.sid;
          var mzselectedstr="";
          if(this.addruleform.checkedMzs.length>0){
            mzselectedstr=this.addruleform.checkedMzs.join("|");
          }
          // var scselectedstr="";
          // for(var i=0;i<this.addruleform.checkedscs.length;i++){
          //   scselectedstr+=this.addruleform.checkedscs[i]+":8,";
          // }
          // scselectedstr=scselectedstr.substring(0,scselectedstr.length-1);
          var scselectedstr=_this.attactype.join();

          var wafison=this.addruleform.ison==true?1:0;
          var timestamp=Date.now();
          axios.put(url,{
            active: wafison,
            detection: this.addruleform.detect,
            matchZone: mzselectedstr,
            message: this.addruleform.msg,
            negative: 0,
            remarks: this.addruleform.remarks,
            ruleType: "MainRule",
            ruleset: this.addruleform.ruleset,
            score: scselectedstr,
            sid: this.sid,
            timestamp: timestamp
          }).then((res)=>{
            // console.log(res);
            if(res.data.responseCode==0){
              this.roAddRuleClose();
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          });
        }
      })
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.checkflexbox{display: flex;}
.checkflex-item{flex:1}
.ckitem-box{ display: flex;}
.ckitem-box .ck-item-item{ flex: 1}
.ckitem-box .ck-item-item-num{ flex: 0 0 40px; width: 40px;}
.ckitem-box .ck-item-item-num .num-label{ display:block;}
.el-checkbox{ display: block}
.el-checkbox {margin-left: 0;}
/deep/ span.el-checkbox__label{
  width: 180px;
  position: relative;
}
/deep/ .spani{ position: absolute;
right: 4px;}
</style>
