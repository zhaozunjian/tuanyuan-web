<template>
  <el-form :model="business" ref="business" label-width="150px">
    <el-form-item label="商家名称" prop="businessName">
      <span>{{ business.businessName }}</span>
    </el-form-item>
    <el-form-item label="商家标语" prop="businessTitle">
      <span>{{ business.businessTitle }}</span>
    </el-form-item>
    <el-form-item label="商家描述" prop="businessDescription">
      <span>{{ business.businessDescription }}</span>
    </el-form-item>
    <el-form-item label="联系电话" prop="businessContactPhone">
      <span>{{ business.businessContactPhone }}</span>
    </el-form-item>
    <el-form-item label="商家详情url" prop="detailContentUrl">
      <span>{{ business.detailContentUrl }}</span>
    </el-form-item>
    <el-form-item label="推荐权重值">
      <span>{{ business.priority }}</span>
    </el-form-item>
    <el-form-item label="商家类别">
      <span>{{this.business.businessRootCategoryName!=''?this.business.businessRootCategoryName+'/':''+ this.business.businessCategoryName}}</span>
    </el-form-item>
    <el-form-item label="选择地理位置" prop>
      <el-row>
        <el-col :span="12">
          <span>经度: {{this.business.lng}}</span>
        </el-col>
        <el-col :span="12">
          <span>纬度: {{this.business.lat}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span>城市编码: {{this.business.cityCode}}</span>
        </el-col>
        <el-col :span="12">
          <span>区域编码: {{this.business.adCode}}</span>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="大体地址(区域)" prop="addressProbably">
      <span>{{this.business.addressProbably}}</span>
    </el-form-item>
    <el-form-item label="具体地址(门牌号)" prop="addressSpecific">
      <span>{{this.business.addressSpecific}}</span>
    </el-form-item>
    <el-form-item label="周营业时间" prop="weekTimes">
      <el-checkbox-group
        v-model="business.weekOperateTime"
      >
        <el-checkbox
          v-for="week in weeks"
          :label="week.value"
          :key="week.value"
        >{{week.name}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item
      v-for="(dayOperateTimeItem, index) in business.dayOperateTimeList"
      :label="'日营业时段' + (index+1)"
      :key="index"
    >
      <el-time-select
        placeholder="起始时间"
        v-model="dayOperateTimeItem.startTime"
        :picker-options="{
							start: '00:00',
							step: '00:30',
							end: '24:00'
							}"
      ></el-time-select>到
      <el-time-select
        placeholder="结束时间"
        v-model="dayOperateTimeItem.endTime"
        :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
      ></el-time-select>
    </el-form-item>
    <el-form-item label="人均消费">
      <span>{{this.business.averagePrice}}</span>
    </el-form-item>
    <el-form-item label="最大配送距离(单位: km)">
      <span>{{this.business.deliveryDistance}}</span>
    </el-form-item>
    <el-form-item label="起送费(最低消费)">
      <span>{{this.business.minStartDeliveryFee}}</span>
    </el-form-item>
    <el-form-item label="商家头像">
      <img v-if="businessAvatar" :src="businessAvatar" class="businessAvatar" />
    </el-form-item>
    <el-form-item label="商家详情图片">
      <img v-if="businessDetailImage" :src="businessDetailImage" class="businessDetailImage" />
    </el-form-item>
  </el-form>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";
const weekOptions = [
  {
    name: "周一",
    value: 1
  },
  {
    name: "周二",
    value: 2
  },
  {
    name: "周三",
    value: 3
  },
  {
    name: "周四",
    value: 4
  },
  {
    name: "周五",
    value: 5
  },
  {
    name: "周六",
    value: 6
  },
  {
    name: "周日",
    value: 7
  }
];
export default {
  name: 'UpdateBusiness',
  data() {
    return {
      weeks: weekOptions,
      business: {
        weekOperateTime: []
      },
      businessAvatar: '',
      businessDetailImage: ''
    }
  },
  activated() {
    this.initData();
  },
  methods: {
    initData() {
      this.initBusiness()
    },
    initBusiness() {
      let businessId = this.$route.query.businessId;
      if (this.$route.query.businessId) {
        this.$http({
          url: this.$http.adornUrl(`/business/info`),
          method: 'get',
          params: this.$http.adornParams({
            businessId: businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let resDayOperateTimeList = data.result.dayOperateTimeList
            this.business = data.result;
            this.business.dayOperateTimeList = []
            resDayOperateTimeList.forEach(item => {
              let arr = item.split('-', 2)
              this.business.dayOperateTimeList.push({
                startTime: arr[0],
                endTime: arr[1]
              })
            })
            this.businessAvatar =
              SERVER_CONSTANT.imageServerUrl + data.result.businessAvatar;
            this.businessDetailImage =
              SERVER_CONSTANT.imageServerUrl + data.result.detailUrlList[0];
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    }
  }
};
</script>

<style>

</style>
