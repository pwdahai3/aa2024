// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from './i18n/i18n';
import App from './App';
import router from './router';
import axios from 'axios';
import * as types from './store/types';
import store from './store/store';
import { SERVER_API_URL } from '@/conf/constvar';

Vue.use(ElementUI);
import '@/assets/css/index.styl';
Vue.config.productionTip = false;

router.beforeEach((to, from, next)=>{
  store.state.contentLoading=false;
  if(store.state.pswdreminder)store.state.pswdreminder.close();
  
  if(to.meta.requireAuth){
    if(window.sessionStorage.getItem("mytoken")){
      next();
    }else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }else{
    next();
  }
});

showConfirm();
export function showConfirm(){
  const activeTime = sessionStorage.getItem('expires_in')*1000;
  if(!activeTime){ 
    return false;
  }
  store.state.LoginResTime=setTimeout(()=>{
    store.state.loginResShow=true;
  },activeTime)
}

axios.interceptors.request.use(
  config => {
    const mytoken = sessionStorage.getItem('mytoken');
    if(mytoken) {
      config.headers.Authorization = `Bearer ${mytoken}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
});

var isRefreshingFlag = true;
axios.interceptors.response.use(
  response => {//请求成功
    return response
  },
  err => {
    if(err.response) { 
      switch (err.response.status) {
        case 401:
        let config = err.config;
        if(isRefreshingFlag){
          refreshTokenRequst();
        }
        isRefreshingFlag = false;
        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber(()=> {
            resolve(axios(config))
          })
        });
        return retryOriginalRequest;
        break;
        default:
        apps.$message.error("failed");
      }
    }else{
      apps.$message.error("failed");
    }
    return Promise.reject(err)
  }
);

//token 
function refreshTokenRequst(){
  const oldRefreshToken = sessionStorage.getItem('refresh_token');
  var url=SERVER_API_URL+"uaa/oauth/token?refresh_token="+oldRefreshToken+"&grant_type=refresh_token";
  const instance = axios.create();
  instance.post(url,{},{
    headers: {
      'Authorization': 'Basic VUk6V0VScU0zWnVORFIxZEhWQw==',
    }
  }).then((response)=>{
    isRefreshingFlag = true;
    store.commit(types.LOGIN,response.data);
    onAccessTokenFetched();
  }).catch(err=>{
    isRefreshingFlag = true;
   // alert(this.$t('lg.loginexpire'));
  // apps.$message.error("this.$t('lg.failed')xxxxx");
  var logoutMes="登录超时，请重新登录";
  if(localStorage.lang=="en"){
    logoutMes="Login timeout, please log in again";
  }else{
    logoutMes="登录超时，请重新登录";
  }
   apps.$message({
      showClose: true,
      message: logoutMes,
      type: 'error',
      duration:6000,
      center:true
    });
    store.commit(types.LOGOUT);
  })
}

//请求
let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach((callback)=>{
    callback();
  })
  subscribers = [];
}


function addSubscriber(callback) {
  subscribers.push(callback)
}

var apps = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
});



