<template>
  <div id="personnel-detail" v-loading="businessLoading">
    <el-card class="box-card">
      <div class="text item">
        <el-button :disabled="flag" @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
        <el-button @click="handleBargain" icon="el-icon-document" size="small" type="primary">先砍后付</el-button>
        <el-button @click="handleContractTime" icon="el-icon-document" size="small" type="primary">售卖时间限制</el-button>
        <el-button @click="handleSpecialAmountDivide" icon="el-icon-document" size="small" type="primary">修改分成</el-button>
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
            <!--<el-form-item label="详情url" prop="detailContentUrl">-->
              <!--<el-input v-model="commodity.detailContentUrl"></el-input>-->
            <!--</el-form-item>-->
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
            <el-form-item label="库存限制">
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
            <!--<el-form-item label="详情内容">-->
              <!--<el-input type="textarea" autosize placeholder="详情内容" v-model="commodity.detailText"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="购买须知">-->
              <!--<el-input type="textarea" autosize placeholder="购买须知" v-model="commodity.noticeText"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="每日限量">
              <el-select v-model="openDailyLimited">
                <el-option label="关闭每日限量" value="0"></el-option>
                <el-option label="开启每日限量(开启后才可修改限量的数量)" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="每日限量数" v-show="openDailyLimited==1">
              <el-input-number v-model="dailyLimitedCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="最大预约天数" v-show="openDailyLimited==1">
              <el-input-number v-model="dailyLimitedMaxDay" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item v-show="openDailyLimited==1" label="是否开启用户限购">
              <el-select v-model="openDailyLimitedUserPurchased">
                <el-option label="关闭用户限购" value="0"></el-option>
                <el-option label="开启用户限购" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户每日限购的数量" v-show="openDailyLimited==1 && openDailyLimitedUserPurchased==1">
              <el-input-number v-model="dailyLimitedUserPurchasedCount" :min="0" :max="99999999"></el-input-number>
            </el-form-item>
            <el-form-item label="商品标签">
              <el-tag v-for="tag in businessTags" :key="tag.tagId" style="margin-right: 20px;"
                      :closable="!flag" :disable-transitions="false" @close="handleClose(tag)">
                {{tag.tagName}}
              </el-tag>
              <el-button size="small" v-if="isAuth('business:tag:add')" @click="addBindTag()">添加标签</el-button>
            </el-form-item>

            <el-form-item label="是否不允许退款" prop="isNoRefundAllowed">
              <el-select v-model="formExpand.isNoRefundAllowed">
                <el-option label="关闭(允许退款)" value="0"></el-option>
                <el-option label="开启(不允许退款)" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品订单日期限制" prop="isPayAutoExpired">
              <el-select v-model="formExpand.isPayAutoExpired">
                <el-option label="关闭" value="0"></el-option>
                <el-option label="开启(开启后才可修改限制消费的时间)" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品截止日期" prop="payAutoExpiredTime" v-show="formExpand.isPayAutoExpired==1">
              <div class="block">
                <el-date-picker
                  v-model="formExpand.payAutoExpiredTime"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
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
      <el-dialog class="code-dialog" width="50%" title="添加标签" :visible.sync="dialogAddFormVisible" @close="closeDialogTag">
        <el-table
          :data="addForm.businessCommodityTagListData"
          tooltip-effect="dark" :height="$GlobalApi.getWinHeight() - 300"
          @select="selectChange"
          @select-all="selectAll"
          ref="multipleTable">
          <el-table-column
            type="selection"
            width="35">
          </el-table-column>
          <el-table-column
            prop="businessCommodityTagName"
            label="标签名称">
          </el-table-column>
        </el-table>
        <pager :current-page="addCurrentPage" :page-size="addPageSize" :total="addTotal"
               @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeChange" background/>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
          <el-button size="small" type="primary" @click="handleAddBusinessCommodityTag()">确 定</el-button>
        </div>
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
      },

      //每日限量
      openDailyLimited: '0',
      dailyLimitedCount: 0,
      dailyLimitedMaxDay: 0,
      openDailyLimitedUserPurchased: '0',
      dailyLimitedUserPurchasedCount: 0,
      //商品标签
      selectDataArrL:[],// 跨页多选所以的项，
      addTotal: 0,
      addCurrentPage: 1,
      addPageSize: 10,
      dialogAddFormVisible: false,
      addForm: {
        businessCommodityTagListData: [],
      },
      businessTags: [],

      //扩展信息
      formExpand: {
        isPayAutoExpired: "0",
        payAutoExpiredTime: '',
        isNoRefundAllowed: "0"
      }
    };
  },
  activated() {
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
        this.initBusinessDailyLimited(this.businessCommodityId);
        this.initCommodityTagBindCommodityList();
        this.initExpandInfo();
      }
    },
    initExpandInfo() {
      this.$http({
        url: this.$http.adornUrl('/businessCommodityExpand/info'),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.formExpand = data.result
          this.formExpand.isPayAutoExpired = String(data.result.isPayAutoExpired)
          this.formExpand.isNoRefundAllowed = String(data.result.isNoRefundAllowed)
        } else {
          this.$message.error(data.msg)
        }
      })
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
    initBusinessDailyLimited(businessCommodityId){
      this.$http({
        url: this.$http.adornUrl(`/businessCommodity/findDailyLimited`),
        method: 'get',
        params: this.$http.adornParams({
          businessCommodityId: businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.openDailyLimited = String(data.result.openDailyLimited)
          this.dailyLimitedCount = data.result.dailyLimitedCount
          this.dailyLimitedMaxDay = data.result.dailyLimitedMaxDay
          this.openDailyLimitedUserPurchased = String(data.result.openDailyLimitedUserPurchased)
          this.dailyLimitedUserPurchasedCount = data.result.dailyLimitedUserPurchasedCount
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    initBusinessCommodity(businessId, businessCommodityId) {
      this.businessLoading = true
      this.carouselFileList = []
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
    initCommodityTagBindCommodityList() {
      this.$http({
        url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/pageByBusinessCommodityId`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.businessTags = data.result
        } else {
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
    addBindTag() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = true
      this.initBusinessCommodityTagList()
    },
    closeDialogTag() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = false
    },
    handleAddBusinessCommodityTag() {
      let selectDataArrLAdd = this.selectDataArrL
      let multipleSelectionLength = selectDataArrLAdd.length
      if (multipleSelectionLength<=0) {
        this.$message.error('请选择需绑定的标签');
      }
      let businessCommodityId = this.businessCommodityId
      this.$confirm(`确认绑定名为${selectDataArrLAdd[0].businessCommodityTagName}等${multipleSelectionLength}个标签?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(() => {
        selectDataArrLAdd.forEach(item => {
          this.$http({
            url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/add`),
            method: 'post',
            params: this.$http.adornParams({
              businessCommodityTagId: item.businessCommodityTagId,
              businessCommodityId: businessCommodityId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `添加标签-${item.businessCommodityTagName},成功`,
                type: "success"
              })
              this.initCommodityTagBindCommodityList()
            } else {
              this.$message.error(data.msg);
            }
          })
        })
        this.dialogAddFormVisible = false
        Object.assign(this.addForm, this.$options.data().addForm)
      }).catch((err)=>{
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      })
    },
    handleAddCurrentChange(val) {
      this.addCurrentPage = val
      this.initBusinessCommodityTagList()
    },
    handleAddSizeChange(val) {
      this.addPageSize = val
      this.initBusinessCommodityTagList()
    },
    initBusinessCommodityTagList() {
      this.$http({
        url: this.$http.adornUrl(`/businessCommodityTag/pageAll`),
        method: 'post',
        params: this.$http.adornParams({
          currentPage: this.addCurrentPage,
          pageSize: this.addPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.addForm.businessCommodityTagListData = data.result.data
          this.addTotal = data.result.pageModel.total;

          //请求到的数据多选后回显被选中
          this.$nextTick(function () {
            this.selectDataArrL.forEach((item) => {
              this.addForm.businessCommodityTagListData.forEach((listitem) => {
                if (item.businessCommodityTagId == listitem.businessCommodityTagId) {
                  this.$refs.multipleTable.toggleRowSelection(listitem, true);
                }
              });
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    //多选
    selectChange(arr, row) {
      let isHaveItem = this.selectDataArrL.find((item) => item.businessCommodityTagId == row.businessCommodityTagId);
      if (isHaveItem) {
        this.selectDataArrL = this.selectDataArrL.filter(
          (item) => item.businessCommodityTagId != isHaveItem.businessCommodityTagId
        );
      } else {
        this.selectDataArrL.push(row);
      }
    },
    // 全选
    selectAll(arr) {
      if (arr.length > 0) {
        this.addRows(arr)
      } else {
        this.removeRows(this.addForm.businessCommodityTagListData)
      }
    },
    // 添加选中行
    addRows(rows) {
      for (let key of rows) {
        // 如果选中的数据中没有这条就添加进去
        if (
          !this.selectDataArrL.find(
            (item) => item.businessCommodityTagId === key.businessCommodityTagId
          )
        ) {
          this.selectDataArrL.push(key);
        }
      }
    },
    // 取消选中行
    removeRows(rows) {
      if (this.selectDataArrL.length > 0) {
        for (let row of rows) {
          this.selectDataArrL = this.selectDataArrL.filter(
            (item) => item.businessCommodityTagId !== row.businessCommodityTagId
          );
        }
      }
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
    handleClose(row) {
      let item = row
      let businessCommodityTagId = item.tagId
      let businessCommodityTagName = item.tagName
      let businessId = this.businessId
      let businessCommodityId = this.businessCommodityId
      this.$confirm(`确认解除名为${businessCommodityTagName}的标签?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(res => {
        this.$http({
          url: this.$http.adornUrl(`/businessCommodityTagBindBusinessCommodity/remove`),
          method: 'get',
          params: this.$http.adornParams({
            businessCommodityTagId: businessCommodityTagId,
            businessCommodityId: businessCommodityId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.initCommodityTagBindCommodityList()
          } else {
            this.$message.error(data.msg);
          }
        })
      }).catch(()=>{
        this.$message({
          type: "info",
          message: "已取消操作"
        });
      })
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
              this.getBusinessDailyLimited()
              this.submitExpand()
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.commodityAvatar = ''
              this.carouselFileList = []
              this.commodityPost = ''
              this.commodityDetailImage = ''
              this.$router.push({
                path: "businessCommodityList",
                query: {
                  businessId: this.commodity.businessId,
                  businessName: this.commodity.businessName
                }
              });
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
    submitExpand() {
      this.$http({
        url: this.$http.adornUrl('/businessCommodityExpand/update'),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId,
          isPayAutoExpired: this.formExpand.isPayAutoExpired,
          payAutoExpiredTime: this.formExpand.payAutoExpiredTime,
          isNoRefundAllowed: this.formExpand.isNoRefundAllowed
        })
      }).then(({data}) => {
        if (data && data.code === 0) {

        } else {
          this.$message.error(data.msg)
        }
      })
    },
    //每日限量
    getBusinessDailyLimited(){
      this.$http({
        url: this.$http.adornUrl(`/businessCommodity/updateDailyLimited`),
        method: 'post',
        params: this.$http.adornParams({
          businessCommodityId: this.businessCommodityId,
          openDailyLimited: this.openDailyLimited,
          dailyLimitedCount: this.dailyLimitedCount,
          dailyLimitedMaxDay: this.dailyLimitedMaxDay,
          openDailyLimitedUserPurchased: this.openDailyLimitedUserPurchased,
          dailyLimitedUserPurchasedCount: this.dailyLimitedUserPurchasedCount
        })
      }).then(({data}) => {
        if (data && data.code === 0) {

        } else {
          this.$message.error(data.msg);
        }
      })
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
