<template>
	<div class="config-wrapper">
		<div class="matchtips">
      <span><i class="i1"></i>{{$t('lg.exactmatch')}}</span><span><i class="i2"></i>{{$t('lg.suffixmatch')}}</span><span><i class="i3"></i>{{$t('lg.patchmatch')}}</span><span><i class="i4"></i>{{$t('lg.dynamicurl')}}</span><span><i class="i5"></i>{{$t('lg.tongyongpp')}}</span> <i class="fa fa-font font-red2"></i>{{$t('lg.wafstart')}}
    </div>
		<div id="shadowtree" ref="shadowtree">
      <svg><g></g></svg>
	  </div>
    <!-- <shadowpop :shadowDialogVisible="shadowDialogVisible" :keys="keys" :crts="crts" :shadowObj="shadowObj" @setbyshadowpopchild="shadowDialogVisible=false" @updateRenderTree="updateRenderTreeFn"></shadowpop> -->
    <sd-warning-mode ref="sd_warningMode" :isShow="sdWarningModemodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdWarningModemodal="sdWarningModemodalShow=false"></sd-warning-mode>
    <sd-senior-instruct ref="sd_seniorInstruct" :isShow="sdSeniorInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdSeniorInstructmodal="sdSeniorInstructmodalShow=false"></sd-senior-instruct>
    <sd-glb-instruct ref="sd_glbInstruct" :isShow="sdGlbInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdGlbInstructmodal="sdGlbInstructmodalShow=false"></sd-glb-instruct>
    <sd-custom-upstream ref="sd_customUpstream" :isShow="sdCustomUpstreammodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdCustomUpstreammodal="sdCustomUpstreammodalShow=false"></sd-custom-upstream>
    <!-- <sd-agent-timeout ref="sd_agentTimeout" :isShow="sdAgentTimeoutmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdAgentTimeoutmodal="sdAgentTimeoutmodalShow=false"></sd-agent-timeout> -->
    <!-- <sd-api ref="sd_api" :isShow="sdApimodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysdApimodal="sdApimodalShow=false"></sd-api> -->
		<!-- <sd-defense-cookie ref="sd_defenseCookiemodal" :isShow="sdDefenseCookiemodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbydefensecookiemodal="sdDefenseCookiemodalShow=false"></sd-defense-cookie> -->
    <!-- <pushmodal :pushmodalShow="pushmodalShow" :data="shadownodes" :shadowObj="shadowObj" @setbypushmodal="pushmodalShow=false"  @updateRenderTree="updateRenderTreeFn"></pushmodal> -->
    <!-- <cersmodal :cersmodalShow="cersmodalShow" :keys="keys" :crts="crts" @setbycersmodal="cersmodalShow=false" :shadowObj="shadowObj"></cersmodal> -->
    <saveconfmodal :saveconfmodalShow="saveconfmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" @setbysaveconfmodal="saveconfmodalShow=false"></saveconfmodal>

    <domainpop :domainDialogVisible="domainDialogVisible" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbydomainpopchild="domainDialogVisible=false" @updateRenderTree="updateRenderTreeFn"></domainpop>
    <!-- <dm-addupstream :upstreammodalShow="upstreammodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreammodal="upstreammodalShow=false"></dm-addupstream> -->
    <dm-upstreamlist ref="dm_upstreamlist" :isShow="upstreamlistmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreamlistmodal="upstreamlistmodalShow=false"></dm-upstreamlist>
    <!-- <dm-waf :wafmodalShow="wafmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmWafData" @setbysavewafmodal="wafmodalShow=false" @updateRenderTree="updateRenderTreeFn"></dm-waf> -->
    <dm-redict :redirectmodalShow="redirectmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :data="redirect302Url" @setbyredictmodal="redirectmodalShow=false" @setredirect="setRedirectInput" ></dm-redict>
    <!-- <dm-verify-token ref="dm_verifyToken" :isShow="dmVerifyTokenmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmverifyTokenmodal="dmVerifyTokenmodalShow=false"></dm-verify-token> -->
    <dm-limit-req ref="dm_limitReq" :isShow="dmLimReqmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmlimReqmodal="dmLimReqmodalShow=false"></dm-limit-req>
    <dm-glb-instruct ref="dm_glbInstruct" :isShow="dmGlbInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmGlbInstructmodal="dmGlbInstructmodalShow=false"></dm-glb-instruct>
		<dm-edit :dmEditmodalShow="dmEditmodalShow" :isAuto="isAuto" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmEditObj" @setbydmEditmodal="dmEditmodalShow=false" @updateRenderTree="updateRenderTreeFn"></dm-edit>

    <!-- <locationpop :locationDialogVisible="locationDialogVisible" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" @setbylocationpopchild="locationDialogVisible=false" :locationObj="locationObj" @updateRenderTree="updateRenderTreeFn"></locationpop> -->
    <lc-protect-instruct ref="lc_protectInstruct" :isShow="lcprotectInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcProtectInstructmodal="lcprotectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-protect-instruct>
    <lc-special-protect-instruct ref="lc_specialProtectInstruct" :isShow="lcSpecialProtectInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSpecialProtectInstructmodal="lcSpecialProtectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-special-protect-instruct>
    <lc-skip-instruct ref="lc_skipInstruct" :isShow="lcSkipInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSkipInstructmodal="lcSkipInstructmodalShow=false"></lc-skip-instruct>
    <lc-senior-instruct ref="lc_seniorInstruct" :isShow="lcSeniorInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSeniorInstructmodal="lcSeniorInstructmodalShow=false"></lc-senior-instruct>
    <lc-custom-instruct ref="lc_customInstruct" :isShow="lcCustomInstructmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcCustomInstructmodal="lcCustomInstructmodalShow=false"></lc-custom-instruct>
    <!-- <lc-cmdlist :isShow="lccmdlistmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :isType="isSpecialType" :cmdDatas="lcconfcmdObj" @lccmdlistmodalclose="lccmdlistmodalShow=false;lcconfcmdObj={}" @updateLcConfcmd="lcConfcmdlistModal" @updateRenderTree="updateRenderTreeFn"></lc-cmdlist> -->
    <!-- <lc-websocket :isShow="lcwebsocketmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcWebsocketData" @setbylcWebsocketmodal="lcwebsocketmodalShow=false" @updateRenderTree="dataRenderTree"></lc-websocket> -->
    <!-- <lc-defense-cookie :isShow="lcDefenseCookiemodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcDefenseCookieData" @setbylcDefenseCookiemodal="lcDefenseCookiemodalShow=false" @updateRenderTree="dataRenderTree"></lc-defense-cookie> -->
    <!-- <lc-proxypass ref="lc_proxyPass" :isShow="lcproxypassmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcProxypassmodal="lcproxypassmodalShow=false" @updateRenderTree="dataRenderTree"></lc-proxypass> -->
    <!-- <lc-root ref="lc_root" :isShow="lcRootmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcRootmodal="lcRootmodalShow=false"></lc-root> -->
    <!-- new 新的写法 不传数据-->
    <!-- <lc-ntlm ref="lc_ntlm" :isShow="lcNtlmmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcNtlmmodal="lcNtlmmodalShow=false" @updateRenderTree="dataRenderTree"></lc-ntlm>  -->
    <lc-waf :isShow="lcwafmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcwafData" @setbylcwafmodal="lcwafmodalShow=false" @updateRenderTree="updateRenderTreeFn"></lc-waf>
		<lc-edit :lcEditmodalShow="lcEditmodalShow" :isAuto="isAuto" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcEditmodal="lcEditmodalShow=false" @updateRenderTree="updateRenderTreeFn"></lc-edit>

    <!-- <ro-doclist :isShow="rootdoclistShow" @updatetreebypush="dataRenderTree" :data="rootdoclistData" :nodesdata="shadownodes" @rodoclistclose="rootdoclistShow=false" @updateRoDoclist="roDoclist"></ro-doclist> -->
    <!-- <ro-uploadfile :isShow="rootuploadfileShow" @rouploadfileclose="rootuploadfileShow=false"></ro-uploadfile> -->
    <!-- <ro-rules :isShow="rootrulesShow" :data="rootrulesData" :rulesetdata="rootrulesetData" @updateRootRule="roRules" @rootrulesclose="rootrulesShow=false"></ro-rules> -->
    <!-- <ro-addrule :isShow="rootaddruleShow" :sid="rootruleSid" :rulesetdata="rootrulesetData" @rootaddruleclose="rootaddruleShow=false"></ro-addrule> -->
    <!-- <ro-rulesets :isShow="rootrulesetsShow" :data="rootRulesetsData" @updateRulesets="roRulesets" @rootrulesetsclose="rootrulesetsShow=false"></ro-rulesets> -->
    <!-- <ro-mail :isShow="rootmailShow" :data="rootmailparmasData" @rootmailclose="rootmailShow=false"></ro-mail> -->
    <!-- <ro-tokenlicense :isShow="rootokenlicenseShow" :data="rootokenlicenseData" @roottokenlicenseclose="rootokenlicenseShow=false"></ro-tokenlicense> -->
    <!-- <auth-upload :isShow="authuploadShow" @authuploadfileclose="authuploadShow=false"></auth-upload> -->

    <div class="cm-contextmenu rootmenu">
      <!-- <ul class="ctxAuto-downmenu">
        <li class="item" @click="roDoclist">文件列表</li>
        <li class="item" @click="roUploadFile">文件上传</li>
        <li class="item" @click="roRules">Rules查看</li>
        <li class="item" @click="roAddRule">Rule增加</li>
        <li class="item" @click="roRulesets">RuleSets</li>
        <li class="item" @click="roMailnotify">邮件通知参数</li>
        <li class="item" @click="roTokenlicense">授权Token</li>
      </ul> -->
    </div>
    <div class="cm-contextmenu shadowmenu">
      <ul class="ctxAuto-downmenu">
        <!-- <li class="item" @click="sdStart">开启</li>
        <li class="item" @click="sdStop">关闭</li>
        <li class="item" @click="sdRestart">重启</li>
        <li class="item" @click="sdReset">一键代理</li>
        <li class="item" @click="sdRecover">一键初始化</li>
        <li class="item" @click="sdPushModal">推送配置</li>
        <li class="item" @click="sdCersModal">证书管理</li> -->
        <li class="item" @click="sdWarningMode">{{$t('lg.monitormode')}}</li>
        <li class="item" @click="sdSeniorInstruct">{{$t('lg.gaojipeiz')}}</li>
        <li class="item" @click="sdGlbInstruct">{{$t('lg.zidingyipz')}}</li>
        <li class="item" @click="sdCustomUpstream">{{$t('lg.zidingyiups')}}</li>        
        <!-- <li class="item" @click="sdRequestTime">请求超时时间</li>
        <li class="item" @click="sdApi">API防护设置</li>
        <li class="item" @click="sdDefenseCookie">{{$t('lg.dycookieparams')}}</li> -->
        <li class="item" @click="sdSaveConf">{{$t('lg.saveconfig')}}</li>
      </ul>
    </div>
    <div class="cm-contextmenu domainmenu">
      <ul class="ctxAuto-downmenu">
        <!-- <li class="item" @click="dmUpstreamModal">添加服务器</li> -->
        <li class="item" @click="dmUpstreamlistModal">{{$t('lg.manageserver')}}</li>
        <!-- <li class="item" v-if="$store.state.licenceinfo.waf==1" @click="dmWafModal">{{$t('lg.wafdetail')}}</li> -->
        <li class="item" @click="dmRedirectModal">{{$t('lg.redirect302')}}</li>
        <!-- <li class="item" @click="dmVerifyToken">动态指纹功能</li> -->
        <li class="item" @click="dmLimReq">{{$t('lg.dmLimReq')}}</li>
        <li class="item" @click="dmGlbInstruct">{{$t('lg.zidingyipz')}}</li>
				<li class="item" @click="dmEditModal">{{$t('lg.edit')}}</li>
        <li class="item" @click="dmDelete">{{$t('lg.delete')}}</li>
      </ul>
    </div>
    <div class="cm-contextmenu locationmenu">
      <ul class="ctxAuto-downmenu">
        
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

    <!-- shadow节点触摸框 -->
    <div class="onoff-box">
      <p style="padding:0px 10px;">{{shadowObj.name}}</p>
    </div>
    
    <!-- domain节点触摸框 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
    <div class="onoff-DomainBox">
      <p style="padding:0px 10px;">{{domainObj.domainName+':'+domainObj.port}}</p>
    </div>

    <!-- location节点触摸框 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
    <div class="onoff-LocationBox"> 
      <p style="padding:0px 10px;">{{locationObj.nameTxt}}</p>
    </div>

    <!--最后一层节点触摸框 保护配置&特殊保护配置 --><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
    <div class="onoff-InstructBox">
      <p style="padding:0px 10px;">{{instructObj.name}}</p>
    </div>

	</div>	
</template>
<script>
import * as d3 from 'd3';
import axios from 'axios';
import {SERVER_API_URL,SERVER_API_URL2} from '@/conf/constvar';
let Base64 = require('js-base64').Base64;
import {handleConfigure} from '@/assets/js/tool';
// import loading from '@/components/loading/loading';

// import shadowpop from '@/components/autoconfig/shadowpop';
import sdWarningMode from '@/components/pubconfig/sd_warningMode';
import sdSeniorInstruct from '@/components/pubconfig/sd_seniorInstruct';
import sdGlbInstruct from '@/components/pubconfig/sd_glbInstruct';
import sdCustomUpstream from '@/components/pubconfig/sd_customUpstream';
// import sdAgentTimeout from '@/components/pubconfig/sd_agentTimeout';
// import sdApi from '@/components/pubconfig/sd_api';
// import sdDefenseCookie from '@/components/pubconfig/sd_defenseCookie';
// import pushmodal from '@/components/autoconfig/pushmodal';
// import cersmodal from '@/components/autoconfig/cersmodal';
import saveconfmodal from '@/components/pubconfig/saveconfmodal';

import domainpop from '@/components/pubconfig/domainpop';
// import dmAddupstream from '@/components/autoconfig/dm_upstreambackend';
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

// import roDoclist from '@/components/autoconfig/ro_doclist';
// import roUploadfile from '@/components/autoconfig/ro_uploadfile';
// import roRules from '@/components/autoconfig/ro_rules';
// import roAddrule from '@/components/autoconfig/ro_addrule';
// import roRulesets from '@/components/autoconfig/ro_rulesets';
// import roMail from '@/components/autoconfig/ro_mailnotify';
// import roTokenlicense from '@/components/autoconfig/ro_tokenlicense';
// import authUpload from '@/components/autoconfig/auth';
export default{
  components:{
    // loading,
    // shadowpop,
    sdWarningMode,
    sdSeniorInstruct,
    sdGlbInstruct,
    sdCustomUpstream,
    // sdAgentTimeout,
    // sdApi,
    // sdDefenseCookie,
    // pushmodal,
    // cersmodal,
    saveconfmodal,

    domainpop,
    // dmAddupstream,
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

    // roDoclist,
    // roUploadfile,
    // roRules,
    // roAddrule,
    // roRulesets,
    // roMail,
    // roTokenlicense,
    // authUpload
  },
  data(){
    return{
      productName:store.state.productName,
      isAuto:true,//判断该公用组件是否是被自动化配置调用
      jsonData:{
        name: this.productName,
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
      keys:[{
        name:"server.key"
      }],
      diplomas:[{
        name:"server.key"
      }],
      crts:[],
      pems:[],

      shadownodes:[],

      // shadowDialogVisible:false,
      sdWarningModemodalShow:false,
      sdSeniorInstructmodalShow:false,
      sdGlbInstructmodalShow:false,
      sdCustomUpstreammodalShow:false,
      // sdAgentTimeoutmodalShow:false,
      // sdApimodalShow:false,
      // sdDefenseCookiemodalShow:false,
      // pushmodalShow:false,
      // cersmodalShow:false,
      saveconfmodalShow:false,

      domainDialogVisible:false,
      // upstreammodalShow:false,
      upstreamlistmodalShow:false,
      redirectmodalShow:false,
      // dmVerifyTokenmodalShow:false,
      dmLimReqmodalShow:false,
      dmGlbInstructmodalShow:false,
      dmEditmodalShow:false,
      wafmodalShow:false,

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

      // lcconfcmdObj:{},
      dmWafData:{},
      // lcWebsocketData:{},
      // lcDefenseCookieData:{},
      lcwafData:{},
      lcEditmodalShow:false,
      // shadowDialogTitle:'',
      // locationDialogTitle:'',
      redirect302Url:'',
      dmEditObj:{},//编辑业务 存放查询业务的配置信息
      // rootdoclistShow:false,
      // rootuploadfileShow:false,
      // rootrulesShow:false,
      // rootaddruleShow:false,
      // rootdoclistData:[],
      // rootrulesData:[],
      // rootrulesetData:[],
      // rootruleSid:'',
      // rootrulesetsShow:false,
      // rootRulesetsData:[],
      // rootmailShow:false,
      // rootmailId:'',
      // rootmailSubject:{},
      // rootmailRecipient1:'',
      // rootmailRecipient2:'',
      // rootmailparmasData:{
      // id:'',
      // mailParam:{
      //   smtpHost:'',
      //   enabled:false,
      //   smtpPassword:'',
      //   smtpUsername:'',
      //   recipient:{
      //     diskRecipient:'',
      //     wafRecipient:''
      //   },
      //   subject:{
      //     diskAlertSubject:'',
      //     wafAlertSubject:''
      //   }
      // }
      // },
      // rootokenlicenseShow:false,
      // rootokenlicenseData:'',
      // authuploadShow:false,
      // formLabelWidth:'120px',
      // isSpecialType:false,//特殊配置 标题只显示一次 查看配置页面

      isDenyUrl:false,//location 被保护的页面为 deny_url 要特殊处理
    }
  },
  watch:{
    '$store.state.isMenuShow':function(){
      this.configtree(this.jsonData);//浏览器窗口大小改变，重新展开svg，无需再发送请求
    }
  },
  created(){
    if(!this.$store.state.productName){
      this.getProductname();
    }
    this.$store.state.contentLoading=true;
    window.addEventListener("resize", () => {
      if(this.$route.path=="/autoconfigtree"){
        // this.dataRenderTree();
        this.configtree(this.jsonData);//浏览器窗口大小改变，重新展开svg，无需再发送请求
      }
    });
  },
  mounted(){
    this.dataRenderTree();
    this.$on("updateRenderTree",()=>{
      this.dataRenderTree();
    });
    this.$nextTick(()=>{
      this.$on("p2cautoconf",()=>{
        this.dataRenderTree();
      })
    });
  },
  methods:{
     getProductname(){
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data
          this.productName=resData;
          this.$store.state.productName=resData;
        }
      })
    },
    dataRenderTree(){
      var _this=this;
      _this.$store.state.alreadyhasdomian=false;//作为 ‘判断是否需要进行基础配置’ 的依据
      var fileNameUrl = this.$route.query.pageurl;
      var fileName = fileNameUrl.replace(/http(s)?:\/\//, "").replace(/\/$/, "");
      var serverUrl=SERVER_API_URL+"topology?autoconfig=true&fileName="+fileName;
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
          // console.log(data)
          _this.jsonData.children=data.data;
          _this.configtree(_this.jsonData);
          _this.$store.state.contentLoading=false;
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    configtree(jsonTreeData){
      var _this=this;
      // console.log(_this.$refs.shadowtree);
      if(!_this.$refs.shadowtree){
        return
      }
      var width=_this.$refs.shadowtree.clientWidth,
          height=_this.$refs.shadowtree.clientHeight-10;
      var tree = d3.cluster().size([height, width -400]);

      var svg = d3.select("#shadowtree").select("svg").attr("width", width).attr("height", height);

      svg=d3.select("svg").select("g").attr("transform", "translate(135,0)");
      d3.select("svg").select("g").selectAll("*").remove();
        
      var i = 0,
          duration = 750,
          shadowStatusTimer,
          clk_dbl_timer,
          root;

      var treemap = d3.tree().size([height, width]);

      root = d3.hierarchy(jsonTreeData, function(d) { return d.children; });
      root.x0 = height / 2;
      root.y0 = 0;
      
      // console.log(root.children);//初始时，树状图展开状态
      root.children.forEach(function(v,i){ //展开三层，共五层
        // console.log(v)
        if(v.children){
          //判断是否需要进行基础配置
          const currentDomian = v.children;
          currentDomian.forEach(function(v,i){
          // console.log(v.data);
          const baseDomian=v.data;
          if(Base64.decode(baseDomian.name)==_this.$store.state.autoconfiginput && baseDomian.domainPort==_this.$store.state.autoconfigport){
              _this.$store.state.alreadyhasdomian=true;
            }
          })
          // console.log(_this.$store.state.alreadyhasdomian);
          
          var r = v.children;//展开四层，这里要注释掉
          r.forEach(collapse);//展开四层，这里要注释掉
          
          // v.children.forEach(function(val,index){//展开四层，共五层
          // 		if(val.children){
          // 				var k = val.children;
          // 				k.forEach(collapse);
          // 		}
          // 	})
        }
      })

      update(root);

      function collapse(d) {
        if(d.children) {
          d._children = d.children
          d._children.forEach(collapse)
          d.children = null
        }  
      }

      function update(source) {
        var treeData = treemap(root);
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        nodes.forEach(function(d){ d.y = d.depth * 180});

        var node = svg.selectAll('g.node').data(nodes, function(d) {return d.id || (d.id = ++i); });

        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              return "translate(" + source.y0 + "," + source.x0 + ")";
          })
        .on("dblclick",(d,i)=>{//双击
          clk_dbl_timer && clearTimeout(clk_dbl_timer);
            var dData=d.data;
            if(dData.hasOwnProperty("snodeId")){
              // _this.shadowDialogVisible=true;
              // var snodeId=dData.snodeId,
              //     name=dData.name;
              // _this.shadowObj.snodeId=snodeId;
              // _this.shadowObj.name=name;
              // _this.getCrts();
              // _this.getKeys();
            }else if(dData.hasOwnProperty("domainPort")){
              _this.domainDialogVisible=true;
              var dParent=d.parent.data;
              var domainName=Base64.decode(dData.name);
              var domainPort=dData.domainPort;
              _this.domainObj.domainName=domainName;
              _this.domainObj.port=domainPort;
              _this.shadowObj.snodeId=dParent.snodeId;
              _this.shadowObj.name=dParent.name;
            }else if(dData.hasOwnProperty("locationType")){
              if(dData.name=="ZGVueV91cmw="){//如果被保护对象的位置 location 为deny_url,则双击不打开添加配置指令弹框
                return false
              }
              
              var dParent=d.parent.data;
              var dParentParent=d.parent.parent.data;

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
              _this.shadowObj.snodeId=dParentParent.snodeId;
              _this.shadowObj.name=dParentParent.name;

              // _this.locationDialogVisible=true;//location节点的双击暂时去除，改成右键菜单添加配置指令
            }
        })
        .on("contextmenu",(d,i)=>{//右键
          d3.event.preventDefault();
          clearTimeout(shadowStatusTimer);
          d3.selectAll(".cm-contextmenu").style("display","none");
          var dData=d.data;
          var xVal=d.y+148;
          var yVal=d.x;
          var shadowmenu,domainmenu,locationmenu,rootmenu;
          if(dData.hasOwnProperty("snodeId")){
            var snodeId=dData.snodeId,
            name=dData.name;
            _this.shadowObj.snodeId=snodeId;
            _this.shadowObj.name=name;
            shadowmenu=d3.select(".shadowmenu");
            shadowmenu.style("display","block");
            shadowmenu.style("left",xVal+"px");
            shadowmenu.style("top",yVal-145+"px");
            shadowmenu.style("z-index","104");
          }else if(dData.hasOwnProperty("domainPort")){
            var dParent=d.parent.data;
            var domainName=Base64.decode(dData.name);
            var domainPort=dData.domainPort;
            _this.domainObj.domainName=domainName;
            _this.domainObj.port=domainPort;
            _this.shadowObj.snodeId=dParent.snodeId;
            _this.shadowObj.name=dParent.name;
            domainmenu=d3.select(".domainmenu");
            domainmenu.style("display","block");
            domainmenu.style("left",xVal+"px");
            domainmenu.style("top",yVal-165+"px");
          }else if(dData.hasOwnProperty("locationType")){
            var dParent=d.parent.data;
            var dParentParent=d.parent.parent.data;

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
            _this.shadowObj.snodeId=dParentParent.snodeId;
            _this.shadowObj.name=dParentParent.name;
            locationmenu=d3.select(".locationmenu");
            locationmenu.style("display","block");
            locationmenu.style("left",xVal+"px");

            if(dData.name=="ZGVueV91cmw="){//如果被保护对象的位置 location 为deny_url,则右键只有‘查看配置指令’功能
              _this.isDenyUrl=true;
              locationmenu.style("top",yVal-80+"px");
            }else{
              _this.isDenyUrl=false;
              const wafOnoff = _this.$store.state.licenceinfo.waf;//有无‘查看waf’项
              if(wafOnoff){
                locationmenu.style("top",yVal-210+"px");
              }else{
                locationmenu.style("top",yVal-190+"px");
              }
            }
          }else if(dData.hasOwnProperty("shadowtitle")){
            // rootmenu=d3.select(".rootmenu");
            // rootmenu.style("display","block");
            // rootmenu.style("left",xVal+"px");
            // rootmenu.style("top",yVal-186+"px");
          }
          d3.select("body").on("click",()=>{
            d3.selectAll(".cm-contextmenu").style("display","none");
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
          shadowStatusTimer=setTimeout(function(){
            var dData=d.data;
            var xVal=d.y+155;
            var yVal=d.x-112;
            var onoffbox;
            if(dData.hasOwnProperty("snodeId")){
              var snodeName=dData.name;
              _this.shadowObj.name=snodeName;
              onoffbox=d3.select(".onoff-box");
              onoffbox.style("display","block");
              onoffbox.style("left",xVal+"px");
              onoffbox.style("top",yVal+60+"px");
            }else if(dData.hasOwnProperty("domainPort")){
              var domainPort=dData.domainPort,
                  domainName=Base64.decode(dData.name);
              _this.domainObj.port=domainPort;
              _this.domainObj.domainName=domainName;
              onoffbox=d3.select(".onoff-DomainBox");
              onoffbox.style("display","block");
              onoffbox.style("left",xVal+"px");
              onoffbox.style("top",yVal+60+"px");
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
              onoffbox=d3.select(".onoff-LocationBox");
              onoffbox.style("display","block");
              onoffbox.style("left",xVal+"px");
              onoffbox.style("top",yVal+60+"px");
            }else{
              if(Object.keys(dData).length==1){//触摸最后一层节点
                const instructName=Base64.decode(dData.name);
                _this.instructObj.name=instructName;
                onoffbox=d3.select(".onoff-InstructBox");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal+"px");
                onoffbox.style("top",yVal+60+"px");
              }
            }
          },1500);  
        })
        .on("mouseout",(d,i)=>{
          clearTimeout(shadowStatusTimer);
          var dData=d.data;
          var onoffbox;
          if(dData.hasOwnProperty("snodeId")){
            onoffbox=d3.select(".onoff-box");
            onoffbox.style("display","none");
          }else if(dData.hasOwnProperty("domainPort")){
            onoffbox=d3.select(".onoff-DomainBox");
            onoffbox.style("display","none");
          }else if(dData.hasOwnProperty("locationType")){
            onoffbox=d3.select(".onoff-LocationBox");
            onoffbox.style("display","none");
          }else{
            onoffbox=d3.select(".onoff-InstructBox");
            onoffbox.style("display","none");
          }
        })

        nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style("fill", function(d) {
            return d._children ? "#606266" : "#fff";
          })
          .style("stroke",function(d){
            if(d.depth==3){//被保护页面节点的颜色设置
              var dtype=d.data.locationType;
              return dtype=='accurateMatch'? '#39a8ef':dtype=='suffixMatch'? '#34ab83':dtype=='pathMatch'? '#ffc700':dtype=='dynamicMatch'? '#800093':'#c6b38e'
            }
          })

        nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
          })
          .text(function(d) { 
            //return d.data.name; 
            var dData=d.data;
            if(dData.shadowtitle){
              return dData.name;
            }else if(dData.hasOwnProperty("snodeId")){
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
            }else if(Object.keys(dData).length==1){//最后一层节点缩略 
              const instructStr = Base64.decode(dData.name);
              let instructAbridgeStr='';//缩略长度
              if(instructStr.length>=40){
                instructAbridgeStr=instructStr.slice(0,37)+'...'
              }else{
                instructAbridgeStr=instructStr;
              }
              return instructAbridgeStr;
            }
          }).style('fill',function(d){//waf状态开启时文字为红色
            return d.data.waf=="on"?'#ff0000':'';
          });
            
        var nodeUpdate = nodeEnter.merge(node);

        nodeUpdate.transition()
          .duration(duration)
          .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
          });

        nodeUpdate.select('circle.node')
          .attr('r', 6)
          .style("fill", function(d) {
            return d._children ? "#606266" : "#fff";
          })
          .attr('cursor', 'pointer');

        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
              return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select('circle')
          .attr('r', 1e-6);

        nodeExit.select('text')
          .style('fill-opacity', 1e-6);
        var link = svg.selectAll('path.link')
            .data(links, function(d) { return d.id; });

        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
              var o = {x: source.x0, y: source.y0}
              return diagonal(o, o)
            });

        var linkUpdate = linkEnter.merge(link);

        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });
        var linkExit = link.exit().transition()
            .duration(duration)
            .attr('d', function(d) {
              var o = {x: source.x, y: source.y}
              return diagonal(o, o)
            })
            .remove();

        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });

        function diagonal(s, d) {
          var path = `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`
          return path;
        }

        function click(d) {
          shadowStatusTimer=setTimeout(function(){
            // console.log(d)
            if (d.children) {
                d._children = d.children;
                d.children = null;
              } else {
                d.children = d._children;
                d._children = null;
              }
            update(d);
          },1500);
        }

      }
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
   //},
  
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
   //   },

   // getKeys(){//证书管理 查询key文件
    //     var snodeId=this.shadowObj.snodeId;
    //       if(snodeId){
    //           var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/key";
    //           axios.get(url).then((res)=>{
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
  
   // getShadowstatus(id){//业务节点状态
    //   this.onoff="";
    //   var url=SERVER_API_URL+"pe/shadow/snode/"+id;
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode == 0){
    //       this.onoff=res.data.data.status;
    // 			this.onoffIp=res.data.data.ip;
    // 			this.myVersion=res.data.data.version;
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   })
   // },
    updateRenderTreeFn(){
      this.dataRenderTree();
    },
   // sdStart(){//开启shadow
    //   var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/start";
    //   axios.post(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.$message({
    //             type: 'success',
    //             message: '操作成功'
    //           });
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // sdStop(){//关闭shadow
    //   var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/stop";
    //   axios.post(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.$message({
    //             type: 'success',
    //             message: '操作成功'
    //           });
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // sdRestart(){//重启shadow
    //   var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/restart";
    //   axios.post(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.$message({
    //             type: 'success',
    //             message: '操作成功'
    //           });
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // sdReset(){//一键代理
    //   this.$confirm('此操作将还原SHADOW, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       var url=SERVER_API_URL+"pe/shadow/reset/"+this.shadowObj.snodeId;
    //       axios.post(url).then((res)=>{
    //         if(res.data.responseCode==0){
    //           this.$message({
    //             type: 'success',
    //             message: '操作成功'
    //           });
    //           this.updateRenderTreeFn();
    //         }else{
    //           this.$message.error('操作失败: '+ res.data.data.message);
    //         }
    //       });
    //     }).catch((err) => {
    //      console.log(err)
    //   });
   // },
   // sdRecover(){//一键初始化
    //   this.$confirm('此操作将复位SHADOW, 是否继续?', '提示', {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       var url=SERVER_API_URL+"pe/shadow/reset/default/"+this.shadowObj.snodeId;
    //       axios.post(url).then((res)=>{
    //         if(res.data.responseCode==0){
    //           this.$message({
    //             type: 'success',
    //             message: '操作成功'
    //           });
    //           this.updateRenderTreeFn();
    //         }else{
    //           this.$message.error('操作失败: '+ res.data.data.message);
    //         }
    //       });
    //     }).catch((err) => {
    //      console.log(err)
    //   });
   // },
   // sdPushModal(){//推送配置 查询当前所有业务节点
    //   this.pushmodalShow=true;
    //   var url=SERVER_API_URL+"pe/shadow/snode";
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode == 0){
    //        this.shadownodes=res.data.data
    //     }else{
    //        this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err) => {
    //      console.log(err)
    //   });
   // },
   // sdCersModal(){
    //   this.cersmodalShow=true;
    //   this.getCrts();
    //   this.getKeys();
   // },
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
    // sdApi(){//shadow_api API防护设置
    //   this.$refs.sd_api.getSdApiData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.sdApimodalShow=true; //打开弹框
    //   });
    // },
    // sdDefenseCookie(){//动态cookie防御
    //   this.$refs.sd_defenseCookiemodal.getSdDefenseCookieData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
    //     this.sdDefenseCookiemodalShow=true; //打开弹框
    //   });
    // },
    sdSaveConf(){
      this.saveconfmodalShow=true;
    },
    // dmUpstreamModal(){
    //   this.upstreammodalShow=true;
    // },
    dmUpstreamlistModal(){
      this.$refs.dm_upstreamlist.getDmUpstreamlistData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.upstreamlistmodalShow=true; //打开弹框
      });
    },
    // dmWafModal(){//查询业务的waf状态
    //   var url=SERVER_API_URL+"pe/shadow/domain/waf";
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
    //       this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err.data.message)
    //   });
    // },
    dmRedirectModal(){//320跳转 业务的重定向地址
      var url=SERVER_API_URL+"pe/shadow/domain/redirect";
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
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
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
      var url=SERVER_API_URL+"/pe/shadow/domain?autoconfig=true";
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port
        }
      }).then((res)=>{
        console.log(res);
        if(res.data.responseCode==0){
          var thisdomainObj = res.data.data.domains;
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
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    dmDelete(){//删除业务
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/domain?autoconfig=true";
      var domainName=_this.domainObj.domainName;
      _this.$confirm(_this.$t('lg.itdelete')+domainName+','+_this.$t('lg.continue')+'?', _this.$t('lg.tips'), {
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
              _this.updateRenderTreeFn();
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
    //   var _this=this;
    //   var url=SERVER_API_URL+"pe/shadow/domain/location/websocket";
    //   var domainO=this.domainObj,
    //       locationO=this.locationObj;
    //   axios.get(url,{
    //     params:{
    //       snodeId:this.shadowObj.snodeId,
    //       domainName:domainO.domainName,
    //       domainPort:domainO.port,
    //       locationName:locationO.name,
    //       locationType:locationO.type
    //     }
    //   }).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.lcWebsocketData=res.data.data;
    //       this.lcwebsocketmodalShow=true;
    //     }else{
    //       this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
   // lcDefenseCookieModal(){//动态cookie防御
    //   var _this=this;
    //   var snodeId=this.shadowObj.snodeId;
    //   var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?autoconfig=true";
    //   var domainO=this.domainObj,
    //       locationO=this.locationObj;
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
    //       this.lcDefenseCookieData=res.data.data;
    //       this.lcDefenseCookiemodalShow=true;
    //     }else{
    //       this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
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
    // lcNtlmModal(){//ntlm长连接
    //   this.$refs.lc_ntlm.getNtlmData().then((resolvedata)=>{
    //     this.lcNtlmmodalShow=true; //打开弹框
    //   })
    // },
    lcRootModal(){//查看location root
      this.$refs.lc_root.getLcRootData().then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
        this.lcRootmodalShow=true;
      });
    },
    lcwafModal(){//waf查询
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/domain/waf";
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
      var domainO=_this.domainObj,
          locationO=_this.locationObj;
      _this.$confirm(_this.$t('lg.itdelete')+locationO.nameTxt+','+_this.$t('lg.continue')+'?', _this.$t('lg.tips'), {
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        var url=SERVER_API_URL+"pe/shadow/domain/location?autoconfig=true";
        axios.delete(url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type,
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            _this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            _this.updateRenderTreeFn();
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
    
   // roDoclist(){//文件列表 查询conf文件
    //   this.rootdoclistShow=true;
    //   var url=SERVER_API_URL+"pe/file/cm/conf/";
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //         this.rootdoclistData=res.data.data
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
    //   var nodesurl=SERVER_API_URL+"pe/shadow/snode";//查询当前所有业务节点
    //   axios.get(nodesurl).then((res)=>{
    //     if(res.data.responseCode==0){
    //         this.shadownodes=res.data.data
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //     console.log(err)
    //   });
   // },
    
   // roUploadFile(){
    //   this.rootuploadfileShow=true;
   // },
    
   // roRules(){//Rules查看
    //   var url=SERVER_API_URL+"waf/rule";
    //   axios.get(url).then((res)=>{
    //      if(res.data.responseCode==0){
    //         this.rootrulesData=res.data.data;
    //      }else{
    //         this.$message.error('操作失败: '+ res.data.data.message);
    //      }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   var url2=SERVER_API_URL+"waf/ruleset";
    //   axios.get(url2).then((res)=>{
    //     if(res.data.responseCode==0){
    //        this.rootrulesetData=res.data.data;
    //     }else{
    //        this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   this.rootrulesShow=true;
   // },
    
   // roAddRule(){//Rule增加
    //   var url=SERVER_API_URL+"waf/rule/id/new";
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //       this.rootruleSid=res.data.data.data;
    //     }else{
    //       this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   var url2=SERVER_API_URL+"waf/ruleset";
    //   axios.get(url2).then((res)=>{
    //     if(res.data.responseCode==0){
    //        this.rootrulesetData=res.data.data;
    //     }else{
    //        this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   this.rootaddruleShow=true;
   // },
    
   // roRulesets(){//RuleSets
    //   var url=SERVER_API_URL+"waf/ruleset";
    //   axios.get(url).then((res)=>{
    //     if(res.data.responseCode==0){
    //         this.rootRulesetsData=res.data.data;
    //     }else{
    //         this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   this.rootrulesetsShow=true;
   // },
    
   // roMailnotify(){//邮件通知参数
    //   var url=SERVER_API_URL+"monitoring/mailparam";
    //   axios.get(url).then((res)=>{
    //     //  console.log(res)
    //     if(res.data.responseCode==0){
    //         this.rootmailparmasData=res.data.data;
    //         var diskRecipient=res.data.data.mailParam.recipient.diskRecipient.join(",");
    //         var wafRecipient=res.data.data.mailParam.recipient.wafRecipient.join(",");
    //         this.rootmailparmasData.mailParam.recipient.diskRecipient=diskRecipient;
    //         this.rootmailparmasData.mailParam.recipient.wafRecipient=wafRecipient;
    //     }else{
    //         this.$message.error('操作失败: '+ res.data.data.message);
    //     }
    //   }).catch((err)=>{
    //      console.log(err)
    //   });
    //   this.rootmailShow=true;
   // },
    
   // roTokenlicense(){
    //   var url=SERVER_API_URL+"licensetoken";
    //   axios.get(url).then((res)=>{
    //     this.rootokenlicenseData=res.data.data;
    //   })
    //   this.rootokenlicenseShow=true;
   // },
    
   // authUpload(){
    //   this.authuploadShow=true;
   // }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  }
}
</script>
<style>
.config-wrapper{
	width:100%; 
  height: 790px;
	position: relative;
}
#shadowtree{
  width: 100%;
  height: 100%;
}
.cm-contextmenu, .onoff-box, .onoff-DomainBox, .onoff-LocationBox, .onoff-InstructBox{
  position: absolute;
  display: none;
}
.ctxAuto-downmenu, .onoff-box, .onoff-DomainBox, .onoff-LocationBox, .onoff-InstructBox{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1003;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 140px
}
.onoff-box, .onoff-DomainBox, .onoff-LocationBox, .onoff-InstructBox{
  width: auto;
  max-width: 520px;
  white-space:normal;
  word-break: break-all;
  line-height: 18px;
}

.ctxAuto-downmenu .item{
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
.ctxAuto-downmenu .item:hover{background-color: #ecf5ff;color: #66b1ff;}

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