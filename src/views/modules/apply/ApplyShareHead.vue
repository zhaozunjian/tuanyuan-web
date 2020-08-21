<template>
  <el-card>
    <el-tabs v-model="applyStatus" @tab-click="handleTabClick"  type="border-card">
      <el-tab-pane label="申请中" name="1"></el-tab-pane>
      <el-tab-pane label="已批准" name="2"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="3"></el-tab-pane>
    </el-tabs>
    <el-table :data="applyShareHeadList" :cell-style="$GlobalApi.cellClass"
              :header-cell-style="$GlobalApi.rowClass"
              :height="$GlobalApi.getWinHeight() - 300"
              border
              highlight-current-row
              size="small"
              stripe
              style="width: 100%;">
      <el-table-column prop="actualName" label="申请时的真实姓名"></el-table-column>
      <el-table-column prop="usersNickName" label="用户昵称"></el-table-column>
      <el-table-column prop="usersPhoneNumber" label="用户注册手机号码"></el-table-column>
      <el-table-column prop="phoneNumber" label="申请时的手机号码"></el-table-column>
      <el-table-column prop="actualName" label="申请时的姓名"></el-table-column>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | getTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作"  width="180px" v-if="ordersRefundResultStatus==0">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleAgree(scope.row)">同意</el-button>
          <el-button size="small" type="text" @click="handleRefuse(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
  </el-card>
</template>

<script>

  export default {
    data() {
      return {
        applyStatus: "1",
        applyShareHeadList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    mounted() {
      this.initApplyShareHeadList()
    },
    methods: {
      initApplyShareHeadList() {
        this.$http({
          url: this.$http.adornUrl('/applyShareHead/pageByApplyStatus'),
          method: 'post',
          params: this.$http.adornParams({
            applyStatus: this.applyStatus,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.applyShareHeadList = data.result.data
            this.total = data.result.pageModel.total;
            this.currentPage = data.result.pageModel.currentPage;
            this.pageSize = data.result.pageModel.pageSize;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleAgree(applyShareHead) {
        this.$confirm('此操作将会同意这次申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/applyShareHead/agree'),
            method: 'get',
            params: this.$http.adornParams({
              applyShareHeadId: applyShareHead.applyShareHeadId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "同意成功",
                type: "success"
              });
              this.initApplyShareHeadList()
            } else {
              this.$message.error(data.msg)
            }
          })
        });
      },
      handleRefuse(applyShareHead) {
        this.$confirm('此操作将会拒绝这次申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/applyShareHead/refuse'),
            method: 'get',
            params: this.$http.adornParams({
              applyShareHeadId: applyShareHead.applyShareHeadId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "拒绝成功",
                type: "success"
              });
              this.initApplyShareHeadList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      handleTabClick() {
        this.currentPage = 1
        this.pageSize = 10
        this.initApplyShareHeadList()
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.initApplyShareHeadList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initApplyShareHeadList()
      }
    }
  };
</script>
