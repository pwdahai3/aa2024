<template>
  <div class="login-wrapper">
    <div class="cnen">
      <a @click="toenen('cn')" href="javascript:;">中文</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:;" @click="toenen('en')">ENGLISH</a>
    </div>
    <div class="login-content">
      <el-form ref="loginform" :model="loginform" :rules="loginformRules" label-position="left" label-width="0px">
        <!-- <h3 class="title">讯安Web动态防御平台登录</h3> -->
        <h3 class="title">{{productName}} {{$t('lg.login')}}</h3>
          <el-form-item prop="name">
            <el-input v-model.trim="loginform.name" :placeholder="$t('lg.inputusername')" @keyup.enter.native="loginSubmit('loginform')"></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model.trim="loginform.pwd" type="password" :placeholder="$t('lg.inputuserpwd')" @keyup.enter.native="loginSubmit('loginform')"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="mobile">
            <el-input v-model.trim="loginform.mobile" :placeholder="$t('lg.mobile')" @keyup.enter.native="loginSubmit('loginform')"></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode">
            <el-input v-model.trim="loginform.verifyCode" :placeholder="$t('lg.verifyCode')" @keyup.enter.native="loginSubmit('loginform')" style="width:60%"></el-input>
            <a href="javascript:;" @click="getVerifyCode" class="verifycodea" v-show="timeTrue">获取验证码</a> 
            <span v-show="!timeTrue" style="color:#fff;font-size:12px">{{ time }}秒后重新获取</span>
          </el-form-item> -->
          <el-form-item>
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
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="loginSubmit('loginform')">{{$t('lg.login')}}</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div style="position:absolute; bottom:10px; text-align:center; width:100%">
      <a href="javascript:;" style="color:#fff" @click="yspop">{{$t('lg.yinssm')}}</a>
    </div>
     <el-dialog  title=""  :visible.sync="llVisible1"  width="60%"  :before-close="llVisibleclo">
      <div>
<h2 data-v-176e3cee="" class="h2ti color-f">Shadow Force WEB动态防御平台鸿蒙系统手机端SDK隐私协议</h2> <p></p><br/>
<p>本版本更新时间：2022年1月</p>
<p>发布日期：2020年3月</p>
<p>生效日期：2020年3月</p>
<h2 class="sdf">引言</h2>
<p>感谢您关注并使用影盾SDK所提供的服务（以下简称“本服务”），请遵循本服务的相关服务条款，请了解本服务如何收集移动应用使用的特定相关信息，请做好贵司的用户协议和隐私政策。</p>
<p>本隐私政策会不定时进行变更，请您持续关注；若您继续使用本服务，则视为接受该变更内容，因此请定期检查该政策的更新内容；若您不接受变更内容，请结束本服务。</p>
<h2 class="sdf">综述</h2>
<p>本服务将维护本服务的使用者（以下简称“用户”）的权益，通过影盾SDK记录移动设备数据并做加密化处理，从而允许服务提供商提供与终端用户相关及有用的产品及服务。影盾并不收集用户产品的终端用户（以下简称“终端用户”）的任何私人可识别信息，仅记录并利用设备系统数据加以利用。影盾亦不会擅自使用用户所搜集的终端用户个人信息。</p>
<h2 class="sdf">信息收集</h2>
<p>身份信息</p>
<p>本服务不会收集终端用户的任何个人身份信息及生物信息。</p>
<p>非身份信息</p>
<p>本服务通过与移动应用获取终端用户设备的非身份信息（以下简称“用户数据”），包括设备属性，如主机名、内核版本、内核版本编译日期、操作系统版本，处理器类型、硬件平台、操作系统；影盾将会对以上信息进行加密化处理（下同）。影盾并不会收集终端用户的任何个人身份信息（姓名、地址、电子邮箱等）以及生物信息。</p>
<h2 class="sdf">信息使用</h2>
<p>影盾可使用用户数据改善并增强用户体验或服务水平。</p>
<p>可使用用户数据：</p>
<p>* 处理分析业务</p>
<p>* 执行分析服务</p>
<p>* 执行影盾认为保护服务安全或其正常运行所必需的任何其它功能。</p>
<h2 class="sdf">内容</h2>
<p>服务提供商负责在其产品中添加用户体验改进计划，具体内容详见用户体验改进计划，向终端用户提供重要且明确的通知，阐述本服务中影盾将从应用及终端用户设备中收集及使用的匿名信息，并在数据收集时征求终端用户的同意，并承担因终端用户信息搜集或使用的相应责任。</p>
<h2 class="sdf">第三方获取您的信息</h2>
<p>影盾不会与第三方个体或组织合作提供本服务数据信息。</p>
<h2 class="sdf">法律目的的信息公布</h2>
<p>以法律为目的，且应政府机构或诉讼当事人的要求，影盾可随时向政府机关或司法机构公布用户及终端用户的信息。就民事诉讼、刑事侦查或其它法律事务而言，在必要且有行政执法或司法类文件时，用户应同意影盾向文书中所载的任何第三方披露用户及终端用户的信息。若影盾收到影响用户及终端用户隐私的传讯，影盾可能会选择通知用户，由用户与相关机构联系，以便进行下一步进程；影盾也会根据要求直接提供用户及终端用户的信息给有关机关；影盾并无承担任何通知类义务。</p>
<h2 class="sdf">数据保存</h2>
<p>本服务影盾SDK仅记录用户终端设备数据并利用，从而向用户提供该服务。影盾SDK不保存用户数据，也不将记录的数据内容转发服务提供商。</p>
<h2 class="sdf">安全措施</h2>
<p>影盾会采取相应措施提高服务的安全性，包括使用SSL证书及漏洞扫描，尽力保证相应信息的安全；若发生意外，我们将力争将损失控制在最低。保护影盾SDK的安全是影盾责任，但是影盾推荐用户以及终端用户使用防病毒软件、防火墙与其它预防措施从而保护自身免受安全威胁。</p>

<h2 class="sdf">联系我们</h2>
<p>如果您对本隐私政策有任何疑问、意见或建议，通过电子邮件与我们联系，请发送电子邮件support@underriver.cn</p>
<p>电话：020-32204319</p>
      </div>
     </el-dialog>

     <el-dialog  title=""  :visible.sync="llVisible2"  width="60%"  :before-close="llVisibleclo">

<h2 data-v-176e3cee="" class="h2ti color-f">Shadow Force WEB Dynamic Defense Platform HarmonyOS Mobile SDK Privacy Agreement</h2>
<p></p><p></p><br/><br/><br/>
<p>Version Update Date: January 2022</p>
<p>Release Date: March 2020</p>
<p>Effective Date: March 2020</p>
<p>Introduction</p>
<p>Thank you for your attention and for using the services provided by Shadow Force SDK (hereinafter referred to as "the Service"). Please comply with the relevant terms of the Service and understand how the Service collects specific information related to the use of mobile applications. Ensure that your company’s user agreement and privacy policy are in place. This privacy policy may be updated from time to time, so please stay informed. If you continue to use the Service, it is deemed that you accept the changes, so please regularly check for updates. If you do not accept the changes, please cease using the Service.</p>
<p>Overview</p>
<p>The Service will protect the rights of its users (hereinafter referred to as "Users") by recording mobile device data via Shadow Force SDK and encrypting it, allowing service providers to offer relevant and useful products and services to end-users. Shadow Force does not collect any personally identifiable information of end-users (hereinafter referred to as "End Users") of the user’s product. It only records and processes system data from the device. Shadow Force will not use any personal information of end-users collected by the user without consent.</p>
<p>Information Collection</p>
<p>•	Identity Information</p>
<p>The Service does not collect any personal identity information or biometric information of the End Users.</p>
<p>•	Non-Identity Information</p>
<p>The Service collects non-identity information (hereinafter referred to as "User Data") from the mobile application regarding the End User's device, which includes device attributes such as hostname, kernel version, kernel version compilation date, operating system version, processor type, hardware platform, and operating system. Shadow Force will encrypt this information (as mentioned above). Shadow Force does not collect any personally identifiable information (such as name, address, email, etc.) or biometric information from End Users.</p>
<p>Information Use</p>
<p>Shadow Force may use User Data to improve and enhance user experience or service levels. The usage of User Data includes:</p>
<p>•	Processing and analyzing business operations </p>
<p>•	Performing analytical services </p>
<p>•	Performing any other functions deemed necessary by Shadow Force to protect the service security or its normal operation. 
<p>Content service providers are responsible for incorporating user experience improvement plans into their products. These plans should clearly inform End Users, detailing the anonymous information that Shadow Force collects and uses from applications and End User devices. User consent should be obtained during data collection, and responsibility for such data collection and usage lies with Shadow Force.</p>
<p>Third-Party Access to Your Information</p>
<p>Shadow Force does not share user data with any third parties or organizations in connection with the provision of this Service.</p>
<p>Disclosure for Legal Purposes</p>
<p>For legal purposes, such as government agency requests or litigation, Shadow Force may disclose information about Users and End Users to government agencies or judicial bodies at any time. In the case of civil litigation, criminal investigations, or other legal matters, Users consent to Shadow Force disclosing their and End Users' information to any third parties as specified in administrative or judicial documents. If Shadow Force receives any requests that affect the privacy of Users and End Users, it may notify the Users, who should contact the relevant authorities for further processing. Shadow Force may also directly provide the information to the authorities upon request, without any obligation to notify Users.</p>
<p>Data Retention</p>
<p>The Shadow Force SDK only records and utilizes data from User’s terminal devices to provide the service. The SDK does not store User data or forward the recorded data to service providers.</p>
<p>Security Measures</p>
<p>Shadow Force will implement measures to improve the security of its service, including using SSL certificates and vulnerability scanning, striving to ensure the safety of information. In the event of an incident, we will endeavor to minimize any loss. While securing the Shadow Force SDK is Shadow Force's responsibility, we recommend that Users and End Users use antivirus software, firewalls, and other preventive measures to protect themselves from security threats.</p>
<p>Contact Us</p>
<p>If you have any questions, comments, or suggestions regarding this privacy policy, please contact us via email at:</p>
<p>Email: support@underriver.cn</p>
<p>Phone: 020-32204319</p>


     </el-dialog>
  </div>
</template>
<script>
import * as types from '@/store/types';
// import CryptoJS from 'crypto-js';//3des
// import {JSEncrypt} from 'jsencrypt';//rsa
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL,SERVER_API_URL2} from '@/conf/constvar';
import store from '../../store/store';
import slider2 from './slider2'
export default {
  created(){
   // if(!this.productName){
      this.getProductname();
   // }
  },
  components:{
    slider2
  },
  data(){
    return{
      llVisible1:false,
      llVisible2:false,
      timeTrue: true,   
      time: 0,
      isPassing:false,
      productName:store.state.productName,
      loginform:{
        name:'',
        pwd:'',
        mobile:'',
        verifyCode:''
      },
      loginformRules:{
        name: [
          { required: true, message: this.$t('lg.inputusername'), trigger: 'blur' },
        ],
        pwd: [
          { required: true, message: this.$t('lg.inputuserpwd'), trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: this.$t('lg.inputmobile'), trigger: 'blur' },
        ],
        verifyCode: [
          { required: true, message: this.$t('lg.inputverifycode'), trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    yspop(){
      
      if(localStorage.lang=="en"){
        this.llVisible2=true;
      }else{
        this.llVisible1=true;
      }
    },
    llVisibleclo(){
      this.llVisible1=false;
      this.llVisible2=false;
    },
    getVerifyCode(){
      const _this=this;
      if(!this.loginform.name){
        this.$message.error(this.$t('lg.inputusername'));
        return;
      }
      if(!this.loginform.mobile){
        this.$message.error(this.$t('lg.inputmobile'));
        return;
      }
      const phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(_this.loginform.mobile)){
          this.$message.error(this.$t('lg.invaidformat'));
          return;
      }
      this.timeTrue = false; 
      this.time = 60;   
      var setTimeoutS = setInterval(() => {  
        this.time--;   
        if (this.time <= 0) {     
          clearInterval(setTimeoutS);  
              this.timeTrue = true;      
        }   
        }, 1000); 
      const url=SERVER_API_URL2+'pe/shadow/user/verifycode/send';
      let data={
        "mobile": this.loginform.mobile,
        "userName": this.loginform.name
      }
      axios.post(url,data).then((res)=>{
        console.log(res)
        if(res.data.responseCode==0){
          let resData=res.data.data;
          this.time = 60;   
          var setTimeoutS = setInterval(() => {  
            this.time--;   
            if (this.time <= 0) {     
              clearInterval(setTimeoutS);  
                  this.timeTrue = true;      
            }   
            }, 1000); 
        }
      })

    },
    toenen(a){
     // console.log(a);
     localStorage.clear();
      localStorage.lang=a;
      this.$i18n.locale=a;
      this.getProductname();
      this.$router.go(0);
      // this.$router.replace({
      //   path:'/blank'
      // })
    },
    reset() {
        this.isPassing = false;
        if(this.$refs.dragVerify != undefined){
          this.$refs.dragVerify.reset();
        }
      },
    passcallback2() {
        this.isPassing=true;
      },
    getProductname(){
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data;
          if(localStorage.lang=="en"){
            this.productName=resData.enName;
            this.$store.state.productName=resData.enName;
          }else{
            this.productName=resData.cnName;
            this.$store.state.productName=resData.cnName;
          }
          document.title = this.productName;
        }
      })
    },
    isJump(){
      this.$refs['loginform'].validate((valid) => {
        if(valid){
            return new Promise((resolve,reject)=>{
              var url=SERVER_API_URL+"uaa/user/password/isjump";
              var name=this.loginform.name;
              var password = Base64.encode(this.loginform.pwd);
              axios.post(url,{
                "userName": name,
                "password": password 
              },{
                  headers: {
                    'Authorization': 'Basic VUk6V0VScU0zWnVORFIxZEhWQw==',
                  }
                }).then((res)=>{
                if(res.data.responseCode==0){
                  console.log(res)
                  resolve(res.data.jumpToPassworkPageFlag)
                }else{
                  reject("error")
                }
              }).catch((err)=>{
                console.log(err)
              });
          })
        }
      });
      
    },
    loginSubmit(formname){
      if(!this.isPassing){
        this.$message.error(this.$t('lg.pressslier'));
        return;
      }
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var password = Base64.encode(this.loginform.pwd);
          var name=this.loginform.name;
          var url=SERVER_API_URL+"uaa/oauth/token?username="+name+"&password="+password+"&grant_type=password";
          const instance = axios.create();


          const _this=this;

          instance.post(url,{},{
            headers: {
              'Authorization': 'Basic VUk6V0VScU0zWnVORFIxZEhWQw==',
            }
          }).then((res)=>{
 
            const userName=_this.loginform.name;
            _this.$store.commit(types.LOGIN,res.data);
            _this.$store.commit(types.USERNAME,userName);
            _this.$store.state.nowTimeVal=[new Date(new Date().getTime()-24*60*60*1000), new Date()];
            
              var url2=SERVER_API_URL+"uaa/user/password/isjump";
              let acctoken=res.data.access_token;
              instance.post(url2,{
                    "userName": name,
                    "password": password 
                  },{
                headers: {
                  'Authorization': "Bearer "+acctoken,
                }
              }).then((res)=>{
                    if(res.data.responseCode==0){
                      let isJumpTrue=res.data.data.jumpToPassworkPageFlag;
                      sessionStorage.setItem('ispwdJump',isJumpTrue);
                    //  if(isJumpTrue){
                    //   _this.$router.push({path: '/editpwd',query:{userName:userName}});
                    //  }else{
                        var userUrl=SERVER_API_URL+"uaa/user/"+userName;//查询当前用户
                        axios.get(userUrl).then((res)=>{
                          if(res.data.responseCode==0){
                            const resdata2=res.data.data;
                            sessionStorage.setItem('myRoles',resdata2.roles[0]);//记录用户

                          if(isJumpTrue){
                          _this.$router.push({path: '/editpwd',query:{userName:userName}});
                          }else{

                            if(resdata2.roles[0]=='ADMIN' || resdata2.roles[0]=='USER'){
                              _this.$router.push({path: '/config'});
                            }else{
                              _this.$router.push({path: '/logs'});
                            }
                            

                            function showConfirm(){
                              const activeTime = sessionStorage.getItem('expires_in')*1000;
                              _this.$store.state.LoginResTime=setTimeout(()=>{ 
                                _this.$store.state.loginResShow=true;
                              },activeTime)
                            }
                            showConfirm();

                            this.$nextTick(() => {
                              setTimeout(()=>{
                                _this.getPswdReminder(userName);
                              },1000)
                            })
                            
                          }

                            
                            
                          }
                        }).catch((err)=>{
                          this.reset();
                          console.log(err);
                        });
                     // }
                      var exurl=SERVER_API_URL+"uaa/user/lockremind/"+userName;
                      axios.get(exurl).then((res)=>{
                          if(res.data.responseCode==0){
                            const exresdata=res.data.data;
                            const exday=exresdata.day;
                            if(exresdata.userLockRemindFlag){

                              if(exday<=3){
                                var date = new Date();
                                date.setDate(date.getDate() + parseInt(exday+1));
                                let exdate=date.getFullYear() +"-"+ (date.getMonth()+1) +"-"+ date.getDate()+" 0:00";

                                _this.$message({
                                  message: '账户有效期剩'+exday+'天，将于'+exdate+'锁定',
                                  type: 'warning',
                                  showClose:true,
                                  duration:0
                                });

                            }


                            }
                          }
                      })

                    }
                  }).catch((err)=>{
                    console.log(err)
              });



            
            
          }).catch((err)=>{
            // console.log(err);
            // console.log(err.response);
           this.reset();
            if(!err.response){
              this.$message.error(this.$t('lg.noserver'));
            }
            if(err.response && err.response.status==400){
              if(err.response.data.error_description=='User account is locked'){
                this.$message.error(this.$t('lg.acclocked'));
              }else{
                this.$message.error(this.$t('lg.accpwderr'));
              }
            }else{
              this.$message.error(this.$t('lg.noserver'));
            }
          })
        }else {
          return false
        }
      })
    },

    getPswdReminder(userName){
      const _this=this;
      const url=SERVER_API_URL+"uaa/user/"+userName+"/pswdreminder";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          if(res.data.data.recommandPswdChange){
            _this.$store.state.pswdreminder = _this.$notify({
              title: _this.$t('lg.tip'),
              dangerouslyUseHTMLString: true,
              message: _this.$t('lg.modifypwdlong')+"<el-button style='color: #409EFF;font-style:italic;text-decoration:underline;'> "+_this.$t('lg.edit')+" </el-button>",
              duration: 0,
              offset: 155,
              onClick:function(){ //打开修改密码弹框
                _this.$store.state.userInfo={
                  userName:userName
                }
                _this.$store.state.showEditUsersPswdDialog=true;
              }
            });
          }
        }
      }).catch((err)=>{
        console.log(err);
      })
    },
  }
}
</script>
<style scoped>
.login-wrapper{
  width: 100%;
  height: 100%;
  background-color:#4a5166;
  background-image: url('./bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  position:relative;
}
.cnen{ position: absolute; top: 12px; right: 4px; color: #fff;}
.cnen a{ color: #fff; display: inline-block; margin: 0 6px;}
.cnen a:hover{ color: #fff; text-decoration: underline;}
/* .myinput /deep/ .el-input__inner{
  border-radius: 0;
  height: 50px;
  line-height: 50px
}
.myinput /deep/ .el-icon-user1{
  background-image: url('./user-icon.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 80%
}
.myinput /deep/ .el-icon-pwd1{
  background-image: url('./password-icon.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 80%
}
.myinput /deep/.el-input--prefix .el-input__inner {
  padding-left: 40px;
} */
.login-content{
  position: absolute;
  right: 140px;
  top: 50%;
  margin-top: -200px;
  width: 380px;
  padding: 25px 35px 20px;
  background: #57607C;
}
.copyr{
  font-size: 12px;
  text-align: center;
  color: #999;
}
.title {
  margin: 20px auto 30px auto;
  text-align: center;
  color: #ffffff;
  font-size: 1.4em;
  line-height: 28px;
  font-family: Arial,'Times New Roman','Microsoft YaHei',SimHei;
}
a.verifycodea{ color: #fff;}
a.verifycodea:hover{ color: #fff; text-decoration: underline;}
</style>
