<template><!--可删组件-->
  <div class="rate-wrapper">
    <el-select v-model="$store.state.timerateValue" :placeholder="$t('lg.caiyangplv')" @change="getRate($store.state.timerateValue)">
      <el-option
        v-for="item in $store.state.timerateOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import * as types from '@/store/types'
export default {
  data(){
    return{
      // options: [{
      //   value: '5m',
      //   label: '5分钟'
      // }, {
      //   value: '1h',
      //   label: '一小时'
      // }, {
      //   value: '1d',
      //   label: '一天'
      // }],
      // value: ''
    }
  },
  methods:{
    getRate(val){
      this.$store.state.mydatedata.interval = val;
      this.$store.state.mydatedata.flowInterval = val;
      this.$store.state.mydatedata.timestampnow = new Date();
    }
  }
}
</script>

<style>
.rate-wrapper .el-select .el-input.is-focus .el-input__inner {
  border-color: transparent
}
.rate-wrapper .el-input--suffix .el-input__inner{
  background-color:#292929;
  border-radius: 0;
  border: 1px solid #000;
  color: #606266;
  width: 100%;  
}
.el-popper[x-placement^=bottom] .popper__arrow{
  margin-left: 70px;
}
</style>
