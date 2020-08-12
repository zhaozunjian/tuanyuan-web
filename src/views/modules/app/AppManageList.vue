<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card">
      <el-tab-pane label="用户端" name="11"></el-tab-pane>
      <el-tab-pane label="商户端" name="21"></el-tab-pane>
      <el-table :data="appManageList" :cell-style="$GlobalApi.cellClass"
                :header-cell-style="$GlobalApi.rowClass" border style="width: 100%">
        <el-table-column label="版本标题" prop="appManageTitle"></el-table-column>
        <el-table-column label="版本名称" prop="appManageVersionName"></el-table-column>
        <el-table-column label="版本号码" prop="appManageVersionNum"></el-table-column>
        <el-table-column label="目标类型" prop="targetTypeDescription"></el-table-column>
        <el-table-column label="平台类型" prop="platformTypeDescription"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleShow(scope.row.appManageId)">查看</el-button>
            <el-button size="small" type="text" @click="handleEdit(scope.row.appManageId)">编辑</el-button>
            <el-button
              size="small"
              type="text"
              @click="handleDelete(scope.row.appManageId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="dialogFormVisible = true" icon="el-icon-plus" size="small" type="primary">新增</el-button>
      </div>
      <div class="sd-rightpage">
        <pager :current-page="currentPage" :page-size="pageSize" :total="total"
               @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
      </div>
    </el-tabs>
    <el-dialog title="添加版本" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form label-width="120px" :model="form" ref="form">
        <el-form-item label="版本标题 ">
          <el-input v-model.trim="form.appManageTitle"></el-input>
        </el-form-item>
        <el-form-item label="版本描述 ">
          <el-input v-model.trim="form.appManageDescription"></el-input>
        </el-form-item>
        <el-form-item label="版本名称">
          <el-input v-model.trim="form.appManageVersionName"></el-input>
        </el-form-item>
        <el-form-item label="版本号码">
          <el-input-number v-model.trim="form.appManageVersionNum" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item label="是否强制更新">
          <el-select v-model.trim="form.forceUpdate" placeholder="是否强制更新">
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标端类型">
          <el-select v-model.trim="form.targetType" placeholder="请选择目标端类型">
            <el-option label="用户端" value="11"></el-option>
            <el-option label="商户端" value="21"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select v-model.trim="form.platformType" placeholder="请选择平台类型">
            <el-option label="android" value="1"></el-option>
            <el-option label="ios" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否更新至官网">
          <el-select v-model.trim="form.updateToOfficial" placeholder="是否更新至官网">
            <el-option label="否" value="0"></el-option>
            <el-option label="是(确认安装包是正式生成版)" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用包安装包">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false"
          >
            <i class="el-icon-plus avatar-uploader-icon">{{this.uploadTip}}</i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转商店url">
          <el-input v-model.trim="form.appManageStoreUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleAddAppManage()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改版本" :visible.sync="dialogFormVisible2" @close="closeDialog">
      <el-form label-width="120px" :model="form" ref="form">
        <el-form-item label="版本标题 ">
          <el-input v-model.trim="form.appManageTitle"></el-input>
        </el-form-item>
        <el-form-item label="版本描述 ">
          <el-input v-model.trim="form.appManageDescription"></el-input>
        </el-form-item>
        <el-form-item label="版本名称">
          <el-input v-model.trim="form.appManageVersionName"></el-input>
        </el-form-item>
        <el-form-item label="版本号码">
          <el-input-number v-model.trim="form.appManageVersionNum" :min="0" :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item label="是否强制更新">
          <el-select v-model.trim="form.forceUpdate" placeholder="是否强制更新">
            <el-option label="否" value="1"></el-option>
            <el-option label="是" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标端类型">
          <el-select v-model.trim="form.targetType" placeholder="请选择目标端类型">
            <el-option label="用户端" value="11"></el-option>
            <el-option label="商户端" value="21"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台类型">
          <el-select v-model.trim="form.platformType" placeholder="请选择平台类型">
            <el-option label="android" value="1"></el-option>
            <el-option label="ios" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安装包下载地址 ">
          <span>{{this.form.appManageDownloadUrl}}</span>
        </el-form-item>
        <el-form-item label="商店下载地址 ">
          <span>{{this.form.appManageStoreUrl}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleEditAppManage()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { imageServerUrl } from '@/assets/js/serverConstant'
export default {
  data() {
    return {
      activeName: "11",
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      dialogFormVisible2: false,
      uploadTip: "No",
      imageServerUrl: imageServerUrl,
      form: {
        appManageId: "",
        appManageTitle: "",
        appManageDescription: "",
        appManageVersionName: "",
        appManageVersionNum: "",
        appManageDownloadUrl: "",
        appManageStoreUrl: '',
        forceUpdate: "",
        targetType: "",
        platformType: "1",
        updateToOfficial: "0",
        file: null
      },
      appManageList: []
    };
  },
  mounted() {
    this.handleClick();
  },
  methods: {
    handleClick(tab, event) {
      if (!this.currentPage) {
        this.currentPage = 1;
      }
      if (!this.pageSize) {
        this.pageSize = 10;
      }
      this.$http({
        url: this.$http.adornUrl(`/appManage/pageByTargetType`),
        method: 'post',
        params: this.$http.adornParams({
          targetType: this.activeName,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.appManageList = data.result.data;
          this.total = data.result.pageModel.total;
          this.currentPage = data.result.pageModel.currentPage;
          this.pageSize = data.result.pageModel.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleAddAppManage() {
      let formData = new FormData();
      if (this.form.file) {
        formData.append("appManageDownloadAppFile", this.form.file);
      }
      formData.append("appManageTitle", this.form.appManageTitle);
      formData.append("appManageDescription", this.form.appManageDescription);
      formData.append("appManageVersionName", this.form.appManageVersionName);
      formData.append("appManageVersionNum", this.form.appManageVersionNum);
      formData.append("forceUpdate", this.form.forceUpdate);
      formData.append("targetType", this.form.targetType);
      formData.append("platformType", this.form.platformType);
      formData.append("updateToOfficial", this.form.updateToOfficial)
      formData.append("appManageStoreUrl", this.form.appManageStoreUrl==undefined?"":this.form.appManageStoreUrl)

      this.$http({
        url: this.$http.adornUrl(`/appManage/add`),
        method: 'post',
        params: this.$http.adornParams(formData)
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.dialogFormVisible = false;
          this.handleClick();
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleShow(){

    },
    handleEdit(appManageId) {
      this.dialogFormVisible2 = true;
      this.$http({
        url: this.$http.adornUrl(`/appManage/info`),
        method: 'get',
        params: this.$http.adornParams({
          appManageId: appManageId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.form = res.data.result;
          this.form.forceUpdate = String(data.result.forceUpdate)
          this.form.targetType = String(data.result.targetType)
          this.form.platformType = String(data.result.platformType)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleEditAppManage() {
      let formData = new FormData();
      if (this.form.file) {
        formData.append("appManageDownloadAppFile", this.form.file);
      }
      formData.append("appManageId", this.form.appManageId);
      formData.append("appManageTitle", this.form.appManageTitle);
      formData.append("appManageDescription", this.form.appManageDescription);
      formData.append("appManageVersionName", this.form.appManageVersionName);
      formData.append("appManageVersionNum", this.form.appManageVersionNum);
      formData.append("forceUpdate", this.form.forceUpdate);
      formData.append("targetType", this.form.targetType);
      formData.append("platformType", this.form.platformType);
      this.$http({
        url: this.$http.adornUrl(`/appManage/update`),
        method: 'post',
        params: this.$http.adornParams(formData)
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.dialogFormVisible2 = false;
          this.handleClick();
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    beforeAvatarUpload(file) {
      this.form.file = file;
      this.uploadTip = "OK";
      return true;
    },
    /*
     * 关闭对话框并且清空元素
     * */
    closeDialog() {
      this.form = {};
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.handleClick();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleClick();
    },
    handleDelete(appManageId) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/appManage/delete`),
            method: 'get',
            params: this.$http.adornParams({
              appManageId: appManageId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.handleClick();
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style>

</style>
