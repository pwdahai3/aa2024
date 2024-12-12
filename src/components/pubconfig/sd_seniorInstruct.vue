<!-- shadow节点高级指令 -->
<template>
  <div>
    <el-dialog width="55%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="directiveDialogClose">
      <div class="directiveBox">
        <h1 class="directiveTitle">{{$t('lg.gaojipeiz')}}</h1>
        <el-collapse v-model="activeName" accordion @change="handleChange">
          <el-collapse-item :title="$t('lg.touyujygn')" name="shadow_verify_user_agent"><!--头域校验功能-->
            <div class="seniorDctBox">
              <el-form ref="verifyUserAgentDctform" :model="verifyUserAgentDctform" :label-width="$store.state.isencn=='en'?'240px':'125px'">
                <el-form-item :label="$t('lg.kaiqitouyujygn')" prop="verifyUserAgentVal">
                  <el-switch v-model="verifyUserAgentDctform.verifyUserAgentVal"></el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="validSubmitBlockDct('shadow_verify_user_agent',verifyUserAgentDctform.verifyUserAgentVal)">{{$t('lg.yes')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.jujuetouyucssz')" name="shadow_reject_header"><!--拒绝头域名参数设置-->
            <div class="seniorDctBox">
              <div class="orderBoxJamb">
                <el-form ref="rejectHeaderDctform" :model="rejectHeaderDctform" :rules="rejectHeaderDctformRules">
                  <el-form-item :label="$t('lg.jujuetouyucs')" prop="rejectHeaderVal">
                    <el-input v-model.trim="rejectHeaderDctform.rejectHeaderVal" style="width:60%;margin-right:10px"></el-input>
                    <el-button type="primary" size="mini" @click="validSubmitBlockDct('shadow_reject_header',rejectHeaderDctform.rejectHeaderVal,'rejectHeaderDctform')">{{$t('lg.tianjcs')}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="dataBox">
                <p class="nodata-box2" v-if="directiveData.length==0">{{$t('lg.nodata')}}</p>
                <table class="table-bg" v-else>
                  <thead>
                    <tr>
                      <th>{{$t('lg.touyumcs')}}</th>
                      <th width="110"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in directiveData">
                      <td>{{item.shadow_reject_header}}</td>
                      <td class="text-center">
                        <a href="javascript:;" class="edit-del-a" @click="editBlockDctDialogShow(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                        <a href="javascript:;" class="edit-del-a" @click="delBlockDirective('shadow_reject_header',item.shadow_reject_header)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-collapse-item>
           <!-- 独立接口功能 -->
          <el-collapse-item :title="$t('lg.ipbaimdgn')" name="shadow_white_ip" v-show="!isAuto && !isEditConfig"><!--IP白名单功能-->
            <div class="seniorDctBox">
              <el-form ref="whiteListform" :model="whiteListform" :rules="whiteListformRules">
                <el-form-item :label="$t('lg.kaiqiipbaimd')" prop="whiteListswitch">
                  <el-switch v-model="whiteListswitch" @change="whiteIpSwitchEvent()"></el-switch>
                </el-form-item>
                <div class="tips">
                  <p>{{$t('lg.zhu21')}}</p>
                  <p>{{$t('lg.zhu22')}}</p>
                  <p>{{$t('lg.zhu23')}}</p>
                </div>
                <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.ips')" prop="white_ip" :label-width="$store.state.isencn=='en'?'140px':'75px'">
                    <el-input type="textarea" :autosize="{ minRows: 4 }" v-model.trim="whiteListform.white_ip" style="width:60%;margin-right:10px"></el-input>
                    <el-button type="primary" size="mini" @click="submitWhiteList()">{{$t('lg.addwhite')}}</el-button>
                  </el-form-item>
                </div>
              </el-form>
              <div class="dataBox">
                <p class="nodata-box2" v-if="whiteIplistData.length==0">{{$t('lg.nodata')}}</p>
                <table class="table-bg" v-else>
                  <thead>
                    <tr>
                      <th>{{$t('lg.serialnumber')}}</th>
                      <th>{{$t('lg.ips')}}</th>
                      <th width="110"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in whiteIplistData">
                      <td>{{index+1}}</td>
                      <td>{{item}}</td>
                      <td class="text-center">
                        <a href="javascript:;" class="edit-del-a" @click="editWhiteIp(item,index)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                        <a href="javascript:;" class="edit-del-a" @click="delWhiteIp(index)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="wIpRemarkBox">
                <span class="wIpRemarkTxt">{{$t('lg.remark')}}：{{whiteIpListRemark?whiteIpListRemark:$t('lg.nomark')}}</span>
                <el-button class="wIpRemarkBtn" type="text" @click="showRemarkDialog" style="margin-left:20px">{{$t('lg.add')}}/{{$t('lg.edit')}}</el-button>
              </div>
            
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.ipxiangzhimd')" name="shadow_limit_ip"><!--IP黑名单功能-->
            <div class="seniorDctBox">
              <el-form ref="verifyLimitIpDctform" :model="verifyLimitIpDctform" :rules="verifyLimitIpDctformRules">
                <el-form-item :label="$t('lg.kaiqiipxiangzhimd')" prop="verifyLimitIpVal">
                  <el-switch v-model="verifyLimitIpDctform.verifyLimitIpVal" @change="limitIpSwitchEvent('shadow_verify_limit_ip',verifyLimitIpDctform.verifyLimitIpVal)"></el-switch>
                </el-form-item>
                <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.ips')" prop="limitIpVal" :label-width="$store.state.isencn=='en'?'140px':'75px'">
                    <el-input v-model.trim="verifyLimitIpDctform.limitIpVal" style="width:60%;margin-right:10px"></el-input>
                    <el-button type="primary" size="mini" @click="validSubmitBlockDct('shadow_limit_ip',verifyLimitIpDctform.limitIpVal,'verifyLimitIpDctform')">{{$t('lg.tianjipxiangzhimd')}}</el-button>
                  </el-form-item>
                </div>
              </el-form>
              <div class="dataBox">
                <p class="nodata-box2" v-if="directiveData.length==0">{{$t('lg.nodata')}}</p>
                <table class="table-bg" v-else>
                  <thead>
                    <tr>
                      <th>{{$t('lg.serialnumber')}}</th>
                      <th>{{$t('lg.ips')}}</th>
                      <th width="110"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in directiveData">
                      <td>{{index+1}}</td>
                      <td>{{item.shadow_limit_ip}}</td>
                      <td class="text-center">
                        <a href="javascript:;" class="edit-del-a" @click="editBlockDctDialogShow(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                        <a href="javascript:;" class="edit-del-a" @click="delBlockDirective('shadow_limit_ip',item.shadow_limit_ip)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.ipheimdgn')" name="shadow_black_ip"><!--IP黑名单功能-->
            <div class="seniorDctBox">
              <el-form ref="verifyBlackIpDctform" :model="verifyBlackIpDctform" :rules="verifyBlackIpDctformRules">
                <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.ips')" prop="blackIpVal" :label-width="$store.state.isencn=='en'?'140px':'75px'">
                    <el-input v-model.trim="verifyBlackIpDctform.blackIpVal" style="width:60%;margin-right:10px"></el-input>
                    <el-button type="primary" size="mini" @click="validSubmitBlackip('verifyBlackIpDctform')">{{$t('lg.tianjipheimd')}}</el-button>
                  </el-form-item>
                </div>
              </el-form>
              <div class="dataBox">
                <p class="nodata-box2" v-if="blackdirectiveData.length==0">{{$t('lg.nodata')}}</p>
                <table class="table-bg" v-else>
                  <thead>
                    <tr>
                      <th>{{$t('lg.serialnumber')}}</th>
                      <th>{{$t('lg.ips')}}</th>
                      <th width="110"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item,index) in blackdirectiveData">
                      <td>{{index+1}}</td>
                      <td>{{item.shadow_black_ip | toBase64}}</td>
                      <td class="text-center">
                        <a href="javascript:;" class="edit-del-a" @click="editBlackipDialogShow(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                        <a href="javascript:;" class="edit-del-a" @click="delBlackipDirective(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-collapse-item>

         

          <el-collapse-item :title="$t('lg.qingqiucssjsz')" name="agent_time"><!--请求超时时间-->
            <div class="seniorDctBox">
              <el-form ref="agtTimeoutform" :model="agtTimeoutform" :rules="agtTimeoutformRules">
                <el-form-item :label="$t('lg.kaiqiqqcssjtz')"> 
                  <el-switch
                    v-model="agtTimeoutSwitch"
                    :title="agtTimeoutSwitch?$t('lg.clickdel'):''"
                    @change="agtTimeSwitchEvent()">
                  </el-switch>
                </el-form-item>
                <div class="orderBoxJamb">
                  <el-row :gutter="10">
                    <el-col :span="16">
                      <el-form-item :label="$t('lg.qingqcssjtz')" prop="agtTimeoutVal" :label-width="$store.state.isencn=='en'?'220px':'140px'">
                        <el-input v-model="agtTimeoutform.agtTimeoutVal" :placeholder="$t('lg.requestime')"></el-input>
                      </el-form-item>
                    </el-col> 
                    <el-col :span="8">
                      <el-form-item>
                        <el-select v-model="agtTimeoutform.agtTimeoutUnit" :placeholder="$t('lg.select')">
                          <el-option
                            v-for="item in agtTimeoutform.agtTimeoutUnitOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col> 
                  </el-row> 
                </div>
                
                <el-form-item label-width="140px" >
                  <el-button type="primary" @click="submitAgtTimeout">{{agtTimeoutSwitch?$t('lg.edit'):$t('lg.save')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.jsjiamifhsz')" name="shadow_api"><!--Js加密防护设置-->
            <div class="seniorDctBox">
              <el-form :model="sdApiform" :rules="sdApiformRules" ref="sdApiform" label-width="60px">
                <el-form-item :label="$t('lg.turnonjsenfhgn')" label-width="240px"> 
                  <el-switch
                    v-model="sdApiSwitch"
                    :title="sdApiSwitch?$t('lg.clickoff'):''"
                    @change="sdApiSwitchEvent()">
                  </el-switch>
                </el-form-item>

                <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.counts')" prop="sdApiTimes">
                    <el-input v-model.trim="sdApiform.sdApiTimes" style="width:45%" :placeholder="$t('lg.counts')"></el-input> /{{$t('lg.count')}}
                  </el-form-item>
                  <el-form-item :label="$t('lg.time')" prop="sdApiTime">
                    <el-input v-model.trim="sdApiform.sdApiTime" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
                    <el-select v-model="sdApiTimeUnit" style="width:30%">
                      <el-option v-for="item in apiUnitOpt" 
                        :key="item.value"
                        :label="item.label" 
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>          
                
                <el-form-item>
                  <el-button type="primary" @click="submitSdApi()">{{sdApiSwitch?$t('lg.editparams'):$t('lg.addparams')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.jsjpzxx')" name="shadowlib_config"><!--Js配置选项-->
            <div class="seniorDctBox2">
              <el-button class="addSeniorDctBtn" type="primary" size="mini" @click="addSdlibDialogShow()">{{$t('lg.xinzpzx')}}</el-button>
              <p class="nodata-box2" v-show="Object.keys(shadowlibData).length==0">{{$t('lg.nodata')}}</p>
              <table class="table-bg" v-show="Object.keys(shadowlibData).length>0">
              <thead>
                <tr>
                  <th>{{$t('lg.domain')}}</th>
                  <th>{{$t('lg.peizhics')}}</th>
                  <th width="110"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,key) in shadowlibData" :key="key">
                  <td>{{key | toBase64}}</td>
                  <td>
                    <ul class="sdlibList">
                      <li><span>{{$t('lg.kuayugnsz')}}：</span>{{item.crossdomain?item.crossdomain:$t('lg.nosettp')}}</li>
                      <li><span>{{$t('lg.jiamicookie')}}：</span>{{item.cookieencrypt?item.cookieencrypt:$t('lg.nosettp')}}</li>
                      <li><span>{{$t('lg.aliangjiejiami')}}：</span><i :class="item.aclick?'el-icon-success font-green':'el-icon-warning'"></i> {{item.aclick?$t('lg.opened'):$t('lg.unopened')}}</li>
                      <li><span>{{$t('lg.jiamifans')}}：</span>{{item.xhrqueryparamsorurl?$t('lg.urljiami'):$t('lg.argjiami')}}</li>
                      <li><span>{{$t('lg.xhrqingqbmd')}}：</span>{{item.noxhrurl?item.noxhrurl:$t('lg.nosettp')}}</li>
                      <li><span>{{$t('lg.bodyjiami')}}：</span>{{item.isbodyenurl?item.isbodyenurl:$t('lg.nosettp')}}</li>
                      <li><span>{{$t('lg.kaiqiwebsockettokenfh')}}：</span><i :class="item.isws?'el-icon-success font-green':'el-icon-warning'"></i> {{item.isws?$t('lg.opened'):$t('lg.unopened')}}</li>
                    </ul>
                  </td>
                  <td class="text-center">
                    <a href="javascript:;" class="edit-del-a" @click="editSdlibDialogShow(key,item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                    <a href="javascript:;" class="edit-del-a" @click="deletShadowlib(key)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </el-collapse-item>

          <el-collapse-item :title="$t('lg.shadowckyzsz')" name="shadow_dyncookie"><!--Shadow Cookie验证设置-->
            <div class="seniorDctBox">
              <p class="tips">{{$t('lg.zhu2')}}{{$t('lg.dfcookietips')}}</p>
              <el-form :model="defenseCookieform" :rules="defenseCookieformRules" ref="defenseCookieform" label-width="90px">
                <el-form-item :label="$t('lg.dfcookieonoff')" :label-width="$store.state.isencn=='en'?'244px':'200px'"> 
                  <el-switch
                    v-model="defenseCookieswitch"
                    :title="defenseCookieswitch?$t('lg.clickoff'):''"
                    @change="sdDefCookieSwitchEvent()">
                  </el-switch>
                </el-form-item>
                <div class="orderBoxJamb">
                  <el-form-item :label="$t('lg.validdate')" prop="defenseTime">
                    <el-input v-model.trim="defenseCookieform.defenseTime" style="width:50%" :placeholder="$t('lg.validdate')"></el-input>
                    <el-select v-model="dfsCookieTimeUnit" style="width:30%">
                      <el-option :label="$t('lg.second')" value="s"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('lg.counts')" prop="defenseTimes">
                    <el-input v-model.trim="defenseCookieform.defenseTimes" style="width:45%" :placeholder="$t('lg.counts')"></el-input> /{{$t('lg.count')}}
                  </el-form-item>
                </div>
                <el-form-item>
                  <el-button type="primary" @click="submitdefenseCookie(defenseCookieswitch)">{{defenseCookieswitch?$t('lg.editparams'):$t('lg.addparams')}}</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>

        </el-collapse>
      </div>
      <loading v-show="getDirectiveLoading"></loading>
    </el-dialog>

    <!-- 拒绝头域名参数 || 黑名单 编辑弹框 -->
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowEditBlockDct" :close-on-click-modal="false" :before-close="editBlockDctClose">
      <el-form :model="editBlockDctform" ref="editBlockDctform">
        <el-form-item :label="activeName=='shadow_reject_header'?$t('lg.jujuetouyucs'):$t('lg.ipipd')" :label-width="activeName=='shadow_reject_header'?'165px':'140px'" prop="editBlockDctVal" :rules="activeName=='shadow_reject_header'?rejectHeaderDctformRules.rejectHeaderVal:verifyLimitIpDctformRules.limitIpVal">
          <el-input v-model.trim="editBlockDctform.editBlockDctVal"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="editBlockDirective('editBlockDctform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="editBlockDctClose">{{$t('lg.cancel')}}</el-button>
      </div>
      <loading v-show="editBlockDctLoading"></loading>
    </el-dialog>

    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowEditBlackip" :close-on-click-modal="false" :before-close="editBlackipClose">
      <el-form :model="editBlackipform" ref="editBlackipform">
        <el-form-item :label="$t('lg.ipipd')" :label-width="$store.state.isencn=='en'?'140px':'80px'" prop="editBlackip" :rules="verifyBlackIpDctformRules">
          <el-input v-model.trim="editBlackipform.editBlackip"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="editBlackipDirective('editBlackipform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="editBlackipClose">{{$t('lg.cancel')}}</el-button>
      </div>
    </el-dialog>

    <!-- 白名单 编辑弹框 -->
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowEditWhiteList" :close-on-click-modal="false" :before-close="isEditWhiteListClose">
      <el-form :model="editWhiteListform" :rules="editWhiteListformRules" ref="editWhiteListform">
        <el-form-item :label="$t('lg.ips')" :label-width="$store.state.isencn=='en'?'140px':'75px'" prop="white_ip">
          <el-input v-model.trim="editWhiteListform.white_ip"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="editwIEnsure('editWhiteListform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="isEditWhiteListClose">{{$t('lg.cancel')}}</el-button>
      </div>
      <loading v-show="editWhitelistLoading"></loading>
    </el-dialog>
    <!--白名单 备注弹框 -->
    <el-dialog width="40%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShowWIpRemark" :close-on-click-modal="false" :before-close="wIpRemarkDialogClose">
      <el-form :model="wIpRemarkform" ref="wIpRemarkform">
        <el-form-item :label="$t('lg.remark')" label-width="40px">
          <el-input type="textarea" autosize v-model.trim="wIpRemarkform.wIpRemark"></el-input>
        </el-form-item>
      </el-form>
      <div class="text-center">
        <el-button type="primary" @click="setWIpRemark('wIpRemarkform')">{{$t('lg.yes')}}</el-button>
        <el-button @click="wIpRemarkDialogClose">{{$t('lg.cancel')}}</el-button>
      </div>
      <loading v-show="wIpRemarkLoading"></loading>
    </el-dialog>

    <!-- 增加Js配置选项弹框 -->
    <el-dialog width="70%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="addSdlibDialogVisible" :close-on-click-modal="false" :before-close="addSdlibDialogClose">
      <el-row>
          <el-form ref="shadowlibform" :model="shadowlibform" :rules="shadowlibformRules" :label-width="$store.state.isencn=='en'?'260px':'200px'" style="margin-right:30px">
            <el-form-item :label="$t('lg.domain')" prop="domainName">
              <el-input v-model.trim="shadowlibform.domainName" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.kuayugnsz')" prop="crossdomain">
              <el-input v-model.trim="shadowlibform.crossdomain" :placeholder="$t('lg.plzenter')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.jiamicookie')" prop="encryptck">
              <el-input v-model.trim="shadowlibform.encryptck" :placeholder="$t('lg.cookiefengkai')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.xhrqingqbmd')" prop="noxhrurl">
              <el-input v-model.trim="shadowlibform.noxhrurl" :placeholder="$t('lg.xhrfengkai')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.bodyjiami')" prop="isbodyenurl">
              <el-input v-model.trim="shadowlibform.isbodyenurl" :placeholder="$t('lg.bodyjiamifengkai')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('lg.kaiqialjjm')" prop="isa">
              <el-switch v-model="shadowlibform.isa"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('lg.jiamifans')" prop="encryptionType">
              <el-radio v-model="shadowlibform.encryptionType" label="1">{{$t('lg.argjiami')}}</el-radio>
              <el-radio v-model="shadowlibform.encryptionType" label="2">{{$t('lg.urljiami')}}</el-radio>
              <!-- <el-radio v-model="shadowlibform.encryptionType" label="3">cookie加密</el-radio>
              <el-radio v-model="shadowlibform.encryptionType" label="4">不加密</el-radio> -->
            </el-form-item>
            <!-- <el-form-item label="开启body加密功能" prop="bodye">
              <el-switch v-model="shadowlibform.bodye"></el-switch>
            </el-form-item> -->
            <el-form-item :label="$t('lg.kaiqiwbklpfh')" prop="isws">
              <el-switch v-model="shadowlibform.isws"></el-switch>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitShadowlibList('shadowlibform')">{{$t('lg.save')}}</el-button>
              <el-button @click="addSdlibDialogClose">{{$t('lg.cancel')}}</el-button>
            </el-form-item>
          </el-form>
      </el-row>
      <loading v-show="addShadowlibLoading"></loading>
    </el-dialog>
    <!-- 编辑单条Js配置选项弹框 -->
    <el-dialog width="60%" :title="shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="editSdlibDialogVisible" :close-on-click-modal="false" :before-close="editSdlibDialogClose">
      <el-form :model="editShadowlibform" ref="editShadowlibform" :rules="editShadowlibformRules" :label-width="$store.state.isencn=='en'?'260px':'200px'">
        <el-form-item :label="$t('lg.domain')" prop="domainName">
          <el-input v-model.trim="editShadowlibform.domainName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.kaiqialjjm')" prop="isa">
              <el-switch v-model="editShadowlibform.isa"></el-switch>
            </el-form-item>
        <el-form-item :label="$t('lg.kuayugnsz')" prop="crossdomain">
          <el-input v-model.trim="editShadowlibform.crossdomain" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.jiamicookie')" prop="cookieencrypt">
          <el-input v-model.trim="editShadowlibform.cookieencrypt" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.xhrqingqbmd')" prop="noxhrurl">
          <el-input v-model.trim="editShadowlibform.noxhrurl" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.bodyjiami')" prop="isbodyenurl">
          <el-input v-model.trim="editShadowlibform.isbodyenurl" placeholder=""></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.jiamifans')" prop="encryptionType">
          <el-radio v-model="editShadowlibform.encryptionType" label="1">{{$t('lg.argjiami')}}</el-radio>
          <el-radio v-model="editShadowlibform.encryptionType" label="2">{{$t('lg.urljiami')}}</el-radio>
          <!-- <el-radio v-model="editShadowlibform.encryptionType" label="3">Cookie加密</el-radio>
          <el-radio v-model="editShadowlibform.encryptionType" label="4">不加密</el-radio> -->
        </el-form-item>
        <el-form-item :label="$t('lg.kaiqiwbklpfh')" prop="isws">
          <el-switch v-model="editShadowlibform.isws"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editSdlibEnsure('editCmdform')">{{$t('lg.save')}}</el-button>
          <el-button @click="editSdlibDialogClose">{{$t('lg.cancel')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="editShadowlibLoading"></loading>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
import * as types from '@/store/types';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar';

export default {
  components:{
    loading
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
    }
  },
  data(){
    var validatePass = (rule, value, callback) => {
          // console.log(value)
          if (value === '') {
            callback(new Error(this.$t('lg.ipipd')));
          } else {
            const valArr = value.split(',')
            for(var i=0;i<valArr.length;i++){
              const valStr = valArr[i].replace(/^\s*|\s*$/g,"");//去除两侧空格
              if(valStr && !(/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/.test(valStr))){
                callback(new Error(this.$t('lg.qingshurufuheipipd')));
                break;
              }
            }
            callback();
          }
        };
    return{
      url:'',//请求接口 不同功能接口不同
      getDirectiveLoading:false,
      activeName:'',

      directiveData:[],//数据存储
      blackdirectiveData:[],
     
      // 头域校验功能
      verifyUserAgentDctform:{
        verifyUserAgentVal:false,
      },

      //拒绝头域名参数设置
      rejectHeaderDctform:{
        rejectHeaderVal:''
      },
      rejectHeaderDctformRules:{
        rejectHeaderVal:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ]
      },

      // IP黑名单功能
      verifyLimitIpDctform:{
        verifyLimitIpVal:false,
        limitIpVal:''
      },
      verifyBlackIpDctform:{
        verifyblackIpVal:false,
        blackIpVal:''
      },
      verifyLimitIpDctformRules:{
        limitIpVal:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message: this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      verifyBlackIpDctformRules:{
        blackIpVal:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message: this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      //编辑 拒绝头域名参数 || IP黑名单
      isShowEditBlockDct:false,
      isShowEditBlackip:false,
      editBlockDctform:{
        editBlockDctVal:'',
      },
      editBlackipform:{
        editBlackip:'',
      },
      editBlackipOriform:{
        editBlackip:'',
      },
      editBlockDctOrgin:{//编辑临时容器,存储被编辑的当前项
        editBlockDctVal:'',
      },
      editBlockDctLoading:false,

      // 接口独立功能
      // IP白名单功能
      whiteListswitch:false,
      editWhiteIpIndex:null,//记录被编辑ip的索引
      whiteListform:{
        white_ip:''
      },
      whiteListformRules:{
        white_ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur',},
          { validator: validatePass, trigger: 'blur' },
          // {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message:this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      whiteIplistData:[],
      // 编辑白名单ip
      isShowEditWhiteList:false,
      editWhiteListform:{
        white_ip:''
      },
      editWhiteListformRules:{
        white_ip:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))?)$/, message: this.$t('lg.invalidformat'), trigger: 'blur'}//IP/IP段正则
        ]
      },
      editWhitelistLoading:false,
      //白名单备注
      whiteIpListRemark:'',
      hasWIpRemark:false,//标记是否有过备注；用来设置备注时，确定请求方式为post还是patch
      isShowWIpRemark:false,
      wIpRemarkform:{
        wIpRemark:''
      },
      wIpRemarkLoading:false,

      //请求超时时间设置
      agtTimeoutSwitch:false,
      agtTimeoutform:{
        agtTimeoutVal:null,
        agtTimeoutUnit:'s',
        agtTimeoutUnitOpt:[{
          label:this.$t('lg.ms'),
          value:'ms'
        },{
          label:this.$t('lg.second'),
          value:'s'
        }],
      },
      agtTimeoutformRules:{
        agtTimeoutVal:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },

      // Js加密防护设置
      sdApiSwitch:false,
      sdApiform: {
        sdApiTime:'',
        sdApiTimes:''
      },
      sdApiTimeUnit:'s',
      apiUnitOpt:[{
        label:this.$t('lg.second'),
        value:'s'
      }],
      sdApiformRules:{
        sdApiTime:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        sdApiTimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },

      // Js配置选项
      shadowlibData:{},
      //增加
      addSdlibDialogVisible:false,
      shadowlibform:{
        domainName:'',
        crossdomain:'',
        encryptck:'',
        encryptionType:'1',
        bodye:"",
        isws:false,
        isa:false
      },
      shadowlibformRules:{
        domainName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      //临时列表
      shadowlibList:[],
      addShadowlibLoading:false,
      //编辑
      editSdlibDialogVisible:false,
      editShadowlibform:{},
      editShadowlibformRules:{
        domainName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      editShadowlibLoading:false,

      // Shadow Cookie验证设置
      dfsCookieTimeUnit:'s',
      defenseCookieswitch:false,
      defenseCookieform: {
        defenseTime:'',
        defenseTimes:''
      },
      defenseCookieformRules:{
        defenseTime:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ],
        defenseTimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}
        ]
      },

    }
  },
  methods:{
    handleChange(val){
      if(val){
        let functionObj={
          'shadow_verify_user_agent':this.getSdDirective,
          'shadow_reject_header':this.getSdDirective,
          'shadow_limit_ip':this.getSdDirective,
          'shadow_black_ip':this.getBlackipDirective,
          'shadow_white_ip':this.getWhiteIpListData,
          'agent_time':this.getSdAgtTimeoutData,
          'shadow_api':this.getSdApiData,
          'shadowlib_config':this.getSdShadowlibData,
          'shadow_dyncookie':this.getSdDefenseCookieData
        }
        this.$nextTick(()=>{
          functionObj[val]();
        })
      }
    },
    getSdDirective(){//看shadow全局/http块指令配置
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      _this.directiveData=[];
      _this.getDirectiveLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?snodeId="+snodeId+"&http=true&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?snodeId="+snodeId+"&http=true&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?snodeId="+snodeId+"&http=true";
      } 
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData= res.data.data.hasOwnProperty("httpBlockDirectives")?res.data.data.httpBlockDirectives:[];
          let targetObj={
            shadow_reject_header:[],
            shadow_limit_ip:[],
          };
          resData.forEach(ele => {
            if(ele.hasOwnProperty("shadow_verify_user_agent")){
              const swVal = Base64.decode(ele.shadow_verify_user_agent);
              _this.verifyUserAgentDctform.verifyUserAgentVal=swVal=='on'?true:false;
            }
            if(ele.hasOwnProperty("shadow_reject_header")){
              targetObj.shadow_reject_header.push({
                shadow_reject_header:Base64.decode(ele.shadow_reject_header)
              })
            }
            if(ele.hasOwnProperty("shadow_verify_limit_ip")){
              const swVal = Base64.decode(ele.shadow_verify_limit_ip);
              _this.verifyLimitIpDctform.verifyLimitIpVal=swVal=='on'?true:false;
            }
            if(ele.hasOwnProperty("shadow_limit_ip")){
              targetObj.shadow_limit_ip.push({
                shadow_limit_ip:Base64.decode(ele.shadow_limit_ip)
              }) 
            }
          });
          if(_this.activeName=='shadow_reject_header' || _this.activeName=='shadow_limit_ip') _this.directiveData=targetObj[_this.activeName];
        }else{
          _this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    getBlackipDirective(){
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      _this.getDirectiveLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?snodeId="+snodeId+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?snodeId="+snodeId+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?snodeId="+snodeId;
      } 
      axios.get(url).then((res)=>{
        if(res.data.responseCode===0){
          _this.blackdirectiveData=res.data.data;
          _this.getDirectiveLoading=false;
        }
      });
    },
    //增加
    validSubmitBlockDct(type,val,formname){
      if(formname){
        this.$refs[formname].validate((valid) => {
          if (valid) {
            this.submitBlockDct(type,val);
            this.rejectHeaderDctform.rejectHeaderVal='';
            this.verifyLimitIpDctform.limitIpVal='';
          }
        })
      }else{
        const tarVal=val?'on':'off';
        this.submitBlockDct(type,tarVal)
      }
    },
    limitIpSwitchEvent(type,val){
      this.validSubmitBlockDct(type,val);
    },
    validSubmitBlackip(formname){
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive";
      } 
      if(formname){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            let blackipval=Base64.encode(_this.verifyBlackIpDctform.blackIpVal);
            let data={
              "directives": [
                  {
                      "shadow_black_ip": blackipval
                  }
              ],
              "snodeId": snodeId
            };
            axios.post(url,data).then((res)=>{
              if(res.data.responseCode==0){
                _this.$message({
                  type: 'success',
                  message: _this.$t('lg.success')
                });
                _this.getBlackipDirective()
              }else{
                _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
              }
            });
          }
        })
      }
    },
    delBlackipDirective(item){
      console.log(item);
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/ipblack/directive";
      } 
      let data={
        "directives": [
            {
                "shadow_black_ip": item.shadow_black_ip
            }
        ],
        "snodeId": snodeId
      };
      axios.delete(url,{data:data}).then((res)=>{
        if(res.data.responseCode==0){
                _this.$message({
                  type: 'success',
                  message: _this.$t('lg.success')
                });
                _this.getBlackipDirective()
              }else{
                _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
              }

      })
    },
    submitBlockDct(type,val){//确认增加
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      _this.getDirectiveLoading=true;
      let url='';
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true";
      } 
      const directivesArr=[{
        [type]: Base64.encode(val)
      }];
      axios.post(url,{
        snodeId:snodeId,
        directives:directivesArr
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdDirective();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    // 删除
    delBlockDirective(type,val){
      const _this=this;
      const snodeId=this.shadowObj.snodeId;
      _this.getDirectiveLoading=true;
      let url='';
      if(this.isAuto){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&autoconfig=true";
      }else if(this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true";
      } 
      let directivesArr=[{
        [type]: Base64.encode(val)
      }];
      axios.delete(url,{
        data:{
          snodeId:snodeId,
          directives:directivesArr
        }
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdDirective();
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    // 编辑
    editBlockDctDialogShow(item){
      const dctKey = Object.keys(item)[0];
      this.editBlockDctform.editBlockDctVal=item[dctKey];
      this.editBlockDctOrgin.editBlockDctVal=item[dctKey];

      this.isShowEditBlockDct=true;
    },
    editBlackipDialogShow(item){
      this.editBlackipform.editBlackip=Base64.decode(item.shadow_black_ip);
      this.editBlackipOriform.editBlackip=item.shadow_black_ip;
      this.isShowEditBlackip=true;
    },
    editBlackipDirective(formname){
      const _this=this;
      _this.$refs[formname].validate((valid) => {
        if (valid) {
          const snodeId=_this.shadowObj.snodeId;
          let url='';
          if(_this.isAuto){
            url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?autoconfig=true";
          }else if(_this.isEditConfig){
            url=SERVER_API_URL+"pe/shadow/global/ipblack/directive?savedConfig=true";
          }else{
            url=SERVER_API_URL+"pe/shadow/global/ipblack/directive";
          } 
          const srcData=_this.editBlackipOriform.editBlackip;
          const targetData=Base64.encode(_this.editBlackipform.editBlackip);
          axios.patch(url,{
            snodeId:snodeId,
            directiveName:"shadow_black_ip",
            srcData:srcData,
            targetData:targetData
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getBlackipDirective();
              _this.editBlackipClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    editBlockDirective(formname){
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const _this=this;
          const snodeId=_this.shadowObj.snodeId;
          _this.editBlockDctLoading=true;
          let url='';
          if(_this.isAuto){
            url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&autoconfig=true";
          }else if(_this.isEditConfig){
            url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true&savedConfig=true";
          }else{
            url=SERVER_API_URL+"pe/shadow/global/blockdirective?http=true";
          } 

          const directiveName=_this.activeName=='shadow_reject_header'?'shadow_reject_header':'shadow_limit_ip';
          const srcData=Base64.encode(_this.editBlockDctOrgin.editBlockDctVal);
          const targetData=Base64.encode(_this.editBlockDctform.editBlockDctVal);
          axios.patch(url,{
            snodeId:snodeId,
            directiveName:directiveName,
            srcData:srcData,
            targetData:targetData
          }).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getSdDirective();
              _this.editBlockDctClose();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.editBlockDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },
    editBlockDctClose(){
      this.$refs['editBlockDctform'].resetFields();
      this.isShowEditBlockDct=false;
    },
    editBlackipClose(){
      this.isShowEditBlackip=false;
    },

    // 接口独立功能
    // IP白名单功能
    getWhiteIpListData(){//获取白名单
      var snodeId=this.shadowObj.snodeId;
      var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
      this.getDirectiveLoading=true;
      axios.get(url).then((res)=>{//查看白名单
        // console.log(res)
        if(res.data.responseCode == 0){
          const resData = res.data.data;
          this.whiteIplistData=resData;
          if(this.whiteIplistData.length==0){
            this.whiteListswitch=false;//关闭
          }else{
            this.whiteListswitch=true;//开启
          }
          this.getRemak();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    submitWhiteList(){//确认添加
      this.$refs['whiteListform'].validate((valid) => {
        if (valid) {
          var _this = this;
          var snodeId=_this.shadowObj.snodeId;
          _this.getDirectiveLoading=true;

          // if(_this.whiteIplistData.includes(_this.whiteListform.white_ip)){
          //   _this.$message.error(_this.$t('lg.existwhite'));
          //   return false;
          // }
          
          const whiteIpArr = JSON.parse(JSON.stringify(this.whiteIplistData));
          _this.whiteListform.white_ip.split(',').forEach(item=>{
            item && whiteIpArr.push(item)
          })
          
          var url=SERVER_API_URL+"pe/shadow/whiteip";
          axios.post(url,{
            snodeId:snodeId,
            whiteIp:whiteIpArr
          }).then((res)=>{
            if(res.data.responseCode==0){
            _this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            _this.whiteListform.white_ip='';
            this.getWhiteIpListData();
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
            }
            _this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },
    whiteIpSwitchEvent(){//白名单功能开关事件
      var _this=this;
      if(!this.whiteListswitch){
        this.$confirm(_this.$t('lg.deletewhitetips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          var snodeId=this.shadowObj.snodeId;
          var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
          axios.delete(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.getWhiteIpListData();
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          this.whiteListswitch=true;
          this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        this.whiteListswitch=false;
        this.$message.error(_this.$t('lg.whiteauto'));
      }
    },
    editWhiteIp(item,index){//编辑白名单IP
      this.editWhiteIpIndex=index;
      this.editWhiteListform.white_ip=item;
      this.isShowEditWhiteList=true;
    },
    editwIEnsure(formname){//确认编辑   
      this.$refs[formname].validate((valid) => {
        if(valid){
          var snodeId=this.shadowObj.snodeId;
          // if(this.whiteIplistData.includes(this.editWhiteListform.white_ip)){//比较ip是否已经存在 2
          //   this.$message.error(this.$t('lg.existwhite'));
          //   return false;
          // }
          this.whiteIplistData[this.editWhiteIpIndex]=this.editWhiteListform.white_ip;//如果不存在，就插入原数组，进行替换

          var url=SERVER_API_URL+"pe/shadow/whiteip";
          this.editWhitelistLoading=true;
          axios.patch(url,{
            snodeId:snodeId,
            whiteIp:this.whiteIplistData
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.isEditWhiteListClose();
              this.getWhiteIpListData();
            }else{
              this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
            }
            this.editWhitelistLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    isEditWhiteListClose(){//关闭编辑弹框
      this.isShowEditWhiteList=false;
    },
    delWhiteIp(index){//删除白名单Ip
      var _this=this;
      var snodeId=this.shadowObj.snodeId;
      if(this.whiteIplistData.length==1){
        this.$confirm(_this.$t('lg.closewhitetips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          var url=SERVER_API_URL+"pe/shadow/whiteip/"+snodeId;
          axios.delete(url).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              this.getWhiteIpListData();
              this.whiteListswitch=false;
            }else{
              this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          this.whiteListswitch=true;
          this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        this.getDirectiveLoading=true;
        this.whiteIplistData.splice(index,1);//截取掉当前删掉的ip
        var url=SERVER_API_URL+"pe/shadow/whiteip";
        axios.patch(url,{
          snodeId:snodeId,
          whiteIp:this.whiteIplistData//把剩余的再传给服务器
        }).then((res)=>{
          if(res.data.responseCode==0){
            this.$message({
              type: 'success',
              message: _this.$t('lg.success')
            });
            this.getWhiteIpListData();
          }else{
            this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.getDirectiveLoading=false;
        }).catch((err)=>{
          console.log(err);
        });
      }
    },

    getRemak(){//查看备注
      var snodeId=this.shadowObj.snodeId;
      var url=SERVER_API_URL+"pe/shadow/kv/"+snodeId+'whiteIpRemarks';
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode == 0){
          const resData = res.data.data;
          this.whiteIpListRemark=resData && resData.value;
          if(resData){
            this.hasWIpRemark=true;
          }else{
            this.hasWIpRemark=false;
          }
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    showRemarkDialog(){
      this.wIpRemarkform.wIpRemark=this.whiteIpListRemark;
      this.isShowWIpRemark=true;
    },
    setWIpRemark(){//设置备注
      this.wIpRemarkLoading=true;
      var snodeId=this.shadowObj.snodeId;
      var url=SERVER_API_URL+"pe/shadow/kv/";
      const keyName=snodeId+'whiteIpRemarks';
      let requestMethod='post';

      if(this.hasWIpRemark) requestMethod='patch';

      axios[requestMethod](url,{
       [keyName]:this.wIpRemarkform.wIpRemark
      }).then((res)=>{
        if(res.data.responseCode == 0){
          this.getWhiteIpListData();
          this.wIpRemarkDialogClose();
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.wIpRemarkLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    wIpRemarkDialogClose(){
      this.$refs['wIpRemarkform'].resetFields();
      this.isShowWIpRemark=false;
    },

    // 请求超时时间设置
    getSdAgtTimeoutData(){
      var _this=this;
      var snodeId=_this.shadowObj.snodeId;
      _this.getDirectiveLoading=true;
      if(_this.isAuto){
        _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId+"?autoconfig=true";
      }else if(_this.isEditConfig){
        _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId+"?savedConfig=true";
      }else{
        _this.url=SERVER_API_URL+"pe/shadow/agenttime/"+snodeId;
      }
      axios.get(_this.url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          var resData=res.data.data;
          // console.log(resData)
          if(resData){
            _this.agtTimeoutSwitch=true;
            _this.agtTimeoutform.agtTimeoutVal=resData.match(/(\d*)(\w*)/)[1];
            _this.agtTimeoutform.agtTimeoutUnit=resData.match(/(\d*)(\w*)/)[2];
          }
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
    agtTimeSwitchEvent(){
      var _this = this;
      if(!_this.agtTimeoutSwitch){
        _this.$confirm(_this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.getDirectiveLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$refs['agtTimeoutform'].resetFields();
            }else{
              _this.agtTimeoutSwitch=true;
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.agtTimeoutSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.agtTimeoutSwitch=false;
        _this.$message.error(this.$t('lg.zhu11'));
      }
    },
    submitAgtTimeout(){//更改请求超时时间
      this.$refs['agtTimeoutform'].validate((valid) => {
        if(valid){
          var _this=this;
          _this.getDirectiveLoading=true;
          axios.post(_this.url,{
            shadow_agent_timeout:_this.agtTimeoutform.agtTimeoutVal+_this.agtTimeoutform.agtTimeoutUnit,
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.agtTimeoutSwitch=true;
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              _this.$message.error(_this.$t('lg.failed')+': '+res.data.data.message);
            }
            _this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      })
    },

    // Js加密防护设置
    getSdApiData(){
      return new Promise((resolve,reject)=>{
        var _this=this;
        var snodeId=_this.shadowObj.snodeId;
        _this.getDirectiveLoading=true;
        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId+"?autoconfig=true";
        }else if(_this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/api/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          // console.log(res)
          if(res.data.responseCode==0){
            var resData=res.data.data;
            // console.log(resData)
            if(resData){
              _this.sdApiSwitch=true;
              _this.sdApiform.sdApiTimes=resData.num;
              _this.sdApiform.sdApiTime=resData.time.match(/(\d*)(\w*)/)[1];
              _this.sdApiTimeUnit=resData.time.match(/(\d*)(\w*)/)[2];
            }
            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
          _this.getDirectiveLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    sdApiSwitchEvent(){//开关事件 删除Js加密防护设置
      let _this=this;
      if(!_this.sdApiSwitch){
        _this.$confirm(this.$t('lg.isdelete'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.getDirectiveLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$refs['sdApiform'].resetFields();
            }else{
              _this.sdApiSwitch=true;
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.sdApiSwitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.sdApiSwitch=false;
        _this.$message.error(this.$t('lg.zhu11'));
      }
    },
    submitSdApi(){//添加shadow_api Js加密防护设置
      this.$refs['sdApiform'].validate((valid) => {
        if (valid) {
          this.getDirectiveLoading=true;
          axios.post(this.url,{
            num:this.sdApiform.sdApiTimes,
            time:this.sdApiform.sdApiTime+this.sdApiTimeUnit
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.sdApiSwitch=true;
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
            }else{
              this.$message.error(this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },

    // Js配置选项
    getSdShadowlibData(){//获取Js配置选项
      return new Promise((resolve,reject)=>{
        const _this=this;
        const snodeId=_this.shadowObj.snodeId;
        this.getDirectiveLoading=true;

        if(_this.isAuto){
          _this.url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          _this.url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?savedConfig=true";
        }else{
          _this.url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId;
        }
        axios.get(_this.url).then((res)=>{
          if(res.data.responseCode==0){
            // const resData=res.data.data?res.data.data.configuration:{};
            const resData=res.data.data || {};

            //把数据中域名的‘_’转化成 ‘.’
            const targetData={}
            Object.keys(resData).forEach(item=>{
              const targetKey= item.split('_').join('.');
              targetData[targetKey]=resData[item];
            })
            _this.shadowlibData=targetData;//清空

            resolve(resData);
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.getDirectiveLoading=false;
        }).catch((err)=>{
          console.log(err)
        });
      })
    },
    //增加
    addSdlibDialogShow(){//显示添加弹框
      this.addSdlibDialogVisible=true;
    },
    addSdlibListItem(formname){//加入预览表格
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const sdlibObj = Object.assign({},this.shadowlibform);
          this.shadowlibList.push(sdlibObj);
          // console.log(this.shadowlibList)
          // this.shadowlibform={//清空
          //   domainName:'',
          //   crossdomain:'',
          // }
        }
      });
    },
    deletSdlibListItem(item){//从预览表格里删除
      this.shadowlibList.splice(this.shadowlibList.indexOf(item),1);
    },
    submitShadowlibList(){
      const _this=this;
      _this.addShadowlibLoading=true;
     // let domainname1=_this.shadowlibform.domainName.replace(/\./g,"_").replace(/:/,'_');
      let domainname1=Base64.encode(_this.shadowlibform.domainName);
      
      let aclick=_this.shadowlibform.isa;
      let crossdomain=_this.shadowlibform.crossdomain;
      let isbodyenurl=_this.shadowlibform.isbodyenurl;
      let noxhrurl=_this.shadowlibform.noxhrurl;
      let isws=_this.shadowlibform.isws;
      let xhrorarg=_this.shadowlibform.encryptionType=='2'?true:false;
      let encryptck=_this.shadowlibform.encryptck;
     // let acookieorencpyt = _this.shadowlibform.encryptionType=='3'?true:false;
      let dataObj={};
      dataObj[domainname1]={
        "aclick": aclick,
        "crossdomain": crossdomain,
        "isbodyenurl": isbodyenurl,
        "noxhrurl":noxhrurl,
        "isws": isws,
        "acookieorencpyt": false,
        "xhrqueryparamsorurl":xhrorarg,
        "cookieencrypt":encryptck
      };
      const snodeId=_this.shadowObj.snodeId;
        let  url="";
        if(_this.isAuto){
          url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?savedConfig=true";
        }else{
          url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId;
        }
      var postalldata1=_this.shadowlibData;
      var postalldata={...postalldata1,...dataObj};
      axios.post(_this.url,postalldata).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.addSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    submitShadowlibList3(){
      const _this=this;
      _this.addShadowlibLoading=true;
     // let domainname1=_this.shadowlibform.domainName.replace(/\./g,"_").replace(/:/,'_');
      let domainname1=Base64.encode(_this.shadowlibform.domainName);
      
      let aclick=_this.shadowlibform.isa;
      let crossdomain=_this.shadowlibform.crossdomain;
      let bodye=_this.shadowlibform.bodye;
      let isws=_this.shadowlibform.isws;
      let xhrorarg=_this.shadowlibform.encryptionType=='2'?true:false;
     // let acookieorencpyt = _this.shadowlibform.encryptionType=='3'?true:false;
      let dataObj={};
      dataObj[domainname1]={
        "aclick": aclick,
        "crossdomain": crossdomain,
        "bodye": bodye,
        "isws": isws,
        "acookieorencpyt": false,
        "xhrqueryparamsorurl":xhrorarg
      };
      const snodeId=_this.shadowObj.snodeId;
        let  url="";
        if(_this.isAuto){
          url=SERVER_API_URL+"plugin/pe/shadow/config/shadowlib/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          url=SERVER_API_URL+"plugin/pe/shadow/config/shadowlib/"+snodeId+"?savedConfig=true";
        }else{
          url=SERVER_API_URL+"plugin/pe/shadow/config/shadowlib/"+snodeId;
        }
      var postalldata1=_this.shadowlibData;
      var postalldata={...postalldata1,...dataObj};
      axios.patch(_this.url,dataObj).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.addSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    submitShadowlibList2(){//确认添加
      const _this=this;
      _this.addShadowlibLoading=true;

      let shadowlibObj={};
      _this.shadowlibList.forEach(ele=>{
        const targetKey= (ele.domainName.split('.').join('_')).split(':').join('_');// ‘_’取代用户输入域名里的‘.’
        const aclick = ele.encryptionType=='3'?false:true;
        const acookieorencpyt = ele.encryptionType=='2'?true:false;
        shadowlibObj[targetKey]={
          "aclick": aclick,
          "crossdomain": ele.crossdomain,
          "bodye": ele.bodye,
          "isws": ele.isws,
          "acookieorencpyt": acookieorencpyt
        }
      })
      axios.patch(_this.url,shadowlibObj).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.addSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.addShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    addSdlibDialogClose(){
      this.shadowlibList=[];
      this.$refs['shadowlibform'].resetFields();
      this.addSdlibDialogVisible=false;
    },
    //编辑
    editSdlibDialogShow(key,item){//打开编辑弹框
      // console.log(item)
      this.editSdlibDialogVisible=true;

      // this.editShadowlibform=Object.assign({},item);//克隆对象  this.editShadowlibform=item;改变了原对象

      this.editShadowlibform=Object.assign({},{
        domainName:Base64.decode(key),
        crossdomain:item.crossdomain,
        isa:item.aclick,
        encryptionType:item.xhrqueryparamsorurl?'2':'1',
        noxhrurl:item.noxhrurl,
        isbodyenurl:item.isbodyenurl,
        isws:item.isws,
        acookieorencpyt:item.acookieorencpyt,
        cookieencrypt:item.cookieencrypt
      });
    },
    editSdlibEnsure(){//确认修改
      const _this=this;
      _this.editShadowlibLoading=true;

      let shadowlibObj={};
      const domainName = _this.editShadowlibform.domainName;
    //  const targetKey = (domainName.split('.').join('_')).split(':').join('_');// ‘_’取代用户输入域名里的‘.’
      let targetKey=Base64.encode(domainName);
      const aclick = _this.editShadowlibform.isa;
      let xhrorarg=_this.editShadowlibform.encryptionType=='2'?true:false;
      shadowlibObj[targetKey]={
        "aclick": aclick,
        "crossdomain": _this.editShadowlibform.crossdomain,
        "isbodyenurl": _this.editShadowlibform.isbodyenurl,
        "noxhrurl":_this.editShadowlibform.noxhrurl,
        "isws": _this.editShadowlibform.isws,
        "acookieorencpyt": false,
        "cookieencrypt":_this.editShadowlibform.cookieencrypt,
        "xhrqueryparamsorurl":xhrorarg
      };
  
      axios.patch(_this.url,shadowlibObj).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
          _this.editSdlibDialogClose();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data);
        }
        _this.editShadowlibLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },
    editSdlibDialogClose(){
      this.editSdlibDialogVisible=false;
    },
    //删除
    deletShadowlib(key){
      const _this=this;
      const snodeId=_this.shadowObj.snodeId;
      const domainName = (key.split('.').join('_')).split(':').join('_');
      // const url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?domain="+domainName;
      let url = '';
      _this.getDirectiveLoading=true;
        
      if(_this.isAuto){
        url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?domain="+domainName+"&autoconfig=true";
      }else if(_this.isEditConfig){
        url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?domain="+domainName+"&savedConfig=true";
      }else{
        url=SERVER_API_URL+"pe/shadow/config/shadowlib/"+snodeId+"?domain="+domainName;
      }

      axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdShadowlibData();
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.getDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err);
      })
    },

    // Shadow Cookie验证设置
    getSdDefenseCookieData(){//获取Shadow Cookie验证
      return new Promise((resolve,reject)=>{ 
        const snodeId=this.shadowObj.snodeId;
        this.getDirectiveLoading=true;
        if(this.isAuto){
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"?autoconfig=true";
        }else if(this.isEditConfig){
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId+"?savedConfig=true";
        }else{
          this.url=SERVER_API_URL+"pe/shadow/dyncookie/"+snodeId;
        }
        axios.get(this.url).then((res)=>{
          // console.log(res);
          if(res.data.responseCode == 0){
            var resData =res.data.data;

            if(resData.shadow_server_cookie_timeout){
              this.defenseCookieswitch=true;//开启
              this.defenseCookieform.defenseTime= resData.shadow_server_cookie_timeout;
              this.defenseCookieform.defenseTimes= resData.shadow_server_cookie_num;
            }

            resolve(resData);
          }else{
            this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
          }
          this.getDirectiveLoading=false;
        }).catch((err)=>{
          console.log(err)
        })
      })
    },
    sdDefCookieSwitchEvent(){//开关事件 开启关闭Shadow Cookie验证功能
      const _this=this;
      if(!_this.defenseCookieswitch){
        _this.$confirm(_this.$t('lg.offdfcookietips'),_this.$t('lg.tips'),{
          confirmButtonText: _this.$t('lg.yes'),
          cancelButtonText: _this.$t('lg.cancel'),
          type: 'warning'
        }).then(()=>{
          _this.getDirectiveLoading=true;
          axios.delete(_this.url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.$refs['defenseCookieform'].resetFields();
            }else{
              _this.defenseCookieswitch=true;
              _this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            _this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err)
          })
        }).catch(()=>{
          _this.defenseCookieswitch=true;
          _this.$message({
            type: 'info',
            message: _this.$t('lg.canceled')
          });
        })
      }else{
        _this.defenseCookieswitch=false;
        _this.$message.error(_this.$t('lg.ondfcookietips'));
      }
    },
    submitdefenseCookie(type){//增改cookie都需要把cookie参数都传给后台，后台只对数据进行覆盖
      const _this=this;
      this.$refs['defenseCookieform'].validate((valid) => {
        if (valid) {
          this.getDirectiveLoading=true;
          let requestMethod='post';
          if(type){ requestMethod='patch'} //添加
          axios[requestMethod](this.url,{
            timeout:this.defenseCookieform.defenseTime,
            num:this.defenseCookieform.defenseTimes
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.defenseCookieswitch=true;
              this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
            }else{
              this.$message.error(_this.$t('lg.failed')+':'+res.data.data.message);
            }
            this.getDirectiveLoading=false;
          }).catch((err)=>{
            console.log(err);
          })
        }
      })
    },

    //关闭弹框
    directiveDialogClose(){
      this.activeName='';

      this.$refs['rejectHeaderDctform'].resetFields();

      this.$refs['verifyLimitIpDctform'].resetFields();

      this.whiteListswitch=false;
      this.whiteIplistData=[];
      this.whiteIpListRemark='';
      this.$refs['whiteListform'].resetFields();

      this.agtTimeoutSwitch=false;
      this.$refs['agtTimeoutform'].resetFields();

      this.sdApiSwitch=false;
      this.$refs['sdApiform'].resetFields();

      this.shadowlibData={};
      
      this.defenseCookieswitch=false;//关闭
      this.$refs['defenseCookieform'].resetFields();

      this.$emit("setbysdSeniorInstructmodal",false);
    }
  },
  filters:{
    toBase64(data){
      return Base64.decode(data)
    }
  }
}
</script>

<style scoped>
.directiveBox{
  background: #f7f7f7;
  padding: 12px;
  position: relative;
}
.directiveTitle{
  font-size: 18px; 
  color: #333; 
  margin:5px 0 15px;
}
.seniorDctBox{
  background: #f7f7f7;
  padding: 30px 12px 12px;
  position: relative;
}
.seniorDctBox2{
  background: #f7f7f7;
  padding: 50px 12px 12px;
  position: relative;
}
.addSeniorDctBtn{
  position: absolute;
  right: 12px;
  top: 12px;
}
.dataBox{
  max-height: 370px;
  overflow-y: auto;
}

/* IP白名单 */
.wIpRemarkBox{
  margin-top: 10px;
}
.wIpRemarkTxt{
  line-height: 20px;
  word-break: break-all;
}
.wIpRemarkBtn{
  padding: 0;
  border: none;
}
/* end */

/*Js配置选项*/
.el-radio{
  margin: 5px 25px 5px 0px;
}

.sdlibList li{
  line-height: 24px;
}
.sdlibList li i{
  font-size: 12px;
}
/* end */
</style>
