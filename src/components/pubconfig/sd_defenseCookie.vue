<!--动态cookie防御--><!--可删组件-->
<template>
  <div>
    <el-dialog width="45%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="defenseCookieClose">
      <div class="grid-content">
        <p class="tips">{{$t('lg.zhu2')}}{{$t('lg.dfcookietips')}}</p>
        <el-form :model="defenseCookieform" :rules="defenseCookieformRules" ref="defenseCookieform" label-width="90px">
          <el-form-item :label="$t('lg.dfcookieonoff')" label-width="175px"> 
            <el-switch
              v-model="defenseCookieswitch"
              :title="defenseCookieswitch?$t('lg.clickoff'):''"
              @change="switchEvent()">
            </el-switch>
          </el-form-item>
          <div class="orderBoxJamb">
            <el-form-item :label="$t('lg.validdate')" prop="defenseTime">
              <el-input v-model.trim="defenseCookieform.defenseTime" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
              <el-select v-model="timeVal" style="width:30%">
                <el-option :label="$t('lg.second')" value="s"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('lg.counts')" prop="defenseTimes">
              <el-input v-model.trim="defenseCookieform.defenseTimes" style="width:100%" :placeholder="$t('lg.counts')"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" v-if="defenseCookieswitch" @click="editdefenseCookie()">{{$t('lg.editparams')}}</el-button>
            <el-button type="primary" v-else @click="submitdefenseCookie()">{{$t('lg.addparams')}}</el-button>
            <el-button @click="defenseCookieClose">{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="defenseCookieLoading">
        <loading></loading>
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
    isShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      timeVal:'s',
      defenseCookieswitch:false,
      defenseCookieLoading:false,
      defenseCookieform: {
        defenseTime:'',
        defenseTimes:''
      },
      defenseCookieformRules:{
        defenseTime:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        defenseTimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },
      url:'',//请求的路径
    }
  },
  methods:{//增改cookie都需要把cookie参数都传给后台，后台只对数据进行覆盖
    getSdDefenseCookieData(){//获取动态cookie防御
      return new Promise((resolve,reject)=>{ 
        const snodeId=this.shadowObj.snodeId;
        if(this.isAuto){
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"?savedConfig=true";
        }else{
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId;
        }
        axios.get(this.url).then((res)=>{
          // console.log(res);
          if(res.data.responseCode == 0){
            var resData =res.data.data;

            if(resData.shadow_server_cookie_timeout){
              this.defenseCookieswitch=true;//开启
              this.defenseCookieform.defenseTime= resData.shadow_server_cookie_timeout;
              this.defenseCookieform.defenseTimes= resData.shadow_server_cookie_num;
            }else{
              this.defenseCookieswitch=false;//关闭
              this.defenseCookieform.defenseTime= '';
              this.defenseCookieform.defenseTimes= '';
            }

            resolve(resData);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    defenseCookieClose(){//关闭defenseCookie弹框
      // this.$refs['defenseCookieform'].resetFields();
      this.$emit('setbydefensecookiemodal',false);
    },
    switchEvent(){//开关事件 开启关闭防御cookie功能
      const _this=this;
      if(!_this.defenseCookieswitch){
        _this.$confirm(_this.$t('lg.offdfcookietips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.defenseCookieLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.defenseCookieClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.defenseCookieLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.defenseCookieswitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.defenseCookieswitch=false;
        _this.$message.error(_this.$t('lg.ondfcookietips'));
      }
    },
    submitdefenseCookie(){//添加Cookie
      const _this=this;
      this.$refs['defenseCookieform'].validate((valid) => {
        if (valid) {
          this.defenseCookieLoading=true;
          axios.post(this.url,{
            timeout:this.defenseCookieform.defenseTime,
            num:this.defenseCookieform.defenseTimes
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.defenseCookieswitch=true;
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.defenseCookieLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    editdefenseCookie(){//更改防御cookie
      const _this=this;
      this.$refs['defenseCookieform'].validate((valid) => {
        if (valid) {
          this.defenseCookieLoading=true;
          axios.patch(this.url,{
            timeout:this.defenseCookieform.defenseTime,
            num:this.defenseCookieform.defenseTimes
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.defenseCookieLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    }
  },
  components:{
    loading
  }
}
</script>