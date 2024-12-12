<!-- 日志显示字段过滤 -->
<template>
  <div :class="ischart?'logRefilterBox':'logRefilterBox box-height'">
    <el-form>
      <el-form-item :label="$t('lg.currentfiled')" label-width="100px">
        <el-tag
          v-for="(item,index) in dynamicTags"
          :key="index"
          @close="handleTabKeysClose(index)"
          :disable-transitions="true"
          :closable="chartHasAggsId">
          {{item.zh}}
        </el-tag>
        <el-select class="input-new-tag" v-if="tabKeysSelectVisible && tableKeyArrData.length!==0" ref="saveTagSelect" v-model="selectTabKeyVal" size="small" clearable filterable :placeholder="$t('lg.select')" @change="handleSelectConfirm">
          <el-option
            v-for="(item,index) in tableKeyArrData"
            :key="index"
            :label="item.zh"
            :value="item.field">
          </el-option>
        </el-select>
        <el-button v-if='!tabKeysSelectVisible && tableKeyArrData.length!==0' type="primary" class="button-new-tag" size="small" @click="showTabKeysSelect">+ {{$t('lg.add')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {logskeys} from '@/assets/js/logskeys';
import Emitter from 'element-ui/src/mixins/emitter';
export default {
 componentName: 'logRefilter',
  mixins: [Emitter],
  props:{
    ischart:{
      type:Boolean
    },
    dynamicTags:{
      type:Array
    },
    tableKeyArrData:{
      type:Array
    },
    tableKeyArr:{
      type:Array
    },
    chartHasAggsId:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      tabKeysSelectVisible: false,
      selectTabKeyVal: '',
    };
  },
  // created(){
  //   this.$on('handDynamicTags',({value}) => {
  //     value.forEach(element => {
  //       if(!this.dynamicTags.length) this.dynamicTags.push(element)
  //       const obj =this.dynamicTags.find(item=>{
  //         return item.field.includes(element.field) && item
  //       })
  //       if(!obj) this.dynamicTags.push(element)
  //     });
  //   });
  // },
  methods: {
    handleTabKeysClose(index) {
      this.$emit('dropDynamicTags',index)
    },
    showTabKeysSelect() {
      this.tabKeysSelectVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagSelect.focus();
      });
    },
    handleSelectConfirm() {
      let selectTabKey = this.selectTabKeyVal;
      if (selectTabKey) {
        const keyArr=this.tableKeyArr;
        var eleObj = keyArr.find((ele)=>{
          if(ele.field.includes(selectTabKey))return ele
        })
       // console.log(eleObj)
        this.$emit('addDynamicTags',eleObj)
      }
      this.tabKeysSelectVisible = false;
      this.selectTabKeyVal = '';
    }
  }
}
</script>

<style scoped>
.logRefilterBox{
  width: 100%;
  overflow-y: auto;
  padding:0 10px;
  box-sizing: border-box;
}
.box-height{
  height: 130px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 12px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 200px;
}
</style>
