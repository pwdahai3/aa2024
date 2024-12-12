<template>
  <div class="bwlist-wrapper">
    <h2 class="breadcrumb">{{$t('lg.zwHeimingdan')}}</h2>
    
    <div class="btn-bg">
      <el-button type="primary" @click="addBwToken">{{$t('lg.add')}}</el-button>
    </div>
    
    <div v-if="bwlist.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>

    <div class="bwlist-table">
      <table v-if="bwlist.length>0">
        <thead>
          <tr>
            <th>TOKEN</th>
            <!-- <th>SNODEID</th> -->
            <th>{{$t('lg.laiyuanfans')}}</th>
            <th>{{$t('lg.tokeniscover')}}</th>
            <th width="100"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in bwlist">
            <td>{{item.token}}</td>
            <!-- <td>
              <p v-for="items in item.snodeId" class="pArrTxt">{{items}}</p>
            </td> -->
            <td>
              <p v-for="items in item.source" class="pArrTxt">{{items==='ui'?$t('lg.shoudongtianj'):$t('lg.beibaojrw')+'：'+items+$t('lg.saomiaofx')}}</p>
            </td>
            <td>
              <!-- {{item.keep}} -->
              <el-switch v-model="item.keepSwitch" @change="editBlackTk(item)"></el-switch>
            </td>
            <td class="text-center">
              <!-- <a href="javascript:;" class="edit-del-a" @click="editBWToken(item)"><i class="el-icon-edit-outline"></i>{{$t('lg.edit')}}</a> -->
              <a href="javascript:;" class="edit-del-a" @click="del(item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <bwpop :isShow="isShowBwpop" :isAddTk="isAddTk" :editTkItem="editTkItem" @bwclose="isShowBwpop=false;editTkItem={};" @getBwlist="getBwlist"></bwpop>
  </div>
</template>
<script>
import bwpop from '@/components/behavior/bwlistpop';
import {SERVER_API_URL} from '@/conf/constvar';
import axios from 'axios';
export default{
  data(){
    return{
      detailLoading:false,
      bwlist:[],
      isShowBwpop:false,
      isAddTk:true,//为true代表增加，false代表修改
      editTkItem:{},
    }
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getBwlist();
  },
  mounted(){
    this.$on('updateBwlist',()=>{
      this.getBwlist();
    });
  },
  methods:{
    getBwlist(){//查询token黑名单
      var url=SERVER_API_URL+"pe/shadow/token/blacklist";
      axios.get(url).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          const resData=res.data.data;
          resData.forEach((element) =>{
            element.keepSwitch = element.keep=='N'?true:false;
            // if(element.source.includes('ui') && element.source.length>1){
            //   const index= element.source.indexOf('ui')
            //   element.source.splice(index,1)
            // }
          });
          this.bwlist=resData;
        }else{
          this.$message.error(this.$t('lg.failed')+':'+ res.data.data.message);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      });
    },
  
    addBwToken(){//增加黑名单指纹
      this.isShowBwpop=true;
      // this.isAddTk=true;
    },
    // editBWToken(item){//编辑黑名单指纹
    //   this.isShowBwpop=true;
    //   this.editTkItem=item;
    //   this.isAddTk=false;
    // },
    editBlackTk(item){//修改黑名单
      // console.log(item)
      var _this=this;
      _this.$store.state.contentLoading=true;
      var url=SERVER_API_URL+"pe/shadow/token/blacklist";
      const tokenBlacklistList=[
        {
          token:item.token,
          source: item.source,
          keep:item.keepSwitch?'N':'Y'
        }
      ]
      axios.patch(url,{
        tokenBlacklistList:tokenBlacklistList
      }).then((res)=>{
        if(res.data.responseCode==0){
          _this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
        }else{
          const msgList = res.data.data;
          const msgStr = _this.handleMsg(msgList);
          _this.$message.error(this.$t('lg.failed')+':'+msgStr);
          // item.keepSwitch=!item.keepSwitch;
        }
        // _this.$store.state.contentLoading=false;
        _this.getBwlist();
      }).catch((err)=>{
        console.log(err);
      })
    },
    del(item){//删除黑名单指纹
      var url=SERVER_API_URL+"pe/shadow/token/blacklist";
      this.$store.state.contentLoading=true;
      axios.delete(url,{
        data:{
            tokenBlacklistList:[{
              token:item.token,
            }]
          // snodeIds:[{"snodeId":item.snodeId}]
        }
      }).then((res)=>{
        // console.log(res)
        if(res.data.responseCode==0){
          this.$message({
            type: 'success',
            message: this.$t('lg.success')
          });
          this.$emit("updateBwlist")
        }else{
          const msgList = res.data.data;
          const msgStr = this.handleMsg(msgList);
          this.$message.error(this.$t('lg.failed')+':'+msgStr);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err);
      });
    },
    handleMsg(arr){//处理返回的错误提示信息
      let msgStr='';
      arr.forEach(ele=>{
        for(let key in ele){
          msgStr+=key+':'+ele[key].data.message+';'
        }
      })
      return msgStr
    }
  },
  components:{
    bwpop
  }
}
</script>
<style scoped>
.bwlist-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.pArrTxt{
  line-height: 22px;
}
.bwlist-table{
  flex: 1;
  overflow-y: auto;
}
</style>

