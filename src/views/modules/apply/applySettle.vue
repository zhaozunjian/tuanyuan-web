<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick"  type="card">
      <el-tab-pane label="申请中" name="1"></el-tab-pane>
      <el-tab-pane label="已批准" name="2"></el-tab-pane>
      <el-tab-pane label="已拒绝" name="3"></el-tab-pane>
    </el-tabs>
    <el-table :data="userList" :cell-style="activeName==1 ? $GlobalApi.cellClass : $GlobalApi.cellClassNoEdit"
              :header-cell-style="$GlobalApi.rowClass"
              :height="$GlobalApi.getWinHeight() - 280"
              border highlight-current-row size="small" stripe style="width: 100%;">
      <el-table-column prop="applySettleType" label="入驻类型">
        <template slot-scope="scope">
                        <span v-if="scope.row.applySettleType===1">
                                    吃喝玩乐
                                </span>
          <span v-else-if="scope.row.applySettleType===1">
                                    酒店
                                </span>
          <span v-else>
                                    小区超市
                                </span>
        </template>
      </el-table-column>
      <el-table-column prop="contactName" label="联系人名称"></el-table-column>
      <el-table-column prop="contactPhone" label="联系人电话"></el-table-column>
      <el-table-column prop="createTime" label="申请时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | getTime(scope.row.createTime)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="storeAddress" label="门店位置">
        <template slot-scope="scope">
          <span>{{ scope.row.storeAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="storeName" label="门店名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="activeName==1" label="操作" width="130px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleAgree(scope.row.applySettleId)">同意</el-button>
          <el-button size="small" type="text" @click="handleRefuse(scope.row.applySettleId)">拒绝
          </el-button>
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
        activeName: '1',
        currentPage: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        total: this.$GlobalApi.Constants.DICT.TOTAL,
        userList: []
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
          url: this.$http.adornUrl(`/applySettle/pageByApplyStatus`),
          method: 'post',
          params: this.$http.adornParams({
            applyStatus: this.activeName,
            currentPage: this.currentPage,
            pageSize: this. pageSize
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
      handleAgree(applySettleId) {
        this.$http({
          url: this.$http.adornUrl(`/applySettle/agree`),
          method: 'get',
          params: this.$http.adornParams({
            applySettleId: applySettleId
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
      },
      //拒绝申请
      handleRefuse(applySettleId) {
        this.$confirm('此操作将会拒绝这次申请, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/applySettle/refuse`),
            method: 'get',
            params: this.$http.adornParams({
              applySettleId: applySettleId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "已经拒绝",
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
              message: '已取消删除'
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
