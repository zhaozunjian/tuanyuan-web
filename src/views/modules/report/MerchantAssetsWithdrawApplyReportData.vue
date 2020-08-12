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
      <el-form ref="form" :model="merchantAssetsWithdrawApplyReportData" label-width="200px" class="form box">
        <el-form-item>
          <span>总和</span>
        </el-form-item>
        <el-form-item label="总申请数量">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.totalNumber" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>申请中</span>
        </el-form-item>
        <el-form-item label="申请中的数量">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.applyingNumber" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="申请中的总提现金额">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.applyingWithdrawAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>已同意</span>
        </el-form-item>
        <el-form-item label="已同意的数量">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.agreeNumber" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="已同意的总提现金额">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.agreeWithdrawAmount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>已拒绝</span>
        </el-form-item>
        <el-form-item label="已拒绝的数量">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.refuseNumber" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="已拒绝的总提现金额">
          <el-input v-model="merchantAssetsWithdrawApplyReportData.refuseWithdrawAmount" :disabled="isChange"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name:'MerchantAssetsWithdrawApplyReportData',
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
      merchantAssetsWithdrawApplyReportData: {
        totalNumber: 0,
        applyingNumber: 0,
        applyingWithdrawAmount: 0,
        agreeNumber: 0,
        agreeWithdrawAmount: 0,
        refuseNumber: 0,
        refuseWithdrawAmount: 0
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
          url: this.$http.adornUrl('/report/merchantAssetsWithdrawApply/history'),
          method: 'get',
          params: this.$http.adornParams({
            startTime: startTime,
            endTime: endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.merchantAssetsWithdrawApplyReportData = data.result
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  }
};
</script>

<style>

</style>
