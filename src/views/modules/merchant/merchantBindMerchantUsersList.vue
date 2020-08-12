<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>当前所选择的商户名称: {{this.merchantName}}</span>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="tableData"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="手机号码" prop="merchantUsersPhoneNumber"></el-table-column>
      <el-table-column label="角色" prop="relationDescription"></el-table-column>
      <el-table-column
        label="注册时间">
        <template slot-scope="scope">
          <div>{{scope.row.merchantUsersCreateTime | getTime(scope.row.merchantUsersCreateTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleAppointManager(scope.$index, scope.row)">任命为新店长</el-button>
          <el-button size="small" type="text" @click="handleRemove(scope.$index, scope.row)">解除关联</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="openAddForm()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <!--<div class="sd-rightpage">-->
      <!--<pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"-->
             <!--@current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>-->
    <!--</div>-->
    <el-dialog class="code-dialog" width="35%" title="添加商品" :visible.sync="dialogAddForm" @close="handleClose">
      <el-form class="sd-form" :rules="rules" label-position="right" label-width="110px" size="small" style="padding-right: 6%" ref="addForm" :model="addForm">
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model.trim="addForm.phoneNumber" placeholder="请输入店员的手机号码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddForm = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddForm()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      merchantId: '',
      merchantName: '',
      dialogAddForm: false,
      addForm: {

      },
      tableData: [],
      rules:{
        phoneNumber: [{validator: this.$Utils.validPhone, required: true, trigger: 'change'}],
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.merchantId = this.$route.query.merchantId
      this.merchantName = this.$route.query.merchantName
      this.$http({
        url: this.$http.adornUrl(`/merchantBindMerchantUsers/findListByMerchantId`),
        method: 'get',
        params: this.$http.adornParams({
          merchantId: this.merchantId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.tableData = data.result
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    openAddForm() {
      this.dialogAddForm = true
    },
    handleAddForm() {
      this.$refs['addForm'].validate(async valid => {
        if (valid) {
          let merchantId = this.$route.query.merchantId
          let phoneNumber = this.addForm.phoneNumber
          this.$http({
            url: this.$http.adornUrl(`/merchantBindMerchantUsers/add`),
            method: 'post',
            params: this.$http.adornParams({
              merchantId: merchantId,
              phoneNumber: phoneNumber
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              // this.$bus.$emit('refresh')
              this.dialogAddForm = false
              this.addForm = {}
              this.initData()
            } else {
              this.$message.error(data.msg);
            }
          })
        } else {
          return false;
        }
      });
    },
    //关闭弹窗并清除数据
    handleClose() {
      this.dialogAddForm = false
      this.addForm = {};
    },
    handleAppointManager(index, row) {
      let item = row
      this.$confirm("确认任命该商户账号为新店长吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/merchantBindMerchantUsers/appointManager`),
          method: 'get',
          params: this.$http.adornParams({
            merchantId: item.merchantId,
            merchantUsersId: item.merchantUsersId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.initData()
          } else {
            this.$message.error(data.msg);
          }
        })
      });
    },
    handleRemove(index, row) {
      let item = row
      this.$confirm("确认解除该商户账号与商户店的关联?若解除的是店长,请尽快任命一位新店长", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/merchantBindMerchantUsers/remove`),
          method: 'get',
          params: this.$http.adornParams({
            merchantId: item.merchantId,
            merchantUsersId: item.merchantUsersId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.initData()
          } else {
            this.$message.error(data.msg);
          }
        })
      });
    }
  }
};
</script>

<style>

</style>
