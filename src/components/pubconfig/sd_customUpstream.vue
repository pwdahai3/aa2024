<!--自定义upstream配置-->
<template>
  <div>
    <el-dialog width="55%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdCustUpstrModalClose">
      <div class="custUpstrBox">
        <el-button class="addGIBtn" type="primary" size="mini" @click="addUpstrDialogShow()">{{$t('lg.addupstreampzhi')}}</el-button>
        <h1 class="custUpstrTitle">{{$t('lg.zidingyiups')}}</h1>
        <p class="nodata-box" v-show="custUpstrlist.length==0">{{$t('lg.nodata')}}</p>
        <table class="table-bg" v-show="custUpstrlist.length>0">
          <thead>
            <tr>
              <th>{{$t('lg.upstreamname')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in custUpstrlist">
              <td>{{item.upstream}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editUpstream(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="delUpstream(item.upstream)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading :title="$t('lg.handling')" v-show="custUpstrModalLoading"></loading>
    </el-dialog>

    <el-dialog width="60%" :title="isEditUpstr?shadowObj.name+' ['+shadowObj.snodeId+']':shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isCustUpstrPopShow" :close-on-click-modal="false" :before-close="custUpstrPopClose">
      <el-form ref="custUpstrform" :model="custUpstrform" :rules="custUpstrformRules" :label-width="$store.state.isencn=='en'?'220px':'120px'">
        <el-form-item :label="$t('lg.upstreamname')" prop="upstreamName">
          <el-input v-model.trim="custUpstrform.upstreamName" :placeholder="$t('lg.plzenter')" :disabled="isEditUpstr"></el-input>
        </el-form-item>

        <div style="position: relative;">
          <div class="orderBoxJamb" v-for="(item,index) in custUpstrform.upstreamServers" :key="index" >
            <span class="delIp" @click="delServerBox(index)"><i class="el-icon-close"></i></span>  
            
            <el-form-item label="IP" :prop="'upstreamServers.' + index + '.ip'" :rules="[{required: true, message: $t('lg.required'), trigger: 'blur'},{pattern:/^([\w\-. *!$@?^()<>{}[\]=%&:\;/~+#`,])+$/, message: $t('lg.invalidformat'), trigger: 'blur'}]">
              <el-input v-model.trim="item.ip" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.port')" :prop="'upstreamServers.' + index + '.ipPort'" :rules="rules.checkport">
              <el-input v-model.trim="item.ipPort" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.weights')" v-if="ipTacticsVal=='ip_weight'" :prop="'upstreamServers.' + index + '.ipWeight'" :rules="[{required: true, message:$t('lg.required'), trigger: 'blur'},{pattern:/^[0-9]+$/,message: $t('lg.requirepositive'), trigger: 'change'}]">
              <el-input v-model.trim="item.ipWeight" placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
          </div>
          <span class="addIp" @click="addServerBox" :title="$t('lg.addmoreinternalbs')"><i class="el-icon-circle-plus-outline"></i></span>
        </div>

        <!-- 负载均衡策略 -->
        <el-form-item :label="$t('lg.balancestrategy')" label-width="200px">
          <el-radio-group v-model="ipTacticsVal">
            <el-radio v-for="item in ipTactics" :label="item.value" :key="item.value">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>


        <!-- 服务器健康管理 -->
        <div class="serverCheckBox">
          <el-form-item :label="$t('lg.serverhealth')" label-width="150px">
            <el-switch v-model="isShowServerCheckBox" @click="serverCheck()" :title="isShowServerCheckBox?'点击关闭':'点击开启'"></el-switch>
            <span class='serverCheckTxt' v-show="isEditUpstr">{{serverCheckTxt}}</span>
          </el-form-item>

          <div v-if="isShowServerCheckBox" class="serverCheckinner">
            <el-form-item :label="$t('lg.checkinterval')" label-width="90px" prop="scInterval">
              <el-row>
                <el-col :span="14">
                  <el-input v-model.trim="custUpstrform.scInterval" :placeholder="$t('lg.plzenter')" style="width:98%"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-select v-model="scIntervalUnitVal" :placeholder="$t('lg.select')">
                    <template v-for="item in scTimeIntervalUnit">
                      <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </template>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item :label="$t('lg.serverstopcounts')" label-width="145px" prop="scFall">
              <el-input v-model.trim="custUpstrform.scFall" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.serverstartcounts')" label-width="145px" prop="scRise">
              <el-input v-model.trim="custUpstrform.scRise" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>

            <el-form-item :label="$t('lg.timeoutset')" label-width="120px" prop="scTimeout">
              <el-row>
                <el-col :span="14">
                  <el-input v-model.trim="custUpstrform.scTimeout" :placeholder="$t('lg.plzenter')" style="width:98%"></el-input>
                </el-col>
                <el-col :span="10">
                  <el-select v-model="scTimeoutUnitVal" :placeholder="$t('lg.select')">
                    <template v-for="item in scTimeIntervalUnit">
                      <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </template>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item :label="$t('lg.protocolused')" label-width="145px" prop="scTypeUnit">
              <el-select v-model="custUpstrform.scType" :placeholder="$t('lg.select')" style="width:60%">
                <template v-for="item in scTypeUnit">
                  <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('lg.httpcheck')" label-width="145px" v-if="custUpstrform.scType=='http'" prop="checkHttpSendTxt">
              <el-input :placeholder="$t('lg.plzenter')" v-model="custUpstrform.checkHttpSendTxt">
                <el-select v-model="custUpstrform.checkHttpSendType" slot="prepend" :placeholder="$t('lg.select')" style="width:90px">
                  <template v-for="item in ckHtpSendUnit">
                    <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </template>
                </el-select>
              </el-input>
            </el-form-item>

            <el-form-item :label="$t('lg.httpcheckexptected')" label-width="175px" v-if="custUpstrform.scType=='http'" prop="checkHttpExpectAlive">
              <el-select v-model="custUpstrform.checkHttpExpectAlive" :placeholder="$t('lg.select')" style="width:60%" multiple>
                <template v-for="item in ckHtpExpAliveUnit">
                  <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>

          </div>
        </div>

        <!-- 高级配置 -->
        <div class="gradeSettingBox">
          <p class="gradeSettingTxt text-right"><span class="cursor-pointer font-blue" @click="gradeSetting()"><i :class="isShowHgSettingBox?'el-icon-caret-top':'el-icon-caret-bottom'"></i>{{$t('lg.highconfig')}}</span></p>
          <div v-show="isShowHgSettingBox" class="gradeSettinginner">
            <el-form-item :label="$t('lg.ntlmlong')" prop="ntlmValue">
              <el-input v-model.trim="custUpstrform.ntlmValue" :placeholder="$t('lg.inputnumber')"></el-input>
            </el-form-item>
          </div>
        </div>

        <el-form-item>
          <el-button type="primary" @click="submitCustUpstr('custUpstrform')">{{isEditUpstr?$t('lg.edit'):$t('lg.add')}}</el-button>
          <el-button @click="custUpstrPopClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>

      <loading :title="$t('lg.handling')" v-show="custUpstrPopLoading"></loading>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    }, 
    isShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      rules:{
        checkport:[{trigger:"blur",validator:this.validaport}]
      },
      url:'',//请求的路径
      custUpstrlist:[],
      custUpstrModalLoading:false,

      //增加、编辑弹框
      custUpstrPopLoading:false,
      isEditUpstr:false,//判断为新增还是编辑
      isCustUpstrPopShow:false,

      custUpstrform:{
        upstreamName:'',
        upstreamServers:[
          {
            ip:'',
            ipPort:'',
            ipWeight:''
          }
        ],

        //服务器健康检查 serverCheck
        scInterval:null,
        scFall:null,
        scRise:null,
        scTimeout:null,
        scType:'tcp',
        checkHttpSendType:'GET',
        checkHttpSendTxt:'/',
        checkHttpExpectAlive:[],
        
        //高级配置
        ntlmValue:null,//数字
      },

      //服务器健康检查
      scTimeIntervalUnit:[
        {
          value: 's',
          label: '秒'
        }
      ],
      scIntervalUnitVal:'s',
      scTimeoutUnitVal:'s',
      scTypeUnit:[
        {
          value: 'tcp',
          label: 'tcp'
        },{
          value: 'http',
          label: 'http'
        },{
          value: 'ssl_hello',
          label: 'ssl_hello'
        },
      ],
      ckHtpSendUnit:[
        {
          value: 'GET',
          label: 'GET'
        },{
          value: 'HEAD',
          label: 'HEAD'
        }
      ],
      ckHtpExpAliveUnit:[
        {
          value: 'http_2xx',
          label: 'http_2xx'
        },{
          value: 'http_3xx',
          label: 'http_3xx'
        },{
          value: 'http_4xx',
          label: 'http_4xx'
        },{
          value: 'http_5xx',
          label: 'http_5xx'
        }
      ],

      custUpstrformRules:{
        upstreamName:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],

        //服务器健康管理
        scInterval:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scFall:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scRise:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        scTimeout:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[1-9]\d*$/,message: this.$t('lg.requireg0'), trigger: 'change'}
        ],
        checkHttpSendTxt:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-.\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invaidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        checkHttpExpectAlive:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],

        // 高级配置
        ntlmValue:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },

      ipTacticsVal:'polling',
      ipTactics:[{
        value:'polling',
        name:this.$t('lg.polling')
      },{
        value:'least_conn',
        name:this.$t('lg.leastcon')
      },{
        value:'ip_weight',
        name:this.$t('lg.weights')
      },{
        value:'ip_hash',
        name:'ip_hash'
      },{
        value:'xff_hash',
        name:'xff_hash'
      }],

      ipTacticsList:[{
        value:'stop',
        name:this.$t('lg.disable')
      },{
        value:'close',
        name:this.$t('lg.off')
      },{
        value:'start',
        name:this.$t('lg.on')
      }],
      isShowServerCheckBox:false,//健康检查
      serverCheckTxt:this.$t('lg.opened'),
      isShowHgSettingBox:false,//高级配置
      
    }
  },
  methods:{
    validaport(rule, value, callback){
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }

    },
    getSdCustUpstreamData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data?res.data.data:[];
            this.custUpstrlist=resData;
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    sdCustUpstrModalClose(){//关闭弹框
      this.$emit("setbysdCustomUpstreammodal",false);
    },
    delUpstream(itemName){
      var _this=this;
      _this.custUpstrModalLoading=true;
      axios.delete(_this.url,{
        data:{
          upstreams:[
            {
              upstream:itemName
            }
          ]
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdCustUpstreamData();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.custUpstrModalLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },

    //新增upstream
    addUpstrDialogShow(){
      this.isCustUpstrPopShow=true;
      this.isEditUpstr=false;

      //还原
      this.ipTacticsVal='polling';
      this.isShowServerCheckBox=false;
      this.custUpstrform={
        upstreamName:'',
        upstreamServers:[
          {
            ip:'',
            ipPort:'',
            ipWeight:''
          }
        ],

        //服务器健康检查 serverCheck
        scInterval:null,
        scFall:null,
        scRise:null,
        scTimeout:null,
        scType:'tcp',
        checkHttpSendType:'GET',
        checkHttpSendTxt:'/',
        checkHttpExpectAlive:[],
        
        //高级配置
        ntlmValue:null,//数字
      }
    },
    //修改upstream
    editUpstream(item){
      // console.log(item)
      const _this=this;
      _this.isEditUpstr=true;
      _this.isCustUpstrPopShow=true;
      var resArray=item.servers.concat();
      const serverCheckObj=item.serverCheck.param || {};
     
      var totallist = [], ntlmVal = '';
      // console.log(resArray[resArray.length-1])
      // console.log(Object.keys(resArray[resArray.length-1])[0]);

      resArray.forEach((item,index)=>{//如果有 ntlm长连接 得先把它从数组里面删除，并记录下它的值 //如果有 服务器健康检查 得先把它从数组里面删除，并记录下它的值
        if(item.hasOwnProperty('ntlm')){
          ntlmVal=item.ntlm;
          resArray.splice(index,1);
        }
      })

      // console.log(ntlmVal)
      // console.log(serverCheckObj)
          
      if(Object.keys(resArray[resArray.length-1])[0]=='server'){
        if(/\wight/.test(resArray[0]['server'])){
          _this.ipTacticsVal='ip_weight';
          var reg = /(.*):(\d+)\s(?:weight=(.*))/;
          resArray.forEach(function(v,i){
            var ipValue=reg.exec(v.server);
            totallist.push({
              ip:ipValue[1],
              ipPort:ipValue[2],
              ipWeight:ipValue[3]
            })
          })
        }else{
          _this.ipTacticsVal='polling';
          resArray.forEach(function(v,i){
            totallist.push({
              ip:v.server.split(':')[0],
              ipPort:v.server.split(':')[1],
            })
          })
        }
      }else if(Object.keys(resArray[resArray.length-1])[0]=='least_conn' || Object.keys(resArray[resArray.length-1])[0]=='ip_hash' || Object.keys(resArray[resArray.length-1])[0]=='xff_hash'){
        _this.ipTacticsVal=Object.keys(resArray[resArray.length-1])[0];
        resArray.splice(resArray.length-1,1);
        resArray.forEach(function(v,i){
          totallist.push({
            ip:v.server.split(':')[0],
            ipPort:v.server.split(':')[1],
          })
        })
      }
    
      this.isShowServerCheckBox = item.serverCheck && item.serverCheck.enabled;
      this.serverCheckTxt = item.serverCheck && item.serverCheck.enabled?this.$t('lg.opened'):this.$t('lg.unopened');

      this.custUpstrform=Object.assign({},{
        upstreamName:item.upstream,
        upstreamServers:totallist,

        scInterval:serverCheckObj.interval/1000 || null,
        scFall:serverCheckObj.fall,
        scRise:serverCheckObj.rise,
        scTimeout:serverCheckObj.timeout/1000 || null,
        scType:serverCheckObj.type,

        checkHttpSendType:'GET',
        checkHttpSendTxt:'/',
        checkHttpExpectAlive:[],

        ntlmValue:ntlmVal||'',
      }) 
      if(serverCheckObj.type=='http'){
        let sendTypeStr = serverCheckObj.check_http_send;
        // console.log(sendTypeStr);
        let sendTypeArr = /^"(\S+)\s(\S+)/g.exec(sendTypeStr);
        // console.log(sendTypeArr)
        this.custUpstrform.checkHttpSendType = sendTypeArr[1];
        this.custUpstrform.checkHttpSendTxt = sendTypeArr[2];
        this.custUpstrform.checkHttpExpectAlive = serverCheckObj.check_http_expect_alive.split(' ');
      }
      // console.log(this.custUpstrform)
    },

    addServerBox(){
      this.custUpstrform.upstreamServers.push({
        ip:'',
        ipPort:'',
        ipWeight:''
      })
    },
    delServerBox(index){
      if(this.custUpstrform.upstreamServers.length==1){
        return;
      }
      this.custUpstrform.upstreamServers.splice(index,1);
    }, 

    serverCheck(){
      this.isShowServerCheckBox=!this.isShowServerCheckBox;
    },
    gradeSetting(){
      this.isShowHgSettingBox=!this.isShowHgSettingBox;
    },

    submitCustUpstr(){//新增、编辑确认
      this.$refs['custUpstrform'].validate((valid) => {
        if(valid){
          const _this=this;
          _this.custUpstrPopLoading=true;
          let dataJson={}

          // 融入负载均衡
          var serverData=[];
          let LoadBalance = '';
          serverData = _this.custUpstrform.upstreamServers.map(element=>{
            if(/(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(element.ip) && !/^\[|\]$/.test(element.ip)){
              element.ip='['+element.ip+']';
            }
            if(_this.ipTacticsVal=='ip_weight'){
              LoadBalance = element.ip+':'+element.ipPort+' '+'weight='+element.ipWeight;
              return {"server":LoadBalance}
            }else{
              LoadBalance = element.ip+':'+element.ipPort;
              return {"server":LoadBalance}
            }
          })
          if(_this.ipTacticsVal!=='polling' && _this.ipTacticsVal!=='ip_weight'){
            serverData.push({
              [_this.ipTacticsVal]:''
            })
          }
          // console.log(serverData)

          _this.custUpstrform.ntlmValue && serverData.push({
            "ntlm":_this.custUpstrform.ntlmValue
          })

          dataJson={
            upstream: _this.custUpstrform.upstreamName,
            enableNTLM: _this.custUpstrform.ntlmValue?true:false,
            servers: serverData,
            serverCheck:{
              enabled :_this.isShowServerCheckBox,
              param:{
                interval: _this.custUpstrform.scInterval*1000,
                fall:_this.custUpstrform.scFall,
                rise: _this.custUpstrform.scRise,
                timeout: _this.custUpstrform.scTimeout*1000,
                type: _this.custUpstrform.scType,
              }
            },
           
          }
          if(_this.custUpstrform.scType=='http'){
            dataJson.serverCheck.param.check_http_send='\"' + _this.custUpstrform.checkHttpSendType + ' ' + `${_this.custUpstrform.checkHttpSendTxt || '/'}` + ' ' + 'HTTP/1.0\\r\\n\\r\\n' + '\"';
            dataJson.serverCheck.param.check_http_expect_alive=_this.custUpstrform.checkHttpExpectAlive.join(' ');
          }  

          let requestMethod='post';
          if(_this.isEditUpstr){requestMethod='patch'} //修改

          axios[requestMethod](_this.url,{
            upstreams:[dataJson]
          }).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              _this.getSdCustUpstreamData();
              _this.custUpstrPopClose()
            }else{
              _this.$message.error('failed: '+ res.data.data.message);
            }
            _this.custUpstrPopLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    custUpstrPopClose(){//关闭新增、编辑弹框
      this.isCustUpstrPopShow=false;
      this.$refs['custUpstrform'].resetFields();
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.el-radio-group{
  margin-left: 10px;
  vertical-align: text-top;
}
.el-radio{
  margin: 5px 25px 5px 0px;
}

.custUpstrBox{
  background: #f8f8f8;
  padding: 12px;
  position: relative;
}
.addGIBtn{
  position: absolute;
  right: 12px;
  top: 12px;
}
.custUpstrTitle{
  font-size: 18px; 
  color: #333; 
  margin:5px 0 15px;
}

.delIp{
  position: absolute;
  right: 3px;
  top: 2px;
  cursor: pointer;
}
.addIp{
  display: block;
  position: absolute;
  right: 3px;
  bottom: -25px;
  cursor: pointer;
  z-index: 1;
}

/*服务器健康检查*/
/*高级配置*/
.serverCheckBox, .gradeSettingBox{
  margin-bottom: 20px;
}
.serverCheckinner, .gradeSettinginner{
  border: 1px solid #dcdfe6;
  padding: 30px 20px 10px 0px;
  margin-bottom: 30px;
  position: relative;
  border-radius: 5px;
  /* box-sizing: border-box; */
}
.serverCheckTxt{
  vertical-align: -2px;
}
.serverCheckinner{
  margin-top: -20px;
}
.gradeSettingTxt{
  margin: 20px 0 10px 20px;
}
</style>

