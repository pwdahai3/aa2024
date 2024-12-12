<!--增加用户-->
<template>
  <div>
    <el-dialog width="420px" :title="$t('lg.add')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="resetForm">
      <el-form ref="addform" :model="addform" :rules="addformRules">
        <el-form-item :label="$t('lg.account')" prop="user" label-width="80px">
          <el-input v-model.trim="addform.user"></el-input>
        </el-form-item>
        <!-- <el-form-item label="xiala">
          <userselect :dataList="addform.gradeOptions" :pageInfo="pageInfo" labelKey="label" valueKey="value"></userselect>
        </el-form-item> -->
        <el-form-item :label="$t('lg.permission')" prop="gradeValue" label-width="80px">
          <el-select v-model="addform.gradeValue" :placeholder="$t('lg.select')" >
            <el-option 
            v-for="item in addform.gradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.expirationDay')" prop="validDay" label-width="80px">
          <el-input v-model.trim="addform.validDay"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.password')" prop="password" label-width="80px">
          <el-input type="password" v-model.trim="addform.password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.confirm')" prop="checkPass" label-width="80px">
          <el-input type="password" v-model.trim="addform.checkPass"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
            <!-- <slider ref="slider"></slider> -->
            <slider2
              ref="dragVerify"
              :width="380"
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
        <el-form-item label-width="80px">
          <el-button type="primary" @click="addUser('addform')">{{$t('lg.add')}}</el-button>
          <el-button @click="resetForm()">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="userloading" :title="$t('lg.loading2')"></loading>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import slider2 from '@/components/login/slider2'
import userselect from './userselect';
import {SERVER_API_URL} from '@/conf/constvar';
let Base64 = require('js-base64').Base64;
export default{
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {//强密码验证
          if(value === ''){
            callback(new Error(this.$t('lg.inputuserpwd')));
          }else{
            if(!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,24}$/.test(value))){  // /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{8,}$/    /^(.{0,5}|.{21,})$|^[^\d]*$|^[^a-zA-Z]*$|\s/
              callback(new Error(this.$t('lg.passwordtop2')));
            }
            if(this.addform.checkPass !== ''){
              this.$refs.addform.validateField('checkPass');
            }
            callback();
          }
        };
    var validatePass2 = (rule, value, callback) => {//确认密码
          if(value === ''){
            callback(new Error(this.$t('lg.inputpwsdagain')));
          }else if(value !== this.addform.password){
            callback(new Error(this.$t('lg.nomatch')));
          }else{
            callback();
          }
        };
    return{
      isPassing:false,
      pageInfo:{
        pageNum:1,
        pageSize:3,
        total:30
      },
      userloading:false,
      addform:{
        user:'',
        validDay:null,
        password:'',
        checkPass:'',
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
        user:[ 
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {min: 3, max: 32, message: this.$t('lg.length332'), trigger: 'blur'},
        ],
        gradeValue:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
        ],
        validDay:[
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'blur'}
        ],
        password:[
          {validator: validatePass, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'},
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      }
    }
  },
  methods:{
    reset() {
        this.isPassing = false;
        if(this.$refs.dragVerify != undefined){
          this.$refs.dragVerify.reset();
        }
      },
    passcallback2() {
        this.isPassing=true;
      },
    addUser(formname){
      if(!this.isPassing){
        this.$message.error(this.$t('lg.pressslier'));
        return;
      }
      this.$refs[formname].validate((valid)=>{
        if(valid){
          var user=this.addform.user,
              permission = [],
              validDay=parseInt(this.addform.validDay),
              password=Base64.encode(this.addform.password);
          permission.push(this.addform.gradeValue);
              // console.log(permission)
          var url=SERVER_API_URL+"uaa/user";
          this.userloading=true;
          axios.post(url,{
            userName:user,
            password:password,
            validDay:validDay,
            roles:permission
          }).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              this.$emit("hasadduser");
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.resetForm();
            }else if(res.data.responseCode==8){
              this.$message.error(this.$t('lg.userisexsit'));
            }else{
              this.$message.error(this.$t('lg.failed'));
            }
            this.userloading=false;
          }).catch((err)=>{
            this.$message.error(err.data);
            this.userloading=false;
          });
        }
      })
    },
    resetForm(){
      this.reset();
      this.$refs['addform'].resetFields();
      this.$emit("addclose")
    }
  },
  components:{
    loading,
    userselect,
    slider2
  }
}
</script>
