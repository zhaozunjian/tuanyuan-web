<template>
  <div class="fillcontain">
    <el-card class="box-card" v-show="!openMap">
      <div class="text item">
        <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
        <el-button @click="handleJump" icon="el-icon-document" size="small" type="primary">营业数据</el-button>
        <div class="box">
          <hr class="sd-hr"/>
          <el-row style="margin-top: 20px;">
            <el-col :span="15" :offset="2">
              <el-form :model="business" :rules="rules" ref="business" label-width="200px">
                <el-form-item label="直营店名称" prop="directsName">
                  <el-input v-model="business.directsName"></el-input>
                </el-form-item>
                <el-form-item label="直营店描述" prop="directsDescription">
                  <el-input v-model="business.directsDescription"></el-input>
                </el-form-item>
                <el-form-item label="直营店标题" prop="directsTitle">
                  <el-input v-model="business.directsTitle"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="directsContactPhone">
                  <el-input v-model="business.directsContactPhone"></el-input>
                </el-form-item>
                <el-form-item label="推荐权重值" prop="priority">
                  <el-input v-model="business.priority"></el-input>
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
                <el-form-item label="最大配送距离(单位: km)">
                  <el-input-number v-model="business.deliveryDistance" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="起送费(最低消费)">
                  <el-input-number v-model="business.minStartDeliveryFee" :min="0" :max="99999999"></el-input-number>
                </el-form-item>
                <el-form-item label="商家头像">
                  <el-upload
                    :action="$GlobalApi.getServerUrl('/system/file/directs/upload')"
                    :before-upload="beforeAvatarUpload"
                    :headers="$GlobalApi.getUserToken()"
                    :on-error="upImgError"
                    :on-success="upImgSuccess"
                    :show-file-list="false"
                    class="avatar-uploader">
                    <img :src="imageServerUrl + directsAvatar" class="businessAvatar" v-if="directsAvatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                  </el-upload>
                </el-form-item>
                <!--<el-form-item class="button_submit">-->
                <!--<el-button type="primary" @click="submitForm('business')">确认修改商家</el-button>-->
                <!--</el-form-item>-->
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <el-row v-if="openMap">
      <div class="map_wrap">
        <choose-address
          @confirmAddress="confirmAddressHandle"
          @giveUpChoose="giveUpChooseHandle"
          :lng="business.lng"
          :lat="business.lat"
          :initPosition="true"
        />
      </div>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      checkAll: false,
      directsAvatar:'',
      isIndeterminate: true,
      business: {
        directsId: "",
        directsName: "",
        directsDescription: "",
        directsTitle: "",
        directsContactPhone: "",
        priority:'',
        directsAvatarFile: '',
        lng: 0,
        lat: 0,
        cityCode: 0,
        adCode: 0,
        addressProbably: "",
        addressSpecific: "",
        deliveryDistance: 5,
        minStartDeliveryFee: 0
      },
      rules: {
        businessName: [
          { required: true, message: "请输入商家名称", trigger: "blur" }
        ],
        addressProbably: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        businessContactPhone: [{ required: true, message: "请输入联系电话" }]
      },
      gaodeLocation: {
        formattedAddress: "",
        lnglatResult: null
      },
      openMap: false,
      directsId: "",
      businessCategoryName: "",
    };
  },
  created() {
    this.checkdirectsId();
    this.initData();
  },
  methods: {
    checkdirectsId() {
      if (this.$route.query.directsId) {
        this.directsId = this.$route.query.directsId;
      } else {
        this.directsId = Math.ceil(Math.random() * 10);
        this.$alert("修改商家需要选择一个商家,先去选择商家进行编辑", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.go(-1)
          }
        });
      }
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
        this.directsAvatar = res.url
      } else {
        this.$message.error(data.msg)
      }
    },
    upImgError (err, file, fileList) {
      this.directsAvatar = './src/assets/img/img_err.png';
    },
    initData() {
      if (this.directsId) {
        this.$http({
          url: this.$http.adornUrl('/directs/info'),
          method: 'get',
          params: this.$http.adornParams({
            directsId: this.directsId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.business = data.result;
            this.gaodeLocation.formattedAddress = this.business.addressProbably;
            this.directsAvatar = data.result.directsAvatar;
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    querySearchAsync(queryString) {},
    handleJump() {
      this.$router.push({
        name: "directsIncome",
        query: { directsId: this.directsId }
      });
    },
    submitForm() {
      this.$refs['business'].validate(async valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/directs/update'),
            method: 'post',
            data: this.$http.adornData({
              "directsAvatarFile":this.directsAvatar,
              "directsId":this.business.directsId,
              "directsName":this.business.directsName,
              "minStartDeliveryFee":this.business.minStartDeliveryFee,
              "deliveryDistance":this.business.deliveryDistance,
              "addressSpecific":this.business.addressSpecific,
              "addressProbably":this.business.addressProbably,
              "lng": this.business.lng,
              "lat": this.business.lat,
              "adCode": this.business.adCode,
              "cityCode":this.business.cityCode,
              "priority":this.business.priority,
              "directsContactPhone":this.business.directsContactPhone,
              "directsTitle":this.business.directsTitle,
              "directsDescription":this.business.directsDescription,
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
<style scoped>
  .map_wrap {
    width: 100%;
    height: 800px;
  }
</style>
