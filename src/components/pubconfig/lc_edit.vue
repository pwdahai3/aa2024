<template>
  <div>
    <el-dialog width="50%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="lcEditmodalShow" :close-on-click-modal="false" :before-close="editmodalClose">
      <div class="locationBox">
        <span class="titleSpan">{{$t('lg.editprotected')}}</span>
        <el-form :model="editlocationObj" ref="editlocationObj" label-width="170px" :rules="editlocationObjRules">
          <el-form-item :label="$t('lg.matchtype')" prop="type">
            <el-select v-model="editlocationObj.type" :placeholder="$t('lg.select')" @change="checkMate(editlocationObj.type)">
              <el-option :label="$t('lg.exactmatch')" value="accurateMatch"></el-option>
              <el-option :label="$t('lg.suffixmatch')" value="suffixMatch"></el-option>
              <el-option :label="$t('lg.patchmatch')" value="pathMatch"></el-option>
              <el-option :label="$t('lg.dynamicurl')" value="dynamicMatch"></el-option>
              <el-option :label="$t('lg.tongyongpp')" value="/"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('lg.protectedpos')" prop="name">
            <el-input v-model.trim="editlocationObj.name" :disabled="editlocationObj.type=='/'"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateLocation('editlocationObj')">{{$t('lg.yes')}}</el-button>
            <el-button @click="editmodalClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="editmodalLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    },
    lcEditmodalShow:{
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
    var checkLocation = (rule,value,callback)=>{
          if(!value){
            callback(new Error(this.$t('lg.required')));
          }
          if(value=="deny_url"){
            callback(new Error(this.$t('lg.denyurl1')));
          }else{
            if(!(/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/.test(value))){
              callback(new Error(this.$t('lg.invalidformat')));
            }
            callback();
          }
        };
    return{
      editmodalLoading:false,
      editlocationObj:{
        type:'',
        name:''
      },
      editlocationObjRules:{
        type:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        name:[
          {validator: checkLocation, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          // {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },
    }
  },
  watch:{
    "lcEditmodalShow":function(){
      if(this.lcEditmodalShow){
        this.editlocationObj.name=this.locationObj.nameTxt;
        this.editlocationObj.type=this.locationObj.type;
      }
    },
  },
  methods:{
    editmodalClose(){
      this.$refs['editlocationObj'].resetFields();
      this.$emit("setbylcEditmodal",false);
    },
    checkMate(v){
      v=='/'?this.editlocationObj.name="/":this.editlocationObj.name=this.editlocationObj.name;
    },
    updateLocation(formname){// 被保护对象编辑
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          if(_this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/location?autoconfig=true";
          }else if(_this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/location?savedConfig=true";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/location";
          }
          var snodeId=_this.shadowObj.snodeId,
              domainName=_this.domainObj.domainName,
              port=_this.domainObj.port,
              srcLocationName=_this.locationObj.name,
              srcLocationType=_this.locationObj.type,
              locationName=_this.editlocationObj.name,
              locationType=_this.editlocationObj.type;

          if(locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则
            if(locationName=="/"){
              locationName="(.*\\/)+$"              
            }else{
              locationName="\\.("+locationName+")$"
            }
          }
          
          axios.patch(url,{
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            srcLocationName:srcLocationName,
            srcLocationType:srcLocationType,
            locationName:locationName,
            locationType:locationType
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$emit("updateRenderTree");
              _this.editmodalClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    },
  },
  components:{
    loading
  }
}
</script>
<style>
.locationBox{
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 30px 20px 10px 20px;
  position: relative;
}
</style>

