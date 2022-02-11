<template>
  <header>
    <!-- 左侧 -->
    <div>
      <div>
        <img src="@/assets/images/home/map-gas-full.svg" alt="" />
      </div>
      <span>油站数据</span>
    </div>
    <!-- 右侧 -->
    <div style="width: 100%">
      <!-- 查询 -->
      <a-tree-select
        show-search
        style="width: 100%"
        v-model="value"
        :tree-data="treeData"
        :replaceFields="replaceFields"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        placeholder="模糊搜索"
        allow-clear
      >
      </a-tree-select>
      <el-button
        type="primary"
        size="mini"
        :loading="loading"
        @click="handleQuery"
        >查询</el-button
      >
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      replaceFields: {
        children: 'children',
        title: 'label',
        key: 'label',
        value: 'label'
      },
      treeExpandedKeys: [],
      treeData: [],
      value: null,

      loading: false, // btn loading
      isChange: false, // true 旋转三角形
    };
  },
  created() {
    this.treeData = this._.cloneDeep(this.$store.getters.info.deptPermission);
    this.treeData = this.renderTreeNodes(this.treeData)
  },
  mounted() {
  },
  methods: {
    /* 递归 禁用含有数组的 父节点禁用 */
    renderTreeNodes(data) {
      const setData = data.map(item => {
        if (item.children && item.children.length) {
          item.disabled = true;
          this.renderTreeNodes(item.children);
        }
        return item
      })
      return setData
    },
    // 处理查询
    handleQuery() {
      this.$bus.$emit('handleQuery', this.value);
    },
  },
};
</script>

<style lang="less" scoped>
// 头部
header {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 25px;
  div:nth-child(1) {
    display: flex;
    align-items: center;
    margin-right: 10px;
    div {
      margin-right: 16px;
      width: 20px;
      height: 20px;
      img {
        width: 100%;
      }
    }
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

::v-deep .ant-select.ant-select-enabled.ant-select-allow-clear {
  background-color: transparent;
  color: #fff;
}
::v-deep .ant-select-selection__rendered {
  width: 90px !important;
}
::v-deep .ant-select-selection.ant-select-selection--single,
::v-deep .ant-select-dropdown-search {
  width: 120px !important;
  background-color: transparent;
  border-color: #6fe9ceff;
}
::v-deep .ant-select-selection:hover .ant-select-selection__clear {
  background-color: transparent;
  color: #fff;
}
</style>
