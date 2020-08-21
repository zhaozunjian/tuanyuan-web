<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <div>所选运营:{{this.sysOperationUserLoginName}}</div>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="listForm.bindHeadquarterList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column prop="headquarterName" label="品牌商名称"></el-table-column>
      <el-table-column label="关联绑定的时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleUnbind(scope.row)">解除关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="openAddDialog()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="45%" title="新建关联" :visible.sync="dialogFormVisibleAdd">
      <div class="mb20 flex align-center justify-between">
        <div>所选运营:{{this.sysOperationUserLoginName}}</div>
        <div slot="header">
          <el-input class="sd-input-150" clearable placeholder="请输入品牌商名称" size="small" v-model="addForm.searchContent"/>
          <el-button @click="getUnBindHeadquarterList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
          </el-button>
        </div>
      </div>
      <el-table :data="addForm.UnBindHeadquarterList" :cell-style="$GlobalApi.cellClass"
                :header-cell-style="$GlobalApi.rowClass"
                :height="$GlobalApi.getWinHeight() - 280"
                border
                highlight-current-row
                size="small"
                stripe>
        <el-table-column property="headquarterName" label="品牌商名称"></el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button size="samll" type="text" @click="handleBind(scope.row)">关联</el-button>
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
        listForm: {
          bindHeadquarterList: [],
        },
        listCurrentPage: 1,
        listPageSize: 10,
        listTotal: 0,
        dialogFormVisibleAdd: false,
        addForm: {
          searchContent: '',
          UnBindHeadquarterList: [],
        },
        addCurrentPage: 1,
        addPageSize: 10,
        addTotal: 0
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
          this.initBindHeadquarterList()
        }
      },
      initBindHeadquarterList() {
        this.$http({
          url: this.$http.adornUrl('/sysOperationUserBindHeadquarter/pageBindHeadquarter'),
          method: 'post',
          params: this.$http.adornParams({
            sysOperationUserId: this.sysOperationUserId,
            currentPage: this.listCurrentPage,
            pageSize: this.listPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.listForm.bindHeadquarterList = data.result.data
            this.listTotal = data.result.pageModel.total
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      openAddDialog() {
        this.dialogFormVisibleAdd = true
        this.getUnBindHeadquarterList()
      },
      addFormChange() {
        if (this.addForm.searchContent==''){
          this.getUnBindHeadquarterList()
        }
      },
      getUnBindHeadquarterList() {
        let sysOperationUserId = this.$route.query.sysOperationUserId
        this.$http({
          url: this.$http.adornUrl('/sysOperationUserBindHeadquarter/pageNoBindHeadquarter'),
          method: 'post',
          params: this.$http.adornParams({
            sysOperationUserId: sysOperationUserId,
            searchContent: this.addForm.searchContent,
            currentPage: this.addCurrentPage,
            pageSize: this.addPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.addForm.UnBindHeadquarterList = data.result.data
            this.addTotal = data.result.pageModel.total
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleUnbind(headquarter) {
        let sysOperationUserId = this.$route.query.sysOperationUserId
        var that = this
        this.$confirm('此操作将解除关联该品牌商, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sysOperationUserBindHeadquarter/unBind'),
            method: 'get',
            params: this.$http.adornParams({
              sysOperationUserId: sysOperationUserId,
              headquarterId: headquarter.headquarterId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                type: 'success',
                message: '解除关联成功!'
              });
              this.initBindHeadquarterList()
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
      handleBind(headquarter) {
        let sysOperationUserId = this.$route.query.sysOperationUserId
        this.$http({
          url: this.$http.adornUrl('/sysOperationUserBindHeadquarter/bind'),
          method: 'get',
          params: this.$http.adornParams({
            sysOperationUserId: sysOperationUserId,
            headquarterId: headquarter.headquarterId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '关联成功!'
            });
            this.initBindHeadquarterList()
            Object.assign(this.addForm, this.$options.data().addForm)
            this.dialogFormVisibleAdd = false
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleListCurrentChange(val) {
        this.addCurrentPage = val
        this.initBindHeadquarterList()
      },
      handleListSizeChange(val) {
        this.listPageSize = val
        this.initBindHeadquarterList()
      },
      handleAddCurrentChange(val) {
        this.addCurrentPage = val
        this.getUnBindHeadquarterList()
      },
      handleAddSizeAddChange(val) {
        this.addPageSize = val
        this.getUnBindHeadquarterList()
      }
    }
  };
</script>
