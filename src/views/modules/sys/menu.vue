<template>
  <div class="mod-menu" v-loading="dataListLoading" >
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :header-cell-style="$GlobalApi.rowClass"
      border
      stripe
      size="small"
      highlight-current-row
      :data="dataList"
      :height="tableHeight"
      :max-height="tableHeight"
      style="width: 100%;">
      <table-tree-column
        prop="mname"
        treeKey="menuId"
        width="250"
        label="名称">
      </table-tree-column>
      <el-table-column
        prop="parentName"
        width="250"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        width="80"
        label="图标">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column
        prop="mtype"
        width="100"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mtype === 0" size="mini">目录</el-tag>
          <el-tag v-else-if="scope.row.mtype === 1" size="mini" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.mtype === 2" size="mini" type="info">功能</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        width="100"
        label="排序号">
      </el-table-column>
      <el-table-column
        prop="url"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
      <el-table-column
        prop="perms"
        :show-overflow-tooltip="true"
        label="授权标识">
      </el-table-column>
      <el-table-column
        width="100"
        label="是否启用">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isuse == '1' ? 'success':'info'" size="mini" effect="dark">
            {{scope.row.isuse == '1' ? '已启用':'未启用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" class="sd-delcolor" type="text" size="small" @click="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="addOrUpdateHandle()"  v-if="isAuth('sys:menu:add')" icon="el-icon-plus" size="small" type="primary">新增</el-button>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import AddOrUpdate from './menu-add-or-update'

  export default {
    data () {
      return {
        dataForm: {},
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false,
        tableHeight: this.$GlobalApi.getWinHeight() - 180,
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data,"menuId")
          this.$GlobalApi.log(this.dataList)
          this.dataListLoading = false
        })
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
        this.$confirm(`确定对[id=${id}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$GlobalApi.alertMsg('成功', `操作成功`, 1, 0)
              this.getDataList()
            } else {
              this.$GlobalApi.alertMsg('失败', data.msg, 1, 3)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
