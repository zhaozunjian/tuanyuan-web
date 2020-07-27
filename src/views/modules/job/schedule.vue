<template>
  <div class="mod-schedule">
    <el-card class="box-card" shadow="never" body-style="padding:10px">
      <div slot="header">
        <el-input placeholder="bean名称" clearable size="small" class="sd-input-150" v-model="dataForm.beanName"/>
        <el-input placeholder="方法名称" clearable size="small" class="sd-input-150" v-model="dataForm.methodName"/>
        <el-button @click="getDataList()" size="small" type="primary" class="sd-mag-l-10" icon="el-icon-search">查询</el-button>
  </div>
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-table
      :height="$GlobalApi.getWinHeight() - 260"
      stripe
      :header-cell-style="$GlobalApi.rowClass"
      :cell-style="$GlobalApi.cellClass"
      border
      highlight-current-row
      size="small"
      :data="dataList"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column
        prop="jobId"
        width="80"
        label="任务编号">
      </el-table-column>
      <el-table-column
        prop="beanName"
        label="bean名称">
      </el-table-column>
      <el-table-column
        prop="methodName"
        label="方法名称">
      </el-table-column>
      <el-table-column
        prop="params"
        label="参数">
      </el-table-column>
      <el-table-column
        prop="cronExpression"
        label="cron表达式">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="80px">
        <template slot-scope="scope">
          <el-switch :active-value="1" disabled :inactive-value="0" v-model="scope.row.status"></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="250"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:schedule:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.jobId)">修改</el-button>
          <el-button v-if="isAuth('sys:schedule:delete')" class="sd-delcolor" type="text" size="small" @click="deleteHandle(scope.row.jobId)">删除</el-button>
          <el-button v-if="isAuth('sys:schedule:pause')" type="text" style="color:#909399;" size="small" @click="pauseHandle(scope.row.jobId)">暂停</el-button>
          <el-button v-if="isAuth('sys:schedule:resume')" type="text" size="small" @click="resumeHandle(scope.row.jobId)">启动</el-button>
          <el-button v-if="isAuth('sys:schedule:run')" type="text" size="small" style="color:#67C23A;" @click="runHandle(scope.row.jobId)">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-leftbutton">
      <el-button @click="addOrUpdateHandle()"  v-if="isAuth('sys:schedule:save')" icon="el-icon-plus" size="small" type="primary">新增</el-button>
      <el-button @click="logHandle()"  v-if="isAuth('sys:schedule:log')" size="small" type="warning">日志列表</el-button>
      <el-select class="sd-others" placeholder="其他操作" size="small" value="其他操作">
        <el-option v-if="isAuth('sys:schedule:delete')" :disabled="dataListSelections.length <= 0" @click.native="deleteHandle()" value="批量删除"></el-option>
        <el-option v-if="isAuth('sys:schedule:pause')" :disabled="dataListSelections.length <= 0"  @click.native="pauseHandle()" value="批量暂停"></el-option>
        <el-option v-if="isAuth('sys:schedule:resume')" :disabled="dataListSelections.length <= 0" @click.native="resumeHandle()" value="批量恢复"></el-option>
        <el-option v-if="isAuth('sys:schedule:run')" :disabled="dataListSelections.length <= 0"    @click.native="runHandle()" value="批量立即执行"></el-option>
<!--        <el-option     @click.native="logHandle()" value="日志列表"></el-option>-->
      </el-select>
    </div>
    <div class="sd-rightpage" >
      <pager :current-page="pageIndex" @current-change="currentChangeHandle" :total="totalPage" @handle-size-change="sizeChangeHandle" :page-size="pageSize" background/>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 日志列表 -->
    <log v-if="logVisible" ref="log"></log>
    </el-card>
  </div>
</template>

<script>
  import AddOrUpdate from './schedule-add-or-update'
  import Log from './schedule-log'
  export default {
    data () {
      return {
        dataForm: {
          beanName: '',
          methodName: '',
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        logVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Log
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      resData () {
        this.dataForm.beanName = ''
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dataForm.methodName =this.dataForm.methodName.trim();
        this.dataForm.beanName = this.dataForm.beanName.trim();
        this.$http({
          url: this.$http.adornUrl('/sys/schedule/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'size': this.pageSize,
            'beanName': this.dataForm.beanName,
            'methodName':this.dataForm.methodName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
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
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 暂停
      pauseHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/pause'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 恢复
      resumeHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '恢复' : '批量恢复'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/resume'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 立即执行
      runHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.jobId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '立即执行' : '批量立即执行'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/schedule/run'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }).catch(() => {})
      },
      // 日志列表
      logHandle () {
        this.logVisible = true
        this.$nextTick(() => {
          this.$refs.log.init()
        })
      }
    }
  }
</script>
