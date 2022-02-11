<template>
  <div class="top_nav">
    <AMap />
  </div>
</template>

<script>
import AMap from "../home/homeCpn/AMap.vue";

export default {
  components: {
    AMap,
  },
  data() {
    return {};
  },
  methods: {
    // // 自定义事件
    // visibleA(record) {
    //   this.record_1 = record;
    //   console.log(this.videoInterval);
    //   record ? this.closeVideo() : this.restVideo();
    // },
    // handleVisible(record) {
    //   this.record_1 = record;
    //   console.log("关闭调用");
    //   record ? this.closeVideo() : this.restVideo();
    // },
  },
};
</script>
