<!--shadow批量操作配置指令-->
<!--shadow批量操作配置指令（只开放对保护指令、特殊保护指令的批量操作 2020.4.17）-->
<template>
  <div class="cmdlist-wrapper">
    <el-dialog width="70%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isShow" :close-on-click-modal="false" :before-close="batchDirectiveDialogClose">
      <!-- {{batchDirectiveData}} -->
      <!-- <p class="nodata-box" v-if="Object.keys(batchDirectiveData).length==0">{{$t('lg.nodata')}}</p> -->
      <div class="cmdlist-box"><!--保护配置-->
        <h1 class="title">{{$t('lg.protectconfig')}}</h1>
        <table class="table-bg" v-if="protectDirectiveData.length>0">
          <thead>
            <tr>
              <th>domain</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vitem,key) in protectDirectiveData">
              <td>{{vitem.domainName}}</td>
              <td>
                <div class="tddiv" v-for="(vitemv,vkeyv) in vitem.locationProtectconfList">
                  <p class="locationp"><span class="locationpsp">LOCATION：</span>  {{vitemv.locationName}}</p>
                  <div class="insdiv" v-for="(vitemv2,vkey2) in vitemv.protectconfList">
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.ourl')}}：</span>{{vitemv2.srcUri}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.url2')}}：</span>{{vitemv2.jumpUrl}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.refreshtime')}}：</span>{{vitemv2.refreshNum}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.validdate')}}：</span>{{vitemv2.timeout}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.configproperty')}}：</span>{{toConftype2(vitemv2.confType)}}</p>
                    </div> 
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="nodata-box" v-else>{{$t('lg.nodata')}}</p>
        <loading v-show="batchDirectiveLoading" :title="$t('lg.handling')"></loading>
      </div>
      <div class="cmdlist-box"><!--特殊保护配置-->
        <h1 class="title">{{$t('lg.spconfig')}}</h1>
        <table class="table-bg" v-if="specialDirectiveData.length>0">
          <thead>
            <tr>
              <th>domain</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vitem,key) in specialDirectiveData">
              <td>{{vitem.domainName}}</td>
              <td>
                <div class="tddiv" v-for="(vitemv,vkeyv) in vitem.locationSpecialProtectconfList">
                  <p class="locationp"><span class="locationpsp">LOCATION：</span>  {{vitemv.locationName}}</p>
                  <div class="insdiv" v-for="(vitemv2,vkey2) in vitemv.specialProtectconfList">
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.ourl')}}：</span>{{vitemv2.srcUri}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.url2')}}：</span>{{vitemv2.jumpUrl}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.remained')}}：</span>{{vitemv2.retainPart}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.refreshtime')}}：</span>{{vitemv2.refreshNum}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.validdate')}}：</span>{{vitemv2.timeout}}</p>
                      <p class="insdivp"><span class="locationpsp">{{$t('lg.configproperty')}}：</span>{{toConftype2(vitemv2.confType)}}</p>
                    </div> 
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="nodata-box" v-else>{{$t('lg.nodata')}}</p>
        <loading v-show="batchDirectiveLoading" :title="$t('lg.handling')"></loading>
      </div>

      <!--跳转配置-->
      <!-- <div class="cmdlist-box" v-if="batchDirectiveData.hasOwnProperty('shadow_location')">
        <h1 class="title">{{$t('lg.jumpconfig')}}</h1>
        <table class="table-bg">
          <thead>
            <tr>
              <th>{{$t('lg.domain')}}</th>
              <th>URI</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vitem,key) in batchDirectiveData.shadow_location">
              <td v-for="vitemv in vitem">{{vitemv}}</td>
              <td class="text-center">
                <a href="javascript:;" @click="editConfcmd('shadow_location',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" @click="delBatchDirective('shadow_location',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->
      
      <!--自定义配置-->
      <!-- <div class="cmdlist-box" v-if="batchDirectiveData.hasOwnProperty('shadow_custom')">
        <h1 class="title">自定义配置</h1>
        <table class="table-bg">
          <thead>
            <tr>
              <th>配置名称</th>
              <th>配置参数</th>
              <th width="110"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(vitem,key) in batchDirectiveData.shadow_custom" :key="key">
              <td>{{vitem.customName}}</td>
              <td>{{vitem.customParams}}</td>
              <td class="text-center">
                <a href="javascript:;" @click="editConfcmd('shadow_custom',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                <a href="javascript:;" @click="delBatchDirective('shadow_custom',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div> -->

      <!--高级配置  高级配置标题只显示一次，有任意一个高级配置就显示并且不重复显示-->
      <div class="cmdlist-box" v-if="isShowSeniorDct">
        <h1 class="title">{{$t('lg.highconfig')}}</h1> 

        <!--特殊文件类型-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_sub_filter_types')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.specialtype')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_sub_filter_types">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('shadow_sub_filter_types',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('shadow_sub_filter_types',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Header补全-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('add_header')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.headercompletion')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.add_header">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('add_header',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('add_header',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Header修改-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_modify_header')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.headeredit')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_modify_header">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('shadow_modify_header',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('shadow_modify_header',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--请求时间-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_request_time')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.shoudongdailfy')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_request_time">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('shadow_request_time',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('shadow_request_time',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--浏览器参数指标、用户行为指标 这两种配置指令同时生效 shadow_verify_browser、shadow_verify_agent-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_verify_browser')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.browserParams')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_verify_browser">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('shadow_verify_browser',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('shadow_verify_browser',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--用户行为指标-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_verify_agent')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.userBhIndct')}}</th>
                <th width="110"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_verify_agent">
                <td v-for="vitemv in vitem">{{vitemv}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="editConfcmd('shadow_verify_agent',vitem)" class="edit-del-a"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
                  <a href="javascript:;" @click="delBatchDirective('shadow_verify_agent',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--开启动态指纹功能 只有动态指纹功能设置为开启时才显示-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_verify_token')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.dongtaizwgn')}}</th>
                <th width="60"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_verify_token">
                <td>{{$t('lg.dtzwgnykq')}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="delBatchDirective('shadow_verify_token',batchDirectiveData.shadow_verify_token)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!--Js增强功能-->
        <div class="cmdlist-box-spc" v-if="batchDirectiveData.hasOwnProperty('shadow_insert_js_ex')">
          <table class="table-bg">
            <thead>
              <tr>
                <th>{{$t('lg.jstrong')}}</th>
                <th width="60"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(vitem,key) in batchDirectiveData.shadow_insert_js_ex">
                <td>{{$t('lg.jsstrongopen')}}</td>
                <td class="text-center">
                  <a href="javascript:;" @click="delBatchDirective('shadow_insert_js_ex',vitem)" class="edit-del-a"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <loading v-show="batchDirectiveLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>

    <!--编辑保护配置、特殊保护配置-->
    <el-dialog width="55%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isProtectEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose">
      <el-form ref="editsbform" :model="editsbform" :rules="editsbformRules" :label-width="$store.state.isencn=='en'?'180px':'110px'">
        <el-form-item :label="$t('lg.ourl')" prop="uri1">
          <el-input v-model.trim="editsbform.uri1"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.remained')" v-if="dictateType=='shadow_sub_filter_ex'" prop="uribl">
          <el-input v-model.trim="editsbform.uribl"></el-input>
        </el-form-item>

        <el-form-item :label="$t('lg.url2')" prop="uri2">
          <el-input v-model.trim="editsbform.uri2"></el-input>
        </el-form-item>
        
        <el-form-item :label="$t('lg.timeoutset')" prop="timeNum">
          <el-input v-model.trim="editsbform.timeNum" style="width:30%"></el-input>
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
          <el-input v-model.trim="editsbform.refreshtimes"></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.configproperty')">
          <div class="checkBorder">
            <el-checkbox-group  size="mini" v-model="editsbform.raeChecklist" @change="checkedChange">
              <el-checkbox :label="$t('lg.replaceconfig')" v-show="dictateType=='shadow_sub_filter'"></el-checkbox>
              <el-checkbox :label="$t('lg.allowaccessourl')" :disabled="isCheckDisable" v-show="dictateType=='shadow_sub_filter'"></el-checkbox>
              <el-checkbox :label="$t('lg.encrypt2')" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptab')" :disabled="isCheckDisable"></el-checkbox>
              <el-checkbox :label="$t('lg.encryptpa')" :disabled="dictateType=='shadow_sub_filter_ex'" v-show="dictateType=='shadow_sub_filter_ex'"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditConfCmd('editsbform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>
    <!--编辑跳转配置-->
    <el-dialog width="55%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isSkipEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose">    
      <el-form ref="editslform" :model="editslform" :rules="editslformRules"  label-width="70px">
        <el-form-item :label="$t('lg.domain')" prop="uri1">
          <el-input v-model.trim="editslform.uri1"></el-input>
        </el-form-item>
        <el-form-item label="URI" prop="uri2">
          <el-input v-model.trim="editslform.uri2"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditSlConfCmd('editslform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading v-show="updateBatchDctLoading" :title="$t('lg.handling')"></loading>
    </el-dialog>
    <!-- 编辑自定义配置 -->
    <el-dialog width="55%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isCustomEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose">    
      <el-form ref="editscform" :model="editscform" :rules="editscformRules" label-width="90px">
        <el-form-item :label="$t('lg.peizhimc')" prop="customName">
          <el-input v-model.trim="editscform.customName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('lg.peizhics')" prop="customParams">
          <el-input v-model.trim="editscform.customParams"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditScConfCmd('editscform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>
    
    <!--编辑高级配置-->
    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isTypesEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--特殊文件类型-->    
      <el-form ref="edittyform" :model="edittyform" :rules="edittyformRules" label-width="110px"> 
        <el-form-item :label="$t('lg.specialtype')" prop="uri1">
          <el-select style="width:100%" 
            v-model.trim="edittyform.uri1"
            filterable
            allow-create
            clearable
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
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>
    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isAddEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--Header补全-->   
      <el-form ref="editaddform" :model="editaddform" :rules="editaddformRules"  :label-width="$store.state.isencn=='en'?'200px':'110px'">
        <el-form-item :label="$t('lg.headercompletion')" prop="uri1">
          <el-select style="width:100%"  
            v-model.trim="editaddform.uri1"
            filterable
            allow-create
            clearable
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
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>
    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isModifyEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--Header修改-->  
      <el-form ref="editmodifyform" :model="editmodifyform" :rules="editmodifyformRules" label-width="110px">
        <el-form-item :label="$t('lg.headeredit')" prop="uri1">
          <el-select style="width:100%"  
            v-model.trim="editmodifyform.uri1"
            filterable
            allow-create
            clearable
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
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item>
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>    
    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isRequestTimeShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--请求时间-->
      <el-form ref="editRequestTimeform" :model="editRequestTimeform" :rules="editRequestTimeformRules">
        <el-row :gutter="10">
          <el-col :span="16" >
            <el-form-item :label="$t('lg.shoudongdlsz')" prop="sdRequestTime" label-width="140px">
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
        <el-form-item label-width="140px">
          <el-button type="primary" @click="updateEditTyConfCmd('editRequestTimeform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item> 
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>

    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isVerifyBrowserEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--浏览器参数指标-->
      <el-form ref="editverifyBrowserform" :model="editverifyBrowserform" :rules="editverifyBrowserformRules" label-width="125px">
        <el-form-item :label="$t('lg.browserParams')" prop="verifyBrowser">
          <el-input v-model="editverifyBrowserform.verifyBrowser" :placeholder="$t('lg.browserParams')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditTyConfCmd('editverifyBrowserform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item> 
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>

    <el-dialog width="45%" :title="$t('lg.bundleconfiginstruc')+':'+shadowObj.name+' ['+shadowObj.snodeId+']'" :visible.sync="isVerifyAgentEditShow" :close-on-click-modal="false" :before-close="batchDctEditClose"><!--用户行为指标-->
      <el-form ref="editverifyAgentform" :model="editverifyAgentform" :rules="editverifyAgentformRules" label-width="125px">
        <el-form-item :label="$t('lg.userBhIndct')" prop="verifyAgent">
          <el-input v-model="editverifyAgentform.verifyAgent" :placeholder="$t('lg.userBhIndct')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateEditTyConfCmd('editverifyAgentform')">{{$t('lg.save')}}</el-button>
          <el-button @click="batchDctEditClose">{{$t('lg.back')}}</el-button>
        </el-form-item> 
      </el-form>
      <loading :title="$t('lg.handling')" v-show="updateBatchDctLoading"></loading>
    </el-dialog>

  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar';
import {handleConfigure} from '@/assets/js/tool';
import getLocationInstruct from './lc_instruct.js';
export default{
  components:{
    loading
  },
  props:{
    isShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      protectDirectiveData:[],
      specialDirectiveData:[],
      batchDirectiveData:{},
      isShowSeniorDct:false,//显示高级配置，有对应数据才显示高级配置
      
      batchDirectiveLoading:false,
      updateBatchDctLoading:false,

      isCheckDisable:false,

      isProtectEditShow:false,//编辑弹出框显示隐藏 保护配置、特殊保护配置
      isSkipEditShow:false,//编辑弹出框显示隐藏 跳转配置
      isCustomEditShow:false,//编辑弹出框显示隐藏 自定义配置
      isTypesEditShow:false,//编辑弹出框显示隐藏 特殊文件类型
      isAddEditShow:false,//编辑弹出框显示隐藏 Header补全
      isModifyEditShow:false,//编辑弹出框显示隐藏 Header修改
      isRequestTimeShow:false,//编辑弹出框显示隐藏 请求时间
      isVerifyBrowserEditShow:false,//编辑弹出框显示隐藏 浏览器参数指标
      isVerifyAgentEditShow:false,//编辑弹出框显示隐藏 用户行为指标

      dictateType:'',
      orgin:{
        uri1:'',
        uribl:'',//保留部分 特殊配置指令才有这个参数
        uri2:'',
        
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
      orginVerifyBrowser:{
        verifyBrowser:'',
      },
      orginVerifyAgent:{
        verifyAgent:''
      },
      
      orgin7:{//请求时间
        sdRequestTimeV:'',
      },
      orginSc:{//自定义配置
        customName:'',
        customParams:''
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
        uribl:'',//保留部分 特殊配置指令才有这个参数
        uri2:'',
        
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
      editscform:{
        customName:'',
        customParams:''
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
          label:this.$t('lg.ms'),
          value:'ms'
        },{
          label:this.$t('lg.second'),
          value:'s'
        }],
      },
      editverifyBrowserform:{
        verifyBrowser:'',
      },
      editverifyAgentform:{
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
        uribl:[
          // {required:true, message:this.$t('lg.required'), trigger:'blur'},
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
      editscformRules:{
        customName:[
          {required: true,message: this.$t('lg.required'), trigger: 'blur'},
        ],
        customParams:[]
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
      editverifyBrowserformRules:{
        verifyBrowser:[
          {required: true, trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      },
      editverifyAgentformRules:{
        verifyAgent:[
          {required: true, trigger: 'blur'},
          {pattern:/^[0-9]+$/,message: this.$t('lg.requirepositive'), trigger: 'change'}//必须为正整数
        ]
      }

    }
  },
  watch:{
    'isShow':function(){
      this.getAllProtects();
      this.getAllSpecials();
    }
  },
  methods:{
  //  getSdBatchInstructData(){//获取批量配置指令
      // return new Promise((resolve,reject)=>{
      //   getLocationInstruct(this,{shadowObj:this.shadowObj},true).then((resolvedata)=>{//请求接口 异步 这是调用子组件里的方法
      //     this.batchDirectiveData=resolvedata;
      //     resolve(resolvedata);
      //   });
      // })
      // const _this=this;
      // return new Promise((resolve,reject)=>{
      //   return Promise.all([_this.getAllProtects,_this.getAllSpecials])
      // })
   // },
    getAllProtects(){
    //  return new Promise((resolve,reject)=>{
        this.updateBatchDctLoading=true;
        let url=SERVER_API_URL+"pe/shadow/domain/location/protectconf/all?snodeId="+this.shadowObj.snodeId;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resData=res.data.data;
            this.protectDirectiveData=resData;
            this.updateBatchDctLoading=false;
           // resolve(resData)
          }else{
           // reject("error")
          }
        })
     // });
    },
    getAllSpecials(){
     // return new Promise((resolve,reject)=>{
        this.updateBatchDctLoading=true;
        let url=SERVER_API_URL+"pe/shadow/domain/location/protectconf/special/all?snodeId="+this.shadowObj.snodeId;
        axios.get(url).then((res)=>{
          if(res.data.responseCode==0){
            let resData=res.data.data;
            this.specialDirectiveData=resData;
            this.updateBatchDctLoading=false;
           // resolve(resData)
          }else{
          //  reject("error")
          }
        })
    //  });
    },

    checkedChange(){//选择替换配置后，禁用其他配置
      var _this = this;
      if(_this.editsbform.raeChecklist.length==0){
        _this.isCheckDisable = false;
      };
      _this.editsbform.raeChecklist.forEach(function(v,i){
        if(v=="替换配置" || v=="Replacement configuration"){
          _this.isCheckDisable = true;
          _this.editsbform.raeChecklist=[_this.$t('lg.replaceconfig')];
        }else{
          _this.isCheckDisable = false;
        }
      });
    },
    batchDirectiveDialogClose(){
      this.$emit('setbysdBatchInstructmodalclose',false);
    },
    batchDctEditClose(){//关闭编辑弹框
      this.editsbform.uribl='';
      this.isProtectEditShow=false;
      this.isSkipEditShow=false;
      this.isCustomEditShow=false;
      this.isTypesEditShow=false;
      this.isAddEditShow=false;
      this.isModifyEditShow=false;
      this.isRequestTimeShow=false;
      this.isVerifyBrowserEditShow=false;
      this.isVerifyAgentEditShow=false;
    },
    delBatchDirective(type,vitem){//删除指令 //高级配置不做处理（js增强功能、超时时间除外）
      var _this=this;
      _this.batchDirectiveLoading=true;
      let delVitem=Object.assign([],vitem);
      // console.log(delVitem)
      var srcdictateType=type;
      // console.log(srcdictateType)
      if(srcdictateType=="shadow_sub_filter"){//删除保护配置
        if(delVitem[4]==""){//无指令属性时
          delVitem.pop(delVitem[4]);
        }else{
          const configureArr={//配置属性文本文字转换成code
                  '替换配置':'r',
                  '允许访问原URI':'a',
                  '二次加密':'e',
                  '绝对路径':'s',
                }
          delVitem[4]=handleConfigure(delVitem[4],configureArr,false);
        }
        delVitem[0] = "'"+delVitem[0]+"'";
        delVitem[1] = "'"+delVitem[1]+"'";
        switch(delVitem[2].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            delVitem[2]=delVitem[2].match(/(\d*)(\w*)/)[1]+"ms";
        };
      }else if(srcdictateType=="shadow_location"){//删除跳转配置时，域名要作为第二个参数。uri则为第一个参数  当中传入域名时则只传入一个参数
        if(delVitem[1]==""){
          delVitem.pop();
          delVitem[0] = "'"+delVitem[0]+"'";
        }else{
          var emp = "'"+delVitem[0]+"'";
          delVitem[0] = "'"+delVitem[1]+"'";
          delVitem[1] = emp;
        }
      }else if(srcdictateType=="shadow_sub_filter_ex"){//删除特殊保护配置
        if(delVitem[5]==""){//无指令属性时
          delVitem.pop(delVitem[5]);
        }else{
          const configureArr={//配置属性文本文字转换成code
                  '二次加密':'e',
                  '绝对路径':'s',
                  '路径加密':'p'
                }
          delVitem[5]=handleConfigure(delVitem[5],configureArr,false);
        }
        delVitem[0] = "'"+delVitem[0]+"'";
        delVitem[1] = "'"+delVitem[1]+"'";
        delVitem[2] = "'"+delVitem[2]+"'";
        switch(delVitem[3].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "年":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"y";
            break;
          case "月":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"M";
            break;
          case "周":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"w";
            break;
          case "天":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"d";
            break;	
          case "小时":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"h";
            break;
          case "分钟":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"m";
            break;
          case "秒":
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            delVitem[3]=delVitem[3].match(/(\d*)(\w*)/)[1]+"ms";
        };
      }else if(srcdictateType=="shadow_custom"){
        srcdictateType=delVitem.customName;
        delVitem=[delVitem.customParams];
      }else if(srcdictateType=="shadow_request_time"){//超时时间
        switch(delVitem[0].match(/(\d+)([\u4e00-\u9fa5]+)/)[2])
        {
          case "秒":
            delVitem[0]=delVitem[0].match(/(\d*)(\w*)/)[1]+"s";
            break;
          default:
            delVitem[0]=delVitem[0].match(/(\d*)(\w*)/)[1]+"ms";
        }
      }
     
      var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
    
      // console.log(vitem.join(" "))
      var basevitem=Base64.encode(delVitem.join(" "));
      var directivesObj = {}, 
          directivesArry = [];

      directivesObj[srcdictateType]=basevitem;
      directivesArry.push(directivesObj);

      if(srcdictateType=="shadow_insert_js_ex"){//删除js增强功能，相当于删掉指定的一条shadow_insert_js_ex指令  ！！！！批量指令暂时弃用高级配置
        directivesArry[0].shadow_insert_js_ex=Base64.encode("pe 10s 1 '</title>' '</title><script src=\"/formvalidator/config.js\"><\/script><script src=\"/formvalidator/' 'shadowlib.js' '\"><\/script>'");
      }
      //end
      
      // console.log(srcdictateType);
      //插入两个js 2018.12.05  一条保护指令，一条insert_js
      // if(srcdictateType=="shadow_insert_js"){//如果是删除高级配置的js增强功能，则要删shadow_insert_js及shadow_sub_filter两种类型的配置，shadow_sub_filter为写死的值 2018.12.05
      //   directivesArry.push({
      //     // shadow_sub_filter:Base64.encode("'<head>' '<head> <script src=\"/formvalidator/jsen-cryp-base.js\"><\/script>' 10000s 100 r")
      //     shadow_sub_filter:Base64.encode("'</title>' '</title> <script src=\"/formvalidator/jsen-cryp-base.js\"><\/script>' 10000s 100 r")
      //   })
      // }

      // if(srcdictateType=="shadow_verify"){//同时删除 shadow_verify_browser、shadow_verify_agent这两个 高级配置
      //   directivesArry = [];
      //   directivesArry.push({
      //     shadow_verify_browser:Base64.encode(delVitem[0]),
      //     shadow_verify_agent:Base64.encode(delVitem[1])
      //   })
      // }
      // console.log(directivesArry)
      axios.delete(url,{
        data:{
          snodeId:_this.shadowObj.snodeId,
          directives:directivesArry
        }
      }).then((res)=>{
        // console.log(res);
        if(res.data.responseCode==0){
          // item[srcdictateType].splice(item[srcdictateType].indexOf(delVitem),1);//静态截取
          _this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
          _this.getSdBatchInstructData();//直接更新 动态
          _this.$emit("updateRenderTree");
        }else{
          _this.$message.error(_this.$t('lg.failed')+':'+ res.data.data.message);
        }
        _this.batchDirectiveLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    editConfcmd(type,vitem){//获取编辑参数
      // console.log(vitem)
      this.dictateType=type;
      if(type=="shadow_sub_filter"){
        this.isProtectEditShow=true;
        this.orgin.uri1=vitem[0];//保存改之前的旧数据用于发送请求
        this.orgin.uri2=vitem[1];
        this.orgin.refreshtimes=vitem[3];

        var rae=vitem[4];
        const configureArr={//配置属性文本文字转换成code
                '替换配置':'r',
                '允许访问原URI':'a',
                '二次加密':'e',
                '绝对路径':'s',
              }
        this.orgin.rae=handleConfigure(rae,configureArr,false);
   
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
        this.editsbform.raeChecklist=rae.split('、');
        this.isCheckDisable=rae.indexOf(this.$t('lg.replaceconfig'))!==-1;

        this.editsbform.uri1=vitem[0];
        this.editsbform.uri2=vitem[1];
        this.editsbform.refreshtimes=vitem[3];
      }else if(type=="shadow_location"){
        this.isSkipEditShow=true;
        this.orgin2.uri1=vitem[0];
        this.orgin2.uri2=vitem[1];
        this.editslform.uri1=vitem[0];
        this.editslform.uri2=vitem[1];
      }else if(type=="shadow_sub_filter_ex"){
        this.isProtectEditShow=true;
        this.orgin.uri1=vitem[0];//保存改之前的旧数据用于发送请求
        this.orgin.uribl=vitem[1];
        this.orgin.uri2=vitem[2];
        this.orgin.refreshtimes=vitem[4];

        var rae=vitem[5];
        const configureArr={//配置属性文本文字转换成code
                '二次加密':'e',
                '绝对路径':'s',
                '路径加密':'p'
              }
        this.orgin.rae=handleConfigure(rae,configureArr,false);

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
        this.editsbform.raeChecklist=rae.split('、');
      
        this.editsbform.uri1=vitem[0];
        this.editsbform.uribl=vitem[1];
        this.editsbform.uri2=vitem[2];
        this.editsbform.refreshtimes=vitem[4];
      }else if(type=="shadow_custom"){
        this.isCustomEditShow=true;
        this.orginSc.customName=vitem.customName;
        this.orginSc.customParams=vitem.customParams;
        this.editscform.customName=vitem.customName;
        this.editscform.customParams=vitem.customParams;
      }else if(type=="shadow_sub_filter_types"){
        this.isTypesEditShow=true;
        this.orgin3.uri1=vitem[0];
        this.edittyform.uri1=vitem[0];
      }else if(type=="add_header"){
        this.isAddEditShow=true;
        this.orgin4.uri1=vitem[0];
        this.editaddform.uri1=vitem[0];
      }else if(type=="shadow_modify_header"){
        this.isModifyEditShow=true;
        this.orgin5.uri1=vitem[0];
        this.editmodifyform.uri1=vitem[0];
      }else if(type=="shadow_request_time"){
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
      }else if(type=="shadow_verify_browser"){
        this.isVerifyBrowserEditShow=true;
        this.orginVerifyBrowser.verifyBrowser=vitem[0];
        this.editverifyBrowserform.verifyBrowser=vitem[0];
      }else if(type=="shadow_verify_agent"){
        this.isVerifyAgentEditShow=true;
        this.orginVerifyAgent.verifyAgent=vitem[0];
        this.editverifyAgentform.verifyAgent=vitem[0];
      }
    },
    updateEditConfCmd(formname){//保存 保护配置 以及特殊保护配置的修改
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.updateBatchDctLoading=true;
          var rr=this.$t('lg.replaceconfig'),
              aa=this.$t('lg.allowaccessourl'),
              ee=this.$t('lg.encrypt2'),
              ss=this.$t('lg.encryptab'),
              pp=this.$t('lg.encryptpa');
          var dstraeChecklist=this.editsbform.raeChecklist.join("").replace(rr,"r").replace(aa,"a").replace(ee,"e").replace(ss,"s").replace(pp,"p");
          // console.log(dstraeChecklist)
          if(this.dictateType=='shadow_sub_filter'){
            if(this.orgin.rae==""){//不传入指令属性时 
              var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uri2+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes);
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
              var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uribl+"'"+" "+"'"+this.orgin.uri2+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes);
            }else{
              var srcdictatedata=Base64.encode("'"+this.orgin.uri1+"'"+" "+"'"+this.orgin.uribl+"'"+" "+"'"+this.orgin.uri2+"'"+" "+this.orgin.time+" "+this.orgin.refreshtimes+" "+this.orgin.rae);
            }
            if(dstraeChecklist==""){//不传入指令属性时 
              var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uribl+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes);
            }else{
              var dstdictatedata=Base64.encode("'"+this.editsbform.uri1+"'"+" "+"'"+this.editsbform.uribl+"'"+" "+"'"+this.editsbform.uri2+"'"+" "+this.editsbform.timeNum+this.overTimeValue+" "+this.editsbform.refreshtimes+" "+dstraeChecklist);
            }
          }
         
          var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
          
          // console.log(srcdictatedata);
          // console.log(dstdictatedata);

          axios.patch(url,{
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
              this.getSdBatchInstructData();
              this.$emit("updateRenderTree");
              this.isProtectEditShow=false;
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.updateBatchDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    updateEditSlConfCmd(formname){//保存 跳转配置的修改
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.updateBatchDctLoading=true;
          
          var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
         
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
              this.getSdBatchInstructData();
              this.isSkipEditShow = false;
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.updateBatchDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
        }
      });
    },
    updateEditScConfCmd(formname){//保存 自定义配置的修改
      this.$refs[formname].validate((valid) => {
        if(valid){
          this.updateBatchDctLoading=true;
         
          var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
       
          var srcdictatedata = "";
          var dstdictatedata= "";

          if(this.orginSc.customParams!=""){
            srcdictatedata=Base64.encode(this.orginSc.customParams);
          }
          if(this.editscform.customParams!=""){
            dstdictatedata=Base64.encode(this.editscform.customParams);
          }
          axios.patch(url,{
            snodeId:this.shadowObj.snodeId,
            directiveName:this.orginSc.customName,
            srcData:srcdictatedata,
            targetData:dstdictatedata
          }).then((res)=>{
            if(res.data.responseCode==0){
              this.$message({
                type: 'success',
                message: this.$t('lg.success')
              });
              this.getSdBatchInstructData();
              this.isCustomEditShow = false;
            }else{
              this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
            }
            this.updateBatchDctLoading=false;
          }).catch((err)=>{
            console.log(err);
          });
              
        }
      })
    },
    updateEditTyConfCmd(formname){//保存 高级配置的修改
      this.updateBatchDctLoading=true;
     
      var url=SERVER_API_URL+"pe/shadow/domain/location/directive/batch";
     
      var srcdictatedata=null, dstdictatedata = null;
      if(formname=="edittyform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin3.uri1);
            dstdictatedata = Base64.encode(this.edittyform.uri1);
          }
        });
      }else if(formname=="editaddform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin4.uri1);
            dstdictatedata = Base64.encode(this.editaddform.uri1);
          }
        });
      }else if(formname=="editmodifyform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin5.uri1);
            dstdictatedata = Base64.encode(this.editmodifyform.uri1);
          }
        });
      }else if(formname=="editRequestTimeform"){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orgin7.sdRequestTimeV);
            dstdictatedata = Base64.encode(this.editRequestTimeform.sdRequestTime+this.editRequestTimeform.sdRequestTimeUnit);
          }
        });
      }else if(formname=='editverifyBrowserform'){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orginVerifyBrowser.verifyBrowser);
            dstdictatedata = Base64.encode(this.editverifyBrowserform.verifyBrowser);
          }
        });
      }else if(formname=='editverifyAgentform'){
        this.$refs[formname].validate((valid) => { 
          if(valid){
            srcdictatedata = Base64.encode(this.orginVerifyAgent.verifyAgent);
            dstdictatedata = Base64.encode(this.editverifyAgentform.verifyAgent);
          }
        });
      }
      if(dstdictatedata==null){
        this.updateBatchDctLoading=false;
        return false;
      }
      axios.patch(url,{
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
          this.getSdBatchInstructData();
          this.batchDctEditClose();
          }else{
            this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
          }
        this.updateBatchDctLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    toConftype2(item){
      if(item){
      return item.replace("r",this.$t('lg.replaceconfig')+"；").replace("a",this.$t('lg.allowaccessourl')+"；").replace("x",this.$t('lg.regx')+"；").replace("s",this.$t('lg.encryptab')+"；").replace("e",this.$t('lg.encrypt2')+"；").replace("p",this.$t('lg.encryptpa')+"；")
    }}
  },
  filters:{
    toConftype(item){
      if(item){
      return item.replace("r",this.$t('lg.replaceconfig')+"；").replace("a",this.$t('lg.allowaccessourl')+"；").replace("x",this.$t('lg.regx')+"；").replace("s",this.$t('lg.encryptab')+"；").replace("e",this.$t('lg.encrypt2')+"；").replace("p",this.$t('lg.encryptpa')+"；")
    }}
  }
}
</script>
<style scoped>
.cmdlist-wrapper{}
.cmdlist-box{
  background-color: #f7f7f7;
  padding:12px;
  margin-bottom: 20px;
}
.cmdlist-box-spc{
  margin-bottom: 10px;
}
.cmdlist-box-spc:nth-last-of-type(1){
  margin-bottom: 0px;
}
.cmdlist-box:last-child{ margin-bottom: 0}
.cmdlist-box .title{ font-size: 18px; color: #333; margin:5px 0 15px}
.tddiv{
  border: 1px solid #ddd;
  padding: 8px;
  margin:14px 0;
}
.insdiv{
  border: 1px solid #f0f0f0;
  padding: 8px;
  margin:8px 0;
}
.insdivp{
  padding-bottom: 8px;
  margin:8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.insdivp:last-child{
  border-bottom: none;
}
.locationp{
  margin-bottom: 10px;
}
.locationpsp{
  color:#888
}
</style>
