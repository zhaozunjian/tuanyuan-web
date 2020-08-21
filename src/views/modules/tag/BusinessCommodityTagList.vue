<template>
  <el-card>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="tagList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 240"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="标签名称" prop="businessCommodityTagName"></el-table-column>
      <el-table-column label="排序权重" prop="weight"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row.businessCommodityTagId)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row.businessCommodityTagId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="dialogAddFormVisible = true" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="35%" title="添加标签" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="form">
        <el-form-item label="标签名称">
          <el-input style="width: 100%" v-model.trim="addForm.businessCommodityTagName"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input style="width: 100%" v-model.trim="addForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="code-dialog" width="35%" title="编辑标签" :visible.sync="dialogEditFormVisible" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="editForm" ref="form">
        <el-form-item label="标签名称">
          <el-input style="width: 100%" v-model.trim="editForm.businessCommodityTagName"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input style="width: 100%" v-model.trim="editForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogEditFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
      return {
        dialogAddFormVisible: false,
        dialogEditFormVisible: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tagList: [],
        addForm: {
            businessCommodityTagName: '',
            weight: 1
        },
        editForm: {
          businessCommodityTagId: '',
          businessCommodityTagName: '',
          weight: 1
        }
      }
  },
  mounted() {
      this.initTagList()
  },
  methods: {
      initTagList() {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTag/pageAll`),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tagList = data.result.data
            this.total = data.result.pageModel.total;
            this.currentPage = data.result.pageModel.currentPage;
            this.pageSize = data.result.pageModel.pageSize;
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleEdit(tagId) {
         this.dialogEditFormVisible = true
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTag/info`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityTagId: tagId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.editForm = data.result
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleDelete(tagId) {
         this.$confirm("确认删除该标签?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
         }).then(res => {
           this.$http({
             url: this.$http.adornUrl(`/businessCommodityTag/remove`),
             method: 'get',
             params: this.$http.adornParams({
               businessCommodityTagId: tagId
             })
           }).then(({data}) => {
             if (data && data.code === 0) {
               this.$message({
                 message: "删除成功",
                 type: "success"
               });
               this.initTagList()
             } else {
               this.$message.error(data.msg);
             }
           })
         }).catch(() => {
           this.$message.error(data.msg);
         })
      },
      submitAdd() {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTag/add`),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityTagName: this.addForm.businessCommodityTagName,
            weight: this.addForm.weight
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.dialogAddFormVisible = false
            Object.assign(this.addForm, this.$options.data().addForm)
            this.initTagList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      submitEdit() {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTag/update`),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityTagId: this.editForm.businessCommodityTagId,
            businessCommodityTagName: this.editForm.businessCommodityTagName,
            weight: this.editForm.weight
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.dialogEditFormVisible = false
            Object.assign(this.editForm, this.$options.data().editForm)
            this.initTagList();
          } else {
            this.$message.error(data.msg);
          }
        })
      },
    closeDialog() {
        this.dialogAddFormVisible = false
        this.dialogEditFormVisible = false
    },
    handleCurrentChange(val) {
        this.currentPage = val
        this.initTagList()
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.initTagList()
    }
  }
};
</script>

<style scoped>

</style>
