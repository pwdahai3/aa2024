<!-- location跳转指令 -->
<template>
  <div>
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <el-button class="addDirectiveBtn" type="primary" size="mini" @click="addDctDialogShow()" :disabled="directiveData.length>0">{{$t('lg.xinzengtzpz')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.jumpconfig')}}</h1>
        <p class="nodata-box" v-show="directiveData.length==0">{{$t('lg.nodata')}}</p>
        <!-- {{directiveData}} -->
        <table class="table-bg" v-show="directiveData.length>0">
          <thead>
            <tr>
              <th>URI</th>
              <th>{{$t('lg.qianzuizc')}}</th>
              <th>{{$t('lg.tibuzc')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData">
              <td>{{item.uri}}</td>
              <td>{{item.prefixSubstring}}</td>
              <td>{{item.replaceSubstring}}</td>
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

          <el-form ref="directiveform" :model="directiveform" :rules="directiveformRules" :label-width="$store.state.isencn=='en'?'180px':'130px'" style="margin-right:30px">
            <el-form-item label="URI" prop="uri1">
              <el-input v-model.trim="directiveform.uri1"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.qianzuizc')" prop="uri2">
              <el-input v-model.trim="directiveform.uri2"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.tibuzc')" prop="uri3">
              <el-input v-model.trim="directiveform.uri3"></el-input>
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
      <el-form ref="editDirectiveform" :model="editDirectiveform" :rules="editDirectiveformRules" :label-width="$store.state.isencn=='en'?'180px':'130px'">
        <el-form-item label="URI" prop="uri1">
          <el-input v-model.trim="editDirectiveform.uri1"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.qianzuizc')" prop="uri2">
          <el-input v-model.trim="editDirectiveform.uri2"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.tibuzc')" prop="uri3">
          <el-input v-model.trim="editDirectiveform.uri3"></el-input>
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

      //增加
      sdLocationFlag:false,
      addDctDialogVisible:false,
      directiveform:{
        uri1:'',//urI
        uri2:'',//前缀子串
        uri3:'',//替换子串
      },
      directiveformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri3:[ 
        //  {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
      },
      directiveList:[],
      addDctLoading:false,
      
      //编辑
      editDctDialogVisible:false,
      editDirectiveform:{
        uri1:'',
        uri2:'',
        uri3:'',
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
         // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
      },
      editDirectiveOrgin:{//编辑服务器临时容器,被编辑的当前项
        uri1:'',
        uri2:'',
        uri3:'',
      },
      orginEditdirective:{},
      editDctLoading:false,
    }
  },
  mounted(){
    if(this.isAuto){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/jumpconf?autoconfig=true";
    }else if(this.isEditConfig){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/jumpconf?savedConfig=true";
    }else{
      this.url=SERVER_API_URL+"pe/shadow/domain/location/jumpconf";
    }
  },
  methods:{
    getLcSkipInstructData(){//获取location的特殊保护指令
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
            let resolvedata=res.data.data || [];
            this.directiveData=resolvedata;
            resolve(resolvedata)
        })
      })
    },
    directiveDialogClose(){
      this.$emit("setbylcSkipInstructmodal",false);
    },
    //增加
    addDctDialogShow(){//显示添加弹框
      this.addDctDialogVisible=true;
    },
    addDirectiveList(formname){
      //添加到预览列表 保护配置
      const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const uri1=this.directiveform.uri1,
                uri2=this.directiveform.uri2,
                uri3=this.directiveform.uri3;
         let cmdData={
             "domainName": _this.domainObj.domainName,
              "domainPort": _this.domainObj.port,
              "locationName": _this.locationObj.name,
              "locationType": _this.locationObj.type,
              "snodeId": _this.shadowObj.snodeId,
              "uri": uri1,
              "prefixSubstring": uri2,
              "replaceSubstring": uri3
          };
        axios.post(_this.url,cmdData).then((res)=>{
          if(res.data.responseCode==0){
            _this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            _this.getLcSkipInstructData();
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
      this.sdLocationFlag=false;
      this.directiveList.splice(this.directiveList.indexOf(item),1);
    },
    addDctDialogClose(){//关闭添加指令弹框
      this.directiveList=[];
      this.$refs['directiveform'].resetFields();
      this.sdLocationFlag=false;
      this.addDctDialogVisible=false;
    },
    //编辑
    editDctDialogShow(item){//打开编辑弹框 获取编辑参数
      this.editDctDialogVisible=true;
      this.orginEditdirective=JSON.parse(JSON.stringify(item));
      this.editDirectiveform.uri1=item.uri;
      this.editDirectiveform.uri2=item.prefixSubstring;
      this.editDirectiveform.uri3=item.replaceSubstring;
    },
    editDctEnsure(formname){//确认修改
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;
         axios.patch(_this.url,{
            "snodeId":_this.shadowObj.snodeId,
            "domainName":_this.domainObj.domainName,
            "domainPort":_this.domainObj.port,
            "locationName":_this.locationObj.name,
            "locationType":_this.locationObj.type,
            "uri": this.editDirectiveform.uri1,
  "prefixSubstring": this.editDirectiveform.uri2,
  "replaceSubstring": this.editDirectiveform.uri3,
  "oldUri": this.orginEditdirective.uri,
  "oldPrefixSubstring": this.orginEditdirective.prefixSubstring,
  "oldReplaceSubstring": this.orginEditdirective.replaceSubstring 
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getLcSkipInstructData();
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
          "oldUri": item.uri,
  "oldPrefixSubstring": item.prefixSubstring,
  "oldReplaceSubstring": item.replaceSubstring
        }
      }).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getLcSkipInstructData();
          _this.$emit("updateRenderTree");
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
      
    },
  },
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
/* .directiveListBox{
  max-height: 300px;
  overflow-y: auto;
} */
</style>