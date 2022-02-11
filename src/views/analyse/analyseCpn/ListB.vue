<template>
  <div class="list_b">
    <div :class="['li', { li2: item.dataType == 'face' }]" v-for="(item, index) in list" :key="index">
      <div :class="[{ image: item.dataType == 'face' }, { image2: item.dataType != 'face' }]">
        <el-image @dblclick.prevent="hanDblclick(item)" :src=" item.dataType ? item.faceUrl : item.snapUrl" >
          <div class="image-slot" slot="placeholder">
            <div>加载中...</div>
          </div>
          <div slot="error" class="image-slot">
            <div>加载中...</div>
          </div>
        </el-image>
      </div>
      <ul>
        <li style="padding-top: 5px;">
          <span>分类：</span>
          <b>{{ item.dataType ? "人脸" : item.carType }}</b>
        </li>
        <li>
          <span>{{ item.dataType ? "姓名：" : "地址：" }}</span>
          <b>{{ item.dataType ? item.name : item.cameraName }}</b>
        </li>
        <li>
          <span>{{ item.dataType ? "性别：" : "号牌：" }}</span>
          <b>{{ item.dataType ? item.sex : item.color }}</b>
        </li>
        <li v-if="!item.dataType">
          <span>车牌：</span>
          <b>{{ item.licence }}</b>
        </li>
        <li>
          <span>{{ item.dataType ? "编号：" : "型号：" }}</span>
          <b>{{ item.dataType ? "" : item.styleName }}</b>
        </li>
        <li>
          <span>地点：</span>
          <b>{{ item.petrolName }}</b>
        </li>
        <li>
          <span>{{ item.dataType ? "地址：" : "颜色：" }}</span>
          <b>{{ item.dataType ? item.address : item.carColor }}</b>
        </li>
        <li>
          <span>时间：</span>
          <b>{{ item.createTime }}</b>
        </li>
      </ul>

      <div class="footer_con">
        <i
          v-for="(iconArr, index) in menuList"
          :key="index"
          style="cursor: pointer;"
          :class="['iconfont', iconArr.icon]"
          :title="iconArr.icon === 'icon-tupian' ? '以图搜图' : iconArr.icon === 'icon-lingdang' ? 
          '布控' : iconArr.icon === 'icon-xiazai1' ? '下载图片' : '' "
          @click="handleIconCilck(iconArr, item)"
        ></i>
      </div>
    </div>
    <el-dialog
      title="图片预览"
      :visible="imageDialog"
      width="50%"
      :before-close="handleCancelImage"
      @opened="handleOpened">
      <canvas
        id="myCanvas"
        ref="myCanvas"
        :width='this.canvasW'
        :height="this.canvasH"
        :style="imageClass()">
      </canvas>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCarList,
  getFace
} from '@/api/analyse/analyse';
import { getDate, getNowTime } from '@/utils/getDate';
export default {
  props: {
    pageNum: Number
  },
  data() {
    return {
      canvasW: '',
      canvasH: '',
      ratioW: null,
      ratioH: null,
      imageDialog: false, //图片弹窗
      imageUrl: '', // 图片路径
      /* 人脸抓拍数据 */
      /* 车辆抓拍数据 */
      list:  [1],
      /* 分页total */
      total: 0,
      /* 人脸抓拍数据查询参数 */
      queryParams: {
        pageNum: 1,
        pageSize: 14,
        startDate: null,
        endDate: null,
        orgId: ''
      },
      judge: '车辆', // 判断是车还是人，默认是车
      rect: [],
      menuList: [
        { title: '', icon: 'icon-tupian' },
        { title: '', icon: 'icon-lingdang' },
        { title: '', icon: 'icon-xiazai1' },
      ],
    };
  },
  watch: {
    pageNum() {
      this.queryParams.pageNum = this.pageNum;
      if (this.judge === '车辆') {
        this.getCarList()
      } else {
        this.getFace()
      }
    },
  },
  created() {
    this.getCarList()
  },
  mounted() {
    const width = document.body.clientWidth
    this.canvasW = (width / 2).toFixed() - 40
    this.ratioW = (8192 / this.canvasW).toFixed(3)
    this.ratioH = (this.ratioW * 2).toFixed(3)
    this.canvasH = (8192 / this.ratioH).toFixed()
    window.addEventListener('resize', this.resizeHandler)
    // 处理查询
    this.$bus.$on('refreshB', (data) => {
      this.judge = data.takeType
      this.queryParams.startDate = data.startDate
      this.queryParams.endDate = data.endDate
      this.queryParams.pageNum = 1
      this.queryParams.orgId = data.orgIds
      if (this.judge === '车辆') {
        this.getCarList()
      } else {
        this.getFace()
      }
    });
  },
  destroyed () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
     resizeHandler () {
      this.imageDialog = false
      const width = document.body.clientWidth
      this.canvasW = (width / 2).toFixed() - 40
      this.ratioW = (8192 / this.canvasW).toFixed(3)
      this.ratioH = (this.ratioW * 2).toFixed(3)
      this.canvasH = (8192 / this.ratioH).toFixed()
    },
    /* 网络请求区域 */
    /* 获取人脸抓拍数据 */
    getFace() {
      getFace(this.queryParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.list = []
          this.total =  parseInt(res.total)
          this.list = res.rows
          this.$emit('setParams', this.queryParams, this.total);
          this.list.forEach(item => {
            item.dataType = 'face'
          })
        }
      })
    },
    /* 获取车辆抓拍数据 */
    getCarList() {
      getCarList(this.queryParams).then(res => {
        console.log('获取车辆抓拍数据: ', res);
        if (res.code === 200) {
          this.list = []
          this.total =  parseInt(res.total)
          this.list = res.rows
          this.$emit('setParams', this.queryParams, this.total);
          this.list.forEach(item => {
            item.dataType = null
            item.color = item.color ? item.color : '无法确认';
          })
        }
      })
    },
    // 双击图片放大
    hanDblclick (data) {
      this.imageDialog = true
      this.imageUrl = data.dataType ? data.faceUrl : data.snapUrl
      this.rect = data.rect 
    },
    handleCancelImage () {
      this.imageDialog = false
      this.imageUrl = ''
      const canvas = this.$refs.myCanvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    // canvas
    imageClass () {
      return {
        'background-image': 'url(' + this.imageUrl + ')',
        'background-size': '100% 100%',
      }
    },
    handleOpened() {
      if (this.rect !== null) {
        const rectArr = JSON.parse(this.rect).map((it,index) => {
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
        ctx.strokeStyle="red";
        ctx.rect(rectArr[0], rectArr[1], rectArr[2], rectArr[3]);
        ctx.stroke();
      }
    },
    // 点击icon事件
    handleIconCilck(iconArr, data) {
      if (iconArr.icon === "icon-xiazai1") {
        // 下载图片
        if (this.judge === '车辆') {
          if (data.snapUrl) {
            this.downloadByBlob(data.snapUrl, data.createTime)
          } else {
            this.$notify.warning('当前并没有图片可以下载')
          }
        } else {
          if (data.faceUrl) {
            this.downloadByBlob(data.faceUrl, data.createTime) 
          } else {
            this.$notify.warning('当前并没有图片可以下载')
          }
        }
      } else if (iconArr.icon === "icon-tupian") {
        this.$notify.warning('当前功能还在开发中')
      } else {
        this.$notify.warning('当前功能还在开发中')
      }
    },
    downloadByBlob(url, name) {
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob(blob => {
          let url = URL.createObjectURL(blob);
          this.download(url, name);
          // 用完释放URL对象
          URL.revokeObjectURL(url);
        });
      };
    },
    download(href, name) {
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = href;
      eleLink.click();
      eleLink.remove();
    }
  }
}
</script>

<style lang="less" scoped>
.list_b {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  width: 100%;  
  .li {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    padding: 5px 22px 16px 22px;
    margin: 5px;
    width: calc((calc(100% / 7) - 10px));
    height: 345px;
    background: #44627dff;
    border-radius: 8px;
    &.li2 {
      padding: 16px 22px;
    }

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

    // 图片
    .image {
      margin-bottom: -8px;
      width: 100%;
      .el-image {
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
      }
    }
    .image2 {
      margin-bottom: -8px;
      width: 100%;
      .el-image {
        width: 100%;
        border-radius: 8px;
        cursor: pointer;
      }
    }

    ul {
      display: flex;
      flex-direction: column;
      width: 100%;
      transform: translateY(-2%);
      li {
        display: flex;
        width: 100%;
        span,
        b {
          font-size: 12px;
          font-weight: 500;
          line-height: 24px;
          color: #ffffff;
        }

        b {
          color: #eee;
        }
      }
    }

    .footer_con {
      display: flex !important;
      justify-content: center !important;
      position: absolute;
      bottom: 10px;
      width: 100%;
      height: 22px;
      transform: translate(18px);

      i {
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 20px;
        color: #ffffff;
      }

      i:nth-child(1),
      i:nth-child(2),
      i:nth-child(3) {
        margin-right: 42px;
      }
    }
  }
}
// /deep/ .el-dialog__body {
//   padding: 0 !important;
// }
</style>
