<template>
  <div class="container">
    <!-- 头部 -->
    <Header @onSearch="getSearchList" />
    <!-- 内容区 -->
    <Scroll ref="scroll" class="content">
      <List @refresh="onRefresh" />
    </Scroll>
  </div>
</template>

<script>
import Header from '@/components/content/homeCpn/leftBottomCpns/Header'
import List from '@/components/content/homeCpn/leftBottomCpns/List'
import Scroll from '@/components/common/scroll/Scroll'

export default {
  components: {
    Header,
    List,
    Scroll
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {

  },
  methods: {
    /** 
    * 网络请求区域
    */
    // 获取搜索列表
    getSearchList(value) {
      console.log(value);
    },


    onRefresh() {
      this.$refs.scroll.refresh()
    },

  },
}
</script>

<style lang="less" scoped>
.container {
  overflow: hidden; // 超出部分隐藏
  box-sizing: border-box;
  padding: 20px 16px;
  width: 339px;
  height: 677px;
  background: rgba(43, 55, 84, 0.5);
  border: 1px solid #84ece4;
  border-radius: 19px;

  .content {
    height: calc(100% - 16px);
    overflow: hidden;
    margin-top: 16px;
  }
}
</style>