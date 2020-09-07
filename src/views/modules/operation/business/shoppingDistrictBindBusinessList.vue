<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>所选择的商家名称: {{this.businessName}}</span>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="listData"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column prop="administrativeAreaName" label="行政区名称"></el-table-column>
      <el-table-column prop="shoppingDistrictName" label="商圈名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="dialogAddFormVisible = true" icon="el-icon-plus" size="small" type="primary"
      >新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="45%" title="添加商圈" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-cascader
        v-model="addForm.administrativeAreaArrayAdd"
        :options="administrativeAreaOptions"
        :props="{ expandTrigger: 'hover' }" size="small"
      ></el-cascader>
      <el-input class="sd-input-150" clearable placeholder="请输入商圈名称" size="small" @change="getchangeInit" v-model.trim="addForm.shoppingDistrictName"/>
      <el-button @click="initAddShoppingDistrictBindBusinessList(addAdministrativeAreaArray[addAdministrativeAreaArray.length-1])" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      <el-table
        ref="singleTable"
        :data="addForm.shoppingDistrictListAddForm"
        :height="$GlobalApi.getWinHeight() - 300">
        <el-table-column prop="administrativeAreaId" label="城市编号"></el-table-column>
        <el-table-column prop="shoppingDistrictName" label="商圈名称" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template slot-scope="scope">
            <el-button @click="handleAddShoppingDistrict(scope.row)" size="small" type="text">确定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pager :current-page="addCurrentPage" :page-size="addPageSize" :total="addTotal"
             @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeChange" background/>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      businessId: '',
      businessName: '',
      dialogAddFormVisible: false,
      administrativeAreaOptions: [],
      addTotal: 0,
      addCurrentPage: 1,
      addPageSize: 10,
      addForm: {
          administrativeAreaArrayAdd: ["800","801"],
          shoppingDistrictName:'',
          shoppingDistrictListAddForm: [],
          chooseShoppingDistrict: null
      },
      listData: [],
      listTotal: 0,
      listCurrentPage: 1,
      listPageSize: 10
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      this.businessId = this.$route.query.businessId
      this.businessName = this.$route.query.businessName
      this.initAdministrativeAreaArray()
      this.initShoppingDistrictBindBusinessList()
      this.initAddShoppingDistrictBindBusinessList(this.addForm.administrativeAreaArrayAdd[this.addForm.administrativeAreaArrayAdd.length-1])
    },
    initAdministrativeAreaArray() {
      this.$http({
        url: this.$http.adornUrl(`/administrativeArea/findAll`),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.administrativeAreaOptions = this.getTreeData(data.result);
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    initShoppingDistrictBindBusinessList() {
      let businessId = this.businessId
      this.$http({
        url: this.$http.adornUrl(`/shoppingDistrictBindBusiness/pageByBusinessId`),
        method: 'post',
        params: this.$http.adornParams({
          businessId: businessId,
          currentPage: this.listCurrentPage,
          pageSize: this.listPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.listData = data.result.data
          this.listTotal = data.result.pageModel.total;
          this.listCurrentPage = data.result.pageModel.currentPage;
          this.listPageSize = data.result.pageModel.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    closeDialog() {
        this.dialogAddFormVisible = false
    },
    handleListCurrentChange(val) {
      this.listCurrentPage = val
        this.initShoppingDistrictBindBusinessList()
    },
    handleListSizeChange(val) {
        this.listPageSize = val
        this.initShoppingDistrictBindBusinessList()
    },
    handleDelete(row) {
        let item = row
        let shoppingDistrictId = item.shoppingDistrictId
        let shoppingDistrictName = item.shoppingDistrictName
        let businessId = this.businessId
        this.$confirm(`确认解除名为${shoppingDistrictName}的商圈?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/shoppingDistrictBindBusiness/remove`),
            method: 'get',
            params: this.$http.adornParams({
              shoppingDistrictId: shoppingDistrictId,
              businessId: businessId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              })
              this.initShoppingDistrictBindBusinessList()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        })
    },
    initAddShoppingDistrictBindBusinessList(administrativeAreaId) {
      this.$http({
        url: this.$http.adornUrl(`/shoppingDistrict/pageByAdministrativeAreaId`),
        method: 'post',
        params: this.$http.adornParams({
          administrativeAreaId: administrativeAreaId,
          shoppingDistrictName: this.addForm.shoppingDistrictName,
          currentPage: this.addCurrentPage,
          pageSize: this.addPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.addForm.shoppingDistrictListAddForm = data.result.data
          this.addTotal = data.result.pageModel.total;
          // this.addCurrentPage = data.result.pageModel.currentPage;
          // this.addPageSize = data.result.pageModel.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleAddShoppingDistrict(row) {
        let shoppingDistrictId = row.shoppingDistrictId
        let shoppingDistrictName = row.shoppingDistrictName
        let businessId = this.businessId
        this.$confirm(`确认绑定名为${shoppingDistrictName}的商圈?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/shoppingDistrictBindBusiness/add`),
            method: 'post',
            params: this.$http.adornParams({
              shoppingDistrictId: shoppingDistrictId,
              businessId: businessId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              })
              this.dialogAddFormVisible = false
              Object.assign(this.addForm, this.$options.data().addForm)
              this.initShoppingDistrictBindBusinessList()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        })
    },
    handleAddCurrentChange(val) {
      this.addCurrentPage = val
        // 刷新添加的商圈列表
        if (this.addAdministrativeAreaArray.length > 0) {
            let administrativeAreaId = this.addAdministrativeAreaArray[this.addAdministrativeAreaArray.length-1]
            this.initAddShoppingDistrictBindBusinessList(administrativeAreaId)
        }
    },
    getchangeInit(val){
      if (val === null || val === ''){
        this.initAddShoppingDistrictBindBusinessList(this.addForm.administrativeAreaArrayAdd[this.addForm.administrativeAreaArrayAdd.length-1])
      }
    },
    handleAddSizeChange(val) {
      this.addPageSize = val;
      if (this.addAdministrativeAreaArray.length > 0) {
        let administrativeAreaId = this.addAdministrativeAreaArray[this.addAdministrativeAreaArray.length-1]
        this.initAddShoppingDistrictBindBusinessList(administrativeAreaId)
      }
    }
  },
  computed: {
      addAdministrativeAreaArray() {
          return this.addForm.administrativeAreaArrayAdd
      }
  }
};
</script>

<style scoped>

</style>
