<template>
  <div id="personnel-detail">
    <el-card class="box-card">
      <div class="text item">
        <!--<hr class="sd-hr"/>-->
        <div style="width: 70%">
          <el-form :model="commodity" :rules="rules" ref="commodity" label-width="180px">
            <el-form-item label="所属超市ID" prop="supermarketId">
              <span>{{this.supermarketId}}</span>
            </el-form-item>
            <el-form-item label="所属超市名称" prop="supermarketName">
              <span>{{this.supermarketName}}</span>
            </el-form-item>
            <el-form-item label="所属超市分类" prop="supermarketCommodityCustomCategoryId">
              <el-select v-model="commodity.supermarketCommodityCustomCategoryId" placeholder="所属超市分类">
                <el-option v-for="item in supermarketCommodityCustomCategoryIdList" :key="item.id" :label="item.cname" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="模板导入">
              <el-button @click="libraryDialog = true" icon="el-icon-document" size="small" type="primary">模板导入</el-button>
            </el-form-item>
            <el-form-item label="商品名称" prop="cname">
              <el-input v-model="commodity.cname" style="width: 80%" placeholder="请输入商品名称" :disabled="liabryFlag"></el-input>
              <el-button @click="liabryFlag = false" size="small">编辑</el-button>
            </el-form-item>
            <el-form-item label="商品副标题" prop="csubTitle">
              <el-input v-model="commodity.csubTitle" placeholder="请输入商品副标题" :disabled="liabryFlag"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="cdescription">
              <el-input type="textarea" autosize v-model="commodity.cdescription" placeholder="请输入商品描述" :disabled="liabryFlag"></el-input>
            </el-form-item>
            <el-form-item label="推荐权重值" prop="weight">
              <el-input v-model.trim="commodity.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="合作价(商户所得价)">
              <el-input-number v-model="commodity.costPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="售价(用户购买价)">
              <el-input-number v-model="commodity.currentPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="原价(界面灰色的价格)">
              <el-input-number v-model="commodity.originPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="出售单位" prop="units">
              <el-select v-model="commodity.units" placeholder="出售单位">
                <el-option v-for="item in unitsList" :key="item.id" :label="item.tname" :value="item.tname" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否开启库存限制">
              <el-select v-model.trim="commodity.openStock">
                <el-option label="开启" :value="1"></el-option>
                <el-option label="关闭" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="当前库存" prop="stockCount" v-show="commodity.openStock==1">
              <el-input-number v-model="commodity.stockCount" :min="0" :max="1000000"></el-input-number>
            </el-form-item>
            <el-form-item label="总销量">
              <el-input-number v-model="commodity.salesTotalCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="月销量">
              <el-input-number v-model="commodity.salesCurrentMonthCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <!--<el-form-item label="商品头像" prop="cavatar">-->
              <!--<el-upload :disabled="liabryFlag"-->
                <!--:action="$GlobalApi.getServerUrl('/system/file/supermarketCommodity/upload')"-->
                <!--:before-upload="beforeAvatarUpload"-->
                <!--:headers="$GlobalApi.getUserToken()"-->
                <!--:on-error="upImgError"-->
                <!--:on-success="upImgSuccess"-->
                <!--:show-file-list="false"-->
                <!--class="avatar-uploader">-->
                <!--<img :src="imageServerUrl + commodity.cavatar" class="commodityAvatar" v-if="commodity.cavatar">-->
                <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>-->
              <!--</el-upload>-->
            <!--</el-form-item>-->
            <el-form-item label="商品头像" prop="cavatar">
              <el-upload
                class="avatar-uploader"
                action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
                :before-upload="beforeAvatarUpload2"
                :show-file-list="false">
                <img v-if="commodity.cavatar" :src="commodity.cavatar" class="businessAvatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:120px;" @click="submitForm()">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <select-super-market :visible.sync="libraryDialog" @selected="selectedLibrary" />
  </div>
</template>

<script>
  import { postByFormDataApi } from "@/utils/api";
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";
  export default {
    data() {
      return {
        unitsList:[],
        libraryDialog:false,
        liabryFlag: true,
        imageServerUrl:SERVER_CONSTANT.imageServerUrl,
        imageHttpsServerUrl:SERVER_CONSTANT.imageHttpsServerUrl,
        supermarketName:"",
        isEdit:false,
        id:"",
        supermarketId:"",
        commodity: {
          id: "",
          cname: "",
          csubTitle: "",
          supermarketCommodityCustomCategoryId: "",
          cdescription: "",
          weight: 0,
          units: "",
          cavatar: "",
          costPrice: 0.00,
          originPrice: 0.00,
          currentPrice: 0.00,
          openStock: 2,
          stockCount: 10000,
          salesTotalCount: '',
          salesCurrentMonthCount: 0,
        },
        cavatarImage:'',
        cavatarFile:'',
        flag: false,
        rules: {
          weight: [
            { required: true, message: "请选择推荐权重值", trigger: "blur" }
          ],
          supermarketCommodityCustomCategoryId: [
            { required: true, message: "请选择超市分类", trigger: "blur" }
          ],
          cname: [
            { required: true, message: "请选择商品名称", trigger: "blur" }
          ],
          units: [
            { required: true, message: "请选择出售单位", trigger: "blur" }
          ],
          cavatar: [
            { required: true, message: "请选择商品头像", trigger: "blur" }
          ],
        },
        supermarketCommodityCustomCategoryIdList:[]
      };
    },
    activated() {
      this.initData();
    },
    methods: {
      selectedLibrary(data) {
        if (data && data.length > 0) {
          let obj = data[0];
          this.commodity.cavatar = this.imageServerUrl + obj.cavatar
          this.cavatarFile = obj.cavatar
          this.commodity.cdescription = obj.cdescription
          this.commodity.cname = obj.cname
          this.commodity.csubTitle = obj.csubTitle
          this.flag = false
        }
      },
      initData() {
        if (this.$route.query.supermarketId){
          this.supermarketId = this.$route.query.supermarketId
          this.supermarketName = this.$route.query.supermarketName
        }
        this.getSupermarketCommodityCustomCategoryId();
        if (null == this.$route.query.id){
          this.isEdit = false;
        } else {
          this.id = this.$route.query.id
          this.initBusiness(this.$route.query.id);
          this.isEdit = true;
        }
      },
      getSupermarketCommodityCustomCategoryId(){
        this.$http({
          url: this.$http.adornUrl('/supermarketCommodityCustomCategory/list'),
          method: 'get',
          params: this.$http.adornParams({
            supermarketId: this.supermarketId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.supermarketCommodityCustomCategoryIdList = data.list;
          } else {
            this.$message.error(data.msg)
          }
        })
        this.$http({
          url: this.$http.adornUrl(`/supermarketCommodityUnit/list`),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.unitsList = data.list
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      initBusiness(id) {
        this.$http({
          url: this.$http.adornUrl(`/supermarketCommodity/info`),
          method: 'get',
          params: this.$http.adornParams({
            id: id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.commodity = data.vo
            this.cavatarFile = data.vo.cavatar
            this.commodity.cavatar = this.imageServerUrl + data.vo.cavatar
            this.flag = false
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      beforeAvatarUpload2(file) {
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
          self.commodity.cavatar = e.target.result;
        };
        this.flag = true
        return isLt2M;
      },
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
          this.commodity.cavatar = res.url
        } else {
          this.$message.error(data.msg)
        }
      },
      upImgError (err, file, fileList) {
        this.commodity.cavatar = './src/assets/img/img_err.png';
      },
      submitForm() {
        this.$refs['commodity'].validate(async valid => {
          if (valid) {
            //图片上传
            let submitFormData = new FormData();
            if (this.cavatarImage){
              submitFormData.append(
                "file",this.cavatarImage
              );
            }
            submitFormData.append(
              "flag",this.flag
            );
            if (this.cavatarFile){
              submitFormData.append(
                "cavate",this.cavatarFile
              );
            }

            submitFormData.append(
              "id",this.id
            );
            submitFormData.append(
              "supermarketId",this.supermarketId
            );
            submitFormData.append(
              "supermarketCommodityCustomCategoryId",this.commodity.supermarketCommodityCustomCategoryId
            );
            submitFormData.append(
              "stockCount",this.commodity.stockCount
            );
            submitFormData.append(
              "salesTotalCount",this.commodity.salesTotalCount
            );
            submitFormData.append(
              "salesCurrentMonthCount",this.commodity.salesCurrentMonthCount
            );
            submitFormData.append(
              "openStock",this.commodity.openStock
            );
            submitFormData.append(
              "units",this.commodity.units
            );
            submitFormData.append(
              "currentPrice",this.commodity.currentPrice
            );
            submitFormData.append(
              "originPrice",this.commodity.originPrice
            );
            submitFormData.append(
              "costPrice",this.commodity.costPrice
            );
            submitFormData.append(
              "csubTitle",this.commodity.csubTitle
            );
            submitFormData.append(
              "cname",this.commodity.cname
            );
            submitFormData.append(
              "weight",this.commodity.weight
            );
            submitFormData.append(
              "cdescription",this.commodity.cdescription
            );
            postByFormDataApi(this.isEdit?`/supermarketCommodity/update`:'/supermarketCommodity/add', submitFormData).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: this.isEdit?"修改成功":"添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "supermarketCommodity",
                  query: {
                    supermarketId: this.supermarketId,
                    supermarketName: this.supermarketName
                  }
                });
                this.$refs['commodity'].resetFields();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          } else {
            return false;
          }
        });
      }
    }
};
</script>

<style scoped>
  .commodityAvatar{
    width: 400px;
  }
  .avatar-uploader{
    width: 400px;
  }
</style>
