<template>
  <div class="pagination_con">
    <div class="left" @click="first_page">首页</div>
    <el-pagination
      background
      :current-page="params.pageNum"
      :page-size="params.pageSize"
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <div class="right" @click="last_page">末页</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      params: {
        pageNum: 1,
        pageSize: 10
      },
    }
  },
  mounted() {
    // 初始化获取的数据 设置分页参数
    this.init()
  },
  methods: {
    // 初始化获取的数据 设置分页参数
    init() {
      this.$bus.$on('setParams', (params, total) => {
        this.total = total;
        this.params = params;
      })
    },
    handleCurrentChange(val) {
      this.params.pageNum = val;
      this.$bus.$emit('changeNum', val)
    },
    // 首页数据
    first_page() {
      this.params.pageNum = 1;
      this.$bus.$emit('changeNum', 1)
    },
    // 末页数据
    last_page() {
      const num = this.total / 10
      this.params.pageNum = Math.ceil(num);
      this.$bus.$emit('changeNum', Math.ceil(num))
    },
  },
}
</script>

<style lang="less" scoped>
.pagination_con {
  display: flex;

  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%);

  > div {
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }

  .left {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }

  .right {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }
}
</style>