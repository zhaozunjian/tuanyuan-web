<template>
  <div>
    <el-dialog
      :title="!isEdit ? '新增' : '修改'"
      :close-on-click-modal="false"
      width="30%"
      @close="$refs['dataForm'].resetFields()"
      :visible.sync="visibleFlag">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="sd-form" @keyup.enter.native="dataFormSubmit()"
               label-width="100px">
        <el-form-item label="帐号" prop="passport">
          <el-input v-model="dataForm.passport" placeholder="登录帐号建议使用熟悉的邮箱帐号" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="dataForm.pwd" placeholder="请输入密码" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="用户" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="用户" @focus="coachDialog = true"></el-input>
        </el-form-item>
        <el-form-item label="管理员" size="mini" prop="adminlv">
            <el-switch :active-value="1" :inactive-value="0" v-model="dataForm.adminlv"></el-switch>
        </el-form-item>
        <el-form-item label="是否启用" size="mini" prop="status">
            <el-switch :active-value="1" :inactive-value="0" v-model="dataForm.isuse"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visibleFlag = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
    <select-users :visible.sync="coachDialog" @selected="selectedUser" />
  </div>
</template>
<script>
  export default {
    data() {
      var validatePassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else {
          callback()
        }
      }
      return {
        coachDialog:false,
        visibleFlag: false,
        acctypes: [{code: '1', name: '外部用户'},
          {code: '0', name: '内部用户'}],
        dataForm: {
          accId: '',
          userId: '',
          passport: '',
          adminlv: 0,
          isuse: 1,
          pwd: '',
          userName: ''
        },
        dataRule: {
          userName: [
            {required: true, trigger: 'submit'}
          ],
          pwd: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          passport: [
            {required: true, trigger: 'blur'},
          ]
        },
        isEdit: true
      }
    },
    created() {

    },
    methods: {
      selectedUser(data){
        if (null != data){
          this.dataForm.userId = data[0].id
          this.dataForm.userName = data[0].nickName
        }
      },
      init(id) {
        console.log(id)
        this.dataForm.accId = id || ''
        if (!id) {
          this.isEdit = false
        } else {
          this.isEdit = true
        }
        if (this.isEdit) {
          this.$http({
            url: this.$http.adornUrl(`/sys/account/get/${this.dataForm.accId}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.accId = data.account.accId
              this.dataForm.userId = data.account.userId
              this.dataForm.userName = data.account.userName
              this.dataForm.pwd = data.account.pwd
              this.dataForm.passport = data.account.passport
              this.dataForm.adminlv = data.account.adminlv
              this.dataForm.isuse = data.account.isuse
            } else {
              this.$GlobalApi.alertMsg("错误", `${data.msg}`, 1, 3);
            }
          })
        }
        this.visibleFlag = true
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/sys/account/${this.isEdit ? 'update' : 'add'}`),
              method: 'post',
              data: this.$http.adornData({
                'accId': this.dataForm.accId,
                'userId': this.dataForm.userId,
                'userName': this.dataForm.userName,
                'adminlv': this.dataForm.adminlv,
                'pwd': this.dataForm.pwd,
                'passport': this.dataForm.passport,
                'isuse': this.dataForm.isuse
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (!this.isEdit) {
                  this.$GlobalApi.alertMsg('成功', '新增成功', 1, 0)
                } else {
                  this.$GlobalApi.alertMsg('成功', '修改成功', 1, 0)
                }
                this.visibleFlag = false
                this.$emit('refreshDataList')
              } else {
                this.$GlobalApi.alertMsg("错误", `${data.msg}`, 1, 3);
              }
            })
          }
        })
      }
    }
  }
</script>
