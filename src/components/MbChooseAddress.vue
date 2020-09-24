<template>
  <div class="fillcontain">
    <div class="container_wrap">
      <div class="gaode_container" ref="gaodeContainer"></div>
    </div>
    <div class="tip">
      <input type="search" id="keyword" name="keyword" placeholder="请输入关键字搜索" value="" onfocus='this.value=""'/>
      <div id="panel"></div>
    </div>
  </div>
</template>

<script>
  import AMap from "AMap"; // 引入高德地图
  export default {
    props: {
      lng: null,
      lat: null,
      initPosition: false,
    },
    data() {
      return {
        flag: false
      };
    },
    mounted() {
      let container = this.$refs.gaodeContainer;
      var map = new AMap.Map(container, {
        zoom:17,
        resizeEnable: true
      });
      let marker;
      AMap.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition:'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(20, 50),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function(status,result){
          if(status=='complete'){
            if (marker) {
              map.remove(marker);
            }
            marker = new AMap.Marker({
              map: map,
              position: new AMap.LngLat(
                result.position
              ) // 经纬度对象
            });
            map.add(marker);
          }
        });
      });
      AMap.plugin('AMap.Marker', function() {
        map.on('click', function(ev) {
          // DOM 被点击时触发，ev 为原生事件
          if (marker) {
            map.remove(marker);
          }
          marker = new AMap.Marker({
            map: map,
            position: new AMap.LngLat(
              ev.lnglat.lng,
              ev.lnglat.lat
            ) // 经纬度对象
          });
          map.add(marker);
        });
      });

      map.on('complete', function(){
        // 地图图块加载完成后触发
      });
    },
    methods: {

    }
  };
</script>
<style lang="less" scoped>
  @import "../assets/scss/mixin";
  .container_wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .gaode_container {
      width: 100%;
      height: 100%;
    }
  }

</style>
<style>
  .tip {
    box-shadow: 3px 4px 3px 0px silver;
    position: absolute;
    top: 50px;
    left: 30px;
    border-radius: 5px;
    overflow: hidden;
    width: 300px;
  }
  .tip input[type="search"] {
    height: 35px;
    width: 300px;
    border: 0;
    padding-left: 10px;
    border-radius: 3px;
    outline: none;
  }

  .tip #panel {
    background-color: white;
    max-height: 450px;
    overflow-y: auto;
    top: 10px;
    width: 300px;
  }
</style>
