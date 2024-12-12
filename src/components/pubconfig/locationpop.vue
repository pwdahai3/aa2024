<!-- 双击location节点增加指令 --><!--可删组件-->
<template>
  <div>
    <el-dialog width="80%" :title="locationObj.nameTxt" :visible.sync="locationDialogVisible" :close-on-click-modal="false" :before-close="locationPopClose">
      <el-row>
        <el-col :span="12">
          <div class="grid-content" style="margin-right:30px">
            <div style="margin-left:5px;">
              <el-radio class="tabBtn" v-model="subfilterType" label="shadow_sub_filter" border size="small">{{$t('lg.protectconfig')}}</el-radio>
              <el-radio class="tabBtn" v-model="subfilterType" label="shadow_sub_filter_ex" border size="small">{{$t('lg.spconfig')}}</el-radio>
              <el-radio class="tabBtn" v-model="subfilterType" label="shadow_location" border size="small">{{$t('lg.jumpconfig')}}</el-radio>
              <el-radio class="tabBtn" v-model="subfilterType" label="shadow_custom" border size="small">{{$t('lg.zidingyipz')}}</el-radio>
              <el-radio class="tabBtn" v-model="subfilterType" label="shadow_sub_types" border size="small">{{$t('lg.highconfig')}}</el-radio>
              <span class="el-icon-document pub_guide" :title="$t('lg.configguide')" @click="lcGuideShow"><i>{{$t('lg.guide')}}</i></span>
            </div>
            <div>
              <div v-show="subfilterType=='shadow_sub_filter'"><!--保护配置-->
                <el-form ref="locationform1" :model="locationform1" :rules="locationPopRules1" :label-width="$store.state.isencn=='en'?'180px':'110px'">
                  <el-form-item :label="$t('lg.ourl')" prop="uri1">
                    <el-input v-model.trim="locationform1.uri1"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.url2')" prop="uri2">
                    <el-input v-model.trim="locationform1.uri2"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.timeoutset')" prop="time">
                    <el-input v-model.trim="locationform1.time" style="width:40%"></el-input>
                    <el-select v-model="overTimeValue" placeholder="$t('lg.select')" style="width:30%">
                      <el-option
                        v-for="item in overTimeUnit"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('lg.allowedrefreshes')" prop="refreshtimes">
                    <el-input v-model.trim="locationform1.refreshtimes"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.configproperty')">
                    <div class="checkBorder">
                      <el-checkbox-group v-model="locationform1.raeChecklist" size="mini" @change="checkedChange">
                        <el-checkbox :label="$t('lg.replaceconfig')"></el-checkbox>
                        <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="isCheckDisable"></el-checkbox>
                        <el-checkbox :label="$t('lg.encrypt2')" :disabled="isCheckDisable"></el-checkbox>
                        <el-checkbox :label="$t('lg.encryptab')" :disabled="isCheckDisable"></el-checkbox>
                        <!-- <el-checkbox :label="$t('lg.encryptpa')" :disabled="isCheckDisable"></el-checkbox> -->
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addCmd_shadowsubfilter('locationform1')">{{$t('lg.addconfig')}}</el-button>
                    <el-button @click="locationPopClose">{{$t('lg.cancel')}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="subfilterType=='shadow_sub_filter_ex'"><!--特殊保护配置-->
                <el-form ref="locationform3" :model="locationform3" :rules="locationPopRules3" :label-width="$store.state.isencn=='en'?'180px':'110px'">
                  <el-form-item :label="$t('lg.ourl')" prop="uri1">
                    <el-input v-model.trim="locationform3.uri1"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.remained')" prop="uri2">
                    <el-input v-model.trim="locationform3.uri2"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.url2')" prop="uri3">
                    <el-input v-model.trim="locationform3.uri3"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.timeoutset')" prop="time">
                    <el-input v-model.trim="locationform3.time" style="width:40%"></el-input>
                    <el-select v-model="overTimeEXValue" :placeholder="$t('lg.select')" style="width:30%">
                      <el-option
                        v-for="item in overTimeUnit"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('lg.allowedrefreshes')" prop="refreshtimes">
                    <el-input v-model.trim="locationform3.refreshtimes"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.configproperty')" label-width="110px">
                    <div class="checkBorder">
                      <el-checkbox-group v-model="locationform3.raeChecklist" size="mini">
                        <!-- <el-checkbox :label="$t('lg.replaceconfig')"></el-checkbox> -->
                        <!-- <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="isCheckEXDisable"></el-checkbox> -->
                        <el-checkbox :label="$t('lg.encrypt2')"></el-checkbox>
                        <el-checkbox :label="$t('lg.encryptab')"></el-checkbox>
                        <el-checkbox :label="$t('lg.encryptpa')" disabled></el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addCmd_shadowsubfilterEX('locationform3')">{{$t('lg.addconfig')}}</el-button>
                    <el-button @click="locationPopClose">{{$t('lg.cancel')}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="subfilterType=='shadow_location'"><!--跳转配置-->
                <el-form ref="locationform2" :model="locationform2" :rules="locationPopRules2" label-width="50px">
                  <el-form-item :label="$t('lg.domain')" prop="uri1">
                    <el-input v-model.trim="locationform2.uri1"></el-input>
                  </el-form-item>
                  <el-form-item label="URI" prop="uri2">
                    <el-input v-model.trim="locationform2.uri2"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addCmd_shadowlocation('locationform2')">{{$t('lg.addconfig')}}</el-button>
                    <el-button @click="locationPopClose">{{$t('lg.cancel')}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="subfilterType=='shadow_custom'"><!--自定义配置-->
                <el-form :model="customInstructform" ref="customInstructform" :rules="customInstructformRules" label-width="80px">
                  <el-form-item :label="$t('lg.peizhimc')" prop="customIName">
                    <el-input v-model.trim="customInstructform.customIName" :placeholder="$t('lg.peizhimc')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('lg.peizhics')" prop="customIParam">
                    <el-input v-model.trim="customInstructform.customIParam" :placeholder="$t('lg.peizhics')"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="addCmd_shadowCustom('customInstructform')">{{$t('lg.addconfig')}}</el-button>
                    <el-button @click="locationPopClose">{{$t('lg.cancel')}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div v-show="subfilterType=='shadow_sub_types'"><!--高级配置-->
               
                <el-form ref="locationform4" :model="locationform4" :rules="locationPopRules4"><!--特殊文件类型-->
                  <el-row :gutter="20">
                    <el-col :span="20">
                      <div class="seniorItemBox">
                        <el-form-item :label="$t('lg.specialtype')" prop="uri1" label-width="110px">
                          <el-select style="width:100%;" v-model.trim="locationform4.uri1" filterable allow-create clearable :placeholder="$t('lg.specialtype')">
                            <el-option
                              v-for="item in locationform4.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>
                    
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform4')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item>
                    </el-col> 
                  </el-row>
                </el-form> 

                <el-form ref="locationform5" :model="locationform5" :rules="locationPopRules5"><!--Header补全-->
                  <el-row :gutter="20">
                    <el-col :span="20">
                      <div class="seniorItemBox">
                        <el-form-item :label="$t('lg.headercompletion')" prop="uri1" :label-width="$store.state.isencn=='en'?'200px':'110px'">
                          <el-select style="width:100%;" v-model.trim="locationform5.uri1" filterable allow-create clearable :placeholder="$t('lg.headercompletion')">
                            <el-option
                              v-for="item in locationform5.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>  
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform5')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item>
                    </el-col>    
                  </el-row>
                </el-form>

                <el-form ref="locationform6" :model="locationform6" :rules="locationPopRules6"><!--Header修改-->
                  <el-row :gutter="20">
                    <el-col :span="20">
                      <div class="seniorItemBox">
                        <el-form-item :label="$t('lg.headeredit')" prop="uri1" label-width="110px">
                          <el-select style="width:100%;" v-model.trim="locationform6.uri1" filterable allow-create clearable :placeholder="$t('lg.select')">
                            <el-option
                              v-for="item in locationform6.options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col>  
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform6')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item> 
                    </el-col> 
                  </el-row> 
                </el-form>

                <el-form ref="locationform8" :model="locationform8" :rules="locationPopRules8"><!--请求时间-->
                  <el-row :gutter="20">
                    <el-col :span="20" >
                      <div class="seniorItemBox sdReqTimeBox">
                        <el-form-item :label="$t('lg.shoudongdlsz')" prop="sdRequestTime" label-width="135px" style="width:80%">
                          <el-input v-model="locationform8.sdRequestTime" :placeholder="$t('lg.requestime')"></el-input>
                        </el-form-item>
                        <el-form-item style="width:20%">
                          <el-select v-model="locationform8.sdRequestTimeUnit" :placeholder="$t('lg.select')">
                            <el-option
                              v-for="item in locationform8.sdRequestUnitOpt"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </div>
                    </el-col> 
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform8')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item> 
                    </el-col> 
                  </el-row> 
                </el-form>

                <el-form ref="locationform9" :model="locationform9" :rules="locationPopRules9"><!--浏览器参数指标-->
                  <el-row :gutter="20">
                    <el-col :span="20" >
                      <div class="seniorItemBox">
                        <el-form-item :label="$t('lg.browserParams')" prop="verifyBrowser" label-width="130px">
                          <el-input v-model="locationform9.verifyBrowser" :placeholder="$t('lg.browserParams')"></el-input>
                        </el-form-item>
                      </div>
                    </el-col> 
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform9')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item> 
                    </el-col> 
                  </el-row> 
                </el-form>

                <el-form ref="locationform10" :model="locationform10" :rules="locationPopRules10"><!--用户行为指标-->
                  <el-row :gutter="20">
                    <el-col :span="20" >
                      <div class="seniorItemBox">
                        <el-form-item :label="$t('lg.userBhIndct')" prop="verifyAgent" label-width="130px">
                          <el-input v-model="locationform10.verifyAgent" :placeholder="$t('lg.userBhIndct')"></el-input>
                        </el-form-item>
                      </div>
                    </el-col> 
                    <el-col :span="4">
                      <el-form-item>
                        <el-button type="primary" @click="update_special('locationform10')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                      </el-form-item> 
                    </el-col> 
                  </el-row> 
                </el-form>

                <el-form ref="locationform11" :model="locationform11" :rules="locationPopRules11"><!--开启动态指纹功能-->
                  <el-row :gutter="20">
                    <el-col :span="20" >
                      <div class="seniorItemBox">    
                        <el-form-item :label="$t('lg.kaiqidtzwgg')" prop="isVerifyToken" label-width="135px">
                          <el-checkbox style="margin-right:10px;" v-model="locationform11.isVerifyToken" :label="$t('lg.click')" border></el-checkbox>
                        </el-form-item>
                      </div>
                    </el-col> 
                  <el-col :span="4">
                    <el-form-item>
                      <el-button type="primary" @click="update_special('locationform11')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                    </el-form-item> 
                  </el-col> 
                </el-row> 
                </el-form>

                <el-form ref="locationform7" :model="locationform7" :rules="locationPopRules7"><!--Js增强功能-->
                  <el-row :gutter="20">
                    <el-col :span="20" >
                      <div class="seniorItemBox">    
                        <el-form-item :label="$t('lg.jstrong')" prop="isEnhance" label-width="95px">
                          <el-checkbox style="margin-right:10px;" v-model="locationform7.isEnhance" :label="$t('lg.click')" border></el-checkbox>
                          <span>（{{$t('lg.zhu2')}}{{$t('lg.clientcheck')}}）</span>
                        </el-form-item>
                      </div>
                    </el-col> 
                    <el-col :span="4">
                    <el-form-item>
                      <el-button type="primary" @click="update_special('locationform7')" size="small" class="seniorItemBtn">{{$t('lg.yes')}}</el-button>
                    </el-form-item> 
                    </el-col> 
                  </el-row> 
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content">
            <p v-if="uriCmdData.length==0" class="nodata-box">{{$t('lg.nodata')}}</p>
            <div v-if="uriCmdData.length>0">
              <table>
                <tbody>
                  <tr v-for="item in uriCmdData">
                    <td>{{item.subfilterTypeTxt}}</td>
                    <td>{{item.uri1}}</td>
                    <td>{{item.uri2}}</td>
                    <td v-if="hasEx">{{item.uri3}}</td>
                    <td class="text-center font-red fsize-12 cursor-pointer" @click="deleUriCmd(item)">{{$t('lg.delete')}}</td>
                  </tr>
                </tbody>
              </table>
              <div class="margin-tb text-right"><el-button type="primary" @click="submitUriCmd">{{$t('lg.add')}}</el-button></div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-show="uriLoading">
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <el-dialog width="60%" :title="$t('lg.configguide')" :visible.sync="islcGuideShow" :before-close="lcGuideClose"><!--配置参考指南-->
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.gde21')}}
          </template>
          <div>
            <p>1、{{$t('lg.gde22')}}。</p>
            <p>2、{{$t('lg.gde23')}}：</p>
            <ul>
              <li>（1）{{$t('lg.gde24')}}。</li>
              <li>（2）{{$t('lg.gde25')}}。</li>
              <li>（3）{{$t('lg.gde26')}}。</li>
              <li>（4）{{$t('lg.gde27')}}。</li>
              <li>（5）{{$t('lg.gde28')}}。</li>
            </ul>
            <p>3、{{$t('lg.eg')}}:<img class="guidePic" src="static/location_guide/-kk.jpg" alt=""></p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.gde29')}}
          </template>
          <div>
            <p>1、{{$t('lg.gde30')}}。</p>
            <p>2、{{$t('lg.gde31')}}：</p>
            <ul>
              <li>（1）{{$t('lg.gde32')}}。</li>
              <li>（2）{{$t('lg.gde33')}}。</li>
            </ul>
            <p>3、{{$t('lg.eg')}}:</p>
            <ul>
              <li>
                <p>（1）{{$t('lg.gde34')}}：<img class="guidePic" src="static/location_guide/tzpz1.jpg" alt=""></p>
                <p>{{$t('lg.gde35')}}：<img class="guidePic" src="static/location_guide/tzpz1-sl.jpg" alt=""></p>
              </li>
              <li>
                <p>（2）{{$t('lg.gde36')}}：<img class="guidePic" src="static/location_guide/tzpz2.jpg" alt=""></p>
                <p>{{$t('lg.gde35')}}：<img class="guidePic" src="static/location_guide/tzpz2-sl.jpg" alt=""></p>
              </li>
            </ul>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.gde37')}}
          </template>
          <div>
            <p>1、{{$t('lg.gde38')}}。</p>
            <p>2、{{$t('lg.gde39')}}：</p>
            <ul>
              <li>（1）{{$t('lg.gde40')}}。</li>
            </ul>
            <p>3、{{$t('lg.gde41')}}：<img class="guidePic" src="static/location_guide/gjpz.jpg" alt=""></p>
            <p>{{$t('lg.gde42')}}：<img class="guidePic" src="static/location_guide/gjpz-sl.jpg" alt=""></p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.gde43')}}
          </template>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.specialtype')}}</p>
            <p>1、{{$t('lg.gde44')}}：<img class="guidePic" src="static/location_guide/tswjlx-sl.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.headercompletion')}}</p>
            <p>1、{{$t('lg.gde45')}}。</p>
            <p>2、{{$t('lg.gde46')}}：<img class="guidePic" src="static/location_guide/hdbc.jpg" alt="">{{$t('lg.asfollows')}}：<img class="guidePic" src="static/location_guide/hdbc-sl.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.headeredit')}}</p>
            <p>1、{{$t('lg.gde49')}}：<img class="guidePic" src="static/location_guide/hdxg-sl.jpg" alt=""></p>
          </div>
          <div>
            <p class="typeTiTle">{{$t('lg.jstrong')}}</p>
            <p>1、{{$t('lg.gde48')}}：<img class="guidePic" src="static/location_guide/jszq-sl.jpg" alt=""></p>
            <p>{{$t('lg.gde50')}}：</p>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <i class="header-icon el-icon-info font-green"></i> &nbsp; {{$t('lg.gde51')}}
          </template>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.gde52')}}</p>
            <p>1、{{$t('lg.gde53')}}。</p>
            <p>2、{{$t('lg.gde54')}}。<img class="guidePic" src="static/location_guide/-k.jpg" alt="">{{$t('lg.asfollows')}}：<img class="guidePic" src="static/location_guide/-kk.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.gde55')}}(-r)</p>
            <p>1、{{$t('lg.gde56')}}。</p>
            <p>2、{{$t('lg.gde57')}}：<img class="guidePic" src="static/location_guide/-r.jpg" alt="">{{$t('lg.asfollows')}}：<img class="guidePic" src="static/location_guide/-rr.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.gde58')}}(-a)</p>
            <p>1、{{$t('lg.gde59')}}。</p>
            <p>2、{{$t('lg.gde60')}}：<img class="guidePic" src="static/location_guide/-aa.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.gde61')}}(-e)</p>
            <p>1、{{$t('lg.gde62')}}。</p>
            <p>2、{{$t('lg.gde63')}}：<img class="guidePic" src="static/location_guide/-e.jpg" alt="">{{$t('lg.asfollows')}}<img class="guidePic" src="static/location_guide/-ee.jpg" alt=""></p>
          </div>
          <div class="typeBox">
            <p class="typeTiTle">{{$t('lg.gde64')}}(-s)</p>
            <p>1、{{$t('lg.gde65')}}。</p>
            <p>2、{{$t('lg.gde63')}}：<img class="guidePic" src="static/location_guide/-s.jpg" alt="">{{$t('lg.asfollows')}}<img class="guidePic" src="static/location_guide/-ss.jpg" alt=""></p>
          </div>
          <div>
            <p class="typeTiTle">{{$t('lg.gde66')}}(-p)</p>
            <p>1、{{$t('lg.gde67')}}。</p>
            <p>2、{{$t('lg.gde68')}}：<img class="guidePic" src="static/location_guide/-p.jpg" alt="">{{$t('lg.asfollows')}}<img class="guidePic" src="static/location_guide/-pp.jpg" alt=""></p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-button type="primary" style="margin-top:40px" @click="islcGuideShow=false">{{$t('lg.yes')}}</el-button>
    </el-dialog>    
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    isAuto:{
      type:Boolean
    },
    isEditConfig:{
      type:Boolean
    },
    locationDialogVisible:{
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
    var validatePass = (rule, value, callback) => {
          var _this=this;
          if (value == false) {
            callback(new Error(_this.$t('lg.select')));
          } else {
            callback();
          }
        };
    return{
      islcGuideShow:false,
      isCheckDisable:false,
      // isCheckEXDisable:false,
      sdLocationFlag:false,//跳转配置只能加一条
      hasEx:false,
      overTimeUnit:[{
        value: 'y',
        label: this.$t('lg.year')
      },{
        value: 'M',
        label: this.$t('lg.month')
      },{
        value: 'w',
        label: this.$t('lg.week')
      },{
        value: 'd',
        label: this.$t('lg.day')
      },{
        value: 'h',
        label: this.$t('lg.hour')
      },{
        value: 'm',
        label: this.$t('lg.minite')
      },{
        value: 's',
        label: this.$t('lg.second')
      },{
        value: 'ms',
        label: this.$t('lg.ms')
      }],
      overTimeValue:'s',
      overTimeEXValue:'s',
      locationform1:{
        uri1:'',
        uri2:'',
        time:500,
        refreshtimes:1,
        raeChecklist:[]
      },
      locationform2:{
        uri1:'',
        uri2:''
      },
      locationform3:{
        uri1:'',
        uri2:'',
        uri3:'',
        time:500,
        refreshtimes:1,
        raeChecklist:[this.$t('lg.encryptpa')]
      },
      locationform4:{
        uri1:'',
        options:[{
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
        }],
      },
      locationform5:{
        uri1:'',
        options:[{
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
        }],
      },
      locationform6:{
        uri1:'',
        options:[{
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
        }],
      },
      locationform7:{
        isEnhance:false,
      },
      locationform8:{
        sdRequestTime:null,
        sdRequestTimeUnit:'s',
        sdRequestUnitOpt:[{
          label:'毫秒',
          value:'ms'
        },{
          label:'秒',
          value:'s'
        }],
      }, 
      locationform9:{
        verifyBrowser:'',
      },
      locationform10:{
        verifyAgent:''
      },
      locationform11:{
        isVerifyToken:false
      },
      
      customInstructform:{
        customIName:'',
        customIParam:''
      },
      locationPopRules1:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        time:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ],
        refreshtimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ]
      },
      locationPopRules2:{//跳转配置不能加空格
        uri1:[ 
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        uri2:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ]            
      },
      locationPopRules3:{
        uri1:[ 
          {required: true, message:this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message:this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri3:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        time:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ],
        refreshtimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ]
      },
      locationPopRules4:{
        uri1:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg3'), trigger: 'change'},
        ],
      },
      locationPopRules5:{
        uri1:[
          {required: true, message:this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg4'), trigger: 'change'},
        ],
      },
      locationPopRules6:{
        uri1:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg4'), trigger: 'change'},
        ],
      },
      locationPopRules7:{
        isEnhance:[
          {required: true, trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'},
        ]
      },
      locationPopRules8:{
        sdRequestTime:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      locationPopRules9:{
        verifyBrowser:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      locationPopRules10:{
        verifyAgent:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      locationPopRules11:{
        isVerifyToken:[
          {required: true, trigger: 'blur'},
          {validator: validatePass, trigger: 'blur'},
        ]
      },
      
      customInstructformRules:{
        customIName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ]
      },
      uriCmdData:[],
      subfilterType:"shadow_sub_filter",//默认tab第一页
      uriCmdLoading:false,
      uriLoading:false,
      isen:false
    }
  },
  watch:{
    "uriCmdData":function(){
      var _this = this;
      _this.hasEx=false;
      _this.uriCmdData.forEach(function(v,i){
        if(v.subfilterType=="shadow_sub_filter_ex"){
          _this.hasEx=true;
        }
      })
    }
  },
  methods:{
    lcGuideShow(){//查看指南
      this.islcGuideShow=true;
    },
    lcGuideClose(){//关闭指南
      this.islcGuideShow=false;
    },
    checkedChange(){//选择替换配置后，禁用其他配置 保护配置
      var _this = this;
      if( _this.locationform1.raeChecklist.length==0){
        _this.isCheckDisable = false;
      };
      _this.locationform1.raeChecklist.forEach(function(v,i){
        if(v=="替换配置" || v=="Replacement configuration"){
          _this.isCheckDisable = true;
          _this.locationform1.raeChecklist=[_this.$t('lg.replaceconfig')];
        }else{
          _this.isCheckDisable = false;
        }
      });
      // console.log( _this.locationform1.raeChecklist)
    },
   // checkedEXChange(){//选择替换配置后，禁用其他配置 特殊保护配置
    //   var _this = this;
    //   if( _this.locationform3.raeChecklist.length==0){
    //     _this.isCheckEXDisable = false;
    //   };
    //   _this.locationform3.raeChecklist.forEach(function(v,i){
    //     if(v=="替换配置" || v=="Replacement configuration"){
    //       _this.isCheckEXDisable = true;
    //       _this.locationform3.raeChecklist=[_this.$t('lg.replaceconfig')];
    //     }else{
    //       _this.isCheckEXDisable = false;
    //     }
    //   });
    //   if( _this.locationform3.raeChecklist.length==0){
    //     _this.isCheckEXDisable = false;
    //   };
   // },
    locationPopClose(){
      this.$refs['locationform1'].resetFields();
      this.$refs['locationform2'].resetFields();
      this.$refs['locationform3'].resetFields();
      this.$refs['customInstructform'].resetFields();
      this.$refs['locationform4'].resetFields();
      this.$refs['locationform5'].resetFields();
      this.$refs['locationform6'].resetFields();
      this.$refs['locationform7'].resetFields();
      this.$refs['locationform8'].resetFields();
      this.$refs['locationform9'].resetFields();
      this.$refs['locationform10'].resetFields();
      this.$refs['locationform11'].resetFields();
      this.subfilterType="shadow_sub_filter";
      this.isCheckDisable = false;
      // this.isCheckEXDisable = false;
      this.sdLocationFlag=false;
      this.uriCmdData=[];
      this.locationform1.raeChecklist=[];
      this.locationform3.raeChecklist=[this.$t('lg.encryptpa')];
      this.$emit('setbylocationpopchild',false);
    },
    deleUriCmd(item){//删除预览列表的配置
      if(item.subfilterType=="shadow_location"){
        this.sdLocationFlag=false;
      }
      this.uriCmdData.splice(this.uriCmdData.indexOf(item),1)
    },
    addCmd_shadowsubfilter(formname){//添加到预览列表 保护配置
      var _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var rr=_this.$t('lg.replaceconfig'),
              aa=_this.$t('lg.allowaccessourl'),
              ee=_this.$t('lg.encrypt2'),
              ss=_this.$t('lg.encryptab'),
              pp=_this.$t('lg.encryptpa');
          var thisLocationForm1=this.locationform1;
          var uri1=thisLocationForm1.uri1,
              uri2=thisLocationForm1.uri2,
              time=thisLocationForm1.time+this.overTimeValue,
              refreshtimes=thisLocationForm1.refreshtimes,
              raeChecklist=thisLocationForm1.raeChecklist;
          var getARE=raeChecklist.join("").replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,'s');
          var cmdData={
                "subfilterType":"shadow_sub_filter",
                "subfilterTypeTxt":this.$t('lg.baohupz'),
                "uri1":uri1,
                "uri2":uri2,
                "time":time,
                "refreshtimes":refreshtimes,
                "oarj":getARE
              };
          this.uriCmdData.push(cmdData);
        }
      });
    },
    addCmd_shadowsubfilterEX(formname){//添加到预览列表 特殊保护配置
      var _this=this;
      this.$refs[formname].validate((valid) => {
        if (valid) {
          var ee=_this.$t('lg.encrypt2'),//rr=_this.$t('lg.replaceconfig'),aa=_this.$t('lg.allowaccessourl'),
              ss=_this.$t('lg.encryptab'),
              pp=_this.$t('lg.encryptpa');
          var thisLocationForm3=this.locationform3;
          var uri1=thisLocationForm3.uri1,
              uri2=thisLocationForm3.uri2,
              uri3=thisLocationForm3.uri3,
              time=thisLocationForm3.time+this.overTimeEXValue,
              refreshtimes=thisLocationForm3.refreshtimes,
              raeChecklist=thisLocationForm3.raeChecklist;
          var getARE=raeChecklist.join("").replace(ee,"e").replace(ss,'s').replace(pp,'p');
          var cmdData={
                "subfilterType":"shadow_sub_filter_ex",
                "subfilterTypeTxt":this.$t('lg.teshubhpz'),
                "uri1":uri1,
                "uri2":uri2,
                "uri3":uri3,
                "time":time,
                "refreshtimes":refreshtimes,
                "oarj":getARE
              };
          this.uriCmdData.push(cmdData);
        }
      });
    },
    addCmd_shadowlocation(formname){//添加到预览列表 跳转配置
      this.$refs[formname].validate((valid) => {
        if (valid) {
          if(!this.sdLocationFlag){
            var thisLocationForm2=this.locationform2;
            var uri1=thisLocationForm2.uri1,
                uri2=thisLocationForm2.uri2;
            var cmdData={
                  "subfilterType":"shadow_location",
                  "subfilterTypeTxt":this.$t('lg.tiaozpz'),
                  "uri1":uri1,
                  "uri2":uri2
                };
            this.uriCmdData.push(cmdData);
            this.sdLocationFlag=true;
            // this.$refs['locationform2'].resetFields();//清空
          }else{
            this.$message.error(this.$t('lg.zhu8'));
          }
        }
      });
    },
    addCmd_shadowCustom(formname){////添加到预览列表 自定义配置
      this.$refs[formname].validate((valid) => {
        if (valid) {
          const cIName=this.customInstructform.customIName;
          const cIParam=this.customInstructform.customIParam;
          var cmdData={
                "subfilterType":'shadow_custom',//自定义配置无固定subfilterType，这里shadow_custom是自己随便定义的，以便区分
                "subfilterTypeTxt":this.$t('lg.zidingyipz'),
                "uri1":cIName,
                "uri2":cIParam
              };
          this.uriCmdData.push(cmdData);
        }
      })
    },
    submitUriCmd(){//增加配置
      var _this=this;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;
      var port=_this.domainObj.port;
      var cmdData=_this.uriCmdData;
      var handleCmdData=[];
      for(var k in cmdData){
        // console.log(cmdData)
        var cmdDataItem=cmdData[k];
        var str="";
        if(cmdDataItem.subfilterType=="shadow_sub_filter"){//保护配置
          var oarjV=cmdDataItem['oarj'];
          if(oarjV==""){//不传入配置属性时 
            str="'"+cmdDataItem['uri1']+"'"+" "+"'"+cmdDataItem['uri2']+"'"+" "+cmdDataItem['time']+" "+cmdDataItem['refreshtimes'];
          }else{
            str="'"+cmdDataItem['uri1']+"'"+" "+"'"+cmdDataItem['uri2']+"'"+" "+cmdDataItem['time']+" "+cmdDataItem['refreshtimes']+" "+oarjV;
          }
          str=Base64.encode(str);
          handleCmdData.push({
            shadow_sub_filter:str
          })
        }else if(cmdDataItem.subfilterType=="shadow_location"){//添加跳转配置，域名作为第二个参数，uri为第一个参数  当中传入域名时则只传入一个参数
          if(cmdDataItem['uri2']==''){
            str="'"+cmdDataItem['uri1']+"'";
          }else{
            str="'"+cmdDataItem['uri2']+"'"+" "+"'"+cmdDataItem['uri1']+"'"; 
          }
          str=Base64.encode(str);
          handleCmdData.push({
            shadow_location:str
          })
        }else if(cmdDataItem.subfilterType=="shadow_sub_filter_ex"){//特殊保护配置
          var oarjV=cmdDataItem['oarj'];
          if(oarjV==""){//不传入配置属性时 
            str="'"+cmdDataItem['uri1']+"'"+" "+"'"+cmdDataItem['uri2']+"'"+" "+"'"+cmdDataItem['uri3']+"'"+" "+cmdDataItem['time']+" "+cmdDataItem['refreshtimes'];
          }else{
            str="'"+cmdDataItem['uri1']+"'"+" "+"'"+cmdDataItem['uri2']+"'"+" "+"'"+cmdDataItem['uri3']+"'"+" "+cmdDataItem['time']+" "+cmdDataItem['refreshtimes']+" "+oarjV;
          }
          str=Base64.encode(str);
          handleCmdData.push({
            shadow_sub_filter_ex:str
          })
        }else if(cmdDataItem.subfilterType=="shadow_custom"){ //添加自定义配置，自定义配置无固定subfilterType
          let str = "";
          if(cmdDataItem['uri2']!=''){
            str=cmdDataItem['uri2'];
          }
          str=Base64.encode(str);
          handleCmdData.push({
            [cmdDataItem.uri1]:str
          })
        }
      }
      // console.log(handleCmdData);
      var type=_this.locationObj.type;
      var location=_this.locationObj.name;
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      }
      var dataJson={
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            locationName:location,
            locationType:type,
            directives:handleCmdData
          };
      // console.log(dataJson)
      _this.uriLoading=true;
      axios.post(url,dataJson).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$emit("updateRenderTree");
          _this.locationPopClose();//增加成功，关闭弹窗
        }else{
          const responseMsg=res.data.data.message;
          if(responseMsg.indexOf("duplicate") != -1){
            _this.$message.error(_this.$t('lg.failed')+': '+ this.$t('lg.zhu9'));
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ responseMsg);
          }
        }
        _this.uriLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
    update_special(formname){//更新 高级配置
      var _this=this;
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      }
      var type=_this.locationObj.type;
      var location=_this.locationObj.name;
      var snodeId=_this.shadowObj.snodeId;
      var domainName=_this.domainObj.domainName;
      var port=_this.domainObj.port;
      var handleCmdData=[];
      var str="";
      if(formname=="locationform4"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            str=Base64.encode(_this.locationform4.uri1);
            handleCmdData.push({
              shadow_sub_filter_types:str
            })
          }
        });
      }else if(formname=="locationform5"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            str=Base64.encode(_this.locationform5.uri1);
            handleCmdData.push({
              add_header:str
            })
          }
        });
      }else if(formname=="locationform6"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            str=Base64.encode(_this.locationform6.uri1);
            handleCmdData.push({
              shadow_modify_header:str
            })
          }
        });
      }else if(formname=="locationform7"){//Js增强功能
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            // str=Base64.encode("/formvalidator/shadowlib.js"); //单个js 2018.12.05
            // str = Base64.encode("/formvalidator/fp-jq-base.js"); //两个js 2018.12.05  一个js 2019.08.07
            // var str2 = Base64.encode("'<head>' '<head> <script src=\"/formvalidator/jsen-cryp-base.js\"><\/script>' 10000s 100 r");
            // var str2 = Base64.encode("'</title>' '</title> <script src=\"/formvalidator/shadowlib.js\"><\/script>' 10000s 100 r");
            var str = Base64.encode("pe 10s 1 '</title>' '</title> <script src=\"/formvalidator/' 'shadowlib.js' '\"><\/script>'");//2019-10-25 一个js js本身修改了
            handleCmdData.push({
              // shadow_insert_js:str,
              shadow_insert_js_ex:str//一个js 
            })
          }
        });
      }else if(formname=="locationform8"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            const str = Base64.encode(_this.locationform8.sdRequestTime+_this.locationform8.sdRequestTimeUnit)
            handleCmdData.push({
              shadow_request_time:str,
            })
          }
        });
      }else if(formname=="locationform9"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            const str = Base64.encode(_this.locationform9.verifyBrowser);
            handleCmdData.push({
              shadow_verify_browser:str,
            })
          }
        });
      }else if(formname=="locationform10"){
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            const str = Base64.encode(_this.locationform10.verifyAgent);
            handleCmdData.push({
              shadow_verify_agent:str
            })
          }
        });
      }else if(formname=="locationform11"){//开启动态指纹功能
        _this.$refs[formname].validate((valid) => {
          if (valid) {
            const verifyToken = _this.locationform11.isVerifyToken?1:0;
            const str = Base64.encode(verifyToken)
            handleCmdData.push({
              shadow_verify_token:str,
            })
          }
        });
      }
      // console.log(handleCmdData);
      if(handleCmdData.length==0){
        return false;
      }
      var dataJson={
            snodeId:snodeId,
            domainName:domainName,
            domainPort:port,
            locationName:location,
            locationType:type,
            directives:handleCmdData
          };
      // console.log(dataJson);
      _this.uriLoading=true;
      axios.post(url,dataJson).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$emit("updateRenderTree");
          // this.locationPopClose();//更新成功，关闭弹窗
        }else{
          const responseMsg=res.data.data.message;
          if(responseMsg.indexOf("duplicate") != -1){
            _this.$message.error(_this.$t('lg.failed')+': '+ this.$t('lg.zhu10'));
          }else{
            _this.$message.error(_this.$t('lg.failed')+': '+ responseMsg);
          }
        }
        _this.uriLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    }
  },
  components:{
    loading
  }
}
</script>
<style>
.tabBtn{
  margin-bottom: 20px!important; 
  margin-right: 10px!important;
  margin-left: 0px!important;
}
/*指南*/
.typeBox{
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 2px dashed #ebeef5;
}
.typeTiTle{
  font-weight: 700;
}
.seniorItemBox{
  border: 1px dashed #ccc;
  margin-bottom: 10px;
  padding: 20px 20px 0px 10px;
  overflow: hidden;
}
.seniorItemBtn{
  margin-top: 25px;
}
.sdReqTimeBox{
  display: flex;
  justify-content: space-between;
}
</style>
