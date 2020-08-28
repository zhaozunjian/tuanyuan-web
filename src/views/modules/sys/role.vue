<template>
  <div class="mod-role">
    <el-card class="box-card" shadow="never" body-style="padding:10px">
      <div slot="header">
            <el-input v-model="roleName" @change="getchangeInit" size="small" class="sd-input-150" placeholder="岗位名称" clearable></el-input>
            <el-button @click="getDataList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>

    <el-table
      size="small"
      border
      stripe
      :height="$GlobalApi.getWinHeight() - 260"
      highlight-current-row
      :header-cell-style="$GlobalApi.rowClass"
      :cell-style="$GlobalApi.cellClass"
      :data="dataList"
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="roleId"
        width="140px"
        label="岗位编号">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="岗位名称">
      </el-table-column>
      <el-table-column
        prop="isuse"
        label="是否启用">
        <template slot-scope="scope" >
          <el-tag size="mini" :type="scope.row.isuse == 1 ? 'success' : 'danger'" effect="dark" >
            {{scope.row.isuse == 1 ? '启用' : '禁用'}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="inputter"
        label="录入人">
      </el-table-column>
      <el-table-column
        prop="inputtime"
        label="录入时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
          <!--<el-button v-if="isAuth('sys:role:delete')" type="text" size="small" class="sd-delcolor" @click="deleteHandle(scope.row.roleId)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="sd-leftbutton">-->
      <!--<el-button @click="addOrUpdateHandle()" size="small" icon="el-icon-plus" type="primary" v-if="isAuth('sys:role:add')">新增</el-button>-->
      <!--<el-select class="sd-others" placeholder="其他操作" size="small" value="其他操作">-->
        <!--<el-option @click.native="deleteHandle()" :disabled="dataListSelections.length <= 0" v-if="isAuth('sys:role:delete')" value="批量删除"></el-option>-->
      <!--</el-select>-->
    <!--</div>-->
    <div class="sd-rightpage">
      <pager :current-page="pageIndex" :page-size="pageSize" :total="totalPage"
             @current-change="currentChangeHandle" @handle-size-change="sizeChangeHandle" background/>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </el-card>
  </div>
</template>

<script>
  import AddOrUpdate from './role-add-or-update'
  export default {
    data () {
      return {
        demAddDel:false,
        // demDataForm:{
        //   id:''
        // },
        roleName: '',
        departmentData:[],
        dataList: [],
        pageIndex: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        totalPage: this.$GlobalApi.Constants.DICT.TOTAL,
        dataListLoading: false,
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/role/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize,
            'roleName': this.roleName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.$message.error(data.msg)
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
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
      async  deleteHandle (id) {
        var ids = id ? id : this.dataListSelections.map(item => {
          return item.roleId
        })
        if (!id){
          ids = ids.join(',')
        }
        let type = await this.$GlobalApi.confirmMsg('此操作将永久删除当前记录, 是否继续?', '提示', 1)
        if (type === true){
          this.$http({
            url: this.$http.adornUrl('/sys/role/delete'),
            method: 'post',
            params: this.$http.adornParams({roleIds:ids})
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success("删除成功")
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else if (type === false) {
          this.$message.warning("已取消")
        }
      }
    }
  }
</script>
