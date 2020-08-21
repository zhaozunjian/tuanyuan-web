<template>
  <div>
    <el-dialog
      :title="!isEdit ? '新增' : '修改'"
      :close-on-click-modal="false"
      width="30%"
      @close="$refs['dataForm'].resetFields()"
      :visible.sync="visibleFlag">
      <el-form :model="dataForm" size="small" :rules="dataRule" ref="dataForm" class="sd-form" @keyup.enter.native="dataFormSubmit()"
               label-width="100px">
        <el-form-item label="帐号" prop="nickName">
          <el-input v-model="dataForm.nickName" placeholder="登录帐号" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="dataForm.pwd" placeholder="请输入密码" maxlength="16"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="roleId">
          <el-radio-group v-model="dataForm.roleId">
            <el-radio :label="10">管理</el-radio>
            <el-radio :label="20">运营</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用" size="mini" prop="isuse">
            <el-switch :active-value="1" :inactive-value="0" v-model="dataForm.isuse"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visibleFlag = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
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
        dataForm: {
          id: '',
          nickName: '',
          roleId: 10,
          isuse: 1,
          pwd: ''
        },
        dataRule: {
          roleId: [
            {required: true, trigger: 'blur'}
          ],
          pwd: [
            {validator: validatePassword, trigger: 'blur'}
          ],
          nickName: [
            {required: true, trigger: 'blur'},
          ],
          userName: [
            {required: true, trigger: 'blur'},
          ]
        },
        roleList:[],
        isEdit: true
      }
    },
    created() {
      // this.getInit();
    },
    methods: {
      // getInit(){
      //   this.$http({
      //     url: this.$http.adornUrl(`/sys/role/dic`),
      //     method: 'get',
      //     params: this.$http.adornParams()
      //   }).then(({data}) => {
      //     if (data && data.code === 0) {
      //       this.roleList = data.info.list
      //     } else {
      //       this.$message.error(data.msg)
      //     }
      //   })
      // },
      init(id) {
        this.dataForm.id = id || ''
        if (!id) {
          this.isEdit = false
        } else {
          this.isEdit = true
        }
        if (this.isEdit) {
          this.$http({
            url: this.$http.adornUrl(`/sys/user/get/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm = data.user
              this.dataForm.pwd = ''
            } else {
              this.$message.error(data.msg)
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
              url: this.$http.adornUrl(`/sys/user/${this.isEdit ? 'update' : 'add'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id,
                'roleId': this.dataForm.roleId,
                'nickName': this.dataForm.nickName,
                'userName': this.dataForm.userName,
                'pwd': this.dataForm.pwd,
                'isuse': this.dataForm.isuse
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                if (!this.isEdit) {
                  this.$message.success("新增成功")
                } else {
                  this.$message.success("修改成功")
                }
                this.visibleFlag = false
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
