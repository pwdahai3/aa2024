<template>
  <div class="jobManagement-wrapper">
    <div v-if="jobList.length==0" class="nodata-box">{{$t('lg.nodata')}}</div>
    <table>
      <thead>
        <tr>
          <th>Job ID</th>
          <th>Job Name</th>
          <th>Job Type</th>
          <th>Description</th>
          <!-- <th>Processed Records</th> -->
          <th>Job Status</th>
          <th>Last Start Timestamp</th>
          <th>Last Finish Timestamp</th>
          <th style="min-width:60px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in jobList">
          <td>{{item._id}}</td>
          <td>{{item.name}}</td>
          <td>{{item.task_type}}</td>
          <td>{{item.description}}</td>
          <!-- <td>{{item._etag}}</td> -->
          <td>closed</td>
          <td>2018-12-11 16:06:35</td>
          <td>2018-12-14 09:15:03</td>
          <td class="text-center">
            <a href="javascript:;" class="edit-del-a"><i class="el-icon-search"></i>{{$t('lg.query')}}</a>
            <a href="javascript:;" class="edit-del-a"><i class="el-icon-circle-check font-green"></i><span :title="$t('lg.dianjikaishirenw')">{{$t('lg.start')}}</span></a>
            <a href="javascript:;" class="edit-del-a"><i class="el-icon-edit-outline font-blue" @click="editJob(item)">{{$t('lg.edit')}}</i></a>
            <a href="javascript:;" class="edit-del-a"><i class="el-icon-delete" @click="deleteJob(item._id)">{{$t('lg.delete')}}</i></a>
          </td>
        </tr>
      </tbody>
    </table>
    <create-new-job :isShow="isCreateNewJobShow" :editData="editedJob" :editedJobId="editedJobId" @createNewJobClose="isCreateNewJobShow=false" @getJobListAgain="getJobList"></create-new-job>
    <el-row class="createJobBtnbox">
      <el-button type="primary" icon="el-icon-plus" @click="showCreatePop">create New Job</el-button>
    </el-row>
    <!-- <el-row class="jobBtnbox">
      <el-button type="success" round icon="el-icon-plus" @click="showCreatePop">create New Job</el-button>
    </el-row> -->
    <el-row style="margin-top:30px">
      <router-link tag="button" to="/shadowview" class="chartTxt">测试1</router-link>
      <router-link tag="button" to="/aa" class="chartTxt">测试2</router-link>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios';
import * as types from '@/store/types';
import {SERVER_API_URL} from '@/conf/constvar';
import createNewJob from '@/components/zmachine/createNewJob';
export default {
  data(){
    return{
      jobList:[],
      isCreateNewJobShow:false,
      editedJob:{},//存储被修改项
      editedJobId:null,//编辑当前job的id
    }
  },
  created(){
    this.$store.state.contentLoading=true;
    this.getJobList();
  },
  methods:{
    getJobList(){//查询所有job
      var _this=this;
      const url=SERVER_API_URL+"ml/job";
      axios.get(url).then((res)=>{
        // console.log(res);
        if(res.status==200){
          let resArray = res.data._items
          _this.jobList=resArray;
        }else{
          _this.$message.error('操作失败: '+res._error.message);
        }
        this.$store.state.contentLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    },
    showCreatePop(){//创建job
      this.editedJobId=null;
      this.editedJob={};//清空
      this.isCreateNewJobShow=true;
    },
    editJob(item){//修改
      var _this=this;
      _this.isCreateNewJobShow=true;
      _this.editedJob=item;
      _this.editedJobId=item._id;
    },
    deleteJob(id){//删除
      var _this=this;
      _this.$confirm('确定要删除该机器作业吗？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        const url=SERVER_API_URL+"ml/job/"+id;
        axios.delete(url).then((res)=>{
          console.log(res);
          // if(res.status==200){
            this.getJobList();
            this.$message({
              type: 'success',
              message: '操作成功'
            });
            
          // }
        }).catch((err)=>{
          console.log(err);
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '操作已取消'
        });
      })
    }

  },
  components:{
    createNewJob
  }
}
</script>
<style scoped>
.jobManagement-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  padding:20px;
  box-sizing: border-box;
}
.createJobBtnbox{
  margin-top: 20px;
}
.jobBtnbox{
  position: fixed;
  right: -16px;
  bottom: 30%;
}
</style>
