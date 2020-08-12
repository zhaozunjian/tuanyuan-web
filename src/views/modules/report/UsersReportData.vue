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
      <el-form ref="form" :model="usersReportData" label-width="200px" class="form box">
        <el-form-item>
          <span>注册信息</span>
        </el-form-item>
        <el-form-item label="新注册的用户数量">
          <el-input v-model="usersReportData.newRegisterUsersCount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="非邀请码注册的用户数量">
          <el-input v-model="usersReportData.newRegisterNoInviteCodeUsersCount" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="邀请码注册的用户数量">
          <el-input v-model="usersReportData.newRegisterByInviteCodeUsersCount" :disabled="isChange"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
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
      usersReportData: {
        newRegisterUsersCount: 0,
        newRegisterByInviteCodeUsersCount: 0,
        newRegisterNoInviteCodeUsersCount: 0
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
          url: this.$http.adornUrl('/report/users/history'),
          method: 'get',
          params: this.$http.adornParams({
            startTime: startTime,
            endTime: endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.usersReportData = data.result
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
