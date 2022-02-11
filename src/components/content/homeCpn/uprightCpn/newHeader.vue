<template>
  <div class="warp">
    <img src="@/assets/images/slices.png" alt="" />
    <div class="PassengerFlow">
      <p style="font-size: 15px; font-weight: 500; color: #07ffeb">
        {{ passenger }}
      </p>
      <p style="font-size: 13px; font-weight: 500">今日客流</p>
    </div>
    <img src="@/assets/images/slices2.png" alt="" />
    <div class="PassengerFlow">
      <p style="font-size: 15px; font-weight: 500; color: #07ffeb">
        {{ history }}
      </p>
      <p style="font-size: 13px; font-weight: 500">历史同期</p>
    </div>
  </div>
</template>

<script>
import { getCaptureSelectHistory } from "@/api/oilStation"
export default {
  data() {
    return {
      passenger: null,
      history: null
    }
  },
  mounted() {
    this.$bus.$on('customerNumOn', (data) => {
      this.passenger = data
    })
    // const orgId = this.$store.getters.info.user.orgId;
    const orgId = 103;
    getCaptureSelectHistory({ orgId }).then(res => {
      this.history = res.data
    })
  },
  methods: {

  },
}
</script>

<style lang="less" scoped>
.warp {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding-bottom: 20px;
  img {
    width: 65px;
    height: 61px;
  }
  .PassengerFlow {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    p {
      margin: 0;
      color: #fff;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
