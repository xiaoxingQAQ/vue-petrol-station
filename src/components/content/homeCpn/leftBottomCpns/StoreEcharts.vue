<template>
  <div id="storeEcharts" style="width:100%;height:100%"></div>
</template>

<script>
import { getCaptureSelectPullIn, getPersonSelcetPullIn } from '@/api/oilStation'
export default {
  props: ['orgIdEchar'],
  name: 'storeEcharts',
  data() {
    return {
      charts: '',
      legendData: [
        {
          name: '客流量',
          num: ''
        },
        {
          name: '进店人数',
          num: ''
        }, 
        {
          name: '进店率',
          num: ''
        }
      ],
      stopTheVehicleSum: '', // 进站车辆总数
      vehiclesSum: '', // 过往车辆总数
      pullIn: [], // 进站车辆数组
      passing: [], // 过往车辆数组
      feedRate: [], // 进站率
      timeArr: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22', '24'],
    }
  },
  created() {
  },
  watch: {
    orgIdEchar() {
      this.render()
    }
  },
  methods: {
    drawLine (id) {
      const _legendData = this.legendData
      const pullIn = this.pullIn
      const passing = this.passing
      const feedRate = this.feedRate
      this.charts = this.$echarts.init(document.getElementById(id))
      this.charts.setOption({
        //修改两条线的颜色
        color:['#54FFBB','#54FFBB'],
        title: {
          text: '便利店分析',
          textStyle: {
            color: '#54FFBB',
            fontSize: '15',
            fontWeight: 'normal',
          },
          top: '19',
          left: '10'
        },
         //触发方式
        tooltip: {
            trigger: 'axis' //坐标
        },
        // 图例组件
        legend: {
          data: ["客流量","进店人数","进店率"],
          icon: 'circle',
          // selectedMode: false,
          textStyle: {
            color:"#fff",
            fontSize: '11',
            rich: {
              a: {
                color: '#54FFBB'
              },
              b: {
                color: '#fff'
              }
            }
          },
          right: "8%",
          top: '15',
          itemWidth: 8,
          formatter: function (name) {
            let _index = 0
            _legendData.forEach((item, i) => {
              if (item.name === name) {
                _index = i
              }
            })
            let arr = [
              '{b|' + name + '}',
              '{a|' + '   ' +_legendData[_index].num + '}',
            ]
            return arr.join('')
          }
        },
        // 网格配置
        grid: {
          top:"20%",
          left: '3%%',
          right: '4%',
          bottom: '3%',
          //是否显示网格
          show:false,
          //是否显示刻度标签
          containLabel: true,

        },
        xAxis: {
          //去除轴内间距
          boundaryGap: false,
          data: ['0', '2点', '4点', '6点', '8点', '10点', '12点', '14点', '16点', '18点', '20点', '22点', '24点'],
          axisTick:{
            show: true,  //去除刻度线
            lineStyle:{
              color:"#fff"
            }
          },
          axisLine:{
            show: true,  //去除轴线
            lineStyle:{
              color:"#fff"
            }
          },
          axisLabel:{
            color:"#fff"  //x轴文本颜色
          }
        },
        yAxis: {
          splitLine: {  //分割线
            show: false
          },
          axisTick:{
            show: true,  //去除刻度线
            lineStyle:{
              color:"#fff"
            }
          },
          axisLine:{
            show: true,  //去除轴线
            lineStyle:{
              color:"#fff"
            }
          },
        },
        series: [
          {
            name: '客流量',
            data: pullIn,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#AC3B2A'
            },
            itemStyle: {
              color: "#AC3B2A",
            },
          },
          {
            name: '进店人数',
            data: passing,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#FC7D02'
            },
            itemStyle: {
              color: "#FC7D02",
            },
          },
          {
            name: '进店率',
            data: feedRate,
            type: 'line',
            smooth: true,
            lineStyle: {
              color: '#AA069F'
            },
            itemStyle: {
              color: "#AA069F",
            },
          }
        ]
      })
      this.charts.on("legendselectchanged", function(params) {
          // params.selected['进站车辆'] = true
          console.log(params.selected['进站车辆']) // {name: "", selected: {...}, type: "legendselectchanged"}
      })
    },
    async render() {
      // 客流
      const res = await getCaptureSelectPullIn({ orgId: this.orgIdEchar })
      this.stopTheVehicleSum = res.data.map(it => it.num).reduce((a,b) => {
        return parseInt(a) + parseInt(b)
      }, 0)

      // 进店人数
      const res2 = await getPersonSelcetPullIn({ orgId: this.orgIdEchar })
      this.vehiclesSum = res2.data.map(it => it.num).reduce((a,b) => {
        return parseInt(a) + parseInt(b)
      }, 0)

      if (res.data.length == 0 && res2.data.length == 0) {
        this.legendData = [
        {
          name: '过往车辆',
          num: ''
        },
        {
          name: '进站车辆',
          num: ''
        }, 
        {
          name: '进站率',
          num: ''
        }
      ],

        this.vehiclesSum = ''
        this.stopTheVehicleSum = ''
        this.pullIn = [] // 进站车辆数组
        this.passing = [] // 过往车辆数组
        this.feedRate = []// 进站率
        this.drawLine('storeEcharts')
        return
      }
      this.legendData = [
        {
          name: '客流量',
          num: this.stopTheVehicleSum
        },
        {
          name: '进店人数',
          num: this.vehiclesSum
        }, 
        {
          name: '进店率',
          num: this.stopTheVehicleSum == 0 || this.vehiclesSum == 0 ? '0%' : ((this.vehiclesSum / this.stopTheVehicleSum) * 100).toFixed(2) + '%'
        }
      ]

      // 客流量
      const pullInArr = res.data.map(it => it.HOUR)
      this.timeArr.forEach(item => {
        if (pullInArr.includes(item)) {
          res.data.forEach(val => {
            if (val.HOUR === item) {
              this.pullIn.push(val.num)
            }
          })
        } else {
          this.pullIn.push(0)
        }
      })

      // 进店
      const passingArr = res2.data.map(it => it.HOUR)
      this.timeArr.forEach(item => {
        if (passingArr.includes(item)) {
          res2.data.forEach(val => {
            if (val.HOUR === item) {
              this.passing.push(val.num)
            }
          })
        } else {
          this.passing.push(0)
        }
      })

      // 进店率
      this.pullIn.forEach((it, index) => {
        if (it === 0) {
          this.feedRate.push(0)
        } else {
          if (this.passing[index] === 0) {
            this.feedRate.push(0)
          } else {
            const num = (( this.passing[index] / this.pullIn[index] ) * 100).toFixed(2) + '%'
            this.feedRate.push(num)
          }
        }
      })
      console.log(this.pullIn, this.passing, this.feedRate);
      await this.drawLine('storeEcharts')
    }
  },
  async mounted() {
    this.render()
  }
}
</script>

<style>

</style>