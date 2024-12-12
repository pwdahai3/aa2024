<template>
  <div>
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="isShow" :close-on-click-modal="false" :before-close="urlblackmodalClose">
      <el-button class="addIpBtn" type="primary" size="mini" @click="addUrlblackShow()">{{$t('lg.add')}}</el-button>
      <div style="margin-top:12px;">
        <p class="nodata-box" v-if="urlblacks.length==0">{{$t('lg.nodata')}}</p>
        <table class="ipTable" v-else>
          <thead>
            <tr>
              <th>{{$t('lg.urlblack')}}</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in urlblacks">
              <td>{{item.urlBlanklist}}</td>
              <td class="text-center">
                <a href="javascript:;" class="edit-del-a" @click="editit(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="delit(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <loading v-show="urlblacksLoading0"></loading>
    </el-dialog>

    <!-- 添加服务器弹框 -->
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="urlblackShow" :close-on-click-modal="false" :before-close="urlblackmodalCancel">
      <el-form :model="urlblackform" :rules="urlblackformRules" ref="urlblackform" label-width="120px" style="margin-right:30px">
            <el-form-item :label="$t('lg.urlblack')" prop="urlBlanklist">
              <el-input v-model.trim="urlblackform.urlBlanklist" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addUrlblack('urlblackform')">{{$t('lg.add')}}</el-button>
              <el-button @click="urlblackmodalCancel">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="urlblacksLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port" :visible.sync="editUrlblackShow" :close-on-click-modal="false" :before-close="eidturlblackmodalClose">
      <el-form :model="editUrlblackform" :rules="editUrlblackformRules" ref="editUrlblackform" label-width="120px" style="margin-right:30px">
            <el-form-item :label="$t('lg.urlblack')" prop="urlBlanklist">
              <el-input v-model.trim="editUrlblackform.urlBlanklist" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editUrlblack('editUrlblackform')">{{$t('lg.save')}}</el-button>
              <el-button @click="eidturlblackmodalClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      <loading v-show="urlblacksLoading2" :title="$t('lg.handling')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  components:{
    loading
  },
 
props:{
    isAuto:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      editUrlblackShow:false,
      urlblacksLoading2:false,
      urlblacksLoading0:false,
      urlblackShow:false,
      urlblacks:[],
      urlblacksLoading:false,
      urlblackform:{
        urlBlanklist:''
      },
      editUrlblackform:{
        urlBlanklist:''
      },
      orginurl:{},
      urlblackformRules:{
        urlBlanklist:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      },
      editUrlblackformRules:{
        urlBlanklist:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    editUrlblack(formname){
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          var snodeId=_this.shadowObj.snodeId;
          var domainName=_this.domainObj.domainName;
          var port=_this.domainObj.port;
          let url=SERVER_API_URL+"pe/shadow/domain/url/blacklist";
          _this.urlblacksLoading2=true;
          axios.patch(url,{
            "domainName": domainName,
            "domainPort": port,
            "snodeId": snodeId,
            "oldUrlBlanklist": this.orginurl.urlBlanklist,
            "urlBlanklist": this.editUrlblackform.urlBlanklist
          }).then((res)=>{
            if(res.data.responseCode==0){
             // console.log(res);
              _this.urlblacksLoading2=false;
              _this.getUrlBlacks();
              _this.editUrlblackShow=false;
              _this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error('failed');
            }
          });
      }})
    },
    editit(item){
      this.orginurl=JSON.parse(JSON.stringify(item));
      this.editUrlblackform.urlBlanklist=item.urlBlanklist;
      this.editUrlblackShow=true;
    },
    delit(item){
      const _this=this;
      _this.$confirm(_this.$t('lg.isdelete'),'',{
        confirmButtonText:_this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        _this.urlblacksLoading0=true;
        let url=SERVER_API_URL+"pe/shadow/domain/url/blacklist";
        var snodeId=_this.shadowObj.snodeId;
        var domainName=_this.domainObj.domainName;
        var port=_this.domainObj.port;
        axios.delete(url,{data:{
          "domainName": domainName,
          "domainPort": port,
          "snodeId": snodeId,
          "oldUrlBlanklist": item.urlBlanklist 
        }}).then((res)=>{
          if(res.data.responseCode==0){
            this.getUrlBlacks();
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
          }else{
            this.$message.error('failed');
          }
          this.urlblacksLoading0=false;
        }).catch((err)=>{
          console.log(err)
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: this.$t('lg.canceled')
        });
      })
    },
    addUrlblack(formname){
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          _this.urlblacksLoading=true;
          var snodeId=_this.shadowObj.snodeId;
          var domainName=_this.domainObj.domainName;
          var port=_this.domainObj.port;
          let url=SERVER_API_URL+"pe/shadow/domain/url/blacklist";
          axios.post(url,{
            "domainName": domainName,
            "domainPort": port,
            "snodeId": snodeId,
            "urlBlanklist": _this.urlblackform.urlBlanklist
          }).then((res)=>{
            if(res.data.responseCode==0){
             // console.log(res);
              _this.urlblacksLoading=false;
              _this.getUrlBlacks();
              _this.urlblackShow=false;
              _this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error('failed');
            }
          });
      }});

    },
    addUrlblackShow(){
      this.urlblackShow=true;
    },
    getUrlBlacks(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var url=SERVER_API_URL+"pe/shadow/domain/url/blacklist";
        axios.get(url,{
          params:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            let resdata=res.data.data || [];
            _this.urlblacks=resdata;
            resolve(resdata);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    urlblackmodalCancel(){
      this.$refs['urlblackform'].resetFields();
      this.urlblackShow=false;
    },
    urlblackmodalClose(){
      this.$emit("urlblackclose",false);
      this.urlblackShow=false;
    },
    eidturlblackmodalClose(){
      this.editUrlblackShow=false;
    }
  }
}
</script>
<style scoped>
.el-radio-group{
  margin-left: 10px;
  margin-bottom: 10px;
  vertical-align: baseline;
}
.el-radio{
  margin: 5px 25px 5px 0px;
}

.addIpBtn{
  position: absolute;
  right: 20px;
  top: 50px;
}
.myBalance,.myServerCheck{
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
.ipTable{
  margin-top: 15px;
}


</style>
