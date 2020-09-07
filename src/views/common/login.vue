<template>
  <div class="login-container" v-loading="loging">
    <div style="width: 100%;height: 100%;float: left">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-ico
               class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <!--<img class="sd-float yzwl" src="../../assets/img/login/logo.png" alt="">-->
          <div class="totle">团猿后台管理系统</div>
        </div>
        <el-form-item prop="userName" class="sd-pad">
          <el-input class="sd-pad" v-model="dataForm.userName" placeholder="帐号"/>
        </el-form-item>
        <span class="svg-container"><icon-svg name="password"></icon-svg></span>
        <el-form-item prop="password">
          <el-input class="sd-pad" v-model="dataForm.password" type="password" placeholder="密码"/>
        </el-form-item>
        <el-form-item class="sd-pad" prop="captcha">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-input v-model="dataForm.captcha" class="captcha" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="10" class="login-captcha">
            <img :src="captchaPath" @click="getCaptcha()" alt="">
            </el-col>
          </el-row>
        </el-form-item>
        <el-button type="primary" style="width:100%;margin-bottom:30px;" @click="dataFormSubmit()">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getUUID} from '@/utils'
  export default {
    data() {
      return {
        loging:false,
        dataForm: {
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: '',
        ismessage:'',
        captchflag:false
      }
    },
    created() {
      this.dictionariesData.clear()
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.loging = true
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'passport': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dictionariesData.set('userInfo', data.account)
                this.$cookie.set('token', data.token)
                this.getMessage()
                this.$router.replace({name: 'report-GeneralSituation'})
                this.loging = false
              } else {
                this.loging = false
                this.getCaptcha()
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha() {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.dataForm.uuid}`)
      },
      getMessage(){
        this.$http({
          url: this.$http.adornUrl('/message/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            localStorage.setItem("messageInfo", JSON.stringify(data.vo))
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $bg2: #283443;
  $col: #fff;
  .sd-pad > .el-input__inner, .captcha > .el-input__inner{
     padding:0 30px!important;
     background-color:$bg2 ;
     color: $col;
   }
  .el-row{
    margin-top: 16px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  $dark_gray: #889aa4;
  $light_gray: #889aa4;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-image: url("../../assets/img/login/login_bg.png");
    .login-form {
      width: 520px;
      max-width: 100%;
      padding: 120px 35px 15px 35px;
      margin: auto;
    }
    .svg-container {
      position: relative;
      top: 29px;
      left: 10px;
      z-index: 9999;
      color: $dark_gray;
      vertical-align: middle;
      display: inline;
    }
    .title-container {
      position: relative;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }

  .sd-float {
    float: left;
    width: 50%;
    height: 50%;
  }

  .totle {
    clear: both;
    font-size: xx-large;
    color: white;
    padding-bottom: 80px;
    text-align: center;
  }

  .yzwl {
    position: relative;
    left: 24%;
    margin: 10% 0;
  }

  .login-captcha {
    overflow: hidden;
     img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    margin-top: 38px;
  }

</style>
