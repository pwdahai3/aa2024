<template>
  <div>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="lcwafstatusmodalClose">
      <!-- <p class="tips">注：开启后拓扑图上显示为红色字体</p> -->
      <el-form ref="wafmodalform"  label-width="90px">
        <el-form-item :label="$t('lg.wafstatus')+':'">
          <el-switch v-model="wafmodalform.wafStatus" ></el-switch>
          <!-- <a class='addRulesetHref' href="javascript:;" @click="showCheckRuleset"><i v-if="wafmodalform.checkedRulesets.length==0">选择Ruleset</i><i v-else>更改Ruleset</i></a> -->
        </el-form-item>
        <el-form-item :label="$t('lg.attacktype')">
          <el-checkbox-group v-model="wafmodalform.checkedRulesets">
              <el-checkbox  v-for="item in attypedata" :key="item"  :label="item.attackType"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveLcwaf">{{$t('lg.save')}}</el-button>
          <el-button @click="lcwafstatusmodalClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="lcwafmodalLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    }, 
    isShow:{
      type:Boolean
    },
    data:{
      type:Object
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    locationObj:{
      type:Object
    },
    attypedata:{
      type:Array
    }
  },
  data(){
    return{
      wafmodalform:{
        wafStatus:true,
        checkedRulesets:[]
      },
      checkedRulesets:[],
      isCheckRulesetShow:false,
      rulesetform:{
        ruleset:[]
      },
      lcwafmodalLoading:false
    }
  },
  watch:{
    'isShow':function(){
      if(this.isShow){
        if(this.data.waf=="on"){
          this.wafmodalform.wafStatus=true;
        }else{
          this.wafmodalform.wafStatus=false;
        }
       // console.log(this.data.wafRuleset)
        if(this.data.wafRuleset.length>0){
           this.wafmodalform.checkedRulesets=this.data.wafRuleset;
           this.rulesetform.ruleset = this.data.wafRuleset;
        }else{
          this.wafmodalform.checkedRulesets=[];
        }
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
    lcwafstatusmodalClose(){
      this.wafmodalform.checkedRulesets=[];
      this.$emit("setbylcwafmodal",false);
    },
    showCheckRuleset(){
      this.$store.commit(types.GETALLRULESET);//查看全部WAF规则集
      this.isCheckRulesetShow=true;
    },
    saveLcwaf(){//开启或者关闭页面的waf保护
    var _this=this;
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/waf?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/waf?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/waf";
      }
      this.lcwafmodalLoading=true;
      var onoff=this.wafmodalform.wafStatus==true?"on":"off";
      var wafRuleset=this.wafmodalform.checkedRulesets;
      axios.patch(url,{
        snodeId:this.shadowObj.snodeId,
        domainName:this.domainObj.domainName,
        domainPort:this.domainObj.port,
        locationName:this.locationObj.name,
        locationType:this.locationObj.type,
        waf:onoff,
        wafRuleset:wafRuleset
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRenderTree");
          this.lcwafstatusmodalClose();
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
        }
        this.lcwafmodalLoading=false
      }).catch((err)=>{
        console.log(err);
      });
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.addRulesetHref{
  font-size: 12px;
  margin-left: 10px;
  text-decoration:underline;
  color: #409EFF;
}
.wafBox{
  border: 1px solid #dcdfe6;
  padding: 0px 20px;
  border-radius: 10px;
}
</style>

