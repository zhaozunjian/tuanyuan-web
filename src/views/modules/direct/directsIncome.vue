<template>
  <el-card>
    <el-row class="row-search sd-nopadding" slot="header">
      <el-col class="search">
        <el-date-picker
          v-model="chooseTimes"
          type="daterange"
          align="left" size="small"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button @click="handleClick()" class="sd-mag-l-10" icon="el-icon-search" size="small" type="primary">查询</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg business_info" justify="center">
      <el-col :span="6">
        <span>完成订单数量 {{this.theTimeOrdersCount}}</span>
      </el-col>
      <el-col :span="6">
        <span>商户营业额 {{this.theTimeObtainMerchantAmount}}</span>
      </el-col>
      <el-col :span="6">
        <span>用户总实付额 {{this.theTimePaymentAmount}}</span>
      </el-col>
    </el-row>
    <el-table
      :cell-style="$GlobalApi.cellClassNoEdit"
      :data="incomeList"
      :header-cell-style="$GlobalApi.rowClass"
      :height="$GlobalApi.getWinHeight() - 280"
      border
      highlight-current-row
      size="small"
      stripe>
      <el-table-column
        label="商品名称"
        prop="directsCommodityName">
      </el-table-column>
      <el-table-column
        label="购买数量"
        prop="quantity">
      </el-table-column>
      <el-table-column
        label="商户营业额"
        prop="obtainMerchantAmount">
      </el-table-column>
    </el-table>
    <!--<div class="sd-rightpage">-->
    <!--<pager :current-page="page" :page-size="size" :total="total"-->
    <!--@current-change="pesCurrentPage" @handle-size-change="pesPageSize" background/>-->
    <!--</div>-->
  </el-card>
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
        currentPage:1,
        pageSize:10,
        total:0,
        chooseTimes: '',
        incomeList:[],
        theTimeOrdersCount: 0,
        theTimeObtainMerchantAmount: 0,
        theTimePaymentAmount: 0,
        directsId: ''
     }
   },
   mounted() {
      this.handleClick()
   },
   methods: {
     handleClick() {
        let startTime = this.chooseTimes[0]
        let endTime = this.chooseTimes[1]
        let directsId = this.$route.query.directsId
        this.directsId = directsId
        if (!startTime || !endTime) {
            startTime = new Date().getTime()-3600 * 1000 * 24 * 1
            endTime = new Date().getTime()
        }
        if (!this.currentPage){
            this.currentPage=1
        }
        if (!this.pageSize){
            this.pageSize=10
        }
       this.$http({
         url: this.$http.adornUrl('/directs/income/manageDataWithHistory'),
         method: 'get',
         params: this.$http.adornParams({
           directsId: directsId,
           startTime: startTime,
           endTime: endTime,
         })
       }).then(({data}) => {
         if (data && data.code === 0) {
           this.theTimeOrdersCount = data.result.theTimeOrdersCount
           this.theTimeObtainMerchantAmount = data.result.theTimeObtainMerchantAmount
           this.theTimePaymentAmount = data.result.theTimePaymentAmount
           this.incomeList = data.result.directsCommodityManageDataList
         } else {
           this.$message.error(data.msg)
         }
       })
     },
     handleCurrentChange(val) {
       this.currentPage = val
        this.handleClick()
     },
     handleSizeChange(val) {
        this.pageSize = val;
        this.handleClick()
     }
   }
};
</script>
