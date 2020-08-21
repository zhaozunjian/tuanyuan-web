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
        <el-button @click="initReportData()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">用户总和统计</span>
        </el-form-item>
        <el-form-item label="新注册的用户数量">
          <el-input v-model="reportData.newRegisterUsersCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="非邀请码注册的用户数量">
          <el-input v-model="reportData.newRegisterNoInviteCodeUsersCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="邀请码注册的用户数量">
          <el-input v-model="reportData.newRegisterByInviteCodeUsersCount" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">用户提现统计</span>
        </el-form-item>
        <el-form-item label="总申请数量">
          <el-input v-model="reportData.totalNumberUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请中的数量">
          <el-input v-model="reportData.applyingNumberUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请中的总提现金额">
          <el-input v-model="reportData.applyingWithdrawAmountUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="已同意的数量">
          <el-input v-model="reportData.agreeNumberUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="已同意的总提现金额">
          <el-input v-model="reportData.agreeWithdrawAmountUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="已拒绝的数量">
          <el-input v-model="reportData.refuseNumberUser" disabled></el-input>
        </el-form-item>
        <el-form-item label="已拒绝的总提现金额">
          <el-input v-model="reportData.refuseWithdrawAmountUser" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">商户提现统计</span>
        </el-form-item>
        <el-form-item label="总申请数量">
          <el-input v-model="reportData.totalNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请中的数量">
          <el-input v-model="reportData.applyingNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="申请中的总提现金额">
          <el-input v-model="reportData.applyingWithdrawAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="已同意的数量">
          <el-input v-model="reportData.agreeNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="已同意的总提现金额">
          <el-input v-model="reportData.agreeWithdrawAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="已拒绝的数量">
          <el-input v-model="reportData.refuseNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="已拒绝的总提现金额">
          <el-input v-model="reportData.refuseWithdrawAmount" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">订单总和统计</span>
        </el-form-item>
        <el-form-item label="订单总数量">
          <el-input v-model="reportData.theTimeOrdersCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单总用户实付金额">
          <el-input v-model="reportData.theTimeOrdersPaymentAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单总商户营业额">
          <el-input v-model="reportData.theTimeOrdersObtainMerchantAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单总基本利润">
          <el-input v-model="reportData.theTimeOrdersBasicProfit" disabled></el-input>
        </el-form-item>
        <el-form-item style="display: block">
          <span style="font-size: 13px;font-weight: 500;margin-left: 20px">积分</span>
        </el-form-item>
        <el-form-item label="订单总消费积分">
          <el-input v-model="reportData.theTimeOrdersSpendIntegral" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单总积分抵扣的金额">
          <el-input v-model="reportData.theTimeOrdersDiscountBonusAmount" disabled> </el-input>
        </el-form-item>
        <el-form-item label="订单总返还的积分">
          <el-input v-model="reportData.theTimeReturnUsersIntegral" disabled></el-input>
        </el-form-item>
        <el-form-item style="display: block">
          <span style="font-size: 13px;font-weight: 500;margin-left: 20px">分享与上下级</span>
        </el-form-item>
        <el-form-item label="订单总返还分享金额">
          <el-input v-model="reportData.theTimeReturnUsersShareAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="订单总返还的上下级金额">
          <el-input v-model="reportData.theTimeReturnUsersRelatedAmount" disabled></el-input>
        </el-form-item>
        <el-form-item style="display: block">
          <span style="font-size: 13px;font-weight: 500;margin-left: 20px">基本利润减去各项后的利润</span>
        </el-form-item>
        <el-form-item label="减去积分抵扣,分享,上下级">
          <el-input v-model="reportData.theTimeNoIntegralAndShareAndRelatedAmount" disabled></el-input>
        </el-form-item>
        <el-form-item label="再减去总返还积分(积分比例按照目前设置的比例)">
          <el-input v-model="reportData.theTimeNoIntegralAndShareAndRelatedAndReturnIntegralAmount" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">商家总和统计</span>
        </el-form-item>
        <el-form-item label="新创建的商家数量">
          <el-input v-model="reportData.newCreateBusinessCount" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :inline="true" :model="reportData" label-width="160px">
        <el-form-item style="display: block">
          <i class="el-icon-document"></i>
          <span class="title">商品总和统计</span>
        </el-form-item>
        <el-form-item label="新创建的商品数量">
          <el-input v-model="reportData.newCreateBusinessCommodityCount" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
    export default {
      name: "ReportTotle",
      data(){
        return{
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
          reportData: {
            newRegisterUsersCount: 0,
            newRegisterByInviteCodeUsersCount: 0,
            newRegisterNoInviteCodeUsersCount: 0,
            totalNumberUser: 0,
            applyingNumberUser: 0,
            applyingWithdrawAmountUser: 0,
            agreeNumberUser: 0,
            agreeWithdrawAmountUser: 0,
            refuseNumberUser: 0,
            refuseWithdrawAmountUser: 0,
            totalNumber: 0,
            applyingNumber: 0,
            applyingWithdrawAmount: 0,
            agreeNumber: 0,
            agreeWithdrawAmount: 0,
            refuseNumber: 0,
            refuseWithdrawAmount: 0,
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
            theTimeNoIntegralAndShareAndRelatedAndReturnIntegralAmount: 0,
            newCreateBusinessCommodityCount: 0,
            newCreateBusinessCount: 0
          }
        }
      },
      mounted(){

      },
      methods: {
        initReportData() {
          if (this.chooseTimes != null && this.chooseTimes != '') {
            let startTime = this.chooseTimes[0]
            let endTime = this.chooseTimes[1]
            this.$http({
              url: this.$http.adornUrl('/report/totle'),
              method: 'get',
              params: this.$http.adornParams({
                startTime: startTime,
                endTime: endTime
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.reportData = data.result
              } else {
                this.$message.error(data.msg);
              }
            })
          }
        }
      }
    }
</script>

<style scoped>
  .title{
    font-size: 15px;
    font-weight: 700;
  }
</style>
