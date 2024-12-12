<!-- location保护指令  -->
<template>
  <div>
    <el-dialog width="70%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <el-button class="addDirectiveBtn" type="primary" size="mini" @click="addDctDialogShow()" v-show="locationObj.nameTxt!='deny_url'">{{$t('lg.xinzengbhpz')}}</el-button>
        <h1 class="directiveTitle">{{locationObj.nameTxt!='deny_url'?$t('lg.protectconfig'):$t('lg.mingwenjjurl')}}</h1>
        <p class="nodata-box" v-show="directiveData.length==0">{{$t('lg.nodata')}}</p>
        <!-- {{directiveData}} -->
        <table class="table-bg" v-show="directiveData.length>0">
          <thead>
            <tr>
              <th v-show="locationObj.nameTxt!='deny_url'">{{$t('lg.url3')}}</th>
              <th>{{locationObj.nameTxt!='deny_url'?$t('lg.url2'):$t('lg.jiekoudz')}}</th>
              <th v-show="locationObj.nameTxt!='deny_url'">{{$t('lg.validdate')}}</th>
              <th v-show="locationObj.nameTxt!='deny_url'">{{$t('lg.allowedrefreshes')}}</th>
              <th>{{$t('lg.configproperty')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData">
              <!-- <td v-for="(vitem,index) in item" v-show="(locationObj.nameTxt=='deny_url' && !(index==0 || index==2 || index==3)) || locationObj.nameTxt!='deny_url'">{{vitem}}</td> -->
              <td>{{item.srcUri}}</td>
              <td>{{item.jumpUrl}}</td>
              <td>{{item.timeout}}</td>
              <td>{{item.refreshNum}}</td>
              <td>{{toConftype3(item.confType)}}</td>
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
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="addDctDialogVisible" :close-on-click-modal="false" :before-close="addDctDialogClose">
          <el-form ref="directiveform" :model="directiveform" :rules="directiveformRules" :label-width="$store.state.isencn=='en'?'180px':'140px'" style="margin-right:30px">
            <el-form-item :label="$t('lg.ourl')" prop="uri1">
              <el-input v-model.trim="directiveform.uri1"></el-input>
              <el-checkbox :label="$t('lg.regx')" v-model="directiveform.x"></el-checkbox>
            </el-form-item>
            <el-form-item :label="$t('lg.url2')" prop="uri2">
              <el-input v-model.trim="directiveform.uri2"></el-input>
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
                <el-checkbox-group v-model="directiveform.raeChecklist" size="mini" @change="checkedChange(directiveform)">
                  <el-checkbox :label="$t('lg.replaceconfig')"></el-checkbox>
                  <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="isCheckDisable"></el-checkbox>
                  <el-checkbox :label="$t('lg.encrypt2')" :disabled="isCheckDisable"></el-checkbox>
                  <el-checkbox :label="$t('lg.encryptab')" :disabled="isCheckDisable"></el-checkbox>
                  <!-- <el-checkbox :label="$t('lg.encryptpa')" :disabled="isCheckDisable"></el-checkbox> -->
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
      <el-form ref="editDirectiveform" :model="editDirectiveform" :rules="editDirectiveformRules" :label-width="$store.state.isencn=='en'?'180px':'110px'">
        <el-form-item :label="$t('lg.ourl')" v-show="locationObj.nameTxt!='deny_url'" prop="uri1">
          <el-input v-model.trim="editDirectiveform.uri1"></el-input>
          <el-checkbox :label="$t('lg.regx')" v-model="editDirectiveform.x"></el-checkbox>
        </el-form-item>

        <el-form-item :label="locationObj.nameTxt!='deny_url'?$t('lg.url2'):$t('lg.jiekoudz')" prop="uri2">
          <el-input v-model.trim="editDirectiveform.uri2" :disabled="locationObj.nameTxt=='deny_url'"></el-input>
        </el-form-item>
        
        <el-form-item :label="$t('lg.timeoutset')" v-show="locationObj.nameTxt!='deny_url'" prop="timeNum">
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
        <el-form-item :label="$t('lg.allowedrefreshes')" v-show="locationObj.nameTxt!='deny_url'" prop="refreshtimes">
          <el-input v-model.trim="editDirectiveform.refreshtimes"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.configproperty')">
          <div class="checkBorder">
            <el-checkbox-group size="mini" v-model="editDirectiveform.raeChecklist" @change="checkedChange(editDirectiveform)">
              <el-checkbox :label="$t('lg.replaceconfig')" v-show="locationObj.nameTxt!='deny_url'"></el-checkbox>
              <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encrypt2')" :disabled="isCheckDisable" v-show="locationObj.nameTxt!='deny_url'"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptab')" :disabled="isCheckDisable" v-show="locationObj.nameTxt!='deny_url'"></el-checkbox>
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
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';

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
      isCheckDisable:false,
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
        time:500,
        x:false,
        refreshtimes:1,
        raeChecklist:[]
      },
      directiveformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'}//,
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
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
        time:'',
        x:false,
        timeNum:null,
        refreshtimes:'',
        raeChecklist:[]
      },
      editDirectiveformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
       //   {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
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
        x:'',
        refreshtimes:1,
        raeChecklist:[]
      },
      orginEditdirective:{},
      editDctLoading:false,
    }
  },
  mounted(){
    if(this.isAuto){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf?autoconfig=true";
    }else if(this.isEditConfig){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf?savedConfig=true";
    }else{
      this.url=SERVER_API_URL+"pe/shadow/domain/location/protectconf";
    }
  },
  methods:{
    getLcProtectInstructData(){//获取location的保护指令
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
          console.log(res)
            let resolvedata=res.data.data || [];
            this.directiveData=resolvedata;
            resolve(resolvedata)
        })
      })
    },
    
    directiveDialogClose(){
      this.$emit("setbylcProtectInstructmodal",false);
    },

    //编辑、增加公用
    checkedChange(form){//选择替换配置后，禁用其他配置 保护配置
      var _this = this;
      if(form.raeChecklist.length==0){
        _this.isCheckDisable = false;
      };
      form.raeChecklist.forEach(function(v,i){
        if(v=="替换配置" || v=="Replacement configuration"){
          _this.isCheckDisable = true;
          form.raeChecklist=[_this.$t('lg.replaceconfig')];
        }else{
          _this.isCheckDisable = false;
        }
      });
    },
    
    //增加
    addDctDialogShow(){//显示添加弹框
      this.addDctDialogVisible=true;
    },
    addDirectiveList(formname){//添加到预览列表 保护配置
      const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const rr=this.$t('lg.replaceconfig'),
                aa=this.$t('lg.allowaccessourl'),
                ee=this.$t('lg.encrypt2'),
                ss=this.$t('lg.encryptab');//pp=this.$t('lg.encryptpa')

          const uri1=this.directiveform.uri1,
                uri2=this.directiveform.uri2,
                time=this.directiveform.time+this.overTimeValue,
                refreshtimes=this.directiveform.refreshtimes,
                raeChecklist=this.directiveform.raeChecklist;

          const regexxx=this.directiveform.x;
          var getregexxx=""
          if(regexxx){
            getregexxx="x"
          }

          const getARE=raeChecklist.join("").replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,'s')+getregexxx;
          let cmdData={
             "domainName": _this.domainObj.domainName,
              "domainPort": _this.domainObj.port,
              "locationName": _this.locationObj.name,
              "locationType": _this.locationObj.type,
              "snodeId": _this.shadowObj.snodeId,
              "srcUri": uri1,
              "jumpUrl": uri2,
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
            _this.getLcProtectInstructData();
            _this.$emit("updateRenderTree");
            _this.addDctDialogClose();
          }else{
            _this.$message.error(_this.$t('lg.failed'));
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
      this.directiveform.raeChecklist=[];
      this.directiveform.x=false;
      this.isCheckDisable = false;
      this.addDctDialogVisible=false;
    },

    //编辑
    editDctDialogShow(item){//打开编辑弹框 获取编辑参数
    //console.log(item);
    var _this=this;
      this.editDctDialogVisible=true;
      this.orginEditdirective=JSON.parse(JSON.stringify(item));
      var rae=item.confType;
      if(rae.indexOf("r")!=-1){
        this.isCheckDisable=true;
      }
      if(rae && rae.indexOf('x')!=-1){
        this.editDirectiveform.x=true;
      }else{
        this.editDirectiveform.x=false;
      }
      const configureArr={//配置属性文本文字转换成code 
              '替换配置':'r',
              '允许访问原URI':'a',
              '二次加密':'e',
              '绝对路径':'s'//,
             // '正则':'x'
            }
      let timearr=item.timeout.match(/^(\d*)(\w*)/);
      let raearr=[];
      if(item.confType){
        raearr=item.confType.split("");
      }
      
      let raeck=raearr.map((item)=>{
        if(item=="r"){
          item=this.$t('lg.replaceconfig')
        }else if(item=="a"){
          item=this.$t('lg.allowaccessourl')
        }else if(item=="e"){
          item=this.$t('lg.encrypt2')
        }else if(item=="s"){
          item=this.$t('lg.encryptab')
        }else if(item=="x"){
          item=this.$t('lg.regx')
        }
        return item;
      })
      this.editDirectiveform.uri1=item.srcUri;
      this.editDirectiveform.uri2=item.jumpUrl;
      this.editDirectiveform.refreshtimes=item.refreshNum;
      this.editDirectiveform.timeNum=timearr[1];
      this.editDirectiveform.overTimeValue=timearr[2];
      this.editDirectiveform.raeChecklist=raeck;

    },
editDctEnsure(formname){
//  console.log(this.orginEditdirective)
  const _this=this;
  this.$refs[formname].validate((valid) => {
 if (valid) {
    const rr=this.$t('lg.replaceconfig'),
          aa=this.$t('lg.allowaccessourl'),
          ee=this.$t('lg.encrypt2'),
          ss=this.$t('lg.encryptab'),
          xx=this.$t('lg.regx');
    var raeChecklist=this.editDirectiveform.raeChecklist;
  //raeChecklist=this.editDirectiveform.raeChecklist;
  //let regexxx=this.editDirectiveform.x;
          // var getregexxx=""
          // if(this.editDirectiveform.x){
          //   getregexxx="x"
          // }else{
          //   getregexxx=""
          // }
var getARE=raeChecklist.join("").replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,'s').replace(xx,'x');
 if(!this.editDirectiveform.x){
  getARE=getARE.replace('x','');
 }else{
  getARE=getARE+"x";
 }
 axios.patch(_this.url,{
"domainName": _this.domainObj.domainName,
  "domainPort": _this.domainObj.port,
  "locationName": _this.locationObj.name,
  "locationType":_this.locationObj.type,
  "snodeId": _this.shadowObj.snodeId,
  "srcUri": this.editDirectiveform.uri1,
  "jumpUrl": this.editDirectiveform.uri2,
  "timeout": this.editDirectiveform.timeNum+this.overTimeValue,
  "refreshNum": this.editDirectiveform.refreshtimes,
  "confType": getARE,
  "oldSrcUri":this.orginEditdirective.srcUri,
  "oldJumpUrl": this.orginEditdirective.jumpUrl,
  "oldTimeout": this.orginEditdirective.timeout,
  "oldRefreshNum": this.orginEditdirective.refreshNum,
  "oldConfType": this.orginEditdirective.confType
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getLcProtectInstructData();
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
      this.isCheckDisable = false;
      this.$refs['editDirectiveform'].resetFields();
      this.editDctDialogVisible=false;
    },

    //删除
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
          _this.getLcProtectInstructData();
          _this.$emit("updateRenderTree");
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    toConftype3(item){
      if(item){
      return item.replace("r",this.$t('lg.replaceconfig1')+"；").replace("a",this.$t('lg.allowaccessourl1')+"；").replace("x",this.$t('lg.regx1')+"；").replace("s",this.$t('lg.encryptab1')+"；").replace("e",this.$t('lg.encrypt21')+"；")
    }}
  },
  filters:{
    toConftype(item){
      if(item){
      return item.replace("r",this.$t('lg.replaceconfig')+"；").replace("a",this.$t('lg.allowaccessourl')+"；").replace("x",this.$t('lg.regx')+"；").replace("s",this.$t('lg.encryptab')+"；").replace("e",this.$t('lg.encrypt2')+"；")
    }}
  }
}
</script>

<style scoped>
.directiveBox{
  background: #f7f7f7;
  padding: 12px;
  position: relative;
}
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
/* .directiveListBox{
  max-height: 300px;
  overflow-y: auto;
} */
</style>