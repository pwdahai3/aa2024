<!-- location高级指令 -->
<template>
  <div>
    <el-dialog width="75%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <h1 class="directiveTitle">{{$t('lg.gaojipeiz')}}</h1>
        <table>
          <tbody>
            <tr>
              <td>{{$t('lg.specialtype')}}</td>
              <td>
                <p v-if="view.shadow_sub_filter_types.length==0" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot" v-for="(item,index) in view.shadow_sub_filter_types" :key="index">
                    <span class="s1">·&nbsp; {{item[0]}}</span> 
                   <span class="s2">
                    <!-- <a href="javascript:;" class="edit-del-a" @click="addEditDct_1_DialogShow('shadow_sub_filter_types',true,item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
                    <a href="javascript:;" class="edit-del-a" @click="deletDirectivenew('shadow_sub_filter_types',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </span>
                  </li>
                </ul>
              </td>
              <td width="60" align="center">
                <!-- <a href="javascript:;" class="edita" @click="header_DialogShownew('shadow_sub_filter_types')">编辑</a>  -->
                <el-button size="mini" @click="header_DialogShownew('shadow_sub_filter_types')">{{$t('lg.edit')}}</el-button>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.headercompletion')}}</td>
              <td>
                <p v-if="view.add_header.length==0" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot" v-for="(item,index2) in view.add_header" :key="index2">
                   <span class="s1">·&nbsp; {{item[0]}}</span> 
                   <span class="s2">
                    <!-- <a href="javascript:;" class="edit-del-a" @click="addEditDct_1_DialogShow('add_header',true,item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
                    <a href="javascript:;" class="edit-del-a" @click="deletDirectivenew('add_header',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </span>
                  </li>
                </ul>
              </td>
              <td width="60" align="center">
                <!-- <a href="javascript:;" class="edita" @click="header_DialogShownew('add_header')">编辑</a>  -->
                <el-button size="mini" @click="header_DialogShownew('add_header')">{{$t('lg.edit')}}</el-button>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.headeredit')}}</td>
              <td>
                <p v-if="view.shadow_modify_header.length==0" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot" v-for="(item,index3) in view.shadow_modify_header" :key="index3">
                    <span class="s1">·&nbsp; {{item[0]}}</span> 
                   <span class="s2">
                    <!-- <a href="javascript:;" class="edit-del-a" @click="addEditDct_1_DialogShow('shadow_modify_header',true,item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
                    <a href="javascript:;" class="edit-del-a" @click="deletDirectivenew('shadow_modify_header',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </span>
                  </li>
                </ul>
              </td>
              <td width="60" align="center">
                <!-- <a href="javascript:;" class="edita" @click="header_DialogShownew('shadow_modify_header')">编辑</a>  -->
                <el-button size="mini" @click="header_DialogShownew('shadow_modify_header')">{{$t('lg.edit')}}</el-button>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.shoudongdlsz')}}</td>
              <td>
                <p v-if="!requestTimeDctform.requestTimeVal" class="nodata">{{$t('lg.nodata')}}</p>
                <p v-else>{{requestTimeDctform.requestTimeVal}}</p>
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="shadow_request_time_shownew()">编辑</a> -->
                <el-button size="mini" @click="shadow_request_time_shownew()">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.browserParams')}}</td>
              <td>
                <p v-if="!verifyBrowserDctform.verifyBrowserVal" class="nodata">{{$t('lg.nodata')}}</p>
               <p v-else>{{verifyBrowserDctform.verifyBrowserVal}}</p> 
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="shadow_verify_browser_shownew()">编辑</a> -->
              <el-button size="mini" @click="shadow_verify_browser_shownew()">{{$t('lg.edit')}}</el-button>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.userBhIndct')}}</td>
              <td>
                <p v-if="!verifyAgentDctform.verifyAgentVal" class="nodata">{{$t('lg.nodata')}}</p>
                <p v-else>{{verifyAgentDctform.verifyAgentVal}}</p>
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="shadow_verify_agentnew()">编辑</a> -->
                <el-button size="mini" @click="shadow_verify_agentnew()">{{$t('lg.edit')}}</el-button>
                
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.yonghuxwlj')}}</td>
              <td>
                <p v-if="!requestreturnSwitch" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot">{{$t('lg.shubiaodjcs')}}：{{requestreturnform.clicktimes}}</li>
                  <li class="lidot">{{$t('lg.shubiaoydcs')}}：{{requestreturnform.movetimes}}</li>
                  <li class="lidot">{{$t('lg.jianpsrcs')}}：{{requestreturnform.presstimes}}</li>
                </ul>
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="userbehaviorinterceptnew()">编辑</a> -->
                <el-button size="mini" @click="userbehaviorinterceptnew()">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.proxyPassfn')}}</td>
              <td>
                <p v-if="!proxyPassSwitch" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot">{{$t('lg.zidingyiups')}}：{{proxyPassDctform.proxyUpstream || '--'}}</li>
                  <li class="lidot">{{$t('lg.customizeproxypass')}}：{{proxyPassDctform.proxyPass || '--'}}</li>
                  <li class="lidot">{{$t('lg.protocol')}}：{{proxyPassDctform.proxyHttp}}</li>
                </ul>
              </td>
              <td width="60" align="center">
                 <el-button size="mini" @click="proxypss_Shownew()">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.wangzhanml')}}</td>
              <td>
                <p v-if="!lcRootData.root" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot">
                    <span class="s1">{{lcRootData.root}}</span>
                  <span class="s2">
                    <a href="javascript:;" class="edit-del-a" @click="delLcRoot"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </span></li>
                </ul>
              </td>
              <td width="60" align="center">
                 <el-button size="mini" @click="addEditRootDialogShow()" :disabled="lcRootData.root!==''">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.jstrong')}}</td>
              <td>
                <span v-if="insertJsDctform.insertJsType==3">{{$t('lg.bucharu')}}</span>
                <span v-if="insertJsDctform.insertJsType==2">{{$t('lg.zegqiangcr')}}</span>
                <span v-if="insertJsDctform.insertJsType==1">{{$t('lg.putongcharu')}}</span>
                <!-- {{insertJsDctform.insertJsType|jsinsertchange}} -->
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="jsinsertnew()">编辑</a> -->
                 <el-button size="mini" @click="jsinsertnew()">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>{{$t('lg.maxbodysize')}}</td>
              <td>
                <p v-if="!lcBodysize.bodySize" class="nodata">{{$t('lg.nodata')}}</p>
                <ul v-else>
                  <li class="lidot">
                    <span class="s1">{{lcBodysize.bodySize}}</span>
                  <span class="s2">
                    <a href="javascript:;" class="edit-del-a" @click="submitLcBodysize_delete"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </span></li>
                </ul>
              </td>
              <td width="60" align="center">
                 <el-button size="mini" @click="addEditBodysizeDialogShow()" :disabled="lcBodysize.bodySize!=''">{{$t('lg.edit')}}</el-button>
                </td>
            </tr>
            <tr>
              <td>拦截频率</td>
              <td>
                <p v-if="!verifyBrowserDctform2.verifyBrowserVal2" class="nodata">{{$t('lg.nodata')}}</p>
               <p v-else>{{verifyBrowserDctform2.verifyBrowserVal2 | frecntys}}</p> 
              </td>
              <td align="center">
                <!-- <a href="javascript:;" class="edita" @click="shadow_verify_browser_shownew()">编辑</a> -->
              <el-button size="mini" @click="shadow_verify_browser_shownew2()">{{$t('lg.edit')}}</el-button>
              <el-button style="margin-left:0;margin-top:2px;" size="mini" @click="deleteFrecy">关闭</el-button>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.dongtaizwgn')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.shadow_verify_token" @change="shadow_verify_tokenS"></el-switch> -->
                <el-switch v-model="verifyTokenDctform.verifyTokenVal" @change="submitDirective('verifyTokenDctform','shadow_verify_token')"></el-switch>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.bodyenfun')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.shadow_encrypt_key"></el-switch> -->
                <el-switch v-model="encryptKeySwitch" @change="submitDirective('encryptKeyDctform','shadow_encrypt_key')"></el-switch>
              </td>
  
            </tr>
            <tr>
              <td>{{$t('lg.cookiefcfhgn')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.shadow_verify_cookie_md5"></el-switch> -->
                <el-switch v-model="verifyCookieMd5Dctform.verifyCookieMd5Val" @change="submitDirective('verifyCookieMd5Dctform','shadow_verify_cookie_md5')"></el-switch>
              </td>

            </tr>
            <tr>
              <td>{{$t('lg.jujuetouyugn')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.shadow_set_reject_header"></el-switch> -->
                <el-switch v-model="setRejectHeaderDctform.setRejectHeaderVal" @change="submitDirective('setRejectHeaderDctform','shadow_set_reject_header')"></el-switch>
              </td>
   
            </tr>
            
            <tr>
              <td>{{$t('lg.jujuefw')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.accessdenied"></el-switch> -->
                <el-switch v-model="accessdenyform.accessdenyVal" @change="submitLcAccessdeny"></el-switch>
              </td>
      
            </tr>
            <tr>
              <td>{{$t('lg.saomiaofygn')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.botConf"></el-switch> -->
                <el-switch v-model="botconfDctform.botconfVal" @change="submitLcBotconf"></el-switch>
              </td>
       
            </tr>
            <tr>
              <td>{{$t('lg.cansjmqzyz')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.paramverify"></el-switch> -->
                <el-switch v-model="paramverifyform.paramverify" @change="submitLcParamverify"></el-switch>
              </td>
            
            </tr>
            <tr>
              <td>{{$t('lg.shadowcookieyz')}}</td>
              <td colspan="2">
                <el-switch v-model="defenseCookieDctform.defenseCookieVal" @change="submitLcDefenseCookie2"></el-switch>
                <!-- <el-switch v-model="view.shadowDynamicCookie"></el-switch> -->
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.websocketsupport')}}</td>
              <td colspan="2">
                <!-- <el-switch v-model="view.webSocket"></el-switch> -->
                <el-switch v-model="webSocketDctform.webSocketVal" @change="submitLcWebsocket"></el-switch>
              </td>
            </tr>
            <tr>
              <td>{{$t('lg.accesssplvctrl')}}</td>
              <td colspan="2">
                <el-switch v-model="apiVerify" @change="doApiVerify"></el-switch>
              </td>
            </tr>
            <tr>
              <td>自动化工具拦截</td>
              <td colspan="2">
                <el-switch v-model="webdriverswitch" @change="doWebdriverswitch"></el-switch>
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
      <loading v-show="getDirectiveLoading"></loading>
    </el-dialog>

  <!-- 新的 -->
    <el-dialog width="75%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="addDct_1_DialogVisiblenew" :close-on-click-modal="false" :before-close="addDct_1_DialogClose">
      <el-row>
        <el-col :span="12">
          <el-form ref="directive_1_form" :model="directive_1_form" :rules="directive_1_formRules" :label-width="$store.state.isencn=='en'?'160px':'150px'" style="margin-right:30px">
            <el-form-item :label="directive_1_lab" prop="directive_1_val">
              <el-select style="width:100%;" v-model.trim="directive_1_form.directive_1_val" filterable allow-create clearable :placeholder="$t('lg.select')">
                <el-option
                  v-for="item in directive_1_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addDirective_1_List('directive_1_form')">{{$t('lg.addconfig')}}</el-button>
              <el-button @click="addDct_1_DialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div>
            <p class="nodata-box" v-show="directive_1_List.length==0">{{$t('lg.nodata')}}</p>
            <div v-show="directive_1_List.length>0" class="directiveListBox">
              <table>
                <thead>
                  <tr>
                    <th>{{directive_1_lab}}</th>
                    <th width="44"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in directive_1_List">
                    <td>{{item.directive_1_val}}</td>
                    <td class="text-center font-red fsize-12 cursor-pointer" @click="delDirective_1_List(item)">{{$t('lg.delete')}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="margin-tb text-right"><el-button type="primary" @click="submitDirective('directive_1_form',directive_1_form.directive_1_type)">{{$t('lg.confirm')}}</el-button></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <loading v-show="addDctLoading"></loading>
    </el-dialog>
<!-- shadow_request_time_shownew -->
<el-dialog width="65%" :title="$t('lg.jstrong')" :visible.sync="jsinsert_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
<div class="seniorDctBox2">
              <el-form ref="insertJsDctform" :model="insertJsDctform" label-width="130px">
                <el-form-item :label="$t('lg.jszcfs')" prop="insertJsType">
                  <el-radio v-model="insertJsDctform.insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="insertJsDctform.insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="insertJsDctform.insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitDirective('insertJsDctform','shadow_insert_js_ex')">{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>

<el-dialog width="65%" :title="$t('lg.proxyPassfn')" :visible.sync="proxypass_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
<div class="seniorDctBox2">
  <el-form ref="proxyPassDctform" :model="proxyPassDctform" :rules="proxypassDctformRules" label-width="140px">
                <el-form-item :label="$t('lg.kaiqiproxyps')" prop="defenseCookieVal">
                  <el-switch v-model="proxyPassSwitch" :title="proxyPassSwitch?$t('lg.clickoff'):''" @change="switchEvent(proxyPassSwitch,'proxyPass','ProxyPass功能')"></el-switch>
                </el-form-item>
                 <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.protocol')" prop="proxyHttp">
                    <el-select v-model="proxyPassDctform.proxyHttp" style="width:50%">
                        <template>
                          <el-option label="http" value="http"></el-option>
                          <el-option label="https" value="https"></el-option>
                        </template>
                      </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('lg.customizeproxypass')" prop="proxyPass"> 
                    <el-input v-model.trim="proxyPassDctform.proxyPass" placeholder="/proxypass" :disabled="locationObj.type=='suffixMatch'" :style="locationObj.type=='suffixMatch'?'width:90%':'width:100%'"></el-input>
                    <el-popover
                      v-show="locationObj.type=='suffixMatch'"
                      placement="top-start"
                      :title="$t('lg.zhu')+'：'"
                      width="200"
                      trigger="hover"
                      :content="$t('lg.zhu3')">
                      <i slot="reference" style="margin-left:5px;width:6px" class="cursor-pointer el-icon-warning"></i>
                    </el-popover>
                  </el-form-item>
                  <el-form-item :label="$t('lg.zidingyiups')" prop="proxyUpstream">
                    <el-select v-model="proxyPassDctform.proxyUpstream" clearable :placeholder="$t('lg.select')" @visible-change="getUpstream($event)" :loading="getUpstreamLoading" style="width:70%">
                      <el-option 
                        v-for="item in upstreamOptArr"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="submitLcProxyPass">{{proxyPassSwitch?$t('lg.edit'):$t('lg.yes')}}</el-button>
                </el-form-item>
  </el-form>
</div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="65%" :title="$t('lg.browserParams')" :visible.sync="shadow_verify_browser_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
  <div class="seniorDctBox2">
              <el-form ref="verifyBrowserDctform" :model="verifyBrowserDctform" :rules="verifyBrowserDctformRules" label-width="90px">
                <div class="block">
                    <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 190px':'0 0 120px')}">{{$t('lg.canshuzhib')}}</div>
                    <div class="sli">
                      <el-slider v-model="verifyBrowserDctform.verifyBrowserVal" :max="7" show-stops show-tooltip></el-slider>
                    </div>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="editDctEnsure2('verifyBrowserDctform')" v-if="directiveData.length>0">{{$t('lg.edit')}}</el-button>
                  <el-button type="primary" @click="validSubmitDirective2('verifyBrowserDctform','shadow_verify_browser')" v-else>{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>

<el-dialog width="65%" title="拦截频率" :visible.sync="shadow_verify_browser_show2" :close-on-click-modal="false" :before-close="shadow_request_time_showClose2">
  <div class="seniorDctBox2">
              <el-form ref="verifyBrowserDctform2" :model="verifyBrowserDctform2" :rules="verifyBrowserDctformRules2" label-width="90px">
                <div class="block">
                    <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 190px':'0 0 120px')}">拦截频率</div>
                    <div class="sli">
                      <el-slider v-model="verifyBrowserDctform2.verifyBrowserVal2" :min="1" :max="10" show-stops show-tooltip  :format-tooltip="formatTooltip"></el-slider>
                    </div>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="editDctEnsure2('verifyBrowserDctform2')">{{$t('lg.edit')}}</el-button>
                  <!-- <el-button type="primary" @click="validSubmitDirective2('verifyBrowserDctform2','shadow_verify_browser2')" v-else>{{$t('lg.yes')}}</el-button> -->
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="editDctLoading"></loading>
</el-dialog>

<el-dialog width="65%" :title="$t('lg.shoudongdlsz')" :visible.sync="shadow_request_time_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
  <div class="seniorDctBox2">
              <el-form ref="requestTimeDctform" :model="requestTimeDctform" :rules="requestTimeDctformRules"  :label-width="$store.state.isencn=='en'?'220px':'125px'">
                <el-form-item :label="$t('lg.kaiqishoudongdlsz')">
                  <el-switch v-model="requestTimeSwitch" @change="switchEvent(requestTimeSwitch,'shadow_request_time','手动代理防御')"></el-switch>
                </el-form-item>
                <div class="orderBoxJamb">
                      <el-form-item :label="$t('lg.canssz')" prop="requestTimeVal">
                        <el-input v-model.trim="requestTimeDctform.requestTimeVal"></el-input>
                      </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="editDctEnsure('requestTimeDctform')" v-if="directiveData.length>0">{{$t('lg.edit')}}</el-button>
                  <el-button type="primary" @click="validSubmitDirective('requestTimeDctform','shadow_request_time')" v-else>{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div> 
  <loading v-show="addDctLoading"></loading>
</el-dialog>
<el-dialog width="65%" :title="$t('lg.userBhIndct')" :visible.sync="shadow_verify_agent_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
<div class="seniorDctBox2">
              <el-form ref="verifyAgentDctform" :model="verifyAgentDctform" :rules="verifyAgentDctformRules" label-width="90px">
                <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 190px':'0 0 120px')}">{{$t('lg.userBhIndct')}}</div>
                      <div class="sli">
                        <el-slider v-model="verifyAgentDctform.verifyAgentVal" :max="3" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                <el-form-item>
                  <el-button type="primary" @click="editDctEnsure2('verifyAgentDctform')" v-if="directiveData.length>0">{{$t('lg.edit')}}</el-button>
                  <el-button type="primary" @click="validSubmitDirective2('verifyAgentDctform','shadow_verify_agent')" v-else>{{$t('lg.save')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>


<el-dialog width="65%" :title="$t('lg.yonghuxwlj')" :visible.sync="userbehaviorintercept_show" :close-on-click-modal="false" :before-close="shadow_request_time_showClose">
   <div class="seniorDctBox2">
              <el-form ref="requestreturnform" :model="requestreturnform" :rules="requestreturnformRules" :label-width="$store.state.isencn=='en'?'220px':'120px'">
                <el-form-item :label="$t('lg.kaiqixwljgn')">
                  <el-switch v-model="requestreturnSwitch" @change="switchEvent(requestreturnSwitch,'shadow_request_return','开启行为拦截功能')"></el-switch>
                </el-form-item>
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
                  <!-- <el-button type="primary" @click="validSubmitDirective('requestreturnform','shadow_request_return')" v-else>{{$t('lg.yes')}}</el-button> -->
                </el-form-item>
              </el-form>
            </div>
  <loading v-show="addDctLoading"></loading>
</el-dialog>
    <!-- 增加指令弹框 特殊文件类型、header补全、header修改 -->
    <el-dialog width="65%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="addDct_1_DialogVisible" :close-on-click-modal="false" :before-close="addDct_1_DialogClose">
      <el-row>
        <el-col :span="12">
          <el-form ref="directive_1_form" :model="directive_1_form" :rules="directive_1_formRules" label-width="110px" style="margin-right:30px">
            <el-form-item :label="directive_1_lab" prop="directive_1_val">
              <el-select style="width:100%;" v-model.trim="directive_1_form.directive_1_val" filterable allow-create clearable :placeholder="$t('lg.select')">
                <el-option
                  v-for="item in directive_1_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addDirective_1_List('directive_1_form')">{{$t('lg.addconfig')}}</el-button>
              <el-button @click="addDct_1_DialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <div>
            <p class="nodata-box" v-show="directive_1_List.length==0">{{$t('lg.nodata')}}</p>
            <div v-show="directive_1_List.length>0" class="directiveListBox">
              <table>
                <thead>
                  <tr>
                    <th>{{directive_1_lab}}</th>
                    <th width="44"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in directive_1_List">
                    <td>{{item.directive_1_val}}</td>
                    <td class="text-center font-red fsize-12 cursor-pointer" @click="delDirective_1_List(item)">{{$t('lg.delete')}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="margin-tb text-right"><el-button type="primary" @click="submitDirective('directive_1_form',directive_1_form.directive_1_type)">{{$t('lg.confirm')}}</el-button></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <loading v-show="addDctLoading"></loading>
    </el-dialog>

    <!-- 编辑指令弹框 特殊文件类型、header补全、header修改 -->
    <el-dialog width="45%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="editDct_1_DialogVisible" :close-on-click-modal="false" :before-close="editDct_1_DialogClose">
      <el-form ref="editDirective_1_form" :model="editDirective_1_form" :rules="editDirective_1_formRules" label-width="110px">
        <el-form-item :label="directive_1_lab" prop="directive_1_val">
          <el-select style="width:100%;" v-model.trim="editDirective_1_form.directive_1_val" filterable allow-create clearable :placeholder="$t('lg.select')">
            <el-option
              v-for="item in directive_1_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editDctEnsure('editDirective_1_form')">{{$t('lg.yes')}}</el-button>
          <el-button @click="editDct_1_DialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editDctLoading"></loading>
    </el-dialog>

    <!-- 编辑指令弹框 网站目录  -->
    <el-dialog width="45%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShowRootDialog" :close-on-click-modal="false" :before-close="rootDialogClose">
      <el-form ref="rootDctform" :model="rootDctform" :rules="rootDctformRules" label-width="120px">
        <el-form-item :label="$t('lg.wangzhanml')"  prop="rootVal">
          <el-input v-model.trim="rootDctform.rootVal" placeholder="/root"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcRoot">{{$t('lg.save')}}</el-button>
          <el-button @click="rootDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="rootAddEditLoading"></loading>
    </el-dialog>

<el-dialog width="45%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.nameTxt" :visible.sync="isShowBodyzieDialog" :close-on-click-modal="false" :before-close="bodysizeDialogClose">
      <el-form ref="maxbodysizeform" :model="maxbodysizeform" :rules="bodysizeformRules" label-width="140px">
          <el-form-item :label="$t('lg.maxbodysize')"  prop="bodySize">
          <el-input v-model.trim="maxbodysizeform.bodySize" placeholder="单位：G/M/K"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitLcBodysize()">{{$t('lg.save')}}</el-button>
          <el-button @click="bodysizeDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="bodysizeAddEditLoading"></loading>
    </el-dialog>

    <gptloading ref="gptloading"></gptloading>
  </div>
</template>

<script>
import axios from 'axios';
import * as types from '@/store/types';
import loading from '@/components/loading/loading';
import gptloading from '@/components/loading/gptloading';
import {SERVER_API_URL} from '@/conf/constvar';
import getLocationInstruct from './lc_instruct.js';

export default {
  components:{
    loading,
    gptloading
  },
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    }, 
    isShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    },
    domainObj:{
      type:Object
    },
    locationObj:{
      type:Object
    }
  },
  data(){
    return{
      bodysizeUnit:'M',
      bodysizeOps:['G','M','K'],
      view:{
        accessdenied:null,
        botConf:null,
        paramverify:null,
        proxyPass:null,
        root:null,
        shadowDynamicCookie:null,
        webSocket:null,
        shadow_sub_filter_types:[],
        add_header:[],
        shadow_modify_header:[],
        shadow_request_time:'',
        shadow_verify_browser:'',
        shadow_verify_agent:'',
        userbehaviorintercept:{
          clickCount:null,
          moveCount:null,
          inputCount:null
        },
        shadow_verify_token:null,
        shadow_encrypt_key:null,
        shadow_verify_cookie_md5:null,
        shadow_set_reject_header:null,
        insertJsType:'3',
        insertJsTypeV:'不插入',
        proxyPass:{}
      },
      shadow_request_time_show:false,
      shadow_verify_browser_show:false,
      shadow_verify_browser_show2:false,
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
      verifyBrowserDctform2:{
        verifyBrowserVal2:null
      },
      verifyBrowserDctformRules2:{
        verifyBrowserVal2:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        //  {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
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

      //动态指纹功能
      verifyTokenDctform:{
        verifyTokenVal:false
      },

      // 动态URI功能
      // uriDecryptedDctform:{
      //   uriDecryptedVal:false
      // },

      //body加密功能
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

      //js增强功能
      insertJsDctform:{
        insertJsType:'3'
      },

      // Js Cookie验证功能
      mustHaveCookieDctform:{
        mustHaveCookieVal:false
      },

      //以下功能，都有单独接口
      // 扫描工具防御功能
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
      apiVerify:false,
      webdriverswitch:false,
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
      proxypassDctformRules:{
        proxyPass:[
          {pattern:/^\/([^\u4e00-\u9fa5\s])*$/, message: this.$t('lg.reg1'), trigger: 'blur'} //proxyPass 
        ]  
      },
      getUpstreamLoading:false,

      //网站目录
      rootUrl:'', //root单独接口
      lcRootData:{},
      lcBodysize:{},
      isShowRootDialog:false,
      isShowBodyzieDialog:false,
      rootDctform:{
        rootVal:'',
      },
      maxbodysizeform:{
        bodySize:'',
      },
      rootDctformRules:{
        rootVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ]
      },
      bodysizeformRules:{
        bodySize:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      rootAddEditLoading:false,
      bodysizeAddEditLoading:false
      
    }
  },
  mounted(){
   // this.getLocView();
    if(this.isAuto){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
    }else if(this.isEditConfig){
      this.url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
    }else{
      this.url=SERVER_API_URL+"pe/shadow/domain/location/directive";
    }
  },
  filters:{
    jsinsertchange(a){
      return a=='1'?this.$t('lg.putongcharu'):a=='2'?"this.$t('lg.zegqiangcr')":a=='3'?this.$t('lg.bucharu'):''
    },
    frecntys(val){
      return val*10+"%"
    }
  },
  methods:{
     formatTooltip(val) {
        return val*10+"%";
      },
    deleteFrecy(){
      const _this=this;
      let snodeId=_this.shadowObj.snodeId;
          let domainName=_this.domainObj.domainName;
          let domainPort=_this.domainObj.port;
          let locationName=encodeURI(_this.locationObj.name);
          let locationType=_this.locationObj.type;
          var url=SERVER_API_URL+"pe/shadow/domain/location/interceptfrequency?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
        axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
        }})
    },
    proxypss_Shownew(){
      this.proxypass_show=true;
    },
    jsinsertnew(){
      this.jsinsert_show=true;
    },
    userbehaviorinterceptnew(){
      this.getLocView();
    //  this.handleChange('shadow_request_return')
      this.userbehaviorintercept_show=true;
    },
    shadow_verify_agentnew(){
      this.getLocView();
      this.handleChange('shadow_verify_agent')
      this.shadow_verify_agent_show=true;
    },
    shadow_verify_browser_shownew(){
      this.getLocView();
      this.handleChange('shadow_verify_browser')
      this.shadow_verify_browser_show=true;
    },
    shadow_verify_browser_shownew2(){
      this.getLocView();
      this.handleChange('shadow_verify_browser2')
      this.shadow_verify_browser_show2=true;
    },
    shadow_request_time_shownew(){
      this.getLocView();
      this.handleChange('shadow_request_time')
      this.shadow_request_time_show=true;
    },
    getLocView(){
      return new Promise((resolve,reject)=>{
        const snodeId=this.shadowObj.snodeId;
        const url=SERVER_API_URL+'pe/shadow/location/view';
        axios.get(url,{
          params:{
            snodeId:snodeId,
            domainName:this.domainObj.domainName,
            domainPort:this.domainObj.port,
            locationName:this.locationObj.name,
            locationType:this.locationObj.type
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
           // console.log(res)
            
            let resdata=res.data.data;
            let tgData=resdata.directive;
            this.verifyBrowserDctform2.verifyBrowserVal2=resdata.interceptFrequency && resdata.interceptFrequency.interceptFrequency;
           // console.log(this.verifyBrowserDctform2.verifyBrowserVal2)
           // this.view.accessdenied=resdata.accessdenied.accessdenied=="on"?true:false;
            this.accessdenyform.accessdenyVal=resdata.accessdenied.accessdenied=="on"?true:false;
           // this.view.botConf=resdata.botConf.botConf=="on"?true:false;
            this.botconfDctform.botconfVal=resdata.botConf.botConf=="on"?true:false;
            //this.view.paramverify=resdata.paramverify.paramverify=="on"?true:false;
            this.paramverifyform.paramverify=resdata.paramverify.paramverify=="on"?true:false;
          // this.view.shadowDynamicCookie=resdata.shadowDynamicCookie.shadow_server_cookie=="on"?true:false;
          this.defenseCookieDctform.defenseCookieVal=resdata.shadowDynamicCookie.shadow_server_cookie=="on"?true:false;
         //  this.view.webSocket=resdata.webSocket.webSocket=="on"?true:false;
           this.webSocketDctform.webSocketVal=resdata.webSocket.webSocket=="on"?true:false;
           this.apiVerify=resdata.apiVerify.apiVerify=="on"?true:false;
           this.webdriverswitch=resdata.autoToolIntercept.autoToolIntercept=="on"?true:false;
          //  this.view.userbehaviorintercept=resdata.userbehaviorintercept;
          let userbehaviorinterceptD=resdata.userbehaviorintercept;
          this.lcRootData=resdata.root;
          this.lcBodysize=resdata.bodySize || {};
 
            if(!userbehaviorinterceptD){
              this.requestreturnSwitch=false;
            }else{
              this.requestreturnSwitch=true;
              this.requestreturnform.clicktimes=userbehaviorinterceptD.clickCount;
              this.requestreturnform.movetimes=userbehaviorinterceptD.moveCount;
              this.requestreturnform.presstimes=userbehaviorinterceptD.inputCount;
            }

           // this.view.proxyPass=resdata.proxyPass;
           let resData1=resdata.proxyPass;
           if(resData1){
            if(resData1.protocol){
              this.proxyPassSwitch=true;
              this.proxyPassDctform.proxyHttp=resData1.protocol;
              this.proxyPassDctform.proxyPass=resData1.path;
              this.proxyPassDctform.proxyUpstream=resData1.domain;
            }
           }else{
            this.proxyPassSwitch=false;
            this.proxyPassDctform.proxyHttp='http';
            this.proxyPassDctform.proxyPass='';
            this.proxyPassDctform.proxyUpstream='';
          }

        var shadowsubTypeV=[],addHeaderV=[],shadowmodifyheaderV=[];

      for(var i=0;i<tgData.length;i++){
          const tgdataI=tgData[i];
          if(tgdataI.hasOwnProperty("shadow_sub_filter_types")){//特殊文件类型
            const tgiArr=tgdataI["shadow_sub_filter_types"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            shadowsubTypeV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("add_header")){//Header补全
            const tgiArr=tgdataI["add_header"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            addHeaderV.push([decodeArr.join(" ")]);
          }else if(tgdataI.hasOwnProperty("shadow_modify_header")){//Header修改
            const tgiArr=tgdataI["shadow_modify_header"].split("|");
            let decodeArr=[];
            for(var j=0;j<tgiArr.length-1;j++){
              decodeArr.push(Base64.decode(tgiArr[j]));
            }
            shadowmodifyheaderV.push([decodeArr.join(" ")]);
          }
        }
        this.view.shadow_sub_filter_types=shadowsubTypeV;
        this.view.add_header=addHeaderV; 
        this.view.shadow_modify_header=shadowmodifyheaderV;


            let shadow_request_time=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_request_time")
            });
            if(shadow_request_time){
              let shadow_request_timeV=shadow_request_time.shadow_request_time.slice(0, -1);
              shadow_request_timeV=Base64.decode(shadow_request_timeV);
              this.view.shadow_request_time=shadow_request_timeV;
              ////for old
              this.requestTimeSwitch=true;
              this.requestTimeDctform.requestTimeVal=shadow_request_timeV.match(/(\d*)(\w*)/)[1];
              this.requestTimeUnit=shadow_request_timeV.match(/(\d*)(\w*)/)[2];
            }else{
              //this.view.shadow_request_time="";
              this.requestTimeSwitch=false;
              this.requestTimeDctform.requestTimeVal=0
            }
            


            let shadow_verify_browser=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_verify_browser")
            });
            if(shadow_verify_browser){
              let shadow_verify_browserV=shadow_verify_browser.shadow_verify_browser.slice(0, -1);
              shadow_verify_browserV=Base64.decode(shadow_verify_browserV);
            //  this.view.shadow_verify_browser=shadow_verify_browserV;
              ///for old
              this.verifyBrowserSwitch=true;
              this.verifyBrowserDctform.verifyBrowserVal=parseInt(shadow_verify_browserV) ;
            }else{
             // this.view.shadow_verify_browser=""
             this.verifyBrowserDctform.verifyBrowserVal=0
            }
            

            let shadow_verify_agent=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_verify_agent")
            });
            if(shadow_verify_agent){
              let shadow_verify_agentV=shadow_verify_agent.shadow_verify_agent.slice(0, -1);
            shadow_verify_agentV=Base64.decode(shadow_verify_agentV);
           // this.view.shadow_verify_agent=shadow_verify_agentV;
            /////
              this.verifyAgentSwitch=true;
              this.verifyAgentDctform.verifyAgentVal=parseInt(shadow_verify_agentV);
            }else{
            //  this.view.shadow_verify_agent="";
              this.verifyAgentDctform.verifyAgentVal=0
            }
            


            let shadow_verify_token=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_verify_token")
            });
            if(shadow_verify_token){
              let shadow_verify_tokenV=shadow_verify_token.shadow_verify_token.slice(0, -1);
            shadow_verify_tokenV=Base64.decode(shadow_verify_tokenV);
           // this.view.shadow_verify_token=shadow_verify_tokenV?true:false;
            this.verifyTokenDctform.verifyTokenVal=shadow_verify_tokenV?true:false;
            }
            


            let shadow_encrypt_key=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_encrypt_key")
            });
            if(shadow_encrypt_key){
              let shadow_encrypt_keyV=shadow_encrypt_key.shadow_encrypt_key.slice(0, -1);
            shadow_encrypt_keyV=Base64.decode(shadow_encrypt_keyV);
           // this.view.shadow_encrypt_key=shadow_encrypt_keyV?true:false;
           this.encryptKeySwitch=shadow_encrypt_keyV?true:false;
            }
            


            let shadow_verify_cookie_md5=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_verify_cookie_md5")
            });
            if(shadow_verify_cookie_md5){
            //  console.log(1212)
              
              let shadow_verify_cookie_md5V=shadow_verify_cookie_md5.shadow_verify_cookie_md5.slice(0, -1);
            shadow_verify_cookie_md5V=Base64.decode(shadow_verify_cookie_md5V);
            //this.view.shadow_verify_cookie_md5=shadow_verify_cookie_md5V?true:false;
            this.verifyCookieMd5Dctform.verifyCookieMd5Val=shadow_verify_cookie_md5V?true:false;
            //console.log(this.verifyCookieMd5Dctform.verifyCookieMd5Val)
            }
            


            let shadow_set_reject_header=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_set_reject_header")
            });
            if(shadow_set_reject_header){
              let shadow_set_reject_headerV=shadow_set_reject_header.shadow_set_reject_header.slice(0, -1);
            shadow_set_reject_headerV=Base64.decode(shadow_set_reject_headerV);
           // this.view.shadow_set_reject_header=shadow_set_reject_headerV?true:false;
            this.setRejectHeaderDctform.setRejectHeaderVal=shadow_set_reject_headerV?true:false;
            }
            

            let shadow_sub_filter=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_sub_filter")
            });
            let shadow_insert_js_ex=tgData.find((item)=>{
              return item.hasOwnProperty("shadow_insert_js_ex")
            });
            let insertJsTypeV=shadow_sub_filter?'1':shadow_insert_js_ex?'2':'3';
           // this.view.insertJsTypeV=insertJsTypeV=='1'?'普通插入':insertJsTypeV=='2'?'增强插入':'不插入';
            this.insertJsDctform.insertJsType=insertJsTypeV;
            resolve(resdata)
          }else{
            reject("error")
          }
        }).catch((err)=>{
          console.log(err);
          reject("error");
        }); 

      })

    },
    findDirctiveItem(arr,type){
      arr.find((item)=>{
        return item.hasOwnProperty(type)
      })
    },
    handleChange(val){//获取高级配置数据
   // console.log(val)
      if(val){
        if(val=='botconf'){
          this.getBotconfData();
        }else if(val=='webSocket'){
          this.getLcWebsocketData();
        }else if(val=='defenseCookie'){
          this.getLcDefenseCookieData();
        }else if(val=='proxyPass'){
          this.getLcProxyPassData();
        }else if(val =='root'){
          this.getLcRootData();
        }else if(val=="accessdeny"){
          this.getLcAccessdeny();
        }else if(val=="paramverify"){
          this.getLcParamverify();
        }else if(val=='shadow_insert_js_ex'){
          this.getJsEnchanceHandler();
        }else if(val=='shadow_request_return'){
          this.getReturn()
        }
        else{//调用统一接口的高级配置
          getLocationInstruct(this,{shadowObj:this.shadowObj,domainObj:this.domainObj,locationObj:this.locationObj},false,val,this.isAuto,this.isEditConfig).then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
            this.directiveData=[];//清空
            this.directiveData=resolvedata;
         //   console.log(resolvedata)
            
            if(val=='shadow_request_time'){//手动代理防御设置
              if(resolvedata.length>0){
                const requestTimeData=resolvedata[0][0];
                // console.log(requestTimeData);
                this.requestTimeSwitch=true;
                this.requestTimeDctform.requestTimeVal=requestTimeData.match(/(\d*)(\w*)/)[1];
                this.requestTimeUnit=requestTimeData.match(/(\d*)(\w*)/)[2];
              }
            }else if(val=='shadow_verify_browser'){//浏览器参数指标
              if(resolvedata.length>0){
                const verifyBrowserData=resolvedata[0][0];
               // console.log("----")
               //  console.log(verifyBrowserData)
                this.verifyBrowserSwitch=true;
                this.verifyBrowserDctform.verifyBrowserVal=parseInt(verifyBrowserData) ;
              }
            }else if(val=='shadow_verify_agent'){//用户行为指标
              if(resolvedata.length>0){
                const verifyAgentData=resolvedata[0][0];
                this.verifyAgentSwitch=true;
                this.verifyAgentDctform.verifyAgentVal=parseInt(verifyAgentData);
              }
            }else if(val=='shadow_verify_token'){//动态指纹功能
              if(resolvedata.length>0){
                const verifyTokenData=resolvedata[0];
                this.verifyTokenDctform.verifyTokenVal=verifyTokenData=='1'?true:false;
              }
            }
            // else if(val=='shadow_uri_decrypted'){//动态URI功能
            //   if(resolvedata.length>0){
            //     const uriDecryptedData=resolvedata[0];
            //     this.uriDecryptedDctform.uriDecryptedVal=uriDecryptedData=='on'?true:false;
            //   }
            // }
            else if(val=='shadow_encrypt_key'){//body加密功能
              if(resolvedata.length>0){
                const encryptKeyData=resolvedata[0][0];
                this.encryptKeySwitch=true;
                this.encryptKeyDctform.encryptKeyVal=encryptKeyData;
              }
            }else if(val=='shadow_verify_cookie_md5'){//Cookie 篡改防护功能
              if(resolvedata.length>0){
                const verifyCookieMd5=resolvedata[0];
                this.verifyCookieMd5Dctform.verifyCookieMd5Val=verifyCookieMd5=='1'?true:false;
              }
            }else if(val=='shadow_set_reject_header'){//拒绝头域名功能
              if(resolvedata.length>0){
                const setRejectHeader=resolvedata[0];
                this.setRejectHeaderDctform.setRejectHeaderVal=setRejectHeader=='on'?true:false;
              }
            }
            else if(val=='shadow_must_have_cookie'){//Js Cookie验证功能
              if(resolvedata.length>0){
                const mustHaveCookie=resolvedata[0];
                this.mustHaveCookieDctform.mustHaveCookieVal=mustHaveCookie=='on'?true:false;
              }
            }
          });
        }
      }
    },
    getReturn(){
      const snodeId=this.shadowObj.snodeId;
      let url='';
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/domain/location/userbehaviorintercept";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/domain/location/userbehaviorintercept?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/domain/location/userbehaviorintercept";
      } 
      axios.get(url,{
        params:{
          snodeId:snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        let resdata=res.data.data;
        if(!resdata){
          this.requestreturnSwitch=false;
        }else{
          this.requestreturnSwitch=true;
          this.requestreturnform.clicktimes=resdata.clickCount;
          this.requestreturnform.movetimes=resdata.moveCount;
          this.requestreturnform.presstimes=resdata.inputCount;
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getJsEnchanceHandler(){
      const snodeId=this.shadowObj.snodeId;
      let url='';
      if(this.isAuto){
        url=SERVER_API_URL+"directive";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"directive?savedConfig=true";
      }else{
        url=SERVER_API_URL+"directive";
      } 
      axios.get(url,{
        params:{
          snodeId:snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        let resdata=res.data.data;
        if(resdata.length==0){
          this.insertJsDctform.insertJsType='3';
        }else{
          if(resdata[0].hasOwnProperty("shadow_sub_filter")){
            this.insertJsDctform.insertJsType='1';
          }else if(resdata[0].hasOwnProperty("shadow_insert_js_ex")){
            this.insertJsDctform.insertJsType='2';
          }
        }
      }).catch((err)=>{
        console.log(err)
      });

    },
    getBotconfData(){//扫描工具防御功能
      let [snodeId,domainName,domainPort,locationName,locationType]=[this.shadowObj.snodeId, this.domainObj.domainName, this.domainObj.port, this.locationObj.name, this.locationObj.type];
      locationName=locationType=='suffixMatch'?encodeURI(locationName):locationName;
   
      if(this.isAuto){
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(this.isEditConfig){
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        this.botconfUrl=SERVER_API_URL+"pe/shadow/domain/location/botconf?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }
   
      axios.get(this.botconfUrl).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          if(resData.botConf=='on'){
            this.botconfDctform.botconfVal=true;
          }else{
            this.botconfDctform.botconfVal=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcDefenseCookieData2(){//Shadow Cookie验证功能
      const snodeId=this.shadowObj.snodeId;
      let url='';
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
            domainName:this.domainObj.domainName,
            domainPort:this.domainObj.port,
            locationName:this.locationObj.name,
            locationType:this.locationObj.type
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
    getLcDefenseCookieData(){//Shadow Cookie验证功能
      const snodeId=this.shadowObj.snodeId;
      let url='';
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?autoconfig=true";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location";
      } 
      axios.get(url,{
        params:{
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
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
          if(resData.shadow_server_cookie=="on"){
            this.defenseCookieDctform.defenseCookieVal=true;
          }else{
            this.defenseCookieDctform.defenseCookieVal=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcWebsocketData(){//webSocket支持
      if(this.isAuto){
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket?autoconfig=true";
      }else if(this.isEditConfig){
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket?savedConfig=true";
      }else{
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket";
      }
      axios.get(this.webSocketUrl,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          if(resData.webSocket=='on'){
            this.webSocketDctform.webSocketVal=true;
          }else{
            this.webSocketDctform.webSocketVal=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcAccessdeny(){
      let url="";
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/domain/location/accessdenied?autoconfig=true";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/domain/location/accessdenied?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/domain/location/accessdenied";
      }
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          if(resData.accessdenied=='on'){
            this.accessdenyform.accessdenyVal=true;
          }else{
            this.accessdenyform.accessdenyVal=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcParamverify(){
      let url="";
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/domain/location/paramverify?autoconfig=true";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/domain/location/paramverify?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/domain/location/paramverify";
      }
      axios.get(url,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          if(resData.paramverify=='on'){
            this.paramverifyform.paramverify=true;
          }else{
            this.paramverifyform.paramverify=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcProxyPassData(){//proxyPass功能
      var domainName=this.domainObj.domainName,domainPort=this.domainObj.port,
          locationName=this.locationObj.name,locationType=this.locationObj.type,
          snodeId=this.shadowObj.snodeId;
      if(locationType=='suffixMatch'){//传入url里要编译
        locationName = encodeURI(locationName)
      }     

      if(this.isAuto){
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(this.isEditConfig){
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }

      axios.get(this.proxyPassUrl).then((res)=>{
        if(res.data.responseCode==0){
          var resData=res.data.data?res.data.data:{};
          if(resData.protocol){
            this.proxyPassSwitch=true;
            this.proxyPassDctform.proxyHttp=resData.protocol;
            this.proxyPassDctform.proxyPass=resData.path;
            this.proxyPassDctform.proxyUpstream=resData.domain;
          }else{
            this.proxyPassSwitch=false;
            this.proxyPassDctform.proxyHttp='http';
            this.proxyPassDctform.proxyPass='';
            this.proxyPassDctform.proxyUpstream='';
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcRootData(){//获取Location Root数据
      const _this=this;
      if(_this.isAuto){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?autoconfig=true";
      }else if(_this.isEditConfig){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?savedConfig=true";
      }else{
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root";
      }
      axios.get(_this.rootUrl,{
        params:{
          snodeId:_this.shadowObj.snodeId,
          domainName:_this.domainObj.domainName,
          domainPort:_this.domainObj.port,
          locationName:_this.locationObj.name,
          locationType:_this.locationObj.type
        }
      }).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          _this.lcRootData=resData;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },
    getLcBodysizeData(){//获取Location Root数据
      const _this=this;
      let url=SERVER_API_URL+"pe/shadow/domain/location/bodysize"
      axios.get(url,{
        params:{
          snodeId:_this.shadowObj.snodeId,
          domainName:_this.domainObj.domainName,
          domainPort:_this.domainObj.port,
          locationName:_this.locationObj.name,
          locationType:_this.locationObj.type
        }
      }).then((res)=>{
        console.log("----ttt--")
         console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          _this.lcBodysize=resData;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    },

    directiveDialogClose(){
      this.activeName='0';
      this.directiveData=[];//清空

      this.requestTimeSwitch=false;
    //  this.$refs['requestTimeDctform'].resetFields();

      this.verifyBrowserSwitch=false;
     // this.$refs['verifyBrowserDctform'].resetFields();

      this.verifyAgentSwitch=false;
    //  this.$refs['verifyAgentDctform'].resetFields();

    //  this.$refs['verifyTokenDctform'].resetFields();

      // this.$refs['uriDecryptedDctform'].resetFields();

      this.encryptKeySwitch=false;
      this.verifyCookieMd5Dctform.verifyCookieMd5Val=false;
      this.setRejectHeaderDctform.setRejectHeaderVal=false;
      this.accessdenyform.accessdenyVal=false;
      this.botconfDctform.botconfVal=false;
      this.paramverifyform.paramverify=false;
      this.defenseCookieDctform.defenseCookieVal=false;
      this.webSocketDctform.webSocketVal=false;
      this.verifyTokenDctform.verifyTokenVal=false;
     // this.$refs['encryptKeyDctform'].resetFields();

     // this.$refs['verifyCookieMd5Dctform'].resetFields();

    //  this.$refs['setRejectHeaderDctform'].resetFields();

     // this.$refs['insertJsDctform'].resetFields();

     // this.$refs['mustHaveCookieDctform'].resetFields();

     // this.$refs['botconfDctform'].resetFields();

     // this.$refs['defenseCookieDctform'].resetFields();
      
     // this.$refs['webSocketDctform'].resetFields();

      this.proxyPassSwitch=false;
    //  this.$refs['proxyPassDctform'].resetFields();

      this.lcRootData={};//清空
      this.$emit("setbylcSeniorInstructmodal",false);
    },

    header_DialogShownew(type){//显示添加 or 编辑弹框 flag为true时表示编辑
      if(type=='shadow_sub_filter_types'){
        this.directive_1_lab=this.$t('lg.specialtype');
        const optList=[{
                value: 'Content-Type text/html',
                label: 'Content-Type text/html'
              },
              {
                value: 'Content-Type text/plain',
                label: 'Content-Type text/plain'
              }, 
              {
                value: 'Content-Type application/json',
                label: 'Content-Type application/json'
              }];
        this.directive_1_options=optList;
      }else if(type=='add_header'){
        this.directive_1_lab=this.$t('lg.headercompletion');
        const optList=[{
                value: 'Content-Type text/html',
                label: 'Content-Type text/html'
              },
              {
                value: 'Content-Type text/plain',
                label: 'Content-Type text/plain'
              }, 
              {
                value: 'Content-Type application/json',
                label: 'Content-Type application/json'
              },
              {
                value: 'Cache-Control no-cache',
                label: 'Cache-Control no-cache'
              }];
        this.directive_1_options=optList;
      }else if(type=='shadow_modify_header'){
        this.directive_1_lab=this.$t('lg.headeredit');
        const optList=[{
                value: 'Cache-Control private always',
                label: 'Cache-Control private always'
              },
              {
                value: 'Cache-Control no-cache always',
                label: 'Cache-Control no-cache always'
              }, 
              {
                value: 'Cache-Control max-age always',
                label: 'Cache-Control max-age always'
              },
              {
                value: 'Cache-Control must-revalidate always',
                label: 'Cache-Control must-revalidate always'
              }];
        this.directive_1_options=optList;
      }
      this.directive_1_form.directive_1_type=type;
      this.addDct_1_DialogVisiblenew=true;
    },

    //增加、编辑
    //特殊文件类型、header补全、header修改
    addEditDct_1_DialogShow(type,flag,item){//显示添加 or 编辑弹框 flag为true时表示编辑
      if(type=='shadow_sub_filter_types'){
        this.directive_1_lab=this.$t('lg.specialtype');
        const optList=[{
                value: 'Content-Type text/html',
                label: 'Content-Type text/html'
              },
              {
                value: 'Content-Type text/plain',
                label: 'Content-Type text/plain'
              }, 
              {
                value: 'Content-Type application/json',
                label: 'Content-Type application/json'
              }];
        this.directive_1_options=optList;
      }else if(type=='add_header'){
        this.directive_1_lab=this.$t('lg.headercompletion');
        const optList=[{
                value: 'Content-Type text/html',
                label: 'Content-Type text/html'
              },
              {
                value: 'Content-Type text/plain',
                label: 'Content-Type text/plain'
              }, 
              {
                value: 'Content-Type application/json',
                label: 'Content-Type application/json'
              },
              {
                value: 'Cache-Control no-cache',
                label: 'Cache-Control no-cache'
              }];
        this.directive_1_options=optList;
      }else if(type=='shadow_modify_header'){
        this.directive_1_lab=this.$t('lg.headeredit');
        const optList=[{
                value: 'Cache-Control private always',
                label: 'Cache-Control private always'
              },
              {
                value: 'Cache-Control no-cache always',
                label: 'Cache-Control no-cache always'
              }, 
              {
                value: 'Cache-Control max-age always',
                label: 'Cache-Control max-age always'
              },
              {
                value: 'Cache-Control must-revalidate always',
                label: 'Cache-Control must-revalidate always'
              }];
        this.directive_1_options=optList;
      }
      if(flag){//编辑时
        // console.log(item)
        this.editDirective_1_Orgin.directive_1_type=type;
        this.editDirective_1_Orgin.directive_1_val=item[0];

        this.editDirective_1_form.directive_1_type=type;
        this.editDirective_1_form.directive_1_val=item[0];

        this.editDct_1_DialogVisible=true;
        this.editDct_1_DialogVisiblenew=true;
      }else{//新增时
        this.directive_1_form.directive_1_type=type;
      //  this.addDct_1_DialogVisible=true;
        this.editDct_1_DialogVisiblenew=true;
      }
    },
    addDirective_1_List(formname){//添加到预览列表 特殊文件类型、header补全、header修改
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const cmdData={
                  "subfilterType":this.directive_1_form.directive_1_type,
                  "directive_1_val":this.directive_1_form.directive_1_val
                };
          this.directive_1_List.push(cmdData);
        }
      });
    },
    delDirective_1_List(item){//从预览表格里删除
      this.directive_1_List.splice(this.directive_1_List.indexOf(item),1);
    },
    addDct_1_DialogClose(){//关闭添加指令弹框 特殊文件类型、header补全、header修改
      this.directive_1_List=[];
      this.$refs['directive_1_form'].resetFields();
      this.addDct_1_DialogVisible=false;
      this.addDct_1_DialogVisiblenew=false;
    },
    shadow_request_time_showClose(){
      this.shadow_request_time_show=false;
      this.shadow_verify_browser_show=false;
      this.shadow_verify_agent_show=false;
      this.userbehaviorintercept_show=false;
      this.shadow_verify_browser_show2=false;
     // this.verifyBrowserDctform2.verifyBrowserVal2=1
      this.proxypass_show=false;
      this.jsinsert_show=false;
      if(this.$refs['requestreturnform']){
        this.$refs['requestreturnform'].resetFields();
      }
      this.getLocView();
    },
    shadow_request_time_showClose2(){
      this.shadow_verify_browser_show2=false;
      this.verifyBrowserDctform2.verifyBrowserVal2=1
      this.getLocView();
    },
    editDct_1_DialogClose(){//关闭编辑指令弹框 特殊文件类型、header补全、header修改
      this.$refs['editDirective_1_form'].resetFields();
      this.editDct_1_DialogVisible=false;
    },

    //增加、编辑
    //网站目录添
    addEditRootDialogShow(val){//显示网站目录添加 or 编辑弹框
      if(val){//编辑
        this.rootDctform.rootVal=val;
      }
      this.isShowRootDialog=true;
    },
    addEditBodysizeDialogShow(val){
      // if(val){//编辑
      //   this.rootDctform.rootVal=val;
      // }
      this.isShowBodyzieDialog=true;
    },
    rootDialogClose(){//关闭网站目录添加 or 编辑弹框
      this.$refs['rootDctform'].resetFields();
      this.isShowRootDialog=false;
    },
    bodysizeDialogClose(){//关闭网站目录添加 or 编辑弹框
      this.$refs['maxbodysizeform'].resetFields();
      this.isShowBodyzieDialog=false;
    },

    //通过开关事件删除配置new
    switchEvent2(val,type,txt){//开关事件 手动代理防御设置
      let _this=this;
      if(!val){
        _this.$confirm("此操作将关闭‘"+txt+"’功能,是否继续？",_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{//删除
          if(type=='shadow_request_time'){ 
            _this.requestTimeDctform.requestTimeVal='';
           // _this.view.shadow_request_time='';
           // console.log(12)
           // console.log(_this.view.shadow_request_time)
            _this.deletDirective3('shadow_request_time',_this.view.shadow_request_time);
          }
        }).catch(()=>{
          if(type=='shadow_request_time'){
            _this.requestTimeSwitch=true;
          }
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        if(type=='shadow_request_time'){
          _this.requestTimeSwitch=false;
        }
        _this.$message.error("提交下面的参数，将自动开启开关");
      }
    },

    //通过开关事件删除配置
    switchEvent(val,type,txt){//开关事件 手动代理防御设置
      let _this=this;
      if(!val){
        _this.$confirm("此操作将关闭‘"+txt+"’功能,是否继续？",_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{//删除
          if(type=='shadow_request_time'){ 
            _this.requestTimeDctform.requestTimeVal='';
           // _this.view.shadow_request_time='';
          //  console.log(12)
            _this.deletDirective('shadow_request_time',_this.directiveData);
         //  baseV=Base64.encode(_this.view.shadow_request_time)
          //  _this.deletDirective11('shadow_request_time',[{"shadow_request_time":baseV}]);
          }else if(type=='shadow_verify_browser'){
            _this.deletDirective('shadow_verify_browser',_this.directiveData);
          }else if(type=='shadow_verify_agent'){
            _this.deletDirective('shadow_verify_agent',_this.directiveData);
          }else if(type=='shadow_encrypt_key'){
            _this.deletDirective('shadow_encrypt_key',_this.directiveData);
          }else if(type=='proxyPass'){
            _this.deletProxyPass();
          }else if(type=='shadow_request_return'){
            _this.returndelte();
          }
        }).catch(()=>{
          if(type=='shadow_request_time'){
            _this.requestTimeSwitch=true;
          }else if(type=='shadow_verify_browser'){
            _this.verifyBrowserSwitch=true;
          }else if(type=='shadow_verify_agent'){
            _this.verifyAgentSwitch=true;
          }else if(type=='shadow_encrypt_key'){
            _this.encryptKeySwitch=true;
          }else if(type=='proxyPass'){
            _this.proxyPassSwitch=true;
          }else if(type=='shadow_request_return'){
            _this.requestreturnSwitch=true;
          }
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        if(type=='shadow_request_time'){
          _this.requestTimeSwitch=false;
        }else if(type=='shadow_verify_browser'){
          _this.verifyBrowserSwitch=false;
        }else if(type=='shadow_verify_agent'){
          _this.verifyAgentSwitch=false;
        }else if(type=='shadow_encrypt_key'){
          _this.encryptKeySwitch=false;
        }else if(type=='proxyPass'){
          _this.proxyPassSwitch=false;
        }else if(type=='shadow_request_return'){
          _this.requestreturnSwitch=false;
        }
        _this.$message.error("提交下面的参数，将自动开启开关");
      }
    },
    validSubmitDirective2(formname,type){//确认增加 需经过表单验证
      this.$refs[formname].validate((valid) => {
        if (valid) {
          if(formname=='verifyAgentDctform'){
            if(this.verifyAgentDctform.verifyAgentVal==0){
              this.deletDirective('shadow_verify_agent',this.directiveData);
            }else{
              this.submitDirective2(formname,type)
            }             
          }else if(formname=='verifyBrowserDctform'){
            if(this.verifyBrowserDctform.verifyBrowserVal==0){
              this.deletDirective('shadow_verify_browser',this.directiveData);
            }else{
              this.submitDirective2(formname,type)
            }
          }
        
        }
      })
    },
    submitDirective2(formname,type){
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
      // console.log(directivesArr)
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
          _this.getLocView();
          _this.shadow_request_time_showClose();
          _this.handleChange(type);
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    //增加配置、设置配置
    validSubmitDirective(formname,type){//确认增加 需经过表单验证
      this.$refs[formname].validate((valid) => {
        if (valid) {
          this.submitDirective(formname,type)
        }
      })
    },
    submitDirective(formname,type){//确认增加
      const _this=this;
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
      // console.log(directivesArr)
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
          _this.getLocView();
          _this.handleChange(type);
          if(formname=='directive_1_form'){
            _this.addDct_1_DialogClose();
          }
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    submitLcBotconf(){//开启或者关闭 扫描工具防御功能
    let [snodeId,domainName,domainPort,locationName,locationType]=[this.shadowObj.snodeId, this.domainObj.domainName, this.domainObj.port, this.locationObj.name, this.locationObj.type];
      locationName=locationType=='suffixMatch'?encodeURI(locationName):locationName;
   
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
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitLcDefenseCookie2(){//开启或者关闭Shadow Cookie验证功能
      const _this=this;
      _this.getLcDefenseCookieData2().then((resovledata)=>{
      //  console.log(resovledata)
if(!resovledata){//该location对应的shadow节点上的Shadow Cookie验证功能开启才能设置location的Shadow Cookie验证功能
        _this.$message.error(_this.$t('lg.dynamiccookieconfigtips'));
        _this.defenseCookieDctform.defenseCookieVal=false;
        return;
      }
      var domainName=_this.domainObj.domainName,domainPort=_this.domainObj.port,
          locationName=_this.locationObj.name,locationType=_this.locationObj.type,
          snodeId=_this.shadowObj.snodeId;
      if(locationType=='suffixMatch'){//传入url里要编译
        locationName = encodeURI(locationName)
      } 
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
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
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
      });
      
    },
    submitLcDefenseCookie(){//开启或者关闭Shadow Cookie验证功能
      const _this=this;
      if(!_this.defenseCookieFlag){//该location对应的shadow节点上的Shadow Cookie验证功能开启才能设置location的Shadow Cookie验证功能
        _this.$message.error(_this.$t('lg.dynamiccookieconfigtips'));
        _this.defenseCookieDctform.defenseCookieVal=false;
        return;
      }
      var domainName=_this.domainObj.domainName,domainPort=_this.domainObj.port,
          locationName=_this.locationObj.name,locationType=_this.locationObj.type,
          snodeId=_this.shadowObj.snodeId;
      if(locationType=='suffixMatch'){//传入url里要编译
        locationName = encodeURI(locationName)
      } 
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"/location?domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
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
        }else{
          this.$refs.gptloading.hideLoading();
          _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
        }
      }).catch((err)=>{
        this.$refs.gptloading.hideLoading();
        console.log(err);
      });
    },
    doWebdriverswitch(){
      
      let url="";
      let snodeId=this.shadowObj.snodeId,
        domainName=this.domainObj.domainName,
        domainPort=this.domainObj.port,
        locationName=this.locationObj.name,
        locationType=this.locationObj.type;
      url=SERVER_API_URL+"pe/shadow/domain/location/autotoolintercept?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+encodeURI(locationName)+"&locationType="+locationType;
      const onoff=this.webdriverswitch==true?"on":"off";
     // this.$refs.gptloading.showLoading();
      this.$store.state.contentLoading=true;
      axios.patch(url,{ 
        autoToolIntercept:onoff,
      }).then((res)=>{
        if(res.data.responseCode==0){
        this.$store.state.contentLoading=false;
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
        this.$store.state.contentLoading=false;
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
       this.$store.state.contentLoading=false;
        console.log(err);
      });
    },
    doApiVerify(){
      let url="";
      let snodeId=this.shadowObj.snodeId,
        domainName=this.domainObj.domainName,
        domainPort=this.domainObj.port,
        locationName=this.locationObj.name,
        locationType=this.locationObj.type;
      url=SERVER_API_URL+"pe/shadow/domain/location/apiverify?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+encodeURI(locationName)+"&locationType="+locationType;
      const onoff=this.apiVerify==true?"on":"off";
      this.$refs.gptloading.showLoading();
      axios.patch(url,{ 
        apiVerify:onoff,
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$refs.gptloading.hideLoading();
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });

    },
    submitLcWebsocket(){//开启或者关闭web socket支持
    if(this.isAuto){
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket?autoconfig=true";
      }else if(this.isEditConfig){
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket?savedConfig=true";
      }else{
        this.webSocketUrl=SERVER_API_URL+"pe/shadow/domain/location/websocket";
      }
      const onoff=this.webSocketDctform.webSocketVal==true?"on":"off";
      axios.patch(this.webSocketUrl,{
        snodeId:this.shadowObj.snodeId,
        domainName:this.domainObj.domainName,
        domainPort:this.domainObj.port,
        locationName:this.locationObj.name,
        locationType:this.locationObj.type,
        webSocket:onoff,
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitLcAccessdeny(){
       let url="";
       let snodeId=this.shadowObj.snodeId,
        domainName=this.domainObj.domainName,
        domainPort=this.domainObj.port,
        locationName=this.locationObj.name,
        locationType=this.locationObj.type;
        locationName=locationType=='suffixMatch'?encodeURI(locationName):locationName;
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
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    submitLcParamverify(){
      let url="";
       let snodeId=this.shadowObj.snodeId,
        domainName=this.domainObj.domainName,
        domainPort=this.domainObj.port,
        locationName=this.locationObj.name,
        locationType=this.locationObj.type;
        locationName=locationType=='suffixMatch'?encodeURI(locationName):locationName;
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
        }else{
          this.$message.error(this.$t('lg.failed')+': '+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err);
      });
    },
    getUpstream(callback){//设置poxypass时获取Upstream
      if(callback){
        this.getUpstreamLoading=true;
        var snodeId=this.shadowObj.snodeId;
        var url='';// 查询当前所有业务节点
        if(this.isAuto){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId+"?savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/upstream/"+snodeId;
        }
        axios.get(url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            const resArray = res.data.data?res.data.data:[];
            let upstreamList=[];
            resArray.forEach(ele=>{
              upstreamList.push({
                value:ele.upstream
              })
            })
            this.upstreamOptArr=upstreamList;
          }else{
            this.$message.error('操作失败: '+ res.data.data.message);
          }
          this.getUpstreamLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      }
    },
    submitLcProxyPass(){//设置、更改proxyPass功能
      var _this=this;
      var domainName=this.domainObj.domainName,domainPort=this.domainObj.port,
          locationName=this.locationObj.name,locationType=this.locationObj.type,
          snodeId=this.shadowObj.snodeId;
      if(locationType=='suffixMatch'){//传入url里要编译
        locationName = encodeURI(locationName)
      }     

      if(this.isAuto){
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&autoconfig=true";
      }else if(this.isEditConfig){
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType+"&savedConfig=true";
      }else{
        this.proxyPassUrl=SERVER_API_URL+"pe/shadow/domain/location/proxypass?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
      }
      _this.$refs['proxyPassDctform'].validate((valid) => {
        if (valid) {
          _this.addDctLoading=true;
          axios.patch(_this.proxyPassUrl,{
            protocol: _this.proxyPassDctform.proxyHttp,   
            domain: _this.proxyPassDctform.proxyUpstream,
            path: _this.proxyPassDctform.proxyPass
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.proxyPassSwitch=true;
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.addDctLoading=false;
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    submitLcRoot(){//添加/编辑Location Root
     const _this=this;
      if(_this.isAuto){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?autoconfig=true";
      }else if(_this.isEditConfig){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?savedConfig=true";
      }else{
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root";
      }
      this.$refs['rootDctform'].validate((valid) => {
        if (valid) {
          var _this=this;
          _this.rootAddEditLoading=true;
          axios.patch(_this.rootUrl,{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            root:_this.rootDctform.rootVal,
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.getLcRootData();
              _this.rootDialogClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.rootAddEditLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    submitLcBodysize(){//添加/编辑Location Root  
     const _this=this;
      this.$refs['maxbodysizeform'].validate((valid) => {
        if (valid) {
          let snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port,
            locationName=_this.locationObj.name,
            locationType=_this.locationObj.type,
            bodySize=_this.maxbodysizeform.bodySize;
          const url=SERVER_API_URL+`pe/shadow/domain/location/bodysize?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationType=${locationType}&locationName=${locationName}&bodySize=${bodySize}`;
          _this.bodysizeAddEditLoading=true;
          axios.patch(url).then((res)=>{
            if(res.data.responseCode==0){
              _this.getLcBodysizeData();
              _this.bodysizeDialogClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.bodysizeAddEditLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    submitLcBodysize_delete(){
     const _this=this;
          let snodeId=_this.shadowObj.snodeId,
            domainName=_this.domainObj.domainName,
            domainPort=_this.domainObj.port,
            locationName=_this.locationObj.name,
            locationType=_this.locationObj.type,
            bodySize="";
          const url=SERVER_API_URL+`pe/shadow/domain/location/bodysize?snodeId=${snodeId}&domainName=${domainName}&domainPort=${domainPort}&locationType=${locationType}&locationName=${locationName}&bodySize=${bodySize}`;
          this.$refs.gptloading.showLoading();
          axios.patch(url).then((res)=>{
            if(res.data.responseCode==0){
              _this.getLcBodysizeData();
             // _this.bodysizeDialogClose();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
           this.$refs.gptloading.hideLoading();
          }).catch((err)=>{
            console.log(err);
          });
    },
    returndelte(){
      const _this=this;
      _this.$confirm("此操作将关闭此功能,是否继续？",_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          let snodeId=_this.shadowObj.snodeId;
          let domainName=_this.domainObj.domainName;
          let domainPort=_this.domainObj.port;
          let locationName=encodeURI(_this.locationObj.name);
          let locationType=_this.locationObj.type;
          var url=SERVER_API_URL+"pe/shadow/domain/location/userbehaviorintercept?snodeId="+snodeId+"&domainName="+domainName+"&domainPort="+domainPort+"&locationName="+locationName+"&locationType="+locationType;
        axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.requestreturnform.clicktimes="";
          this.requestreturnform.movetimes="";
          this.requestreturnform.presstimes="";
          this.getReturn();
        }else{
          this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      })
        })
    },
    returnSubmit(formname){
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;
          let snodeId=_this.shadowObj.snodeId;
          let domainName=_this.domainObj.domainName;
          let domainPort=_this.domainObj.port;
          let locationName=encodeURI(_this.locationObj.name);
          let locationType=_this.locationObj.type;
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
              _this.getLocView();
            //  _this.handleChange(directiveName);
            //  _this.editDctDialogClose(formname);
            }else{
              _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    deleteVerifyAgent(){
      if(this.verifyAgentDctform.verifyAgentVal==0){
        this.deletDirective('shadow_verify_agent',this.directiveData);
      }
    },
    editDctEnsure2Common(formname){//确认修改
          const _this=this;
          _this.editDctLoading=true;
          let directiveName='';
          var srcdictatedata = "";
          var dstdictatedata= "";

          if(formname=='verifyBrowserDctform'){//浏览器参数指标
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.verifyBrowserDctform.verifyBrowserVal);
            directiveName='shadow_verify_browser';
          }else if(formname=='verifyAgentDctform'){//用户行为指标
            srcdictatedata=Base64.encode(_this.directiveData[0][0]);//directiveData保存了原始数据
            dstdictatedata=Base64.encode(_this.verifyAgentDctform.verifyAgentVal);
            directiveName='shadow_verify_agent';
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
              _this.shadow_request_time_showClose();
              _this.editDctDialogClose(formname);
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })     
    },
    editDctEnsure2Common2(formname){//确认修改
          const _this=this;
          _this.editDctLoading=true;
          let directiveName='';
          let intercyval=parseInt(_this.verifyBrowserDctform2.verifyBrowserVal2) || 1;
        const url=SERVER_API_URL+"pe/shadow/domain/location/interceptfrequency?snodeId="+_this.shadowObj.snodeId+"&domainName="+_this.domainObj.domainName+"&domainPort="+_this.domainObj.port+"&locationName="+_this.locationObj.name+"&locationType="+_this.locationObj.type+"&interceptFrequency="+intercyval;
          axios.patch(url,{
            // snodeId:_this.shadowObj.snodeId,
            // domainName:_this.domainObj.domainName,
            // domainPort:_this.domainObj.port,
            // locationName:_this.locationObj.name,
            // locationType:_this.locationObj.type,
            // interceptFrequency: parseInt(_this.verifyBrowserDctform2.verifyBrowserVal2) 
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.handleChange(directiveName);
              _this.getLocView();
              _this.shadow_request_time_showClose();
              _this.editDctDialogClose(formname);
            }else{
              _this.$message.error(_this.$t('lg.failed')+'：'+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })     
    },
    editDctEnsure2(formname){//确认修改
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          _this.editDctLoading=true;
          if(formname=='verifyBrowserDctform'){
            if(this.verifyBrowserDctform.verifyBrowserVal==0){
              _this.deletDirective('shadow_verify_browser',this.directiveData);
            }else{
                _this.editDctEnsure2Common('verifyBrowserDctform')
            } 
          }else if(formname=='verifyBrowserDctform2'){
            _this.editDctEnsure2Common2('verifyBrowserDctform2')
          }else if(formname=='verifyAgentDctform'){
            if(this.verifyAgentDctform.verifyAgentVal==0){
              _this.deletDirective('shadow_verify_agent',this.directiveData);
            }else{
                _this.editDctEnsure2Common('verifyAgentDctform')
            } 
          }
        }
      })
    },

    //编辑
    editDctEnsure(formname){//确认修改
      // console.log(formname)
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
         // this.deleteVerifyAgent();/////////////////////10-1
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
              _this.$message.error(_this.$t('lg.failed')+'。输入的指令不匹配，请核对输入内容！'+ res.data.data.message);
            }
            _this.editDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    editDctDialogClose(formname){//关闭编辑指令弹框 特殊文件类型、header补全、header修改
      // console.log(formname)
      if(formname=='editDirective_1_form'){
        this.editDct_1_DialogVisible=false;
        this.$refs[formname].resetFields();
      }
    },
  //new
    deletDirectivenew(type,item){
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
      if(type=='shadow_insert_js_ex'){//因为插入两个js 如果删除Js增强功能,则需同时删掉两条指令，两条shadow_insert_js_ex(这里第二个shadow_insert_js_ex写死)
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
      
      }else{
        _this.getDirectiveLoading=true;
        const srcdictateType=type;
        const delItem = Object.assign([],item);//克隆对象  delItem=item;改变了原对象
        var basevitem=Base64.encode(delItem.join(" "));
       
        directivesObj[srcdictateType]=basevitem;
        directivesArr.push(directivesObj);
      }
      
     // return new Promise((resolve,reject)=>{
        axios.delete(_this.url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:directivesArr
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            if(type!='shadow_insert_js_ex'){
              _this.handleChange(type);
              _this.getLocView();
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }
          }else{
            _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
          }
          _this.getDirectiveLoading=false;
         // resolve();
        }).catch((err)=>{
          console.log(err)
        })
      //})
    },

    deletDirective4(type,item){
     // console.log(item)
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
      _this.getDirectiveLoading=true;
        const srcdictateType=type;
        const delItem = Object.assign([],item);//克隆对象  delItem=item;改变了原对象
       // var basevitem=Base64.encode(delItem.join(""));
       
        directivesObj[srcdictateType]=delItem;
        directivesArr.push(directivesObj);
      
      return new Promise((resolve,reject)=>{
        axios.delete(_this.url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:[{
                "shadow_verify_token": "MQ=="
              }]

          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            if(type!='shadow_insert_js_ex'){
             // _this.handleChange(type);
              _this.getLocView();
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

    //删除333
    deletDirective3(type,item){
     // console.log(item)
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
      _this.getDirectiveLoading=true;
        const srcdictateType=type;
        const delItem = Object.assign([],item);//克隆对象  delItem=item;改变了原对象
        var basevitem=Base64.encode(delItem.join(""));
       
        directivesObj[srcdictateType]=basevitem;
        directivesArr.push(directivesObj);
      
      return new Promise((resolve,reject)=>{
        axios.delete(_this.url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:directivesArr
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            if(type!='shadow_insert_js_ex'){
             // _this.handleChange(type);
              _this.getLocView();
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

    //删除
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
             // _this.handleChange(type);
              _this.getLocView();
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

    //删除
    deletDirective(type,item){
      const _this=this;
      var directivesObj = {}, 
          directivesArr = [];
      if(type=='shadow_insert_js_ex'){//因为插入两个js 如果删除Js增强功能,则需同时删掉两条指令，两条shadow_insert_js_ex(这里第二个shadow_insert_js_ex写死)
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
      
      }else{
        _this.getDirectiveLoading=true;
        const srcdictateType=type;
        const delItem = Object.assign([],item);//克隆对象  delItem=item;改变了原对象
        var basevitem=Base64.encode(delItem.join(" "));
       
        directivesObj[srcdictateType]=basevitem;
        directivesArr.push(directivesObj);
      }
      
      return new Promise((resolve,reject)=>{
        axios.delete(_this.url,{
          data:{
            snodeId:_this.shadowObj.snodeId,
            domainName:_this.domainObj.domainName,
            domainPort:_this.domainObj.port,
            locationName:_this.locationObj.name,
            locationType:_this.locationObj.type,
            directives:directivesArr
          }
        }).then((res)=>{
          if(res.data.responseCode==0){
            if(type!='shadow_insert_js_ex'){
             // _this.handleChange(type);
              _this.getLocView();
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
    deletProxyPass(){//删除proxyPass功能 单独接口
      axios.delete(this.proxyPassUrl).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.getLcProxyPassData();
        }else{
          this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    delLcRoot(){//删除Location Root 单独接口
     const _this=this;
      if(_this.isAuto){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?autoconfig=true";
      }else if(_this.isEditConfig){
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root?savedConfig=true";
      }else{
        _this.rootUrl=SERVER_API_URL+"pe/shadow/domain/location/root";
      }
      axios.delete(this.rootUrl,{
        params:{
          snodeId:this.shadowObj.snodeId,
          domainName:this.domainObj.domainName,
          domainPort:this.domainObj.port,
          locationName:this.locationObj.name,
          locationType:this.locationObj.type
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.getLcRootData();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
    }
  }
}
</script>

<style scoped>

.directiveTitle{
  font-size: 18px; 
  color: #333; 
  margin:5px 0 15px;
}
.seniorDctBox{
  background: #f7f7f7;
  padding: 50px 12px 12px;
  position: relative;
}
.seniorDctBox2{
  background: #f7f7f7;
  padding: 30px 12px 12px;
  position: relative;
}
.addSeniorDctBtn{
  position: absolute;
  right: 12px;
  top: 12px;
}
/* .directiveListBox{
  max-height: 300px;
  overflow-y: auto;
} */

/*Js增强功能*/
.el-radio{
  margin: 5px 25px 5px 0px;
}
.block{
   display:flex
}
.tit{
  flex:0 0 120px;
  text-align:center;
  line-height:38px;
}
.sli{
flex:1
}

a.edita{ color: #333;}
a.edita:hover{ color: #000; text-decoration: underline;}
.lidot{margin: 12px 0; padding-bottom: 4px; display: flex; border-bottom: 1px dashed #ccc; }
.lidot span{ flex: 1; display: inline-block;}
.lidot span.s1{ flex: 1;}
.lidot span.s2{ flex:0 0 60px; text-align: right;}
.nodata{ font-size: 12px; color: #888;}               
</style>