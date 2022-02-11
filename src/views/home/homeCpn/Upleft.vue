<template>
  <div class="container">
    <!-- title -->
    <div class="title">
      <el-badge :value="list.length" class="item">
        <div class="message">
          <span>任务通知</span>
          <i class="iconfont icon-xiaoxi"></i>
        </div>
      </el-badge>
      <div class="center">
        <el-button
          :disabled="checked"
          v-if="isShow && userType == 30"
          class="center"
          @click="handleDispose"
          size="mini"
          type="primary"
          >处理</el-button
        >
      </div>
      <div>
        <!-- 油站的 -->
        <div
          v-if="userType == 20"
          :class="['text', { active: isShow }]"
          @click="showInput"
        >
          <span>发布任务</span>
          <i class="iconfont icon-fabu" style="margin-left: 10px"></i>
        </div>

        <!-- 油库的 -->
        <div v-else :class="['text', { active: isShow }]" @click="handleBatch">
          <span>批量处理</span>
          <i class="iconfont icon-piliang" style="margin-left: 10px"></i>
        </div>
      </div>
    </div>

    <div class="content">
      <transition name="fade-transform" mode="out-in">
        <!-- 油库 -->
        <main v-if="!isShow">
          <ul class="main">
            <li
              v-for="item in list"
              :key="item.id"
              @click="handleDispose(item)"
              style="cursor: pointer"
            >
              <div class="left">
                <header>
                  <div>
                    <i></i>
                    <span>{{ item.createTime }}</span>
                  </div>
                  <!-- 油库的处理按钮 -->
                  <div v-if="userType == 30" class="right">
                    <el-button size="mini" :type="setType(item)">{{
                      setStatus(item)
                    }}</el-button>
                  </div>
                </header>

                <footer>
                  <div>{{ item.context }}</div>
                </footer>
              </div>
            </li>
          </ul>
        </main>

        <div v-else>
          <!-- 油库的 -->
          <div v-if="userType == 30" class="send_con_a">
            <ul class="main">
              <li v-for="item in untreatedList" :key="item.id">
                <el-checkbox
                  v-model="item.checked"
                  @change="(val) => handleSelectChange(val, item)"
                  class="checkbox"
                >
                  <div class="left">
                    <header>
                      <div>
                        <i></i>
                        <span>{{ item.createTime }}</span>
                      </div>
                    </header>
                    <footer>
                      <div>{{ item.context }}</div>
                    </footer>
                  </div>
                </el-checkbox>
              </li>
            </ul>
          </div>

          <div v-else class="send_con_a">
            <header>
              <h6>请输入油品</h6>
              <div class="type">
                <el-checkbox-group
                  v-model="form.checked"
                  @change="handleChange"
                >
                  <el-checkbox
                    v-for="item in oil_type"
                    :key="item.id"
                    :label="item.name"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </header>
            <footer>
              <h6>请输入油量 （吨）</h6>
              <el-input
                ref="input"
                v-model.number="form.count"
                placeholder="油量 T(吨)"
              ></el-input>
            </footer>

            <div class="btn">
              <el-button
                @click="handleOk"
                size="mini"
                type="primary"
                :loading="loading"
                >确认发布</el-button
              >
              <el-button @click="handleCancel" size="mini" type="danger"
                >取消发布</el-button
              >
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 处理任务的dialog -->
    <el-dialog
      :title="
        parseInt(disposeForm.status) == 1
          ? '处理详情'
          : isShow
          ? '批量处理'
          : '处理任务'
      "
      :visible.sync="visibleHandle"
      width="50%"
      center
      :before-close="handleClose2"
    >
      <el-form
        :model="disposeForm"
        :rules="disposeFormRules"
        ref="disposeForm"
        label-width="100px"
        class="disposeForm"
      >
        <el-form-item label="发车时间" prop="departureTime">
          <el-date-picker
            :disabled="detailOpen"
            style="width: 100%"
            class="disposeFormItem"
            v-model="disposeForm.departureTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="车牌" prop="plateNumber">
          <el-select
            :disabled="detailOpen"
            style="width: 100%"
            v-model="disposeForm.plateNumber"
            placeholder="请选择车牌"
          >
            <el-option
              v-for="item in optionsCarNumber"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="司机" prop="name">
          <el-input
            :disabled="detailOpen"
            v-model.trim="disposeForm.name"
            placeholder="请输入司机名"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            :disabled="detailOpen"
            style="width: 100%"
            v-model="disposeForm.mobile"
            placeholder="请输入电话"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 100%" label="油品" prop="oilType">
          <el-input
            v-model.number="disposeForm.oilType"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="油量" prop="oil">
          <el-input
            :disabled="detailOpen"
            style="width: 100%"
            v-model="disposeForm.oil"
            placeholder="油量 T(吨)"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="parseInt(disposeForm.status) == 0">
        <el-button type="danger" @click="handleClose2">关 闭</el-button>
        <el-button type="primary" @click="handleOk2">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMessageList, send, handleTask, getTaskDetail } from "@/api/home/home";
import Footer from "../../../components/content/homeCpn/rightBottom/Footer.vue";
import { mapGetters } from "vuex";

import "@/assets/css/element-reset.css";
const oil_type = [
  { id: 0, name: "0#" },
  { id: 1, name: "92#" },
  { id: 2, name: "95#" },
  { id: 3, name: "98#" },
];
/* 日期时间选择器的快捷选项 */
const pickerOptions = {
  shortcuts: [
    {
      text: "今天",
      onClick(picker) {
        picker.$emit("pick", new Date());
      },
    },
    {
      text: "昨天",
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit("pick", date);
      },
    },
    {
      text: "一周前",
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit("pick", date);
      },
    },
  ],
};
export default {
  components: { Footer },
  data() {
    return {
      /* 查看详情 */
      detailOpen: false,
      /* 未处理的任务 */
      untreatedList: [],
      /* 是否选中有数据 */
      checked: true,
      /* 选中的数据 */
      checkedList: [],
      /* 车牌的数据 */
      optionsCarNumber: [],
      /* 司机的数据 */
      optionsDriver: [],
      /* 处理的visible */
      visibleHandle: false,
      /* 处理的表单 */
      disposeForm: {
        status: null,
        taskIds: null,
        departureTime: null, // 发车时间
        plateNumber: null, // 车牌
        name: null, // 司机
        mobile: null, // 电话号码
        oilType: null /* 油品 */,
        oil: null /* 油量 */,
      },
      disposeFormRules: {
        departureTime: [
          { required: true, message: "请选择发车时间", trigger: "blur" },
        ],
        plateNumber: [
          { required: true, message: "请选择车牌", trigger: "blur" },
        ],
        name: [{ required: true, message: "请选择司机", trigger: "blur" }],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
        ],
        oilType: [{ required: true, trigger: "blur" }],
        oil: [{ required: true, message: "油量不能为空", trigger: "blur" }],
      },
      /* 日期时间选择器的快捷选项 */
      pickerOptions: pickerOptions,
      /* 判断用户是油站人员还是油库人员 */
      userType: null,
      /* 油站发布任务表单 */
      form: {
        orgId: null,
        checked: [], // 选中的
        count: null,
      },
      list: [], // 消息列表
      oil_type: oil_type,

      input: null,
      open: true,
      isShow: false,
      loading: false,
      options: [
        { value: 1, label: "发布加油任务" },
        { value: 2, label: "查看发车情况" },
      ],
      value: null, //下拉框选中的值
      isChange: false,
    };
  },
  created() {
    this.userType = this.info.user.type
    this.form.orgId = this.info.user.orgId
    this.getMessageList();
  },
  mounted() { },
  computed: {
    ...mapGetters(["info"]),
  },
  watch: {
    isShow(val) {
      if (!val) {
        this.list.forEach((item) => {
          item.checked ? (item.checked = false) : null;
        });
      }
    },
  },
  methods: {
    /* 网络请求区域 */
    // 获取通知列表
    getMessageList() {
      // const orgId = this.info.user.orgId;
      getMessageList().then((res) => {
        console.log("获取通知列表: ", res);
        if (res.code === 200) {
          this.list = res.rows;
        }
      });
    },

    onChange() {
      this.isChange = !this.isChange;
    },
    // 发布任务
    showInput() {
      this.isShow = true;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }, 900);
    },
    // 处理确认发布
    handleOk() {
      if (!this.form.checked.length) return this.$message.info("请完善表单");
      if (!this.form.count) return this.$message.info("请完善表单");
      const stationName = this.$store.getters.info.user.dept.deptName;
      const type = this.form.checked.join("");
      const num = this.form.count + "";
      const orgId = this.form.orgId + '';

      const data = {
        orgId,
        stationName,
        type,
        num,
      };
      this.loading = true;

      // 发送
      send(data).then((res) => {
        console.log("油站发布任务: ", res);
        if (res.code === 200) {
          this.$message.success("发布成功");
          this.loading = false;
          this.getMessageList();
          this.handleCancel();
        } else {
          this.$message.error("发布失败");
          this.loading = false;
        }
      });
    },

    // 取消发布
    handleCancel() {
      this.input = null;
      this.isShow = false;
      this.form.checked = [];
      this.form.count = null;
    },
    /* 处理选中的值发生变化 */
    handleChange() {
      if (this.form.checked.length > 1) {
        this.form.checked.splice(0, 1);
      }
    },
    /* 重置表单 */
    reset() {
      this.disposeForm = {
        taskIds: null,
        departureTime: null,
        plateNumber: null,
        name: null,
        mobile: null,
        oilType: null,
        oil: null,
      };
      this.$refs.disposeForm.resetFields();
    },
    /* 油库 处理油站任务弹窗 */
    handleDispose(item) {
      if (this.userType != 30) return;
      this.disposeForm.status = item.status;
      if (parseInt(item.status) == 1) {
        getTaskDetail(item.taskOrderId).then(res => {
          console.log('获取司机任务详情: ', res);
          const data = res.data;
          this.disposeForm.departureTime = data.departureTime;
          // this.disposeForm.plateNumber = data.plateNumber;
          this.disposeForm.name = data.name;
          this.disposeForm.mobile = data.mobile;
          this.disposeForm.oil = data.oil + ' 吨';
          this.detailOpen = true;
        })
      }
      console.log("处理任务弹窗: ", item);
      if (!this.isShow) {
        this.disposeForm.oilType = item.type;
        this.disposeForm.taskIds = [item.id];
      } else {
        const arr = this.list.filter((item) => item.id === this.checkedList[0]);
        this.disposeForm.oilType = arr[0].type;
      }
      this.visibleHandle = true;
    },
    /* 处理任务关闭 */
    handleClose2() {
      this.reset();
      this.visibleHandle = false;
      this.detailOpen = false;
    },
    /* 处理任务保存 */
    handleOk2() {
      this.$refs.disposeForm.validate((valid) => {
        if (valid) {
          let taskIds;
          if (!this.isShow) {
            taskIds = this.disposeForm.taskIds;
          } else {
            taskIds = this.checkedList;
          }
          const departureTime = this.disposeForm.departureTime;
          const name = this.disposeForm.name;
          const mobile = this.disposeForm.mobile;
          const oilType = this.disposeForm.oilType.replace(/#/, '');
          const oil = this.disposeForm.oil;
          const data = {
            taskIds,
            departureTime,
            name,
            mobile,
            oilType,
            oil,
          };
          console.log("处理任务的表单", this.disposeForm);
          handleTask(data).then((res) => {
            console.log("处理任务: ", res);
            if (res.code == 200) {
              this.$message.success("处理成功");
              this.getMessageList()
              this.handleClose2()
            } else {
              this.$message.error("处理失败");
            }
          });
        }
      });
    },

    /* 批量处理按钮 */
    handleBatch() {
      this.isShow = !this.isShow;
      this.untreatedList = this.list.filter(item => {
        return parseInt(item.status) !== 1
      })
    },
    /* 处理多选变化 */
    handleSelectChange(boolean, item) {
      let length = this.checkedList.length;
      if (length >= 1) {
        const lastId = this.checkedList[length - 1];
        const lastArr = this.list.filter((item4) => item4.id === lastId);
        const type = lastArr[0].type;
        if (item.type != type) {
          item.checked = false;
          return this.$message.info("当前油品和已勾选的不属于同一类型");
        }
      }
      /* 每次改变 数组清空 */
      this.checkedList = [];
      item.checked = boolean;

      this.checkedList = this.list
        .filter((item2) => {
          if (item2.checked) {
            return item2;
          }
        })
        .map((item3) => item3.id);
      this.checked = !length;
      length = this.checkedList.length;
      console.log("this.checkedList", this.checkedList);
    },
    /* 设置处理按钮的颜色样式 */
    setType(item) {
      switch (parseInt(item.status)) {
        case 1:
          return "success";
        default:
          return "danger";
      }
    },
    // 设置处理的状态
    setStatus(item) {
      switch (parseInt(item.status)) {
        case 1:
          return "已处理";
        default:
          return "未处理";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  box-sizing: border-box;
  padding: 20px 16px;
  width: 334px;
  height: 253px;
  background: rgba(43, 55, 84, 0.5);
  border: 1px solid #84ece4;
  border-radius: 19px;
  overflow: hidden;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    opacity: 1;
    .message {
      display: flex;
      align-items: center;
      .icon-xiaoxi {
        font-size: 20px;
      }
    }
    .el-button {
      margin-left: 6px;
    }
    .text {
      display: flex;
      align-items: center;
      color: #4becdf;
      cursor: pointer;
      transition: all 500ms;
      &.active {
        color: #f56c6c;
      }
    }
  }

  .content {
    box-sizing: border-box;
    width: 306px;
    height: 203px;

    word-break: break-word;
    white-space: pre-line;

    color: #6fe9ce;
    overflow-y: scroll;
    .main {
      li {
        width: 100%;
        margin-bottom: 10px;

        .left {
          display: flex;
          flex-direction: column;
        }

        .right {
          transform: translateY(3px);
        }

        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1px;
          width: 100%;
          > div {
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
            color: #b6f0fcd4;
          }
        }
      }
    }

    .send_con_a {
      h6 {
        color: #fff;
      }
      header {
        margin-bottom: 15px;
      }
      .btn {
        margin-top: 20px;
      }
    }

    .send_con_b {
      h6 {
        padding-right: 10px;
        color: #fff;
        white-space: nowrap;
      }
      header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      ul {
        li {
          h6 {
            color: #4becdf;
          }
          align-items: center;
          .el-col:nth-child(1) {
            margin-right: 30px;
          }
          .el-col:nth-child(2) {
            margin-right: 19px;
          }
        }
      }

      .btn {
        padding-bottom: 20px;
      }
    }
  }
}

/* button按钮 */
li .el-button--mini,
.el-button--mini.is-round {
  padding: 3px 10px;
}

.center .el-button--mini,
.el-button--mini.is-round {
  padding: 3px 10px;
}

::v-deep .el-dropdown-menu__item {
  color: #fff;
  font-weight: 500;
  background-color: transparent;
}
::v-deep .el-dropdown-menu__item:hover {
  background-color: transparent;
}

.send_con_b ::v-deep .el-button--mini,
.el-button--mini.is-round {
  padding: 0.0875rem 0.1675rem;
}

::v-deep .el-picker-panel__shortcut {
  color: #fff;
}

::v-deep .el-badge__content {
  border-radius: 12px;
  font-weight: 500;
  border: none;
  top: 5px;
}
</style>
