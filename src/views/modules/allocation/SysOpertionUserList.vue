<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-input class="sd-input-150" placeholder="用户名称" size="small" v-model="searchContent"/>
        <el-button @click="getUsersOperationList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="sysOperationUserList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="用户ID" prop="id"/>
      <el-table-column label="用户名称" prop="nickName"/>
      <el-table-column label="关联绑定的美食酒店数量" prop="bindBusinessCount"></el-table-column>
      <el-table-column label="关联绑定的品牌商数量" prop="bindHeadquarterCount"></el-table-column>
      <el-table-column label="操作" width="230px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="goBindBusinessList(scope.row)">关联美食酒店列表</el-button>
          <el-button size="small" type="text" @click="goBindHeadquarterList(scope.row)">关联品牌商列表</el-button>
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
      searchContent: '',
      sysOperationUserList: [],
      currentPage: this.$GlobalApi.Constants.DICT.PAGE,
      pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
      total: this.$GlobalApi.Constants.DICT.TOTAL,
    }
  },
  activated() {
    this.getUsersOperationList();
  },
  methods: {
    getUsersOperationList() {
      this.$http({
        url: this.$http.adornUrl('/sys/user/userlist'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.currentPage,
          size: this.pageSize,
          aliasName: this.searchContent,
          userType: '20'
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.sysOperationUserList = data.page.list
          this.total = data.page.totalCount
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
        this.getUsersOperationList()
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.getUsersOperationList()
    },
    goBindBusinessList(row) {
      this.$router.push({
        path: '/SysOpertionUserBindBusinessList',
        query: {
          sysOperationUserId:row.id,
          sysOperationUserLoginName:row.nickName
        }
      });
    },
    goBindHeadquarterList(row) {
      this.$router.push({
        path: '/SysOperationUserBindHeadquarterList',
        query: {
          sysOperationUserId: row.id,
          sysOperationUserLoginName: row.nickName
        }
      });
    }
  }
};
</script>

<style>

</style>
