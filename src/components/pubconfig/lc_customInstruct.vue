<!-- location自定义指令 -->
<template>
  <div>
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <el-button class="addDirectiveBtn" type="primary" size="mini" @click="addDctDialogShow()">{{$t('lg.xinzzdypz')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.zidingyipz')}}</h1>
        <p class="nodata-box" v-show="directiveData.length==0">{{$t('lg.nodata')}}</p>
        <!-- {{directiveData}} -->
        <table class="table-bg" v-show="directiveData.length>0">
          <thead>
            <tr>
              <th>{{$t('lg.peizhimc')}}</th>
              <th>{{$t('lg.peizhics')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData">
              <td>{{item.confName}}</td>
              <td>{{item.confParam}}</td>
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
          <el-form ref="directiveform" :model="directiveform" :rules="directiveformRules" label-width="160px" style="margin-right:30px">
            <el-form-item :label="$t('lg.peizhimc')" prop="instructName">
              <el-input v-model.trim="directiveform.instructName" :placeholder="$t('lg.peizhimc')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.peizhics')" prop="instructParam">
              <el-input v-model.trim="directiveform.instructParam" :placeholder="$t('lg.peizhics')"></el-input>
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
      <el-form ref="editDirectiveform" :model="editDirectiveform" :rules="editDirectiveformRules" label-width="80px">
        <el-form-item :label="$t('lg.peizhimc')" prop="instructName">
          <el-input v-model.trim="editDirectiveform.instructName"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.peizhics')" prop="instructParam">
          <el-input v-model.trim="editDirectiveform.instructParam"></el-input>
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

      //增加
      addDctDialogVisible:false,
      directiveform:{
        instructName:'',
        instructParam:'',
      },
      directiveformRules:{
        instructName:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        ],
      },
      directiveList:[],
      addDctLoading:false,
      
      //编辑
      editDctDialogVisible:false,
      editDirectiveform:{
        instructName:'',
        instructParam:'',
      },
      editDirectiveformRules:{
        instructName:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        ],
      },
      editDirectiveOrgin:{//编辑服务器临时容器,被编辑的当前项
        confName:'',
        confParam:'',
      },
      editDctLoading:false,
    }
  },
  mounted(){
    if(this.isAuto){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/customconf?autoconfig=true";
    }else if(this.isEditConfig){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/customconf?savedConfig=true";
    }else{
      this.url=SERVER_API_URL+"pe/shadow/domain/location/customconf";
    }
  },
  methods:{
    getLcCustomInstructData(){//获取location的特殊保护指令
      const _this=this;
      return new Promise((resolve,reject)=>{
        axios.get(_this.url,{
          params:{
            "snodeId": _this.shadowObj.snodeId,
            "domainName": _this.domainObj.domainName,
            "domainPort": _this.domainObj.port,
            "locationName": _this.locationObj.name,
            "locationType": _this.locationObj.type
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            let resolvedata=res.data.data;
            this.directiveData=resolvedata || [];
            resolve(resolvedata);
          }else{
            reject("error")
          }
        });
      })
    },

    directiveDialogClose(){
      this.$emit("setbylcCustomInstructmodal",false);
    },

    //增加
    addDctDialogShow(){//显示添加弹框
      this.addDctDialogVisible=true;
    },
    addDirectiveList(formname){//添加到预览列表 保护配置
      const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
           let instrName=this.directiveform.instructName,
                 instrParam=this.directiveform.instructParam;
          axios.post(_this.url,{
            "domainName": _this.domainObj.domainName,
            "domainPort": _this.domainObj.port,
            "locationName": _this.locationObj.name,
            "locationType": _this.locationObj.type,
            "snodeId": _this.shadowObj.snodeId,
            "confName": instrName,
            "confParam": instrParam 
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getLcCustomInstructData();
              _this.addDctDialogClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
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
    submitDirective(){//确认添加
      const _this=this;
      _this.addDctLoading=true;
      let directivesArr=[];

      // console.log(this.directiveList);
      this.directiveList.forEach(ele=>{
        let str=ele['instructParam'];
        str=Base64.encode(str);
        directivesArr.push({
          [ele.instructName]:str
        })
      })

      // console.log(directivesArr)
      axios.post(_this.url,{
        snodeId:_this.shadowObj.snodeId,
        domainName:_this.domainObj.domainName,
        domainPort:_this.domainObj.port,
        locationName:_this.locationObj.name,
        locationType:_this.locationObj.type,
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getLcCustomInstructData();
          _this.addDctDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    addDctDialogClose(){//关闭添加指令弹框
      this.directiveList=[];
      this.$refs['directiveform'].resetFields();
      this.directiveform.raeChecklist=[this.$t('lg.encryptpa')];
      this.addDctDialogVisible=false;
    },

    //编辑
    editDctDialogShow(item){//打开编辑弹框 获取编辑参数
      // console.log(item)
      this.editDctDialogVisible=true;

      this.editDirectiveOrgin.confName=item.confName;//保存改之前的旧数据用于发送请求
      this.editDirectiveOrgin.confParam=item.confParam;

      this.editDirectiveform.instructName=item.confName;
      this.editDirectiveform.instructParam=item.confParam;
    },
    editDctEnsure(formname){//确认修改
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;

          // var srcdictatedata = "";
          // var dstdictatedata= "";
          // if(this.editDirectiveOrgin.instructParam!=""){
          //   srcdictatedata=Base64.encode(this.editDirectiveOrgin.instructParam);
          // }
          // if(this.editDirectiveform.instructParam!=""){
          //   dstdictatedata=Base64.encode(this.editDirectiveform.instructParam);
          // }

          axios.patch(_this.url,{
            "snodeId":_this.shadowObj.snodeId,
            "domainName":_this.domainObj.domainName,
            "domainPort":_this.domainObj.port,
            "locationName":_this.locationObj.name,
            "locationType":_this.locationObj.type,
            "oldConfName": _this.editDirectiveOrgin.confName,
            "oldConfParam": _this.editDirectiveOrgin.confParam,
            "confName": _this.editDirectiveform.instructName,
            "confParam": _this.editDirectiveform.instructParam 
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getLcCustomInstructData();
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

    //删除
    deletDirective(item){
      // console.log(item)
      const _this=this;
      _this.getDirectiveLoading=true;
      axios.delete(_this.url,{
        data:{
          snodeId:_this.shadowObj.snodeId,
          domainName:_this.domainObj.domainName,
          domainPort:_this.domainObj.port,
          locationName:_this.locationObj.name,
          locationType:_this.locationObj.type,
          oldConfName:item.confName,
          oldConfParam:item.confParam
        }
      }).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getLcCustomInstructData();
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