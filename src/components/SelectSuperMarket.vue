<template>
  <div class="cabinetSelectPop" height="70%">
    <el-dialog
      :close-on-click-modal="false"
      top="5vh"
      :visible="visible"
      class="code-dialog"
      title="商品选择"
      :before-close="cancel"
      @open="gettbdata(1)"
      width="75%"
      append-to-body>
      <el-card :body-style="{padding:'10px'}" shadow="never">
        <div slot="header" class="clearfix">
          <el-input v-model="search.cname" clearable @change="getchangeInit" class="sd-input-150" placeholder="商品名称" size="small"/>
          <el-button @click="gettbdata()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
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
            <el-table-column prop="cavatar" label="头像">
              <template slot-scope="scope">
                <img :src="scope.row.cavatar | getImg(scope.row.cavatar)" alt style="width: 60px;height: 60px;"/>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="商品编号"/>
            <el-table-column prop="cname" label="商品名称"/>
            <el-table-column prop="csubTitle" label="商品标题"/>
            <el-table-column prop="cdescription" label="商品描述"/>
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
  export default {
    name: 'SelectSuperMarket',
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
        totalCount: this.$GlobalApi.Constants.DICT.TOTAL,
        tableHeight: this.$GlobalApi.getWinHeight() - 400,
        page: this.$GlobalApi.Constants.DICT.PAGE,
        limit: this.$GlobalApi.Constants.DICT.LIMIT,
        userDatas: [],
        search: {
          cname:''
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
      getchangeInit(val){
        if (val === null || val === ''){
          this.gettbdata();
        }
      },
      async gettbdata() {
        await this.$http({
          url: this.$http.adornUrl('/supermarketCommodityLibrary/page'),
          isLoading: true,
          method: 'get',
          params: this.$http.adornParams({
            page: this.page,
            size: this.showPage ? this.limit : 999999,
            cname: this.search.cname,
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
          this.$refs.clubRoomTable.toggleRowSelection(val.pop());
        } else if (val.length > 2) {
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
      signChecked() {
        this.userDatas.forEach(item => {
          this.checked.forEach(item2 => {
            if(item.id === item2)
              this.$refs.clubRoomTable.toggleRowSelection(item);
          });
        });
      }
    },
    async mounted() {
      this.gettbdata();
    }
  }
</script>

<style scoped>

</style>
