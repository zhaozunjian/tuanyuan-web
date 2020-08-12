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
  {path: '/login', component: _import('common/login'), name: 'login', meta: {title: '登录'}}
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
      path: '/GeneralSituation',
      component: _import('modules/report/GeneralSituation'),
      name: 'report-GeneralSituation',
      meta: {title: '首页', isTab: true}
      },
    {
      path: '/applyUserWithdraw',
      component: _import('modules/apply/applyUserWithdraw'),
      name: 'apply-applyUserWithdraw',
      meta: {title: '用户提现', isTab: true}
      },
    {
      path: '/applyMerchantWithdraw',
      component: _import('modules/apply/applyMerchantWithdraw'),
      name: 'apply-applyMerchantWithdraw',
      meta: {title: '商户提现', isTab: true}
      },
    {
      path: '/userDetail',
      component: _import('modules/sys/userDetail'),
      name: 'userDetail',
      meta: {title: '用户详情', isTab: true}
      },{
      path: '/UpdateBusiness',
      component: _import('modules/business/UpdateBusiness'),
      name: 'updateBusiness',
      meta: {title: '美食酒店商家详情', isTab: true}
    }
    ,{
      path: '/UpdateBusinessCommodity',
      component: _import('modules/businessCommodity/UpdateBusinessCommodity'),
      name: 'UpdateBusinessCommodity',
      meta: {title: '美食酒店商品详情', isTab: true}
    }
    ,{
      path: '/SysOpertionUserBindBusinessList',
      component: _import('modules/allocation/SysOpertionUserBindBusinessList'),
      name: 'SysOpertionUserBindBusinessList',
      meta: {title: '运营人员关联美食酒店商家', isTab: true}
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
      meta: {title: '修改商家', isTab: true}
    },
    {
      path: '/shoppingDistrictBindBusinessList',
      component: _import('modules/operation/business/shoppingDistrictBindBusinessList'),
      name: 'shoppingDistrictBindBusinessList',
      meta: {title: '商圈列表', isTab: true}
    },
    {
      path: '/BusinessCommodityTagBindBusinessCommodityList',
      component: _import('modules/operation/business/BusinessCommodityTagBindBusinessCommodityList'),
      name: 'BusinessCommodityTagBindBusinessCommodityList',
      meta: {title: '商品标签', isTab: true}
    },
    {
      path: '/BusinessCommodityDailyLimited',
      component: _import('modules/operation/business/BusinessCommodityDailyLimited'),
      name: 'BusinessCommodityDailyLimited',
      meta: {title: '每日限量', isTab: true}
    },
    {
      path: '/BusinessTagBindBusinessList',
      component: _import('modules/operation/business/BusinessTagBindBusinessList'),
      name: 'BusinessTagBindBusinessList',
      meta: {title: '商家标签', isTab: true}
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
      meta: {title: '修改商家商品', isTab: true}
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
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      storage.clear()
      clearLoginInfo()
      next({name: 'login'})
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
      router.push({name: 'login'})
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
