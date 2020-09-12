<template>
  <div>
    <el-card class="box-card" v-show="!openMap">
      <div class="text item">
        <div class="box">
          <el-row style="margin-top: 20px;">
            <el-col :span="15" :offset="2">
              <el-form :model="business" :rules="rules" ref="business" label-width="120px">
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
                  <el-input v-model="business.businessContactPhone"></el-input>
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
                <el-form-item label="商家类别" prop="businessCategoryIdArray">
                  <!--<el-cascader-->
                    <!--v-model="business.businessCategoryIdArray"-->
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
                      <el-button @click="switchOpenMap" type="primary">选择地理位置</el-button>
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
                <el-form-item label="人均消费(0表示不填)">
                  <el-input-number v-model="business.averagePrice" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="最大配送距离(单位: km)">
                  <el-input-number v-model="business.deliveryDistance" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="起送费(最低消费)">
                  <el-input-number v-model="business.minStartDeliveryFee" :min="0" :max="99999999"></el-input-number>
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
                  <el-upload
                    class="avatar-uploader"
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
                  <el-button type="primary" style="width:120px;" @click="submitForm()">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <div class="map_wrap" v-if="openMap">
      <choose-address
        @confirmAddress="confirmAddressHandle"
        @giveUpChoose="giveUpChooseHandle"
        :initPosition="false"/>
    </div>
  </div>
</template>

<script>

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
      checkAll: false,
      weeks: weekOptions,
      isIndeterminate: true,
      business: {
        businessName: "",
        businessDescription: "",
        businessTitle: "",
        businessContactPhone: "",
        detailContentUrl: "",
        priority: 5,
        businessAvatarFile: '',
        detailFileArray: '',
        operateLicenseFile: '',
        healthLicenseFile: '',
        businessCategoryId: '',
        lng: null,
        lat: null,
        cityCode: null,
        adCode: null,
        addressProbably: "",
        addressSpecific: "",
        weekOperateTime: [1, 2, 3, 4, 5, 6, 7],
        dayOperateTime:'',
        dayOperateTimeList: [{
          startTime: '00:00',
          endTime: '24:00'
        }],
        averagePrice: 0,
        deliveryDistance: 5,
        minStartDeliveryFee: 0
      },
      startTime: "00:00",
      endTime: "24:00",
      businessAvatar: "",
      businessDetailImage: "",
      operateLicense: "",
      healthLicense: "",
      gaodeLocation: {
        formattedAddress: "",
        lnglatResult: null
      },
      rules: {
        businessName: [
          { required: true, message: "请输入商家名称", trigger: "blur" }
        ],
        addressProbably: [
          { required: true, message: "请输入大体地址", trigger: "blur" }
        ],
        addressSpecific: [
          { required: true, message: "请输入具体地址", trigger: "blur" }
        ],
        businessCategoryId: [
          { required: true, message: "请输入商家类别", trigger: "blur" }
        ],
        // businessContactPhone: [{validator: this.$Utils.validPhone, required: true, trigger: 'change'}],
      },
      openMap: false,
      aMapAutoComplete: undefined,
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
      ]
    };
  },
  created() {
    this.initData();
  },
  mounted() {
  },
  methods: {
    initData() {
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
    submitForm() {
      this.$refs['business'].validate(async valid => {
        if (valid) {
          let dayOperateTimeList = this.business.dayOperateTimeList
          let dayOperateTimeArr = []
          dayOperateTimeList.forEach(item => {
            dayOperateTimeArr.push(item.startTime + '-' + item.endTime)
          })

          this.$http({
            url: this.$http.adornUrl('/business/add'),
            method: 'post',
            data: this.$http.adornData({
              "businessAvatarFile":this.businessAvatar,
              "minStartDeliveryFee":this.business.minStartDeliveryFee,
              "deliveryDistance":this.business.deliveryDistance,
              "averagePrice":this.business.averagePrice,
              "dayOperateTime":dayOperateTimeArr,
              "weekOperateTime":this.business.weekOperateTime,
              "businessName":this.business.businessName,
              "businessDescription":this.business.businessDescription,
              "businessTitle":this.business.businessTitle,
              "operateLicenseFile":this.operateLicense,
              "healthLicenseFile":this.healthLicense,
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
                message: "添加成功",
                type: "success"
              });
              this.$refs['business'].resetFields();
              this.$router.go(-1);
              Object.assign(this.business, this.$options.data().business)
              this.businessAvatar = ''
              this.businessDetailImage = ''
              this.operateLicense = ''
              this.healthLicense = ''
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false;
        }
      });
    },
    switchOpenMap(e) {
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
    async querySearchAsync(queryString, cb) {
      if (queryString) {
        try {
          // 高德查询城市地区api
          AMap.plugin("AMap.Autocomplete", function() {
            var autoComplete = new AMap.Autocomplete();
            autoComplete.search(queryString, function(status, result) {
              if (status === "complete") {
                var resultList = result.tips;
                if (resultList instanceof Array) {
                  resultList.map(item => {
                    item.value = item.address + item.name;
                    return item;
                  });
                  cb(resultList);
                }
              }
            });
          });
        } catch (err) {
          console.log(err);
        }
      }
    },
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
    }
  }
};
</script>

<style scoped>

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
