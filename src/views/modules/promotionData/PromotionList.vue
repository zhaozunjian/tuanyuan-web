<template>
  <el-card>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="promotionList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 260"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="促销id" prop="promotionId" width="150px"/>
      <el-table-column label="促销名称" prop="promotionName"/>
      <el-table-column label="促销描叙" prop="promotionDescription"/>
      <el-table-column label="排序权重" prop="weight" width="100px"></el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <template slot-scope="scope">
          {{ scope.row.createTime| getTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.promotionId)" size="small" type="text">编辑</el-button>
          <el-button @click="handleDelete(scope.row.promotionId)" size="small" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="dialogFormVisibleAdd = true" icon="el-icon-plus" size="small" type="primary"
      >新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="35%" title="添加促销" :visible.sync="dialogFormVisibleAdd" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="form">
        <el-form-item label="促销名称">
          <el-input v-model.trim="addForm.promotionName"></el-input>
        </el-form-item>
        <el-form-item label="促销描述">
          <el-input v-model.trim="addForm.promotionDescription"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input v-model.trim="addForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="code-dialog" width="35%" title="修改促销" :visible.sync="dialogFormVisibleEdit" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="editForm" ref="form">
        <el-form-item label="促销名称">
          <el-input v-model.trim="editForm.promotionName"></el-input>
        </el-form-item>
        <el-form-item label="促销描述">
          <el-input v-model.trim="editForm.promotionDescription"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input v-model.trim="editForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>


export default {
    data() {
        return {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            promotionList: [],
            dialogFormVisibleAdd: false,
            dialogFormVisibleEdit: false,
            addForm: {
                promotionName: '',
                promotionDescription: '',
                weight: 0
            },
            editForm: {

            }
        }
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            this.initPromotionList()
        },
        initPromotionList() {
          this.$http({
            url: this.$http.adornUrl(`/promotion/page`),
            method: 'post',
            params: this.$http.adornParams({
              currentPage: this.currentPage,
              pageSize: this.pageSize
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.promotionList = data.result.data
              this.total = data.result.pageModel.total
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        submitAdd() {
          this.$http({
            url: this.$http.adornUrl(`/promotion/add`),
            method: 'post',
            params: this.$http.adornParams({
              promotionName: this.addForm.promotionDescription,
              promotionDescription: this.addForm.promotionDescription,
              weight: this.addForm.weight
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.initPromotionList()
              this.dialogFormVisibleAdd = false;
              Object.assign(this.addForm, this.$options.data().addForm)
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        handleEdit(promotionId) {
            this.dialogFormVisibleEdit = true
          this.$http({
            url: this.$http.adornUrl(`/promotion/info`),
            method: 'get',
            params: this.$http.adornParams({
              promotionId: promotionId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.editForm = data.result;
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        submitEdit() {
          this.$http({
            url: this.$http.adornUrl(`/promotion/update`),
            method: 'post',
            params: this.$http.adornParams({
              promotionId: this.editForm.promotionId,
              promotionName: this.editForm.promotionName,
              promotionDescription: this.editForm.promotionDescription,
              weight: this.editForm.weight
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.initPromotionList();
              //恢复默认
              this.dialogFormVisibleEdit = false;
              Object.assign(this.editForm, this.$options.data().editForm)
            } else {
              this.$message.error(data.msg);
            }
          })
        },
        handleDelete(promotionId) {
            this.$confirm("确认删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(res => {
              this.$http({
                url: this.$http.adornUrl(`/promotion/remove`),
                method: 'get',
                params: this.$http.adornParams({
                  promotionId: promotionId
                })
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  this.initPromotionList();
                } else {
                  this.$message.error(data.msg);
                }
              })
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            })
        },
        closeDialog() {
            this.dialogFormVisibleAdd = false
            this.dialogFormVisibleEdit = false
        },
        // 切换分页
        handleCurrentChange(val) {
          this.currentPage = val
            this.initPromotionList()
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.initPromotionList()
        }
    }
};
</script>

<style lang="less">
</style>
