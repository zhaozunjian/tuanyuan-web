<template>
  <div class="mod-log">
    <el-card class="box-card" shadow="never" body-style="padding:10px">
      <div slot="header">
        <el-input placeholder="用户名" size="small" clearable class="sd-input-150" v-model="dataForm.key"/>
        <el-button @click="getDataList()" size="small" type="primary" class="sd-mag-l-10" icon="el-icon-search">查询</el-button>
  </div>
    <el-table
      :height="$GlobalApi.getWinHeight() - 260"
      :header-cell-style="$GlobalApi.rowClass"
      :cell-style="$GlobalApi.cellClassNoEdit"
      border
      highlight-current-row
      size="small"
      :data="dataList"
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="id"
        width="140px"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="用户操作">
      </el-table-column>
      <el-table-column
        prop="time"
        label="执行时长(毫秒)">
      </el-table-column>
      <el-table-column
        prop="ip"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="inputtime"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <div class="sd-rightpage" >
      <pager :current-page="pageIndex" @current-change="currentChangeHandle" :total="totalPage" @handle-size-change="sizeChangeHandle" :page-size="pageSize" background/>
    </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataForm.key = this.dataForm.key.trim();

        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      }
    }
  }
</script>
