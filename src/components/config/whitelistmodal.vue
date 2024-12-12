<!--白名单ip--><!--可删组件-->
<template>
  <div>
    <el-dialog width="55%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="whiteListClose">
      <!-- <div class="grid-content"> -->
      <el-form :model="whiteListform" :rules="whiteListformRules" ref="whiteListform">
        <el-form-item :label="$t('lg.whitefn')">
          <el-switch
            v-model="whiteListswitch"
            :title="whiteListswitch?$t('lg.clickoff'):$t('lg.clickon')"
            @change="switchEvent">
          </el-switch>
        </el-form-item>
        <div class="tips">
          <p>1、{{$t('lg.zhu72')}}</p>
          <p>2、{{$t('lg.zhu73')}}</p>
          <p>3、{{$t('lg.zhu74')}}</p>
        </div>
        <div class="orderBoxJamb">
          <el-form-item :label="$t('lg.ips')" label-width="75px" prop="shadow_white_ip">
            <el-input type="textarea" :autosize="{ minRows: 4 }" v-model.trim="whiteListform.shadow_white_ip" style="width:60%;margin-right:10px"></el-input>
            <el-button type="primary" size="mini" @click="submitWhiteList()">{{$t('lg.addwhite')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
      <!-- </div> -->
      <div>
        <p class="nodata-box" v-if="whiteIplistData.length==0">{{$t('lg.nodata')}}</p>
        <div v-if="whiteIplistData.length>0" class="whiteListBox">
          <table>
            <thead>
              <tr>
                <th>{{$t('lg.serialnumber')}}</th>
                <th>{{$t('lg.ips')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in whiteIplistData" :key="index">
                <td>{{index+1}}</td>
                <td>{{item}}</td>
                <td class="text-center">
                  <a href="javascript:;" class="edit-del-a" @click="editWhiteIp(item,index)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" class="edit-del-a" @click="delWhiteIp(index)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="wIpRemarkBox">
        <span class="wIpRemarkTxt">{{$t('lg.remark')}}：{{whiteIpListRemark?whiteIpListRemark:$t('lg.nodata')}}</span>
        <el-button class="wIpRemarkBtn" type="text" @click="showRemarkDialog">{{$t('lg.add')}}/{{$t('lg.edit')}}</el-button>
      </div>

      <loading v-show="whitelistmodalLoading"></loading>
    </el-dialog>

    <!-- 编辑弹框 -->
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowEditWhiteList" :close-on-click-modal="false" :before-close="isEditCmdClose">
      <el-form :model="editWhiteListform" :rules="editWhiteListformRules" ref="editWhiteListform">
        <el-form-item :label="$t('lg.ips')" label-width="75px" prop="shadow_white_ip">
          <el-input v-model.trim="editWhiteListform.shadow_white_ip"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="editwIEnsure('editWhiteListform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="isEditCmdClose">{{$t('lg.cancel')}}</el-button>
      </div>
      <loading v-show="editWhitelistLoading"></loading>
    </el-dialog>

    <!-- 备注弹框 -->
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowWIpRemark" :close-on-click-modal="false" :before-close="wIpRemarkDialogClose">
      <el-form :model="wIpRemarkform" ref="wIpRemarkform">
        <el-form-item :label="$t('lg.remark')" label-width="40px">
          <el-input type="textarea" autosize v-model.trim="wIpRemarkform.wIpRemark"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="setWIpRemark('wIpRemarkform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="wIpRemarkDialogClose">{{$t('lg.cancel')}}</el-button>
      </div>
      <loading v-show="wIpRemarkLoading"></loading>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar'

export default{
  props:{
    shadowObj:{
      type:Object
    },
    isShow:{
      type:Boolean
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {
        // console.log(value)
        if (value === '') {
          callback(new Error(this.$t('lg.ipipd')));
        } else {
          const valArr = value.split(',')
          for(var i=0;i<valArr.length;i++){
            const valStr = valArr[i].replace(/^\s*|\s*$/g,"");//去除两侧空格
            if(valStr && !(/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/.test(valStr))){
              callback(new Error(this.$t('lg.qingshurufuheipipd')));
              break;
            }
          }
          callback();
        }
      };
    return{
      whiteIplistData:[],
      whiteListswitch:false,
      whiteListform: {
        shadow_white_ip:''
      },
      whiteListformRules:{
        shadow_white_ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur',},
          { validator: validatePass, trigger: 'blur' },
          // {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message:this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      whitelistmodalLoading:false,

      //编辑
      isShowEditWhiteList:false,
      editWhiteIpIndex:null,//记录被编辑ip的索引
      editWhiteListform:{//编辑ip临时容器，编辑过的当前IP
        shadow_white_ip:''
      },
      editWhiteListformRules:{
        shadow_white_ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message: this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      editWhitelistLoading:false,

      //备注
      whiteIpListRemark:'',
      hasWIpRemark:false,//标记是否有过备注；用来设置备注时，确定请求方式为post还是patch
      isShowWIpRemark:false,
      wIpRemarkform:{
        wIpRemark:''
      },
      wIpRemarkLoading:false
     
    }
  },
  methods:{//增删改查白名单都需要把所有白名单都传给后台，后台只对数据进行覆盖
    getWhiteIpListData(){//多个请求获取不同数据
      var snodeId=this.shadowObj.snodeId;

      let p1 = new Promise((resolve,reject)=>{
        var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
        axios.get(url).then((res)=>{//查看白名单
          // console.log(res)
          if(res.data.responseCode == 0){
            const resData = res.data.data;
            this.whiteIplistData=resData;
            if(this.whiteIplistData.length==0){
              this.whiteListswitch=false;//关闭
            }else{
              this.whiteListswitch=true;//开启
            }
            resolve(resData);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        })
      })

      let p2 = new Promise((resolve,reject)=>{//查看备注
        var url=SERVER_API_URL+"pe/shadow/kv/"+snodeId+'whiteIpRemarks';
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode == 0){
            const resData = res.data.data;
            this.whiteIpListRemark=resData && resData.value;
            if(resData){
              this.hasWIpRemark=true;
            }else{
              this.hasWIpRemark=false;
            }
            resolve(resData);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        })
      })

      return Promise.all([p1,p2])
    },
    whiteListClose(){//关闭白名单ip弹框
      this.$refs['whiteListform'].resetFields();
      this.$emit('setbywhiteListmodal',false);
    },
    switchEvent(){//开关事件
      var _this=this;
      if(!this.whiteListswitch){
        this.$confirm(_this.$t('lg.deletewhitetips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          var snodeId=this.shadowObj.snodeId;
          var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
          axios.delete(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.getWhiteIpListData();
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          this.whiteListswitch=true;
          this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        this.whiteListswitch=false;
        this.$message.error(_this.$t('lg.whiteauto'));
      }
    },
    submitWhiteList(){//确认添加
      this.$refs['whiteListform'].validate((valid) => {
        if (valid) {
          var _this = this;
          var snodeId=_this.shadowObj.snodeId;

          // if(_this.whiteIplistData.includes(_this.whiteListform.shadow_white_ip)){
          //   _this.$message.error(_this.$t('lg.existwhite'));
          //   return false;
          // }
          
          const whiteIpArr = JSON.parse(JSON.stringify(this.whiteIplistData));
          _this.whiteListform.shadow_white_ip.split(',').forEach(item=>{
            item && whiteIpArr.push(item)
          })
          
          var url=SERVER_API_URL+"pe/shadow/whiteip";
          _this.whitelistmodalLoading=true;
          axios.post(url,{
            snodeId:snodeId,
            whiteIp:whiteIpArr
          }).then((res)=>{
            if(res.data.responseCode==0){
            _this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            _this.whiteListform.shadow_white_ip='';
            this.getWhiteIpListData();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.whitelistmodalLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    editWhiteIp(item,index){//编辑白名单IP
      this.editWhiteIpIndex=index;
      this.editWhiteListform.shadow_white_ip=item;
      this.isShowEditWhiteList=true;
    },
    editwIEnsure(formname){//确认编辑   
      this.$refs[formname].validate((valid) => {
        if(valid){
          var snodeId=this.shadowObj.snodeId;
          // if(this.whiteIplistData.includes(this.editWhiteListform.shadow_white_ip)){//比较ip是否已经存在 2
          //   this.$message.error(this.$t('lg.existwhite'));
          //   return false;
          // }
          this.whiteIplistData[this.editWhiteIpIndex]=this.editWhiteListform.shadow_white_ip;//如果不存在，就插入原数组，进行替换

          var url=SERVER_API_URL+"pe/shadow/whiteip";
          this.editWhitelistLoading=true;
          axios.patch(url,{
            snodeId:snodeId,
            whiteIp:this.whiteIplistData
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.isEditCmdClose();
              this.getWhiteIpListData();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
            }
            this.editWhitelistLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    isEditCmdClose(){//关闭编辑弹框
      this.isShowEditWhiteList=false;
    },
    delWhiteIp(index){//删除白名单Ip
      var _this=this;
      var snodeId=this.shadowObj.snodeId;
      if(this.whiteIplistData.length==1){
        this.$confirm(_this.$t('lg.closewhitetips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
          axios.delete(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.getWhiteIpListData();
              this.whiteListswitch=false;
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          this.whiteListswitch=true;
          this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        this.whitelistmodalLoading=true;
        this.whiteIplistData.splice(index,1);
        var url=SERVER_API_URL+"pe/shadow/whiteip";
        axios.patch(url,{
          snodeId:snodeId,
          whiteIp:this.whiteIplistData
        }).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            this.getWhiteIpListData();
          }else{
            this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.whitelistmodalLoading=false;
        }).catch((err)=>{
          console.log(err);
        });
      }
    },
    showRemarkDialog(){
      this.wIpRemarkform.wIpRemark=this.whiteIpListRemark;
      this.isShowWIpRemark=true;
    },
    setWIpRemark(){//设置备注
      this.wIpRemarkLoading=true;
      var snodeId=this.shadowObj.snodeId;
      var url=SERVER_API_URL+"pe/shadow/kv/";
      const keyName=snodeId+'whiteIpRemarks';
      let requestMethod='post';

      if(this.hasWIpRemark) requestMethod='patch';

      axios[requestMethod](url,{
       [keyName]:this.wIpRemarkform.wIpRemark
      }).then((res)=>{
        if(res.data.responseCode == 0){
          this.getWhiteIpListData();
          this.wIpRemarkDialogClose();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.wIpRemarkLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    wIpRemarkDialogClose(){
      this.$refs['wIpRemarkform'].resetFields();
      this.isShowWIpRemark=false;
    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.whiteListBox{
  max-height: 370px;
  overflow-y: auto;
}
.wIpRemarkBox{
  margin-top: 10px;
}
.wIpRemarkTxt{
  line-height: 20px;
  word-break: break-all;
}
.wIpRemarkBtn{
  padding: 0;
  border: none;
}
</style>
