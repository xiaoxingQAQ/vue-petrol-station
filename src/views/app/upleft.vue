<template>
  <div class="Upleft">
    <Header types="2">
      <template slot="title">
        <span>远程监控</span>
      </template>
    </Header>
    <div class="dim_A"></div>
    <main class="main_A" v-if="!hide">
      <Scroll ref="scroll" class="content">
        <el-tree
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          accordion
          :default-expanded-keys="idArr"
          @node-click="handleNodeClick"
        >
          <template class="custom-tree-node" slot-scope="{ data }">
            <span>
              <i :class="data.icon"></i>
              {{ data.label }}
            </span>
          </template>
        </el-tree>
      </Scroll>
    </main>
    <div class="main_B" v-else>
      <Scroll ref="scroll" class="content">
        <el-tree
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          accordion
          :default-expanded-keys="idArr"
          @node-click="handleNodeClick"
        >
          <template class="custom-tree-node" slot-scope="{ data }">
            <span>
              <i :class="data.icon"></i>
              {{ data.label }}
            </span>
          </template>
        </el-tree>
      </Scroll>
    </div>
  </div>
</template>

<script>
import Header from "@/components/content/monitoringCpn/Header";
import Scroll from "@/components/common/scroll/Scroll";

export default {
  components: {
    Header,
    Scroll,
  },
  props: {
    hide: {
      type: Boolean,
    },
  },
  data() {
    return {
      treeList: [],
      idArr: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {},
  mounted() {
    this.handleOrgTree();
    this.treeList.forEach((m) => {
      this.idArr.push(m.id);
    });
  },
  computed: {},
  methods: {
    handleOrgTree() {
      this.treeList = this.$store.getters.info.deptPermission;
      console.log("this.treeList: ", this.treeList);
      this.treeList.map((item) => {
        item.icon = "iconfont icon-zuzhiqunzu";
        item.children.map((i) => {
          i.icon = "iconfont icon-zuzhixiaxia";
          i.children &&
            i.children.map((y) => {
              y.icon = "iconfont icon-jiayouzhan";
            });
        });
      });
    },
    handleNodeClick(data) {
      if (data.type !== "1") {
        this.$bus.$emit("refreshVideo", data.id);
      }

      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 300);
    },
  },
};
</script>

<style lang="less" scoped>
.Upleft {
  position: relative;
}
// 模糊
.dim_B {
  //   width: 291px;
  //   height: 805px;
}

.main_B {
  position: absolute;
  top: 41px;
  box-sizing: border-box;
  padding: 19px 15px 0;
  width: 291px;
  height: 805px;
  overflow: hidden;
}

.dim_A {
  //   width: 291px;
  //   height: 291px;
}

.main_A {
  position: absolute;
  top: 41px;
  box-sizing: border-box;
  padding: 19px 15px 0;
  width: 291px;
  // height: 291px;
  height: 805px;
  overflow: hidden;
}

.content {
  height: calc(100% - 1px);
  overflow: hidden;
}
.el-tree {
  span {
    font-weight: 500;
  }
}

.tree-container {
  //   overflow: auto !important;
}
</style>
