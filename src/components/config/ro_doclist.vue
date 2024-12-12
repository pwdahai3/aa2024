<!-- 文件管理 -->
<template>
  <div>
    <el-dialog width="65%" :title="$t('lg.filemanage')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="roDoclistClose">
      <div class="grid-content">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="uploadActionUri"
          :headers="uploadheader"
          :on-change="onchange"
          :before-upload="beforeupload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="onsuccess"
          :auto-upload="false"
          :file-list="fileList"
          ><!-- accept=".key,.conf,.pem" -->
          <el-button slot="trigger" size="small" type="primary">{{$t('lg.selectfile')}}</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{$t('lg.upload')}}</el-button>
          <div slot="tip" class="el-upload__tip">{{$t('lg.uploadtips')}}</div>
        </el-upload>
        <div style="margin-bottom: 20px; margin-top:30px;">
          <el-radio-group v-model="doclist" @change="doclistChange">
            <el-radio label="conf" border size="small">CONF</el-radio>
            <el-radio label="key" border size="small">KEY</el-radio>
            <el-radio label="crt" border size="small">CRT</el-radio>
            <el-radio label="pem" border size="small">PEM</el-radio>
          </el-radio-group>
        </div>
        <div>
          <div v-if="doclist=='conf'" style="margin-bottom: 50px;">
            <p v-if="data.length==0">{{$t('lg.nodata')}}</p>
            <table class="doclist-table" v-if="data.length>0">
              <thead>
                <th style="width:140px">{{$t('lg.uploadtime')}}</th>
                <th>{{$t('lg.file')}}</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in data">
                  <td>{{item.timestamp|toSDDate2}}</td>
                  <td>
                    <div class="fl">{{item.name}}</div>
                    <div class="fr tdshadownode-cls" ref="tdshadownode">
                      <el-form ref="shadownodesform" :model="shadownodesform" :rules="shadownodesformRules" label-width="0px">
                        <el-form-item label="" prop="shadownodes">
                          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" @change="selectNode(shadownodesform.shadownodes,item.name,'conf')">
                            <template v-for="n in nodesdata">
                              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                  </td>
                  <td width="325" class="text-center">
                    <a ref="tddownload" href="javascript:;" @click="downloadConf('conf',item.name,index)" class="edit-del-a"><i class="el-icon-download"></i>{{$t('lg.downloadconfig')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="pushDoc(item,index)"><i class="el-icon-share"></i>{{$t('lg.pushconfig')}}</a>
                    <a href="javascript:;" class="edit-del-a"><el-checkbox class="checkStyle" v-model="item.ischecked"><span class="checkSpan">{{$t('lg.chosecombine')}}</span></el-checkbox></a>
                    <!-- <a href="javascript:;" class="edit-del-a" @click="editDoc(item.name)" ><i class="el-icon-edit"></i>{{$t('lg.edit')}}</a> -->
                    <a href="javascript:;" class="edit-del-a" @click="delDoc(item.name,'conf')" ><i class="el-icon-delete"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <el-button class="fr" slot="trigger" size="small" type="primary" style="margin-top:20px;" @click="combineFile">{{$t('lg.combineconfig')}}</el-button>
          </div>
          <div v-if="doclist=='key'">
            <p v-if="keycrtData.length==0">{{$t('lg.nodata')}}</p>
            <table class="doclist-table" v-if="keycrtData.length>0">
              <thead>
                <th style="width:200px">{{$t('lg.uploadtime')}}</th>
                <th>{{$t('lg.file')}}</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in keycrtData">
                  <td>{{item.timestamp|toSDDate2}}</td>
                  <td>
                    <div class="fl">{{item.name}}</div>
                    <div class="fr tdshadownode-cls" ref="tdshadownode">
                      <el-form ref="shadownodesform" :model="shadownodesform" :rules="shadownodesformRules"  label-width="0px">
                        <el-form-item label="" prop="shadownodes">
                          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" @change="selectNode(shadownodesform.shadownodes,item.name,'key')">
                            <template v-for="n in nodesdata">
                              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                  </td>
                  <td width="200" class="text-center">
                    <a ref="tddownload" href="javascript:;" @click="downloadConf('key',item.name,index)"  class="edit-del-a"><i class="el-icon-download"></i>{{$t('lg.downloadcer')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="pushDoc(item,index)"><i class="el-icon-share"></i>{{$t('lg.pushcer')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="delDoc(item.name,'key')"><i class="el-icon-delete"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="doclist=='crt'">
            <p v-if="keycrtData.length==0">{{$t('lg.nodata')}}</p>
            <table class="doclist-table" v-if="keycrtData.length>0">
              <thead>
                <th style="width:200px">{{$t('lg.uploadtime')}}</th>
                <th>{{$t('lg.file')}}</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in keycrtData">
                  <td>{{item.timestamp|toSDDate2}}</td>
                  <td>
                    <div class="fl">{{item.name}}</div>
                    <div class="fr tdshadownode-cls" ref="tdshadownode">
                      <el-form ref="shadownodesform" :model="shadownodesform" :rules="shadownodesformRules"  label-width="0px">
                        <el-form-item label="" prop="shadownodes">
                          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" @change="selectNode(shadownodesform.shadownodes,item.name,'crt')">
                            <template v-for="n in nodesdata">
                              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                  </td>
                  <td width="200" class="text-center">
                    <a ref="tddownload" href="javascript:;" @click="downloadConf('crt',item.name,index)" class="edit-del-a"><i class="el-icon-download"></i>{{$t('lg.downloadcer')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="pushDoc(item,index)"><i class="el-icon-share"></i>{{$t('lg.pushcer')}}</a>
                    <a href="javascript:;" class="edit-del-a"  @click="delDoc(item.name,'crt')"><i class="el-icon-delete"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="doclist=='pem'">
            <p v-if="keycrtData.length==0">{{$t('lg.nodata')}}</p>
            <table class="doclist-table" v-if="keycrtData.length>0">
              <thead>
                <th style="width:200px">{{$t('lg.uploadtime')}}</th>
                <th>{{$t('lg.file')}}</th>
                <th></th>
              </thead>
              <tbody>
                <tr v-for="(item,index) in keycrtData">
                  <td>{{item.timestamp|toSDDate2}}</td>
                  <td>
                    <div class="fl">{{item.name}}</div>
                    <div class="fr tdshadownode-cls" ref="tdshadownode">
                      <el-form ref="shadownodesform" :model="shadownodesform" :rules="shadownodesformRules" label-width="0px">
                        <el-form-item label="" prop="shadownodes">
                          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" @change="selectNode(shadownodesform.shadownodes,item.name,'pem')">
                            <template v-for="n in nodesdata">
                              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                            </template>
                          </el-select>
                        </el-form-item>
                      </el-form>
                    </div>
                  </td>
                  <td width="200" class="text-center">
                    <a ref="tddownload" href="javascript:;" @click="downloadConf('pem',item.name,index)"  class="edit-del-a"><i class="el-icon-download"></i>{{$t('lg.downloadcer')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="pushDoc(item,index)"><i class="el-icon-share"></i>{{$t('lg.pushcer')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="delDoc(item.name,'pem')"><i class="el-icon-delete"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <loading v-show="selectnodeLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
    <el-dialog width="45%" :title="$t('lg.combineconfig')" :visible.sync="isCombineShow" :close-on-click-modal="false" :before-close="combineEnsureClose">
      <p class="tips">注：{{$t('lg.combinetips')}}</p>
      <el-form ref="combineform" :model="combineform" :rules="combineformRules"  label-width="100px">
        <el-form-item :label="$t('lg.configfilename')" prop="name">
          <el-input :placeholder="$t('lg.combinedfile')" v-model="combineform.name"></el-input>
        </el-form-item>
        <el-form-item style="margin-top:20px">
          <el-button type="primary" @click="combineEnsure('combineform')">{{$t('lg.confirmcombine')}}</el-button>
          <el-button @click="combineEnsureClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="combinenodeLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
    <editconfigtree :editFile="editFile" :isEditShow="isEditDocShow" @editDocShowclose="isEditDocShow=false"></editconfigtree>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar';
import editconfigtree from '@/components/config/editconfig';
export default{
  props:{
    isShow:{
      type:Boolean
    },
    data:{
      type:Array
    },
    nodesdata:{
      type:Array
    }
  },
  data(){
    return{
      uploadheader:{
        Authorization:'Bearer '+sessionStorage.getItem('mytoken')
      },
      fileList:[],
      uploadActionUri:"",
      doclistLoading:false,
      doclist:"conf",
      keycrtData:[],
      tdshadownodeShow:false,
      selectnodeLoading:false,
      shadownodesform:{
        shadownodes:""
      },
      shadownodesformRules:{},
      combinenodeLoading:false,
      isCombineShow:false,
      checkedArray:[],
      combineform:{
        name:''
      },
      combineformRules:{
        name:[
          {required: true, message: this.$t('lg.required'), trigger: 'change'},
          {pattern:/(\.conf)$/,message: this.$t('lg.confsuffix'), trigger: 'blur'},
        ]
      },
      isEditDocShow:false,//编辑配置文件
      editFile:'',//存当前被编辑的文件名
    }
  },
  mounted(){
    this.$on("updateRoDoclist",(type)=>{
      this.doclistChange(type)
    })
  },
  methods:{
    //文件上传相关操作
    roUploadfileClose(){
      this.fileList=[];
    },
    beforeupload(file){
      // console.log(file);
      var _this=this;
      const theFile = file.name;
      var arr=theFile.split(".");
      var getSuffix=arr[1];
      var fileName=arr[0];

      if(getSuffix=="crt" || getSuffix=="key" || getSuffix=="conf" || getSuffix=="pem"){
        if(getSuffix=="crt" || getSuffix=="key" || getSuffix=="pem"){
          if(fileName=="server"){
            this.$message.error(_this.$t('lg.noserver'));
            return false;
          }else{
            return true;
          }
        }else{
          return true;
        }
      }else{
        this.$message.error(_this.$t('lg.uploadtips'));
        return false;
      }

    },
    onchange(file){
      var arr=file.name.split(".");
      var getSuffix=arr[1];
      if(getSuffix=="crt" || getSuffix=="key" || getSuffix=="conf" || getSuffix=="pem"){
        this.uploadActionUri=SERVER_API_URL+"pe/upload/"+getSuffix;
      }
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onsuccess(res, file, fileList){
      // console.log(res)
      var _this=this;
      var fileType = file.name.split(".")[1];//上传文件的类型 crt, key, conf ,pem
      if(res.responseCode==0){
        this.$message({
          type: 'success',
          message: _this.$t('lg.success')
        });
        this.$emit("updateRoDoclist",fileType);
        this.roUploadfileClose();
      }else{
        this.$message.error(_this.$t('lg.failed')+': '+ res.data.message);
        this.fileList = [];//移除不合格文件
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},           

    //文件列表相关操作
    roDoclistClose(){
      this.$emit('rodoclistclose',false);
      if(this.$refs.tdshadownode){
        for(var i=0;i<this.$refs.tdshadownode.length;i++){
          this.$refs.tdshadownode[i].style.display="none";
        }
      }
    },
    doclistChange(type){//文件列表 查询key,crt文件
      var url=SERVER_API_URL+"pe/file/cm/"+type;
      axios.get(url).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          this.keycrtData=res.data.data
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    pushDoc(item,index){
      this.shadownodesform.shadownodes="";
      for(var i=0;i<this.$refs.tdshadownode.length;i++){
        this.$refs.tdshadownode[i].style.display="none";
      }
      var tgElement=this.$refs.tdshadownode[index];
      if(tgElement.style.display=="block"){
        tgElement.style.display="none";
      }else{
        tgElement.style.display="block";
      }
    },
    selectNode(obj,item,type){//推送配置
      // var filename = item.split(".")[0];
      this.selectnodeLoading=true;
      var url=SERVER_API_URL+"pe/file/"+type+"/"+item+"/"+obj;
      axios.put(url).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          this.$emit("updateRenderTree");
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.roDoclistClose();
        }else{
          const responseMsg=res.data.data.message;
          if(responseMsg.indexOf("duplicate") != -1){
            this.$message.error(this.$t('lg.failed')+':'+this.$t('lg.zhu71'));
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ responseMsg);
          }
        }
        this.selectnodeLoading=false;
      }).catch((err)=>{
        console.log(err);
        this.$message.error(this.$t('lg.failed')+': '+ err.data.message);
        this.selectnodeLoading=false;
        this.shadownodesform.shadownodes="";
      });
    },
    editDoc(obj){//编辑
      this.editFile=obj;
      this.isEditDocShow=true;
    },
    delDoc(obj,type){//删除 conf,key,crt文件
      var _this=this;
      this.selectnodeLoading=true;
      var url=SERVER_API_URL+"pe/file/cm/"+type+"/"+obj;
      axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$emit("updateRoDoclist",type)
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.selectnodeLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
    downloadConf(type,item,index){//下载配置、证书、
      var filetype = type;
      var filename = item;
      var token = sessionStorage.getItem('mytoken');
      var url=SERVER_API_URL+"pe/download/"+filetype +"/"+ filename+"?access_token="+token;
      if(/^[@#\$%\^]/.test(filename)){
        this.$message.error(this.$t('lg.failed1'));
        return;
      }
      var tgElement=this.$refs.tddownload[index];
      tgElement.setAttribute("href",url);
    },
    combineEnsureClose(){//取消合并配置文件，关闭弹框
      this.checkedArray=[];
      this.$refs['combineform'].resetFields();
      this.isCombineShow=false;
    },
    combineFile(){//合并配置文件
      var checkArray=this.data;
      // console.log(this.data)
      checkArray.forEach(element=>{
        if(element.ischecked){
          this.checkedArray.push(element);
        }
      });
      if(this.checkedArray.length!=2){
        this.checkedArray=[];
        this.$message.error(this.$t('lg.select2file'));
      }else{
        this.isCombineShow=true;
      }
    },
    combineEnsure(formname){//确认合并配置文件
      this.$refs[formname].validate((valid) => {
        if(valid){
          var srcFile1=this.checkedArray[0].name, 
              srcFile2=this.checkedArray[1].name, 
              targetFile=this.combineform.name;
          var url=SERVER_API_URL+"pe/shadow/config/combine?srcFile1="+srcFile1+"&srcFile2="+srcFile2+"&targetFile="+targetFile;
          this.combinenodeLoading=true;
          axios.post(url,{}).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.$emit("updateRoDoclist",'conf');
              this.combineEnsureClose();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
            }
            this.combinenodeLoading=false;
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    }
  },
  filters:{
    toSDDate2(val){
      if(!val) return;
      function transformMyDate(d){
        d=new Date(d);
        function pad(n){
          return n<10 ? '0'+n : n
        }
        return d.getFullYear()+"/"+pad(parseInt(d.getMonth())+1)+"/"+pad(d.getDate())+" "+pad(d.getHours())+':'+pad(d.getMinutes())+":"+pad(d.getSeconds());
      }
      return transformMyDate(val)
    }
  },
  components:{
    loading,
    editconfigtree
  }
}
</script>
<style scoped>
.el-form-item{  margin-bottom: 0}
.doclist-table td{ vertical-align:top}
.tdshadownode-cls{ display:none;}
.checkStyle{font-size:12px;color:#888;margin-right: 0px;}
.checkSpan{font-size:12px;margin-left: -6px;}
</style>
