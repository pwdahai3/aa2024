<template>
  <div>
    <el-dialog width="60%" :title="$t('lg.certifications')" :visible.sync="cersmodalShow" :close-on-click-modal="false" :before-close="cersmodalResetForm">
      <div class="grid-content">
        <div style="margin-bottom: 20px;">
          <el-radio v-model="keycrt" label="keys" border size="small">{{$t('lg.keyfiles')}}</el-radio>
          <el-radio v-model="keycrt" label="crts" border size="small">{{$t('lg.cetfiles')}}</el-radio>
          <el-radio v-model="keycrt" label="pems" border size="small">{{$t('lg.pemfiles')}}</el-radio>
        </div>
        <div>
          <div v-show="keycrt=='keys'">
            <p v-if="keys.length==0">{{$t('lg.nodata')}}</p>
            <table class="cersmodal-table" v-if="keys.length>0">
              <tbody>
                <tr v-for="item in keys">
                  <td>{{item.name}}</td>
                  <td width="100px" class="text-center">
                    <a href="javascript:;" class="edit-del-a" @click="deleteCers('key',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="keycrt=='crts'">
            <p v-if="crts.length==0">{{$t('lg.nodata')}}</p>
            <table class="cersmodal-table" v-if="crts.length>0">
              <tbody>
                <tr v-for="item in crts">
                  <td>{{item.name}}</td>
                  <td  width="100px" class="text-center">
                    <a href="javascript:;" class="edit-del-a" @click="deleteCers('crt',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="keycrt=='pems'">
            <p v-if="pems.length==0">{{$t('lg.nodata')}}</p>
            <table class="cersmodal-table" v-if="pems.length>0">
              <tbody>
                <tr v-for="item in pems">
                  <td>{{item.name}}</td>
                  <td width="100px" class="text-center">
                    <a href="javascript:;" class="edit-del-a" @click="deleteCers('pem',item)"><i class="el-icon-close"></i>{{$t('lg.delete')}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </el-dialog>
    <div v-show="cersmodalLoading">
      <loading :title="$t('lg.loading2')"></loading>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import loading from '@/components/loading/loading';
let Base64 = require('js-base64').Base64;
import {SERVER_API_URL} from '@/conf/constvar'
export default{
  props:{
    keys:{
      type:Array
    },
    crts:{
      type:Array
    },
    pems:{
      type:Array
    },
    cersmodalShow:{
      type:Boolean
    },
    shadowObj:{
      type:Object
    }
  },
  data(){
    return{
      cersmodalLoading:false,
      keycrt:"keys"
    }
  },
  methods:{
    cersmodalResetForm(){
      this.$emit('setbycersmodal',false);
    },
    deleteCers(type,item){//删除key,crt文件,pem文件
      var url=SERVER_API_URL+"pe/file/client/"+this.shadowObj.snodeId+"/"+type+"/"+item.name+"/";
      var _this=this;
      this.cersmodalLoading=true;
      axios.delete(url).then((res)=>{
        if(res.data.responseCode==0){
          if(type=="key"){
            this.keys.splice(this.keys.indexOf(item),1);
          }else if(type=="crt"){
            this.crts.splice(this.crts.indexOf(item),1);
          }else{
            this.pems.splice(this.pems.indexOf(item),1);
          }
          this.$message({
            type: 'success',
            message: _this.$t('lg.success')
          });
        }else{
          this.$message.error(_this.$t('lg.failed')+': '+ res.data.data.message);
        }
        this.cersmodalLoading=false;
      }).catch((err)=>{
        console.log(err)
      })
    }
  },
  components:{
    loading
  }
}
</script>