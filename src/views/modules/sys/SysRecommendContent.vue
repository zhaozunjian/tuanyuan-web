<template>
  <el-card>
    <el-tabs v-model="belongPage" @tab-click="handleClick"  type="border-card">
      <el-tab-pane label="首页" name="10">
        <el-tabs v-model="recommendTypeId" @tab-click="handleClick"  type="card">
          <el-tab-pane label="顶部轮播图" name="1"></el-tab-pane>
          <el-tab-pane label="分类栏下广告位" name="2"></el-tab-pane>
          <el-tab-pane label="首页标签图" name="3"></el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="余额" name="100">
        <el-tabs v-model="recommendTypeId" @tab-click="handleClick"  type="card">
          <el-tab-pane label="团猿平台须知" name="1"></el-tab-pane>
          <el-tab-pane label="团猿平台须知详情" name="2"></el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-table :data="recommendList" :cell-style="$GlobalApi.cellClass"
                :header-cell-style="$GlobalApi.rowClass" border style="width: 100%">
        <el-table-column prop="imageUrl" label="图片">
          <template slot-scope="scope">
            <img :src="scope.row.imageUrl | getImg(scope.row.imageUrl)" alt class="imgclass" />
          </template>
        </el-table-column>
        <el-table-column prop="observedRole" label="观察者角色"></el-table-column>
        <el-table-column prop="contentTypeName" label="内容类型"></el-table-column>
        <el-table-column prop="contentId" label="内容id"></el-table-column>
        <el-table-column prop="description" label="文字描述作用"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row.sysRecommendContentId)">编辑</el-button>
            <el-button
              size="small"
              type="text"
              @click="handleDelete(scope.row.sysRecommendContentId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="dialogFormVisibleAdd = true" icon="el-icon-plus" size="small" type="primary">新增</el-button>
      </div>
    </el-tabs>
    <el-dialog class="code-dialog" width="35%" title="添加内容" :visible.sync="dialogFormVisibleAdd" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="addForm" ref="form">
        <el-form-item label="所属页面">
          <el-select style="width: 100%" v-model.trim="addForm.belongPage" placeholder="请选择所属页面">
            <el-option label="首页" value="10"></el-option>
            <el-option label="余额" value="100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所处位置">
          <el-select style="width: 100%" v-model.trim="addForm.recommendTypeId" placeholder="请选择所处位置">
            <el-option label="顶部的轮播图" value="1" v-if="addForm.belongPage==10"></el-option>
            <el-option label="分类栏下广告位" value="2" v-if="addForm.belongPage==10"></el-option>
            <el-option label="首页的标签图" value="3" v-if="addForm.belongPage==10"></el-option>
            <el-option label="团猿平台须知" value="1" v-if="addForm.belongPage==100"></el-option>
            <el-option label="团猿平台须知详情" value="2" v-if="addForm.belongPage==100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="观察者角色(普通用户,分销师等)">
          <el-input v-model.trim="addForm.observedRole"></el-input>
        </el-form-item>
        <el-form-item label="内容类型">
          <el-select style="width: 100%" v-model.trim="addForm.contentType" placeholder="请选择内容类型">
            <el-option label="普通内容,无跳转" value="0"></el-option>
            <el-option label="网页链接" value="1"></el-option>
            <el-option label="吃喝玩乐商家" value="10"></el-option>
            <el-option label="吃喝玩乐商品" value="20"></el-option>
            <el-option label="超市商家" value="30"></el-option>
            <el-option label="超市商品" value="40"></el-option>
            <el-option label="额外特殊的" value="1000"></el-option>
            <el-option label="促销活动" value="2000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容id(由内容类型来决定)">
          <el-input style="width: 100%" v-model.trim="addForm.contentId"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input style="width: 100%" v-model.trim="addForm.weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input style="width: 100%" v-model.trim="addForm.description" placeholder="请输入文字描述作用，可不填"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            :action="$GlobalApi.getServerUrl('/system/file/upload')"
            :before-upload="beforeUpImgadd"
            :headers="$GlobalApi.getUserToken()"
            :on-error="upImgErroradd"
            :on-success="upImgSuccessadd"
            :show-file-list="false"
            class="avatar-uploader">
            <img :src="imageServerUrl + addForm.imageUrl" class="avatar" v-if="addForm.imageUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogFormVisibleAdd=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitAdd()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="code-dialog" width="35%" title="修改内容" :visible.sync="dialogFormVisibleEdit" @close="closeDialog">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" :model="editForm" ref="form">
        <el-form-item label="所属页面">
          <el-select style="width: 100%" v-model.trim="editForm.belongPage" placeholder="请选择所属页面">
            <el-option label="首页" value="10"></el-option>
            <el-option label="余额" value="100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="观察者角色(普通用户,分销师等)">
          <el-input v-model.trim="editForm.observedRole"></el-input>
        </el-form-item>
        <el-form-item label="所处位置">
          <el-select style="width: 100%" v-model.trim="editForm.recommendTypeId" placeholder="请选择活动区域">
            <el-option label="顶部的轮播图" value="1" v-if="editForm.belongPage==10"></el-option>
            <el-option label="分类栏下广告位" value="2" v-if="editForm.belongPage==10"></el-option>
            <el-option label="首页的标签图" value="3" v-if="editForm.belongPage==10"></el-option>
            <el-option label="团猿平台须知" value="1" v-if="editForm.belongPage==100"></el-option>
            <el-option label="团猿平台须知详情" value="2" v-if="editForm.belongPage==100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容类型">
          <el-select style="width: 100%" v-model.trim="editForm.contentType" placeholder="请选择内容类型">
            <el-option label="普通内容,无跳转" value="0"></el-option>
            <el-option label="网页链接" value="1"></el-option>
            <el-option label="吃喝玩乐商家" value="10"></el-option>
            <el-option label="吃喝玩乐商品" value="20"></el-option>
            <el-option label="超市商家" value="30"></el-option>
            <el-option label="超市商品" value="40"></el-option>
            <el-option label="额外特殊的" value="1000"></el-option>
            <el-option label="促销活动" value="2000"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容id(由内容类型来决定)">
          <el-input style="width: 100%" v-model.trim="editForm.contentId"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input style="width: 100%" v-model.trim="editForm.weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input style="width: 100%" v-model.trim="editForm.description" placeholder="请输入文字描述作用，可不填"></el-input>
        </el-form-item>
        <el-form-item label="轮播图">
          <el-upload
            :action="$GlobalApi.getServerUrl('/system/file/upload')"
            :before-upload="beforeUpImg"
            :headers="$GlobalApi.getUserToken()"
            :on-error="upImgError"
            :on-success="upImgSuccess"
            :show-file-list="false"
            class="avatar-uploader">
            <img :src="imageServerUrl + editForm.imageUrl" class="avatar" v-if="editForm.imageUrl">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogFormVisibleEdit=false">取 消</el-button>
        <el-button size="small" type="primary" @click="submitEdit()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";

export default {
  data() {
    return {
      imageServerUrl: SERVER_CONSTANT.imageServerUrl,
      belongPage: "10",
      recommendTypeId: "1",
      recommendList: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      addForm: {
        belongPage: "10",
        recommendTypeId: "1",
        observedRole: "0",
        contentType: "0",
        contentId: "",
        weight: 0,
        description: "",
        imageUrl: ""
      },
      editForm: {
        sysRecommendContentId: "",
        belongPage: "",
        recommendTypeId: "",
        contentType: "",
        observedRole: "",
        contentId: "",
        imageUrl: "",
        weight: 0,
        description: ""
      }
    }
  },
  mounted() {
    this.initRecommendList()
  },
  methods: {
    handleClick() {
      this.initRecommendList()
    },
    initRecommendList() {
      this.$http({
        url: this.$http.adornUrl(`/sysRecommendContent/findByBelongPageAndRecommendTypeId`),
        method: 'get',
        params: this.$http.adornParams({
          belongPage: this.belongPage,
          recommendTypeId: this.recommendTypeId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.recommendList = data.result
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    closeDialog() {
      this.dialogFormVisibleAdd = false
      this.dialogFormVisibleEdit = false
    },
    beforeUpImg (file) {
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
    beforeUpImgadd (file) {
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
        this.editForm.imageUrl = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgSuccessadd (res, file) {
      if (res && res.code === 0) {
        this.addForm.imageUrl = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgError (err, file, fileList) {
      this.editForm.imageUrl = './src/assets/img/img_err.png';
    },
    upImgErroradd (err, file, fileList) {
      this.addForm.imageUrl = './src/assets/img/img_err.png';
    },
    submitAdd() {
      if (!this.addForm.imageUrl) {
        this.$message.error('请选择图片上传');
        return 
      }
      this.$http({
        url: this.$http.adornUrl(`/sysRecommendContent/add`),
        method: 'post',
        params: this.$http.adornParams({
          belongPage:this.addForm.belongPage,
          recommendTypeId:this.addForm.recommendTypeId,
          contentId:this.addForm.contentId,
          contentType:this.addForm.contentType,
          observedRole: this.editForm.observedRole,
          file:this.addForm.imageUrl,
          description:this.addForm.description,
          weight:this.addForm.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.initRecommendList();
          this.dialogFormVisibleAdd = false;
          Object.assign(this.addForm, this.$options.data().addForm)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleEdit(sysRecommendContentId) {
      this.dialogFormVisibleEdit = true
      this.$http({
        url: this.$http.adornUrl(`/sysRecommendContent/info`),
        method: 'get',
        params: this.$http.adornParams({
          sysRecommendContentId: sysRecommendContentId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.editForm = data.result;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    submitEdit() {
      this.$http({
        url: this.$http.adornUrl(`/sysRecommendContent/update`),
        method: 'post',
        params: this.$http.adornParams({
          belongPage:this.addForm.belongPage,
          recommendTypeId:this.addForm.recommendTypeId,
          contentId:this.addForm.contentId,
          contentType:this.addForm.contentType,
          file:this.addForm.imageUrl,
          description:this.addForm.description,
          weight:this.addForm.weight
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.initRecommendList();
          //恢复默认
          this.dialogFormVisibleEdit = false;
          Object.assign(this.editForm, this.$options.data().editForm)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleDelete(sysRecommendContentId) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.$http({
          url: this.$http.adornUrl(`/sysRecommendContent/remove`),
          method: 'get',
          params: this.$http.adornParams({
            sysRecommendContentId: sysRecommendContentId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.initRecommendList();
          } else {
            this.$message.error(data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      })
    }
  }
};
</script>

<style scoped>
  .imgclass{
    width: 150px;
    height: 50px;
  }
</style>
