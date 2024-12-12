<template>
  <div class="lineChart-wrapper">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form :model="areaChartForm" :rules="areaChartFormRules" ref="areaChartForm" label-width="120px">
          <div class="form-bg">
            <p class="chartformTitle">X-Axis</p>
            <el-form-item label="Aggregation" prop="aggregationX">
              <el-select v-model="areaChartForm.aggregationX" style="width:60%">
                <el-option v-for="item in aggregationXOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Field" prop="fieldX" v-if="areaChartForm.aggregationX">
              <el-select v-model="areaChartForm.fieldX" style="width:70%">
                <el-option v-for="item in fieldXOptions" :label="item.value" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="areaChartForm.aggregationX=='date_histogram'">
              <el-form-item label="Interval" prop="intervalNumX">
                <el-input v-model.trim="areaChartForm.intervalNumX" :placeholder="$t('lg.interval')" style="width:45%" :disabled="areaChartForm.intervalLimitAble"></el-input>
                <el-select v-model="areaChartForm.intervalUnitX" :placeholder="$t('lg.select')" style="width:35%" @change="intervalLimit(areaChartForm.intervalUnitX)">
                <el-option
                  v-for="item in intervalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- <div v-if="areaChartForm.aggregationX=='terms'">  
              <el-form-item label="Order By" prop="orderByX">
                <el-select v-model="areaChartForm.orderByX" placeholder="请选择" style="width:60%">
                  <el-option
                      v-for="item in orderByOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Size" prop="sizeX">
                <el-input v-model.trim="areaChartForm.sizeX" placeholder="size" style="width:45%"></el-input>
              </el-form-item>
              <el-form-item label="Order" prop="orderX">
                <el-select v-model="areaChartForm.orderX" placeholder="请选择" style="width:60%">
                  <el-option
                    v-for="item in orderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div> -->

          </div>
          <div class="form-bg">
            <p class="chartformTitle">Y-Axis</p>
            <div v-for="(items,index) in areaChartForm.areaChartYAxis" class="addItemBox" :key="index">
              <span class="delItemStyle" @click="deleteItem(index)"><i class="el-icon-close"></i></span>
              <el-form-item label="Aggregation" :prop="'areaChartYAxis.' + index + '.aggregationY'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                <el-select v-model="items.aggregationY" style="width:60%" @change="aggregationYchange(index)">
                  <el-option v-for="item in aggregationYOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Field" :prop="'areaChartYAxis.' + index + '.fieldY'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]" v-if="items.aggregationY && items.aggregationY!='count'">
                <el-select v-model="items.fieldY" style="width:70%"  @visible-change="fieldYchange($event,items.aggregationY)">
                  <el-option v-for="(item,i) in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="i" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <span class="addItemStyle" @click="addItem" :title="$t('lg.addmoreyaxis')"><i class="el-icon-circle-plus-outline"></i></span>
          </div>
          <div class="form-bg">
            <el-button size="small" type="primary" icon="fa fa-play" @click="getAreaChartData"> {{$t('lg.generateview')}}</el-button>
            <el-button size="small" type="success" icon="fa fa-cloud" @click="showSetChart"> {{$t('lg.saverecord')}}</el-button>
          </div>
        </el-form>
      </el-col> 
      <el-col :span="16">
        <div class="chartBox">
          <area-pic :isShow="myChartFlag" :itemParams="itemParams" :isAreaChart="true" v-on:changeFlag='fatherChange'></area-pic>
        </div>
        <router-link to="/chartMenu"><el-button size="small" type="info" class="backBtn el-icon-back" plain> {{$t('lg.back')}}</el-button></router-link>
      </el-col> 
    </el-row>  
    <el-dialog :title="$t('lg.saveviewrecord')" :visible.sync="isSetChartShow" width="45%" :before-close="setChartClose"><!--保存记录-->
      <el-form :model="setChartForm" :rules="setChartFormRules" ref="setChartForm" label-width="80px">
        <el-form-item :label="$t('lg.viewdesc')" prop="describeTxt">
          <el-input v-model.trim="setChartForm.describeTxt" :placeholder="$t('lg.description')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="setAreaChartData"> {{$t('lg.yes')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="setChartLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
import loading from '@/components/loading/loading';
//视图组件
import areaPic from '@/components/dataVisualization/areaPic';
export default {
  data(){
    return{
      aggregationXOptions:[{
        value:'date_histogram',
        label:'Date Histogram'
      }
      // ,{
      //   value:'terms',
      //   label:'Terms'
      // }
      ],

      aggregationYOptions:[{
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

      fieldXOptions:[{
        value:'Data',
        disabled: true
      },{
        value:'@timestamp'
      }],

      // fieldYOptions:[{
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
        label:this.$t('lg.week')
      },{
        value:'M',
        label:this.$t('lg.month')
      },{
        value:'y',
        label:this.$t('lg.year')
      }],
      
      orderByOptions:[{
        value:'metric:Count'
      }],
      orderOptions:[{
        value:'desc',
        label:'Descending'
      },{
        value:'asc',
        label:'Ascending'
      }],

      areaChartForm:{
        aggregationX:'date_histogram',
        fieldX:'@timestamp',
        intervalNumX:'500',
        intervalUnitX:'s',
        intervalLimitAble:false,
        orderByX:'metric:Count',
        sizeX:'5',
        orderX:'desc',

        areaChartYAxis:[{
          aggregationY:'',
          fieldY:''
        }],
      },
      areaChartFormRules:{
        aggregationX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        fieldX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        intervalNumX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        orderByX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        sizeX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        orderX:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
      },

      //保存记录
      isSetChartShow:false,//保存记录弹框显隐
      setChartForm:{
        describeTxt:''
      },
      setChartFormRules:{
        describeTxt:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      },
      setChartLoading:false,

      //图例 （传入子组件）
      myChartFlag:false,//设置一个阀值，作为isShow传入子组件，点击‘生成视图’按钮以及调用fatherChange()事件触发子组件isShow变动，才能在子组件内触发作图（chartHistory.vue里面是根据弹框显示隐藏来改变isShow，这里没有弹框的显隐）。
      itemParams:{},//存储视图参数传给areaPic子组件
    }
  },
  methods:{
    intervalLimit(val){
      if(val=='w' || val=="M" || val=="y"){//周，年，月，数值只能为1
        this.areaChartForm.intervalLimitAble=true;
        this.areaChartForm.intervalNumX=1;
      }else{
        this.areaChartForm.intervalLimitAble=false;
      }
    },
    addItem(){
      this.areaChartForm.areaChartYAxis.push({
        aggregationY:'',
        fieldY:''
      })
    },
    deleteItem(index){
      if(this.areaChartForm.areaChartYAxis.length==1){
        return;
      }
      this.areaChartForm.areaChartYAxis.splice(index,1);
    },
    aggregationYchange(index){
      this.areaChartForm.areaChartYAxis[index].fieldY="";
    },
    fieldYchange(callback,item){
      // if(callback){
        this.$store.commit(types.GETFIELDOPTIONS,item);
      // }
    },
    getAreaChartData(){
      this.$refs['areaChartForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          const url = SERVER_API_URL+"dp/es/datachart/process"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();
          const yAxixArray = _this.areaChartForm.areaChartYAxis;
          let paramsYArry = [];
          yAxixArray.forEach(element => {
            if(element.aggregationY!='count'){
              paramsYArry.push({
                agg:element.aggregationY,
                field:element.fieldY
              })
            }else{
              paramsYArry.push({
                agg:element.aggregationY,
              })
            }
          });
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            x:{
              agg:_this.areaChartForm.aggregationX,
              field:_this.areaChartForm.fieldX,
              interval:_this.areaChartForm.intervalNumX+_this.areaChartForm.intervalUnitX,
              min_doc_count:1
            },
            y:paramsYArry
          };
          _this.myChartFlag=true;
          _this.itemParams=params;//传入子组件
        }
      })
    },
    fatherChange(){//阀值变为false
      this.myChartFlag=false;
    },
    //保存记录
    showSetChart(){//打开弹框
      this.$refs['areaChartForm'].validate((valid) => {
        if (valid) {
          this.isSetChartShow=true;
        }
      })
    },
    setChartClose(){//关闭弹框
      this.isSetChartShow=false;
      this.$refs['setChartForm'].resetFields();
    },
    setAreaChartData(){//保存记录确认
    var _this=this;
      this.$refs['setChartForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.setChartLoading=true;
          const url = SERVER_API_URL+"dp/es/datachart"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();
          const yAxixArray = _this.areaChartForm.areaChartYAxis;
          let paramsYArry = [];
          yAxixArray.forEach(element => {
            if(element.aggregationY!='count'){
              paramsYArry.push({
                agg:element.aggregationY,
                field:element.fieldY
              })
            }else{
              paramsYArry.push({
                agg:element.aggregationY,
              })
            }
          });
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            x:{
              agg:_this.areaChartForm.aggregationX,
              field:_this.areaChartForm.fieldX,
              interval:_this.areaChartForm.intervalNumX+_this.areaChartForm.intervalUnitX,
              min_doc_count:1
            },
            y:paramsYArry
          };
          axios.post(url,{
            chartType:'areaChart',
            description:_this.setChartForm.describeTxt,
            params:params,
            title:'areaChart'
          }).then(res=>{
            console.log(res);
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.setChartLoading=false;
              _this.setChartClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
              _this.setChartLoading=false;
            }
          }).catch(err=>{
            console.log(err);
          })
        }
      })
    }
  },
  components:{
    loading,
    areaPic
  }
}
</script>

<style scoped>
.lineChart-wrapper{
  position:absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.chartformTitle{
  line-height: 30px;
  margin-bottom: 20px;
}
/*多个y轴值 begain*/
.addItemBox{
  border: 1px dashed #ccc;
  padding: 20px 0px 0px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.addItemStyle{
  float: right;
  margin-top: -10px;
  cursor: pointer;
}
.delItemStyle{
  float: right;
  margin-top: -15px;
  cursor: pointer;
  margin-right: 5px;
}
/*多个y轴值 end*/
.chartBox{
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  background: #f7f7f7;
  margin-bottom: 20px;
  position: relative;
}
.backBtn{
  float: right;
}
</style>
