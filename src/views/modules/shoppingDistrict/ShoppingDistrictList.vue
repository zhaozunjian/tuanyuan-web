<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-cascader class="sd-input-150" size="small" v-model="administrativeAreaArrayList" :options="administrativeAreaOptions" :props="{ expandTrigger: 'hover' }"
        ></el-cascader>
        <el-button @click="initShoppingDistrict()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="shoppingDistrictList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column label="商圈名称" prop="shoppingDistrictName"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
    <el-dialog class="code-dialog" width="35%" title="添加商圈" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="form">
        <el-form-item label="商圈城市">
          <el-cascader style="width: 100%"
            v-model="addForm.shoppingDistrictArrayAdd"
            :options="administrativeAreaOptions"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商圈名称">
          <el-input  style="width: 100%" v-model.trim="addForm.shoppingDistrictName"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input  style="width: 100%" v-model.trim="addForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddShoppingDistrict()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="code-dialog" width="35%" title="修改商圈" :visible.sync="dialogEditFormVisible" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="editForm" ref="form">
        <el-form-item label="商圈名称">
          <el-input style="width: 100%" v-model.trim="editForm.shoppingDistrictName"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input style="width: 100%" v-model.trim="editForm.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogEditFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleEditShoppingDistrict()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

export default {
  data() {
    return {
      administrativeAreaOptions: [],
      administrativeAreaArrayList: [],
      addChildrenShoppingDistrictOptions: [],
      addForm: {
        shoppingDistrictName: '',
        shoppingDistrictArrayAdd: [],
        weight: 1,
        childrenShoppingDistrictArray: []
      },
      editForm: {
        shoppingDistrictId: '',
        shoppingDistrictName: '',
        weight: 1
      },
      isRootDistrictAddForm: "1",
      currentPage: this.$GlobalApi.Constants.DICT.PAGE,
      pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
      total: this.$GlobalApi.Constants.DICT.TOTAL,
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      shoppingDistrictList: []
    }
  },
  mounted() {
    this.initData()
  },
  computed: {
    addFormShoppingDistrictArray() {
      return this.addForm.shoppingDistrictArrayAdd
    }
  },
  watch: {
    addFormShoppingDistrictArray(newValue) {
      if (newValue) {
        let administrativeAreaId = newValue[newValue.length-1]

        this.$http({
          url: this.$http.adornUrl(`/shoppingDistrict/findListByAdministrativeAreaId`),
          method: 'get',
          params: this.$http.adornParams({
            administrativeAreaId: administrativeAreaId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.addChildrenShoppingDistrictOptions = this.getTreeData(data.result)
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    }
  },
  methods: {
    initData() {
      this.getAdministrativeAreaArray()
    },
    getAdministrativeAreaArray() {
      this.$http({
        url: this.$http.adornUrl(`/administrativeArea/findAll`),
        method: 'get',
        params: this.$http.adornParams({

        })
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
    initShoppingDistrict() {
      if (!this.currentPage) {
        this.currentPage = 1;
      }
      if (!this.pageSize) {
        this.pageSize = 10;
      }
      let administrativeAreaId = this.administrativeAreaArrayList[this.administrativeAreaArrayList.length-1]
      if (administrativeAreaId) {
        this.$http({
          url: this.$http.adornUrl(`/shoppingDistrict/pageByAdministrativeAreaId`),
          method: 'post',
          params: this.$http.adornParams({
            administrativeAreaId: administrativeAreaId,
            currentPage: this.currentPage,
            pageSize: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.shoppingDistrictList = data.result.data
            this.total = data.result.pageModel.total;
            this.currentPage = data.result.pageModel.currentPage;
            this.pageSize = data.result.pageModel.pageSize;
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    closeDialog() {
      this.dialogAddFormVisible = false
      this.dialogEditFormVisible = false
    },
    handleAddShoppingDistrict() {
      let parentId = 0
      // if (this.addForm.childrenShoppingDistrictArray.length>0 && this.isRootDistrictAddForm!=0) {
      //   parentId = this.addForm.childrenShoppingDistrictArray[this.addForm.childrenShoppingDistrictArray.length-1]
      // }
      this.$http({
        url: this.$http.adornUrl(`/shoppingDistrict/add`),
        method: 'post',
        params: this.$http.adornParams({
          administrativeAreaId: this.addForm.shoppingDistrictArrayAdd[this.addForm.shoppingDistrictArrayAdd.length-1],
          parentId: parentId,
          rootId: this.addForm.shoppingDistrictArrayAdd[0],
          shoppingDistrictName: this.addForm.shoppingDistrictName,
          weight: this.addForm.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          })
          this.dialogAddFormVisible = false
          this.addForm = {}
          this.initShoppingDistrict()
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.initShoppingDistrict();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.initShoppingDistrict();
    },
    handleEdit(item) {
      this.dialogEditFormVisible = true
      this.$http({
        url: this.$http.adornUrl(`/shoppingDistrict/info`),
        method: 'get',
        params: this.$http.adornParams({
          shoppingDistrictId: item.shoppingDistrictId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.editForm.shoppingDistrictId = data.result.shoppingDistrictId
          this.editForm.shoppingDistrictName = data.result.shoppingDistrictName
          this.editForm.weight = data.result.weight
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleDelete(item) {
      let shoppingDistrictId = item.shoppingDistrictId
      if (shoppingDistrictId) {
        this.$confirm("确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/shoppingDistrict/remove`),
            method: 'get',
            params: this.$http.adornParams({
              shoppingDistrictId: shoppingDistrictId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              })
              this.initShoppingDistrict()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(()=>{
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        })
      }
    },
    handleEditShoppingDistrict() {
      let shoppingDistrictId = this.editForm.shoppingDistrictId
      this.$http({
        url: this.$http.adornUrl(`/shoppingDistrict/update`),
        method: 'post',
        params: this.$http.adornParams({
          shoppingDistrictId: shoppingDistrictId,
          shoppingDistrictName: this.editForm.shoppingDistrictName,
          weight: this.editForm.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          })
          this.dialogEditFormVisible = false
          this.initShoppingDistrict()
        } else {
          this.$message.error(data.msg);
        }
      })
    }
  }
};
</script>

<style>

</style>
