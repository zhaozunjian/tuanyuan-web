<template>
  <div id="personnel-detail">
    <el-card class="box-card">
      <div class="text item">
        <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
        <hr class="sd-hr"/>
        <div style="width: 70%">
          <el-form :model="commodity" :rules="rules" ref="commodity" label-width="180px">
            <el-form-item label="所属商家ID" prop="businessId">
              <span>{{this.commodity.businessId}}</span>
            </el-form-item>
            <el-form-item label="所属商家名称" prop="businessName">
              <span>{{this.commodity.businessName}}</span>
            </el-form-item>
            <el-form-item label="所属商家分类">
              <span>{{this.commodity.businessRootCategoryName!=''?this.commodity.businessRootCategoryName + '/':'' + this.commodity.businessCategoryName}}</span>
            </el-form-item>
            <el-form-item label="商品名称" prop="businessCommodityName">
              <el-input v-model="commodity.businessCommodityName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题" prop="businessCommoditySubTitle">
              <el-input v-model="commodity.businessCommoditySubTitle" placeholder="请输入商品副标题"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="businessCommodityDescription">
              <el-input type="textarea" autosize v-model="commodity.businessCommodityDescription" placeholder="请输入商品描述"></el-input>
            </el-form-item>
            <el-form-item label="商品详情url" prop="detailContentUrl">
              <el-input v-model="commodity.detailContentUrl" placeholder="请输入商品详情url"></el-input>
            </el-form-item>
            <el-form-item label="消费类型(必填)" prop="conSumType">
              <el-select v-model="commodity.conSumType" placeholder="请选择消费类型">
                <el-option label="核销" value="1"></el-option>
                <el-option label="外送" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="businessCommodityCategoryIdArray">
              <el-cascader
                v-model="commodity.businessCommodityCategoryIdArray"
                :options="businessCommodityCategoryOptions"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="推荐权重值" prop="priority">
              <!--<el-cascader-->
                <!--v-model="commodity.priority"-->
                <!--:options="businessCommodityPriorityOptions"-->
                <!--:props="{ expandTrigger: 'hover' }"-->
              <!--&gt;</el-cascader>-->
              <el-select v-model="commodity.priority" placeholder="推荐权重值">
                <el-option v-for="item in businessCommodityPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="合作价(商户所得价)">
              <el-input-number v-model="commodity.costPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="售价(用户购买价)">
              <el-input-number v-model="commodity.currentPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="原价(界面灰色的价格)">
              <el-input-number v-model="commodity.originPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="是否开启库存限制">
              <el-select v-model.trim="commodity.openStock">
                <el-option label="开启" value="1"></el-option>
                <el-option label="不开启(无限库存)" value="2"></el-option>
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
            <el-form-item label="详情内容" prop="detailText">
              <el-input type="textarea" autosize placeholder="请输入详情内容" v-model="commodity.detailText"></el-input>
            </el-form-item>
            <el-form-item label="购买须知" prop="noticeText">
              <el-input type="textarea" autosize placeholder="请输入购买须知" v-model="commodity.noticeText"></el-input>
            </el-form-item>
            <el-form-item label="商品头像">
              <el-upload
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/upload')"
                :before-upload="beforeAvatarUpload"
                :headers="$GlobalApi.getUserToken()"
                :on-error="upImgError"
                :on-success="upImgSuccess"
                :show-file-list="false"
                class="avatar-uploader">
                <img :src="imageServerUrl + commodityAvatar" class="commodityAvatar" v-if="commodityAvatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="轮播图">
              <el-upload
                :limit="carouselLimit"
                :headers="$GlobalApi.getUserToken()"
                :on-success="carouselOnChange"
                :before-remove="carouselBeforeRemove"
                :file-list="carouselFileList"
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/upload')"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品海报">
              <el-upload
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/post')"
                :before-upload="beforePosterUpload"
                :headers="$GlobalApi.getUserToken()"
                :on-error="upImgPosterError"
                :on-success="upImgPosterSuccess"
                :show-file-list="false"
                class="avatar-uploader">
                <img :src="imageHttpsServerUrl + commodityPoster" class="commodityAvatar" v-if="commodityPoster">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品详情图片">
              <el-upload
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/upload')"
                :before-upload="beforeDetailUpload"
                :headers="$GlobalApi.getUserToken()"
                :on-error="upImgDetailError"
                :on-success="upImgDetailSuccess"
                :show-file-list="false"
                class="avatar-uploader">
                <img :src="imageServerUrl + commodityDetailImage" class="commodityAvatar" v-if="commodityDetailImage">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";

export default {
  data() {
    return {
      imageServerUrl:SERVER_CONSTANT.imageServerUrl,
      imageHttpsServerUrl:SERVER_CONSTANT.imageHttpsServerUrl,
      carouselLimit: 5,
      carouselFileList: [],
      categoryForm: {
        categoryList: [],
        categorySelect: "",
        name: "",
        description: ""
      },
      commodityAvatar: "",
      commodityPoster: "",
      commodityDetailImage: "",
      commodity: {
        businessCommodityAvatarFile: "",
        businessCommodityPosterFile: "",
        detailFileArray: "",
        businessId: "",
        businessCommodityName: "",
        businessCommoditySubTitle: "",
        businessCommodityDescription: "",
        detailContentUrl: "",
        businessCommodityCategoryId: "",
        priority: 5,
        specsType: 1,
        costPrice: 0,
        originPrice: 0,
        currentPrice: 0,
        openStock: "1",
        stockCount: 10000,
        salesTotalCount: '',
        salesCurrentMonthCount: 0,
        detailText: "",
        noticeText: "",
        conSumType: "",
        businessCommodityCategoryIdArray: ""
      },
      rules: {
        businessCommodityName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
          priority: [
          { required: true, message: "请选择推荐权重值", trigger: "change" }
        ],
         specsType: [
          { required: true, message: "请选择规格类型", trigger: "change" }
        ],
         conSumType: [
          { required: true, message: "请输入消费类型", trigger: "change" }
        ],
        businessCommodityCategoryIdArray: [
          { required: true, message: "请输入商品分类", trigger: "change" }
        ]
      },
      businessCommodityPriorityOptions: [
        {
          value: 1,
          label: "一级"
        },
        {
          value: 2,
          label: "二级"
        },
        {
          value: 3,
          label: "三级"
        },
        {
          value: 4,
          label: "四级"
        },
        {
          value: 5,
          label: "五级(默认)"
        },
        {
          value: 6,
          label: "六级"
        },
        {
          value: 7,
          label: "七级"
        },
        {
          value: 8,
          label: "八级"
        },
        {
          value: 9,
          label: "九级"
        },
        {
          value: 10,
          label: "十级"
        }
      ],
      businessCommodityCategoryOptions: []
    };
  },
  mounted() {
    this.checkBusinessId();
    this.initData();
  },
  methods: {
    initData() {
      if (this.$route.query.businessId) {
        this.initBusiness(this.$route.query.businessId);
        this.initCommodityCategory(this.$route.query.businessId)
      }
    },
    initCommodityCategory(businessId) {
      this.$http({
        url: this.$http.adornUrl(`/businessCategoryBindCommodityCategory/findListByBusinessId`),
        method: 'get',
        params: this.$http.adornParams({
          businessId: businessId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.businessCommodityCategoryOptions = this.getTreeData(data.result)
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    initBusiness(businessId) {
      this.$http({
        url: this.$http.adornUrl(`/business/info`),
        method: 'get',
        params: this.$http.adornParams({
          businessId: businessId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.commodity.businessId = data.result.businessId;
          this.commodity.businessName = data.result.businessName;
          this.commodity.businessRootCategoryName =
            data.result.businessRootCategoryName;
          this.commodity.businessCategoryName =
            data.result.businessCategoryName;
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
        this.commodityAvatar = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgError (err, file, fileList) {
      this.commodityAvatar = './src/assets/img/img_err.png';
    },

    beforePosterUpload(file) {
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
    upImgPosterSuccess (res, file) {
      if (res && res.code === 0) {
        this.commodityPoster = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgPosterError (err, file, fileList) {
      this.commodityPoster = './src/assets/img/img_err.png';
    },

    beforeDetailUpload(file) {
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
    upImgDetailSuccess (res, file) {
      if (res && res.code === 0) {
        this.commodityDetailImage = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgDetailError (err, file, fileList) {
      this.commodityDetailImage = './src/assets/img/img_err.png';
    },

    carouselHandleExceed(file, fileList) {
      if (fileList.length >= this.carouselLimit) {
        this.$message.error(
          `轮播走马灯图片最多上传${this.carouselLimit}个文件`
        );
        return false;
      }
    },
    carouselOnChange(res, file) {
      if (res && res.code === 0) {
        this.carouselFileList.push({
          url: this.imageServerUrl + res.url
        })
      } else {
        this.$message.error(data.msg)
      }
    },
    carouselBeforeRemove(file) {
      for(let i = 0; i < this.carouselFileList.length; i++) {
        let _file = this.carouselFileList[i]
        if (_file.url == file.url) {
          this.$http({
            url: this.$http.adornUrl('/system/file/delete'),
            method: 'post',
            params: this.$http.adornParams({
              file: this.carouselFileList[i].url
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.carouselFileList.splice(i, 1)
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      }
    },
    checkBusinessId() {
      if (this.$route.query.businessId) {
        this.businessId = this.$route.query.businessId;
      } else {
        this.businessId = Math.ceil(Math.random() * 10);
        this.$alert("添加商家商品需要选择一个商家,先去选择商家", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push("/businessList");
          }
        });
      }
    },
    async submitForm() {
      this.$refs['commodity'].validate(async valid => {
        if (valid) {
          var str = "";
          for (var i = 0; i < this.carouselFileList.length; i++) {
            var replace = this.carouselFileList[i].url.replace(this.imageServerUrl,"");
            str += replace + ",";
          }
          //去掉最后一个逗号(如果不需要去掉，就不用写)
          if (str.length > 0) {
            str = str.substr(0, str.length - 1);
          }
          this.$http({
            url: this.$http.adornUrl(`/businessCommodity/add`),
            method: 'post',
            data: this.$http.adornData({
              "businessCommodityAvatarFile":this.commodityAvatar,
              'carouselImagesFileArray': str,
              "businessCommodityCategoryId": this.commodity.businessCommodityCategoryIdArray[1],
              "businessCommodityCategoryIdArray": this.commodity.businessCommodityCategoryIdArray,
              "conSumType": this.commodity.conSumType,
              "noticeText": this.commodity.noticeText,
              "detailText": this.commodity.detailText,
              "stockCount": this.commodity.stockCount,
              "salesTotalCount": this.commodity.salesTotalCount,
              "salesCurrentMonthCount": this.commodity.salesCurrentMonthCount,
              "openStock": this.commodity.openStock,
              "currentPrice": this.commodity.currentPrice,
              "originPrice": this.commodity.originPrice,
              "costPrice": this.commodity.costPrice,
              "specsType": 1,
              "businessCommoditySubTitle":this.commodity.businessCommoditySubTitle,
              "priority": this.commodity.priority,
              "businessId": this.commodity.businessId,
              "businessCommodityName":this.commodity.businessCommodityName,
              "businessCommodityDescription":this.commodity.businessCommodityDescription,
              "detailContentUrl":this.commodity.detailContentUrl,
              'businessCommodityPosterFile': this.commodityPoster,
              "detailFileArray":this.commodityDetailImage
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              let businessId = this.commodity.businessId
              let businessName = this.commodity.businessName
              this.$router.push({
                path: "businessCommodityList",
                query: {
                  businessId: businessId,
                  businessName: businessName
                }
              });
              Object.assign(this.commodity, this.$options.data().commodity)
              this.commodity.businessId = businessId
              this.commodity.businessName = businessName
              this.commodityAvatar = ''
              this.carouselFileList = []
              this.commodityPoster = ''
              this.commodityDetailImage = ''
            } else {
              this.$message.error(data.msg);
            }
          })
        } else {
          this.$notify.error({
            title: "错误",
            message: "请检查输入是否正确",
            offset: 100
          });
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
