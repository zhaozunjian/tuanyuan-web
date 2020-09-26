<template>
  <el-card>
    <el-table
      :cell-style="$GlobalApi.cellClassNoEdit"
      :data="tagList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 240"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="目标的金额" prop="buyEnoughAmount"></el-table-column>
      <el-table-column label="减少的金额" prop="reductionAmount"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="dialogAddFormVisible = true" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="35%" title="添加满减" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="addForm">
        <el-form-item label="目标的金额" prop="buyEnoughAmount" :rules="[{ required: true, trigger:'blur'}]">
          <el-input v-model="addForm.buyEnoughAmount" :min="0" :max="99999999" type="number"></el-input>
        </el-form-item>
        <el-form-item label="减少的金额" prop="reductionAmount" :rules="[{ required: true, trigger:'blur'}]">
          <el-input v-model="addForm.reductionAmount" :min="0" :max="99999999" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        dialogAddFormVisible: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        tagList: [],
        addForm: {
          buyEnoughAmount: 0.00,
          reductionAmount: 0.00
        }
      }
    },
    mounted() {
      this.initTagList()
    },
    methods: {
      initTagList() {
        this.$http({
          url: this.$http.adornUrl(`/supermarketBuyEnoughReduction/page`),
          method: 'get',
          params: this.$http.adornParams({
            page: this.currentPage,
            size: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tagList = data.page.list
            this.total = data.page.totalCount;
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      submitAdd() {
        this.$refs['addForm'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/supermarketBuyEnoughReduction/add`),
              method: 'post',
              data: this.$http.adornData({
                buyEnoughAmount: this.addForm.buyEnoughAmount,
                reductionAmount: this.addForm.reductionAmount
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dialogAddFormVisible = false
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$refs['addForm'].resetFields();
                this.initTagList();
              } else {
                this.$message.error(data.msg);
              }
            })
          } else {
            this.$notify.error({
              title: "错误",
              message: "请检查输入是否正确",
              offset: 100
            });
            return false;
          }
        });
      },
      closeDialog() {
        this.dialogAddFormVisible = false
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
