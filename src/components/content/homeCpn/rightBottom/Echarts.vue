<template>
  <div class="echartsDom">
    <div id="echarts" style=""></div>
  </div>
</template>

<script>
import { getAlarmDegreeCount } from '@/api/home/home'
export default {
  name: 'echarts1',
  data() {
    return {
      charts: '',
      dataList: []
    }
  },
  methods: {
    drawPie(id) {
      this.charts = this.$echarts.init(document.getElementById(id))
      const colorList = ['#FF647C', '#FFBE75', '#3EE2A5', '#6C77FD'];
      const data = this.dataList
      const arrName = this.getArrayValue(data, 'name');
      const arrValue = this.getArrayValue(data, 'count');
      let sumValue = eval(arrValue.join('+'));
      let bili = sumValue;
      if (bili < 100) {
        bili = 25 + sumValue
      } else {
        bili = sumValue + sumValue * 0.45
      }
      const objData = this.array2obj(data, 'name');
      const optionData = this.getData(data, bili, colorList);
      const option = {
        legend: {
          show: true,
          icon: 'circle',
          top: '0%',
          left: "58%",
          data: arrName,
          width: 10,
          padding: [0, 0],
          itemGap: 2,
          formatter: function (name) {
            if (objData[name].count === '0') {
              return '{title|' + name + '} {value|' + (0).toFixed(2) + '} {title|%}';
            } else {
              return '{title|' + name + '} {value|' + (objData[name].count / sumValue * 100).toFixed(2) + '} {title|%}';
            } 
            
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 10,
                color: '#fff',
              },
              value: {
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 10,
                color: '#fff',
              },
            },
          },
        },
        tooltip: {
          position: 'inside',
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          },
        },
        color: ['#FF647C', '#3EE2A5', '#FFBE75', '#3EE2A5', '#6C77FD'],
        xAxis: [
          {
            show: false,
          },
        ],
        series: optionData.series,
      };
      this.charts.setOption(option)
    },
    getArrayValue(array, key) {
      let key1 = key || 'value';
      let res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key1]);
        });
      }
      return res;
    },
    array2obj(array, key) {
      const resObj = {};
      for (let i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    getData(data, sumValue, colorList) {
      const res = {
        series: [],
        yAxis: [],
      };
      const start = 96
      const end = 93
      const bili = 15;
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: '',
          type: 'pie',
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [start - i * bili + '%', end - i * bili + '%'],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 15,
          },
          data: [
            {
              value: data[i].count,
              name: data[i].name,
              itemStyle: {
                color: colorList[i],
                normal: {
                  borderWidth: 5,
                  borderColor: colorList[i]
                }
              }
            },
            {
              value: sumValue - data[i].count,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
        res.series.push({
          name: '',
          type: 'pie',
          silent: true,
          z: 1,
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [start - i * bili + '%', end - i * bili + '%'],
          label: {
            show: false,
          },
          itemStyle: {
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            borderWidth: 15,
          },
          data: [
            {
              value: 5,
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  borderColor: '#687389',
                }
              }
            },
            {
              value: 2.5,
              name: '',
              itemStyle: {
                color: 'rgba(0,0,0,0)',
                borderWidth: 0,
              },
              tooltip: {
                show: false,
              },
              hoverAnimation: false,
            },
          ],
        });
      }
      return res;
    }
  },
  async mounted() {
    // const that = this
    // getAlarmDegreeCount().then(res => {
    //   console.log('环形统计图: ', res);
    //   if (res.code === 200) {
    //     that.dataList = res.data;
    //     that.$nextTick(function () {
    //     that.drawPie('echarts')
    //     })
    //   }
    // })
    const res = await getAlarmDegreeCount()
    this.dataList = res.data
    this.drawPie('echarts')

  }
}
</script>

<style lang="less" scoped>
.echartsDom {
  height: 250px;
}
#echarts {
  // width: 110%;
  height: 230px;
  // transform: translate(-13%);
}
</style>
