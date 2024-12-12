<!-- domain全局自定义指令 -->
<template>
  <div>
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="isShow" :close-on-click-modal="false" :before-close="dmGlbInstructClose">
      <div class="dctBox">
        <el-button class="addGIBtn" type="primary" size="mini" @click="addGIDialogShow()">{{$t('lg.xinzzdypz')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.zidingyipz')}}</h1>
        <p class="nodata-box" v-show="directiveData.length==0">{{$t('lg.nodata')}}</p>
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
              <td>{{item.dctName}}</td>
              <td>{{item.dctParam}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editGIDialogShow(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deletGlbInstruct(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="glbInstructLoading"></loading>
    </el-dialog>
    <!-- 增加自定义指令弹框 -->
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="addGIDialogVisible" :close-on-click-modal="false" :before-close="addGIDialogClose">
          <el-form ref="glbInstructform" :model="glbInstructform" :rules="glbInstructformRules" label-width="160px" style="margin-right:30px">
            <el-form-item :label="$t('lg.peizhimc')" prop="instructName">
              <el-input v-model.trim="glbInstructform.instructName" :placeholder="$t('lg.peizhimc')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.peizhics')" prop="instructParam">
              <el-input v-model.trim="glbInstructform.instructParam" :placeholder="$t('lg.peizhics')"></el-input>
            </el-form-item>
            <el-form-item>
              <!-- <el-button type="primary" @click="addGIListItem('glbInstructform')">{{$t('lg.add')}}</el-button> -->
              <el-button type="primary" @click="submitGlbInstructList('glbInstructform')">{{$t('lg.add')}}</el-button>
              <el-button @click="addGIDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="addGlbInstructLoading"></loading>
    </el-dialog>

    <!-- 编辑单条自定义指令弹框 -->
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="editGIDialogVisible" :close-on-click-modal="false" :before-close="editGIDialogClose">
      <el-form :model="editInstructform" ref="editInstructform" :rules="editInstructformRules" label-width="80px">
        <el-form-item :label="$t('lg.peizhimc')" prop="dctName">
          <el-input v-model.trim="editInstructform.dctName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.peizhics')" prop="dctParam">
          <el-input v-model.trim="editInstructform.dctParam" :placeholder="$t('lg.peizhics')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editGIEnsure('editCmdform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="editGIDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editGlbInstructLoading"></loading>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
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
    }
  },
  data(){
    return{
      url:'',//请求路径
      glbInstructLoading:false,
      directiveData:[],

      //增加
      addGIDialogVisible:false,
      glbInstructform:{
        instructName:'',
        instructParam:''
      },
      glbInstructformRules:{
        instructName:[
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
    }
  },
  methods:{
    getDmGlbInstructData(){//获取自定义指令
      return new Promise((resolve,reject)=>{
        const _this=this;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/domain/directive?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/domain/directive?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/domain/directive";
        }
        axios.get(_this.url,{
          params:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
          }
        }).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resData=res.data.data || [];
            _this.directiveData=[];//清空
           
            resData.forEach(item=>{
              _this.directiveData.push({
                dctName:Object.keys(item)[0],
                dctParam:Base64.decode(item[Object.keys(item)[0]])
              })
            })
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    dmGlbInstructClose(){
      this.$emit("setbydmGlbInstructmodal",false);
    },

    //增加
    addGIDialogShow(){//显示添加弹框
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
      const snodeId=_this.shadowObj.snodeId;
      const domainName=_this.domainObj.domainName;
      const domainPort=_this.domainObj.port;
      let directivesArr=[
        {
          [this.glbInstructform.instructName]:Base64.encode(this.glbInstructform.instructParam)
        }
      ];
      axios.post(_this.url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getDmGlbInstructData();
          _this.addGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
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
    editGIDialogShow(item,type){//打开编辑弹框
      this.editGIDialogVisible=true;
      this.editInstructOldform=item;
      this.editInstructform=Object.assign({},item);//克隆对象  this.editInstructform=item;改变了原对象
    },
    editGIEnsure(){//确认修改
      const _this=this;
      _this.editGlbInstructLoading=true;

      const snodeId=_this.shadowObj.snodeId;
      const domainName=_this.domainObj.domainName;
      const domainPort=_this.domainObj.port;

      const directiveName=_this.editInstructOldform.dctName;
      const srcData=Base64.encode(_this.editInstructOldform.dctParam);
      const targetData=Base64.encode(_this.editInstructform.dctParam);
      axios.patch(_this.url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        directiveName:directiveName,
        srcData:srcData,
        targetData:targetData,
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getDmGlbInstructData();
          _this.editGIDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
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
     
      const snodeId=_this.shadowObj.snodeId;
      const domainName=_this.domainObj.domainName;
      const domainPort=_this.domainObj.port;

      let directivesArr=[];
      directivesArr.push({
        [item.dctName]:Base64.encode(item.dctParam)
      })
      axios.delete(_this.url,{
        data:{
          snodeId:snodeId,
          domainName:domainName,
          domainPort:domainPort,
          directives:directivesArr
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getDmGlbInstructData();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.glbInstructLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
  },
}
</script>

<style scoped>
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
.dctBox{
  background: #f8f8f8;
  padding: 12px;
  position: relative;
}
</style>