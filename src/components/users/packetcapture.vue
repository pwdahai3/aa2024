<template>
  <div class="users-wrapper">
    <div class="usersContent">
      <h3 style="margin-bottom:16px">节点列表</h3>
      <div v-if="nodes.length==0">
        <p class="nodata-box" style="font-size:12px">暂无数据</p> 
      </div>
      <div v-else>
         <table>
        <thead>
          <tr>
            <th>节点</th>
            <th width="240"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in nodes">
            <td>{{item}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="capt(item)"><i class="el-icon-edit"></i>抓包</a>
              <a href="javascript:;" class="edit-del-a" @click="timerC(item)"><i class="el-icon-edit"></i>抓包文件名列表</a>
            </td>
          </tr>
        </tbody>
      </table>     
      </div>
    </div>

<el-dialog width="60%" :title="curNode" :visible.sync="editShow" :close-on-click-modal="false" :before-close="closePo">
      <div>
        <div v-if="capnodes.length==0">
        <p class="nodata-box" style="font-size:12px">暂无数据</p> 
      </div>
      <div v-else>
         <table>
        <thead>
          <tr>
            <th>文件名</th>
            <th width="60"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in capnodes">
            <td>{{item}}</td>
            <td class="text-center">
              <a href="javascript:;" class="edit-del-a" @click="downloadc(item)"><i class="el-icon-edit"></i>下载</a>
            </td>
          </tr>
        </tbody>
      </table>     
      </div>
      </div>
</el-dialog>


  </div>
</template>
<script>
import axios from 'axios';
import loading from '@/components/loading/loading';
import {SERVER_API_URL} from '@/conf/constvar';
export default {
  components:{
    loading,
  },

  created(){
    this.$store.state.contentLoading=true;
    this.getNodes();
  },
  data(){
    return{
      nodes:[],
      capnodes:[],
      ctimer:null,
      curNode:'',
      editShow:false
    }
  },
  methods:{
    downloadc(item){
      let _this=this;
     // var newdate=new Date().getTime();
     // var filename="config_backup_"+newdate+".json";
      var url=SERVER_API_URL+"pe/shadow/wireshark/download/zip?snodeId="+_this.curNode+"&fileName="+item;
      axios({
					  url:url,
            method: 'get',
            responseType: 'blob'
        })
        .then((response) => {
          var blob=new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
         // var filename=new Date().getTime()+".csv"
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, item);
          }else{
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', item);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);    
          }  
        })
    },
    closePo(){
      this.editShow=false;
      clearInterval(this.ctimer);
    },
    getNodes(){
      var url=SERVER_API_URL+"pe/shadow/wireshark/snodelist";
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          this.nodes=res.data.data;   
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err);
        this.$store.state.contentLoading=false;
      });
    },
    capt(item){
      const url=SERVER_API_URL+"pe/shadow/wireshark/execute?snodeId="+item;
      this.$store.state.contentLoading=true;
      axios.post(url,{}).then((res)=>{
        if(res.data.responseCode==0){
          this.$message({
              type: 'success',
              message: this.$t('lg.success')
            });
        }else{
          this.$message.error(this.$t('lg.failed')+': '+ res.data.data.message);
        }
      //  console.log(res)
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err);
        this.$store.state.contentLoading=false;
      })
    },
    captlist(){
      var url=SERVER_API_URL+"pe/shadow/wireshark/filenamelist?snodeId="+this.curNode;
      this.capnodes=[];
      axios.get(url).then((res)=>{
        if(res.data.responseCode==0){
          this.capnodes=res.data.data;   
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err);
        this.$store.state.contentLoading=false;
      });
    },
    timerC(item){
      this.curNode=item;
      this.editShow=true;
      this.captlist();
      this.ctimer=setInterval(this.captlist, 10000);
    }

  },
  beforeDestroy() {
      clearInterval(this.ctimer);
    }
}
</script>
<style scoped>
.users-wrapper{
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