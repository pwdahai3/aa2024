<!-- 日志查询 -->
<template>
  <div class="logRequeryBox">
    <el-form ref="queryform" :model="queryform" :rules="queryformformRules" label-width="55px">
      <div v-for="(items,n) in queryform.tmpsArray" :key="n">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item :label="n==0?$t('lg.query'):'AND'" :prop="'tmpsArray.' + n + '.keyId'" :rules="{required: true, message: $t('lg.required'), trigger: 'blur'}">
              <el-select v-model="items.keyId" :placeholder="$t('lg.select')" @change="queryType(items.keyId,n)" style="width:100%">
                <el-option
                  v-for="(item,index) in tableKeyArr"
                  :key="index"
                  :label="item.zh"
                  :value="item.field"
                  :disabled="item.field=='shadow.access.error_code_txt'">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="0px" :prop="'tmpsArray.' + n + '.keyinputId'" :rules="items.queryTypes=='long'?keyinputIdRulesNum:keyinputIdRules">
              <el-input v-model.trim="items.keyinputId" :placeholder="$t('lg.select')" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="icon-row">
            <i class="el-icon-plus" @click="addQuery"></i>
            <i class="el-icon-minus" @click="delTmp(n)"></i>
          </el-col>
        </el-row>
      </div>
      <div class="btnBox">
        <div style="margin-bottom:10px">
          <el-checkbox v-model="exsearch">精确搜索</el-checkbox>
        </div>
        <el-button type="primary" @click="multiQuery()" icon="el-icon-search" size="small">{{$t('lg.search')}}</el-button>
        <el-button @click="logsHandleClick" size="small">{{$t('lg.reset')}}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import * as types from '@/store/types';
import Emitter from 'element-ui/src/mixins/emitter';
import {logskeys} from '@/assets/js/logskeys';

export default{
  mixins: [Emitter],
  // inject:['chr'],
  componentName: 'logRequery',
  props:{
    tableKeyArr:{
      type:Array
    },
    searchObj:{
      type:Object
    },
    newtype2:{
      type:String
    }
  },
  data(){
    return{
      exsearch:false,
      queryform:{
        tmpsArray:[
          {
            keyId: '',
            queryTypes:'',
            keyinputId:''
          }
        ]
      },
      queryformformRules:{},
      
      keyinputIdRules:[{required: true, message: this.$t('lg.required'), trigger: 'blur'}],
      keyinputIdRulesNum:[{required: true, message:this.$t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: this.$t('lg.number'), trigger: 'change'}],

      filterObj:{"bool":{"must":[]}},
      isen:false
    }
  },
  created() {
    this.isen=localStorage.getItem('lang')=="en"?true:false;
    this.$on('clearData',(value)=>{
      this.setClearData()
    })
  },
  methods:{
    queryType(val,i){
      const keyarr = this.tableKeyArr;
      let queryTypes='';
      keyarr.forEach(function(v){
        if(v.field==val){
          queryTypes=v.type;
        }
      })
      this.queryform.tmpsArray[i].queryTypes=queryTypes;
    },
    addQuery(){
      this.queryform.tmpsArray.push({
        keyId: '',
        keyinputId:''
      });
    },
    delTmp(index){
      if(this.queryform.tmpsArray.length>1){
        this.queryform.tmpsArray.splice(index,1);
      }
    },
    setClearData(){
      this.queryform.tmpsArray=[
        {
          keyId: '',
          keyinputId:''
        }
      ]
    },
    logsHandleClick(){
      this.setClearData()
      this.filterObj={"bool":{"must":[]}};
      this.$emit('requeryRowBy',{requeryObj:this.filterObj,requeryKeysArr:[]})
    },
    multiQuery(){
     // alert(1)
      let _this=this;
      _this.$refs['queryform'].validate((valid)=>{
        if(valid){
          const requeryKeysArr=[];
          _this.filterObj={"bool":{"must":[]}};
          if(!_this.queryform.tmpsArray.length) return false;
          for(let i=0;i<_this.queryform.tmpsArray.length;i++){
            let dataI=_this.queryform.tmpsArray[i];
            let dataIkeyid;
            if(this.newtype2=="audit"){
              dataIkeyid=dataI.keyId+".keyword";
            }else{
              dataIkeyid=dataI.keyId;
            } 
            let fuzzyQueryObj;
            if(this.exsearch){
              fuzzyQueryObj = {
                  "term": {
                    [dataIkeyid]: dataI.keyinputId
                  }
              }
            }else{
              fuzzyQueryObj = {
                "wildcard": {
                  [dataIkeyid]: `*${dataI.keyinputId}*`
                }
              }
            }
            this.filterObj.bool.must.push(fuzzyQueryObj);
            const dataLog = this.tableKeyArr.find(item=>{
              return item.field === dataI.keyId
            })
            requeryKeysArr.push(dataLog)
          }
  
          this.$emit('requeryRowBy',{requeryObj:_this.filterObj,requeryKeysArr:requeryKeysArr})
        }
      })
    }
  }
}
</script>
<style scoped>
.logRequeryBox{
  width: 100%;
  height: 130px;
  overflow-y: auto;
  padding:0 10px;
  box-sizing: border-box;
}
.icon-row{line-height: 40px}
.icon-row i{cursor: pointer; margin-right: 8px;}
.btnBox{
  margin-left: 60px;
}
</style>
