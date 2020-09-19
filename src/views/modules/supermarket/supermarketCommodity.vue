<template>
  <el-card>
    <div style="width: 100%;display: block">
      <div class="flex align-center category">
        <div v-for="(item,index) in categoryList" :key="index" class="item" :class="{'active':index==currentIndex}" @click="changeIndex(item.id,index)">
            <span @click="openChange(item.id)">{{item.cname}}</span>
          <i class="el-icon-close" @click.stop="handleDelte(item.id)" v-show="isDelete"></i>
        </div>
      </div>
      <div style="float: right;width: 10%;">
        <el-button type="text" size="small" @click="dialogFormVisible = true" v-show="!isDelete">添加分类</el-button>
        <el-button type="text" size="small" @click="isDelete= false" v-show="isDelete">完成</el-button>
        <el-button type="text" size="small" @click="isDelete= true" v-show="!isDelete">编辑分类</el-button>
      </div>
    </div>
    <el-table v-loading="tableflag"
      :data="tableData" size="small"
      border :cell-style="$GlobalApi.cellClass" :header-cell-style="$GlobalApi.rowClass"
      style="width: 100%;margin-bottom: 20px;" :height="$GlobalApi.getWinHeight() - 300">
      <el-table-column label="商品头像" prop="cavatar">
        <template slot-scope="scope">
          <img :src="scope.row.cavatar | getImg(scope.row.cavatar)" alt style="width: 60px;height: 60px;"/>
        </template>
      </el-table-column>
      <el-table-column prop="cname" label="商品名称"></el-table-column>
      <el-table-column prop="cdescription" label="商品描述"></el-table-column>
      <el-table-column label="库存限制" prop="openStock"></el-table-column>
      <el-table-column label="上下线状态" prop="cstatus"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="changeStatus(scope.row.id)">改变状态</el-button>
          <el-button size="small" type="text" @click="openCommodity(scope.row)">编辑</el-button>
          <el-button size="small" type="text" @click="deleteCommdity( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="openCommodity(null)" icon="el-icon-plus" size="small" type="primary">新增商品</el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <!--        添加分类 start-->
    <el-dialog class="code-dialog" width="45%" title="添加分类" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="addform" :rules="addrules" ref="addform" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
        <el-form-item label="超市ID">
          <el-input v-model="supermarketId" disabled aria-placeholder="请填写超市ID"></el-input>
        </el-form-item>
        <el-form-item label="商品分类名称" prop="cname">
          <el-input v-model="addform.cname"></el-input>
        </el-form-item>
        <el-form-item label="权重值" prop="weight">
          <el-input v-model.trim="addform.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类 start -->
    <el-dialog title="修改分类" class="code-dialog" width="45%" :visible.sync="dialogCategory" @close="handleClose">
      <el-form :model="form" :rules="rules" ref="form" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
         <el-form-item label="超市ID" prop="supermarketId">
          <el-input v-model="form.supermarketId" disabled aria-placeholder="请填写超市ID"></el-input>
        </el-form-item>
        <el-form-item label="商品分类名称" prop="cname">
          <el-input v-model.trim="form.cname"></el-input>
        </el-form-item>
        <el-form-item label="权重值" prop="weight">
          <el-input v-model.trim="form.weight" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogCategory = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

  export default {
    name: "supermarketCommodity",
    data() {
      return {
        tableflag: false,
        isDelete: false,
        currentIndex: undefined,
        supermarketId: "",
        supermarketName: "",
        categoryList: [],
        dialogFormVisible: false,
        dialogCategory: false,
        form: {
          id:'',
          supermarketId:'',
          cname:'',
          weight:0,
        },
        addform: {
          supermarketId:'',
          cname:'',
          weight:0,
        },
        id: "",
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        rules:{
          supermarketId: [
            { required: true, message: "请输入超市编号", trigger: "blur" }
          ],
          cname: [
            { required: true, message: "请输入分类名称", trigger: "blur" }
          ],
          weight: [
            { required: true, message: "请输入权重值", trigger: "blur" }
          ],
        },
        addrules:{
          supermarketId: [
            { required: true, message: "请输入超市编号", trigger: "blur" }
          ],
          cname: [
            { required: true, message: "请输入分类名称", trigger: "blur" }
          ],
          weight: [
            { required: true, message: "请输入权重值", trigger: "blur" }
          ],
        }
      };
    },
    activated(){
      if (this.$route.query.supermarketId) {
        this.supermarketId = this.$route.query.supermarketId;
        this.supermarketName = this.$route.query.supermarketName;
      }
    },
    created() {
      this.ifDirect();
      this.getCategoryList();
    },
    methods: {
      /*
       * 判断是否有ID存在
       * 如果没有则提示没有id，请先选择超市
       * 如果有。则正常加载数据
       * */
      ifDirect() {
        if (this.$route.query.supermarketId) {
          this.supermarketId = this.$route.query.supermarketId;
          this.getCategoryList();
        } else {
          this.$alert(
            "查看超市商品需要先选择一个超市，请先去选择超市",
            "温馨提示",
            {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.go(-1)
              }
            }
          );
        }
      },
      //获取分类
      getCategoryList() {
        this.$http({
          url: this.$http.adornUrl('/supermarketCommodityCustomCategory/list'),
          method: 'get',
          params: this.$http.adornParams({
            supermarketId: this.supermarketId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.categoryList = data.list;
            if (this.categoryList.length != 0){
              this.changeIndex(this.categoryList.length > 0 ? this.categoryList[0].id:'', 0);
            }
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //添加分类并清除数据
      handleAdd() {
        this.$refs['addform'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/supermarketCommodityCustomCategory/add'),
              method: 'post',
              data: this.$http.adornData({
                supermarketId: this.supermarketId,
                cname: this.addform.cname,
                weight: this.addform.weight,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.dialogFormVisible = false;
                this.getCategoryList();
                this.addform = {};
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      handleUpdate() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/supermarketCommodityCustomCategory/update'),
              method: 'post',
              data: this.$http.adornData({
                id: this.form.id,
                cname: this.form.cname,
                weight: this.form.weight,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.dialogCategory = false;
                this.getCategoryList();
                this.form = {};
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            return false;
          }
        });
      },
      //关闭弹窗并清除数据
      handleClose() {
        this.form = {};
        this.commodity = {};
      },
      openChange(id) {
        if (this.isDelete == true) {
          this.dialogCategory = true;
          this.id = id;
          this.getInfo();
        }
      },
      getInfo() {
        this.$http({
          url: this.$http.adornUrl('/supermarketCommodityCustomCategory/info'),
          method: 'get',
          params: this.$http.adornParams({
            id: this.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.form = data.vo;
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      //删除分类
      handleDelte(id) {
        this.$confirm("是否删除该列表", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarketCommodityCustomCategory/delete'),
            method: 'get',
            params: this.$http.adornParams({
              id: id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getCategoryList();
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
      //切换index
      changeIndex(id, currentIndex) {
        if (this.isDelete == false) {
          this.currentIndex = currentIndex;
          this.id = id;
          this.currentPage = 1;
          this.getCommodity();
        }
      },
      //获取分类商品
      getCommodity() {
        this.tableflag = true
        this.$http({
          url: this.$http.adornUrl('/supermarketCommodity/page'),
          method: 'get',
          params: this.$http.adornParams({
            supermarketId: this.supermarketId,
            supermarketCommodityCustomCategoryId: this.id,
            page: this.currentPage,
            size: this.pageSize
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.tableData = data.page.list;
            this.total = data.page.totalCount;
            this.tableflag = false
          } else {
            this.tableflag = false
            this.$message.error(data.msg)
          }
        })
      },
      openCommodity(row) {
        this.$router.push({
          name: "updateSupermarketCommodity",
          query: {
            id: row == null?null:row.id,
            supermarketId: this.supermarketId,
            supermarketName: this.supermarketName,
          }
        });
      },
      deleteCommdity(id){
        this.$confirm("确定是否删除该商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarketCommodity/delete'),
            method: 'get',
            params: this.$http.adornParams({
              id: id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getCommodity();
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      changeStatus(id) {
        this.$confirm("是否改变该商品的状态", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarketCommodity/switchStatus'),
            method: 'get',
            params: this.$http.adornParams({
              id: id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getCommodity();
            } else {
              this.$message.error(data.msg)
            }
          })
        })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消修改"
            });
          });
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getCommodity();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getCommodity();
      }
    }
  };
</script>
<style lang="less" scoped>
  .category {
    width: 90%;float: left;
    font-weight: 600;
    font-size: medium;
    .item {
      height: 40px;
      line-height: 40px;
      padding-right: 40px;
      float: left;

      i {
        cursor: pointer;
      }

      span {
        cursor: pointer;
      }
    }
  }

  .active {
    span {
      padding-bottom: 10px;
      border-bottom: 2px solid red;
      color: red;
    }
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

