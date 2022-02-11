<template>
  <div class="left_center" :class="{ hide: hide }">
    <Header>
      <template #title>
        <span>录像回放</span>
      </template>
    </Header>
    <!-- 模糊 -->
    <div class="dim"></div>
    <main>
      <!-- 录像回放 -->
      <div class="title">
        <i class="iconfont icon-jian-xianxingfangkuang"></i>
        <span>录像回放</span>
      </div>

      <ul class="main">
        <li>
          <span>选择日期</span>
          <div>
            <el-date-picker
              v-model="value_1"
              type="date"
              placeholder="请选择日期"
              size="small"
            >
            </el-date-picker>
          </div>
        </li>
        <li>
          <span>开始时间</span>
          <div>
            <el-time-picker
              size="small"
              v-model="value_2"
              @change="handleChange_1"
              placeholder="任意时间点"
            >
            </el-time-picker>
          </div>
        </li>
        <li>
          <span>结束时间</span>
          <div>
            <el-time-picker
              size="small"
              v-model="value_3"
              @change="handleChange_1"
              placeholder="任意时间点"
            >
            </el-time-picker>
          </div>
        </li>
        <li>
          <span>通道选择</span>
          <div></div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script>
import '@/assets/css/element-reset.css';
import Header from '@/components/content/monitoringCpn/Header'
export default {
  components: {
    Header
  },
  props: {
    hide: {
      type: Boolean,
    },
    list: {
      type: Array,
      default() {
        return [
          { id: 1, title: '1' },
          { id: 2, title: '4' },
          { id: 3, title: '9' },
          { id: 4, title: '16' },
        ]
      }
    },
  },
  data() {
    return {
      value_1: '',
      value_2: '',
      value_3: '',

      currentIndex: 3,
    }
  },
  methods: {
    onChange(index) {
      console.log(11);
      this.currentIndex = index
    },
    handleChange_1() { },
    handleChange_1() { },
  },
}
</script>

<style lang="less" scoped>
.left_center {
  position: relative;
  overflow: hidden;
  transition: all 300ms;
  &.hide {
    transform: translateY(527px);
  }
  .dim {
    width: 293px;
    height: 233px;
  }

  main {
    position: absolute;
    top: 39px;
    box-sizing: border-box;
    padding: 19px 18px;
    width: 293px;
    height: 233px;
    .title {
      display: flex;
      color: #fff;
      i {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 10px;
        width: 20px;
        height: 20px;
      }
      span {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #6fe9ce;
      }
    }

    .main {
      display: flex;
      flex-direction: column;
      padding-left: 30px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: #ffffff;
      li {
        display: flex;
        align-items: center;
        margin-right: 12px;
        margin-top: 8px;
        width: 266px;
        height: 30px;
        div:first-child {
          margin-right: 12px;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
        }
      }
      li:nth-child(1),
      li:nth-child(2),
      li:nth-child(3),
      li:nth-child(4) {
        div:nth-child(2) {
          padding-left: 12px;
        }
      }
    }
  }
}

::v-deep .el-date-editor.el-input,
::v-deep .el-date-editor.el-input__inner {
  width: 158px !important;
}
</style>