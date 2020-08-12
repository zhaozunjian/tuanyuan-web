<template>
  <div class="fillcontain">
     <el-row class="chooseTip">
        <el-col :span="24">
            <span>所选择的商品名称: {{this.businessCommodityName}}</span>
        </el-col>
    </el-row>
    <el-form :model="form" ref="form" label-width="120px" class="demo-dynamic">
      <el-form-item>
            <el-select v-model="openDailyLimited">
                <el-option label="关闭每日限量" value="0"></el-option>
                <el-option label="开启每日限量(开启后才可修改限量的数量)" value="1"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="每日限量数" v-show="openDailyLimited==1">
        <el-input-number v-model="dailyLimitedCount" :min="0" :max="99999999"></el-input-number>
      </el-form-item>
      <el-form-item label="最大预约天数" v-show="openDailyLimited==1">
        <el-input-number v-model="dailyLimitedMaxDay" :min="0" :max="99999999"></el-input-number>
      </el-form-item>
      <el-form-item v-show="openDailyLimited==1">
            <el-select v-model="openDailyLimitedUserPurchased">
                <el-option label="关闭用户限购" value="0"></el-option>
                <el-option label="开启用户限购" value="1"></el-option>
            </el-select>
      </el-form-item>
      <el-form-item label="用户每日限购的数量" v-show="openDailyLimited==1 && openDailyLimitedUserPurchased==1">
        <el-input-number v-model="dailyLimitedUserPurchasedCount" :min="0" :max="99999999"></el-input-number>
      </el-form-item>
      <el-form-item>
            <el-button type="primary" @click="submitForm()">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  data() {
    return {
      businessCommodityId: '',
      businessCommodityName: '',
      form: {},
      openDailyLimited: '0',
      dailyLimitedCount: 0,
      dailyLimitedMaxDay: 0,
      openDailyLimitedUserPurchased: '0',
      dailyLimitedUserPurchasedCount: 0
    }
  },
  mounted() {
      this.checkBusinessCommodityId();
      this.initData();
  },
  methods: {
    checkBusinessCommodityId() {
      if (this.$route.query.businessCommodityId) {
        this.businessCommodityId = this.$route.query.businessCommodityId;
        this.businessCommodityName =  this.$route.query.businessCommodityName
      } else {
        this.businessCommodityId = Math.ceil(Math.random() * 10);
        this.$alert("修改商品砍价设置需要选择一个商家,先去选择商家", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/businessList");
          }
        });
      }
    },
    initData() {
        this.initDailyLimitedInfo()
    },
    initDailyLimitedInfo() {
      if (this.$route.query.businessCommodityId) {
        let businessId = this.$route.query.businessId;
        let businessCommodityId = this.$route.query.businessCommodityId;
        let businessCommodityName = this.$route.query.businessCommodityName
        this.$http({
          url: this.$http.adornUrl(`/businessCommodity/findDailyLimited`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.openDailyLimited = String(data.result.openDailyLimited)
            this.dailyLimitedCount = data.result.dailyLimitedCount
            this.dailyLimitedMaxDay = data.result.dailyLimitedMaxDay
            this.openDailyLimitedUserPurchased = String(data.result.openDailyLimitedUserPurchased)
            this.dailyLimitedUserPurchasedCount = data.result.dailyLimitedUserPurchasedCount
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    submitForm() {
      this.$http({
        url: this.$http.adornUrl(`/businessCommodity/updateDailyLimited`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId,
          openDailyLimited: this.openDailyLimited,
          dailyLimitedCount: this.dailyLimitedCount,
          dailyLimitedMaxDay: this.dailyLimitedMaxDay,
          openDailyLimitedUserPurchased: this.openDailyLimitedUserPurchased,
          dailyLimitedUserPurchasedCount: this.dailyLimitedUserPurchasedCount
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          // this.$bus.$emit('refresh')
          this.$router.push({
            path: "businessCommodityList",
            query: {
              businessId: this.$route.query.businessId,
              businessName: this.$route.query.businessName
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      })
    }
  }
};
</script>

<style lang="less">

</style>
