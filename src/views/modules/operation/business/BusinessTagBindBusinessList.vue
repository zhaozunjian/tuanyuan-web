<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>所选择的商家名称: {{this.businessName}}</span>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="listData"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column prop="businessTagName" label="标签名称" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button @click="handleDelete(scope.row)" size="small" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="addBindTag()" icon="el-icon-plus" size="small" type="primary"
      >新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="45%" title="添加绑定标签" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-table
        ref="multipleTable"
        :data="addForm.businessTagListData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <el-table-column
          prop="businessTagName"
          label="标签名称">
        </el-table-column>
      </el-table>
      <pager :current-page="addForm.addCurrentPage" :page-size="addForm.addPageSize" :total="addForm.addTotal"
             @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeChange" background/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddBusinessTag()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {

  data() {
    return {
        businessId: '',
        businessName: '',
        dialogAddFormVisible: false,
        listData: [],
        listTotal: 0,
        listCurrentPage: 1,
        listPageSize: 10,
        addForm: {
            businessTagListData: [],
            multipleSelectionAdd: [],
            addTotal: 0,
            addCurrentPage: 1,
            addPageSize: 10,
        },
    }
  },
  mounted() {
      this.initData()
  },
  methods: {
      initData() {
        this.businessId = this.$route.query.businessId
        this.businessName = this.$route.query.businessName
        let businessId = this.businessId
        this.initBusinessTagBindBusinessList()
      },
      initBusinessTagBindBusinessList() {
        let businessId = this.businessId
        this.$http({
          url: this.$http.adornUrl(`/businessTagBindBusiness/pageByBusinessId`),
          method: 'post',
          params: this.$http.adornParams({
            businessId: businessId,
            currentPage: this.listCurrentPage,
            pageSize: this.listPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.listData = data.result.data
            this.listTotal = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleListCurrentChange(val) {
        this.listCurrentPage = val
        this.initBusinessTagBindBusinessList()
      },
      handleListSizeChange(val) {
        this.listPageSize = val
        this.initBusinessTagBindBusinessList()
      },
      handleDelete(row) {
        let item = row
        let businessTagId = item.businessTagId
        let businessTagName = item.businessTagName
        let businessId = this.businessId
        this.$confirm(`确认解除名为${businessTagName}的标签?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/businessTagBindBusiness/remove`),
            method: 'get',
            params: this.$http.adornParams({
              businessTagId: businessTagId,
              businessId: businessId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              })
              this.initBusinessTagBindBusinessList()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        })
      },
      closeDialog() {
        this.dialogAddFormVisible = false
      },
      addBindTag() {
          this.dialogAddFormVisible = true
          this.initBusinessTagList()
      },
      initBusinessTagList() {
        this.$http({
          url: this.$http.adornUrl(`/businessTag/pageAll`),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.addForm.addCurrentPage,
            pageSize: this.addForm.addPageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.addForm.businessTagListData = data.result.data
            this.addForm.addTotal = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleSelectionChange(val) {
          this.addForm.multipleSelectionAdd = val
      },
      handleAddBusinessTag() {
        let multipleSelectionAdd = this.addForm.multipleSelectionAdd
        let multipleSelectionLength = multipleSelectionAdd.length
        if (multipleSelectionLength<=0) {
            this.$message.error('请选择需绑定的标签');
        }
        let businessId = this.businessId
        this.$confirm(`确认绑定名为${multipleSelectionAdd[0].businessTagName}等${multipleSelectionLength}个标签?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
        }).then(() => {
            multipleSelectionAdd.forEach(item => {
              this.$http({
                url: this.$http.adornUrl(`/businessTagBindBusiness/add`),
                method: 'post',
                params: this.$http.adornParams({
                  businessTagId: item.businessTagId,
                  businessId: businessId
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: `添加标签-${item.businessTagName},成功`,
                    type: "success"
                  })
                  this.initBusinessTagBindBusinessList()
                } else {
                  this.$message.error(data.msg);
                }
              })
            })
            this.dialogAddFormVisible = false
            Object.assign(this.addForm, this.$options.data().addForm)
        }).catch((err)=>{
            this.$message({
                type: "info",
                message: "已取消操作"
            });
        })
      },
      handleAddCurrentChange(val) {
        this.addForm.addCurrentPage = val
          this.initBusinessTagList()
      },
      handleAddSizeChange() {
        this.addForm.addPageSize = val;
        this.initBusinessTagList()
      }
  }
};
</script>

<style lang="less">

</style>
