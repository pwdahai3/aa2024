<template>
  <div class="lineChart-wrapper">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form :model="pieChartForm" :rules="pieChartFormRules" ref="pieChartForm" label-width="120px">
          <div class="form-bg">
            <p class="chartformTitle">Slice Size</p>
            <el-form-item label="Aggregation" prop="aggregationSls">
              <el-select v-model="pieChartForm.aggregationSls" style="width:60%">
                <el-option v-for="item in aggregationSlsOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="Field" prop="fieldSls" v-if=" pieChartForm.aggregationSls && pieChartForm.aggregationSls!='count'">
              <el-select v-model="pieChartForm.fieldSls" style="width:70%">
                <el-option v-for="item in fieldSlsOptions" :label="item.value" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <div v-if="pieChartForm.aggregationSls=='Top Hit'">
              <el-form-item label="Aggregation With" prop="aggregationWithSls">
                <el-select v-model="pieChartForm.aggregationWithSls" placeholder="请选择" style="width:60%">
                  <el-option
                      v-for="item in aggregationWithSlsOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Size" prop="sizeSls">
                <el-input v-model.trim="pieChartForm.sizeSls" placeholder="size" style="width:45%"></el-input>
              </el-form-item>
              <el-form-item label="Sort On" prop="sortOnSls">
                <el-select v-model="pieChartForm.sortOnSls" placeholder="请选择" style="width:60%">
                  <el-option
                      v-for="item in sortOnSlsOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Order" prop="orderSls">
                <el-select v-model="pieChartForm.orderSls" placeholder="请选择" style="width:60%">
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
            <p class="chartformTitle">Split Slice</p>
            <div v-for="(items,index) in pieChartForm.pieChartSps" class="addItemBox" :key="index">
              <span class="delItemStyle" @click="deleteItem(index)"><i class="el-icon-close"></i></span>
              <el-form-item label="Aggregation" :prop="'pieChartSps.' + index + '.aggregationSps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                <el-select v-model="items.aggregationSps" style="width:60%" @change="aggregationSpsChange(items.aggregationSps,index)">
                  <el-option v-for="(item,i) in aggregationSpsOptions" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Field" :prop="'pieChartSps.' + index + '.fieldSps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]" v-if="items.aggregationSps"> 
                <el-select v-model="items.fieldSps" style="width:70%" @visible-change="fieldSpsChange($event,items.aggregationSps)">
                  <el-option v-for="item in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="items.aggregationSps=='date_histogram'">
                <el-form-item label="Interval" :prop="'pieChartSps.' + index + '.intervalNumSps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
                  <el-input v-model.trim="items.intervalNumSps" :placeholder="$t('lg.interval')" style="width:45%" :disabled="items.intervalLimitAble"></el-input>
                  <el-select v-model="items.intervalUnitSps" :placeholder="$t('lg.select')" style="width:35%" @change="intervalLimit(items.intervalUnitSps,index)">
                    <el-option
                      v-for="item in intervalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div v-if="items.aggregationSps=='terms'">  
                <el-form-item label="Order By" :prop="'pieChartSps.' + index + '.orderBySps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                  <el-select v-model="items.orderBySps" :placeholder="$t('lg.select')" style="width:60%">
                    <el-option
                      v-for="item in orderByOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Size" :prop="'pieChartSps.' + index + '.sizeSps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
                  <el-input v-model.trim="items.sizeSps" placeholder="size" style="width:45%"></el-input>
                </el-form-item>
                <el-form-item label="Order" :prop="'pieChartSps.' + index + '.orderSps'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                  <el-select v-model="items.orderSps" :placeholder="$t('lg.interval')" style="width:60%">
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
            <span class="addItemStyle" @click="addItem" :title="$t('lg.addmoreyaxis')"><i class="el-icon-circle-plus-outline"></i></span>
          </div>
          <div class="form-bg">
            <el-button size="small" type="primary" icon="fa fa-play" @click="getPieChartData"> {{$t('lg.generateview')}}</el-button>
            <el-button size="small" type="success" icon="fa fa-cloud" @click="showSetChart"> {{$t('lg.saverecord')}}</el-button>
          </div>
        </el-form>
      </el-col> 
      <el-col :span="16">
        <div class="chartBox">
          <pie-pic :isShow="myChartFlag" :itemParams="itemParams" :isPieChart="true" v-on:changeFlag='fatherChange'></pie-pic>
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
          <el-button size="small" type="primary" @click="setPieChartData"> {{$t('lg.yes')}}</el-button>
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
import piePic from '@/components/dataVisualization/piePic';
export default {
  data(){
    return{
      aggregationSlsOptions:[{
        value:'count',
        label:'Count'
      },
      // {
      //   value:'sum',
      //   label:'Sum'
      // },{
      //   value:'Unique Count',
      //   label:'Unique Count'
      // },{
      //   value:'Top Hit',
      //   label:'Top Hit'
      // }
      ],

      aggregationSpsOptions:[{
        value:'date_histogram',
        label:'Date Histogram'
      },{
        value:'terms',
        label:'Terms'
      }],

      fieldSlsOptions:[{
        value:'Data',
        disabled: true
      },{
        value:'@timestamp'
      }],

      // fieldSpsOptions:[{
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

      aggregationWithSlsOptions:[{
        value:'Average'
      },{
        value:'Max'
      },{
        value:'Min'
      },{
        value:'Sum'
      }],

      sortOnSlsOptions:[{
        value:'Data',
        disabled: true
      },{
        value:'@timestamp'
      }],

      pieChartForm:{
        aggregationSls:'count',
        // fieldSls:'',
        // aggregationWithSls:'',
        // sizeSls:'5',
        // sortOnSls:'',
        // orderSls:'desc',

        pieChartSps:[{
          aggregationSps:'',
          // fieldSps:'',

          // intervalNumSps:'500',
          // intervalUnitSps:'s',
          // intervalLimitAble:false,

          // orderBySps:'metric:Count',
          // sizeSps:'5',
          // orderSps:'desc'
        }],
      },
      pieChartFormRules:{
        aggregationSls:[
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
      itemParams:{},//存储视图参数传给piePic子组件
    }
  },
  methods:{
    addItem(){
      this.pieChartForm.pieChartSps.push({
        aggregationSps:'',
      })
    },
    deleteItem(index){
      if(this.pieChartForm.pieChartSps.length==1){
        return;
      }
      this.pieChartForm.pieChartSps.splice(index,1);
    },
    aggregationSpsChange(item,index){
      if(item=="date_histogram"){
        // this.pieChartForm.pieChartSps[index].fieldSps="@timestamp";//不会触发select视图更新
        this.$set(this.pieChartForm.pieChartSps[index],"fieldSps","@timestamp");
        this.pieChartForm.pieChartSps[index].intervalNumSps="500";
        this.pieChartForm.pieChartSps[index].intervalLimitAble=false;
        // this.pieChartForm.pieChartSps[index].intervalUnitSps="h";  //不会触发select视图更新 
        this.$set(this.pieChartForm.pieChartSps[index],"intervalUnitSps","s");
      }else{
        // this.pieChartForm.pieChartSps[index].fieldSps="";//不会触发select视图更新
        this.$set(this.pieChartForm.pieChartSps[index],"fieldSps","");
        this.pieChartForm.pieChartSps[index].orderBySps="metric:Count";
        this.pieChartForm.pieChartSps[index].sizeSps="5";
        // this.pieChartForm.pieChartSps[index].orderSps="desc";  //不会触发select视图更新
        this.$set(this.pieChartForm.pieChartSps[index],"orderSps","desc");
      }
    },
    fieldSpsChange(callback,item){
      // if(callback){
        this.$store.commit(types.GETFIELDOPTIONS,item);
      // }
    },
    intervalLimit(val,index){
      if(val=="w" || val=="M" || val=="y"){//周，年，月，数值只能为1
        this.pieChartForm.pieChartSps[index].intervalNumSps="1";
        this.pieChartForm.pieChartSps[index].intervalLimitAble=true;
      }else{
        this.pieChartForm.pieChartSps[index].intervalLimitAble=false;
      }
    },
    getPieChartData(){
      this.$refs['pieChartForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.arrays=[];//!!!清空,不然数据会叠加
          _this.chartLoadingShow=true;
          const url = SERVER_API_URL+"dp/es/datachart/process"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();

          // console.log(_this.pieChartForm.pieChartSps);
          const pieChartSpsArray = _this.pieChartForm.pieChartSps;
          let aggsArray=[];
          pieChartSpsArray.forEach(element=>{
            if(element.aggregationSps=='date_histogram'){
              aggsArray.push({
                agg:"date_histogram",
                field:'@timestamp',
                interval:element.intervalNumSps+element.intervalUnitSps,
                min_doc_count:1
              })
            }else if(element.aggregationSps=='terms'){
              aggsArray.push({
                agg:element.aggregationSps,
                field:element.fieldSps,
                size:element.sizeSps,
                order:{
                  _count:element.orderSps
                }
              })
            }
          })

          // console.log(aggsArray);
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            aggs:aggsArray
          };
          _this.myChartFlag=true;
          _this.itemParams=params;//传入子组件
        }
      })
    },
    fatherChange(){
      this.myChartFlag=false;
    },
    //保存记录
    showSetChart(){//打开弹框
      this.$refs['pieChartForm'].validate((valid) => {
        if (valid) {
          this.isSetChartShow=true;
        }
      })
    },
    setChartClose(){//关闭弹框
      this.isSetChartShow=false;
      this.$refs['setChartForm'].resetFields();
    },
    setPieChartData(){//保存记录
      this.$refs['setChartForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.setChartLoading=true;
          const url = SERVER_API_URL+"dp/es/datachart"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();

          // console.log(_this.pieChartForm.pieChartSps);
          const pieChartSpsArray = _this.pieChartForm.pieChartSps;
          let aggsArray=[];
          pieChartSpsArray.forEach(element=>{
            if(element.aggregationSps=='date_histogram'){
              aggsArray.push({
                agg:"date_histogram",
                field:'@timestamp',
                interval:element.intervalNumSps+element.intervalUnitSps,
                min_doc_count:1
              })
            }else if(element.aggregationSps=='terms'){
              aggsArray.push({
                agg:element.aggregationSps,
                field:element.fieldSps,
                size:element.sizeSps,
                order:{
                  _count:element.orderSps
                }
              })
            }
          })

          // console.log(aggsArray);
          const params = {
            timeRange:{
              from:fromTime,
              to:endTime
            },
            aggs:aggsArray
          };
          axios.post(url,{
            chartType:'pieChart',
            description:_this.setChartForm.describeTxt,
            params:params,
            title:'pieChart'
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
          });
        }
      })
    }
  },
  components:{
    loading,
    piePic
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
/*多个 Split Slice begin*/
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
/*多个 Split Slice end*/
.chartBox{
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  position: relative;
}
.backBtn{
  float: right;
}
</style>
