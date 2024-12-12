<template><!--可删组件-->
  <div>
    <el-dialog width="45%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="lcRootModalClose">
      <div class="lcRootBox">
        <el-button class="addRootBtn" type="primary" size="mini" @click="addLcRoot()" :disabled="lcRootData.root!==''">添加网站目录</el-button>
        <p class="nodata-box" v-if="!lcRootData.root">{{$t('lg.nodata')}}</p>
        <table class="lcRoot-table" v-else>
          <thead>
            <tr>
              <th>{{$t('lg.wangzhanml')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{lcRootData.root}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editLcRoot(lcRootData.root)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="delLcRoot"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="lcRootModalLoading"></loading>
    </el-dialog>

    <!-- 编辑、添加弹框 -->
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShowRootDialog" :close-on-click-modal="false" :before-close="rootDialogClose">
      <el-form ref="lcRootform" :model="lcRootform" :rules="lcRootformRules" :label-width="$store.state.isencn=='en'?'142px':'90px'">
        <el-form-item :label="$t('lg.wangzhanml')" prop="lcRoot">
          <el-input v-model.trim="lcRootform.lcRoot" placeholder="/root"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveLcRoot">{{$t('lg.save')}}</el-button>
          <el-button @click="rootDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="lcRootEditLoading"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
export default{
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
      lcRootModalLoading:false,
      lcRootData:{},
      
      isShowRootDialog:false,
      lcRootEditLoading:false,
      lcRootform:{
        lcRoot:'',
      },
      lcRootformRules:{
        lcRoot:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      }
    }
  },
  methods:{
    getLcRootData(){//获取Location Root数据
      return new Promise((resolve,reject)=>{
        const _this=this;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/domain/location/root?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/domain/location/root?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/domain/location/root";
        }
        const domainO=_this.domainObj,
            locationO=_this.locationObj;
        axios.get(_this.url,{
          params:{
            snodeId:_this.shadowObj.snodeId,
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type
          }
        }).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resData=res.data.data;
            _this.lcRootData=resData;
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    lcRootModalClose(){//关闭弹框
      this.$emit("setbylcRootmodal",false);
    },

    addLcRoot(){//显示 添加/编辑Location Root弹框
      this.isShowRootDialog=true;
    },
    editLcRoot(val){//显示 添加/编辑Location Root弹框
      this.lcRootform.lcRoot=val;
      this.isShowRootDialog=true;
    },
    saveLcRoot(){//添加/编辑Location Root
      this.$refs['lcRootform'].validate((valid) => {
        if (valid) {
          var _this=this;
          _this.lcRootEditLoading=true;
          axios.patch(_this.url,{
            snodeId:this.shadowObj.snodeId,
            domainName:this.domainObj.domainName,
            domainPort:this.domainObj.port,
            locationName:this.locationObj.name,
            locationType:this.locationObj.type,
            root:this.lcRootform.lcRoot,
          }).then((res)=>{
            if(res.data.responseCode==0){
              // this.$emit("updateRenderTree");
              this.getLcRootData();
              this.rootDialogClose();
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.lcRootEditLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    rootDialogClose(){//关闭清空 添加/编辑Location Root弹框
      this.$refs['lcRootform'].resetFields();
      this.isShowRootDialog=false;
    },

    delLcRoot(){//删除Location Root
      this.lcRootModalLoading=true;
      var domainO=this.domainObj,
          locationO=this.locationObj;
      axios.delete(this.url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:domainO.domainName,
          domainPort:domainO.port,
          locationName:locationO.name,
          locationType:locationO.type
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.getLcRootData();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.lcRootModalLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    }
  }
}
</script>
<style scoped>
.lcRootBox{
  background: #f7f7f7;
  padding: 30px 12px 12px;
  position: relative;
}
.addRootBtn{
  position: absolute;
  right: 12px;
  top: 10px;
}
.lcRoot-table{
  background: #fff;
  margin-top: 20px;
}
</style>

