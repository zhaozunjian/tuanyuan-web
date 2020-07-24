<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-input class="sd-input-150" placeholder="用户名称" size="small" v-model="nickName"/>
        <el-input class="sd-input-150" placeholder="手机号" size="small" v-model="phoneNumber"/>
        <el-button @click="userInfo(1)" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="userData"
      :header-cell-style="$GlobalApi.rowClass"
      :max-height="tableHeight"
      border
      highlight-current-row
      id="personnel-table"
      size="small"
      stripe>
      <el-table-column type="selection" width="35"/>
      <el-table-column label="头像" prop="avatarUrl" width="100px">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            popper-class="member-popover"
            trigger="hover">
            <img :src="scope.row.avatarUrl" class="tcimg"/>
            <img :src="scope.row.avatarUrl" class="img" slot="reference"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" prop="id" width="100px"/>
      <el-table-column label="用户名称" prop="nickName"/>
      <el-table-column label="年龄" prop="birthday">
        <template slot-scope="scope">
          <span>{{scope.row.birthday !== null ? $GlobalApi.jsGetAge(scope.row.birthday) : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">{{scope.row.gender === 1 ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column label="手机号码" prop="phoneNumber"/>
      <el-table-column label="用户邀请码" prop="invitationCode">
      </el-table-column>
      <el-table-column label="是否绑定手机号" prop="bindingPhone">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.bindingPhone == 1 ? 'success' : 'danger'" effect="dark" >
            {{scope.row.bindingPhone == 1 ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime"/>
      <el-table-column fixed="right" label="操作" width="150px">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row,1)" size="small" type="text">编辑</el-button>
          <el-button @click="detail(scope.row,2)" size="small" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col class="operation-bottom">
        <el-button @click="detail(null,3)" icon="el-icon-plus" size="small" type="primary">新增</el-button>
        <pager :current-page="page" :page-size="size"
               :total="total"
               @current-change="pesCurrentPage" @handle-size-change="pesPageSize" background/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'user',
    data () {
      return {
        id:'',
        loading: false,
        phoneNumber:'',
        nickName:'',
        userData: [],
        tableHeight: this.$GlobalApi.getWinHeight() - 320,
        permissions: [],//权限

        page: this.$GlobalApi.Constants.DICT.PAGE,
        size: this.$GlobalApi.Constants.DICT.LIMIT,
        total: this.$GlobalApi.Constants.DICT.TOTAL
      }
    },

    activated () {
      this.userInfo()
    },

    methods: {
      detail (row, type) {
        if (type === 2 || type === 1) {
          this.$router.push({name: 'userDetail', params: {rowId: row.id, flag: type}})
        } else if (type === 3) {
          this.$router.push({name: 'userDetail', params: {flag: type}})
        }
      },
      userInfo (type) {
        if (type === 1) {
          this.page = 1
          this.size= 50
        }
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          isLoading: true,
          method: 'get',
          params: this.$http.adornParams({
            page: this.page,
            size: this.size,
            nickName: this.nickName,
            phoneNumber: this.phoneNumber
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userData = data.page.list
            this.total = data.page.totalCount
          } else {
            this.$GlobalApi.alertMsg('错误', `${data.msg}`, 1, 3)
          }
        })
      },
      pesPageSize (val) {
        this.size = val
        this.userInfo()

      },
      pesCurrentPage (val) {
        this.page = val
        this.userInfo()
      }
    }
  }
</script>


