<!--查看配置指令组件-->
<template>
  <div>
    <el-dialog width="70%" :title="isBatch?$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']':domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isShow" :close-on-click-modal="false" :before-close="cmdlistClose">
      <div v-if="data.length==0 || !data">{{$t('lg.nodata')}}</div>
      <div v-if="data.length>0" v-for="(item,index) in data" class="cmdlist-wrapper">  <!--此处不应该传入数组，或许传入一个对象更好，如：{保护配置:[],跳转配置:[]....}。直接传入数组导致特殊配置的标题显示有问题。现在用isType、isHeader控制‘特殊配置’这个标题的显示，但是特殊配置种类一多久很繁琐，有时间这里要优化-->
        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_sub_filter')"><!--保护配置-->
          <div v-if="item.shadow_sub_filter.length==0">{{$t('lg.nodata')}}</div>
          <div v-if="item.shadow_sub_filter.length>0">
            <h1 class="title">{{$t('lg.protectconfig')}}</h1>
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.url3')}}</th>
                    <th>{{$t('lg.url2')}}</th>
                    <th>{{$t('lg.validdate')}}</th>
                    <th>{{$t('lg.allowedrefreshes')}}</th>
                    <th>{{$t('lg.configproperty')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_sub_filter">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" class="edit-del-a" @click="editConfcmd(item,vitem)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" class="edit-del-a" @click="delConfcmd(item,vitem)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_location')"><!--跳转配置-->
          <div v-if="item.shadow_location.length==0">{{$t('lg.nodata')}}</div>
          <div v-if="item.shadow_location.length>0">
            <h1 class="title">{{$t('lg.jumpconfig')}}</h1>
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.domain')}}</th>
                    <th>URI</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_location">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_sub_filter_ex')"><!--高级配置-->
          <div v-if="item.shadow_sub_filter_ex.length==0">{{$t('lg.nodata')}}</div>
          <div v-if="item.shadow_sub_filter_ex.length>0">
            <h1 class="title">{{$t('lg.highconfig')}}</h1>
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.url3')}}</th>
                    <th>{{$t('lg.remained')}}</th>
                    <th>{{$t('lg.url2')}}</th>
                    <th>{{$t('lg.validdate')}}</th>
                    <th>{{$t('lg.allowedrefreshes')}}</th>
                    <th>{{$t('lg.configproperty')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_sub_filter_ex">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" class="edit-del-a" @click="editConfcmd(item,vitem)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" class="edit-del-a" @click="delConfcmd(item,vitem)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_sub_filter_types')"><!--特殊文件类型-->
          <h1 class="title" v-if="isType">{{$t('lg.spconfig')}}</h1>
          <div v-if="item.shadow_sub_filter_types.length==0">{{$t('lg.nodata')}}</div>
          <div v-if="item.shadow_sub_filter_types.length>0">
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.specialtype')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_sub_filter_types">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="cmdlist-box" v-if="item.hasOwnProperty('add_header')">
          <h1 class="title" v-if="!isType && isHeader">{{$t('lg.spconfig')}}</h1>
          <div v-if="item.add_header.length==0">{{$t('lg.noheader')}}</div>
          <div v-if="item.add_header.length>0">
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.headercompletion')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.add_header">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_modify_header')"><!--Header修改-->
          <h1 class="title" v-if="!isType && !isHeader && isModify">{{$t('lg.spconfig')}}</h1>
          <div v-if="item.shadow_modify_header.length==0">{{$t('lg.noshadowmodifyheader')}}</div>
          <div v-if="item.shadow_modify_header.length>0">
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.headeredit')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_modify_header">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_request_time')"><!--请求时间-->
          <h1 class="title" v-if="!isType && !isHeader && !isModify && isRequest">{{$t('lg.spconfig')}}</h1>
          <!-- <div v-if="item.shadow_request_time.length==0">{{$t('lg.noshadowmodifyheader')}}</div> -->
          <div v-if="item.shadow_request_time.length>0">
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.requestime')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_request_time">
                    <td v-for="vitemv in vitem">{{vitemv}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_verify')"><!--浏览器参数指标、用户行为指标 这两种配置指令同时生效 shadow_verify_browser、shadow_verify_agent-->
          <h1 class="title" v-if="!isType && !isHeader && !isModify && !isRequest && isVerify">{{$t('lg.spconfig')}}</h1>
          <div v-if="item.shadow_verify.length==0">{{$t('lg.noshadowmodifyheader')}}</div>
          <div v-else>
             <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.browserParams')}}</th>
                    <th>{{$t('lg.userBhIndct')}}</th>
                    <th width="110"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-for="(vitem,key) in item.shadow_verify">{{vitem}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="editConfcmd(item,item.shadow_verify)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                      <a href="javascript:;" @click="delConfcmd(item,item.shadow_verify)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="cmdlist-box" v-if="item.hasOwnProperty('shadow_insert_js_ex')"><!--Js增强功能-->
          <h1 class="title" v-if="!isType && !isHeader && !isModify && !isRequest && !isVerify">{{$t('lg.spconfig')}}</h1>
          <div v-if="item.shadow_insert_js_ex.length==0">{{$t('lg.jsstrongclose')}}</div>
          <div v-if="item.shadow_insert_js_ex.length>0">
            <div class="table-box">
              <table>
                <thead>
                  <tr>
                    <th>{{$t('lg.jstrong')}}</th>
                    <th width="60"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vitem,key) in item.shadow_insert_js_ex">
                    <td>{{$t('lg.jsstrongopen')}}</td>
                    <td class="text-center">
                      <a href="javascript:;" @click="delConfcmd(item,vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </el-dialog>
    <!--编辑保护配置、高级配置-->
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isProtectEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose">
      <el-form ref="editsbform"  :model="editsbform" :rules="editsbformRules" :label-width="$store.state.isencn=='en'?'180px':'130px'">
        <el-form-item :label="$t('lg.ourl')" prop="uri1">
          <el-input v-model.trim="editsbform.uri1" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="dictateType=='shadow_sub_filter_ex'?$t('lg.remained'):$t('lg.url2')" prop="uri2">
          <el-input v-model.trim="editsbform.uri2" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.url2')" prop="uri3" v-if="dictateType=='shadow_sub_filter_ex'">
          <el-input v-model.trim="editsbform.uri3" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.timeoutset')" prop="timeNum">
          <el-input v-model.trim="editsbform.timeNum" auto-complete="off" style="width:30%"></el-input>
          <el-select v-model="overTimeValue" :placeholder="$t('lg.select')" style="width:20%">
            <el-option
              v-for="item in overTimeUnit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('lg.allowedrefreshes')" prop="refreshtimes">
          <el-input v-model.trim="editsbform.refreshtimes" auto-complete="off" ></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.configproperty')">
          <div class="checkBorder">
            <el-checkbox-group  size="mini" v-model="editsbform.raeChecklist" @change="checkedChange">
              <el-checkbox :label="$t('lg.replaceconfig')"  name="raeChecklist"></el-checkbox>
              <el-checkbox :label="$t('lg.allowaccessourl')" name="raeChecklist" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encrypt2')" name="raeChecklist" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptab')" name="raeChecklist" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptpa')" name="raeChecklist" :disabled="isCheckDisable"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditConfCmd('editsbform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <!--编辑跳转配置-->
    <el-dialog width="55%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isSkipEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose">    
      <el-form ref="editslform" :model="editslform" :rules="editslformRules"  label-width="70px">
        <el-form-item :label="$t('lg.domain')" prop="uri1">
          <el-input v-model.trim="editslform.uri1"></el-input>
        </el-form-item>
        <el-form-item label="URI" prop="uri2">
          <el-input v-model.trim="editslform.uri2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditSlConfCmd('editslform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <!--编辑特殊配置-->
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isTypesEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose"><!--特殊文件类型-->    
      <el-form ref="edittyform" :model="edittyform" :rules="edittyformRules" label-width="110px">
        <el-form-item :label="$t('lg.specialtype')" prop="uri1">
          <el-select style="width:100%" 
            v-model.trim="edittyform.uri1"
            filterable
            allow-create
            :placeholder="$t('lg.select')">
            <el-option
              v-for="item in edittyform.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditTyConfCmd('edittyform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isAddEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose"><!--Header补全-->   
      <el-form ref="editaddform" :model="editaddform" :rules="editaddformRules"  :label-width="$store.state.isencn=='en'?'200px':'110px'">
        <el-form-item :label="$t('lg.headercompletion')" prop="uri1">
          <el-select style="width:100%"  
            v-model.trim="editaddform.uri1"
            filterable
            allow-create
            :placeholder="$t('lg.select')">
            <el-option
              v-for="item in editaddform.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditTyConfCmd('editaddform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isModifyEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose"><!--Header修改-->  
      <el-form ref="editmodifyform" :model="editmodifyform" :rules="editmodifyformRules"  label-width="110px">
        <el-form-item :label="$t('lg.headeredit')" prop="uri1">
          <el-select style="width:100%"  
            v-model.trim="editmodifyform.uri1"
            filterable
            allow-create
            :placeholder="$t('lg.select')">
            <el-option
                v-for="item in editmodifyform.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditTyConfCmd('editmodifyform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>    

    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isRequestTimeShow" :close-on-click-modal="false" :before-close="cmdlistEditClose"><!--浏览器参数指标、用户行为指标-->
      <el-form ref="editRequestTimeform" :model="editRequestTimeform" :rules="editRequestTimeformRules">
        <el-row :gutter="10">
          <el-col :span="16" >
            <el-form-item :label="$t('lg.requestime')" prop="sdRequestTime" label-width="110px">
              <el-input v-model="editRequestTimeform.sdRequestTime" :placeholder="$t('lg.requestime')"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="8">
            <el-form-item>
              <el-select v-model="editRequestTimeform.sdRequestTimeUnit" :placeholder="$t('lg.select')">
                <el-option
                  v-for="item in editRequestTimeform.sdRequestUnitOpt"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> 
        </el-row> 
        <el-form-item label-width="110px">
          <el-button type="primary" @click="updateEditTyConfCmd('editRequestTimeform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item> 
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>

    <el-dialog width="40%" :title="domainObj.domainName+':'+domainObj.port+' '+locationObj.name" :visible.sync="isVerifyEditShow" :close-on-click-modal="false" :before-close="cmdlistEditClose"><!--浏览器参数指标、用户行为指标-->
      <el-form ref="editverifyform" :model="editverifyform" :rules="editverifyformRules" label-width="125px">
        <el-form-item :label="$t('lg.browserParams')" prop="verifyBrowser">
          <el-input v-model="editverifyform.verifyBrowser" :placeholder="$t('lg.browserParams')"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.userBhIndct')" prop="verifyAgent">
          <el-input v-model="editverifyform.verifyAgent" :placeholder="$t('lg.userBhIndct')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateEditTyverifyConfCmd('editverifyform')">{{$t('lg.save')}}</el-button>
          <el-button @click="cmdlistEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item> 
      </el-form>
      <div v-show="updatecmdLoading" >
        <loading :title="$t('lg.handling')"></loading>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios';
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
    isBatch:{
      type:Boolean
    },
    data:{
      type:Array
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
    },
    isType:{
      type:Boolean
    },
    isHeader:{
      type:Boolean
    },
    isRequest:{
      type:Boolean
    },
    isModify:{
      type:Boolean
    },
    isVerify:{
      type:Boolean
    }
  },
  data(){
    return{
      isCheckDisable:false,
      // cmdlistLoading:false,
      updatecmdLoading:false,
      isProtectEditShow:false,//编辑弹出框显示隐藏 保护配置
      isSkipEditShow:false,//编辑弹出框显示隐藏 跳转配置
      isTypesEditShow:false,//编辑弹出框显示隐藏 特殊文件类型
      isAddEditShow:false,//编辑弹出框显示隐藏 Header补全
      isModifyEditShow:false,//编辑弹出框显示隐藏 Header修改
      isRequestTimeShow:false,//编辑弹出框显示隐藏 请求时间
      isVerifyEditShow:false,//编辑弹出框显示隐藏 浏览器参数指标，用户行为指标

      dictateType:'',
      orgin:{
        uri1:'',
        uri2:'',
        uri3:'',
        time:'',
        refreshtimes:'',
        rae:''
      },
      orgin2:{
        uri1:'',
        uri2:''
      },
      orgin3:{
        uri1:'',
      },
      orgin4:{
        uri1:'',
      },
      orgin5:{
        uri1:'',
      },
      orgin6:{
        verifyBrowser:'',
        verifyAgent:''
      },
      orgin7:{//请求时间
        sdRequestTimeV:'',
      },
      overTimeUnit:[
        {
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
        },
      ],
      overTimeValue:'',
      editsbform:{
        uri1:'',
        uri2:'',
        uri3:'',
        time:'',
        timeNum:null,
        refreshtimes:'',
        raeChecklist:[]
      },
      editslform:{
        uri1:'',
        uri2:''
      },
      edittyform:{
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
        }]
      },
      editaddform:{
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
        }]
      },
      editmodifyform:{
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
      editRequestTimeform:{
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
      editverifyform:{
        verifyBrowser:'',
        verifyAgent:''
      },
      editsbformRules:{
        uri1:[ 
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri2:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        uri3:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^([\w\-." \\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 有空格
        ],
        timeNum:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ],
        refreshtimes:[
          {required:true, message:this.$t('lg.required'), trigger:'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'},
        ]
      },
      editslformRules:{//跳转配置不能加空格
        uri1:[ 
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ],
        uri2:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^([\w\-."\\*!$@?^()<>{}[\]=%&:;/~+#`,])+$/, message: this.$t('lg.invalidformat'), trigger: 'blur'} //不能输入中文、单引号及少部分特殊字符 无空格
        ]
      },
      edittyformRules:{
        uri1:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg3'), trigger: 'change'},
        ],
      },
      editaddformRules:{
        uri1:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg4'), trigger: 'change'},
        ],
      },
      editmodifyformRules:{
        uri1:[
          {required: true, message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[A-Za-z0-9\_\-\:\.\/\|\s]+$/ig, message: this.$t('lg.reg4'), trigger: 'change'},
        ],
      },
      editRequestTimeformRules:{
        sdRequestTime:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      editverifyformRules:{
        verifyBrowser:[
          {required: true, trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ],
        verifyAgent:[
          {required: true, trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      }
    }
  },
  methods:{
    checkedChange(){//选择替换配置后，禁用其他配置
      var _this = this;
      _this.editsbform.raeChecklist.forEach(function(v,i){
        if(v=="替换配置" || v=="Replacement configuration"){
          _this.isCheckDisable = true;
          _this.editsbform.raeChecklist=[_this.$t('lg.replaceconfig')];
        }else{
          _this.isCheckDisable = false;
        }
      });
      if( _this.editsbform.raeChecklist.length==0){
        _this.isCheckDisable = false;
      };
    },
    cmdlistClose(){
      this.$emit('lccmdlistmodalclose',false);
    },
    cmdlistEditClose(){
      this.editsbform.uri3='';
      this.isProtectEditShow=false;
      this.isSkipEditShow=false;
      this.isTypesEditShow=false;
      this.isAddEditShow=false;
      this.isModifyEditShow=false;
      this.isRequestTimeShow=false;
      this.isVerifyEditShow=false;
    },
    delConfcmd(item,vitem){//删除指令 //特殊配置不做处理（js增强功能、超时时间、shadow_verify_browser除外）
      var _this=this;
      // console.log(item);
      console.log(vitem);
      for(var key in item){
        var srcdictateType=key;
      }
      // console.log(srcdictateType)
      if(srcdictateType=="shadow_sub_filter"){//删除保护配置
        if(vitem[4]==""){//无指令属性时
          vitem.pop(vitem[4]);
        }
        vitem[0] = "'"+vitem[0]+"'";
        vitem[1] = "'"+vitem[1]+"'";
        switch(vitem[2].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            vitem[2]=vitem[2].match(/(\d*)(\w*)/)[1]+"ms";
        };
      }else if(srcdictateType=="shadow_location"){//删除跳转配置时，域名要作为第二个参数。uri则为第一个参数  当中传入域名时则只传入一个参数
        if(vitem[1]==""){
          vitem.pop();
          vitem[0] = "'"+vitem[0]+"'";
        }else{
          var emp = "'"+vitem[0]+"'";
          vitem[0] = "'"+vitem[1]+"'";
          vitem[1] = emp;
        }
      }else if(srcdictateType=="shadow_sub_filter_ex"){//删除高级配置
        if(vitem[5]==""){//无指令属性时
          vitem.pop(vitem[5]);
        }
        vitem[0] = "'"+vitem[0]+"'";
        vitem[1] = "'"+vitem[1]+"'";
        vitem[2] = "'"+vitem[2]+"'";
        switch(vitem[3].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            vitem[3]=vitem[3].match(/(\d*)(\w*)/)[1]+"ms";
        };
      }else if(srcdictateType=="shadow_request_time"){//超时时间
        switch(vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "秒":
            vitem[0]=vitem[0].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            vitem[0]=vitem[0].match(/(\d*)(\w*)/)[1]+"ms";
        }
      }
      if(_this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      }else if(_this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
      }else if(_this.isBatch){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      }
      var domainO=_this.domainObj;
      // console.log(vitem.join(" "))
      var basevitem=Base64.encode(vitem.join(" "));
      var directivesObj = {}, 
          directivesArry = [];

      directivesObj[srcdictateType]=basevitem;
      directivesArry.push(directivesObj);

      //2019.08.07 又变成只插入一个js 即一条保护指令  //2019-10-25 插入一个js 但换成另外的js
      if(srcdictateType=="shadow_insert_js_ex"){//删除js增强功能，相当于删掉指定的一条shadow_insert_js_ex指令
        // directivesArry.push({
        //   shadow_insert_js_ex:Base64.encode("pe 10s 1 '</title>' '</title> <script src=\"/formvalidator/' 'shadowlib.js' '\"><\/script>'");
        // })
        directivesArry[0].shadow_insert_js_ex=Base64.encode("pe 10s 1 '</title>' '</title> <script src=\"/formvalidator/' 'shadowlib.js' '\"><\/script>'");
      }
      //end
      
      // console.log(srcdictateType);
      //插入两个js 2018.12.05  一条保护指令，一条insert_js
      // if(srcdictateType=="shadow_insert_js"){//如果是删除特殊配置的js增强功能，则要删shadow_insert_js及shadow_sub_filter两种类型的配置，shadow_sub_filter为写死的值 2018.12.05
      //   directivesArry.push({
      //     // shadow_sub_filter:Base64.encode("'<head>' '<head> <script src=\"/formvalidator/jsen-cryp-base.js\"><\/script>' 10000s 100 r")
      //     shadow_sub_filter:Base64.encode("'</title>' '</title> <script src=\"/formvalidator/jsen-cryp-base.js\"><\/script>' 10000s 100 r")
      //   })
      // }

      if(srcdictateType=="shadow_verify"){//同时删除 shadow_verify_browser、shadow_verify_agent这两个 特殊配置
        directivesArry = [];
        directivesArry.push({
          shadow_verify_browser:Base64.encode(vitem[0]),
          shadow_verify_agent:Base64.encode(vitem[1])
        })
      }
      axios.delete(url,{
        data:{
          snodeId:_this.shadowObj.snodeId,
          domainName:domainO.domainName,
          domainPort:domainO.port,
          locationName:_this.locationObj.name,
          locationType:_this.locationObj.type,
          directives:directivesArry
        }
      }).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          // item[srcdictateType].splice(item[srcdictateType].indexOf(vitem),1);//静态截取
          _this.$emit("updateLcConfcmd");//直接更新 动态
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.$emit("updateRenderTree");
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      })
    },
    editConfcmd(item,vitem){//获取编辑参数
      // console.log(item)
      // console.log(vitem)
      for(var key in item){
        this.dictateType=key;
      }
      if(item.hasOwnProperty("shadow_sub_filter")){
        this.isProtectEditShow=true;
        this.orgin.uri1=vitem[0];//保存改之前的旧数据用于发送请求
        this.orgin.uri2=vitem[1];
        this.orgin.refreshtimes=vitem[3];
        this.orgin.rae=vitem[4];
   
        //处理超时时间项的时间单位
        // console.log(vitem[2])
        // console.log(vitem[2].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        switch(vitem[2].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"y";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"M";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"w";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"d";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"h";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"m";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"s";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            this.orgin.time=vitem[2].match(/(\d*)(\w*)/)[1]+"ms";
            this.editsbform.time=vitem[2].match(/(\d*)(\w*)/)[1]+"ms";
        };
        this.editsbform.timeNum=this.editsbform.time.match(/(\d*)(\w*)/)[1]-0;
        this.overTimeValue=this.editsbform.time.match(/(\d*)(\w*)/)[2];
        
        //处理配置属性
        this.editsbform.raeChecklist=[];
        var rae=vitem[4];
        // console.log(rae)
        if(rae==""){
          this.isCheckDisable = false;
        }
        if(rae.indexOf("r")!==-1){
          this.editsbform.raeChecklist.push("替换配置");
          this.isCheckDisable = true;
        }
        if(rae.indexOf("a")!==-1){
          this.editsbform.raeChecklist.push("允许访问原URI");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("e")!==-1){
          this.editsbform.raeChecklist.push("二次加密");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("s")!==-1){
          this.editsbform.raeChecklist.push("绝对路径");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("p")!==-1){
          this.editsbform.raeChecklist.push("路径加密");
          this.isCheckDisable = false;
        }
        this.editsbform.uri1=vitem[0];
        this.editsbform.uri2=vitem[1];
        this.editsbform.refreshtimes=vitem[3];
      }else if(item.hasOwnProperty("shadow_location")){
        this.isSkipEditShow=true;
        this.orgin2.uri1=vitem[0];
        this.orgin2.uri2=vitem[1];
        this.editslform.uri1=vitem[0];
        this.editslform.uri2=vitem[1];
      }else if(item.hasOwnProperty("shadow_sub_filter_ex")){
        this.isProtectEditShow=true;
        this.orgin.uri1=vitem[0];//保存改之前的旧数据用于发送请求
        this.orgin.uri2=vitem[1];
        this.orgin.uri3=vitem[2];
        this.orgin.refreshtimes=vitem[4];
        this.orgin.rae=vitem[5];

       //处理超时时间项的时间单位
        switch(vitem[3].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"y";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"M";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"w";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"d";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"h";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"m";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"s";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            this.orgin.time=vitem[3].match(/(\d*)(\w*)/)[1]+"ms";
            this.editsbform.time=vitem[3].match(/(\d*)(\w*)/)[1]+"ms";
        };
        this.editsbform.timeNum=this.editsbform.time.match(/(\d*)(\w*)/)[1]-0;
        this.overTimeValue=this.editsbform.time.match(/(\d*)(\w*)/)[2];

        //处理配置属性
        this.editsbform.raeChecklist=[];
        var rae=vitem[5];
        // console.log(rae)
        if(rae==""){
          this.isCheckDisable = false;
        }
        if(rae.indexOf("r")!==-1){
          this.editsbform.raeChecklist.push("替换配置");
          this.isCheckDisable = true;
        }
        if(rae.indexOf("a")!==-1){
          this.editsbform.raeChecklist.push("允许访问原URI");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("e")!==-1){
          this.editsbform.raeChecklist.push("二次加密");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("s")!==-1){
          this.editsbform.raeChecklist.push("绝对路径");
          this.isCheckDisable = false;
        }
        if(rae.indexOf("p")!==-1){
          this.editsbform.raeChecklist.push("路径加密");
          this.isCheckDisable = false;
        }
        this.editsbform.uri1=vitem[0];
        this.editsbform.uri2=vitem[1];
        this.editsbform.uri3=vitem[2];
        this.editsbform.refreshtimes=vitem[4];
      }else if(item.hasOwnProperty("shadow_sub_filter_types")){
        this.isTypesEditShow=true;
        this.orgin3.uri1=vitem[0];
        this.edittyform.uri1=vitem[0];
      }else if(item.hasOwnProperty("add_header")){
        this.isAddEditShow=true;
        this.orgin4.uri1=vitem[0];
        this.editaddform.uri1=vitem[0];
      }else if(item.hasOwnProperty("shadow_modify_header")){
        this.isModifyEditShow=true;
        this.orgin5.uri1=vitem[0];
        this.editmodifyform.uri1=vitem[0];
      }else if(item.hasOwnProperty("shadow_request_time")){
        this.isRequestTimeShow=true;
        // console.log(vitem[0])
        // console.log(vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/))
        switch(vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[2]){
          case "秒":
            this.orgin7.sdRequestTimeV=vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[1]+"s";
            this.editRequestTimeform.sdRequestTime=vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[1];
            this.editRequestTimeform.sdRequestTimeUnit='s';
            break;
          default:
            this.orgin7.sdRequestTimeV=vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[1]+"ms";
            this.editRequestTimeform.sdRequestTime=vitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[1];
            this.editRequestTimeform.sdRequestTimeUnit='ms';
        }
      }else if(item.hasOwnProperty("shadow_verify")){
        this.isVerifyEditShow=true;
        this.orgin6.verifyBrowser=vitem[0];
        this.orgin6.verifyAgent=vitem[1];
        this.editverifyform.verifyBrowser=vitem[0];
        this.editverifyform.verifyAgent=vitem[1];
      }
    },
    updateEditConfCmd(formname){//保存 编辑保护配置 以及高级配置
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.updatecmdLoading=true;
          var rr="替换配置",
              aa="允许访问原URI",
              ee="二次加密",
              ss="绝对路径",
              pp="路径加密";
          var domainO=this.domainObj,
              locationO=this.locationObj;
          var dstraeChecklist=this.editsbform.raeChecklist.join("").replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,"s").replace(pp,"p");
          if(this.dictateType=='shadow_sub_filter'){
            if(this.orgin.rae==""){//不传入指令属性时 
              var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uri2+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes+this.orgin.rae);
            }else{
              var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uri2+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes+" "+this.orgin.rae);
            }

            if(dstraeChecklist==""){//不传入指令属性时 
              var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes);
            }else{
              var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes+" "+dstraeChecklist);
            }
          }else if(this.dictateType=='shadow_sub_filter_ex'){
              if(this.orgin.rae==""){//不传入指令属性时 
                var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uri2+"'"+" "+"'"+this.orgin.uri3+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes+this.orgin.rae);
              }else{
                var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uri2+"'"+" "+"'"+this.orgin.uri3+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes+" "+this.orgin.rae);
              }

              if(dstraeChecklist==""){//不传入指令属性时 
                var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+"'"+this.editsbform.uri3+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes);
              }else{
                var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+"'"+this.editsbform.uri3+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes+" "+dstraeChecklist);
              }
          }
          //  console.log(srcdictatedata);
          //  console.log(dstdictatedata);
          if(this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
          }else if(this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
          }else if(this.isBatch){//批量修改
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
          }
          // console.log(domainO.domainName);
          // console.log(domainO.port);
          // console.log(locationO.name);
          // console.log(locationO.type);
          // console.log(this.shadowObj.snodeId);
          // console.log(this.dictateType);

          // console.log(srcdictatedata);
          // console.log(dstdictatedata);

          axios.patch(url,{
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type,
            snodeId:this.shadowObj.snodeId,
            directiveName:this.dictateType,
            srcData:srcdictatedata,
            targetData:dstdictatedata
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.$emit("updateLcConfcmd");
              this.$emit("updateRenderTree");
              this.isProtectEditShow=false;
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.updatecmdLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    updateEditSlConfCmd(formname){//保存 编辑跳转配置
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.updatecmdLoading=true;
          if(this.isAuto){
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
          }else if(this.isEditConfig){
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
          }else if(this.isBatch){//批量修改
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
          }else{
            var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
          }
          var domainO=this.domainObj,
              locationO=this.locationObj;
          if(this.orgin2.uri2==""){ //编辑跳转指令时，域名要作为第二个参数。uri则为第一个参数  当中传入域名时则只传入一个参数
            var srcdictatedata=Base64.encode("'"+this.orgin2.uri1+"'");
          }else{
            var srcdictatedata=Base64.encode("'"+this.orgin2.uri2+"'"+" "+"'"+this.orgin2.uri1+"'");
          }
          if(this.editslform.uri2==""){
            var dstdictatedata=Base64.encode("'"+this.editslform.uri1+"'");
          }else{
            var dstdictatedata=Base64.encode("'"+this.editslform.uri2+"'"+" "+"'"+this.editslform.uri1+"'");
          }
          axios.patch(url,{
            domainName:domainO.domainName,
            domainPort:domainO.port,
            locationName:locationO.name,
            locationType:locationO.type,
            snodeId:this.shadowObj.snodeId,
            directiveName:this.dictateType,
            srcData:srcdictatedata,
            targetData:dstdictatedata
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.$emit("updateLcConfcmd");
              this.isSkipEditShow = false;
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.updatecmdLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    updateEditTyConfCmd(formname){//保存 特殊配置的修改
      console.log(formname)
      this.updatecmdLoading=true;
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
      }else if(this.isBatch){//批量修改
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      }
      var domainO=this.domainObj,
      locationO=this.locationObj;
      var srcdictatedata=null, dstdictatedata = null;
      if(formname=="edittyform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin3.uri1);
            dstdictatedata = Base64.encode(this.edittyform.uri1);
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      }else if(formname=="editaddform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin4.uri1);
            dstdictatedata = Base64.encode(this.editaddform.uri1);
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      }else if(formname=="editmodifyform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin5.uri1);
            dstdictatedata = Base64.encode(this.editmodifyform.uri1);
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      }else if(formname=="editRequestTimeform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin7.sdRequestTimeV);
            dstdictatedata = Base64.encode(this.editRequestTimeform.sdRequestTime+this.editRequestTimeform.sdRequestTimeUnit);
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      }
      if(dstdictatedata==null){
        this.updatecmdLoading=false;
        return false;
      }
      axios.patch(url,{
        domainName:domainO.domainName,
        domainPort:domainO.port,
        locationName:locationO.name,
        locationType:locationO.type,
        snodeId:this.shadowObj.snodeId,
        directiveName:this.dictateType,
        srcData:srcdictatedata,
        targetData:dstdictatedata
      }).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.$emit("updateLcConfcmd");
          this.isTypesEditShow = false;
          this.isAddEditShow = false;
          this.isModifyEditShow = false;
          this.isRequestTimeShow = false;
          }else{
            this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
          }
        this.updatecmdLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    updateEditTyverifyConfCmd(formname){//编辑 shadow_verify_browser 以及 shadow_verify_agent 要同时编辑两种指令，先采取掉两次接口的方式解决
      this.updatecmdLoading=true;
      if(this.isAuto){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?autoconfig=true";
      }else if(this.isEditConfig){
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive?savedConfig=true";
      }else if(this.isBatch){//批量修改
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
      }else{
        var url=SERVER_API_URL+"pe/shadow/domain/location/directive";
      }
      var domainO=this.domainObj,
      locationO=this.locationObj;
      var srcdictatedata=null, dstdictatedata = null;

      if(formname=="editverifyform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
          
            this.dictateType='shadow_verify_browser';
            srcdictatedata=Base64.encode(this.orgin6.verifyBrowser);
            dstdictatedata=Base64.encode(this.editverifyform.verifyBrowser);

            axios.patch(url,{
              domainName:domainO.domainName,
              domainPort:domainO.port,
              locationName:locationO.name,
              locationType:locationO.type,
              snodeId:this.shadowObj.snodeId,
              directiveName:this.dictateType,
              srcData:srcdictatedata,
              targetData:dstdictatedata
            }).then((res)=>{
              if(res.data.responseCode==0){
                this.dictateType='shadow_verify_agent';
                srcdictatedata=Base64.encode(this.orgin6.verifyAgent);
                dstdictatedata=Base64.encode(this.editverifyform.verifyAgent);

                axios.patch(url,{
                  domainName:domainO.domainName,
                  domainPort:domainO.port,
                  locationName:locationO.name,
                  locationType:locationO.type,
                  snodeId:this.shadowObj.snodeId,
                  directiveName:this.dictateType,
                  srcData:srcdictatedata,
                  targetData:dstdictatedata
                }).then((res)=>{
                  if(res.data.responseCode==0){
                    this.$message({
                      type: 'success',
                      message: this.$t('lg.success')
                    });
                    this.$emit("updateLcConfcmd");
                    this.isTypesEditShow = false;
                    this.isAddEditShow = false;
                    this.isVerifyEditShow = false;
                  }
                })

              }else{
                this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
              }
              this.updatecmdLoading=false;
            }).catch((err)=>{
              console.log(err);
            });
          }else {
            console.log('error submit!!');
            return false;
          }
        });
      }

    }
  },
  components:{
    loading
  }
}
</script>
<style scoped>
.cmdlist-wrapper{ width: 100%; overflow: hidden}
.cmdlist-wrapper .cmdlist-box{
  background-color: #f8f8f8;
  padding:12px;
  margin-bottom: 14px;
}
.cmdlist-wrapper .cmdlist-box:last-child{ margin-bottom: 0}
.cmdlist-box .title{ font-size: 18px; color: #333; margin-bottom: 10px}
.cmdlist-box .table-box{ background: #fff}
</style>
