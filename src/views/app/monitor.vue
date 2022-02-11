<template>
  <div style="height: 100%" class="body">
    <div
      style="position: fixed; top: 0; right: 0; font-size: 26px"
      v-if="wu"
      @click="wu = !wu"
    ></div>
    <div
      style="position: fixed; top: 0; right: 0; font-size: 26px"
      v-else
      @click="wu = !wu"
    ></div>
    <div class="left_con" v-show="!wu">
      <!-- <upleft /> -->
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px;
        height: 100%;
        width: 100%;
      "
      class="right_con"
    >
      <!-- 1*1 -->
      <!-- <div style="width: 100%; height: 100%" v-if="selected == 0">
        <el-row
          :gutter="10"
          type="flex"
          style="min-height: 100%"
          justify="center"
        >
          <el-col :span="24">
            <div
              @click="clickVideo(0)"
              :class="videoIndex == 0 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
        </el-row>
      </div> -->
      <!-- 2*2 -->
      <div
        style="width: 100%; height: 50%; margin-top: -160px"
      >
        <el-row :gutter="0" type="flex" style="height: 50%" justify="center">
          <el-col :span="12">
            <div
              @click="clickVideo(0)"
              :class="videoIndex == 0 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              @click="clickVideo(1)"
              :class="videoIndex == 1 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video1"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="0"
          type="flex"
          style="height: 50%"
          class="row-bg"
          justify="center"
        >
          <el-col :span="12">
            <div
              @click="clickVideo(2)"
              :class="videoIndex == 2 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video2"></cus-player>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              @click="clickVideo(3)"
              :class="videoIndex == 3 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video3"></cus-player>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 3*3 -->
      <!-- <div style="height: 100%; width: 100%" v-else-if="selected == 2">
        <el-row :gutter="0" type="flex" style="height: 33.5%" justify="center">
          <el-col :span="8">
            <div
              @click="clickVideo(0)"
              :class="videoIndex == 0 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(1)"
              :class="videoIndex == 1 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video1"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(2)"
              :class="videoIndex == 2 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video2"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 33.5%" justify="center">
          <el-col :span="8">
            <div
              @click="clickVideo(3)"
              :class="videoIndex == 3 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video3"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(4)"
              :class="videoIndex == 4 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video4"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(5)"
              :class="videoIndex == 5 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video5"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row
          :gutter="0"
          type="flex"
          style="height: 33.5%"
          class="row-bg"
          justify="center"
        >
          <el-col :span="8">
            <div
              @click="clickVideo(6)"
              :class="videoIndex == 6 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video6"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(7)"
              :class="videoIndex == 7 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video7"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div
              @click="clickVideo(8)"
              :class="videoIndex == 8 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video8"></cus-player>
            </div>
          </el-col>
        </el-row>
      </div> -->
      <!-- 4*4 -->
      <!-- <div style="height: 100%; width: 100%" v-else-if="selected == 3">
        <el-row :gutter="0" type="flex" style="height: 25%" justify="center">
          <el-col :span="6">
            <div
              @click="clickVideo(0)"
              :class="videoIndex == 0 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(1)"
              :class="videoIndex == 1 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video1"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(2)"
              :class="videoIndex == 2 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video2"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(3)"
              :class="videoIndex == 3 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video3"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%" justify="center">
          <el-col :span="6">
            <div
              @click="clickVideo(4)"
              :class="videoIndex == 4 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video4"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(5)"
              :class="videoIndex == 5 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video5"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(6)"
              :class="videoIndex == 6 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video6"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(7)"
              :class="videoIndex == 7 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video7"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%" justify="center">
          <el-col :span="6">
            <div
              @click="clickVideo(8)"
              :class="videoIndex == 8 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video8"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(9)"
              :class="videoIndex == 9 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video9"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(10)"
              :class="videoIndex == 10 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video10"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(11)"
              :class="videoIndex == 11 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video11"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%" justify="center">
          <el-col :span="6">
            <div
              @click="clickVideo(12)"
              :class="videoIndex == 12 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video12"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(13)"
              :class="videoIndex == 13 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video13"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(14)"
              :class="videoIndex == 14 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video14"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div
              @click="clickVideo(15)"
              :class="videoIndex == 15 ? 'selectVideo' : 'video'"
            >
              <cus-player @clickPlayer="clickPlayer" ref="video15"></cus-player>
            </div>
          </el-col>
        </el-row>
      </div> -->
    </div>
  </div>
</template>

<script>
import 'xgplayer';
import CusPlayer from '../monitoring/monitoringCpn/from/CusPlayer.vue';
import { getVideo } from '@/api/monitoring/monitoring';
// import upleft from "@/views/monitoring/monitoringCpn/UpLeft";
import upleft from '@/views/app/upleft';
import { mapGetters } from 'vuex';

export default {
  components: {
    CusPlayer,
    upleft,
  },
  props: {
    index: Number,
  },
  data() {
    return {
      params: {
        orgId: null,
        pageNum: 1,
        pageSize: 4,
      },

      selected: 1, //表格类型
      videoIndex: 0, //表格索引
      tableData: [], //列表
      selectValue: '', //当前选择的相机
      playUrl: '', //播放的url
      useffmpeg: false, //使用ffmpeg
      wu: false,
    };
  },
  created() {
    const treeList = this.info.deptPermission;
    this.params.orgId = treeList[0].children[0].children[0].id;
  },
  mounted() {
    this.getVideo()

    // this.getVideo_bus();
  },
  watch: {
    index() {
      this.selectType();
    },
  },
  computed: {
    ...mapGetters(['info']),
  },
  methods: {
    getVideo_bus() {
      this.$bus.$on('refreshVideo', (id) => {
        this.params.pageNum = 1;
        getVideo(this.params).then((res) => {
          console.log('获取监控视频', res);
          this.selected = 1;
          this.setVideo(res.rows);
        });
      });
    },
    getVideo() {
      getVideo(this.params).then((res) => {
        console.log('获取监控视频', res);
        this.selected = 1;
        this.setVideo(res.rows);
      });
    },
    setVideo(list) {
      const that = this;
      if (list.length > 0) {
        list.forEach((item, index) => {
          if (index <= 3) {
            that.$nextTick(() => {
              let ref = 'video' + index;
              that.$refs[ref].createPlayer(
                // item.cameraUrl + item.mainStreamUrl,
                item.cameraUrl + item.subStreamUrl,
                true,
                index
              );
            });
          }
        });
      }
    },
    selectType() {
      this.selected = this.index;
    },

    clickVideo(index) {
      this.videoIndex = index;
    },

    changeSelectValue() {
      this.playUrl = 'ws://localhost:8866/live?url=' + this.selectValue;
    },

    changeFfmpeg() {
      if (!this.selectValue) {
        this.$message.error('请先选择流');
        this.useffmpeg = false;
        return;
      }
      if (this.useffmpeg) {
        this.playUrl =
          'ws://localhost:8866/live?url=' + this.selectValue + '&&&ffmpeg=true';
      } else {
        this.playUrl = 'ws://localhost:8866/live?url=' + this.selectValue;
      }
    },

    getList() {
      this.$http.get('/list').then((res) => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },

    handlePlay() {
      if (this.playUrl) {
        let ref = 'video' + this.videoIndex;
        this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
      } else {
        this.$message.error('请填写播放地址');
      }
    },

    clickPlayer(index) {
      this.videoIndex = index;
    },
  },
};
</script>

<style>
.body {
  display: flex;
  flex-wrap: wrap;
}
.left_con {
  box-sizing: border-box;
  margin-right: 10px;
  padding: 16px 10px;
  width: 311px;
  height: 100%;
  /* background-image: url("../../assets/images/monitoring/图层 （left）.svg");
  background-repeat: no-repeat;
  background-size: 100%; */
  /* background-color: #0099cc; */
  /* background-color: rgba(0, 153, 204, 0.7); */
  position: fixed;
  /* top: 100px; */
  /* z-index: 4; */
  /* overflow: hidden; */
}
.selectVideo {
  box-sizing: border-box;
  border: solid 4px red;
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #000;
  border-radius: 8px;
}

.video {
  box-sizing: border-box;
  border: solid 4px #244267ff;
  background-color: #000;
  position: relative;
  border-radius: 8px;
}
</style>
