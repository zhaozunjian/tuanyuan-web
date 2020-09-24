/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import {clearLoginInfo} from '@/utils'
import Utils from '../utils/validate'
import storage from 'good-storage'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  {path: '/404', component: _import('common/404'), name: '404', meta: {title: '404未找到'}},
  {path: '/login', component: _import('common/login'), name: 'login', meta: {title: '登录',navShow: false}},
  {path: '/mblogin', component: _import('common/mblogin'), name: 'mblogin', meta: {navShow: false}},
  {path: '/mbmain', component: _import('app/mbmain'), name: 'mbmain', meta: {navShow: true}},
  {path: '/business', component: _import('app/business'), name: 'business', meta: {navShow: true}},
  {path: '/order', component: _import('app/order'), name: 'order', meta: {navShow: true}},
  {path: '/myuser', component: _import('app/myuser'), name: 'myuser', meta: {navShow: true}},
  {path: '/businessEdit', component: _import('app/businessEdit'), name: 'businessEdit', meta: {navShow: false}},

]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: {name: 'report-GeneralSituation'},
  meta: {title: '主入口整体布局'},
  children: [
    // 通过meta对象设置路由展示方式
    // 1. isTab: 是否通过tab展示内容, true: 是, false: 否
    // 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
    // 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
    {
      path: '/report-GeneralSituation',
      component: _import('modules/report/GeneralSituation'),
      name: 'report-GeneralSituation',
      meta: {title: '首页', isTab: true}
      },
    {
      path: '/applyUserWithdraw',
      component: _import('modules/apply/applyUserWithdraw'),
      name: 'applyUserWithdraw',
      meta: {title: '用户提现', isTab: true}
      },
    {
      path: '/OrdersRefundApply',
      component: _import('modules/apply/OrdersRefundApply'),
      name: 'OrdersRefundApply',
      meta: {title: '订单退款', isTab: true}
      },
    {
      path: '/AddHeadquarter',
      component: _import('modules/headquarter/AddHeadquarter'),
      name: 'AddHeadquarter',
      meta: {title: '添加品牌商', isTab: true}
      },
    {
      path: '/UpdateHeadquarter',
      component: _import('modules/headquarter/UpdateHeadquarter'),
      name: 'UpdateHeadquarter',
      meta: {title: '修改品牌商', isTab: true}
      },
    {
      path: '/HeadquarterBindBusinessList',
      component: _import('modules/headquarter/HeadquarterBindBusinessList'),
      name: 'HeadquarterBindBusinessList',
      meta: {title: '商家列表', isTab: true}
      },
    {
      path: '/HeadquarterCutBusinessCommodityList',
      component: _import('modules/headquarter/HeadquarterCutBusinessCommodityList'),
      name: 'HeadquarterCutBusinessCommodityList',
      meta: {title: '商品抽成列表', isTab: true}
      },
    {
      path: '/applyMerchantWithdraw',
      component: _import('modules/apply/applyMerchantWithdraw'),
      name: 'applyMerchantWithdraw',
      meta: {title: '商户提现', isTab: true}
      },
    {
      path: '/ApplyShareHead',
      component: _import('modules/apply/ApplyShareHead'),
      name: 'ApplyShareHead',
      meta: {title: '分销团长申请', isTab: true}
      },
    {
      path: '/BusinessContractTime',
      component: _import('modules/business/BusinessContractTime'),
      name: 'BusinessContractTime',
      meta:{title: '将过期商家列表', isTab: true}
    },{
      path: '/BusinessCommodityContractTime',
      component: _import('modules/business/BusinessCommodityContractTime'),
      name: 'BusinessCommodityContractTime',
      meta:{title: '将过期商品列表', isTab: true}
    },{
      path: '/addDirectStore',
      component: _import('modules/direct/addDirectStore'),
      name: 'addDirectStore',
      meta:{title: '添加直营店', isTab: true}
    },{
      path: '/editDirectStore',
      component: _import('modules/direct/editDirectStore'),
      name: 'editDirectStore',
      meta:{title: '修改直营店', isTab: true}
    }
    ,{
      path: '/directCommodityList',
      component: _import('modules/direct/directCommodityList'),
      name: 'directCommodityList',
      meta:{title: '商品列表', isTab: true}
    }
    ,{
      path: '/directsIncome',
      component: _import('modules/direct/directsIncome'),
      name: 'directsIncome',
      meta:{title: '营业数据', isTab: true}
    },
    {
      path: '/BusinessCommodityExternalSupportList',
      component: _import('modules/business/BusinessCommodityExternalSupportList'),
      name: 'BusinessCommodityExternalSupportList',
      meta:{title: '商品的第三方平台购买支持', isTab: true}
    }
    ,{
      path: '/SysOpertionUserBindBusinessList',
      component: _import('modules/allocation/SysOpertionUserBindBusinessList'),
      name: 'SysOpertionUserBindBusinessList',
      meta: {title: '运营人员关联美食酒店商家', isTab: true}
    }
    ,{
      path: '/SysOperationUserBindHeadquarterList',
      component: _import('modules/allocation/SysOperationUserBindHeadquarterList'),
      name: 'SysOperationUserBindHeadquarterList',
      meta: {title: '运营人员关联品牌商列表', isTab: true}
    }
    ,{
      path: '/addBusiness',
      component: _import('modules/operation/business/addBusiness'),
      name: 'addBusiness',
      meta: {title: '添加商家', isTab: true}
    },
    {
      path: '/updateBusinessOperation',
      component: _import('modules/operation/business/updateBusiness'),
      name: 'updateBusinessOperation',
      meta: {title: '商家详情', isTab: true}
    },
    {
      path: '/shoppingDistrictBindBusinessList',
      component: _import('modules/operation/business/shoppingDistrictBindBusinessList'),
      name: 'shoppingDistrictBindBusinessList',
      meta: {title: '商圈列表', isTab: true}
    },
    {
      path: '/businessIncome',
      component: _import('modules/operation/business/businessIncome'),
      name: 'businessIncome',
      meta: {title: '商家收益', isTab: true}
    },
    {
      path: '/businessList',
      component: _import('modules/operation/business/businessList'),
      name: 'businessList',
      meta: {title: '商家列表', isTab: true}
    },
    {
      path: '/addBusinessCommodity',
      component: _import('modules/operation/business/addBusinessCommodity'),
      name: 'addBusinessCommodity',
      meta: {title: '添加商家商品', isTab: true}
    },
    {
      path: '/updateBusinessCommodityOperation',
      component: _import('modules/operation/business/updateBusinessCommodity'),
      name: 'updateBusinessCommodityOperation',
      meta: {title: '商家商品', isTab: true}
    },
    {
      path: '/updateBusinessCommodityBargain',
      component: _import('modules/operation/business/updateBusinessCommodityBargain'),
      name: 'updateBusinessCommodityBargain',
      meta: {title: '砍价设置', isTab: true}
    },
    {
      path: '/businessCommodityList',
      component: _import('modules/operation/business/businessCommodityList'),
      name: 'businessCommodityList',
      meta: {title: '商品列表', isTab: true}
    },
    {
      path: '/merchantBindMerchantUsersList',
      component: _import('modules/merchant/merchantBindMerchantUsersList'),
      name: 'merchantBindMerchantUsersList',
      meta: {title: '店员列表', isTab: true}
    },
    {
      path: '/addSupermarket',
      component: _import('modules/supermarket/addSupermarket'),
      name: 'addSupermarket',
      meta: {title: '添加超市', isTab: true}
    },
    {
      path: '/updateSupermarket',
      component: _import('modules/supermarket/updateSupermarket'),
      name: 'updateSupermarket',
      meta: {title: '超市详情', isTab: true}
    },
    {
      path: '/supermarketCommodity',
      component: _import('modules/supermarket/supermarketCommodity'),
      name: 'supermarketCommodity',
      meta: {title: '超市商品', isTab: true}
    },
    {
      path: '/updateSupermarketCommodity',
      component: _import('modules/supermarket/updateSupermarketCommodity'),
      name: 'updateSupermarketCommodity',
      meta: {title: '商品详情', isTab: true}
    },
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      storage.clear()
      clearLoginInfo()
      if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        next({name: 'mblogin'})
      }else {
        next({name: 'login'})
      }
    }
    next()
  }
}

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({y: 0}),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (to.name == 'login') {
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
      router.push({ name: 'mblogin'});
    }
  }
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({data}) => {
      if (data && data.code === 0) {
        fnAddDynamicMenuRoutes(data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.permissions || '[]'))
        next({...to, replace: true})
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        router.push({ name: 'mblogin'});
      }else {
        router.push({name: 'login'})
      }
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].mname,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
      // url以http[s]://开头, 通过iframe展示
      if (Utils.isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].url}`) || null
        } catch (e) {
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
      {path: '*', redirect: {name: '404'}}
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
  }
}

export default router
