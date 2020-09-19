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
    created() {
    },
    mounted() {
      let that = this;
      let container = this.$refs.gaodeContainer;
      var map = new AMap.Map(container, {
        resizeEnable: true
      });
      map.plugin(
        [
          "AMap.Autocomplete",
          "AMap.ContextMenu",
          "AMap.Marker",
          "AMap.LngLat",
          "AMap.PlaceSearch",
          "AMap.InfoWindow",
          "AMap.Geocoder"
        ],
        function() {
          document.oncontextmenu = function(){
            return false;
          }
          var aMapGeocoder = new AMap.Geocoder();
          let contextMenu = new AMap.ContextMenu();
          let marker;
          let contextMenuPositon;
          if (that.initPosition) {
            marker = new AMap.Marker({
              position: new AMap.LngLat(
                that.lng,
                that.lat
              ) // 经纬度对象
            });
            map.add(marker);
            // result为对应的地理位置详细信息
            // 获取marker对象中的地理位置值
            aMapGeocoder.getAddress(marker.getPosition(), function(status, result) {
              if (status === "complete" && result.info === "OK") {
                // result为对应的地理位置详细信息
                document.getElementById('keyword').value=result.regeocode.formattedAddress;
                placeSearch.search(result.regeocode.formattedAddress);
              }
            });
          }
          //搜索
          var autoOptions = {
            city: map.getAdcode(), //城市，默认全国
            input: "keyword"//使用联想输入的input的id
          };
          var autocomplete = new AMap.Autocomplete(autoOptions);
          var placeSearch = new AMap.PlaceSearch({
            pageSize: 4, // 单页显示结果条数
            pageIndex: 1, // 页码
            city: map.getAdcode(),
            citylimit: true,
            map: map,
            panel: "panel", // 结果列表将在此容器中进行展示。
            autoFitView: true
          })
          AMap.event.addListener(autocomplete, "select", function(e){
            // placeSearch.setCity(e.poi.adcode);
            placeSearch.setCityLimit(true);
            placeSearch.search(e.poi.name);
          });
          var btn = document.getElementById("keyword")
          // 绑定事件
          AMap.event.addDomListener(btn, "click", function(ev) {
            // DOM 被点击时触发，ev 为原生事件
            if (document.getElementById('keyword').value == ''){
              placeSearch.clear();
              map.clearMap();
            }
          });

          //marker改变触发
          AMap.event.addListener(placeSearch, "selectChanged", function(e){
            if (marker) {
              map.remove(marker);
            }
            marker = new AMap.Marker({
              map: map,
              position: new AMap.LngLat(
                e.selected.data.location.lng,
                e.selected.data.location.lat
              ) // 经纬度对象
            });
            map.add(marker);
          });

          //右键添加Marker标记
          contextMenu.addItem(
            "标记该位置",
            function(e) {
              // map.clearMap();
              // placeSearch.clear();
              // if (marker) {
              //   map.remove(marker);
              // }
              // marker = new AMap.Marker({
              //   map: map,
              //   position: contextMenuPositon //基点位置
              // });
              // map.add(marker);
              let lng = contextMenuPositon.getLng()
              let lat = contextMenuPositon.getLat()
              let lnglat = [lng, lat];
              // result为对应的地理位置详细信息
              // 获取marker对象中的地理位置值
              aMapGeocoder.getAddress(lnglat, function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  // result为对应的地理位置详细信息
                  document.getElementById('keyword').value=result.regeocode.formattedAddress;
                  placeSearch.search(result.regeocode.formattedAddress);
                }
              });
            },
            3
          );
          contextMenu.addItem("删除标记", function(e) {
            map.remove(marker);
            marker = null;
          });
          contextMenu.addItem("确认位置", function(e) {
            that
              .$confirm("确认该位置并返回编辑?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                if (!marker) {
                  that.$message.error("没有选择标记位置");
                }
                let lng = marker.w.position.lng
                let lat = marker.w.position.lat;
                let lnglat = [lng, lat];
                // result为对应的地理位置详细信息
                // 获取marker对象中的地理位置值
                aMapGeocoder.getAddress(lnglat, function(status, result) {
                  if (status === "complete" && result.info === "OK") {
                    // result为对应的地理位置详细信息
                    that.$emit(
                      "confirmAddress",
                      lng,
                      lat,
                      result.regeocode.formattedAddress,
                      result
                    );
                  }
                });
              })
              .catch(() => {});
          });
          contextMenu.addItem("放弃并返回编辑", function(e) {
            that.$emit("giveUpChoose");
          });
          //地图绑定鼠标右击事件——弹出右键菜单
          map.on("rightclick", function(e) {
            contextMenu.open(map, e.lnglat);
            contextMenuPositon = e.lnglat;
          });
          map.addControl(new AMap.ContextMenu());
        }
      );
      map.on("click", this.clickHandler);
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
    top: 20px;
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
