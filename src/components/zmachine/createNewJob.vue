<template>
  <div>
    <el-dialog :title="editedJobId?'Update Job':'Create New Job'" :visible.sync="isShow" width="45%" :before-close="createNewJobClose">
      <el-form :model="machineJobForm" ref="machineJobForm" :rules="machineJobFormRules" label-width="100px">
        <el-form-item label="Name" prop="jobName">
          <el-input v-model.trim="machineJobForm.jobName" :placeholder="$t('lg.zuoyemigzi')" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="jobDescription">
          <el-input v-model.trim="machineJobForm.jobDescription" :placeholder="$t('lg.mechinejobdesc')" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="Job Tpye" prop="jobType">
          <el-select v-model="machineJobForm.jobType" style="width:30%" >
            <template v-for="item in jobTypeOptions">
              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="Aggregation" prop="jobAgg">
          <el-select v-model="machineJobForm.jobAgg" style="width:30%" @change="jobAggChange()">
            <template v-for="item in jobAggOptions">
              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="Field" prop="jobField" v-if="machineJobForm.jobAgg && machineJobForm.jobAgg!='count'">
          <el-select v-model="machineJobForm.jobField" style="width:30%" @visible-change="jobFieldChange($event,machineJobForm.jobAgg)">
            <el-option v-for="(item,i) in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="i" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Time From" prop="jobTimeFrom">
          <el-date-picker
            v-model="machineJobForm.jobTimeFrom"
            type="datetime"
            :placeholder="$t('lg.selectdate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Time To" prop="jobTimeTo">
          <el-date-picker
            v-model="machineJobForm.jobTimeTo"
            type="datetime"
            :placeholder="$t('lg.selectdate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="Interval" prop="intervalNum">
          <el-input v-model.trim="machineJobForm.intervalNum" placeholder="$t('lg.timeinterval')" style="width:30%" :disabled="machineJobForm.intervalLimitAble"></el-input>
          <el-select v-model="machineJobForm.intervalUnit" placeholder="$t('lg.select')" style="width:30%" @change="intervalLimit(machineJobForm.intervalUnit)">
            <template v-for="item in intervalOptions">
              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createJobEnsure">{{$t('lg.confirm')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="createJobLoading">
        <loading></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import * as types from '@/store/types';
import {SERVER_API_URL} from '@/conf/constvar';
import toSddate from '@/assets/js/tosddate';
import loading from '@/components/loading/loading';
export default {
  props:{
    isShow:{
      type:Boolean
    },
    editData:{//被编辑的对象
      type:Object
    },
    editedJobId:{//编辑的对象的id
      type:String
    }
  },
  data(){
    return{
      createJobLoading:false,
      jobTypeOptions:[{
        value:'time_series',
        label:'time_series'
      }],
      jobAggOptions:[{
        value:'count',
        label:'Count'
      },{
        value:'avg',
        label:'Average'
      },{
        value:'sum',
        label:'Sum'
      },{
        value:'min',
        label:'Min'
      },{
        value:'max',
        label:'Max'
      },{
        value:'cardinality',
        label:'Unique Count'
      }],
      // jobFieldOptions:[{ //fieldYOptions
      //   value:'Data',
      //   disabled: true
      // },{
      //   value:'@timestamp'
      // }],

      intervalOptions:[{
        value:'s',
        label:this.$t('lg.second')
      },{
        value:'m',
        label:this.$t('lg.minite')
      },{
        value:'h',
        label:this.$t('lg.hour')
      },{
        value:'d',
        label:this.$t('lg.day')
      },{
        value:'w',
        label:this.$t('lg.oneweek')
      },{
        value:'M',
        label:this.$t('lg.onemonth')
      },{
        value:'y',
        label:this.$t('lg.oneyear')
      }],
      machineJobForm:{
        jobName:'',
        jobDescription:'',
        jobType:'time_series',
        jobAgg:'',
        jobField:'',
        jobTimeFrom:'',
        jobTimeTo:'',
        intervalNum:'500',
        intervalUnit:'s',
        intervalLimitAble:false,
      },
      machineJobFormRules:{
        jobName:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobDescription:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobType:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobField:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobAgg:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobTimeFrom:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        jobTimeTo:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}
        ],
        intervalNum:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'blur'}
        ],
      }

    }
  },
  watch:{
    "isShow":function(){
      if(this.isShow){
        if(this.editedJobId){
          console.log(this.editData);
          const intervalNum = this.editData.params.interval.match(/(\d*)(\w*)/)[1] - 0,
                intervalUnit = this.editData.params.interval.match(/(\d*)(\w*)/)[2];
          const jobTimeFrom = new Date(this.editData.params.from_ts),
                jobTimeTo=new Date(this.editData.params.to_ts);
          this.machineJobForm.jobName = this.editData.name;
          this.machineJobForm.jobDescription = this.editData.description;
          this.machineJobForm.jobType = this.editData.task_type;
          this.machineJobForm.jobAgg = this.editData.params.agg;
          this.machineJobForm.jobField = this.editData.params.field;
          this.machineJobForm.jobTimeFrom = jobTimeFrom;
          this.machineJobForm.jobTimeTo = jobTimeTo;
          this.machineJobForm.intervalNum = intervalNum;
          this.machineJobForm.intervalUnit = intervalUnit;
          // this.machineJobForm.intervalLimitAble = this.editData.params.aggsId;
        }else{
          this.machineJobForm.jobName = '';
          this.machineJobForm.jobDescription = '';
          this.machineJobForm.jobType = 'time_series';
          this.machineJobForm.jobAgg = '';
          this.machineJobForm.jobField = '';
          this.machineJobForm.jobTimeFrom = '';
          this.machineJobForm.jobTimeTo = '';
          this.machineJobForm.intervalNum = '500';
          this.machineJobForm.intervalUnit = 's';
        }
      }
    }
  },
  methods:{//关闭弹框
    createNewJobClose(){
      this.$refs['machineJobForm'].resetFields();
      this.$emit('createNewJobClose');
    },
    jobAggChange(){
      this.machineJobForm.jobField='';
    },
    jobFieldChange(callback,item){
      // if(callback){
        this.$store.commit(types.GETFIELDOPTIONS,item);
      // }
    },
    intervalLimit(val){//周，年，月，数值只能为1
      if(val=='w' || val=="M" || val=="y"){
        this.machineJobForm.intervalLimitAble=true;
        this.machineJobForm.intervalNum=1;
      }else{
        this.machineJobForm.intervalLimitAble=false;
      }
    },
    createJobEnsure(){//创建job or 修改job
      this.$refs['machineJobForm'].validate((valid)=>{
        if(valid){
          const _this=this;
          _this.createJobLoading=true;
          console.log(_this.machineJobForm.jobTimeFrom);
          console.log(_this.machineJobForm.jobTimeTo);
          const sttime=_this.machineJobForm.jobTimeFrom,
                edtime=_this.machineJobForm.jobTimeTo
          const from_ts=toSddate(sttime),
                to_ts=toSddate(edtime);
          let params={
            time_series:_this.machineJobForm.jobType,
            agg:_this.machineJobForm.jobAgg,
            field:_this.machineJobForm.jobField,
            from_ts:from_ts,
            to_ts:to_ts,
            interval:_this.machineJobForm.intervalNum+_this.machineJobForm.intervalUnit
          };
          if(_this.editedJobId){//修改job
            console.log(55)
            const url=SERVER_API_URL+"ml/job/"+_this.editedJobId;
            axios.patch(url,{
              name:_this.machineJobForm.jobName,
              description:_this.machineJobForm.jobDescription,
              task_type:_this.machineJobForm.jobType,
              params:params,
              status:null,
              last_start_ts:null,
              last_finish_ts:null
            }).then((res)=>{
              console.log(res);
              _this.createNewJobClose();
              _this.createJobLoading=false;
              _this.$emit('getJobListAgain');
            });

          }else{//创建job
            console.log(66)
            const url=SERVER_API_URL+"ml/job";
            axios.post(url,{
              name:_this.machineJobForm.jobName,
              description:_this.machineJobForm.jobDescription,
              task_type:_this.machineJobForm.jobType,
              params:params,
              status:null,
              last_start_ts:null,
              last_finish_ts:null
            }).then((res)=>{
              console.log(res);
              _this.createNewJobClose();
              _this.createJobLoading=false;
              _this.$emit('getJobListAgain');
            });
          }

        }
      })
    },
    
  },
  components:{
    loading
  }
}
</script>