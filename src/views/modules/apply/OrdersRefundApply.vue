<template>
  <el-card>
    <el-tabs v-model="ordersRefundResultStatus" @tab-click="tabClick"  type="card">
      <el-tab-pane label="申请中" name="0"></el-tab-pane>
      <el-tab-pane label="已同意" name="1"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="2"></el-tab-pane>
    </el-tabs>
    <el-table :data="ordersRefundApplyList" :cell-style="$GlobalApi.cellClass"
              :header-cell-style="$GlobalApi.rowClass"
              :height="$GlobalApi.getWinHeight() - 280"
              border
              highlight-current-row
              size="small"
              stripe
              style="width: 100%;">
      <el-table-column prop="ordersId" label="订单id"></el-table-column>
      <el-table-column prop="ordersName" label="订单名称"></el-table-column>
      <el-table-column prop="merchantName" label="商户名称"></el-table-column>
      <el-table-column prop="usersNickName" label="退款申请的用户昵称"></el-table-column>
      <el-table-column prop="refundAmount" label="申请的退款金额"></el-table-column>
      <el-table-column prop="isArriveDescription" label="到账状态"></el-table-column>
      <el-table-column prop="createTime" label="申请时间" v-if="ordersRefundResultStatus==0">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | getTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="处理时间" v-if="ordersRefundResultStatus==1">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | getTime(scope.row.endTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="处理时间" v-if="ordersRefundResultStatus==2">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | getTime(scope.row.endTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="resultStatusDescription" label="结果状态">
        <template slot-scope="scope">
          <span>{{scope.row.resultStatusDescription}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="refundAmount" label="退款金额"></el-table-column>
      <el-table-column prop="applyStatusDescription" label="申请状态"></el-table-column>
      <el-table-column prop="remark" label="退款备注"></el-table-column>
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
        ordersRefundResultStatus: '0',
        currentPage:1,
        pageSize:10,
        total: 0,
        ordersRefundApplyList: []
      }
    },
    mounted() {
      this.getOrdersRefundApplyList();
    },
    methods: {
      getOrdersRefundApplyList() {
        this.$http({
          url: this.$http.adornUrl('/ordersRefundApply/page'),
          method: 'post',
          params: this.$http.adornParams({
            ordersRefundResultStatus: this.ordersRefundResultStatus,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.ordersRefundApplyList = data.result.data
            this.total = data.result.pageModel.total;
            // this.currentPage = data.result.pageModel.currentPage;
            // this.pageSize = data.result.pageModel.pageSize;
            this.getMessage()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getMessage(){
        this.$http({
          url: this.$http.adornUrl('/message/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            localStorage.setItem("messageInfo", JSON.stringify(data.vo))
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleAgree(ordersRefundApply) {
        this.$confirm('此操作将会同意这次申请,同意后将无法拒绝, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ordersRefundApply/agreeRefundOrder'),
            method: 'get',
            params: this.$http.adornParams({
              ordersRefundApplyId: ordersRefundApply.ordersRefundApplyId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "同意成功",
                type: "success"
              });
              this.getOrdersRefundApplyList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleRefuse(ordersRefundApply) {
        this.$confirm('此操作将会拒绝这次申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/ordersRefundApply/refuseRefundOrder'),
            method: 'get',
            params: this.$http.adornParams({
              ordersRefundApplyId: ordersRefundApply.ordersRefundApplyId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "拒绝成功",
                type: "success"
              });
              this.getOrdersRefundApplyList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      tabClick() {
        this.currentPage = 1
        this.pageSize = 10
        this.getOrdersRefundApplyList()
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getOrdersRefundApplyList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getOrdersRefundApplyList()
      }
    }
  };
</script>
