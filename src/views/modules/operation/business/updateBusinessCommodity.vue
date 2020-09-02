<template>
  <div id="personnel-detail" v-loading="businessLoading">
    <el-card class="box-card">
      <div class="text item">
        <el-button :disabled="flag" @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
        <el-button @click="handleBargain" icon="el-icon-document" size="small" type="primary">先砍后付</el-button>
        <el-button @click="handleDailyLimited" icon="el-icon-document" size="small" type="primary">每日限量</el-button>
        <el-button @click="handleCommodityTagBindCommodity" icon="el-icon-document" size="small" type="primary">标签列表</el-button>
        <el-button @click="handleContractTime" icon="el-icon-document" size="small" type="primary">售卖时间限制</el-button>
        <el-button @click="handleSpecialAmountDivide" icon="el-icon-document" size="small" type="primary">修改分成</el-button>
        <el-button @click="handleExpand" icon="el-icon-document" size="small" type="primary">扩展信息</el-button>
        <el-button @click="handleExternalSupport" icon="el-icon-document" size="small" type="primary">第三方支持</el-button>
        <hr class="sd-hr"/>
        <div style="width: 70%">
          <el-form
            :model="commodity" :disabled="flag"
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
              <el-cascader v-model="commodity.businessCommodityCategoryIdArray"
                :options="businessCommodityCategoryOptions"
                :props="{ expandTrigger: 'hover' }"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="是否折扣商品" prop="isDiscountPay">
              <el-select v-model="commodity.isDiscountPay" placeholder="请选择">
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
            <template v-if="commodity.isDiscountPay == '1'">
              <el-form-item label="售价百分比" prop="sellPercentage">
                <el-input-number v-model="commodity.sellPercentage" :precision="2" :step="0.01" :max="1"></el-input-number>
              </el-form-item>
              <el-form-item label="成本百分比" prop="costPercentage">
                <el-input-number v-model="commodity.costPercentage" :precision="2" :step="0.01" :max="1"></el-input-number>
              </el-form-item>
            </template>
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
              <el-select v-model="commodity.priority" placeholder="推荐权重值">
                <el-option v-for="item in businessCommodityPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <template v-if="commodity.isDiscountPay != '1'">
              <el-form-item label="合作价(商户所得价)" prop="costPrice">
                <el-input-number v-model="commodity.costPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
              </el-form-item>
              <el-form-item label="售价(用户购买价)">
                <el-input-number v-model="commodity.currentPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
              </el-form-item>
              <el-form-item label="原价(灰色的价格)">
                <el-input-number v-model="commodity.originPrice" :min="0" :precision="2" :max="99999999"></el-input-number>
              </el-form-item>
            </template>
            <el-form-item label="是否开启库存限制">
              <el-select v-model.trim="commodity.openStock" :disabled="commodity.isDiscountPay == '1'">
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
                :action="$GlobalApi.getServerUrl('/system/file/businessCommodity/post')"
                :before-upload="beforePosterUpload"
                :headers="$GlobalApi.getUserToken()"
                :on-error="upImgPosterError"
                :on-success="upImgPosterSuccess"
                :show-file-list="false"
                class="avatar-uploader">
                <img :src="imageHttpsServerUrl + commodityPost" class="commodityAvatar" v-if="commodityPost">
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
          </el-form>
        </div>
      </div>
      <el-dialog
        title="设置售卖时间"
        width="30%"
        :visible.sync="businessCommodityFlag">
        <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic">
          <el-form-item label="是否开启限制售卖时间" prop="openContractTime">
            <el-select v-model="openContractTime">
              <el-option label="关闭" value="0"></el-option>
              <el-option label="开启(开启后才可修改限制售卖的时间)" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="限制售卖结束时间(截止日期)" prop="contractEndTime" v-show="openContractTime==1">
            <el-date-picker
              v-model="contractEndTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
      <el-button @click="businessCommodityFlag = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
      </el-dialog>
      <el-dialog class="code-dialog" width="45%" title="修改商品金额分成" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form ref="specialAmountDivide-form" :model="specialAmountDivide" class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%">
          <el-form-item label="修改该商品的金额分成">
            <span>{{this.businessCommodityName}}</span>
          </el-form-item>
          <el-form-item label="总毛利率(由此得计算价)">
            <el-input v-model="specialAmountDivide.totalProfit" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item>
            <span>无分享</span>
          </el-form-item>
          <el-form-item label="无分享单上级一级分成率">
            <el-input v-model="specialAmountDivide.noShareAloneOneLevelReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item label="无分享多上级一级分成率">
            <el-input v-model="specialAmountDivide.noShareMultipleOneLevelReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item label="无分享多上级二级分成率">
            <el-input v-model="specialAmountDivide.noShareMultipleTwoLevelReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item label="无分享的返积分率">
            <el-input v-model="specialAmountDivide.noShareUserIntegralReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item>
            <span>有分享</span>
          </el-form-item>
          <el-form-item label="被动分享人返积分率">
            <el-input v-model="specialAmountDivide.receiveShareUserIntegralReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item label="主动分享人的分享率">
            <el-input v-model="specialAmountDivide.initiateShareShareReward" :disabled="isChange"> </el-input>
          </el-form-item>
          <el-form-item label="主动分享人单上级一级分成率">
            <el-input v-model="specialAmountDivide.initiateShareAloneOneLevelReward" :disabled="isChange"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="isChange = !isChange">切换修改</el-button>
            <el-button type="primary" @click="handleChange()">确认修改</el-button>
            <el-button type="danger" @click="handleRestoreSpecialAmountDivide()">还原为默认分成</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
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
      imageHttpsServerUrl:SERVER_CONSTANT.imageHttpsServerUrl,
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
        detailContentUrl: "",
        businessId: '',
        businessName: '',
        businessRootCategoryName: '',
        businessCategoryName: '',
        priority: 5,
        detailContentUrl: '',
        specsType: '',
        costPrice: 0.00,
        originPrice: 0.00,
        currentPrice: 0.00,
        openStock: '2',
        isDiscountPay: "0",
        stockCount: '',
        salesTotalCount: '',
        salesCurrentMonthCount: '',
        conSumType: '',
        detailText: '',
        costPercentage: 0.00,
        sellPercentage: 0.00,
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
        ],
        isDiscountPay: [
          { required: true, message: "请输入是否折扣", trigger: "change" }
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
      flag: false,
      form: {},
      businessCommodityFlag:false,
      openContractTime: "0",
      contractEndTime: '',
      dialogFormVisible: false,
      isChange: true,
      specialAmountDivide: {
        choosebusinessCommodityId: '',
        choosebusinessCommodityName: '',
        noShareTotalProfit: '',
        noShareAloneOneLevelReward: '',
        noShareMultipleOneLevelReward: '',
        noShareMultipleTwoLevelReward: '',
        noShareUserIntegralReward: '',
        receiveShareUserIntegralReward: '',
        initiateShareShareReward: '',
        initiateShareAloneOneLevelReward: ''
      }
    };
  },
  activated() {
    // this.checkBusinessCommodityId();
    if (this.$route.query.businessCommodityId) {
      this.businessCommodityId = this.$route.query.businessCommodityId;
      this.businessId = this.$route.query.businessId;
      this.businessCommodityName = this.$route.query.businessCommodityName;
      this.businessName = this.$route.query.businessName;
      this.flag = this.$route.query.flag;
    }
    this.initData();
  },
  methods: {
    closeDialog() {
      this.specialAmountDivide = {};
    },
    handleChange(){
      this.$http({
        url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/update`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId,
          totalProfit: this.specialAmountDivide.totalProfit,
          noShareAloneOneLevelReward: this.specialAmountDivide.noShareAloneOneLevelReward,
          noShareMultipleOneLevelReward: this.specialAmountDivide.noShareMultipleOneLevelReward,
          noShareMultipleTwoLevelReward: this.specialAmountDivide.noShareMultipleTwoLevelReward,
          noShareUserIntegralReward: this.specialAmountDivide.noShareUserIntegralReward,
          receiveShareUserIntegralReward: this.specialAmountDivide.receiveShareUserIntegralReward,
          initiateShareShareReward: this.specialAmountDivide.initiateShareShareReward,
          initiateShareAloneOneLevelReward: this.specialAmountDivide.initiateShareAloneOneLevelReward
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.isChange = true
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleRestoreSpecialAmountDivide() {
      this.$confirm("确认将此商品的分成设置还原为全局金额分成设置?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/remove`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityId: this.businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.handleSpecialAmountDivide()
            this.$message.success('设置成功');
          } else {
            this.$message.error(data.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        });
      });
    },
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
                url: this.imageServerUrl + element
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
    dataFormSubmit(){
      this.$http({
        url: this.$http.adornUrl('/businessCommodity/updateContractTime'),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId,
          openContractTime: this.openContractTime,
          contractEndTime: this.contractEndTime
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.businessCommodityFlag = false
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleExternalSupport() {
      if (this.businessId) {
        this.$router.push({
          path: "BusinessCommodityExternalSupportList",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: this.businessCommodityId,
            businessCommodityName: this.businessCommodityName
          }
        });
      }
    },
    handleExpand() {
      if (this.businessId) {
        this.$router.push({
          path: "BusinessCommodityExpand",
          query: {
            businessId: this.businessId,
            businessName: this.businessName,
            businessCommodityId: this.businessCommodityId,
            businessCommodityName: this.businessCommodityName
          }
        });
      }
    },
    handleSpecialAmountDivide() {
      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl(`/businessCommoditySpecialAmountDivide/info`),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.specialAmountDivide = data.result
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    handleContractTime() {
      this.businessCommodityFlag = true
      this.$http({
        url: this.$http.adornUrl('/businessCommodity/findContractTime'),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.openContractTime = String(data.result.openContractTime)
          this.contractEndTime = data.result.contractEndTime
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleCommodityTagBindCommodity() {
      this.$router.push({
        path: 'BusinessCommodityTagBindBusinessCommodityList',
        query: {
          businessId: this.businessId,
          businessName: this.businessName,
          businessCommodityId: this.businessCommodityId,
          businessCommodityName: this.businessCommodityName
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
            var replace = this.carouselFileList[i].url.replace(this.imageServerUrl,"");
            str += replace + ",";
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
              "currentPrice": this.commodity.isDiscountPay == '1'?0:this.commodity.currentPrice,
              "originPrice": this.commodity.isDiscountPay == '1'?0:this.commodity.originPrice,
              "costPrice": this.commodity.isDiscountPay == '1'?0:this.commodity.costPrice,
              "specsType": 1,
              "businessCommoditySubTitle": this.commodity.businessCommoditySubTitle,
              "priority": this.commodity.priority,
              "businessId": this.commodity.businessId,
              "businessCommodityName":this.commodity.businessCommodityName,
              "businessCommodityDescription":this.commodity.businessCommodityDescription,
              "detailContentUrl":this.commodity.detailContentUrl,
              'businessCommodityPosterFile': this.commodityPost,
              "sellPercentage":this.commodity.sellPercentage,
              "isDiscountPay":this.commodity.isDiscountPay,
              "costPercentage":this.commodity.costPercentage,
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
