<template>
  <div class="dataTable-wrapper">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-form :model="dataTableForm" :rules="dataTableFormRules" ref="dataTableForm" label-width="120px">
          <div class="form-bg">
            <p class="chartformTitle">Metric</p>
             <el-form-item label="Aggregation" prop="aggregationM">
              <el-select v-model="dataTableForm.aggregationM" style="width:60%">
                <el-option v-for="item in aggregationMOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>

            <!-- <div v-for="(items,index) in dataTableForm.dataTableMetric" class="addItemBox" :key="index">
              <span class="delItemStyle" @click="deleteItem('metric',index)"><i class="el-icon-close"></i></span>
              <el-form-item label="Aggregation" :prop="'dataTableMetric.' + index + '.aggregationM'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
                <el-select v-model="items.aggregationM" style="width:60%" @change="aggregationMchange(index)">
                  <el-option v-for="item in aggregationMOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Field" :prop="'dataTableMetric.' + index + '.fieldM'" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]" v-if="items.aggregationM && items.aggregationM!='count'">
                <el-select v-model="items.fieldM" style="width:70%" @visible-change="fieldMchange($event,items.aggregationM)">
                  <el-option v-for="(item,i) in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="i" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <span class="addItemStyle" @click="addItem('metric')" title="增加更多Y-Axis"><i class="el-icon-circle-plus-outline"></i></span> -->
          </div>

          <div class="form-bg">
            <p class="chartformTitle">Split Rows</p>
            <div v-for="(items,index) in dataTableForm.dataTableSpr" class="addItemBox" :key="index">
              <span class="delItemStyle" @click="deleteItem('splitRows',index)"><i class="el-icon-close"></i></span>
              <el-form-item label="Aggregation" :prop="'dataTableSpr.' + index + '.aggregationSpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                <el-select v-model="items.aggregationSpr" style="width:60%" @change="aggregationSprChange(items.aggregationSpr,index)">
                  <el-option v-for="(item,i) in aggregationSprOptions" :label="item.label" :value="item.value" :key="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Field" :prop="'dataTableSpr.' + index + '.fieldSpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]" v-if="items.aggregationSpr"> 
                <el-select v-model="items.fieldSpr" style="width:70%" @visible-change="fieldSprChange($event,items.aggregationSpr)">
                  <el-option v-for="item in $store.state.fieldYOptions" :label="item.value" :value="item.value" :key="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="items.aggregationSpr=='date_histogram'">
                <el-form-item label="Interval" :prop="'dataTableSpr.' + index + '.intervalNumSpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.required'), trigger: 'change'}]">
                  <el-input v-model.trim="items.intervalNumSpr" :placeholder="$t('lg.interval')" style="width:45%" :disabled="items.intervalLimitAble"></el-input>
                  <el-select v-model="items.intervalUnitSpr" :placeholder="$t('lg.select')" style="width:35%" @change="intervalLimit(items.intervalUnitSpr,index)">
                    <el-option
                      v-for="item in intervalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div v-if="items.aggregationSpr=='terms'">  
                <el-form-item label="Order By" :prop="'dataTableSpr.' + index + '.orderBySpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                  <el-select v-model="items.orderBySpr" :placeholder="$t('lg.select')" style="width:60%">
                    <el-option
                      v-for="item in orderByOptions"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Size" :prop="'dataTableSpr.' + index + '.sizeSpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: '必须为正整数数值', trigger: 'change'}]">
                  <el-input v-model.trim="items.sizeSpr" placeholder="size" style="width:45%"></el-input>
                </el-form-item>
                <el-form-item label="Order" :prop="'dataTableSpr.' + index + '.orderSpr'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'}]">
                  <el-select v-model="items.orderSpr" :placeholder="$t('lg.select')" style="width:60%">
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
            <span class="addItemStyle" @click="addItem('splitRows')" :title="$t('lg.required')"><i class="el-icon-circle-plus-outline"></i></span>
          </div>
          <div class="form-bg">
            <el-button size="small" type="primary" icon="fa fa-play" @click="getDataTableData"> {{$t('lg.generateview')}}</el-button>
            <el-button size="small" type="success" icon="fa fa-cloud" @click="showSetChart"> {{$t('lg.saverecord')}}</el-button>
          </div>
        </el-form>
      </el-col> 
      <el-col :span="16">
        <div class="chartBox">
          <data-tab-pic :isShow="myChartFlag" :itemParams="itemParams" :isDataTable="true" v-on:changeFlag='fatherChange'></data-tab-pic>
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
          <el-button size="small" type="primary" @click="setDataTableData"> {{$t('lg.yes')}}</el-button>
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
import dataTabPic from '@/components/dataVisualization/dataTabPic';
export default {
  data(){
    return{
      aggregationMOptions:[{
        value:'count',
        label:'Count'
      },
      // {
      //    value:'avg',
      //    label:'Average'
      // },{
      //    value:'sum',
      //    label:'Sum'
      // },{
      //    value:'min',
      //    label:'Min'
      // },{
      //    value:'max',
      //    label:'Max'
      // },{
      //    value:'cardinality',
      //    label:'Unique Count'
      // }
      ],

      aggregationSprOptions:[{
        value:'date_histogram',
        label:'Date Histogram'
      },{
        value:'terms',
        label:'Terms'
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

      dataTableForm:{
        // dataTableMetric:[{
        //   aggregationM:'',
        //   fieldM:''
        // }],

        aggregationM:'count',

        dataTableSpr:[{
          aggregationSpr:'',
          // fieldSpr:'',

          // intervalNumSpr:'500',
          // intervalUnitSpr:'s',
          // intervalLimitAble:false,

          // orderBySpr:'metric:Count',
          // sizeSpr:'5',
          // orderSpr:'desc'
        }],
      },
      dataTableFormRules:{
        aggregationM:[
          {required:true, message:this.$t('lg.rquired'), trigger:'blur'}
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
    addItem(type){
      if(type=='metric'){
        this.dataTableForm.dataTableMetric.push({
          aggregationM:'',
          fieldM:''
        })
      }else if(type=='splitRows'){
        this.dataTableForm.dataTableSpr.push({
          aggregationSpr:''
        })
      }
    },
    deleteItem(type,index){
      if(type=="metric"){
        if(this.dataTableForm.dataTableMetric.length==1){
          return;
        }
        this.dataTableForm.dataTableMetric.splice(index,1);
      }else if(type=='splitRows'){
        if(this.dataTableForm.dataTableSpr.length==1){
          return;
        }
        this.dataTableForm.dataTableSpr.splice(index,1);
      }
    },
    aggregationMchange(index){
      this.dataTableForm.dataTableMetric[index].fieldM="";
    },
    fieldMchange(callback,item){
      // if(callback){
      //   console.log(item)
        this.$store.commit(types.GETFIELDOPTIONS,item);
      // }
    },
    aggregationSprChange(item,index){
      if(item=="date_histogram"){
        // this.dataTableForm.dataTableSpr[index].fieldSpr="@timestamp";//不会触发select视图更新
        this.$set(this.dataTableForm.dataTableSpr[index],"fieldSpr","@timestamp");
        this.dataTableForm.dataTableSpr[index].intervalNumSpr="500";
        this.dataTableForm.dataTableSpr[index].intervalLimitAble=false;
        // this.dataTableForm.dataTableSpr[index].intervalUnitSpr="h";//不会触发select视图更新
        this.$set(this.dataTableForm.dataTableSpr[index],"intervalUnitSpr","s")
      }else{
        // this.dataTableForm.dataTableSpr[index].fieldSpr="";//不会触发select视图更新
        this.$set(this.dataTableForm.dataTableSpr[index],"fieldSpr","");
        this.dataTableForm.dataTableSpr[index].orderBySpr="metric:Count";
        this.dataTableForm.dataTableSpr[index].sizeSpr="5";
        // this.dataTableForm.dataTableSpr[index].orderSpr="desc";//不会触发select视图更新
        this.$set(this.dataTableForm.dataTableSpr[index],"orderSpr","desc")
      }
    },
    fieldSprChange(callback,item){
      // if(callback){
        this.$store.commit(types.GETFIELDOPTIONS,item);
      // }
    },
    intervalLimit(val,index){
      if(val=="w" || val=="M" || val=="y"){//周，年，月，数值只能为1
        this.dataTableForm.dataTableSpr[index].intervalNumSpr="1";
        this.dataTableForm.dataTableSpr[index].intervalLimitAble=true;
      }else{
        this.dataTableForm.dataTableSpr[index].intervalLimitAble=false;
      }
    },
    getDataTableData(){
      this.$refs['dataTableForm'].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.tableHead=[];//清空
          _this.tableBody=[];
          _this.chartLoadingShow = true;
          const url = SERVER_API_URL+"dp/es/datachart/process"; 
          const sttime=_this.$store.state.mydatedata.starttime,
                edtime=_this.$store.state.mydatedata.endtime;
          const fromTime=sttime.getTime(),
                endTime=edtime.getTime();
          // console.log(_this.dataTableForm.dataTableSpr);
          const dataTableSprArray = _this.dataTableForm.dataTableSpr;
          let aggsArray=[];
          dataTableSprArray.forEach(element=>{
            if(element.aggregationSpr=='date_histogram'){
              aggsArray.push({
                agg:"date_histogram",
                field:'@timestamp',
                interval:element.intervalNumSpr+element.intervalUnitSpr,
                min_doc_count:1
              })
            }else if(element.aggregationSpr=='terms'){
              aggsArray.push({
                agg:element.aggregationSpr,
                field:element.fieldSpr,
                size:element.sizeSpr,
                order:{
                  _count:element.orderSpr
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
    fatherChange(){//阀值变为false
      this.myChartFlag=false;
    },
    //保存记录
    showSetChart(){//打开弹框
      this.$refs['dataTableForm'].validate((valid) => {
        if (valid) {
          this.isSetChartShow=true;
        }
      })
    },
    setChartClose(){//关闭弹框
      this.isSetChartShow=false;
      this.$refs['setChartForm'].resetFields();
    },
    setDataTableData(){//保存记录
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
          // console.log(_this.dataTableForm.dataTableSpr);
          const dataTableSprArray = _this.dataTableForm.dataTableSpr;
          let aggsArray=[];
          dataTableSprArray.forEach(element=>{
            if(element.aggregationSpr=='date_histogram'){
              aggsArray.push({
                agg:"date_histogram",
                field:'@timestamp',
                interval:element.intervalNumSpr+element.intervalUnitSpr,
                min_doc_count:1
              })
            }else if(element.aggregationSpr=='terms'){
              aggsArray.push({
                agg:element.aggregationSpr,
                field:element.fieldSpr,
                size:element.sizeSpr,
                order:{
                  _count:element.orderSpr
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
            chartType:'dataTable',
            description:_this.setChartForm.describeTxt,
            params:params,
            title:'dataTable'
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
    dataTabPic
  }
}
</script>

<style scoped>
.dataTable-wrapper{
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
