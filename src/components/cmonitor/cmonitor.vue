<!-- 组件监控 -->
<template>
    <div class="cmonitor-wrapper">
        <div class="cmonitor-cm-wrapper" v-for="(items,index0) in csData" :key="index0" >
            <h2 class="cm-title">{{index0}} {{(Object.keys(csData))[index0]}}</h2>
            <!-- <div v-if="Object.keys(cmdata).length==0" class="nodata-box">
                暂无数据
            </div> -->
            <div v-for="(item,index) in items" :key="index" class="cm-box">
                <h3 class="cm-node-name">{{index}} {{(Object.keys(items))[index]}}</h3>
                <table>
                    <thead>
                        <tr>
                            <!-- <th>ID</th> -->
                            <th  style="min-width:200px">{{$t('lg.zizujianmc')}}</th>
                            <th>{{$t('lg.status')}}</th>
                            <th style="width:100px">{{$t('lg.jiankongshjc')}}</th>
                            <th style="width:100px">{{$t('lg.kaiqiyoujiantongz')}}</th>                           
                            <th style="width:100px">{{$t('lg.recipient')}}</th>
                        </tr>                    
                    </thead>
                    <tbody>
                        <tr v-for="(item2,index2) in item">
                            <!-- <td>{{item2.id}}</td> -->
                            <td>{{item2.subComponentNameTxt || item2.subComponentName}}</td>
                            <td v-if="item2.status=='running'"><div class="lds-grid"><div class="green"></div></div></td>
                            <td v-else>
                                <div class="lds-grid"><div class="red"></div></div>
                                <div class="error-status">{{item2.status}}</div>
                            </td>
                            <td v-if="item2.subComponentName=='shadow' || item2.subComponentName=='keepalived'"></td>
                            <td v-else>
                                <el-switch
                                    @change="daemonChange(item2)"
                                    v-model="item2.enableDaemon"
                                    active-color="#34a01f"
                                    inactive-color="#dcdfe6">
                                </el-switch>
                            </td>
                            <td>
                                <el-switch
                                    @change="daemonChange(item2)"
                                    v-model="item2.enableNotification"
                                    active-color="#34a01f"
                                    inactive-color="#dcdfe6">
                                </el-switch>
                            </td>
                            
                            <td style="font-size:12px;"><a href="javascript:;"  @click="viewrec(item2)">{{$t('lg.editsee')}}</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>            
        </div>
        <editrec :isShow2="isshow2" :data="pdata2" @setClose="isshow2=false;pdata2={}" @updateRec="getCStatusList"></editrec>
    </div>
</template>
<script>
import axios from "axios";
import { SERVER_API_URL } from "@/conf/constvar";
import editrec from '@/components/cmonitor/edit';
export default {
    created(){
        this.$store.state.contentLoading=true;
        this.getCStatusList()
    },
    data(){
        return{
            csData:{},
            // cmdata:'',
            // shadowdata:'',
            isshow:false,
            isshow2:false,
            pdata:{},
            pdata2:{}
        }
    },
    methods: {
        getCStatusList(){
            let _this=this;
            
            let url=SERVER_API_URL+"/monitoring/component";
            axios.get(url).then((res)=>{
              // console.log(res)
              if(res.data.responseCode==0){
                  let cdata=res.data.data;
                  const shadowObj = cdata.shadow;
                
                  for(var i in shadowObj){
                    shadowObj[i].forEach(ele => {//shadow 里面 filebeat、keepalived、metricbeat 显示给用户分别为：shadow log、cluster、shadow metric
                      if(ele.subComponentName=="filebeat"){
                        ele.subComponentNameTxt = "shadow log";
                      }else if(ele.subComponentName=="keepalived"){
                        ele.subComponentNameTxt = "cluster";
                      }else if(ele.subComponentName=="metricbeat"){
                        ele.subComponentNameTxt = "shadow metric";
                      }
                    });
                  }
                  
                  _this.csData=cdata;
                  // console.log(cdata);
                  // _this.cmdata=cdata.cm;
                  // _this.shadowdata=cdata.shadow;
                }
                _this.$store.state.contentLoading=false;
            })
        },
        daemonChange(item){
            let _this=this;
            let url=SERVER_API_URL+"/monitoring/component";
            let data=[{
                "componentName": item.componentName,
                "nodeName": item.nodeName,
                "subComponentName": item.subComponentName,
                "enableDaemon": item.enableDaemon,
                "enableNotification": item.enableNotification
            }];
            axios.post(url,data).then((res)=>{
                if(res.data.responseCode==0){
                     _this.$message({
                        type: 'success',
                        message: _this.$t('lg.success')
                    });
                }else{
                    _this.$message.error(_this.$t('lg.failed'));
                }
            })
        },
        viewrec(item){
            this.pdata2=item;
            this.isshow2=true;
        }
    },
    components:{
        editrec
    }
}
</script>
<style scoped>
.cmonitor-wrapper{
  padding: 15px;
}
.cmonitor-cm-wrapper{
  padding:12px 20px 20px 20px;
  border:1px solid #ccc;
  background: #f9f9f9;margin-bottom: 20px;
}
.cm-title{
  font-size: 18px;margin-bottom: 12px; font-weight: 500; margin-bottom: 30px;
}
.cm-box{
  padding:30px 20px; border: 1px dashed #ccc; position: relative;background: #fff;margin-bottom: 16px;
}
.cm-node-name{ font-size: 18px; font-weight: 500;position: absolute; left: 12px; top: -18px; background: #fff; padding:6px 10px;border: 1px dashed #ccc;}
.error-status{ color: #ae412c}
table tbody tr td{padding: 12px}
.lds-grid {
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
}
.lds-grid div {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  animation: lds-grid 1.2s linear infinite;
  }
.lds-grid div.green{
background: #155708;
}
.lds-grid div.red{
background: #85220e;
}

@keyframes lds-grid {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>