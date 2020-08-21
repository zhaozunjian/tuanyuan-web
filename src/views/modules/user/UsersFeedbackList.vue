<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-input class="sd-input-150" placeholder="用户名称" size="small" v-model="contactName"/>
        <el-button @click="initUsersFeedbackList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClass"
      :data="feedbackList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="tableHeight"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="联系人名称"
        prop="contactName">
      </el-table-column>
      <el-table-column
        label="联系人手机"
        prop="contactPhone">
      </el-table-column>
      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.usersFeedbackId)" size="small" type="text">查看</el-button>
          <el-button @click="handleDelete(scope.row.usersFeedbackId)" size="small" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="sd-rightpage">
      <pager :current-page="currentPage" :page-size="pageSize" :total="total"
             @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
    </div>
    <el-dialog title="反馈详情" :visible.sync="dialogVisibleEdit" width="30%">
      <div>
        <div class="editForm">
          <div><span>本条反馈的id：</span><span>{{editForm.usersFeedbackId}}</span></div>
          <div><span>联系人名称：</span><span>{{editForm.contactName}}</span></div>
          <div><span>联系人手机：</span><span>{{editForm.contactPhone}}</span></div>
          <div>
            <span>创建时间：</span><span>{{editForm.createTime |getTime(editForm.createTime)}}</span>
          </div>
          <div style="padding: 20px 0">
            <h4 class="mb10">反馈图片列表</h4>
            <div v-for="(item, index) in editForm.feedbackImages" :key="index"
                 class="flex align-center mb10">
              <img :src="item" alt=""
                   style="width: 200px;height: 200px;margin-right: 10px;">
            </div>
          </div>
          <div style="padding: 20px 0">
            <h4 class="mb10">反馈内容</h4>
            <span>{{editForm.feedbackContent}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleEdit = false">确 定</el-button>
        </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  mounted() {
      this.initData()
  },
  data() {
      return {
        currentPage: this.$GlobalApi.Constants.DICT.PAGE,
        pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
        total: this.$GlobalApi.Constants.DICT.TOTAL,
        feedbackList: [],
        contactName:'',
        tableHeight: this.$GlobalApi.getWinHeight() - 280,
        dialogVisibleEdit: false,
        editForm: {

        }
      }
  },
  methods: {
      initData() {
          this.initUsersFeedbackList();
      },
      initUsersFeedbackList() {
        this.$http({
          url: this.$http.adornUrl(`/usersFeedback/pageAll`),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            contactName: this.contactName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.feedbackList = data.result.data
            this.total = data.result.pageModel.total
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleEdit(usersFeedbackId) {
        this.$http({
          url: this.$http.adornUrl(`/usersFeedback/info`),
          method: 'get',
          params: this.$http.adornParams({
            usersFeedbackId: usersFeedbackId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.editForm = data.result
            this.dialogVisibleEdit = true
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      handleDelete(usersFeedbackId) {
        this.$confirm('此操作将会拒绝这次申请, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(res => {
          this.$http({
            url: this.$http.adornUrl(`/usersFeedback/delete`),
            method: 'get',
            params: this.$http.adornParams({
              usersFeedbackId: usersFeedbackId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.initUsersFeedbackList()
            } else {
              this.$message.error(data.msg);
            }
          })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.initUsersFeedbackList()
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.initUsersFeedbackList()
      }
  }
};
</script>

<style>

</style>
