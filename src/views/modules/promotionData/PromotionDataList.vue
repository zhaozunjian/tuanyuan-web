<template>
  <el-card>
    <el-tabs v-model="promotionId" type="card" @tab-click="switchTab" >
      <el-tab-pane :key="index" v-for="(promotionItem, index) in promotionList"
                   :label="promotionItem.promotionName" :name="promotionItem.promotionId"></el-tab-pane>
    </el-tabs>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="promotionDataList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 260"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column
        label="内容id"
        prop="contentId">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="内容类型"
        prop="contentTypeDescription">
      </el-table-column>
      <el-table-column
        label="排序权重"
        prop="weight">
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.promotionDataId)" size="small" type="text">编辑</el-button>
          <el-button @click="handleDelete(scope.row.promotionDataId)" size="small" type="text">删除</el-button>
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
    <el-dialog class="code-dialog" width="35%" title="添加促销数据" :visible.sync="dialogFormVisibleAdd" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="form">
        <el-form-item label="促销活动">
          <el-select v-model.trim="addForm.promotionId" placeholder="请选择促销活动">
            <el-option :key="index" v-for="(promotionItem, index) in promotionList"
                       :label="promotionItem.promotionName" :value="promotionItem.promotionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类型">
          <el-select v-model.trim="addForm.contentType" placeholder="请选择内容类型">
            <el-option label="美食酒店商品" value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容id(由内容类型来决定)">
          <el-input v-model.trim="addForm.contentId"></el-input>
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
    <el-dialog class="code-dialog" width="35%" title="修改促销数据" :visible.sync="dialogFormVisibleEdit" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="editForm" ref="form">
        <el-form-item label="促销活动">
          <el-select v-model.trim="editForm.promotionId" placeholder="请选择促销活动">
            <el-option :key="index" v-for="(promotionItem, index) in promotionList"
                       :label="promotionItem.promotionName" :value="promotionItem.promotionId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类型">
          <el-select v-model.trim="editForm.contentType" placeholder="请选择内容类型">
            <el-option label="美食酒店商品" value="20"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容id(由内容类型来决定)">
          <el-input v-model.trim="editForm.contentId"></el-input>
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
        promotionId: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        promotionDataList: [],
        addForm: {
          promotionId: "",
          contentType: "20",
          contentId: "",
          weight: 0
        },
        editForm: {

        },
        promotionList: [] 
      }
  },
  activated() {
      this.initData()
  },
  methods: {
      switchTab() {
        this.currentPage = 1
        this.pageSize = 10
        this.initPromotionDataList()
      },
      initData() {
        this.initPromotionList()
        this.initPromotionDataList()
      },
      initPromotionList() {
        this.$http({
          url: this.$http.adornUrl(`/promotion/findAll`),
          method: 'get',
          params: this.$http.adornParams({

          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.promotionList = data.result
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      initPromotionDataList() {
        this.$http({
          url: this.$http.adornUrl(`/promotionData/pageByPromotionId`),
          method: 'post',
          params: this.$http.adornParams({
            promotionId: this.promotionId,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.promotionDataList = data.result.data
            this.total = data.result.pageModel.total
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      closeDialog() {
        this.dialogFormVisibleAdd = false
        this.dialogFormVisibleEdit = false
      },
      submitAdd() {
        this.$http({
          url: this.$http.adornUrl(`/promotionData/add`),
          method: 'post',
          params: this.$http.adornParams({
            promotionId: this.addForm.promotionId,
            contentType: this.addForm.contentType,
            contentId: this.addForm.contentId,
            weight: this.addForm.weight
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.initPromotionDataList()
            this.dialogFormVisibleAdd = false;
            Object.assign(this.addForm, this.$options.data().addForm)
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleEdit(promotionDataId) {
        this.dialogFormVisibleEdit = true
        this.$http({
          url: this.$http.adornUrl(`/promotionData/info`),
          method: 'get',
          params: this.$http.adornParams({
            promotionDataId: promotionDataId
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
          url: this.$http.adornUrl(`/promotionData/update`),
          method: 'post',
          params: this.$http.adornParams({
            promotionDataId: this.editForm.promotionDataId,
            promotionId: this.editForm.promotionId,
            contentType: this.editForm.contentType,
            contentId: this.editForm.contentId,
            weight: this.editForm.weight
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.initPromotionDataList();
            //恢复默认
            this.dialogFormVisibleEdit = false;
            Object.assign(this.editForm, this.$options.data().editForm)
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleDelete(promotionDataId) {
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/promotionData/remove`),
            method: 'get',
            params: this.$http.adornParams({
              promotionDataId: promotionDataId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.initPromotionDataList();
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
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
          this.initPromotionDataList()
      },
      handleSizeChange(val) {
          this.pageSize = val;
          this.initPromotionDataList()
      }
  }
};
</script>
