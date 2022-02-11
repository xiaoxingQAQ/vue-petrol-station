<template>
  <div class="data_row">
    <div class="left">
      <!-- 开始时间 -->
      <div>
        <span>开始时间</span>
        <el-date-picker
          class="date"
          size="small"
          v-model="startDate"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="handleChange"
        >
        </el-date-picker>
      </div>
      <!-- 结束时间 -->
      <div>
        <span>结束时间</span>
        <el-date-picker
          class="date"
          size="small"
          v-model="endDate"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <!-- 人车轨迹的 分类 -->
      <div v-if="typex == 'd'">
        <span>分类</span>
        <el-select
          clearable
          v-model="value_d_b"
          placeholder="模糊搜索"
          size="small"
        >
          <el-option
            v-for="item in options_type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="typex == 'd'" class="input">
        <span>姓名</span>
        <el-input v-model="name" size="small" placeholder="模糊搜索"></el-input>
      </div>

      <!-- 研判告警 -->
      <div v-if="typex == 'e'" class="input-b">
        <span>预警类型</span>
        <el-select
          clearable
          v-model="warningType"
          placeholder="请选择预警类型"
          size="small"
        >
          <el-option
            v-for="item in options_warningType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>
    </div>

    <div class="center">
      <!-- 智能分析 事件类型 -->
      <div v-show="typex == 'a'">
        <span>事件类型</span>
        <el-select
          clearable
          v-model="queryParams.eventCode"
          placeholder="模糊搜索"
          size="small"
        >
          <el-option
            v-for="item in list"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 机构 -->
      <div v-if="typex == 'a'">
        <!-- 机构 -->
        <span>机构</span>
        <el-cascader
          ref="cascaderAder"
          collapse-tags
          placeholder="模糊搜索"
          clearable
          size="small"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'label',
            emitPath: false,
            multiple: true,
            clearable: true,
          }"
          :show-all-levels="false"
          v-model="queryParams.orgIds"
        >
        </el-cascader>
      </div>
      <!-- 状态 -->
      <div class="uniqueBy" v-if="typex === 'a'">
        <span>状态</span>
        <el-select
          clearable
          v-model="queryParams.handleStatus"
          placeholder="模糊搜索"
        >
          <el-option
            v-for="item in statusOptionsA"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>

      <!-- 智能抓拍 机构 -->
      <div v-if="typex == 'b'">
        <span>机构</span>
        <el-cascader
          ref="cascaderAder"
          style="margin-left: 0.5%"
          collapse-tags
          placeholder="模糊搜索"
          clearable
          size="small"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'label',
            emitPath: false,
            multiple: true,
            clearable: true,
          }"
          :show-all-levels="false"
          v-model="queryParams2.orgIds"
        >
        </el-cascader>
      </div>
      <!-- 抓拍类型 -->
      <div class="uniqueBy" v-if="typex === 'b'">
        <span>抓拍类型</span>
        <el-select
          clearable
          v-model="queryParams2.takeType"
          placeholder="模糊搜索"
          size="small"
        >
          <el-option
            v-for="item in options_b_c"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>

      <!-- 名单预警 -->
      <!-- 布控类型 -->
      <div class="uniqueBy" v-if="typex === 'c'">
        <span>抓拍信息类型</span>
        <el-select
          clearable
          v-model="queryParams3.captureType"
          placeholder="模糊搜索"
          size="small"
        >
          <el-option
            v-for="item in options_b_c"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div v-if="typex == 'c'" style="margin-right: 5px">
        <span>布控原因</span>
        <el-input
          v-model="queryParams3.reason"
          placeholder="模糊搜索"
          size="small"
        ></el-input>
      </div>
      <!-- 布控名称-->
      <div class="uniqueBy" v-if="typex === 'c'">
        <span>布控名称</span>
        <el-input
          v-model="queryParams3.designation"
          size="small"
          placeholder="模糊搜索"
        ></el-input>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>

      <!-- 人车轨迹 -->
      <!-- 性别 -->
      <div style="margin-left: 1%" v-if="typex == 'd'">
        <span>车牌</span>
        <el-input
          v-model="plateNumber"
          size="small"
          placeholder="模糊搜索"
        ></el-input>
      </div>
      <!-- 机构 -->
      <div class="uniqueBy" v-if="typex === 'd'">
        <span>机构</span>
        <el-cascader
          ref="cascaderAder"
          collapse-tags
          placeholder="模糊搜索"
          size="small"
          :options="treeData"
          clearable
          :props="{
            value: 'id',
            label: 'label',
            emitPath: false,
            multiple: true,
            clearable: true,
          }"
          :show-all-levels="false"
          v-model="place3"
        >
        </el-cascader>
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>
    </div>

    <div
      style="flex: 1; text-align: right; align-self: center"
      v-if="typex !== 'b'"
    ></div>
  </div>
</template>

<script>
import { getDate, getNowTime } from "@/utils/getDate";

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "@/assets/css/element-reset.css";
const statusOptionsA = [
  { value: null, label: "全部" },
  { value: 0, label: "未处理" },
  { value: "现场处理", label: "现场处理" },
  { value: "事件上报", label: "事件上报" },
];
export default {
  components: {
    Treeselect,
  },
  props: {
    typex: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      startDate: null, // 开始时间
      endDate: null, // 结束时间
      treeData: [], // 地点 树形图

      // 智能分析 A
      queryParams: {
        eventCode: null,
        orgIds: [],
        handleStatus: null,
      },
      // 智能分析的状态数据
      statusOptionsA: statusOptionsA,
      // 智能抓拍
      queryParams2: {
        orgIds: [],
        takeType: '车辆',
      },
      // 名单预警
      queryParams3: {
        captureType: "人脸", // 抓拍信息类型
        reason: null,
        designation: null,
      },
      // 人车轨迹
      queryParams4: {},
      // 研判告警
      queryParams5: {},

      /* 智能抓拍 */
      value_b_c: "车辆", // 抓拍类型
      options_b_c: [
        {
          label: "人脸",
          value: "人脸",
        },
        {
          label: "车辆",
          value: "车辆",
        },
      ], // 抓拍类型
      /* 名单预警 */
      captureType: "人脸", // 抓拍信息类型
      isChange_captureType: false,
      value_c_b: null, // 布控原因
      value_c_c: null, // 布控名称
      options_c_b: [], // 布控类型
      options_c_c: [], // 布控名称
      /* 人车轨迹 */
      name: null, // 人车轨迹 姓名
      value_d_b: "2", // 人车轨迹 分类
      plateNumber: null, // 车牌
      place3: [], // 人车轨迹的 机构
      options_type: [
        // 人车轨迹 分类
        {
          label: "人员",
          value: "1",
        },
        {
          label: "车辆",
          value: "2",
        },
        {
          label: "人车",
          value: "3",
        },
      ],
      options_d_b: [], // 人车轨迹 车牌
      options_d_c: [], // 人车轨迹 存档
      /* 研判告警 */
      warningType: null, // 预警类型

      options_warningType: [
        { label: '无', value: null },
        { label: '账号数据异常', value: 1 },
        { label: '事件告警异常', value: 2 }
      ]
    };
  },
  computed: {},
  mounted() {
    this.setDate();
    this.setTreeselect();
  },
  watch: {},
  methods: {
    setTreeselect() {
      this.treeData = this.$store.getters.info.deptPermission;
    },
    // vue treeselect 禁止选择某些节点
    my_normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == "1" ? true : false,
      };
    },

    // 设置当前的时间
    setDate() {
      this.startDate = getDate() + " 00:00:00";
      this.endDate = getNowTime();
      const ojb = {
        startDate: this.startDate,
        endDate: this.endDate,
      };
      this.$bus.$emit("setDate", ojb);
    },
    handleChange(val) {
      console.log("val: ", val);
    },
    /* 处理查询 */
    handleSearch() {
      switch (this.typex) {
        case "a":
          let str;
          if (this.queryParams.orgIds.length) {
            str = this.queryParams.orgIds.join(",");
          }
          let form = {
            startDate: this.startDate,
            endDate: this.endDate,
            eventCode: this.queryParams.eventCode,
            orgIds: str,
            handleStatus: this.queryParams.handleStatus,
          };
          console.log(form);
          this.$bus.$emit("refreshA", form);
          break;
        case "b":
          let str2;
          if (this.queryParams2.orgIds.length) {
            str2 = this.queryParams2.orgIds.join(",");
          }
          const takeData = {
            startDate: this.startDate,
            endDate: this.endDate,
            takeType: this.queryParams2.takeType,
            orgIds: str2,
          };
          this.$bus.$emit("refreshB", takeData);
          break;
        case "c":
          const earlyList = {
            startDate: this.startDate,
            endDate: this.endDate,
            takeType: this.queryParams3.captureType,
            cause: this.queryParams3.reason,
            designation: this.queryParams3.designation
          };
          this.$bus.$emit("refreshC", earlyList);
          break;
        case "d":
          let str3;
          if (this.place3.length) {
            str3 = this.place3.join(",");
          }
          const trackList = {
            startDate: this.startDate,
            endDate: this.endDate,
            type: this.value_d_b,
            name: this.name,
            plateNumber: this.plateNumber,
            orgIds: str3,
          };
          this.$bus.$emit("refreshD", trackList);
          break;
        case 'e':
          const warningArr = {
            startDate: this.startDate,
            endDate: this.endDate,
            warningType: this.warningType
          };
          this.$bus.$emit("refreshE", warningArr);
          break;
      }
    },
    /* 重置查询 */
    resetSearch() {
      this.startDate = getDate() + " 00:00:00";
      this.endDate = getNowTime();
      switch (this.typex) {
        case 'a':
          this.queryParams.eventCode = null;
          this.queryParams.handleStatus = null;
          this.queryParams.orgIds = []
          break;
        case 'b':
          this.queryParams2.orgIds = [];
          this.queryParams2.takeType = '车辆';
          break;
        case 'c':
          this.queryParams3.captureType = '人脸';
          this.queryParams3.reason = null;
          this.queryParams3.designation = null;
          break;
        case 'd':
          this.place3 = [];
          this.value_d_b = "2";
          this.name = null;
          this.plateNumber = null;
          break;
        case 'e':
          this.warningType = null;
          break;
      }
      this.handleSearch()
    },
  },
  handleQuery() { },
};
</script>

<style lang="less" scoped>
.data_row {
  display: flex;
  margin-top: 25px;
  // 左边
  .left {
    display: flex;
    div {
      display: flex;
      align-items: center;

      span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 500;
        line-height: 14px;
        color: #ffffff;
      }
    }
    div:first-child {
      margin-right: 10px;
    }
    div:nth-child(2) {
      margin-right: 10px;
    }

    .input {
      display: flex;
      span {
        text-align: center;
        width: 28px;
        height: 20px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #ffffff;
      }

      ::v-deep .el-input__inner {
        width: 150px;
      }
    }
    .input-b {
      margin-left: 20px;
    }
  }
  .input-b::v-deep .el-input__inner {
    width: 150px;
  }
  // 中间
  .center {
    display: flex;
    div {
      display: flex;
      align-items: center;

      span {
        margin-right: 10px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }

    div:nth-child(1),
    div:nth-child(2) {
      margin-right: 10px;
    }
  }
}

.type::v-deep .el-input__inner {
  height: 50px;
}
/* 选择框 */
::v-deep .el-input__inner {
  color: #fff !important;
  background: rgba(35, 63, 87, 0.65) !important;
  border: 1px solid #84ece4 !important;
}

::v-deep .vue-treeselect {
  width: 250px;
}
::v-deep .vue-treeselect__control {
  background: rgb(35, 63, 87) !important;
  border: 1px solid #84ece4 !important;
  overflow: hidden;
}

::v-deep .vue-treeselect__multi-value {
  font-weight: 500;
}

::v-deep .vue-treeselect__menu {
  border: none !important;
  color: #000;
  font-weight: 500;
}

::v-deep .el-input__inner {
  height: 32px;
}

.el-cascader {
  width: 280px !important;
  height: 32px !important;
}
.data_row .center .el-cascader::v-deep .el-input__inner {
  width: 280px !important;
  height: 32px !important;
}

::v-deep .el-input.el-input--suffix .el-input__inner {
  height: 32px;
}
::v-deep .el-cascader-node:not(.is-disabled):focus,
.el-cascader-node:not(.is-disabled):hover {
  background: #f5f7fa00;
}

::v-deep .el-cascader__tags .el-tag:not(.is-hit),
.el-tag .el-icon-close::before {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.258);
}
.active {
  color: #409eff;
}
</style>
