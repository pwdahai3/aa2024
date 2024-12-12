<template>
  <div class="quickconfig-wrapper">
    <el-form ref="shadownodesform" :model="shadownodesform" label-width="130px" :rules="shadownodesformRules" class="orderBoxJamb" style="margin-bottom:0">
      <el-form-item :label="$t('lg.shadownode')" prop="shadownodes">
        <el-select v-model="shadownodesform.shadownodes" :placeholder="$t('lg.select')" style="width:50%" @change="selectNode">
          <template v-for="n in nodesdata">
            <el-option :label="n.isShadowGroup?n.hostName+'('+$t('lg.group')+')':n.hostName+'('+n.snodeId+')'" :value="n.snodeId"></el-option>
          </template>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="domainbox">
      <p style="text-align:center" v-if="domaindata.length==0">{{$t('lg.nodata')}}</p>
      <div v-else>
        <p style="font-weight:bold">{{$t('lg.domain')}}</p>
        <a class="domaina" :class="active==index?'active':''" href="javascript:;" @click="clickDomain(item,index)" v-for="(item,index) in domaindata" :key="index">{{item.domainName}}<span v-if="item.domainPort">:{{item.domainPort}}</span></a>
      </div>
    </div>
    <div class="locationbox">
      <p v-if="showLocation && showLocation.length==0">{{$t('lg.nodata')}}</p>
    <el-form ref="expandform" :model="expandform"   :label-width="$store.state.isencn=='en'?'230px':'140px'">
      <div v-if="locationdata.length>0">
        <p class="lineh24" style="font-weight:bold">{{$t('lg.fhyymldzdfs')}}：</p>
        <p class="lineh24">
          <span class="lineh24sp"><a class="titlea" href="javascript:;" :alt="$t('lg.zhu51')" :title="$t('lg.zhu51')">{{$t('lg.jinfhtdmuludiz')}}(如：/index/login.jsp)</a> </span> 
          <span class="lineh24sp lhright"><a href="javascript:;" class="addloc" @click="locationPop('accurateMatch')">{{$t('lg.add')}}+</a></span>
        </p>
        <div class="match4tmpdata">
          <ul class="match4ul">
            <li class="match4li" v-for="(item,idx) in match4Tmp.accurateMatch" :key="idx">
              <div class="lidiv">
              <span class="locflexl">{{item.locationName}}</span>
              <span class="locflexr"><a href="javascript:;" class="ra" @click="accurateClps(item,idx,'accurateMatch')">{{$t('lg.celuebianj')}}</a><a href="javascript:;" class="ra" @click="lcDelete(item,idx,'accurateMatch')">{{$t('lg.delete')}}</a></span>
            </div>
            <div class="expandbox" v-show="accurateFlag && accurateCollapse==idx">
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu52')}}？ </p>
                  <p class="pp">{{$t('lg.zhu53')}}？</p>
                  <el-form-item :label="$t('lg.kaiqishoudongdlsz')">
                    <el-switch v-model="match4Tmp.accurateMatch[idx].shadow_request_time_switch"></el-switch>
                  </el-form-item>
                  <el-form-item :label="$t('lg.canssz')" prop="shadow_request_time" :rules="{pattern:/^[0-9]+$/,message: $t('lg.shuruzhengs'), trigger: 'change'}">
                    <el-input v-model.trim="match4Tmp.accurateMatch[idx].shadow_request_time"></el-input>
                  </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu54')}}？</p>
                  <!--<el-form-item label="开启浏览器参数指标功能" label-width="170px">
                    <el-switch v-model="match4Tmp.accurateMatch[idx].shadow_verify_browser_switch"></el-switch>
                  </el-form-item>
                   <el-form-item label="参数指标" prop="shadow_verify_browser" :rules="{pattern:/^[0-9]+$/,message: '请输入正数', trigger: 'change'}">
                    <el-input v-model.trim="match4Tmp.accurateMatch[idx].shadow_verify_browser"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.canshuzhib')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.accurateMatch[idx].shadow_verify_browser" :max="7" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu55')}}？</p>
                 <!-- <el-form-item label="开启用户行为指标功能" label-width="155px">
                  <el-switch v-model="match4Tmp.accurateMatch[idx].shadow_verify_agent_switch"></el-switch>
                </el-form-item>
                   <el-form-item label="行为指标" prop="shadow_verify_agent">
                    <el-input v-model.trim="match4Tmp.accurateMatch[idx].shadow_verify_agent"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.xingweizb')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.accurateMatch[idx].shadow_verify_agent" :max="3" show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                </div>
                 <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu56')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.accurateMatch[idx].param_verify_switch"></el-switch>
                </el-form-item>

                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu57')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.accurateMatch[idx].bot_conf_switch"></el-switch>
                </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu58')}}</p>
                  <el-form-item :label="$t('lg.jszcfs')" prop="insertJsType">
                  <el-radio v-model="match4Tmp.accurateMatch[idx].insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="match4Tmp.accurateMatch[idx].insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="match4Tmp.accurateMatch[idx].insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                </div>
            </div>
            </li>
          </ul>
        </div>
        <p class="lineh24">
          <span class="lineh24sp"><a href="javascript:;" class="titlea" :alt="$t('lg.zhu60')" :title="$t('lg.zhu60')">{{$t('lg.zhu59')}}(如：jsp、html)</a></span>  
          <span class="lineh24sp lhright"><a href="javascript:;" class="addloc" @click="locationPop('suffixMatch')">{{$t('lg.add')}}+</a></span>
        </p>
        <div class="match4tmpdata">
          <ul class="match4ul">
            <li class="match4li" v-for="(item,idx) in match4Tmp.suffixMatch">
              <div class="lidiv">
              <span class="locflexl">{{item.locationName}}</span>
              <span class="locflexr"><a href="javascript:;" class="ra" @click="suffixClps(item,idx,'suffixMatch')">{{$t('lg.celuebianj')}}</a><a href="javascript:;" class="ra" @click="lcDelete(item,idx,'suffixMatch')">{{$t('lg.delete')}}</a></span>
            </div>
            <div class="expandbox" v-show="suffixFlag && suffixCollapse==idx">
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu52')}} </p>
                  <p class="pp">{{$t('lg.zhu53')}}</p>
                  <el-form-item :label="$t('lg.kaiqishoudongdlsz')" label-width="125px">
                    <el-switch v-model="match4Tmp.suffixMatch[idx].shadow_request_time_switch"></el-switch>
                  </el-form-item>
                  <el-form-item :label="$t('lg.canssz')" prop="shadow_request_time">
                    <el-input v-model.trim="match4Tmp.suffixMatch[idx].shadow_request_time"></el-input>
                  </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu54')}}？</p>
                 <!-- <el-form-item label="开启浏览器参数指标功能" label-width="170px">
                    <el-switch v-model="match4Tmp.suffixMatch[idx].shadow_verify_browser_switch"></el-switch>
                  </el-form-item>
                   <el-form-item label="参数指标" prop="shadow_verify_browser">
                    <el-input v-model.trim="match4Tmp.suffixMatch[idx].shadow_verify_browser"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.canshuzhib')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.suffixMatch[idx].shadow_verify_browser" :max="7"></el-slider>
                      </div>
                  </div>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu55')}}？</p>
                 <!-- <el-form-item label="开启用户行为指标功能" label-width="155px">
                  <el-switch v-model="match4Tmp.suffixMatch[idx].shadow_verify_agent_switch"></el-switch>
                </el-form-item>
                   <el-form-item label="行为指标" prop="shadow_verify_agent">
                    <el-input v-model.trim="match4Tmp.suffixMatch[idx].shadow_verify_agent"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.xingweizb')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.suffixMatch[idx].shadow_verify_agent" :max="3"  show-stops show-tooltip></el-slider>
                      </div>
                  </div>
                </div>
                 <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu56')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.suffixMatch[idx].param_verify_switch"></el-switch>
                </el-form-item>

                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu57')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.suffixMatch[idx].bot_conf_switch"></el-switch>
                </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu58')}}</p>
                  <el-form-item :label="$t('lg.jszcfs')" prop="insertJsType">
                  <el-radio v-model="match4Tmp.suffixMatch[idx].insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="match4Tmp.suffixMatch[idx].insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="match4Tmp.suffixMatch[idx].insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                </div>
            </div>
            </li>
          </ul>
        </div>
        <p class="lineh24">
          <span class="lineh24sp"><a href="javascript:;" class="titlea" :alt="$t('lg.zhu62')" :title="$t('lg.zhu62')">({{$t('lg.ru')}}：/product/)</a> </span> 
          <span class="lineh24sp lhright"><a href="javascript:;" class="addloc" @click="locationPop('pathMatch')">{{$t('lg.add')}}+</a></span>
        </p>
        <div class="match4tmpdata">
          <ul class="match4ul">
            <li class="match4li" v-for="(item,idx) in match4Tmp.pathMatch">
              <div class="lidiv">
                <span class="locflexl">{{item.locationName}}</span>
                <span class="locflexr"><a href="javascript:;" class="ra" @click="pathClps(item,idx,'pathMatch')">{{$t('lg.celuebianj')}}</a><a href="javascript:;" class="ra" @click="lcDelete(item,idx,'pathMatch')">{{$t('lg.delete')}}</a></span>
              </div>
              <div class="expandbox" v-show="pathFlag && pathCollapse==idx">
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu52')}}？ </p>
                  <p class="pp">{{$t('lg.zhu53')}}？</p>
                  <el-form-item :label="$t('lg.kaiqishoudongdlsz')" label-width="125px">
                    <el-switch v-model="match4Tmp.pathMatch[idx].shadow_request_time_switch"></el-switch>
                  </el-form-item>
                  <el-form-item :label="$t('lg.canssz')" prop="shadow_request_time">
                    <el-input v-model.trim="match4Tmp.pathMatch[idx].shadow_request_time"></el-input>
                  </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu54')}}？</p>
                  <!--<el-form-item label="开启浏览器参数指标功能" label-width="170px">
                    <el-switch v-model="match4Tmp.pathMatch[idx].shadow_verify_browser_switch"></el-switch>
                  </el-form-item>
                   <el-form-item label="参数指标" prop="shadow_verify_browser">
                    <el-input v-model.trim="match4Tmp.pathMatch[idx].shadow_verify_browser"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.canshuzhib')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.pathMatch[idx].shadow_verify_browser" :max="7"></el-slider>
                      </div>
                  </div>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu55')}}？</p>
                 <!-- <el-form-item label="开启用户行为指标功能" label-width="155px">
                  <el-switch v-model="match4Tmp.pathMatch[idx].shadow_verify_agent_switch"></el-switch>
                </el-form-item>
                   <el-form-item label="行为指标" prop="shadow_verify_agent">
                    <el-input v-model.trim="match4Tmp.pathMatch[idx].shadow_verify_agent"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.xingweizb')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.pathMatch[idx].shadow_verify_agent" :max="3"></el-slider>
                      </div>
                  </div>
                </div>
                 <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu56')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.pathMatch[idx].param_verify_switch"></el-switch>
                </el-form-item>

                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu57')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.pathMatch[idx].bot_conf_switch"></el-switch>
                </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu58')}}</p>
                  <el-form-item :label="$t('lg.jszcfs')" prop="insertJsType">
                  <el-radio v-model="match4Tmp.pathMatch[idx].insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="match4Tmp.pathMatch[idx].insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="match4Tmp.pathMatch[idx].insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                </div>
            </div>
            </li>
          </ul>
        </div>
        <p class="lineh24">
          <span class="lineh24sp"><a href="javascript:;" class="titlea" alt="$t('lg.zidingyileixdz')" title="$t('lg.zidingyileixdz')">{{$t('lg.fanhuzingdyilxdz')}}({{$t('lg.ru')}}：~ /documents/Abc、~* \.(php)) </a> </span> 
          <span class="lineh24sp lhright"><a href="javascript:;" class="addloc" @click="locationPop('customMatch')">{{$t('lg.add')}}+</a></span>
        </p>
        <div class="match4tmpdata">
          <ul class="match4ul">
            <li class="match4li" v-for="(item,idx) in match4Tmp.customMatch">
              <div class="lidiv">
              <span class="locflexl">{{item.locationName}}</span>
              <span class="locflexr"><a href="javascript:;" class="ra" @click="customClps(item,idx)">{{$t('lg.celuebianj')}}</a><a href="javascript:;" class="ra" @click="lcDelete(item,idx,'customMatch')">{{$t('lg.delete')}}</a></span>
              </div>
            <div class="expandbox" v-show="customFlag && customCollapse==idx">
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu52')}}？ </p>
                  <p class="pp">{{$t('lg.zhu53')}}？</p>
                  <el-form-item :label="$t('lg.kaiqishoudongdlsz')" label-width="125px">
                    <el-switch v-model="match4Tmp.customMatch[idx].shadow_request_time_switch"></el-switch>
                  </el-form-item>
                  <el-form-item :label="$t('lg.canssz')" prop="shadow_request_time">
                    <el-input v-model.trim="match4Tmp.customMatch[idx].shadow_request_time"></el-input>
                  </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu54')}}？</p>
                  <!--<el-form-item label="开启浏览器参数指标功能" label-width="170px">
                    <el-switch v-model="match4Tmp.customMatch[idx].shadow_verify_browser_switch"></el-switch>
                  </el-form-item>
                   <el-form-item label="参数指标" prop="shadow_verify_browser">
                    <el-input v-model.trim="match4Tmp.customMatch[idx].shadow_verify_browser"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.canshuzhib')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.customMatch[idx].shadow_verify_browser" :max="7"></el-slider>
                      </div>
                  </div>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu55')}}？</p>
                  <!--<el-form-item label="开启用户行为指标功能" label-width="155px">
                  <el-switch v-model="match4Tmp.customMatch[idx].shadow_verify_agent_switch"></el-switch>
                </el-form-item>
                   <el-form-item label="行为指标" prop="shadow_verify_agent">
                    <el-input v-model.trim="match4Tmp.customMatch[idx].shadow_verify_agent"></el-input>
                  </el-form-item> -->
                  <div class="block">
                      <div class="tit" :style="{flex:($store.state.isencn=='en'?'0 0 168px':'0 0 120px')}">{{$t('lg.xingweizb')}}</div>
                      <div class="sli">
                        <el-slider v-model="match4Tmp.customMatch[idx].shadow_verify_agent" :max="3"></el-slider>
                      </div>
                  </div>
                </div>
                 <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu56')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.customMatch[idx].param_verify_switch"></el-switch>
                </el-form-item>

                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu57')}}？</p>
                  <el-form-item :label="$t('lg.kaiqi')" label-width="155px">
                  <el-switch v-model="match4Tmp.customMatch[idx].bot_conf_switch"></el-switch>
                </el-form-item>
                </div>
                <div class="itemdiv">
                  <p class="pp">{{$t('lg.zhu58')}}</p>
                  <el-form-item :label="$t('lg.jszcfs')" prop="insertJsType">
                  <el-radio v-model="match4Tmp.customMatch[idx].insertJsType" label="1">{{$t('lg.putongcharu')}}</el-radio>
                  <el-radio v-model="match4Tmp.customMatch[idx].insertJsType" label="2">{{$t('lg.zegqiangcr')}}</el-radio>
                  <el-radio v-model="match4Tmp.customMatch[idx].insertJsType" label="3">{{$t('lg.bucharu')}}</el-radio>
                </el-form-item>
                </div>
            </div>
            </li>
          </ul>
        </div>
        <div style="text-align:center;margin:42px 0 20px 0;">
        <el-button type="primary" @click="saveAll">{{$t('lg.save')}}</el-button>
        </div>

      </div>
      
    </el-form>
    </div>
    <div class="addlocpop">
      <el-dialog width="50%" :title="$t('lg.add')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="cancelLocpop">
        <el-form ref="addform" :model="addform" :rules="addformRules" :label-width="$store.state.isencn=='en'?'230px':'140px'">
          <el-form-item :label="$t('lg.beibaohuduixweiz')" prop="location">
            <el-input v-model.trim="addform.location"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addLocation">{{$t('lg.add')}}</el-button>
            <el-button @click="cancelLocpop" >{{$t('lg.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <loading ref="loading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/gptloading';
let Base64 = require('js-base64').Base64;
export default {
  components:{
    loading
  },
  data(){
    return{
      value4:48,
      oldLocation:[],
      tmpAccurateArr:[
        // {
        //   shadow_request_time_switch:false,
        //   shadow_request_time:"",
        //   shadow_verify_browser_switch:false,
        //   shadow_verify_browser:"",
        //   shadow_verify_agent_switch:false,
        //   shadow_verify_agent:"",
        //   param_verify_switch:false,
        //   bot_conf_switch:false,
        //   insertJsType:'3'
        // }
      ],
      tmpSuffixArr:[],
      tmpPathArr:[],
      tmpCustomArr:[],
      accurateCollapse:-1,
      suffixCollapse:-1,
      pathCollapse:-1,
      customCollapse:-1,
      match4Tmp:{
        accurateMatch:[],
        suffixMatch:[],
        pathMatch:[],
        customMatch:[]     
      },
      accurateFlag:false,
      suffixFlag:false,
      pathFlag:false,
      customFlag:false,
      expandform:{
        shadow_request_time:'',
        shadow_request_time_switch:false,
        shadow_verify_browser:0,
        shadow_verify_browser_switch:false,
        shadow_verify_agent:0,
        shadow_verify_agent_switch:false,
        param_verify_switch:false,
        bot_conf_switch:false,
        insertJsType:'3'
      },
      isexpand:false,
      isShow:false,
      addform:{
        location:''
      },
      quickConfigLoading:false,
      stepFormList:['shadownodesform'],//所有表单
      currentForm:'shadownodesform',//当前表单
      currentDomain:'',
      currentDomainport:'',
      currentLoctype:'',
      shadownodesform:{ 
        shadownodes:''
      },
      expandOpen:-1,
      active:-1,
      nodesdata:[],
      domaindata:[],
      locationdata:[],
      showLocation:false,
      shadownodesformRules:{
        shadownodes:[{ required: true, message: this.$t('lg.required'), trigger: 'change' }]
      },
      domainformRules:{
        domain:[//既能输域名又能输IP 
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        domainPort:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
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
         // {pattern:/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,message: this.$t('lg.invalidport'), trigger: 'change'}//端口正则
        ]
      },
      addformRules:{
        location:[//既能输域名又能输IP
          {required:true, message:this.$t('lg.required'), trigger:'blur'}
        ],
      }
    }
  },
  created(){
    this.getShadowNodes();
  },
  methods:{
    formatTooltip(val) {
        return val / 10;
      },
    filterD(arr,name){
      let result = arr.filter(obj => {
        return obj.type === name
      });
      return result;      
    },
    batchconfDirective(matcharr){
      let locationArr=[];      
      let dArrI;
      for(let i=0;i<matcharr.length;i++){
        let dArr=[];
        dArrI=matcharr[i];
        if(dArrI.bot_conf_switch){
          dArr.push(
            {
              "botConf": "on",
              "type": "bot_conf" 
            }
          )
        }
        if(dArrI.param_verify_switch){
          dArr.push(
            {
              "paramverify": "on",
              "type": "param_verify" 
            }
          )
        }
        if(dArrI.shadow_request_time){
          let srtV=dArrI.shadow_request_time;
          if (isNaN(srtV)) 
          {
            this.$message.error(this.$t('lg.qingshurushuzi'));
            return;
          }else{
            dArr.push({
                    "directives": [
                        {
                            "shadow_request_time": Base64.encode(srtV)
                        }
                    ],
                    "type": "shadow_request_time" 
                })
          }
          
        }
        if(dArrI.shadow_verify_browser){
          let svb=dArrI.shadow_verify_browser;
          if (isNaN(svb)) 
          {
            this.$message.error(this.$t('lg.qingshurushuzi'));
            return;
          }else{
            dArr.push(
            {
                "directives": [
                    {
                        "shadow_verify_browser": Base64.encode(svb) 
                    }
                ],
                "type": "shadow_verify_browser" 
            }
          )
          }

        }
        if(dArrI.shadow_verify_agent){
          let sva=dArrI.shadow_verify_agent;
          if (isNaN(sva)) 
          {
            this.$message.error(this.$t('lg.qingshurushuzi'));
            return;
          }else{
            dArr.push(
            {
                "directives": [
                    {
                        "shadow_verify_agent": Base64.encode(sva)
                    }
                ],
                "type": "shadow_verify_agent" 
            }
          )
          }

        }
        if(dArrI.insertJsType=='3'){
          dArr.push({
            "directives": [],
            "delDirectives": [
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybXZhbGlkYXRvci9jb25maWcuanMnICciPjwvc2NyaXB0Pic="
                },
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"
                },
                {
                  "shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="
                },
                {
                  "shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy"
                }
            ],
            "type": "js_insert"
          })
        }else if(dArrI.insertJsType=='2'){
          dArr.push({
            "directives": [
              {
                "shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybXZhbGlkYXRvci9jb25maWcuanMnICciPjwvc2NyaXB0Pic="
              },
              {
                "shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"
              }
            ],
            "delDirectives": [
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybXZhbGlkYXRvci9jb25maWcuanMnICciPjwvc2NyaXB0Pic="
                },
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"
                },
                {
                  "shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="
                },
                {
                  "shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy"
                }
            ],
            "type": "js_insert"
          })
        }else if(dArrI.insertJsType=='1'){
          dArr.push(
            {
            "directives": [
              {
                  "shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="
                },
                {
                  "shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy"
                }
            ],
            "delDirectives": [
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8aGVhZD4nICc8aGVhZD48c2NyaXB0IHNyYz0iJyAnZm9ybXZhbGlkYXRvci9jb25maWcuanMnICciPjwvc2NyaXB0Pic="
                },
                {
                  "shadow_insert_js_ex": "cGVzIDEwcyAxICc8L3RpdGxlPicgJzwvdGl0bGU+PHNjcmlwdCBzcmM9IicgJ2Zvcm12YWxpZGF0b3Ivc2hhZG93bGliLmpzJyAnIj48L3NjcmlwdD4n"
                },
                {
                  "shadow_sub_filter": "JzwvdGl0bGU+JyAgJzwvdGl0bGU+PHNjcmlwdCBzcmM9Ii9mb3JtdmFsaWRhdG9yL3NoYWRvd2xpYi5qcyI+PC9zY3JpcHQ+JyA1MDBzIDEgcg=="
                },
                {
                  "shadow_sub_filter": "JzxoZWFkPicgICc8aGVhZD48c2NyaXB0IHNyYz0iL2Zvcm12YWxpZGF0b3IvY29uZmlnLmpzIj48L3NjcmlwdD4nIDUwMHMgMSBy"
                }
            ],
            "type": "js_insert"
          }
          )
        }

        locationArr.push(
          {
            "locationName": dArrI.locationName,
            "locationType": dArrI.locationType,
            "root": dArrI.root,
            "waf": dArrI.waf,
            "wafRuleset": dArrI.wafRuleset,
            "webSocket": dArrI.webSocket,
            "accessDenied": dArrI.accessDenied,
            "directive":dArr
          }
        );  
      }
      return locationArr;
    },
    saveAll(){
      const _this=this;
      _this.$refs['expandform'].validate((valid) => {
        if (valid) {     
          let snodeId=this.shadownodesform.shadownodes;
          let domainName=this.currentDomain;
          let port=this.currentDomainport;
          let accurateLoc=_this.batchconfDirective(_this.match4Tmp.accurateMatch);
          let suffixLoc=_this.batchconfDirective(_this.match4Tmp.suffixMatch);
          let pathLoc=_this.batchconfDirective(_this.match4Tmp.pathMatch);
          let customLoc=_this.batchconfDirective(_this.match4Tmp.customMatch);
          let allLoc=[];
          if(accurateLoc && suffixLoc && pathLoc && customLoc){
            allLoc=[...accurateLoc,...suffixLoc,...pathLoc,...customLoc];
          }else{
            return;
          }
          let dataJson={
            "snodeId": snodeId,
            "domainName": domainName,
            "domainPort": port,
            "oldLocation":_this.oldLocation,
            "location":allLoc
          };
       // console.log(dataJson);
          let url=SERVER_API_URL+"pe/shadow/domain/location/batchconf";
          _this.$refs.loading.showLoading();
          axios.post(url,dataJson).then((res)=>{
            if(res.data.responseCode==0){
                this.$message({
                  type: 'success',
                  message: this.$t('lg.success')
                });
              }else{
                this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
              }
            _this.$refs.loading.hideLoading();
          }).catch((err)=>{
            console.log(err);
            _this.$refs.loading.hideLoading();
          });

      }})

    },
    accurateClps(item,idx,matchname){
      this.accurateFlag=true;
      this.suffixFlag=false;
      this.pathFlag=false;
      this.customFlag=false;
      this.suffixCollapse=-1;
      this.pathCollapse=-1;
      this.customCollapse=-1;
      if(this.accurateCollapse==idx){
        this.accurateCollapse=-1;
      }else{
        this.accurateCollapse=idx;
      }
    },
    customClps(item,idx,matchname){
      this.customFlag=true;
      this.accurateFlag=false;
      this.suffixFlag=false;
      this.pathFlag=false;
      this.accurateCollapse=-1;
      this.suffixCollapse=-1;
      this.pathCollapse=-1;
      if(this.customCollapse==idx){
        this.customCollapse=-1;
      }else{
        this.customCollapse=idx;
      }
    },
    suffixClps(item,idx,matchname){
      this.suffixFlag=true;
      this.accurateFlag=false;
      this.pathFlag=false;
      this.customFlag=false;
      this.accurateCollapse=-1;
      this.pathCollapse=-1;
      this.customCollapse=-1;
      if(this.suffixCollapse==idx){
        this.suffixCollapse=-1;
      }else{
        this.suffixCollapse=idx;
      }
    },
    pathClps(item,idx,matchname){
      this.pathFlag=true;
      this.accurateFlag=false;
      this.suffixFlag=false;
      this.customFlag=false;
      this.accurateCollapse=-1;
      this.suffixCollapse=-1;
      this.customCollapse=-1;
      if(this.pathCollapse==idx){
        this.pathCollapse=-1;
      }else{
        this.pathCollapse=idx;
      }
    },
    lcDelete(item,idx,matchname){//删除被保护的页面
      var _this=this;
      _this.match4Tmp[matchname].splice(idx,1);
    },
    addLocation(){
    this.$refs["addform"].validate((valid) => {
      if (valid) {
        let snodeId=this.shadownodesform.shadownodes;
        let domainName=this.currentDomain;
        let port=this.currentDomainport;
        let locationType=this.currentLoctype;
        let location=this.addform.location;
        if(locationType=="suffixMatch"){//如果是后缀匹配 则传入参数时要加入正则
          if(location=="/"){
            location="(.*\\/)+$"              
          }else{
            location="\\.("+location+")$"
          }
        }
        let dataJson={
              snodeId:snodeId,
              domainName:domainName,
              domainPort:port,
              locationType:locationType,
              locationName:location,
              waf:"off",
              wafRuleset:[],
              webSocket:"off",
              accessDenied:"off",
              root:"",
              shadow_request_time_switch:false,//
              shadow_request_time:"",
              shadow_verify_browser_switch:false,
              shadow_verify_browser:"",
              shadow_verify_agent_switch:false,
              shadow_verify_agent:"",
              param_verify_switch:false,
              bot_conf_switch:false,
              insertJsType:"3"
            };
        this.match4Tmp[locationType].push(dataJson);
        this.cancelLocpop();
        
      }})
    },
    locationPop(item){
      this.currentLoctype=item;
      this.isShow=true;
    },
    cancelLocpop(){
      this.$refs['addform'].resetFields();
      this.isShow=false;
    },
    getShadowNodes(){//获取节点
      var _this=this;
      var nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
        if(res.data.responseCode == 0){
          _this.nodesdata=res.data.data;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    selectNode(item){
      const _this=this;
      _this.match4Tmp={
        accurateMatch:[],
        suffixMatch:[],
        pathMatch:[],
        customMatch:[],       
      };
      _this.active=-1;
      _this.showLocation=false;
      _this.locationdata=[];
      var url=SERVER_API_URL+"pe/shadow/domain/all?snodeId="+item;
      _this.$refs.loading.showLoading();
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){
          _this.domaindata=res.data.data;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.$refs.loading.hideLoading();
      }).catch((err) => {
        console.log(err);
        _this.$refs.loading.hideLoading();
      });
    },
    doDirectiveData(match4Data){
      let directiveI;
      let directiveReg = /\d+/;
      let tmparr=[];
      let itemJ;
      let itemLocationName="",itemLocationType=""
      for(let j=0;j<match4Data.length;j++){
        itemJ=match4Data[j];
        directiveI=itemJ.directive;
        let shadow_request_timeO=this.filterD(directiveI,'shadow_request_time');
        let shadow_request_timeV="";
        let shadow_request_time_switchV=false;
        if(shadow_request_timeO && shadow_request_timeO.length){
          shadow_request_timeV=Base64.decode(shadow_request_timeO[0].directives[0].shadow_request_time).match(directiveReg)[0];
          shadow_request_time_switchV=true;
        }
        let shadow_verify_browserO=this.filterD(directiveI,'shadow_verify_browser');
        let shadow_verify_browserV=0,shadow_verify_browser_switchV=false;
        if(shadow_verify_browserO && shadow_verify_browserO.length){
          shadow_verify_browserV=parseInt(Base64.decode(shadow_verify_browserO[0].directives[0].shadow_verify_browser));
          shadow_verify_browser_switchV=true;
        }
        let shadow_verify_agentO=this.filterD(directiveI,'shadow_verify_agent');
        let shadow_verify_agentV=0,shadow_verify_agent_switchV=false;
        if(shadow_verify_agentO && shadow_verify_agentO.length){
          shadow_verify_agentV=parseInt(Base64.decode(shadow_verify_agentO[0].directives[0].shadow_verify_agent));
          shadow_verify_agent_switchV=true;
        }
        let param_verifyO=this.filterD(directiveI,'param_verify');
        let param_verify_switchV=false;
      if(param_verifyO && param_verifyO.length){
        param_verify_switchV=param_verifyO[0].directives[0].paramverify=="on"?true:false;
      }
        let bot_confO=this.filterD(directiveI,'bot_conf');
        let bot_confV=false;
        if(bot_confO && bot_confO.length){
          bot_confV=bot_confO[0].directives[0].botConf=="on"?true:false;
        }
        let js_insertO=this.filterD(directiveI,'js_insert');
        let js_insertV="3";
      if(js_insertO){
        if(js_insertO.length==0){
          js_insertV='3'
        }else if(js_insertO[0].directives[0].hasOwnProperty('shadow_sub_filter')){
          js_insertV='1'
        }else if(js_insertO[0].directives[0].hasOwnProperty('shadow_insert_js_ex')){
          js_insertV='2'
        }
      }else{
        js_insertV='3'
      }

        itemLocationName=itemJ.locationName;
        itemLocationType=itemJ.locationType;
        tmparr.push({
            shadow_request_time_switch:shadow_request_time_switchV,
            shadow_request_time:shadow_request_timeV,
            shadow_verify_browser_switch:shadow_verify_browser_switchV,
            shadow_verify_browser:shadow_verify_browserV,
            shadow_verify_agent_switch:shadow_verify_agent_switchV,
            shadow_verify_agent:shadow_verify_agentV,
            param_verify_switch:param_verify_switchV,
            bot_conf_switch:bot_confV,
            insertJsType:js_insertV,
            locationName: itemLocationName,//
            locationType: itemLocationType,//
            root: itemJ.root,
            waf: itemJ.waf,
            wafRuleset: itemJ.wafRuleset,
            webSocket: itemJ.webSocket,
            accessDenied:itemJ.accessDenied
          });
          this.oldLocation.push({
            "locationName": itemLocationName,
            "locationType": itemLocationType 
          });
      
      }
      return tmparr;
    },
    clickDomain(item,index){
      const _this=this;
      _this.match4Tmp={
        accurateMatch:[],
        suffixMatch:[],
        pathMatch:[],
        customMatch:[],       
      };
      _this.accurateCollapse=-1;
      _this.suffixCollapse=-1;
      _this.pathCollapse=-1;
      _this.customCollapse=-1;
      _this.tmpAccurateArr=[];
      _this.oldLocation=[];
      if(index || index==0){
        _this.active=index;
      }
      if(item){
        _this.currentDomain=item.domainName;
        _this.currentDomainport=item.domainPort;
      }
      _this.showLocation=true;
      let tmpMatch4={
        accurateMatch:[],
        suffixMatch:[],
        pathMatch:[],
        customMatch:[],       
      };
      var url=SERVER_API_URL+"pe/shadow/domain/location/batchconf?snodeId="+_this.shadownodesform.shadownodes+"&domainName="+_this.currentDomain+"&domainPort="+_this.currentDomainport;
      _this.$refs.loading.showLoading();
      axios.get(url).then((res)=>{
        if(res.data.responseCode == 0){
          _this.locationdata=res.data.data.location;
          let locationdataItem={};
          let locItemType='';
          for(let i=0;i<_this.locationdata.length;i++){
            locationdataItem=_this.locationdata[i];
            locItemType=locationdataItem['locationType'];
            if(locItemType=="accurateMatch" || locItemType=="suffixMatch" || locItemType=="pathMatch" || locItemType=="customMatch"){
               // _this.match4Tmp[locItemType].push(locationdataItem);
                tmpMatch4[locItemType].push(locationdataItem);
            }
          }
        // _this.tmpAccurateArr=_this.doDirectiveData(this.match4Tmp.accurateMatch);
        // _this.tmpSuffixArr=_this.doDirectiveData(this.match4Tmp.suffixMatch);
        // _this.tmpPathArr=_this.doDirectiveData(this.match4Tmp.pathMatch);
        // _this.tmpCustomArr=_this.doDirectiveData(this.match4Tmp.customMatch);

        _this.match4Tmp.accurateMatch=_this.doDirectiveData(tmpMatch4.accurateMatch);
        _this.match4Tmp.suffixMatch=_this.doDirectiveData(tmpMatch4.suffixMatch);
        _this.match4Tmp.pathMatch=_this.doDirectiveData(tmpMatch4.pathMatch);
        _this.match4Tmp.customMatch=_this.doDirectiveData(tmpMatch4.customMatch);
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        _this.$refs.loading.hideLoading();
      }).catch((err) => {
        console.log(err);
        _this.$refs.loading.hideLoading();
      });
    }
  }
}
</script>

<style lang="stylus" scoped>
  .quickconfig-wrapper
    width 100%
    height 100%
    position relative
    padding 15px
    box-sizing border-box
    display flex
    flex-direction: column;
    .stepBtn
      padding 15px
      box-sizing border-box 
      text-align right 
      background #f7f7f7 
    .domainbox
      margin-top:20px
      .domaina
        display: inline-block
        padding 10px
        margin: 12px 10px
        border:1px dashed #ccc
        &:nth-of-type(1)
          margin-left:0
        &:hover
          background-color:#f9f9f9
        &.active
          background-color:#f1f1f1
    .locationbox
      margin-top:10px
      .lineh24
        line-height: 24px
        padding:4px 0
        margin:8px 0
        display: flex
        .lineh24sp
          flex: 1
          .titlea
            cursor: default
          &.lhright
            text-align: right
        .addloc
          display: inline-block
          margin-left: 20px
          padding: 0 10px
          color: #666
          border: 1px solid #ddd
          font-size: 12px
          &:hover
            background-color: #f5f5f5
        &:hover
          background-color: #f5f5f5
      .match4tmpdata
        .match4ul
          .match4li
            padding:10px 12px
            margin:6px 0
            border:1px dashed #ddd
            .lidiv
              display:flex
              .locflexl
                flex: 1
              .locflexr
                flex: 0 0 144px
                text-align: right
                .ra
                  margin:0 5px
                  font-size:12px
                  &:hover
                    text-decoration: underline
            .expandbox
              margin:18px 10px
              border-top:1px solid #ddd
              padding:20px 0
              .itemdiv
                margin-bottom 12px
                .pp
                  line-height:24px
                .block
                  display:flex
                  .tit
                    flex:0 0 120px
                    text-align:center
                    line-height:38px
                  .sli
                    flex:1

      .locationli
        display: block
        margin: 10px 0
        padding 10px
        border:1px dashed #ccc
        
</style>
