<template>
  <div class="fillcontain" v-loading="businessLoading">
    <el-card class="box-card" v-show="!openMap">
      <div class="text item">
        <!--<el-button :disabled="flag" @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>-->
        <el-button @click="handleShoppingDistrictBindBusinessList" icon="el-icon-document" size="small" type="primary">查看商圈</el-button>
        <el-button @click="handleMerchantBindMerchantUsersList" icon="el-icon-document" size="small" type="primary">店员列表</el-button>
        <el-button @click="handleBusinessIncome" icon="el-icon-document" size="small" type="primary">营业数据</el-button>
        <el-button @click="handleContractTime" icon="el-icon-document" size="small" type="primary">合作周期</el-button>
        <div class="box">
          <hr class="sd-hr"/>
          <el-row style="margin-top: 20px;" >
            <el-col :span="15" :offset="2">
              <el-form :model="business" :rules="rules" :disabled="flag" ref="business" label-width="150px">
                <el-form-item label="商家名称" prop="businessName">
                  <el-input v-model="business.businessName"></el-input>
                </el-form-item>
                <el-form-item label="商家简介" prop="businessDescription">
                  <el-input type="textarea" autosize v-model="business.businessDescription"></el-input>
                </el-form-item>
                <el-form-item label="商家标语" prop="businessTitle">
                  <el-input v-model="business.businessTitle"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="businessContactPhone">
                  <el-input v-model.number="business.businessContactPhone"></el-input>
                </el-form-item>
                <el-form-item label="商家详情url" prop="detailContentUrl">
                  <el-input v-model="business.detailContentUrl"></el-input>
                </el-form-item>
                <el-form-item label="推荐权重值">
                  <!--<el-cascader-->
                    <!--v-model="business.priority"-->
                    <!--:options="businessPriorityOptions"-->
                    <!--:props="{ expandTrigger: 'hover' }"-->
                  <!--&gt;</el-cascader>-->
                  <el-select v-model="business.priority" placeholder="推荐权重值">
                    <el-option v-for="item in businessPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <!--<el-form-item label="商家类别">-->
                  <!--<span>{{this.business.businessRootCategoryName!=''?this.business.businessRootCategoryName+'/':''+ this.business.businessCategoryName}}</span>-->
                <!--</el-form-item>-->
                <el-form-item label="商家类别" prop="businessCategoryIdArray">
                  <!--<el-cascader-->
                    <!--v-model="business.businessCategoryId"-->
                    <!--:options="businessCategoryOptions"-->
                    <!--:props="{ expandTrigger: 'hover' }"-->
                  <!--&gt;</el-cascader>-->
                  <el-select v-model="business.businessCategoryId" placeholder="商家类别">
                    <el-option v-for="item in businessCategoryOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="选择地理位置" prop>
                  <el-row>
                    <el-col :span="12">
                      <el-button @click="switchOpenMap" type="primary">修改地理位置</el-button>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>经度: {{this.business.lng}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>纬度: {{this.business.lat}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>城市编码: {{this.business.cityCode}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>区域编码: {{this.business.adCode}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <span>预估位置: {{this.gaodeLocation.formattedAddress}}</span>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="大体地址(区域)" prop="addressProbably">
                  <el-autocomplete
                    v-model="business.addressProbably"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="输入大体地址,如xx区xx路"
                    style="width: 100%;"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="具体地址(门牌号)" prop="addressSpecific">
                  <el-input v-model="business.addressSpecific" placeholder="输入具体地址,如xx路xx层xx号"></el-input>
                </el-form-item>
                <el-form-item label="每周营业时间(多选)" prop="weekTimes">
                  <el-checkbox-group
                    v-model="business.weekOperateTime"
                    @change="handleCheckedWeekTimesChange"
                  >
                    <el-checkbox
                      v-for="week in weeks"
                      :label="week.value"
                      :key="week.value"
                    >{{week.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="日营业时段" prop="weekTimes">
                  <el-button @click="addDayOperateTimeItem()">新增日营业时段</el-button>
                </el-form-item>
                <el-form-item
                  v-for="(dayOperateTimeItem, index) in business.dayOperateTimeList"
                  :label="'日营业时段' + (index+1)"
                  :key="index"
                >
                  <el-time-select
                    placeholder="起始时间"
                    v-model="dayOperateTimeItem.startTime"
                    :picker-options="{
							start: '00:00',
							step: '00:30',
							end: '24:00'
							}"
                  ></el-time-select>到
                  <el-time-select
                    placeholder="结束时间"
                    v-model="dayOperateTimeItem.endTime"
                    :picker-options="{
                start: '00:00',
                step: '00:30',
                end: '24:00'
              }"
                  ></el-time-select>
                  <el-button @click.prevent="removeDayOperateTimeItem(dayOperateTimeItem)">删除</el-button>
                </el-form-item>
                <el-form-item label="人均消费">
                  <el-input-number v-model="business.averagePrice" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="最大配送距离(单位: km)">
                  <el-input-number v-model="business.deliveryDistance" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="起送费(最低消费)">
                  <el-input-number v-model="business.minStartDeliveryFee" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="商品标签">
                  <el-tag v-for="tag in businessTags" :key="tag.tagId" style="margin-right: 20px;"
                          :closable="!flag" :disable-transitions="false" @close="handleDelete(tag)">
                    {{tag.tagName}}
                  </el-tag>
                  <el-button size="small" @click="addBindTag()">添加标签</el-button>
                </el-form-item>
                <el-form-item label="商家头像">
                  <el-upload
                    :action="$GlobalApi.getServerUrl('/system/file/business/upload')"
                    :before-upload="beforeAvatarUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgError"
                    :on-success="upImgSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="imageServerUrl + businessAvatar" class="businessAvatar" v-if="businessAvatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="商家详情图片">
                  <el-upload
                    :action="$GlobalApi.getServerUrl('/system/file/business/upload')"
                    :before-upload="beforeDetailImageUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgDetailError"
                    :on-success="upImgDetailSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="imageServerUrl + businessDetailImage" class="businessAvatar" v-if="businessDetailImage">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="营业执照图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="$GlobalApi.getServerUrl('/system/file/business/upload')"
                    :before-upload="beforeoperateImageUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgoperateError"
                    :on-success="upImgoperateSuccess"
                    :show-file-list="false">
                    <img v-if="operateLicense" :src="imageServerUrl + operateLicense" class="businessAvatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="卫生许可图片">
                  <el-upload class="avatar-uploader"
                    :action="$GlobalApi.getServerUrl('/system/file/business/upload')"
                    :before-upload="beforehealthImageUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImghealthError"
                    :on-success="upImghealthSuccess"
                    :show-file-list="false">
                    <img v-if="healthLicense" :src="imageServerUrl + healthLicense" class="businessAvatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="flag" type="primary" style="width:120px;" @click="submitForm()">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="设置合作周期"
      width="30%"
      :visible.sync="businessContractFlag">
      <el-form :model="form" size="small" ref="form" class="sd-form" label-width="100px">
        <el-form-item label="合作周期结束时间(截止日期)" prop="contractEndTime">
          <el-date-picker
            v-model="contractEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="businessContractFlag = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <el-dialog class="code-dialog" width="45%" title="添加绑定标签" :visible.sync="dialogAddFormVisible" @close="closeDialog">
      <el-table
        :data="addForm.businessTagListData"
        :height="$GlobalApi.getWinHeight() - 300"
        tooltip-effect="dark"
        style="width: 100%"
        @select="selectChange"
        @select-all="selectAll"
        ref="multipleTable">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <el-table-column prop="businessTagName" label="标签名称"></el-table-column>
      </el-table>
      <pager :current-page="addCurrentPage" :page-size="addPageSize" :total="addTotal"
             @current-change="handleAddCurrentChange" @handle-size-change="handleAddSizeChange" background/>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="dialogAddFormVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleAddBusinessTag()">确 定</el-button>
      </div>
    </el-dialog>
    <div class="map_wrap" v-if="openMap">
      <choose-address
        @confirmAddress="confirmAddressHandle"
        @giveUpChoose="giveUpChooseHandle"
        :lng="business.lng"
        :lat="business.lat"
        :initPosition="true"
      />
    </div>
  </div>
</template>

<script>

  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";

const weekOptions = [
  {
    name: "周一",
    value: 1
  },
  {
    name: "周二",
    value: 2
  },
  {
    name: "周三",
    value: 3
  },
  {
    name: "周四",
    value: 4
  },
  {
    name: "周五",
    value: 5
  },
  {
    name: "周六",
    value: 6
  },
  {
    name: "周日",
    value: 7
  }
];

export default {
  data() {
    return {
      merchantId:'',
      checkAll: false,
      businessId: "",
      businessName:'',
      flag: false,
      weeks: weekOptions,
      businessAvatar: "",
      operateLicense: "",
      healthLicense: "",
      businessDetailImage: "",
      business: {
        businessId: null,
        businessName: "",
        businessDescription: "",
        businessTitle: "",
        businessContactPhone: "",
        detailContentUrl: "",
        businessCategoryId: "",
        businessRootCategoryName: "",
        businessCategoryName: "",
        priority: 5,
        businessCategoryIdArray: [],
        averagePrice: "",
        addressProbably: "",
        addressSpecific: "",
        lng: "",
        lat: "",
        adCode: "",
        cityCode: "",
        startTime: "",
        endTime: "",
        dayOperateTimeList: [],
        weekOperateTime: [],
        identificationCode: "",
        deliveryDistance: 5,
        minStartDeliveryFee: 0,
        businessAvatarFile: "",
        detailFileArray: "",
        operateLicenseFile: null,
        healthLicenseFile: null,
      },
      rules: {
        businessName: [
          { required: true, message: "请输入商家名称", trigger: "blur" }
        ],
        addressProbably: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        businessAvatar: [
          { required: true, message: "请选择商家头像", trigger: "blur" }
        ],
        businessDetailImage: [
          { required: true, message: "请选择详情图片", trigger: "blur" }
        ],
        businessCategoryId: [
          { required: true, message: "请输入商家类别", trigger: "blur" }
        ],
        // businessContactPhone: [{validator: this.$Utils.validPhone, required: true, trigger: 'change'}],
      },
      gaodeLocation: {
        formattedAddress: "",
        lnglatResult: null
      },
      openMap: false,
      businessLoading: false,
      businessCategoryName: "",
      businessCategoryOptions: [],
      businessPriorityOptions: [
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

      businessContractFlag:false,
      form: {},
      contractEndTime: '',
      //商家标签
      dialogAddFormVisible:false,
      addForm: {
        businessTagListData: [],
      },
      selectDataArrL:[],
      addTotal: 0,
      addCurrentPage: 1,
      addPageSize: 10,
      businessTags:[]
    };
  },
  activated() {
    if (this.$route.query.businessId) {
      this.businessId = this.$route.query.businessId;
      this.businessName = this.$route.query.businessName;
      this.merchantId = this.$route.query.merchantId;
      this.flag = this.$route.query.flag;
    }
    this.initCategoryData();
    this.initData();
    this.initBusinessTagBindList();
  },
  methods: {
    initBusinessTagBindList() {
      this.$http({
        url: this.$http.adornUrl(`/businessTagBindBusiness/pageByBusinessId`),
        method: 'post',
        params: this.$http.adornParams({
          businessId: this.businessId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.businessTags = data.result
        } else {
          this.$message.error(data.msg);
        }
      })
    },
    dataFormSubmit() {
      this.$confirm("确认修改该商家的合作周期结束时间吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/business/updateContractTime'),
          method: 'post',
          params: this.$http.adornParams({
            businessId: this.businessId,
            contractEndTime: this.contractEndTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.businessContractFlag = false
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消操作"
        });
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
        this.businessAvatar = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgError (err, file, fileList) {
      this.businessAvatar = './src/assets/img/img_err.png';
    },
    upImgDetailSuccess (res, file) {
      if (res && res.code === 0) {
        this.businessDetailImage = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgDetailError (err, file, fileList) {
      this.businessDetailImage = './src/assets/img/img_err.png';
    },
    beforeDetailImageUpload(file) {
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
    upImghealthSuccess (res, file) {
      if (res && res.code === 0) {
        this.healthLicense = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgoperateSuccess (res, file) {
      if (res && res.code === 0) {
        this.operateLicense = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImghealthError (err, file, fileList) {
      this.healthLicense = './src/assets/img/img_err.png';
    },
    upImgoperateError (err, file, fileList) {
      this.operateLicense = './src/assets/img/img_err.png';
    },
    beforehealthImageUpload(file) {
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
    beforeoperateImageUpload(file) {
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
    switchOpenMap() {
      this.openMap = !this.openMap;
    },
    confirmAddressHandle(lng, lat, formattedAddress, lnglatResult) {
      this.business.lng = lng;
      this.business.lat = lat;
      this.business.adCode = lnglatResult.regeocode.addressComponent.adcode;
      this.business.cityCode = lnglatResult.regeocode.addressComponent.citycode;
      this.gaodeLocation.formattedAddress = formattedAddress;
      this.gaodeLocation.lnglatResult = lnglatResult;
      this.business.addressProbably = formattedAddress;
      this.switchOpenMap();
    },
    giveUpChooseHandle() {
      this.switchOpenMap();
    },
    closeDialog() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = false
    },
    addBindTag() {
      this.selectDataArrL = []
      this.dialogAddFormVisible = true
      this.initBusinessTagList()
    },
    initBusinessTagList() {
      this.$http({
        url: this.$http.adornUrl(`/businessTag/pageAll`),
        method: 'post',
        params: this.$http.adornParams({
          currentPage: this.addCurrentPage,
          pageSize: this.addPageSize
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.addForm.businessTagListData = data.result.data
          this.addTotal = data.result.pageModel.total;

          //请求到的数据多选后回显被选中
          this.$nextTick(function () {
            this.selectDataArrL.forEach((item) => {
              this.addForm.businessTagListData.forEach((listitem) => {
                if (item.businessTagId == listitem.businessTagId) {
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
      let isHaveItem = this.selectDataArrL.find((item) => item.businessTagId == row.businessTagId);
      if (isHaveItem) {
        this.selectDataArrL = this.selectDataArrL.filter(
          (item) => item.businessTagId != isHaveItem.businessTagId
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
            (item) => item.businessTagId === key.businessTagId
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
            (item) => item.businessTagId !== row.businessTagId
          );
        }
      }
    },
    handleAddBusinessTag() {
      let multipleSelectionAdd = this.selectDataArrL
      let multipleSelectionLength = multipleSelectionAdd.length
      if (multipleSelectionLength<=0) {
        this.$message.error('请选择需绑定的标签');
      }
      let businessId = this.businessId
      this.$confirm(`确认绑定名为${multipleSelectionAdd[0].businessTagName}等${multipleSelectionLength}个标签?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(() => {
        multipleSelectionAdd.forEach(item => {
          this.$http({
            url: this.$http.adornUrl(`/businessTagBindBusiness/add`),
            method: 'post',
            params: this.$http.adornParams({
              businessTagId: item.businessTagId,
              businessId: businessId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: `添加标签-${item.businessTagName},成功`,
                type: "success"
              })
              this.initBusinessTagBindList()
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
      this.initBusinessTagList()
    },
    handleAddSizeChange() {
      this.addPageSize = val;
      this.initBusinessTagList()
    },
    handleDelete(row) {
      let item = row
      let businessTagId = item.tagId
      let businessTagName = item.tagName
      let businessId = this.businessId
      this.$confirm(`确认解除名为${businessTagName}的标签?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      }).then(res => {
        this.$http({
          url: this.$http.adornUrl(`/businessTagBindBusiness/remove`),
          method: 'get',
          params: this.$http.adornParams({
            businessTagId: businessTagId,
            businessId: businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            })
            this.initBusinessTagBindList()
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
    initCategoryData() {
      this.$http({
        url: this.$http.adornUrl('/sys/businessCategory/findAll'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.businessCategoryOptions = this.getTreeData(data.result);
        } else {
          this.$message.error(data.msg)
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
    initData() {
      if (this.businessId) {
        this.businessLoading = true
        this.$http({
          url: this.$http.adornUrl('/business/info'),
          method: 'get',
          params: this.$http.adornParams({
            businessId: this.businessId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            let resDayOperateTimeList = data.result.dayOperateTimeList
            this.business = data.result;
            this.business.dayOperateTimeList = []
            resDayOperateTimeList.forEach(item => {
              let arr = item.split('-', 2)
              this.business.dayOperateTimeList.push({
                startTime: arr[0],
                endTime: arr[1]
              })
            })
            this.gaodeLocation.formattedAddress = this.business.addressProbably;
            this.businessAvatar =data.result.businessAvatar;
            this.businessDetailImage =data.result.detailUrlList;
            this.operateLicense = data.result.operateLicenseFile
            this.healthLicense = data.result.healthLicenseFile
            this.businessLoading = false
          } else {
            this.businessLoading = false
            this.$message.error(data.msg)
          }
        })
      }
    },
    querySearchAsync(queryString) {},
    handleCheckedWeekTimesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.weeks.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.weeks.length;
    },
    addDayOperateTimeItem() {
      this.business.dayOperateTimeList.push({
            startTime: '00:00',
            endTime: '24:00'
      });
    },
    removeDayOperateTimeItem(item) {
      if (this.business.dayOperateTimeList.length <= 1) {
          this.$message({
              type: "err",
              message: "日营业时段至少存在一组"
          });
          return
      }
      var index = this.business.dayOperateTimeList.indexOf(item)
      if (index !== -1) {
        this.business.dayOperateTimeList.splice(index, 1)
      }
    },
    handleBusinessIncome() {
      this.$router.push({
        name: "businessIncome",
        query: {
          businessId: this.businessId,
          businessName: this.businessName
        }
      });
    },
    handleContractTime() {
      this.businessContractFlag = true
      this.$http({
        url: this.$http.adornUrl('/business/findContractTime'),
        method: 'get',
        params: this.$http.adornParams({
          businessId: this.businessId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.contractEndTime = data.result.contractEndTime
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    handleMerchantBindMerchantUsersList() {
      this.$router.push({
        name: "merchantBindMerchantUsersList",
        query: {
          merchantId:this.merchantId,
          merchantName: this.businessName
        }
      });
    },
    handleShoppingDistrictBindBusinessList() {
      this.$router.push({
        name: "shoppingDistrictBindBusinessList",
        query: {
          businessId: this.businessId,
          businessName: this.businessName
        }
      });
    },
    submitForm() {
      this.$refs['business'].validate(async valid => {
        if (valid) {
          let dayOperateTimeList = this.business.dayOperateTimeList
          let dayOperateTimeArr = []
          dayOperateTimeList.forEach(item => {
            dayOperateTimeArr.push(item.startTime + '-' + item.endTime)
          })

          this.$http({
            url: this.$http.adornUrl('/business/update'),
            method: 'post',
            data: this.$http.adornData({
              "businessId":this.business.businessId,
              "businessAvatarFile":this.businessAvatar,
              "minStartDeliveryFee":this.business.minStartDeliveryFee,
              "deliveryDistance":this.business.deliveryDistance,
              "averagePrice":this.business.averagePrice,
              "operateLicenseFile":this.operateLicense,
              "healthLicenseFile":this.healthLicense,
              "dayOperateTime":dayOperateTimeArr,
              "weekOperateTime":this.business.weekOperateTime,
              "businessName":this.business.businessName,
              "businessDescription":this.business.businessDescription,
              "businessTitle":this.business.businessTitle,
              "businessContactPhone":this.business.businessContactPhone,
              "detailContentUrl":this.business.detailContentUrl,
              "priority":this.business.priority,
              "businessCategoryId":this.business.businessCategoryId,
              "lng": this.business.lng,
              "lat": this.business.lat,
              "adCode": this.business.adCode,
              "cityCode":this.business.cityCode,
              "addressSpecific":this.business.addressSpecific,
              "addressProbably":this.business.addressProbably,
              "detailFileArray":this.businessDetailImage
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.go(-1)
            } else {
              this.$message.error(data.msg)
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

<style scope>
.map_wrap {
  width: 100%;
  height: 800px;
}
  .businessAvatar{
    width: 400px;
  }
  .avatar-uploader{
    width: 400px;
  }
</style>
