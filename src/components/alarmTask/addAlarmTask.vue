<template>
  <div>
    <div class="form-bg">
      <el-row :gutter="10">
        <el-col :span="2.5">
          <el-button type="primary" style="width:100%" @click="isShowSelect=true">{{$t('lg.add')}}</el-button>
        </el-col>
        <el-col :span="6">
          <el-select v-model="taskTypeValue" clearable :placeholder="$t('lg.addalertingtype')" style="width:100%" @change="getCorrespondingTaskPop" v-show="isShowSelect">
            <el-option
              v-for="item in taskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <timing-task-pop :isShow="isShowTimingTask" :isNeedRefreshAddTask="true" :hasNextStep="hasNextStep" :myTaskType="alarmTaskType" :myTaskTypeTxt="alarmTaskTypeTxt" :alertmark="alertMark" @getTimingTask="getTimingTask" @setTimingTaskClose="isShowTimingTask=false;"></timing-task-pop>
  </div>
</template>

<script>
import timingTaskPop from '@/components/alarmTask/timingTaskPop';
export default {
  props:{
    taskTypeDisabledObj:{
      type:Object
    }
  },
  data() {
    return {
      isShowSelect:false,
      taskTypeOptions: [{
        value: 'urlCompare',
        label: this.$t('lg.objbased'),
      },{
        value: 'apiScan',
        label: this.$t('lg.apiScanbased'),
      },{
        value: 'tokenTime',
        label: this.$t('lg.tokentimebased')
      }, {
        value: 'tokenCount',
        label: this.$t('lg.tokencountbased')
      },
       {
        value: 'esSearch',
        label: this.$t('lg.customesqbased')
      },
       {
        value:'maliciousAccess',
        label: this.$t('lg.maccessyuanipbased')
      }, {
        value:'maliciousAccessOrg',
        label: this.$t('lg.maccessorgipbased')
      },{
        value:'maliciousAttack',
        label: this.$t('lg.mattackyuanipbased')
      },{
        value: 'cpuMax',
        label: this.$t('lg.cpubased'),
        disabled: false
      },{
        value: 'cpu_cmMax',
        label: this.$t('lg.jiyuglptcpu'),
        disabled: false
      },{
        value: 'memoryMax',
        label: this.$t('lg.memorybased'),
        disabled: false
      },{
        value: 'memory_cmMax',
        label: this.$t('lg.jiyuglptmemory'),
        disabled: false
      }, 
      // { //流量图表报警暂时弃用
      //   value: 'networkMax',    
      //   label: this.$t('lg.networkbased'),
      //   disabled: false
      // },
      {
        value: 'diskRootMax',
        label: this.$t('lg.diskRootbased'),
        disabled: false
      },{
        value: 'diskRoot_cmMax',
        label: this.$t('lg.jiyuglptdisc'),
        disabled: false
      },{
        value: 'diskRoot01Max',
        label: this.$t('lg.diskRoot01based'),
        disabled: false
      },{
        value: 'diskRoot01_cmMax',
        label: this.$t('lg.jiyuglptdischome'),
        disabled: false
      }],
      taskTypeValue: '',

      alarmTaskType:'',
      alarmTaskTypeTxt:'',
      alertMark:'',

      isShowTimingTask:false,
      hasNextStep:false,
    }
  },
  watch:{
    'isShowSelect':function(){
      if(this.isShowSelect){
        this.judgeTaskTypeOptDisable();
      }
    },
    'isShowTimingTask':function(){
      if(!this.isShowTimingTask){
        this.taskTypeValue='';
        this.isShowSelect=false;
      }
    }
  },
  methods:{
    judgeTaskTypeOptDisable(){
      var disSelectObj = this.taskTypeDisabledObj;
      // this.taskTypeOptions.forEach((ele)=>{ //写法1 这中要把 this.taskTypeOptions重新赋值 否则有问题
      //   if(disSelectObj[ele.value]){
      //     console.log(disSelectObj[ele.value])
      //     ele.disabled=disSelectObj[ele.value];
      //   }
      // })

      for(var key in disSelectObj){ //写法2
        this.taskTypeOptions.forEach((ele)=>{
          if(ele.value==key){
            ele.disabled=disSelectObj[key];
          }
        })
      }
    },
    getCorrespondingTaskPop(val){//切换不同的定时任务类别，显示不同的定时任务参数弹框
      var alarmTaskTypeTxt='';
      this.hasNextStep=false;//还原
      this.taskTypeOptions.forEach((ele)=>{
        if(val==ele.value){
          alarmTaskTypeTxt=ele.label;
        }
      })
      this.alarmTaskTypeTxt=alarmTaskTypeTxt;
      
      if(val=='urlCompare' || val=='apiScan' || val=='tokenTime' || val=='tokenCount' || val=='esSearch'){
        this.alarmTaskType = val;
        this.alertMark='';
        if(val=='esSearch'){
          this.hasNextStep=true;
        }
      }else if(val=='maliciousAccess' || val=='maliciousAccessOrg' || val=='maliciousAttack' || val=='cpuMax' || val=='memoryMax' || val=='networkMax' || val=='diskRootMax' || val=='diskRoot01Max' || val=='cpu_cmMax' || val=='memory_cmMax' || val=='diskRoot_cmMax' || val=='diskRoot01_cmMax'){
        this.alarmTaskType = 'esSearch';
        this.alertMark=val;
      }
      this.isShowTimingTask=true;
    },
    getTimingTask(){
      this.$emit('getTimingTask');
    }
  },
  components:{
    timingTaskPop,
  }
}
</script>

<style>

</style>
