<template>
  <div class="quickconfig-wrapper">
    <div>
      <div v-if="tData.length==0" class="nodata">{{$t('lg.nodata')}}</div>
      <table class="table-container" v-else>
            <thead>
              <tr>
                <td>{{$t('lg.nodemingc')}}</td>
                <td>{{$t('lg.yunxingztai')}}</td>
                <td>{{$t('lg.jiqunname')}}</td>
                <td>{{$t('lg.xuniip')}}</td>
                <td>{{$t('lg.zhuconngzhut')}}</td>
                <td>{{$t('lg.xingnengzhuant')}}</td>
                <td>{{$t('lg.jiedianguanli')}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in tData">
                <td>{{item.hostName}}</td>
                <td></td>
                <td></td>
                <td>{{}}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
    </div>
   
    <loading v-show="quickConfigLoading"></loading>
  </div>
</template>

<script>
import axios from 'axios'
import {SERVER_API_URL} from '@/conf/constvar';
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
export default {
  components:{
    loading
  },
  data(){
    return{
      quickConfigLoading:false,
      tData:[]
    }
  },
  created(){
    if(localStorage.lang=="en"){
      this.isencn="en";
    }
    this.getAlls();
  },
  methods:{
    getAllNodes(){
      return new Promise((resolve,reject)=>{
        const serverUrl=SERVER_API_URL+"topology";
        axios.get(serverUrl).then((res)=>{
         // console.log(res)
          if(res.data.responseCode==0){
            let tt=res.data.data;
            resolve(tt);
           // this.tData=tt;
          }else{
            reject("error")
          }
        })
      })    
    },
    getAlls(){
      this.getAllNodes().then((resovledata)=>{
        console.log(resovledata);
        var url,resolveid;
        let sObjArr=[];
        for(let i=0;i<resovledata.length;i++){
          let sObj={};
          resolveid=resovledata[i].snodeId;
          url=SERVER_API_URL+"pe/shadow/snode/"+resolveid;
          axios.get(url).then((res)=>{
            //console.log(res)
            if(res.data.responseCode==0){
              let resdata=res.data.data;
              if(!resdata.isShadowGroup){
                sObjArr.push({
                  [resdata.name]:[resdata.masterNode.ip,resdata.masterNode.status]
                })
               //  console.log(sObjArr)
              }else{
                sObjArr.push({
                  [resdata.name]:[resdata.backupNode.ip,resdata.backupNode.status]
                })
              }
              console.log(sObjArr)
            }else{
              console.log("error")
            }
          })
        }
         
      })
    }
  }
}
</script>

<style scoped>
  .quickconfig-wrapper{
    width:100%;
    height:100%;
    position:relative;
    box-sizing: border-box;
    padding:15px;
  }
  .nodata{font-size: 12px; color: #888; text-align: center; margin: 20px auto;}
  .table-container {
  width: 100%;
  border-collapse: collapse;
}

/* 表头 */
.table-container thead {
  background-color: #f7f7f7;
}

.table-container th,
.table-container td {
  padding:15px 10px;
  border: 1px solid #eee; /* 添加边框 */
  max-width: 200px;
}
.table-container tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}
.table-container tbody tr:hover {
  background-color: #f9f9f9;
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
</style>
