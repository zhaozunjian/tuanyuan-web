<template>
  <div class="login-container">
    <div style="width: 100%;height: 100%;">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-ico
               class="login-form" auto-complete="on" label-position="left">
        <div class="title-container">
          <img class="sd-float yzwl" src="../../assets/img/login/logo.png" alt="">
          <div class="sd-clear"></div>
        </div>
        <span class="svg-container"><icon-svg name="user"></icon-svg></span>
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
      var checkCaptch = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }
        setTimeout(() => {
          this.getCapcthVali();
          console.log(this.captchflag)
          if (this.captchflag) {
            callback();
          } else {
            callback(new Error("验证码不正确"));
          }
        }, 1000);
      };
      return {
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
            {validator: checkCaptch,trigger: 'blur'}
          ]
        },
        captchaPath: '',
        ismessage:'',
        captchflag:false
      }
    },
    created() {
      this.getCaptcha()
    },
    methods: {
      getCapcthVali(){
        this.$http({
          url: this.$http.adornUrl('/sys/verification'),
          method: 'post',
          params: this.$http.adornParams({
            'uuid': this.dataForm.uuid,
            'code':this.dataForm.captcha,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.captchflag = true
          } else {
            this.captchflag = false
            this.getCaptcha()
          }
        })
      },
      // 提交表单
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/sys/login'),
              method: 'post',
              data: this.$http.adornData({
                'passport': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dictionariesData.set('userInfo', data.account)
                this.$cookie.set('token', data.token)
                this.$router.replace({name: 'home-homepage'})
              } else {
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
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #889aa4;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      width: 520px;
      max-width: 100%;
      padding: 35px 35px 15px 35px;
      margin: auto;
    }
    .svg-container {
      position: relative;
      top: 29px;
      left: 10px;
      z-index: 9999;
      /*padding: 6px 5px 6px 15px;*/
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

  .sd-clear {
    clear: both;
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
