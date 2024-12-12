<template>
  <div class="license-wrapper">
    <div class="license-file">
      <p class="license-tip">{{$t('lg.authorization')}}</p>
      <div class="grid-content">
        <el-upload
          class="upload-demo"
          ref="upload"
          :headers="uploadheader"
          :before-upload="beforeupload"
          :action="uploadActionUri"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="onsuccess"
          :file-list="fileList">
          <el-button slot="trigger" size="small" type="primary" class="el-icon-upload">&nbsp;&nbsp;{{$t('lg.selectfile')}}</el-button>
          <div slot="tip" class="el-upload__tip">{{$t('lg.applicationlicense')}}</div>
        </el-upload>
      </div>
    </div>
    <div class="license-token">
      <p class="license-tip">{{$t('lg.authtoken')}}</p>
      <div class="token-txt">
        <p class="empTip" v-if="rootokenlicenseData==''">{{$t('lg.nodata')}}</p>
        {{rootokenlicenseData}}
        <!-- <el-button class="downloadBtn" slot="trigger" size="small" type="success" icon="el-icon-download" @click="downloadToken">下载授权TOKEN</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as types from '@/store/types'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
export default {
  created(){
    this.licenseToken();
  },
  data(){
    return{
      uploadheader:{
        Authorization:'Bearer '+sessionStorage.getItem('mytoken')
      },
      fileList:[],
      uploadActionUri:SERVER_API_URL+"pe/upload/license",
      rootokenlicenseData:'',
    }
  },
  methods:{
    licenseToken(){//查询Token
      var _this=this;
      _this.$store.state.contentLoading=true;
      var url=SERVER_API_URL+"pe/license/token";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          _this.$store.state.contentLoading=false;
          _this.rootokenlicenseData=res.data.data;
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    authUploadfileClose(){
      this.fileList=[];
      this.$emit("authuploadfileclose");
    },
    beforeupload(file){
      var filename=file.name;
      var _this=this;
      if(filename){
        if(filename!="application-license.yml"){
          this.$message.error(_this.$t('lg.applicationlicense'));
          return false;
        }else{
          return true;
        }
      }
    },
    submitUpload(file){
      this.$refs.upload.submit();
    },
    onsuccess(res, file, fileList){
      // console.log(res)
      if(res.responseCode==0){
        this.$message({
          type: 'success',
          message: this.$t('lg.success')
        });
        this.licenseToken();
        this.fileList = [];//上传成功后移除文件列表
      }else{
        this.$message.error(this.$t('lg.failed')+": "+res.reason);
      }
    },
    downloadToken(){//文件下载 下载授权TOKEN
        
    },
    handleRemove(file, fileList) {
      // console.log("remove")
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log("preview")
      // console.log(file);
    },
  },
}
</script>

<style scoped>
/deep/ .el-upload{ text-align: left;}
.license-file, .license-token{
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  height: 140px;
}
.license-tip{
  margin-bottom: 10px;
  font-size: 18px;
  color: #303133;
}
.token-txt{
  width: 100%;
  min-height:180px;
  word-break: break-all;
  padding: 20px;
  padding-bottom: 65px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 24px;
  color:#606266;
  border:solid 1px #e6e6e6;
  border-radius: 10px;
  position: relative;
}
.downloadBtn{
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.empTip{
  text-align: center;
}
</style>
