<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="账号名称" size="small" @change="getchangeInit" v-model="nickName"/>
        <el-button @click="getDataList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="accountList"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 260"
        @selection-change="selectionChangeHandle"
        border v-loading="accountLoading"
        highlight-current-row
        size="small"
        stripe
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="账号ID"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="帐号名称"
          prop="nickName"
        >
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="userName"
        >
        </el-table-column>
        <el-table-column
          label="岗位名称"
          prop="roleId"
        >
          <template slot-scope="scope">
            <el-tag type="success" effect="dark" size="mini">
              {{scope.row.roleId == 10 ? '管理员' : '运营'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否启用"
          prop="isuse">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isuse === 1 ? 'success' : 'danger'" effect="dark" size="mini">
              {{scope.row.isuse === 1 ? '启用' : '禁用'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="addOrUpdateHandle(scope.row.id)" size="small" type="text"
                      v-if="isAuth('sys:user:update')">编辑
            </el-button>
            <el-button @click="deleteHandle(scope.row.id)" class="sd-delcolor" size="small" type="text"
                       v-if="isAuth('sys:user:delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" size="small" type="primary"
                   v-if="isAuth('sys:user:add')">新增
        </el-button>
        <el-select class="sd-others" placeholder="其他操作" size="small" value="其他操作">
          <el-option :disabled="dataListSelections.length <= 0" @click.native="deleteHandle()"
                     v-if="isAuth('sys:user:delete')" value="批量删除"></el-option>
        </el-select>
      </div>
      <div class="sd-rightpage">
        <pager :current-page="pageIndex" :page-size="pageSize" :total="totalPage"
               @current-change="currentChangeHandle" @handle-size-change="sizeChangeHandle" background/>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update @refreshDataList="getDataList" ref="addOrUpdate" v-if="addOrUpdateVisible"></add-or-update>
    </el-card>
  </div>
</template>

<script>
  import AddOrUpdate from './account-add-or-update'

  export default {
    data () {
      return {
        nickName: '',
        accountLoading:false,
        accountList:[],
        pageIndex: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        totalPage: this.$GlobalApi.Constants.DICT.TOTAL,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      getchangeInit(val){
        if (val === null || val === ''){
          this.getDataList();
        }
      },
      // 获取数据列表
      getDataList () {
        this.accountLoading =true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize,
            'aliasName': this.nickName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.accountList = data.page.list
            this.totalPage = data.page.totalCount
            this.accountLoading =false
          } else {
            this.accountList = []
            this.totalPage = 0
            this.accountLoading =false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var accIds = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${accIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            params: this.$http.adornParams({
              ids: accIds.join(',')
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success("删除成功")
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
