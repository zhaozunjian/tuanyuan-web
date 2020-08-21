<template>
  <el-card>
    <div class="text item">
      <el-button @click="submitForm" icon="el-icon-document" size="small" type="primary">保存</el-button>
      <div class="box">
        <hr class="sd-hr"/>
        <el-row style="margin-top: 20px;">
          <el-col :span="15" :offset="2">
            <el-form :model="addForm" ref="addForm" label-width="200px">
              <el-form-item label="品牌商名称" prop="headquarterName">
                <el-input v-model="addForm.headquarterName"></el-input>
              </el-form-item>
              <el-form-item label="品牌商标题" prop="headquarterTitle">
                <el-input v-model="addForm.headquarterTitle"></el-input>
              </el-form-item>
              <el-form-item label="品牌商描述" prop="headquarterDescription">
                <el-input v-model="addForm.headquarterDescription"></el-input>
              </el-form-item>
              <el-form-item label="品牌商联系电话" prop="headquarterContactPhone">
                <el-input v-model="addForm.headquarterContactPhone"></el-input>
              </el-form-item>
              <el-form-item label="推荐权重值">
                <el-select v-model="addForm.weight" placeholder="请选择">
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
                  <img :src="imageServerUrl + addForm.headquarterAvatar" class="businessAvatar" v-if="addForm.headquarterAvatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                </el-upload>
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
        addForm: {
          headquarterName: '',
          headquarterTitle: '',
          headquarterContactPhone: '',
          headquarterDescription: '',
          headquarterAvatar: '',
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

    },
    methods: {
      submitForm(formName) {
        this.$http({
          url: this.$http.adornUrl('/headquarter/add'),
          method: 'post',
          data: this.$http.adornData({
            "headquarterName":this.addForm.headquarterName,
            "headquarterTitle":this.addForm.headquarterTitle,
            "headquarterContactPhone":this.addForm.headquarterContactPhone,
            "headquarterDescription":this.addForm.headquarterDescription,
            "headquarterAvatarFile":this.addForm.headquarterAvatar,
            "weight":this.addForm.weight
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.$router.go(-1);
            this.addForm.headquarterAvatar = ''
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
          this.addForm.headquarterAvatar = res.url
        } else {
          this.$message.error(data.msg)
        }
      },
      upImgError (err, file, fileList) {
        this.addForm.headquarterAvatar = './src/assets/img/img_err.png';
      },
    }
  };
</script>

<style>

</style>
