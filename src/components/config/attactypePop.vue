
<template>
  <div>
    <el-dialog width="60%" :title="$t('lg.attacktype')" :visible.sync="isShow" :close-on-click-modal="false" :before-close="attClose">
      <el-button class="addSdGrpBtn" type="primary" size="mini" @click="addAttactype">{{$t('lg.add')}}</el-button>
      <div v-if="attactypeData.length==0" class="nodata-box sdGrpTable">{{$t('lg.nodata')}}</div>
      <table v-else class="sdGrpTable">
        <thead>
          <tr> 
            <th>ID</th>
            <th>{{$t('lg.attacktype')}}</th>
            <th>{{$t('lg.score')}}</th>
            <th>{{$t('lg.remark')}}</th>
            <th width="110"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in attactypeData">
            <td>{{item.id}}</td>
            <td>{{item.attackType}}</td>
            <td>{{item.score}} </td>
            <td>{{item.remark}} </td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="editatt(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a>
              <a href="javascript:;" class="edit-del-a" @click="delatt(item.id)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody> 
      </table>
    </el-dialog>
    <addattactype :isShow="addattactypeShow" @addattactypeclose="addattactypeShow=false"  @addattdone="getAttactypeData"></addattactype>
    <editattactype :isShow="editattactypeShow" :data="editdata" @updateattactypeclose="editattactypeShow=false"  @updateattdone="getAttactypeData"></editattactype>
  <loading v-show="asloading" title="loading..."></loading>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
import addattactype from '@/components/config/addAttactype';
import editattactype from '@/components/config/editAttactype';
export default{
  components:{
    loading,
    addattactype,
    editattactype
  },
  props:{
    isShow:{
      type:Boolean
    }
  },
  data(){
    return{
      asloading:false,
      addattactypeShow:false,
      editattactypeShow:false,
      attactypeData:[],
      editdata:{}
    }
  },
  methods:{
    delatt(id){
      let _this=this;
      let url=SERVER_API_URL+"waf/attacktype/"+id;
      _this.asloading=true;
      let matchType={
        "accurateMatch":this.$t('lg.exactmatch'),
        "suffixMatch":this.$t('lg.suffixmatch'),
        "pathMatch":this.$t('lg.patchmatch'),
        "dynamicurl":this.$t('lg.dynamicurl'),
        "customMatch":this.$t('lg.zidingyipz'),
        "dynamicMatch":this.$t('lg.dynamicmatch'),
        "all":this.$t('lg.tongyongppz')
      };
       axios.delete(url).then((res)=>{
            if(res.data.responseCode==0){
              _this.$message({
                type: 'success',
                message: _this.$t('lg.success')
              });
              _this.getAttactypeData();
            }else if(res.data.reasonCode=="WS0018"){
              let listdata=res.data.data;
              let listhtml="<div>$t('lg.zhu70')：</div><ul>";
              let listdatai;
              let listdataiport;
              let listdataitype;
              for(let i=0;i<listdata.length;i++){
                listdatai=listdata[i];
                listdataiport=listdatai.domainPort;
                if(listdatai.locationType=="/"){
                  listdatai.locationType="all";
                }
                listhtml+="<li>$t('lg.domain')："+listdatai.domain+"    $t('lg.port')："+listdataiport+"   $t('lg.path')："+listdatai.location+"    $t('lg.pipeileix')：["+matchType[listdatai.locationType]+"]"+"</li>"
              }
              listhtml+="</ul>";
              _this.$message({
                dangerouslyUseHTMLString: true,
                message: listhtml
              });
            }else{
              _this.$message.error(res.data.data.message);
            }
            _this.asloading=false;
          }).catch((err)=>{
            console.log(err)
          })
    },
    addAttactype(){
      this.addattactypeShow=true;
    },
    editatt(item){
      console.log(item)
      this.editdata=item;
      this.editattactypeShow=true;
    },
    attClose(){//关闭shadow集群列表弹框
      this.$emit("attactypeclose",false);
    },
   getAttactypeData(){
      return new Promise((resolve,reject)=>{
        var url=SERVER_API_URL+"waf/attacktype";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          let attactypeData=res.data.data;
          this.attactypeData=attactypeData;
          resolve(attactypeData)
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err)=>{
        console.log(err)
      });
      })
    }
  }
}
</script>
<style scoped>
.addSdGrpBtn{
  position: absolute;
  right: 20px;
  top: 50px;
}
.sdGrpTable{
  margin-top: 15px;
}
.sdGrpParamsList li{
  line-height: 20px;
}
</style>

