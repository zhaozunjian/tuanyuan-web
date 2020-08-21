<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>所选择的商品名称: {{this.businessCommodityName}}</span>
      </el-col>
    </el-row>
    <el-table :data="businessCommodityExternalSupportList" :cell-style="$GlobalApi.cellClass"
              :header-cell-style="$GlobalApi.rowClass":height="tableHeight" border highlight-current-row size="small" stripe>
      <el-table-column prop="belongPlatformSupport" label="第三方支持平台" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodCode" label="第三方支持平台的商品码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodName" label="第三方支持平台的商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="isRealClaimDescription" label="是否是实名制商品" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="removeExternalSupport(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="addExternalSupport()" icon="el-icon-plus" size="small" type="primary">增加第三方支持</el-button>
    </div>
    <el-dialog class="code-dialog" width="35%" title="增加第三方支持" :visible.sync="dialogFormVisibleAdd" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm">
        <el-form-item label="第三方支持平台">
          <el-select v-model="addForm.belongPlatformSupport">
            <el-option label="智游宝" value="zyb"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第三方支持平台的商品码">
          <el-input v-model.trim="addForm.goodCode" placeholder="输入第三方支持平台提供正确的商品码"></el-input>
        </el-form-item>
        <el-form-item label="第三方支持平台的商品名称">
          <el-input v-model.trim="addForm.goodName" placeholder="输入第三方支持平台提供正确的商品名称"></el-input>
        </el-form-item>
        <el-form-item label="是否是实名制商品">
          <el-select v-model="addForm.isRealClaim">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitAddForm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog class="code-dialog" width="35%" title="编辑第三方支持" :visible.sync="dialogFormVisibleEdit" @close="closeDialog">
      <el-form :model="editForm" ref="editForm" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
        <el-form-item label="第三方支持平台">
          <el-select v-model="editForm.belongPlatformSupport">
            <el-option label="智游宝" value="zyb"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="第三方支持平台的商品码">
          <el-input v-model.trim="editForm.goodCode" placeholder="输入第三方支持平台提供正确的商品码"></el-input>
        </el-form-item>
        <el-form-item label="第三方支持平台的商品名称">
          <el-input v-model.trim="editForm.goodName" placeholder="输入第三方支持平台提供正确的商品名称"></el-input>
        </el-form-item>
        <el-form-item label="是否是实名制商品">
          <el-select v-model="editForm.isRealClaim">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitEditForm()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        businessId: '',
        businessCommodityId: '',
        businessCommodityName: '',
        businessCommodityExternalSupportList: [],
        dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        addForm: {
          belongPlatformSupport: 'zyb',
          goodCode: '',
          goodName: '',
          isRealClaim: '0'
        },
        editForm: {
          belongPlatformSupport: '',
          goodCode: '',
          goodName: '',
          isRealClaim: ''
        }
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.checkBusinessCommodityId();
        this.businessId = this.$route.query.businessId;
        this.businessCommodityId = this.$route.query.businessCommodityId;
        this.businessCommodityName = this.$route.query.businessCommodityName
        this.initBusinessCommodityExternalSupportList()
      },
      checkBusinessCommodityId() {
        if (!this.$route.query.businessCommodityId) {
          this.businessCommodityId = Math.ceil(Math.random() * 10);
          this.$alert("修改商品标签设置需要选择一个商家,先去选择商家", "提示", {
            confirmButtonText: "确定",
            callback: action => {
              this.$router.go(-1)
            }
          });
        }
      },
      initBusinessCommodityExternalSupportList() {
        let businessCommodityId = this.businessCommodityId
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExternalSupport/findList'),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.businessCommodityExternalSupportList = data.result
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      closeDialog() {
        this.dialogFormVisibleAdd = false
        this.dialogFormVisibleEdit = false
      },
      addExternalSupport() {
        this.dialogFormVisibleAdd = true
      },
      submitAddForm() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExternalSupport/add'),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId,
            belongPlatformSupport: this.addForm.belongPlatformSupport,
            goodCode: this.addForm.goodCode,
            goodName: this.addForm.goodName,
            isRealClaim: this.addForm.isRealClaim
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            Object.assign(this.addForm, this.$options.data().addForm)
            this.initBusinessCommodityExternalSupportList()
            this.dialogFormVisibleAdd = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleEdit(row) {
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExternalSupport/info'),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId,
            belongPlatformSupport: row.belongPlatformSupport
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.editForm = data.result
            this.editForm.isRealClaim = String(data.result.isRealClaim)
            this.dialogFormVisibleEdit = true
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      submitEditForm() {
        this.$http({
          url: this.$http.adornUrl('/businessCommodityExternalSupport/update'),
          method: 'post',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId,
            belongPlatformSupport: this.editForm.belongPlatformSupport,
            goodCode: this.editForm.goodCode,
            goodName: this.editForm.goodName,
            isRealClaim: this.editForm.isRealClaim
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            Object.assign(this.editForm, this.$options.data().editForm)
            this.initBusinessCommodityExternalSupportList()
            this.dialogFormVisibleEdit = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      removeExternalSupport(row) {
        this.$confirm(`确认为商品删除该第三方的支持?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(res => {
          let businessCommodityId = row.businessCommodityId
          let belongPlatformSupport = row.belongPlatformSupport
          this.$http({
            url: this.$http.adornUrl('/businessCommodityExternalSupport/remove'),
            method: 'post',
            params: this.$http.adornParams({
              businessCommodityId: businessCommodityId,
              belongPlatformSupport: belongPlatformSupport
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              })
              this.initBusinessCommodityExternalSupportList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        })
      }
    }
  };
</script>
