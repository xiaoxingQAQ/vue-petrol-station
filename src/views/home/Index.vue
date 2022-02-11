<template>
  <div class="top_nav" @mousemove="handleMove">
    <!-- 顶部背景 -->
    <div class="top_wrapper">
      <img src="@/assets/images/home/组 798.png" alt="" />
    </div>
    <main>
      <!-- 左边区域 -->
      <div class="left">
        <div class="top">
          <Upleft />
        </div>
        <div class="bottom">
          <LeftBottom />
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="center">
        <div class="top">
          <Swiper />
        </div>
        <div class="bottom">
          <video
            v-show="isShow"
            class="bottom"
            src="http://139.159.213.75:9000/server/resource/video/welcome-video.mp4"
            muted
            autoplay
            loop
          ></video>
          <AMap
            ref="AMap"
            v-show="!isShow"
            @changeVal="handleChangeVisible"
            @visibleA="visibleA"
            @handleVisible="handleVisible"
          />
        </div>
      </div>

      <!-- 右边区域 -->
      <div class="right">
        <div class="top">
          <Upright />
        </div>
        <div class="bottom">
          <RightBottom ref="rbottom" />
        </div>
      </div>
    </main>

    <!-- dialog -->
    <DialogA
      :isHome="true"
      @open="visible_a = true"
      @cancel="handleCancel"
      :visible="visible_a"
      :cur_data="cur_data"
    />
    <DialogB @cancel="handleCancel" :visible="visible_b" :cur_data="cur_data" />
    <DialogC @cancel="handleCancel" :visible="visible_c" :cur_data="cur_data" />
    <DialogD @cancel="handleCancel" :visible="visible_d" :cur_data="cur_data" />

    <!-- 加油站弹窗 -->
    <LeftBottomDialog
      @resetCancel="resetCancel"
      @getVehicles="getVehicles"
      :visible="visible_e"
      :stationObj="stationObj"
      :orgId="stationObj ? stationObj.dataResTitle.orgId : ''"
    />
    <!-- 查看进站车辆弹窗 -->
    <VehicleDiglog
      @VehicleDiglogCancel="VehicleDiglogCancel"
      :stopTheVehicleKey="stopTheVehicleKey"
      :orgIdVeh="stationObj ? stationObj.dataResTitle.orgId : ''"
    />
  </div>
</template>

<script>
import Upleft from '@/views/home/homeCpn/Upleft';
import LeftBottom from '@/views/home/homeCpn/LeftBottom';

import Upright from '@/views/home/homeCpn/Upright';
import RightBottom from '@/views/home/homeCpn/RightBottom';

import Swiper from '@/views/home/homeCpn/Swiper';
import AMap from './homeCpn/AMap';

import DialogA from '@/components/content/dialog/analyse/DialogA';
import DialogB from '@/components/content/dialog/analyse/DialogB';
import DialogC from '@/components/content/dialog/analyse/DialogC';
import DialogD from '@/components/content/dialog/analyse/DialogD';

import LeftBottomDialog from '@/components/content/homeCpn/leftBottomCpns/LeftBottomDialog'
import VehicleDiglog from '@/components/content/homeCpn/leftBottomCpns/VehicleDiglog'

export default {
  components: {
    Upleft,
    LeftBottom,
    Upright,
    RightBottom,
    Swiper,
    AMap,

    DialogA,
    DialogB,
    DialogC,
    DialogD,

    LeftBottomDialog,
    VehicleDiglog
  },
  data() {
    return {

      timer: null, // 定时器id
      // 自定义事件传入
      record_1: false,
      record_2: false,

      list_1: [],

      isShow: false, // 默认显示视频 true 显示视频

      cur_data: {}, // 传给dialog的是数据
      visible_a: false,
      visible_b: false,
      visible_c: false,
      visible_d: false,
      visible_e: false,
      stopTheVehicleKey: false,
      stopTheVehicleArr: [],
      visibleMap: false,
      stationObj: '',

      list: [],
      swiperList: [
        { id: 0, title: '工作脱岗告警', data: 500 },
        { id: 1, title: '安全行为告警', data: 20 },
        { id: 2, title: '安全生产告警', data: 300 },
        { id: 3, title: '安全防范告警', data: 20 },
        { id: 4, title: '环境卫生告警', data: 2 },
      ], // 轮播图数据
      videoInterval: 0,
    };
  },
  created() {

  },
  mounted() {
    this.resetCancelInit()
    this.change_f();
    this.openDialog();
    // 初始化
    this.initVideo();
  },
  watch: {
    visible_a(val) {
      val ? this.closeVideo() : this.restVideo();
      if (val) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.visible_a = false;
        }, 20000);
      } else {
        clearTimeout(this.timer);
      }
    },
  },
  methods: {
    resetCancelInit() {
      this.$bus.$on('showDialog', (data) => {
        this.stationObj = data
        this.visible_e = true
      })
    },
    // 打开进站车辆弹窗
    getVehicles() {
      this.stopTheVehicleKey = true
      this.visible_e = false
    },
    // 关闭进站车辆弹窗
    VehicleDiglogCancel() {
      this.stopTheVehicleKey = false
      this.visible_e = true
    },
    // 加油站弹窗关闭
    resetCancel() {
      this.visible_e = false
    },
    // 处理鼠标移动事件
    handleMove() {
      if (
        this.record_1 ||
        this.record_2 ||
        this.visible_a ||
        this.visible_b ||
        this.visible_c ||
        this.visible_d ||
        this.visibleMap
      )
        return;
      this.isShow = false;
      this.restVideo();
    },
    initVideo() {
      console.log('初始化了定时器');
      this.videoInterval = setInterval(() => {
        this.isShow = true;
      }, 20000);
    },
    restVideo() {
      this.isShow = false;
      clearInterval(this.videoInterval);

      this.videoInterval = setInterval(() => {
        this.isShow = true;
      }, 20000);
    },
    closeVideo() {
      this.isShow = false;
      console.log('关闭视频', this.videoInterval);
      clearInterval(this.videoInterval);
    },
    /* $bus的自定义事件 */
    /* 初始化 */
    change_fy() {
      this.$bus.$on('change_fy', (list) => {
        console.log('数组', list);
        this.list = list;
      });
    },

    // 判断 是否播放视频
    change_f() {
      this.$bus.$on('change_f', (list) => {
        console.log('数组', list);
        this.list = list;

        this.restVideo();
        this.visible_a = true;
        this.cur_data = list[0];
      });
    },
    // 自定义事件 打开dialog
    openDialog() {
      this.$bus.$on('openDialog', (item) => {
        this.cur_data = item;
        switch (item.eventCode) {
          case 'face_captured':
            this.visible_d = true
            return '人脸抓拍';
          case 'fire':
            this.visible_a = true
            return '烟火检测';
          case 'phone':
            this.visible_a = true
            return '使用手机';
          case 'smoking':
            this.visible_a = true
            return '吸烟检测';
          case 'extinguisher':
            this.visible_a = true
            return '设备监控';
          case 'box':
            this.visible_a = true
            return '物品占道';
          case 'car':
            this.visible_a = true
            return '车辆占道';
          case 'car_captured':
            this.visible_c = true
            return '车辆抓拍';
          case 'riding':
            this.visible_b = true
            return '骑行抓拍';
          case 'personnel_sleepling_post':
            this.visible_b = true
            return '人员睡岗';
          case 'service_leaving':
            this.visible_a = true
            return '服务离岗';
          case 'job_leaving':
            this.visible_a = true
            return '作业离岗';
          case 'supervisor_off_duty':
            this.visible_a = true
            return '主管脱岗';
          case 'helmet_detection':
            this.visible_a = true
            return '安全帽检测';
          case 'oil_unloading_and_off_duty':
            this.visible_a = true
            return '卸油离岗';
          case 'smoke':
            this.visible_a = true
            return '烟雾检测';
          case 'person_leave':
            this.visible_a = true
            return '人员离岗';
          case 'person':
            this.visible_a = true
            return '非法入侵';
          default:
            this.visible_a = true
            return '其他类型';
        }
      });
    },
    /* 处理关闭dialog */
    handleCancel() {
      this.visible_a = false;
      this.visible_b = false;
      this.visible_c = false;
      this.visible_d = false;
    },
    // 自定义事件
    visibleA(record) {
      this.record_1 = record;
      record ? this.closeVideo() : this.restVideo();
    },
    handleVisible(record) {
      this.record_1 = record;
      console.log('关闭调用');
      record ? this.closeVideo() : this.restVideo();
    },
    handleChangeVisible(val) {
      this.visibleMap = val;
      console.log('val: ', val);
      val ? this.closeVideo() : this.restVideo()
    },
  },
  beforeDestroy() {
    this.closeVideo();
  },
};
</script>

<style lang="less" scoped>
// 顶部背景
.top_wrapper {
  position: absolute;
  left: 50%;
  width: 1178px;
  height: 102px;
  transform: translateX(-50%);
  img {
    width: 100%;
  }
}

main {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 10px;

  .left,
  .right {
    .top,
    .bottom {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .left {
    height: 100%;
    margin-top: 21px;
    .top {
      margin-bottom: 10px;
      width: 360px;
      height: 273px;
      background-image: url('../../assets/images/home/图层 31(1).svg');
      background-size: 100% 100%;
    }
    .bottom {
      width: 360px;
      height: 707px;
      background: url('../../assets/images/home/图层 31.svg') no-repeat;
      background-size: 100%;
    }
  }

  .center {
    margin: 118px 10px 0;
    .top {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      /* margin-bottom: 51px; */
      width: 1178px;
      height: 270px;
      transform: translateY(-20%);
      // background-color: #eee;
    }
    .bottom {
      margin-top: 110px;
      width: 1178px;
      height: 663px;
      border-radius: 8px;
    }
  }

  .right {
    margin-top: 21px;
    .top {
      margin-bottom: 10px;
      width: 345px;
      height: 392px;
      background-image: url('../../assets/images/home/图层 31(2).svg');
      background-size: cover;
    }
    .bottom {
      width: 345px;
      height: 588px;
      background-image: url('../../assets/images/home/图层 31(3).svg');
      background-size: cover;
    }
  }
}
</style>
