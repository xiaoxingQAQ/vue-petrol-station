<template>
  <div class="list_d">
    <div class="li" v-for="(item, index) in trackList" :key="index">
      <header>
        <ul class="left">
          <li>
            <span> {{ trackParams.type === '1' ? '姓名：' : '车牌：' }} </span>
            <b>{{ item.deployName }}</b>
          </li>
          <li>
            <span>{{ trackParams.type === '1' ? '性别：' : '车主：' }}</span>
            <b>{{ item.deploySex }}</b>
          </li>
          <li>
            <span>归档：</span>
            <b>{{ item.petrolStationName }}</b>
          </li>
          <li>
            <span>日期：</span>
            <b>{{
              trackParams.type === '1' ? item.createTime : item.deployTime
            }}</b>
          </li>
        </ul>
        <div class="right">
          <el-image
            class="image"
            @dblclick="hanDblclick3(item)"
            style="width: 100%; height: 100%"
            :src="item.deployUrl"
          >
            <div class="image-slot" slot="placeholder">
              <div>加载中...</div>
            </div>
            <div slot="error" class="image-slot">
              <div>加载中...</div>
            </div>
          </el-image>
        </div>
      </header>
      <p>轨迹路径</p>
      <main>
        <ul>
          <li v-for="(it, index) in item.deployList" :key="index">
            <span style="">{{ index + 1 }}</span>
            <span style="flex: 0.7; text-align: center">{{ it.time }}</span>
            <span style="flex: 1; text-align: start">{{ it.cameraName }}</span>
            <b
              style="text-align: end; margin-right: 5px"
              @click="particularsCilck(it)"
              >详情</b
            >
          </li>
        </ul>
      </main>
      <footer class="footer">
        <el-button size="mini" type="danger">正常</el-button>
        <el-button size="mini" type="success">待处理</el-button>
      </footer>
    </div>
    <el-dialog
      title="图片预览"
      :visible="imageDialog3"
      width="50%"
      :before-close="handleCancelImage3"
      @opened="handleOpened3"
    >
      <canvas
        id="myCanvas"
        ref="myCanvas"
        :width="this.canvasW"
        :height="this.canvasH"
        :style="imageClass()"
      >
      </canvas>
    </el-dialog>
  </div>
</template>

<script>
import { getPersontrackSelect } from '@/api/analyse/analyse';
export default {
  props: ['pageNum'],
  data() {
    return {
      total: 0, // 分页total总数
      trackList: [], // 人车轨迹数据
      // 查询参数
      trackParams: {
        pageNum: 1,
        pageSize: 12,
        startDate: null,
        endDate: null,
        type: '2',
        orgIds: null,
        personName: '',
        licence: ''

      },
      imageDialog3: false,
      imageUrl3: '',
      canvasW: '',
      canvasH: '',
      ratioW: null,
      ratioH: null,
    }
  },
  watch: {
    pageNum() {
      this.trackParams.pageNum = this.pageNum
      this.getPersontrackSelect()
    },
  },
  created() {
    this.getPersontrackSelect()
  },
  mounted() {
    const width = document.body.clientWidth
    this.canvasW = (width / 2).toFixed() - 40
    this.ratioW = (8192 / this.canvasW).toFixed(3)
    this.ratioH = (this.ratioW * 2).toFixed(3)
    this.canvasH = (8192 / this.ratioH).toFixed()
    window.addEventListener('resize', this.resizeHandler)

    this.$bus.$on('refreshD', (data) => {
      this.trackParams.startDate = data.startDate
      this.trackParams.endDate = data.endDate
      this.trackParams.type = data.type
      this.trackParams.pageNum = 1
      this.trackParams.orgIds = data.orgIds
      this.trackParams.personName = data.name
      this.trackParams.licence = data.plateNumber
      this.getPersontrackSelect()
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    // 当窗口大小发生变化时触发
    resizeHandler() {
      this.imageDialog3 = false
      const width = document.body.clientWidth
      this.canvasW = (width / 2).toFixed() - 40
      this.ratioW = (8192 / this.canvasW).toFixed(3)
      this.ratioH = (this.ratioW * 2).toFixed(3)
      this.canvasH = (8192 / this.ratioH).toFixed()
    },
    // 点击详情
    particularsCilck(data) {
      this.imageDialog3 = true
      this.imageUrl3 = data.eventSnapPic
      this.rect = data.rect
    },
    // 获取人车轨迹数据
    getPersontrackSelect() {
      getPersontrackSelect(this.trackParams).then(res => {
        this.trackList = res.rows
        this.total = parseInt(res.total)
        this.$emit('setParams', this.trackParams, parseInt(this.total));
      })
    },
    // 双击抓拍信息图片
    hanDblclick3(data) {
      this.imageDialog3 = true
      this.imageUrl3 = data.deployUrl
      this.rect = data.rect
    },
    handleCancelImage3() {
      this.imageDialog3 = false
      this.imageUrl3 = ''
      const canvas = this.$refs.myCanvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    // canvas
    imageClass() {
      return {
        'background-image': 'url(' + this.imageUrl3 + ')',
        'background-size': '100% 100%',
      }
    },
    // 弹窗打开时的回调
    handleOpened3() {
      if (this.rect !== null) {
        const rectArr = JSON.parse(this.rect).map((it, index) => {
          if (index === 0) {
            return +(it / this.ratioW).toFixed(1)
          }
          if (index === 1) {
            return +(it / this.ratioH).toFixed(1)
          }
          if (index === 2) {
            return +(it / this.ratioW).toFixed(1)
          }
          if (index === 3) {
            return +(it / this.ratioH).toFixed(1)
          }
        })
        const canvas = this.$refs.myCanvas
        const ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(rectArr[0], rectArr[1], rectArr[2], rectArr[3]);
        ctx.stroke();
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list_d {
  display: flex;
  flex-wrap: wrap;

  width: 100%;
  margin-top: 10px;
  .li {
    display: flex;
    flex-direction: column;
    align-content: center;

    box-sizing: border-box;
    padding: 14px 16px;
    margin: 5px;
    width: calc((calc(100% / 6) - 10px));
    height: 327px;
    background: #44627dff;
    border-radius: 8px;
    overflow: hidden;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        li {
          margin-bottom: 10px;
        }
        li:last-child {
          margin: 0;
        }

        span,
        b {
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          color: #ffffff;
        }
      }

      .right {
        width: 100px;
        height: 100px;

        .image,
        .image-slot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100px;
          background: #eee;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          color: #19adca;
        }
      }
    }

    p {
      margin-bottom: 10px;
      font-size: 12px;
      font-weight: 500;
      line-height: 14px;
      color: #ffffff;
    }

    main {
      overflow: auto;
      height: 250px;
      ul {
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;

          margin-bottom: 10px;

          span {
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            color: #ffffff;
          }

          span:first-child {
            width: 14px;
          }

          b {
            font-size: 12px;
            font-weight: 500;
            line-height: 14px;
            color: #80ffe3;
            cursor: pointer;
          }
        }

        li:last-child {
          margin: 0;
        }
      }
    }

    footer {
      margin-top: 8px;
      transform: translateY(2px);
      .el-button {
        display: flex;
        justify-content: center;
        align-items: center;

        width: 56px;
        height: 23px;
        font-size: 12px;
        float: right;
      }
      .el-button:last-child {
        margin-right: 10px;
      }
    }
  }
}
// /deep/ .el-dialog__body {
//   padding: 0 !important;
// }
</style>