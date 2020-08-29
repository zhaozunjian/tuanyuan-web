<template>
  <el-card>
    <div slot="header">
      <div>所选运营:{{this.sysOperationUserLoginName}}</div>
    </div>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="bindBusinessList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column prop="businessName" label="商家名称"></el-table-column>
      <el-table-column label="关联绑定的时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text"
                     @click="handleUnbind(scope.row.businessId)">
            解除关联
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openAddDialog">新建关联</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" :visible.sync="dialogFormVisibleAdd" width="50%" :close-on-click-modal="false" :modal-append-to-body='false'>
      <h3 slot="title" style="margin:0px">添加关联</h3>
      <el-input class="sd-input-150" clearable placeholder="请输入商家名称" size="small" @change="getBusiness" v-model.trim="addForm.searchContent"/>
      <el-button @click="getUnBindBusinessList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      <el-table style="margin-top: 20px;" :data="addForm.unBindBusinessList" :cell-style="$GlobalApi.cellClass"
                :header-cell-style="$GlobalApi.rowClass"
                :height="$GlobalApi.getWinHeight() - 300" border highlight-current-row
                size="small" stripe>
        <el-table-column property="businessName" label="商家名称"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleBind(scope.row.businessId)">
              关联
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pager :current-page="addCurrentPage" :page-size="addPageSize" :total="addTotal"
             @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeAddChange" background/>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      sysOperationUserId: '',
      sysOperationUserLoginName: '',
      bindBusinessList: [],
      listTotal: 0,
      listCurrentPage: 1,
      listPageSize: 10,
      dialogFormVisibleAdd: false,
      addForm: {
        searchContent: '',
        unBindBusinessList: []
      },
      addCurrentPage: 1,
      addPageSize: 10,
      addTotal: 0,
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      if (this.$route.query.sysOperationUserId) {
        this.sysOperationUserId = this.$route.query.sysOperationUserId
        this.sysOperationUserLoginName = this.$route.query.sysOperationUserLoginName
      }
      this.initBindBusinessList()
    },
    initBindBusinessList() {
      if (this.sysOperationUserId){
        this.$http({
          url: this.$http.adornUrl(`/sysOperationUserBindBusiness/pageBindBusinessList`),
          method: 'post',
          params: this.$http.adornParams({
            sysOperationUserId: this.sysOperationUserId,
            currentPage: this.listCurrentPage,
            pageSize: this.listPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.bindBusinessList = data.result.data
            this.listTotal = data.result.pageModel.total
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    handleUnbind(businessId) {
      var that = this
      this.$confirm('此操作将解除关联该商家, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/sysOperationUserBindBusiness/unBind`),
          method: 'get',
          params: this.$http.adornParams({
            sysOperationUserId: that.sysOperationUserId,
            businessId: businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '解除关联成功!'
            });
            this.initBindBusinessList()
          } else {
            this.$message.error(data.msg);
          }
        })
      }).catch(() => {
          this.$message({
              type: 'info',
              message: '已取消关联'
          });
      });
    },
    openAddDialog() {
      this.dialogFormVisibleAdd = true
      this.getUnBindBusinessList()
    },
    getBusiness(val){
      if (val === null || val === ''){
        this.getUnBindBusinessList();
      }
    },
    getUnBindBusinessList() {
      this.$http({
        url: this.$http.adornUrl(`/sysOperationUserBindBusiness/pageUnBindBusinessWithSearch`),
        method: 'post',
        params: this.$http.adornParams({
          sysOperationUserId: this.sysOperationUserId,
          searchContent: this.addForm.searchContent,
          currentPage: this.addCurrentPage,
          pageSize: this.addPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.addForm.unBindBusinessList = data.result.data
          this.addTotal = data.result.pageModel.total
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleBind(businessId) {
      this.$http({
        url: this.$http.adornUrl(`/sysOperationUserBindBusiness/bind`),
        method: 'get',
        params: this.$http.adornParams({
          businessId:businessId,
          sysOperationUserId:this.sysOperationUserId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dialogFormVisibleAdd = false
          this.$message({
            type: 'success',
            message: '关联成功!'
          });
          this.initBindBusinessList()
          Object.assign(this.addForm, this.$options.data().addForm)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleListCurrentChange(val) {
      this.listCurrentPage = val
      this.initBindBusinessList()
    },
    handleListSizeChange(val) {
      this.listPageSize = val
      this.initBindBusinessList()
    },
    handleAddCurrentChange(val) {
      this.addCurrentPage = val
      this.getUnBindBusinessList()
    },
    handleAddSizeAddChange(val) {
      this.addPageSize = val
      this.getUnBindBusinessList()
    }
  }
};
</script>

<style>

</style>
