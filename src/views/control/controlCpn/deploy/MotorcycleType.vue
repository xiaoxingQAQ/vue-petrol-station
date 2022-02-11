<template>
  <div class="list_b">
    <!-- 表格 -->
    <el-table
      border
      ref="multipleTable2"
      :data="tableData2"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange2"
      max-height="600"
      style="background-color: #1a2c3fff; width: 100%; overflew-y: auto"
    >
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="monitorName" label="布控名称"></el-table-column>
      <el-table-column prop="monitorCause" label="布控原因"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <!-- <el-button @click="handlePlan2(scope.row)" type="primary" size="small"
            >布控计划</el-button
          > -->
          <el-button @click="handleEdit2(scope.row)" type="primary" size="small"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="confirmEvent2(scope.row)"
            @cancel="cancelEvent2"
            :title="'确认是否删除' + '“' + scope.row.monitorName + '”' + '？'"
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
    <el-pagination
      style="display: flex; justify-content: center; margin-top: 20px"
      @size-change="handleSizeChange2"
      @current-change="handleCurrentChange2"
      :current-page="tablePage2.currentPage"
      :page-sizes="tablePage2.pageSizes"
      :page-size="tablePage2.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage2.totalResult"
    >
    </el-pagination>
    <!-- 新建布控弹窗 -->
    <el-dialog
      :title="titleText2"
      :visible="appendKey2"
      :close-on-click-modal="false"
      width="40%"
      :before-close="handleCancel2"
    >
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
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
              v-model="ruleForm2.orgId"
            >
              <template slot-scope="{ node, data }">
                <i :class="data.icon"></i>
                <span
                  :class="{ active: ruleForm2.orgId == data.id }"
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
            v-model="ruleForm2.monitorName"
          ></el-input>
        </el-form-item>
        <el-form-item label="布控原因:" prop="monitorCause">
          <el-input
            type="textarea"
            placeholder="请输入布控原因"
            v-model="ruleForm2.monitorCause"
            maxlength="200"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-form-item label="车牌:" prop="licence">
          <el-input
            placeholder="格式：粤B8888"
            v-model="ruleForm2.licence"
          ></el-input>
        </el-form-item>
        <el-form-item label="号牌类型:">
          <div class="select">
            <el-select
              @visible-change="onChange_flapperType"
              v-model="ruleForm2.licenceType"
              placeholder="全部"
            >
              <el-option
                v-for="item in flapperTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="车辆颜色:">
          <div class="select">
            <el-select
              @visible-change="onChange_vehicleColor"
              v-model="ruleForm2.carColor"
              placeholder="全部"
            >
              <el-option
                v-for="item in vehicleColorList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="车辆类型:">
          <div class="select">
            <el-select v-model="ruleForm2.carType" placeholder="全部">
              <el-option-group
                v-for="group in vehicleTypeList"
                :key="group.label"
                :label="group.label"
              >
                <el-option
                  v-for="item in group.children"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </el-form-item>
        <!-- <el-form-item label="品牌">
          <div class="select">
          <el-cascader
            style="width:100%"
            @visible-change="onChange_trademark"
            v-model="ruleForm2.trademark"
            :options="trademarkList"
            :props="{ expandTrigger: 'hover' }"></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="型号">
          <div class="select">
            <el-select @visible-change="onChange_marker" v-model="ruleForm2.marker" placeholder="全部">
              <el-option
                v-for="item in markerList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
          </el-select>
          </div>
        </el-form-item>
        <el-form-item label="车款">
          <div class="select">
            <el-select @visible-change="onChange_carModel" v-model="ruleForm2.carModel" placeholder="全部">
            <el-option
              v-for="item in carModelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          </div>
        </el-form-item> -->
        <el-form-item style="display: flex; justify-content: end">
          <el-button @click="resetForm2('ruleForm2')">取消</el-button>
          <el-button type="primary" @click="submitForm2('ruleForm2')"
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
        <!-- <el-form-item label="AI服务器">
          <div class="select">
            <el-select
              @visible-change="onChange_aiServer"
              v-model="aiServerId"
              placeholder="请选择"
            >
              <el-option
                v-for="it in aiServer"
                :key="it.id"
                :label="it.label"
                :value="it.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk_layoutKey">保 存</el-button>
        <el-button type="danger" @click="handleCancel_layoutKey"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
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
import { carBrand } from '@/data/carBrand'
import { carPlateType } from '@/data/carPlateType'
import { carColor } from '@/data/carColor'
import { carCategory } from '@/data/carCategory'
export default {
  components: {
    MonitorPlan
  },
  data() {
    return {
      titleText2: '', // 弹窗标题文字
      planKey: false, // 布控计划弹窗
      appendKey2: false, // 新建布控弹窗
      // 表单数据
      ruleForm2: {
        monitorName: '',
        monitorCause: '',
        licence: '',
        licenceType: '',
        carColor: '',
        carType: '',
        orgId: ''
      },
      rules2: {
        monitorName: [
          { required: true, message: '请输入布控名称', trigger: 'blur' },
        ],
        monitorCause: [
          { required: true, message: '请输入布控原因', trigger: 'blur' },
        ],
        licence: [
          { pattern: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/, message: '请输入正确的车牌', trigger: 'blur' }
        ]
      },
      // 号牌
      flapperTypeList: carPlateType.data,
      // 号牌选择器箭头
      isChange_flapperType: false,
      // 颜色
      vehicleColorList: carColor.data,
      // 颜色选择器箭头
      isChange_vehicleColor: false,
      // 车辆类型
      vehicleTypeList: carCategory.data,
      // 车辆类型选择器箭头
      isChange_vehicleType: false,
      // 品牌
      // trademarkList: carBrand.data,
      // 品牌选择器箭头
      // isChange_trademark: false,
      // 型号
      // markerList: [],
      // 型号选择器箭头
      // isChange_marker: false,
      // 车款
      // carModelList: [],
      // 车款选择器箭头
      // isChange_carModel: false,
      tableData2: [], // 表格数据
      tablePage2: { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      startTime2: '', // 开始时间
      endTime2: '', // 结束时间
      selectTableData2: [], // 存储选中的多选框
      currentDeploy2: false, // 判断当前是添加还是修改
      currentEidtData2: {}, // 编辑时存储当前布控数据
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
        pageNum: this.tablePage2.currentPage,
        pageSize: this.tablePage2.pageSize,
        sort: 2
      }
      const res = await getSelects(params)
      this.tableData2 = res.rows
      this.tablePage2.totalResult = +res.total
    },
    // 点击查询
    getQuery2(data) {
      const params = {
        startDate: data.startTime,
        endDate: data.endTime,
        sort: 2,
        orgId: data.orgId,
        // pageNum: this.tablePage2.currentPage,
        pageNum: 1,
        pageSize: this.tablePage2.pageSize,
      }
      getSelects(params).then(res => {
        this.tableData2 = res.rows
      })
    },
    // 批量删除
    deleteBatches2() {
      if (this.selectTableData2.length > 0) {
        console.log(this.selectTableData2)
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
            const idArr = this.selectTableData2.map(it => it.id)
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
            this.selectTableData2 = []
            this.$refs.multipleTable2.clearSelection()
          })
      } else {
        this.$notify({
          title: '提示',
          message: '当前没有可删除的布控',
          type: 'warning',
        });
      }
    },
    // 新建布控
    handleAppend2() {
      this.titleText2 = '新增车型布控'
      this.appendKey2 = true
    },
    // 布控计划
    handlePlan2() {
      this.planKey = true
    },
    // 编辑布控
    handleEdit2(row) {
      this.currentEidtData2 = row
      this.titleText2 = '修改车型布控'
      this.currentDeploy2 = true
      this.ruleForm2 = {
        monitorName: row.monitorName,
        monitorCause: row.monitorCause,
        licence: row.licence,
        licenceType: row.licenceType,
        carColor: row.carColor,
        carType: row.carType,
        orgId: +row.orgId
      }
      this.appendKey2 = true
    },
    // 新建布控  确定
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentDeploy2) {
            // 编辑
            saveAddEidt({
              monitorName: this.ruleForm2.monitorName,
              monitorCause: this.ruleForm2.monitorCause,
              licence: this.ruleForm2.licence,
              licenceType: this.ruleForm2.licenceType,
              carColor: this.ruleForm2.carColor,
              carType: this.ruleForm2.carType,
              sort: 2,
              id: this.currentEidtData2.id,
              orgId: this.ruleForm2.orgId
            }).then(res => {
              if (res.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '编辑布控成功',
                })
                this.getTableData()
                this.currentDeploy2 = false
              }
            })
          } else {
            // 新增
            saveAddEidt({
              monitorName: this.ruleForm2.monitorName,
              monitorCause: this.ruleForm2.monitorCause,
              licence: this.ruleForm2.licence,
              licenceType: this.ruleForm2.licenceType,
              carColor: this.ruleForm2.carColor,
              carType: this.ruleForm2.carType,
              sort: 2,
              orgId: this.ruleForm2.orgId
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
          this.ruleForm2 = {
            monitorName: '',
            monitorCause: '',
            licence: '',
            licenceType: '',
            carColor: '',
            carType: '',
          }
          this.appendKey2 = false
          return true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新建布控 取消
    resetForm2(formName) {
      this.appendKey2 = false
      this.$refs[formName].resetFields();
      this.ruleForm2 = {
        monitorName: '',
        monitorCause: '',
        licence: '',
        licenceType: '',
        carColor: '',
        carType: '',
      }
    },
    // 新建布控 关闭
    handleCancel2() {
      this.appendKey2 = false
      this.$refs['ruleForm2'].resetFields();
      this.ruleForm2 = {
        monitorName: '',
        monitorCause: '',
        licence: '',
        licenceType: '',
        carColor: '',
        carType: '',
      }
    },
    // 表格 删除 确定
    confirmEvent2(result) {
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
    cancelEvent2() {

    },
    // 点击首页
    homePage() {

    },
    // 点击末页
    lastPage() {

    },
    // 表格分页 当前是第几页
    handleCurrentChange2(data) {
      this.tablePage2.currentPage = data
      this.getTableData()
    },
    // 分页调整每页展示的数量
    handleSizeChange2(data) {
      this.tablePage2.pageSize = data
      this.getTableData()
    },
    // 表格多选选框
    handleSelectionChange2(e) {
      this.selectTableData2 = e
    },
    // 布控计划 取消
    resetCancel_plan() {
      this.planKey = false
    },
    // 布控计划 确定
    submitConfirm_plan() {
      this.planKey = false
    },
    onChange_flapperType() {
      this.isChange_flapperType = !this.isChange_flapperType;
    },
    onChange_vehicleColor() {
      this.isChange_vehicleColor = !this.isChange_vehicleColor;
    },
    onChange_vehicleType() {
      this.isChange_vehicleType = !this.isChange_vehicleType;
    },
    onChange_trademark() {
      this.isChange_trademark = !this.isChange_trademark;
    },
    onChange_marker() {
      this.isChange_marker = !this.isChange_marker;
    },
    onChange_carModel() {
      this.isChange_carModel = !this.isChange_carModel;
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
      this.petrolStation = this.treeData[0].id;
      this.aiServerId = ''
    },
    // 点击布控 保存
    handleOk_layoutKey() {
      const params = {
        id: this.archivesId,
        orgId: this.petrolStation,
        type: 2
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
      this.ruleForm2.orgId = data.id;
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
  },
};
</script>

<style lang="less" scoped>
.list_b {
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
    transform: translate(-50px);
    .date-picker {
      margin-right: 15px;
    }
  }
  .row_con {
    display: flex;
    align-items: center;
    position: absolute;
    transform: translate(260px, -52px);
    .el-row {
      display: flex;
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

  /deep/.el-tag.el-tag--info {
    background-color: #1891fb;
    border: none;
    color: #fff;
  }
  /deep/.el-tag .el-icon-close {
    font-size: 10px !important;
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
