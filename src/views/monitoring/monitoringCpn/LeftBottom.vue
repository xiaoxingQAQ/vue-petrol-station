<template>
  <div class="left_bottom" :class="{hide: hide}">
    <Header>
      <template #title>
        <span>云镜控制</span>
      </template>
    </Header>
    <!-- 模糊 -->
    <div class="dim"></div>
    <main>
      <div>
        <div>变焦</div>
        <div>
          <i class="iconfont icon-jian-xianxingfangkuang"></i>
          <el-slider :show-tooltip="false" v-model="value_1"></el-slider>
          <i class="iconfont icon-jia"></i>
        </div>
      </div>

      <div>
        <div>聚焦</div>
        <div>
          <i class="iconfont icon-jian-xianxingfangkuang"></i>
          <el-slider :show-tooltip="false" v-model="value_2"></el-slider>
          <i class="iconfont icon-jia"></i>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/content/monitoringCpn/Header'

export default {
  components: {
    Header
  },
  props: {
    hide: {
      type: Boolean,
    }
  },
  data() {
    return {

      value_1: 15,
      value_2: 30,
    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.left_bottom {
  position: relative;
  overflow: hidden;
  transition: all 300ms;
  &.hide {
    transform: translateY(293px);
  }

  .dim {
    width: 291px;
    height: 283px;
    border-radius: 0px 0px 18px 18px;
  }

  main {
    position: absolute;
    top: 39px;
    box-sizing: border-box;
    padding: 16px 18px;
    width: 291px;
    height: 283px;
    > div {
      display: flex;
      flex-direction: column;
      div:first-child {
        font-size: 12px;
        font-weight: 500;
        line-height: 17px;
        text-align: center;
        color: #ffffff;
        white-space: nowrap;
      }

      div:last-child {
        display: flex;
        align-items: center;
        i {
          width: 20px;
          height: 20px;
          color: #ffffff;
        }
        i:first-child {
          transform: translate(5px,-2px);
          font-size: 17px;
        }
        i:last-child {
          transform: translate(0, -1px);
        }
      }
    }
  }
}

::v-deep.el-slider {
  width: 211px;
  margin: 0 5px;
}
</style>