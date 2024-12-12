<!-- shadow全局自定义指令 -->
<template>
  <div>
    <el-dialog width="55%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdGlbInstructClose">
      <div class="httpDctBox">
        <el-button class="addGIBtn" type="primary" size="mini" @click="addGIDialogShow(true)">{{$t('lg.xinzhttppz')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.diyhttp')}}</h1>
        <p class="nodata-box" v-show="directiveData.httpDctList.length==0">{{$t('lg.nodata')}}</p>
        <table class="table-bg" v-show="directiveData.httpDctList.length>0">
          <thead>
            <tr>
              <th>{{$t('lg.peizhimc')}}</th>
              <th>{{$t('lg.peizhics')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData.httpDctList">
              <td>{{item.dctName}}</td>
              <td>{{item.dctParam}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editGIDialogShow(item,true)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deletGlbInstruct(item,true)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="httpDctBox" style="margin-top:26px">
        <el-button class="addGIBtn" type="primary" size="mini" @click="stream_addGIDialogShow()">新增stream配置</el-button>
        <h1 class="directiveTitle">{{$t('lg.streamzdy')}}</h1>
        <p class="nodata-box" v-show="streamlist_new.length==0">{{$t('lg.nodata')}}</p>
        <table class="table-bg" v-show="streamlist_new.length>0">
          <thead>
            <tr>
              <th>{{$t('lg.peizhimc')}}配置名称</th>
              <th>{{$t('lg.peizhics')}}配置参数</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in streamlist_new">
              <td>{{item.myKey}}</td>
              <td>{{item.myVal}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editStreamShownew(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deleteStreamnew(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
        <loading v-show="stream_GlbInstructLoading"></loading>
      </div>

      <div class="globalDctBox">
        <el-button class="addGIBtn" type="primary" size="mini" @click="addGIDialogShow(false)">新增global配置</el-button>
        <h1 class="directiveTitle">global块自定义配置</h1>
        <p class="nodata-box" v-show="directiveData.globalCustomDirectives.length==0">{{$t('lg.nodata')}}</p>
        <table class="table-bg" v-show="directiveData.globalCustomDirectives.length>0">
          <thead>
            <tr>
              <th>配置参数</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in directiveData.globalCustomDirectives">
              <td>{{item.myKey}} {{item.myVal}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editGIDialogShow(item,false)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deletGlbInstruct(item,false)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="glbInstructLoading"></loading>
    </el-dialog>

    <!-- 增加自定义指令弹框 -->
    <el-dialog width="65%" :title="directiveHttp?shadowObj.name+' ['+shadowObj.snodeId+']--新增http自定义配置':shadowObj.name+' ['+shadowObj.snodeId+']--新增global块自定义配置'" :visible.sync="addGIDialogVisible" :close-on-click-modal="false" :before-close="addGIDialogClose">
          <el-form ref="glbInstructform" :model="glbInstructform" :rules="glbInstructformRules" label-width="80px" style="margin-right:30px">
            <!-- <el-form-item label="配置名称" prop="instructName">
              <el-input v-model.trim="glbInstructform.instructName" placeholder="请输入配置名称"></el-input>
            </el-form-item>
            <el-form-item label="配置参数" prop="instructParam">
              <el-input v-model.trim="glbInstructform.instructParam" placeholder="请输入配置参数"></el-input>
            </el-form-item> -->
            <el-form-item label="配置" prop="directives">
              <el-input type="textarea" :rows="6"  v-model.trim="glbInstructform.directives"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitGlbInstructList('glbInstructform')">{{$t('lg.add')}}</el-button>
              <el-button @click="addGIDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="addGlbInstructLoading"></loading>
    </el-dialog>

    <!-- 编辑单条自定义指令弹框 -->
    <el-dialog width="40%" :title="directiveHttp?shadowObj.name+' ['+shadowObj.snodeId+']--修改http自定义配置':shadowObj.name+' ['+shadowObj.snodeId+']--修改global块自定义配置'" :visible.sync="editGIDialogVisible" :close-on-click-modal="false" :before-close="editGIDialogClose">
      <el-form :model="editInstructform" ref="editInstructform" :rules="editInstructformRules" label-width="80px">
        <!-- <el-form-item label="配置名称" prop="dctName">
          <el-input v-model.trim="editInstructform.dctName" disabled></el-input>
        </el-form-item>
        <el-form-item label="配置参数" prop="dctParam">
          <el-input v-model.trim="editInstructform.dctParam" placeholder="请输入配置参数"></el-input>
        </el-form-item> -->
        <el-form-item label="配置" prop="directives">
              <el-input type="textarea" :rows="6"  v-model.trim="editInstructform.directives"></el-input>
            </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editGIEnsure('editCmdform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="editGIDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editGlbInstructLoading"></loading>
    </el-dialog>

    <el-dialog width="65%" :title="shadowObj.name+' ['+shadowObj.snodeId+']--新增stream自定义配置'" :visible.sync="stream_addGIDialogVisible" :close-on-click-modal="false" :before-close="stream_addGIDialogClose">
          <el-form ref="stream_glbInstructform" :model="stream_glbInstructform" :rules="glbInstructformRules" label-width="80px" style="margin-right:30px">
            <el-form-item label="配置名称" prop="instructName">
              <el-input v-model.trim="stream_glbInstructform.instructName" placeholder="请输入配置名称"></el-input>
            </el-form-item>
            <el-form-item label="配置参数" prop="instructParam">
              <el-input v-model.trim="stream_glbInstructform.instructParam" placeholder="请输入配置参数"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="stream_submitGlbInstructList('stream_glbInstructform')">{{$t('lg.add')}}</el-button>
              <el-button @click="stream_addGIDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="stream_GlbInstructLoading"></loading>
    </el-dialog>

    <el-dialog width="65%" :title="shadowObj.name+' ['+shadowObj.snodeId+']--编辑stream自定义配置'" :visible.sync="stream_editGIDialogVisible" :close-on-click-modal="false" :before-close="stream_addGIDialogClose">
          <el-form ref="stream_glbInstructform" :model="stream_glbInstructform" :rules="glbInstructformRules" label-width="80px" style="margin-right:30px">
            <el-form-item label="配置名称" prop="instructName">
              <el-input v-model.trim="stream_glbInstructform.instructName" disabled></el-input>
            </el-form-item>
            <el-form-item label="配置参数" prop="instructParam">
              <el-input v-model.trim="stream_glbInstructform.instructParam"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="stream_editsubmit('stream_glbInstructform')">确定</el-button>
              <el-button @click="stream_addGIDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="stream_GlbInstructLoading"></loading>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import gptloading from '@/components/loading/gptloading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'
export default {
  components:{
    loading,
    gptloading
   // quillEditor
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
    }
  },
  data(){
    return{
      stream_editGIDialogVisible:false,
      streamlist_new:[],
      stream_GlbInstructLoading:false,
      stream_glbInstructform:{
        instructName:'',
        instructParam:''
      },
      stream_addGIDialogVisible:false,
      globalCustomDirectives:[],
      glbInstructLoading:false,
      directiveData:{
        httpDctList:[],
        globalDctList:[],
        globalCustomDirectives:[]
      },

      directiveHttp:false,//区分两种类型的自定义指令,为true表示http，为false表示 global块的自定义指令

      //增加
      addGIDialogVisible:false,
      glbInstructform:{
        instructName:'',
        instructParam:'',
        directives:''
      },
      glbInstructformRules:{
        instructName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ],
        directives:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ],
        instructParam:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ],
      },
      glbInstructList:[],
      addGlbInstructLoading:false,
      
      //编辑
      editGIDialogVisible:false,
      editInstructform:{},
      editInstructformRules:{
        dctName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ],
      },
      editInstructOldform:{},//编辑服务器临时容器,被编辑的当前项
      editGlbInstructLoading:false,
      oriEditStream:{},
      editStream:{}
    }
  },
  watch:{
    'isShow':function(){
      this.getSdGlbInstructData_new();
      this.getStream_new();
    }
  },
  methods:{
    editStreamShownew(item){
      this.stream_editGIDialogVisible=true;
      this.editStream=item;
      this.stream_glbInstructform.instructName=item.myKey;
      this.stream_glbInstructform.instructParam=item.myVal;
      this.oriEditStream=Object.assign({},item);
    },
    stream_editsubmit(formname){
      const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          _this.stream_GlbInstructLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"?autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/stream/directive";
      }
      const snodeId=_this.shadowObj.snodeId;
      const directiveName=_this.stream_glbInstructform.instructName;
      const srcData=Base64.encode(_this.oriEditStream.myVal);
      const targetData=Base64.encode(_this.stream_glbInstructform.instructParam);
      axios.patch(url,{
        snodeId:snodeId,
        directiveName:directiveName,
        srcData:srcData,
        targetData:targetData,
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getStream_new();
          _this.stream_addGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
        }
        _this.stream_GlbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
        }});
      
    },
    deleteStreamnew(item){
     // console.log(item)
      const _this=this;
      _this.stream_GlbInstructLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"?autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/stream/directive";
      }
      const snodeId=_this.shadowObj.snodeId;
      let directivesArr=[];
      directivesArr.push({
        [item.myKey]:Base64.encode(item.myVal)
      })
      axios.delete(url,{
        data:{  
          snodeId:snodeId,
          directives:directivesArr
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getStream_new();
          _this.stream_addGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
        }
        _this.stream_GlbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    stream_addGIDialogClose(){
      this.stream_glbInstructform={
        instructName:'',
        instructParam:''
      };
      this.$refs['stream_glbInstructform'].resetFields();
      this.stream_addGIDialogVisible=false;
      this.stream_editGIDialogVisible=false;
    },
    stream_submitGlbInstructList(formname){//确认添加
      const _this=this;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/stream/directive"+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/stream/directive";
      }
      
      this.$refs[formname].validate((valid) => {
        if (valid) {
             const snodeId=_this.shadowObj.snodeId;
             _this.stream_GlbInstructLoading=true;
             axios.post(url,{
              snodeId:snodeId,
              directives:[{
                [_this.stream_glbInstructform.instructName]:Base64.encode(_this.stream_glbInstructform.instructParam) 
              }
              ]
             }).then((res)=>{
              if(res.data.responseCode==0){
                _this.$message({
                        type: 'success',
                        message: _this.$t('lg.success')
                      });
                      _this.getStream_new();
                      _this.stream_addGIDialogClose();
                    }else{
                      _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
                    }
                    _this.stream_GlbInstructLoading=false;
             }) 
        }
      });     
    },
    stream_addGIDialogShow(){//显示添加弹框
      this.stream_addGIDialogVisible=true;
    },
    getStream_new(){//获取自定义指令
      const _this=this;
      _this.streamlist_new=[];
        const snodeId=_this.shadowObj.snodeId;
        let url='';
        if(_this.isAuto){
          url=SERVER_API_URL+"pe/shadow/stream/directive?snodeId="+snodeId+"&autoconfig=true";
        }else if(_this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/stream/directive?snodeId="+snodeId+"&savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/stream/directive?snodeId="+snodeId;
        }
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const resData=res.data.data.globalStreamDirectives;
            resData.forEach(item=>{
                _this.streamlist_new.push({
                  myKey:Object.keys(item)[0],
                  myVal:Base64.decode(item[Object.keys(item)[0]]) 
                })
              })
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
    },
    getSdGlbInstructData_new(){//获取自定义指令
      return new Promise((resolve,reject)=>{
        const _this=this;
        const snodeId=_this.shadowObj.snodeId;
        let url='';
        if(_this.isAuto){
          url=SERVER_API_URL+"pe/shadow/global/custom/directive?snodeId="+snodeId+"&autoconfig=true";
        }else if(_this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/global/custom/directive?snodeId="+snodeId+"&savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/global/custom/directive?snodeId="+snodeId;
        }
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const resData=res.data.data;
            _this.directiveData.globalCustomDirectives=[];
            if(resData.globalCustomDirectives){
              resData.globalCustomDirectives.forEach(item=>{
                _this.directiveData.globalCustomDirectives.push({
                  myKey:Object.keys(item)[0],
                  myVal:item[Object.keys(item)[0]]
                })
              })
            }
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    getSdGlbInstructData(){//获取自定义指令
      return new Promise((resolve,reject)=>{
        const _this=this;
        const snodeId=_this.shadowObj.snodeId;
        let url='';
        if(_this.isAuto){
          url=SERVER_API_URL+"pe/shadow/global/directive?snodeId="+snodeId+"&autoconfig=true";
        }else if(_this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/global/directive?snodeId="+snodeId+"&savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/global/directive?snodeId="+snodeId;
        }

        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const resData=res.data.data;
            _this.directiveData.httpDctList=[];//清空
            _this.directiveData.globalCustomDirectives=[];

            if(resData.httpDirectives){
              resData.httpDirectives.forEach(item=>{
                _this.directiveData.httpDctList.push({
                  dctName:Object.keys(item)[0],
                  dctParam:Base64.decode(item[Object.keys(item)[0]])
                })
              })
            }
            // if(resData.globalCustomDirectives){
            //   resData.globalCustomDirectives.forEach(item=>{
            //     _this.directiveData.globalCustomDirectives.push({
            //       myKey:Object.keys(item)[0],
            //       myVal:Base64.decode(item[Object.keys(item)[0]])
            //     })
            //   })
            // }
           // _this.directiveData.globalCustomDirectives=resData.globalCustomDirectives;
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    sdGlbInstructClose(){
      this.$emit("setbysdGlbInstructmodal",false);
    },

    //增加
    addGIDialogShow(type){//显示添加弹框 type: true||false
      this.directiveHttp=type;
      this.addGIDialogVisible=true;
    },
    addGIListItem(formname){//加入预览表格
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.glbInstructList.push(this.glbInstructform);
          // this.glbInstructform={//清空
          //   instructName:'',
          //   instructParam:'',
          // }
        }
      });
    },
    deletGIListItem(item){//从预览表格里删除
      this.glbInstructList.splice(this.glbInstructList.indexOf(item),1);
    },
    submitGlbInstructList(formname){//确认添加
      const _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          _this.addGlbInstructLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/custom/directive"+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/custom/directive"+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/custom/directive";
      }
      const snodeId=_this.shadowObj.snodeId;
      let directivesArr=[{
        [this.glbInstructform.instructName]:Base64.encode(this.glbInstructform.instructParam)
      }];
      let data2={
        snodeId:snodeId,
        directives:this.glbInstructform.directives
      };
      axios.post(url,data2).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdGlbInstructData_new();
          _this.addGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
        }
        _this.addGlbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
        }
      });

      
    },
    addGIDialogClose(){
      this.glbInstructList=[];
      this.$refs['glbInstructform'].resetFields();
      this.addGIDialogVisible=false;
    },

    //编辑
    editGIDialogShow(item,type){
      this.directiveHttp=type;
      this.editGIDialogVisible=true;
      this.editInstructOldform=item;
      this.editInstructform=Object.assign({},item);//克隆对象  this.editInstructform=item;改变了原对象
    },
    editGIEnsure(){//确认修改
      const _this=this;
      _this.editGlbInstructLoading=true;

      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+_this.directiveHttp+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+_this.directiveHttp+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+_this.directiveHttp;
      }
      const snodeId=_this.shadowObj.snodeId;
      const directiveName=_this.editInstructOldform.dctName;
      const srcData=Base64.encode(_this.editInstructOldform.dctParam);
      const targetData=Base64.encode(_this.editInstructform.dctParam);
      axios.patch(url,{
        snodeId:snodeId,
        directiveName:directiveName,
        srcData:srcData,
        targetData:targetData,
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdGlbInstructData();
          _this.editGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
        }
        _this.editGlbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })

    },
    editGIDialogClose(){
      this.editGIDialogVisible=false;
    },

    //删除
    deletGlbInstruct(item,type){
      const _this=this;
      _this.glbInstructLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+type+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+type+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/directive?http="+type;
      }
      const snodeId=_this.shadowObj.snodeId;
      let directivesArr=[];
      directivesArr.push({
        [item.dctName]:Base64.encode(item.dctParam)
      })
      axios.delete(url,{
        data:{
          snodeId:snodeId,
          directives:directivesArr
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdGlbInstructData();
        }else{
          _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
        }
        _this.glbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
  },
  filters:{
    remmoveObjK(value){
      return JSON.stringify(value).slice(1,-1);
    },
    forString(value){
      return '"'+value+'"'
    }
  }
}
</script>

<style scoped>
.httpDctBox{
  background: #f8f8f8;
  padding: 12px;
  position: relative;
}
.globalDctBox{
  margin-top: 30px;
  background: #f8f8f8;
  padding: 12px;
  position: relative;
}
.addGIBtn{
  position: absolute;
  right: 12px;
  top: 12px;
}
.directiveTitle{
  font-size: 18px; 
  color: #333; 
  margin:5px 0 15px;
}
</style>
