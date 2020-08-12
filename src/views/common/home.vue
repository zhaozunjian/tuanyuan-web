<template>
  <div class="mod-home">
    <kuaik></kuaik>
  </div>
</template>
<script>
  import kuaik from '../modules/report/GeneralSituation'
  export default {
    components: {
      'kuaik': kuaik,
    },
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }
</style>
