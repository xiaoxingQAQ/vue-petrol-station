<template>
  <div class="footer_container">
    <el-button type="primary" size="mini" @click="test">模拟告警</el-button>
    <ul>
      <li
        v-for="(item, index) in sessionList"
        :key="index"
        @click="openDialog(item)"
      >
        <header>
          <div>
            <i></i>
            <span>{{ item.createTimeStr || item.createTime }}</span>
          </div>
          <div class="right">
            <el-button size="mini" :type="setType(item)">{{
              setStatus(item)
            }}</el-button>
          </div>
        </header>

        <footer>
          <div>【{{ item.stationName }}】 {{ setEventType(item) }}</div>
        </footer>
      </li>
    </ul>
  </div>
</template>

<script>
/* 插件 */
import { createSocket } from '@/utils/websocket';
/* 接口 */
import { getOrgStr } from '@/api/oilStation'
import { getInform } from '@/api/home/home';
/* 组件 */
import DialogA from '@/components/content/dialog/analyse/DialogA';
import DialogB from '@/components/content/dialog/analyse/DialogB';
import DialogC from '@/components/content/dialog/analyse/DialogC';
import DialogD from '@/components/content/dialog/analyse/DialogD';

const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();

export default {
  components: {
    DialogA,
    DialogB,
    DialogC,
    DialogD,
  },
  data() {
    return {
      isPopup: false, // 是否弹框
      list: [],
      data: {},
      sessionList: [],
    };
  },
  computed: {},
  watch: {
    list: {
      handler(val) {
        // console.log('监听list', val);
        setTimeout(() => {
          this.$emit('refresh');
        }, 0);
      },
      deep: true,
    },
  },
  created() {
    this.getInform();
  },
  mounted() {
    /* webSocket */
    getOrgStr().then(res => {
      /* 方案一 */
      /* const clientId = 'client_' + Math.random().toString(16).substr(2, 8);
      createSocket(
        process.env.VUE_APP_WEBSOCKET_API + '?clientId=' + clientId + "&orgStr=" + res.data
      );
      window.addEventListener('onmessageWS', this.getSocketData); */

      //   /* 方案二 */
      this.initWebSocket(res.data)
    })
    /* $bus事件 */
    this.$bus.$on('refreshFooter', () => {
      this.getInform();
    });

    this.$bus.$on('isPopup', (val) => {
      this.isPopup = val
    })
  },
  beforeDestroy() {
    // window.removeEventListener('onmessageWS', this.getSocketData);
  },
  methods: {
    /* 初始化 */
    getInform() {
      getInform().then((res) => {
        console.log('告警通知初始化: ', res);
        if (res.code === 200) {
          /* 添加look字段 */
          res.data.forEach(item => {
            item.look = 0
          });
          /* 过滤人脸抓拍数据 */
          res.data = res.data.filter(item => {
            if (item.eventCode != 'face_captured') {
              return item
            }
          })
          /* 过滤已处理的数据 */
          this.list = res.data.filter(item => {
            if (item.handleStatus != '1') {
              return item
            }
          })

          let arr = JSON.parse(sessionStorage.getItem('warningList'));
          if (arr instanceof Array) {
            if (!arr.length) return
            /* 找出本地存储中已读的数据，同步到新的请求的数据中 */
            arr.filter(item => item.look == 1).forEach(item => {
              this.list.forEach(ele => {
                if (item.id == ele.id) {
                  ele.look = 1;
                }
              })
            })
          }

          console.log('没处理的数据', this.list);

          this.$bus.$emit('change_fy', this.list);
          sessionStorage.setItem('warningList', JSON.stringify(this.list))
          this.sessionList = JSON.parse(sessionStorage.getItem('warningList'));
        }
      });
    },

    // 创建接收消息函数
    getSocketData(e) {
      // console.log('实时告警', e);
      const data = e && e.data;
      this.isJSON(data).then(res => {
        const obj = JSON.parse(data);
        if (!obj.code) return
        this.data = obj
        if (obj.code == 1001) {
          if (obj.type == '1001') {
            this.data.data.look = 0;
            this.list.unshift(this.data.data);

            // 是否弹框
            if (!this.isPopup) return

            const msgData = this.list[0];
            const message = `警告! ${msgData.stationName + msgData.cameraName}发生${this.setEventType(msgData)}事件,请及时处理`;
            this.handleSpeak(message)
            this.$bus.$emit('change_f', this.list);

            sessionStorage.setItem('warningList', JSON.stringify(this.list))
            this.sessionList = JSON.parse(sessionStorage.getItem('warningList'));
          }
        }
      }, err => {
        return
      })
    },
    test() {
      const obj = {
        address: "192.168.31.240",
        cameraName: "加油广场6",
        createTime: "2021-12-01 00:01:32",
        eventCode: "smoking",
        eventSnapPic: "http://139.159.213.75:9000/aiserver/06a5f8f4-0419-4ecb-85d4-7e7474712392.jpg",
        handleStatus: "0",
        id: "1465712610799374338",
        orgId: "103",
        stationName: "昌平西三旗加油站",
      }
      const message = `警报! ${obj.stationName + obj.cameraName}发生${this.setEventType(obj)}事件,请及时处理`;
      this.handleSpeak(message);

      this.$bus.$emit('change_f', [obj]);
    },
    // 语音播报的函数
    /**
    * text – 要合成的文字内容，字符串
    * lang – 使用的语言，字符串， 例如：“zh-cn”
    * voiceURI – 指定希望使用的声音和服务，字符串
    * volume – 声音的音量，区间范围是0到1，默认是1
    * rate – 语速，数值，默认值是1，范围是0.1到10，表示语速的倍数，例如2表示正常语速的两倍。
    * pitch – 表示说话的音高，数值，范围从0（最小）到2（最大）。默认值为1
    */
    handleSpeak(text) {
      msg.text = text;
      msg.lang = 'zh-TW'; // zh-TW 台湾话 'zh-CN' 普通话 'zh-HK' 粤语
      msg.voiceURI = "Microsoft Huihui - Chinese (Simplified, PRC)";
      msg.volume = '1';
      msg.rate = 1;
      msg.pitch = 1;
      synth.speak(msg);
    },
    // 语音停止
    handleStop(e) {
      msg.text = e;
      msg.lang = 'zh-TW'; // zh-TW 台湾话 'zh-CN' 普通话 'zh-HK' 粤语
      synth.cancel(msg);
    },
    /* 方案二 WebSocket */
    initWebSocket(data) {
      const clientId = 'client_' + Math.random().toString(16).substr(2, 8);
      var Socket = new WebSocket(process.env.VUE_APP_WEBSOCKET_API + '?clientId=' + clientId + "&orgStr=" + data);
      // 建立 web socket 连接成功触发事件
      Socket.onopen = () => {
        // 使用 send() 方法发送数据
        Socket.send('发送数据');
        this.$message.warning('数据发送中...');
      };
      // 接收服务端数据时触发事件
      Socket.onmessage = (evt) => {
        this.getSocketData(evt)
      };
      // 断开 web socket 连接成功触发事件
      Socket.onclose = () => {
        this.$message.warning('连接已关闭...');
      };
    },
    /* dialog */
    // 打开Dialog
    openDialog(item) {
      console.log('事件告警: ', item);
      this.$bus.$emit('openDialog', item);
      item.look = 1;
      console.log(this.sessionList);
      sessionStorage.setItem('warningList', JSON.stringify(this.sessionList))
      this.sessionList = JSON.parse(sessionStorage.getItem('warningList'));
      console.log('this.sessionList: ', this.sessionList);
    },
    // 关闭dialog
    handleCancel() {
      this.$bus.$emit('handleCancel');
    },
    /* 设置按钮的样式 */
    setType(item) {
      switch (item.look) {
        case 1:
          return 'success'
        default:
          return 'danger'
      }
    },
    /* 设置当前事件的状态 */
    setStatus(item) {
      switch (item.look) {
        case 1:
          return '已读'
        default:
          return '未读'
      }
    },

    /* 设置事件类型 */
    setEventType(record) {
      let text = record.eventCode;
      switch (text) {
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
        case 'car_captured':
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
  }
}
</script>

<style lang="less" scoped>
.footer_container {
  overflow: hidden;
}

ul {
  li {
    display: flex;
    flex-direction: column;
    margin-bottom: 14px;
    cursor: pointer;
    header {
      margin-bottom: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div:first-child {
        display: flex;
        align-items: center;
      }
      i {
        width: 6px;
        height: 6px;
        background: #6fe9ce;
        border-radius: 50%;
      }
      span {
        margin-left: 16px;
        font-size: 15px;
        font-weight: 500;
        line-height: 20px;
        color: #6fe9ce;
      }
    }
    footer {
      padding-left: 22px;
      div {
        font-size: 13px;
        font-weight: 500;
        line-height: 17px;
        color: #b6f0fc;
        opacity: 0.65;
      }
    }
  }
}

.right::v-deep .el-button--mini,
.el-button--mini.is-round {
  padding: 3px 10px;
}
</style>
