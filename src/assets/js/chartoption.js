export const option = {
  title: {
    text: '天气情况统计',
    subtext: '虚构数据',
    left: 'center'
  },
  legend: {
    // orient: 'vertical',
    // top: 'middle',
    bottom: 10,
    left: 'center',
    data: []
  },
  series: [
    {
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
      selectedMode: 'single',
      data: []
    }
  ]
}
export const left = {
  title: {
    text: '',
    // subtext: '纯属虚构',
    left: 'left'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    orient: '',
    left: '',
    y: '',
    bottom: '',
    data: []
  },
  series: [
    {
      type: 'pie',
      radius: '60%',
      center: [],
      data: [],
      normal: {},
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}
export const zxpic = {
  title: {
    text: '',
    x: 'left'
  },
  grid: {
    bottom: 80
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      animation: false,
      label: {
        backgroundColor: '#505765'
      }
    }
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      axisLine: { onZero: false },
      data: [].map(function(str) {
        return str.replace(' ', '\n')
      })
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '',
      type: 'line',
      center: ['60%', '60%'],
      animation: false,
      areaStyle: {
      },
      lineStyle: {
        width: 1
      },
      data: []
    }
  ]
}
export const zhuzhangtu = {
  title: {
    text: '',
    // subtext: '纯属虚构',
    left: 'left'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data:[]
  },
  grid: {
    left: '',
    right: '',
    bottom: '',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '',
      type: 'bar',
      stack: '',
      data: []
    },
    {
      name: '',
      type: 'bar',
      stack: '',
      data: []
    }
  ]
}
export const zxtool = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    show: true,
    right: 'right'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '',
      type: 'line',
      stack: '',
      data: []
    },
    {
      name: '',
      type: 'line',
      stack: '',
      data: []
    }
  ]
}
export const duidiemap = {
  title: {
    text: ''
  },
  tooltip : {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data:[]
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    width:'',
    containLabel: true
  },
  xAxis : [
    {
      type : 'category',
      boundaryGap : false,
      data : []
    }
  ],
  yAxis : [
    {
      type : 'value'
    }
  ],
  series : [
    {
      name:'',
      type:'line',
      stack: '',
      areaStyle: {},
      data:[]
    },
    {
      name:'',
      type:'line',
      stack: '',
      areaStyle: {},
      data:[]
    },
    {
      name:'',
      type:'line',
      stack: '',
      areaStyle: {},
      data:[]
    }
  ]
};
export const huanxingtu = {
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    y:'center',
    x:'right',
    data:[]
  },
  series: [
    {
      name:'',
      type:'pie',
      radius: ['60%', '80%'],
      center: [],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data:[]
    }
  ]
};
