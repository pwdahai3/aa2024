
<template>
  <div class="search-wrapper" v-if="isShow">
    <div class="search-triangle"></div>
    <el-form label-width="80px">
      <el-form-item :label="$t('lg.baseon')" prop="name">
        <el-select v-model="searchValue" :placeholder="$t('lg.select')" @change="getSearchType(searchValue)">
          <el-option
            v-for="item in searchType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span>{{$t('lg.search')}}</span>
      </el-form-item>
    </el-form>     
    <el-form ref="searchDomainform" :model="searchDomainform" :rules="searchDomainformRules" :label-width="$store.state.isencn=='en'?'180px':'80px'" v-if="isDomain">
      <el-form-item :label="$t('lg.bsdomain')" prop="domainName">
        <el-input :placeholder="$t('lg.bsdomain')" clearable v-model="searchDomainform.domainName" @keyup.enter.native="searchEnsure('searchDomainform')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('lg.bsport')"  prop="domainPort">
        <el-input :placeholder="$t('lg.bsport')" clearable v-model="searchDomainform.domainPort" @keyup.enter.native="searchEnsure('searchDomainform')"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:20px">
        <el-button type="primary" @click="searchEnsure('searchDomainform')">{{$t('lg.search')}}</el-button>
      </el-form-item>
    </el-form>  
    <el-form ref="searchLocationform" :model="searchLocationform" :rules="searchLocationformRules"  label-width="80px" v-if="isLocation">
      <el-form-item :label="$t('lg.objposition')" prop="locationName">
        <el-input :placeholder="$t('lg.protectedpos')" clearable v-model="searchLocationform.locationName" @keyup.enter.native="searchEnsure('searchLocationform')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('lg.matchtype')" prop="locationType">
        <el-select v-model="searchLocationform.locationType" :placeholder="$t('lg.select')">
          <el-option :label="$t('lg.exactmatch')" value="accurateMatch"></el-option>
          <el-option :label="$t('lg.suffixmatch')" value="suffixMatch"></el-option>
          <el-option :label="$t('lg.patchmatch')" value="pathMatch"></el-option>
          <!-- <el-option :label="$t('lg.dynamicurl')" value="dynamicMatch"></el-option> -->
          <el-option :label="$t('lg.nolimited')" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top:20px">
        <el-button type="primary" @click="searchEnsure('searchLocationform')">{{$t('lg.search')}}</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="searchConfigureform" :model="searchConfigureform" :rules="searchConfigureformRules"  label-width="80px" v-if="isConfigure">    
      <el-form-item :label="$t('lg.ourl')" prop="configure">
        <el-input :placeholder="$t('lg.ourl2')" clearable v-model="searchConfigureform.configure" @keyup.enter.native="searchEnsure('searchConfigureform')"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:20px">
        <el-button type="primary" @click="searchEnsure('searchConfigureform')">{{$t('lg.search')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import * as types from '@/store/types';
import {SERVER_API_URL,SERVER_API_URL2} from '@/conf/constvar';
import store from '../../store/store';
export default {
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      productName:store.state.productName,
      jsonData:{
        name: this.productName,
        shadowtitle:true,
        children:[]
      },
      searchType: [{
        value: 'domian',
        label: this.$t('lg.business')
      }, {
        value: 'location',
        label: this.$t('lg.protectedpos')
      }, {
        value: 'configure',
        label: this.$t('lg.protected')
      }],
      searchValue: 'domian',
      searchDomainform:{
        domainName:'',
        domainPort:'',
      },
      searchLocationform:{
        locationName:'',
        locationType:'',
      },
      searchConfigureform:{
        configure:''
      },
      isDomain:true,
      isLocation:false,
      isConfigure:false,
      searchDomainformRules:{
        domainName:[//既能输域名又能输IP
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        domainPort:[
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }
          },
          trigger: 'blur'
        }
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ]
      },
      searchLocationformRules:{
        locationName:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },
      searchConfigureformRules:{
        configure:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      }
    }
  },
  created(){
    if(!this.$store.state.productName){
      this.getProductname();
    }
  },
  methods:{
    getProductname(){
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data
          this.productName=resData;
          this.$store.state.productName=resData;
        }
      })
    },
    getSearchType(val){
      if(val=="domian"){
        this.isDomain=true;
        this.isLocation=false;
        this.isConfigure=false;
      }else if(val=="location"){
        this.isLocation=true;
        this.isDomain=false;
        this.isConfigure=false;
      }else if(val=="configure"){
        this.isConfigure=true;
        this.isDomain=false;
        this.isLocation=false;
      }
    },
    searchEnsure(formname){//点击搜索
      this.$refs[formname].validate((valid) => {
        if(valid){
          var _this=this;
          _this.$store.state.contentLoading=true;
          if(_this.searchValue=="domian"){
            var dName=Base64.encode(_this.searchDomainform.domainName),
                dPort=_this.searchDomainform.domainPort;
            if(dPort){
              _this.$store.state.configServerUrl=SERVER_API_URL+"topology/filter?"+"domainName="+dName+"&"+"domainPort="+dPort;
            }else{
              _this.$store.state.configServerUrl=SERVER_API_URL+"topology/filter?"+"domainName="+dName;
            }
          }else if(_this.searchValue=="location"){
            var lName=Base64.encode(_this.searchLocationform.locationName),
                lType=_this.searchLocationform.locationType;
            if(lType){
              _this.$store.state.configServerUrl=SERVER_API_URL+"topology/filter?"+"locationName="+lName+"&"+"locationType="+lType;
            }else{
              _this.$store.state.configServerUrl=SERVER_API_URL+"topology/filter?"+"locationName="+lName;
            }
          }else if(_this.searchValue=="configure"){
            var uName=Base64.encode(_this.searchConfigureform.configure);
            _this.$store.state.configServerUrl=SERVER_API_URL+"topology/filter?"+"urlName="+uName;
          }
          _this.$emit("updateRenderTree");
        }
      })
    },
  }
}
</script>
<style scoped>
.search-wrapper{
  position: absolute;
  top: 55px;
  right: 20px;
  width: 420px;
  background: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 5px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  padding: 20px 15px 0px;
  box-sizing: border-box;
  z-index: 1;
  /* transition: right 0.15s linear; */
}
.search-triangle{
  width:0;
  height:0;
  border-left:5px solid transparent;
  border-right:5px solid transparent;
  border-bottom:8px solid #fff;
  position: absolute;
  top: -8px;
  right: 80px;
}
</style>
