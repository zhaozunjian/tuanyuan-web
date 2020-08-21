<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-input class="sd-input-150" clearable placeholder="名称" size="small" v-model="keyword"/>
        <el-button @click="getStore()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="storeList" :cell-style="$GlobalApi.cellClass"
              :header-cell-style="$GlobalApi.rowClass":height="tableHeight" border highlight-current-row size="small" stripe>
      <el-table-column label="ID" prop="directsId"></el-table-column>
      <el-table-column label="名称" prop="directsName"></el-table-column>
      <el-table-column label="营业状态" prop="operateStatusDescription"></el-table-column>
      <el-table-column label="联系电话" prop="directsContactPhone"></el-table-column>
      <el-table-column label="描述" prop="directsDescription"></el-table-column>
      <el-table-column label="所属店铺" prop="shop"></el-table-column>
      <el-table-column label="具体地址" prop="addressSpecific"></el-table-column>
      <el-table-column label="商户码" prop="identificationCode"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDirectsIncome(scope.$index, scope.row)">商品列表</el-button>
          <el-button size="small" type="text" @click="openInfo(scope.row.directsId)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row.directsId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="swtichAdd()" icon="el-icon-plus" size="small" type="primary">添加直营店</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
  </el-card>
</template>

<script>

  export default {
    name: "directStoreList",
    data() {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        keyword: "",
        storeList: [],
        tableHeight: this.$GlobalApi.getWinHeight() - 280,
        directsId: "",
        form: {}
      };
    },
    activated() {
      this.getStore();
    },
    methods: {
      handleCurrentChange(val) {
        this.currentPage = val
        this.getStore()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getStore()
      },
      /*
       * 获取直营店列表
       * */
      getStore() {
        this.$http({
          url: this.$http.adornUrl('/directs/page'),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            contactName: this.keyword
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.storeList = data.result.data;
            this.total = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      swtichAdd() {
        this.$router.push("/addDirectStore");
      },
      handleDelete(directsId) {
        this.$confirm("确定是否删除该直营店", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/directs/delete'),
            method: 'get',
            params: this.$http.adornParams({
              directsId: directsId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getStore();
            } else {
              this.$message.error(data.msg)
            }
          })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      openInfo(directsId) {
        this.$router.push({
          name: "editDirectStore",
          query: { directsId: directsId }
        });
      },

      //跳转到该直营店的商品列表页面
      handleDirectsIncome(index, row) {
        this.$router.push({
          name: "directCommodityList",
          query: {
            directsId: row.directsId
          }
        });
      }
    }
  };
</script>
