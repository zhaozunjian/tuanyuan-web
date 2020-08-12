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
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button @click="handleClick()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>
      <el-form ref="form" :model="businessReportData" label-width="200px" class="form box">
        <el-form-item>
          <span>商家信息</span>
        </el-form-item>
        <el-form-item label="新创建的商家数量">
          <el-input v-model="businessReportData.newCreateBusinessCount" :disabled="isChange"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name:'BusinessReportData',
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
      businessReportData: {
        newCreateBusinessCount: 0
      }
    }
  },
  methods: {
    handleClick() {
      this.initReportData()
    },
    initReportData() {
      if (this.chooseTimes.length>0) {
        let startTime = this.chooseTimes[0]
        let endTime = this.chooseTimes[1]
        this.$http({
          url: this.$http.adornUrl('/report/business/history'),
          method: 'get',
          params: this.$http.adornParams({
            startTime: startTime,
            endTime: endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.businessReportData = data.result
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
