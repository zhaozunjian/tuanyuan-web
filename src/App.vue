<template>
  <div id="app" v-if="flag">
    <div>
      <router-view/>
    </div>
    <Tabbar :selected="selected" style="height: 55px;"></Tabbar>
  </div>
  <transition name="fade" v-else="flag">
    <router-view v-if="isRouterRlive"></router-view>
  </transition>
</template>

<script>
  import Tabbar from "./components/mbhome";
  export default {
    name:'App',
    provide(){
      return {
        reload:this.reload
      }
    },
    components: {
      Tabbar
    },
    data(){
      return{
        timer:0,
        isRouterRlive:true,
        selected:"home",
        flag: false,
      }
    },
    mounted(){
      if (this._isMobile()) {
        this.$router.push({name: 'mblogin'});
      } else {
        this.$router.push({name: 'login'});
      }
    },
    created(){
      if (this._isMobile()){
        this.timer = setInterval(() => {
          this.getMessage()
        }, 10000)
      }
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    methods:{
      _isMobile() {
        this.flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return this.flag;
      },
      getMessage(){
        if (this.$GlobalApi.getUserInfo() === undefined){
          return;
        }
        this.$http({
          url: this.$http.adornUrl('/message/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            localStorage.setItem("messageInfo", JSON.stringify(data.vo))
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      reload(){
        this.isRouterRlive = false
        this.$nextTick(function () {
          this.isRouterRlive = true
        })
      }
    }
  }
</script>
