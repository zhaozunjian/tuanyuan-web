<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>所选品牌商:{{this.headquarterName}}</span>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="bindBusinessList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column prop="businessId" label="商家ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="businessName" label="商家名称"></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
      <el-table-column prop="addressSpecific" label="详细地址" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="220px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleHeadquarterCutBusinessCommodityList(scope.row)">商品抽成列表</el-button>
          <el-button size="small" type="text" @click="handleUnbind(scope.row.businessId)">解除关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="openAddDialog()" icon="el-icon-plus" size="small" type="primary"
      >新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="50%" title="新建关联" :visible.sync="dialogFormVisibleAdd">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="商家名称" size="small" v-model="addForm.searchContent"/>
        <el-button @click="getUnBindBusinessList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>
      <el-table :data="addForm.unBindBusinessList" :cell-style="$GlobalApi.cellClass"
                :header-cell-style="$GlobalApi.rowClass"
                :height="$GlobalApi.getWinHeight() - 280"
                border
                highlight-current-row
                size="small"
                stripe>
        <el-table-column prop="businessId" label="商家ID"></el-table-column>
        <el-table-column prop="businessName" label="商家名称"></el-table-column>
        <el-table-column prop="contactPhone" label="联系电话"></el-table-column>
        <el-table-column prop="addressSpecific" label="详细地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleBind(scope.row.businessId)">关联</el-button>
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
        headquarterId: '',
        headquarterName: '',
        dialogFormVisibleAdd: false,
        bindBusinessList: [],
        listCurrentPage: 1,
        listPageSize: 10,
        listTotal: 0,
        addForm: {
          unBindBusinessList: [],
          searchContent: '',
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
        if (this.$route.query.headquarterId) {
          this.headquarterId = this.$route.query.headquarterId
          this.headquarterName = this.$route.query.headquarterName
          this.initBindBusinessList()
        }
      },
      initBindBusinessList() {
        this.$http({
          url: this.$http.adornUrl('/headquarterBindBusiness/pageBindBusiness'),
          method: 'post',
          params: this.$http.adornParams({
            headquarterId: this.headquarterId,
            currentPage: this.listCurrentPage,
            pageSize: this.listPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.bindBusinessList = data.result.data
            this.listTotal = data.result.pageModel.total
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      openAddDialog() {
        this.dialogFormVisibleAdd = true
        this.getUnBindBusinessList()
      },
      getUnBindBusinessList() {
        this.$http({
          url: this.$http.adornUrl('/headquarterBindBusiness/pageNoBindBusiness'),
          method: 'post',
          params: this.$http.adornParams({
            headquarterId: this.headquarterId,
            searchContent: this.addForm.searchContent,
            currentPage: this.addCurrentPage,
            pageSize: this.addPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.addForm.unBindBusinessList = data.result.data
            this.addTotal = data.result.pageModel.total
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleBind(businessId) {
        this.$http({
          url: this.$http.adornUrl('/headquarterBindBusiness/bind'),
          method: 'get',
          params: this.$http.adornParams({
            headquarterId: this.headquarterId,
            businessId: businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              type: 'success',
              message: '关联成功!'
            });
            this.getUnBindBusinessList()
            this.initBindBusinessList()
            this.dialogFormVisibleAdd = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleUnbind(businessId) {
        var that = this
        this.$confirm('此操作将解除关联该商家,这将会清除选择的品牌商对该关联商家所有商品的抽成, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/headquarterBindBusiness/unBind'),
            method: 'get',
            params: this.$http.adornParams({
              headquarterId: this.headquarterId,
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
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关联'
          });
        });
      },
      handleHeadquarterCutBusinessCommodityList(business) {
        this.$router.push({
          path: "HeadquarterCutBusinessCommodityList",
          query: {
            businessId: business.businessId,
            businessName: business.businessName,
            headquarterId: this.headquarterId,
            headquarterName: this.headquarterName
          }
        });
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
