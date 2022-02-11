<template>
  <div class="list_b">
    <!-- 表格 -->
    <el-table
      border
      ref="multipleTable3"
      :data="tableData3"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange3"
      max-height="600"
      style="background-color: #1a2c3fff; width: 100%; overflew-y: auto"
    >
      <el-table-column type="selection" width="70"></el-table-column>
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="monitorName" label="布控名称"></el-table-column>
      <el-table-column prop="monitorCause" label="布控原因"></el-table-column>
      <el-table-column prop="remake" label="信息描述"></el-table-column>
      <el-table-column prop="carUrl" label="布控目标">
        <template #default="scope">
          <el-image
            style="width: 50px; height: auto"
            :src="scope.row.carUrl"
            @click="imgaeClick(scope.row.carUrl)"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="similarity"
        width="100"
        label="相识度"
      ></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <!-- <el-button @click="handlePlan3(scope.row)" type="primary" size="small"
            >布控计划</el-button
          > -->
          <el-button @click="handleEdit3(scope.row)" type="primary" size="small"
            >编辑</el-button
          >
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="confirmEvent3(scope.row)"
            @cancel="cancelEvent3"
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
      @size-change="handleSizeChange3"
      @current-change="handleCurrentChange3"
      :current-page="tablePage3.currentPage"
      :page-sizes="tablePage3.pageSizes"
      :page-size="tablePage3.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage3.totalResult"
    >
    </el-pagination>
    <!-- 新建布控弹窗 -->
    <el-dialog
      :title="titleText3"
      :visible="appendKey3"
      width="40%"
      :close-on-click-modal="false"
      :before-close="handleCancel3"
    >
      <div>
        <el-form
          class="register"
          :model="ruleForm3"
          :rules="rules3"
          ref="ruleForm3"
          label-width="100px"
        >
          <div class="upload">
            <el-form-item label="布控目标:" prop="carUrl">
              <el-upload
                ref="upload"
                :limit="1"
                :on-success="handleOk"
                :on-error="handleError"
                :action="uploadUrl"
                list-type="picture-card"
                :headers="headers"
                :auto-upload="true"
                :on-exceed="onExceed"
              >
                <i slot="default" class="el-icon-plus"></i>
                <div class="text">上传图片</div>
                <div slot="file" slot-scope="{ file }">
                  <img
                    class="el-upload-list__item-thumbnail"
                    :src="ruleForm3.carUrl"
                    alt=""
                  />
                  <span class="el-upload-list__item-actions">
                    <span
                      class="el-upload-list__item-delete"
                      @click="handleRemove(file)"
                    >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
            </el-form-item>
          </div>
          <div style="flex: 1; margin-left: 20px">
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
                  v-model="ruleForm3.orgId"
                >
                  <template slot-scope="{ node, data }">
                    <i :class="data.icon"></i>
                    <span
                      :class="{ active: ruleForm3.orgId == data.id }"
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
                v-model="ruleForm3.monitorName"
              ></el-input>
            </el-form-item>
            <el-form-item label="布控原因:" prop="monitorCause">
              <el-input
                type="textarea"
                placeholder="请输入布控原因"
                v-model="ruleForm3.monitorCause"
                maxlength="200"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="信息描述:" prop="remake">
              <el-input
                type="textarea"
                placeholder="请输入信息描述"
                v-model="ruleForm3.remake"
                maxlength="200"
                show-word-limit
              >
              </el-input>
            </el-form-item>
            <el-form-item label="相识度:" prop="similarity">
              <el-input
                placeholder="请输入相识度"
                v-model="ruleForm3.similarity"
              ></el-input>
            </el-form-item>
            <el-form-item style="display: flex; justify-content: end">
              <el-button @click="resetForm3('ruleForm3')">取消</el-button>
              <el-button type="primary" @click="submitForm3('ruleForm3')"
                >确认</el-button
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      style="text-align: center"
      title="图片预览"
      :visible="imgDialogVisible"
      width="40%"
      :before-close="handleCancelImage"
    >
      <img style="width: 80%; height: auto" :src="imageUrl" />
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
            :options="treeData"
            @visible-change="onChange_aiServer"
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
import { getToken } from "@/utils/auth";
import { serverList } from '@/api/control/control';
import { batchDeletes, saveAddEidt, getSelects, monitorControl } from '@/api/deploy'
export default {
  components: {
    MonitorPlan
  },
  data() {
    return {
      titleText3: '', // 弹框标题文本
      planKey: false, // 布控计划弹窗
      uploadUrl: 'http://139.159.213.75:9211/file/upload/image',
      headers: { Authorization: "Bearer " + getToken() },
      appendKey3: false, // 新建布控显示状态
      ruleForm3: {
        monitorName: '',
        monitorCause: '',
        remake: '',
        carUrl: '',
        similarity: '85',
        orgId: ''
      },
      rules3: {
        monitorName: [
          { required: true, message: '请输入布控名称', trigger: 'blur' },
        ],
        monitorCause: [
          { required: true, message: '请输入布控原因', trigger: 'blur' },
        ],
        remake: [
          { required: true, message: '请输入信息描述', trigger: 'blur' },
        ],
        carUrl: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ]
      },
      tableData3: [], // 表格数据
      tablePage3: { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      startTime3: '', // 开始时间
      endTime3: '', // 结束时间
      selectTableData3: [], // 存储选中的多选框
      currentEidtData3: {}, // 编辑时存储当前布控数据
      imgDialogVisible: false, // 图片预览
      imageUrl: '', // 图片预览当前展示的图片
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
        pageNum: this.tablePage3.currentPage,
        pageSize: this.tablePage3.pageSize,
        sort: 3
      }
      const res = await getSelects(params)
      this.tableData3 = res.rows
      this.tablePage3.totalResult = +res.total
    },
    // 点击查询
    getQuery3(data) {
      const params = {
        startDate: data.startTime,
        endDate: data.endTime,
        orgId: data.orgId,
        sort: 3,
        pageNum: 1,
        // pageNum: this.tablePage3.currentPage,
        pageSize: this.tablePage3.pageSize,
      }
      getSelects(params).then(res => {
        console.log(res)
        this.tableData3 = res.rows
      })
    },
    // 批量删除
    deleteBatches3() {
      if (this.selectTableData3.length > 0) {
        console.log(this.selectTableData3)
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
            const idArr = this.selectTableData3.map(it => it.id)
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
            this.selectTableData3 = []
            this.$refs.multipleTable3.clearSelection()
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
    handleAppend3() {
      this.titleText3 = '新增图片布控'
      this.appendKey3 = true
    },
    // 布控计划
    handlePlan3() {
      this.planKey = true
    },
    // 编辑布控
    handleEdit3(row) {
      this.currentEidtData3 = row
      this.titleText3 = '修改图片布控'
      this.currentDeploy3 = true
      this.ruleForm3 = {
        monitorName: row.monitorName,
        monitorCause: row.monitorCause,
        remake: row.remake,
        carUrl: row.carUrl,
        similarity: '85',
        orgId: +row.orgId
      }
      this.appendKey3 = true
    },
    // 新建布控  确定
    submitForm3(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentDeploy3) {
            // 编辑
            saveAddEidt({
              monitorName: this.ruleForm3.monitorName,
              monitorCause: this.ruleForm3.monitorCause,
              remake: this.ruleForm3.remake,
              carUrl: this.ruleForm3.carUrl,
              similarity: '85',
              sort: 3,
              id: this.currentEidtData3.id,
              orgId: this.ruleForm3.orgId
            }).then(res => {
              if (res.code === 200) {
                this.$notify({
                  type: 'success',
                  message: '编辑布控成功',
                })
                this.getTableData()
                this.currentDeploy3 = false
              }
            })
          } else {
            // 新增
            saveAddEidt({
              monitorName: this.ruleForm3.monitorName,
              monitorCause: this.ruleForm3.monitorCause,
              remake: this.ruleForm3.remake,
              carUrl: this.ruleForm3.carUrl,
              similarity: '85',
              sort: 3,
              orgId: this.ruleForm3.orgId
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
          this.ruleForm3 = {
            monitorName: '',
            monitorCause: '',
            remake: '',
            carUrl: '',
            similarity: '85'
          }
          this.$refs.upload.clearFiles()
          this.appendKey3 = false
          return true
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 新建布控 取消
    resetForm3(formName) {
      this.appendKey3 = false
      this.$refs[formName].resetFields();
      this.ruleForm3 = {
        monitorName: '',
        monitorCause: '',
        remake: '',
        carUrl: '',
        similarity: '85'
      }
      this.$refs.upload.clearFiles()
    },
    // 新建布控 关闭
    handleCancel3() {
      this.appendKey3 = false
      this.$refs['ruleForm3'].resetFields();
      this.ruleForm3 = {
        monitorName: '',
        monitorCause: '',
        remake: '',
        carUrl: '',
        similarity: '85'
      }
      this.$refs.upload.clearFiles()
    },
    // 表格 删除 确定
    confirmEvent3(result) {
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
    cancelEvent3() {

    },
    // 点击首页
    homePage() {

    },
    // 点击末页
    lastPage() {

    },
    // 表格分页 当前是第几页
    handleCurrentChange3() {
      this.tablePage3.currentPage = data
      this.getTableData()
    },
    // 分页调整每页展示的数量
    handleSizeChange3() {
      this.tablePage3.pageSize = data
      this.getTableData()
    },
    // 表格多选选框
    handleSelectionChange3(e) {
      this.selectTableData3 = e
    },
    // 图片处理上传成功
    handleOk(res, file, fileList) {
      if (res) {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.ruleForm3.carUrl = res.data.url;
        }
      }
    },
    // 图片处理上传失败
    handleError(err, file, fileList) {
      console.log('err: ', err);
      if (err) {
        this.$notify({
          title: '失败',
          message: '上传失败',
          type: 'error',
        })
      }
    },
    // 图片数量超出限制
    onExceed(files, fileList) {
      console.log('files: ', files);
      this.$notify({
        title: '提示',
        message: '只能上传一张',
        type: 'warning',
      })
    },
    // 图片处理删除
    handleRemove(file, fileList) {
      let flag = false;
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        flag = true
        this.$refs.upload.clearFiles()
        this.ruleForm3.carUrl = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        flag = false
      });
      return flag
    },
    // 布控计划 取消
    resetCancel_plan() {
      this.planKey = false
    },
    // 布控计划 确定
    submitConfirm_plan() {
      this.planKey = false
    },
    // 点击图片预览
    imgaeClick(data) {
      this.imgDialogVisible = true
      this.imageUrl = data
    },
    // 图片预览取消
    handleCancelImage() {
      this.imgDialogVisible = false
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
      this.petrolStation = this.petrolStation
      this.aiServerId = ''
    },
    // 点击布控 保存
    handleOk_layoutKey() {
      const params = {
        id: this.archivesId,
        orgId: this.petrolStation,
        type: 3
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
      this.ruleForm3.orgId = data.id;
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

  .register {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      // ant upload 的大小
      ::v-deep .ant-upload {
        margin-bottom: 20px;
        width: 175px;
        height: 175px;
        border-radius: 8px;
      }
    }
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
