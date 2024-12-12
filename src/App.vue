<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios';
import {SERVER_API_URL2} from '@/conf/constvar';
import store from './store/store';
import * as types from '@/store/types';
export default {
  name: 'App',
  created () {
    if(!this.$store.state.productName){
      this.$store.commit(types.PRODUCTNAME);
     // document.title = this.productName;
    }
    
  },
  data(){
    return{
      productName:store.state.productName
    }
  },
  methods:{
    // getProductname(){
    //     let url=SERVER_API_URL2+'pe/shadow/kv/productName';
    //     axios.get(url).then((res)=>{
    //       if(res.data.responseCode==0){
    //         let resData=res.data.data;
    //         this.productName=resData;

    //         document.title = this.productName;
    //         this.$store.state.productName=resData;
    //       }
    //     })
    //   }
  }
}
</script>

