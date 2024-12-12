<!--修改用户权限 + 更新密码-->
<template>
  <div>
    <el-dialog width="40%" :title="$t('lg.updatepwd')" :visible.sync="isPwdShow" :close-on-click-modal="false" :before-close="addformCancel">
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
          <el-button type="primary" @click="editUser('addform')">{{$t('lg.confirm')}}</el-button>
          <el-button @click="addformCancel()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="userloading" title="loading..."></loading>
    </el-dialog>

    <el-dialog width="420px" :title="$t('lg.editquanx')" :visible.sync="isGradeShow" :close-on-click-modal="false" :before-close="gradeformCancel">
      <el-form ref="gradeform" :model="gradeform" :rules="gradeformRules" label-width="80px">
        <el-form-item :label="$t('lg.account')" prop="userName">
          <el-input v-model.trim="gradeform.userName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.expirationDay')" prop="validDay">
          <el-input v-model.trim="gradeform.validDay"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.permission')" prop="gradeValue">
          <el-select v-model="gradeform.gradeValue" :placeholder="$t('lg.select')">
            <el-option
              v-for="item in gradeform.gradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="0">
          <slider2
              ref="dragVerify"
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
          <el-button type="primary" @click="editUser('gradeform')">{{$t('lg.confirm')}}</el-button>
          <el-button @click="gradeformCancel()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="userloading" title="loading..."></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import slider2 from '@/components/login/slider2'
let Base64 = require('js-base64').Base64;
export default{
  components:{
    loading,
    slider2
  },
  props:{
    isPwdShow:{
      type:Boolean
    },
    isGradeShow:{
      type:Boolean
    },
    userData:{
      type:Object
    }
  },
  watch:{
    "isPwdShow":function(){
      if(this.isPwdShow && this.userData){
        this.addform.userName=this.userData.userName;
        this.addform.password='';
        this.addform.checkPass='';
      }
    },
    "isGradeShow":function(){
      if(this.isGradeShow && this.userData){
        this.gradeform.userName=this.userData.userName;
        this.gradeform.validDay=this.userData.validDay;
        this.gradeform.gradeValue=this.userData.roles[0];
      }
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {//强密码验证
          if(value===''){
            callback(new Error(this.$t('lg.inputuserpwd')));
          }else{
            if(!(/^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z\-\."\\\*\!\$@\?\^\(\)<>\{\}\[\]=%\&:;\/~\+#_`]{6,20}$/.test(value))){
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
      userloading:false,
      addform:{
        userName:"",
        password:'',
        checkPass:'',
      },
      gradeform:{
        userName:"",
        validDay:null,
        gradeOptions: [
          {
            value: 'ADMIN',
            label: 'ADMIN'
          },
          {
            value: 'USER',
            label: 'USER'
          },
          {
            value: 'AUDIT',
            label: 'AUDIT'
          }
        ],
        gradeValue: '',
      },
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
      gradeformRules:{
        gradeValue:[
          {required: true, message: this.$t('lg.select'), trigger: 'blur'},
        ],
        validDay:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'blur'}
        ],
      }
    }
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
      var user=this.userData;
      var url=SERVER_API_URL+"uaa/user/"+user.userName;

      this.$refs[formname].validate((valid)=>{
        if(valid){
          if(formname=="gradeform"){//修改权限
            var permission = [];
            permission.push(this.gradeform.gradeValue);

            this.userloading=true;
            axios.patch(url,{
              roles:permission,
              validDay:parseInt(this.gradeform.validDay) 
            }).then((res)=>{
              // console.log(res)
              if(res.data.responseCode==0){
                this.$message({
                  type: 'success',
                  message: this.$t('lg.success')
                });
                this.$emit("hasadduser");
                this.gradeformCancel();
              }else{
                this.$message.error(this.$t('lg.failed')+":"+res.data.message);
              }
              this.userloading=false;
            }).catch((err)=>{
              console.log(err)
              // this.$message.error(err.data);
              this.userloading=false;
            });

          }else{//更新密码
            var password=Base64.encode(this.addform.password);
            this.userloading=true;
            axios.patch(url,{
              password:password,
            }).then((res)=>{
              // console.log(res)
              if(res.data.responseCode==0){
                this.$message({
                  type: 'success',
                  message: this.$t('lg.success')
                });
               
                if(this.$store.state.pswdreminder)this.$store.state.pswdreminder.close();//修改密码成功，关闭修改密码提示
                this.addformCancel();
              }else{
                this.$message.error(this.$t('lg.failed'));
              }
              this.userloading=false;
            }).catch((err)=>{
              console.log(err)
              // this.$message.error(err.data);
              this.userloading=false;
            });
          }
        }
      })
    },
    addformCancel(){
      this.reset();
      this.$refs['addform'].resetFields();
      this.$emit("editPwdclose");
    },
    gradeformCancel(){
      this.$refs['gradeform'].resetFields();
      this.$emit("editGradeclose");
    }
  }
}
</script>
<style scoped>

</style>
