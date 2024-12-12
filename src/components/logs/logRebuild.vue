<template>
  <div class="logRebuildBox form-bg">
    <el-tabs v-model="logRebuildActiveName" tab-position="left" style="height: 130px;">
      <el-tab-pane name="requery">
        <span slot="label"><img :src="logRebuildActiveName=='requery'?'static/icon/searchActive.png':'static/icon/search.png'" class="rbIconsize" :title="$t('lg.searchzhidigndata')"/></span>
        <log-requery :searchObj='searchObj' :tableKeyArr='tableKeyArr' :newtype2="newtype" @requeryRowBy='requeryRowBy'></log-requery>
      </el-tab-pane> 
      <el-tab-pane name="refilter">
        <span slot="label"><img :src="logRebuildActiveName=='refilter'?'static/icon/filterActive.png':'static/icon/filter.png'" class="rbIconsize" :title="$t('lg.customtableshowzid')"/></span>
        <log-refilter :tableKeyArr='tableKeyArr' :dynamicTags='dynamicTags' :tableKeyArrData='tableKeyArrData' @addDynamicTags='addDynamicTags' @dropDynamicTags='dropDynamicTags'></log-refilter>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
// import Emitter from 'element-ui/src/mixins/emitter';
import logRequery from '@/components/logs/logRequery';
import logRefilter from '@/components/logs/logRefilter';
export default {
  components:{
    logRequery,
    logRefilter
  },
  props:{
    tableKeyArr:{
      type:Array
    },
    dynamicTag:{
      type:Array
    },
    searchObj:{
      type:Object
    },
    newtype:{
      type:String
    }
  },
  data(){
    return{
      logRebuildActiveName:'requery',
      dynamicTags:this.dynamicTag,
    }
  },
  watch:{
    'dynamicTag'(newData,old){
      this.dynamicTags = newData
    },
    'dynamicTags'(newData){
      this.$emit('refilterColBy',this.dynamicTags)
    }
  },
  methods:{
    addDynamicTags(eleObj){
      this.dynamicTags.push(eleObj)
      // this.$emit('refilterColBy',this.dynamicTags)
    },
    dropDynamicTags(index){
      this.dynamicTags.splice(index, 1);
      // this.$emit('refilterColBy',this.dynamicTags)
    },
    requeryRowBy({requeryObj,requeryKeysArr}){
      requeryKeysArr.forEach(element => {
        if(!this.dynamicTags.length) this.dynamicTags.push(element)
        const obj =this.dynamicTags.find(item=>{
          return item.field.includes(element.field) && item
        })
        if(!obj){
          this.dynamicTags.push(element)
          // this.$emit('refilterColBy',this.dynamicTags)
        }
      });
      this.$emit('requeryRowBy',{requeryObj,requeryKeysArr});
    }
  },
  computed:{
    tableKeyArrData(){
      var _this= this;
      if(!this.dynamicTags.length) return this.tableKeyArr;
      //else
      const arr = this.tableKeyArr.filter(item=>{
        const obj = _this.dynamicTags.find(el=>{
          return el.field.includes(item.field) && el
        })
        if(!obj){
          return item
        } 
      })
     // console.log(arr)
      return arr
    }
  }
}
</script>

<style>
.logRebuildBox{
  margin-bottom: 20px;
  padding: 20px 20px 20px 0px;
}
.logRebuildBox .el-tabs__item{
  height: 65px;
  padding-top: 22px;
}
.logRebuildBox .el-tabs__active-bar{
  background-color:#f6bd07;
}
.rbIconsize{
  height: 34px;
}
</style>
