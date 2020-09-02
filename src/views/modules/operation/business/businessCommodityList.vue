<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header" style="margin-top: 0px">
      <el-col style="width: 50%">
        <el-input class="sd-input-150" clearable placeholder="商品名称" size="small" @change="getchangeInit" v-model="searchContent"/>
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
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleStatus(scope.row.businessCommodityId)">状态切换</el-button>
          <!--<el-button size="small" type="text" v-if="isAuth('business:commodity:update')" @click="handleSpecialAmountDivide(scope.row)">修改分成</el-button>-->
          <!--<el-button size="small" type="text" @click="handleExpand(scope.$index, scope.row)">扩展信息</el-button>-->
          <!--<el-button size="small" type="text" @click="handleExternalSupport(scope.$index, scope.row)">第三方支持</el-button>-->
          <el-button size="small" type="text" v-if="isAuth('business:commodity:update')" @click="handleEdit(false, scope.row)">编辑</el-button>
          <el-button size="small" type="text" v-if="isAuth('business:commodity:show')" @click="handleEdit(true, scope.row)">查看</el-button>
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
    handleEdit(flag, row) {
      if (this.businessId) {
        this.$router.push({
          name: "updateBusinessCommodityOperation",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: row.businessCommodityId,
            businessCommodityName: row.businessCommodityName,
            flag: flag
          }
        });
      }
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
    getchangeInit(val){
      if (val === null || val === ''){
        this.initData();
      }
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
  }
};
</script>

<style lang="less" scope>

</style>
