<template>
  <div class="configtree-wrapper">
    <div class="shadowManageBox">
      <div class="sdowMagContent">
        <div class="sdMagTitle">{{productName}} {{$t('lg.nodeshow')}}</div>
        <div class="sdMagTreeBox">
          <el-tree :data="shadowNodeData"  
            ref="sdNodeTree"
            default-expand-all
            node-key="id"
            :props="defaultProps" 
            highlight-current
            :expand-on-click-node="false"
            @node-click="shadowNodeClick"
            @node-contextmenu="shadowNodeCtm"
            :render-content="sdRenderContent">
          </el-tree>
          <div class="cm-contextmenu shadowmenu" ref="shadowmenuref">
          <ul class="ctx-downmenu" :style="{width:($store.state.isencn=='en'?'274px':'140px')}">
            <li class="item" @click="shadownodeAddDm">{{$t('lg.dmadd')}}</li>
            <li class="item" @click="shadownodeAddStream">{{$t('lg.fourzhuan')}}</li>
            <li :class="isShadowGrpNode?'item toHide':'item'" @click="sdStart">{{$t('lg.on')}}</li>
            <li :class="isShadowGrpNode?'item toHide':'item'" @click="sdStop">{{$t('lg.off')}}</li>
            <li :class="isShadowGrpNode?'item toHide':'item'" @click="sdRestart">{{$t('lg.restart')}}</li>
            <li class="item" @click="sdReset">{{$t('lg.onereset')}}</li>
            <li class="item" @click="sdRecover">{{$t('lg.onerecover')}}</li>
            <li class="item" @click="sdWarningMode">{{$t('lg.monitormode')}}</li>
            <!-- <li class="item" @click="sdWhiteList">{{$t('lg.whiteblack')}}</li> -->
            <li class="item" @click="sdSeniorInstruct">{{$t('lg.gaojipeiz')}}</li>
            <li class="item" @click="sdGlbInstruct">{{$t('lg.zidingyipz')}}</li>
            <li class="item" @click="sdCustomUpstream">{{$t('lg.zidingyiups')}}</li>
            <li class="item" @click="sdBatchInstruct()">{{$t('lg.piliangczml')}}</li>
            <!-- <li class="item" @click="updateWafFile">{{$t('lg.updatewaf')}}</li> -->
            <li class="item" @click="sdPushModal">{{$t('lg.tuisongpz')}}</li>
            <li class="item" @click="sdCersModal">{{$t('lg.cermanage')}}</li>
            <li class="item" @click="sdSaveConf">{{$t('lg.saveconfig')}}</li>
          </ul>
        </div>
        </div>
      </div>
      <dynamic-change ref="dynamicChange" :isShow="dynamicChangeShow"></dynamic-change>
    </div>
    <div class="configtreeBox" ref="configtreeBoxref">
      <div class="fixedTop">
        <div class="matchtips">
          <span><i class="i1"></i>{{$t('lg.exactmatch')}}</span><span><i class="i2"></i>{{$t('lg.suffixmatch')}}</span><span><i class="i3"></i>{{$t('lg.patchmatch')}}</span><span><i class="i4"></i>{{$t('lg.dynamicurl')}}</span><span><i class="i5"></i>{{$t('lg.tongyongpp')}}</span> <span><i class="i6"></i>stream</span> <i class="fa fa-font font-red2"></i>{{$t('lg.wafstart')}}
        </div>
        <div class="functionbtnBox">
          <!-- <el-button type="success" class="dynamicBtn" round size="small" @click="showDynamicChange" v-show="myRole=='ADMIN'">{{$t('lg.dynamicchange')}}</el-button> -->
          <el-button type="primary" size="mini" round icon="el-icon-search" @click="showSearch" :title="treeSearchShow?$t('lg.closesearch'):$t('lg.clicksearch')"></el-button>
          <el-button type="info" size="mini" round icon="el-icon-refresh" @click="dataRenderTree()" :title="$t('lg.f5back')"></el-button>
        </div>
      </div>   
		  <searchtree :isShow="treeSearchShow" @updateRenderTree="dataRenderTree"></searchtree>
      <div class="configtreeBox-l">
        <div class="nodetitlebox">
          <h2 class="nodetitle">{{currentSdNodeName}}</h2>
          <div v-if="!currentIsGroup">
            <p v-show="shadowStatusObj2.status==1" class="marginb8 font-green"><i class="el-icon-success shadow-icon-color-success"></i> {{$t('lg.running')}}</p>
            <p class="marginb8" v-show="shadowStatusObj2.status==2"><i class="el-icon-warning"></i> {{$t('lg.ting')}}</p>
            <p class="marginb8" v-show="shadowStatusObj2.status==3"><i class="el-icon-error"></i> {{$t('lg.nostatus')}}</p>
            <p class="marginb8">IP:{{shadowStatusObj2.ip}}</p>
            <p>{{$t('lg.version')}}:{{shadowStatusObj2.version || '--'}}</p>            
          </div>
          <div v-else>
            <ul>
              <li class="groupli" v-for="item in isGroupInfo.backupNodes">
              <p v-show="item.status==1" class="font-green"><i class="el-icon-success shadow-icon-color-success"></i>{{$t('lg.running')}}...</p> 
              <p v-show="item.status==2"><i class="el-icon-warning"></i> {{$t('lg.ting')}}</p>
              <p v-show="item.status==3"><i class="el-icon-error"></i> {{$t('lg.nostatus')}}</p>
            <p class="s1">{{item.nodeId}}</p> 
              </li>
            </ul>
          </div>
          <!-- <div v-else>
              <p class="bitemti">节点:</p>
              <ul>
                <li class="bitem" v-for="bitem in isGroupInfo.backupNodes">{{bitem}}</li>
              </ul>
          </div> -->
        </div>       
        <ul>
          <li class="domainitem" v-for="(item,index) in nodeDomainList" :title="item.name|base64Str" @click="getDataFromDm(item)" :class="{active:item.name==firstNodeDomainList.name && item.domainPort==firstNodeDomainList.domainPort}">
           <p v-if="item.domainPort"><span class="sdmtype"> [{{dmtypedo2(item.domainType)}}]</span>&nbsp; {{item.name|base64Str}}:{{item.domainPort}}</p> 
           <p v-else><span class="sdmtype"> [{{item.domainType | dmtypedo}}]</span>&nbsp; {{item.name|base64Str}}<i class="stream4">[ {{$t('lg.siczf')}} ]</i></p> 
           <p class="remarkinfo">({{item.remark || $t('lg.nomark')}})</p>
          </li>
        </ul>
      </div>
      <div class="configtreeBox-r">
          <div v-if="isNoConfigData" class="noConfigData-box">{{$t('lg.nodata')}}</div>
        <div class="configtreeContent" id="shadowtree2" ref="shadowtree2">
          <svg id="svg1"><g></g></svg>
        </div>

        <!-- 平台节点右键菜单 -->
        <div class="sdRootmenu" v-if="false">
          <ul class="ctx-downmenu">
            <li class="item" @click="roDoclist">{{$t('lg.filemanage')}}</li>
            <!-- <li class="item" @click="roUploadFile">文件上传</li> -->
            <li class="item" @click="roRules">{{$t('lg.rulesdetail')}}</li>
            <li class="item" @click="roAddRule">{{$t('lg.addrule')}}</li>
            <li class="item" @click="roRulesets">RuleSets</li>
            <li class="item" @click="roShadowGroup">{{$t('lg.sdClusterManage')}}</li>
            <!-- <li class="item" @click="roMailnotify">邮件通知参数</li> -->
            <!-- <li class="item" @click="roTokenlicense">授权Token</li> -->
          </ul>
        </div>
        <!-- shadow节点右键菜单 -->
        
        <!-- domain节点右键菜单 -->
        <div class="cm-contextmenu domainmenu">
          <ul class="ctx-downmenu" :style="{width:($store.state.isencn=='en'?'290px':'140px')}">
            <!-- <li class="item" @click="dmUpstreamModal">添加服务器</li> -->
            <li class="item" @click="dmUpstreamlistModal">{{$t('lg.manageserver')}}</li>
            <li class="item" @click="dmTransparentModal">{{$t('lg.iptouc')}}</li>
            <li class="item" @click="dmBlackshow">{{$t('lg.urlblack')}}</li>
            <!-- <li class="item" @click="dmVerifyToken">动态指纹功能</li> -->
            <li class="item" @click="dmLimReq">{{$t('lg.zhiwenfhpz')}}</li>
            <li class="item" @click="dmGlbInstruct">{{$t('lg.zidingyipz')}}</li>
            <li class="item" @click="dmKeepalivetModal">Keepalive</li>
            <li class="item" @click="dmEditModal">{{$t('lg.edit')}}</li>
            <li class="item" @click="dmDelete">{{$t('lg.delete')}}</li>
            <!-- <li class="item" @click="dmTestModal">APP环境感知功能</li> -->
          </ul>
        </div>

        <div class="cm-contextmenu streammenu">
          <ul class="ctx-downmenu">
            <li class="item" @click="stUpstreamlistModal">{{$t('lg.manageserver')}}</li>
            <li class="item" @click="stEditModal">{{$t('lg.edit')}}</li>
            <li class="item" @click="stDelete">{{$t('lg.delete')}}</li>
          </ul>
        </div>

        <!-- location节点右键菜单 -->
        <div class="cm-contextmenu locationmenu">
          <ul class="ctx-downmenu" :style="{width:($store.state.isencn=='en'?'216px':'140px')}">
            <li class="item" @click="lcProtectInstruct">{{isDenyUrl?$t('lg.mingwenjjurl'):$t('lg.baohupz')}}</li> 
            <li class="item" @click="lcSpecialProtectInstruct" v-show="!isDenyUrl">{{$t('lg.teshubhpz')}}</li> 
            <li class="item" @click="lcSkipInstruct" v-show="!isDenyUrl">{{$t('lg.tiaozpz')}}</li> 
            <li class="item" @click="lcSeniorInstruct" v-show="!isDenyUrl">{{$t('lg.gaojipeiz')}}</li>
            <li class="item" @click="lcCustomInstruct" v-show="!isDenyUrl">{{$t('lg.zidingyipz')}}</li>
            <!-- <li class="item" v-if="$store.state.licenceinfo.waf==1" @click="lcwafModal" v-show="!isDenyUrl">{{$t('lg.wafdetail')}}</li> -->
           <li class="item" v-if="$store.state.licenceinfo.waf==1" @click="lcwafModal" v-show="!isDenyUrl">{{$t('lg.wafdetail')}}</li>
            <li class="item" @click="lcEditModal" v-show="!isDenyUrl">{{$t('lg.edit')}}</li>
            <li class="item" @click="lcDelete">{{$t('lg.delete')}}</li>
          </ul>
        </div>

        <!-- shadow节点触摸框 -->
        <div class="onoff-box">
          <p style="padding:5px 10px 0px;">{{shadowObj.name}}</p><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
          <div style="padding:10px 15px 10px 10px;" v-if="isShadowStatusLoading" >
            <span><i class="el-icon-loading"></i>loading...</span>
          </div>
          <ul class="shadowStatusList" v-else>
            <li class="sStatusTitle" v-if="shadowStatusObj.isShadowGroup">{{$t('lg.masterNode')}}</li>
            <!-- <li>
              <p v-show="shadowStatusObj.masterNode.status==1" class="font-green"><i class="el-icon-success shadow-icon-color-success"></i> {{$t('lg.running')}}</p>
              <p v-show="shadowStatusObj.masterNode.status==2"><i class="el-icon-warning"></i> {{$t('lg.ting')}}</p>
              <p v-show="shadowStatusObj.masterNode.status==3"><i class="el-icon-error"></i> {{$t('lg.nostatus')}}</p>
              <p>IP:{{shadowStatusObj.masterNode.ip}}</p>
              <p>{{$t('lg.version')}}:{{shadowStatusObj.masterNode.version}}</p>
            </li> -->
            <li class="sStatusTitle marginTop" v-if="shadowStatusObj.isShadowGroup">{{$t('lg.backupNode')}}</li>
            <li v-if="shadowStatusObj.isShadowGroup" v-for="(item,index) in shadowStatusObj.backupNode" :class="index<shadowStatusObj.backupNode.length-1?'backupNodeLi':''" :key="index">
              <div>
                <p v-show="item.status==1" class="font-green"><i class="el-icon-success shadow-icon-color-success"></i> {{$t('lg.running')}}</p>
                <p v-show="item.status==2"><i class="el-icon-warning"></i> {{$t('lg.ting')}}</p>
                <p v-show="item.status==3"><i class="el-icon-error"></i> {{$t('lg.nostatus')}}</p>
              </div>
              <p>IP:{{item.ip}}</p>
              <p>{{$t('lg.version')}}:{{item.version}}</p>
            </li>
            <li class="sStatusTitle marginTop" v-if="shadowStatusObj.isShadowGroup">{{$t('lg.virtualIP')}}</li>
            <li v-if="shadowStatusObj.isShadowGroup" v-for="item in shadowStatusObj.virtualIPs">{{item}}</li>
          </ul>
        </div>
        <!-- domain节点触摸框 -->
        <div class="onoff-DomainBox">
          <!-- <span class="closeDmOnoffBtn" :title="$t('lg.off')"><i class="el-icon-circle-close"></i></span> -->
          <p style="padding:5px 10px 0px;">{{domainObj.domainName+':'+domainObj.port}}</p><!-- 鼠标移入显示节点名称 节点名称字符串过长采用的省略处理，鼠标移入显示完整节点名-->
          
          <div style="padding:10px 15px 10px 10px;" v-if="isSvCkLoading">
            <span><i class="el-icon-loading"></i>loading...</span>
          </div>
          
          <div v-else>
            <div style="padding:10px 15px 10px 10px;" v-if="domainStatusData.length==0">
              <span>{{svCkfailed?$t('lg.failureStatus'):$t('lg.healthCkNotOpen')}}</span>
            </div>
            <ul v-else class="domainStatusList">
              <li v-for="(item,index) in domainStatusData" :key="index">
                <p>{{$t('lg.server')}}：{{item.name}}</p>
                <p>{{$t('lg.yichulqqs')}}：{{item.doc_count}}</p>
                <p>{{$t('lg.status')}}：<span v-if="item.status=='up'" class="font-green"><i class="el-icon-success shadow-icon-color-success"></i> {{$t('lg.running')}}</span> <span v-else><i class="el-icon-warning"></i> {{$t('lg.ting')}}</span></p>
              </li>
            </ul>
          </div>
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

      
    </div>

    <shadowpop :shadowDialogVisible="shadowDialogVisible" :shadowObj="shadowObj" :keys="keys" :diplomas="diplomas" @setbyshadowpopchild="shadowDialogVisible=false" @updateRenderTree="dataRenderTree"></shadowpop>
    <sd-warning-mode ref="sd_warningMode" :isShow="sdWarningModemodalShow" :shadowObj="shadowObj" @setbysdWarningModemodal="sdWarningModemodalShow=false"></sd-warning-mode>
		<!-- <white-listmodal ref="sd_whitelist" :isShow="whiteListShow" :shadowObj="shadowObj" @setbywhiteListmodal="whiteListShow=false"></white-listmodal> -->
    <sd-senior-instruct ref="sd_seniorInstruct" :isShow="sdSeniorInstructmodalShow" :shadowObj="shadowObj" @setbysdSeniorInstructmodal="sdSeniorInstructmodalShow=false"></sd-senior-instruct>
    <sd-glb-instruct ref="sd_glbInstruct" :isShow="sdGlbInstructmodalShow" :shadowObj="shadowObj" @setbysdGlbInstructmodal="sdGlbInstructmodalShow=false"></sd-glb-instruct>
    <sd-custom-upstream ref="sd_customUpstream" :isShow="sdCustomUpstreammodalShow" :shadowObj="shadowObj" @setbysdCustomUpstreammodal="sdCustomUpstreammodalShow=false"></sd-custom-upstream>
    <sd-batch-instruct ref="sd_batchInstruct" :isShow="sdBatchInstructmodalShow" :shadowObj="shadowObj" @setbysdBatchInstructmodalclose="sdBatchInstructmodalShow=false;" @updateRenderTree="dataRenderTree"></sd-batch-instruct>
    <!-- <sd-limit-zone ref="sd_limitZone" :isShow="sdLimZonemodalShow" :shadowObj="shadowObj" @setbysdLimZonemodal="sdLimZonemodalShow=false"></sd-limit-zone> -->
    <!-- <sd-limit-req-status ref="sd_limitReqStatus" :isShow="sdLimReqStumodalShow" :shadowObj="shadowObj" @setbysdLimReqStumodal="sdLimReqStumodalShow=false"></sd-limit-req-status> -->
    <pushmodal :pushmodalShow="pushmodalShow" :data="shadownodes" :shadowObj="shadowObj" @setbypushmodal="pushmodalShow=false"  @updateRenderTree="dataRenderTree"></pushmodal>
    <cersmodal :cersmodalShow="cersmodalShow" :keys="keys" :crts="crts" :pems="pems" @setbycersmodal="cersmodalShow=false" :shadowObj="shadowObj"></cersmodal>
    <saveconfmodal :saveconfmodalShow="saveconfmodalShow" :shadowObj="shadowObj" @setbysaveconfmodal="saveconfmodalShow=false"></saveconfmodal>

    <domainpop :domainDialogVisible="domainDialogVisible" :shadowObj="shadowObj" :domainObj="domainObj" @setbydomainpopchild="domainDialogVisible=false" @updateRenderTree="dataRenderTree"></domainpop>
    <!-- <dm-addupstream :upstreammodalShow="upstreammodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreammodal="upstreammodalShow=false"></dm-addupstream> -->
    <dm-upstreamlist ref="dm_upstreamlist" :isShow="upstreamlistmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreamlistmodal="upstreamlistmodalShow=false"></dm-upstreamlist>
    <dmurlblacks ref="dm_urlblacks" :isShow="urlblackmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @urlblackclose="urlblackmodalShow=false"></dmurlblacks>
    <st-upstreamlist ref="st_upstreamlist" :isShow="streamlistmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbyupstreamlistmodal="streamlistmodalShow=false"></st-upstreamlist>
    <!-- <dm-waf :wafmodalShow="wafmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmWafData" @setbysavewafmodal="wafmodalShow=false" @updateRenderTree="dataRenderTree"></dm-waf> -->
    <dm-redict :redirectmodalShow="redirectmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :data="redirect302Url" @setbyredictmodal="redirectmodalShow=false" @setredirect="setRedirectInput"></dm-redict>
    <!-- <dm-verify-token ref="dm_verifyToken" :isShow="dmVerifyTokenmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmverifyTokenmodal="dmVerifyTokenmodalShow=false"></dm-verify-token> -->
    <dm-limit-req ref="dm_limitReq" :isShow="dmLimReqmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmlimReqmodal="dmLimReqmodalShow=false"></dm-limit-req>
    <dm-glb-instruct ref="dm_glbInstruct" :isShow="dmGlbInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmGlbInstructmodal="dmGlbInstructmodalShow=false"></dm-glb-instruct>
		<dm-edit :dmEditmodalShow="dmEditmodalShow" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmEditObj" @setbydmEditmodal="dmEditmodalShow=false" @updateRenderTree="dataRenderTree"></dm-edit>
    <!-- <dm-test :dmTestmodalShow="dmTestmodalShow" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" :domainObj="domainObj" :data="dmEditObj" @setbydmEditmodal="dmEditmodalShow=false" @updateRenderTree="dataRenderTree"></dm-test> -->
    <st-edit :dmEditmodalShow="stEditmodalShow" :keys="keys" :diplomas="diplomas" :shadowObj="shadowObj" :domainObj="domainObj" :data="stEditObj" @setbydmEditmodal="stEditmodalShow=false" @updateRenderTree="dataRenderTree"></st-edit>
    <dmtransparent ref="dm_transparent" :isShow="dmtransparentShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmtransparentmodal="dmtransparentShow=false"></dmtransparent>
    <dmkeepalive ref="dm_keepalive" :isShow="dmkeepaliveShow" :shadowObj="shadowObj" :domainObj="domainObj" @setbydmkeepalivemodal="dmkeepaliveShow=false"></dmkeepalive>
    <!-- <locationpop :locationDialogVisible="locationDialogVisible" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylocationpopchild="locationDialogVisible=false" @updateRenderTree="dataRenderTree"></locationpop> -->
    <lc-protect-instruct ref="lc_protectInstruct" :isShow="lcprotectInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcProtectInstructmodal="lcprotectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-protect-instruct>
    <lc-special-protect-instruct ref="lc_specialProtectInstruct" :isShow="lcSpecialProtectInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSpecialProtectInstructmodal="lcSpecialProtectInstructmodalShow=false" @updateRenderTree="dataRenderTree"></lc-special-protect-instruct>
    <lc-skip-instruct ref="lc_skipInstruct" :isShow="lcSkipInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSkipInstructmodal="lcSkipInstructmodalShow=false"></lc-skip-instruct>
    <lc-senior-instruct ref="lc_seniorInstruct" :isShow="lcSeniorInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcSeniorInstructmodal="lcSeniorInstructmodalShow=false"></lc-senior-instruct>
    <lc-custom-instruct ref="lc_customInstruct" :isShow="lcCustomInstructmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcCustomInstructmodal="lcCustomInstructmodalShow=false"></lc-custom-instruct>
    <lc-waf2 ref="lcwaf2" :isShow="lcwafmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" :data="lcwafData"  :attypedata="attactypeData" @setbylcwafmodal="lcwafmodalShow=false" @updateRenderTree="dataRenderTree"></lc-waf2>
		<lc-edit :lcEditmodalShow="lcEditmodalShow" :shadowObj="shadowObj" :domainObj="domainObj" :locationObj="locationObj" @setbylcEditmodal="lcEditmodalShow=false" @updateRenderTree="dataRenderTree"></lc-edit>
    
    <ro-doclist :isShow="rootdoclistShow" :data="rootdoclistData" :nodesdata="shadownodes" @rodoclistclose="rootdoclistShow=false" @updateRoDoclist="roDoclist" @updateRenderTree="dataRenderTree" ></ro-doclist>
    <!-- <ro-uploadfile :isShow="rootuploadfileShow" @rouploadfileclose="rootuploadfileShow=false"></ro-uploadfile> -->
    <ro-rules :isShow="rootrulesShow" :data="rootrulesData" @updateRootRule="roRules" @rootrulesclose="rootrulesShow=false"></ro-rules>
    <ro-addrule ref="roaddrule" :isShow="rootaddruleShow" :sid="rootruleSid" :attypedata="attactypeData" @rootaddruleclose="rootaddruleShow=false"></ro-addrule>
    <ro-rulesets :isShow="rootrulesetsShow" :data="rootRulesetsData" @updateRulesets="roRulesets" @rootrulesetsclose="rootrulesetsShow=false"></ro-rulesets>
    <ro-shadow-group ref="ro_shadowGroup" :isShow="rootShadowGroupShow" @rootShadowGroupclose="rootShadowGroupcloseFn" :updateRenderTree="dataRenderTree" @updateSdGrpData="dataRenderTree" @delgroupemit="dataRenderTree"  @updateleftshow="updateleftshow"></ro-shadow-group>
    <attactypepop ref="attactypepop" :isShow="attactypepopShow" :data="attactypeData" @attactypeclose="attactypepopShow=false"></attactypepop>
    <streampop :streamShow="shadowStreamShow"  :shadowObj="shadowObj" :keys="keys" :diplomas="diplomas" @setbyshadowpopchild="shadowStreamShow=false" @updateRenderTree="dataRenderTree"></streampop>
 <loading ref="loading"></loading>
  </div>	
</template>
<script>
import * as d3 from 'd3';
import axios from 'axios';
import * as types from '@/store/types';
import {SERVER_API_URL,SERVER_API_URL2} from '@/conf/constvar';
let Base64 = require('js-base64').Base64;
import client from "@/components/es/connection";
import toISO8601 from "@/assets/js/iso8601";
import {handleConfigure} from '@/assets/js/tool';

import dynamicChange from '@/components/config/dynamicChange';
import searchtree from '@/components/config/searchtree';
// import loading from '@/components/loading/loading';
import loading from '@/components/loading/gptloading';

import shadowpop from '@/components/pubconfig/shadowpop';
import sdWarningMode from '@/components/pubconfig/sd_warningMode';
import sdSeniorInstruct from '@/components/pubconfig/sd_seniorInstruct';
import sdGlbInstruct from '@/components/pubconfig/sd_glbInstruct';
import sdCustomUpstream from '@/components/pubconfig/sd_customUpstream';
import sdBatchInstruct from '@/components/pubconfig/sd_batchInstruct';
import pushmodal from '@/components/config/pushmodal';
import cersmodal from '@/components/config/cersmodal';
import saveconfmodal from '@/components/pubconfig/saveconfmodal';
import streampop from '@/components/pubconfig/streampop'

import domainpop from '@/components/pubconfig/domainpop';
// import dmAddupstream from '@/components/config/dm_upstreambackend';
import dmUpstreamlist from '@/components/pubconfig/dm_upstreamlist';
import dmurlblacks from '@/components/pubconfig/dm_urlblack';
import stUpstreamlist from '@/components/pubconfig/st_upstreamlist';
import dmRedict from '@/components/pubconfig/dm_redirect302';
import dmLimitReq from '@/components/pubconfig/dm_limitReq';
import dmGlbInstruct from '@/components/pubconfig/dm_glbInstruct';
import dmEdit from '@/components/pubconfig/dm_edit';
import dmTest from '@/components/pubconfig/dm_test';
import stEdit from '@/components/pubconfig/st_edit';
import dmtransparent from '@/components/pubconfig/dm_transparent';
import dmkeepalive from '@/components/pubconfig/dm_keepalive';
// import locationpop from '@/components/pubconfig/locationpop';
import lcProtectInstruct from '@/components/pubconfig/lc_protectInstruct';
import lcSpecialProtectInstruct from '@/components/pubconfig/lc_specialProtectInstruct';
import lcSkipInstruct from '@/components/pubconfig/lc_skipInstruct';
import lcSeniorInstruct from '@/components/pubconfig/lc_seniorInstruct';
import lcCustomInstruct from '@/components/pubconfig/lc_customInstruct';
//import lcWaf from '@/components/pubconfig/lc_wafstatus';
import lcWaf2 from '@/components/pubconfig/lc_waf2';
import lcEdit from '@/components/pubconfig/lc_edit';
import roDoclist from '@/components/config/ro_doclist';
import roRules from '@/components/config/ro_rules';
import roAddrule from '@/components/config/ro_addrule';
import roRulesets from '@/components/config/ro_rulesets';
import roShadowGroup from '@/components/config/ro_shadowGroup';
import attactypepop from '@/components/config/attactypePop';

import store from '../../store/store';
export default{
  components:{
    dmurlblacks,
    stEdit,
    stUpstreamlist,
    streampop,
     loading,
    attactypepop,
    dynamicChange,
    searchtree,

    shadowpop,
    sdWarningMode,
    // whiteListmodal,
    sdSeniorInstruct,
    sdGlbInstruct,
    sdCustomUpstream,
    // sdAgentTimeout,
    // sdApi,
    // sdShadowlib,
    // sdDefenseCookie,
    sdBatchInstruct,
    // sdLimitZone,
    // sdLimitReqStatus,
    pushmodal,
    cersmodal,
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
   // dmTest,///test

    // locationpop,
    lcProtectInstruct,
    lcSpecialProtectInstruct,
    lcSkipInstruct,
    lcSeniorInstruct,
    lcCustomInstruct,
    lcWaf2,
    lcEdit,
    roDoclist,
    roRules,
    roAddrule,
    roRulesets,
    roShadowGroup,
    dmtransparent,
    dmkeepalive
  },
  data(){
    return{
      urlblackmodalShow:false,
      attactypepopShow:false,
      attactypeData:[],
      productName:store.state.productName,
      myRole:sessionStorage.getItem('myRoles'),//
      shadowNodeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentSdNodeId:'',//
      currentSdNodeName:'',
      currentIsGroup:false,
      isSdRootmenuShow:true,//

      isNoConfigData:false,//
      jsonData:{},//
      nodeDomainList:[],
      firstNodeDomainList:{},
      curSelectedDomain:"",
      isCurSelectedDm:false,
      newShadowNodeOpt:[],
      shadowObj:{
        snodeId:'',
        name:'',
        groupId:''
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
      instructObj:{
        name:''
      },
      
      // shadow节点触摸框
      isShadowStatusLoading:true,
      shadowStatusObj2:{
        status:3,
        ip:'',
        version:'--'
      },
      shadowStatusObj:{//
        // name:'',
        // isShadowGroup:true,
        // masterNode:{},
        // backupNode:[],
        // virtualIPs:[]
      },
      isGroupInfo:{},
      isShadowGroup2:false,
      isShadowGrpNode:false,//
      // onoff:'',
      // onoffIp:'',
      // myVersion:'',

      crts:[],
      pems:[],
      diplomas:[],// pems 和 crts 证书的合并
      keys:[],
  
      shadownodes:[],

      // domain节点触摸框
      isSvCkLoading:false,
      domainStatusData:[],//查看domain健康检查状态
      svCkfailed:false,//健康检查是否查询失败
      // 动态变换
      dynamicChangeShow:false,

      treeSearchShow:false,
      shadowDialogVisible:false,
      shadowStreamShow:false,
      sdWarningModemodalShow:false,
      // whiteListShow:false,
      sdSeniorInstructmodalShow:false,
      sdGlbInstructmodalShow:false,
      sdCustomUpstreammodalShow:false,
      sdBatchInstructmodalShow:false,
      pushmodalShow:false,
      cersmodalShow:false,
      saveconfmodalShow:false,
      
      domainDialogVisible:false,
      // upstreammodalShow:false,
      upstreamlistmodalShow:false,
      streamlistmodalShow:false,
      redirectmodalShow:false,
      // dmVerifyTokenmodalShow:false,
      dmLimReqmodalShow:false,
      dmGlbInstructmodalShow:false,
      dmEditmodalShow:false,
      dmTestmodalShow:false, ///test
      stEditmodalShow:false,

      // wafmodalShow:false,
      dmtransparentShow:false,
      dmkeepaliveShow:false,

      // locationDialogVisible:false,
      lcprotectInstructmodalShow:false,
      lcSpecialProtectInstructmodalShow:false,
      lcSkipInstructmodalShow:false,
      lcSeniorInstructmodalShow:false,
      lcCustomInstructmodalShow:false,
      lcwafmodalShow:false,

      dmWafData:{},
      lcwafData:{},
      lcEditmodalShow:false,
      redirect302Url:'',
      dmEditObj:{},//编辑业务 存放查询业务的配置信息
      stEditObj:{},
      rootdoclistShow:false,
      // rootuploadfileShow:false,
      rootrulesShow:false,
      rootaddruleShow:false,
      rootdoclistData:[],
      rootrulesData:[],
      // rootrulesetData:[],
      rootruleSid:'',
      rootrulesetsShow:false,
      rootRulesetsData:[],

      rootShadowGroupShow:false,
      isDenyUrl:false,//location 被保护的页面为 deny_url 要特殊处理
      isencn:'cn'
      
    }
  },
  watch:{
    '$store.state.isMenuShow':function(){
      this.configtree(this.firstNodeDomainList);//浏览器窗口大小改变，重新展开svg，无需再发送请求
    }
  },
  created(){
    this.$store.state.isencn=localStorage.lang;
   // if(!this.$store.state.productName){
      this.getProductname();
   // }
    this.$store.state.contentLoading=true;
    window.addEventListener("resize",()=>{
      if(this.$route.path=="/config"){
        this.configtree(this.firstNodeDomainList);//浏览器窗口大小改变，重新展开svg，无需再发送请求
        
        const menuList=document.querySelectorAll(".cm-contextmenu");
        const [...menuArr]=menuList;
        menuArr.forEach(el=>{
          el.style.display="none"
        })
      }
    });
  },
  mounted(){
    var _this=this;
    this.dataRenderTree();
    
    document.querySelector('body').onclick=function(){
      let shadowmenuEle=_this.$refs.shadowmenuref;
      if(shadowmenuEle){
        shadowmenuEle.style.display="none";
      } 
    }
  },
  methods:{
    rootShadowGroupcloseFn(){
  // this.dataRenderTree();
      this.rootShadowGroupShow=false;
    },
    getProductname(){
      let url=SERVER_API_URL2+'pe/shadow/kv/productName';
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data.data
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
    shadownodeAddStream(){
      this.shadowStreamShow=true;
    },
    shadownodeAddDm(){
      let _this=this;
      _this.getCrts();
      _this.getKeys();
      _this.shadowDialogVisible=true;
    },
    getDataFromDm(item){
      var _this=this;
     // _this.jsonData=item;
      _this.firstNodeDomainList=item;
      _this.$nextTick(()=>{
        _this.configtree(_this.firstNodeDomainList);
      })
    },
    shadowNodeClick(item){
      if (!item.id) return false
      const _this=this;
      _this.currentSdNodeId=item.id;
      _this.currentIsGroup=item.isShadowGroup;
      _this.currentSdNodeName=item.label;
      _this.firstNodeDomainList={};
      _this.$nextTick(()=>{
        const menuList=document.querySelectorAll(".cm-contextmenu");
        const [...menuArr]=menuList
        menuArr.forEach(el=>{
          el.style.display="none"
        })

        _this.dataRenderTree();
      })
    },
    shadowNodeCtm(e,data){
      let _this=this;
      _this.shadowObj.snodeId=data.id;
      _this.shadowObj.name=data.label;
      _this.shadowObj.groupId=data.groupId;
      let xVal=0;
      let yVal=10;
      _this.$refs.shadowmenuref.style.left=xVal+"px";
      _this.$refs.shadowmenuref.style.bottom=yVal+"px";
      _this.$refs.shadowmenuref.style.display="block"
    },
    sdRenderContent(h, { node, data, store }){
      if(data.children){
        return (
          <span class="sdMag-tree-node">
            <span>{node.label}</span>
            <span v-show={this.myRole=='ADMIN'}>
              <span v-show={this.isSdRootmenuShow}>
              <el-button size="small" type="text" on-click={ (event) => this.showDynamicChange() } >{this.$t('lg.dynamicchange')}</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.roDoclist() } >{this.$t('lg.filemanage')}</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.roRules() } >{this.$t('lg.rulesdetail')}</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.roAddRule() } >{this.$t('lg.addrule')}</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.attactypeMsg() } >{this.$t('lg.attacktypemng')}</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.roRulesets() } >RuleSets</el-button>
                <el-button size="small" type="text" on-click={ (event) => this.roShadowGroup() } >{this.$t('lg.sdClusterManage')}</el-button>
              </span>
              <el-button size="small" type="text" icon={this.isSdRootmenuShow?"el-icon-caret-left":"el-icon-caret-right"} on-click={ (event) => this.isSdRootmenuShow=!this.isSdRootmenuShow }></el-button>
            </span>
          </span>
        );
      }else{
        return (
          <span class="sdMag-tree-node">
            <span>{node.label}</span>
          </span>
        );
      }
    },
    getCurrentUserDomain(){
      return new Promise((resolve,reject)=>{
        const userName=this.$store.state.user.name || sessionStorage.getItem('myname');
        const url=SERVER_API_URL+'pe/shadow/user/accessdomain/'+userName;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            const resData = res.data.data?res.data.data.domains : [];
            resolve(resData);
          }
        })
      })
    },
    getElementFromArrobj(arr,name,port){
      let obj = arr.find(o => {
        return (o.name === name && o.domainPort==port)   
      });
      return obj;
    },
    isEqualFor2Objs(obj1,obj2){
      if(obj1.name==obj2.name && obj1.domainPort==obj2.domainPort){
        this.isCurSelectedDm= true;
      }else{
        this.isCurSelectedDm= false;
      }
      return this.isCurSelectedDm;
    },
    isObjEmpty(obj){
      return Object.keys(obj).length===0
    },
    updateleftshow(){
      this.currentSdNodeName="";
      this.currentSdNodeId="";
    },
    async dataRenderTree(groupFlag){
      var _this=this;
     // _this.currentSdNodeName="";
     // _this.currentSdNodeId="";
      _this.currentIsGroup=false;
      let encodeList = [];
      await _this.getCurrentUserDomain().then((resolvedata)=>{
        encodeList=resolvedata.map(ele=>{
          return Base64.encode(ele);
        })
      })
      if(_this.$store.state.configServerUrl){
        var serverUrl=_this.$store.state.configServerUrl;
      }else{
        var serverUrl=SERVER_API_URL+"topology";
      }
      axios.get(serverUrl).then((res)=>{
        if(res.data.responseCode==0){
          let resData=res.data;
          let resdatai,resDomain,resStream,dmSm;
          for(var i=0;i<resData.data.length;i++){
            resdatai=resData.data[i];
            resDomain=resdatai.domains;
            resStream=resdatai.streams;
            dmSm=[...resDomain,...resStream];
            resdatai.dmSm=dmSm;    
            delete resdatai["domains"];
            delete resdatai["streams"];
          }
          var datastring=JSON.stringify(resData);
          datastring=datastring.replace(/\bhostName\b/g,"name");
          datastring=datastring.replace(/\bdmSm\b/g,"children");
          datastring=datastring.replace(/\blocation\b/g,"children");
          datastring=datastring.replace(/\burl\b/g,"children");
          datastring=datastring.replace(/\blocationName\b/g,"name");
          datastring=datastring.replace(/\bdomainName\b/g,"name");
          datastring=datastring.replace(/\burlName\b/g,"name");
          datastring=datastring.replace(/\bstreamName\b/g,"name");
          var data=JSON.parse(datastring);
          if(_this.myRole=='USER'){
            data.data.forEach(es=>{
              es.children=es.children.filter(ke=>{
                return encodeList.includes(ke.name)
              })
            })
          }

          if(!_this.$store.state.configServerUrl){
            let sdOpt=[];
            let isgroupinfo={};
            data.data.forEach(f=>{
              if(f.isShadowGroup){
                isgroupinfo={
                 // masterNode:f.masterNode,
                  backupNodes:f.backupNodes,
                //  virtualIPs:f.virtualIPs
                }
              };
              this.isGroupInfo=isgroupinfo;
              if(_this.myRole=='USER'){
                if(f.children.length>0){
                  sdOpt.push({
                    id:f.snodeId,
                    label:f.isShadowGroup?f.name+'('+_this.$t('lg.group')+')':f.name,
                    isShadowGroup:f.isShadowGroup,
                    groupId:f.groupId || '',
                    isgroupinfo:isgroupinfo
                  })
                }
              }else if(_this.myRole=='ADMIN'){
                sdOpt.push({
                  id:f.snodeId,
                  label:f.isShadowGroup?f.name+'('+_this.$t('lg.group')+')':f.name,
                  isShadowGroup:f.isShadowGroup,
                  groupId:f.groupId || '',
                  isgroupinfo:isgroupinfo,
                })
              }
            })
            const shadowNodeOpt = [
              {
                label: this.productName,
                children: sdOpt
              }
            ];
            this.newShadowNodeOpt=sdOpt;
            this.shadowNodeData=sdOpt.length>0?shadowNodeOpt:[];
            this.currentSdNodeId=this.currentSdNodeId?this.currentSdNodeId:sdOpt.length>0 && sdOpt[0].id;//存储当前选中的节点id
            this.currentSdNodeName=this.currentSdNodeName?this.currentSdNodeName:sdOpt.length>0 && sdOpt[0].label;
           this.isShadowGroup2=this.isShadowGroup2?this.isShadowGroup2:sdOpt.length>0 && sdOpt[0].isShadowGroup;
            if(groupFlag){
              this.currentSdNodeId=sdOpt[0].id;
              this.currentSdNodeName=sdOpt[0].label;
              this.isShadowGroup2=sdOpt[0].isShadowGroup;
              this.isGroupInfo=sdOpt[0].isgroupinfo;
            }
            this.$nextTick(() => {
              this.currentSdNodeId && this.$refs.sdNodeTree.setCurrentKey(_this.currentSdNodeId); 
            });
          }
          if(!this.currentIsGroup){
            _this.getShadowstatus(_this.currentSdNodeId);
          }
         //  console.log(data.data)
          const resList = data.data.filter(h=>{
            return h.snodeId===this.currentSdNodeId;
          });
          if(resList.length==0){
            _this.isNoConfigData=true;
          }else{
            _this.isNoConfigData=false;
          }
           _this.nodeDomainList=resList[0]?resList[0].children:[];

           if(_this.isObjEmpty(_this.firstNodeDomainList)){
             if(_this.nodeDomainList.length>0){
               _this.firstNodeDomainList=_this.nodeDomainList[0];
             }else{
               _this.firstNodeDomainList={};
               _this.isNoConfigData=true;
             } 
           }else{
            let firstDmListName=_this.firstNodeDomainList.name;
            let firstDmListPort=_this.firstNodeDomainList.domainPort;
           var tt=_this.getElementFromArrobj(_this.nodeDomainList,firstDmListName,firstDmListPort);
            if(tt){
             _this.firstNodeDomainList=tt;
           }else{
             _this.firstNodeDomainList=_this.nodeDomainList[0];
           }
           }
      
          _this.$nextTick(()=>{
            _this.configtree(_this.firstNodeDomainList);
          })
          _this.$store.state.configServerUrl='';
          _this.$store.state.contentLoading=false;
        }else{
          this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    configtree(jsonTreeData){
      var _this=this;
      // console.log(_this.$refs.shadowtree2);
      if(!_this.$refs.shadowtree2){
        return
      }
     
      const width=_this.$refs.shadowtree2.clientWidth;
      // const height=_this.$refs.shadowtree2.clientHeight-10;
      const margin = ({top: 60, right: 120, bottom: 60, left: 240}); 
      const dy = width / 6; 
      const dx = 10;
      const tree = d3.tree().nodeSize([30, dy+20]);
      // console.log(d3)

      const svg = d3.select("#shadowtree2").select("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx]);
        // .style("font", "10px sans-serif")
        // .style("user-select", "none")
      svg.selectAll("*").remove();

      if(Object.keys(jsonTreeData).length==0){//未查到数据时
        return
      }
      
      let i = 0
      let shadowStatusTimer
      let clk_dbl_timer

      const root = d3.hierarchy(jsonTreeData, function(d) { return d.children; });
      const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x)
      root.x0 = 10 ;
      root.y0 = dy/3;
      root.children && root.children.forEach(function(v,i){ 
        if(v.children){
          var r = v.children;
          r.forEach(collapse);
          // v.children.forEach(function(val,index){
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

      // root.descendants().forEach((d, i) => {
      //   console.log(d)
      //   d.id = i;
      //   d._children = d.children;
      //   if (d.depth && d.depth == 4) d.children = null;
      // });

      //窗口滚动时，关闭
      // window.addEventListener("scroll",function(){
      //   d3.selectAll(".cm-contextmenu").style("display","none");
      // }, true);
      
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

        // Up…
        const node = gNode.selectAll("g.node")
          .data(nodes,  function(d) {return d.id || (d.id = ++i); });

        // Enter any sition.
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
              _this.getCrts();
              _this.getKeys();
              _this.shadowDialogVisible=true;
            }else if(dData.hasOwnProperty("domainPort")){
              _this.domainDialogVisible=true;
              //const dParent=d.parent.data;
              const domainName=Base64.decode(dData.name);
              const domainPort=dData.domainPort;
              _this.domainObj.domainName=domainName;
              _this.domainObj.port=domainPort;
             // _this.shadowObj.snodeId=dParent.snodeId;
             // _this.shadowObj.name=dParent.name;
             
             let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
            _this.shadowObj.snodeId=curSdnodeId;
            }else if(dData.hasOwnProperty("locationType")){
              if(dData.name=="ZGVueV91cmw="){//
                return false
              }
              
              const dParent=d.parent.data;
            //  const dParentParent=d.parent.parent.data;

              if(dData.locationType=="suffixMatch"){
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
            //  _this.shadowObj.snodeId=dParentParent.snodeId;
            //  _this.shadowObj.name=dParentParent.name;

            let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
            _this.shadowObj.snodeId=curSdnodeId;

              // _this.locationDialogVisible=true;//loc指令
            }
          })
          .on("contextmenu",(d,i)=>{//右键
            d3.event.preventDefault();
            let xVal,yVal;
           // console.log(_this.$refs.configtreeBoxref.scrollTop)
            if (d3.event.pageX || d3.event.pageY) {
                xVal = d3.event.pageX;
                yVal = d3.event.pageY + _this.$refs.configtreeBoxref.scrollTop;
            } else if (d3.event.clientX || d3.event.clientY) {
                xVal = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                yVal = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
           // console.log(xVal,yVal)
            clearTimeout(shadowStatusTimer);
            d3.selectAll(".cm-contextmenu").style("display","none");
            const dData=d.data;
            // const xVal=d.y+120;
            // const yVal=event.offsetY; //d.x
         //  let yVal=d.y;
            var shadowmenu,domainmenu,locationmenu,streammenu;
            if(dData.hasOwnProperty("snodeId")){
              const snodeId=dData.snodeId;
              const name=dData.name;
              _this.shadowObj.snodeId=snodeId;
              _this.shadowObj.name=name;
              shadowmenu=d3.select(".shadowmenu");
              shadowmenu.style("display","block");
              shadowmenu.style("left",xVal+"px");
              if(dData.isShadowGroup){//如果无效
                _this.isShadowGrpNode=true;
                if(yVal>200){
                  shadowmenu.style("top",yVal-200+"px");
                }else{
                  shadowmenu.style("top",yVal+55+"px");
                }                 
              }else{
                _this.isShadowGrpNode=false;
                if(yVal>270){
                  shadowmenu.style("top",yVal-270+"px");
                }else{
                  shadowmenu.style("top",yVal+55+"px");
                }  
              }
              // shadowmenu.style("z-index","104");
            }else if(dData.hasOwnProperty("domainPort")){
             // const dParent=d.parent.data;
              const domainName=Base64.decode(dData.name);
              const domainPort=dData.domainPort;
              _this.domainObj.domainName=domainName;
              _this.domainObj.port=domainPort;
             // _this.shadowObj.snodeId=dParent.snodeId;
              //_this.shadowObj.name=dParent.name;
              let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
            _this.shadowObj.snodeId=curSdnodeId;
              domainmenu=d3.select(".domainmenu");
              domainmenu.style("display","block");
              domainmenu.style("left",xVal-215+"px");
              domainmenu.style("top",yVal-320+"px");
              // if(yVal>115){
              //   domainmenu.style("top",yVal-115+"px");
              // }else{
              //   domainmenu.style("top",yVal+55+"px");
              // }
            }else if(dData.hasOwnProperty("streamPort")){
              const stName=Base64.decode(dData.name);
             // const domainPort=dData.domainPort;
              _this.domainObj.domainName=stName;
            //  _this.domainObj.port=domainPort;
              let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
            _this.shadowObj.snodeId=curSdnodeId;
              streammenu=d3.select(".streammenu");
              streammenu.style("display","block");
              streammenu.style("left",xVal-215+"px");
              streammenu.style("top",yVal-280+"px");
            }else if(dData.hasOwnProperty("locationType")){
              const dParent=d.parent.data;
             // const dParentParent=d.parent.parent.data;

              if(dData.locationType=="suffixMatch"){
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
              // _this.shadowObj.snodeId=dParentParent.snodeId;
              // _this.shadowObj.name=dParentParent.name;
              let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
            _this.shadowObj.snodeId=curSdnodeId;
              locationmenu=d3.select(".locationmenu");
              locationmenu.style("display","block");
              locationmenu.style("left",xVal-215+"px");
              locationmenu.style("top",yVal-320+"px");
            }

            // 点击其他地方关闭右键菜单
            d3.select("body").on("click",()=>{
              d3.selectAll(".cm-contextmenu").style("display","none");
            });
            // d3.selectAll(".onoff-DomainBox").style("display","none"); // domian 状态关闭浮框
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
              // d3.selectAll(".onoff-DomainBox").style("display","none"); // domian 状态关闭浮框
            },300)
          })
          .on("mouseover",(d,i)=>{//鼠标移上
            var dData=d.data;
             let xVal,yVal;
            if (d3.event.pageX || d3.event.pageY) {
                xVal = d3.event.pageX;
                yVal = d3.event.pageY;
            } else if (d3.event.clientX || d3.event.clientY) {
                xVal = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                yVal = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            var onoffbox;
            shadowStatusTimer=setTimeout(function(){
              if(dData.hasOwnProperty("snodeId")){
                var snodeId=dData.snodeId,
                    snodeName=dData.name,
                    isSdGroup=dData.isShadowGroup;
                _this.shadowObj.snodeId=snodeId;
                _this.shadowObj.name=isSdGroup?snodeName+'('+_this.$t('lg.group')+')':snodeName;
                _this.getShadowstatus(snodeId);
                onoffbox=d3.select(".onoff-box");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal+"px");
                onoffbox.style("top",yVal+"px");
              }else if(dData.hasOwnProperty("domainPort")){
                // var dParent=d.parent.data;
                // var snodeId=dParent.snodeId,
                //     snodeName=dParent.name,
                let curSdnodeId=_this.currentSdNodeId?_this.currentSdNodeId:_this.newShadowNodeOpt.length>0 && _this.newShadowNodeOpt[0].id;
                var snodeId=curSdnodeId;
                var snodeName="";
                var domainPort=dData.domainPort,
                    domainName=Base64.decode(dData.name);
                _this.domainObj.port=domainPort;
                _this.domainObj.domainName=domainName;
                _this.getDomianstatus(snodeId,snodeName,domainName,domainPort);
                onoffbox=d3.select(".onoff-DomainBox");
                onoffbox.style("display","block");
                onoffbox.style("left",xVal-210+"px");
                onoffbox.style("top",yVal-290+"px");

                // console.log(yVal)
                // if(yVal>520 && yVal<=640){
                //   onoffbox.style("top","auto");
                //   onoffbox.style("bottom",90+"px");
                // }else{
                //   onoffbox.style("top",yVal+15+"px");
                //   onoffbox.style("bottom","auto");
                // }

              }else if(dData.hasOwnProperty("locationType")){
                if(dData.locationType=="suffixMatch"){//显示的时候去掉正则（三处显示要改）
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
                onoffbox.style("left",xVal-210+"px");
                onoffbox.style("top",yVal-290+"px");
              }else{
                if(Object.keys(dData).length==1){
                  const instructName=Base64.decode(dData.name);
                  _this.instructObj.name=instructName;
                  onoffbox=d3.select(".onoff-InstructBox");
                  onoffbox.style("display","block");
                  onoffbox.style("left",xVal-210+"px");
                  onoffbox.style("top",yVal-290+"px");
                }
              }

              //通过点击按钮关闭 domian 状态关闭浮框
              // d3.select(".closeDmOnoffBtn").on("click",()=>{
              //   d3.selectAll(".onoff-DomainBox").style("display","none");
              // });

            },1500);  
          })
          .on("mouseout",(d,i)=>{//鼠标移开
            clearTimeout(shadowStatusTimer);
            const dData=d.data;
            let onoffbox;
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
          });

        nodeEnter.append("circle")
          .attr('class', 'node')
          .attr("r", 6)
          .attr("fill", d => {
            return d._children?"#606266":"#fff"
          })
          // .attr("stroke-width", 10)
          .style("stroke",function(d){
            if(d.depth==1){//location被保护页面节点设置 
              var dtype=d.data.locationType;
              return dtype=='accurateMatch'? '#39a8ef':dtype=='suffixMatch'? '#34ab83':dtype=='pathMatch'? '#ffc700':dtype=='dynamicMatch'? '#800093':dtype=='customMatch'?'#d2620a':'#c6b38e'
            }else if(d.depth==0 && d.data.hasOwnProperty("streamPort")){
              return '#d2620a'
            }
          })

        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", function(d) {
            // console.log(d)
            // if(d.data.waf && d.data.waf=='on'){//waf状态开启时加盾牌小图标 文字间隔
            //   return d.children || d._children ? -20 : 20;
            // }else{
            //   return d.children || d._children ? -13 : 13;
            // }
            if(d.data.snodeId){
              return -13;
            }else{
              return d.children || d._children ? -13 : 13;
            }
          })
          .attr("text-anchor",  function(d) {
            if(d.data.snodeId){
              return "end";
            }else{
              return d.children || d._children ? "end" : "start";
            }
          })
          .text(d => {
            // return d.data.name
            const dData=d.data;
            if(dData.hasOwnProperty("snodeId")){
              let shadowNodeStr=dData.name;
              let sdNodeAbridgeStr='';//缩略
              if(dData.isShadowGroup){
                shadowNodeStr=dData.name+'('+_this.$t('lg.group')+')';
              }else{
                shadowNodeStr=dData.name;
              }
              if(shadowNodeStr.length>=13){
                sdNodeAbridgeStr=shadowNodeStr.slice(0,10)+'...'
              }else{
                sdNodeAbridgeStr=shadowNodeStr
              }
              return sdNodeAbridgeStr;
            }else if(dData.hasOwnProperty("domainPort")){
              const domainStr = Base64.decode(dData.name);
              let domainAbridgeStr='';//缩略
              if(domainStr.length>=30){
                domainAbridgeStr=domainStr.slice(0,27)+'...'
              }else{
                domainAbridgeStr=domainStr;
              }
              return domainAbridgeStr+":"+dData.domainPort;
            }else if(dData.hasOwnProperty("streamPort")){
              const stStr = Base64.decode(dData.name);
              let stAbridgeStr='';//缩略
              if(stStr.length>=30){
                stAbridgeStr=stStr.slice(0,27)+'...'
              }else{
                stAbridgeStr=stStr;
              }
              return stAbridgeStr;
            }else if(dData.hasOwnProperty("locationType")){
              if(dData.locationType=='suffixMatch'){//显示的时候去掉
                if(dData.name=="KC4qXC8pKyQ="){
                  return "/";
                }else{
                  const suffixMatchName = Base64.decode(dData.name);
                  const suffixMatchReg =/\((.*)\)/;
                  // console.log(suffixMatchReg.test(suffixMatchName))

                  const locationStr = suffixMatchReg.test(suffixMatchName)?suffixMatchName.match(suffixMatchReg)[1]:suffixMatchName;
                  let locationAbridgeStr='';//缩略
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
            }else if(Object.keys(dData).length==1){//最后
              const instructStr = Base64.decode(dData.name);
              let instructAbridgeStr='';//缩略长度
              if(instructStr.length>=40){
                instructAbridgeStr=instructStr.slice(0,37)+'...'
              }else{
                instructAbridgeStr=instructStr;
              }
              return instructAbridgeStr;
            }
          })
          .style('fill',function(d){//waf
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

      
        nodeUpdate.select('circle.node')
          .attr('r', 6)
          .style("fill", function(d) {
            return d._children ? "#606266" : "#fff";
          }).attr('cursor', 'pointer');

        // Transitionon.
        const nodeExit = node.exit().transition(transition)
          .duration(duration)
          .attr("transform", d => `translate(${source.y},${source.x})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0).remove();
        // nodeExit.select('circle').attr('r', 1e-6);
        // nodeExit.select('text').style('fill-opacity', 1e-6);

        // 
        const link = gLink.selectAll("path")
          .data(links, d => d.target.id);

        // Enter position.
        const linkEnter = link.enter().append("path")
          .attr("d", d => {
            // console.log(source)
            const o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
          });

        // Transitionposition.
        link.merge(linkEnter).transition(transition)
          .duration(duration)
          .attr("d", diagonal);

        // Transitionposition.
        link.exit().transition(transition)
          .duration(duration)
          .attr("d", d => {
            const o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
          })
          .remove();

        // Stash transition.
        root.eachBefore(d => {
          // console.log(d)
          d.x0 = d.x;
          d.y0 = d.y;
        });

      }
      update(root);
    },
    showDynamicChange(){ 
      if(!this.dynamicChangeShow){
        this.$refs.loading.showLoading();
        this.$refs.dynamicChange.getDynamicStatus().then((resolvedata)=>{
          this.treeSearchShow=false;
          this.dynamicChangeShow=true;
          this.$refs.loading.hideLoading();
        });
      }else{
        this.dynamicChangeShow=false;
      }     
    },
    showSearch(){
      this.dynamicChangeShow=false;
      this.treeSearchShow=!this.treeSearchShow;
    },
    getCrts(){//证书管理 查询crt文件
      var snodeId=this.shadowObj.snodeId;
      if(snodeId){
        var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/crt";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.crts=res.data.data;
            this.getPems();
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    getPems(){//证书管理 查询pem文件
      var snodeId=this.shadowObj.snodeId;
      if(snodeId){
        var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/pem";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.pems=res.data.data;
            this.diplomas = this.crts.concat(this.pems);//合并crt、pem证书传入shadowpop.vue
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    getKeys(){//证书管理 查询key文件
      var snodeId=this.shadowObj.snodeId;
      if(snodeId){
        var url=SERVER_API_URL+"pe/file/client/"+snodeId+"/key";
        axios.get(url).then((res)=>{
          // console.log(res.data.data)
          if(res.data.responseCode==0){
            this.keys=res.data.data;
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    getShadowstatus(sId){//业务节点状态 查询某个业务节点当前的运行状态和ip地址
     this.isShadowStatusLoading=true;
      var url=SERVER_API_URL+"pe/shadow/snode/"+sId;
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){ 
          var resObj = res.data.data;
          this.currentIsGroup=resObj.isShadowGroup;
          if(!this.currentIsGroup){       
            this.shadowStatusObj2.status=resObj.masterNode.status;
            this.shadowStatusObj2.ip=resObj.masterNode.ip;
            this.shadowStatusObj2.version=resObj.masterNode.version;
            this.shadowStatusObj= JSON.parse(JSON.stringify(resObj));
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.isShadowStatusLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    getDomianstatus(sId,sName,dName,port){//domain节点状态
      this.domainStatusData=[]; //清空
      this.svCkfailed = false;
      this.isSvCkLoading=true;
      var url=SERVER_API_URL+"pe/shadow/domain/server/status?snodeId="+sId+'&domainName='+dName+'&domainPort='+port;
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode == 0){
          const resArray = res.data.data.server;
          // const resArray=[{
          //       "index": 5,
          //       "upstream": "demo.test.cnagent.rmyy.wechat.uthealth.com.cn_8080",
          //       "name": "139.159.187.115:80",
          //       "status": "down",
          //       "rise": 0,
          //       "fall": 736604,
          //       "type": "http",
          //       "port": 0
          //     }]
          this.getUpstreamStatus(sName,dName,port).then((resolvedata)=>{
            let domainStatusArr=[];
            const upstreamArr = resolvedata;
            function getMixList(resArr, upstrArr) {
              resArr.forEach(item => {
                const index = upstrArr.findIndex(el => el.key === item.name);
                if(index > -1){
                  domainStatusArr.push({
                    "name": item.name,
                    "status": item.status,
                    "doc_count": upstrArr[index].doc_count
                  })
                }else{
                  domainStatusArr.push({
                    "name": item.name,
                    "status": item.status,
                    "doc_count":'--'
                  })
                }
              })
            }
            getMixList(resArray, upstreamArr)
            // console.log(domainStatusArr);
            this.domainStatusData = domainStatusArr;
          });
        }else{
          this.svCkfailed = true;
        }
        this.isSvCkLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    getUpstreamStatus(sName,dName,port){//获取 已处理请求数
      return new Promise((resolve,reject)=>{
        const _this=this;
        var sttime = _this.$store.state.mydatedata.starttime,
            edtime = _this.$store.state.mydatedata.endtime;
        var fromTime2 = toISO8601(sttime),
            endTime2 = toISO8601(edtime);
        var fromTime = fromTime2 || toISO8601(new Date(Date.now() - _this.$store.state.dateTimeLong)),
            endTime = endTime2 || toISO8601(new Date());

        let domainPortVal='';
        if(port=='80' || port=='443'){
          domainPortVal=dName;
        }else{
          domainPortVal=dName+':'+port;
        }
        // console.log(domainPortVal)

        client.search({
          index: "shadow-filebeat*",
          body: {
            "size": 0,
            "query": {
              "bool": {
                "filter":[
                  {
                    "range": {
                      "@timestamp": {
                        "from": fromTime,
                        "to": endTime,
                        "include_lower": true,
                        "include_upper": true
                      }
                    }
                  }
                ],
                "must": [
                  {
                    "terms": {
                      "host.name":[sName]
                    }
                  },
                  {
                    "term": {
                      "shadow.access.domain": domainPortVal
                    }
                  },{
                    "query_string": {
                      "query": "shadow.access.response_code:200"
                    }
                  },{
                    "query_string": {
                      "fields": ["shadow.access.upstream_ip"], 
                      "query": "-\\-"
                    }
                  }
                ]
              }
            },
            "aggs": {
              "GroupByUpstream": {
                "terms": {
                  "field": "shadow.access.upstream_ip",
                  "size": 500
                }
              }
            }
          }
        }).then(res => {
          // console.log(res);
          const resArray = res.aggregations.GroupByUpstream.buckets;
          // const resArray=[
          //         {
          //           "key": "139.159.187.115:80",
          //           "doc_count": 336
          //         },
          //         {
          //           "key": "192.168.2.79:80",
          //           "doc_count": 77
          //         },
          // ]
          resolve(resArray);
        });
      })
    },
    sdStart(){//开启shadow
      var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/start";
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    sdStop(){//关闭shadow
      var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/stop";
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    sdRestart(){//重启shadow
      var url=SERVER_API_URL+"pe/shadow/"+this.shadowObj.snodeId+"/restart";
      axios.post(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    sdReset(){//一键代理
      this.$confirm(this.$t('lg.resetshadowtips'), this.$t('lg.tips'), {
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        var url=SERVER_API_URL+"pe/shadow/reset/"+this.shadowObj.snodeId;
        axios.post(url).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
            this.dataRenderTree();
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        });
      }).catch((err) => {
        console.log(err)
      });
    },
    sdRecover(){//一键初始化
      this.$confirm(this.$t('lg.recovershadowtips'), this.$t('lg.tips'), {
        confirmButtonText: this.$t('lg.yes'),
        cancelButtonText: this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        var url=SERVER_API_URL+"pe/shadow/reset/default/"+this.shadowObj.snodeId;
        axios.post(url).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
            this.dataRenderTree();
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        });
      }).catch((err) => {
        console.log(err)
      });
    },
    sdWarningMode(){//shadow_warning_mode
      this.$refs.sd_warningMode.getSdWarningModeData().then((resolvedata)=>{//
        this.sdWarningModemodalShow=true; //打开弹框
      });
    },
    sdSeniorInstruct(){//shadow节点高级配置
      this.sdSeniorInstructmodalShow=true; //打开弹框
    },
    sdGlbInstruct(){//shadow节点全局自定义指令
      this.$refs.sd_glbInstruct.getSdGlbInstructData().then((resolvedata)=>{//
        this.sdGlbInstructmodalShow=true; //打开弹框
      });
    },
    sdCustomUpstream(){//自定义upstream配置
      this.$refs.sd_customUpstream.getSdCustUpstreamData().then((resolvedata)=>{//请求件里的方法
        this.sdCustomUpstreammodalShow=true; //打开弹框
      });
    },
    sdBatchInstruct(){//
    //  this.$refs.sd_batchInstruct.getSdBatchInstructData().then((resolvedata)=>{//
        this.sdBatchInstructmodalShow=true;//打开弹框
    //  });
    },
    sdPushModal(){//推送配置
      this.pushmodalShow=true;
      var url=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){
          this.shadownodes=res.data.data
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    sdCersModal(){//证书管理
      this.getCrts();
      this.getKeys();
      this.cersmodalShow=true;
    },
    sdSaveConf(){//保存配置
      this.saveconfmodalShow=true;
    },
    dmUpstreamlistModal(){
      this.$refs.dm_upstreamlist.getDmUpstreamlistData().then((resolvedata)=>{
        this.upstreamlistmodalShow=true; //打开弹框
      });
    },
    dmBlackshow(){
      this.$refs.dm_urlblacks.getUrlBlacks().then((resolvedata)=>{//
        this.urlblackmodalShow=true; //打开弹框
      });
    },
    stUpstreamlistModal(){
      this.$refs.st_upstreamlist.getDmUpstreamlistData().then((resolvedata)=>{//
        this.streamlistmodalShow=true; //打开弹框
      });
    },
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
          this.redirectmodalShow=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    setRedirectInput(v){
      // console.log(v);
      this.redirect302Url=v;
    },

    dmLimReq(){//shadow_limit_req指令
      this.$refs.dm_limitReq.getDmLimReqData().then((resolvedata)=>{//方法
        this.dmLimReqmodalShow=true; //打开弹框
      });
    },
    dmTransparentModal(){
      this.$refs.dm_transparent.getDmtransparentData().then((resoledata=>{
        this.dmtransparentShow=true;
      }))
    },
    dmKeepalivetModal(){
      this.$refs.dm_keepalive.getDmkeepaliveData().then((resoledata=>{
        this.dmkeepaliveShow=true;
      }))
    },
    dmGlbInstruct(){//domain全局自定义指令
      this.$refs.dm_glbInstruct.getDmGlbInstructData().then((resolvedata)=>{//
        this.dmGlbInstructmodalShow=true; //打开弹框
      });
    },
    dmTestModal(){
      this.getCrts();
      this.getKeys();
      var url=SERVER_API_URL+"/pe/shadow/domain";
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port
        }
      }).then((res)=>{
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
          this.dmTestmodalShow=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      
    },
    dmEditModal(){//编辑业务~查询业务的配置信息
      this.getCrts();
      this.getKeys();
      var url=SERVER_API_URL+"/pe/shadow/domain";
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port
        }
      }).then((res)=>{
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
    stEditModal(){//编辑业务~查询业务的配置信息
      var url=SERVER_API_URL+"/pe/shadow/stream";
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          streamName:this.domainObj.domainName
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          var thisdomainObj = res.data.data.streams;
          if(!thisdomainObj.streamPort){
            thisdomainObj.streamPort='';
          }
          this.stEditObj=thisdomainObj;
          this.stEditmodalShow=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    dmDelete(){//删除业务
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/domain";
      var domainName=_this.domainObj.domainName;
      _this.$confirm(_this.$t('lg.itdelete')+' '+domainName+', '+_this.$t('lg.continue'), _this.$t('lg.tips'), {
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
    stDelete(){//删除业务
      var _this=this;
      var url=SERVER_API_URL+"pe/shadow/stream";
      var domainName=_this.domainObj.domainName;
      _this.$confirm(_this.$t('lg.itdelete')+' '+domainName+', '+_this.$t('lg.continue'), _this.$t('lg.tips'), {
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        axios.delete(url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            streamName:domainName
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
      this.$refs.lc_protectInstruct.getLcProtectInstructData().then((resolvedata)=>{//
        this.lcprotectInstructmodalShow=true; //打开弹框
      });
    },
    lcSpecialProtectInstruct(){//特殊保护配置
      this.$refs.lc_specialProtectInstruct.getLcSpecialProtectInstructData().then((resolvedata)=>{//
        this.lcSpecialProtectInstructmodalShow=true; //打开弹框
      });
    },
    lcSkipInstruct(){//跳转配置
      this.$refs.lc_skipInstruct.getLcSkipInstructData().then((resolvedata)=>{
        this.lcSkipInstructmodalShow=true; //打开弹框
      });
    },
    lcSeniorInstruct(){//location高级配置（包含多种配置指令） 
      this.$refs.lc_seniorInstruct.getLocView().then((resolvedata)=>{
        this.lcSeniorInstructmodalShow=true;
      });
      
    },
    lcCustomInstruct(){//location自定义配置
      this.$refs.lc_customInstruct.getLcCustomInstructData().then((resolvedata)=>{//
        this.lcCustomInstructmodalShow=true; //打开弹框
      });
    },
   
    lcwafModal(){//waf查询
      var url=SERVER_API_URL+"pe/shadow/domain/location/waf";
      var domainO=this.domainObj,
          locationO=this.locationObj;    
      this.$refs.lcwaf2.getAttactypeData().then((resolvedata)=>{
         this.attactypeData=resolvedata;
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
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });        
      })

    },
    lcEditModal(){//编辑被保护对象
      this.lcEditmodalShow=true;
    },
    lcDelete(){//删除被保护的页面
      var _this=this;
      var domainO=_this.domainObj,
          locationO=_this.locationObj;
      _this.$confirm(_this.$t('lg.itdelete')+' '+locationO.nameTxt+','+_this.$t('lg.continue'), _this.$t('lg.tips'), {
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(() => {
        var url=SERVER_API_URL+"pe/shadow/domain/location";
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
    roDoclist(){//文件管理 查询conf文件
      var url=SERVER_API_URL+"pe/file/cm/conf/";
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          resArray.forEach(element=>{
            element.ischecked=false;
          })
          this.rootdoclistData=resArray;
          this.rootdoclistShow=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      var nodesurl=SERVER_API_URL+"pe/shadow/snode";//查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode==0){
          this.shadownodes=res.data.data;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    // roUploadFile(){
    //   this.rootuploadfileShow=true;
    // },
    roRules(){//Rules查看
      var url=SERVER_API_URL+"waf/rule";
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          var resArray=res.data.data;
          resArray.forEach(element=>{
            element.ischecked=false;
          })
          this.rootrulesData=resArray;
          this.rootrulesShow=true;
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    roAddRule(){//Rule增加 先获取新的WAF规则的sid

      this.$refs.roaddrule.getAttactypeData().then((resolvedata)=>{
        this.attactypeData=resolvedata;
        var url=SERVER_API_URL+"waf/rule/id/new";
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            this.rootruleSid=res.data.data.data;
            this.rootaddruleShow=true;
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      });

    },
    attactypeMsg(){
      this.$refs.attactypepop.getAttactypeData().then((resolvedata)=>{//
        this.attactypepopShow=true; //打开弹框
      });
    },
    roRulesets(){//RuleSets
      var _this=this;
      var url=SERVER_API_URL+"waf/ruleset";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          _this.rootRulesetsData=res.data.data;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
          console.log(err)
      });
      _this.rootrulesetsShow=true;
    },
    roShadowGroup(){//Shadow集群管理
      this.$refs.ro_shadowGroup.getSdGrpData().then((resolvedata)=>{//
        this.rootShadowGroupShow=true; //打开弹框
      });
    },
    dmtypedo2(str){
      if(!str){
        return "--"
      }else{
        if(str=="applet"){
          return this.$t('lg.wxdmlimitnum1')
        }else{
          return str
        }
      }
    }
  },
  beforeDestroy(){
    window.removeEventListener('resize',function(){});
  },
  filters:{
    base64Str(str){
      return Base64.decode(str)
    },
    arrayShow(arr){
      return arr.join("  |  ");
    },
    dmtypedo(str){
      if(!str){
        return "--"
      }else{
        if(str=="applet"){
          return "Wx"
        }else{
          return str
        }
      }
      
    },
  }
}
</script>
<style>
.configtree-wrapper{
	width:100%; 
	height:100%;
	position: relative;
  display: flex;
  flex-direction: column;
}
.shadowManageBox{
	width:100%; 
  border-bottom: 12px solid #f1f1f1;
}
.sdowMagContent{
  padding: 0px 15px 5px;
  box-sizing: border-box;
  position:relative;
}
.sdMagTitle{
  font-size: 14px;
  line-height: 40px;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 10px;
}
.sdMagTreeBox{
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px
}
.sdMag-tree-node{
  white-space: normal;
  word-break: break-all;
  line-height: 32px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.configtreeBox{
  width:100%; 
	position: relative;
  padding: 15px;
	padding-top: 50px;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  display: flex;
}
.configtreeBox-l{
  flex:0 0 200px;
  padding-right: 12px;
  overflow-y: auto;
}
.configtreeBox-r{
  flex:1;
  padding-left: 30px;
}
.nodetitlebox{
 word-break: break-word;
border-bottom: 1px solid #ccc;
padding-bottom: 4px;
margin-bottom: 6px; 
}
.nodetitle{
  font-size: 16px;
font-weight: 500;
color: #000;
margin-bottom: 4px;
}
.domainitem{ 
margin-bottom: 4px;
padding:8px 4px;
cursor:pointer;
display: block;
word-break: break-word;
width: 100%;
}
.domainitem:hover{
  background-color: #f6f6f6;
}
.domainitem.active{
  background-color: #f0f7ff;
}
.domainitem .remarkinfo{
  font-size: 12px;
  color:#888;
  padding-top: 2px;
}
.configtreeContent{
	width:100%;
  display: flex;
  align-items: center;
}
.configtreeContent > svg {
  display: block;
  margin: 0 auto;
  text-align: center;
}
.noConfigData-box{
	width: 100%;
  text-align:center;
  color:#888;
	position: absolute;
	top: 45%;
	left: 0;
}
.functionbtnBox{
	position: absolute;
	top: 10px;
	right: 20px;
}
.functionbtnBox button{
	font-size: 16px;
}
.functionbtnBox .dynamicBtn{
	font-size: 13px;
}
.cm-contextmenu, .onoff-box, .onoff-DomainBox, .onoff-LocationBox, .onoff-InstructBox{
  position: absolute;
  display: none;
}
.ctx-downmenu, .onoff-box, .onoff-DomainBox, .onoff-LocationBox, .onoff-InstructBox{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 140px;
}
.onoff-box, .onoff-DomainBox{
  width: auto;
  max-width: 200px;
  white-space:normal;
  word-break: break-all;
  line-height: 18px;
  z-index: 1000;
}
.onoff-LocationBox, .onoff-InstructBox, .onoff-InstructBox{
  width: auto;
  max-width: 520px;
  white-space:normal;
  word-break: break-all;
  line-height: 18px;
  z-index: 1000;
}

.ctx-downmenu .item{
  list-style: none;
  line-height: 14px;
  padding: 6px 15px;
  margin: 2px 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;
  display: block;
}
.ctx-downmenu .toHide{
  display: none;
}
.ctx-downmenu .item:hover{background-color: #ecf5ff;color: #66b1ff;}

/*hover Box status css*/
.shadowStatusList{
  padding: 8px 12px; 
  text-align: left;
  font-size: 12px;
}
.shadowStatusList li{
  line-height: 20px;
}
.sStatusTitle{
  font-size: 14px;
}
.marginTop{
  margin-top: 10px;
}
.backupNodeLi{
  padding-bottom: 3px;
  margin-bottom: 3px;
  border-bottom: 1px solid #eee;
}
.bitemti{font-size: 12px; color:#333;margin-top: 8px;}
.bitem{margin:5px 0; font-size: 12px; color:#666}
.domainStatusList{
  padding: 8px 12px; 
  text-align: left;
  font-size: 12px;
}
.domainStatusList li{
  line-height: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  margin-bottom:5px;
}
.domainStatusList li:nth-last-of-type(1){
  border: none;
  margin: 0;
  padding: 0;
}

.node {
  font: 12px sans-serif;
  fill: gray;
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
.stream4{display: inline-block;  font-size:12px; color:#888}
.groupli{margin:12px 0; border-bottom: 1px dashed #ccc; padding-bottom: 4px;}
.groupli .s1{margin-top:6px;}
.groupli:last-child{
  border: none;
}
.marginb8{margin-bottom: 8px;}
.sdmtype{ color: #9b9b9b;}
</style>