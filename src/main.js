import Vue from 'vue'
import App from '@/App'
import router from '@/router'                 // api: https://github.com/vuejs/vue-router
import store from '@/store'                   // api: https://github.com/vuejs/vuex
import VueCookie from 'vue-cookie'            // api: https://github.com/alfhen/vue-cookie
import '@/element-ui'                         // api: https://github.com/ElemeFE/element
import '@/icons'                              // api: http://www.iconfont.cn/
import '@/element-ui-theme'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/scss/index.scss'
import httpRequest from '@/utils/httpRequest' // api: https://github.com/axios/axios
import { isAuth } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
import '@/assets/scss/common.scss'
import '@/assets/scss/search-bottom.css'
import GlobalApi from './assets/js/common.js'
import TableTreeColumn from '@/components/table-tree-column'
import ChooseAddress from '@/components/ChooseAddress'
import SelectSuperMarket from '@/components/SelectSuperMarket'
import pager from './components/Pager'
import { Calendar } from 'element-ui';
import Amap from 'vue-amap'
import less from 'less'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(Mint);
Vue.use(less)

import 'xe-utils'
import VXETable from 'vxe-table' //可编辑表格
import 'vxe-table/lib/index.css'

import { Timeline,TimelineItem} from 'element-ui';
import hljs from 'highlight.js';
import 'highlight.js/styles/darcula.css'
import Utils from './utils/validate.js';
import storage from 'good-storage'
import { imageServerUrl,imageHttpsServerUrl } from './assets/js/serverConstant'
Vue.prototype.imageServerUrl = imageServerUrl
Vue.prototype.imageHttpsServerUrl = imageHttpsServerUrl

import Vuex from 'vuex'
Vue.use(Vuex);
Vue.use(VueCookie);
Vue.use(Timeline);
Vue.use(TimelineItem)
Vue.use(VXETable)
Vue.use(Calendar)
Vue.use(Amap);
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  setTimeout(() =>{
    blocks.forEach((block)=>{
      hljs.highlightBlock(block)
    })
  }, 200)
})

Vue.config.productionTip = false;

// 非生产环境, 适配mockjs模拟数据                 // api: https://github.com/nuysoft/Mock

if (process.env.NODE_ENV !== 'production') {
  require('@/mock')
}
// 挂载全局
Vue.prototype.$http = httpRequest;

Vue.prototype.isAuth = isAuth;     // 权限方法
Vue.prototype.$GlobalApi = GlobalApi; //公用方法
Vue.prototype.dictionariesData = storage; //缓存方法
Vue.prototype.$Utils = Utils;
import filters  from './assets/js/filters'
//全局挂载过滤器
Object.keys(filters).forEach(key=>{Vue.filter(key,filters[key])})
// 保存整站vuex本地储存初始状态
window.SITE_CONFIG['storeState'] = cloneDeep(store.state);

Vue.component("pager",pager);
Vue.component("ChooseAddress",ChooseAddress);
Vue.component("SelectSuperMarket",SelectSuperMarket);
Vue.component("TableTreeColumn",TableTreeColumn);

Date.prototype.Format = function(fmt)
{
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  mounted() {
    window.addEventListener('beforeunload', e => this.beforeunloadEvent(e))
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadEvent(e))
  },
  methods: {
    beforeunloadEvent(){

    }
  }
})

