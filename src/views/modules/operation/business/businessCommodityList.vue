<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header" style="margin-top: 0px">
      <el-col style="width: 50%">
        <el-input class="sd-input-150" clearable placeholder="商品名称" size="small" v-model="searchContent"/>
        <el-button @click="initData()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
      <el-col style="width: 50%;">
        <div style="width: 100%;display: flex;text-align: right;">
          <span style="width: 100%;">商家ID：<span style="color: red;">{{this.businessId}}</span></span>
        </div>
        <div style="width: 100%;display: flex;margin-top: 5px;text-align: right;">
          <span style="width: 100%;">商家名称：<span style="color: red;">{{this.businessName}}</span></span>
        </div>
      </el-col>
    </el-row>
    <el-table ref="multipleTable"
      :cell-style="$GlobalApi.cellClass"
      :data="tableData" v-loading="businessLoading"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="ID" prop="businessCommodityId" width="150px"/>
      <el-table-column label="商品名称" prop="businessCommodityName"/>
      <el-table-column label="成本价" prop="costPrice"/>
      <el-table-column label="现价" prop="currentPrice"/>
      <el-table-column label="先砍后付" prop="openBeforeBargainDescription"></el-table-column>
      <el-table-column label="每日限量" prop="openDailyLimitedDescription"></el-table-column>
      <el-table-column label="售卖时间限制" prop="openContractTimeDescription"></el-table-column>
      <el-table-column label="上下架状态" prop="businessCommodityStatusDescription"></el-table-column>
      <el-table-column label="操作" width="280px">
        <template slot-scope="scope">
          <el-button size="small" type="text" v-if="isAuth('business:tag:show')" @click="handleCommodityTagBindCommodity(scope.row)">标签列表</el-button>
          <el-button size="small" type="text" @click="handleContractTime(scope.$index, scope.row)">售卖时间限制</el-button>
          <el-button size="small" type="text" @click="handleStatus(scope.row.businessCommodityId)">状态切换</el-button>
          <el-button size="small" type="text" v-if="isAuth('business:commodity:update')" @click="handleSpecialAmountDivide(scope.row)">修改分成</el-button>
          <el-button size="small" type="text" v-if="isAuth('business:commodity:update')" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleExpand(scope.$index, scope.row)">扩展信息</el-button>
          <el-button size="small" type="text" @click="handleExternalSupport(scope.$index, scope.row)">第三方支持</el-button>
          <el-button size="small" type="text" v-if="isAuth('business:commodity:show')" @click="handleShow(scope.$index, scope.row)">查看</el-button>
          <el-button size="small" type="text" v-if="isAuth('business:commodity:delete')" @click="handleDelete(scope.row.businessCommodityId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button v-if="isAuth('business:commodity:add')" @click="handleAddCommodity()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="45%" title="修改商品金额分成" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="specialAmountDivide-form" :model="specialAmountDivide" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
        <el-form-item label="修改该商品的金额分成">
          <span>{{this.specialAmountDivide.choosebusinessCommodityName}}</span>
        </el-form-item>
        <el-form-item label="总毛利率(由此得计算价)">
          <el-input v-model="specialAmountDivide.totalProfit" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>无分享</span>
        </el-form-item>
        <el-form-item label="无分享单上级一级分成率">
          <el-input v-model="specialAmountDivide.noShareAloneOneLevelReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="无分享多上级一级分成率">
          <el-input v-model="specialAmountDivide.noShareMultipleOneLevelReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="无分享多上级二级分成率">
          <el-input v-model="specialAmountDivide.noShareMultipleTwoLevelReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="无分享的返积分率">
          <el-input v-model="specialAmountDivide.noShareUserIntegralReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <span>有分享</span>
        </el-form-item>
        <el-form-item label="被动分享人返积分率">
          <el-input v-model="specialAmountDivide.receiveShareUserIntegralReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item label="主动分享人的分享率">
          <el-input v-model="specialAmountDivide.initiateShareShareReward" :disabled="isChange"> </el-input>
        </el-form-item>
        <el-form-item label="主动分享人单上级一级分成率">
          <el-input v-model="specialAmountDivide.initiateShareAloneOneLevelReward" :disabled="isChange"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isChange = !isChange">切换修改</el-button>
          <el-button type="primary" @click="handleChange()">确认修改</el-button>
          <el-button type="danger" @click="handleRestoreSpecialAmountDivide(specialAmountDivide.choosebusinessCommodityId, specialAmountDivide.choosebusinessCommodityName)">还原为默认分成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      dataListSelections:[],
      businessId: "",
      businessName: "",
      tableData: [],
      businessLoading: false,
      searchContent: "",
      total: 0,
      currentPage: 1,
      pageSize: 10,
      dialogFormVisible: false,
      isChange: true,
      specialAmountDivide: {
        choosebusinessCommodityId: '',
        choosebusinessCommodityName: '',
        noShareTotalProfit: '',
        noShareAloneOneLevelReward: '',
        noShareMultipleOneLevelReward: '',
        noShareMultipleTwoLevelReward: '',
        noShareUserIntegralReward: '',
        receiveShareUserIntegralReward: '',
        initiateShareShareReward: '',
        initiateShareAloneOneLevelReward: ''
      }
    };
  },
  mounted() {

  },
  activated(){
    if (this.$route.query.businessId){
      this.businessId = this.$route.query.businessId;
      this.businessName = this.$route.query.businessName;
    }
    this.initData();
  },
  methods: {
    handleAddCommodity() {
      this.$router.push({
        path: "addBusinessCommodity",
        query: {
          businessId: this.businessId,
          businessName: this.businessName
        }
      });
    },
    handleExternalSupport(index, row) {
      if (this.businessId) {
        let item = row;
        this.$router.push({
          path: "BusinessCommodityExternalSupportList",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: row.businessCommodityId,
            businessCommodityName: row.businessCommodityName
          }
        });
      }
    },
    handleExpand(index, row) {
      if (this.businessId) {
        let item = row;
        this.$router.push({
          path: "BusinessCommodityExpand",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: row.businessCommodityId,
            businessCommodityName: row.businessCommodityName
          }
        });
      }
    },
    handleEdit(index, row) {
      if (this.businessId) {
        this.$router.push({
          name: "updateBusinessCommodityOperation",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: row.businessCommodityId,
            businessCommodityName: row.businessCommodityName
          }
        });
      }
    },
    handleShow(index, row) {
      if (this.businessId) {
        this.$router.push({
          name: "UpdateBusinessCommodity",
          query: {
            businessCommodityId: row.businessCommodityId
          }
        });
      }
    },
    handleContractTime(index, row) {
      if (this.businessId) {
        let item = row;
        this.$router.push({
          path: "UpdateBusinessCommodityContractTime",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: row.businessCommodityId,
            businessCommodityName: row.businessCommodityName
          }
        });
      }
    },
    handleCommodityTagBindCommodity(row) {
      this.$router.push({
        path: 'BusinessCommodityTagBindBusinessCommodityList',
        query: {
          businessId: this.businessId,
          businessName: this.businessName,
          businessCommodityId: row.businessCommodityId,
          businessCommodityName: row.businessCommodityName
        }
      })
    },
    handleDelete(businessCommodityId) {
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodity/delete`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.initData();
          } else {
            this.$message.error(data.msg);
          }
        })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleStatus(businessCommodityId) {
      this.$confirm("此操作将改变商品的上下架状态, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodity/switchBusinessCommodityStatus`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: "success",
              message: "修改成功!"
            });
            this.initData();
          } else {
            this.$message.error(data.msg);
          }
        })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
        this.initData()
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.initData()
    },
    initData() {
      if (this.businessId) {
        this.businessLoading = true
        this.$http({
          url: this.$http.adornUrl(`/businessCommodity/pageByBusinessIdWithSearch`),
          method: 'post',
          params: this.$http.adornParams({
            businessId: this.businessId,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            searchContent: this.searchContent
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.result.data;
            this.total = data.result.pageModel.total;
            this.businessLoading = false
          } else {
            this.businessLoading = false
            this.$message.error(data.msg);
          }
        })
      }
    },
    checkBusinessId() {
      if (this.$route.query.businessId) {
        this.businessId = this.$route.query.businessId;
      } else {
        this.businessId = Math.ceil(Math.random() * 10);
        this.$alert("查看商品列表需要选择一个商家,先去选择商家", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/businessList");
          }
        });
      }
    },
    onChangeSearchContent() {
      if (this.searchContent==''){
          this.initData()
      }
    },
    handleSpecialAmountDivide(row) {
      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/info`),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: row.businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.specialAmountDivide = data.result
          this.specialAmountDivide.choosebusinessCommodityId = row.businessCommodityId
          this.specialAmountDivide.choosebusinessCommodityName = row.businessCommodityName
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    closeDialog() {
      this.specialAmountDivide = {};
    },
    handleChange(){
      this.$http({
        url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/update`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.specialAmountDivide.choosebusinessCommodityId,
          totalProfit: this.specialAmountDivide.totalProfit,
          noShareAloneOneLevelReward: this.specialAmountDivide.noShareAloneOneLevelReward,
          noShareMultipleOneLevelReward: this.specialAmountDivide.noShareMultipleOneLevelReward,
          noShareMultipleTwoLevelReward: this.specialAmountDivide.noShareMultipleTwoLevelReward,
          noShareUserIntegralReward: this.specialAmountDivide.noShareUserIntegralReward,
          receiveShareUserIntegralReward: this.specialAmountDivide.receiveShareUserIntegralReward,
          initiateShareShareReward: this.specialAmountDivide.initiateShareShareReward,
          initiateShareAloneOneLevelReward: this.specialAmountDivide.initiateShareAloneOneLevelReward
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.isChange = true
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleRestoreSpecialAmountDivide(businessCommodityId, businessCommodityName) {
      this.$confirm("确认将此商品的分成设置还原为全局金额分成设置?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/remove`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.handleSpecialAmountDivide(businessCommodityId, businessCommodityName)
            this.$message.success('设置成功');
          } else {
            this.$message.error(data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    }
  }
};
</script>

<style lang="less" scope>

</style>
