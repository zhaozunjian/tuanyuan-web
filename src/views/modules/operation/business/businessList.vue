<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="商家名称" size="small" @change="getchangeInit" v-model.trim="searchContent"/>
        <el-button @click="initData()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="tableData" ref="multipleTable"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 260"
        border
        highlight-current-row
        size="small"
        stripe v-loading="businessLoading"
        style="width: 100%;">
        <el-table-column
          label="商家ID"
          prop="businessId"
        ></el-table-column>
        <el-table-column label="商家名称" prop="businessName" show-tooltip-when-overflow></el-table-column>
        <el-table-column label="联系电话" prop="contactPhone"></el-table-column>
        <el-table-column label="商家分类" prop="businessCategoryName"></el-table-column>
        <el-table-column label="商家地址" prop="businessCategoryName" show-tooltip-when-overflow>
          <template slot-scope="scope">
            <span>{{ scope.row.addressProbably + scope.row.addressSpecific}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户码" prop="identificationCode"></el-table-column>
        <el-table-column label="合作结束时间">
          <template slot-scope="scope">
            <div>{{scope.row.contractEndTime | getTimeNoHour(scope.row.contractEndTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="上下线状态" prop="businessStatusDescription"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="handleCommodityList(scope.row)" size="small" type="text">查看商品</el-button>
            <el-button size="small" type="text" @click="handleStatus(scope.$index, scope.row)">状态切换</el-button>
            <el-button v-if="isAuth('business:show')" @click="handleEdit(true, scope.row)" size="small" type="text">查看</el-button>
            <el-button v-if="isAuth('business:update')" @click="handleEdit(false, scope.row)" size="small" type="text">编辑</el-button>
            <el-button v-if="isAuth('business:delete')" @click="handleDelete(scope.$index, scope.row)" size="small" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button v-if="isAuth('business:add')" @click="addBusiness()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
      </div>
      <div class="sd-rightpage">
        <pager :current-page="currentPage" :page-size="pageSize" :total="total"
               @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      tableData: [],
      businessLoading:false,
      searchContent: "",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dataListSelections:[]
    };
  },
  activated() {
    this.initData();
  },
  methods: {
    handleEdit(flag, row) {
      this.$router.push({
        name: "updateBusinessOperation",
        query: {
          businessId: row.businessId,
          businessName: row.businessName,
          merchantId:row.merchantId,
          flag: flag
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`确认删除该商家并解除绑定关联吗?删除将导致该商家的所有商品也同时删除`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/business/delete'),
          method: 'get',
          params: this.$http.adornParams({
            businessId: row.businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message.success("删除成功")
            this.initData()
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    handleStatus(index, row) {
      this.$confirm("确认修改该商家的上下线状态吗?下线将导致该商家所有商品也将下架", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/business/switchBusinessStatus'),
          method: 'get',
          params: this.$http.adornParams({
            businessId: row.businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.initData();
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      });
    },
    handleCommodityList(row) {
      this.$router.push({
        name: "businessCommodityList",
        query: {
          businessId: row.businessId,
          businessName: row.businessName
        }
      });
    },
    handleBusinessIncome() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "businessIncome",
          query: {
            businessId: this.dataListSelections[0].businessId,
            businessName: this.dataListSelections[0].businessName
          }
        });
      }
    },
    handleMerchantBindMerchantUsersList() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "merchantBindMerchantUsersList",
          query: {
            merchantId: this.dataListSelections[0].merchantId,
            merchantName: this.dataListSelections[0].businessName
          }
        });
      }
    },

    handleBusinessTagBindBusinessList() {
      if (this.dataListSelections.length == 1){
        this.$router.push({
          name: "BusinessTagBindBusinessList",
          query: {
            businessId: this.dataListSelections[0].businessId,
            businessName: this.dataListSelections[0].businessName
          }
        })
      }
    },
    getchangeInit(val){
      if (val === null || val === ''){
        this.initData();
      }
    },
    initData() {
      this.businessLoading = true
      this.$http({
        url: this.$http.adornUrl(`/business/list`),
        method: 'post',
        params: this.$http.adornParams({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          searchContent: this.searchContent
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.tableData = data.result.data;
          this.total = data.result.pageModel.total;
          this.businessLoading = false
        } else {
          this.businessLoading = false
          this.$message.error(data.msg);
        }
      })
    },
    addBusiness(){
      this.$router.push({
        name: "addBusiness"
      });
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.initData()
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initData()
    }
  }
};
</script>

<style>

</style>
