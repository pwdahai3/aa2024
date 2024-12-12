<!-- shadowlib config JS配置选项--><!--可删组件-->
<template>
  <div>
    <el-dialog width="55%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="sdShadowlibModalClose">
      <div class="dctBox">
        <el-button class="addGIBtn" type="primary" size="mini" @click="addSdlibDialogShow()">{{$t('lg.xinzpzx')}}</el-button>
        <h1 class="directiveTitle">{{$t('lg.jsjpzxx')}}</h1>
        <p class="nodata-box" v-show="Object.keys(shadowlibData).length==0">{{$t('lg.nodata')}}</p>
        <table class="table-bg" v-show="Object.keys(shadowlibData).length>0">
          <thead>
            <tr>
              <th>{{$t('lg.domain')}}</th>
              <th>{{$t('lg.peizhics')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,key) in shadowlibData" :key="key">
              <td>{{key}}</td>
              <td>
                <ul class="sdlibList">
                  <li><span>{{$t('lg.kuayugnsz')}}：</span>{{item.crossdomain?item.crossdomain:$t('lg.nosettp')}}</li>
                  <li><span>{{$t('lg.abianqgn')}}：</span><i :class="item.aclick?'el-icon-success font-green':'el-icon-warning'"></i> {{item.aclick?$t('lg.opened'):$t('lg.unopened')}}</li>
                  <li><span>{{$t('lg.bodyenfun')}}：</span><i :class="item.bodye?'el-icon-success font-green':'el-icon-warning'"></i> {{item.bodye?$t('lg.opened'):$t('lg.unopened')}}</li>
                  <li><span>{{$t('lg.websocketenfn')}}：</span><i :class="item.isws?'el-icon-success font-green':'el-icon-warning'"></i> {{item.isws?$t('lg.opened'):$t('lg.unopened')}}</li>
                </ul>
              </td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editSdlibDialogShow(key,item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="deletShadowlib(key)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="shadowlibLoading"></loading>
    </el-dialog>

    <!-- 增加JS配置选项弹框 -->
    <el-dialog width="70%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="addSdlibDialogVisible" :close-on-click-modal="false" :before-close="addSdlibDialogClose">
      <el-row>
        <el-col :span="12">
          <el-form ref="shadowlibform" :model="shadowlibform" :rules="shadowlibformRules" label-width="170px" style="margin-right:30px">
            <el-form-item :label="$t('lg.domain')" prop="domainName">
              <el-input v-model.trim="shadowlibform.domainName" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.kuayugnsz')" prop="crossdomain">
              <el-input v-model.trim="shadowlibform.crossdomain" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.kaiqiabianqign')" prop="aclick">
              <el-switch v-model="shadowlibform.aclick"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('lg.kaiqibodyjiamign')" prop="bodye">
              <el-switch v-model="shadowlibform.bodye"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('lg.kaiqiwebosketjiami')" prop="isws">
              <el-switch v-model="shadowlibform.isws"></el-switch>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="addSdlibListItem('shadowlibform')">{{$t('lg.add')}}</el-button>
              <el-button @click="addSdlibDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div>
            <p class="nodata-box" v-show="shadowlibList.length==0">{{$t('lg.nodata')}}</p>
            <div v-show="shadowlibList.length>0">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.domain')}}</th>
                    <th>{{$t('lg.peizhics')}}</th>
                    <th width="44"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in shadowlibList">
                    <td>{{item.domainName}}</td>
                    <td>
                      <ul class="sdlibList">
                        <li>{{$t('lg.kuayugnsz')}}：{{item.crossdomain?item.crossdomain:$t('lg.nosettp')}}</li>
                        <li>{{$t('lg.abianqgn')}}：{{item.aclick?$t('lg.opened'):$t('lg.unopened')}}</li>
                        <li>{{$t('lg.bodyenfun')}}：{{item.bodye?$t('lg.opened'):$t('lg.unopened')}}</li>
                        <li>{{$t('lg.websocketenfn')}}：{{item.isws?$t('lg.opened'):$t('lg.unopened')}}</li>
                      </ul>
                    </td>
                    <td class="text-center font-red fsize-12 cursor-pointer" @click="deletSdlibListItem(item)">{{$t('lg.delete')}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="margin-tb text-right"><el-button type="primary" @click="submitShadowlibList">{{$t('lg.confirm')}}</el-button></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <loading v-show="addShadowlibLoading"></loading>
    </el-dialog>

    <!-- 编辑单条JS配置选项弹框 -->
    <el-dialog width="45%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="editSdlibDialogVisible" :close-on-click-modal="false" :before-close="editSdlibDialogClose">
      <el-form :model="editShadowlibform" ref="editShadowlibform" :rules="editShadowlibformRules" label-width="170px">
        <el-form-item label="$t('lg.domain')" prop="domainName">
          <el-input v-model.trim="editShadowlibform.domainName" disabled></el-input>
        </el-form-item>
        <el-form-item label="$t('lg.kuayugnsz')" prop="crossdomain">
          <el-input v-model.trim="editShadowlibform.crossdomain" :placeholder="$t('lg.plzenter')"></el-input>
        </el-form-item>
        <el-form-item label="$t('lg.kaiqiabianqign')" prop="aclick">
          <el-switch v-model="editShadowlibform.aclick"></el-switch>
        </el-form-item>
        <el-form-item label="$t('lg.kaiqibodyjiamign')" prop="bodye">
          <el-switch v-model="editShadowlibform.bodye"></el-switch>
        </el-form-item>
        <el-form-item label="$t('lg.kaiqiwebosketjiami')" prop="isws">
          <el-switch v-model="editShadowlibform.isws"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editSdlibEnsure('editCmdform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="editSdlibDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editShadowlibLoading"></loading>
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
    isShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      url:'',//请求路径
      shadowlibLoading:false,
      shadowlibData:{},

      //增加
      addSdlibDialogVisible:false,
      shadowlibform:{
        domainName:'',
        crossdomain:'',
        aclick:false,
        bodye:false,
        isws:false
      },
      shadowlibformRules:{
        domainName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      
      //临时列表
      shadowlibList:[],
      addShadowlibLoading:false,
      
      //编辑
      editSdlibDialogVisible:false,
      editShadowlibform:{},
      editShadowlibformRules:{
        domainName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      editShadowlibLoading:false,
    }
  },
  methods:{
    getSdShadowlibData(){//获取JS配置选项
      return new Promise((resolve,reject)=>{
        const _this=this;
        const snodeId=_this.shadowObj.snodeId;
        _this.url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId;
     
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resData=res.data.data?res.data.data.configuration:{};

            //把数据中域名的‘_’转化成 ‘.’
            const targetData={}
            Object.keys(resData).forEach(item=>{
              const targetKey= item.split('_').join('.');
              targetData[targetKey]=resData[item];
            })
            _this.shadowlibData=targetData;//清空

            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    sdShadowlibModalClose(){
      this.$emit("setbysdShadowlibmodal",false);
    },

    //增加
    addSdlibDialogShow(){//显示添加弹框
      this.addSdlibDialogVisible=true;
    },
    addSdlibListItem(formname){//加入预览表格
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const sdlibObj = Object.assign({},this.shadowlibform);
          this.shadowlibList.push(sdlibObj);
          console.log(this.shadowlibList)
          // this.shadowlibform={//清空
          //   domainName:'',
          //   crossdomain:'',
          // }
        }
      });
    },
    deletSdlibListItem(item){//从预览表格里删除
      this.shadowlibList.splice(this.shadowlibList.indexOf(item),1);
    },
    submitShadowlibList(){//确认添加
      const _this=this;
      _this.addShadowlibLoading=true;

      let shadowlibObj={};
      _this.shadowlibList.forEach(ele=>{
        const targetKey= ele.domainName.split('.').join('_');// ‘_’取代用户输入域名里的‘.’
        shadowlibObj[targetKey]={
          "aclick": ele.aclick,
          "crossdomain": ele.crossdomain,
          "bodye": ele.bodye,
          "isws": ele.isws
        }
      })
      axios.patch(_this.url,shadowlibObj).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.addSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    addSdlibDialogClose(){
      this.shadowlibList=[];
      this.$refs['shadowlibform'].resetFields();
      this.addSdlibDialogVisible=false;
    },

    //编辑
    editSdlibDialogShow(key,item){//打开编辑弹框
      this.editSdlibDialogVisible=true;
      this.editShadowlibform=Object.assign({},item);//克隆对象  this.editShadowlibform=item;改变了原对象
      this.editShadowlibform.domainName=key;
    },
    editSdlibEnsure(){//确认修改
      const _this=this;
      _this.editShadowlibLoading=true;

      let shadowlibObj={};
      const domainName = _this.editShadowlibform.domainName;
      const targetKey = domainName.split('.').join('_');// ‘_’取代用户输入域名里的‘.’
      shadowlibObj[targetKey]={
        "aclick": _this.editShadowlibform.aclick,
        "crossdomain": _this.editShadowlibform.crossdomain,
        "bodye": _this.editShadowlibform.bodye,
        "isws": _this.editShadowlibform.isws
      };
  
      axios.patch(_this.url,shadowlibObj).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.editSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data);
        }
        _this.editShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    editSdlibDialogClose(){
      this.editSdlibDialogVisible=false;
    },

    //删除
    deletShadowlib(key){
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      const domainName = key.split('.').join('_');
      const url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?domain="+domainName;

      _this.shadowlibLoading=true;
      axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.shadowlibLoading=false;
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
.sdlibList{

}
.sdlibList li{
  line-height: 22px;
}
.sdlibList li i{
  font-size: 12px;
}
.dctBox{
  background: #f8f8f8;
  padding: 12px;
  position: relative;
}
</style>