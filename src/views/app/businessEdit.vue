<template>
  <div class="businessReport">
    <mt-header style="height: 40px;" title="商家信息" fixed>
      <router-link to="" slot="left">
        <mt-button icon="back" @click="$router.back(-1)"></mt-button>
      </router-link>
    </mt-header>
    <mt-field style="margin-top: 40px;" label="商家名称" placeholder="请选择商家名称" type="text" v-model="business.businessName"></mt-field>
    <mt-field label="商家简介" placeholder="请选择商家简介" type="text" v-model="business.businessDescription"></mt-field>
    <mt-field label="商家标语" placeholder="请选择商家标语" type="text" v-model="business.businessTitle"></mt-field>
    <mt-field label="联系电话" placeholder="请选择联系电话" type="text" v-model="business.businessContactPhone"></mt-field>
    <mt-field label="商家详情url" placeholder="请选择商家详情url" type="text" v-model="business.detailContentUrl"></mt-field>
    <mt-field label="推荐权重值" placeholder="请选择推荐权重值" type="text" v-model="priority" @click.native="priorityflag = true"></mt-field>
    <mt-field label="商家类别" placeholder="请选择商家类别" type="text" v-model="questionType" @click.native="popupVisible = true"></mt-field>
    <mt-button @click.native="openMap = true">选择位置</mt-button>






    <mt-popup v-model="popupVisible" popup-transition="popup-fade" closeOnClickModal="true" position="bottom" style="width: 100%">
      <mt-picker :slots="categoryData"  showToolbar ref="pick" style="width: 100%" value-key="cname">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="popupVisible = !popupVisible">取消</div>
          <div class="">请选择商家类别</div>
          <div class="usi-btn-sure" @click="popupOk(1)">确定</div>
        </div>
      </mt-picker>
    </mt-popup>
    <mt-popup v-model="priorityflag" popup-transition="popup-fade" closeOnClickModal="true" position="bottom" style="width: 100%">
      <mt-picker :slots="businessPriorityOptions"  showToolbar ref="pickPrior" style="width: 100%" value-key="label">
        <div class="picker-toolbar-title">
          <div class="usi-btn-cancel" @click="priorityflag = !priorityflag">取消</div>
          <div class="">请选择权重值</div>
          <div class="usi-btn-sure" @click="popupOkPrior(1)">确定</div>
        </div>
      </mt-picker>
    </mt-popup>

    <mt-popup v-model="openMap" popup-transition="popup-fade" close-on-click-modal="false" style="width: 100%;">
      <div style="width: 100%;height: 100vh;">
        <div style="width: 100%;height: 100%;">
          <mb-choose-address
            @confirmAddress="confirmAddressHandle"
            @giveUpChoose="giveUpChooseHandle"
            :lng="business.lng"
            :lat="business.lat"
            :initPosition="true"/>
        </div>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;">
          <mt-button size="large" style="width:100px;margin-right: 10px;" @click="openMap = false">取消</mt-button>
          <mt-button size="large" style="width:100px;margin-left: 10px;" type="primary">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
    export default {
      name: "businessEdit",
      data(){
          return{
            openMap:false,
            businessCategoryOptions:[],
            activated:'',
            questionType:'',//当前问题类型
            popupVisible:false,//分类弹框
            priorityflag:false,//权重值弹框
            priority:'',
            business:{
              businessName:'',
              businessDescription:'',
              businessTitle:'',
              businessContactPhone:'',
              detailContentUrl:'',
              priority:'',
              businessCategoryId:'',
              lng: "",
              lat: "",
              adCode: "",
              cityCode: "",
              addressProbably: "",
              addressSpecific: "",
            }
          }
      },
      computed:{
        categoryData() {
          let temp = [];
          let dataSlot = [{
            flex:1,
            values: temp,
            className:'slot1',
            textAlign: 'center'
          }];
          this.$http({
            url: this.$http.adornUrl('/sys/businessCategory/findAll'),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.businessCategoryOptions = data.result;
              for (let i = 0; i < data.result.length; i++) {
                temp.push({
                  cname: data.result[i].label,
                  id: data.result[i].value
                })
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          return dataSlot;
        },
        businessPriorityOptions() {
          let temp = [{
            value: 1,
            label: "一级"
          },
            {
              value: 2,
              label: "二级"
            },
            {
              value: 3,
              label: "三级"
            },
            {
              value: 4,
              label: "四级"
            },
            {
              value: 5,
              label: "五级(默认)"
            },
            {
              value: 6,
              label: "六级"
            },
            {
              value: 7,
              label: "七级"
            },
            {
              value: 8,
              label: "八级"
            },
            {
              value: 9,
              label: "九级"
            },
            {
              value: 10,
              label: "十级"
            }];
          let dataSlot = [{
            flex:1,
            values: temp,
            className:'slot1',
            textAlign: 'center'
          }];
          return dataSlot;
        }
      },
      mounted(){
      },
      methods: {
        // 分类类型弹框点击确认
        popupOk(index){
          if (index == 1){
            this.popupVisible = false;
            var current = this.$refs.pick.getValues()[0];
            this.questionType = current.cname;
            this.business.businessCategoryId = current.id
          }
        },
        //权重值
        popupOkPrior(index){
          if (index == 1){
            this.priorityflag = false;
            var current = this.$refs.pickPrior.getValues()[0];
            this.business.priority = current.value;
            this.priority = current.label;
          }
        },
        confirmAddressHandle(lng, lat, formattedAddress, lnglatResult) {
          this.business.lng = lng;
          this.business.lat = lat;
          this.business.adCode = lnglatResult.regeocode.addressComponent.adcode;
          this.business.cityCode = lnglatResult.regeocode.addressComponent.citycode;
          this.gaodeLocation.formattedAddress = formattedAddress;
          this.gaodeLocation.lnglatResult = lnglatResult;
          this.business.addressProbably = formattedAddress;
          this.switchOpenMap();
        },
        giveUpChooseHandle() {
          this.switchOpenMap();
        },
        switchOpenMap() {
          this.openMap = !this.openMap;
        },
      },
    }
</script>

<style lang="less" scoped>

  .businessReport{
    overflow-y: scroll;
    height: calc(100vh - 5.5rem);
  }
  /**问题类型弹框样式 */
  .picker-toolbar-title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #eee;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    .usi-btn-cancel,.usi-btn-sure{
      color:#26a2ff;
      font-size: 16px;
    }
  }
</style>
