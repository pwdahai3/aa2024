import Vue from 'vue'
import Router from 'vue-router'
//import Home from '@/components/home/home'
//const Home = () => import('@/components/home/home')
//import Autoconfig from '@/components/autoconfig/autoconfig'
//import Config from '@/components/config/config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'*',
      meta:{
        requireAuth:true
      },
      redirect:'/config'
    },
    {
      path: '/login',
      component: resolve => require(['@/components/login/login'], resolve)
    },
    {
      path:'/blank',
      component: resolve => require(['@/components/login/blank'], resolve)
    },
    {
      path: '/layout',
      meta:{
        requireAuth:true,
      },
      component: resolve => require(['@/components/layout/layout'], resolve),
      redirect:'/config',
      children:[
        {//恶意访问地图
          path: '/gr',
          meta:{
            requireAuth:true,
          },
          component: resolve => require(['@/components/shenjitest/shenjitest2'], resolve)
        },
        {//恶意访问地图
          path: '/visit',
          meta:{
            requireAuth:true,
          },
          component: resolve => require(['@/components/home/visit'], resolve)
        },
        {//恶意访问图表
          path: '/visitChart',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/home/visitChart'], resolve)
        },
        {//恶意攻击地图
          path: '/attack',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/home/attack'], resolve)
        },
        {//恶意攻击图表
          path: '/attackChart',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/home/attackChart'], resolve)
        },
        {//性能监控图表
          path: '/dashboard',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/dashboard/dashboard'], resolve)
        },
        {//自定义图表
          path: '/customChartGridLayout',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/dashboard/customChartGridLayout'], resolve)
        },
        {
          path: '/customChartPanel',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/dashboard/customChartPanel'], resolve)
        },
        {//对象发现
          path: '/objUpdate',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/apiConfig/objUpdate'], resolve)
        },
        {//对象发现
          path: '/objUpdate2',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/apiConfig/objUpdate'], resolve)
        },
        {//API状态
          path: '/apiChart',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/apiConfig/apiChart'], resolve)
        },
        // {
        //   path: '/apiUpdate',
        //   meta:{
        //     requireAuth:true
        //   },
        //   component: resolve => require(['@/components/apiConfig/apiUpdate'], resolve)
        // },
        {//自动化配置
          path: '/autoconfig',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/autoconfig/autoconfig'], resolve)
        },
        {
          path: '/autoconfigtree',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/autoconfig/autoconfigtree'], resolve)
        },
        {/////////////////
          path: '/configs91',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/configs9/configs91'], resolve)
        },
        {//快速配置向导
          path: '/quickConfig',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/quickConfig/quickConfig'], resolve)
        },
        {
          path: '/autoquickconfig',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/autoquickconfig/autoquickconfig'], resolve)
        },
        {
          path: '/iconfig',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/iconfig/iconfig'], resolve)
        },
        {
          path: '/iconfigset',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/iconfig/iconfigset'], resolve)
        },
        {//配置
          path: '/config',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/config/configtree'], resolve)
        },
        {
          path: '/apimsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/apimsg/apimsg'], resolve)
        },
        {
          path: '/editpwd',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/pwdedit'], resolve)
        },
        {//uriwhite
          path: '/uriwhite',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/apiConfig/urlwhite'], resolve)
        },
        {//日志
          path: '/logs',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/logs/logs'], resolve)
        },
        {// 基于访问时间
          path: '/behaviortime',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/behavior/behaviortime'], resolve)
        },
        {// 基于访问次数
          path: '/behaviortimes',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/behavior/behaviortimes'], resolve)
        },
        {// 指纹访问记录
          path: '/behaviortkhistory',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/behavior/behaviortkhistory'], resolve)
        },
        {// 自定义查询
          path: '/customQuery',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/behavior/customQuery'], resolve)
        },
        {// 指纹黑名单
          path: '/bwlist',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/behavior/bwlist'], resolve)
        },
        {//邮件报警
          path: '/timingTask',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/alarmTask/timingTask'], resolve)
        },
        {//组件监控
          path: '/cmonitor',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/cmonitor/cmonitor'], resolve)
        },
        {//组件监控
          path: '/shenjitest',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/shenjitest/shenjitest'], resolve)
        },
        {//组件监控
          path: '/xinyus',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/shenjitest/xinyus'], resolve)
        },
        {//ha
          path: '/ha',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/ha'], resolve)
        },
        {//用户管理
          path: '/users',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/users'], resolve)
        },
        {//锁定账号管理
          path: '/lockedAccounts',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/lockedAccounts'], resolve)
        },
        {//License管理
          path: '/license',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/license'], resolve)
        },
        {//License管理
          path: '/imexport',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/imexport'], resolve)
        },
        {//邮件管理
          path: '/mailnotify',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/mailnotify'], resolve)
        },
        {
          path: '/packetcapture',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/packetcapture'], resolve)
        },
        {
          path: '/ntpmsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/ntpmsg'], resolve)
        },
        {
          path: '/radiusmsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/radiusmsg'], resolve)
        },
        {
          path: '/tacacsmsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/tacacsmsg'], resolve)
        },
        {
          path: '/syslogmsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/syslogmsg'], resolve)
        },
        {
          path: '/snmpmsg',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/snmpmsg'], resolve)
        },
        {
          path: '/updateui',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/updateui'], resolve)
        },
        {
          path: '/logbackup',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/logbackup'], resolve)
        },
        {
          path: '/firewall',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/users/firewall'], resolve)
        },
        //~~~~~~!!!!!暂时弃用页面~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      
        //数据可视化
        {
          path: '/chartMenu',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/dataVisualization/chartMenu'], resolve),
          children:[
            {
              path:'areaChart',
              component:resolve => require(['@/components/dataVisualization/areaChart'], resolve),
              meta:{
                requireAuth:true
              }
            },
            {
              path:'pieChart',
              component:resolve => require(['@/components/dataVisualization/pieChart'], resolve),
              meta:{
                requireAuth:true
              }
            },
            {
              path:'lineChart',
              component:resolve => require(['@/components/dataVisualization/lineChart'], resolve),
              meta:{
                requireAuth:true
              }
            },
            {
              path:'heatmapChart',
              component:resolve => require(['@/components/dataVisualization/heatmapChart'], resolve),
              meta:{
                requireAuth:true
              }
            },
            {
              path:'verticalBarChart',
              component:resolve => require(['@/components/dataVisualization/verticalBarChart'], resolve),
              meta:{
                requireAuth:true
              }
            },
            {
              path:'dataTable',
              component:resolve => require(['@/components/dataVisualization/dataTable'], resolve),
              meta:{
                requireAuth:true
              }
            },
          ]
        },

        {//视图记录
          path:'/chartHistory',
          meta:{
            requireAuth:true
          },
          component:resolve => require(['@/components/dataVisualization/chartHistory'], resolve)
        },
        {//机器学习
          path: '/jobManagement',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/zmachine/jobManagement'], resolve)
        },
        {//测试页面1
          path: '/shadowview',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/shadowview/shadowview'], resolve)
        },
        {//测试页面2
          path: '/aa',
          meta:{
            requireAuth:true
          },
          component: resolve => require(['@/components/shadowview/aa'], resolve)
        },
        // 暂时弃用页面end

      ]
    },
  ]
})
