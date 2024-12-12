<template>
  <div class="autoconfig-wrapper">
    <el-form class="form-bg" style="padding-bottom:0" ref="autoconfigfrom" :model="autoconfigfrom" :rules="autoconfigfromRules" label-width="0">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item prop="ipinput">
            <el-input placeholder="IP" v-model.trim="autoconfigfrom.ipinput" :disabled="isbegin" style="width:100%">
              <el-select v-model="selecthttp" slot="prepend" placeholder="http" @change="selecthttpors" style="width:90px">
                <el-option label="http://" value="http://"></el-option>
                <el-option label="https://" value="https://"></el-option>
              </el-select>
            </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="2">
        <div class="grid-content">
          <el-form-item prop="httpport">
            <el-input v-model.trim="autoconfigfrom.httpport" placeholder="PORT" :disabled="isbegin" style="width:100%"></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-form-item prop="iporigininput">
            <el-input v-model.trim="autoconfigfrom.iporigininput" :placeholder="$t('lg.startpath')" :disabled="isbegin" style="width:100%"></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-form-item prop="ipdomaininput">
            <el-input v-model.trim="autoconfigfrom.ipdomaininput" placeholder="DOMAIN" :disabled="isbegin" style="width:100%"></el-input>
          </el-form-item>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <el-button type="primary" @click="crawlPage" style="width:100%" :disabled="isbegin">{{$t('lg.pagecrawl')}}</el-button>
        </div>
      </el-col>
      </el-row>
    </el-form>
    <div class="autoconfigContent">
      <div v-if="crawlPages.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
      <table v-if="crawlPages.length>0">
        <thead>
          <tr>
            <th>URL</th>
            <th>{{$t('lg.starttime')}}</th>
            <th>{{$t('lg.endtime')}}</th>
            <th>{{$t('lg.status')}}</th>
            <th width='100px'></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in crawlPages" :key="index">
            <td>{{item.baseURL}}</td>
            <td>{{item.startTimestamp|toSDDate2}}</td>
            <td>{{item.endTimestamp|toSDDate2}}</td>
            <td>{{item.status}}</td>
            <td width="130">
              <template v-if="item.status=='complete'">
                <a href="javascript:;" class="edit-del-a" @click="getTreeClk(item.baseURL)"><i class="el-icon-check"></i>{{$t('lg.extractlist')}}</a>
                <a href="javascript:;" class="edit-del-a" @click="delTreeClk(item.baseURL)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </template>
              <a href="javascript:;"  class="edit-del-a" v-else><i class="el-icon-loading"></i>{{$t('lg.handling')}}</a>
              <!-- <a href="javascript:;"  class="edit-del-a"  @click="delTreeClk(item.baseURL)"><i class="el-icon-close"></i>删除</a> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar'
import * as types from '@/store/types'
let Base64 = require('js-base64').Base64;
export default {
  created(){
    this.$store.state.contentLoading=true;
    this.crawlStatus();
  },
  mounted(){
    this.$on("delCrawlpageEmit",()=>{
      this.crawlStatus();
    });
  },
  filters:{
    toSDDate2(val){
      if(!val) return;
      function transformMyDate(d){
        d=new Date(d);
        function pad(n){
          return n<10 ? '0'+n : n
        }
        return d.getFullYear()+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes())+":"+pad(d.getSeconds());
      }
      return transformMyDate(val)
    }
  },
  data() {
    return {
      // topologyShow:false,
      isbegin:false,
      selecthttp:'http://',
      autoconfigfrom:{
        ipinput:'',
        httpport:80,
        iporigininput:'/',
        ipdomaininput:'',
      },
      autoconfigfromRules:{
        ipinput:[//既能输域名又能输IP
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        httpport:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          { 
          validator: (rule, value, callback) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue) && numericValue > 1 && numericValue < 65535) {
              callback(); // 验证通过
            } else {
              callback(new Error('请输入1到65535之间的数字')); // 验证失败
            }
          },
          trigger: 'blur'
        }
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}
        ],
        iporigininput:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        ipdomaininput:[//既能输域名又能输IP
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },
      // gridDataLen:0,
      // dialogTableVisible:false,
      // isDomainRoot:false,
      // isLocationShow:false,
      // noLocationData:false,
      // showShadowNodes:false,
      // myLoading:false,
      // myLoading2:false,
      // uriShow:false,
      // input:'',
      // getShadowNodeId:'',
      // locationipt:'',
      // popTitle:'',
      // shadowNodes:[],
      // treedata:[],
      // popgettreedata:[],
      // popgettreeTi:'',
      // checkListModel:[],
      // defaultProps: {
      //   children: 'children',
      //   label: 'name'
      // },
      crawlPages:[],
    };
  },
  methods:{
    selecthttpors(item){
      var gethttps=item=="http://"?80:443;
      this.autoconfigfrom.httpport=gethttps;
    },
    crawlStatus(){
      var url2=SERVER_API_URL+"autoconfig/crawl/status";
      axios.get(url2).then((res)=>{
        if(res.data.responseCode==0){
          this.crawlPages=res.data.data;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
    crawlPage(){//页面抓取
      var _this=this;
      this.$refs['autoconfigfrom'].validate((valid)=>{
        if(valid){
          var url=SERVER_API_URL+"autoconfig/crawlanal";
          var url2=SERVER_API_URL+"autoconfig/crawl/status";
          var ipinput=this.autoconfigfrom.ipinput,
              httpport=this.autoconfigfrom.httpport,
              iporigininput=this.autoconfigfrom.iporigininput,
              ipdomaininput=this.autoconfigfrom.ipdomaininput;
          if(iporigininput=="/"){
            var autoconfig_all_str=ipinput+":"+httpport+"/";
          }else{
            var autoconfig_all_str=ipinput+":"+httpport+"/"+iporigininput+"/";
          }
          // this.$store.state.autoconfiginput=ipdomaininput;

          var autoconfig_all_str2=this.selecthttp+autoconfig_all_str;
          var crawltimer=null;
          var _this=this;
          axios.post(url,{
            baseURL:autoconfig_all_str2,
            domain:ipdomaininput
          }).then((res)=>{
            // console.log(res)
            if(res.data.responseCode==0){
              getCrawlPages();
              this.autoconfigfrom.ipinput = "";
              this.autoconfigfrom.ipdomaininput = "";
              this.autoconfigfrom.iporigininput = "";
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            function getCrawlPages(){
              function _crawTime(){
                axios.get(url2).then((res)=>{
                  // console.log(res)
                  _this.crawlPages=res.data.data;
                  crawltimer=setTimeout(()=>{
                    _crawTime();
                  },60000)
                });
              }
              _crawTime();
            }
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    getTreeClk(item){
      this.$router.push({path: '/autoconfigtree', query:{pageurl: item}});
    },
    delTreeClk(item){//删除页面的生成列表
      var _this=this;
      const url=SERVER_API_URL+"autoconfig/url/list?baseURL="+encodeURIComponent(item);
      axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            message: _this.$t('lg.success'),
            type: 'success'
          });
          _this.$emit("delCrawlpageEmit");
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    // handleNodeClick(data) {
    //   this.gridData=[];
    //   this.checkListModel=[];
    //   var page=data.page;
    //   this.dialogTableVisible=true;
    //   this.popTitle=page;
    //   this.locationipt=data.name;
    //   if(data.root){
    //     this.isDomainRoot=true;
    //     this.isLocationShow=false;
    //     this.showShadowNodes=false;
    //   }else{
    //     this.isDomainRoot=false;
    //     this.isLocationShow=true;
    //     var url="http://192.168.2.201:63002/autoconfig/page?baseURL="+encodeURIComponent(this.input)+"&page="+encodeURIComponent(page);
    //     axios.get(url).then((res)=>{
    //       if(res.data.length==0 || res.data.link.length==0){
    //         this.noLocationData=true;
    //       }else{
    //         this.noLocationData=false;
    //         this.gridData=res.data.link;
    //         this.gridDataLen=this.gridData.length;
    //         for(var i=0;i<this.gridDataLen;i++){
    //           var itemObj={value:[]};
    //           this.checkListModel.push(itemObj);
    //         }
    //       }
    //     }).catch((err)=>{
    //       this.$notify.error({
    //         title: '错误',
    //         message: err
    //       });
    //     })
    //   } 
    // },
  }
};
</script>
<style lang="stylus" scoped>
  .autoconfig-wrapper
    height 100%
    width 100%
    padding 15px
    box-sizing border-box
    overflow hidden
    .autoconfigContent
      height 100%
      width 100%
      overflow hidden
    // overflow-y:auto
    // .el-select
    //   .el-input
    //     width:130px
    // .input-wrapper
    //   padding:20px
    //   display:flex
    //   margin-bottom :12px
    //   background :$grey-color
      // .ipt-1
      //   flex:1
      //   margin-right:12px
      // .ipt-11
      //   flex:0 0 80px
      //   width:80px
      //   margin-right:12px
      // .ipt-2
      //   flex:0 0 130px
      //   width:130px
    // .eltree-box
    //   padding:14px 20px
    // .domain-pop-wrapper
    //   .part0
    //     margin-bottom :12px
    //     font-size :12px
    //     cursor: pointer
    //     .grey-f-color
    //       color :$grey-f-color
    //       margin-right:4px
    //     .red-f-color
    //       color:$red-f-color
    //       font-size:12px
    //   .content-box
    //     display:flex
    //     .part1
    //       flex:1
    //     .part2
    //       flex:1
    //       margin-left:6px
    //       display:flex
    //       .part2-1
    //         flex:1
    //         margin:0 6px
    // .location-pop-wrapper
    //   .locationipt-box
    //     display:flex
    //     margin-bottom:12px
    //     background-color:#f0f0f0
    //     padding:8px
    //     .loc-part1
    //       flex:1
    //       margin-right:12px
    //     .loc-part2
    //       flex:0 0 80px
    //       width:80px
    //   .arj-box
    //     display:flex
    //     .arj-part1
    //       flex:1
    //     .arj-part2
    //       flex:0 0 120px
    //       width:120px
    //   .el-collapse
    //     .el-collapse-item
    //       .el-collapse-item__header
    //         font-size:16px
    //       .el-collapse-item__wrap
    //         background:#f0f0f0
    //         .el-checkbox
    //           color:#888
    //           .el-checkbox__label
    //             font-size:12px
    // .el-dialog__body
    //   padding:15px 20px
  // .autoconfig-topology
  //   width :100%
  //   height:800px
</style>