<template>
  <div id="personnel-detail">
    <el-card class="box-card">
      <div class="text item">
        <el-button :disabled="lookOver" @click="savePers" icon="el-icon-document" size="small" type="primary">保存
        </el-button>
        <el-button @click="$router.go(-1)" icon="el-icon-document" size="small" type="primary">取消</el-button>
        <el-button :disabled="lookOver" @click="savePers(1)" icon="el-icon-minus" size="small" type="danger">删除
        </el-button>
        <el-button :disabled="lookOver" @click="digImage = true" icon="el-icon-upload" size="small" type="primary">
          图片上传
        </el-button>
        <div>
          <el-form :inline="true" :model="formData" :rules="userRules" class="thisform sd-form" label-width="120px"
                   ref="formData" size="small">
            <hr class="sd-hr"/>
            <el-form-item style="display: block">
              <i class="el-icon-document"></i>
              <span class="title">用户信息</span>
            </el-form-item>
            <el-form-item class="inline" label="用户编号" label-width="80px" prop="id">
              <el-input disabled placeholder="用户编号" v-model="formData.id" maxlength="16" />
            </el-form-item>
            <el-form-item class="inline" label="用户姓名" label-width="80px" prop="nickName">
              <el-input :disabled="lookOver" clearable placeholder="用户姓名" v-model="formData.nickName" maxlength="50"/>
            </el-form-item>
            <el-form-item class="inline" label="性别" label-width="80px" prop="gender">
              <el-radio-group :disabled="lookOver" v-model="formData.gender">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="inline" label="出生日期" label-width="80px" prop="birthday">
              <el-date-picker :disabled="lookOver" :editable="false" class="sd-width-150" placeholder="出生日期"
                              v-model="formData.birthday"
                              value-format="yyyy-MM-dd" format="yyyy-MM-dd"/>
            </el-form-item>
            <el-form-item class="inline" label="手机号码" label-width="80px" prop="phoneNumber">
              <el-input :disabled="lookOver" clearable placeholder="手机号码" v-model="formData.phoneNumber" maxlength="11"/>
            </el-form-item>

            <el-form-item class="inline" label="用户邀请码" label-width="80px" prop="invitationCode">
              <el-input :disabled="lookOver" clearable placeholder="用户邀请码" v-model="formData.invitationCode" maxlength="100"/>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <el-dialog :visible.sync="digImage" title="图片上传" width="20%">
      <div style="margin-left: 20%">
        <el-upload
          :action="$GlobalApi.getServerUrl('/system/file/upload')"
          :before-upload="beforeUpImg"
          :headers="$GlobalApi.getUserToken()"
          :on-error="upImgError"
          :on-success="upImgSuccess"
          :show-file-list="false"
          class="avatar-uploader">
          <img :src="formData.avatarUrl" class="avatar" v-if="formData.avatarUrl">
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'userDetail',
    data () {
      return {
        userRules: {
          nickName: [{required: true, trigger: 'change'}],
          gender: [{required: true, trigger: 'change'}],
          phoneNumber: [{validator: this.$Utils.validPhone, required: true, trigger: 'change'}],
          birthday: [{required: true, trigger: 'change'}],
          avatarUrl: [{required: true, trigger: 'change'}],
          invitationCode: [{required: true, trigger: 'change'}]
        },
        digImage:false,
        lookOver:false,
        formData:{
          id:'',
          nickName:'',
          phoneNumber:'',
          birthday:'',
          gender:"1",
          avatarUrl:'',
          invitationCode:'',
        },
        formType:'3',
        files:[]
      }
    },

    async mounted () {
    },
    async activated () {
      if (this.$route.params.flag != undefined){
        //判断是否新增，是新增则清空数据
        this.lookOver = false
        this.formType = this.$route.params.flag
        if (this.$route.params.flag === 3) {
          this.$refs['formData'].resetFields();
        }
        //判断是否重复点击相同的数据
        if (this.$route.params.flag !== 3) {
          if (this.$route.params.flag === 2){
            this.lookOver = true
          }
          this.getUserInfo()
        }
      }else {
        this.lookOver = false
        this.formType = 3
          this.$refs['formData'].resetFields();
      }
    },
    methods: {
      async savePers (val) {
        if (val === 1) {
          let type = await this.$GlobalApi.confirmMsg('此操作将永久删除当前记录, 是否继续?', '提示', 1)
          if (type == true) {
            this.$http({
              url: this.$http.adornUrl('/sys/user/delete'),
              method: 'post',
              params: this.$http.adornParams({ids:this.formData.id})
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$GlobalApi.alertMsg('成功', '删除成功', 1, 0)
                this.formType = 3
                this.$router.go(-1);
              } else {
                this.$GlobalApi.alertMsg("错误", `${data.msg}`, 1, 3);
              }
            })
          } else if (type == false) {
            this.$GlobalApi.alertMsg('提示', '已取消删除', 1, 1)
          }
        } else {
          this.$refs['formData'].validate((valid) => {
            if (valid) {
              let params = {
                id: this.formData.id,
                nickName: this.formData.nickName,
                avatarUrl: this.formData.avatarUrl,
                birthday: this.formData.birthday,
                gender: this.formData.gender,
                invitationCode: this.formData.invitationCode,
                phoneNumber: this.formData.phoneNumber,
                bindingPhone: this.formData.phoneNumber != '' ? 1:2
              }
              this.$http({
                url: this.$http.adornUrl(`/sys/user/${this.formType === 3 ? 'add' : 'update'}`),
                isLoading: true,
                method: 'post',
                data: this.$http.adornData(params)
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.$GlobalApi.alertMsg('成功', `${this.formType === 3 ? '新增成功' : '修改成功'}`, 1, 0)
                  if (this.formType === 3) {
                    this.$http({
                      url: this.$http.adornUrl('/sys/user/get/' + data.id),
                      method: 'get',
                      params: this.$http.adornParams({})
                    }).then(({data}) => {
                      if (data && data.code === 0) {
                        this.formData = data.user
                        this.formType = 1
                      } else {
                        this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
                      }
                    })
                  }
                } else {
                  this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
                }
              })
            } else {
              return false
            }
          })
        }
      },

      upImgSuccess (res, file) {
        if (res && res.code === 0) {
          // this.files += res.files[0].id + ','
          this.formData.avatarUrl = res.url
        } else {
          this.$GlobalApi.alertMsg('错误', `${res.msg}`, 1, 3)
        }
        // this.files = this.files.substring(0, this.files.length - 1)
        this.$GlobalApi.log(this.files)
      },
      beforeUpImg (file) {
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
      upImgError (err, file, fileList) {
        this.formData.avatarUrl = './src/assets/img/img_err.png';
        this.$GlobalApi.log('↓↓↓↓error-S↓↓↓↓')
        this.$GlobalApi.log(err)
        this.$GlobalApi.log('↑↑↑↑error-E↑↑↑↑')
      },
      getUserInfo () {
        //如果数据是相同的则不做处理
        if (this.$route.params.rowId !== '' && this.$route.params.rowId != undefined) {
          this.$http({
            url: this.$http.adornUrl('/sys/user/get/' + this.$route.params.rowId),
            method: 'get',
            params: this.$http.adornParams({})
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data)
              this.formData = data.user
            } else {
              this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  #personnel-detail .el-form-item .el-radio-group {
    vertical-align: baseline !important;
  }

  #personnel-detail .el-form-item >>> .el-form-item__content {
    width: 150px;
  }

  #personnel-detail .title {
    font-size: 15px;
    font-weight: 700;
  }

  .courses >>> .el-form-item__content, .well >>> .el-form-item__content {
    width: auto !important;
    max-width: 990px;
  }

  .honorary >>> .el-form-item__content {
    width: 400px !important;
  }

  .well >>> .el-checkbox-button.is-focus .el-checkbox-button__inner {
    border-color: #dcdfe6;
  }

  .well .well-first {
    border-left: 0 !important;
  }

  .well >>> .el-checkbox-button__inner {
    border-radius: 0;
  }

  .well >>> .el-checkbox-button.is-disabled .el-checkbox-button__inner {
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-left: 0;
    color: #606266;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 0;
  }

  .position >>> .el-form-item__content, .persontype >>> .el-form-item__content {
    width: auto !important;
  }

  .address >>> .el-form-item__content {
    width: 395px !important;
  }
</style>
