<template>
  <div class="mbmainReport">
    <div class="orderclass">
      <span style="padding: 0 15px 0 0">今日订单数<strong>{{orderCount || 0}}</strong></span>
      <span style="padding: 0 15px">待使用<strong>{{orderUnCount || 0}}</strong></span>
      <span style="padding: 0 15px">已完成<strong>{{orderOver || 0}}</strong></span>
    </div>
    <div style="height:330px;">
      <div style="height:30px;text-align: right;padding-right: 30px;">
        <el-button size="mini" @click="getlist(30)">30天</el-button>
        <el-button size="mini" @click="getlist(7)" :autofocus="true">7天</el-button>
      </div>
      <div id="moneymain" style="height:300px;"></div>
    </div>
    <div style="height:330px;">
      <div style="height:30px;text-align: right;padding-right: 30px;">
        <el-button size="mini" @click="getlist(30)">30天</el-button>
        <el-button size="mini" @click="getlist(7)" :autofocus="true">7天</el-button>
      </div>
      <div id="echartmain" style="height:300px;"></div>
    </div>
  </div>
</template>
<!--/**-->
<!--今日订单，访客，金额-->
<!--**/-->
<script>
  import echarts from 'echarts'

  export default {
    name: "GeneralSituation",
    data() {
      return {
        flag: false,
        orderCount: 0,
        orderUnCount: 0,
        orderOver: 0,
        vivitorCount:0,
        profit:0,
        moneyCount: 0
      }
    },
    methods: {
      getlist(val){
        var myChart = echarts.init(document.getElementById('echartmain'));
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '新增用户'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data:['新增人数']
          },
          xAxis: {
            data: [],
            name: '日期',
          },
          yAxis: {
            type: 'value',
            name: '人数/个',
            minInterval: 1, //设置成1保证坐标轴分割刻度显示成整数。
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          series: [{
            name: '新增人数',
            type: 'line',
            data: []
          }]
        };

        this.$http({
          url: this.$http.adornUrl('/report/home'),
          method: 'get',
          isLoading: true,
          params: this.$http.adornParams({
            day: val
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderCount = data.result.orderCount
            this.orderUnCount = data.result.orderUnCount
            this.orderOver = data.result.orderOver
            this.vivitorCount = data.result.vivitorCount
            this.moneyCount = data.result.moneyCount
            this.profit = data.result.profit
            option.series[0].data = data.result.vivitorTotle.split(",");
            // option.series[1].data = data.result.orderUnusedTotle.split(",");
            option.xAxis.data = data.result.weekDay.split(",");
            myChart.setOption(option);
          } else {
            this.$message.error(data.msg);
          }
        })
      },
      getMoneyList(val){
        var myChart2 = echarts.init(document.getElementById('moneymain'));
        // 指定图表的配置项和数据
        var option2 = {
          title: {
            text: '金额数据'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data:['已完成','待使用']
          },
          xAxis: {
            data: [],
            name: '日期',
          },
          yAxis: {
            type: 'value',
            name: '金额/元',
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          series: [{
            name: '已完成',
            type: 'line',
            data: []
          },{
            name: '待使用',
            type: 'line',
            data: []
          }]
        };
        this.$http({
          url: this.$http.adornUrl('/report/home'),
          method: 'get',
          isLoading: true,
          params: this.$http.adornParams({
            day: val
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderCount = data.result.orderCount
            this.orderUnCount = data.result.orderUnCount
            this.orderOver = data.result.orderOver
            this.vivitorCount = data.result.vivitorCount
            this.moneyCount = data.result.moneyCount
            this.profit = data.result.profit
            option2.xAxis.data = data.result.weekDay.split(",");
            option2.series[0].data = data.result.moneyTotle.split(",");
            option2.series[1].data = data.result.moneyUnusedTotle.split(",");
            myChart2.setOption(option2);
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    mounted(){
      this.getlist(7);
      this.getMoneyList(7);
    }
  }

</script>

<style scoped>
  .mbmainReport{
    overflow-y: scroll;
    height: calc(100vh - 5.6rem);
  }

  .orderclass{
    height: 50px;
    background-color: #52a4ea;
    text-align: center;
    padding-top: 13px;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    margin: 5px 5px 5px 5px
  }
</style>
