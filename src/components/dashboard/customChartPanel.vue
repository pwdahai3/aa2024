<!--自定义图表构建面板-->
<template>
  <div class="customChartPanel-wrapper" @click="hideChartMenu">
    <div class="backBox">
      <router-link class="backBtn" tag="a" :to="{path:gobackPath}"><img src="static/icon/gobackChartGrid.png" :title="$t('lg.back')" :alt="$t('lg.back')"></router-link>
      <a href="javascript:;" class="backBtn cursor-pointer" :title="$t('lg.save')"><img src="static/icon/saveCustomChart.png" @click="addOrEditEnSure(vzActiveName,null,editKey)"></a><!-- @click="deletechart()" -->
    </div>
    
    <div ref="cpContainer" class="customChartPanel-container">
      <!-- 图表 -->
      <div ref="cpTop" class="chartPanelTop" v-loading="showLoading">
        <!-- <div :class="isShowChartMenu?'chartMenuNav chartMenuNavShow':'chartMenuNav'" @dblclick="showChartMenu()"></div> -->
        <!-- <ul class="chartMenuList" v-show="isShowChartMenu">
          <li @click="downloadCSV"><i class="el-icon-download"></i> 导出CSV</li>
        </ul> -->
        <graph v-if="vzActiveName=='graph'" :numb='origTotalNum' :graphOption='graphOptions'></graph>
        <singlestat v-if="vzActiveName=='singlestat'" :numb='origTotalNum' :singlestatOption='singlestatOptions'></singlestat>
        <pie v-if="vzActiveName=='pie'" :numb='origTotalNum' :pieOption="pieOptions"></pie>
        <barGauge v-if="vzActiveName=='barGauge'" :numb='origTotalNum' :barGaugeOption="barGaugeOptions"></barGauge>
        <log-tables v-if="vzActiveName=='table'" :numb='origTotalNum' :tabPageNum='tableRppVal-0' :ischart='true' :tableTitle='generalform.titleText' :aggsField='queryform.aggsId' :tabheadData="dynamicTags" :tabodyData="tableOptions.tabodyData" :totalNum="tableOptions.totalNum" @getChangeLogData='getQueryData'></log-tables> <!--(obj)=>getQueryData(obj)-->
      </div>

      <!-- 边界线（缩放） -->
      <div ref="cpResize" class="chartPanelResize"></div>

      <!-- 图表操作面板 -->
      <div ref="cpDown" class="chartPanelDown">
        <div class="panelTabs">
          <el-tabs>
            <el-tab-pane label="Query" class="tab-pane-bg">

              <el-form ref="queryform" :model="queryform" :rules="queryformRules" label-width="180px">
                
                <!-- 日志 -->
                <el-form-item :label="$t('lg.logsource')" prop='logId'>
                  <el-select v-model="queryform.logId" :placeholder="$t('lg.selectlog')" @change="getKeyarr()">
                    <el-option
                      v-for="(item,index) in queryform.logarr"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>    
                </el-form-item>

                <!-- access日志分不同模式 -->
                <el-form-item :label="$t('lg.mode')" prop='accessType' v-show="queryform.logId=='access.log'">
                  <el-radio-group v-model="queryform.accessType" size="small">
                    <el-radio label="protectChart" border>{{$t('lg.protection')}}</el-radio>
                    <el-radio label="monitorChart" border>{{$t('lg.monitor')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <!-- 聚合 -->
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item :label="$t('lg.aggcondito')" prop='aggsId'>
                      <el-select v-model="queryform.aggsId" :placeholder="$t('lg.aggfield')" clearable style="width:100%" @change="changeAggsId">
                        <el-option
                          v-for="(item,index) in queryform.keyarr"
                          :key="index"
                          :label="item.zh"
                          :value="item.field">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 查询（过滤条件） -->
                <div v-for="(items,n) in queryform.tmpsArray" :key="n">
                  <el-row :gutter="10">
                    <el-col :span="9">
                      <el-form-item :label="n==0?$t('lg.queryc'):''">
                        <el-select v-model="items.keyId" :placeholder="$t('lg.field')" @change="queryType(items.keyId,n)" clearable style="width:100%">
                          <el-option
                            v-for="(item,index) in queryform.keyarr"
                            :key="index"
                            :label="item.zh"
                            :value="item.field">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item label-width="0px" :prop="'tmpsArray.' + n + '.symbolId'" > <!-- :rules="{required: true, message: $t('lg.required'), trigger: 'blur'}" -->
                        <el-select v-model="items.symbolId" :placeholder="$t('lg.operator')">
                          <el-option
                            v-for="(item,index) in queryform.tmpsArray[n].symbolOpt"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label-width="0px" :prop="'tmpsArray.' + n + '.keyinputId'" :rules="items.queryTypes=='long'?keyinputIdRulesNum:keyinputIdRules">
                        <el-input v-model.trim="items.keyinputId" placeholder=""></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-select v-model="items.andorId">
                        <el-option
                          v-for="(item,index) in queryform.andor"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="3" class="icon-row">
                      <i class="el-icon-plus" @click="addQuery()"></i>
                      <i class="el-icon-minus" @click="delTmp(n)"></i>
                    </el-col>
                  </el-row>
                </div>

                <!-- 度量 -->
                <el-row :gutter="10" v-show="queryform.aggsId">
                  <el-col :span=".1">
                    <el-form-item :label="$t('lg.metric')" prop="metricId">
                      <el-select v-model="queryform.metricId" :placeholder="$t('lg.select')" style="width:100%">
                        <el-option
                          v-for="(item,index) in queryform.metrics"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label-width="0px" prop="symbol2Id">
                      <el-select v-model="queryform.symbol2Id" :placeholder="$t('lg.operator')">
                        <el-option
                          v-for="(item,index) in queryform.symbol2Opt"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item label-width="0px" prop="metricinputId">
                      <el-input v-model.trim="queryform.metricinputId" :placeholder="$t('lg.plzenter')"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>

                <!-- 条数size -->
                <el-form-item :label="$t('lg.numbers1')" prop='sizeValue' v-show="queryform.aggsId">
                  <el-select v-model="queryform.sizeValue" :placeholder="$t('lg.selectlog')">
                    <el-option
                      v-for="(item,index) in queryform.sizeValueOpt"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>    
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="getQueryData()">{{$t('lg.save')}}</el-button>
                </el-form-item>
              </el-form>

            </el-tab-pane>
            <el-tab-pane label="Visualization" class="visualization tab-pane-bg">
              
              <el-tabs type="border-card" v-model="vzActiveName" @tab-click="chartsHandleClick">
                <el-tab-pane name="graph">
                  <span slot="label" class="visImgTab">
                    <i>Graph</i>
                    <img src="static/fedoraCore_img/line_echarts.png" alt="" class="chartImg">
                  </span>

                  <div class="visSetting">
                    <ul class="menuBox baseList clearfix">
                      <li class="graphModeLi">

                        <ul class="visMenuList">
                          <li>Draw Modes</li>
                          <li>
                            <div class="visLable">Bars</div>
                            <div class="visValue">
                              <el-switch v-model="optBar"></el-switch>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Lines</div>
                            <div class="visValue">
                              <el-switch v-model="optLine"></el-switch>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">points</div>
                            <div class="visValue">
                              <el-switch v-model="optPoint"></el-switch>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <li class="graphModeOptLi">

                        <ul class="visMenuList">
                          <li>Mode Options</li>

                          <!-- <li v-if="!optLine && !optPoint">
                            <div class="noOptions">暂无配置项</div> 
                          </li> -->

                          <!-- bar\line\point Stack 堆叠 -->
                          <li>
                            <div class="visLable">Stack</div>  
                            <div class="visValue">
                              <el-switch v-model="optStack" class="margSwitch1"></el-switch> 
                            </div>
                          </li>

                          <li v-if="optLine">
                            <div class="visLable">Fill</div>  <!-- line areaStyle opacity -->
                            <div class="visValue">
                              <el-select v-model="fillValue" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in fill_widthOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li v-if="optLine">
                            <div class="visLable">Line Width</div>  <!-- line lineStyle width -->
                            <div class="visValue">
                              <el-select v-model="lineWidthValue" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in fill_widthOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li v-if="optLine">
                            <div class="visLable">Staircase</div> <!-- line step step:'middle' -->
                            <div class="visValue">
                              <el-switch v-model="optStaircase" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                        
                          <li v-if="optPoint">
                            <div class="visLable">Symbol</div> <!-- line symbol 点图-->
                            <div class="visValue">
                              <el-select v-model="symbolValue" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in symbolOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li v-if="optPoint">
                            <div class="visLable">SymbolSize</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="symbolSizeVal"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <li class="graphTooltipLi">

                        <ul class="visMenuList">
                          <li>Hover tooltip</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="graphTooltipShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Indicator</div>
                            <div class="visValue">
                              <el-select v-model="indicatorValue" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in indicatorOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                        </ul>

                      </li>
                    </ul>

                    <ul class="menuBox axesList clearfix">
                      <li class="titleLi">Axes</li>
                      <li class="yAxisLi">
                        <ul class="visMenuList">
                          <li>Y-Axis</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="graphYAxisShow" class="margSwitch2"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Name</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="graphYAxisName"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>

                          <li>
                            <div class="visLable">Y-Min</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="graphYMinVal" placeholder="auto" style="width:100%"></el-input>
                            </div>
                            <div class="visLable">Y-Max</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="graphYMaxVal" placeholder="auto" style="width:100%"></el-input>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <li class="xAxisLi">
                        <ul class="visMenuList">
                          <li>X-Axis</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="graphXAxisShow" class="margSwitch2"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Name</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="graphXAxisName"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <ul class="menuBox legendList clearfix">
                      <li class="titleLi">Legend</li>
                      <li class="graphLegOptionsLi">
                        <ul class="visMenuList">
                          <li>Options</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegendShow" class="margSwitch3"></el-switch> 
                            </div>
                          </li>

                          <li>
                            <div class="visLable">Orient</div> <!--legend orient -->
                            <div class="visValue">
                              <el-select v-model="graphOrientValue"   :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in orientOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value"
                                  :disabled="item.disabled">
                                </el-option>
                              </el-select>
                            </div>
                          </li>

                          <li>
                            <div class="visLable">To the right</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegToRight" class="margSwitch3" @change="LegendToRight"></el-switch> 
                            </div>
                          </li>
                        </ul>

                      </li>
                      <!-- <li class="graphLegValuesLi">
                        <ul class="visMenuList">
                          <li>Values</li>
                          <li>
                            <div class="visLable">Min</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegMinShow"></el-switch> 
                            </div>
                            <div class="visLable">Max</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegMaxShow"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Avg</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegAvgShow"></el-switch> 
                            </div>
                            <div class="visLable">Total</div>
                            <div class="visValue">
                              <el-switch v-model="graphLegTotalShow"></el-switch> 
                            </div>
                          </li>
                        </ul>
                      </li> -->
                    </ul>
                  </div>

                </el-tab-pane>
                <el-tab-pane name="singlestat">
                  <span slot="label" class="visImgTab">
                    <i>Singlestat</i>
                    <img src="static/fedoraCore_img/singlestat_echarts.png" alt="" class="chartImg">
                  </span>

                  <div class="visSetting">
                    <ul class="menuBox baseList clearfix">
                      <li class="sstValueLi">

                        <ul class="visMenuList">
                          <li>Value</li>
                          <li>
                            <div class="visLable">Stat</div>
                            <div class="visValue">
                              <el-select v-model="statValue"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in statOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="visLable">Font size</div>
                            <div class="visValue">
                              <el-select v-model="statFontSize"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in fontSizeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>

                          </li>
                          <li>
                            <div class="visLable">Prefix</div>
                            <div class="visValue">
                              <el-input v-model.trim="prefixVal"   :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                            <div class="visLable">Font size</div>
                            <div class="visValue">
                              <el-select v-model="prefixFontSize"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in fontSizeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Postfix</div>
                            <div class="visValue">
                              <el-input v-model.trim="postfixVal" :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                            <div class="visLable">Font size</div>
                            <div class="visValue">
                              <el-select v-model="postfixFontSize" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in fontSizeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <li class="sstColoringLi">
                        <ul class="visMenuList">
                          <li>Coloring</li>
                          <li>
                            <div class="visLable">Background</div>
                            <div class="visValue">
                              <el-color-picker v-model="sstBackgroundColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Stat</div>
                            <div class="visValue">
                              <el-color-picker v-model="statColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Prefix</div>
                            <div class="visValue">
                              <el-color-picker v-model="prefixColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Postfix</div>
                            <div class="visValue">
                              <el-color-picker v-model="postfixColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="sstGaugeLi">
                        <ul class="visMenuList">
                          <li>Gauge</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="gaugeShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>

                          <li v-show="gaugeShow">
                            <div class="visLable">Min</div>
                            <div class="visValue">
                              <el-input v-model.trim="gaugeMinVal"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>

                          <li v-show="gaugeShow">
                            <div class="visLable">Max</div>
                            <div class="visValue">
                              <el-input v-model.trim="gaugeMaxVal"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>

                          <li v-show="gaugeShow">
                            <div class="visLable">Internal Loop</div>
                            <div class="visValue">
                              <el-switch v-model="interLoopShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                         
                        </ul>
                      </li>
                    </ul>
                  </div>
               
                </el-tab-pane>
                <el-tab-pane name="pie">
                  <span slot="label" class="visImgTab">
                    <i>Pie</i>
                    <img src="static/fedoraCore_img/pie_echarts.png" alt="" class="chartImg">
                  </span>
                  
                  <div class="visSetting">
                    <ul class="menuBox baseList clearfix">
                      <li class="pieModeLi">

                        <ul class="visMenuList">
                          <li>Draw Modes</li>
                          <li>
                            <div class="visLable">{{$t('lg.shixinround')}}</div>
                            <div class="visValue">
                              <el-radio v-model="pieRadio" label="1" class="margRadio">{{''}}</el-radio>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">{{$t('lg.roundhuan')}}</div>
                            <div class="visValue">
                              <el-radio v-model="pieRadio" label="2" class="margRadio">{{''}}</el-radio>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <li class="pieModeOptLi">
                        <ul class="visMenuList">
                          <li>Mode Options</li>
                          <li>
                            <div class="visLable">clockwise</div> 
                            <div class="visValue">
                              <el-switch v-model="pieClockwise" class="margSwitch2"></el-switch> <!-- pie clockwise 饼图的扇区是否是顺时针排布-->
                            </div>
                          </li>

                          <li>
                            <div class="visLable">roseType</div> 
                            <div class="visValue">
                              <el-switch v-model="pieRoseType" class="margSwitch2"></el-switch> <!-- pie roseType 是否展示成南丁格尔图-->
                            </div>
                          </li>

                          <li>
                            <div class="visLable">label</div> 
                            <div class="visValue">
                              <el-switch v-model="pieLabel" class="margSwitch2"></el-switch> <!-- pie label \ labelLine  饼图每项的标签-->
                            </div>
                          </li>

                          <li v-if="pieLabel">
                            <div class="visLable">Value</div>
                            <div class="visValue">
                              <el-switch v-model="pieLabValShow" class="margSwitch4"></el-switch> 
                            </div>
                            <div class="visLable">Precent</div>
                            <div class="visValue">
                              <el-switch v-model="pieLabPrecentShow" class="margSwitch4"></el-switch> 
                            </div>
                          </li>

                          <li v-if="pieRadio=='2'">
                            <div class="visLable">{{$t('lg.neibanjin')}}</div> 
                            <div class="visValue">
                              <el-select v-model="radiusInnerVal" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in radiusOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                            <div class="visLable">{{$t('lg.waibanjin')}}</div> 
                            <div class="visValue">
                              <el-select v-model="radiusOuterVal" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in radiusOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="pieColoringLi">
                        <ul class="visMenuList">
                          <li>Coloring</li>
                          <li v-for="item in pieColorArr">
                            <div class="visLable">{{item.label}}</div>
                            <div class="visValue">
                              <el-color-picker v-model="item.color" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="pieTooltipLi">

                        <ul class="visMenuList">
                          <li>Hover tooltip</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="pieTooltipShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                        </ul>

                      </li>
                    </ul>

                    <ul class="menuBox legendList clearfix">
                      <li class="titleLi">Legend</li>
                      <li class="pieLegOptionsLi">
                        <ul class="visMenuList">
                          <li>Options</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="pieLegendShow" class="margSwitch5"></el-switch> 
                            </div>
                          </li>

                          <li>
                            <div class="visLable">Orient</div> <!--legend orient -->
                            <div class="visValue">
                              <el-select v-model="pieOrientValue"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in orientOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>

                          <li>
                            <div class="visLable">Position</div>
                            <div class="visValue">
                              <el-select v-model="pieLegPositionVal" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in legPositionOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                        </ul>

                      </li>
                      <!-- <li class="pieLegValuesLi">
                        <ul class="visMenuList">
                          <li>Values</li>
                          <li>
                            <div class="visLable">Value</div>
                            <div class="visValue">
                              <el-switch v-model="pieLabValShow"></el-switch> 
                            </div>
                            <div class="visLable">Precent</div>
                            <div class="visValue">
                              <el-switch v-model="pieLabPrecentShow"></el-switch> 
                            </div>
                          </li>
                        </ul>
                      </li> -->
                    </ul>
                  </div>

                </el-tab-pane>
                <el-tab-pane name="barGauge">
                  <span slot="label" class="visImgTab">
                    <i>BarGauge</i>
                    <img src="static/fedoraCore_img/barGauge_echarts.png" alt="" class="chartImg">
                  </span>

                  <div class="visSetting">
                    <ul class="menuBox baseList clearfix">
                      <li class="bgeLabelLi">
                        <ul class="visMenuList">
                          <li>Label Option</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLabelShow" class="margSwitch"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Position</div>
                            <div class="visValue">
                              <el-select v-model="bgeLabPositionVal"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in bgeLabPositionOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Distance</div>
                            <div class="visValue">
                              <el-select v-model="bgeLabDistanceVal"  :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in bgeLabDistanceOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Rotate</div>
                            <div class="visValue">
                              <el-select v-model="bgeLabRotateVal" :placeholder="$t('lg.select')">
                                <el-option
                                  v-for="item in bgeLabRotateOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="bgeColoringLi">
                        <ul class="visMenuList">
                          <li>Coloring</li>
                          <li>
                            <div class="visLable">Column</div>
                            <div class="visValue">
                              <el-color-picker v-model="bgeColumnColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Label</div>
                            <div class="visValue">
                              <el-color-picker v-model="bgeLabelColor" size="medium" class="margcolorpic"></el-color-picker>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <ul class="menuBox axesList clearfix">
                      <li class="titleLi">Axes</li>
                      <li class="yAxisLi">
                        <ul class="visMenuList">
                          <li>Y-Axis</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="bgeYAxisShow" class="margSwitch2"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Name</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="bgeYAxisName"  :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>

                        </ul>
                      </li>
                      <li class="xAxisLi">
                        <ul class="visMenuList">
                          <li>X-Axis</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="bgeXAxisShow" class="margSwitch2"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Name</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="bgeXAxisName" :placeholder="$t('lg.plzenter')" style="width:100%"></el-input>
                            </div>
                          </li>

                          <li>
                            <div class="visLable">X-Min</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="bgeXMinVal" placeholder="auto" style="width:100%"></el-input>
                            </div>
                            <div class="visLable">X-Max</div> <!-- line symbolSize  1~100数字值 点图-->
                            <div class="visValue">
                              <el-input v-model.trim="bgeXMaxVal" placeholder="auto" style="width:100%"></el-input>
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul>

                    <!-- <ul class="menuBox legendList clearfix">
                      <li class="titleLi">Legend</li>
                      <li class="bgeLegOptionsLi">
                        <ul class="visMenuList">
                          <li>Options</li>
                          <li>
                            <div class="visLable">Show</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegendShow" class="margSwitch3"></el-switch> 
                            </div>
                          </li>

                          <li>
                            <div class="visLable">Orient</div>
                            <div class="visValue">
                              <el-select v-model="bgeOrientValue" placeholder="请选择">
                                <el-option
                                  v-for="item in orientOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li>

                          <li>
                            <div class="visLable">To the right</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegToRight" class="bgeColumnColor3"></el-switch> 
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li class="bgeLegValuesLi">
                        <ul class="visMenuList">
                          <li>Values</li>
                          <li>
                            <div class="visLable">Min</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegMinShow"></el-switch> 
                            </div>
                            <div class="visLable">Max</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegMaxShow"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Avg</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegAvgShow"></el-switch> 
                            </div>
                            <div class="visLable">Total</div>
                            <div class="visValue">
                              <el-switch v-model="bgeLegTotalShow"></el-switch> 
                            </div>
                          </li>
                        </ul>
                      </li>
                    </ul> -->
                  </div>

                </el-tab-pane>
                <el-tab-pane name="table">
                  <span slot="label" class="visImgTab">
                    <i>Table</i>
                    <img src="static/fedoraCore_img/data_echarts.png" alt="" class="chartImg">
                  </span>

                  <div class="visSetting">
                    <ul class="menuBox baseList clearfix">
                      <!-- <li class="tableAttributesLi">

                        <ul class="visMenuList">
                          <li>Attributes</li>
                          <li>
                            <div class="visLable">Border</div>
                            <div class="visValue">
                              <el-switch v-model="tableBorderShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                          <li>
                            <div class="visLable">Highlight</div>
                            <div class="visValue">
                              <el-switch v-model="tableHighlightShow" class="margSwitch1"></el-switch> 
                            </div>
                          </li>
                        </ul>
                      </li> -->

                      <li class="tablePagingLi">
                        <ul class="visMenuList">
                          <li>Paging</li>
                          <li>
                            <div class="visLable">Rows per page</div>
                            <div class="visValue">
                              <el-input v-model.trim="tableRppVal" :placeholder="$t('lg.plzenter')" style="width:100%" @change="getQueryData()"></el-input>
                            </div>
                          </li>

                          <!-- <li>
                            <div class="visLable">Font size</div>
                            <div class="visValue">
                              <el-select v-model="tableFontSize" placeholder="请选择">
                                <el-option
                                  v-for="item in fontSizeOptions"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </li> -->
                        </ul>
                      </li>
                    </ul>

                    <ul class="menuBox tagList clearfix">
                      <li class="titleLi">Tag</li>
                      <li>
                        <log-refilter :ischart='true' :chartHasAggsId="isChartHasAggsId" :tableKeyArr='tableKeyArr' :dynamicTags='dynamicTags' :tableKeyArrData='tableKeyArrData' @addDynamicTags='addDynamicTags' @dropDynamicTags='dropDynamicTags'></log-refilter>
                      </li>
                    </ul>
                  </div>

                </el-tab-pane>
              </el-tabs>
              
            </el-tab-pane>
            <el-tab-pane label="General" class="tab-pane-bg">

              <el-form ref="generalform" :model="generalform" :rules="generalformRules" label-width="70px">
                <el-form-item :label="$t('lg.title')" prop='titleText'>
                  <el-input v-model.trim="generalform.titleText"  :placeholder="$t('lg.plzenter')" style="width:40%" maxlength='20'></el-input>
                </el-form-item>

                <el-form-item :label="$t('lg.subtitle')" prop='titleSubText' v-show="vzActiveName!='table'">
                  <el-input v-model.trim="generalform.titleSubText"  :placeholder="$t('lg.plzenter')" style="width:60%"  maxlength='30'></el-input>
                </el-form-item>
              </el-form>

            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import axios from 'axios';
import {SERVER_API_URL} from '@/conf/constvar';
import * as types from '@/store/types';
import client from "@/components/es/connection";
import toSddate from '@/assets/js/tosddate';
import toISO8601 from '@/assets/js/iso8601';
import {logskeys,logskeys2} from '@/assets/js/logskeys';
import logRefilter from '@/components/logs/logRefilter';

//引入图表
import graph from './chart/graph';
import singlestat from './chart/singlestat';
import pie from './chart/pie';
import barGauge from './chart/barGauge';
import logTables from "@/components/logs/logTables";
import prmoSearchStr from '@/assets/js/prmoSearch.js'//防护模式、监控模式 不同的查询条件
// import minxOption from './minxOption.js'

import {handleAccesslogData, handleWaflogData, getTarResultArrLine, getTarResultArr} from '@/assets/js/tool';

//坐标轴图 表格图 改变聚合字段 or 日志 会触发computed。所以另外用个变量接收一下
let queryFatherLog=null;
let queryAggsId=null;
let queryAggsIdTxt='all';//pie

export default {
  components:{
    graph,
    singlestat,
    pie,
    barGauge,
    // tableChart,
    logTables,
    logRefilter
  },
  computed:{//获取每种图形的option
    graphOptions(){
      // console.log(this.origDataArr)
      // if(this.origDataArr.length==0) return {} 
      // if(this.origTotalNum==0) return {}; //直接判断总数
      const _this=this;
      const aggsField=queryAggsId;//聚合
      const fatherLog=queryFatherLog;
      let xAxisData=[];
      let legendData=[];
      let seriesData=[];
      if(!aggsField){
        legendData=['all'];
        // this.origDataArr.forEach((item)=>{
       
        // const itemArr = item.time_his.buckets;
        let seriesDataArr =[];
        this.origDataArr.forEach((val,index) => {
          if(fatherLog=="access.log"){//access.log日志查询出来的时间不用减去8小时
            xAxisData.push(this.transformMyDate(val.key))
          }else{
            xAxisData.push(this.transformMyDate2(val.key))
          }
          seriesDataArr.push(val.doc_count);
        })
        if(this.optBar){
          const stackBarVal = this.optStack?'bar':null;
          seriesData.push({
            name:'all',
            type:'bar',
            stack: stackBarVal,
            data:seriesDataArr,
            large: true,
            barMaxWidth: 10,
          })
        }

        // console.log(JSON.stringify(seriesData))

        if(this.optLine){
          const stackLineVal = this.optStack?'line':null;
          seriesData.push({
            name:'all',
            type:'line',
            stack: stackLineVal,
            step:this.optStaircase,
            symbolSize:0.1,
            lineStyle:{
              width:this.lineWidthValue*10
            },
            areaStyle:{
              opacity:this.fillValue
            },
            data:seriesDataArr,

          })
        }

        if(this.optPoint){
          const stackPointVal = this.optStack?'point':null;
          seriesData.push({
            name:'all',
            type:'line',
            stack: stackPointVal,
            symbol:this.symbolValue,
            symbolSize:this.symbolSizeVal,
            lineStyle:{
              width:0
            },
            areaStyle:{
              opacity:0
            },
            data:seriesDataArr
          })
        }
      // })
      }else{
        const arrs = this.origDataArr.length? this.origDataArr[0].time_his.buckets:[];
          arrs.forEach(val => {
            xAxisData.push(this.transformMyDate(val.key))
          })
        this.origDataArr.forEach((item)=>{
          legendData.push(String(item.key));
          const itemArr = item.time_his.buckets;
          let seriesDataArr =[];

          itemArr.forEach((val,index) => {
            seriesDataArr.push(val.doc_count);
          })
          if(this.optBar){
            const stackBarVal = this.optStack?'bar':null;
           seriesData.push({
              name:item.key,
              type:'bar',
              stack: stackBarVal,
              data:seriesDataArr,
              large: true,
              barMaxWidth: 10,
            })
          }

          // console.log(JSON.stringify(seriesData))

          if(this.optLine){
            const stackLineVal = this.optStack?'line':null;
            seriesData.push({
              name:item.key,
              type:'line',
              stack: stackLineVal,
              step:this.optStaircase,
              symbolSize:0.1,
              lineStyle:{
                width:this.lineWidthValue*10
              },
              areaStyle:{
                opacity:this.fillValue
              },
              data:seriesDataArr,

            })
          }

          if(this.optPoint){
            const stackPointVal = this.optStack?'point':null;
            seriesData.push({
              name:item.key,
              type:'line',
              stack: stackPointVal,
              symbol:this.symbolValue,
              symbolSize:this.symbolSizeVal,
              lineStyle:{
                width:0
              },
              areaStyle:{
                opacity:0
              },
              data:seriesDataArr
            })
          }
        })
      }
      var options = {
        // color:['#27727b','#e87c25'],
        title: {
          text: this.generalform.titleText,
          subtext:this.generalform.titleSubText,
          x:'center',
          textStyle: {
            fontSize: '14',
            fontWeight: 'normal'
          }
        },
        grid:{
          top:'18%',
          left: '6%',
          // right: '6%',// 3% || 200
          // bottom:'10%',//10% || 65
          // containLabel: false,
        },
        tooltip : {
          showContent:this.graphTooltipShow,
          trigger: 'axis',
          axisPointer: {
            type: this.indicatorValue,
            label: {
              show: true
            }
          }
        },
        legend: {
          show:this.graphLegendShow,
          type:'scroll',
          orient:this.graphOrientValue,
          data:legendData,
          itemGap: 5,
          // height:'35',
          // top:'8%',
          // right:'2%',

          // left:'5%',
          // bottom:'0',
          formatter: function (name) {
            // console.log(this.graphLegMinShow); //undefined
            return name;
          },
        },
        brush: {
          // toolbox: ['lineX'],
          xAxisIndex: "all",
          transformable:false,
          throttleType:'debounce',
          throttleDelay: 1000,
          brushStyle:{
            borderWidth: 0,
          }
        },
        toolbox:{
          top:20,
          right:20,
          feature:{
            brush:{
              type:['lineX']
            }
          },
        },
        xAxis: {
          show:this.graphXAxisShow,
          name:this.graphXAxisName,
          nameLocation:'center',
          data : xAxisData,
        },
        yAxis: {
          type:'value',
          show:this.graphYAxisShow,
          name:this.graphYAxisName,
          min:this.graphYMinVal,
          max:this.graphYMaxVal,
          minInterval: 1,
          // boundaryGap:true
        },
        series: seriesData
      };

      if(this.graphLegendShow){

        if(this.graphLegToRight){
          options.grid.right='300';
          options.grid.bottom='10%';

          options.legend.top='15%';
          options.legend.right='20';

          options.legend.height='100%';

        }else{
          options.grid.right='3%';

          options.legend.left='3%';
          options.legend.right='3%';

          options.legend.height='12%';
          if(this.graphOrientValue=='horizontal'){
            options.grid.bottom='18%';
            options.legend.bottom='2%';
          }else{
            options.grid.bottom='22%';
            options.legend.bottom='0';
          }
        }
        
      }else{
        options.grid.right='3%';
        options.grid.bottom='10%';
      }
      
      // console.log(options)
      // console.log(legendData)
      // console.log(options)
      // console.log(options)
      return options
    },
    singlestatOptions(){
      // if(this.origTotalNum==0) return {} 
      const prefixVal=this.prefixVal;
      const postfixVal = this.postfixVal;
      var angle = [220, -40],
          splitNum = 0;
          // alertVal = 20;
      var options = {
          title: {
            text: this.generalform.titleText,
            subtext:this.generalform.titleSubText,
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          backgroundColor: this.sstBackgroundColor,
          tooltip: {
            show: false,
            formatter: "{a} <br/>{b} : {c}%"
          },
          series: [
          {
            name:this.$t('lg.zuiwaichyibiaop'),
            z: 3,
            type: "gauge",
            min: this.gaugeMinVal,
            max: this.gaugeMaxVal,
            radius: '76%',
            center: ['50%', '60%'], // 默认全局居中  
            startAngle: angle[0],
            endAngle: angle[1],
            splitNumber: splitNum + 10,
            axisLine: {
              lineStyle: {
                color: [
                  [1, "#c1c3c5"]
                ],
                width: 8
              }
            },
            axisTick: {
              // lineStyle: {
              //   color: "#fff",
              //   width: 2
              // },
              // length: 0,
              splitNumber: 1
            },
            axisLabel: {
              show:true,
              distance: -30,
              // formatter: function(v) {
                // console.log(v)
                // if (v % 1 == 0 && v != alertVal) return v;
                // else if(v==alertVal) return '22p'
              // },
              textStyle: {
                color: "#bbb"
              }
            },
            splitLine: {
              show: true,
              length: 6,
              lineStyle: {
                color: '#fff',
                width: 2
              }
            },
            itemStyle: {
              normal: {
                color: "#818488",
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10
              }
            },
            pointer: {
              show:true,
              length: '95%',
              width:5,
            },
            detail: {
              formatter: function (value) {
                let str ='{prefixStyle|' + prefixVal + '}{statStyle|' + value + '}{postfixStyle|' + postfixVal+ '}';
                return str;
              },
              rich: {
                prefixStyle: {
                  color: this.prefixColor,
                  fontSize: this.prefixFontSize
                },
                statStyle: {
                  color: this.statColor,
                  fontSize: this.statFontSize
                },
                postfixStyle: {
                  color: this.postfixColor,
                  fontSize: this.postfixFontSize
                }
              },
              offsetCenter: [0, "-14%"],//中心文字位置
            },
            data: [{
              name: "",
              value: this.origTotalNum
            }]
          },
          {
            name: this.$t('lg.neihuanyisiduanyanse'),
            type: "gauge",
            // min: 65,
            // max: 75,
            radius: '70%',
            center: ['50%', '60%'], // 默认全局居中  
            startAngle: angle[0],
            endAngle: angle[1],
            splitNumber: splitNum,
            axisLine: {
              lineStyle: {
                color: [
                  [0.186, '#6aaa39'],
                  [0.258, '#46cb18'],
                  [0.386, '#9cd072'],
                  [0.506, '#fdf100'],
                  [0.678, "#fb9902"],
                  [1, "#fd3400"]
                ],
                width: 12
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
              // length: 15,
              // lineStyle: {
              //     color: '#000',
              //     width: 2
              // }
            },
            detail: {
              show: false
            },
            // title: {
            //     show: false
            // },
            // data: [{
            //     name: "",
            //     value: ''
            // }]
          }]
        }

      if(!this.gaugeShow){
        options.series[0].startAngle= 0;
        options.series[0].endAngle= 0;
        options.series[0].axisLabel.show=false; 
        options.series[0].axisTick.splitNumber=0;
        options.series[0].pointer.show=false;
        options.series[1].startAngle= 0;
        options.series[1].endAngle= 0;
      }else{
        if(!this.interLoopShow){
          options.series[1].startAngle= 0;
          options.series[1].endAngle= 0;
        }
      }
      return options
    },
    pieOptions(){
      // if(this.origTotalNum==0) return {}; 
      var options = {
          title: {
            text: this.generalform.titleText,
            subtext:this.generalform.titleSubText,
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          color:[this.pieColorArr[0].color,this.pieColorArr[1].color,this.pieColorArr[2].color,this.pieColorArr[3].color,this.pieColorArr[4].color],
          tooltip: {
            show:this.pieTooltipShow,
            trigger: 'item',
            confine:true,
            extraCssText:'white-space:normal;word-break: break-all',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            show:this.pieLegendShow,
            type:"scroll",
            orient: this.pieOrientValue,
            // x: 'left',
            data:this.legendData,
          },
          series: {
            name:queryAggsIdTxt,
            type:'pie',
            radius: [this.radiusInnerVal, this.radiusOuterVal],
            center: ['50%', '45%'],
            avoidLabelOverlap:false,
            roseType:this.pieRoseType,
            clockwise:this.pieClockwise,//饼图的扇区是否是顺时针排布。
            label: {
              show: this.pieLabel,
              // formatter:'{b}',
              formatter:function(params){
                const str = params.data.name;               
                if(str.length>32){
                  return str.substring(0,10)+"......"+str.substring(str.length-5,str.length);
                }else{
                  return str;
                }
                // return str;
              },
              emphasis: {
                textStyle: {
                  fontSize: '14',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              show: this.pieLabel,
              smooth: 0,
              length: 25,
              length2: 15,
              emphasis: {
                lineStyle: {
                  width: '2',
                }
              }
            },
            data:this.seriesData
          }
      };

      if(this.pieRadio==1){
        options.series.radius='50%';
      }

      if(this.pieLegPositionVal=='bottom'){
        options.legend.bottom='10';
      }else if(this.pieLegPositionVal=='left'){
        options.legend.left='10';
        options.legend.top='10';
      }else{
        options.legend.right='30';
        options.legend.top='10';
      }

      if(this.pieLabValShow){
        options.series.label.formatter='{b}: {c}';
      }

      if(this.pieLabPrecentShow){
        options.series.label.formatter='{b} ({d}%)';
      }

      if(this.pieLabValShow && this.pieLabPrecentShow){
        options.series.label.formatter='{b}: {c} ({d}%)';
      }

      return options
    },
    barGaugeOptions(){
      // if(this.origTotalNum==0) return {}; 
      var options = {
          title: {
            text: this.generalform.titleText,
            subtext:this.generalform.titleSubText,
            x:'center',
            textStyle: {
              fontSize: '14',
              fontWeight: 'normal'
            }
          },
          tooltip: {
            trigger: 'axis',
            confine:true,
            axisPointer: {
              type: 'shadow'
            },
            extraCssText:'white-space:normal;word-break: break-all',
            formatter:function(params, ticket, callback){
              var str = '';
              params.forEach(item=>{
                str = item.data.name+':'+item.data.value+this.$t('lg.count')
              })
              return str;
            }
          },
          // legend: {
          //   show:this.bgeLegendShow,
          //   type:"scroll",
          //   orient: this.bgeOrientValue,
          //   data: this.legendData
          // },
          grid:{
            top:'18%',
            left: '8%',
            right:'5%',
            bottom:'4%',
            // containLabel: false,
          },
          xAxis: {
            type: 'value',
            position:'top',
            show:this.bgeXAxisShow,
            name:this.bgeXAxisName,
            min:this.bgeXMinVal,
            max:this.bgeXMaxVal,
            boundaryGap: [0,0.01],
            // splitLine:{
            //   show:false
            // },
            minInterval: 1//保持x轴刻度只为整数
          },
          yAxis: {
            show:this.bgeYAxisShow,
            name:this.bgeYAxisName,
            type: 'category',
            inverse: true,//是否是反向坐标轴 （这里反向后数据降序排列）
            data:this.yAxisData,
          },
          series:{
            type: 'bar',
            data: this.seriesData,
            label: {
              normal: {
                color:this.bgeLabelColor,
                textBorderColor:this.bgeColumnColor,
                show:this.bgeLabelShow,
                position:this.bgeLabPositionVal,
                rotate:this.bgeLabRotateVal,
                distance:this.bgeLabDistanceVal,
                formatter:function(params){
                  const str = params.data.name;               
                  if(str.length>60){
                    return str.substring(0,35)+"......"+str.substring(str.length-20,str.length);
                  }else{
                    return str;
                  }
                  // return str;
                },
              },
            },
            barMaxWidth:35,
            itemStyle:{
              color:this.bgeColumnColor
            }
          }
        };

      // if(this.bgeLegendShow){
      //   if(this.bgeLegToRight){
      //     options.grid.right='200';
      //     options.grid.bottom='10%';

      //     options.legend.top='8%';
      //     options.legend.right='2%';

      //     options.legend.height='100%';
      //   }else{
      //     options.grid.right='3%';
      //     options.grid.bottom='20%';

      //     options.legend.left='5%';
      //     options.legend.bottom='0';

      //     options.legend.height='12%';
      //     if(this.bgeOrientValue=='horizontal'){
      //       options.grid.bottom='15%';
      //     }
      //   }
      // }else{
      //   options.grid.right='3%';
      //   options.grid.bottom='10%';
      // }
      // console.log(options)
      return options
    },
    tableOptions(){
      // const fatherLog = this.queryform.logId;//不能用这个日志 改变日志会触发computed。所以另外用个变量接收一下；聚合同理
      // const aggsField=this.queryform.aggsId;
      const fatherLog=queryFatherLog;//日志
      const aggsField=queryAggsId;//聚合

      let tabodyData=[],totalNum=0;
      
      totalNum=this.origTotalNum;//获取总数，用于计算分页
      // console.log(this.origDataArr)
      // console.log(this.editKey,this.editLogId)
      if(!aggsField){
        if(fatherLog=='access.log'){
          if(localStorage.lang=="en"){
              this.tableKeyArr=[...logskeys2.access];
            if(!this.editKey) this.dynamicTags = [...logskeys2.access];
          }else{
            this.tableKeyArr=[...logskeys.access];
            if(!this.editKey) this.dynamicTags = [...logskeys.access];
          }
          
          
          // 获取access.log表体数据
          tabodyData = handleAccesslogData(this.origDataArr);
        }else{
          if(localStorage.lang=="en"){
this.tableKeyArr=[...logskeys2.waf];
          if(!this.editKey) this.dynamicTags = [...logskeys2.waf];
          }else{
            this.tableKeyArr=[...logskeys.waf];
          if(!this.editKey) this.dynamicTags = [...logskeys.waf];
          }
          

          // 获取waf.log表体数据
          tabodyData = handleWaflogData(this.origDataArr);
        }
      }else{
         const tableKey=[
          {
            propName:'key',
            colWidth:'100',
            "field":"spkey",
            "zh":"key",
          },
          {
            propName:'value',
            colWidth:'200',
            "field":"spvalue",
            "zh":"value",
          }
        ];
        this.tableKeyArr=[...tableKey];
        this.dynamicTags=[...tableKey];
        
        this.origDataArr.forEach(val => {
          tabodyData.push({
            key:val.key,
            value:val.doc_count
          })
        })
      }
      return {
        tabodyData,
        totalNum
     }
    },
    tableKeyArrData(){//refilter组件下拉框剩余能添加的字段
      var _this= this;
      if(!this.dynamicTags.length) return this.tableKeyArr;

      //else
      const arr = this.tableKeyArr.filter(item=>{
        const obj = _this.dynamicTags.find(el=>{
          return el.field.includes(item.field) && el
        })
        // console.log(obj)
        if(!obj){
          return item
        } 
      })
      return arr
    }
  },
  // minixs:[minxOption],
  data() {
    return {
      showLoading:false,//单个图表loading
      fromTime:0,//右上角时间
      endTime:0,
      // timeinterval:'',

      gobackPath:'/customChartGridLayout',//保存 返回路径

      isShowChartMenu:false,//图表的下拉菜单显隐

    // Query
      aggsIdTxt:'',//当前查询聚合字段的中文
      queryform:{
        logarr:['access.log','waf.log'],
        logId:'access.log',

        accessType:'protectChart',

        //聚合
        aggsId:'',
        keyarr:[],//对应日志的字段

        //查询（过滤条件）
        tmpsArray:[
          {
            keyId:'',
            queryTypes:'',//判断keyId是keyworld类型还是long类型，long类型时，运算符只能为equals并且对应的查询内容只能是数字
            symbolId:'',
            keyinputId:'',
            andorId:'',
            symbolOpt:[],
          }
        ],
        andor:[
          {
            value:'AND',
            label:'and'
          },{
            value:'OR',
            label:'or'
          }
        ],

        //度量
        metricId:this.$t('lg.quantity'),
        metrics:[this.$t('lg.quantity')],
        symbol2Id:'>',
        symbol2Opt:[
          {
            value:'>',
            label:'>'
          }
        ],
        metricinputId:1,

       //size
        sizeValue:5,
        sizeValueOpt:[
          {
            value:3,
            label:'Top3'
          },
          {
            value:5,
            label:'Top5'
          },
          {
            value:10,
            label:'Top10'
          }
        ],

      },
      queryformRules:{
        aggsId:[
          // {required: true,message:this.$t('lg.required'), trigger:'change'}
        ],
        metricinputId:[
          // {pattern:/^[1-9]\d*$/,message:this.$t('lg.requirepositive'),trigger:'change'}
          {required: true,message:this.$t('lg.required'), trigger:'change'}
        ]
      },
      keyinputIdRules:[
        // {required: true,message: this.$t('lg.required'), trigger:'blur'}
      ],
      keyinputIdRulesNum:[
        // {required: true,message: this.$t('lg.required'), trigger:'blur'},
        {pattern:/^[0-9]+$/,message: this.$t('lg.number'), trigger:'change'}
      ],

    //Visualization
      vzActiveName:'graph',
    //graph
     //Draw Modes
      optBar:true,
      optLine:false,
      optPoint:false,
      optStack:false,

      fill_widthOptions:[{//表示线宽时，value*10
        value: '0',
        label: '0'
      },{
        value: '.1',
        label: '1'
      },{
        value: '.2',
        label: '2'
      },{
        value: '.3',
        label: '3'
      },{
        value: '.4',
        label: '4'
      },{
        value: '.5',
        label: '5'
      },{
        value: '.6',
        label: '6'
      },{
        value: '.7',
        label: '7'
      },{
        value: '.8',
        label: '8'
      },{
        value: '.9',
        label: '9'
      },{
        value: '1',
        label: '10'
      }],
      fillValue:'.1',
      lineWidthValue:'.2',

      symbolOptions:[{
        value: 'circle',
        label: 'circle'
      },{
        value: 'rect',
        label: 'rect'
      },{
        value: 'triangle',
        label: 'triangle'
      }],
      symbolValue:'circle',
      symbolSizeVal:10,

      optStaircase:false,

      graphTooltipShow:true,

      indicatorOptions:[{
        value: 'line',
        label: 'line'
      },{
        value: 'shadow',
        label: 'shadow'
      },{
        value: 'cross',
        label: 'cross'
      }],
      indicatorValue:'shadow',

     //Axes
      graphYAxisShow:true,
      graphYAxisName:'',
      graphYMinVal:null,
      graphYMaxVal:null,

      graphXAxisShow:true,
      graphXAxisName:'',
    
     //legend
      graphLegendShow:true,
      orientOptions:[{
        value: 'horizontal',
        label: 'horizontal',
        disabled: false
      },{
        value: 'vertical',
        label: 'vertical'
      }],
      graphOrientValue:'horizontal',
      graphLegToRight:false,

      // graphLegMinShow:false,
      // graphLegMaxShow:false,
      // graphLegAvgShow:false,
      // graphLegTotalShow:false,
    //singlestat
     //Value
      statOptions:[
      // {
      //   value: 'min',
      //   label: 'Min'
      // },{
      //   value: 'max',
      //   label: 'Max'
      // },{
      //   value: 'average',
      //   label: 'Average'
      // },
      {
        value: 'total',
        label: 'Total'
      }],
      statValue:'total',

      prefixVal:'',
      postfixVal:'',

      fontSizeOptions:[{
        value: 16,
        label: '16px'
      },{
        value: 18,
        label: '18px'
      },{
        value: 22,
        label: '22px'
      },{
        value: 32,
        label: '32px'
      },{
        value: 48,
        label: '48px'
      },{
        value: 60,
        label: '60px'
      },{
        value: 72,
        label: '72px'
      },{
        value: 98,
        label: '98px'
      },],

      statFontSize:'48',
      prefixFontSize:'22',
      postfixFontSize:'16',

      //Coloring
      sstBackgroundColor:'#f7f7f7',
      statColor:'#516b91',
      prefixColor:'#333',
      postfixColor:'#333',

      //Gauge
      gaugeShow:false,
      gaugeMinVal:0,
      gaugeMaxVal:100,
      interLoopShow:true,

    //pie
     //Draw Modes
      pieRadio:'1',
      pieClockwise:true,
      pieRoseType:false,
      pieLabel:false,
      pieLabValShow:false,
      pieLabPrecentShow:false,
      radiusOptions:[{
        value: '10%',
        label: '10%'
      },{
        value: '20%',
        label: '20%'
      },{
        value: '30%',
        label: '30%'
      },{
        value: '40%',
        label: '40%'
      },{
        value: '50%',
        label: '50%'
      },{
        value: '60%',
        label: '60%'
      },{
        value: '70%',
        label: '70%'
      },{
        value: '80%',
        label: '80%'
      },{
        value: '90%',
        label: '90%'
      }],
      radiusInnerVal:'40%',
      radiusOuterVal:'50%',
      pieTooltipShow:true,

      pieColorArr:[
        {
          label:'item1',
          color:'#4ea397',
        },
        {
          label:'item2',
          color:'#fcce10',
        },
        {
          label:'item3',
          color:'#e87c25',
        },
        {
          label:'item4',
          color:'#b5c334',
        },
        {
          label:'item5',
          color:'#60c0dd',
        },
        
      ],

     //legend
      pieLegendShow:true,
      pieOrientValue:'horizontal',
      legPositionOptions:[{
        value: 'left',
        label: 'To the left'
      },{
        value: 'right',
        label: 'To the right'
      },{
        value: 'bottom',
        label: 'To the buttom'
      }],
      pieLegPositionVal:'bottom',
    
    //barGauge
     //Label Option
      bgeLabelShow:true,
      bgeLabPositionOptions:[{
        value: 'left',
        label: 'Left'
      },{
        value: 'insideLeft',
        label: 'Inside Left'
      },{
        value: 'inside',
        label: 'Inside'
      },{
        value: 'insideRight',
        label: 'Inside Right'
      },{
        value: 'right',
        label: 'right'
      }],
      bgeLabPositionVal:'insideLeft',

      bgeLabRotateOptions:[{
        value: 90,
        label: '90'
      },{
        value: 60,
        label: '60'
      },{
        value: 45,
        label: '45'
      },{
        value: 30,
        label: '30'
      },{
        value: 0,
        label: '0'
      },{
        value: -30,
        label: '-30'
      },{
        value: -45,
        label: '-45'
      },{
        value: -60,
        label: '-60'
      },{
        value: -90,
        label: '-90'
      }],
      bgeLabRotateVal:0,
      
      bgeLabDistanceOptions:[
      {
        value: -50,
        label: '-50'
      },{
        value: -40,
        label: '-40'
      },{
        value: -30,
        label: '-30'
      },{
        value: -20,
        label: '-20'
      },{
        value: -10,
        label: '-10'
      },
      {
        value: 0,
        label: '0'
      },{
        value: 10,
        label: '10'
      },
      {
        value: 20,
        label: '20'
      },{
        value: 30,
        label: '30'
      },{
        value: 40,
        label: '40'
      },{
        value: 50,
        label: '50'
      }],
      bgeLabDistanceVal:10,

      bgeColumnColor:'#E89C0F',
      bgeLabelColor:'#fff',

     //Axes
      bgeYAxisShow:true,
      bgeYAxisName:'',

      bgeXAxisShow:true,
      bgeXAxisName:'',
      bgeXMinVal:null,
      bgeXMaxVal:null,
      
     //lenged
      // bgeLegendShow:true,
      // bgeOrientValue:'vertical',
      // bgeLegToRight:false,

      // bgeLegMinShow:false,
      // bgeLegMaxShow:false,
      // bgeLegAvgShow:false,
      // bgeLegTotalShow:false,
    
    //table
     //Attributes
      // tableBorderShow:true,
      // tableHighlightShow:false,
      tableRppVal:10,
      // tableFontSize:'',

      tableKeyArr:[],//表格总共应该显示的列
      dynamicTags:[],//用户自定义显示的列

    // General     
      generalform:{
        titleText:this.$t('lg.chart1'),
        titleSubText:''
      },
      generalformRules:{
        titleText:[
          // {required: true, message: this.$t('lg.required'), trigger: 'change'}
        ]
      },

    //start-- 数据储存 //接收保存查询返回的原始数据,（切换图表时对这个原始数据进行处理，使之转变为对应图形的数据结构）
      elasticObj:{},//存储当前要存入图表的查询语句
      origDataArr:[],//es 查询返回的具体数据
      origTotalNum:0,//es 查询返回的数据总数量 聚合的总量是根据每一项计算的，非聚合则直接取res.hits.total
    //end

    //
      legendData:[],
      xAxisData:[],
      yAxisData:[],
      seriesData:[],

      // tabheadData:[],
      // tabodyData:[],
      // totalNum:0,

      //编辑图表
      editKey:this.$route.query.key?this.$route.query.key:'',
      boxSize:this.$route.query.size ? JSON.parse(this.$route.query.size) :{},
      editLogId:this.$route.query.myLog?this.$route.query.myLog:'',//记录当前被编辑的图表的日志来源，编辑‘表格’切换日志时需要做对比

      isChartHasAggsId:false,//判断当前表格是否用到聚合条件，如果用到聚合条件则logRefilter子组件里的closable设置为false（为false则表示表格不可调整tag标签）
      
    }
  },
  watch:{
    "queryform.tmpsArray.length":function(){//查询条件与查询条件之间的关系，默认OR
      if(this.queryform.tmpsArray.length>1){
        var tLength=this.queryform.tmpsArray.length-2;
        if(this.queryform.tmpsArray[tLength].andorId==''){
          this.queryform.tmpsArray[tLength].andorId='OR';
        }
      }else if(this.queryform.tmpsArray.length==1){
        this.queryform.tmpsArray[0].andorId='';
      }
    },
    '$store.state.mydatedata.timestampnow':function(newData){//右上角时间改变要重新请求图表数据
      // console.log(newData)
      this.getQueryData();
    },
  },
  beforeRouteLeave (to, from, next) {
    // console.log(to,from);
    // next(false);
    var _this = this;
    if(_this.showLoading){
      return false
    }
    _this.$confirm(this.$t('lg.confirm22'), this.$t('lg.tip'), {
      confirmButtonText: this.$t('lg.save'),
      cancelButtonText: this.$t('lg.cancel'),
      type: 'warning'
    }).then(() => {
      _this.addOrEditEnSure(_this.vzActiveName,next,_this.editKey);
    }).catch(() => {
      next();
    });
  },
  mounted() {
    queryFatherLog=null;
    queryAggsId=null;
    queryAggsIdTxt='all';

    if(this.editKey){//获取当前被编辑的图表的后台数据 查询特定Key的存储数据接口
      this.$store.state.contentLoading = true;
      const url = SERVER_API_URL + 'pe/shadow/kv/'+this.editKey;
      axios.get(url).then(res=>{
        console.log(res);
        if(res.data.responseCode==0){
          const data = res.data.data.value.data;
          for(var i in data){
            this[i]=data[i];
          }
          this.getQueryData(null,true);//以右上角的时间为准，利用当前编辑图表的请求语句重新请求一遍
         //.start这里又请求了一遍数据，路由上的值会被请求回来的数据覆盖，所以要重新赋值.start
          this.editKey=this.$route.query.key?this.$route.query.key:'';//区分编辑跟新增
          this.editLogId=this.$route.query.myLog?this.$route.query.myLog:'';//用于table
          this.boxSize=this.$route.query.size ? JSON.parse(this.$route.query.size) :{};//保存编辑之前的当前图表的栅格盒子尺寸
         //.end
        }
        this.$store.state.contentLoading = false;
      }).catch((err) => {
        console.log(err)
      });
    }else{
      this.getQueryData();
    }

    this.dragControllerDiv();
    this.getKeyarr();
    
  },
  methods: {
   //start-- 不同的图表类型其要求的最终数据结构是不同的，这里封装了把es查询返回的原始数据处理成不同数据结构的方法(有的图表类型处理数据的方法直接写在computed里其对应返回options里面，其中坐标轴图graph，因为样式改变涉及到数据结构，而样式改变又得通过computed及时渲染到页面，所以处理graph图表的数据时不能在这里单独封装另外的方法，只能写到computed里)
   // opitongGraphData(){//处理坐标图 graph的数据
    //   const aggsField=this.queryform.aggsId;//聚合
    //   const fatherLog = this.$route.query.sourceLog;
    //   this.xAxisData=[];
    //   this.legendData=[];
    //   this.seriesData=[];
    //   if(aggsField==='all'){
    //     this.legendData=['all'];
    //     // this.origDataArr.forEach((item)=>{
       
    //     // const itemArr = item.time_his.buckets;
    //     let seriesDataArr =[];

    //     this.origDataArr.forEach(val => {
    //       if(fatherLog=="access.log"){//access.log日志查询出来的时间不用减去8小时
    //         this.xAxisData.push(this.transformMyDate(val.key))
    //       }else{
    //         this.xAxisData.push(this.transformMyDate2(val.key))
    //       }
          
    //       seriesDataArr.push(val.doc_count);

    //     })
    //     if(this.optBar){
    //       const stackBarVal = this.optStack?'bar':null;
    //       this.seriesData.push({
    //         name:'all',
    //         type:'bar',
    //         stack: stackBarVal,
    //         data:seriesDataArr,
    //         large: true,
    //         barMaxWidth: 10,
    //       })
    //     }

    //     // console.log(JSON.stringify(seriesData))

    //     if(this.optLine){
    //       const stackLineVal = this.optStack?'line':null;
    //       this.seriesData.push({
    //         name:'all',
    //         type:'line',
    //         stack: stackLineVal,
    //         step:this.optStaircase,
    //         symbolSize:0.1,
    //         lineStyle:{
    //           width:this.lineWidthValue*10
    //         },
    //         areaStyle:{
    //           opacity:this.fillValue
    //         },
    //         data:seriesDataArr,

    //       })
    //     }

    //     if(this.optPoint){
    //       const stackPointVal = this.optStack?'point':null;
    //       this.seriesData.push({
    //         name:'all',
    //         type:'line',
    //         stack: stackPointVal,
    //         symbol:this.symbolValue,
    //         symbolSize:this.symbolSizeVal,
    //         lineStyle:{
    //           width:0
    //         },
    //         areaStyle:{
    //           opacity:0
    //         },
    //         data:seriesDataArr
    //       })
    //     }
    //   // })
    //   }else{
    //     this.origDataArr.forEach((item)=>{
    //       this.legendData.push(String(item.key));
    //       const itemArr = item.time_his.buckets;
    //       let seriesDataArr =[];

    //       itemArr.forEach(val => {

    //         if(fatherLog=="access.log"){//access.log日志查询出来的时间不用减去8小时
    //           this.xAxisData.push(this.transformMyDate(val.key))
    //         }else{
    //           this.xAxisData.push(this.transformMyDate2(val.key))
    //         }
            
    //         seriesDataArr.push(val.doc_count);

    //       })
    //       if(this.optBar){
    //         const stackBarVal = this.optStack?'bar':null;
    //         this.seriesData.push({
    //           name:item.key,
    //           type:'bar',
    //           stack: stackBarVal,
    //           data:seriesDataArr,
    //           large: true,
    //           barMaxWidth: 10,
    //         })
    //       }

    //       // console.log(JSON.stringify(seriesData))

    //       if(this.optLine){
    //         const stackLineVal = this.optStack?'line':null;
    //         this.seriesData.push({
    //           name:item.key,
    //           type:'line',
    //           stack: stackLineVal,
    //           step:this.optStaircase,
    //           symbolSize:0.1,
    //           lineStyle:{
    //             width:this.lineWidthValue*10
    //           },
    //           areaStyle:{
    //             opacity:this.fillValue
    //           },
    //           data:seriesDataArr,

    //         })
    //       }

    //       if(this.optPoint){
    //         const stackPointVal = this.optStack?'point':null;
    //         this.seriesData.push({
    //           name:item.key,
    //           type:'line',
    //           stack: stackPointVal,
    //           symbol:this.symbolValue,
    //           symbolSize:this.symbolSizeVal,
    //           lineStyle:{
    //             width:0
    //           },
    //           areaStyle:{
    //             opacity:0
    //           },
    //           data:seriesDataArr
    //         })
    //       }
    //     })
    //   }
   // },
    opitongPieData(){//处理饼图 pie的数据
      const aggsField=this.queryform.aggsId;//聚合
      this.legendData=[];
      this.seriesData=[];
      if(!aggsField){
        this.legendData=['all'];
        this.seriesData.push({
          name:'all',
          value:this.origTotalNum
        })
      }else{
        this.origDataArr.forEach(val => {
          this.legendData.push(val.key);
          this.seriesData.push({
            name:val.key,
            value:val.doc_count,
            keyCode:val.codeList
          })
        })
      }
    },
    opitongbarGaugeData(){//处理 排序图 barGauge的数据
      const aggsField=this.queryform.aggsId;//聚合
      this.yAxisData=[];
      this.seriesData=[];
      if(!aggsField){
        this.yAxisData=['Top1'];
        this.seriesData=[{
          name:'all',
          value:this.origTotalNum
        }]
      }else{
        this.origDataArr.forEach(val => {
          this.seriesData.push({
            name:val.key,
            value:val.doc_count,
            keyCode:val.codeList
          })
        })
        for(var i=0;i<this.origDataArr.length;i++){
          this.yAxisData.push(`Top${i+1}`)
        }
      }
    },
   //  opitongTableData(){//处理 表格数据
    //     console.log(this.origDataArr);

    //     const aggsField=this.queryform.aggsId;//聚合
    //     this.tabheadData=[];
    //     this.tabodyData=[];
    //     this.totalNum=0;

    //     if(aggsField==='all'){
    //       this.tabodyData.push({
    //         key:'all',
    //         value:this.origDataArr
    //       })
    //     }else{
    //       this.origDataArr.forEach(val => {
    //          this.tabodyData.push({
    //            key:val.key,
    //            value:val.doc_count
    //          })
    //       })
    //     }
   //  },
   //end

    dragControllerDiv: function () { //上下量部分拉动功能
      const cpResize = this.$refs.cpResize;
      const cpTop = this.$refs.cpTop;
      const cpDown = this.$refs.cpDown;
      const cpContainer = this.$refs.cpContainer;
      cpResize.onmousedown = function (e) {
        console.log(e)
        var startY = e.clientY
        cpResize.top = cpResize.offsetTop
        document.onmousemove = function (e) {
          var endY = e.clientY
          var moveLen = cpResize.top + (endY - startY)
          var maxT = cpContainer.clientHeight - cpResize.offsetHeight
          if (moveLen < 60) moveLen = 60;
          if (moveLen > maxT - 60) moveLen = maxT - 60;
          // cpResize.style.top = moveLen;
          cpTop.style.height = moveLen + 'px';
          // cpDown.style.height = (cpContainer.clientHeight - moveLen - 5) + "px";
          // if (moveLen > 1000)cpTop.style.height = '1000px';
          // if (moveLen < 200)cpTop.style.height = '200px'
        }
        document.onmouseup = function (evt) {
          document.onmousemove = null
          document.onmouseup = null
          // cpResize.releaseCapture && cpResize.releaseCapture();
        }
        // cpResize.setCapture && cpResize.setCapture();
        return false
      }
    },
    getKeyarr(){//获取对应日志的查询字段
      //切换时清空
      this.queryform.accessType='protectChart';
      this.queryform.aggsId='';
      this.queryform.tmpsArray=[
        {
          keyId:'',
          queryTypes:'',//判断keyId是keyworld类型还是long类型，long类型时，运算符只能为equals并且对应的查询内容只能是数字
          symbolId:'',
          keyinputId:'',
          andorId:'',
          symbolOpt:[],
        }
      ];
      this.queryform.metricinputId=1;
      this.queryform.sizeValue=5;
      //end

      var fatherLog = this.queryform.logId;
      if(fatherLog=='access.log'){
        if(localStorage.lang=="en"){
          this.queryform.keyarr=[...logskeys2.access];
        }else{
this.queryform.keyarr=[...logskeys.access];
        }
        
      }else if(fatherLog=='waf.log'){
        if(localStorage.lang=="en"){
this.queryform.keyarr=[...logskeys2.waf];
        }else{
          this.queryform.keyarr=[...logskeys.waf];
        }
        
      }
    },
    changeAggsId(val){//获取聚合字段的中文字符 用于pie图
      const arr = this.queryform.keyarr.filter((item)=>{
        if(val){
          return val==item.field;
        }
      })
      this.aggsIdTxt=val?arr[0].zh:'all';
    },
    queryType(val,i){//判断是keyworld类型还是long类型，long类型时，运算符只能为equals并且对应的查询内容只能是数字
      const keyarr = this.queryform.keyarr;
      this.queryform.tmpsArray[i].symbolId='';//清空
      let queryTypes='';
      keyarr.forEach(function(v){
        if(v.field==val){
          queryTypes=v.type;
        }
      })
      if(queryTypes=='long'){
        this.queryform.tmpsArray[i].symbolOpt=[{
          value:'gt',
          label:this.$t('lg.dayu1')
        },{
          value:'lt',
          label:this.$t('lg.xiaoyu1')
        },{
          value:'equals',
          label:this.$t('lg.dengyu')
        }]
      }else{
        this.queryform.tmpsArray[i].symbolOpt=[{
          value:'equals',
          label:this.$t('lg.dengyu')
        },{
          value:'contains',
          label:this.$t('lg.contain')
        }]
      }
      this.queryform.tmpsArray[i].queryTypes=queryTypes;
    },
    addQuery(){//增加一个查询条件
      this.queryform.tmpsArray.push({
        keyId: '',
        symbolId:'',
        keyinputId:'',
        andorId:'',
        symbolOpt:[]
      });
    },
    delTmp(index){//删除一个查询条件，并至少保留一个查询条件
      if(this.queryform.tmpsArray.length>1){
        this.queryform.tmpsArray.splice(index,1);
      }
    },
    handleTime(){//处理右上角时间格式，用于es查询
      var _this=this;
      var fatherLog = _this.queryform.logId;
      var sttime=_this.$store.state.mydatedata.starttime,
          edtime=_this.$store.state.mydatedata.endtime;

      var fromTime2,endTime2,fromTime,endTime;
      if(fatherLog=="access.log"){//access.log日志查询的时间要减去8小时
        fromTime2=toISO8601(sttime);
        endTime2=toISO8601(edtime);
        fromTime=fromTime2 || toISO8601(new Date(Date.now()-_this.$store.state.dateTimeLong));
        endTime=endTime2 || toISO8601(new Date());  
      }else{
        fromTime2=toSddate(sttime);
        endTime2=toSddate(edtime);
        fromTime=fromTime2 || toSddate(new Date(Date.now()-_this.$store.state.dateTimeLong));
        endTime=endTime2 || toSddate(new Date()); 
      }

      _this.fromTime=fromTime;
      _this.endTime=endTime;
      
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
    getSearchObj(searchObj,pageObj){//根据不同情况获取不同的查询语句。日志不同、想画的图表不同都会影响查询语句
      // console.log(searchObj)
      // console.log(pageObj)
      var _this=this;
      var aggsField=_this.queryform.aggsId;//聚合
      var setTimeInterval=_this.$store.state.mydatedata.interval || '5m';//当查询用到聚合时会生成图表，图表会受到采样频率影响显示
      if(_this.vzActiveName=='graph'){
        if(!aggsField){
          searchObj.body.aggs.GroupByMe= {
            "date_histogram": {
              "field": "@timestamp",
              "interval": setTimeInterval,
              "min_doc_count": 0,
              "extended_bounds": {
                "min": _this.fromTime,
                "max": _this.endTime,
						  }
            }
          }
        }else{
          if(aggsField=='shadow.access.error_code'){//动态过滤码字段要特殊处理//三重聚合（聚合字段本身+shadow.access.response_code聚合+时间聚合）
            searchObj.body.aggs.GroupByMe.aggs={
              "groupbyresp": {
                "terms": {
                  "field": "shadow.access.response_code",
                  "size": 10
                },
                aggs:{
                  "time_his": {
                    "date_histogram": {
                      "field": "@timestamp",
                      "interval": setTimeInterval,
                      "min_doc_count": 0,
                      "extended_bounds": {
                        "min": _this.fromTime,
                        "max": _this.endTime,
                      }
                    }
                  }
                }
              }
            }
          }else{
            searchObj.body.aggs.GroupByMe.aggs={//双重聚合(聚合字段本身+时间聚合)
              "time_his": {
                "date_histogram": {
                "field": "@timestamp",
                "interval": setTimeInterval,
                "min_doc_count": 0,
                "extended_bounds": {
                  "min": _this.fromTime,
                  "max": _this.endTime,
                }
                }
              }
            }
          }
        }
      }else if(_this.vzActiveName=='singlestat'){
        // console.log(_this.statValue);
        //先只画总值的图，最大值最小值以后加
      }else if(_this.vzActiveName=='pie'){
        if(aggsField=='shadow.access.error_code'){//动态过滤码字段要特殊处理//双重聚合（聚合字段本身+shadow.access.response_code聚合）
          searchObj.body.aggs.GroupByMe.aggs={
            "groupbyresp": {
              "terms": {
                "field": "shadow.access.response_code",
                "size": 10
              }
            }
          }
        }
      }else if(_this.vzActiveName=='barGauge'){
        if(aggsField=='shadow.access.error_code'){//动态过滤码字段要特殊处理//双重聚合（聚合字段本身+shadow.access.response_code聚合）
          searchObj.body.aggs.GroupByMe.aggs={
            "groupbyresp": {
              "terms": {
                "field": "shadow.access.response_code",
                "size": 10
              }
            }
          }
        }
      }else if(_this.vzActiveName=='table'){
        if(aggsField=='shadow.access.error_code'){//动态过滤码字段要特殊处理//双重聚合（聚合字段本身+shadow.access.response_code聚合）
          searchObj.body.aggs.GroupByMe.aggs={
            "groupbyresp": {
              "terms": {
                "field": "shadow.access.response_code",
                "size": 10
              }
            }
          }
        }
       
        var fromNum = 0, sizeNum = 0;//获取页面参数
        fromNum = (pageObj.curPage - 1) * pageObj.pageNum;
        sizeNum = pageObj.pageNum;

        searchObj.from=fromNum;
        searchObj.size=sizeNum;
        searchObj.body.sort={
          "@timestamp": "desc"
        }
      }
      return searchObj;
    },
    getQueryData(pageObj,isEdit){//在query里面点击确定时：获取画图数据,并把拿到的数据保存起来 //为表格时，才有pageObj
      // console.log(this.queryform.metricinputId)
      this.$refs['queryform'].validate((valid)=>{
        if(valid){
          var _this=this;
          if(!isEdit){//编辑图表。第一次进入当前组件时，不显示单独加载图表loading
            _this.showLoading=true;
          }
          let mypageObj={curPage: 1,pageNum: _this.tableRppVal-0};//为表格时，要有分页功能
          if(pageObj){
            mypageObj=pageObj;
          }
          // console.log(pageObj)

          _this.handleTime();//获取右上角时间

          // console.log(_this.$route)
          var fatherLog = _this.queryform.logId;

          queryFatherLog=fatherLog;//记录这次查询的日志来源
          queryAggsId=_this.queryform.aggsId;//记录这次查询用到的聚合条件
          queryAggsIdTxt=_this.aggsIdTxt?_this.aggsIdTxt:'all';//记录这次查询聚合条件的中文 用于 pie图

          this.isChartHasAggsId = queryAggsId?false:true;// 表格是否可以调整tag标签

          var getLogId=fatherLog=="waf.log"?"shadow_"+fatherLog:fatherLog;
          var getLogIdStr=`/usr/local/shadow/logs/${getLogId}`;

          var myQueryJson={
              "must": [
                {
                  "term": {
                    "log.file.path": getLogIdStr
                  }
                },
                {
                  "range": {
                    "@timestamp": {
                      "from":_this.fromTime,
                      "to":_this.endTime,
                      "include_lower": true,
                      "include_upper": true
                    }
                  }
                },
                {
                  "bool":{
                    should:[],
                    "minimum_should_match": 1,
                    "must": [
                      {
                        "bool": {
                          "should": [], //OR
                          "minimum_should_match": 1
                        }
                      },
                      //AND
                    ]
                  }
                }
              ],
            };
          
          //根据不同的日志，先预设一些查询条件。如果用户更改这些预设条件，可能会导致冲突而查询不出来数据（主要针对access.log）
          if(fatherLog=="access.log"){
            myQueryJson.must.push({
              "exists": {
                "field": "shadow.access.method"
              }
            });

            const myAccessType=_this.queryform.accessType;//默认的基础查询语句根据选择不同的模式而定 
            // if(myAccessType=='protectChart'){//防护模式
            //   //.start 这里已经规定 动态过滤码>0并且响应码=400，或者响应码为 404 or 405 or 444
            //   myQueryJson.must.push(...prmoSearchStr['protectChart']['a1'])
            //   //.end
            // }else{//监控模式 monitorChart
            //   //.start 这里已经规定 动态过滤码>0,响应码为200
            //   myQueryJson.must.push(
            //     {
            //       "bool":{
            //         "must": [
            //           ...prmoSearchStr['monitorChart']['a1']
            //         ]
            //       }
            //     }
            //   )
            //   //.end
            // }
          }else{
            myQueryJson.must_not={//过滤掉格式错误的数据 适用于waf.log 以及error.log
              "exists": {
                "field": "error"
              }
            }
          }
          //end

          const tmpsArray = _this.queryform.tmpsArray.filter(item=>{ //获取所有完整查询（过滤）条件
            return item.keyId && item.symbolId && item.keyinputId
          })
          // console.log(tmpsArray)
          var sumaryArrLen=tmpsArray.length;
          let andorIdI;
          for(let i=0;i<sumaryArrLen;i++){
            var keyId=tmpsArray[i].keyId;
            var symbolIdI=tmpsArray[i].symbolId;
            var keyinputId=tmpsArray[i].keyinputId.replace(":","\\:");
            if(i==0){//下一条查询条件是根据上一条查询条件后面接的AND/OR来决定相关关系的。（第一条查询条件和第二条查询条件之间的关系由第一条查询条件后面的AND/OR决定）
              var andorIdI=tmpsArray[i].andorId;
            }else{
              var andorIdI=tmpsArray[i-1].andorId;
            }

            var filterStr ={};//组合过滤条件 ==> "keyId:(> || < || = || 包含) keyinputId"
            if(symbolIdI=="contains"){//包含
              filterStr={
                "query": keyId+':'+ `*${keyinputId}*`
              }
            }else if(symbolIdI=="equals"){//等于
              filterStr={
                "query": keyId +':'+ keyinputId
              }
            }else if(symbolIdI=="gt"){//大于
              filterStr={
                "query": keyId +':>'+ keyinputId
              }
            }else if(symbolIdI=="lt"){//小于
              filterStr={
                "query": keyId +':<'+ keyinputId 
              }
            }
           
            if(andorIdI=="OR"){
              // myQueryJson.must.push({
              //   "query_string":filterStr
              // });

              myQueryJson.must[2].bool.must[0].bool.should.push({
                "query_string":filterStr
              })
            }else{
              // let shouldObj = myQueryJson.must.find(item=>{
              //   console.log(item)
              //   return item.bool
              // });
              // shouldObj.bool.should.push({
              //   "query_string":filterStr
              // })

              myQueryJson.must[2].bool.must.push({
                "query_string":filterStr
              })
            }
          }
          // console.log(myQueryJson)

          var aggsField=_this.queryform.aggsId;//聚合
          var aggsObj={};
          if(aggsField){//如果有聚合字段
            aggsObj={
              "GroupByMe": {
                "terms": {
                  "field": aggsField,
                  "min_doc_count": _this.queryform.metricinputId,//数量
                  "size": _this.queryform.sizeValue//size
                }
              }
            }
          }
          ///////////////////////////////////

      _this.getUserDm().then((reslovedata)=>{
          // if(sessionStorage.getItem("myRoles")=="ADMIN"){
          //   mustOptions.shift();
          // }
          let ri;
          for(let i=0;i<reslovedata.length;i++){
            ri=reslovedata[i];
            myQueryJson.must[2].bool.should.push(
              {
                "match":{
                  "shadow.access.http_host":ri
                }
              }
            )
          }



          var searchObj = {
                index:"shadow-filebeat*",
                body:{
                  "size": 0,
                  "query": {
                    "bool": myQueryJson
                  },
                  "aggs": aggsObj
                }
              }
        
          var elasticObj=this.getSearchObj(searchObj,mypageObj);
          // console.log(JSON.stringify(elasticObj))
          this.elasticObj=JSON.stringify(elasticObj);
        
          client.search(elasticObj).then((res)=>{
            // console.log(res);
            _this.origDataArr=[];//清空
            _this.origTotalNum=0;
            const aggsField=this.queryform.aggsId;//聚合

            let tarResult =[];
            let tarResultNum=0;
            if(_this.vzActiveName=='graph'){
              // if(!aggsField){
                tarResult = res.aggregations.GroupByMe.buckets;
                tarResultNum=_this.countTotalNum(tarResult);
              // }else{
                // tarResult = res.aggregations.GroupByMe.buckets;
              // }
              _this.origTotalNum=tarResultNum;
              _this.origDataArr=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArrLine(tarResult,1):tarResult;
              // _this.opitongGraphData();
            }else if(_this.vzActiveName=='singlestat'){
              if(!aggsField){
                tarResult=[];
                tarResultNum=res.hits.total.value;
              }else{
                tarResult=res.aggregations.GroupByMe.buckets;
                tarResultNum=_this.countTotalNum(tarResult);
              }
              _this.origTotalNum=tarResultNum;
              // _this.origDataArr=tarResult;//改图现在只支持显示总数量
            }else if(_this.vzActiveName=='pie'){
              if(!aggsField){
                tarResult=[];
                tarResultNum=res.hits.total.value;
              }else{
                tarResult = res.aggregations.GroupByMe.buckets;
                tarResultNum=_this.countTotalNum(tarResult);
              }
              _this.origTotalNum=tarResultNum;
              _this.origDataArr=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
              _this.opitongPieData();
            }else if(_this.vzActiveName=='barGauge'){
              if(!aggsField){
                tarResult=[];
                tarResultNum=res.hits.total.value;
              }else{
                tarResult = res.aggregations.GroupByMe.buckets;
                tarResultNum=_this.countTotalNum(tarResult);
              }
              _this.origTotalNum=tarResultNum;
              _this.origDataArr=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
              _this.opitongbarGaugeData();
            }else if(_this.vzActiveName=='table'){
              if(!aggsField){
                tarResult = res.hits.hits;
                tarResultNum=res.hits.total.value;//总数
              }else{
                tarResult = res.aggregations.GroupByMe.buckets;
                tarResultNum = res.aggregations.GroupByMe.buckets.length;
              }
              _this.origTotalNum=tarResultNum;
              _this.origDataArr=aggsField&&aggsField=="shadow.access.error_code"?getTarResultArr(tarResult,1):tarResult;
              // _this.opitongTableData();
            }
            _this.showLoading=false;
          });

        })

        }
      })
    },

    countTotalNum(data){ //计算es查询返回数据的总值，聚合时不能直接取res.hits.total(不准确),而应该把每一项的doc_count相加得到总值
      let countNumber = 0
        data.forEach((val,index) => {
          countNumber+=val.doc_count
        })
      return countNumber
    }, 
    
    chartsHandleClick(tab){//切换图表tabs
      this.origDataArr=[];//清空
      this.getQueryData();
    },
    addDynamicTags(eleObj){
      this.dynamicTags.push(eleObj)
      // this.$emit('refilterColBy',this.dynamicTags)
    },
    dropDynamicTags(index){
      this.dynamicTags.splice(index, 1);
      console.log(this.dynamicTags)
      // this.$emit('refilterColBy',this.dynamicTags)
    },
    LegendToRight(val){
      console.log(val);
      // if(val){
      //   this.orientOptions[0].disabled=true;
      // }else{
      //   this.orientOptions[0].disabled=false;
      // }
      this.orientOptions[0].disabled=val;
      val?this.graphOrientValue='vertical':this.graphOrientValue='horizontal';
    },
    transformMyDate(d){
      d=new Date(d);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getFullYear()))+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':' + pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    transformMyDate2(d){
      d=new Date(d-8*60*60*1000);
      function pad(n){
        return n<10 ? '0'+n : n
      }
      return pad(parseInt(d.getFullYear()))+"-"+pad(parseInt(d.getMonth())+1)+"-"+pad(d.getDate())+" "+pad(d.getHours())+':'+ pad(d.getMinutes())+':' + pad(d.getSeconds());
    },
    addOrEditEnSure(optType,next,editKeyName){//增加 or 编辑保存
      this.$store.state.contentLoading = true;
      // this.origDataArr=[];//清空一些不必要保存的数据 !!!!重要
      const url = SERVER_API_URL + 'pe/shadow/kv';
      const chartOPt={
        'graph':'graphOptions',
        'singlestat':'singlestatOptions',
        'pie':'pieOptions',
        'barGauge':'barGaugeOptions',
        'table':'tableOptions',
      }
      let requestMethod='post';
      let keyName = '';

      console.log(editKeyName)
      if(editKeyName){//有editKeyName表示编辑
        keyName=editKeyName;
        requestMethod='patch';
      }else{
        var timestamp=new Date().getTime();
        keyName='customChart'+timestamp;//生成一个不重复的名字 相同前缀+时间戳
      }
      // // console.log(keyName);

      // //替换记录的数据,(避免用户点击查询后，再切换日志或聚合字段导致出错)
      this.queryform.logId=queryFatherLog;
      this.queryform.aggsId=queryAggsId;
      this.aggsIdTxt=queryAggsIdTxt;//暂时不用

      // console.log(this[chartOPt[optType]]);
      axios[requestMethod](url,{
        [keyName]:{
          option:this[chartOPt[optType]],
          searchQuery:this.elasticObj,
          type:'normal',
          size:Object.assign({},this.boxSize,{i:keyName}),
          vzActiveName:this.vzActiveName,
          data:Object.assign({},this.$data,{origDataArr:[]}),//用于编辑 //替换记录的数据,(避免用户点击查询后，再切换日志或聚合字段导致出错) {queryform:{logId:queryFatherLog,aggsId:queryAggsId}}
        }
      }).then(res=>{
        // console.log(res);
        if(res.data.responseCode==0){
          if(next) next();//如果是跳转保存
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.$store.state.contentLoading = false;
      }).catch((err) => {
        console.log(err)
      });
    },
   // editEnsure(optType,keyName,next){//编辑保存
    //   const url = SERVER_API_URL + 'pe/shadow/kv';
    //   const chartOPt={
    //     'graph':'graphOptions',
    //     'singlestat':'singlestatOptions',
    //     'pie':'pieOptions',
    //     'barGauge':'barGaugeOptions',
    //     'table':'tableOptions',
    //   }
    //   axios.patch(url,{
    //     [keyName]:{
    //       option:this[chartOPt[optType]],//JSON.stringify() 
    //       searchQuery:this.elasticObj,
    //       type:'normal',
    //       size:Object.assign({},this.boxSize),
    //       vzActiveName:this.vzActiveName,
    //       data:this.$data,
    //     }
    //   }).then(res=>{
    //     // console.log(res);
    //     if(res.data.responseCode==0){
    //       next();
    //       this.$message({
    //         type: 'success',
    //         message: '保存成功!'
    //       });
    //     }else{
    //       this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
    //     }
    //     this.$store.state.contentLoading = false;
    //   }).catch((err) => {
    //     console.log(err)
    //   });
   // },
    deletechart(){//临时放这里，删除某个指定图表
      var url = SERVER_API_URL + 'pe/shadow/kv/myTargetlocation';
      axios.delete(url).then(res=>{
        this.$message({
          type: 'success',
          message: this.$t('lg.success')
        });
      }).catch((err) => {
        console.log(err)
      });
    },
    showChartMenu(){
      this.isShowChartMenu=true;
    },
    hideChartMenu(){
      this.isShowChartMenu=false;
    },
    // downloadCSV(){//先不做
    //   const url = SERVER_API_URL+"pe/download/conversion/es2csv";
    //   console.log(queryString);
    //   const queryString = this.elasticObj;
    //   const dataSourceString='';
    //   axios.post(url,{
    //     dataSourceString:dataSourceString,
    //     queryString:JSON.stringify(queryString.body),
    //   }).then((res)=>{

    //   }).catch((err)=>{
    //     console.log(err)
    //   })
    // }
  }
}
</script>

<style>
.customChartPanel-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  padding-top: 45px;
  box-sizing: border-box;
}
.backBox{
  /*width: 100%; */
  position: absolute;
  top: 3px;
  z-index: 10;
}

/* 图表面板 */
.customChartPanel-container{
  width:100%;
  height:100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 图表 */
.chartPanelTop{
  /* height:calc(40% - 5px); */
  height: 315px;
  width:100%;
  background: #f7f7f7;
  /* padding:10px; */
  /* padding-bottom: 5px; */
  box-sizing:border-box;
  /* border: 1px solid #ccc; */
  /* box-shadow: 1px 1px 5px #ccc; */
}

/* .chartMenuNav{
  width: 100%;
  height: 22px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  cursor: pointer;
}
.chartMenuNav:hover{
  background: #000;
  opacity: 0.2;
}
.chartMenuNavShow{
  background: #000;
  opacity: 0.2;
} */

/* .chartMenuNavGraph{
  width:96%;
} */

/* .chartMenuList{
  position: absolute;
  top: 20px;
  left: 45%;
  z-index: 1002;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  width: 95px
}
.chartMenuList li{
  line-height: 16px;
  padding: 0 15px;
  margin: 6px 0;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
  outline: none;
  display: block;
}
.chartMenuList li:hover{
  background-color: #ecf5ff;
  color: #66b1ff;
} */

/* 边界线（缩放）*/
.chartPanelResize{
  position: relative;
  height:5px;
  width:100%;
  cursor: s-resize;
}

/* 图表操作面板 */
.chartPanelDown{
  /* flex: 1 1 0; */
  flex:1;
  width:100%;
  background: #e6e6e6;
  position: relative;
  overflow: hidden;
  /* box-shadow: 0px 0px 5px #ccc; */
}
.panelTabs{
  /* position: absolute;
  top: 0;
  left: 0; */
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: #e6e6e6;
  box-shadow: 0px 0px 3px #ccc;
  /* margin-bottom: 15px; */
}
.panelTabs .el-tabs{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.panelTabs .el-tabs__content{
  flex:1;
}
.tab-pane-bg{
  background-color:#eee;
  padding:20px 10px 0px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
}
/* element 样式重写*/
.tab-pane-bg .el-radio--small.is-bordered{
  background: #fff;
}

/* Query */
.icon-row{line-height: 40px}
.icon-row i{cursor: pointer; margin-right: 8px;}
/* Query end */

/* Visualization */
.visualization .el-tab-pane{
  height: 100%;
  overflow-y: auto;
}
/* element 样式重写*/
.visualization .el-tabs--border-card{
  background: transparent;
  border: none;
  box-shadow: none;
}
.visualization .el-tabs--border-card>.el-tabs__header{
  border: none;
  background-color:#eee;
}
.visualization .el-tabs--border-card>.el-tabs__header .el-tabs__item{
  border: 1px solid #ccc;
  border-radius: 5px;
  height: 100%;
  margin: 5px 10px;
  padding: 0;
}
.visualization .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
  background: transparent;
  border: 1px solid #eb7b18;
  box-shadow: 0 0 6px #eb7b18;
  color: #eb7b18;
}
.visualization .el-tabs__nav-next, .el-tabs__nav-prev{
  line-height: 115px;
}
.visualization .el-radio__inner{
  width: 16px;
  height: 16px;
}
.visualization .el-radio__inner::after{
  width: 6px;
  height: 6px;
}

.visValue .el-input__inner{
  border: none;
  height: 36px;
  line-height: 36px;
  vertical-align: top;
  background: #eee;
}

.visValue .el-switch{
  vertical-align: sub;
}/*end*/

/*visualizationTabimg*/.visImgTab{
  width: 105px;
  display: inline-block;
  position: relative;
  padding: 25px 10px 0;
  box-sizing: border-box;
}
.visImgTab i{
  width: 100%;
  /* background: pink; */
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 25px;
  overflow: hidden;
  font-size: 14px;
}
.chartImg{
  width: 100%;
  height: 100%;
}/*end*/

/*visualizationSetting*/
/*public*/
.visSetting{

}
.menuBox{
  width: 100%;
  background: #e6e6e6; 
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}
.menuBox li{
  margin-bottom: 20px;
}

/**/
.baseList{
  padding: 10px 15px 0;
}
.baseList li{
  float: left;
}

.axesList{
  margin-top: 20px;
  padding:45px 15px 0;
}
.axesList li:nth-child(n+2){
  float: left;
}
.axesList .yAxisLi{
  width: 350px;
  margin-right: 20px;
}
.axesList .xAxisLi{
  width: 350px;
}

.legendList{
  margin-top: 20px;
  padding:45px 15px 0;
}
.legendList li:nth-child(n+2){
  float: left;
}
.tagList{
  margin-top: 20px;
  padding:60px 15px 0;
}
/**/

.titleLi{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 40px;
  font-size: 16px;
  background: #d6d6d6;
  padding-left: 10px;
  box-sizing: border-box;
}
.visMenuList{

}
.visMenuList li{
  width: 100%;
  /* border:  1px solid #ccd; */
  height: 40px;
  background: #bebebe;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  margin-bottom: 3px;
  border-radius: 3px;
}
.visMenuList li:nth-of-type(1){
  background: none;
}
.visLable{
  width: 55%;
  padding-left: 10px;
  color: #fff;
}
.visValue{
  width: 45%;
  background: #eee;
  padding-left: 15px;
  margin: 2px;
}
.margSwitch{
  margin-left: 68px;
}
.margSwitch1{
  margin-left: 40px;
}
.margSwitch2{
  margin-left: 90px;
}
.margSwitch3{
  margin-left: 60px;
}
.margSwitch4{
  margin-left: 12px;
}
.margSwitch5{
  margin-left: 75px;
}
.margcolorpic{
  margin-left: 65px;
}
.margRadio{
  margin-left: 25px;
}
.noOptions{
  width: 100%;
  color: #fff;
  text-align: center;
}/*end*/

/*graph*/
.graphModeLi{
  width: 150px;
  margin-right: 20px;
}
.graphModeOptLi{
  width: 240px;
  margin-right: 20px;
}
.graphTooltipLi{
  width: 240px;
}
/*graph legend*/
.graphLegOptionsLi{
  width: 280px;
  margin-right: 20px;
}
/* .graphLegValuesLi{
  width: 300px;
} */

/*singlestat*/
.sstValueLi{
  width: 490px;
  margin-right: 20px;
}
.sstColoringLi{
  width: 280px;
  margin-right: 20px;
}
.sstGaugeLi{
  width: 240px;
}

/*pie*/
.pieModeLi{
  width: 150px;
  margin-right: 20px;
} 
.pieModeOptLi{
  width: 350px;
  margin-right: 20px;
}
.pieColoringLi{
  width: 275px;
  margin-right: 20px;
}
.pieTooltipLi{
  width: 240px;
}
/*pie legend*/
.pieLegOptionsLi{
  width: 320px;
  margin-right: 20px;
}
/* .pieLegValuesLi{
  width: 300px;
} */

/*barGauge*/
.bgeLabelLi{
  width: 300px;
  margin-right: 20px;
}
.bgeColoringLi{
  width: 275px;
  margin-right: 20px;
}
/*barGauge legend*/
.bgeLegOptionsLi{
  width: 280px;
  margin-right: 20px;
}
.bgeLegValuesLi{
  width: 300px;
}

/*table*/
.tableAttributesLi{
  width: 240px;
  margin-right: 20px;
}
.tablePagingLi{
  width: 240px;
}
</style>
