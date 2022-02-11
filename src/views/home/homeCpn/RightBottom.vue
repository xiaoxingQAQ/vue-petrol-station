<template>
  <div class="right_bottom">
    <header>
      <span>今日告警通知</span>
    </header>
    <!-- 环形统计图 -->
    <Echarts class="main" />
    <el-badge :value="list.length" class="item">
      <div class="message">
        <span>告警通知</span>
        <i class="iconfont icon-xiaoxi"></i>
      </div>
    </el-badge>
    <!-- 底部 -->
    <Scroll ref="scroll" class="content">
      <Footer ref="footer" @refresh="onRefresh" />
    </Scroll>
  </div>
</template>

<script>
import Echarts from '@/components/content/homeCpn/rightBottom/Echarts'
import Footer from '@/components/content/homeCpn/rightBottom/Footer'

import Scroll from '@/components/common/scroll/Scroll'

export default {
  components: {
    Echarts,
    Footer,
    Scroll
  },
  data() {
    return {
      list: [],
    }
  },
  mounted() {
    this.setDataInit()
    this.setData()
  },
  methods: {
    onRefresh() {
      this.$refs.scroll.refresh()
    },
    setDataInit() {
      this.$bus.$on('change_fy', (list) => {
        this.list = list
      })
    },
    setData() {
      this.$bus.$on('change_f', (list) => {
        this.list = list
      })
    },
  }
}
</script>

<style lang="less" scoped>
.right_bottom {
  position: relative;
  box-sizing: border-box;
  padding: 20px 16px;
  width: 325px;
  height: 560px;
  background: rgba(43, 55, 84, 0.5);
  border: 1px solid #84ece4;
  border-radius: 19px;
  overflow: hidden; // 超出部分隐藏

  > header {
    span {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .main {
    margin-top: 7px;
  }

  .el-badge {
    position: absolute;
    top: 270px;
    .message {
      display: flex;
      align-items: center;
      color: #fff;
      > span {
        font-size: 14px;
      }
      font-weight: 500;
      .icon-xiaoxi {
        font-size: 20px;
      }
    }
  }

  .content {
    height: calc(100% - 265px);
    overflow: hidden;
    margin-top: 12px;
  }
}
::v-deep .el-badge__content {
  border-radius: 12px;
  font-weight: 500;
  border: none;
  top: 5px;
}
</style>