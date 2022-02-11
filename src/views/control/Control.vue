<template>
  <div class="control">
    <div class="content_con">
      <div class="content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="人脸布控" name="first">
            <ListA :pageNum="params_1.pageNum" @setParams="initParams_1" />
            <!-- 分页 -->
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
          <el-tab-pane label="车辆布控" name="second">
            <ListB />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/content/pagination/Pagination'

import ListA from './controlCpn/ListA'
import ListB from './controlCpn/ListB'

export default {
  components: {
    Pagination,
    ListA,
    ListB
  },
  props: {

  },
  data() {
    return {
      /* 第一个分页区域 */
      total_1: 0, // 分页的数据
      params_1: {
        pageNum: 1,
        pageSize: 6
      },
      activeName: 'first', // 默认的title

    }
  },
  methods: {
    /* 分页区域 */
    // 初始化分页数据
    initParams_1(params, totla) {
      this.params_1 = params;
      this.total_1 = totla;
    },
    // 处理分页改变
    handleCurrentChange_1(val) {
      this.params_1.pageNum = val
    },
    first_page_1() {
      this.params_1.pageNum
      this.params_1.pageNum = 1;
    },
    last_page_1() {
      const num = this.total_1 / 6
      this.params_1.pageNum = Math.ceil(num);
    },

    // tabs click
    handleClick(tab, event) {
      console.log(tab, event);
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    }
  },
}
</script>

<style lang="less" scoped>
.control {
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

// table 表格

// el-tas-conten 高度
::v-deep .el-tabs__content {
  height: 829px !important;
}

// 顶部背景色
::v-deep .el-tabs__header {
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 10px;
  // width: 1813px;
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
  padding: 10px;
  box-shadow: 0px 1px 1px #ffffffcc inset, 0px 1px 5px #00000066;
}
// 滚动条的宽度
/deep/.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块
/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #6fe9ce;
  border-radius: 3px;
}
/deep/.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #fff;
}
// 分页样式修改
/deep/.el-pagination__total {
  color: #fff;
}
/deep/.el-pagination__jump {
  color: #fff;
}
/deep/.el-pagination__total {
  color: #fff;
}
/deep/.el-pagination .btn-next {
  padding: 0;
}
/deep/.el-pagination .btn-prev {
  padding: 0;
}
/deep/.el-pager li {
  margin: 0 0.0625rem;
  background-color: transparent !important;
  color: #fff !important;
  min-width: 0.375rem;
  border-radius: 0.025rem;
}
/deep/.el-pager li.active {
  background-color: #7bf5d4ff !important;
  color: #000 !important;
}
/deep/.el-select .el-input .el-select__caret {
  color: #fff;
}
/deep/.el-input__count {
  color: #fff;
  background: none;
}
/deep/.el-select {
  width: 100%;
}
</style>