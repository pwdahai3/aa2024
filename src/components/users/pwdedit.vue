<template>
<div>
  <p style="padding:18px;font-size: 16px;">修改<span v-if="isDefault">默认</span>密码</p>

    <div class="editpwdbox">
        <el-form ref="addform" :model="addform" :rules="addformRules" :label-width="$store.state.isencn=='en'?'180px':'80px'">
          <el-form-item :label="$t('lg.account')" prop="userName">
            <el-input v-model.trim="addform.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.password')" prop="password">
            <el-input type="password" v-model.trim="addform.password"></el-input>
          </el-form-item>
          <el-form-item :label="$t('lg.pwdconfirm')" prop="checkPass">
            <el-input type="password" v-model.trim="addform.checkPass"></el-input>
          </el-form-item>
          <el-form-item>
          <slider2
              ref="dragVerify"
              :width="340"
              :height="40"
              progressBarBg="#FFA500"
              background="#F5F5F5"
              :text="$t('lg.pressslier')"
              :successText="$t('lg.passed')"
              :isPassing.sync="isPassing"
              handlerIcon="el-icon-d-arrow-right"
              successIcon="el-icon-circle-check"
              @passcallback="passcallback2">
          </slider2>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editUser('addform')">{{$t('lg.confirm')}}</el-button>
            <!-- <el-button @click="addformCancel()">{{$t('lg.cancel')}}</el-button> -->
          </el-form-item>
      </el-form>
      <loading v-show="userloading" title="loading..."></loading>
    </div>
</div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import slider2 from '@/components/login/slider2'
export default({
    components:{
        loading,
        slider2
    },
    data(){
        var validatePass = (rule, value, callback) => {//强密码验证
          if(value===''){
            callback(new Error(this.$t('lg.inputuserpwd')));
          }else{
            if(!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,24}$/.test(value))){
              callback(new Error(this.$t('lg.passwordtop2')));
            }
            if(this.addform.checkPass!==''){
              this.$refs.addform.validateField('checkPass');
            }
            callback();
          }
        };
    var validatePass2 = (rule, value, callback) => {
          if(value===''){
            callback(new Error(this.$t('lg.inputpwsdagain')));
          }else if(value !== this.addform.password) {
            callback(new Error(this.$t('lg.nomatch')));
          }else{
            callback();
          }
        };
        return{
          isPassing:false,
          isDefault:false,
            addform:{
                userName:'',
                password:'',
                checkPass:''
            },
            userloading:false,
            addformRules:{
                password:[
                {validator: validatePass, trigger: 'blur'},
                // {required: true, message: this.$t('lg.select'), trigger: 'blur'},
                ],
                checkPass:[
                {validator: validatePass2, trigger: 'blur'},
                // {required: true, message: this.$t('lg.select'), trigger: 'blur'},
                ]
            },
            
        }
    },
    created(){
        this.addform.userName=this.$route.query.userName;
        this.isDefault=sessionStorage.getItem('ispwdJump');
    },
    methods:{
       passcallback2() {
        this.isPassing=true;
      },
    reset() {
        this.isPassing = false;
        if(this.$refs.dragVerify != undefined){
          this.$refs.dragVerify.reset();
        }
      },
        editUser(formname){
          if(!this.isPassing){
        this.$message.error(this.$t('lg.pressslier'));
        return;
      }
      var url=SERVER_API_URL+"uaa/user/password/"+this.addform.userName;
      this.$refs[formname].validate((valid)=>{
        if(valid){
          var password=Base64.encode(this.addform.password);
            this.userloading=true;
            axios.patch(url,{
              password:password,
            }).then((res)=>{
              if(res.data.responseCode==0){
                this.$message({
                  type: 'success',
                  message: this.$t('lg.success')
                });
               
                if(this.$store.state.pswdreminder)this.$store.state.pswdreminder.close();//修改密码成功，关闭修改密码提示
              }else{
                this.$message.error(this.$t('lg.failed')+":"+res.data.data);
              }
              this.userloading=false;
            }).catch((err)=>{
              console.log(err)
              this.userloading=false;
            });
        }
      })
    },

    }
})
</script>
<style scoped>
.editpwdbox{
    width:420px;
    margin:80px auto 0 auto;
}
</style>
