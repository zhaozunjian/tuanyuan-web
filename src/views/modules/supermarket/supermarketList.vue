<template>
  <el-card>
    <div slot="header">
      <el-input class="sd-input-150" clearable @change="getchangeInit" placeholder="名称" size="small" v-model="keyword"/>
      <el-button @click="getStore()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
    </div>
    <el-table :data="storeList" :cell-style="$GlobalApi.cellClass" v-loading="flag"
              :header-cell-style="$GlobalApi.rowClass":height="tableHeight" border highlight-current-row size="small" stripe>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="名称" prop="bname"></el-table-column>
      <el-table-column label="营业状态" prop="operateStatusDescription"></el-table-column>
      <el-table-column label="联系电话" prop="contactPhone"></el-table-column>
      <el-table-column label="具体地址" prop="addressProbably" show-tooltip-when-overflow>
        <template slot-scope="scope">
          <span>{{ scope.row.addressProbably + scope.row.addressSpecific}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户码" prop="identificationCode"></el-table-column>
      <el-table-column label="上下线状态" prop="bstatus"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleDirectsIncome(scope.$index, scope.row)">商品列表</el-button>
          <el-button size="small" type="text" @click="handleStatus(scope.$index, scope.row)">状态切换</el-button>
          <el-button size="small" type="text" @click="openInfo(true, scope.row)">查看</el-button>
          <el-button size="small" type="text" @click="openInfo(false, scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="swtichAdd()" icon="el-icon-plus" size="small" type="primary">添加超市</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
  </el-card>
</template>

<script>

  export default {
    name: "supermarketList",
    data() {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        keyword: "",
        storeList: [],
        tableHeight: this.$GlobalApi.getWinHeight() - 280,
        directsId: "",
        flag: false,
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
      getchangeInit(val){
        if (val === null || val === ''){
          this.getStore();
        }
      },
      /*
       * 获取超市列表
       * */
      getStore() {
        this.flag = true
        this.$http({
          url: this.$http.adornUrl('/supermarket/page'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.currentPage,
            size: this.pageSize,
            bName: this.keyword
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.storeList = data.page.list;
            this.total = data.page.totalCount;
            this.flag = false
          } else {
            this.flag = false
            this.$message.error(data.msg)
          }
        })
      },
      swtichAdd() {
        this.$router.push({
          name: "addSupermarket"
        });
      },
      handleDelete(id) {
        this.$confirm("确定是否删除该超市", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarket/delete'),
            method: 'get',
            params: this.$http.adornParams({
              supermarketId: id
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
      },
      openInfo(flag, row) {
        this.$router.push({
          name: "updateSupermarket",
          query: {
            supermarketId: row.id,
            bName: row.bName,
            flag: flag
          }
        });
      },
      handleStatus(index, row) {
        this.$confirm("确认修改该超市的上下线状态吗?下线将导致该超市所有商品也将下架", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarket/switchBusinessStatus'),
            method: 'get',
            params: this.$http.adornParams({
              supermarketId: row.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getStore();
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
      //跳转到该商品
      handleDirectsIncome(index, row) {
        this.$router.push({
          name: "supermarketCommodity",
          query: {
            supermarketId: row.id,
            supermarketName: row.bname
          }
        });
      }
    }
  };
</script>
