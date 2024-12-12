<!-- 文件管理 -->
<template>
  <div>
    <el-dialog width="65%" :title="$t('lg.filemanage')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="importClose">
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
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">{{$t('lg.import')}}</el-button>
        </el-upload>
      </div>
      <!-- <loading v-show="selectnodeLoading" :title="$t('lg.handling')"></loading> -->
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
export default{
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      uploadheader:{
        Authorization:'Bearer '+sessionStorage.getItem('mytoken')
      },
      fileList:[],
      uploadActionUri:"",
      doclistLoading:false
    }
  },
  mounted(){
    // this.$on("updateRoDoclist",(type)=>{
    //   this.doclistChange(type)
    // })
  },
  methods:{
    //文件上传相关操作
    importClose(){
      this.$emit('importclose',false);
    },
    roUploadfileClose(){
      this.fileList=[];
    },
    beforeupload(file){
    },
    onchange(file){
      this.uploadActionUri=SERVER_API_URL+"waf/rule/import";
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
      //  this.roUploadfileClose();
      }else{
        this.$message.error(_this.$t('lg.importfailed'));
        this.fileList = [];//移除不合格文件
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},           
  },
  components:{
    loading
  }
}
</script>
<style scoped>

</style>
