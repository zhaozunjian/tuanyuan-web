<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-date-picker
          v-model="chooseTimes"
          type="daterange"
          align="left" size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button @click="handleClick()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>
      <el-form ref="form" :model="ordersBusinessReportData" label-width="200px" class="form box">
        <el-form-item>
          <span>基本信息</span>
        </el-form-item>
        <el-form-item label="订单总数量">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersCount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="订单总用户实付金额">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersPaymentAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="订单总商户营业额(成本价)">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersObtainMerchantAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="订单总基本利润">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersBasicProfit" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>积分</span>
        </el-form-item>
        <el-form-item label="订单总消费积分">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersSpendIntegral" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="订单总积分抵扣的金额">
          <el-input v-model="ordersBusinessReportData.theTimeOrdersDiscountBonusAmount" :disabled="isChange"> </el-input>
        </el-form-item>
        <el-form-item label="订单总返还的积分">
          <el-input v-model="ordersBusinessReportData.theTimeReturnUsersIntegral" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>分享与上下级</span>
        </el-form-item>
        <el-form-item label="订单总返还分享金额">
          <el-input v-model="ordersBusinessReportData.theTimeReturnUsersShareAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="订单总返还的上下级金额">
          <el-input v-model="ordersBusinessReportData.theTimeReturnUsersRelatedAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>基本利润减去各项后的利润</span>
        </el-form-item>
        <el-form-item label="减去积分抵扣,分享,上下级">
          <el-input v-model="ordersBusinessReportData.theTimeNoIntegralAndShareAndRelatedAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="再减去总返还积分(积分比例按照目前设置的比例)">
          <el-input v-model="ordersBusinessReportData.theTimeNoIntegralAndShareAndRelatedAndReturnIntegralAmount" :disabled="isChange"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name:'OrdersBusinessReportData',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      chooseTimes: [],
      isChange: true,
      ordersBusinessReportData: {
        theTimeOrdersCount: 0,
        theTimeOrdersDiscountBonusAmount: 0,
        theTimeOrdersObtainMerchantAmount: 0,
        theTimeOrdersPaymentAmount: 0,
        theTimeOrdersBasicProfit: 0,
        theTimeOrdersSpendIntegral: 0,
        theTimeReturnUsersIntegral: 0,
        theTimeReturnUsersRelatedAmount: 0,
        theTimeReturnUsersShareAmount: 0,
        theTimeNoIntegralAndShareAndRelatedAmount: 0,
        theTimeNoIntegralAndShareAndRelatedAndReturnIntegralAmount: 0
      }
    }
  },
  methods: {
      handleClick() {
        this.initReportData()
      },
      initReportData() {
          if (this.chooseTimes != null && this.chooseTimes != '') {
            let startTime = this.chooseTimes[0]
            let endTime = this.chooseTimes[1]
            this.$http({
              url: this.$http.adornUrl('/report/ordersBusiness/history'),
              method: 'get',
              params: this.$http.adornParams({
                startTime: startTime,
                endTime: endTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.ordersBusinessReportData = data.result
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
