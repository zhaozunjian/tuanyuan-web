<template>
  <el-card>
    <div slot="header">
      <el-input class="sd-input-150" clearable placeholder="昵称" size="small" v-model="searchContent"/>
      <el-button @click="getUserList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
    </div>
    <el-tabs v-model="searchType" @tab-click="swithcTab()"  type="card">
      <el-tab-pane label="普通用户" name="1"></el-tab-pane>
      <el-tab-pane label="附加信息用户" name="2"></el-tab-pane>
    </el-tabs>
    <el-table :data="userList" :cell-style="$GlobalApi.cellClass"
              :header-cell-style="$GlobalApi.rowClass"
              :height="tableHeight" v-loading="userLoding"
              border
              highlight-current-row
              size="small"
              stripe>
      <el-table-column label="昵称" prop="nickName"></el-table-column>
      <el-table-column label="别称备注" prop="aliasName"></el-table-column>
      <el-table-column label="手机号码" prop="phoneNumber"></el-table-column>
      <el-table-column label="邀请码" prop="invitationCode"></el-table-column>
      <el-table-column prop="createTime" label="注册时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="禁封状态" prop="isDisable">
        <template slot-scope="scope">
          <div>{{scope.row.isDisable == 0 ? '正常':'禁用'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="下线粉丝数量" prop="subordinateCount"></el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="handleUsersAdditional(scope.row)">附加信息编辑</el-button>
          <el-button size="small" type="text" @click="handleSwitchDisable(scope.row)">切换禁用</el-button>
          <el-button v-if="searchType == '2'" size="small" type="text" @click="submitUsersAdditionalRemove(scope.row)">删除附加信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog class="code-dialog" width="35%" title="修改附加信息" :visible.sync="updateUsersAdditionalDialogFormVisible">
      <el-form class="sd-form" label-position="right" label-width="110px" size="small" style="padding-right: 6%" ref="takeCutBusinessCommodityForm" :model="usersAdditionalForm">
        <el-form-item label="选择的用户">
          <el-input v-model="nickName" disabled></el-input>
        </el-form-item>
        <el-form-item label="别称备注">
          <el-input v-model="usersAdditionalForm.aliasName" ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" plain @click="updateUsersAdditionalDialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="submitUsersAdditionalUpdate(usersAdditionalForm)">确认修改</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    data(){
      return{
        userLoding:false,
        searchType: "1",
        searchContent:'',
        userList: [],
        tableHeight: this.$GlobalApi.getWinHeight() - 320,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        updateUsersAdditionalDialogFormVisible: false,
        nickName:'',
        usersAdditionalForm: {
          usersId: '',
          aliasName: ''
        }
      }
    },
    mounted() {
      this.getUserList()
    },
    methods: {
      getUserList() {
        this.userLoding = true
        this.$http({
          url: this.$http.adornUrl('/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.currentPage,
            size: this.pageSize,
            aliasName: this.searchContent,
            searchType: this.searchType
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userList = data.page.list;
            this.total = data.page.totalCount;
            this.userLoding = false
          } else {
            this.userLoding = false
            this.$message.error(data.msg)
          }
        })
      },
      // 切换分页
      handleCurrentChange(val) {
        this.currentPage = val
        this.getUserList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getUserList()
      },
      handleSwitchDisable(row) {
        this.$confirm(`确认切换禁用昵称名为${row.nickName}的平台用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/user/switchDisable'),
            method: 'get',
            params: this.$http.adornParams({
              usersId: row.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getUserList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleUsersAdditional(row) {
        this.nickName = row.nickName
        this.$http({
          url: this.$http.adornUrl('/usersAdditional/info'),
          method: 'get',
          params: this.$http.adornParams({
            usersId: row.id
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.usersAdditionalForm = data.result
            this.updateUsersAdditionalDialogFormVisible = true
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      submitUsersAdditionalUpdate() {
        this.$http({
          url: this.$http.adornUrl('/usersAdditional/update'),
          method: 'post',
          params: this.$http.adornParams({
            usersId: this.usersAdditionalForm.usersId,
            aliasName: this.usersAdditionalForm.aliasName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.updateUsersAdditionalDialogFormVisible = false
            this.$message.success('修改成功');
            Object.assign(this.usersAdditionalForm, this.$options.data().usersAdditionalForm)
            this.getUserList()
          } else {
            this.$message.error(data.msg)
          }
        })

      },
      submitUsersAdditionalRemove(row) {
        this.$confirm('删除该用户的附加信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          this.$http({
            url: this.$http.adornUrl('/usersAdditional/remove'),
            method: 'get',
            params: this.$http.adornParams({
              usersId: row.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              Object.assign(this.usersAdditionalForm, this.$options.data().usersAdditionalForm)
              this.$message.success('删除成功');
              this.getUserList()
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      swithcTab() {
        this.currentPage = 1
        this.pageSize = 10
        this.searchContent = ''
        this.getUserList()
      },
    }
  }
</script>
