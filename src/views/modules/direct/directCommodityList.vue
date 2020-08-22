<template>
  <el-card>
    <div style="width: 100%;display: block">
      <div class="flex align-center category">
        <div
          v-for="(item,index) in categoryList"
          :key="index"
          class="item"
          :class="{'active':index==currentIndex}"
          @click="changeIndex(item.directsCommodityCategoryId,index)"
        >
            <span
              @click="openChange(item.directsCommodityCategoryId)"
            >{{item.directsCommodityCategoryName}}</span>
          <i
            class="el-icon-close"
            @click.stop="handleDelte(item.directsCommodityCategoryId)"
            v-show="isDelete"
          ></i>
        </div>
      </div>
      <div style="float: right;width: 10%;">
        <el-button type="text" size="small" @click="dialogFormVisible = true" v-show="!isDelete">添加分类</el-button>
        <el-button type="text" size="small" @click="isDelete= false" v-show="isDelete">完成</el-button>
        <el-button type="text" size="small" @click="isDelete= true" v-show="!isDelete">删除分类</el-button>
      </div>
    </div>
    <el-table
      :data="tableData" size="small"
      border :cell-style="$GlobalApi.cellClass" :header-cell-style="$GlobalApi.rowClass"
      style="width: 100%;margin-bottom: 20px;" :height="$GlobalApi.getWinHeight() - 310">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品分类名称">
              <span>{{ props.row.directsCommodityCategoryName }}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span>{{ props.row.directsCommodityName}}</span>
            </el-form-item>
            <el-form-item label=" 商品描述 ">
              <span>{{ props.row.directsCommodityDescription }}</span>
            </el-form-item>
            <el-form-item label="商品现价">
              <span>{{ props.row.currentPrice}}</span>
            </el-form-item>
            <el-form-item label="是否开启库存限制 ">
              <span>{{ props.row.openStock==1?'开启':'不开启' }}</span>
            </el-form-item>
            <el-form-item label="当前库存数量">
              <span>{{ props.row.stockCount}}</span>
            </el-form-item>
            <el-form-item label="商品单位">
              <span>{{ props.row.units}}</span>
            </el-form-item>
            <el-form-item label="权重值">
              <span>{{ props.row.weight}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="directsCommodityCategoryName" label="商品分类名称" width="120"></el-table-column>
      <el-table-column prop="directsCommodityName" label="商品名称"></el-table-column>
      <el-table-column label="商品头像">
        <template slot-scope="scope">
          <img
            :src="scope.row.directsCommodityAvatar | getImg(scope.row.directsCommodityAvatar)"
            alt
            style="width: 60px;height: 60px;"
          />
        </template>
      </el-table-column>
      <el-table-column prop="directsCommodityDescription" label="商品描述" width="120"></el-table-column>
      <el-table-column label="是否开启库存限制">
        <template slot-scope="scope">
          <div>{{scope.row.openStock==1?'开启':'不开启'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <div>{{scope.row.directsCommodityStatus==1?'正常上架':'下架'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="changeStatus(scope.row.directsCommodityId)">改变状态</el-button>
          <el-button size="small" type="text" @click="getCommdityInfo(scope.row.directsCommodityId)">编辑</el-button>
          <el-button
            size="small" type="text"
            @click="deleteCommdity( scope.row.directsCommodityId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="openCommodity()" icon="el-icon-plus" size="small" type="primary">新增
      </el-button>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <!--        添加分类 start-->
    <el-dialog title="添加分类" width="40%" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form :model="form" label-width="120px">
        <el-form-item label="直营店id">
          <el-input v-model.trim="directsId" autocomplete="off" disabled aria-placeholder="请填写直营店id，目前为1"></el-input>
        </el-form-item>
        <el-form-item label="商品分类名称">
          <el-input v-model.trim="form.directsCommodityCategoryName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!--        end-->

    <!-- 修改分类 start -->
    <el-dialog title="修改分类" width="40%" :visible.sync="dialogCategory" @close="handleClose">
      <el-form :model="form" label-width="120px">
        <!-- <el-form-item label="直营店id">
          <el-input v-model.trim="directsId" autocomplete="off" aria-placeholder="请填写直营店id，目前为1"></el-input>
        </el-form-item>-->
        <el-form-item label="商品分类名称">
          <el-input v-model.trim="form.directsCommodityCategoryName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权重值">
          <el-input v-model.trim="form.weight" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCategory = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end -->
    <!--        添加商品 start-->
    <el-dialog title="添加商品" width="45%" :visible.sync="dialogCommodity" @close="handleClose">
      <el-form :model="commodity" label-width="120px">
        <!--                <el-form-item label="直营店id">-->
        <!--                    <el-input v-model="commodity.directsId"></el-input>-->
        <!--                </el-form-item>-->
        <el-form-item label="直营店商品分类">
          <el-select v-model="commodity.directsCommodityCategoryId" placeholder="请选择商品分类">
            <el-option
              v-for="item in this.categoryList"
              :key="item.value"
              :label="item.directsCommodityCategoryName"
              :value="item.directsCommodityCategoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--                <el-form-item label="直营店商品分类id">-->
        <!--                    <el-input v-model.trim="commodity.directsCommodityCategoryId"></el-input>-->
        <!--                </el-form-item>-->
        <el-form-item label="商品名称">
          <el-input v-model.trim="commodity.directsCommodityName" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model.trim="commodity.directsCommodityDescription" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="$GlobalApi.getServerUrl('/system/file/directs/upload')"
            :before-upload="beforeAvatarUpload"
            :headers="$GlobalApi.getUserToken()"
            :on-error="upImgError"
            :on-success="upImgSuccess"
            :show-file-list="false"
            class="avatar-uploader">
            <img :src="imageServerUrl + imageUrl" class="businessAvatar" v-if="imageUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="权重值">
          <el-input v-model.trim="commodity.weight" placeholder="影响展示时的排序,越高越靠前"></el-input>
        </el-form-item>
        <el-form-item label="规格类型">
          <el-select v-model.trim="commodity.specsType" placeholder="请选择规格类型">
            <el-option label="单规格" value="1"></el-option>
            <el-option label="多规格" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品现价">
          <el-input v-model.trim="commodity.currentPrice" placeholder="用户购买时的价格"></el-input>
        </el-form-item>
        <el-form-item label="商品单位">
          <el-input v-model.trim="commodity.units" placeholder="(如KG,袋,支)"></el-input>
        </el-form-item>
        <el-form-item label="是否开启库存限制">
          <el-select v-model.trim="commodity.openStock">
            <el-option label="开启" value="1"></el-option>
            <el-option label="不开启" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存数量">
          <el-input v-model.trim="commodity.stockCount" placeholder="请输入当前库存数量"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCommodity = false">取 消</el-button>
        <el-button type="primary" @click="AddCommodity()">确 定</el-button>
      </div>
    </el-dialog>
    <!--        end-->
    <!--        修改商品 start-->
    <el-dialog title="修改商品" width="45%" :visible.sync="changeCommodity" @close="handleClose">
      <el-form :model="commodity" label-width="120px">
        <!--                                <el-form-item label="直营店id">-->
        <!--                                    <el-input v-model.trim="commodity.directsId" disabled></el-input>-->
        <!--                                </el-form-item>-->
        <!--                                <el-form-item label="直营店商品分类id">-->
        <!--                                    <el-input v-model.trim="commodity.directsCommodityCategoryId" disabled></el-input>-->
        <!--                                </el-form-item>-->
        <el-form-item label="商品名称">
          <el-input v-model.trim="commodity.directsCommodityName"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model.trim="commodity.directsCommodityDescription"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :action="$GlobalApi.getServerUrl('/system/file/directs/upload')"
            :before-upload="beforeAvatarUpload"
            :headers="$GlobalApi.getUserToken()"
            :on-error="upImgError"
            :on-success="upImgSuccess"
            :show-file-list="false"
            class="avatar-uploader">
            <img :src="imageServerUrl + imageUrl" class="businessAvatar" v-if="imageUrl">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="权重值">
          <el-input v-model.trim="commodity.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格类型">
          <el-select v-model.trim="commodity.specsType" placeholder="请选择规格类型">
            <el-option label="单规格" value="1"></el-option>
            <el-option label="多规格" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品现价">
          <el-input v-model.trim="commodity.currentPrice"></el-input>
        </el-form-item>
        <el-form-item label="商品单位">
          <el-input v-model.trim="commodity.units"></el-input>
        </el-form-item>
        <el-form-item label="是否开启库存限制">
          <el-select v-model.trim="commodity.openStock">
            <el-option label="开启" value="1"></el-option>
            <el-option label="不开启" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="当前库存数量">
          <el-input v-model.trim="commodity.stockCount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeCommodity = false">取 消</el-button>
        <el-button type="primary" @click="hanldeEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!--        end-->
  </el-card>
</template>

<script>

export default {
  name: "directCommodityList",
  data() {
    return {
      isDelete: false,
      currentIndex: undefined,
      directsId: "",
      categoryList: [],
      dialogFormVisible: false,
      dialogCategory: false,
      dialogCommodity: false,
      changeCommodity: false,
      form: {},
      directsCommodityCategoryId: "",
      commodity: {
        directsId: "",
        directsCommodityCategoryId: "",
        directsCommodityName: "",
        directsCommodityDescription: "",
        priority: "",
        weight: "",
        specsType: "",
        originPrice: "",
        costPrice: "",
        currentPrice: "",
        units: "",
        openStock: "",
        stockCount: "",
        directsCommodityAvatarFile: ""
      },
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      directsCommodityId: "",
      loading: true,
      imageUrl: ""
    };
  },
  created() {
    this.ifDirect();
  },
  methods: {
    /*
     * 判断是否有ID存在
     * 如果没有则提示没有id，请先选择直营店
     * 如果有。则正常加载数据
     * */
    ifDirect() {
      if (this.$route.query.directsId) {
        this.directsId = this.$route.query.directsId;
        this.getCategoryList();
      } else {
        this.$alert(
          "查看直营店商品需要先选择一个直营店，请先去选择直营店",
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
        url: this.$http.adornUrl('/directsCommodityCategory/findByDirectsId'),
        method: 'get',
        params: this.$http.adornParams({
          directsId: this.directsId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.categoryList = data.result;
          if (this.categoryList.length != 0){
            this.changeIndex(this.categoryList.length > 0 ? this.categoryList[0].directsCommodityCategoryId:'', 0);
          }
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //添加分类并清除数据
    handleAdd() {
      this.$http({
        url: this.$http.adornUrl('/directsCommodityCategory/add'),
        method: 'post',
        params: this.$http.adornParams({
          directsId: this.directsId,
          directsCommodityCategoryName: this.form.directsCommodityCategoryName
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.getCategoryList();
          this.form = {};
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //关闭弹窗并清除数据
    handleClose() {
      this.form = {};
      this.commodity = {};
    },
    openChange(directsCommodityCategoryId) {
      if (this.isDelete == true) {
        this.dialogCategory = true;
        this.directsCommodityCategoryId = directsCommodityCategoryId;
        this.getInfo();
      }
    },
    getInfo() {
      this.$http({
        url: this.$http.adornUrl('/directsCommodityCategory/info'),
        method: 'get',
        params: this.$http.adornParams({
          directsCommodityCategoryId: this.directsCommodityCategoryId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.form = data.result;
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //修改分类
    changeCategory() {
      this.$http({
        url: this.$http.adornUrl('/directsCommodityCategory/update'),
        method: 'post',
        params: this.$http.adornParams({
          directsCommodityCategoryId: this.directsCommodityCategoryId,
          directsId: this.directsId,
          directsCommodityCategoryName: this.form.directsCommodityCategoryName,
          weight: this.form.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.dialogCategory = false;
          this.getCategoryList();
          this.isDelete = false;
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //删除分类
    handleDelte(directsCommodityCategoryId) {
      this.$confirm("是否删除该列表", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/directsCommodityCategory/delete'),
          method: 'get',
          params: this.$http.adornParams({
            directsCommodityCategoryId: directsCommodityCategoryId
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //切换index
    changeIndex(directsCommodityCategoryId, currentIndex) {
      if (this.isDelete == false) {
        this.currentIndex = currentIndex;
        this.directsCommodityCategoryId = directsCommodityCategoryId;
        this.currentPage = 1;
        this.getCommodity();
      }
    },
    //获取商品分类
    getCommodity() {
      this.$http({
        url: this.$http.adornUrl('/directsCommodity/pageByDirectsIdAndDirectsCommodityCategoryId'),
        method: 'post',
        params: this.$http.adornParams({
          directsId: this.directsId,
          directsCommodityCategoryId: this.directsCommodityCategoryId,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.tableData = data.result.data;
          this.total = data.result.pageModel.total;
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //打开添加商品页面以及初始化
    openCommodity() {
      // this.commodity.directsId = this.directsId
      this.dialogCommodity = true;
      this.imageUrl = "";
    },
    //上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt20M = file.size / 20480 / 20480 < 20
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt20M) {
        this.$message.error('上传图片大小不能超过 20MB!')
      }
      return (isJPG || isGIF || isPNG || isBMP) && isLt20M
    },
    upImgSuccess (res, file) {
      if (res && res.code === 0) {
        this.imageUrl = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgError (err, file, fileList) {
      this.imageUrl = './src/assets/img/img_err.png';
    },
    //添加分类下的商品
    AddCommodity() {
      if (this.commodity.directsCommodityDescription == undefined) {
        this.commodity.directsCommodityDescription = "";
      }
      if (this.commodity.directsCommodityName == "") {
        this.$message.error("请先填写商品名称");
        return false;
      }
      if (this.commodity.currentPrice == "") {
        this.$message.error("请先填写商品现价");
        return false;
      }
      if (this.commodity.units == "") {
        this.$message.error("请先填写商品单位");
        return false;
      }
      if (this.commodity.weight == "") {
        this.$message.error("请先填写商品权重值");
        return false;
      }
      if (this.commodity.stockCount == "") {
        this.$message.error("请先填写当前库存数量");
        return false;
      }
      this.$http({
        url: this.$http.adornUrl('/directsCommodity/add'),
        method: 'post',
        data: this.$http.adornData({
          directsId: this.directsId,
          directsCommodityCategoryId: this.commodity.directsCommodityCategoryId,
          directsCommodityAvatarFile: this.imageUrl,
          directsCommodityName: this.commodity.directsCommodityName,
          directsCommodityDescription: this.commodity.directsCommodityDescription,
          stockCount: this.commodity.stockCount,
          priority: 0,
          openStock: this.commodity.openStock,
          weight: this.commodity.weight,
          specsType: this.commodity.specsType,
          units: this.commodity.units,
          currentPrice: this.commodity.currentPrice,
          costPrice: this.commodity.currentPrice,
          originPrice: this.commodity.currentPrice,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogCommodity = false;
          this.getCommodity();
          this.commodity = {};
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 打开弹窗并获取信息
    getCommdityInfo(directsCommodityId) {
      this.directsCommodityId = directsCommodityId;
      this.changeCommodity = true;
      this.$http({
        url: this.$http.adornUrl('/directsCommodity/info'),
        method: 'get',
        params: this.$http.adornParams({
          directsCommodityId: this.directsCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.commodity = data.result;
          this.imageUrl = data.result.directsCommodityAvatar;
          this.commodity.specsType = String(data.result.specsType);
          this.commodity.openStock = String(data.result.openStock);
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //完成编辑页面
    hanldeEdit() {
      this.$http({
        url: this.$http.adornUrl('/directsCommodity/update'),
        method: 'post',
        data: this.$http.adornData({
          directsId: this.directsId,
          directsCommodityId: this.directsCommodityId,
          directsCommodityCategoryId: this.commodity.directsCommodityCategoryId,
          directsCommodityAvatarFile: this.imageUrl,
          directsCommodityName: this.commodity.directsCommodityName,
          directsCommodityDescription: this.commodity.directsCommodityDescription,
          stockCount: this.commodity.stockCount,
          priority: 0,
          openStock: this.commodity.openStock,
          weight: this.commodity.weight,
          specsType: this.commodity.specsType,
          units: this.commodity.units,
          currentPrice: this.commodity.currentPrice,
          costPrice: this.commodity.currentPrice,
          specsType: this.commodity.specsType,
          originPrice: this.commodity.currentPrice,
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.getCommodity();
          this.commodity = {};
          this.changeCommodity = false;
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //删除商品功能
    deleteCommdity(directsCommodityId) {
      this.$confirm("是否删除该商品", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/directsCommodity/delete'),
          method: 'get',
          params: this.$http.adornParams({
            directsCommodityId: directsCommodityId
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
    changeStatus(directsCommodityId) {
      this.$confirm("是否改变该商品的状态", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/directsCommodity/switchStatus'),
            method: 'get',
            params: this.$http.adornParams({
              directsCommodityId: directsCommodityId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.getCategoryList();
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

