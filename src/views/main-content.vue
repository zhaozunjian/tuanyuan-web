<template>
  <main :class="{ 'site-content--tabs': $route.meta.isTab }" class="site-content">
    <!-- 主入口标签页 s -->
    <el-tabs
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
      type="card"
      v-if="$route.meta.isTab"
      v-model="mainTabsActiveName">
      <el-dropdown :show-timeout="0" class="site-tabs__tools">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部</el-dropdown-item>
          <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-tab-pane
        :key="item.name"
        :label="item.title"
        :name="item.name"
        :closable="item.name === 'report-GeneralSituation' ? false : true"
        style="min-width: 200px"
        v-for="item in mainTabs">
        <el-card :body-style="siteContentViewHeight" class="indexcard">
          <iframe
            :src="item.iframeUrl"
            frameborder="0"
            height="100%" scrolling="yes" v-if="item.mtype === 'iframe'" width="100%">
          </iframe>
          <keep-alive v-else>
            <router-view v-if="item.name === mainTabsActiveName"/>
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card :body-style="siteContentViewHeight" class="indexcard" v-else>
      <div id="loadingArea">
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </el-card>
  </main>
</template>

<script>
  export default {
    data () {
      return {}
    },
    provide () {
      return {
        reload: this.tabsRefreshCurrentHandle
      }
    },
    computed: {
      documentClientHeight: {
        get () {
          return this.$store.state.common.documentClientHeight
        }
      },
      menuActiveName: {
        get () {
          return this.$store.state.common.menuActiveName
        },
        set (val) {
          this.$store.commit('common/updateMenuActiveName', val)
        }
      },
      mainTabs: {
        get () {
          return this.$store.state.common.mainTabs
        },
        set (val) {
          this.$store.commit('common/updateMainTabs', val)
        }
      },
      mainTabsActiveName: {
        get () {
          return this.$store.state.common.mainTabsActiveName
        },
        set (val) {
          this.$store.commit('common/updateMainTabsActiveName', val)
        }
      },
      siteContentViewHeight () {
        var height = this.documentClientHeight - 50 - 15
        if (this.$route.meta.isTab) {
          height -= 40
          return this.$Utils.isURL(this.$route.meta.iframeUrl) ? {
            height: height + 'px',
            padding: '10px'
          } : {height: height + 'px', overflowY: 'auto', padding: '10px'}
        }
        return {height: height + 'px', overflowY: 'auto', padding: '10px'}
      }
    },
    methods: {
      // tabs, 选中tab
      selectedTabHandle (tab) {
        tab = this.mainTabs.filter(item => item.name === tab.name)
        if (tab.length >= 1) {
          this.$router.push({ name: tab[0].name })
        }
      },
      // tabs, 删除tab
      removeTabHandle (tabName) {
        if (tabName == 'report-GeneralSituation') {
          return false
        } else {
          this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
          if (this.mainTabs.length >= 1) {
            // 当前选中tab被删除
            if (tabName === this.mainTabsActiveName) {
              this.$router.push({name: this.mainTabs[this.mainTabs.length - 1].name}, () => {
                this.mainTabsActiveName = this.$route.name
              })
            }
          } else {
            this.menuActiveName = ''
            this.$router.push({name: 'report-GeneralSituation'})
          }
        }
      },
      // tabs, 关闭当前
      tabsCloseCurrentHandle () {
        this.removeTabHandle(this.mainTabsActiveName)
      },
      // tabs, 关闭其它
      tabsCloseOtherHandle () {
        this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
      },
      // tabs, 关闭全部
      tabsCloseAllHandle () {
        if (this.mainTabs.length > 1){
          this.mainTabs = []
          this.menuActiveName = ''
        }
        this.$router.push({name: 'report-GeneralSituation'})
      },
      // tabs, 刷新当前
      tabsRefreshCurrentHandle (){
        var tempTabName = this.mainTabsActiveName;
        var activeTab = this.mainTabs.filter(item => item.name === tempTabName);
        this.removeTabHandle(tempTabName)
        this.$nextTick(() => {
          this.$router.push({ name: tempTabName, params:activeTab[0].params, query:activeTab[0].query })
        })
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .el-tab-pane {
    margin: 0 0;
  }
</style>
