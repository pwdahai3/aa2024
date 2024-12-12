<template>
  <div class="autoconfigtree-wrapper">

    <h2 class="pagetitle">{{$route.query.pageurl}} <el-button style="margin-left:30px;" type="primary" size="mini" @click="showAddDomain()">{{$t('lg.jichupeizhi')}}</el-button></h2>
    <el-tree
      :data="popgettreedata"
      :props="defaultProps"
      @node-click="handleNodeClick"
      default-expand-all="default-expand-all"
      :expand-on-click-node="false">
    </el-tree>

    <!-- 基础配置弹框 -->
    <el-dialog width="40%" :title="$route.query.pageurl" :visible.sync="isinnerRoot" append-to-body="append-to-body"> 
      <el-form :model="innerrootform" :rules="innerrootformRules" ref="innerrootform" label-width="80px">
        <el-form-item :label="$t('lg.protocol')" prop="http">
          <el-select v-model="innerrootform.http" style="width:100%" disabled>
            <template>
              <el-option label="http" value="http"></el-option>
              <el-option label="https" value="https"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.bsdomain')"  prop="domain">
          <el-input v-model="innerrootform.domain" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.bsport')" prop="domainPort">
          <el-input v-model.number="innerrootform.domainPort" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.selectcer')"  prop="crts"  v-if="innerrootform.http=='https'">
          <el-select v-model="innerrootform.crts" :placeholder="$t('lg.select')" disabled>
            <template>
              <el-option v-for="(item,index) in crts" :key="index" :label="item.name" :value="item.name"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.selectsec')" prop="keys" v-if="innerrootform.http=='https'">
          <el-select v-model="innerrootform.keys" :placeholder="$t('lg.select')" disabled>
            <template>
              <el-option v-for="(item,idx) in keys" :key="idx" :label="item.name" :value="item.name"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="innerrootform.ip" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.port')" prop="ipPort">
          <el-input v-model.number="innerrootform.ipPort" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addDomain('innerrootform')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="addDomainLoading"></loading>
    </el-dialog>

    <!-- 单击增加location弹框 -->
    <el-dialog width="55%" :title="innerTi" :visible.sync="isnotinnerRoot" append-to-body="append-to-body">
      <div class="locationBox">
        <span class="titleSpan">{{$t('lg.addprotected')}}</span>
        <el-form ref="innernotrootform" :model="innernotrootform" :rules="innernotrootformRules" label-width="135px">
          <el-row :gutter="10">
            <el-col :span="20">
              <div class="grid-content">
                <el-form-item :label="$t('lg.protectedpos')" prop="location">
                  <el-input v-model="innernotrootform.location" placeholder="location" disabled></el-input>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="grid-content">
                <el-button type="primary" style="width:100%" @click="addLocation">{{$t('lg.add')}}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="locationBox configBox">
        <span class="titleSpan">{{$t('lg.addconfig2')}}</span>
        <p v-if="noLocationData" class="text-center">{{$t('lg.nodata')}}</p>
        <el-collapse v-model="activeName" accordion v-else>
          <el-collapse-item v-for="(item,index) in gridData" :title="item.linkName" :name="item.id">
            <div class="arj-box" v-show="gridDataLen!=0">
              <el-row>
                <el-col :span="20">
                  <template>
                    <el-checkbox-group v-model="item.checkListModel" @change="checkedChange(item)">
                      <el-checkbox :label="$t('lg.replaceconfig')"></el-checkbox>
                      <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="item.isCheckDisable"></el-checkbox>
                      <el-checkbox :label="$t('lg.encrypt2')" :disabled="item.isCheckDisable"></el-checkbox>
                      <el-checkbox :label="$t('lg.encryptab')" :disabled="item.isCheckDisable"></el-checkbox>
                      <el-checkbox :label="$t('lg.encryptpa')" :disabled="item.isCheckDisable"></el-checkbox>
                    </el-checkbox-group>
                  </template>
                </el-col>
                <el-col :span="4" class="text-center"><el-button type="primary" size="mini" @click="saveUri(item,index)" style="padding:5px 15px">{{$t('lg.add')}}</el-button></el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <loading :title="$t('lg.handling')" v-show="addDomainLoading"></loading>
    </el-dialog>

    <!-- 生成配置按钮 -->
    <div class="borderBox">
      <el-button type="primary" @click="generateConfig">{{$t('lg.generateconfig')}}</el-button>
    </div>

    <!-- 拓扑树 -->
    <theconfig ref="childconf"></theconfig>

    <div style="margin:0 20px 10px">
      <!-- <a href="javascript:;" class="downloada" ref="downconfa" @click="downloadConf">下载配置</a> -->
      <el-button type="primary" @click="pushConf">{{$t('lg.pushconfig')}}</el-button>
    </div>

    <el-dialog width="40%" :title="$t('lg.pushconfig')" :visible.sync="isPushShow" :close-on-click-modal="false" :before-close="pushmodalResetForm">
      <el-form ref="shadownodesform" :model="shadownodesform" label-width="110px" :rules="shadownodesformRules">
        <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
            <template v-for="n in nodesdata">
              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pushmodalFn('shadownodesform')">{{$t('lg.yes')}}</el-button>
          <el-button @click="pushmodalResetForm">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import theconfig from './config';
export default {
  created(){
    this.$store.state.contentLoading=true;
    // this.atcSnodeid=this.$route.query.pageurl.replace(/http(s)?:\/\//,"").replace(/\/$/,"");
    this.getAutoconfigTree();
  },
  data() {
    return {
      isPushShow:false,
      shadownodesform:{
        shadownodes:''
      },
      nodesdata:[],
      // atcSnodeid:'',
      baseUrl:'',
      popgettreedata:[],
      activeName:'1',
      gridData:[],
      gridDataLen:0,
      noLocationData:false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      innerTi: '',
      isinnerRoot: false,
      isnotinnerRoot:false,
      innerrootform: {
        crts:'server.key',
        keys:'server.key',
        domain: '',
        domainPort:'',
        ip:'',
        ipPort:'',
        http:'',
        iporigininput:''//存储起始路径，不用在页面显示，仅作为调api的参数
      },
      crts:[{
        name:"server.key"
      }],
      keys:[{
        name:"server.key"
      }],
      innernotrootform:{
        location:''
      },
      innerrootformRules: {
        http:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        domain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        crts:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        keys:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
        ipPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ],
      },
      innernotrootformRules:{
        location:[{required:true, message:this.$t('lg.required'), trigger:'blur'}],
      },
      shadownodesformRules:{
        shadownodes:[{ required: true, message: this.$t('lg.required'), trigger: 'change' }]
      },
      addDomainLoading:false,
      //checkListModel:[],
    }
  },
  methods: {
    getAutoconfigTree(){//获取 页面的树状列表 以及基础配置表内容
      var _this=this;
      _this.popgettreedata=[];
      var queryParams=_this.$route.query.pageurl;
      var url=SERVER_API_URL+"autoconfig/url/list?baseURL="+encodeURIComponent(queryParams);
      axios.get(url).then((res)=>{
        // console.log(res.data.data)
        if(res.data.responseCode==0){
          var domain=res.data.data.domain;
          var baseurl=res.data.data.baseURL;
          _this.baseUrl=baseurl;

          var htp = baseurl.split(":")[0];
          var lesspage=baseurl.replace(/http(s)?:\/\//, "").replace(/\/$/, "");
          var nameArr = lesspage.split(":");
          var portArr = nameArr[1].split("/");
          var ip = nameArr[0], port = portArr[0];
          var iporigininput = nameArr[1].replace(port,"");
        
          _this.$store.state.autoconfigport=portArr[0];//作为判断是否需要进行基础配置的依据
          _this.$store.state.autoconfiginput=domain;//作为判断是否需要进行基础配置的依据
          _this.$store.state.autoconfigsnodeid=lesspage;

          _this.innerrootform.http = htp;//基础配置表内容
          _this.innerrootform.domain = domain;
          _this.innerrootform.domainPort = port;
          _this.innerrootform.ip = ip;
          _this.innerrootform.ipPort=port;
          _this.innerrootform.iporigininput=iporigininput;
          
          var urlTree=res.data.data.urlTree;// 页面的树状列表
          _this.popgettreedata.push(urlTree);
          // console.log(this.popgettreedata);
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
    showAddDomain(){//基础配置 增加domain弹框
      this.isinnerRoot = true;
    },
    addDomain(formname) {//增加domain 增加业务
      var _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var url = SERVER_API_URL + "pe/shadow/domain?autoconfig=true";
          var domain = _this.innerrootform.domain,
              port = _this.innerrootform.domainPort,
              ip=_this.innerrootform.ip,
              ipport=_this.innerrootform.ipPort,
              iporigininput=_this.innerrootform.iporigininput,
              myhttp=_this.innerrootform.http;
          var snodeId = ip+":"+port + iporigininput;
          var ipportStr = ip + ":" + ipport;
          _this.addDomainLoading = true;
          var dataJson={
              snodeId: snodeId,
              domainName: domain,
              domainPort: port,
              serverScheme:myhttp,
              servers: [
                {
                  server: ipportStr
                }
              ]
          };
          if(myhttp=="https"){
            dataJson.key=_this.innerrootform.crts;
            dataJson.crt=_this.innerrootform.keys;
          }
          axios.post(url, dataJson).then((res) => {
            if (res.data.responseCode==0) {
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$refs.childconf.$emit('p2cautoconf');
              _this.isinnerRoot = false;
            } else {
              _this.$message.error(res.data.data.message);
            }
            _this.addDomainLoading = false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    handleNodeClick(item) {// 增加location弹框
      // console.log(item)
      var _this = this;
      _this.gridData=[];
      item.checkListModel=[];
      var page = item.page;
      var name=item.name
      _this.innerTi = name;
      _this.innernotrootform.location=name;
      var url=SERVER_API_URL+"autoconfig/page?baseURL="+encodeURIComponent(_this.$route.query.pageurl)+"&page="+encodeURIComponent(page);
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          var linkArray=res.data.data.link;
          _this.isnotinnerRoot=true;
          if(linkArray.length==0){
            _this.noLocationData=true;
          }else{
            _this.noLocationData=false;
            _this.gridDataLen=linkArray.length;
            var gridDataArray=[];
            linkArray.forEach(function(v,i){
              gridDataArray.push({
                linkName:v,
                isCheckDisable:false,
                checkListModel:[]
              });
            });
            _this.gridData=gridDataArray;
          }
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    checkedChange(val){//选择替换配置后，禁用其他配置
      var _this=this;
      if(val.checkListModel.length==0){
        val.isCheckDisable = false;
      };
      val.checkListModel.forEach(function(v,i){
        if(v=="替换配置" || v=="Replacement configuration"){
          val.isCheckDisable = true;
          val.checkListModel=[_this.$t('lg.replaceconfig')];
        }else{
          val.isCheckDisable = false;
        }
      });
    },
    addLocation(){//增加location
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/domain/location?autoconfig=true";
      var domain = _this.innerrootform.domain,
          port = _this.innerrootform.domainPort,
          ip=_this.innerrootform.ip,
          ipport=_this.innerrootform.ipPort,
          iporigininput=_this.innerrootform.iporigininput,
          location=_this.innernotrootform.location;
      var snodeId = ip+":"+port + iporigininput;
      
      if(!_this.$store.state.alreadyhasdomian){
        _this.$message.error(_this.$t('lg.basicconfig'));
        return;
      }
      _this.addDomainLoading=true;
      axios.post(url,{
        snodeId:snodeId,
        domainName:domain,
        domainPort:port,
        locationName:location,
        locationType:"accurateMatch",
        obfuscate:'off',
        waf:"off"
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$refs.childconf.$emit('p2cautoconf');
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
        }
        _this.addDomainLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    saveUri(item,index){//添加保护配置
      var _this=this;
      // console.log(item);
      var rr=_this.$t('lg.replaceconfig'),
          aa=_this.$t('lg.allowaccessourl'),
          ee=_this.$t('lg.encrypt2'),
          ss=_this.$t('lg.encryptab'),
          pp=_this.$t('lg.encryptpa');
      var cklistModelArrStr=(item.checkListModel).join("");
      var getARE=cklistModelArrStr.replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,"s").replace(pp,"p");
      var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      
      // var tiaozUri,locationVArr,locationVLen;
      // if(/^\.\.\/[^\.]/.test(item)){
      //     locationVArr=this.innerTi.split("/");
      //     locationVLen=locationVArr.length-2;
      //     locationVArr.splice(locationVLen,2);
      //     if(locationVArr.length>1){
      //         locationVArr=locationVArr.join("/");
      //     }else{
      //         locationVArr=locationVArr+"/";
      //     }
      //     tiaozUri=this.innerrootform.domain+locationVArr+item.replace("../","");
      // }else if(/^\.\/[^\.]/.test(item)){
      //     locationVArr=this.innerTi.split("/");
      //     locationVLen=locationVArr.length-1;
      //     locationVArr.splice(locationVLen,1);
      //     if(locationVArr.length>1){
      //         locationVArr=locationVArr.join("/");
      //     }else{
      //         locationVArr=locationVArr+"/";
      //     }
      //     tiaozUri=this.innerrootform.domain+locationVArr+item.replace("./","");
      // }else{
      //     tiaozUri=item;
      // }
      // var base64Str=Base64.encode("'"+item+"'"+" "+"'"+tiaozUri+"'"+" "+"500s 1 "+getARE);

      var base64Str=Base64.encode("'"+item.linkName+"'"+" "+"'"+item.linkName+"'"+" "+"500s 1 "+getARE);

      var domain = _this.innerrootform.domain,
          port = _this.innerrootform.domainPort,
          ip=_this.innerrootform.ip,
          ipport=_this.innerrootform.ipPort,
          iporigininput=_this.innerrootform.iporigininput,
          location=_this.innernotrootform.location;
      var snodeId = ip+":"+port + iporigininput;
      var jsonData={
          snodeId:snodeId,
          domainName:domain,
          domainPort:port,
          locationName:location,
          locationType:"accurateMatch",
          directives:[{shadow_sub_filter:base64Str}]
      }
      _this.addDomainLoading=true;
      axios.post(url,jsonData).then((res)=>{
        if(res.data.responseCode==0){
          _this.$refs.childconf.$emit('p2cautoconf');
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.addDomainLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    generateConfig(){//生成配置 获取页面的详细信息
      var _this=this;
      var url=SERVER_API_URL+"autoconfig/generation";
      var baseUrl=_this.baseUrl,
          domain=_this.$store.state.autoconfiginput;
      axios.post(url,{
          baseURL:baseUrl,
          domain:domain
      }).then((res)=>{
        //   console.log(res)
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$refs.childconf.$emit('p2cautoconf');
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      });
    },
    // downloadConf(){
    //   var snodeid2=this.atcSnodeid+".conf";
    //   var url=SERVER_API_URL+"download/autoconfig/conf/"+snodeid2;
    //   var tgElement=this.$refs.downconfa;
    //   tgElement.setAttribute("href",url);
    // },
    pushConf(){//打开推送配置弹框
      var _this=this;
      var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          _this.nodesdata=res.data.data;
          _this.isPushShow=true;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    pushmodalFn(formname){//推送配置 
      var _this=this;
      _this.$refs[formname].validate((valid) => {
        if(valid){
          var url=SERVER_API_URL+"pe/push?autoconfig=true";
          var srcSnodeId=_this.$store.state.autoconfigsnodeid;
          axios.post(url,{
            dstSnodeId: _this.shadownodesform.shadownodes,
            srcSnodeId: srcSnodeId
          }).then((res)=>{
            if(res.data.responseCode=="0"){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.pushmodalResetForm();
            }else{
              const responseMsg=res.data.data.message;
              if(responseMsg.indexOf("duplicate") != -1){
                _this.$message.error(_this.$t('lg.failed')+':'+_this.$t('lg.zhu50') );
              }else{
                _this.$message.error(_this.$t('lg.failed')+': '+ responseMsg);
              }
            }
          }).catch((err)=>{
            console.log(err)
          });
        }
      });
    },
    pushmodalResetForm(){//取消推送配置，关闭
      this.$refs['shadownodesform'].resetFields();
      this.isPushShow=false;
    },
  },
  components: {
    loading,
    theconfig
  }
}
</script>
<style scoped>
.autoconfigtree-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding:15px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
}
.pagetitle{
  font-size: 16px; margin-bottom: 18px; font-weight: 400
}
.locationBox{
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 40px 20px 20px 20px;
  position: relative;
  margin-top: 6px;
}
.configBox{
  margin-top: 50px;
}
.downloada{
  /*color: #fff;
   background-color: #409EFF;
  border-color: #409EFF; 
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-right:12px*/
}
.borderBox{
  padding: 20px;
  border-bottom: 5px solid #eee;
}

</style>


    