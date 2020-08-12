<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="输入关键字搜索" size="small" v-model.trim="searchContent"/>
        <el-button @click="initData()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="tableData" ref="multipleTable"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 260"
        border
        highlight-current-row
        size="small"
        stripe v-loading="businessLoading"
        style="width: 100%;">
        <el-table-column
          label="商家ID"
          prop="businessId"
        ></el-table-column>
        <el-table-column label="商家名称" prop="businessName" show-tooltip-when-overflow></el-table-column>
        <el-table-column label="联系电话" prop="contactPhone"></el-table-column>
        <el-table-column label="商家分类" prop="businessCategoryName"></el-table-column>
        <el-table-column label="商家地址" prop="businessCategoryName" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span>{{ scope.row.addressProbably + scope.row.addressSpecific}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户码" prop="identificationCode"></el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button @click="handleCommodityList(scope.row)" size="small" type="text">查看商品</el-button>
            <el-button @click="handleShoppingDistrictBindBusinessList(scope.row)" size="small" type="text">查看商圈</el-button>
            <el-button @click="handleEdit(scope.$index, scope.row)" size="small" type="text">编辑</el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)" size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="addBusiness()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
      </div>
      <div class="sd-rightpage">
        <pager :current-page="currentPage" :page-size="pageSize" :total="total"
               @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableData: [],
      businessLoading:false,
      searchContent: "",
      currentPage: this.$GlobalApi.Constants.DICT.PAGE,
      pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
      total: this.$GlobalApi.Constants.DICT.TOTAL,
      dataListSelections:[]
    };
  },
  activated() {
    this.initData();
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push({
        name: "updateBusinessOperation",
        query: {
          businessId: row.businessId,
          businessName: row.businessName,
          merchantId:row.merchantId
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确定对[id=${row.businessId}]进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/business/delete'),
          method: 'get',
          params: this.$http.adornParams({
            businessId: row.businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success("删除成功")
            this.initData()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    handleCommodityList(row) {
      this.$router.push({
        name: "businessCommodityList",
        query: {
          businessId: row.businessId,
          businessName: row.businessName
        }
      });
    },
    handleBusinessIncome() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "businessIncome",
          query: {
            businessId: this.dataListSelections[0].businessId,
            businessName: this.dataListSelections[0].businessName
          }
        });
      }
    },
    handleMerchantBindMerchantUsersList() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "merchantBindMerchantUsersList",
          query: {
            merchantId: this.dataListSelections[0].merchantId,
            merchantName: this.dataListSelections[0].businessName
          }
        });
      }
    },
    handleShoppingDistrictBindBusinessList(row) {
      this.$router.push({
        name: "shoppingDistrictBindBusinessList",
        query: {
          businessId: row.businessId,
          businessName: row.businessName
        }
      });
    },
    handleBusinessTagBindBusinessList() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "BusinessTagBindBusinessList",
          query: {
            businessId: this.dataListSelections[0].businessId,
            businessName: this.dataListSelections[0].businessName
          }
        })
      }
    },
    initData() {
      this.businessLoading = true
      this.$http({
        url: this.$http.adornUrl(`/business/list`),
        method: 'post',
        params: this.$http.adornParams({
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
    },
    addBusiness(){
      this.$router.push({
        name: "addBusiness"
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
    }
  }
};
</script>

<style>

</style>
