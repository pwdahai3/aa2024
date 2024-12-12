<template>
  <div class="date-wrapper">
    <el-date-picker
      v-model="$store.state.nowTimeVal"
      type="datetimerange"
      :picker-options="pickerOptions"
      :range-separator="$t('lg.to')"
      :start-placeholder="$t('lg.startdate')"
      :end-placeholder="$t('lg.enddate')"
      unlink-panels
      @change="setMyTime"
      align="right"
      :clearable="false">
    </el-date-picker>
    <!-- <el-select v-model="value" placeholder="请选择" @change="selectDatetime" style="width:114px;">
            <el-option
              v-for="item in dateoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->

    <div class="autoRefreshBox" v-if="isShowAutoRefresh">
      <img src="static/icon/autoRefresh.png" :alt="$t('lg.refresh')" class="atRefImg">
      <el-select v-model="autoRrefreshVal" :placeholder="$t('lg.select')" :disabled='$store.state.refreshAble'>
        <el-option
          v-for="item in autoRrefreshOpt"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
import * as types from '@/store/types'
export default{
  created(){
    if(this.$store.state.refreshTimeout){
      clearTimeout(this.$store.state.refreshTimeout)
    }
    
    //刷新页面后(刷新情况不会跳转路由)
    if(this.atRefreshPathArr.indexOf(this.$route.path)!==-1){
      this.isShowAutoRefresh=true;
    }else{
      this.isShowAutoRefresh=false;
    }

    this.$store.commit(types.MYDATEPICKER);//退出登录后再登录
  },
  watch:{
    '$route.path' :{//跳转页面时、
      handler(newName, oldName) {
        this.$store.state.refreshFalg=false;
        clearTimeout(this.$store.state.refreshTimeout);
        this.autoRrefreshVal=0;//跳转页面时，关闭自动刷新
        if(this.atRefreshPathArr.indexOf(this.$route.path)!==-1){
          this.isShowAutoRefresh=true;
        }else{
          this.isShowAutoRefresh=false;
        }

        const hash=window.location.hash;
        if(hash.includes('dashboard')){
          this.pickerOptions.shortcuts= [
            {
              text: this.$t('lg.last1hour'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000);
                picker.$emit('pick', [start, end]);  
              }  
            },
            {
              text: this.$t('lg.last1day'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: this.$t('lg.last1week'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            }
          ]
        }else{
          this.pickerOptions.shortcuts= [
            {
              text: this.$t('lg.last1hour'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000);
                picker.$emit('pick', [start, end]);  
              }  
            },
            {
              text: this.$t('lg.last1day'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: this.$t('lg.last1week'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: this.$t('lg.last1month'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, 
            {
              text: this.$t('lg.last3month'),
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            }
          ]
        }
      },
      immediate: true
    },
    'autoRrefreshVal'(){//监视刷新频率变动
      var cT =new Date().getTime();
      this.$store.state.nowTimeVal=[new Date(cT-this.intervalTime),new Date(cT)];

      clearTimeout(this.$store.state.refreshTimeout);
      if(this.autoRrefreshVal==0){
        return false
      }else{
        this.startAutoRefresh();//调用自动刷新
      }
    },
  },
  data(){
    return{
      dateoptions: [{
          value: 'last1hour',
          label: '过去1小时'
        },{
          value: 'last3hour',
          label: '过去3小时'
        }, {
          value: 'last1day',
          label: '过去1天'
        }, {
          value: 'last1week',
          label: '过去1周'
        }, {
          value: 'last1month',
          label: '过去1个月'
        }],
      value: 'last1day',
      isShowAutoRefresh:true,
      autoRrefreshVal:0,//刷新间隔
      autoRrefreshOpt:[{
        value:0,
        label:'off'
      },{
        value:10000,
        label:'10s'
      },{
        value:30000,
        label:'30s'
      },{
        value:60000,
        label:'1m'
      },{
        value:300000,
        label:'5m'
      }],
      intervalTime:24*60*60*1000,//结束时间与开始时间的间隔差  3600 * 1000 * 24 * 1
     
      atRefreshPathArr:['/visit','/attack','/dashboard','/visitChart','/attackChart','/apiChart','/customChartGridLayout'],//能设置自动刷新的页面
      
      pickerOptions: {
        disabledDate(time) {
          const hash=window.location.hash
          if(hash.includes('dashboard')){
            return  time.getTime() < new Date(new Date().getTime()-3600 * 1000 * 24 * 7).getTime() ||  time.getTime() > Date.now() ;//不能选择未来时间
          }else{
            return time.getTime() > Date.now();//不能选择未来时间
          }
        },
        shortcuts: [
        {
          text: this.$t('lg.last1hour'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000);
            picker.$emit('pick', [start, end]);  
          }  
        },
        {
          text: this.$t('lg.last1day'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          },
        },{
          text: this.$t('lg.last1week'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          },
        } ,{
          text: this.$t('lg.last1month'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: this.$t('lg.last3month'),
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          },
        }]
      },
      // nowTimeVal: [new Date(new Date().getTime()-this.$store.state.dateTimeLong), new Date()],
    }
  },
  methods:{
    selectDatetime(item){
      let startTime=new Date();
      let endTime=new Date();
      if(item=="last1hour"){
        startTime=startTime.getTime() - 3600*1000;
      }else if(item=="last3hour"){
        startTime=startTime.getTime() - 3600*3*1000;
      }else if(item=="last1day"){
        startTime=startTime.getTime()-3600 * 1000 * 24 * 1;
      }else if(item=="last1week"){
        startTime=startTime.getTime()-3600 * 1000 * 24 * 7;
      }else{
        startTime=startTime.getTime()-3600 * 1000 * 24 * 30;
      }
      startTime=new Date(startTime);
      this.$store.state.nowTimeVal=[startTime,endTime];
      this.$store.commit(types.MYDATEPICKER);
    },
    startAutoRefresh(){//根据选择的刷新间隔，开启自动刷新
      var _this=this;
      var cT;
      let startTime=new Date();
      if(_this.value=="last1hour"){
        startTime=startTime.getTime() - 3600*1000;
      }else if(_this.value=="last3hour"){
        startTime=startTime.getTime() - 3600*3*1000;
      }else if(_this.value=="last1day"){
        startTime=startTime.getTime()-3600 * 1000 * 24 * 1;
      }else if(_this.value=="last1week"){
        startTime=startTime.getTime()-3600 * 1000 * 24 * 7;
      }else{
        startTime=startTime.getTime()-3600 * 1000 * 24 * 30;
      }
      startTime=new Date(startTime);
      _this.$store.state.refreshTimeout=setTimeout(function(){
        _this.$store.state.refreshFalg=true;
        cT =new Date().getTime();
        // console.log(new Date(cT),_this.intervalTime);
        _this.$store.state.nowTimeVal=[startTime,new Date(cT)];
        _this.startAutoRefresh();//重复调用
        _this.$store.commit(types.MYDATEPICKER);
      },_this.autoRrefreshVal)
    },
    setMyTime(val){
      var _this = this;
      _this.$store.state.refreshFalg=false;
      var oldTime = val[0];
      var newTime = val[1];
      var currentTime = new Date().getTime();
      var newTimeT=new Date(newTime).getTime();
      var minusNum = newTime - oldTime;
      // if(minusNum>24*60*60*1000*30*3){
      //   val[1]=oldTime.getTime()+24*60*60*1000*30*3;
      //   _this.$message.error('选择时间间隔不能超过3个月');
      // }
      _this.intervalTime=minusNum;
      _this.autoRrefreshVal=0;//时间范围改变，关闭自动刷新
      
      if((minusNum==3600000 && (currentTime-newTimeT<1000) && (currentTime-newTimeT>=0)) || (minusNum==1*24*60*60*1000 && (currentTime-newTimeT<1000) && (currentTime-newTimeT>=0)) || (minusNum==7*24*60*60*1000 && (currentTime-newTimeT<1000) && (currentTime-newTimeT>=0)) || (minusNum==30*24*60*60*1000 && (currentTime-newTimeT<1000) && (currentTime-newTimeT>=0)) || (minusNum==3*30*24*60*60*1000 && (currentTime-newTimeT<1000) && (currentTime-newTimeT>=0))){
        _this.$store.state.refreshAble=false;//自动刷新图表针对于最近时间 最近一小时 最近一天 ，最近三个月，最近一年等等有效，不禁用
      }else{
        _this.$store.state.refreshAble=true;//对具体时间段无效（过去的某一个时间段数据是不会改变了的）禁用自动刷新
        clearTimeout(_this.$store.state.refreshTimeout);
      }
      
      _this.$store.commit(types.MYDATEPICKER);
    }
  },
  beforeRouteLeave(to,from,next){
    clearTimeout(this.$store.state.refreshTimeout);
    next()
  },
}
</script>
<style>
.date-wrapper {
  display: flex;
  justify-content: space-between;
}
.date-wrapper .el-input__inner {
  background-color:#f1f1f2;
  border: 3px solid #ffffff;
  text-align: end;
}
.date-wrapper .el-range-editor.is-active, .el-range-editor.is-active:hover{
  border-color: #fff;
}
.date-wrapper .el-date-editor .el-range__icon{
  line-height: 28px;
}
.date-wrapper .el-date-editor .el-range-input{
  background:#f1f1f2;
}
.date-wrapper .el-date-editor .el-range-separator{
  line-height: 28px;
}

/*自动刷新*/
.autoRefreshBox{
  position: relative;
  width: 85px;
}
.autoRefreshBox .el-select .el-input.is-focus .el-input__inner{
  border-color: #fff;
}
.autoRefreshBox .el-select .el-input__inner:focus{
  border-color: #fff;
}
.atRefImg{
  position: absolute;
  top: 13px;
  left: 12px;
  width: 14px;
  height: 14px;
  z-index: 1;
}
</style>
