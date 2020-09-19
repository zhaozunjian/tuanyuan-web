<template>
  <div id="my">
    <mt-header fixed title="个人中心"></mt-header>
    <div class="content">
      <div class="user-head">
        <div class="user-img">
          <img src="https://www.xiongcaiyouying.com/images/logo.png" width="60px" height="60px"/>
        </div>
        <div class="right-arrow">
          <span>{{$GlobalApi.getUserInfo().nickName}}</span>
        </div>
      </div>
      <div class="user-option">
        <mt-cell is-link @click.native="updatePasswordHandle">
          <span slot="title">修改密码</span>
        </mt-cell>
        <mt-cell>
          <span slot="title">关于</span>
          <span>当前版本V1.0</span>
        </mt-cell>
      </div>
      <mt-button type="primary" @click.native="logoutHandle">退出登录</mt-button>
    </div>
    <mt-popup v-model="visible" popup-transition="popup-fade" close-on-click-modal="false" style="width: 100%;">
      <div>
        <mt-field label="账号" placeholder="请输入账号" disabled v-model="nickName"></mt-field>
        <mt-field label="原密码" placeholder="请输入原密码" type="password" v-model="password"></mt-field>
        <mt-field label="新密码" placeholder="请输入新密码" type="password" v-model="newPassword"></mt-field>
        <mt-field label="确认密码" placeholder="请输入确认密码" type="password" v-model="confirmPassword"></mt-field>
        <div style="width: 100%;height: 50px;display: flex;justify-content: center;">
          <mt-button size="large" style="width:100px;margin-right: 10px;" @click="visible = false">取消</mt-button>
          <mt-button size="large" style="width:100px;margin-left: 10px;" type="primary" @click.native="dataFormSubmit">确定</mt-button>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
  import { Indicator } from 'mint-ui';
  import {clearLoginInfo} from '@/utils';
  import { MessageBox } from 'mint-ui';
    export default {
      name: "myuser",
      data(){
        return{
          userInfo: {},
          visible: false,
          password: '',
          newPassword: '',
          confirmPassword: '',
        }
      },
      computed: {
        nickName: {
          get () { return this.$GlobalApi.getUserInfo().nickName }
        },
        accId:{
          get () { return this.$GlobalApi.getUserInfo().id }
        }
      },
      mounted(){
        this.userInfo = this.$GlobalApi.getUserInfo()
      },
      methods:{
        dataFormSubmit () {
          if(!this.accId)
            return;
          this.visible = false;
          Indicator.open({
            text: '修改中...',
            spinnerType: 'fading-circle'
          });
          this.$http({
            url: this.$http.adornUrl('/sys/user/password'),
            method: 'post',
            data: this.$http.adornData({
              'userId':this.accId,
              'password': this.password,
              'newPassword': this.newPassword
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              Indicator.close();
              clearLoginInfo()
              this.$router.replace({ name: 'mblogin' })
            }else {
              Indicator.close();
              this.$message.error(data.msg)
            }
          })
        },
        updatePasswordHandle(){
          this.visible = true;
        },
        // 退出
        logoutHandle () {
          MessageBox.confirm(`确定进行[退出]操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.$http({
              url: this.$http.adornUrl('/sys/logout'),
              method: 'post',
              data: this.$http.adornData()
            }).then(({data}) => {
              if (data && data.code === 0) {
                clearLoginInfo()
                this.dictionariesData.clear()
                this.$router.push({name: 'mblogin'})
              }
            })
          }).catch(() => {
          })
        },
      }
    }
</script>

<style scoped>
  .content {
    margin-top: 40px;
    display: flex;
    flex-direction: column;
  }

  .user-head {
    height: 120px;
    width: 100%;
    background-color: #73ccff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-img {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    border: solid #ffffff 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user-option {
    background-color: #dbdbdb;
  }

  .mint-cell {
    min-height: 50px;
  }

  .right-arrow {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 20px;
  }

  .user-option span {
    font-size: 13px;
  }

  .mint-cell:last-child {
    background-position-x: 10px;
  }

</style>
