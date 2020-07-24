<template>
  <el-dialog
    :close-on-click-modal="false"
    width="30%"
    title="修改密码"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form class="sd-form dialog-form"
             label-width="110px"
             size="small"
             label-position="right"
             :model="dataForm"
             :rules="dataRule"
             v-loading="vloading"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()" >
      <el-form-item label="账号" >
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password" >
        <el-input type="password" clearable v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword" >
        <el-input type="password" clearable v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" >
        <el-input type="password" clearable v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      var validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          callback(new Error('确认密码与新密码不一致'))
        } else {
          callback()
        }
      }
      return {
        vloading:false,//加载
        visible: false,
        dataForm: {
          password: '',
          newPassword: '',
          confirmPassword: ''
        },
        dataRule: {
          password: [
            { required: true, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, validator: validateConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      userName: {
        get () { return this.$GlobalApi.getUserInfo().passport }
      },
      accId:{
        get () { return this.$GlobalApi.getUserInfo().accId }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      }
    },
    methods: {
      // 初始化
      init () {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if(!this.accId)
              return;

            this.vloading = true
            this.$http({
              url: this.$http.adornUrl('/sys/account/password'),
              method: 'post',
              data: this.$http.adornData({
                'accId':this.accId,
                'password': this.dataForm.password,
                'newPassword': this.dataForm.newPassword
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(() => {
                      this.mainTabs = []
                      clearLoginInfo()
                      this.$router.replace({ name: 'login' })
                    })
                  }
                })
              } else {
                this.$GlobalApi.alertMsg("错误",`${data.msg}`,1,3);
              }
              this.vloading = false
            }).catch(e => {
              this.vloading = false
              this.$GlobalApi.alertMsg("错误",`修改失败：${e}`,1,3);
            })
          }
        })
      }
    }
  }
</script>

