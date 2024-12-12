<template>
  <div class="shadowpop-wrapper">
    <el-dialog width="80%" title="" :visible.sync="detailShow" :close-on-click-modal="false" :before-close="handleClose">
      <div class="formbox"> 
        <el-form ref="shadownodesform" :model="currentEditData" label-width="125px">
                <div class="itemdiv">
                  <p class="pp">针对防护的目录地址是否开启以下防护策略？ </p>
                  <p class="pp">拦截抓包工具，该功能用于拦截常见的应用层抓包工具，如fiddler、Burpsuite等，是否开启该功能？</p>
                  <el-form-item label="开启手动代理防御">
                    <el-switch v-model="currentEditData.shadow_request_time_switch" @change="onoff"></el-switch>
                  </el-form-item>
                  <el-form-item label="参数设置" prop="shadow_request_time" :rules="{pattern:/^[0-9]+$/,message: '请输入正数', trigger: 'change'}">
                    <el-input v-model.trim="currentEditData.shadow_request_time"></el-input>
                  </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">验证浏览器环境，验证访问者的访问工具是否符合浏览器标准，如使用自动化脚本访问则拦截，是否开启该功能？</p>
                  <div class="block">
                      <div class="tit">参数指标</div>
                      <div class="sli">
                        <el-slider v-model="currentEditData.shadow_verify_browser" :max="7" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                </div>
                <div class="itemdiv">
                  <p class="pp">检测用户行为，该功能用于检测访问者是否有使用鼠标键盘进行输入，是否开启该功能？</p>
                  <div class="block">
                      <div class="tit">行为指标</div>
                      <div class="sli">
                        <el-slider v-model="currentEditData.shadow_verify_agent" :max="3" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                </div>
                 <div class="itemdiv">
                  <p class="pp">验证ARG令牌，该功能是验证访问者必须携带动态令牌才能正常访问业务，是否开启该功能？</p>
                  <el-form-item label="开启">
                  <el-switch v-model="currentEditData.param_verify_switch"></el-switch>
                </el-form-item>

                </div>
                <div class="itemdiv">
                  <p class="pp">防扫描拦截，该功能用于拦截自动化工具扫描业务，是否开启该功能？</p>
                  <el-form-item label="开启">
                  <el-switch v-model="currentEditData.bot_conf_switch"></el-switch>
                </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">默认插入JS普通指令。UI默认选中"普通插入"</p>
                  <el-form-item label="Js增强方式" prop="insertJsType">
                  <el-radio v-model="currentEditData.insertJsType" label="1">普通插入</el-radio>
                  <el-radio v-model="currentEditData.insertJsType" label="2">增强插入</el-radio>
                  <el-radio v-model="currentEditData.insertJsType" label="3">不插入</el-radio>
                </el-form-item>
                </div>
                <div style="text-align:center;margin:42px 0 20px 0;">
                  <el-button type="primary" @click="tempsave">保存</el-button>
                </div>
        </el-form>
      </div> 
    </el-dialog>
  </div>
</template>
<script>
let Base64 = require('js-base64').Base64;
export default{
  props:{
    title:{
      type:[Object,String]
    },
    currentEditData:{
      type:Object
    },
    detailShow:{
      type:Boolean
    },
    type:{
      type:String
    },
    currentIndex:{
      type:String
    }
  },
  data(){
    return{
    //  oriEditedItem:{
    //       shadow_request_time_switch:false,
    //       shadow_request_time:0,
    //       shadow_verify_browser_switch:false,
    //       shadow_verify_browser:0,
    //       shadow_verify_agent_switch:false,
    //       shadow_verify_agent:0,
    //       param_verify_switch:false,
    //       bot_conf_switch:false,
    //       insertJsType:'3'
    //   },
    //   currentEditData: {}, // 当前编辑的数据项
    }
  },
  // watch: {
  //   data: {
  //     deep: true,
  //     handler(newVal) {
  //       // 当父组件传入的数据改变时，更新编辑的数据项的克隆
  //       this.currentEditData = { ...newVal };
  //     },
  //   },
  // },
  methods:{
    onoff(e){
      if(!e){
        this.currentEditData.shadow_request_time=null;
      }
    },
    tempsave() {
      // 保存当前编辑的数据到临时数组
      //  console.log("tempsve===")
      //  console.log(this.currentIndex)
      //  console.log(this.currentEditData)
      this.$emit('save-data', this.currentIndex, this.currentEditData);
      this.$emit("toClose", false);
    },
    handleClose() {
      this.$emit("toClose", false);
    },
    handleClick(){

    },
     
  },
  components:{
    
  }
}
</script>
<style scoped>
  .logp{
    margin:6px 0;
    text-overflow: ellipsis;
    line-height: 20px;
  }
  .bb{ color: #dd8527;}
  .spa{display: inline-block; margin-right: 10px;}
  .pp{line-height: 24px;}
  .formbox{padding: 0 20px;}
</style>

