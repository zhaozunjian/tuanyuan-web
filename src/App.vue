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
        isRouterRlive:true
      }
    },
    methods:{
      reload(){
        this.isRouterRlive = false
        this.$nextTick(function () {
          this.isRouterRlive = true
        })
      }
    }
  }
</script>
