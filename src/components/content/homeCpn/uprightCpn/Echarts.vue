<template>
  <div class="echarts1Dom">
    <div id="echarts1"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getCaptureSelectWeek} from '@/api/oilStation'
export default {
  name: 'echarts',
  data() {
    return {
      charts: '',
      resData: []
    }
  },
  methods: {
    drawPie(id) {
      const colorList = ['#00DE50', '#00BEF8', '#D69456', '#FF6F36', '#0086D8', '#C68BFD'];
      const resData = this.resData
      this.charts = this.$echarts.init(document.getElementById(id))
      this.charts.setOption({
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: '#6a7985'
          //   }
          // }
        },
        grid: {
          top: '10%',
          left: '14%',
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六','周日'],
          axisLine: {
            lineStyle: {
              // color: '#fff',
              fontWeight: 500,
            },
          },
          axisLabel: {
            // rotate: -90, // 原来 -30，倾斜体
            // margin: 5,
            color: '#8EFFEA',
            textStyle: {
              fontSize: 12,
              fontWeight: 500,
            },
          },
          axisTick: {
            show: false
          }
        }],
        yAxis: [{
          axisLabel: {
            formatter: '{value}',
            color: '#e2e9ff',
            textStyle: {
              fontSize: 10,
              fontWeight: 500,
              color: '#8EFFEA'
            },
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'none',
              fontWeight: 500,
              // type:'dashed' //设置网格线类型 dotted：虚线 solid:实线
            }
          },
        }],
        series: [{
          type: 'line',
          data: resData,
          // areaStyle: {},
          barWidth: '16px',
          itemStyle: {
            normal: {
              barBorderRadius: 0,
              color: (params) => {
                return colorList[params.dataIndex]
              }
            }
          },
          label: {
            normal: {
              show: true,
              lineHeight: 4,
              formatter: '{c}',
              position: 'top',
              textStyle: {
                color: '#00D6F9',
                fontSize: 8
              }
            }
          }
        }]
      })
    }
  },
  async mounted() {
    const res = await getCaptureSelectWeek()
    this.resData = res.data.map(it => {
      if (it.count == 0) {
        return ''
      } else {
        return it.count
      }
    })
    console.log(this.resData)
    this.$nextTick(function () {
      this.drawPie('echarts1')
    })
  }
}
</script>

<style lang="less" scoped>
.echarts1Dom {
  height: 250px;
}
#echarts1 {
  width: 100%;
  height: 230px;
}
</style>
