<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="商品名称" size="small" @change="getchangeInit" v-model="cname"/>
        <el-button @click="getDataList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="libraryList"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 260"
        border v-loading="accountLoading"
        highlight-current-row
        size="small"
        stripe
        style="width: 100%;">
        <el-table-column label="商品头像">
          <template slot-scope="scope">
            <img :src="scope.row.cavatar | getImg(scope.row.cavatar)" alt style="width: 60px;height: 60px;"/>
          </template>
        </el-table-column>
        <el-table-column
          label="商品ID"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="商品名称"
          prop="cname"
        >
        </el-table-column>
        <el-table-column
          label="商品标题"
          prop="csubTitle"
        >
        </el-table-column>
        <el-table-column
          label="商品描述"
          prop="cdescription"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime">
        </el-table-column>
        <el-table-column
          label="修改时间"
          prop="updateTime">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="addOrUpdateHandle(scope.row.id)" size="small" type="text"
                       >编辑
            </el-button>
            <el-button @click="deleteHandle(scope.row.id)" class="sd-delcolor" size="small" type="text"
                       >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="addOrUpdateHandle(null)" icon="el-icon-plus" size="small" type="primary">新增
        </el-button>
      </div>
      <div class="sd-rightpage">
        <pager :current-page="pageIndex" :page-size="pageSize" :total="totalPage"
               @current-change="currentChangeHandle" @handle-size-change="sizeChangeHandle" background/>
      </div>
    </el-card>
    <el-dialog
      :title="id == null ? '新增' : '修改'"
      :close-on-click-modal="false"
      width="30%"
      @close="$refs['dataForm'].resetFields()"
      :visible.sync="libartyFlag">
      <el-form :model="dataForm" size="small" :rules="dataRule" ref="dataForm" class="sd-form" label-width="100px">
        <el-form-item label="商品名称" prop="cname">
          <el-input v-model="dataForm.cname" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品标题" prop="csubTitle">
          <el-input v-model="dataForm.csubTitle" placeholder="商品标题"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="cdescription">
          <el-input v-model="dataForm.cdescription" placeholder="商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品头像" prop="cavatar">
          <!--<el-upload-->
            <!--:action="$GlobalApi.getServerUrl('/system/file/supermarketCommodity/upload')"-->
            <!--:before-upload="beforeAvatarUpload"-->
            <!--:headers="$GlobalApi.getUserToken()"-->
            <!--:on-error="upImgError"-->
            <!--:on-success="upImgSuccess"-->
            <!--:show-file-list="false"-->
            <!--class="avatar-uploader">-->
            <!--<img :src="imageServerUrl + dataForm.cavatar" style="width: 200px;" v-if="dataForm.cavatar">-->
            <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>-->
          <!--</el-upload>-->
          <el-upload
            class="avatar-uploader"
            action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
            :before-upload="beforeAvatarUpload"
            :show-file-list="false">
            <img v-if="dataForm.cavatar" :src="dataForm.cavatar" style="width: 200px;"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="libartyFlag = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import { postByFormDataApi } from "@/utils/api";
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";
  export default {
    data () {
      return {
        imageServerUrl:SERVER_CONSTANT.imageServerUrl,
        cname: '',
        id:'',
        libartyFlag:false,
        accountLoading:false,
        libraryList:[],
        pageIndex: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        totalPage: this.$GlobalApi.Constants.DICT.TOTAL,
        dataForm:{
          id:'',
          cname:'',
          csubTitle:'',
          cdescription:'',
          cavatar:'',
        },
        cavatarImage:'',
        cavatarFile:'',
        dataRule:{
          cname: [
            { required: true, message: "请选择商品名称", trigger: "blur" }
          ],
          csubTitle: [
            { required: true, message: "请选择商品标题", trigger: "blur" }
          ],
          cdescription: [
            { required: true, message: "请选择商品描述", trigger: "blur" }
          ],
          cavatar: [
            { required: true, message: "请选择商品头像", trigger: "blur" }
          ],
        }
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getchangeInit(val){
        if (val === null || val === ''){
          this.getDataList();
        }
      },
      beforeAvatarUpload(file) {
        this.cavatarImage = file;
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        const freader = new FileReader();
        freader.readAsDataURL(file);
        const self = this;
        freader.onload = function(e) {
          self.dataForm.cavatar = e.target.result;
        };
        return isLt2M;
      },
      dataFormSubmit(){
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            //图片上传
            let submitFormData = new FormData();
            if (this.cavatarImage){
              submitFormData.append(
                "file",this.cavatarImage
              );
            }
            if (this.cavatarFile){
              submitFormData.append(
                "cavate",this.cavatarFile
              );
            }
            submitFormData.append(
              "id",this.id
            );
            submitFormData.append(
              "cdescription",this.dataForm.cdescription
            );
            submitFormData.append(
              "csubTitle",this.dataForm.csubTitle
            );
            submitFormData.append(
              "cname",this.dataForm.cname
            );
            postByFormDataApi(this.id == null?`/supermarketCommodityLibrary/add`:'/supermarketCommodityLibrary/update', submitFormData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: this.id == null?"添加成功":"修改成功",
                  type: "success"
                });
                this.libartyFlag = false
                this.getDataList();
                this.$refs['dataForm'].resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          } else {
            return false;
          }
        });
      },
      // 获取数据列表
      getDataList () {
        this.accountLoading =true
        this.$http({
          url: this.$http.adornUrl('/supermarketCommodityLibrary/page'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize,
            'cname': this.cname
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.libraryList = data.page.list
            this.totalPage = data.page.totalCount
            this.accountLoading =false
          } else {
            this.accountLoading =false
            this.$message.error(data.msg);
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      addOrUpdateHandle(id){
        this.id = id;
        if (null == id){
          this.libartyFlag = true;
        } else {
          this.$http({
            url: this.$http.adornUrl('/supermarketCommodityLibrary/info'),
            method: 'get',
            params: this.$http.adornParams({
              id: id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm = data.vo
              this.libartyFlag = true;
              this.cavatarFile = data.vo.cavatar
              this.dataForm.cavatar = this.imageServerUrl + data.vo.cavatar
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      // 删除
      deleteHandle (id) {
        this.$confirm("确定是否删除该商品", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/supermarketCommodityLibrary/delete'),
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
              this.getDataList();
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
