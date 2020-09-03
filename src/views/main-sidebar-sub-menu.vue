<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <span>{{ menu.mname }}</span>
      <el-badge class="mark" :value="message.totleCount" :max="99" v-if="menu.mname === '消息管理' && message.totleCount != 0"></el-badge>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes"
      :title="item.mname">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <span>{{ menu.mname }}</span>
    <el-badge class="mark" :value="message.storeCount" :max="99" v-if="menu.mname === '分销团长' && message.storeCount != 0"></el-badge>
    <el-badge class="mark" :value="message.orderCount" :max="99" v-if="menu.mname === '订单退款' && message.orderCount != 0"></el-badge>
    <el-badge class="mark" :value="message.agencyCount" :max="99" v-if="menu.mname === '代理加盟' && message.agencyCount != 0"></el-badge>
    <el-badge class="mark" :value="message.agentCount" :max="99" v-if="menu.mname === '店家入驻' && message.agentCount != 0"></el-badge>
    <el-badge class="mark" :value="message.userCount" :max="99" v-if="menu.mname === '用户提现' && message.userCount != 0"></el-badge>
    <el-badge class="mark" :value="message.merchantCount" :max="99" v-if="menu.mname === '商户提现' && message.merchantCount != 0"></el-badge>
    <el-badge class="mark" :value="message.feedbackCount" :max="99" v-if="menu.mname === '用户反馈' && message.feedbackCount != 0"></el-badge>
    <el-badge class="mark" :value="message.businessCount" :max="99" v-if="menu.mname === '将过期的商家' && message.businessCount != 0"></el-badge>
    <el-badge class="mark" :value="message.commondityCount" :max="99" v-if="menu.mname === '将过期的商品' && message.commondityCount != 0"></el-badge>
  </el-menu-item>
</template>
<script>
  import SubMenu from './main-sidebar-sub-menu'
  export default {
    name: 'sub-menu',
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      }
    },
    data(){
      return{
        timer:0,
        message: JSON.parse(localStorage.getItem("messageInfo"))
      }
    },
    created(){
      this.timer = setInterval(() => {
        this.message = JSON.parse(localStorage.getItem("messageInfo"))
      }, 0)
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
      }
    }
  }
</script>
