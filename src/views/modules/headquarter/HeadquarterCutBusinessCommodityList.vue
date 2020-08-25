<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header" style="margin-top: 0px">
      <el-col style="width: 100%;">
        <div style="width: 100%;display: flex;text-align: left;">
          <span style="width: 100%;">所选择的品牌商 {{this.headquarterName}}</span>
        </div>
        <div style="width: 100%;display: flex;margin-top: 5px;text-align: left;">
          <span style="width: 100%;">所选择的商家 {{this.businessName}}</span>
        </div>
      </el-col>
    </el-row>
    <el-table :cell-style="$GlobalApi.cellClass"
              :data="cutBusinessCommodityList"
              :header-cell-style="$GlobalApi.rowClass"
              :height="$GlobalApi.getWinHeight() - 280"
              border
              highlight-current-row
              size="small"
              stripe>
      <el-table-column label="商品ID" prop="businessCommodityId" width="150px"/>
      <el-table-column label="商品名称" prop="businessCommodityName"/>
      <el-table-column label="成本价" prop="costPrice"/>
      <el-table-column label="抽成金额" prop="takeCutPrice"></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEditTakeCut(scope.row)">编辑抽成金额</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="40%" title="修改商品金额抽成" :visible.sync="takeCutBusinessCommoditydialogFormVisible" @close="closeDialog">
      <el-form ref="takeCutBusinessCommodityForm" :model="takeCutEditForm" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
        <el-form-item>
          <span>所选择的商品: {{this.takeCutEditForm.businessCommodityName}}</span>
        </el-form-item>
        <el-form-item label="成本价(商户原所得价)">
          <span>{{this.takeCutEditForm.costPrice}}</span>
        </el-form-item>
        <el-form-item label="抽成金额">
          <el-input-number v-model="takeCutEditForm.takeCutPrice" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="danger" @click="submitTakeCutUpdate(takeCutEditForm)">确认修改</el-button>
          <el-button size="samll" plain @click="submitTakeCutRemove(takeCutEditForm)">取消对该商品的抽成(默认设为0)</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>

  export default {
    data() {
      return {
        businessId: '',
        businessName: '',
        headquarterId: '',
        headquarterName: '',
        searchContent: '',
        cutBusinessCommodityList: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        takeCutBusinessCommoditydialogFormVisible: false,
        takeCutEditForm: {
          businessCommodityId: '',
          businessCommodityName: '',
          costPrice: '',
          takeCutPrice: ''
        }
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        if (this.$route.query.businessId) {
          this.businessId = this.$route.query.businessId
          this.businessName = this.$route.query.businessName
          this.headquarterId = this.$route.query.headquarterId
          this.headquarterName = this.$route.query.headquarterName
          this.initCutBusinessCommodityList()
        }
      },
      initCutBusinessCommodityList() {
        let businessId = this.$route.query.businessId
        let headquarterId = this.$route.query.headquarterId
        this.$http({
          url: this.$http.adornUrl(`/headquarterCutBusinessCommodity/page`),
          method: 'post',
          params: this.$http.adornParams({
            businessId: businessId,
            headquarterId: headquarterId,
            searchContent: this.searchContent,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.cutBusinessCommodityList = data.result.data;
            this.total = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleEditTakeCut(businessCommodity) {
        this.takeCutBusinessCommoditydialogFormVisible = true
        this.takeCutEditForm = businessCommodity
      },
      submitTakeCutUpdate(takeCutEditForm) {
        this.$confirm(`确认将商品${takeCutEditForm.businessCommodityName}的抽成金额设置为${takeCutEditForm.takeCutPrice}?, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let headquarterId = this.$route.query.headquarterId
          this.$http({
            url: this.$http.adornUrl(`/headquarterCutBusinessCommodity/update`),
            method: 'post',
            data: this.$http.adornData({
              headquarterId: headquarterId,
              businessCommodityId: takeCutEditForm.businessCommodityId,
              takeCutPrice: takeCutEditForm.takeCutPrice
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.initCutBusinessCommodityList()
              this.$message.success('设置成功');
              this.takeCutBusinessCommoditydialogFormVisible = false
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      submitTakeCutRemove(takeCutEditForm) {
        this.$confirm(`确认将商品${takeCutEditForm.businessCommodityName}的抽成金额还原为0?, 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let headquarterId = this.$route.query.headquarterId
          this.$http({
            url: this.$http.adornUrl(`/headquarterCutBusinessCommodity/remove`),
            method: 'post',
            params: this.$http.adornParams({
              headquarterId: headquarterId,
              businessCommodityId: takeCutEditForm.businessCommodityId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.initCutBusinessCommodityList()
              this.$message.success('还原成功');
              this.closeDialog()
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.initCutBusinessCommodityList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initCutBusinessCommodityList()
      },
      closeDialog() {
        this.takeCutBusinessCommoditydialogFormVisible = false
      }
    }
  };
</script>

<style>

</style>
