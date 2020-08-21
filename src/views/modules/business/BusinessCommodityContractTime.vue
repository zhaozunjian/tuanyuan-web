<template>
  <el-card>
    <div slot="header">
      <el-input class="sd-input-150" clearable placeholder="帐号" size="small" v-model="searchContent"/>
      <el-button @click="initBusinessCommodityContractTimeList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
    </div>
    <el-table
      :cell-style="$GlobalApi.cellClassNoEdit"
      :data="businessCommodityList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 260"
      border
      highlight-current-row
      size="small"
      stripe
      style="width: 100%;">
      <el-table-column label="商品ID" prop="businessCommodityId"></el-table-column>
      <el-table-column label="商品名称" prop="businessCommodityName" show-overflow-tooltip></el-table-column>
      <el-table-column label="所属商家" prop="businessName" show-overflow-tooltip></el-table-column>
      <el-table-column label="成本价" prop="costPrice"></el-table-column>
      <el-table-column label="现价" prop="currentPrice"></el-table-column>
      <el-table-column label="售卖截止日期">
        <template slot-scope="scope">
          <div>{{scope.row.contractEndTime | getTimeNoHour(scope.row.contractEndTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="上下架状态" prop="businessCommodityStatusDescription"></el-table-column>
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
        businessCommodityList: [],
        searchContent: '',
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.initBusinessCommodityContractTimeList();
      },
      initBusinessCommodityContractTimeList() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodity/pageContractTime'),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            searchContent: this.searchContent
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.businessCommodityList = data.result.data;
            this.total = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.initBusinessCommodityContractTimeList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initBusinessCommodityContractTimeList()
      }
    }
  };
</script>
