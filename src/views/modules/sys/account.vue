<template>
  <div class="mod-user">
    <el-card body-style="padding:10px" class="box-card" shadow="never">
      <div slot="header">
        <el-input class="sd-input-150" clearable placeholder="帐号" size="small" v-model="dataForm.passport"/>
        <el-button @click="getDataList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
        </el-button>
      </div>
      <el-table
        :cell-style="$GlobalApi.cellClass"
        :data="accountList"
        :header-cell-style="$GlobalApi.rowClass"
        :height="$GlobalApi.getWinHeight() - 260"
        @selection-change="selectionChangeHandle"
        border
        highlight-current-row
        size="small"
        stripe
        style="width: 100%;">
        <el-table-column
          type="selection"
          width="50">
        </el-table-column>
        <el-table-column
          label="用户ID"
          prop="accId"
        ></el-table-column>
        <el-table-column
          label="用户帐号"
          prop="passport"
        >
        </el-table-column>
        <el-table-column
          label="用户姓名"
          prop="userName"
        >
        </el-table-column>
        <el-table-column
          label="帐号级别"
          prop="adminlv"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.adminlv == 1 ? 'success' : 'warning'" effect="dark" size="mini">
              {{scope.row.adminlv == 1 ? '管理员' : '普通用户'}}
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
          fixed="right"
          label="操作"
          width="160">
          <template slot-scope="scope">
            <el-button @click="addOrUpdateHandle(scope.row.accId)" size="small" type="text"
                       v-if="isAuth('sys:account:update')">编辑
            </el-button>
            <el-button @click="deleteHandle(scope.row.accId)" class="sd-delcolor" size="small" type="text"
                       v-if="isAuth('sys:account:delete')">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sd-leftbutton">
        <el-button @click="addOrUpdateHandle()" icon="el-icon-plus" size="small" type="primary"
                   v-if="isAuth('sys:account:add')">新增
        </el-button>
        <el-select class="sd-others" placeholder="其他操作" size="small" value="其他操作">
          <el-option :disabled="dataListSelections.length <= 0" @click.native="deleteHandle()"
                     v-if="isAuth('sys:account:delete')" value="批量删除"></el-option>
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
        dataForm: {
          passport: '',
        },
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
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/account/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize,
            'passport': this.dataForm.passport
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.accountList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.accountList = []
            this.totalPage = 0
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
          return item.accId
        })
        this.$confirm(`确定对[id=${accIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/account/delete/'+ accIds.join(',')),
            method: 'post',
            data: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$GlobalApi.alertMsg('成功', '删除成功', 1, 0)
              this.getDataList()
            } else {
              this.$GlobalApi.alertMsg("错误",`${data.msg}`,1,3);
            }
          })
        })
      }
    }
  }
</script>
