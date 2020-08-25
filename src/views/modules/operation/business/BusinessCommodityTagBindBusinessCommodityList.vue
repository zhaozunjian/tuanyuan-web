<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <span>所选择的商品名称: {{this.businessCommodityName}}</span>
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
      <el-table-column prop="businessCommodityTagName" label="标签名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button size="small" type="text" v-if="isAuth('business:tag:delete')" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button v-if="isAuth('business:tag:add')" @click="addBindTag()" icon="el-icon-plus" size="small" type="primary">新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="listCurrentPage" :page-size="listPageSize" :total="listTotal"
             @current-change="handleListCurrentChange" @handle-size-change="handleListSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="50%" title="添加标签" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-table
        :data="addForm.businessCommodityTagListData"
        tooltip-effect="dark" :height="$GlobalApi.getWinHeight() - 300"
        @select="selectChange"
        @select-all="selectAll"
        ref="multipleTable">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <el-table-column
          prop="businessCommodityTagName"
          label="标签名称">
        </el-table-column>
      </el-table>
      <pager :current-page="addCurrentPage" :page-size="addPageSize" :total="addTotal"
             @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeChange" background/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddBusinessCommodityTag()">确 定</el-button>
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
      listData: [],
      listTotal: 0,
      listCurrentPage: 1,
      listPageSize: 10,
      dialogAddFormVisible: false,
      addForm: {
        businessCommodityTagListData: [],
      },
      selectDataArrL:[],// 跨页多选所以的项，
      addTotal: 0,
      addCurrentPage: 1,
      addPageSize: 10,
    }
  },
  mounted() {
      this.initData()
  },
  methods: {
    checkBusinessCommodityId() {
      if (!this.$route.query.businessCommodityId) {
        this.businessCommodityId = Math.ceil(Math.random() * 10);
        this.$alert("修改商品标签设置需要选择一个商家,先去选择商家", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/businessList");
          }
        });
      }
    },
    initData() {
      this.checkBusinessCommodityId();
      this.businessId = this.$route.query.businessId;
      this.businessCommodityId = this.$route.query.businessCommodityId;
      this.businessCommodityName = this.$route.query.businessCommodityName
      this.initCommodityTagBindCommodityList()
    },
    initCommodityTagBindCommodityList() {
      let businessId = this.businessId
      let businessCommodityId = this.businessCommodityId
      this.$http({
        url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/pageByBusinessCommodityId`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: businessCommodityId,
          currentPage: this.listCurrentPage,
          pageSize: this.listPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.listData = data.result.data
          this.listTotal = data.result.pageModel.total;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleListCurrentChange(val) {
      this.listCurrentPage = val
      this.initCommodityTagBindCommodityList()
    },
    handleListSizeChange(val) {
      this.listPageSize = val
      this.initCommodityTagBindCommodityList()
    },
    handleDelete(row) {
      let item = row
      let businessCommodityTagId = item.businessCommodityTagId
      let businessCommodityTagName = item.businessCommodityTagName
      let businessId = this.businessId
      let businessCommodityId = this.businessCommodityId
      this.$confirm(`确认解除名为${businessCommodityTagName}的标签?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }).then(res => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/remove`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityTagId: businessCommodityTagId,
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.initCommodityTagBindCommodityList()
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
    addBindTag() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = true
      this.initBusinessCommodityTagList()
    },
    closeDialog() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = false
    },
    initBusinessCommodityTagList() {
      this.$http({
        url: this.$http.adornUrl(`/businessCommodityTag/pageAll`),
        method: 'post',
        params: this.$http.adornParams({
          currentPage: this.addCurrentPage,
          pageSize: this.addPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.addForm.businessCommodityTagListData = data.result.data
          this.addTotal = data.result.pageModel.total;

          //请求到的数据多选后回显被选中
          this.$nextTick(function () {
            this.selectDataArrL.forEach((item) => {
              this.addForm.businessCommodityTagListData.forEach((listitem) => {
                if (item.businessCommodityTagId == listitem.businessCommodityTagId) {
                  this.$refs.multipleTable.toggleRowSelection(listitem, true);
                }
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    //多选
    selectChange(arr, row) {
      let isHaveItem = this.selectDataArrL.find((item) => item.businessCommodityTagId == row.businessCommodityTagId);
      if (isHaveItem) {
        this.selectDataArrL = this.selectDataArrL.filter(
          (item) => item.businessCommodityTagId != isHaveItem.businessCommodityTagId
        );
      } else {
        this.selectDataArrL.push(row);
      }
    },
    // 全选
    selectAll(arr) {
      if (arr.length > 0) {
        this.addRows(arr)
      } else {
        this.removeRows(this.addForm.businessCommodityTagListData)
      }
    },
    // 添加选中行
    addRows(rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (
          !this.selectDataArrL.find(
            (item) => item.businessCommodityTagId === key.businessCommodityTagId
          )
        ) {
          this.selectDataArrL.push(key);
        }
      }
    },
    // 取消选中行
    removeRows(rows) {
      if (this.selectDataArrL.length > 0) {
        for (let row of rows) {
          this.selectDataArrL = this.selectDataArrL.filter(
            (item) => item.businessCommodityTagId !== row.businessCommodityTagId
          );
        }
      }
    },
    handleAddBusinessCommodityTag() {
      let selectDataArrLAdd = this.selectDataArrL
      let multipleSelectionLength = selectDataArrLAdd.length
      if (multipleSelectionLength<=0) {
          this.$message.error('请选择需绑定的标签');
      }
      let businessCommodityId = this.businessCommodityId
      this.$confirm(`确认绑定名为${selectDataArrLAdd[0].businessCommodityTagName}等${multipleSelectionLength}个标签?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "info"
        }).then(() => {
          selectDataArrLAdd.forEach(item => {
            this.$http({
              url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/add`),
              method: 'post',
              params: this.$http.adornParams({
                businessCommodityTagId: item.businessCommodityTagId,
                businessCommodityId: businessCommodityId
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: `添加标签-${item.businessCommodityTagName},成功`,
                  type: "success"
                })
                this.initCommodityTagBindCommodityList()
              } else {
                this.$message.error(data.msg);
              }
            })
          })
          this.dialogAddFormVisible = false
          Object.assign(this.addForm, this.$options.data().addForm)
        }).catch((err)=>{
            this.$message({
                type: "info",
                message: "已取消操作"
            });
        })
    },
    handleAddCurrentChange(val) {
      this.addCurrentPage = val
        this.initBusinessCommodityTagList()
    },
    handleAddSizeChange(val) {
        this.addPageSize = val
        this.initBusinessCommodityTagList()
    }
  }
};
</script>

<style>

</style>
