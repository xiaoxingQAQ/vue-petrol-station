<template>
  <div class="list_e">
    <el-table :data="tableData" border>
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="orgId" label="预警区域">
        <template #default="scope">
          <div>
            {{ setDepartment(deptPermission, +scope.row.orgId) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="strategyName" label="预警类型">
        <template #default="scope">
          <div>
            {{
              scope.row.strategyName == 1
                ? '账号数据异常'
                : scope.row.strategyName == 2
                ? '事件告警异常'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="300" prop="alarmMatter" label="预警内容">
        <template #default="scope">
          <div>
            {{
              scope.row.alarmMatter == 1
                ? '账号综合评分过低'
                : scope.row.alarmMatter == 2
                ? '账号警情处置比例过低'
                : scope.row.alarmMatter == 3
                ? '频繁触发 ' + alarmNameArr[scope.row.algorithmId] + ' 告警'
                : scope.row.alarmMatter == 4
                ? alarmNameArr[scope.row.algorithmId] + ' 告警高于历史平均值'
                : scope.row.alarmMatter == 5
                ? alarmNameArr[scope.row.algorithmId] +
                  ' 告警在 ' +
                  scope.row.startTime +
                  '-' +
                  scope.row.entTime +
                  ' 内告警高于历史平均值'
                : scope.row.alarmMatter == 6
                ? alarmNameArr[scope.row.algorithmId] +
                  ' 告警已超过当天预警上限值'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="updateTime"
        label="预警时间"
      ></el-table-column>
      <el-table-column prop="historicalData" label="历史数据">
        <template #default="scope">
          <div>
            {{
              scope.row.historicalData == 1
                ? '无'
                : scope.row.historicalData == 2
                ? '最近30天平均值'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="valueRange" label="取值范围">
        <template #default="scope">
          <div>
            {{
              scope.row.valueRange == 1
                ? '一个小时内'
                : scope.row.valueRange == 2
                ? '当天数据'
                : scope.row.valueRange == 3
                ? '当月数据'
                : ''
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lineOf" label="预警线标准">
        <template #default="scope">
          <div>
            {{ warningValueArr[scope.row.warningValue - 1] + scope.row.lineOf }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="currentData" label="当前数据"></el-table-column>
      <el-table-column prop="disposeResults" label="处理结果"></el-table-column>
      <el-table-column prop="disposeDetails" label="处理详情"></el-table-column>
      <el-table-column prop="principal" label="负责人"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getJudgedSelect } from '@/api/analyse/analyse';
import { getAlgorithmList } from "@/api/oilStation"
export default {
  props: ['pageNum'],
  data() {
    return {
      /* dialog区域 */
      // 新建档案区域
      // visible_1: false,
      // input_1: null,
      tableData: [],
      total: 0, // 分页total总数
      queryParams: {
        startDate: null,
        endDate: null,
        pageNum: 1,
        pageSize: 10,
        strategyName: ''
      },
      deptPermission: [],
      warningValueArr: ['低于', '高于'],
      alarmNameArr: []
    };
  },
  watch: {
    pageNum() {
      this.queryParams.pageNum = this.pageNum
      this.getJudgedSelect()
    },
  },
  created() {
    this.deptPermission = this.$store.getters.info.deptPermission;
    this.getJudgedSelect()
    this.getAlgorithmList()
  },
  mounted() {
    this.$bus.$on('refreshE', (data) => {
      this.queryParams.startDate = data.startDate
      this.queryParams.endDate = data.endDate
      this.queryParams.strategyName = data.warningType
      this.queryParams.pageNum = 1
      this.getJudgedSelect()
    });
  },
  computed: {
    orgId() {
      return this.$store.getters.info.user.orgId;
    },
  },
  methods: {
    // 获取告警名称
    getAlgorithmList() {
      getAlgorithmList({ orgId: this.orgId }).then((res) => {
        res.data.forEach(it => {
          this.alarmNameArr[it.id] = it.name;
        })
      });
    },
    // 查询
    getJudgedSelect() {
      getJudgedSelect(this.queryParams).then(res => {
        this.tableData = res.rows
        this.total = parseInt(res.total)
        this.$emit('setParams', this.queryParams, this.total);
      })
    },
    setDepartment(arr, id) {
      let _this = this
      for (let i = 0; i < arr.length; i++) {
        let str = arr[i]
        if (str.id === id) {
          return str.label
        } else {
          if (str.children && str.children.length > 0) {
            let res = _this.setDepartment(str.children, id)
            if (res) {
              return res
            }
          }
        }
      }
    },
    // 处理·新建档案框·关闭
    // handleCancel_1() {
    //   this.visible_1 = false;
    // },
    // 处理·新建档案·保存
    // handleOk_1() {
    //   // 关闭dialog框
    //   this.handleCancel_1();
    // }
  }
};
</script>

<style lang="less" scoped>
.list_e {
  margin-top: 10px;
  width: 100%;

  .row {
    margin-top: 10px;
    margin-bottom: 20px;
    float: right;
    ::v-deep .el-button--default {
      color: #000;
      background-color: #84f7d1ff;
      border-color: #84f7d1ff;
    }

    ::v-deep .el-button--default:hover {
      color: #000;
      background-color: rgb(157, 243, 214);
    }
  }

  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    background-color: #1a2c3fff;
  }

  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    background-color: #1a2c3fff;
  }
  // 边框
  ::v-deep .el-table--border {
    border-color: #4eece2ff;
  }

  // 暂无数据
  ::v-deep .el-table__empty-block {
    background-color: #1a2c3fff;
  }

  // 每一行的背景颜色
  ::v-deep
    .el-table--enable-row-hover
    .el-table__body
    tr:hover
    > td.el-table__cell {
    background-color: #1a2c3fff;
  }
  // 边框
  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf,
  ::v-deep .el-table--border th.el-table__cell,
  ::v-deep .el-table__fixed-right-patch,
  ::v-deep .el-table--border {
    border-color: #4eece2ff;
  }

  ::v-deep .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #4eece2ff;
  }

  // 暂无数据
  ::v-deep .el-table__empty-block {
    background-color: #1a2c3fff;
  }
}
</style>