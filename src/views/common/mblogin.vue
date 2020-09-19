<template>
  <div class="mblogin">
    <div>
      <mt-field v-model="userName" placeholder="帐号"/>
      <mt-field v-model="password" placeholder="密码"/>
      <mt-field v-model="captcha" placeholder="验证码">
        <img :src="captchaPath" @click="getCaptcha()" alt="" height="45px" width="100px">
      </mt-field>
      <mt-button type="primary" style="width:100%;margin-bottom:30px;margin-top: 20px;" @click.native="dataFormSubmit()">登录</mt-button>
    </div>
  </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  import {getUUID} from '@/utils';
  export default {
    data() {
      return {
        userName: '',
        password: '',
        uuid: '',
        captcha: '',
        captchaPath: '',
        ismessage:'',
        captchflag:false
      }
    },
    created() {
      this.getCaptcha()
    },
    methods: {
      // 提交表单
      dataFormSubmit() {
        Indicator.open({
          text: '登录中...',
          spinnerType: 'fading-circle'
        });
        this.$http({
          url: this.$http.adornUrl('/sys/login'),
          method: 'post',
          data: this.$http.adornData({
            'passport': this.userName,
            'password': this.password,
            'uuid': this.uuid,
            'captcha': this.captcha,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dictionariesData.set('userInfo', data.account)
            this.$cookie.set('token', data.token)
            this.$router.push({name: 'mbmain'})
            Indicator.close();
          } else {
            Indicator.close();
            this.getCaptcha()
            this.$message.error(data.msg)
          }
        })
      },
      // 获取验证码
      getCaptcha() {
        this.uuid = getUUID()
        this.captchaPath = this.$http.adornUrl(`/captcha.jpg?uuid=${this.uuid}`)
      }
    }
  }
</script>
<style scoped>
  .mblogin{
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../../assets/img/login/login_bg.png") no-repeat;
    overflow: hidden;
    background-size:cover;
  }
  .mblogin div{
    margin-top: 50%;
  }

</style>
