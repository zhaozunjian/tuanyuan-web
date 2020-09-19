<template>
  <mt-tabbar v-model="message" :fixed="flag" v-show="$route.meta.navShow==undefined||$route.meta.navShow">
    <mt-tab-item id="home">
      <img slot="icon" src="../assets/img/app/home.png">
      首页
    </mt-tab-item>
    <mt-tab-item id="business">
      <img slot="icon" src="../assets/img/app/mbmy.png">
      商家
    </mt-tab-item>
    <mt-tab-item id="order">
      <img slot="icon" src="../assets/img/app/order.png">
      订单
    </mt-tab-item>
    <mt-tab-item id="myuser">
      <img slot="icon" src="../assets/img/app/mbmy.png">
      我的
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
  export default {
    name: 'mbhome',
    props: {
      page: String,
      selected: String,
    },
    data() {
      return {
        flag:true,
        message: this.selected
      };
    },
    methods: {},
    watch: {
      message: function(val, oldVal) {
        // 这里就可以通过 val 的值变更来确定去向
        switch (val) {
          case "home":
            this.$router.push({name: 'mbmain'});
            break;
          case "order":
            this.$router.push({name: 'order'});
            break;
          case "business":
            this.$router.push({name: 'business'});
            break;
          case "myuser":
            this.$router.push({name: 'myuser'});
            break;
        }
      }
    },
  };
</script>

<style lang="css" scoped>

</style>
