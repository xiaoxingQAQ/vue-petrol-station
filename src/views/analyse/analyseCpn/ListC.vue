<template>
  <div class="list_c">
    <div class="li" v-for="(item, index) in deployList" :key="index">
      <header>
        <div class="left">
          <span>相似度</span>
          <b>{{ item.similarity }}</b>
        </div>

        <div class="right">
          <i class="iconfont icon-wenjian_sousuo"></i>
        </div>
      </header>

      <main>
        <div class="left">
          <div class="title">抓拍信息</div>
          <div class="image">
            <el-image
              @dblclick="hanDblclick2(item)"
              style="width: 100%; height: 100%"
              :src="item.dataType ? item.faceUrl : item.carCapture"
            >
              <div class="image-slot" slot="placeholder">
                <div>加载中...</div>
              </div>
              <div slot="error" class="image-slot">
                <div>加载中...</div>
              </div>
            </el-image>
          </div>
          <ul>
            <!-- 时间 -->
            <li>
              <span>{{ item.createTime }}</span>
            </li>
            <li>
              <span>类型：</span>
              <b>{{ item.dataType ? item.type : "" }}</b>
            </li>
            <li>
              <span>{{ item.dataType ? "性别：" : "车牌：" }}</span>
              <b>{{ item.dataType ? item.sex : item.licence }}</b>
            </li>
            <li>
              <span>{{ item.dataType ? "年龄：" : "颜色：" }}</span>
              <b>{{ item.dataType ? item.ageType : item.carColor }}</b>
            </li>
          </ul>
        </div>
        <div class="right">
          <div class="title">布控信息</div>
          <div class="image">
            <el-image
              @dblclick="hanDblclick3(item)"
              style="width: 100%; height: 100%"
              :src="item.dataType ? item.facePhotoUrl : item.carDeploy"
            >
              <div class="image-slot" slot="placeholder">
                <div>加载中...</div>
              </div>
              <div slot="error" class="image-slot">
                <div>加载中...</div>
              </div>
            </el-image>
          </div>
          <ul>
            <li>
              <span>布控名称 ：</span>
              <b>{{ item.dataType ? item.deployType : item.monitorCause }}</b>
            </li>
            <li>
              <span>布控原因：</span>
              <b>{{ item.dataType ? item.deployName : item.monitorName }}</b>
            </li>
            <li>
              <span>备注：</span>
              <b>{{ item.dataType ? item.remark : item.licenceDeploy }}</b>
            </li>
          </ul>
        </div>
      </main>
    </div>
    <el-dialog
      style="text-align: center"
      title="图片预览"
      :visible="imageDialog2"
      width="50%"
      :before-close="handleCancelImage2"
    >
      <img style="width: 100%; height: auto" :src="imageUrl2" />
    </el-dialog>
  </div>
</template>

<script>
import { getSelectByFace, getSelectCar } from '@/api/analyse/analyse';
export default {
  props: {
    pageNum: Number
  },
  data() {
    return {
      deployList: [], // 名单布控数据
      total: 0, // 分页total
      // 查询参数
      deployParams: {
        pageNum: 1,
        pageSize: 10,
        startDate: null,
        endDate: null,
      },
      // 图片预览
      imageDialog2: false,
      imageUrl2: '',
      takeType: '' // 抓拍信息类型
    }
  },
  watch: {
    pageNum() {
      this.deployParams.pageNum = this.pageNum;
      if (this.takeType === '车辆') {
        this.getSelectCar()
      } else {
        this.getSelectByFace()
      }
    },
  },
  created() {
    this.getSelectByFace()
  },
  mounted() {
    // 处理查询
    this.$bus.$on('refreshC', (data) => {
      this.takeType = data.takeType
      this.deployParams.startDate = data.startDate
      this.deployParams.endDate = data.endDate
      this.deployParams.pageNum = 1
      if (this.takeType === '车辆') {
        this.getSelectCar()
      } else {
        this.getSelectByFace()
      }
    });
  },
  methods: {
    // 获取人脸抓拍信息和布控信息
    getSelectByFace() {
      getSelectByFace(this.deployParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.deployList = []
          this.total = parseInt(res.total)
          this.deployList = res.rows
          this.$emit('setParams', this.deployParams, parseInt(this.total));
          this.deployList.forEach(item => {
            item.dataType = 'face'
          })
        }
      })
    },
    // 获取车辆拍信息和布控信息
    getSelectCar() {
      getSelectCar(this.deployParams).then(res => {
        console.log('获取人脸抓拍数据: ', res);
        if (res.code === 200) {
          this.deployList = []
          this.total = parseInt(res.total)
          this.deployList = res.rows
          this.$emit('setParams', this.deployParams, parseInt(this.total));
          this.deployList.forEach(item => {
            item.dataType = null
          })
        }
      })
    },
    // 双击抓拍信息图片
    hanDblclick2(data) {
      this.imageDialog2 = true
      if (this.takeType === '车辆') {
        this.imageUrl2 = data.carCapture
      } else {
        this.imageUrl2 = data.faceUrl
      }
    },
    // 双击 布控信息图片
    hanDblclick3(data) {
      this.imageDialog2 = true
      if (this.takeType === '车辆') {
        this.imageUrl2 = data.carDeploy
      } else {
        this.imageUrl2 = data.facePhotoUrl
      }
    },
    handleCancelImage2() {
      this.imageDialog2 = false
      this.imageUrl2 = ''
    }
  }
}
</script>

<style lang="less" scoped>
.list_c {
  display: flex;
  flex-wrap: wrap;
  // justify-content: center;

  width: 100%;
  margin-top: 10px;

  .li {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 10px 13px;
    margin: 5px;
    width: calc(calc(100% / 5) - 10px);
    height: 327px;

    background: #44627dff;
    border-radius: 8px;

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        span,
        b {
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          color: #ffffff;
        }
      }

      .right {
        i {
          font-size: 18px;
          width: 20px;
          height: 20px;   
          color: #fff;
        }
      }
    }

    main {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      /* 公共 */
      span,
      b {
        font-size: 12px;
      }
      b,
      span,
      .title {
        font-weight: 500;
        line-height: 14px;
        color: #ffffff;
      }
      b {
        color: #eee;
      }

      .title {
        font-size: 14px;
        margin-bottom: 10px;
      }

      .image,
      .image-slot {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
        background: #eee;
        border-radius: 6px;
        font-size: 15px;
        font-weight: 500;
        color: #19adca;
      }

      .image {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        cursor: pointer;
        .el-image {
          width: 100%;
          border-radius: 8px;
        }
      }

      ul {
        margin-top: 10px;
        word-break: break-word;
        white-space: pre-line;
        li {
          margin-bottom: 8px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>