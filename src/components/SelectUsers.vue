<template>
  <div height="70%">
    <el-dialog
      :close-on-click-modal="false"
      top="5vh"
      :visible="visible"
      title="用户选择"
      :before-close="cancel"
      @open="gettbdata(1)"
      width="75%"
      append-to-body>
      <el-card :body-style="{padding:'10px'}" shadow="never">
        <div slot="header" class="clearfix">
          <el-input v-model="search.nickName" class="sd-input-150" placeholder="用户名称" size="small"/>
          <el-input v-model="search.phoneNumber" class="sd-input-150" placeholder="手机号" size="small"/>
          <el-button @click="gettbdata(1)" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询
          </el-button>
        </div>
        <div>
          <el-table
            size="small"
            border
            stripe
            highlight-current-row
            :header-cell-style="$GlobalApi.rowClass"
            :cell-style="$GlobalApi.cellClass"
            :max-height="tableHeight"
            :height="tableHeight"
            :data="userDatas"
            id="field-table"
            ref="clubRoomTable"
            @select-all="selectAll"
            @selection-change="chooseInstance"
            @current-change="selectInstance "
          >
            <el-table-column type="selection" width="35"/>
            <el-table-column prop="avatarUrl" label="头像" width="100px">
              <template slot-scope="scope">
                <el-popover
                  popper-class="member-popover"
                  placement="right"
                  trigger="hover">
                  <img :src="serverImage + scope.row.avatarUrl" class="tcimg"/>
                  <img slot="reference" :src="serverImage + scope.row.avatarUrl" class="img"/>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="用户编号" width="80px"/>
            <el-table-column prop="nickName" label="用户名称" width="100"/>
            <el-table-column label="年龄" width="50px">
              <template slot-scope="scope">
                <span>{{scope.row.birthday !== null ? $GlobalApi.jsGetAge(scope.row.birthday.split(" ")[0])  : "0"}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="50">
              <template slot-scope="scope">{{scope.row.gender == '1' ? '男' : '女' }}</template>
            </el-table-column>
            <el-table-column prop="invitationCode" label="该用户的邀请码"/>
            <el-table-column prop="bindingPhone" label="是否绑定手机号码"/>
            <el-table-column prop="createTime" label="创建时间"/>
          </el-table>
          <div class="sd-rightpage">
            <pager v-if="showPage" :current-page="page" :page-size="limit" :total="totalCount"
                   @current-change="CurrentPage"
                   @handle-size-change="PageSize" background/>
          </div>
        </div>
      </el-card>
      <span class="dialog-footer" style="margin-top: 5px!important;" slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="selected" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as SERVER_CONSTANT from "@/assets/js/serverConstant";
  export default {
    name: 'SelectUsers',
    props: {
      visible: {
        type: Boolean
      },
      showPage: {
        type: Boolean,
        default: true
      },
      checked: {
        type: Array,
        default: () =>{
          return [];
        }
      },
      multiSelect: {
        type: Boolean,
        default: false
      },
      multiSelectCount: {
        type: Number,
        default: -1
      },
      dftVal: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    watch: {
      dftVal: {
        handler(newVal, oldVal) {
          this.dftSet(newVal);
        },
        deep: true
      }
    },
    data() {
      return {
        serverImage:SERVER_CONSTANT.imageServerUrl,
        totalCount: this.$GlobalApi.Constants.DICT.TOTAL,
        tableHeight: this.$GlobalApi.getWinHeight() - 300,
        page: this.$GlobalApi.Constants.DICT.PAGE,
        limit: this.$GlobalApi.Constants.DICT.LIMIT,
        userDatas: [],
        search: {
          nickName:'',
          phoneNumber:''
        },
        currentData: null,
        isClearAll: false
      }
    },
    methods: {
      selectAll(selection) {
        if (!this.multiSelect || (this.multiSelectCount !== -1 && this.multiSelectCount < selection.length))
          return false;
      },
      dftSet(newVal) {
        this.userDatas = [];
        Object.keys(newVal).forEach(key => {
          if (this.search.hasOwnProperty(key)) {
            this.search[key] = newVal[key];
          }
        })
      },
      async gettbdata(type) {
        if (type === 1) {
          this.page = this.$GlobalApi.Constants.DICT.PAGE
          this.limit = this.$GlobalApi.Constants.DICT.LIMIT
        }
        await this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          isLoading: true,
          method: 'get',
          params: this.$http.adornParams({
            page: this.page,
            size: this.showPage ? this.limit : 999999,
            phoneNumber: this.search.phoneNumber,
            nickName: this.search.nickName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.totalCount = data.page.totalCount
            this.userDatas = data.page.list
          } else {
            this.$message.error(data.msg)
          }
        });
        if (this.checked.length > 0)
          this.signChecked();
      },
      chooseInstance(val) {
        if(this.multiSelectCount !== -1 && this.multiSelectCount < val.length){
          this.$refs.clubRoomTable.toggleRowSelection(val.pop());
        }
        if (this.multiSelect)
          return true;
        if (val.length == 0 && !this.isClearAll) {
          this.currentData = null;
        } else if (val.length == 1 && !this.isClearAll) {
          this.currentData = val.pop();
        } else if (val.length == 2) {
          this.$refs.clubRoomTable.clearSelection();
          //this.currentData = val.pop();
          this.$refs.clubRoomTable.toggleRowSelection(val.pop());
        } else if (val.length > 2) {
          // let selection = this.$refs.clubRoomTable.selection
          this.isClearAll = true;
          this.$refs.clubRoomTable.clearSelection();
          if (this.currentData)
            this.$refs.clubRoomTable.toggleRowSelection(this.currentData);
          this.isClearAll = false;
        }
      },
      selectInstance(val) {
        this.$refs.clubRoomTable.toggleRowSelection(val);
      },
      //分页显示
      CurrentPage(val) {
        this.page = val;
        this.gettbdata()
      },
      PageSize(val) {
        this.limit = val;
        this.gettbdata()
      },

      resetbtn() {
        Object.keys(this.search).forEach(key => {
          if (!this.dftVal.hasOwnProperty(key))
            this.search[key] = '';
        });
      },
      cancel() {
        this.userDatas = []
        this.$emit('update:visible', false);
        this.$emit('close');
      },
      selected() {
        this.userDatas = []
        const selectData = this.$refs.clubRoomTable.selection;
        this.$emit('update:visible', false);
        this.$emit('selected', selectData);
      },
      initDftVal() {
        if (!this.dftVal)
          return;

        Object.keys(this.dftVal).forEach(key => {
          if (this.dftVal[key]) {
            this.search[key] = this.dftVal[key];
          }
        })
      },
      signChecked() {
        this.userDatas.forEach(item => {
          this.checked.forEach(item2 => {
            if(item.userId === item2)
              this.$refs.clubRoomTable.toggleRowSelection(item);
          });
        });
      }
    },
    async mounted() {
      this.initDftVal();
      this.gettbdata(1);
    }
  }
</script>

<style scoped>
  thead .el-table-column--selection .cell {
    display: none;
  }
</style>
