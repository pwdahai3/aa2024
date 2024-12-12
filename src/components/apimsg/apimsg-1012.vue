<template>
  <div class="quickconfig-wrapper">
    <el-form ref="queryPanelform" class="queryPanelBox" style="padding-bottom:16px" :model="queryPanelform" :rules="queryPanelformRules"  label-width="100px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" @visible-change="getShadowNodes()" style="width:100%">
            <template v-for="n in nodesdata">
              <el-option :label="n" :value="n"></el-option>
            </template>
          </el-select>
        </el-col>
        <el-col :span="10">
            <el-select  v-model="queryPanelform.checkDomain" :placeholder="$t('lg.selectdomain')" @visible-change="getDomains()" style="width:100%">
                <template v-for="item in getDms">
                  <el-option :key="item" :label="item" :value="item"></el-option>
                </template>
              </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getApiList">{{$t('lg.search')}}</el-button>
        </el-col>
      </el-row>
    </el-form>

  <div style="position:relative; width:100%">
    <div style="position:absolute;right:0; top:4px; z-index:100 ; display:flex" class="urlsearchbox">
      <el-input v-model.trim="urlsearch" placeholder="api查询"></el-input> &nbsp;&nbsp; <el-button type="primary" size="mini" @click="getApiList('1')">{{$t('lg.search')}}</el-button>
    </div>
    <el-tabs v-model="apitabactiveName" @tab-click="handleClick">
      <el-tab-pane :label="$t('lg.apilist')" name="first">
        <div v-if="apiHits.length==0">
        <p style="text-align:center; margin-top:20px; color:#888">{{$t('lg.nodata')}}</p>
        </div>
        <div v-else>
          <table class="table-container">
            <thead>
              <tr>
                <td>{{$t('lg.node')}}</td>
                <td>{{$t('lg.webiste')}}</td>
                <td>api</td>
                <!-- <td>上线/下线</td> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index) in apiHits" :key="index">
              <td>{{item._source && item._source.host && item._source.host.hostname}}</td>
              <td>
                {{item._source && item._source.shadow && item._source.shadow.access && item._source.shadow.access.domain}}
                <span style="display:none">{{item._source && item._source.shadow && item._source.shadow.access && item._source.shadow.access.server_port}}</span>
              </td>
              <td>
                <div class="attribox">
                  <div class="api">{{item._source && item._source.shadow && item._source.shadow.access && item._source.shadow.access.org_url}}</div>
                  <div class="attr"><a href="javascript:;" class="configa" @click="toggleA(item,index)">属性</a></div>
                </div>
              
              </td>
              <!-- <td width="60"><el-switch v-model="accessdenyform.accessdenyVal" @change="submitLcAccessdeny"></el-switch></td> -->
            </tr>
            </tbody>
          </table>
          <div class="pagecls">
            <a href="javascript:;" class="prevnext" :class="{ disable: prevDisable }" @click="prevPage">{{$t('lg.prevpage')}}</a><a href="javascript:;" class="prevnext" :class="{ disable: nextDisable }" @click="nextPage">{{$t('lg.nextpage')}}</a><span class="pagesp">{{$t('lg.currentpage')}}：{{page+1}}</span><span class="pagesp">{{$t('lg.totalpage2')}}：{{pageNum}}</span>
          </div>
        </div>        
      </el-tab-pane>
      <el-tab-pane :label="$t('lg.yipeizhiapilist')" name="second">
        
        <div v-if="configedApiHits.length==0">
        <p style="text-align:center; margin-top:20px; color:#888">{{$t('lg.nodata')}}</p>
        </div>
        <div v-else>
          <table class="table-container">
            <thead>
              <tr>
                <td>Id</td>
                <td>snodeId</td>
                <td>{{$t('lg.node')}}</td>
                <td>{{$t('lg.domain')}}</td>
                <td>{{$t('lg.port')}}</td>
                <td>{{$t('lg.path')}}</td>
                <td>{{$t('lg.editdata')}}</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item,index2) in configedApiHits" :key="index2">
                <td>{{item.id}}</td>
              <td>{{item.snodeId}}</td>
              <td>{{item.hostName}}</td>
              <td>{{item.domainName}}</td>
              <td>{{item.domainPort}}</td>
              <td>{{item.locationName}}</td>
              <td>{{item.modDate | toSdDate}}</td>
              <td align="center"><a href="javascript:;" class="deletea" @click="deleteIt(item)">{{$t('lg.delete')}}</a></td>
            </tr>
            </tbody>
          </table>
          <div class="pagecls">
            <a href="javascript:;" class="prevnext" :class="{ disable: configed_prevDisable }" @click="configed_prevPage">{{$t('lg.prevpage')}}</a><a href="javascript:;" class="prevnext" :class="{ disable: configed_nextDisable }" @click="configed_nextPage">{{$t('lg.nextpage')}}</a><span class="pagesp">{{$t('lg.currentpage')}}：{{configedPage+1}}</span><span class="pagesp">{{$t('lg.totalpage2')}}：{{configedPageNum}}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
<div style="margin-top:30px" v-if="isBeginSearch">
  <div>
    <el-row>
      <el-col :span="24">
        <div class="chart-content"
              v-loading="urlVisitCtLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)">
            <pienodata mystyle="linenodata" v-if="urlVisitCtBarNodata"></pienodata>
            <div id="apiMngChartid1"></div>
          </div>
      </el-col>
    </el-row>
  </div>
  <div style="margin-top:16px">
    <el-row>
      <el-col :span="12">
        <div class="chart-content" 
              v-loading="orgIpPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
        style="margin-right:8px;height:310px; box-sizing:border-box;">
          <!-- <h4 class="h4title">4xx数量</h4>  -->
            <div class="adaptive-circle" v-if="orgIpPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="orgIpPieContainer"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-content" style="margin-left:8px;height:310px;overflow:hidden; box-sizing:border-box">
          <!-- <h4 class="h4title">5xx数量</h4> 
          <div class="centercon">
            {{num5xx}}
          </div> -->
          <h4 class="h4title">upstream延迟统计(ms)</h4> 
          <div class="centercon2">
            <div v-if="upstreamyangchitongjiarr.length==0" class="nodata4">
            暂无数据
            </div> 
              <ul>
                <li v-for="item in upstreamyangchitongjiarr" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.avg_upstream_response_time.value | percentFormat2}}</span>
              </li>   
              </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>

  <div style="margin-top:16px">
    <el-row>
      <el-col :span="12">
        <div class="chart-content" style=" margin-right:8px">
          <h4 class="h4title">恶意IP访问排行</h4> 
          <div class="centercon2">
            <div v-if="nonormalIPRank.length==0" class="nodata4">
            暂无数据
          </div> 
            <ul>
              <li v-for="item in nonormalIPRank" class="flexli">
              <span class="flexlispan1">{{item.key}}</span>
              <span class="flexlispan2">{{item.doc_count}}</span>
            </li>   
            </ul>
          </div>
          </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-content" style="margin-left:8px;margin-right:8px;">
          <h4 class="h4title">正常IP访问排行</h4>
          <div class="centercon2">
            <div v-if="normalIPRank.length==0" class="nodata4" style="padding-top:20px">
              暂无数据
            </div> 
            <ul>
              <li v-for="item in normalIPRank" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.doc_count}}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- <div class="chart-content" style="margin-left:8px;margin-right:8px;">
          <h4 class="h4title">客户端延迟统计(ms)</h4>
          <div class="centercon2">
            <div v-if="yangchitongjiarr.length==0" class="nodata4">
              暂无数据
            </div> 
            <ul>
              <li v-for="item in yangchitongjiarr" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.avg_upstream_response_time.value | percentFormat2}}</span>
              </li>
            </ul>
          </div>
        </div> -->
      </el-col>
    </el-row>
  </div>

  <div style="margin:16px 0">
    <el-row>
      <el-col :span="24">
        <div class="chart-content" style="margin-left:8px;margin-right:8px;">
          <h4 class="h4title">API调用失败率</h4>
          <div class="centercon2">
            <div v-if="shibaidiaoyonglvarr.length==0" class="nodata4">
              暂无数据
            </div> 
            <ul>
              <li v-for="item in shibaidiaoyonglvarr" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.non_200_count.doc_count/item.total_count.value | percentFormat}}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>


</div>
    <el-dialog  :title="$t('lg.onelink')"  :visible.sync="oneLinkVisible"  width="40%"  :before-close="oneLinkClose">
      <el-form ref="shadownodesform2" :model="shadownodesform2" :label-width="$store.state.isencn=='en'?'140px':'110px'" :rules="shadownodesform2Rules">
        <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
          <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
            <template v-for="n in nodesdata2">
              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="oneLink">{{$t('lg.save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
<el-dialog width="65%" :title="$t('lg.shoudongdlsz')" :visible.sync="shadow_request_time_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
  <div class="seniorDctBox2">
    <el-form ref="requestTimeDctform" :model="requestTimeDctform" :rules="requestTimeDctformRules" :label-width="$store.state.isencn=='en'?'150px':'130px'">
        <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
          <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
            <template v-for="n in nodesdata2">
              <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="开启手动代理防御">
          <el-switch v-model="requestTimeSwitch" @change="switchEvent(requestTimeSwitch,'shadow_request_time','手动代理防御')"></el-switch>
        </el-form-item> -->
        <el-form-item :label="$t('lg.canssz')" prop="requestTimeVal">
                <el-input v-model.trim="requestTimeDctform.requestTimeVal"></el-input>
              </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="editDctEnsure('requestTimeDctform')" v-if="directiveData.length>0">{{$t('lg.edit')}}</el-button> -->
          <el-button type="primary" @click="validSubmitDirective('requestTimeDctform','shadow_request_time')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
            </div> 
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="65%" :title="$t('lg.browserParams')" :visible.sync="shadow_verify_browser_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
  <div class="seniorDctBox2">
              <el-form ref="verifyBrowserDctform" :model="verifyBrowserDctform" :rules="verifyBrowserDctformRules" :label-width="$store.state.isencn=='en'?'140px':'110px'">
                <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="block">
                    <div class="tit">{{$t('lg.canshuzhib')}}</div>
                    <div class="sli">
                      <el-slider v-model="verifyBrowserDctform.verifyBrowserVal" :max="7" show-stops show-tooltip></el-slider>
                    </div>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="for_submit_submit2('verifyBrowserDctform','shadow_verify_browser')">{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="65%" :title="$t('lg.userBhIndct')" :visible.sync="shadow_verify_agent_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
<div class="seniorDctBox2">
              <el-form ref="verifyAgentDctform" :model="verifyAgentDctform" :rules="verifyAgentDctformRules" :label-width="$store.state.isencn=='en'?'140px':'110px'">
               <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 190px':'0 0 110px')}">{{$t('lg.xingweizb')}}</div>
                      <div class="sli">
                        <el-slider v-model="verifyAgentDctform.verifyAgentVal" :max="3" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                <el-form-item>
                  <el-button type="primary" @click="for_submit_submit2('verifyAgentDctform','shadow_verify_agent')">{{$t('lg.save')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>

<el-dialog width="65%" :title="$t('lg.yonghuxwlj')" :visible.sync="userbehaviorintercept_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
   <div class="seniorDctBox2">
              <el-form ref="requestreturnform" :model="requestreturnform" :rules="requestreturnformRules" :label-width="$store.state.isencn=='en'?'170px':'130px'">
                <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="开启行为拦截功能">
                  <el-switch v-model="requestreturnSwitch" @change="switchEvent(requestreturnSwitch,'shadow_request_return','开启行为拦截功能')"></el-switch>
                </el-form-item> -->
                <div class="orderBoxJamb">
                      <el-form-item :label="$t('lg.shubiaodjcs')" prop="clicktimes">
                        <el-input v-model.trim="requestreturnform.clicktimes"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('lg.shubiaoydcs')" prop="movetimes">
                        <el-input v-model.trim="requestreturnform.movetimes"></el-input>
                      </el-form-item>
                      <el-form-item :label="$t('lg.jianpsrcs')" prop="presstimes">
                        <el-input v-model.trim="requestreturnform.presstimes"></el-input>
                      </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="returnSubmit('requestreturnform')">{{$t('lg.save')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="65%" :title="$t('lg.jstrong')" :visible.sync="jsinsert_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
<div class="seniorDctBox2">
              <el-form ref="insertJsDctform" :model="insertJsDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
                <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('lg.jstrong')" prop="insertJsType">
                  <el-radio v-model="insertJsDctform.insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="insertJsDctform.insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="insertJsDctform.insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="js_submit('insertJsDctform','shadow_insert_js_ex')">{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.dongtaizwgn')" :visible.sync="verifyTokenVal_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="verifyTokenDctform" :model="verifyTokenDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="verifyTokenDctform.verifyTokenVal"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDirective('verifyTokenDctform','shadow_verify_token')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.bodyenfun')" :visible.sync="encryptKeySwitch_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="encryptKeyDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="encryptKeySwitch"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDirective('encryptKeyDctform','shadow_encrypt_key')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.cookiefcfhgn')" :visible.sync="verifyCookieMd5Val_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="verifyCookieMd5Dctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="verifyCookieMd5Dctform.verifyCookieMd5Val"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDirective('verifyCookieMd5Dctform','shadow_verify_cookie_md5')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.jujuetouyugn')" :visible.sync="setRejectHeaderVal_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="setRejectHeaderDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="setRejectHeaderDctform.setRejectHeaderVal"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitDirective('setRejectHeaderDctform','shadow_set_reject_header')">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.jujuefw')" :visible.sync="accessdenyVal_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="accessdenyform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="accessdenyform.accessdenyVal"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcAccessdeny">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.saomiaofygn')" :visible.sync="botconfVal_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="botconfDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="botconfDctform.botconfVal"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcBotconf">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.cansjmqzyz')" :visible.sync="paramverify_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="botconfDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="paramverifyform.paramverify"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcParamverify">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="40%" :title="$t('lg.shadowcookieyz')" :visible.sync="defenseCookieVal_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
    <el-form ref="defenseCookieDctform" :label-width="$store.state.isencn=='en'?'140px':'110px'">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
                  <el-select v-model="shadownodesform2.shadownodes" :placeholder="$t('lg.select')" style="width:100%">
                    <template v-for="n in nodesdata2">
                      <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
        <el-form-item :label="$t('lg.kaiqi')">
          <el-switch v-model="defenseCookieDctform.defenseCookieVal"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcDefenseCookie2">{{$t('lg.yes')}}</el-button>
        </el-form-item>
    </el-form>
  <loading v-show="addDctLoading"></loading>
</el-dialog>

<el-dialog width="600px" :title="apimngpopCurtitle" :visible.sync="apimngpop_show" :close-on-click-modal="false" :before-close="apimngpop_showClose">
  <div class="apimngpopbox">
    <div class="box1">访问量：</div>
    <div class="box2">{{fangwenliang}}</div>
  </div>
  <div class="apimngpopbox">
    <div class="box1">恶意访问量：</div>
    <div class="box2">{{eryifangwenliang}}</div>
  </div>
  <div class="apimngpopbox">
    <div class="box1">客户端平均响应时间：</div>
    <div class="box2">{{pingjunxianyinsj}}</div>
  </div>
  <div class="apimngpopbox">
    <div class="box1">upstream平均响应时间：</div>
    <div class="box2">{{upstreampigjxiangyinsj | percentFormat2}}</div>
  </div>
  <div class="apimngpopbox">
    <div class="box1">错误码统计：</div>
    <div class="box2"><b>2xx</b>:{{cuowu2xx}} &nbsp;&nbsp;|&nbsp;&nbsp; <b>4xx</b>:{{cuowu4xx}} &nbsp;&nbsp;|&nbsp;&nbsp; <b>5xx</b>:{{cuowu5xx}} </div>
  </div>
  <div class="apimngpopbox">
    <div class="box1">失败率(非200的占用率)：</div>
    <div class="box2">{{shibailval | percentFormat}}</div>
  </div>
</el-dialog>


<el-dialog width="900px" :title="curAttrpopItemTit" :visible.sync="attrpop_show" :close-on-click-modal="false" :before-close="attrpop_showClose">
  <div class="attrpopbox">
    <div class="attrpopbox">
      <div class="apimngpopbox">
        <div class="box1">访问量：</div>
        <div class="box2">{{fangwenliang}}</div>
      </div>
      <div class="apimngpopbox">
        <div class="box1">恶意访问量：</div>
        <div class="box2">{{eryifangwenliang}}</div>
      </div>
      <div class="apimngpopbox">
        <div class="box1">错误码统计：</div>
        <div class="box2"><b>4xx</b>: {{cuowu4xx}} &nbsp;&nbsp;|&nbsp;&nbsp; <b>5xx</b>: {{cuowu5xx}} </div>
      </div>
      <!-- <div>
        <div class="chart-content" 
              v-loading="orgIpPieLoading"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0)"
        style="margin-right:8px;height:310px; box-sizing:border-box;">
            <div class="adaptive-circle" v-if="orgIpPieNodata">
              <div class="layout middle">
                <div>
                  <p>{{$t('lg.nodata')}}</p>
                </div>
              </div>
            </div>
            <div id="orgIpPieContainer2"></div>
        </div>
      </div> -->
      <div style="margin-bottom:22px">
          <p>恶意IP访问排行：</p> 
          <div style="border:1px solid #ddd; margin:10px 0; padding:10px">
            <div v-if="nonormalIPRank2.length==0" style="text-align:center;font-size:12px; color:#777">暂无数据</div> 
            <ul>
              <li v-for="item in nonormalIPRank2" class="flexli">
              <span class="flexlispan1">{{item.key}}</span>
              <span class="flexlispan2">{{item.doc_count}}</span>
            </li>   
            </ul>
          </div>
      </div>
      <div style="margin-bottom:22px">
          <p>访问的总ip排行：</p> 
          <div style="border:1px solid #ddd; margin:10px 0; padding:10px">
            <div v-if="zongIPRank.length==0" style="text-align:center;font-size:12px; color:#777">暂无数据</div> 
            <ul>
              <li v-for="item in zongIPRank" class="flexli">
              <span class="flexlispan1">{{item.key}}</span>
              <span class="flexlispan2">{{item.doc_count}}</span>
            </li>   
            </ul>
          </div>
      </div>
      <div style="margin-bottom:22px">
        <p>upstream延迟统计(ms)：</p> 
          <div style="border:1px solid #ddd; margin:10px 0; padding:10px">
            <div v-if="upstreamyangchitongjiarr2.length==0"  style="text-align:center;font-size:12px; color:#777">
            暂无数据
            </div> 
              <ul>
                <li v-for="item in upstreamyangchitongjiarr2" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.avg_upstream_response_time.value | percentFormat2}}</span>
              </li>   
              </ul>
          </div>
      </div>
      <div>
        <p>API调用失败率：</p>
          <div  style="border:1px solid #ddd; margin:10px 0; padding:10px">
            <div v-if="shibaidiaoyonglvarr2.length==0" style="text-align:center;font-size:12px; color:#777">
              暂无数据
            </div> 
            <ul>
              <li v-for="item in shibaidiaoyonglvarr2" class="flexli">
                <span class="flexlispan1">{{item.key}}</span>
                <span class="flexlispan2">{{item.non_200_count.doc_count/item.total_count.value | percentFormat}}</span>
              </li>
            </ul>
          </div>
      </div>
    </div>
    <ul class="aul">
      <a href="javascript:;" class="configlia" @click="oneLinkShow()">{{$t('lg.onelink')}}</a>
      <a href="javascript:;" class="configlia" @click="shadow_request_time_shownew()">{{$t('lg.shoudongdlsz')}}</a>
      <a href="javascript:;" class="configlia" @click="shadow_verify_browser_shownew()">{{$t('lg.browserParams')}}</a>
      <a href="javascript:;" class="configlia" @click="shadow_verify_agent_shownew()">{{$t('lg.userBhIndct')}}</a>
      <a href="javascript:;" class="configlia" @click="userbehaviorintercept_shownew()">{{$t('lg.yonghuxwlj')}}</a>
      <a href="javascript:;" class="configlia" @click="jsinsert_shownew()">{{$t('lg.jstrong')}}</a>
      <a href="javascript:;" class="configlia" @click="verifyTokenVal_shownew()">{{$t('lg.dongtaizwgn')}}</a>
      <a href="javascript:;" class="configlia" @click="encryptKeySwitch_shownew()">{{$t('lg.bodyenfun')}}</a>
      <a href="javascript:;" class="configlia" @click="verifyCookieMd5Val_shownew()">{{$t('lg.cookiefcfhgn')}}</a>
      <a href="javascript:;" class="configlia" @click="setRejectHeaderVal_shownew()">{{$t('lg.jujuetouyugn')}}</a>
      <a href="javascript:;" class="configlia" @click="accessdenyVal_shownew()">{{$t('lg.xiaxiang')}}</a>
      <a href="javascript:;" class="configlia" @click="botconfVal_shownew()">{{$t('lg.saomiaofygn')}}</a>
      <a href="javascript:;" class="configlia" @click="paramverify_shownew()">{{$t('lg.cansjmqzyz')}}</a>
      <a href="javascript:;" class="configlia" @click="defenseCookieVal_shownew()">{{$t('lg.shadowcookieyz')}}</a>
    </ul>
  </div>
</el-dialog>
    <loading ref="loading"></loading>
</div>
</template>
<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
import client from "@/components/es/connection";
let Base64 = require('js-base64').Base64;
import toISO8601 from "@/assets/js/iso8601";
import pienodata from '@/basecomponents/pienodata';
import echarts from 'echarts';
export default {
  components:{
    loading,
    echarts,
    pienodata
  },
  data(){
    return{
      curAttrpopItemTit:'',
      curAttrpopItem:'',
      rspage:true,
      isApisearchClick:false,
      orgIpPieLoading:false,
      orgIpPieNodata:false,
      urlsearch:'',
      shibaidiaoyonglvarr:[],
      shibaidiaoyonglvarr2:[],
      yangchitongjiarr:[],
      upstreamyangchitongjiarr:[],
      upstreamyangchitongjiarr2:[],
      fangwenliang:'',
      eryifangwenliang:'',
      pingjunxianyinsj:'',
      upstreampigjxiangyinsj:'',
      cuowumatongji:'',
      cuowu2xx:'',
      cuowu4xx:'',
      cuowu5xx:'',
      cuowu2xx2:'',
      cuowu4xx2:'',
      cuowu5xx2:'',
      shibailval:'',
      apimngpopCurtitle:'',
      apimngpop_show:false,
      attrpop_show:false,
      normalIPRank:[],
      nonormalIPRank:[],
      nonormalIPRank2:[],
      zongIPRank:[],
      isBeginSearch:false,
      num4xx:0,
      num5xx:0,
      apiMngChart1:null,
      urlVisitCtBarNodata:false,
      urlVisitCtLoading:false,
      apichart1:null,
      isencn:'cn',
      fromTime:0,
      endTime:0,
      timeinterval:'',
      ecBar1Chart:null,
      defenseCookieVal_show:false,
      paramverify_show:false,
      botconfVal_show:false,
      accessdenyVal_show:false,
      setRejectHeaderVal_show:false,
      verifyCookieMd5Val_show:false,
      encryptKeySwitch_show:false,
      verifyTokenVal_show:false,
      shadow_request_time_show:false,
      shadow_verify_browser_show:false,
      shadow_verify_agent_show:false,
      userbehaviorintercept_show:false,
      proxypass_show:false,
      jsinsert_show:false,
      activeName:'0',
      url:'',//请求路径 (统一的location配置接口)
      getDirectiveLoading:false,
      directiveData:[],
      //增加 特殊文件类型、header补全、header修改
      addDct_1_DialogVisible:false,
      addDct_1_DialogVisiblenew:false,
      directive_1_lab:'',
      directive_1_options:[],

      directive_1_form:{
        directive_1_type:'',
        directive_1_val:''
      },
      directive_1_formRules:{
        directive_1_val:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg3'), trigger: 'change'},
        ]
      },
      directive_1_List:[],
      addDctLoading:false,

      //编辑 特殊文件类型、header补全、header修改
      editDct_1_DialogVisible:false,
      editDirective_1_form:{
        directive_1_type:'',
        directive_1_val:''
      },
      editDirective_1_formRules:{
        directive_1_val:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg3'), trigger: 'change'},
        ]
      },
      editDirective_1_Orgin:{//编辑临时容器,存储被编辑的当前项
        directive_1_type:'',
        directive_1_val:''
      },
      editDctLoading:false,

      //手动代理防御设置
      requestTimeSwitch:false,
      requestTimeDctform:{
        requestTimeVal:null
      },
      requestreturnform:{
        clicktimes:'',
        movetimes:'',
        presstimes:''
      },
      requestreturnSwitch:false,
      requestTimeUnit:'s',
      timeUnitOpt:[{
        label:'秒',
        value:'s'
      }],
      requestTimeDctformRules:{
        requestTimeVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      requestreturnformRules:{
        clicktimes:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        movetimes:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        presstimes:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
      },
      //浏览器参数指标
      verifyBrowserSwitch:false,
      verifyBrowserDctform:{
        verifyBrowserVal:0
      },
      verifyBrowserDctformRules:{
        verifyBrowserVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },

      //用户行为指标
      verifyAgentSwitch:false,
      verifyAgentDctform:{
        verifyAgentVal:0
      },
      verifyAgentDctformRules:{
        verifyAgentVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      verifyTokenDctform:{
        verifyTokenVal:false
      },
      encryptKeySwitch:false,
      encryptKeyDctform:{
        encryptKeyVal:'shadowanruiform'//先写死
      },
      encryptKeyDctformRules:{
        encryptKeyVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      //Cookie 篡改防护功能
      verifyCookieMd5Dctform:{
        verifyCookieMd5Val:false
      },
      //拒绝头域名功能 
      setRejectHeaderDctform:{
        setRejectHeaderVal:false
      },
      insertJsDctform:{
        insertJsType:'3'
      },
      mustHaveCookieDctform:{
        mustHaveCookieVal:false
      },
      botconfUrl:'', //webSocket单独接口
      botconfDctform:{
        botconfVal:false,
      },
      //Shadow cookie功能
      defenseCookieFlag:false,
      defenseCookieDctform:{
        defenseCookieVal:false,
      },
      //webSocket支持
      webSocketUrl:'', //webSocket单独接口
      webSocketDctform:{
        webSocketVal:false,
      },
      accessdenyform:{
        accessdenyVal:false
      },
      paramverifyform:{
        paramverify:false
      },
      //proxyPass功能
      proxyPassUrl:'', //proxyPass单独接口
      proxyPassSwitch:false,
      proxyPassDctform:{
        proxyHttp:'http',
        proxyPass:'',
        proxyUpstream:'',
      },  
      upstreamOptArr:[],
      getUpstreamLoading:false,
      //网站目录
      rootUrl:'', //root单独接口
      lcRootData:{},
      isShowRootDialog:false,
      rootDctform:{
        rootVal:'',
      },
      rootDctformRules:{
        rootVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },
      rootAddEditLoading:false,/////from loc end
      apitabactiveName:'first',
      curOneLinkItem:{
        snodeId:'',
        domainName:'',
        domainPort:'',
        locationName:'',
        hostName:''
      },
      oneLinkVisible:false,
      aMenu:-1,
      activeA:false,
      nodesdata:[],
      nodesdata2:[],
      getDms:[],
      apiHits:[],
      configedApiHits:[],
      totalHits:0,
      page:0,
      pageSize:15,
      pageNum:0,
      configedPage:0,
      configedPageSize:15,
      configedPageNum:0,
     // prevDisable:false,
    //  nextDisable:false,
    shadownodesform2:{ 
        shadownodes:''
      },
      shadownodesform:{ 
        shadownodes:'',
        remark:''
      },
      shadownodesform2Rules:{
        shadownodes:[{ required: true, message: this.$t('lg.required'), trigger: 'change' }]
      },
       queryPanelform:{
        checkDomain:'',
        port:'',
        value4: [new Date().getTime()-3600 * 1000 * 24*30,new Date()]
      },
      queryPanelformRules:{
        checkDomain:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
        ]
      },
    }
  },
  created(){
    if(localStorage.lang=="en"){
      this.isencn="en";
    }else{
      this.isencn="cn";
    }
  },
  mounted(){
    // this.handleTime();
    // this.ecBar1()
    this.getApiList();
  },
  computed: {
    prevDisable() {
      return this.page==0;
    },
    nextDisable() {
      return this.page==(this.pageNum-1);
    },
    configed_prevDisable() {
      return this.configedPage==0;
    },
    configed_nextDisable() {
      return this.configedPage==(this.configedPageNum-1);
    }
  },
  watch:{
    '$store.state.mydatedata.timestampnow':function(){
     // this.handleTime();
    //  this.ecBar1();
    if(this.isApisearchClick){
      this.getApiList('1');
    }else{
      this.getApiList();
    }
    },
    '$store.state.isMenuShow':function(){
     // this.ecBar1Chart.resize();
    }
  },
  methods:{
    drawOrgIpPie(){
      const _this=this;
      _this.orgIpPieLoading=true;
      _this.orgIpPieChart = echarts.init(document.getElementById('orgIpPieContainer'));
      var options={
          color:['#516b91','#59c4e6','#edafda','#93b7e3','#a5e7f0','#4ea397','#22c3aa','#7bd9a5','#d0648a','#f58db2'],
          title : {
            text: '响应码统计',
            x:'center',
            textStyle: {
              fontSize: '16',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          toolbox: {
            right:'10',
            top:'10',
            feature: {
              myTool1: {
                show: true,
                title: this.$t('lg.agentip'),
                icon: 'image://static/icon/switch.png',
                onclick: function (){
                  getOrgIpPieData(_this.isPieOrg)
                  // console.log(_this.isPieOrg)
                }
              }
            }
          },
          series: [
            {
              name:this.$t('lg.accesssource')+'：',
              type:'pie',
              radius:['25%','35%'],
              // radius: '40%',
              // center: ['50%', '50%'],
              data:[
                // {value:335, name:'直接访问'},
                // {value:310, name:'邮件营销'},
              ].sort(function (a, b) { return a.value - b.value; }),
              // roseType: 'radius',//area radius
              label: {
                position:'outside',
                normal: {
                  textStyle: {
                    fontSize: '12',  
                  },
                  formatter: "{b}: {c}"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '14',
                    fontWeight: 'normal',
                  },
                }
              },
              labelLine: {
                normal: {
                  smooth: 0,
                  length: 10,
                  length2: 20,
                },
              },
              animationType: 'scale',
              animationEasing: 'elasticOut',
              animationDelay: function (idx) {
                return Math.random() * 200;
              }
            }
          ],
        };
      function getOrgIpPieData(type){// 绘制图表
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=_this.queryPanelform.checkDomain || "*";
      let esnodes=_this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body: {
              "size": 0,
              "aggs": {
                "response_code_buckets": {
                  "filters": {
                    "filters": {
                      "2xx": {
                        "regexp": {
                          "shadow.access.response_code": "2[0-9]{2}"
                        }
                      },
                      "4xx": {
                        "regexp": {
                          "shadow.access.response_code": "4[0-9]{2}"
                        }
                      },
                      "5xx": {
                        "regexp": {
                          "shadow.access.response_code": "5[0-9]{2}"
                        }
                      }
                    }
                  }
                }
              },
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                      {
                      "wildcard": {
                        "host.name": esnodes
                      }
                    },
                    // {
                    //   "wildcard": {
                    //     "shadow.access.org_url": url
                    //   }
                    // },
                    {
                      "wildcard": {
                        "shadow.access.http_host": esDm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                        "lte": _this.endTime
                        }
                      }
                    }
                  ]
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            let result=[]
            if(res.aggregations && res.aggregations.response_code_buckets && res.aggregations.response_code_buckets.buckets){
              let resaggbuck=res.aggregations.response_code_buckets.buckets;
              _this.cuowu2xx=resaggbuck["2xx"].doc_count || 0;
              _this.cuowu4xx=resaggbuck["4xx"].doc_count || 0;
              _this.cuowu5xx=resaggbuck["5xx"].doc_count || 0;
            }
            result=[
              {
                name:"2xx",
                value:_this.cuowu2xx
              },
              {
                name:"4xx",
                value:_this.cuowu4xx
              },
              {
                name:"5xx",
                value:_this.cuowu5xx
              }
            ];
            options.series[0].data=result;
            // options.legend.data=legendRlt;
            if(result.length==0){
              _this.orgIpPieNodata=true;
            }else{
              _this.orgIpPieNodata=false;
            }
            _this.orgIpPieLoading=false;
            _this.orgIpPieChart.setOption(options,true);
          });



      }
      getOrgIpPieData(); 
    },
    apimngpop_showClose(){
      this.apimngpop_show=false;
      this.fangwenliang='';
      this.eryifangwenliang='';
      this.pingjunxianyinsj='';
      this.upstreampigjxiangyinsj='';
      this.cuowu2xx='';
      this.cuowu4xx='';
      this.cuowu5xx='';
      this.shibailval='';
    },
    attrpop_showClose(){
      this.attrpop_show=false;
      this.shibaidiaoyonglvarr2=[];
      this.upstreamyangchitongjiarr2=[];
      this.nonormalIPRank2=[];
      this.zongIPRank=[];
      this.cuowu2xx2='';
      this.cuowu4xx2='';
      this.cuowu5xx2='';
    },
    shibaidiaoyonglv(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    { "term": { "log.file.path": "/usr/local/shadow/logs/access.log" }},
                   // { "wildcard": { "shadow.access.org_url": "/getusers" }},
                    { "wildcard": { "host.name": esnodes }},
                    { "wildcard": { "shadow.access.http_host": esDm }},
                    { 
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                          //"format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "org_url_buckets": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 10  // 根据需要调整返回的桶数
                  },
                  "aggs": {
                    "total_count": {
                      "value_count": {
                        "field": "shadow.access.response_code"
                      }
                    },
                    "non_200_count": {
                      "filter": {
                        "bool": {
                          "must_not": {
                            "regexp": {
                              "shadow.access.response_code": "2[0-9]{2}"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.org_url_buckets && res.aggregations.org_url_buckets.buckets){
              this.shibaidiaoyonglvarr=res.aggregations.org_url_buckets.buckets || [];
             };
          })
    },
    shibaidiaoyonglv2(item){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    { "term": { "log.file.path": "/usr/local/shadow/logs/access.log" }},
                   // { "wildcard": { "shadow.access.org_url": "/getusers" }},
                    {
                      "term": {
                        "shadow.access.org_url": item
                      }
                    },
                    { "wildcard": { "host.name": esnodes }},
                    { "wildcard": { "shadow.access.http_host": esDm }},
                    { 
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                          //"format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "org_url_buckets": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 10  // 根据需要调整返回的桶数
                  },
                  "aggs": {
                    "total_count": {
                      "value_count": {
                        "field": "shadow.access.response_code"
                      }
                    },
                    "non_200_count": {
                      "filter": {
                        "bool": {
                          "must_not": {
                            "regexp": {
                              "shadow.access.response_code": "2[0-9]{2}"
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.org_url_buckets && res.aggregations.org_url_buckets.buckets){
              this.shibaidiaoyonglvarr2=res.aggregations.org_url_buckets.buckets || [];
             };
          })
    },
    upstreamyanchitongji(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    {
                      "wildcard": {
                        "host.name": esnodes
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": esDm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "org_url_avg_response": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 6,  // 根据需要调整返回的桶数
                    "order": {
                      "avg_upstream_response_time": "desc"  // 按平均响应时间降序排序
                    }
                  },
                  "aggs": {
                    "avg_upstream_response_time": {
                      "avg": {
                        "field": "shadow.access.upstream_response_time"
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.org_url_avg_response && res.aggregations.org_url_avg_response.buckets){
              this.upstreamyangchitongjiarr=res.aggregations.org_url_avg_response.buckets || [];
             };
          })
    },
    upstreamyanchitongji2(item){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    {
                      "wildcard": {
                        "host.name": esnodes
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": esDm
                      }
                    },
                    {
                      "term": {
                        "shadow.access.org_url": item
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "org_url_avg_response": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 6,  // 根据需要调整返回的桶数
                    "order": {
                      "avg_upstream_response_time": "desc"  // 按平均响应时间降序排序
                    }
                  },
                  "aggs": {
                    "avg_upstream_response_time": {
                      "avg": {
                        "field": "shadow.access.upstream_response_time"
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.org_url_avg_response && res.aggregations.org_url_avg_response.buckets){
              this.upstreamyangchitongjiarr2=res.aggregations.org_url_avg_response.buckets || [];
             };
          })
    },
    yanchitongji(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    {
                      "wildcard": {
                        "host.name": esnodes
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": esDm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "org_url_avg_response": {
                  "terms": {
                    "field": "shadow.access.org_url",
                    "size": 10,  // 根据需要调整返回的桶数
                    "order": {
                      "avg_upstream_response_time": "desc"  // 按平均响应时间降序排序
                    }
                  },
                  "aggs": {
                    "avg_upstream_response_time": {
                      "avg": {
                        "field": "shadow.access.request_time"
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
          //  console.log(res)
             if(res.aggregations.org_url_avg_response && res.aggregations.org_url_avg_response.buckets){
              this.yangchitongjiarr=res.aggregations.org_url_avg_response.buckets || [];
             };
          })
    },
    fangwenzongliang(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-*",
            body: {
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      {
                      "wildcard": {
                        "host.name": nd
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.org_url": url
                      }
                    },
                      {
                      "wildcard": {
                        "shadow.access.http_host": dm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "size": 0,
              "aggs": {
                "total_count": {
                  "value_count": {
                    "field": "_index"
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            if(res.aggregations && res.aggregations.total_count){
              this.fangwenliang=res.aggregations.total_count.value;
            }
          });
    },
    eyifangwenliang(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-warn*",
            body: {
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      {
                      "wildcard": {
                        "host.name": nd
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.org_url": url
                      }
                    },
                      {
                      "wildcard": {
                        "shadow.access.http_host": dm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "size": 0,
              "aggs": {
                "total_count": {
                  "value_count": {
                    "field": "_index"
                  }
                }
              }
            }
          }).then((res)=>{
         // console.log(res);
            if(res.aggregations && res.aggregations.total_count){
              this.eryifangwenliang=res.aggregations.total_count.value;
            }
          });
    },
    pingjunxiangyisj(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-*",
            body: {
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      {
                      "wildcard": {
                        "host.name": nd
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.org_url": url
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": dm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "avg_request_time": {
                  "avg": {
                    "field": "shadow.access.request_time"
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            if(res.aggregations && res.aggregations.avg_request_time){
              this.pingjunxianyinsj=res.aggregations.avg_request_time.value || "--";
            }
          });
    },
    upstreamxiangyinsj(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-*",
            body: {
              "size": 0,
              "aggs": {
                "avg_upstream_response_time": {
                  "avg": {
                    "field": "shadow.access.upstream_response_time"
                  }
                }
              },
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      {
                      "wildcard": {
                        "host.name": nd
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.org_url": url
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": dm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": _this.fromTime,
                          "lte": _this.endTime,
                         // "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            if(res.aggregations && res.aggregations.avg_upstream_response_time){
              this.upstreampigjxiangyinsj=res.aggregations.avg_upstream_response_time.value || "--";
            }
          });
    },
    cuowudaima(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-*",
            body: {
              "size": 0,
              "aggs": {
                "response_code_buckets": {
                  "filters": {
                    "filters": {
                      "2xx": {
                        "regexp": {
                          "shadow.access.response_code": "2[0-9]{2}"
                        }
                      },
                      "4xx": {
                        "regexp": {
                          "shadow.access.response_code": "4[0-9]{2}"
                        }
                      },
                      "5xx": {
                        "regexp": {
                          "shadow.access.response_code": "5[0-9]{2}"
                        }
                      }
                    }
                  }
                }
              },
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      {
                      "wildcard": {
                        "host.name": nd
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.org_url": url
                      }
                    },
                    {
                      "wildcard": {
                        "shadow.access.http_host": dm
                      }
                    },
                    {
                      "range": {
                        "@timestamp": {
                          "gte": "2024-09-01T00:00:00",
                          "lte": "2024-09-30T23:59:59",
                        //  "format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            if(res.aggregations && res.aggregations.response_code_buckets && res.aggregations.response_code_buckets.buckets){
              let resaggbuck=res.aggregations.response_code_buckets.buckets;
              this.cuowu2xx=resaggbuck["2xx"].doc_count || 0;
              this.cuowu4xx=resaggbuck["4xx"].doc_count || 0;
              this.cuowu5xx=resaggbuck["5xx"].doc_count || 0;
            }
          });
    },
    shibailv(url,dm,nd){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      client.search({
            index: "shadow-filebeat-*",
            body:{
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    { "term": { "log.file.path": "/usr/local/shadow/logs/access.log" }},
                    { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                    { "wildcard": { "shadow.access.org_url": url }},
                    { "wildcard": { "host.name": nd }},
                    { "wildcard": { "shadow.access.http_host": dm }},
                    { 
                      "range": {
                        "@timestamp": {
                         "gte": _this.fromTime,
                          "lte": _this.endTime,
                          //"format": "yyyy-MM-dd'T'HH:mm:ss"
                        }
                      }
                    }
                  ]
                }
              },
              "aggs": {
                "total_count": {
                  "value_count": {
                    "field": "shadow.access.response_code"
                  }
                },
                "non_200_count": {
                  "filter": {
                    "bool": {
                      "must_not": {
                        "regexp": {
                          "shadow.access.response_code": "2[0-9]{2}"
                        }
                      }
                    }
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res);
            if(res.aggregations && res.aggregations.non_200_count && res.aggregations.total_count){
             // console.log(res.aggregations.non_200_count.doc_count,res.aggregations.total_count.doc_count)
              this.shibailval=res.aggregations.non_200_count.doc_count/res.aggregations.total_count.value;
            }
          });
    },
    apimngChart5(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain.replace(":","\\:") || "*";
      client.search({
            index: "shadow-filebeat-warn*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "filter": {
                    "match_all": {
                      
                    }
                  },
                  "must": [
                  //   {
                  //   "query_string": {
                  //     "query": "shadow.access.http_host:"+esDm
                  //   }
                  // },
                  { "wildcard": { "shadow.access.http_host": esDm }},
                    {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }]
                }
              },
              "aggs": {
                "ip": {
                  "terms": {
                    "field": "shadow.access.remote_ip",
                    "size": 5
                  },
                  // "aggs": {
                  //   "time_his": {
                  //     "date_histogram": {
                  //       "field": "@timestamp",
                  //       "interval": "5m",
                  //       "extended_bounds": {
                  //         "min": "2024-09-23T02:27:46Z",
                  //         "max": "2024-09-24T02:27:46Z"
                  //       }
                  //     }
                  //   }
                  // }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.ip && res.aggregations.ip.buckets){
              this.nonormalIPRank=res.aggregations.ip.buckets;
             };
          })
    },
    apimngChart5_pop(item){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain.replace(":","\\:") || "*";
      client.search({
            index: "shadow-filebeat-warn*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "filter": {
                    "match_all": {
                      
                    }
                  },
                  "must": [
                  //   {
                  //   "query_string": {
                  //     "query": "shadow.access.shadow_url:"+item
                  //   }
                  // },
                  // { "wildcard": { "shadow.access.shadow_url": item }},
                  {
                    "term": {
                      "shadow.access.org_url": item
                    }
                  },
                  { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                  { "wildcard": { "shadow.access.http_host": esDm }},
                    {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }]
                }
              },
              "aggs": {
                "ip": {
                  "terms": {
                    "field": "shadow.access.remote_ip",
                    "size": 5
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.ip && res.aggregations.ip.buckets){
              this.nonormalIPRank2=res.aggregations.ip.buckets;
             };
          })
    },
    zongipRank(item){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain.replace(":","\\:") || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      client.search({
            index: "shadow-filebeat*",
            body:  {
                "size": 0,
                "query": {
                  "bool": {
                    "must": [
                      { "term": { "log.file.path": "/usr/local/shadow/logs/access.log" }},
                      { "wildcard": { "shadow.access.non_atag_indicator": "1" }},
                      { "wildcard": { "shadow.access.org_url": item }},
                      { "wildcard": { "host.name": esnodes }},
                      { "wildcard": { "shadow.access.http_host": esDm }},
                      { 
                        "range": {
                          "@timestamp": {
                            "gte": _this.fromTime,
                        "lte": _this.endTime
                          }
                        }
                      }
                    ]
                  }
                },
                "aggs": {
                  "remote_ip_buckets": {
                    "terms": {
                      "field": "shadow.access.remote_ip",
                      "size": 10,  // 根据需要调整返回的IP数量
                      "order": {
                        "_count": "desc"  // 按出现次数排序
                      }
                    }
                  }
                }
              }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.remote_ip_buckets && res.aggregations.remote_ip_buckets.buckets){
              this.zongIPRank=res.aggregations.remote_ip_buckets.buckets;
             };
          })
    },
    apimngChart4(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                  { "wildcard": { "shadow.access.http_host": esDm }},
                  {
                    "query_string": {
                      "query": "shadow.access.non_atag_indicator: 1"
                    }
                  },
                  {
                      "bool": {
                          "should": [
                            {
                                "bool": {
                                  "must": [
                                    {
                                      "query_string": {
                                        "query": "shadow.access.error_code:0"
                                      }
                                    }
                                  ]
                                }
                              },
                              {
                                "bool": {
                                  "must_not": [{
                                    "query_string": {
                                      "query": "shadow.access.response_code:400"
                                    }
                                  }, {
                                    "query_string": {
                                      "query": "shadow.access.org_url:\\/402\\.html"
                                    }
                                  }]
                                }
                              },
                              {
                                "bool": {
                                  "must_not": [{
                                    "query_string": {
                                      "query": "shadow.access.response_code:444"
                                    },
                                    "query_string": {
                                      "query": "shadow.access.response_code:495"
                                    },
                                    "query_string": {
                                      "query": "shadow.access.response_code:405"
                                    }
                                  }]
                                }
                              }
                          ]
                      }
                  },
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }
                ]
                }
              },
              "aggs": {
                "host": {
                  "terms": {
                    "field": "shadow.access.remote_ip"
                  }
                }
              }
            }
          }).then((res)=>{
           // console.log(res)
             if(res.aggregations.host && res.aggregations.host.buckets){
              this.normalIPRank=res.aggregations.host.buckets;
             };
          })
    },
    apimngChart3(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                  { "wildcard": { "shadow.access.http_host": esDm }},
                  {
                    "query_string": {
                      "query": "shadow.access.non_atag_indicator: 1"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code: /[5][0-9][0-9]/"
                    }
                  },
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }
                ]
                }
              },
              "aggs": {
                "host": {
                  "terms": {
                    "field": "shadow.access.org_url"
                  }
                }
              }
            }
          }).then((res)=>{
            let totalCount=0;
             if(res.aggregations.host && res.aggregations.host.buckets){
              let bucketItem=res.aggregations.host.buckets;
               for(let i=0;i<bucketItem.length;i++){
                totalCount=totalCount+bucketItem[i].doc_count;
               }
               this.num5xx=totalCount
             };
          })
    },
    apimngChart2(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      client.search({
            index: "shadow-filebeat-*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                  { "wildcard": { "shadow.access.http_host": esDm }},
                  {
                    "query_string": {
                      "query": "shadow.access.non_atag_indicator: 1"
                    }
                  },
                  {
                    "query_string": {
                      "query": "shadow.access.response_code: /[4][0-9][0-9]/"
                    }
                  },
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }
                ]
                }
              },
              "aggs": {
                "host": {
                  "terms": {
                    "field": "shadow.access.org_url"
                  }
                }
              }
            }
          }).then((res)=>{
            let totalCount=0;
             if(res.aggregations.host && res.aggregations.host.buckets){
              let bucketItem=res.aggregations.host.buckets;
               for(let i=0;i<bucketItem.length;i++){
                totalCount=totalCount+bucketItem[i].doc_count;
               }
               this.num4xx=totalCount
             };
          })
    },
    apimngChart1(){
      var _this=this;
      _this.urlVisitCtLoading=true;
      _this.apiMngChart1 = echarts.init(document.getElementById('apiMngChartid1'));
      var myopiton= {
        "color": [
            "#eb8146"
        ],
        "title": {
            "text": "API访问排名",
            "x": "center",
            "textStyle": {
                "fontSize": "16",
                "fontWeight": "normal"
            }
        },
        "tooltip": {
            "show": true,
            "trigger": "axis",
            "confine": true,
            "axisPointer": {
                "type": "shadow"
            },
            "extraCssText": "white-space:normal;word-break: break-all"
        },
        "grid": {
            "top": "12%",
            "left": "0",
            "right": "50",
            "bottom": "2%",
            "containLabel": true
        },
        "xAxis": {
            "show": true,
            "type": "value",
            "name": "次数",
            "boundaryGap": [
                0,
                0.01
            ],
            "position": "bottom",
            "splitLine": {
                "show": false
            },
            "minInterval": 1
        },
        "yAxis": {
            "show": true,
            "type": "category",
            "data": [
                // "top1",
                // "top2",
                // "top3"
            ],
            "inverse": true
        },
        "series": [
            {
                "type": "bar",
                "label": {
                    "normal": {
                        "show": true,
                        "rotate": 0,
                        "align": "left",
                        "verticalAlign": "middle",
                        "position": "insideLeft",
                        "distance": 10,
                        "fontSize": 12,
                    }, 
                },
                "itemStyle":{
                  "normal":{
                    "color":"#4a5166"
                  }
                },
                "data": [
                    // {
                    //     "value": 132,
                    //     "name": "/api/admins/isEnableLoginCode"
                    // },
                    // {
                    //     "value": 110,
                    //     "name": "/baidu"
                    // }
                ],
                "barMaxWidth": 30
            }
        ]
      }

      this.apichart1Promise().then((resolvedata)=>{
      //  console.log(resolvedata);
        if(resolvedata.length==0){
            myopiton.xAxis.show=false;
            myopiton.yAxis.show=false;
            myopiton.tooltip.show=false;
            _this.urlVisitCtBarNodata=true;
          }else{
            myopiton.xAxis.show=true;
            myopiton.yAxis.show=true;
            myopiton.tooltip.show=true;
            _this.urlVisitCtBarNodata=false;
          }
        let resAggKey=[];
        resolvedata.map((item)=>{
          resAggKey.push(item.name);
        });
        myopiton.yAxis.data=resAggKey;
        myopiton.series[0].data=resolvedata;
        _this.apiMngChart1.setOption(myopiton,true);
        _this.urlVisitCtLoading=false;


        _this.apiMngChart1.off("click")
        _this.apiMngChart1.on("click",(params)=>{
         // console.log(params);
          let esDm=this.queryPanelform.checkDomain || "*";
          let esnodes=this.shadownodesform.shadownodes || "*";
          _this.apimngpop_show=true;
          const name=params.data.name;
          _this.apimngpopCurtitle=name;
          this.fangwenzongliang(name,esDm,esnodes);
          this.eyifangwenliang(name,esDm,esnodes);
          this.pingjunxiangyisj(name,esDm,esnodes);
          this.upstreamxiangyinsj(name,esDm,esnodes);
          this.cuowudaima(name,esDm,esnodes);
          this.shibailv(name,esDm,esnodes);
          
        });



      })
    },
    getUserDm(){
      return new Promise((resolve,reject)=>{
        let name=sessionStorage.getItem("myname");
        var url = SERVER_API_URL + 'pe/shadow/user/accessdomain/'+name;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resdata=res.data.data;
            let resdatadm;
            if(resdata && resdata.domains){
              resdatadm=resdata.domains || [];
            }
            resolve(resdatadm || [])
          }else{
            reject("error")
          }
        })
      });
    },
    apichart1Promise(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      let esDm=this.queryPanelform.checkDomain || "*";
      return new Promise((resolve,reject)=>{
        client.search({
            index: "shadow-filebeat-*",
            body:  {
              "size": 0,
              "query": {
                "bool": {
                  "must": [
                    {
                      "term": {
                        "log.file.path": "/usr/local/shadow/logs/access.log"
                      }
                    },
                  { "wildcard": { "shadow.access.http_host": esDm }},
                  {
                    "query_string": {
                      "query": "shadow.access.non_atag_indicator: 1"
                    }
                  },
                  {
                    "range": {
                      "@timestamp": {
                        "gte": _this.fromTime,
                        "lte": _this.endTime
                      }
                    }
                  }
                ]
                }
              },
              "aggs": {
                "host": {
                  "terms": {
                    "field": "shadow.access.org_url"
                  }
                }
              }
            }
          }).then((res)=>{
            let resAgg=[];
            if(res.aggregations.host && res.aggregations.host.buckets){
              resAgg=res.aggregations.host.buckets;
            };
            //console.log(resAgg)
            resAgg = resAgg.map(item => {
              return {
                name: item.key,
                value: item.doc_count
              };
            });
            resolve(resAgg)
          })
      })
    },
    handleTime(){
      var _this=this;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;
      var fromTime2=toISO8601(sttime),
          endTime2=toISO8601(edtime);
      var fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong)),
          endTime=endTime2 || toISO8601(new Date()); 
      _this.fromTime=fromTime;
      _this.endTime=endTime;
      _this.timeinterval=_this.$store.state.mydatedata.interval || '5m';
    },
    ecBar1(){
      var _this=this;
      _this.urlVisitCtLoading=true;
      _this.ecBar1Chart = echarts.init(document.getElementById('apiMngChartid1'));
      var option = null;
      option = {
        title: {
          text: this.$t('lg.zhengcipfwph')
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
         // data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
         data: []
        },
        series: [
          {
         //   name: '正常IP访问排行',
            type: 'bar',
           // data: [19325, 23438, 31000, 121594, 134141, 681807]
            data: []
          }
        ]
      };

      client.search({
          index: "shadow-filebeat-*",
          body: {
            "size": 10,
            "query": {
              "bool": {
                // "filter": {
                //   "match_all": {}
                // },
                "must": [
                  {
                    "term": {
                      "log.file.path": "/usr/local/shadow/logs/access.log"
                    }
                  },
                   {
                  "range": {
                    "@timestamp": {
                      "gte": _this.fromTime,
                      "lte": _this.endTime
                    }
                  }
                }]
              }
            },
            "aggs": {
              "GroupByMe": {
                "terms": {
                  "field": "shadow.access.domain",
                  "size": 10
                }
              }
            }
          }
        }).then((res)=>{
         // console.log(res)
          if(res.aggregations && res.aggregations.GroupByMe){
            var resResult=res.aggregations.GroupByMe.buckets;
            let yAxisData=[],xAxisData=[];
            resResult.forEach((item,index)=>{
              yAxisData.push(item.key);
              xAxisData.push(item.doc_count)
            });
            option.yAxis.data=yAxisData;
            option.series[0].data=xAxisData;
            if (option && typeof option === "object") {
              _this.ecBar1Chart.setOption(option, true);
            }       
          }
          
        });
        _this.ecBar1Chart.off("click");
        _this.ecBar1Chart.on("click",(params)=>{
         // console.log(params);
        });


      
    },
    deleteIt(item){
      const _this=this;
      const id=item.id;
      const data={
        domainName: item.domainName,
        domainPort: item.domainPort,
        hostName: item.hostName,
        locationName: item.locationName,
        remark: item.remark,
        snodeId: item.snodeId
      };
      const url=SERVER_API_URL+"pe/shadow/location/log?ids="+id;
      this.$refs.loading.showLoading();
      axios.delete(url,data).then((res)=>{
        if(res.data.responseCode==0){
          this.$refs.loading.hideLoading();
          _this.getConfigedApi();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
      })


    },
    handleClick(tab,event){
     // console.log(tab)
      if(tab.name=='second'){
        this.getConfigedApi();
      }else if(tab.name=='first'){
        if(this.isApisearchClick){
          this.getApiList('1');
        }else{
          this.getApiList();
        }
      }
    },
    getConfigedApi(){
      let url0=SERVER_API_URL+"pe/shadow/location/log?"+"size="+this.configedPageSize+"&page="+this.configedPage;
      this.$refs.loading.showLoading();
      this.configedApiHits=[];
      axios.get(url0).then((res)=>{
          //  console.log(res)
            if(res.data.responseCode==0){
              const resData=res.data.data;
              this.configedApiHits=resData.content;
              this.configedPageNum=resData.totalPages;
             this.$refs.loading.hideLoading();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
            }
      });
    },
    defenseCookieVal_shownew(){
const _this=this;
      this.onShow(_this.curAttrpopItem,_this.defenseCookieVal_show=true)
    },
    paramverify_shownew(){
const _this=this;
      this.onShow(_this.curAttrpopItem,_this.botconfVal_show=true)
    },
    botconfVal_shownew(){
const _this=this;
      this.onShow(_this.curAttrpopItem,_this.botconfVal_show=true)
    },
    accessdenyVal_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.accessdenyVal_show=true)
    },
    setRejectHeaderVal_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.setRejectHeaderVal_show=true)
    },
    verifyCookieMd5Val_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.verifyCookieMd5Val_show=true)
    },
    encryptKeySwitch_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.encryptKeySwitch_show=true)
    },
    verifyTokenVal_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.verifyTokenVal_show=true)
    },
    jsinsert_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.jsinsert_show=true)
    },
    userbehaviorintercept_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.userbehaviorintercept_show=true)
    },
    shadow_verify_agent_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.shadow_verify_agent_show=true)
    },
    shadow_verify_browser_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.shadow_verify_browser_show=true)
    },
    shadow_request_time_showClose(){
      this.shadow_verify_browser_show=false;
      this.shadow_request_time_show=false;
      this.shadownodesform2.shadownodes='';
      this.verifyBrowserDctform.verifyBrowserVal=0;
      this.shadow_verify_agent_show=false;
      this.verifyAgentDctform.verifyAgentVal=0;
      this.userbehaviorintercept_show=false;
      this.requestreturnform.clicktimes='';
      this.requestreturnform.presstimes='';
      this.requestreturnform.movetimes='';
      this.requestreturnSwitch=false;
      this.jsinsert_show=false;
      this.insertJsDctform.insertJsType='3';
      this.verifyTokenVal_show=false;
      this.verifyTokenDctform.verifyTokenVal=false;
      this.encryptKeySwitch_show=false;
      this.encryptKeySwitch=false;
      this.verifyCookieMd5Val_show=false;
        this.verifyCookieMd5Val=false;
        this.setRejectHeaderVal_show=false;
        this.setRejectHeaderDctform.setRejectHeaderVal=false;
        this.accessdenyVal_show=false;
        this.accessdenyform.accessdenyVal=false;
        this.botconfVal_show=false;
        this.botconfDctform.botconfVal=false;
        this.paramverify_show=false;
        this.paramverifyform.paramverify=false;
        this.defenseCookieVal_show=false;
        this.defenseCookieDctform.defenseCookieVal=false;
      if(this.$refs['requestTimeDctform']){
        this.$refs['requestTimeDctform'].resetFields();
      }
    },
    getLcDefenseCookieData2(){//Shadow Cookie验证功能
    const _this=this;
      let url="";
        const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?autoconfig=true";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location";
      } 

      return new Promise((resolve,reject)=>{
        axios.get(url,{
          params:{
            domainName:domainName,
            domainPort:domainPort,
            locationName:locationName,
            locationType:locationType
          }
        }).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resData=res.data.data;
            if(resData.hasOwnProperty('shadow_server_cookie_num')){//该location对应的shadow节点上的Shadow Cookie验证功能开启才能设置location的Shadow Cookie验证功能
              this.defenseCookieFlag=true;
            }else{
              this.defenseCookieFlag=false;
            }
            // if(resData.shadow_server_cookie=="on"){
            //   this.defenseCookieDctform.defenseCookieVal=true;
            // }else{
            //   this.defenseCookieDctform.defenseCookieVal=false;
            // }
            resolve(this.defenseCookieFlag)
          }else{
            reject("error")
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      })
      
    },
    submitLcDefenseCookie2(){//开启或者关闭Shadow Cookie验证功能
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
      _this.getLcDefenseCookieData2().then((resovledata)=>{
      //  console.log(resovledata)
if(!resovledata){//该location对应的shadow节点上的Shadow Cookie验证功能开启才能设置location的Shadow Cookie验证功能
        _this.$message.error(_this.$t('lg.dynamiccookieconfigtips'));
        _this.defenseCookieDctform.defenseCookieVal=false;
        return;
      }
      
    let url="";
        const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }
      var onoff=_this.defenseCookieDctform.defenseCookieVal;
      axios.patch(url,{
        isEnabled:onoff
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
      });
      
    },
    submitLcParamverify(){
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
    let url="";
        const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";
      if(this.isAuto){
        url=SERVER_API_URL+`pe/shadow/domain/location/paramverify?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}&autoconfig=true`;
      }else if(this.isEditConfig){
        url=SERVER_API_URL+`pe/shadow/domain/location/paramverify?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}&savedConfig=true`;
      }else{
        url=SERVER_API_URL+`pe/shadow/domain/location/paramverify?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}`;
      }
      const onoff=this.paramverifyform.paramverify==true?"on":"off";
      axios.patch(url,{
        paramverify:onoff
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitLcBotconf(){//开启或者关闭 扫描工具防御功能
    const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
    let url="";
        const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";
      if(this.isAuto){
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(this.isEditConfig){
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }
      const onoff=this.botconfDctform.botconfVal==true?"on":"off";
      axios.patch(this.botconfUrl,{
        botConf:onoff,
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitLcAccessdeny(){
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
       let url="";
        const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";

      if(this.isAuto){
        url=SERVER_API_URL+`pe/shadow/domain/location/accessdenied?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}&autoconfig=true`;
      }else if(this.isEditConfig){
        url=SERVER_API_URL+`pe/shadow/domain/location/accessdenied?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}&savedConfig=true`;
      }else{
        url=SERVER_API_URL+`pe/shadow/domain/location/accessdenied?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationName=${locationName}&locationType=${locationType}`;
      }
      const onoff=this.accessdenyform.accessdenyVal==true?"on":"off";
      axios.patch(url,{
        accessdenied:onoff
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitDirective(formname,type){//确认增加
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
      _this.addDctLoading=true;
      let directivesArr=[];
      let str="";

      if(formname=='directive_1_form'){// 特殊文件类型、header补全、header修改 批量添加
        // console.log(this.directive_1_List);
        this.directive_1_List.forEach(ele=>{
          // console.log(ele)
          str=ele['directive_1_val'];
          str=Base64.encode(str);
          directivesArr.push({
            [ele.subfilterType]:str
          })
        })
      }else if(formname=='requestTimeDctform'){
        str=Base64.encode(_this.requestTimeDctform.requestTimeVal+_this.requestTimeUnit);
        directivesArr.push({
          shadow_request_time:str,
        })
      }
      else if(formname=='verifyTokenDctform'){
        if(_this.verifyTokenDctform.verifyTokenVal){
          str = Base64.encode(1);
          directivesArr.push({
            shadow_verify_token:str,
          })
        }else{//开关为关闭状态时点击按钮表示删除改指令
          _this.deletDirective11('shadow_verify_token',[{"shadow_verify_token": "MQ=="}]);
          return false;
        }
      }
      else if(formname=='encryptKeyDctform'){
        if(_this.encryptKeySwitch){
          str=Base64.encode(_this.encryptKeyDctform.encryptKeyVal);
          directivesArr.push({
            shadow_encrypt_key:str,
          })
        }else{
          _this.deletDirective11('shadow_encrypt_key',[{"shadow_encrypt_key": "c2hhZG93YW5ydWlmb3Jt"}]);
          return false;
        }
      }else if(formname=='verifyCookieMd5Dctform'){
        if(_this.verifyCookieMd5Dctform.verifyCookieMd5Val){
          str = Base64.encode(1);
          directivesArr.push({
            shadow_verify_cookie_md5:str,
          })
        }else{//开关为关闭状态时点击按钮表示删除改指令
          _this.deletDirective11('shadow_verify_cookie_md5',[{"shadow_verify_cookie_md5": "MQ=="}]);
          return false;
        }
      }else if(formname=='setRejectHeaderDctform'){
        if(_this.setRejectHeaderDctform.setRejectHeaderVal){
          str = Base64.encode('on');
          directivesArr.push({
            shadow_set_reject_header:str,
          })
        }else{
          _this.deletDirective11('shadow_set_reject_header',[{"shadow_set_reject_header": "b24="}]);
          return false;
        }
      }else if(formname=='insertJsDctform'){

        //先删除
        // const delJsArr = Object.assign([],_this.directiveData);
        // const delJsStr = delJsArr.length>0?delJsArr[0].join(" "):'';
        // console.log(_this.directiveData)
        let str2;
        _this.deletDirective('shadow_insert_js_ex',[]).then((resolvedata)=>{
          if(_this.insertJsDctform.insertJsType=='1'){//普通插入
            str = Base64.encode("'</title>'  '</title><script src=\"/formvalidator/shadowlib.js\"><\/script>' 500s 1 r")
            str2 = Base64.encode("'<head>'  '<head><script src=\"/formvalidator/config.js\"><\/script>' 500s 1 r")
            directivesArr.push({
              shadow_sub_filter:str,
            })
            directivesArr.push({
              shadow_sub_filter:str2,
            })
          }else if(_this.insertJsDctform.insertJsType=='2'){//增强插入
            str="pes 10s 1 '<head>' '<head><script src=\"' 'formvalidator/config.js' '\"><\/script>'";
            str2="pes 10s 1 '</title>' '</title><script src=\"' 'formvalidator/shadowlib.js' '\"><\/script>'";
            directivesArr.push({
              shadow_insert_js_ex:Base64.encode(str),
            })
            directivesArr.push({
              shadow_insert_js_ex:Base64.encode(str2)
            })
          }
          axios.post(_this.url,{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:directivesArr
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              
              _this.handleChange(type);
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
            _this.addDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })

        });
          return false
      }else if(formname=='mustHaveCookieDctform'){
        if(_this.mustHaveCookieDctform.mustHaveCookieVal){
          str = Base64.encode('on');
          directivesArr.push({
            shadow_must_have_cookie:str,
          })
        }else{
          _this.deletDirective('shadow_must_have_cookie',_this.directiveData);
          return false;
        }
      }
      const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
      axios.post(url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        locationName:locationName,
        locationType:"accurateMatch",
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          // if(formname=='directive_1_form'){
          //   _this.addDct_1_DialogClose();
          // }
          _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    deletDirective11(type,obj){
      const _this=this;  
      return new Promise((resolve,reject)=>{
        axios.delete(_this.url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:obj
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            if(type!='shadow_insert_js_ex'){
              _this.shadow_request_time_showClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }
          }else{
            _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
          }
          _this.getDirectiveLoading=false;
          resolve();
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    js_submit(){
       const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
      _this.addDctLoading=true;
      let directivesArr=[];
      let str="";
      let str2;
        _this.deletjsDirective('shadow_insert_js_ex',[]).then((resolvedata)=>{
          if(_this.insertJsDctform.insertJsType=='1'){//普通插入
            str = Base64.encode("'</title>'  '</title><script src=\"/formvalidator/shadowlib.js\"><\/script>' 500s 1 r")
            str2 = Base64.encode("'<head>'  '<head><script src=\"/formvalidator/config.js\"><\/script>' 500s 1 r")
            directivesArr.push({
              shadow_sub_filter:str,
            })
            directivesArr.push({
              shadow_sub_filter:str2,
            })
          }else if(_this.insertJsDctform.insertJsType=='2'){//增强插入
            str="pes 10s 1 '<head>' '<head><script src=\"' 'formvalidator/config.js' '\"><\/script>'";
            str2="pes 10s 1 '</title>' '</title><script src=\"' 'formvalidator/shadowlib.js' '\"><\/script>'";
            directivesArr.push({
              shadow_insert_js_ex:Base64.encode(str),
            })
            directivesArr.push({
              shadow_insert_js_ex:Base64.encode(str2)
            })
          }
          const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
          axios.post(url,{
             snodeId:snodeId,
            domainName:domainName,
            domainPort:domainPort,
            locationName:locationName,
            locationType:"accurateMatch",
            directives:directivesArr
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            _this.shadow_request_time_showClose();
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
            _this.addDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })

        });

    },
    shadow_request_time_shownew(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.shadow_request_time_show=true)
    },
    deletjsDirective(type,item){
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
        let str="pes 10s 1 '<head>' '<head><script src=\"' 'formvalidator/config.js' '\"><\/script>'";
        let str2="pes 10s 1 '</title>' '</title><script src=\"' 'formvalidator/shadowlib.js' '\"><\/script>'";
        str=Base64.encode(str);
        str2=Base64.encode(str2);
        directivesArr=[{
          'shadow_insert_js_ex':str,
        },{
          'shadow_insert_js_ex':str2,
        },{
          'shadow_sub_filter':'JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg==',
        },{
          'shadow_sub_filter':'JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy',
        }]; 
        const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
      return new Promise((resolve,reject)=>{
        axios.delete(url,{
          data:{
            snodeId:snodeId,
            domainName:domainName,
            domainPort:domainPort,
            locationName:locationName,
            locationType:"accurateMatch",
            directives:directivesArr
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
          }else{
            _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
          }
          _this.getDirectiveLoading=false;
          resolve();
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    deletDirective(type,item){
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
      const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
      _this.getDirectiveLoading=true;
        const srcdictateType=type;
        const delItem = Object.assign([],item);//克隆对象  delItem=item;改变了原对象
        var basevitem=Base64.encode(delItem.join(" "));
        directivesObj[srcdictateType]=basevitem;
        directivesArr.push(directivesObj);
      return new Promise((resolve,reject)=>{
        axios.delete(url,{
          data:{
            snodeId:snodeId,
            domainName:domainName,
            domainPort:domainPort,
            locationName:locationName,
            locationType:"accurateMatch",
            directives:directivesArr
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
              _this.shadow_request_time_showClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
          }else{
            _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
          }
          _this.getDirectiveLoading=false;
          resolve();
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    returnSubmit(formname){
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;
          const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName),
          locationType="accurateMatch";
          let url=SERVER_API_URL+"pe/shadow/domain/location/userbehaviorintercept?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
          axios.patch(url,{
            clickCount: _this.requestreturnform.clicktimes,
            inputCount: _this.requestreturnform.presstimes,
            moveCount: _this.requestreturnform.movetimes
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.requestreturnSwitch=true;
              _this.shadow_request_time_showClose();
              this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    for_submit_submit2(formname,type){
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error('请选择节点');
        return;
      }
      this.$refs[formname].validate((valid) => {
        if (valid) {
          if(formname=='verifyAgentDctform'){
            if(this.verifyAgentDctform.verifyAgentVal==0){
              this.deletDirective('shadow_verify_agent',this.directiveData);
            }else{
              this.for_submit(formname,type)
            }             
          }else if(formname=='verifyBrowserDctform'){
            if(this.verifyBrowserDctform.verifyBrowserVal==0){
              this.deletDirective('shadow_verify_browser',this.directiveData);
            }else{
              this.for_submit(formname,type)
            }
          }
        }
      })
    },
    for_submit(formname,type){
      const _this=this;
      _this.addDctLoading=true;
      let directivesArr=[];
      let str="";
      if(formname=='verifyAgentDctform'){
        str=Base64.encode(_this.verifyAgentDctform.verifyAgentVal);
        directivesArr.push({
          shadow_verify_agent:str,
        });
      }else if(formname=='verifyBrowserDctform'){
        str=Base64.encode(_this.verifyBrowserDctform.verifyBrowserVal);
        directivesArr.push({
          shadow_verify_browser:str,
        })
      }
      const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
      axios.post(url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        locationName:locationName,
        locationType:"accurateMatch",
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.shadow_request_time_showClose();
          this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    validSubmitDirective(formname,type){
      const _this=this;
      if(!_this.shadownodesform2.shadownodes){
        _this.$message.error(_this.$t('lg.qingxzjd'));
        return;
      }
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.shadow_request_time_submit(formname,type);
        }
      })
    },
    shadow_request_time_submit(formname,type){
      const _this=this;
      _this.addDctLoading=true;
      let directivesArr=[];
      let str=Base64.encode(_this.requestTimeDctform.requestTimeVal+_this.requestTimeUnit);
        directivesArr.push({
          shadow_request_time:str,
        })
      const url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
      axios.post(url,{
        snodeId:snodeId,
        domainName:domainName,
        domainPort:domainPort,
        locationName:locationName,
        locationType:"accurateMatch",
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          this.shadow_request_time_showClose();
          this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })

    },
    editDctEnsure(formname){//确认修改
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;
          let directiveName='';
          var srcdictatedata = "";
          var dstdictatedata= "";
          if(formname=='editDirective_1_form'){//特殊文件类型、header补全、header修改
            srcdictatedata=Base64.encode(_this.editDirective_1_Orgin.directive_1_val);
            dstdictatedata=Base64.encode(_this.editDirective_1_form.directive_1_val);
            directiveName=_this.editDirective_1_Orgin.directive_1_type;
          }else if(formname=='requestTimeDctform'){//手动防御设置
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.requestTimeDctform.requestTimeVal+_this.requestTimeUnit);
            directiveName='shadow_request_time';
          }else if(formname=='verifyBrowserDctform'){//浏览器参数指标
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.verifyBrowserDctform.verifyBrowserVal);
            directiveName='shadow_verify_browser';
          }else if(formname=='verifyAgentDctform'){//用户行为指标
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.verifyAgentDctform.verifyAgentVal);
            directiveName='shadow_verify_agent';
          }else if(formname=='encryptKeyDctform'){//body加密功能
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.encryptKeyDctform.encryptKeyVal);
            directiveName='shadow_encrypt_key';
          }

          axios.patch(_this.url,{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directiveName:directiveName,
            srcData:srcdictatedata,
            targetData:dstdictatedata,
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.handleChange(directiveName);
              _this.getLocView();
              _this.editDctDialogClose(formname);
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    getShadowNodes2(){//获取节点
      var _this=this;
      return new Promise((resolve,reject)=>{
        var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
        axios.get(nodesurl).then((res)=>{
          if(res.data.responseCode == 0){
            let resData=res.data.data;
            _this.nodesdata2=resData;
            resolve(resData)
          }else{
            reject("error")
          }
        }).catch((err) => {
          console.log(err)
        });
      })
      
    },
    oneLinkClose(){
      this.oneLinkVisible=false;
      this.shadownodesform2.shadownodes=''
    },
    onShow(item,visible=false){
      this.getShadowNodes2().then((resolvedata,reject)=>{
        this.aMenu=-1,
        this.curOneLinkItem.hostName=item._source.host.hostname,
        this.curOneLinkItem.domainName=item._source.shadow.access.domain,
        this.curOneLinkItem.domainPort=item._source.shadow.access.server_port,
        this.curOneLinkItem.locationName=item._source.shadow.access.org_url;
        visible=true;
      }) 
    },
    oneLinkShow(){
      const _this=this;
      this.onShow(_this.curAttrpopItem,_this.oneLinkVisible=true)
    },
    addApiFn(snodeId,hostName,domainName,domainPort,locationName,remark){
      const url=SERVER_API_URL+"pe/shadow/location/log";
      let data={
        "domainName": domainName,
        "domainPort": domainPort,
        "hostName": hostName,
        "locationName": locationName,
        "remark": remark,
        "snodeId": snodeId
      }
      axios.post(url,data).then((res)=>{
        if(res.data.responseCode==0){

        }else{
          this.$message.error(this.$t('lg.failed'));
        }
      })   
    },
    oneLink(){
      const _this=this;
      _this.$refs['shadownodesform2'].validate((valid) => {
        if(valid){
          const snodeId=_this.shadownodesform2.shadownodes,
          hostName=_this.curOneLinkItem.hostName,
          domainName=_this.curOneLinkItem.domainName,
          domainPort=_this.curOneLinkItem.domainPort,
          locationName=encodeURI(_this.curOneLinkItem.locationName);
          const url=SERVER_API_URL+"pe/shadow/location/reset?snodeId="+snodeId+"&domainName="+domainName+"&locationName="+locationName+"&domainPort="+domainPort+"&locationType=accurateMatch";
         this.$refs.loading.showLoading();
         axios.post(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message:this.$t('lg.success')
              });
              this.oneLinkClose();
             this.$refs.loading.hideLoading();
             this.addApiFn(snodeId,hostName,domainName,domainPort,locationName,'');
            }else{
              this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
            }
          })
        }
      })
    },
    toggleA(item,index){
     // console.log(item);
      this.curAttrpopItem=item;
      this.curAttrpopItemTit=item._source.shadow.access.org_url;
      let esDm=this.queryPanelform.checkDomain || "*";
      let esnodes=this.shadownodesform.shadownodes || "*";
      let name;
      if(item._source && item._source.shadow && item._source.shadow.access){
        name=item._source.shadow.access.org_url || "";
      }
      this.fangwenzongliang(name,esDm,esnodes);
       this.eyifangwenliang(name,esDm,esnodes);
       this.cuowudaima(name,esDm,esnodes);
       this.apimngChart5_pop(name);
       this.upstreamyanchitongji2(name);
       this.shibaidiaoyonglv2(name);
      //  this.$nextTick(()=>{
      //     this.drawOrgIpPie2(name);
      //   });
      //  this.drawOrgIpPie2(name);
      this.zongipRank(name);
      this.attrpop_show=true; 
    },
    nextPage(){
      if(this.page<this.pageNum-1){
        this.page++;
        if(this.isApisearchClick){
          this.getApiList('1');
        }else{
          this.getApiList();
        }
      }
      
    },
    prevPage(){
      if(this.page>0){
        this.page--;
        if(this.isApisearchClick){
          this.getApiList('1');
        }else{
          this.getApiList();
        }
      }
    },
    configed_nextPage(){
      if(this.configedPage<this.configedPageNum-1){
        this.configedPage++;
        this.getConfigedApi();
      }
      
    },
    configed_prevPage(){
      if(this.configedPage>0){
        this.configedPage--;
        this.getConfigedApi();
      }
    },
    getApiList(type){
      const _this=this;
      _this.$refs.loading.showLoading();
      _this.$refs.queryPanelform.validate(valid => {
        if (valid) {
          this.isBeginSearch=true;
          if(type==='1'){
            _this.isApisearchClick=true;
            if(_this.rspage){
             // console.log(111)
              _this.page=0;
              _this.rspage=false;
            }
           // 
          }else{
            _this.isApisearchClick=false;
            _this.urlsearch="";
            if(!_this.rspage){
              _this.page=0;
            }
            _this.rspage=true;
            
          }
          this.apiHits=[];
          const sttime=this.$store.state.mydatedata.starttime,
          edtime=this.$store.state.mydatedata.endtime;
          const fromTimestamp=toISO8601(sttime),
          toTimestamp=toISO8601(edtime);
          let hostNameList=[this.shadownodesform.shadownodes];
          let checkDomain=[this.queryPanelform.checkDomain];
          let url0=SERVER_API_URL+"pe/shadow/api/es/list?"+"fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp+"&size="+this.pageSize+"&page="+this.page;
          if(this.shadownodesform.shadownodes){
            url0=url0+"&hostNameList="+encodeURI(hostNameList);
          }
          if(this.queryPanelform.checkDomain){
            url0=url0+"&domainNameList="+encodeURI(checkDomain);
          }  
          if(type==='1' && _this.isApisearchClick){
            url0=url0+"&locationName="+encodeURI(this.urlsearch);
          }      
          this.$refs.loading.showLoading();
          axios.get(url0).then((res)=>{
            if(res.data.responseCode==0){
              const hitsObj=res.data.data.hits;
             this.apiHits=hitsObj.hits;
             this.totalHits=hitsObj.total.value;
             this.pageNum=Math.ceil(_this.totalHits/_this.pageSize) 
             this.$refs.loading.hideLoading();
            }else{
              console.log("error");
              this.$refs.loading.hideLoading();
            }
          }).catch(()=>{
            console.log("error");
            this.$refs.loading.hideLoading();
          });
          this.$nextTick(()=>{
            this.apimngChart1();
            this.apimngChart2();
            this.apimngChart3();
            this.apimngChart4();
            this.apimngChart5();
            this.yanchitongji();
            this.upstreamyanchitongji();
            this.shibaidiaoyonglv();
            this.drawOrgIpPie();
           // let esDm=this.queryPanelform.checkDomain || "*";
           // this.shibailv();
          });          
        } else {
          return false;
        }
      });

    },
    getDomains(){
      var _this=this;
      const sttime=this.$store.state.mydatedata.starttime,
          edtime=this.$store.state.mydatedata.endtime;
          const fromTimestamp=toISO8601(sttime),
          toTimestamp=toISO8601(edtime);
          
      var nodesurl=SERVER_API_URL+"pe/shadow/api/es/domain/list?fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp;
      if(this.shadownodesform.shadownodes){
        let hostNameList=[this.shadownodesform.shadownodes];
        nodesurl=nodesurl+"&hostNameList="+encodeURI(hostNameList);
      }
     this.$refs.loading.showLoading();
     axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          _this.getDms=res.data.data;
          this.$refs.loading.hideLoading();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });    
    },
    getShadowNodes(){//获取节点
      var _this=this;
      const sttime=this.$store.state.mydatedata.starttime,
          edtime=this.$store.state.mydatedata.endtime;
          const fromTimestamp=toISO8601(sttime),
          toTimestamp=toISO8601(edtime);
      var nodesurl=SERVER_API_URL+"pe/shadow/api/es/hostname/list?fromTimestamp="+fromTimestamp+"&toTimestamp="+toTimestamp;
     this.$refs.loading.showLoading();
     axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          _this.nodesdata=res.data.data;
          this.$refs.loading.hideLoading();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
  },
  filters: {
    percentFormat(num){
      return (num*100).toFixed(2)+"%"
    },
    percentFormat2(num){
      return Number(num).toFixed(2)
      
    },
    toSdDate(val){
      if(!val) return;
      var d=new Date(val);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return d.getFullYear()+"/"+pad(parseInt(d.getMonth())+1)+"/"+pad(d.getDate())+" "+pad(d.getHours())+':'+pad(d.getMinutes())+":"+pad(d.getSeconds());
    }
  }
}
</script>

<style scoped>
.quickconfig-wrapper{
     width:100%;
    height: 100%;
    position: relative;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;  
}
.tagli{display: inline-block; margin-right: 18px;}
.table-container {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

/* 表头 */
.table-container thead {
  background-color: #f2f2f2;
}

.table-container th,
.table-container td {
  padding:15px 10px;
  border: 1px solid #ddd; /* 添加边框 */
  max-width: 200px;
}
.table-container tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.table-container tbody tr:hover {
  background-color: #f8f8f8;
}
@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }
  .table-container th,
  .table-container td {
    white-space: nowrap;
  }
}
a.editdel{ display: inline-block; margin: 6px; font-size: 12px;}
a.editdel:hover{text-decoration: underline;}
.pagecls{ text-align: center; margin-bottom: 20px;}
.pagecls a.prevnext{ display: inline-block; margin: 0 12px; color:#888; padding: 4px 8px; border: 1px solid #888;}
.pagecls a.prevnext:hover{ color: #000; border: 1px solid #000;}
.pagecls a.disable{color:#ddd; border: 1px solid #ddd;}
.pagecls a.disable:hover{cursor: default;color:#ddd; border: 1px solid #ddd;}
.pagecls .pagesp{ display: inline-block; padding: 4px 8px;margin: 0 6px;}
a.urla{ display: inline-block; padding: 4px; border: 1px solid #ccc; margin-left: 10px;
font-size: 12px;  color: #888;}
.adivul{
  position:absolute;
  top: 20px;
  right: 10px;
  border: 1px solid #ccc;
  padding:2px 0;
  background: #909399;
    border-color: #909399;
    color: #fff;
  z-index: 9999;
  min-width: 52px;
  box-sizing: border-box;
  right:10px; top:30px;
  width: 320px;
}
.aul{
  width: 100%;
   display: flex;
   flex-wrap: wrap;
   width: 100%;
}
.clearbox{
  clear: both;
}
a.configa{
  color: #fff;
    background-color: #909399;
    border-color: #909399;
    display:inline-block;
    height: 22px;
    line-height: 22px;
    width: 44px;
    text-align: center;
    font-size: 12px;
}
.configli{ height: 26px; line-height: 26px; flex:1; 
box-sizing: border-box; border: 1px solid #777; 
margin: 6px 12px;}
a.configlia{ color: #444; display: inline-block; padding: 6px 10px; margin: 8px;background-color: #f1f1f1;
border: 1px solid #ebebeb;}
a.configlia:hover{ background-color: #dddddd;}
a.offlinea{ color: #666; font-size: 12px;}
a.offlinea:hover{ color: #000; font-size: 12px; text-decoration: underline;}
.block{
   display:flex; margin-bottom: 20px;
}
.tit{
  flex:0 0 110px;
  text-align:center;
  line-height:38px;
}
.sli{
flex:1
}
a.deletea{ font-size: 12px;}
a.deletea:hover{ text-decoration: underline;}
#apiMngChartid1,#eCodeTypeContainer,#orgIpLineContainer,#domainLineContainer,#orgIpPieContainer,#orgIpPieContainer2,#domainPieContainer,#fingerPieContainer,#autoToolPieContainer,#regionBarContainer{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
}
.h4title{ font-size: 18px; text-align: center; padding: 12px 0; height: 42px; box-sizing: border-box;}
.centercon{ display: flex; height: 80px; width: 100%; justify-content: center; align-items: center;
box-sizing: border-box; }
.centercon2{ margin-top: 18px; height: 380px; padding: 0 28px 14px 28px; }
.flexli{ display: flex; width: 100%; border-bottom: 1px dashed #ccc; margin-bottom: 4px;}
.flexli:last-child{
  border-bottom: none;
}
.flexli span{ display: block; margin:  10px 0;text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;}
.flexlispan1{ flex: 1; text-align: left;}
.flexlispan2{ flex: 0 0 120px; text-align: right; }
.apimngpopbox{
  display: flex; margin-bottom:16px
}
.apimngpopbox .box1{ width: 200px;}
.apimngpopbox .box2{ flex: 1; text-align: left;}
.nodata4{  color: #888 ;margin: 20px auto; text-align: center; padding-top: 130px;}
/deep/.urlsearchbox .el-input__inner{ height: 30px; line-height: 30px;}
/deep/.urlsearchbox .el-button{ height: 30px;}
.attribox{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.attribox .api{
  flex: 1;
}
.attribox .attr{
  width: 85px;
  text-align: right;
}
#orgIpPieContainer,#orgIpPieContainer2{
  width: 100%;
  height: 310px;
  padding: 10px;
  box-sizing: border-box;
}
</style>
