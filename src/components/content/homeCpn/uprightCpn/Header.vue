<!--
 * @Author: :your name
 * @Date: 2021-12-09 20:17:06
 * @LastEditors: :your name
 * @LastEditTime: 2021-12-30 18:15:41
 * @Description: :file content
-->
<template>
  <header>
    <!-- 左侧 -->
    <div>
      <span>绩效评分排名</span>
    </div>
    <!-- 右侧 -->
    <div>
      <!-- 查询 -->
      <el-select @visible-change="onChange" v-model="value" placeholder="">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" :loading="loading" @click="search"
        >查询</el-button
      >
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      loading: false,

      isChange: false, // true 旋转三角形
      value: null,
      options: [],
    }
  },
  methods: {
    onChange() {
      this.isChange = !this.isChange
    },
    // 处理查询
    search() {
      if (!this.value) return this.$message.warning('请选择')
      this.loading = true

      this.$emit('onSearch',) // 请求出结果后 发送
    },
  },
}
</script>

<style lang="less" scoped>
// 头部
header {
  margin-bottom: 12px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  div:nth-child(1) {
    display: flex;
    align-items: center;
    padding-left: 6px;
    span {
      font-size: 14px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  div:last-child {
    position: relative;
    display: flex;
    justify-content: space-between;

    .el-button {
      margin-left: 8px;
    }
  }
}

::v-deep .el-input__inner {
  width: 100px !important;
  height: 32px;
  color: #fff;
  background: rgba(50, 55, 83, 0.226) !important;
  border: 1px solid #84ece4;
  opacity: 0.61;
}
</style>
