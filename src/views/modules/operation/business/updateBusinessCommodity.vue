<template>
  <div id="personnel-detail" v-loading="businessLoading">
    <el-card class="box-card">
      <div class="text item">
        <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
        <el-button @click="handleBargain" icon="el-icon-document" size="small" type="primary">先砍后付</el-button>
        <el-button @click="handleDailyLimited" icon="el-icon-document" size="small" type="primary">每日限量</el-button>
        <hr class="sd-hr"/>
        <div style="width: 70%">
          <el-form
            :model="commodity"
            :rules="rules"
            ref="commodity"
            label-width="180px">
            <el-form-item label="所属商家ID" prop="businessId">
              <span>{{this.commodity.businessId}}</span>
            </el-form-item>
            <el-form-item label="所属商家名称" prop="businessName">
              <span>{{this.commodity.businessName}}</span>
            </el-form-item>
            <el-form-item label="所属商家分类" prop="businessRootCategoryName">
              <span>{{this.commodity.businessRootCategoryName!=''?this.commodity.businessRootCategoryName + '/':'' + this.commodity.businessCategoryName}}</span>
            </el-form-item>
            <el-form-item label="所属商品分类" prop="businessCommodityCategoryIdArray">
              <el-cascader
                v-model="commodity.businessCommodityCategoryIdArray"
                :options="businessCommodityCategoryOptions"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="businessCommodityName">
              <el-input v-model="commodity.businessCommodityName"></el-input>
            </el-form-item>
            <el-form-item label="商品副标题" prop="businessCommoditySubTitle">
              <el-input v-model="commodity.businessCommoditySubTitle"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="businessCommodityDescription">
              <el-input type="textarea" autosize v-model="commodity.businessCommodityDescription"></el-input>
            </el-form-item>
            <el-form-item label="详情url" prop="detailContentUrl">
              <el-input v-model="commodity.detailContentUrl"></el-input>
            </el-form-item>
            <el-form-item label="推荐权重值" prop="priority">
              <el-cascader
                v-model="commodity.priority"
                :options="businessCommodityPriorityOptions"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
            <!-- <el-form-item label="最多可砍价">
                <span>{{ commodity.beforeBargainMaxAmount }}</span>
            </el-form-item> -->
            <el-form-item label="合作价(商户所得价)" prop="costPrice">
              <el-input-number v-model="commodity.costPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="售价(用户购买价)">
              <el-input-number v-model="commodity.currentPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="原价(灰色的价格)">
              <el-input-number v-model="commodity.originPrice" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="是否开启库存限制">
              <el-select v-model.trim="commodity.openStock">
                <el-option label="开启" value="1"></el-option>
                <el-option label="不开启(无限库存)" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="当前库存" v-show="commodity.openStock==1">
              <el-input-number v-model="commodity.stockCount" :min="0" :max="1000000"></el-input-number>
            </el-form-item>
            <el-form-item label="总销量">
              <el-input-number v-model="commodity.salesTotalCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="月销量">
              <el-input-number v-model="commodity.salesCurrentMonthCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="详情内容">
              <el-input type="textarea" autosize placeholder="详情内容" v-model="commodity.detailText"></el-input>
            </el-form-item>
            <el-form-item label="购买须知">
              <el-input type="textarea" autosize placeholder="购买须知" v-model="commodity.noticeText"></el-input>
            </el-form-item>
            <el-form-item label="商品头像" prop="commodityAvatar">
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
              </el-upload>
            </el-form-item>
            <el-form-item label="商品海报" prop="commodityPost">
              <el-upload
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/upload')"
                :before-upload="beforePosterUpload"
                :headers="$GlobalApi.getUserToken()"
                :on-error="upImgPosterError"
                :on-success="upImgPosterSuccess"
                :show-file-list="false"
                class="avatar-uploader">
                <img :src="imageServerUrl + commodityPost" class="commodityAvatar" v-if="commodityPost">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
              </el-upload>
            </el-form-item>
            <!--<el-form-item>-->
              <!--<el-button type="primary" @click="submitForm('commodity')">确认修改商品</el-button>-->
            <!--</el-form-item>-->
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
      businessLoading:false,
      imageServerUrl:SERVER_CONSTANT.imageServerUrl,
      businessId: "",
      businessCommodityId: "",
      businessName:'',
      businessCommodityName:'',
      commodityAvatar: '',
      commodityPost: '',
      commodityDetailImage: '',
      carouselLimit: 5,
      carouselFileList: [],
      businessCommodityCategoryOptions: [],
      commodity: {
        businessCommodityCategoryIdArray: [],
        commodiyAvatarFile: '',
        commodiyPosterFile: '',
        businessCommoditySubTitle: "",
        detailFileArray: '',
        businessCommodityId: "",
        businessCommodityName: "",
        businessCommodityDescription: "",
        description: "",
        image_path: "",
        detailContentUrl: "",
        businessId: '',
        businessName: '',
        businessRootCategoryName: '',
        businessCategoryName: '',
        priority: '',
        detailContentUrl: '',
        specsType: '',
        costPrice: '',
        originPrice: '',
        currentPrice: '',
        openStock: '',
        stockCount: '',
        salesTotalCount: '',
        salesCurrentMonthCount: '',
        conSumType: '',
        detailText: '',
        noticeText: ""
      },
      rules: {
        businessCommodityName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        businessCommodityDescription: [
          { required: true, message: "请输入商品描述", trigger: "blur" }
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
      ]
    };
  },
  activated() {
    // this.checkBusinessCommodityId();
    if (this.$route.query.businessCommodityId) {
      this.businessCommodityId = this.$route.query.businessCommodityId;
      this.businessId = this.$route.query.businessId;
      this.businessCommodityName = this.$route.query.businessCommodityName;
      this.businessName = this.$route.query.businessName;
    }
    this.initData();
  },
  methods: {
    // checkBusinessCommodityId() {
    //   if (this.$route.query.businessCommodityId) {
    //     this.businessCommodityId = this.$route.query.businessCommodityId;
    //   } else {
    //     this.businessCommodityId = Math.ceil(Math.random() * 10);
    //     this.$alert("修改商品需要选择一个商家,先去选择商家", "提示", {
    //       confirmButtonText: "确定",
    //       callback: action => {
    //         this.$router.push("/businessList");
    //       }
    //     });
    //   }
    // },
    initData() {
      if (this.businessCommodityId) {
        this.initCommodityCategory(this.businessId)
        this.initBusinessCommodity(this.businessId, this.businessCommodityId);
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
    initBusinessCommodity(businessId, businessCommodityId) {
      this.businessLoading = true
      this.$http({
        url: this.$http.adornUrl(`/businessCommodity/findById`),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: businessCommodityId,
          businessId: businessId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          console.log(data.result.carouselImagesUrlList)
          this.commodity = data.result
          this.commodity.businessCommodityCategoryIdArray = data.result.businessCommodityCategoryLevel
          this.commodityAvatar = data.result.businessCommodityAvatar
          this.commodityPost = data.result.businessCommodityPoster
          this.commodityDetailImage = data.result.detailUrlList
          this.commodity.openStock = String(data.result.openStock)
          let carouselImagesUrlList = data.result.carouselImagesUrlList
          if (carouselImagesUrlList != null && carouselImagesUrlList != '') {
            let splitArr = carouselImagesUrlList.split(',')
            splitArr.forEach(element => {
              this.carouselFileList.push({
                url: element
              })
            });
          }
          this.businessLoading = false
        } else {
          this.businessLoading = false
          this.$message.error(data.msg);
        }
      })
    },
    handleDailyLimited() {
      this.$router.push({
        path: "BusinessCommodityDailyLimited",
        query: {
          businessId: this.businessId,
          businessName: this.businessName,
          businessCommodityId: this.businessCommodityId,
          businessCommodityName: this.businessCommodityName
        }
      });
    },
    handleBargain() {
      this.$router.push({
        path: "updateBusinessCommodityBargain",
        query: {
          businessId: this.businessId,
          businessName: this.businessName,
          businessCommodityId: this.businessCommodityId,
          businessCommodityName: this.businessCommodityName
        }
      });
    },
    submitForm() {
      this.$refs['commodity'].validate(async valid => {
        if (valid) {
          var str = "";
          for (var i = 0; i < this.carouselFileList.length; i++) {
            str += this.carouselFileList[i].url + ",";
          }
          //去掉最后一个逗号(如果不需要去掉，就不用写)
          if (str.length > 0) {
            str = str.substr(0, str.length - 1);
          }
          this.$http({
            url: this.$http.adornUrl(`/businessCommodity/update`),
            method: 'post',
            data: this.$http.adornData({
              "businessCommodityId":this.commodity.businessCommodityId,
              "businessCommodityAvatarFile":this.commodityAvatar,
              'carouselImagesFileArray': str,
              "businessCommodityCategoryId": this.commodity.businessCommodityCategoryIdArray[1],
              "businessCommodityCategoryIdArray": this.commodity.businessCommodityCategoryIdArray,
              "conSumType": this.commodity.conSumType,
              "noticeText": this.commodity.noticeText,
              "detailText": this.commodity.detailText,
              "stockCount": this.commodity.stockCount,
              "openStock": this.commodity.openStock,
              "salesTotalCount": this.commodity.salesTotalCount,
              "salesCurrentMonthCount": this.commodity.salesCurrentMonthCount,
              "currentPrice": this.commodity.currentPrice,
              "originPrice": this.commodity.originPrice,
              "costPrice": this.commodity.costPrice,
              "specsType": 1,
              "businessCommoditySubTitle": this.commodity.businessCommoditySubTitle,
              "priority": this.commodity.priority,
              "businessId": this.commodity.businessId,
              "businessCommodityName":this.commodity.businessCommodityName,
              "businessCommodityDescription":this.commodity.businessCommodityDescription,
              "detailContentUrl":this.commodity.detailContentUrl,
              'businessCommodityPosterFile': this.commodityPost,
              "detailFileArray":this.commodityDetailImage
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.push({
                path: "businessCommodityList",
                query: {
                  businessId: this.commodity.businessId,
                  businessName: this.commodity.businessName
                }
              });
              this.carouselFileList = []
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
        this.commodityPost = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgPosterError (err, file, fileList) {
      this.commodityPost = './src/assets/img/img_err.png';
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
