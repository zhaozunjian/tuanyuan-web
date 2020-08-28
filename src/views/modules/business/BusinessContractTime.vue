<template>
  <el-card>
    <div slot="header">
      <el-input class="sd-input-150" clearable placeholder="商家名称" size="small" @change="getchangeInit" v-model="searchContent"/>
      <el-button @click="initBusinessContractTimeList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
    </div>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="businessList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 260"
      border
      highlight-current-row
      size="small"
      stripe
      style="width: 100%;">
      <el-table-column label="商家ID" prop="businessId"></el-table-column>
      <el-table-column label="商家名称" prop="businessName"></el-table-column>
      <el-table-column label="联系电话" prop="contactPhone"></el-table-column>
      <el-table-column label="商家分类" prop="businessCategoryName"></el-table-column>
      <el-table-column label="商户码" prop="identificationCode"></el-table-column>
      <el-table-column label="商家地址" prop="addressProbably">
        <template slot-scope="scope">
          <span>{{ scope.row.addressProbably + scope.row.addressSpecific}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合作结束时间">
        <template slot-scope="scope">
          <div>{{scope.row.contractEndTime | getTimeNoHour(scope.row.contractEndTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="上下线状态" prop="businessStatusDescription"></el-table-column>
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
        businessList: [],
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
        this.initBusinessContractTimeList()
      },
      getchangeInit(val){
        if (val === null || val === ''){
          this.initBusinessContractTimeList();
        }
      },
      initBusinessContractTimeList() {
        this.$http({
          url: this.$http.adornUrl('/business/pageContractTime'),
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
            this.$message.error(data.msg)
          }
        })
      },

      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.initBusinessContractTimeList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initBusinessContractTimeList()
      }
    }
  };
</script>

