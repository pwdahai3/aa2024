<template>
  <div class="license-wrapper">
    <div class="license-file">
      <p class="license-tip">导出导入数据</p>
      <div class="grid-content">
        <div style="margin-bottom:28px;border-bottom:1px dashed #ccc; padding-bottom:18px">
          <p style="margin-bottom:14px">导出配置</p>
          <el-button type="primary" @click="exportfile">导出</el-button>
        </div>
        <div>
          <p style="margin-bottom:14px">导入配置</p>
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
          <!-- <div slot="tip" class="el-upload__tip">{{$t('lg.applicationlicense')}}</div> -->
        </el-upload>
        </div>
        
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
    
  },
  data(){
    return{
      uploadheader:{
        Authorization:'Bearer '+sessionStorage.getItem('mytoken')
      },
      fileList:[],
      uploadActionUri:SERVER_API_URL+"pe/shadow/import",
      rootokenlicenseData:'',
    }
  },
  methods:{
    exportfile(){
      let _this=this;
      var newdate=new Date().getTime();
      var filename="config_backup_"+newdate+".json";
      var url=SERVER_API_URL+"pe/shadow/export";
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        })
        .then((response) => {
          var blob=new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
         // var filename=new Date().getTime()+".csv"
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, filename);
          }else{
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);    
          }  
        })

    },

    authUploadfileClose(){
      this.fileList=[];
      this.$emit("authuploadfileclose");
    },
    beforeupload(file){
      // var filename=file.name;
      // var _this=this;
      // if(filename){
      //   if(filename!="application-license.yml"){
      //     this.$message.error(_this.$t('lg.applicationlicense'));
      //     return false;
      //   }else{
      //     return true;
      //   }
      // }
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
  margin-bottom: 20px;
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
