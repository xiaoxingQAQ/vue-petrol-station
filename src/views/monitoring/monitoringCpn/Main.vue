<template>
  <div style="height: 100%">
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      "
    >
      <div style="width: 100%; height: 100%">
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
      <!-- 3*3 -->
      <!-- <div style="height:100%;width:100%;" v-else-if="selected == 2">
        <el-row :gutter="0" type="flex" style="height: 33.5%;" justify="center">
          <el-col :span="8">
            <div @click="clickVideo(0)" :class="videoIndex == 0 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(1)" :class="videoIndex == 1 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video1"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(2)" :class="videoIndex == 2 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video2"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 33.5%;" justify="center">
          <el-col :span="8">
            <div @click="clickVideo(3)" :class="videoIndex == 3 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video3"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(4)" :class="videoIndex == 4 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video4"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(5)" :class="videoIndex == 5 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video5"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 33.5%;" class="row-bg" justify="center">
          <el-col :span="8">
            <div @click="clickVideo(6)" :class="videoIndex == 6 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video6"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(7)" :class="videoIndex == 7 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video7"></cus-player>
            </div>
          </el-col>
          <el-col :span="8">
            <div @click="clickVideo(8)" :class="videoIndex == 8 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video8"></cus-player>
            </div>
          </el-col>
        </el-row>
      </div> -->
      <!-- 4*4 -->
      <!-- <div style="height:100%;width:100%;" v-else-if="selected == 3">
        <el-row :gutter="0" type="flex" style="height: 25%;" justify="center">
          <el-col :span="6">
            <div @click="clickVideo(0)" :class="videoIndex == 0 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video0"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(1)" :class="videoIndex == 1 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video1"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(2)" :class="videoIndex == 2 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video2"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(3)" :class="videoIndex == 3 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video3"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%;" justify="center">
          <el-col :span="6">
            <div @click="clickVideo(4)" :class="videoIndex == 4 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video4"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(5)" :class="videoIndex == 5 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video5"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(6)" :class="videoIndex == 6 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video6"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(7)" :class="videoIndex == 7 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video7"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%;" justify="center">
          <el-col :span="6">
            <div @click="clickVideo(8)" :class="videoIndex == 8 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video8"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(9)" :class="videoIndex == 9 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video9"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(10)" :class="videoIndex == 10 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video10"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(11)" :class="videoIndex == 11 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video11"></cus-player>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0" type="flex" style="height: 25%;" justify="center">
          <el-col :span="6">
            <div @click="clickVideo(12)" :class="videoIndex == 12 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video12"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(13)" :class="videoIndex == 13 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video13"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(14)" :class="videoIndex == 14 ? 'selectVideo' : 'video'">
              <cus-player @clickPlayer="clickPlayer" ref="video14"></cus-player>
            </div>
          </el-col>
          <el-col :span="6">
            <div @click="clickVideo(15)" :class="videoIndex == 15 ? 'selectVideo' : 'video'">
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
import CusPlayer from './from/CusPlayer';
import { getVideo } from '@/api/monitoring/monitoring';
export default {
  components: {
    CusPlayer,
  },
  props: {
    index: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      list: [],
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
    };
  },
  created() { },
  mounted() {
    this.getVideo_bus();
  },
  watch: {
    index(val) {
      console.log('分页', val);
      this.list = []
      this.params.pageNum = val;
      this.getVideo();
    },
    params: {
      handler(val, oldVal) {
        console.log('变化pamas', val);
        if (val.pageNum !== oldVal.pageNum) {
          this.$emit('changeIndex', val.pageNum);
        }
      },
      deep: true,
    },
  },
  methods: {
    getVideo_bus() {
      this.$bus.$on('refreshVideo', (id) => {
        this.list = []
        this.params.orgId = id;
        // this.params.pageNum = 1;
        // this.$emit('changeIndex', 1);
        this.getVideo()
      });
    },
    getVideo() {
      if (this.list.length) return
      if (!this.params.orgId) return this.$notify.info('请先选择加油站');
      getVideo(this.params).then((res) => {
        console.log('获取监控视频', res);
        if (res.code === 200) {
          this.list = res.rows
          this.setVideo(res.rows);
        }
      });
    },
    setVideo(list) {
      if (list && list.length) {
        list.forEach((item, index) => {
          let ref = 'video' + index;
          this.$nextTick(() => {
            this.$refs[ref].createPlayer( // subStreamUrl 子码流
              // item.cameraUrl + item.mainStreamUrl, 
              item.cameraUrl + item.subStreamUrl,
              true,
              index
            );
          })
        });
      }
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

    // handlePlay() {
    //   if (this.playUrl) {
    //     let ref = 'video' + this.videoIndex;
    //     this.$nextTick(() => {
    //       this.$refs[ref].createPlayer(this.playUrl, true, this.videoIndex);
    //     })
    //   } else {
    //     this.$message.error('请填写播放地址');
    //   }
    // },

    clickPlayer(index) {
      this.videoIndex = index;
    },
  },
};
</script>

<style>
.el-col {
  margin: 2px 2.1px;
}
.selectVideo {
  box-sizing: border-box;
  /* border: solid 2px; */
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #000;
  border-radius: 6px;
}

.video {
  box-sizing: border-box;
  /* border: solid 2px #244267ff; */
  height: 100%;
  width: 100%;
  background-color: #000;
  position: relative;
  border-radius: 6px;
}
</style>
