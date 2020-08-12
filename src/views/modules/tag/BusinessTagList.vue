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
      <el-table-column label="标签名称" prop="businessTagName"></el-table-column>
      <el-table-column label="排序权重" prop="weight"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row.businessTagId)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row.businessTagId)">删除</el-button>
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
          <el-input style="width: 100%" v-model.trim="addForm.businessTagName"></el-input>
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
          <el-input style="width: 100%" v-model.trim="editForm.businessTagName"></el-input>
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
        currentPage: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        total: this.$GlobalApi.Constants.DICT.TOTAL,
        tagList: [],
        addForm: {
            businessTagName: '',
            weight: 1
        },
        editForm: {
          businessTagId: '',
          businessTagName: '',
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
         url: this.$http.adornUrl(`/businessTag/pageAll`),
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
        url: this.$http.adornUrl(`/businessTag/info`),
        method: 'get',
        params: this.$http.adornParams({
          businessTagId: tagId
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
             url: this.$http.adornUrl(`/businessTag/remove`),
             method: 'get',
             params: this.$http.adornParams({
               businessTagId: tagId
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
           this.$message.error(res.data.msg);
         })
    },
    submitAdd() {
      this.$http({
        url: this.$http.adornUrl(`/businessTag/add`),
        method: 'post',
        params: this.$http.adornParams({
          businessTagName: this.addForm.businessTagName,
          weight: this.addForm.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dialogAddFormVisible = false
          this.$message({
            message: "添加成功",
            type: "success"
          });
          Object.assign(this.addForm, this.$options.data().addForm)
          this.initTagList();
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    submitEdit() {
      this.$http({
        url: this.$http.adornUrl(`/businessTag/update`),
        method: 'post',
        params: this.$http.adornParams({
          businessTagId: this.editForm.businessTagId,
          businessTagName: this.editForm.businessTagName,
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

<style>

</style>
