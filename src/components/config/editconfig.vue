<!-- 文件管理-修改配置文件-->
<template>
  <div class="aa">
    <el-dialog width="75%" :title="$t('lg.editconfig')" :visible.sync="isEditShow" :close-on-click-modal="false" :before-close="isEditClose">
			<div class="editConfig-wrapper">
				<div class="matchtips" style="top:-18px">
          <span><i class="i1"></i>{{$t('lg.exactmatch')}}</span><span><i class="i2"></i>{{$t('lg.suffixmatch')}}</span><span><i class="i3"></i>{{$t('lg.patchmatch')}}</span><span><i class="i4"></i>{{$t('lg.dynamicurl')}}</span><span><i class="i5"></i>{{$t('lg.tongyongpp')}}</span> <i class="fa fa-font font-red2"></i>{{$t('lg.wafstart')}}
				</div>
        <div v-if="isNoData" class="noConfigData-box">{{$t('lg.nodata')}}</div>
				<div id="editshadowtree" ref="editshadowtree" v-else>
          <svg><g></g></svg>
				</div>

        <!-- 文件名节点右键菜单 -->
        <div class="ed-contextmenu edshadowmenu">
          <ul class="ctxEd-downmenu">
            <li class="item" @click="sdWarningMode">{{$t('lg.monitormode')}}</li>
            <li class="item" @click="sdSeniorInstruct">{{$t('lg.gaojipeiz')}}</li>
            <li class="item" @click="sdGlbInstruct">{{$t('lg.zidingyipz')}}</li>
            <li class="item" @click="sdCustomUpstream">{{$t('lg.zidingyiups')}}</li>
            <!-- <li class="item" @click="sdRequestTime">请求超时时间</li>
            <li class="item" @click="sdApi">API防护设置</li>
            <li class="item" @click="sdDefenseCookie">{{$t('lg.dycookieparams')}}</li> -->
          </ul>
        </div>
        <!-- domain节点右键菜单 -->
				<div class="ed-contextmenu eddomainmenu">
					<ul class="ctxEd-downmenu">
						<!-- <li class="item" @click="dmUpstreamModal">添加服务器</li> -->
						<li class="item" @click="dmUpstreamlistModal">{{$t('lg.manageserver')}}</li>
						<!-- <li class="item" v-if="$store.state.licenceinfo.waf==1" @click="dmWafModal">{{$t('lg.wafdetail')}}</li> -->
						<li class="item" @click="dmRedirectModal">{{$t('lg.redirect302')}}</li>
            <!-- <li class="item" @click="dmVerifyToken">动态指纹功能</li> -->
            <li class="item" @click="dmLimReq">{{$t('lg.heimingdfhpz')}}</li>
            <li class="item" @click="dmGlbInstruct">{{$t('lg.zidingyipz')}}</li>
						<li class="item" @click="dmEditModal">{{$t('lg.edit')}}</li>
						<li :class="onlyDomain?'item , notallow':'item'" @click="dmDelete">{{$t('lg.delete')}}</li>
					</ul>
				</div>
        <!-- location节点右键菜单 -->
				<div class="ed-contextmenu edlocationmenu">
					<ul class="ctxEd-downmenu">
            <li class="item" @click="lcProtectInstruct">{{isDenyUrl?$t('lg.mingwenjjurl'):$t('lg.baohupz')}}</li> 
            <li class="item" @click="lcSpecialProtectInstruct" v-show="!isDenyUrl">{{$t('lg.teshubhpz')}}</li> 
            <li class="item" @click="lcSkipInstruct" v-show="!isDenyUrl">{{$t('lg.tiaozpz')}}</li> 
            <li class="item" @click="lcSeniorInstruct" v-show="!isDenyUrl">{{$t('lg.gaojipeiz')}}</li>
            <li class="item" @click="lcCustomInstruct" v-show="!isDenyUrl">{{$t('lg.zidingyipz')}}</li>
						<!-- <li class="item" @click="lcConfcmdlistModal">{{$t('lg.configinstructiondetail')}}</li> -->
            <!-- <li class="item" @click="lcWebsocketModal" v-show="!isDenyUrl">{{$t('lg.websocketdetail')}}</li> -->
            <!-- <li class="item" @click="lcDefenseCookieModal" v-show="!isDenyUrl">{{$t('lg.dynamicdfcookie')}}</li> -->
            <!-- <li class="item" @click="lcProxyPassModal" v-show="!isDenyUrl">{{$t('lg.proxypassdetail')}}</li> -->
            <!-- <li class="item" @click="lcRootModal" v-show="!isDenyUrl">查看网站目录</li> -->
            <!-- <li class="item" @click="lcHostPortModal">查看HostPort</li>
            <li class="item" @click="lcNtlmModal">查看ntlm长连接</li> -->
						<li class="item" v-if="$store.state.licenceinfo.waf==1" @click="lcwafModal" v-show="!isDenyUrl">{{$t('lg.wafdetail')}}</li>
						<li class="item" @click="lcEditModal" v-show="!isDenyUrl">{{$t('lg.edit')}}</li>
						<li class="item" @click="lcDelete">{{$t('lg.delete')}}</li>
					</ul>
				</div>

        <!-- 文件名节点触摸框 -->
        <div class="ed-onoff-box">
          <p style="padding:0px 10px;">{{shadowObj.name}}</p>
        </div>
        <!-- domain节点触摸框 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
        <div class="ed-onoff-DomainBox">
          <p style="padding:0px 10px;">{{domainObj.domainName+':'+domainObj.port}}</p>
        </div>
        <!-- location节点触摸框 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
        <div class="ed-onoff-LocationBox"> 
          <p style="padding:0px 10px;">{{locationObj.nameTxt}}</p>
        </div>
        <!--最后一层节点触摸框 保护配置&特殊保护配置 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
        <div class="ed-onoff-InstructBox">
          <p style="padding:0px 10px;">{{instructObj.name}}</p>
        </div>

			</div>	
			<div v-show="editConfigLoading">
        <loading></loading>
      </div>
	  </el-dialog>
    <!--这些子组件也是element的Dialog，放上面会形成嵌套的Dialog，可以用append-to-body属性解决，这里直接放在编辑拓扑图Dialog的平行层就不用每个子组件都加一次append-to-body属性-->
    <shadowpop :shadowDialogVisible="shadowDialogVisible" :isEditConfig="isEditConfig" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" @setbyshadowpopchild="shadowDialogVisible=false" @updateRenderTree="dataRenderTree"></shadowpop>
    <sd-warning-mode ref="sd_warningMode" :isShow="sdWarningModemodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdWarningModemodal="sdWarningModemodalShow=false"></sd-warning-mode>
    <sd-senior-instruct ref="sd_seniorInstruct" :isShow="sdSeniorInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdSeniorInstructmodal="sdSeniorInstructmodalShow=false"></sd-senior-instruct>
    <sd-glb-instruct ref="sd_glbInstruct" :isShow="sdGlbInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdGlbInstructmodal="sdGlbInstructmodalShow=false"></sd-glb-instruct>
    <sd-custom-upstream ref="sd_customUpstream" :isShow="sdCustomUpstreammodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdCustomUpstreammodal="sdCustomUpstreammodalShow=false"></sd-custom-upstream>
    <!-- <sd-agent-timeout ref="sd_agentTimeout" :isShow="sdAgentTimeoutmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdAgentTimeoutmodal="sdAgentTimeoutmodalShow=false"></sd-agent-timeout> -->
    <!-- <sd-api ref="sd_api" :isShow="sdApimodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbysdApimodal="sdApimodalShow=false"></sd-api> -->
		<!-- <sd-defense-cookie ref="sd_defenseCookiemodal" :isShow="sdDefenseCookiemodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" @setbydefensecookiemodal="sdDefenseCookiemodalShow=false"></sd-defense-cookie> -->

    <domainpop :domainDialogVisible="domainDialogVisible" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" @setbydomainpopchild="domainDialogVisible=false" @updateRenderTree="dataRenderTree"></domainpop>
    <dm-upstreamlist ref="dm_upstreamlist" :isShow="upstreamlistmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreamlistmodal="upstreamlistmodalShow=false"></dm-upstreamlist>
    <!-- <dm-waf :wafmodalShow="wafmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmWafData"  @setbysavewafmodal="wafmodalShow=false" @updateRenderTree="dataRenderTree"></dm-waf> -->
    <dm-redict :redirectmodalShow="redirectmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :data="redirect302Url" @setbyredictmodal="redirectmodalShow=false" @setredirect="setRedirectInput"></dm-redict>
    <!-- <dm-verify-token ref="dm_verifyToken" :isShow="dmVerifyTokenmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmverifyTokenmodal="dmVerifyTokenmodalShow=false"></dm-verify-token> -->
    <dm-limit-req ref="dm_limitReq" :isShow="dmLimReqmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmlimReqmodal="dmLimReqmodalShow=false"></dm-limit-req>
    <dm-glb-instruct ref="dm_glbInstruct" :isShow="dmGlbInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmGlbInstructmodal="dmGlbInstructmodalShow=false"></dm-glb-instruct>
    <dm-edit :dmEditmodalShow="dmEditmodalShow" :isEditConfig="isEditConfig" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmEditObj" @setbydmEditmodal="dmEditmodalShow=false" @updateRenderTree="dataRenderTree"></dm-edit>
    
    <!-- <locationpop :locationDialogVisible="locationDialogVisible" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylocationpopchild="locationDialogVisible=false" @updateRenderTree="dataRenderTree"></locationpop> -->
    <lc-protect-instruct ref="lc_protectInstruct" :isShow="lcprotectInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcProtectInstructmodal="lcprotectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-protect-instruct>
    <lc-special-protect-instruct ref="lc_specialProtectInstruct" :isShow="lcSpecialProtectInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSpecialProtectInstructmodal="lcSpecialProtectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-special-protect-instruct>
    <lc-skip-instruct ref="lc_skipInstruct" :isShow="lcSkipInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSkipInstructmodal="lcSkipInstructmodalShow=false"></lc-skip-instruct>
    <lc-senior-instruct ref="lc_seniorInstruct" :isShow="lcSeniorInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSeniorInstructmodal="lcSeniorInstructmodalShow=false"></lc-senior-instruct>
    <lc-custom-instruct ref="lc_customInstruct" :isShow="lcCustomInstructmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcCustomInstructmodal="lcCustomInstructmodalShow=false"></lc-custom-instruct>
    <!-- <lc-cmdlist :isShow="lccmdlistmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :isType="isSpecialType" :cmdDatas="lcconfcmdObj" @lccmdlistmodalclose="lccmdlistmodalShow=false;lcconfcmdObj={}" @updateLcConfcmd="lcConfcmdlistModal" @updateRenderTree="dataRenderTree"></lc-cmdlist> -->
    <!-- <lc-websocket :isShow="lcwebsocketmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcWebsocketData" @setbylcWebsocketmodal="lcwebsocketmodalShow=false" @updateRenderTree="dataRenderTree"></lc-websocket> -->
    <!-- <lc-defense-cookie :isShow="lcDefenseCookiemodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcDefenseCookieData" @setbylcDefenseCookiemodal="lcDefenseCookiemodalShow=false" @updateRenderTree="dataRenderTree"></lc-defense-cookie> -->
    <!-- <lc-proxypass ref="lc_proxyPass" :isShow="lcproxypassmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcProxypassmodal="lcproxypassmodalShow=false" @updateRenderTree="dataRenderTree"></lc-proxypass> -->
    <!-- <lc-root ref="lc_root" :isShow="lcRootmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcRootmodal="lcRootmodalShow=false"></lc-root> -->
    <!-- new 新的写法 不传数据-->
    <!-- <lc-ntlm ref="lc_ntlm" :isShow="lcNtlmmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcNtlmmodal="lcNtlmmodalShow=false" @updateRenderTree="dataRenderTree"></lc-ntlm> -->
    <lc-waf :isShow="lcwafmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcwafData" @setbylcwafmodal="lcwafmodalShow=false" @updateRenderTree="dataRenderTree"></lc-waf>
    <lc-edit :lcEditmodalShow="lcEditmodalShow" :isEditConfig="isEditConfig" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcEditmodal="lcEditmodalShow=false" @updateRenderTree="dataRenderTree"></lc-edit>
	</div>
</template>
<script>
import * as d3 from 'd3';
import * as types from '@/store/types';
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
import axios from 'axios';
let Base64 = require('js-base64').Base64;
import {handleConfigure} from '@/assets/js/tool';

import shadowpop from '@/components/pubconfig/shadowpop';
import sdWarningMode from '@/components/pubconfig/sd_warningMode';
import sdSeniorInstruct from '@/components/pubconfig/sd_seniorInstruct';
import sdGlbInstruct from '@/components/pubconfig/sd_glbInstruct';
import sdCustomUpstream from '@/components/pubconfig/sd_customUpstream';
// import sdAgentTimeout from '@/components/pubconfig/sd_agentTimeout';
// import sdApi from '@/components/pubconfig/sd_api';
// import sdDefenseCookie from '@/components/pubconfig/sd_defenseCookie';

import domainpop from '@/components/pubconfig/domainpop';
import dmUpstreamlist from '@/components/pubconfig/dm_upstreamlist';
// import dmWaf from '@/components/pubconfig/dm_wafstatus';
import dmRedict from '@/components/pubconfig/dm_redirect302';
// import dmVerifyToken from '@/components/pubconfig/dm_verifyToken';
import dmLimitReq from '@/components/pubconfig/dm_limitReq';
import dmGlbInstruct from '@/components/pubconfig/dm_glbInstruct';
import dmEdit from '@/components/pubconfig/dm_edit';

// import locationpop from '@/components/pubconfig/locationpop';
import lcProtectInstruct from '@/components/pubconfig/lc_protectInstruct';
import lcSpecialProtectInstruct from '@/components/pubconfig/lc_specialProtectInstruct';
import lcSkipInstruct from '@/components/pubconfig/lc_skipInstruct';
import lcSeniorInstruct from '@/components/pubconfig/lc_seniorInstruct';
import lcCustomInstruct from '@/components/pubconfig/lc_customInstruct';
// import lcCmdlist from '@/components/pubconfig/lc_confcmdlist';
// import lcWebsocket from '@/components/pubconfig/lc_websocket';
// import lcDefenseCookie from '@/components/pubconfig/lc_defenseCookie';
// import lcProxypass from '@/components/pubconfig/lc_proxypass';
// import lcRoot from '@/components/pubconfig/lc_root';
// import lcNtlm from '@/components/pubconfig/lc_ntlm';
import lcWaf from '@/components/pubconfig/lc_wafstatus';
import lcEdit from '@/components/pubconfig/lc_edit';
export default{
  components:{
    loading,

    shadowpop,
    sdWarningMode,
    sdSeniorInstruct,
    sdGlbInstruct,
    sdCustomUpstream,
    // sdAgentTimeout,
    // sdApi,
    // sdDefenseCookie,

    domainpop,
    dmUpstreamlist,
    // dmWaf,
    dmRedict,
    // dmVerifyToken,
    dmLimitReq,
    dmGlbInstruct,
    dmEdit,

    // locationpop,
    lcProtectInstruct,
    lcSpecialProtectInstruct,
    lcSkipInstruct,
    lcSeniorInstruct,
    lcCustomInstruct,
    // lcCmdlist,
    // lcWebsocket,
    // lcDefenseCookie,
    // lcProxypass,
    // lcRoot,
    // lcHostPort,
    // lcNtlm,
    lcWaf,
    lcEdit,
  },
  props:{
    isEditShow:{
      type:Boolean
    },
    editFile:{
      type:String
    },
  },
  data(){
    return{
      isEditConfig:true,//公用组件，判断是否为编辑拓扑图的参数
      editConfigLoading:false,

      isNoData:false,//当conf文件内容有问题或者为空时
      jsonData:{
        name: "",
        shadowtitle:true,
        children:[]
      },
      shadowObj:{
        snodeId:'',
        name:''
      },
      domainObj:{
        domainName:'',
        port:80
      },
      locationObj:{
        type:'',
        name:'',
        nameTxt:'',
      },
      instructObj:{//最后一层触摸显示完整name
        name:''
      },

      // onoff:'',
      // onoffIp:'',
      // myVersion:'',
      keys:[{  //证书是位于节点上的，这里没有节点，所有文件写死为server.key
        name:"server.key"
      }],
      diplomas:[{
        name:"server.key"
      }],
      crts:[],
      pems:[],
      shadownodes:[],

      lcconfcmdObj:{},
      shadowDialogVisible:false,
      sdWarningModemodalShow:false,
      sdSeniorInstructmodalShow:false,
      sdGlbInstructmodalShow:false,
      sdCustomUpstreammodalShow:false,
      // sdAgentTimeoutmodalShow:false,
      // sdApimodalShow:false,
      // sdDefenseCookiemodalShow:false,

      domainDialogVisible:false,
      upstreamlistmodalShow:false,
      redirectmodalShow:false,
      // dmVerifyTokenmodalShow:false,
      dmLimReqmodalShow:false,
      dmGlbInstructmodalShow:false,
      dmEditmodalShow:false,
      // wafmodalShow:false,

      // locationDialogVisible:false,
      lcprotectInstructmodalShow:false,
      lcSpecialProtectInstructmodalShow:false,
      lcSkipInstructmodalShow:false,
      lcSeniorInstructmodalShow:false,
      lcCustomInstructmodalShow:false,
      // lccmdlistmodalShow:false,
      // lcwebsocketmodalShow:false,
      // lcDefenseCookiemodalShow:false,
      // lcproxypassmodalShow:false,
      // lcRootmodalShow:false,
      // lcHostPortmodalShow:false,
      // lcNtlmmodalShow:false,
      lcwafmodalShow:false,

      dmWafData:{},

      lcWebsocketData:{},
      lcDefenseCookieData:{},
      lcwafData:{},
      lcEditmodalShow:false,
      redirect302Url:'',
      dmEditObj:{},//编辑业务 存放查询业务的配置信息
      onlyDomain:false,//至少保留一个domain不能被删除，否则配置文件为空了

      // isSpecialType:false,//特殊配置 标题只显示一次 查看配置页面
      
      isDenyUrl:false,//location 被保护的页面为 deny_url 要特殊处理
    }
  },
  watch:{
    "isEditShow"(){
      if(this.isEditShow)this.dataRenderTree();
    }
  },
  created(){
    window.addEventListener("resize", () => {
      if(this.isEditShow){
        // this.dataRenderTree();
        this.configtree(this.jsonData);//浏览器窗口大小改变，重新展开svg，无需再发送请求

        const menuList=document.querySelectorAll(".ed-contextmenu");//伪数组
        const [...menuArr]=menuList
        menuArr.forEach(el=>{
          el.style.display="none"
        })
      }
    });
  },
  mounted(){
    if(this.isEditShow){
      this.dataRenderTree();
    }
    this.$on("updateRenderTree",()=>{
      console.log(112)
      this.dataRenderTree();
    });
    // this.$nextTick(()=>{
    //   this.$on("p2cautoconf",()=>{
    //     this.dataRenderTree();
    //   })
    // });
  },
  methods:{
    isEditClose(){
      this.jsonData={
        name: "",
        shadowtitle:true,
        children:[]
      };
      this.configtree(this.jsonData)//清除掉打开的数据
      this.$emit('editDocShowclose',false);
    },
    dataRenderTree(){
      var _this=this;
      _this.editConfigLoading=true;
      _this.isNoData=false;
      var fileName=_this.editFile;
      var serverUrl=SERVER_API_URL+"topology?savedConfig=true&fileName="+fileName;
      
      axios.get(serverUrl).then((res)=>{
        // console.log(res.data)
        if(res.data.responseCode==0){
          var datastring=JSON.stringify(res.data);
          datastring=datastring.replace(/\bhostName\b/g,"name");
          datastring=datastring.replace(/\bdomains\b/g,"children");
          datastring=datastring.replace(/\blocation\b/g,"children");
          datastring=datastring.replace(/\burl\b/g,"children");
          datastring=datastring.replace(/\blocationName\b/g,"name");
          datastring=datastring.replace(/\bdomainName\b/g,"name");
          datastring=datastring.replace(/\burlName\b/g,"name");
          var data=JSON.parse(datastring);
          _this.jsonData.name=fileName;
          _this.shadowObj.snodeId=fileName;
          _this.shadowObj.name=fileName;
          _this.jsonData.children=data.data[0].children;
          _this.$nextTick(()=>{
            _this.configtree(_this.jsonData);
          })
        }else{
          _this.isNoData=true;
          _this.$message.error(_this.$t('lg.failed')+': ('+_this.$t('lg.checkcurfile')+')'+ res.data.data.message);
        }
        _this.editConfigLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    configtree(jsonTreeData){
      var _this=this;
      // console.log(jsonTreeData)
      if(!jsonTreeData){
        return false;
      }
      if(!_this.$refs.editshadowtree){
        return
      }

      const width=_this.$refs.editshadowtree.clientWidth;
      // const height=_this.$refs.editshadowtree.clientHeight-10;
      const margin = ({top: 60, right: 120, bottom: 60, left: 135}); 
      const dy = width / 6; 
      const dx = 10;
      const tree = d3.tree().nodeSize([30, dy+20]);

      const svg = d3.select("#editshadowtree").select("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx]);
        // .style("font", "10px sans-serif")
        // .style("user-select", "none")
      svg.selectAll("*").remove();//移除 !!!,一定要移除旧有数据

      let i = 0
      let shadowStatusTimer
      let clk_dbl_timer

      const root = d3.hierarchy(jsonTreeData, function(d) { return d.children; });
      const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
      root.x0 = 10 ;
      root.y0 = dy/3;

      if(!root.children){
        _this.isNoData=true;
        return
      }

      //设置树状图展开几层
      root.children && root.children.forEach(function(v,i){ //展开三层，共五层
        if(v.children){
          var r = v.children;//展开四层，这里要注释掉
          r.forEach(collapse);//展开四层，这里要注释掉
          // v.children.forEach(function(val,index){//展开四层，共五层
          //   if(val.children){
          //     var k = val.children;
          //     k.forEach(collapse);
          //   }
          // })
        }
      })
      function collapse(d) {
        if(d.children) {
          d._children = d.children
          d._children.forEach(collapse)
          d.children = null
        }
      }

      //链接线的样式
      const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-opacity", 1)
        .attr("stroke-width", 1.5);

      const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

      function update(source) {
        const duration = d3.event && d3.event.altKey ? 2500 : 750;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + margin.top + margin.bottom;
        const transition = svg.transition()
          .duration(duration)
          .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g.node")
          .data(nodes,  function(d) {return d.id || (d.id = ++i); });
       
        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
          .attr('class', 'node')
          .attr("transform", d => `translate(${source.y0},${source.x0})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
        
          .on("dblclick",(d,i)=>{//双击
            clk_dbl_timer && clearTimeout(clk_dbl_timer);
            const dData=d.data;
            if(dData.hasOwnProperty("snodeId")){
              const snodeId=dData.snodeId;
              const name=dData.name;
              _this.shadowObj.snodeId=snodeId;
              _this.shadowObj.name=name;
              // _this.getCrts();
              // _this.getKeys();
              _this.shadowDialogVisible=true;
            }else if(dData.hasOwnProperty("domainPort")){
              _this.domainDialogVisible=true;
              const dParent=d.parent.data;
              const domainName=Base64.decode(dData.name);
              const domainPort=dData.domainPort;
              _this.domainObj.domainName=domainName;
              _this.domainObj.port=domainPort;
            }else if(dData.hasOwnProperty("locationType")){
              if(dData.name=="ZGVueV91cmw="){//如果被保护对象的位置 location 为deny_url,则双击不打开添加配置指令弹框
                return false
              }
              
              const dParent=d.parent.data;
              const dParentParent=d.parent.parent.data;

              if(dData.locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则 显示的时候去掉正则（三处显示要改）
                if(dData.name=="KC4qXC8pKyQ="){
                  _this.locationObj.nameTxt="/";
                }else{
                  const suffixMatchName = Base64.decode(dData.name);
                  const suffixMatchReg =/\((.*)\)/;
                  _this.locationObj.nameTxt=suffixMatchReg.test(suffixMatchName)?suffixMatchName.match(suffixMatchReg)[1]:suffixMatchName;
                }
              }else{
                _this.locationObj.nameTxt=Base64.decode(dData.name);
              }
              _this.locationObj.name=Base64.decode(dData.name);
              
              _this.locationObj.type=dData.locationType;
              _this.domainObj.domainName=Base64.decode(dParent.name);
              _this.domainObj.port=dParent.domainPort;
            
              // _this.locationDialogVisible=true;//location节点的双击暂时去除，改成右键菜单添加配置指令
            }
          })
          .on("contextmenu",(d,i)=>{//右键
            d3.event.preventDefault();
            clearTimeout(shadowStatusTimer);
            d3.selectAll(".ed-contextmenu").style("display","none");
            const dData=d.data;
            const xVal=d.y+145;
            const yVal=event.offsetY; //d.x
            // console.log(yVal)
            var edshadowmenu,eddomainmenu,edlocationmenu;
            if(dData.hasOwnProperty("shadowtitle")){
              const name=dData.name;
              _this.shadowObj.snodeId=name;
              _this.shadowObj.name=name;
              edshadowmenu=d3.select(".edshadowmenu");
              edshadowmenu.style("display","block");
              edshadowmenu.style("left",xVal+"px");
              if(yVal>122){
                edshadowmenu.style("top",yVal-122+"px");
              }else{
                edshadowmenu.style("top",yVal+5+"px");
              }
            }else if(dData.hasOwnProperty("domainPort")){
              // console.log(d.parent.children);
              if(d.parent.children.length==1){
                _this.onlyDomain=true;
              }else{
                _this.onlyDomain=false;
              }
              const dParent=d.parent.data;
              const domainName=Base64.decode(dData.name);
              const domainPort=dData.domainPort;
              _this.domainObj.domainName=domainName;
              _this.domainObj.port=domainPort;
              eddomainmenu=d3.select(".eddomainmenu");
              eddomainmenu.style("display","block");
              eddomainmenu.style("left",xVal+"px");
              if(yVal>165){
                eddomainmenu.style("top",yVal-165+"px");
              }else{
                eddomainmenu.style("top",yVal+5+"px");
              }
            }else if(dData.hasOwnProperty("locationType")){
              const dParent=d.parent.data;
              const dParentParent=d.parent.parent.data;

              if(dData.locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则 显示的时候去掉正则（三处显示要改）
                if(dData.name=="KC4qXC8pKyQ="){
                  _this.locationObj.nameTxt="/";
                }else{
                  const suffixMatchName = Base64.decode(dData.name);
                  const suffixMatchReg =/\((.*)\)/;
                  _this.locationObj.nameTxt=suffixMatchReg.test(suffixMatchName)?suffixMatchName.match(suffixMatchReg)[1]:suffixMatchName;
                }
              }else{
                _this.locationObj.nameTxt=Base64.decode(dData.name);
              }
              _this.locationObj.name=Base64.decode(dData.name);

              _this.locationObj.type=dData.locationType;
              _this.domainObj.domainName=Base64.decode(dParent.name);
              _this.domainObj.port=dParent.domainPort;
              edlocationmenu=d3.select(".edlocationmenu");
              edlocationmenu.style("display","block");
              edlocationmenu.style("left",xVal+"px");

              if(dData.name=="ZGVueV91cmw="){//如果被保护对象的位置 location 为deny_url,则右键只有‘查看配置指令’功能
                _this.isDenyUrl=true;
                edlocationmenu.style("top",yVal-80+"px");
              }else{
                _this.isDenyUrl=false;
                const wafOnoff = _this.$store.state.licenceinfo.waf;//有无‘查看waf’项
                if(wafOnoff){
                  if(yVal>210){
                    edlocationmenu.style("top",yVal-210+"px");
                  }else{
                    edlocationmenu.style("top",yVal+5+"px");
                  }
                }else{
                  if(yVal>185){
                    edlocationmenu.style("top",yVal-185+"px");
                  }else{
                    edlocationmenu.style("top",yVal+5+"px");
                  }
                }
              }
            }
            d3.select("body").on("click",()=>{
              d3.selectAll(".ed-contextmenu").style("display","none");
            });
            function equalToEventTarget() {
              return _this == d3.event.target;
            }
          })
          .on("click",(d,i)=>{
            clk_dbl_timer && clearTimeout(clk_dbl_timer);
            clk_dbl_timer=setTimeout(()=>{
              if (d.children) {
                  d._children = d.children;
                  d.children = null;
                } else {
                  d.children = d._children;
                  d._children = null;
                }
              update(d);
            },300)
          })
          .on("mouseover",(d,i)=>{
            var dData=d.data;
            var xVal=d.y+150;
            var yVal=event.offsetY-50;
            var onoffbox;
            shadowStatusTimer=setTimeout(function(){
              if(dData.hasOwnProperty("shadowtitle")){
                var snodeName=dData.name;
                _this.shadowObj.name=snodeName;
                onoffbox=d3.select(".ed-onoff-box");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal+"px");
                onoffbox.style("top",yVal+"px");
              }else if(dData.hasOwnProperty("domainPort")){
                var domainPort=dData.domainPort,
                    domainName=Base64.decode(dData.name);
                _this.domainObj.port=domainPort;
                _this.domainObj.domainName=domainName;
                onoffbox=d3.select(".ed-onoff-DomainBox");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal+"px");
                onoffbox.style("top",yVal+"px");
              }else if(dData.hasOwnProperty("locationType")){
                if(dData.locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则 显示的时候去掉正则（三处显示要改）
                  if(dData.name=="KC4qXC8pKyQ="){
                    _this.locationObj.nameTxt="/";
                  }else{
                    const suffixMatchName = Base64.decode(dData.name);
                    const suffixMatchReg =/\((.*)\)/;
                    _this.locationObj.nameTxt=suffixMatchReg.test(suffixMatchName)?suffixMatchName.match(suffixMatchReg)[1]:suffixMatchName;
                  }
                }else{
                  _this.locationObj.nameTxt=Base64.decode(dData.name);
                }
                onoffbox=d3.select(".ed-onoff-LocationBox");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal+"px");
                onoffbox.style("top",yVal+"px");
              }else{
                if(Object.keys(dData).length==1){//触摸最后一层节点
                  const instructName=Base64.decode(dData.name);
                  _this.instructObj.name=instructName;
                  onoffbox=d3.select(".ed-onoff-InstructBox");
                  onoffbox.style("display","block");
                  onoffbox.style("left",xVal+"px");
                  onoffbox.style("top",yVal+"px");
                  console.log(1)
                }
              }

            },1500);  
          }).on("mouseout",(d,i)=>{
            clearTimeout(shadowStatusTimer);
            const dData=d.data;
            let onoffbox;
            if(dData.hasOwnProperty("shadowtitle")){
              onoffbox=d3.select(".ed-onoff-box");
              onoffbox.style("display","none");
            }else if(dData.hasOwnProperty("domainPort")){
              onoffbox=d3.select(".ed-onoff-DomainBox");
              onoffbox.style("display","none");
            }else if(dData.hasOwnProperty("locationType")){
              onoffbox=d3.select(".ed-onoff-LocationBox");
              onoffbox.style("display","none");
            }else{
              onoffbox=d3.select(".ed-onoff-InstructBox");
              onoffbox.style("display","none");
            }
          });
        
        nodeEnter.append("circle")
          .attr('class', 'node')
          .attr("r", 6)
          .attr("fill", d => d._children ? "#606266" : "#fff")
          // .attr("stroke-width", 10)
          .style("stroke",function(d){
            if(d.depth==2){//location被保护页面节点的颜色设置 
              var dtype=d.data.locationType;
              return dtype=='accurateMatch'? '#39a8ef':dtype=='suffixMatch'? '#34ab83':dtype=='pathMatch'? '#ffc700':dtype=='dynamicMatch'? '#800093':'#c6b38e'
            }
          })
        
        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor",  function(d) {
            return d.children || d._children ? "end" : "start";
          })
          .text(d => {
            // return d.data.name
            const dData=d.data;
            if(dData.shadowtitle){
              let shadowNodeStr=dData.name;
              let sdNodeAbridgeStr='';//缩略长度
              if(shadowNodeStr.length>=13){
                sdNodeAbridgeStr=shadowNodeStr.slice(0,10)+'...'
              }else{
                sdNodeAbridgeStr=shadowNodeStr
              }
              return sdNodeAbridgeStr;
            }else if(dData.hasOwnProperty("domainPort")){
              const domainStr = Base64.decode(dData.name);
              let domainAbridgeStr='';//缩略长度
              if(domainStr.length>=30){
                domainAbridgeStr=domainStr.slice(0,27)+'...'
              }else{
                domainAbridgeStr=domainStr;
              }
              return domainAbridgeStr+":"+dData.domainPort;
            }else if(dData.hasOwnProperty("locationType")){
              if(dData.locationType=='suffixMatch'){//如果是后缀匹配 则传入参数时要加入正则 显示的时候去掉正则（三处显示要改）
                if(dData.name=="KC4qXC8pKyQ="){
                  return "/";
                }else{
                  const suffixMatchName = Base64.decode(dData.name);
                  const suffixMatchReg =/\((.*)\)/;
                  // console.log(suffixMatchReg.test(suffixMatchName))

                  const locationStr = suffixMatchReg.test(suffixMatchName)?suffixMatchName.match(suffixMatchReg)[1]:suffixMatchName;
                  let locationAbridgeStr='';//缩略长度
                  if(locationStr.length>=35){
                    locationAbridgeStr=locationStr.slice(0,32)+'...'
                  }else{
                    locationAbridgeStr=locationStr;
                  }
                  return locationAbridgeStr;
                }
              }else{
                const locationStr = Base64.decode(dData.name);
                let locationAbridgeStr='';//缩略长度
                if(locationStr.length>=35){
                  locationAbridgeStr=locationStr.slice(0,32)+'...'
                }else{
                  locationAbridgeStr=locationStr;
                }
                return locationAbridgeStr;
              }
            }else{
              if(Object.keys(dData).length==1){//最后一层节点缩略 
                const instructStr = Base64.decode(dData.name);
                let instructAbridgeStr='';//缩略长度
                if(instructStr.length>=40){
                  instructAbridgeStr=instructStr.slice(0,37)+'...'
                }else{
                  instructAbridgeStr=instructStr;
                }
                return instructAbridgeStr;
              }
            }
          })
          .style('fill',function(d){//waf状态开启时文字为红色
            return d.data.waf=="on"?'#ff0000':'';
          })
          .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");
        
        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);
        
        //有子节点填充，无子节点不填充
        nodeUpdate.select('circle.node')
          .attr('r', 6)
          .style("fill", function(d) {
            return d._children ? "#606266" : "#fff";
          }).attr('cursor', 'pointer');
        
        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition)
          .duration(duration)
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0).remove();
        // nodeExit.select('circle').attr('r', 1e-6);
        // nodeExit.select('text').style('fill-opacity', 1e-6);

        // Update the links…
        const link = gLink.selectAll("path")
          .data(links, d => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
          .attr("d", d => {
            // console.log(source)
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });
        
        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
          .duration(duration)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition)
          .duration(duration)
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

        // Stash the old positions for transition.
        root.eachBefore(d => {
          // console.log(d)
          d.x0 = d.x;
          d.y0 = d.y;
        });

      }
      update(root);
    },
    // getCrts(){//证书管理 查询crt文件  
    //       var snodeId=this.shadowObj.snodeId;
    //       if(snodeId){
    //           var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/crt";
    //           axios.get(url).then((res)=>{
    //             if(res.data.responseCode==0){
    // 							 this.crts=res.data.data;
    // 							 this.getPems();
    //             }else{
    //              this.$message.error('操作失败: '+ res.data.data.message);
    //             }
    //           }).catch((err)=>{
    //             console.log(err)
    //           });
    //       }
    //   },

    // getPems(){//证书管理 查询pem文件
    //       var snodeId=this.shadowObj.snodeId;
    //       if(snodeId){
    //           var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/pem";
    //           axios.get(url).then((res)=>{
    //             if(res.data.responseCode==0){
    // 							 this.pems=res.data.data;
    // 							 this.diplomas = this.crts.concat(this.pems);//合并crt、pem证书传入shadowpop.vue
    //             }else{
    //               this.$message.error('操作失败: '+ res.data.data.message);
    //             }
    //           }).catch((err)=>{
    //             console.log(err)
    //           });
    //       }
    // },

    // getKeys(){//证书管理 查询key文件
    //       var snodeId=this.shadowObj.snodeId;
    //       if(snodeId){
    //           var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/key";
    //           axios.get(url).then((res)=>{
    // 						console.log(res.data.data)
    //             if(res.data.responseCode==0){
    //                this.keys=res.data.data;
    //             }else{
    //               this.$message.error('操作失败: '+ res.data.data.message);
    //             }
    //           }).catch((err)=>{
    //             console.log(err)
    //           });
    //       }
    // },

    updateRenderTreeFn(){
      this.dataRenderTree();
    },
    sdWarningMode(){//shadow_warning_mode
      this.$refs.sd_warningMode.getSdWarningModeData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.sdWarningModemodalShow=true; //打开弹框
      });
    },
    sdSeniorInstruct(){//shadow节点高级配置
      this.sdSeniorInstructmodalShow=true; //打开弹框
    },
    sdGlbInstruct(){//shadow节点全局自定义指令
      this.$refs.sd_glbInstruct.getSdGlbInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.sdGlbInstructmodalShow=true; //打开弹框
      });
    },
    sdCustomUpstream(){//自定义upstream配置
      this.$refs.sd_customUpstream.getSdCustUpstreamData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.sdCustomUpstreammodalShow=true; //打开弹框
      });
    },
    // sdRequestTime(){//请求超时时间
    //   this.$refs.sd_agentTimeout.getSdAgtTimeoutData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.sdAgentTimeoutmodalShow=true; //打开弹框
    //   });
    // },
    // sdApi(){//shadow_api
    //   this.$refs.sd_api.getSdApiData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.sdApimodalShow=true; //打开弹框
    //   });
    // },
    // sdDefenseCookie(){//动态cookie防御
    //   this.$refs.sd_defenseCookiemodal.getSdDefenseCookieData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.sdDefenseCookiemodalShow=true; //打开弹框
    //   });
    // },
    dmUpstreamlistModal(){
      this.$refs.dm_upstreamlist.getDmUpstreamlistData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.upstreamlistmodalShow=true; //打开弹框
      });
    },
    // dmWafModal(){//查询业务的waf状态
    //   var url=SERVER_API_URL+"pe/shadow/domain/waf?savedConfig=true";
    //   var _this=this;
    //   axios.get(url,{
    //     params:{
    //       snodeId:this.shadowObj.snodeId,
    //       domainName:this.domainObj.domainName,
    //       domainPort:this.domainObj.port,
    //       locationName:"/",
    //       locationType:"/"
    //     }
    //   }).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.dmWafData=res.data.data;
    //       this.wafmodalShow=true;
    //     }else{
    //       this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err.data.message)
    //   });
    // },
    dmRedirectModal(){//320跳转 业务的重定向地址
      var url=SERVER_API_URL+"pe/shadow/domain/redirect?savedConfig=true";
      var _this=this;
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.redirect302Url=res.data.data.redirect;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      this.redirectmodalShow=true;
    },
    // dmVerifyToken(){//shadow_verify_token指令
    //   this.$refs.dm_verifyToken.getDmVerifyTokenData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.dmVerifyTokenmodalShow=true; //打开弹框
    //   });
    // },
    dmLimReq(){//shadow_limit_req指令
      this.$refs.dm_limitReq.getDmLimReqData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.dmLimReqmodalShow=true; //打开弹框
      });
    },
    dmGlbInstruct(){//domain全局自定义指令
      this.$refs.dm_glbInstruct.getDmGlbInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.dmGlbInstructmodalShow=true; //打开弹框
      });
    },
    setRedirectInput(v){
      this.redirect302Url=v;
    },
    dmEditModal(){//编辑业务~查询业务的配置信息
      var url=SERVER_API_URL+"/pe/shadow/domain?savedConfig=true";
      var _this=this;
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port
        }
      }).then((res)=>{
        //  console.log(res);
        if(res.data.responseCode==0){
          var thisdomainObj=res.data.data.domains;
          if(thisdomainObj.ssl=="on"){
            thisdomainObj.outHttp='https';
          }else{
            thisdomainObj.outHttp='http';
          }
          if(!thisdomainObj.serverPort){
            thisdomainObj.serverPort='';
          }

          this.dmEditObj=thisdomainObj;
          this.dmEditmodalShow=true;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    dmDelete(){//删除业务
      var _this=this;
      if(_this.onlyDomain){//至少保留一个业务不被删除
        return false;
      }
      var url=SERVER_API_URL+"pe/shadow/domain?savedConfig=true";
      var domainName=_this.domainObj.domainName;
      _this.$confirm(_this.$t('lg.delete')+' '+domainName+' ,'+_this.$t('lg.contiinue'), _this.$t('lg.tips'), {
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(() => {
          axios.delete(url,{
            data:{
              snodeId:_this.shadowObj.snodeId,
              domainName:domainName,
              domainPort:_this.domainObj.port
            }
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.dataRenderTree();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
          }).catch((err)=>{
              console.log(err)
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
      });
    },

    lcProtectInstruct(){//保护配置
      this.$refs.lc_protectInstruct.getLcProtectInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.lcprotectInstructmodalShow=true; //打开弹框
      });
    },
    lcSpecialProtectInstruct(){//特殊保护配置
      this.$refs.lc_specialProtectInstruct.getLcSpecialProtectInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.lcSpecialProtectInstructmodalShow=true; //打开弹框
      });
    },
    lcSkipInstruct(){//跳转配置
      this.$refs.lc_skipInstruct.getLcSkipInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.lcSkipInstructmodalShow=true; //打开弹框
      });
    },
    lcSeniorInstruct(){//location高级配置（包含多种配置指令）
      this.lcSeniorInstructmodalShow=true;
    },
    lcCustomInstruct(){//location自定义配置
      this.$refs.lc_customInstruct.getLcCustomInstructData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.lcCustomInstructmodalShow=true; //打开弹框
      });
    },
   // lcWebsocketModal(){//WebSocket查询
    //   var url=SERVER_API_URL+"pe/shadow/domain/location/websocket?savedConfig=true";
    //   var _this=this;
    //   var domainO=_this.domainObj,
    //       locationO=_this.locationObj;
    //   axios.get(url,{
    //     params:{
    //       snodeId:_this.shadowObj.snodeId,
    //       domainName:domainO.domainName,
    //       domainPort:domainO.port,
    //       locationName:locationO.name,
    //       locationType:locationO.type
    //     }
    //   }).then((res)=>{
    //     if(res.data.responseCode==0){
    //       _this.lcWebsocketData=res.data.data;
    //       _this.lcwebsocketmodalShow=true;
    //     }else{
    //       _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // lcDefenseCookieModal(){//动态cookie防御
    //   var _this=this;
    //   var snodeId=_this.shadowObj.snodeId;
    //   var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?savedConfig=true";
    //   var domainO=_this.domainObj,
    //       locationO=_this.locationObj;
    //   axios.get(url,{
    //     params:{
    //       domainName:domainO.domainName,
    //       domainPort:domainO.port,
    //       locationName:locationO.name,
    //       locationType:locationO.type
    //     }
    //   }).then((res)=>{
    //     // console.log(res)
    //     if(res.data.responseCode==0){
    //       _this.lcDefenseCookieData=res.data.data;
    //       _this.lcDefenseCookiemodalShow=true;
    //     }else{
    //       _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // lcProxyPassModal(){
    //   this.$refs.lc_proxyPass.getLcProxyPassData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.lcproxypassmodalShow=true; //打开弹框
    //   });
   // },
   // lcRootModal(){//查看location root
    //   this.$refs.lc_root.getLcRootData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.lcRootmodalShow=true;
    //   });
   // },
   // lcNtlmModal(){//ntlm长连接
    //   this.$refs.lc_ntlm.getNtlmData().then((resolvedata)=>{
    //     this.lcNtlmmodalShow=true; //打开弹框
    //   })
   // },
    lcwafModal(){//waf查询
      var url=SERVER_API_URL+"pe/shadow/domain/waf?savedConfig=true";
      var _this=this;
      var domainO=this.domainObj,
          locationO=this.locationObj;
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:domainO.domainName,
          domainPort:domainO.port,
          locationName:locationO.name,
          locationType:locationO.type
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.lcwafData=res.data.data;
          this.lcwafmodalShow=true;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    lcEditModal(){//编辑被保护对象
      this.lcEditmodalShow=true;
    },
    lcDelete(){//删除被保护的页面
      var _this=this;
      var domainO=this.domainObj,
          locationO=this.locationObj;
      this.$confirm(_this.$t('lg.delete')+''+locationO.nameTxt+','+_this.$t('lg.continue'), _this.$t('lg.tips'), {
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
      }).then(() => {
        var url=SERVER_API_URL+"pe/shadow/domain/location?savedConfig=true";
        axios.delete(url,{
          data:{
            snodeId:this.shadowObj.snodeId,
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type,
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            this.dataRenderTree();
          }else{
            this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: _this.$t('lg.canceled')
        });
      });
    },
      
  }
}
</script>
<style>
.editConfig-wrapper{
	width:100%; 
  min-height: 200px;
	position: relative;
}
#editshadowtree{
	width:100%;
	height:100%;
  /* height: calc(100vh - 303px);
  overflow-y: auto; */
}
.noConfigData-box{
	width: 100%;
  text-align:center;
  color:#888;
	position: absolute;
	top: 45%;
	left: 0;
}
.ed-contextmenu, .ed-onoff-box, .ed-onoff-DomainBox, .ed-onoff-LocationBox, .ed-onoff-InstructBox{
  position: absolute;
  display: none;
}
.ctxEd-downmenu, .ed-onoff-box, .ed-onoff-DomainBox, .ed-onoff-LocationBox, .ed-onoff-InstructBox{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 103;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 140px
}
.ed-onoff-box, .ed-onoff-DomainBox, .ed-onoff-LocationBox, .ed-onoff-InstructBox{
  width: auto;
  max-width: 520px;
  white-space:normal;
  word-break: break-all;
  line-height: 18px;
}

.ctxEd-downmenu .item{
  list-style: none;
  line-height: 20px;
  padding: 0 15px;
  margin: 2px 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;
  display: block;
}
.ctxEd-downmenu .item:hover{background-color: #ecf5ff;color: #66b1ff;}

.node {
  font: 12px sans-serif;
  fill: gray;
}
.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 1.5px;
}
.node circle {
  fill: #fff;
  stroke: #606266;
  stroke-width: 3px;
}
.node circle:hover {
  fill:#000;
  cursor: pointer;
}
</style>
<style scoped>
.notallow{
	cursor: not-allowed;
}
</style>
