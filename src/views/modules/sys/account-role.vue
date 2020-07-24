<template>
  <el-card body-style="padding:10px;" id="dept-card" shadow="never" style="height:100%;overflow-y:auto">
    <div id="dept-personnel">
      <el-card body-style="height:100%;padding:0px;overflow-y:auto" class="dept-tree" shadow="never">
        <el-table border :header-cell-style="$GlobalApi.rowClass" :cell-style="$GlobalApi.cellClassNoEdit"
          ref="menuListTree"
          :data="deptData"
          highlight-current-row
          @current-change="handleCurrentChange">
          <el-table-column
            property="roleId"
            label="岗位编号">
          </el-table-column>
          <el-table-column
            property="roleName"
            label="岗位名称">
          </el-table-column>
        </el-table>
      </el-card>
      <el-card :body-style="bodyStyle" class="dept-container" shadow="never">
        <el-table
          :cell-style="$GlobalApi.cellClass"
          :data="userData"
          :header-cell-style="$GlobalApi.rowClass"
          :height="tableHeight"
          :max-height="tableHeight"
          border
          highlight-current-row
          id="dept-personnel-table"
          size="small"
          stripe>
          <el-table-column label="用户编号" prop="userId"/>
          <el-table-column label="用户名称" prop="userName"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100px">
            <template slot-scope="scope">
              <!--<el-button @click="editData(scope.row.ouid,2)" size="small" type="text">修改</el-button>-->
              <el-button @click="deleteData(scope.row.accountRoleId)" class="sd-delcolor" size="small" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col class="operation-bottom">
            <el-button @click="viewDialog()" icon="el-icon-plus" size="small" type="primary">新增</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div>
      <el-dialog
        :close-on-click-modal="false"
        :visible.sync="deptDialog"
        @close="dialogClose"
        class="dept-dialog"
        top="5vh"
        width="30%">
        <h3 slot="title" style="margin:0px">新增</h3>
        <el-form :model="formData"
                 :rules="rule" label-position="right" label-width="110px"
                 ref="formData" size="small" style="padding-right: 6%">
          <el-form-item label="用户编号" prop="userId">
            <el-input disabled placeholder="用户编号" size="small" v-model="formData.userId"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input @focus="codeDialog1 = true" placeholder="用户名称" size="small" v-model="formData.userName"></el-input>
          </el-form-item>
          <el-form-item label="岗位名称" prop="roleName">
            <el-input disabled placeholder="岗位名称" size="small" v-model="formData.roleName"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: right">
          <el-button @click="deptDialog = false" plain>取消</el-button>
          <el-button @click="confirm" type="primary">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <select-users :visible.sync="codeDialog1" @selected="setUser($event)"></select-users>
  </el-card>
</template>

<script>

  export default {
    name: 'account-role',
    data () {
      return {
        tableHeight: this.$GlobalApi.getWinHeight() - 240,
        codeDialog1: false,
        deptDialog: false,
        currentPage: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        userData: [],//人员数据
        formData: {
          accountRoleId: '',
          userId: '',
          userName: '',
          roleId: '',
          roleName: ''
        },
        rule: {
          userName: [{required: true, message: '请选择用户', trigger: 'blur'}]
        },
        deptData: [],//部门数据
      }
    },
    methods: {
      setUser (data) {
        if (null != data){
          this.formData.userId = data[0].id
          this.formData.userName = data[0].nickName
        }
      },
      async deleteData(val){
        let type = await this.$GlobalApi.confirmMsg('此操作将永久删除当前记录, 是否继续?', '提示', 1)
        if (type == true) {
          this.$http({
            url: this.$http.adornUrl(`/sys/account/role/delete`),
            method: 'post',
            params: this.$http.adornParams({
              id: val
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$GlobalApi.alertMsg('成功', '删除成功', 1, 0)
              this.getRoleInfo(this.formData.roleId)
            } else {
              this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
            }
          })
        } else {
          this.$GlobalApi.alertMsg('提示', '已取消删除', 1, 1)
        }
      },
      viewDialog () {
        this.deptDialog = true
      },
      dialogClose () {
        this.formData.userId = ''
        this.formData.userName = ''
      },
      confirm () {
        this.$refs['formData'].validate(value => {
          if (value) {
            this.$http({
              url: this.$http.adornUrl(`/sys/account/role/add`),
              method: 'post',
              data: this.$http.adornData({
                userId: this.formData.userId,
                roleId: this.formData.roleId,
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$GlobalApi.alertMsg('提示', '新增成功', 1, 0)
                this.getRoleInfo(this.formData.roleId)
              } else {
                this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
              }
            })
            this.deptDialog = false
          }
        })
      },
      dept () {
        this.$http({
          url: this.$http.adornUrl('/sys/role/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.deptData = data.info
          } else {
            this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
          }
        })
      },
      getRoleInfo (roleId) {
        this.$http({
          url: this.$http.adornUrl('/sys/account/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            roleId:roleId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userData = data.list
          } else {
            this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
          }
        })
      },
      //岗位点击事件
      handleCurrentChange(val) {
        this.formData.roleId = val.roleId
        this.formData.roleName = val.roleName
        this.getRoleInfo(val.roleId);
      }
    },
    mounted () {
      this.dept()
    },
    computed: {
      bodyStyle () {
        return {
          padding: '10px',
          height: '100%',
          overflowY: 'auto'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  #dept-personnel {
    display: flex;
    height: 100%;

    .dept-tree {
      vertical-align: top;
      width: 40%;

      .el-table::before {
        background-color: transparent;
      }
    }

    .dept-container {
      margin-left: 5px;
      width: 60%;
      height: 100%;
    }

    .dept-node {
      display: inline-flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }

  }
</style>
