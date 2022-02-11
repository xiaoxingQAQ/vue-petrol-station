<template>
  <div
    class="slider-container"
    ref="slider"
    :style="sliderStyle"
    @mouseover="pause()"
    @mouseout="play()"
  >
    <div class="slider-content" :class="mask ? 'mask' : ''" v-if="list.length">
      <div
        class="slider"
        v-for="(item, index) in list"
        :key="item.id"
        :class="[
          setClass(index),
          { setClass_1: setClass_1 },
          { setClass_2: setClass_2 },
        ]"
      >
        <div>
          <span>{{ item.name }}</span>
          <span>{{ item.count }}</span>
        </div>
      </div>
    </div>

    <!-- <div class="slider-content top" :class="mask ? 'mask' : ''" v-if="list.length < 5">
      <div
        class="slider"
        v-for="(item, index) in list"
        :key="index"
        :class="[
          setClass2(index),
          { setClass_1: setClass_1 },
          { setClass_2: setClass_2 },
        ]"
      >
        <div>
          <span>{{ item.name }}</span>
          <span>{{ item.count }}</span>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { getAlarmEventCount, getWarnSum, getStationList } from '@/api/home/home';
import { getSelectByOrg, getCaptureSelectNum, getSelectToDay } from '@/api/oilStation'
import { getOilOmeterSelect } from '@/api/oilStation'
export default {
  data() {
    return {
      setClass_1: null,
      setClass_2: null,
      currentIndex: 0,
      sliderDomList: [],
      timer: null,
      list: [
        { id: 1, name: '店长出勤', count: '0' },
        { id: 2, name: '客户统计', count: '' },
        { id: 3, name: '今日告警', count: '' },
        { id: 4, name: '卸油离岗', count: '0' },
        { id: 5, name: '今日营收', count: '0' },
      ],
      todayTheAlarm: null, // 今日告警
      passenger: null, // 客流统计
      shopManager: '', // 店长出勤
      unloadingAbsences: '', // 卸油离岗
      revenue: '' // 今日营收
    };
  },
  props: {
    width: {
      type: Number,
      default: 180,
    },
    height: {
      type: Number,
    },
    imgType: {
      type: String,
      default: 'percentage',
    },
    autoPlay: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 4000,
    },
    dots: {
      type: Boolean,
      default: true,
    },
    arrow: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: 'rgb(248, 85, 85)',
    },
  },
  computed: {
    sliderStyle() {
      return {
        width: this.width ? this.width + 'px' : '100%',
        height: this.height ? this.height + 'px' : '100%',
        perspective: this.width + 'px',
        backgroundSize:
          this.imgType == 'percentage' ? '100% 100%' : this.imgType,
      };
    },
  },
  created() {
    this.getSelectToDay()
  },
  mounted() {
    this.$bus.$on('customerNumOn', (num, count) => {
      this.list[1].count = num
      this.list[2].count = count
    })
    this.$bus.$on('turnoverOn', () => {
      this.getSelectToDay()
    })
    this.sliderDomList = this.$refs.slider.querySelectorAll('div.slider');
    this.play();
  },
  methods: {
    // 查询所有营收额汇总
    getSelectToDay() {
      getSelectToDay().then(res => {
        if (res.data == 0) {
          this.list[4].count = 0
        } else {
          let str = +res.data
          this.list[4].count = str.toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ',')
        }
      })
    },
    // 请求
    // async getList() {
    //   const res = await getStationList()
    //   const sumArr = res.data.map(it => {
    //     return it.allCount
    //   }).filter(it => it != "")
    //   this.todayTheAlarm = sumArr.reduce((a,b) => {
    //     return parseInt(a) + parseInt(b)
    //   }, 0)
    // },
    setClass(i) {
      let next =
        this.currentIndex === this.list.length - 1 ? 0 : this.currentIndex + 1;
      let prev =
        this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1;

      let next_2;
      let prev_2;
      if (this.currentIndex === this.list.length - 1) {
        next_2 = 1;
      } else if (this.currentIndex === this.list.length - 2) {
        next_2 = 0;
      } else {
        next_2 = this.currentIndex + 2;
      }

      if (this.currentIndex === 0) {
        prev_2 = this.list.length - 2;
      } else if (this.currentIndex === 1) {
        prev_2 = this.list.length - 1;
      } else {
        prev_2 = this.currentIndex - 2;
      }

      switch (i) {
        case this.currentIndex:
          return 'active';
        case next:
          return 'next';
        case prev:
          return 'prev';
        case next_2:
          return 'next_2';
        case prev_2:
          return 'prev_2';
        default:
          return '';
      }
    },
    setClass2(i) {
      let next =
        this.currentIndex === this.list.length - 1 ? 0 : this.currentIndex + 1;
      let prev =
        this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1;

      switch (i) {
        case this.currentIndex:
          return 'active2';
        case next:
          return 'next2';
        case prev:
          return 'prev2';
      }
    },
    setBGImg(src) {
      return {
        backgroundImage: `url(${src})`,
      };
    },
    setActiveDot(index) {
      return index === this.currentIndex
        ? {
          backgroundColor: this.color,
        }
        : {
          backgroundColor: '#ccc',
        };
    },
    play() {
      this.pause();
      if (this.autoPlay) {
        this.timer = setInterval(() => {
          this.next();
        }, this.interval);
      }
    },
    pause() {
      clearInterval(this.timer);
    },
    next() {
      setTimeout(() => {
        this.setClass_1 = true;
      }, 20);
      setTimeout(() => {
        this.setClass_1 = false;
      }, 300);
      this.currentIndex = ++this.currentIndex % this.list.length;
    },
    prev() {
      // setTimeout(() => {
      //   this.setClass_2 = true
      // }, 20);
      // setTimeout(() => {
      //   this.setClass_2 = false
      // }, 300);
      // this.currentIndex = this.currentIndex === 0 ? this.list.length - 1 : this.currentIndex - 1;
    },
    onClick(i) {
      if (i === this.currentIndex) {
        this.$emit('sliderClick', i);
      } else {
        let currentClickClassName =
          this.sliderDomList[i].className.split(' ')[1];
        console.log(currentClickClassName);
        if (currentClickClassName === 'next') {
          this.next();
        } else {
          // this.prev()
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.slider-container {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 10px 0;
  position: relative;
  border-radius: 8px;
  span {
    color: transparent;
  }

  .slider-content {
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    left: 0%;
    top: 18%;
    margin: 0px;
    padding: 0px;

    .slider {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      position: absolute;
      margin: 0;
      top: 0;
      left: 50%;
      width: 65%;
      height: 100%;
      transition: 300ms all ease-in-out;
      border-radius: 8px;

      background-repeat: no-repeat;
      background-position: center;
      background-size: inherit;
      transform: translate3d(-50%, 0, -80px);
      z-index: 0;

      div {
        display: flex;
        flex-direction: column;
        transition: 300ms all ease-in-out;
        span {
          white-space: nowrap;
          transition: 300ms all ease-in-out;
        }
      }

      &:before {
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0);
        transition-delay: 100ms !important;
        transition: all 300ms;
        cursor: pointer;
      }

      &.active {
        transform: translate3d(-50%, 0, 0);
        z-index: 20;

        div {
          transform: translate(0, -5%);
          display: flex;
          flex-direction: column;

          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 25px;
            font-weight: 500;
            line-height: 34px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 25px;
            font-weight: 500;
            line-height: 29px;
            color: #ff6a6c;
          }
        }
      }
      &.active2 {
        transform: translate3d(-50%, 0, 0);
        z-index: 20;

        div {
          transform: translate(0, -5%);
          display: flex;
          flex-direction: column;

          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 25px;
            font-weight: 500;
            line-height: 34px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 25px;
            font-weight: 500;
            line-height: 29px;
            color: #ff6a6c;
          }
        }
      }
      &.prev {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(-175%, 15px, -100px);
        z-index: 19;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 22px;
            font-weight: 500;
            line-height: 30px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 22px;
            font-weight: 500;
            line-height: 25px;
            color: #fbbe6f;
          }
        }
      }
      &.prev2 {
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 300ms ease-in-out;
        transform: translate3d(-185%, 15px, -100px);
        z-index: 19;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 22px;
            font-weight: 500;
            line-height: 30px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 22px;
            font-weight: 500;
            line-height: 25px;
            color: #fbbe6f;
          }
        }
      }
      &.next {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(75.5%, 15px, -100px);
        z-index: 18;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 22px;
            font-weight: 500;
            line-height: 30px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 22px;
            font-weight: 500;
            line-height: 25px;
            color: #72ff98;
          }
        }
      }
      &.next2 {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(85.5%, 15px, -100px);
        z-index: 18;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 22px;
            font-weight: 500;
            line-height: 30px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 22px;
            font-weight: 500;
            line-height: 25px;
            color: #72ff98;
          }
        }
        &.setClass_1 {
          display: none;
        }
      }

      &.prev_2 {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(-350%, 25px, -200px);
        z-index: 199;
        transition: 300ms ease-in-out;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            width: 118px;
            height: 27px;
            font-size: 20px;
            font-weight: 500;
            line-height: 27px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 20px;
            font-weight: 500;
            line-height: 23px;
            color: #9ad6ff;
          }
        }
        &.setClass_2 {
          display: none;
        }
      }
      &.next_2 {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translate3d(250%, 25px, -200px);
        z-index: 999;
        transition: all 300ms ease-in-out;
        div {
          span:nth-child(1) {
            margin-bottom: 16px;
            font-size: 20px;
            font-weight: 500;
            line-height: 27px;
            color: #6fe9ce;
          }
          span:nth-child(2) {
            font-size: 20px;
            font-weight: 500;
            line-height: 23px;
            color: #ffffff;
          }
        }
        &.setClass_1 {
          display: none;
        }
      }
    }
    i {
      width: 17.5%;
      display: none;
      position: absolute;
      top: 40%;
      font-size: 22px;
      color: rgba(255, 255, 255, 0.5);
      text-shadow: 0 0 24px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      z-index: 21;

      &:first-child {
        left: 0;
      }
      &:last-child {
        right: 0;
      }
    }

    &:hover i {
      color: rgba(255, 255, 255, 0.8);
      display: block;
    }
    &.mask {
      .slider {
        &.active {
          position: relative;
          width: 249px;
          height: 135px;
          background: rgba(115, 193, 206, 0.24);
          border-radius: 8px;
        }
        &.active2 {
          position: relative;
          width: 332px;
          height: 180px;
          background: rgba(115, 193, 206, 0.24);
          border-radius: 8px;
        }
        &.active::before {
          content: '';
          display: block;
          width: 269px;
          height: 157px;
          background-image: url('../../../assets/images/home/形状 52 拷贝 2.svg');
          background-repeat: no-repeat;
          background-size: 100%;
          transform: translate(-3.5%, -7%);
        }
        &.active2::before {
          content: '';
          display: block;
          width: calc(269px + calc(269px / 3));
          height: calc(157px + calc(157px / 3));
          background-image: url('../../../assets/images/home/形状 52 拷贝 2.svg');
          background-repeat: no-repeat;
          background-size: 100%;
          transform: translate(-3.5%, -7%);
        }
        &.prev,
        &.next {
          width: 212px;
          height: 111px;
          background: rgba(115, 193, 206, 0.24);
          border-radius: 8px;
        }

        &.prev2,
        &.next2 {
          width: calc(212px + calc(212px / 3));
          height: calc(111px + calc(111px / 3));
          background: rgba(115, 193, 206, 0.24);
          border-radius: 8px;
        }

        &.prev::before,
        &.next::before {
          content: '';
          display: block;
          width: 229px;
          height: 134px;
          background-image: url('../../../assets/images/home/形状 52 拷贝 2(1).svg');
          background-size: 100%;
          background-repeat: no-repeat;
          transform: translate(-3.5%, -8.5%);
        }
        &.prev2::before,
        &.next2::before {
          content: '';
          display: block;
          width: calc(229px + calc(229px / 3));
          height: calc(134px + calc(134px / 3));
          background-image: url('../../../assets/images/home/形状 52 拷贝 2(1).svg');
          background-size: 100%;
          background-repeat: no-repeat;
          transform: translate(-3.5%, -8.5%);
        }

        &.prev_2,
        &.next_2 {
          width: 162px;
          height: 86px;
          background: rgba(115, 193, 206, 0.24);
          border-radius: 8px;
        }
        &.prev_2::before,
        &.next_2::before {
          content: '';
          width: 182px;
          height: 106px;
          background-image: url('../../../assets/images/home/形状 52 拷贝 2(4).svg');
          background-repeat: no-repeat;
          background-size: 100%;
          transform: translate(-5.5%, -10%);
        }
      }
    }
  }
  .slider-content.top {
    position: relative;
    width: 100%;
    height: calc(100% - 20px);
    left: 0%;
    top: 10% !important;
  }
  .dots {
    width: 100%;
    height: 20px;
    span {
      display: inline-block;
      width: 20px;
      height: 2px;
      margin: 1px 3px;
      cursor: pointer;
    }
  }
}
</style>
