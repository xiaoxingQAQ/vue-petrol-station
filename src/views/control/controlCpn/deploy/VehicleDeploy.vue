<template>
  <div class="list_b">
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      max-height="650"
      @selection-change="handleSelectionChange"
      style="background-color: #1a2c3fff; width: 100%; overflew-y: auto"
    >
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="monitorName" label="布控名称"></el-table-column>
      <el-table-column prop="monitorCause" label="布控原因"></el-table-column>
      <el-table-column prop="licence" label="车牌"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <!-- <el-button @click="handlePlan(scope.row)" type="primary" size="small"
            >布控计划</el-button
          > -->
          <el-button @click="handleEdit(scope.row)" type="primary" size="small"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="confirmEvent(scope.row)"
            @cancel="cancelEvent"
            :title="'确认是否删除车牌为' + '“' + scope.row.licence + '”' + '？'"
          >
            <el-button
              style="margin-left: 10px"
              slot="reference"
              type="danger"
              size="small"
              >删除</el-button
            >
          </el-popconfirm>
          <el-button
            style="margin-left: 10px"
            @click="layout(scope.row)"
            type="primary"
            size="small"
            >布控</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tablePage.currentPage"
      :page-sizes="tablePage.pageSizes"
      :page-size="tablePage.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage.totalResult"
    >
    </el-pagination>
    <!-- 新建布控弹窗 -->
    <el-dialog
      :title="titleText"
      :visible="appendKey"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleCancel"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="机构" prop="orgId">
          <div class="select">
            <el-cascader
              ref="cascaderAder"
              style="width: 100%"
              collapse-tags
              placeholder="请选择机构"
              :clearable="true"
              :options="treeData"
              @visible-change="onChange_aiServer2"
              :props="{
                value: 'id',
                label: 'label',
                checkStrictly: true,
                emitPath: false,
              }"
              :show-all-levels="false"
              v-model="ruleForm.orgId"
            >
              <template slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span
                  :class="{ active: ruleForm.orgId == data.id }"
                  @click="handleNodeClick(node, data)"
                  >{{ data.label }}</span
                >
              </template>
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="布控名称:" prop="monitorName">
          <el-input
            placeholder="请输入布控名称"
            v-model="ruleForm.monitorName"
          ></el-input>
        </el-form-item>
        <el-form-item label="布控原因:" prop="monitorCause">
          <el-input
            type="textarea"
            placeholder="请输入布控原因"
            v-model="ruleForm.monitorCause"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="车牌:" prop="licence">
          <el-input
            placeholder="格式：粤B8888"
            v-model="ruleForm.licence"
          ></el-input>
        </el-form-item>
        <el-form-item style="display: flex; justify-content: end">
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 布控弹窗 -->
    <el-dialog
      title="布控"
      :visible.sync="layoutKey"
      width="30%"
      :before-close="handleCancel_layoutKey"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="加油站">
          <el-cascader
            ref="cascaderAder"
            style="width: 100%"
            collapse-tags
            placeholder="请选择加油站"
            :clearable="true"
            @visible-change="onChange_aiServer"
            :options="treeData"
            :props="{
              value: 'id',
              label: 'label',
              checkStrictly: true,
              emitPath: false,
            }"
            :show-all-levels="false"
            v-model="petrolStation"
          >
            <template slot-scope="{ node, data }">
              <i :class="data.icon"></i>
              <span
                :class="{ active: petrolStation == data.id }"
                @click="handleNodeClick2(node, data)"
                >{{ data.label }}</span
              >
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk_layoutKey">保 存</el-button>
        <el-button type="danger" @click="handleCancel_layoutKey"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 布控计划弹窗 -->
    <MonitorPlan
      :planKey="planKey"
      @resetCancel_plan="resetCancel_plan"
      @submitConfirm_plan="submitConfirm_plan"
    />
  </div>
</template>
<script>
import MonitorPlan from '@/components/content/dialog/MonitorPlan';
import { serverList } from '@/api/control/control';
import { batchDeletes, saveAddEidt, getSelects, monitorControl } from '@/api/deploy'
export default {
  components: {
    MonitorPlan
  },
  data() {
    return {
      titleText: '', // 弹窗标题文字
      planKey: false, // 布控计划弹窗
      appendKey: false, // 新建布控显示状态
      ruleForm: {
        monitorName: '',
        monitorCause: '',
        licence: '',
        orgId: ''
      },
      rules: {
        orgId: [
          { required: true, message: '请选择机构', trigger: 'blur' },
        ],
        monitorName: [
          { required: true, message: '请输入布控名称', trigger: 'blur' },
        ],
        monitorCause: [
          { required: true, message: '请输入布控原因', trigger: 'blur' },
        ],
        licence: [
          { required: true, message: '请输入车辆', trigger: 'blur' },
          { pattern: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/, message: '请输入正确的车牌', trigger: 'blur' }
        ]
      },
      tableData: [], // 表格数据
      tablePage: { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      selectTableData: [], // 存储选中的多选框
      currentDeploy: false, // 判断当前是添加还是修改
      currentEidtData: {}, // 编辑时存储当前布控数据
      layoutKey: false, // 布控弹窗数据
      archivesId: '', // 当前布控id
      aiServerId: '', // 当前服务id
      aiServer: [],
      treeData: [], // 加油站数据
      petrolStation: '', // 选中加油站的id
      isChange_aiServer: false,
      isChange_aiServer2: false
    }
  },
  created() {
    this.getTableData()
    this.treeData = this.$store.getters.info.deptPermission;
    this.petrolStation = this.treeData[0].id;
  },
  methods: {
    // 获取表格信息
    async getTableData() {
      const params = {
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize,
        sort: 1
      }
      const res = await getSelects(params)
      this.tableData = res.rows
      this.tablePage.totalResult = +res.total
    },
    // 布控计划 取消
    resetCancel_plan() {
      this.planKey = false
    },
    // 布控计划 确定
    submitConfirm_plan() {
      this.planKey = false
    },
    // 点击查询
    getQuery(data) {
      const params = {
        startDate: data.startTime,
        endDate: data.endTime,
        licence: data.plate,
        orgId: data.orgId,
        sort: 1,
        // pageNum: this.tablePage.currentPage,
        pageNum: 1,
        pageSize: this.tablePage.pageSize,
      }
      getSelects(params).then(res => {
        this.tableData = res.rows
      })
    },
    // 批量删除
    deleteBatches() {
      if (this.selectTableData.length > 0) {
        console.log(this.selectTableData)
        this.$confirm(
          '您确定要批量删除这些布控吗?',
          '批量删除',
          {
            closeOnClickModal: false,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            const idArr = this.selectTableData.map(it => it.id)
            batchDeletes(idArr).then(res => {
              if (res.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '批量删除成功',
                })
                this.getTableData()
              }
            })
          })
          .catch(() => {
            this.selectTableData = []
            this.$refs.multipleTable.clearSelection()
          })
      } else {
        this.$notify({
          title: '提示',
          message: '当前没有可删除的布控',
          type: 'warning',
        });
      }
    },
    // 点击布控计划
    handlePlan(row) {
      console.log(row)
      this.planKey = true
    },
    // 新建布控
    handleAppend() {
      this.titleText = '新增车牌布控'
      this.appendKey = true
    },
    // 编辑布控
    handleEdit(row) {
      this.currentEidtData = row
      this.titleText = '修改车牌布控'
      this.currentDeploy = true
      this.ruleForm = {
        monitorName: row.monitorName,
        monitorCause: row.monitorCause,
        licence: row.licence,
        orgId: +row.orgId
      }
      this.appendKey = true
    },
    // 新建布控  确定
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentDeploy) {
            // 编辑
            saveAddEidt({
              monitorName: this.ruleForm.monitorName,
              monitorCause: this.ruleForm.monitorCause,
              licence: this.ruleForm.licence,
              sort: 1,
              id: this.currentEidtData.id,
              orgId: this.ruleForm.orgId
            }).then(res => {
              if (res.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '编辑布控成功',
                })
                this.getTableData()
                this.currentDeploy = false
              }
            })
          } else {
            // 新增
            saveAddEidt({
              monitorName: this.ruleForm.monitorName,
              monitorCause: this.ruleForm.monitorCause,
              licence: this.ruleForm.licence,
              sort: 1,
              orgId: this.ruleForm.orgId
            }).then(res => {
              if (res.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '添加布控成功',
                })
                this.getTableData()
              }
            })
          }
          this.ruleForm = {
            monitorName: '',
            monitorCause: '',
            licence: '',
          }
          this.appendKey = false
          return true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新建布控 取消
    resetForm(formName) {
      this.appendKey = false
      this.$refs[formName].resetFields();
      this.ruleForm = {
        monitorName: '',
        monitorCause: '',
        licence: '',
      }
    },
    // 新建布控 关闭
    handleCancel() {
      this.appendKey = false
      this.$refs['ruleForm'].resetFields();
      this.ruleForm = {
        monitorName: '',
        monitorCause: '',
        licence: '',
      }
    },
    // 表格 删除 确定
    confirmEvent(result) {
      batchDeletes([result.id]).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
          })
          this.getTableData()
        }
      })
    },
    // 表格 删除 取消
    cancelEvent() {

    },
    // 点击首页
    homePage() {

    },
    // 点击末页
    lastPage() {

    },
    // 点击布控
    layout(data) {
      this.layoutKey = true
      this.archivesId = data.id
    },
    // 点击布控 关闭
    handleCancel_layoutKey() {
      this.layoutKey = false
      this.aiServer = []
      this.petrolStation = this.treeData[0].id
      this.aiServerId = ''
    },
    // 点击布控 保存
    handleOk_layoutKey() {
      const params = {
        id: this.archivesId,
        orgId: this.petrolStation,
        type: 1
      }
      console.log(params);
      monitorControl(params).then(res => {
        if (res.code === 200) {
          this.$notify.success('布控成功')
          this.handleCancel_layoutKey()
        } else {
          this.$notify.success('布控失败')
        }
      })
    },
    // 节点发生变化
    handleNodeClick(node, data) {
      this.ruleForm.orgId = data.id
      this.$refs.cascaderAder.dropDownVisible = false
    },
    handleNodeClick2(node, data) {
      this.petrolStation = data.id;
      this.$refs.cascaderAder.dropDownVisible = false
    },
    // 选择框变化 触发
    onChange_aiServer() {
      this.isChange_aiServer = !this.isChange_aiServer
    },
    onChange_aiServer2() {
      this.isChange_aiServer2 = !this.isChange_aiServer2
    },
    // 表格分页 当前是第几页
    handleCurrentChange(data) {
      this.tablePage.currentPage = data
      this.getTableData()
    },
    // 分页调整每页展示的数量
    handleSizeChange(data) {
      this.tablePage.pageSize = data
      this.getTableData()
    },
    // 表格多选选框
    handleSelectionChange(e) {
      this.selectTableData = e
    }
  },
};
</script>

<style lang="less" scoped>
.list_b {
  position: relative;
  width: 100%;
  .inputClass,
  .inputClass2 {
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 14px;
      margin-right: 10px;
      margin-left: 15px;
    }
  }
  .inputClass2 {
    display: flex;
    .el-button {
      transform: translate(95px);
    }
  }
  .row_con {
    display: flex;
    position: absolute;
    transform: translate(260px, -52px);
    .el-row {
      display: flex;
      align-items: center;
    }
    .row {
      margin-right: 10px;
    }
  }
  .row_con .el-button {
    display: flex;
    align-items: center;
    height: 39.99px;
  }

  .row_con::v-deep .el-input__inner {
    width: 219.99px;
  }

  // 表格 边框
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
  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf {
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    background-color: #1a2c3fff;
  }
}

.active {
  color: #409eff;
}

::v-deep .el-button {
  height: 32px !important;
  line-height: 8px !important;
}
</style>
