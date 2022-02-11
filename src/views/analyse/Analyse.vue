<template>
  <div class="analyse">
    <div class="content_con">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="智能分析" name="first">
            <DataRow :list="list" typex="a" />
            <ListA @setParams="initParams_1" ref="list_a" />
            <!-- 第一个分页 -->
            <div class="pagination_con">
              <div class="left" @click="first_page_1">首页</div>
              <el-pagination
                background
                :current-page="params_1.pageNum"
                :page-size="params_1.pageSize"
                layout="prev, pager, next"
                :total="total_1"
                @current-change="handleCurrentChange_1"
              >
              </el-pagination>
              <div class="right" @click="last_page_1">末页</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="智能抓拍" name="second">
            <DataRow typex="b" />
            <ListB :pageNum="params_2.pageNum" @setParams="initParams_2" />
            <!-- 第二个分页 -->
            <div class="pagination_con">
              <div class="left" @click="first_page_2">首页</div>
              <el-pagination
                background
                :current-page="params_2.pageNum"
                :page-size="params_2.pageSize"
                layout="prev, pager, next"
                :total="total_2"
                @current-change="handleCurrentChange_2"
              >
              </el-pagination>
              <div class="right" @click="last_page_2">末页</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="名单预警" name="third">
            <DataRow typex="c" />
            <ListC :pageNum="params_3.pageNum" @setParams="initParams_3" />

            <!-- 第三个分页 -->
            <div class="pagination_con">
              <div class="left" @click="first_page_3">首页</div>
              <el-pagination
                background
                :current-page="params_3.pageNum"
                :page-size="params_3.pageSize"
                layout="prev, pager, next"
                :total="total_3"
                @current-change="handleCurrentChange_3"
              >
              </el-pagination>
              <div class="right" @click="last_page_3">末页</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="人车轨迹" name="four">
            <DataRow typex="d" />
            <ListD :pageNum="params_4.pageNum" @setParams="initParams_4" />
            <!-- 第四个分页 -->
            <div class="pagination_con">
              <div class="left" @click="first_page_4">首页</div>
              <el-pagination
                background
                :current-page="params_4.pageNum"
                :page-size="params_4.pageSize"
                layout="prev, pager, next"
                :total="total_4"
                @current-change="handleCurrentChange_4"
              >
              </el-pagination>
              <div class="right" @click="last_page_4">末页</div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="研判告警" name="five">
            <DataRow typex="e" />
            <ListE :pageNum="params_5.pageNum" @setParams="initParams_5" />

            <!-- 第五个分页 -->
            <div class="pagination_con">
              <div class="left" @click="first_page_5">首页</div>
              <el-pagination
                background
                :current-page="params_5.pageNum"
                :page-size="params_5.pageSize"
                layout="prev, pager, next"
                :total="total_5"
                @current-change="handleCurrentChange_5"
              >
              </el-pagination>
              <div class="right" @click="last_page_5">末页</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import DataRow from '@/components/content/dataRow/DataRow'
import ListA from './analyseCpn/ListA'
import ListB from './analyseCpn/ListB'
import ListC from './analyseCpn/ListC'
import ListD from './analyseCpn/ListD'
import ListE from './analyseCpn/ListE'

import Pagination from '@/components/content/pagination/Pagination'

import { getClassify } from '@/api/analyse/analyse'

export default {
  components: {
    DataRow,
    Pagination,
    ListA,
    ListB,
    ListC,
    ListD,
    ListE
  },
  data() {
    return {
      /* 事件分类列表 */
      list: [],
      /* 第一个分页区域 */
      total_1: 0,
      params_1: {
        pageNum: 1,
        pageSize: 10
      },
      /* 第二个分页区域 */
      total_2: 0,
      params_2: {
        pageNum: 1,
        pageSize: 14
      },
      /* 第三个分页区域 */
      total_3: 0,
      params_3: {
        pageNum: 1,
        pageSize: 10
      },
      /* 第四个分页区域 */
      total_4: 0,
      params_4: {
        pageNum: 1,
        pageSize: 12
      },
      /* 第五个分页区域 */
      total_5: 0,
      params_5: {
        pageNum: 1,
        pageSize: 10
      },

      activeName: 'first',
    }
  },
  created() {
    this.getClassify()
  },
  methods: {
    /* 网络请求 */
    /* 请求算法事件列表 */
    getClassify() {
      getClassify().then(res => {
        console.log('请求算法事件列表: ', res);
        if (res.code === 200) {
          this.list = res.data
        }
      })
    },

    handleClick(tab, event) {
      // console.log('tab, event: ', tab, event);
    },
    /* 第一个分页区域 */
    /* 设置pageNum */
    initParams_1(params, total) {
      console.log('total: ', total);
      this.total_1 = total;
      this.params_1 = params;
    },
    // 处理分页发生改变
    handleCurrentChange_1(val) {
      this.$refs.list_a.$data.queryParams.pageNum = val;
      this.$refs.list_a.getWarningList();
      this.params_1.pageNum = val;
    },
    first_page_1() {
      this.params_1.pageNum = 1;
    },
    // 末页数据
    last_page_1() {
      const num = this.total_1 / 10
      console.log('num: ', num);
      console.log(' Math.ceil(num): ', Math.ceil(num));
      this.params_1.pageNum = Math.ceil(num);

    },

    /* 第二个分页区域 */
    /* 设置pageNum */
    initParams_2(params, total) {
      this.total_2 = total;
      this.params_2 = params;
    },
    // 处理分页发生改变
    handleCurrentChange_2(val) {
      this.params_2.pageNum = val;
    },
    first_page_2() {
      this.params_2.pageNum = 1;
    },
    // 末页数据
    last_page_2() {
      const num = this.total_2 / 14;
      this.params_2.pageNum = Math.ceil(num);
    },

    /* 第三个分页区域 */
    initParams_3(params, total) {
      this.total_3 = total;
      this.params_3 = params;
    },
    // 处理分页发生改变
    handleCurrentChange_3(val) {
      this.params_3.pageNum = val;
    },
    first_page_3() {
      this.params_3.pageNum = 1;
    },
    // 末页数据
    last_page_3() {
      const num = this.total_3 / 10
      this.params_3.pageNum = Math.ceil(num);
    },

    /* 第四个分页区域 */
    initParams_4(params, total) {
      this.total_4 = total;
      this.params_4 = params;
    },
    // 处理分页发生改变
    handleCurrentChange_4(val) {
      this.params_4.pageNum = val;
    },
    first_page_4() {
      this.params_4.pageNum = 1;
    },
    // 末页数据
    last_page_4() {
      const num = this.total_4 / 12
      this.params_4.pageNum = Math.ceil(num);
    },


    /* 第五个分页区域 */
    initParams_5(params, total) {
      this.total_5 = total;
      this.params_5 = params;
    },
    // 处理分页发生改变
    handleCurrentChange_5(val) {
      this.params_5.pageNum = val;
    },
    first_page_5() {
      this.params_5.pageNum = 1;
    },
    // 末页数据
    last_page_5() {
      const num = this.total_5 / 10
      this.params_5.pageNum = Math.ceil(num);
    },
  },
}
</script>

<style lang="less" scoped>
.analyse {
  box-sizing: border-box;
  padding: 16px 10px;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .content_con {
    display: flex;
    justify-content: center;
    align-items: center;

    box-sizing: border-box;
    padding: 33px 29px;
    width: 1900px;
    height: 976px;
    background-image: url('../../assets/images/control/control.svg');
    background-repeat: no-repeat;
    background-size: 100%;

    .content {
      position: relative;
      box-sizing: border-box;
      padding: 17px 14px;
      width: 1848px;
      height: 910px;
      background: #2a36464f;
      border-radius: 10px;
    }
  }
}

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

// 顶部背景色
::v-deep .el-tabs__header {
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 10px;
  width: 1813px;
  height: 64px;
  background: #09152160;
  border-radius: 10px;
}

::v-deep .el-tabs__active-bar {
  background: #6fe9ceff !important;
}

::v-deep .is-active {
  transition: all 0.3s;
  color: #6fe9ceff;
}

::v-deep .el-tabs__item:hover {
  color: #6fe9ceff !important;
  cursor: pointer;
  transition: all 0.3s;
}

::v-deep .el-tabs__nav-wrap::after {
  background: transparent;
}

::v-deep .el-tab-pane,
::v-deep .el-tabs__content {
  background: transparent !important;
  box-shadow: none !important;
}

// el-tas-conten 高度
::v-deep .el-tabs__content {
  height: 829px !important;
}

/deep/ .el-tabs__item,
/deep/ .is-top {
  color: #fff;
  font-weight: 500;
  transition: all 0.3s;
}

/deep/.el-tabs__header {
  margin: 0;
}
/deep/.el-tabs__nav-wrap {
  padding: 0 12px;
}
/deep/.el-tabs__content {
  height: calc(100% - 40px);
  background-color: #f2f2f2;
}
/deep/.el-tab-pane {
  height: calc(100% - 24px);
  background-color: #ffffff;
  margin: 12px;
  box-shadow: 0px 1px 1px #ffffffcc inset, 0px 1px 5px #00000066;
}
</style>