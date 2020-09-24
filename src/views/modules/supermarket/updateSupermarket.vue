<template>
  <div class="fillcontain" v-loading="businessLoading">
    <el-card class="box-card" v-show="!openMap">
      <div class="text item">
        <div class="box">
          <el-row style="margin-top: 20px;" >
            <el-col :span="15" :offset="2">
              <el-form :model="supermarket" :rules="rules" :disabled="flag" ref="supermarket" label-width="150px">
                <el-form-item label="超市名称" prop="bname">
                  <el-input v-model="supermarket.bname"></el-input>
                </el-form-item>
                <el-form-item label="超市标题" prop="btitle">
                  <el-input v-model="supermarket.btitle"></el-input>
                </el-form-item>
                <el-form-item label="超市描述" prop="bdescription">
                  <el-input type="textarea" autosize v-model="supermarket.bdescription"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model.number="supermarket.contactPhone"></el-input>
                </el-form-item>
                <el-form-item label="推荐权重值">
                  <el-select v-model="supermarket.priority" placeholder="推荐权重值">
                    <el-option v-for="item in businessPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
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
                      <span>经度: {{this.supermarket.lng}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>纬度: {{this.supermarket.lat}}</span>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <span>城市编码: {{this.supermarket.cityCode}}</span>
                    </el-col>
                    <el-col :span="12">
                      <span>区域编码: {{this.supermarket.adCode}}</span>
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
                    v-model="supermarket.addressProbably"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="输入大体地址,如xx区xx路"
                    style="width: 100%;"
                  ></el-autocomplete>
                </el-form-item>
                <el-form-item label="具体地址(门牌号)" prop="addressSpecific">
                  <el-input v-model="supermarket.addressSpecific" placeholder="输入具体地址,如xx路xx层xx号"></el-input>
                </el-form-item>
                <el-form-item label="每周营业时间(多选)" prop="weekTimes">
                  <el-checkbox-group
                    v-model="supermarket.weekOperateTimeJson"
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
                  v-for="(dayOperateTimeItem, index) in supermarket.dayOperateTimeJson"
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
                  <el-input-number v-model="supermarket.averagePrice" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="总销量">
                  <el-input-number v-model="supermarket.salesTotalCount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="月销量">
                  <el-input-number v-model="supermarket.salesCurrentMonthCount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="最大配送距离(单位: km)">
                  <el-input-number v-model="supermarket.deliveryDistance" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="起送费(最低消费)">
                  <el-input-number v-model="supermarket.deliveryStartMinAmount" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="配送费">
                  <el-input-number v-model="supermarket.deliveryFee" :min="0" :max="99999999"></el-input-number>
                </el-form-item>

                <el-form-item label="超市头像" prop="bavatar">
                  <el-upload
                    :action="$GlobalApi.getServerUrl('/system/file/supermarket/upload')"
                    :before-upload="beforeAvatarUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgError"
                    :on-success="upImgSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="imageServerUrl + supermarket.bavatar" class="businessAvatar" v-if="supermarket.bavatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="超市详情图片" prop="detailContentImages">
                  <el-upload
                    :action="$GlobalApi.getServerUrl('/system/file/supermarket/upload')"
                    :before-upload="beforeDetailImageUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgDetailError"
                    :on-success="upImgDetailSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="imageServerUrl + supermarket.detailContentImages" class="businessAvatar" v-if="supermarket.detailContentImages">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="营业执照图片">
                  <el-upload
                    class="avatar-uploader"
                    :action="$GlobalApi.getServerUrl('/system/file/supermarket/upload')"
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
                             :action="$GlobalApi.getServerUrl('/system/file/supermarket/upload')"
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
    <div class="map_wrap" v-if="openMap">
      <choose-address
        @confirmAddress="confirmAddressHandle"
        @giveUpChoose="giveUpChooseHandle"
        :lng="supermarket.lng"
        :lat="supermarket.lat"
        :initPosition="true"
      />
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
        merchantId:'',
        checkAll: false,
        supermarketId: "",
        bName:'',
        flag: false,
        weeks: weekOptions,
        operateLicense: "",
        healthLicense: "",
        supermarket: {
          bavatar:"",
          detailContentImages:"",
          id: null,
          bname: "",
          bdescription: "",
          btitle: "",
          contactPhone: "",
          detailContentUrl: "",
          businessCategoryId: "",
          businessRootCategoryName: "",
          priority: 5,
          businessCategoryIdArray: [],
          averagePrice: "",
          salesTotalCount: "",
          salesCurrentMonthCount: "",
          addressProbably: "",
          addressSpecific: "",
          lng: "",
          lat: "",
          adCode: "",
          cityCode: "",
          startTime: "",
          endTime: "",
          dayOperateTimeJson: [],
          weekOperateTimeJson: [],
          identificationCode: "",
          deliveryFee: 5,
          deliveryDistance: 5,
          deliveryStartMinAmount: 5,
          businessAvatarFile: "",
          detailFileArray: "",
          operateLicenseFile: null,
          healthLicenseFile: null,
        },
        rules: {
          bname: [
            { required: true, message: "请输入超市名称", trigger: "blur" }
          ],
          addressProbably: [
            { required: true, message: "请输入详细地址", trigger: "blur" }
          ],
          bavatar: [
            { required: true, message: "请选择超市头像", trigger: "blur" }
          ],
          detailContentImages: [
            { required: true, message: "请选择详情图片", trigger: "blur" }
          ]
        },
        gaodeLocation: {
          formattedAddress: "",
          lnglatResult: null
        },
        openMap: false,
        businessLoading: false,
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
      };
    },
    activated() {
      if (this.$route.query.supermarketId) {
        this.supermarketId = this.$route.query.supermarketId;
        this.bName = this.$route.query.bName;
        this.flag = this.$route.query.flag;
      }
      this.initData();
    },
    methods: {
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
          this.supermarket.bavatar = res.url
        } else {
          this.$message.error(data.msg)
        }
      },
      upImgError (err, file, fileList) {
        this.supermarket.bavatar = './src/assets/img/img_err.png';
      },
      upImgDetailSuccess (res, file) {
        if (res && res.code === 0) {
          this.supermarket.detailContentImages = res.url
        } else {
          this.$message.error(data.msg)
        }
      },
      upImgDetailError (err, file, fileList) {
        this.supermarket.detailContentImages = './src/assets/img/img_err.png';
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
        this.supermarket.lng = lng;
        this.supermarket.lat = lat;
        this.supermarket.adCode = lnglatResult.regeocode.addressComponent.adcode;
        this.supermarket.cityCode = lnglatResult.regeocode.addressComponent.citycode;
        this.gaodeLocation.formattedAddress = formattedAddress;
        this.gaodeLocation.lnglatResult = lnglatResult;
        this.supermarket.addressProbably = formattedAddress;
        this.switchOpenMap();
      },
      giveUpChooseHandle() {
        this.switchOpenMap();
      },
      initData() {
        if (this.supermarketId) {
          this.businessLoading = true
          this.$http({
            url: this.$http.adornUrl('/supermarket/info'),
            method: 'get',
            params: this.$http.adornParams({
              supermarketId: this.supermarketId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              let resDayOperateTimeList = data.vo.dayOperateTimeJson
              this.supermarket = data.vo;
              this.supermarket.dayOperateTimeJson = []
              resDayOperateTimeList.forEach(item => {
                let arr = item.split('-', 2)
                this.supermarket.dayOperateTimeJson.push({
                  startTime: arr[0],
                  endTime: arr[1]
                })
              })
              this.gaodeLocation.formattedAddress = this.supermarket.addressProbably;
              this.operateLicense = data.vo.operateLicenseFile
              this.healthLicense = data.vo.healthLicenseFile
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
        this.supermarket.dayOperateTimeJson.push({
          startTime: '00:00',
          endTime: '24:00'
        });
      },
      removeDayOperateTimeItem(item) {
        if (this.supermarket.dayOperateTimeJson.length <= 1) {
          this.$message({
            type: "err",
            message: "日营业时段至少存在一组"
          });
          return
        }
        var index = this.supermarket.dayOperateTimeJson.indexOf(item)
        if (index !== -1) {
          this.supermarket.dayOperateTimeJson.splice(index, 1)
        }
      },
      submitForm() {
        this.$refs['supermarket'].validate(valid => {
          if (valid) {
            let dayOperateTimeJson = this.supermarket.dayOperateTimeJson
            let dayOperateTimeArr = []
            dayOperateTimeJson.forEach(item => {
              dayOperateTimeArr.push(item.startTime + '-' + item.endTime)
            })
            this.$http({
              url: this.$http.adornUrl('/supermarket/update'),
              method: 'post',
              data: this.$http.adornData({
                "id":this.supermarket.id,
                "bavatar":this.supermarket.bavatar,
                "deliveryDistance":this.supermarket.deliveryDistance,
                "averagePrice":this.supermarket.averagePrice,
                "operateLicense":this.operateLicense,
                "healthLicense":this.healthLicense,
                "dayOperateTimeJson":dayOperateTimeArr,
                "weekOperateTimeJson":this.supermarket.weekOperateTimeJson,
                "bname":this.supermarket.bname,
                "bdescription":this.supermarket.bdescription,
                "btitle":this.supermarket.btitle,
                "contactPhone":this.supermarket.contactPhone,
                "priority":this.supermarket.priority,
                "lng": this.supermarket.lng,
                "lat": this.supermarket.lat,
                "adCode": this.supermarket.adCode,
                "cityCode":this.supermarket.cityCode,
                "deliveryFee":this.supermarket.deliveryFee,
                "deliveryStartMinAmount":this.supermarket.deliveryStartMinAmount,
                "addressSpecific":this.supermarket.addressSpecific,
                "addressProbably":this.supermarket.addressProbably,
                "salesCurrentMonthCount":this.supermarket.salesCurrentMonthCount,
                "salesTotalCount":this.supermarket.salesTotalCount,
                "detailContentImages":this.supermarket.detailContentImages
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.go(-1)
                this.supermarket.bavatar = ''
                this.supermarket.detailContentImages = ''
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
