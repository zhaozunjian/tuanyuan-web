<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="商家名称" size="small" v-model.trim="searchContent"/>
        <el-button @click="getBusinessList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="businessList"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 280"
        border
        highlight-current-row
        size="small"
        stripe
        style="width: 100%;">
        <el-table-column
          label="商家ID"
          prop="businessId"
        ></el-table-column>
        <el-table-column label="商家名称" prop="businessName"></el-table-column>
        <el-table-column label="商家分类" prop="businessCategoryName"></el-table-column>
        <el-table-column label="商户码" prop="identificationCode"></el-table-column>
        <el-table-column label="操作" fixed="right" width="160px">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" size="small" type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
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
      searchContent: '',
      businessList: [],
      currentPage: this.$GlobalApi.Constants.DICT.PAGE,
      pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
      total: this.$GlobalApi.Constants.DICT.TOTAL,
    };
  },
  created() {
    this.getBusinessList();
  },
  methods: {
    getBusinessList() {
      this.$http({
        url: this.$http.adornUrl(`/business/pageWithSearch`),
        method: 'post',
        params: this.$http.adornParams({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          searchContent: this.searchContent
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.businessList = data.result.data;
          this.total = data.result.pageModel.total;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val;
        this.getBusinessList()
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.getBusinessList()
    },
    detail(row){
      this.$router.push({name: 'updateBusiness', query: {businessId: row.businessId,businessName: row.businessName}})
    }
  }
};
</script>

<style scoped>

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
