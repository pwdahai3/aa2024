<template>
  <div class="iconfigset-wrapper">
    <h2 class="breadcrumb">配置集列表</h2>
    <div class="usersContent">
      <p class="nodata-box" v-if="!iconfigset || iconfigset.length==0">{{$t('lg.nodata')}}</p>
      <table v-if="iconfigset.length>0">
        <thead>
          <tr>
            <th>id</th>
            <th>名称</th>
            <th>备注</th>
            <th>修改日期</th>
            <th width="110"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in iconfigset">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.remark}}</td>
            <td>{{item.modDate | formatDate}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="detailPop(item)">详情</a>
              <a href="javascript:;" class="edit-del-a" @click="pushPop(item)">推送</a>
              <a href="javascript:;" class="edit-del-a" @click="deletePop(item)">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
   <loading ref="loadingc"></loading>
   <iconfigsetdetail :id="id" :name="name" :detailShow="detailShow" :data="detailData" @toClose="detailShow=false"></iconfigsetdetail>
    <pushshow :show="isPushshow" :nodesdata="nodesdata" @pushClose="isPushshow=false"></pushshow>
  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/gptloading';
import {SERVER_API_URL} from '@/conf/constvar';
import iconfigsetdetail from './iconfigsetdetail.vue'
import pushshow from './pushshow.vue'
export default {
  components:{
    loading,
    iconfigsetdetail,
    pushshow
  },
  mounted(){
    this.getIconfigset();
  },
  data(){
    return{
      iconfigset:[],
      detailShow:false,
      isPushshow:false,
      detailData:{},
      name:"",
      id:0,
      nodesdata:[]
    }
  },
  methods:{
    pushPop(){//获取节点
      const _this=this;
      const nodesurl=SERVER_API_URL+"pe/shadow/snode";// 查询当前所有业务节点
      axios.get(nodesurl).then((res)=>{
       // console.log(res)
        if(res.data.responseCode == 0){
          _this.nodesdata=res.data.data;
          _this.isPushshow=true;
        }else{
          _this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
      }).catch((err) => {
        console.log(err)
      });
    },
    deletePop(item){
        const _this = this;
      _this.$confirm('确定删除',_this.$t('lg.tip'),{
        confirmButtonText: _this.$t('lg.yes'),
        cancelButtonText: _this.$t('lg.cancel'),
        type: 'warning'
      }).then(()=>{
        let url=SERVER_API_URL+"pe/shadow/i-config/delete/"+item.id;
        axios.delete(url).then(res => {
          if(res.data.responseCode == 0){
            _this.$message({
              type: "success",
              message: _this.$t('lg.success')
            });
            _this.getIconfigset()
          }else{
            _this.$message.error(_this.$t('lg.failed')+": " + res.data.data.message);
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: _this.$t('lg.cancel')
        });
      })
    },
    detailPop(item){
        const url=SERVER_API_URL+"pe/shadow/i-config/detail/list?iConfigId="+item.id;
        this.name=item.name;
        this.id=item.id;
        this.$refs.loadingc.showLoading();
        axios.get(url).then((res)=>{
            if(res.data.responseCode==0){
                this.detailData=res.data.data;
                this.$refs.loadingc.hideLoading();
                this.detailShow=true;
            }
        }).catch((err)=>{
            console.log(err);
        });

    },
    getIconfigset(){
      var url=SERVER_API_URL+"pe/shadow/i-config/list";
      this.$refs.loadingc.showLoading();
      axios.get(url).then((res)=>{
        console.log(res)
        if(res.data.responseCode==0){
          this.iconfigset=res.data.data;
          this.$refs.loadingc.hideLoading();
        }
      }).catch((err)=>{
        console.log(err);
      });
    }
  },
   filters: {
    formatDate(value) {
       if (!value) return '';
  
        const date = new Date(value);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
}
</script>
<style scoped>
.iconfigset-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
.usersContent{
  margin-bottom: 20px;
  flex: 1;
  overflow-y: auto;
}


/*抽屉 设置*/
.userSettingBox{
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.usDrawerTitle{
  background-color: #4a5166;
  font-weight: 800;
  color: #fff;
  line-height: 30px;
  margin-bottom: 20px;
  padding-left: 20px;
  box-sizing: border-box;
}
.usDrawerContent{
  flex: 1;
}
.usFooterBtn{
  display: flex;
}
.usFooterBtn button {
  flex: 1;
}

</style>