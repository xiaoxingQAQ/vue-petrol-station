/* 监控中心页面 */
<template>
  <div class="container">
    <div class="left_con">
      <Upleft :hide="hide" />
      <!-- <div :class="['box', {hide: hide}]" @click="handleChange">
        <i class="iconfont icon-xiangxia"></i>
      </div> -->
      <!-- <LeftCenter :hide="hide" class="left_center" />
      <LeftBottom :hide="hide" /> -->
    </div>

    <div class="right_con">
      <div class="main">
        <div>
          <Main
            :status="status"
            :index="currentIndex"
            @changeIndex="changeIndex"
          />
        </div>
      </div>
      <div class="footer">
        <div class="left">
          <img src="@/assets/images/monitoring/组 545.svg" alt="" />
          <div class="dpi">
            <div class="split">
              <span>分辨率调整</span>
              <span></span>
            </div>
            <ul>
              <li
                v-for="(item, index) in list2"
                :key="index"
                :class="{ active: currentIndex2 == item.id }"
                @click="onChange2(item.id)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="right">
          <div>
            <div>分页预览</div>
            <span></span>
          </div>

          <ul>
            <li
              v-for="(item, index) in list"
              :key="index"
              :class="{ active: currentIndex == item.id }"
              @click="onChange(item.id)"
            >
              {{ item.name }}
            </li>
          </ul>

          <div>
            <span></span>
            <!-- <div @click="changePreview">
              <i :class="['iconfont icon-fangda-', { active: status }]"></i>
              <span :class="{ active: status }">预览模式</span>
            </div> -->
            <img src="@/assets/images/monitoring/组 544.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Upleft from '@/views/monitoring/monitoringCpn/UpLeft';
import LeftCenter from '@/views/monitoring/monitoringCpn/LeftCenter';
import LeftBottom from '@/views/monitoring/monitoringCpn/LeftBottom';
import Main from '@/views/monitoring/monitoringCpn/Main';

export default {
  components: {
    Upleft,
    LeftCenter,
    LeftBottom,
    Main,
  },
  data() {
    return {
      hide: true, // 是否折叠
      status: false, // 预览模式

      currentIndex2: 1, // 分辨率
      currentIndex: 1, // 当前分页
      list: [
        { id: 1, name: 1 },
        { id: 2, name: 2 },
        { id: 3, name: 3 },
        { id: 4, name: 4 },
      ],
      list2: [
        { id: 1, name: '高' },
        // { id: 2, name: '中' },
        // { id: 3, name: '低' },
      ],
    };
  },
  methods: {
    // 回放预览 不同宫格模式
    onChange(index) {
      this.currentIndex = index;
    },
    onChange2(index) {
      this.currentIndex2 = index;
    },
    changeIndex(val) {
      this.currentIndex = val;
    },
    // 处理折叠
    handleChange() {
      this.hide = !this.hide;
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  display: flex;

  padding: 16px 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.left_con {
  box-sizing: border-box;
  margin-right: 10px;
  padding: 16px 10px;
  width: 311px;
  height: 100%;
  background-image: url('../../assets/images/monitoring/图层 （left）.svg');
  background-repeat: no-repeat;
  background-size: 100%;

  overflow: hidden;
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 291px;
    height: 20px;
    background-color: transparent;
    transition: all 300ms;
    transform: translateY(-5px);
    &.hide {
      transform: translateY(516px);
      i {
        transform: rotateZ(180deg);
      }
    }

    i {
      font-size: 30px;
      font-weight: bold;
      color: #fff;
    }
  }
}

.right_con {
  position: relative;
  flex: 1;
  height: 100%;
  .main {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1579px;
    height: 938px;
    background-image: url('../../assets/images/monitoring/图层 31.svg');
    background-size: 100%;
    > div {
      width: 1536px;
      height: 870px;
    }
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 1579px;
    height: 62px;

    .left {
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }

      .dpi {
        display: flex;
        align-items: center;
        .split {
          display: flex;
          align-items: center;
          span:first-child {
            font-size: 14px;
            font-weight: 500;
            color: #ffffff;
            cursor: pointer;
          }
          span:last-child {
            margin-left: 11px;
            width: 2px;
            height: 20px;
            background-color: #30e9f8ff;
          }
        }
        ul {
          display: flex;
          align-items: center;
          margin: 0 !important;
          li {
            width: 42px;
            height: 30px;
            margin-left: 8px;
            text-align: center;
            line-height: 30px;
            border-radius: 15px;

            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            color: #fff;
            &.active {
              color: #000;
              background: linear-gradient(
                90deg,
                #0084b5 0%,
                #3de8e8 48%,
                #a8ffc5 100%
              );
            }
          }
        }
      }
    }

    .right {
      display: flex;
      > div:nth-child(1) {
        display: flex;
        align-items: center;
        div {
          font-size: 12px;
          color: #fff;
          font-weight: 500;
          margin-right: 12px;
        }
        span {
          margin-right: 15px;
          width: 2px;
          height: 20px;
          background-color: #30e9f8ff;
        }
      }

      ul {
        display: flex;
        transform: translateY(6px);
        li {
          width: 42px;
          height: 30px;
          margin-left: 8px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          font-weight: bold;
          color: #ffffff;
          border-radius: 15px;
          cursor: pointer;
          &.active {
            color: #000;
            background: linear-gradient(
              90deg,
              #0084b5 0%,
              #3de8e8 48%,
              #a8ffc5 100%
            );
          }
        }

        li:first-child {
          margin: 0 !important;
        }
      }

      > div:last-child {
        display: flex;
        align-items: center;
        margin-left: 15px;
        span:first-child {
          margin-right: 15px;
          width: 2px;
          height: 20px;
          background-color: #30e9f8ff;
        }

        div:nth-child(2) {
          display: flex;
          i {
            display: flex;
            justify-content: center;
            align-items: center;

            color: #fff;
            margin-right: 5px;
            width: 17px;
            height: 17px;
            &.active {
              color: #f56c6c;
            }
          }
          span {
            font-size: 12px;
            color: #fff;
            font-weight: 500;
            margin-right: 12px;
            &.active {
              color: #f56c6c;
            }
          }
        }
        img {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
