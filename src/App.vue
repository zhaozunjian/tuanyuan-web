<template>
  <transition name="fade">
    <router-view v-if="isRouterRlive"></router-view>
  </transition>
</template>

<script>
  export default {
    name:'App',
    provide(){
      return {
        reload:this.reload
      }
    },
    data(){
      return{
        timer:0,
        isRouterRlive:true
      }
    },
    created(){
      this.timer = setInterval(() => {
        this.getMessage()
      }, 3000)
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    methods:{
      getMessage(){
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
