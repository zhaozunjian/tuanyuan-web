<template>
  <el-card>
    <div class="text item">
      <!--<el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>-->
      <div class="box">
        <hr class="sd-hr"/>
        <el-row style="margin-top: 20px;">
          <el-col :span="15" :offset="2">
            <el-form :model="editForm" ref="editForm" label-width="150px">
              <el-form-item label="品牌商名称" prop="headquarterName">
                <el-input v-model="editForm.headquarterName"></el-input>
              </el-form-item>
              <el-form-item label="品牌商标题" prop="headquarterTitle">
                <el-input v-model="editForm.headquarterTitle"></el-input>
              </el-form-item>
              <el-form-item label="品牌商描述" prop="headquarterDescription">
                <el-input v-model="editForm.headquarterDescription"></el-input>
              </el-form-item>
              <el-form-item label="品牌商联系电话" prop="headquarterContactPhone">
                <el-input v-model="editForm.headquarterContactPhone"></el-input>
              </el-form-item>
              <el-form-item label="推荐权重值">
                <el-select v-model="editForm.weight" placeholder="请选择">
                  <el-option
                    v-for="item in headquarterWeightOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="品牌商头像">
                <el-upload
                  :action="$GlobalApi.getServerUrl('/system/file/business/upload')"
                  :before-upload="beforeAvatarUpload"
                  :headers="$GlobalApi.getUserToken()"
                  :on-error="upImgError"
                  :on-success="upImgSuccess"
                  :show-file-list="false"
                  class="avatar-uploader">
                  <img :src="imageServerUrl + editForm.headquarterAvatar" class="businessAvatar" v-if="editForm.headquarterAvatar">
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
</template>

<script>

  export default {
    data() {
      return {
        headquarterId: '',
        headquarterName: '',
        editForm: {
          headquarterId: '',
          headquarterName: '',
          headquarterAvatar: '',
          headquarterTitle: '',
          headquarterDescription: '',
          headquarterContactPhone: '',
          weight: 1
        },
        headquarterWeightOptions: [
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
            label: "五级"
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
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        if (this.$route.query.headquarterId) {
          this.headquarterId = this.$route.query.headquarterId
          this.headquarterName = this.$route.query.headquarterName
          this.initHeadquarterInfo()
        }
      },
      initHeadquarterInfo() {
        this.$http({
          url: this.$http.adornUrl('/headquarter/info'),
          method: 'get',
          params: this.$http.adornParams({
            headquarterId: this.headquarterId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.editForm = data.result
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      submitForm() {
        this.$http({
          url: this.$http.adornUrl('/headquarter/update'),
          method: 'post',
          data: this.$http.adornData({
            "headquarterId":this.editForm.headquarterId,
            "headquarterName":this.editForm.headquarterName,
            "headquarterTitle":this.editForm.headquarterTitle,
            "headquarterContactPhone":this.editForm.headquarterContactPhone,
            "headquarterDescription":this.editForm.headquarterDescription,
            "headquarterAvatarFile":this.editForm.headquarterAvatar,
            "weight":this.editForm.weight
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
          this.editForm.headquarterAvatar = res.url
        } else {
          this.$message.error(data.msg)
        }
      },
      upImgError (err, file, fileList) {
        this.editForm.headquarterAvatar = './src/assets/img/img_err.png';
      },
    }
  };
</script>
