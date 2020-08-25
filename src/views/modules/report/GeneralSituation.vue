<template>
  <div v-show="$GlobalApi.getUserInfo().roleId == 10">
    <el-col class="sd-main" style="width: 44.5%">
      <el-card shadow="hover" class="main-flow paddig">
        <div>
          <div class="main-secondary sale-info">
            <span style="padding: 0 15px 0 0">今日订单数<strong>{{orderCount || 0}}</strong></span>
            <span style="padding: 0 15px">待使用<strong>{{orderUnCount || 0}}</strong></span>
            <span style="padding: 0 15px">已完成<strong>{{orderOver || 0}}</strong></span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col class="sd-main" style="width: 25%">
      <el-card shadow="hover" class="main-flow paddig">
        <div class="main-secondary sale-info">
          <span>今日新增用户<strong>{{vivitorCount || 0}}</strong></span>
        </div>
      </el-card>
    </el-col>
    <el-col class="sd-main" style="width: 25%">
      <el-card shadow="hover" class="main-flow paddig">
        <div class="main-secondary sale-info">
          <span>今日金额<strong>{{moneyCount || 0}}</strong></span>
        </div>
      </el-card>
    </el-col>
    <el-col style="width: 97.5%;margin: 10px">
      <el-card shadow="hover">
        <div ref="echartmain" style="width:50%; height:350px;float: left"></div>
        <div id="moneymain" style="width:50%; height:350px;float: right"></div>
      </el-card>
    </el-col>
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
        orderCount: 0,
        orderUnCount: 0,
        orderOver: 0,
        vivitorCount:0,
        moneyCount: 0
      }
    },
    methods: {
      getlist(){
        var myChart = echarts.init(this.$refs.echartmain);
        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '订单数据'
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
            data: ["7","10","20","30"],
            name: '单位:天',
          },
          yAxis: {
            type: 'value',
            name: '数量/单'
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
            data: ["7","10","20","30"],
            name: '单位:天',
          },
          yAxis: {
            type: 'value',
            name: '金额/元'
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
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderCount = data.result.orderCount
            this.orderUnCount = data.result.orderUnCount
            this.orderOver = data.result.orderOver
            this.vivitorCount = data.result.vivitorCount
            this.moneyCount = data.result.moneyCount
            option.series[0].data = data.result.orderTotle.split(",");
            option.series[1].data = data.result.orderUnusedTotle.split(",");
            option2.series[0].data = data.result.moneyTotle.split(",");
            option2.series[1].data = data.result.moneyUnusedTotle.split(",");
            myChart.setOption(option);
            myChart2.setOption(option2);
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    },
    mounted(){
      if (this.$GlobalApi.getUserInfo().roleId == 10) {
        this.getlist();
      }
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss">
  .paddig > .el-card__body {
    padding: 10px;
  }

  .paddig {
    padding: 0px;
  }

  .card {
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    position: relative;
    transition: all .2s ease-in-out
  }

  .main-primary {
    color: #eaf5ff;
    font-size: 18px;
    margin-left: 36px
  }

  .main-primary strong {
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    margin: 4px
  }

  .main-secondary {
    color: #eaf5ff;
    font-size: 16px;
    margin: 10px 0 10px 36px;
    text-align: center;
  }

  .main-secondary strong, .main-secondary_new strong {
    color: #fff;
    font-size: 30px;
    font-weight: 700;
    margin: 4px
  }

  .main-secondary_new {
    color: #eaf5ff;
    font-size: 16px;
    margin: 10px 0 10px 0
  }

  .main-flow {
    background-color: #52a4ea
  }

  .main-flow span {
    margin-right: 24px
  }
</style>
