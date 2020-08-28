<template>
  <nav :class="'site-navbar--' + navbarLayoutType" class="site-navbar">
    <div class="site-navbar__header">
      <h1 @click="$router.push({ name: 'report-GeneralSituation' })" class="site-navbar__brand">
        <a class="site-navbar__brand-lg" href="javascript:;">
          <img alt="团猿" src="../assets/img/logo_new.png" width="70%"/>
        </a>
        <a class="site-navbar__brand-mini" href="javascript:;">
          <img alt="团猿" src="../assets/img/logo_small.png" width="80%">
        </a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item @click="sidebarFold = !sidebarFold" class="site-navbar__switch" index="5">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>

      <!--<el-menu class="site-navbar__menu site-navbar__menu&#45;&#45;left" mode="horizontal"-->
               <!--style="width: 36vw;height:52px;overflow: auto">-->
        <!--<div style="float: left" v-for="(name,index) in names">-->
          <!--<el-menu-item :class='index==selected?"selected":""' @click="setchangeinfo(index,name.menuId)" index="">-->
            <!--{{name.thisname}}-->
          <!--</el-menu-item>-->
        <!--</div>-->
      <!--</el-menu>-->


      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-menu-item class="site-navbar__avatar sd-sizes" index="3">
          <el-badge :value="$GlobalApi.getUserInfo().usermsg" class="item" v-if="$GlobalApi.getUserInfo().roleId == 10">
            <el-button @click="userSubmit" icon="el-icon-chat-dot-round" size="small" type="text">用户提现</el-button>
          </el-badge>
          <el-badge :value="$GlobalApi.getUserInfo().machmsg" class="item" v-if="$GlobalApi.getUserInfo().roleId == 10">
            <el-button @click="merchanSubmit" icon="el-icon-chat-dot-round" size="small" type="text">商户提现</el-button>
          </el-badge>
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <!--<img :alt="$GlobalApi.getUserInfo().userName" :src="imageServerUrl + $GlobalApi.getUserInfo().avatarUrl">-->
              <span class="sd-name">{{ $GlobalApi.getUserInfo().nickName }}<i class="el-icon-caret-bottom"></i></span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div class="alert">
                <div class="admin-pop">
                  <!--<div class="thumb">-->
                    <!--<div class="el-dropdown-link">-->
                      <!--<img :src="imageServerUrl + $GlobalApi.getUserInfo().avatarUrl">-->
                    <!--</div>-->
                  <!--</div>-->
                  <ul class="info">
                    <li>
                      <span>姓名：</span>
                      <p :title="$GlobalApi.getUserInfo().nickName" class="user-type">
                        {{$GlobalApi.getUserInfo().nickName | ellipsis}}</p>
                    </li>
                    <li>
                      <span>岗位：</span>
                      <p :title="$GlobalApi.getUserInfo().roleId == 10 ? '管理':'运营'" class="user-type">
                        {{$GlobalApi.getUserInfo().roleId == 10 ? '管理':'运营' | ellipsis}}</p>
                    </li>
                  </ul>
                </div>
                <div style="text-align: center;margin-top: 10px;">
                  <div class="changepsd">
                    <a @click="updatePasswordHandle()">修改密码</a>
                  </div>
                  |
                  <div class="getout">
                    <a @click="clearLocal()">清除缓存</a>
                  </div>
                  |
                  <div class="getout">
                    <a @click="logoutHandle()">退出</a>
                  </div>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password ref="updatePassowrd" v-if="updatePassowrdVisible"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import {clearLoginInfo} from '@/utils'
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";

  export default {
    components: {UpdatePassword},
    data () {

      return {
        imageServerUrl: SERVER_CONSTANT.imageServerUrl,
        input: '',
        updatePassowrdVisible: false,
        clubName: '',
        hsnames: '',
        mainsel: '',
        fullscreenLoading: false,
        names: [],
        selected: -1,
        noData: false,
        userInfo: null
      }
    },
    filters: {
      ellipsis (value) {
        if (!value) return ''
        if (value.length > 6) {
          return value.slice(0, 6) + '...'
        }
        return value
      }
    },

    computed: {
      navbarLayoutType: {
        get () {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get () {
          return this.$store.state.common.sidebarFold
        },
        set (val) {
          this.$store.commit('common/updateSidebarFold', val)
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
      userName: {
        get () {
          return this.$store.state.user.name
        }
      },
      menuList: {
        get () {
          return this.$store.state.common.menuList
        },
        set (val) {
          this.$store.commit('common/updateMenuList', val)
        }
      }
    },
    methods: {
      userSubmit(){
        this.$router.push({name:'apply-applyUserWithdraw'})
      },
      merchanSubmit(){
        this.$router.push({name:'apply-applyMerchantWithdraw'})
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.dictionariesData.clear()
              this.$router.push({name: 'login'})
              // if (this.$cookie.isKey("token")) {
              //   this.$cookie.remove('token')
              // }
            }
          })
        }).catch(() => {
        })
      },
      async clearLocal () {
        let UserInfo = this.$GlobalApi.getUserInfo()
        let type = await this.$GlobalApi.confirmMsg('此操作将永久删除当前记录, 是否继续?', '提示', 1)
        if (type == true) {
          this.dictionariesData.clear()
          this.dictionariesData.set('userInfo', UserInfo)
          this.$message.success("清除成功")
        } else {
          this.$message.warning("已取消清除")
        }
      },
      // setchangeinfo: function (index, menuid) {
      //   this.$store.commit('childMenuIdx', index)
      //   this.$store.commit('menuId', menuid)
      //   this.selected = index
      // },
      // getlistname () {
      //   for (var a = 0; this.menuList.length > a; a++) {
      //     this.names.push({thisname: this.menuList[a].mname, menuId: this.menuList[a].menuId})
      //   }
      // },

    }, mounted () {
      // this.getlistname()
      let user = this.$GlobalApi.getUserInfo();
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .chosehs .el-dialog__body {
    padding: 30px 20px !important;
  }

  .el-menu.el-menu--horizontal{
    border-bottom: none;
  }

  .alert {
    width: 250px;
    padding: 10px;
  }

  .el-dropdown-link {
    > img {
      width: 36px;
      height: auto;
      margin-right: 5px;
      border-radius: 100%;
      vertical-align: middle;
    }
  }

  .admin-pop {
    color: #1b1b1b;
    font-size: 14px;
  }

  .admin-pop .thumb {
    height: 114px;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .admin-pop .thumb img {
    height: 74px;
    width: 74px;
    border: 2px solid #ececec;
    border-radius: 50%
  }

  .admin-pop .info {
    background-color: #f4f4f4;
    padding: 8px 20px
  }

  .admin-pop .info li {
    -ms-flex-pack: center;
    justify-content: center;
    -ms-flex-pack: start;
    justify-content: flex-start;
    height: 36px
  }

  .admin-pop .info li .user-type[data-v-6067ea2c], .admin-pop .info li {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center
  }

  .admin-pop .info li .user-type {
    cursor: pointer;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: #fff;
    height: 24px;
    border-radius: 12px;
    padding: 0 14px;
    line-height: 24px;
  }

  .admin-pop .info li .end-date {
    font-weight: 700
  }

  .changepsd {
    display: inline;
    margin-right: 8px;
    cursor: pointer
  }

  .getout {
    display: inline;
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer
  }

  .changepsd:hover {
    color: red;
  }

  .sd-sizes {
    margin-right: 20px;
  }

  .sd-name {
    margin-left: 10px;
  }

  .chosethis {
    width: 12vw;
    height: 35px;
    margin: 8px 0;
    background-color: #52A4EA;
    border-radius: 6px;
    line-height: 35px;
    color: white;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chosethis:hover {
    opacity: 0.9;
  }

  .chosethis > .dingwei {
    color: white;
    font-size: 14px;
    margin: 10px 10px;
    float: left;
  }

  .chosethis i {
    float: right;
    line-height: 33px;
  }

  .chosethis i {
    color: white;
    font-size: 12px;
    margin: 0 10px 3px;
  }

  .selall {
    margin-top: 20px;
    text-align: center;
    max-height: 20%;
  }

  .selall ul {
    width: 100%;
    height: 220px;
    padding-left: 0px;
    overflow: auto;
  }

  .selall ul li {
    width: 46%;
    margin: 3px 2%;
    float: left;
    /*display:block;*/
  }

  .selectcg {
    width: 13vw;
    height: 35px;
    margin: 8px 0;
    background-color: #52A4EA;
    border-radius: 6px;
    line-height: 35px;
    text-align: center;
    color: white;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 5px;
    display: inline-block;
  }

  .selectcgl {
    float: left;
  }

  /*.selectcgr{*/
  /*float: right;*/
  /*}*/
  .selectcg:hover {
    opacity: 0.9;
  }

  .searchtop {
    border-bottom: none !important;
    vertical-align: inherit;
  }

  .el-menu-item.is-active {
    color: #000;
  }

  .selected {
    color: #409EFF !important;
    background-color: #ECF5FF !important;
    border-bottom: 2px solid #409EFF;
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .searchtop .el-input-group__append {
    background-color: #54A3FF;
    border: 1px solid #54A3FF !important;
  }

  .searchtop .el-icon-search {
    color: #fff !important;
    font-weight: bold;
  }

  .chosehs .el-dialog__body {
    padding-top: 10px !important;
  }
</style>
