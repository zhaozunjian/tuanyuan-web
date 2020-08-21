<template>
  <el-card>
    <div slot="header">
      <el-input class="sd-input-150" clearable placeholder="品牌商名称" size="small" v-model="searchContent"/>
      <el-button @click="initHeadquarterList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
    </div>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="headquarterList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 260"
      border
      highlight-current-row
      size="small"
      stripe
      style="width: 100%;">
      <el-table-column
        label="品牌商ID"
        prop="headquarterId"
      ></el-table-column>
      <el-table-column label="品牌商名称" prop="headquarterName"></el-table-column>
      <el-table-column label="品牌商标题" prop="headquarterTitle"></el-table-column>
      <el-table-column label="品牌商店铺码" prop="identificationCode"></el-table-column>
      <el-table-column label="品牌商联系电话" prop="headquarterContactPhone"></el-table-column>
      <el-table-column label="关联的美食酒店数量" prop="bindBusinessCount"></el-table-column>
      <el-table-column
        label="操作"
        width="230">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleMerchantBindMerchantUsersList(scope.$index, scope.row)">店员列表</el-button>
          <el-button size="small" type="text" @click="handleHeadquarterBindBusiness(scope.$index, scope.row)">商家列表</el-button>
          <el-button @click="handleEdit(scope.$index, scope.row)" size="small" type="text">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="AddHeadquarter" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
  </el-card>
</template>

<script>

  export default {
    data() {
      return {
        searchContent: '',
        headquarterList: [],
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    },
    activated() {
      this.initHeadquarterList()
    },
    methods: {
      initHeadquarterList() {
        this.$http({
          url: this.$http.adornUrl('/headquarter/pageWithSearch'),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            searchContent: this.searchContent
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.headquarterList = data.result.data;
            this.total = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleMerchantBindMerchantUsersList(index, headquarter) {
        this.$router.push({
          path: "merchantBindMerchantUsersList",
          query: {
            merchantId: headquarter.merchantId,
            merchantName: headquarter.headquarterName
          }
        });
      },
      handleHeadquarterBindBusiness(index, headquarter) {
        this.$router.push({
          name: "HeadquarterBindBusinessList",
          query: {
            headquarterId: headquarter.headquarterId,
            headquarterName: headquarter.headquarterName
          }
        });
      },
      handleEdit(index, headquarter) {
        this.$router.push({
          path: "UpdateHeadquarter",
          query: {
            headquarterId: headquarter.headquarterId,
            headquarterName: headquarter.headquarterName
          }
        });
      },
      handleDelete(index, headquarter) {
        this.$confirm("确认删除该品牌商并解除绑定关联吗?这会导致该品牌商的所有对商品的抽成也将全部取消", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/headquarter/delete'),
            method: 'get',
            params: this.$http.adornParams({
              headquarterId: headquarter.headquarterId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.initHeadquarterList();
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      },
      AddHeadquarter() {
        this.$router.push({
          path: 'AddHeadquarter'
        })
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.initHeadquarterList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initHeadquarterList()
      }
    }
  };
</script>

<style>

</style>
