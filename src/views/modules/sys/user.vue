<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-input class="sd-input-150" clearable placeholder="用户名称" size="small" v-model="nickName"/>
        <el-input class="sd-input-150" clearable placeholder="手机号" size="small" v-model="phoneNumber"/>
        <el-select size="small" clearable v-model="userType" placeholder="用户类型" class="sd-width-150">
          <el-option v-for="item in userTypeArr" :key="item.code" :label="item.name" :value="item.code"/>
        </el-select>
        <el-button @click="userInfo(1)" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="userData" v-loading="userLoading"
      :header-cell-style="$GlobalApi.rowClass"
      :height="tableHeight"
      border
      highlight-current-row @selection-change="selectionChangeHandle"
      size="small"
      stripe>
      <el-table-column type="selection" width="50"/>
      <el-table-column label="头像" prop="avatarUrl" width="100px">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            popper-class="member-popover"
            trigger="hover">
            <img :src="imageServerUrl + scope.row.avatarUrl" class="tcimg"/>
            <img :src="imageServerUrl + scope.row.avatarUrl" class="img" slot="reference"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" prop="id" width="150px"/>
      <el-table-column label="用户名称" prop="nickName"/>
      <el-table-column label="年龄" prop="birthday">
        <template slot-scope="scope">
          <span>{{scope.row.birthday !== null ? $GlobalApi.jsGetAge(scope.row.birthday) : '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="gender">
        <template slot-scope="scope">{{scope.row.gender === 1 ? '男' : '女' }}</template>
      </el-table-column>
      <el-table-column label="手机号码" prop="phoneNumber" width="120px"/>
      <el-table-column label="用户类型" prop="userType" width="100px">
        <template slot-scope="scope">
          {{scope.row.userType === '10' ? '管理' : '运营'}}
        </template>
      </el-table-column>
      <el-table-column label="用户邀请码" prop="invitationCode" width="120px"/>
      <el-table-column label="是否绑定手机号" prop="bindingPhone" width="120px">
        <template slot-scope="scope">
          <el-tag size="mini" :type="scope.row.bindingPhone == 1 ? 'success' : 'danger'" effect="dark" >
            {{scope.row.bindingPhone == 1 ? '是' : '否'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="150px"/>
      <el-table-column fixed="right" label="操作" width="120px">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row,1)" size="small" type="text">编辑</el-button>
          <el-button @click="detail(scope.row,2)" size="small" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="detail(null,3)" icon="el-icon-plus" size="small" type="primary"
                 >新增
      </el-button>
      <el-select class="sd-others" placeholder="其他操作" size="small" value="其他操作">
        <el-option :disabled="dataListSelections.length <= 0" @click.native="deleteHandle()"
                    value="批量删除"></el-option>
      </el-select>
    </div>
    <div class="sd-rightpage">
      <pager :current-page="page" :page-size="size" :total="total"
             @current-change="pesCurrentPage" @handle-size-change="pesPageSize" background/>
    </div>
  </el-card>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";

  export default {
    name: 'user',
    data () {
      return {
        imageServerUrl: SERVER_CONSTANT.imageServerUrl,
        dataListSelections:[],
        id:'',
        loading: false,
        phoneNumber:'',
        userType:'',
        userTypeArr:[{
          code:'10',
          name:'管理'
        },{
          code:'20',
          name:'运营'
        }],
        nickName:'',
        userData: [],
        tableHeight: this.$GlobalApi.getWinHeight() - 280,
        permissions: [],//权限
        userLoading:false,

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
      async deleteHandle () {
        var ids = this.dataListSelections.map(item => {
          return item.id
        })
        let type = await this.$GlobalApi.confirmMsg('此操作将永久删除当前记录, 是否继续?', '提示', 1)
        if (type === true){
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            params: this.$http.adornParams({ids:ids.join(',')})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success("删除成功")
              this.userInfo();
            } else {
              this.$message.error(data.msg)
            }
          })
        } else if (type === false) {
          this.$message.warning("已取消删除")
        }
      },
      userInfo (type) {
        if (type === 1) {
          this.page = 1
          this.size= 50
        }
        this.userLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          isLoading: true,
          method: 'get',
          params: this.$http.adornParams({
            page: this.page,
            size: this.size,
            nickName: this.nickName,
            phoneNumber: this.phoneNumber,
            userType: this.userType
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.userData = data.page.list
            this.total = data.page.totalCount
            this.userLoading = false
          } else {
            this.$message.error(data.msg)
            this.userLoading = false
          }
        })
      },
      selectionChangeHandle (val) {
        this.dataListSelections = val
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


