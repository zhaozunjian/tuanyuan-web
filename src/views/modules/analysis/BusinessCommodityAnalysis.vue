<template>
  <div class="mod-user">
    <el-card class="box-card" shadow="never" body-style="padding:10px">
      <div slot="header">
        <el-date-picker
          v-model="chooseTimes"
          type="daterange"
          align="left" size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-input class="sd-input-150" clearable placeholder="搜索商品名称" size="small" @change="getchangeInit" v-model.trim="searchContent"/>
        <el-button @click="getBusinessCommodityList()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </div>

      <el-tabs v-model="sortType" @tab-click="getBusinessCommodityList"  type="border-card">
        <el-tab-pane label="销量" name="100">
          <el-tabs v-model="sortWay" @tab-click="getBusinessCommodityList"  type="border-card">
            <el-tab-pane label="卖出数量" name="101">
              <el-table :data="businessCommodityList" :cell-style="$GlobalApi.cellClass"
                        :header-cell-style="$GlobalApi.rowClass"
                        border
                        highlight-current-row
                        size="small"
                        stripe
                        style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="datas">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品id">
                        <span>{{ datas.row.businessCommodityId }}</span>
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <span>{{ datas.row.businessCommodityName }}</span>
                      </el-form-item>
                      <el-form-item label="售价">
                        <span>{{ datas.row.currentPrice }}</span>
                      </el-form-item>
                      <el-form-item label="成本价">
                        <span>{{ datas.row.costPrice }}</span>
                      </el-form-item>
                      <el-form-item label="基本利润">
                        <span>{{ datas.row.basicProfit }}</span>
                      </el-form-item>
                      <el-form-item label="总销量">
                        <span>{{ datas.row.totalSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="时间段内的销量">
                        <span>{{ datas.row.theTimeSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="商家id">
                        <span>{{ datas.row.businessId }}</span>
                      </el-form-item>
                      <el-form-item label="商家名称">
                        <span>{{ datas.row.businessName }}</span>
                      </el-form-item>
                      <el-form-item label="商家联系电话">
                        <span>{{ datas.row.businessContactPhone }}</span>
                      </el-form-item>
                      <el-table-column label="创建时间">
                        <template slot-scope="scope">
                          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
                        </template>
                      </el-table-column>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="businessCommodityName"></el-table-column>
                <el-table-column label="售价" prop="currentPrice"></el-table-column>
                <el-table-column label="成本价" prop="costPrice"></el-table-column>
                <el-table-column label="基本利润" prop="basicProfit"></el-table-column>
                <el-table-column label="总销量" prop="totalSalesCount"></el-table-column>
                <el-table-column label="时间段内的销量" prop="theTimeSalesCount"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="时间" name="200">
          <el-tabs v-model="sortWay" @tab-click="getBusinessCommodityList"  type="border-card">
            <el-tab-pane label="创建时间" name="201">
              <el-table :data="businessCommodityList" :cell-style="$GlobalApi.cellClass"
                        :header-cell-style="$GlobalApi.rowClass"
                        border
                        highlight-current-row
                        size="small"
                        stripe
                        style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="datas">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品id">
                        <span>{{ datas.row.businessCommodityId }}</span>
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <span>{{ datas.row.businessCommodityName }}</span>
                      </el-form-item>
                      <el-form-item label="售价">
                        <span>{{ datas.row.currentPrice }}</span>
                      </el-form-item>
                      <el-form-item label="成本价">
                        <span>{{ datas.row.costPrice }}</span>
                      </el-form-item>
                      <el-form-item label="基本利润">
                        <span>{{ datas.row.basicProfit }}</span>
                      </el-form-item>
                      <el-form-item label="总销量">
                        <span>{{ datas.row.totalSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="时间段内的销量">
                        <span>{{ datas.row.theTimeSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="商家id">
                        <span>{{ datas.row.businessId }}</span>
                      </el-form-item>
                      <el-form-item label="商家名称">
                        <span>{{ datas.row.businessName }}</span>
                      </el-form-item>
                      <el-form-item label="商家联系电话">
                        <span>{{ datas.row.businessContactPhone }}</span>
                      </el-form-item>
                      <el-table-column label="创建时间">
                        <template slot-scope="scope">
                          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
                        </template>
                      </el-table-column>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="businessCommodityName"></el-table-column>
                <el-table-column label="售价" prop="currentPrice"></el-table-column>
                <el-table-column label="成本价" prop="costPrice"></el-table-column>
                <el-table-column label="基本利润" prop="basicProfit"></el-table-column>
                <el-table-column label="总销量" prop="totalSalesCount"></el-table-column>
                <el-table-column label="时间段内的销量" prop="theTimeSalesCount"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="价格" name="300">
          <el-tabs v-model="sortWay" @tab-click="getBusinessCommodityList"  type="border-card">
            <el-tab-pane label="售价" name="301">
              <el-table :data="businessCommodityList" :cell-style="$GlobalApi.cellClass"
                        :header-cell-style="$GlobalApi.rowClass"
                        border
                        highlight-current-row
                        size="small"
                        stripe
                        style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="datas">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品id">
                        <span>{{ datas.row.businessCommodityId }}</span>
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <span>{{ datas.row.businessCommodityName }}</span>
                      </el-form-item>
                      <el-form-item label="售价">
                        <span>{{ datas.row.currentPrice }}</span>
                      </el-form-item>
                      <el-form-item label="成本价">
                        <span>{{ datas.row.costPrice }}</span>
                      </el-form-item>
                      <el-form-item label="基本利润">
                        <span>{{ datas.row.basicProfit }}</span>
                      </el-form-item>
                      <el-form-item label="总销量">
                        <span>{{ datas.row.totalSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="时间段内的销量">
                        <span>{{ datas.row.theTimeSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="商家id">
                        <span>{{ datas.row.businessId }}</span>
                      </el-form-item>
                      <el-form-item label="商家名称">
                        <span>{{ datas.row.businessName }}</span>
                      </el-form-item>
                      <el-form-item label="商家联系电话">
                        <span>{{ datas.row.businessContactPhone }}</span>
                      </el-form-item>
                      <el-table-column label="创建时间">
                        <template slot-scope="scope">
                          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
                        </template>
                      </el-table-column>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="businessCommodityName"></el-table-column>
                <el-table-column label="售价" prop="currentPrice"></el-table-column>
                <el-table-column label="成本价" prop="costPrice"></el-table-column>
                <el-table-column label="基本利润" prop="basicProfit"></el-table-column>
                <el-table-column label="总销量" prop="totalSalesCount"></el-table-column>
                <el-table-column label="时间段内的销量" prop="theTimeSalesCount"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="成本价" name="302">
              <el-table :data="businessCommodityList" :cell-style="$GlobalApi.cellClass"
                        :header-cell-style="$GlobalApi.rowClass"
                        border
                        highlight-current-row
                        size="small"
                        stripe
                        style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="datas">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品id">
                        <span>{{ datas.row.businessCommodityId }}</span>
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <span>{{ datas.row.businessCommodityName }}</span>
                      </el-form-item>
                      <el-form-item label="售价">
                        <span>{{ datas.row.currentPrice }}</span>
                      </el-form-item>
                      <el-form-item label="成本价">
                        <span>{{ datas.row.costPrice }}</span>
                      </el-form-item>
                      <el-form-item label="基本利润">
                        <span>{{ datas.row.basicProfit }}</span>
                      </el-form-item>
                      <el-form-item label="总销量">
                        <span>{{ datas.row.totalSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="时间段内的销量">
                        <span>{{ datas.row.theTimeSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="商家id">
                        <span>{{ datas.row.businessId }}</span>
                      </el-form-item>
                      <el-form-item label="商家名称">
                        <span>{{ datas.row.businessName }}</span>
                      </el-form-item>
                      <el-form-item label="商家联系电话">
                        <span>{{ datas.row.businessContactPhone }}</span>
                      </el-form-item>
                      <el-table-column label="创建时间">
                        <template slot-scope="scope">
                          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
                        </template>
                      </el-table-column>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="businessCommodityName"></el-table-column>
                <el-table-column label="售价" prop="currentPrice"></el-table-column>
                <el-table-column label="成本价" prop="costPrice"></el-table-column>
                <el-table-column label="基本利润" prop="basicProfit"></el-table-column>
                <el-table-column label="总销量" prop="totalSalesCount"></el-table-column>
                <el-table-column label="时间段内的销量" prop="theTimeSalesCount"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="基本利润" name="303">
              <el-table :data="businessCommodityList" :cell-style="$GlobalApi.cellClass"
                        :header-cell-style="$GlobalApi.rowClass"
                        border
                        highlight-current-row
                        size="small"
                        stripe
                        style="width: 100%;">
                <el-table-column type="expand">
                  <template slot-scope="datas">
                    <el-form label-position="left" inline class="demo-table-expand">
                      <el-form-item label="商品id">
                        <span>{{ datas.row.businessCommodityId }}</span>
                      </el-form-item>
                      <el-form-item label="商品名称">
                        <span>{{ datas.row.businessCommodityName }}</span>
                      </el-form-item>
                      <el-form-item label="售价">
                        <span>{{ datas.row.currentPrice }}</span>
                      </el-form-item>
                      <el-form-item label="成本价">
                        <span>{{ datas.row.costPrice }}</span>
                      </el-form-item>
                      <el-form-item label="基本利润">
                        <span>{{ datas.row.basicProfit }}</span>
                      </el-form-item>
                      <el-form-item label="总销量">
                        <span>{{ datas.row.totalSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="时间段内的销量">
                        <span>{{ datas.row.theTimeSalesCount }}</span>
                      </el-form-item>
                      <el-form-item label="商家id">
                        <span>{{ datas.row.businessId }}</span>
                      </el-form-item>
                      <el-form-item label="商家名称">
                        <span>{{ datas.row.businessName }}</span>
                      </el-form-item>
                      <el-form-item label="商家联系电话">
                        <span>{{ datas.row.businessContactPhone }}</span>
                      </el-form-item>
                      <el-table-column label="创建时间">
                        <template slot-scope="scope">
                          <div>{{scope.row.createTime | getTime(scope.row.createTime)}}</div>
                        </template>
                      </el-table-column>
                    </el-form>
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="businessCommodityName"></el-table-column>
                <el-table-column label="售价" prop="currentPrice"></el-table-column>
                <el-table-column label="成本价" prop="costPrice"></el-table-column>
                <el-table-column label="基本利润" prop="basicProfit"></el-table-column>
                <el-table-column label="总销量" prop="totalSalesCount"></el-table-column>
                <el-table-column label="时间段内的销量" prop="theTimeSalesCount"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>

      <div class="sd-rightpage">
        <pager :current-page="currentPage" :page-size="pageSize" :total="total"
               @current-change="handleCurrentChange" @handle-size-change="handleSizeChange" background/>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      chooseTimes: [],
      searchContent: '',
      currentPage: this.$GlobalApi.Constants.DICT.PAGE,
      pageSize: this.$GlobalApi.Constants.DICT.LIMIT,
      total: this.$GlobalApi.Constants.DICT.TOTAL,
      sortType: "100",
      sortWay: "101",
      businessCommodityList: []
    }
  },
  methods: {
    handleClick() {
      this.getBusinessCommodityList()
    },
    getchangeInit(val){
      if (val === null || val === ''){
        this.getBusinessCommodityList();
      }
    },
    getBusinessCommodityList() {
      if (this.chooseTimes != null && this.chooseTimes != '') {
        let startTime = this.chooseTimes[0]
        let endTime = this.chooseTimes[1]
        this.$http({
          url: this.$http.adornUrl(`/analysis/businessCommodity/pageSortWithHistory`),
          method: 'post',
          params: this.$http.adornParams({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            searchContent: this.searchContent,
            startTime: startTime,
            endTime: endTime,
            sortType: this.sortType,
            sortWay: this.sortWay
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.businessCommodityList = data.result.data;
            this.total = data.result.pageModel.total;
          } else {
            this.$message.error(data.msg);
          }
        })
      } else {
        this.$message.error('请先选择时间段范围');
      }
    },
    onChangeSearchContent() {
      if (this.searchContent==''){
        this.getBusinessCommodityList()
      }
    },
    // 切换分页
    handleCurrentChange(val) {
      this.currentPage = val
      this.getBusinessCommodityList()
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBusinessCommodityList()
    }
  }
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
