<!-- location特殊保护指令 -->
<template>
  <div>
    <el-dialog width="70%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <el-button class="addDirectiveBtn" type="primary" size="mini" @click="addDctDialogShow()">{{$t('lg.xinzentsbhpz')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.spconfig')}}</h1>
        <p class="nodata-box" v-show="directiveData.length==0">{{$t('lg.nodata')}}</p>
        <!-- {{directiveData}} -->
        <table class="table-bg" v-show="directiveData.length>0">
          <thead>
            <tr>
              <th>{{$t('lg.url3')}}</th>
              <th>{{$t('lg.remained')}}</th>
              <th>{{$t('lg.url2')}}</th>
              <th>{{$t('lg.validdate')}}</th>
              <th>{{$t('lg.allowedrefreshes')}}</th>
              <th>{{$t('lg.configproperty')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData">
              <td>{{item.srcUri}}</td>
              <td>{{item.retainPart}}</td>
              <td>{{item.jumpUrl}}</td>
              <td>{{item.timeout}}</td>
              <td>{{item.refreshNum}}</td>
              <td>{{toConftype2(item.confType)}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editDctDialogShow(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deletDirective(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="getDirectiveLoading"></loading>
    </el-dialog>

    <!-- 增加指令弹框 -->
    <el-dialog width="70%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="addDctDialogVisible" :close-on-click-modal="false" :before-close="addDctDialogClose">
          <el-form ref="directiveform" :model="directiveform" :rules="directiveformRules" :label-width="$store.state.isencn=='en'?'180px':'140px'" style="margin-right:30px">
            <el-form-item :label="$t('lg.ourl')" prop="uri1">
              <el-input v-model.trim="directiveform.uri1"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.remained')" prop="uri2">
              <el-input v-model.trim="directiveform.uri2"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.url2')" prop="uri3">
              <el-input v-model.trim="directiveform.uri3"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.timeoutset')" prop="time">
              <el-input v-model.trim="directiveform.time" style="width:40%"></el-input>
              <el-select v-model="overTimeValue" placeholder="$t('lg.select')" style="width:30%">
                <el-option
                  v-for="item in overTimeUnit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lg.allowedrefreshes')" prop="refreshtimes">
              <el-input v-model.trim="directiveform.refreshtimes"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.configproperty')">
              <div class="checkBorder">
                <el-checkbox-group v-model="directiveform.raeChecklist" size="mini">
                  <el-checkbox :label="$t('lg.encrypt2')"></el-checkbox>
                  <el-checkbox :label="$t('lg.encryptab')"></el-checkbox>
                  <el-checkbox :label="$t('lg.encryptpa')" disabled></el-checkbox>
                  <el-checkbox :label="$t('lg.allowaccessourl')"></el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addDirectiveList('directiveform')">{{$t('lg.add')}}</el-button>
              <el-button @click="addDctDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="addDctLoading"></loading>
    </el-dialog>

    <!-- 编辑指令弹框 -->
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="editDctDialogVisible" :close-on-click-modal="false" :before-close="editDctDialogClose">
      <el-form ref="editDirectiveform" :model="editDirectiveform" :rules="editDirectiveformRules" :label-width="$store.state.isencn=='en'?'180px':'140px'">
        <el-form-item :label="$t('lg.ourl')" prop="uri1">
          <el-input v-model.trim="editDirectiveform.uri1"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.remained')" prop="uri2">
          <el-input v-model.trim="editDirectiveform.uri2"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.url2')" prop="uri3">
          <el-input v-model.trim="editDirectiveform.uri3"></el-input>
        </el-form-item>
        
        <el-form-item :label="$t('lg.timeoutset')" prop="timeNum">
          <el-input v-model.trim="editDirectiveform.timeNum" style="width:30%"></el-input>
          <el-select v-model="overTimeValue" :placeholder="$t('lg.select')" style="width:20%">
            <el-option
              v-for="item in overTimeUnit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.allowedrefreshes')" prop="refreshtimes">
          <el-input v-model.trim="editDirectiveform.refreshtimes"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.configproperty')">
          <div class="checkBorder">
            <el-checkbox-group size="mini" v-model="editDirectiveform.raeChecklist">
              <el-checkbox :label="$t('lg.encrypt2')"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptab')"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptpa')" disabled></el-checkbox>
              <el-checkbox :label="$t('lg.allowaccessourl')"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editDctEnsure('editDirectiveform')">{{$t('lg.save')}}</el-button>
          <el-button @click="editDctDialogClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editDctLoading"></loading>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import * as types from '@/store/types';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import {handleConfigure} from '@/assets/js/tool';

export default {
  components:{
    loading
  },
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
    },
    domainObj:{
      type:Object
    },
    locationObj:{
      type:Object
    }
  },
  data(){
    return{
      url:'',//请求路径
      getDirectiveLoading:false,
      directiveData:[],

      //编辑、增加公用
      overTimeUnit:[{
        value: 'y',
        label: this.$t('lg.year')
      },{
        value: 'M',
        label: this.$t('lg.month')
      },{
        value: 'w',
        label: this.$t('lg.week')
      },{
        value: 'd',
        label: this.$t('lg.day')
      },{
        value: 'h',
        label: this.$t('lg.hour')
      },{
        value: 'm',
        label: this.$t('lg.minite')
      },{
        value: 's',
        label: this.$t('lg.second')
      },{
        value: 'ms',
        label: this.$t('lg.ms')
      }],
      overTimeValue:'s',

      //增加
      addDctDialogVisible:false,
      directiveform:{
        uri1:'',
        uri2:'',
        uri3:'',
        time:500,
        refreshtimes:1,
        raeChecklist:[this.$t('lg.encryptpa')]
      },
      directiveformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri3:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        time:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ],
        refreshtimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ]
      },
      directiveList:[],
      addDctLoading:false,
      
      //编辑
      editDctDialogVisible:false,
      editDirectiveform:{
        uri1:'',
        uri2:'',
        uri3:'',
        time:'',
        timeNum:null,
        refreshtimes:'',
        raeChecklist:[]
      },
      editDirectiveformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri3:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        timeNum:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ],
        refreshtimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ]
      },
      editDirectiveOrgin:{//编辑服务器临时容器,被编辑的当前项
        uri1:'',
        uri2:'',
        time:'',
        refreshtimes:1,
        raeChecklist:[]
      },
      orginEditdirective:{},
      editDctLoading:false,
    }
  },
  mounted(){
    if(this.isAuto){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf/special?autoconfig=true";
    }else if(this.isEditConfig){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf/special?savedConfig=true";
    }else{
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf/special";
    }
  },
  methods:{
    getLcSpecialProtectInstructData(){//获取location的保护指令
      return new Promise((resolve,reject)=>{
        const _this=this;
        axios.get(_this.url,{
          params: {
            "snodeId": _this.shadowObj.snodeId,
            "domainName": _this.domainObj.domainName,
            "domainPort": _this.domainObj.port,
            "locationName": _this.locationObj.name,
            "locationType": _this.locationObj.type
          }
        }).then((res)=>{
            //console.log(res)
            let resolvedata=res.data.data || [];
           // if(resolvedata){
              this.directiveData=resolvedata;
           // }    
            resolve(resolvedata)
        })
      })
    },

    directiveDialogClose(){
      this.$emit("setbylcSpecialProtectInstructmodal",false);
    },

    //增加
    addDctDialogShow(){//显示添加弹框
      this.addDctDialogVisible=true;
    },
    addDirectiveList(formname){//添加到预览列表 特殊保护配置
    const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const ee=this.$t('lg.encrypt2'),//rr=this.$t('lg.replaceconfig'),aa=this.$t('lg.allowaccessourl'),
                ss=this.$t('lg.encryptab'),
                aa=this.$t('lg.allowaccessourl'),
                pp=this.$t('lg.encryptpa');

          const uri1=this.directiveform.uri1,
                uri2=this.directiveform.uri2,
                uri3=this.directiveform.uri3,
                time=this.directiveform.time+this.overTimeValue,
                refreshtimes=this.directiveform.refreshtimes,
                raeChecklist=this.directiveform.raeChecklist;

          const getARE=raeChecklist.join("").replace(ee,"e").replace(ss,'s').replace(aa,'a').replace(pp,'p');

          // const cmdData={
          //       "subfilterType":"shadow_sub_filter_ex",
          //       "uri1":uri1,
          //       "uri2":uri2,
          //       "uri3":uri3,
          //       "time":time,
          //       "refreshtimes":refreshtimes,
          //       "oarj":getARE
          //     };
          // this.directiveList.push(cmdData);
let cmdData={
             "domainName": _this.domainObj.domainName,
              "domainPort": _this.domainObj.port,
              "locationName": _this.locationObj.name,
              "locationType": _this.locationObj.type,
              "snodeId": _this.shadowObj.snodeId,
              "srcUri": uri1,
              "retainPart":uri2,
              "jumpUrl": uri3,
              "timeout": time,
              "refreshNum": refreshtimes,
              "confType": getARE
          };
        axios.post(_this.url,cmdData).then((res)=>{
          if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getLcSpecialProtectInstructData();
          _this.$emit("updateRenderTree");
          _this.addDctDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.addDctLoading=false;
        }).catch((err)=>{
          console.log(err);
        })


        }
      });
    },
    delDirectiveList(item){//从预览表格里删除
      this.directiveList.splice(this.directiveList.indexOf(item),1);
    },
    addDctDialogClose(){//关闭添加指令弹框
      this.directiveList=[];
      this.$refs['directiveform'].resetFields();
      this.directiveform.raeChecklist=[this.$t('lg.encryptpa')];
      this.addDctDialogVisible=false;
    },
    editDctDialogShow(item){
      var _this=this;
      this.editDctDialogVisible=true;
      this.orginEditdirective=JSON.parse(JSON.stringify(item));
      //var rae=item.confType;
      const configureArr={//配置属性文本文字转换成code 
              '路径加密':'p',
              '允许访问原URI':'a',
              '二次加密':'e',
              '绝对路径':'s'
            }
      let timearr=item.timeout.match(/^(\d*)(\w*)/);
      let raearr=[];
      if(item.confType){
        raearr=item.confType.split("");
      }
      
      let raeck=raearr.map((item)=>{
        if(item=="p"){
          item=this.$t('lg.encryptpa')
        }else if(item=="a"){
          item=this.$t('lg.allowaccessourl')
        }else if(item=="e"){
          item=this.$t('lg.encrypt2')
        }else if(item=="s"){
          item=this.$t('lg.encryptab')
        }
        return item;
      })
     // console.log(raearr)
      this.editDirectiveform.uri1=item.srcUri;
      this.editDirectiveform.uri2=item.retainPart;
      this.editDirectiveform.uri3=item.jumpUrl;
      this.editDirectiveform.refreshtimes=item.refreshNum;
      this.editDirectiveform.timeNum=timearr[1];
      this.editDirectiveform.overTimeValue=timearr[2];
      this.editDirectiveform.raeChecklist=raeck;
    },
     editDctEnsure(formname){
  const _this=this;
      this.$refs[formname].validate((valid) => {
 if (valid) {
    const pp=this.$t('lg.encryptpa'),
                aa=this.$t('lg.allowaccessourl'),
                ee=this.$t('lg.encrypt2'),
                ss=this.$t('lg.encryptab');
var raeChecklist=this.editDirectiveform.raeChecklist;
  raeChecklist=this.editDirectiveform.raeChecklist;
var getARE=raeChecklist.join("").replace(pp,"p").replace(aa,"a").replace(ee,"e").replace(ss,'s');
 axios.patch(_this.url,{
"domainName": _this.domainObj.domainName,
  "domainPort": _this.domainObj.port,
  "locationName": _this.locationObj.name,
  "locationType":_this.locationObj.type,
  "snodeId": _this.shadowObj.snodeId,
  "srcUri": this.editDirectiveform.uri1,
  "retainPart":this.editDirectiveform.uri2,
  "jumpUrl": this.editDirectiveform.uri3,
  "timeout": this.editDirectiveform.timeNum+this.overTimeValue,
  "refreshNum": this.editDirectiveform.refreshtimes,
  "confType": getARE,
  "oldSrcUri":this.orginEditdirective.srcUri,
  "oldJumpUrl": this.orginEditdirective.jumpUrl,
  "oldTimeout": this.orginEditdirective.timeout,
  "oldRefreshNum": this.orginEditdirective.refreshNum,
  "oldRetainPart":this.orginEditdirective.retainPart,
  "oldConfType": this.orginEditdirective.confType
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getLcSpecialProtectInstructData();
              _this.$emit("updateRenderTree");
              _this.editDctDialogClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })     
      }
      }) 
     },
    editDctDialogClose(){//关闭编辑指令弹框
      this.editDirectiveform.raeChecklist=[];
      this.$refs['editDirectiveform'].resetFields();
      this.editDctDialogVisible=false;
    },
deletDirective(item){
const _this=this;
      _this.getDirectiveLoading=true;
      axios.delete(_this.url,{
        data:{
          "domainName": _this.domainObj.domainName,
          "domainPort": _this.domainObj.port,
          "locationName": _this.locationObj.name,
          "locationType": _this.locationObj.type,
          "snodeId": _this.shadowObj.snodeId,
          "oldSrcUri": item.srcUri,
          "oldRetainPart":item.retainPart,
          "oldJumpUrl": item.jumpUrl,
          "oldTimeout": item.timeout,
          "oldRefreshNum": item.refreshNum,
          "oldConfType": item.confType
        }
      }).then((res)=>{
        // console.log(res);
          if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getLcSpecialProtectInstructData();
          _this.$emit("updateRenderTree");
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
},
toConftype2(item){
      if(item){
      return item.replace("e",this.$t('lg.encrypt21')+"；").replace("a",this.$t('lg.allowaccessourl1')+"；").replace("s",this.$t('lg.encryptab1')+"；").replace("x",this.$t('lg.regx1')+"；").replace("s",this.$t('lg.encryptab1')+"；").replace("p",this.$t('lg.encryptpa1')+"；")
    }}
  },
    filters:{
    toConftype(item){
      if(item){
      return item.replace("e",this.$t('lg.encrypt2')+"；").replace("a",this.$t('lg.allowaccessourl')+"；").replace("s",this.$t('lg.encryptab')+"；").replace("x",this.$t('lg.regx')+"；").replace("s",this.$t('lg.encryptab')+"；").replace("p",this.$t('lg.encryptpa')+"；")
    }}
  }
}
</script>

<style scoped>
.addDirectiveBtn{
  position: absolute;
  right: 12px;
  top: 12px;
}
.directiveTitle{
  font-size: 18px; 
  color: #333; 
  margin:5px 0 15px;
}
.directiveBox{
  background: #f7f7f7;
  padding: 12px;
  position: relative;
}
</style>