<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick"  type="card">
      <el-tab-pane label="申请中" name="11"></el-tab-pane>
      <el-tab-pane label="已同意" name="21"></el-tab-pane>
      <el-tab-pane label="已到账" name="31"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="41"></el-tab-pane>
    </el-tabs>
    <el-table :data="userList" :cell-style="activeName==1 ? $GlobalApi.cellClass : $GlobalApi.cellClassNoEdit"
              :header-cell-style="$GlobalApi.rowClass"
              :height="$GlobalApi.getWinHeight() - 280"
              border highlight-current-row size="small" stripe style="width: 100%;">
      <el-table-column prop="usersNickName" label="用户昵称"></el-table-column>
      <el-table-column prop="usersPhoneNumber" label="用户联系电话"></el-table-column>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="withdrawWayDescription" label="提现方式"></el-table-column>
      <el-table-column prop="withdrawAmount" label="提现金额"></el-table-column>
      <el-table-column prop="bankName" label="银行名称"></el-table-column>
      <el-table-column prop="cardHolder" label="持卡人名称"></el-table-column>
      <el-table-column prop="cardNumber" label="银行卡号"></el-table-column>
      <el-table-column prop="withdrawStatusDescription" label="提现状态"></el-table-column>
      <el-table-column label="操作" v-if="activeName==11" width="130px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleAgree(scope.row.usersAssetsWithdrawApplyId)">同意</el-button>
          <el-button size="small" type="text" @click="handleRefuse(scope.row.usersAssetsWithdrawApplyId)">拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="activeName==12" width="100px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleConfirm(scope.row.usersAssetsWithdrawApplyId)">确认到账</el-button>
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
              activeName:'11',
              currentPage: this.$GlobalApi.Constants.DICT.PAGE,
              pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
              total: this.$GlobalApi.Constants.DICT.TOTAL,
              userList:[]
            };
        },
        mounted() {
            this.handleClick()
        },
        methods: {
            //获取所有信息用户
            handleClick() {
                if (!this.currentPage){
                    this.currentPage=1
                }
                if (!this.pageSize){
                    this.pageSize=10
                }
              this.$http({
                url: this.$http.adornUrl(`/usersAssetsWithdrawApply/pageByWithdrawStatus`),
                method: 'post',
                params: this.$http.adornParams({
                  withdrawStatus:this.activeName,
                  currentPage: this.currentPage,
                  pageSize: this.pageSize
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.userList = data.result.data;
                  this.total = data.result.pageModel.total;
                  this.currentPage = data.result.pageModel.currentPage;
                  this.pageSize = data.result.pageModel.pageSize;
                } else {
                  this.$message.error(data.msg);
                }
              })
            },
            // 同意申请
            handleAgree(usersAssetsWithdrawApplyId){
               this.$confirm('此操作将会同意这次申请,同意后将无法拒绝并需要到账确认, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                 this.$http({
                   url: this.$http.adornUrl(`/usersAssetsWithdrawApply/agree`),
                   method: 'get',
                   params: this.$http.adornParams({
                     usersAssetsWithdrawApplyId:usersAssetsWithdrawApplyId
                   })
                 }).then(({data}) => {
                   if (data && data.code === 0) {
                     this.$message({
                       message: "同意成功",
                       type: "success"
                     });
                     this.handleClick()
                   } else {
                     this.$message.error(data.msg);
                   }
                 })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            //拒绝申请
            handleRefuse(usersAssetsWithdrawApplyId){
                this.$confirm('此操作将会拒绝这次申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                  this.$http({
                    url: this.$http.adornUrl(`/usersAssetsWithdrawApply/refuse`),
                    method: 'get',
                    params: this.$http.adornParams({
                      usersAssetsWithdrawApplyId:usersAssetsWithdrawApplyId
                    })
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.$message({
                        message: "拒绝成功",
                        type: "success"
                      });
                      this.handleClick()
                    } else {
                      this.$message.error(data.msg);
                    }
                  })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            handleConfirm(usersAssetsWithdrawApplyId) {
                this.$prompt('此操作将会确认到账这次申请,是否继续? 可输入银行等提供的交易凭证号,用作查账,不填则输入空格(建议填写)', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({ value }) => {
                  this.$http({
                    url: this.$http.adornUrl(`/usersAssetsWithdrawApply/confirm`),
                    method: 'get',
                    params: this.$http.adornParams({
                      usersAssetsWithdrawApplyId:usersAssetsWithdrawApplyId,
                      transactionId: value
                    })
                  }).then(({data}) => {
                    if (data && data.code === 0) {
                      this.$message({
                        message: "确认成功",
                        type: "success"
                      });
                      this.handleClick()
                    } else {
                      this.$message.error(data.msg);
                    }
                  })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            // 切换分页
            handleCurrentChange(val) {
              this.currentPage = val
                this.handleClick()
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleClick()
            }
        }
    };
</script>

<style scoped>

</style>
