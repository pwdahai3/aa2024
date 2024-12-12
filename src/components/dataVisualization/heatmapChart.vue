<template>
  <div class="heatmapChart-wrapper">
    <el-row :gutter="10"> 
      <el-col :span="8">
        <el-form :model="heatmapChartForm" :rules="heatmapChartFormRules" ref="heatmapChartForm" label-width="120px">
          <div class="form-bg">
            <p class="chartformTitle">X-Axis</p>
            <el-form-item label="Aggregation" prop="aggregationX">
              <el-select v-model="heatmapChartForm.aggregationX" style="width:60%">
                <el-option v-for="item in aggregationXOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Field" prop="fieldX" v-if="heatmapChartForm.aggregationX">
              <el-select v-model="heatmapChartForm.fieldX" style="width:70%">
                <el-option v-for="item in fieldXOptions" :label="item.value" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
            
            <div v-if="heatmapChartForm.aggregationX=='date_histogram'">
              <el-form-item label="Interval" prop="intervalNumX">
                <el-input v-model.trim="heatmapChartForm.intervalNumX" :placeholder="$t('lg.interval')" style="width:45%" :disabled="heatmapChartForm.intervalLimitAble"></el-input>
                <el-select v-model="heatmapChartForm.intervalUnitX" :placeholder="$t('lg.select')" style="width:35%" @change="intervalLimit(heatmapChartForm.intervalUnitX)">
                <el-option
                  v-for="item in intervalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
                </el-select>
              </el-form-item>
            </div>

            <!-- <div v-if="heatmapChartForm.aggregationX=='terms'">  
              <el-form-item label="Order By" prop="orderByX">
                <el-select v-model="heatmapChartForm.orderByX" placeholder="请选择" style="width:60%">
                  <el-option
                      v-for="item in orderByOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Size" prop="sizeX">
                <el-input v-model.trim="heatmapChartForm.sizeX" placeholder="size" style="width:60%"></el-input>
              </el-form-item>
              <el-form-item label="Order" prop="orderX">
                <el-select v-model="heatmapChartForm.orderX" placeholder="请选择" style="width:60%">
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
            <el-form-item label="Aggregation" prop="aggregationY">
              <el-select v-model="heatmapChartForm.aggregationY" style="width:60%" @change="aggregationYchange(heatmapChartForm.aggregationY)">
                <el-option v-for="item in aggregationYOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Field" prop="fieldY" v-if="heatmapChartForm.aggregationY">
              <el-select v-model="heatmapChartForm.fieldY" style="width:70%">
                <el-option v-for="(item,i) in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="i" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>

            <!-- <div v-if="heatmapChartForm.aggregationY=='date_histogram'">
              <el-form-item label="Interval" prop="intervalNumY">
                <el-input v-model.trim="heatmapChartForm.intervalNumY" placeholder="时间间隔" style="width:60%"></el-input>
                <el-select v-model="heatmapChartForm.intervalUnitY" placeholder="请选择" style="width:20%">
                  <el-option
                    v-for="item in intervalOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div> -->

            <div v-if="heatmapChartForm.aggregationY=='terms'">
              <el-form-item label="Order By" prop="orderByY">
                <el-select v-model="heatmapChartForm.orderByY" :placeholder="$t('lg.select')" style="width:60%">
                  <el-option
                    v-for="item in orderByOptions"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Size" prop="sizeY">
                <el-input v-model.trim="heatmapChartForm.sizeY" placeholder="size" style="width:45%"></el-input>
              </el-form-item>
              <el-form-item label="Order" prop="orderY">
                <el-select v-model="heatmapChartForm.orderY" :placeholder="$t('lg.select')" style="width:60%">
                  <el-option
                    v-for="item in orderOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="form-bg">
            <el-button size="small" type="primary" icon="fa fa-play" @click="getHeatmapChartData"> {{$t('lg.generateview')}}</el-button>
            <el-button size="small" type="success" icon="fa fa-cloud" @click="showSetChart"> {{$t('lg.saverecord')}}</el-button>
          </div>
        </el-form>
      </el-col>
      <el-col :span="16">
        <div class="chartBox">
          <heatmap-pic :isShow="myChartFlag" :itemParams="itemParams" :isHeatmapChart="true" v-on:changeFlag='fatherChange'></heatmap-pic>
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
          <el-button size="small" type="primary" @click="setHeatmapChartData"> {{$t('lg.yes')}}</el-button>
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
import heatmapPic from '@/components/dataVisualization/heatmapPic';
export default {  
  data(){
    return{
      // aggregationOptions:[{
      //   value:'date_histogram',
      //   label:'Date Histogram'
      // },{
      //   value:'terms',
      //   label:'Terms'
      // }],

      aggregationXOptions:[{
        value:'date_histogram',
        label:'Date Histogram'
      }],

      aggregationYOptions:[{
        value:'terms',
        label:'Terms'
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

      heatmapChartForm:{
        aggregationX:'date_histogram',
        fieldX:'@timestamp',
        intervalNumX:'500',
        intervalUnitX:'s',
        intervalLimitAble:false,
        // orderByX:'metric:Count',
        // sizeX:'',
        // orderX:'desc',

        aggregationY:'',
        fieldY:'',
        // intervalNumY:'',
        // intervalUnitY:'s',
        orderByY:'metric:Count',
        sizeY:'5',
        orderY:'desc'
      },
      
      heatmapChartFormRules:{
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
        // orderByX:[
        //   {required:true, message:'不能为空', trigger:'blur'}
        // ],
        // sizeX:[
        //   {required:true, message:'不能为空', trigger:'blur'},
        //   {pattern:/^[0-9]+$/,message: '必须为正整数数值', trigger: 'change'}
        // ],
        // orderX:[
        //   {required:true, message:'不能为空', trigger:'blur'}
        // ],

        aggregationY:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        fieldY:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        // intervalNumY:[
        //   {required:true, message:'不能为空', trigger:'blur'},
        //   {pattern:/^[0-9]+$/,message: '必须为正整数数值', trigger: 'change'}
        // ],
        orderByY:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
        sizeY:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        orderY:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
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
      itemParams:{},//存储视图参数传给heatmapPic子组件
    }
  },
  methods:{
    aggregationYchange(item){
      this.heatmapChartForm.fieldY='';
      this.$store.commit(types.GETFIELDOPTIONS,item);
    },
    intervalLimit(val){
      if(val=="w" || val=="M" || val=="y"){//周，年，月，数值只能为1
        this.heatmapChartForm.intervalLimitAble=true;
        this.heatmapChartForm.intervalNumX=1;
      }else{
        this.heatmapChartForm.intervalLimitAble=false;
      }
    },
    getHeatmapChartData(){
      this.$refs['heatmapChartForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.chartLoadingShow=true;
          _this.xAxisData=[];//清空
          _this.yAxisData=[];
          _this.myChartData=[];
          const url = SERVER_API_URL+"dp/es/datachart/process"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            x:{
              agg:_this.heatmapChartForm.aggregationX,
              field:_this.heatmapChartForm.fieldX,
              interval:_this.heatmapChartForm.intervalNumX+_this.heatmapChartForm.intervalUnitX,
              min_doc_count:1
            },
            y:[{
              agg:_this.heatmapChartForm.aggregationY,
              field:_this.heatmapChartForm.fieldY,
              size:_this.heatmapChartForm.sizeY,
              order:{
                _count:_this.heatmapChartForm.orderY
              }
            }]
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
      this.$refs['heatmapChartForm'].validate((valid) => {
        if (valid) {
          this.isSetChartShow=true;
        }
      })
    },
    setChartClose(){//关闭弹框
      this.isSetChartShow=false;
      this.$refs['setChartForm'].resetFields();
    },
    setHeatmapChartData(){//保存记录确认
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
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            x:{
              agg:_this.heatmapChartForm.aggregationX,
              field:_this.heatmapChartForm.fieldX,
              interval:_this.heatmapChartForm.intervalNumX+_this.heatmapChartForm.intervalUnitX,
              min_doc_count:1
            },
            y:[{
              agg:_this.heatmapChartForm.aggregationY,
              field:_this.heatmapChartForm.fieldY,
              size:_this.heatmapChartForm.sizeY,
              order:{
                _count:_this.heatmapChartForm.orderY
              }
            }]
          };
          axios.post(url,{
            chartType:'heatmapChart',
            description:_this.setChartForm.describeTxt,
            params:params,
            title:'heatmapChart'
          }).then(res=>{
            if(res.data.responseCode==0){
              console.log(res.data.data);
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
    heatmapPic
  }
}
</script>

<style scoped>
.heatmapChart-wrapper{
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
.chartBox{
  width: 100%;
  height: 100%;
  padding: 20px 0;
  box-sizing: border-box;
  background: #f7f7f7;
  margin-bottom: 20px;
  position: relative;
}
.backBtn{
  float: right;
}
</style>
