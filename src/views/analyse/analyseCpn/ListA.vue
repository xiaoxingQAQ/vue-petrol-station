<template>
  <div class="list_a">
    <div class="li" v-for="(item, index) in list" :key="index">
      <el-image
        @error="handleErr(item, item.eventSnapPic, 5)"
        class="image"
        :src="item.eventSnapPic"
        lazy
      >
        <div class="image-slot" slot="placeholder">
          <div>加载中...</div>
        </div>
        <div slot="error" class="image-slot">
          <div>加载中...</div>
        </div>
      </el-image>
      <div>
        <div class="top">
          <span class="title">{{ item.cameraName }} {{ item.address }}</span>
          <span class="small">{{ item.createTime }}</span>
        </div>
        <div class="bottom">
          <el-button :type="setType_1(item)" plain>{{
            setType_1_a(item)
          }}</el-button>
          <el-button :type="statusType(item)" @click="showDialog(item)">{{
            handleStatus(item)
          }}</el-button>
        </div>
      </div>
    </div>

    <DialogA
      :isHome="false"
      @open="visible_a = true"
      @cancel="handleCancel"
      @refreshList="getWarningList"
      :visible="visible_a"
      :cur_data="cur_data"
    />
    <DialogB @cancel="handleCancel" :visible="visible_b" :cur_data="cur_data" />
    <DialogC @cancel="handleCancel" :visible="visible_c" :cur_data="cur_data" />
    <DialogD @cancel="handleCancel" :visible="visible_d" :cur_data="cur_data" />
  </div>
</template>

<script>
import DialogA from '@/components/content/dialog/analyse/DialogA.vue'; // 烟火检测
import DialogB from '@/components/content/dialog/analyse/DialogB.vue'; // 骑行抓拍
import DialogC from '@/components/content/dialog/analyse/DialogC.vue'; // 车辆抓拍
import DialogD from '@/components/content/dialog/analyse/DialogD.vue'; // 车辆抓拍
import { getWarningList } from '@/api/analyse/analyse';

export default {
  components: {
    DialogA,
    DialogB,
    DialogC,
    DialogD,
  },
  props: {
  },
  data() {
    return {
      cur_data: {},

      visible_a: false,
      visible_b: false,
      visible_c: false,
      visible_d: false,

      list: [],
      // 总条数
      total: 0,
      /* 查询参数 */
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        startDate: null,
        endDate: null,
        orgIds: null,
        eventCode: '',
      },
    };
  },
  computed: {},
  created() {
    this.getWarningList();
    console.log(this.$route.query);
    if (JSON.stringify(this.$route.query) !== '{}') {
      const orgId = this.$route.query.item.orgId;
      this.queryParams.orgIds = orgId;
      this.$bus.$emit('setOrgIdA', orgId);
    }
  },
  mounted() {
    // 处理查询
    this.$bus.$on('refreshA', (data) => {
      this.queryParams = {}
      if (data.handleStatus) {
        this.queryParams.handleName = data.handleStatus
      } else {
        this.queryParams.handleStatus = data.handleStatus
      }
      this.queryParams.startDate = data.startDate
      this.queryParams.endDate = data.endDate
      this.queryParams.pageNum = 1
      this.queryParams.pageSize = 10
      this.queryParams.eventCode = data.eventCode
      this.queryParams.orgIds = data.orgIds
      this.getWarningList();
    });
  },
  methods: {
    /* **
      网络请求
     */
    // 获取智能分析数据 初始化
    getWarningList() {
      console.log('this.queryParams: ', this.queryParams);
      getWarningList(this.queryParams).then((res) => {
        this.total = parseInt(res.total)
        this.list = res.rows;
        this.$emit('setParams', this.queryParams, this.total);
      });
    },
    // 点击展示dialog
    showDialog(item) {
      console.log('智能分析:item ', item);
      this.cur_data = item;
      switch (item.eventCode) {
        case 'face_captured':
          this.visible_d = true;
          return '人脸抓拍';
        case 'fire':
          this.visible_a = true;
          return '烟火检测';
        case 'phone':
          this.visible_a = true;
          return '使用手机';
        case 'smoking':
          this.visible_a = true;
          return '吸烟检测';
        case 'extinguisher':
          this.visible_a = true;
          return '设备监控';
        case 'box':
          this.visible_a = true;
          return '物品占道';
        case 'car':
          this.visible_a = true;
          return '车辆占道';
        case 'vehicle':
          this.visible_a = true;
          return '车辆抓拍';
        case 'riding':
          this.visible_c = true;
          return '骑行抓拍';
        case 'personnel_sleepling_post':
          this.visible_b = true;
          return '人员睡岗';
        case 'service_leaving':
          this.visible_a = true;
          return '服务离岗';
        case 'job_leaving':
          this.visible_a = true;
          return '作业离岗';
        case 'supervisor_off_duty':
          this.visible_a = true;
          return '主管脱岗';
        case 'helmet_detection':
          this.visible_a = true;
          return '安全帽检测';
        case 'oil_unloading_and_off_duty':
          this.visible_a = true;
          return '卸油离岗';
        case 'smoke':
          this.visible_a = true;
          return '烟雾检测';
        case 'person_leave':
          this.visible_a = true;
          return '人员离岗';
        case 'person':
          this.visible_a = true;
          return '非法入侵';
        default:
          this.visible_a = true;
          return '其他类型';
      }
    },
    handleCancel() {
      this.visible_a = false;
      this.visible_b = false;
      this.visible_c = false;
      this.visible_d = false;
    },
    handleOk() { },

    // 设置按钮类型
    setType_1(item) {
      switch (item.eventCode) {
        case 'face':
          return 'primary';
        case 'fire':
          return 'danger';
        case 'phone':
          return 'info';
        case 'smoking':
          return 'warning';
        case 'extinguisher':
          return 'info';
        case 'box':
          return 'info';
        case 'car':
          return 'info';
        case 'vehicle':
          return 'primary';
        case 'riding':
          return 'primary';
        case 'personnel_sleepling_post':
          return 'warning';
        case 'service_leaving':
          return 'warning';
        case 'job_leaving':
          return 'warning';
        case 'supervisor_off_duty':
          return 'warning';
        case 'helmet_detection':
          return 'warning';
        case 'oil_unloading_and_off_duty':
          return 'warning';
        case 'smoke':
          return 'danger';
        case 'person_leave':
          return 'warning';
        case 'person':
          return 'danger';
        default:
          return 'info';
      }
    },
    // 设置事件类型
    setType_1_a(item) {
      switch (item.eventCode) {
        case 'face_captured':
          return '人脸抓拍';
        case 'fire':
          return '烟火检测';
        case 'phone':
          return '使用手机';
        case 'smoking':
          return '吸烟检测';
        case 'extinguisher':
          return '设备监控';
        case 'box':
          return '物品占道';
        case 'car':
          return '车辆占道';
        case 'vehicle':
          return '车辆抓拍';
        case 'riding':
          return '骑行抓拍';
        case 'personnel_sleepling_post':
          return '人员睡岗';
        case 'service_leaving':
          return '服务离岗';
        case 'job_leaving':
          return '作业离岗';
        case 'supervisor_off_duty':
          return '主管脱岗';
        case 'helmet_detection':
          return '安全帽检测';
        case 'oil_unloading_and_off_duty':
          return '卸油离岗';
        case 'smoke':
          return '烟雾检测';
        case 'person_leave':
          return '人员离岗';
        case 'person':
          return '非法入侵';
        default:
          return '其他类型';
      }
    },
    // 设置处理状态
    handleStatus(item) {
      const handleStatus = item.handleStatus;
      const handleName = item.handleName;
      if (handleStatus == '1') {
        if (handleName) {
          return handleName;
        } else {
          return '已处理';
        }
      } else {
        return '待处理';
      }
    },
    // 设置处理后的按钮类型
    statusType(item) {
      const handleStatus = item.handleStatus;
      const handleOption = item.handleOption;
      if (handleStatus == '1') {
        return handleOption == 'report' ? 'primary' : 'success';
      } else {
        return 'danger'
      }
    },
    // 处理图片error
    handleErr(item, imgSrc, count) {
      return
      if (count > 0) {
        setTimeout(() => {
          item.eventSnapPic = imgSrc + `?t=${Math.random()}`;
        }, 500);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list_a {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 10px;

  .li {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: calc(calc(100% / 5) - 10px);
    margin: 5px;
    height: 327px;
    border-radius: 8px;

    .image,
    .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 200px;
      background: #eee;
      border-radius: 8px 8px 0 0;
      font-size: 20px;
      font-weight: 500;
      color: #19adca;
    }

    > div:last-child {
      flex: 1;

      box-sizing: border-box;
      padding: 16px;
      background-color: #fff;
      border-radius: 0 0 8px 8px;

      .top {
        display: flex;
        flex-direction: column;
        margin-bottom: 13px;

        .title {
          font-size: 17px;
          font-weight: 600;
          line-height: 23px;
          color: #000000;
        }

        .small {
          padding-left: 2px;
          font-size: 12px;
          font-weight: 500;
          line-height: 20px;
          color: #000000;
        }
      }

      .bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .li:nth-child(1),
  .li:nth-child(2),
  .li:nth-child(3),
  .li:nth-child(4),
  .li:nth-child(5) {
    margin-top: 10px !important;
  }
}

.el-date-picker__header {
  background-color: #19adca !important;
  color: #fff !important;
}

::v-deep .el-date-picker__header-label {
  color: #fff !important;
}
</style>
