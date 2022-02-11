<template>
  <div class="list_a">
    <el-row class="row">
      <el-button size="small" type="primary" @click="visible_1 = true"
        >新建档案</el-button
      >
      <el-button
        size="small"
        type="danger"
        @click="handleRemove"
        :disabled="selected"
        >删除档案</el-button
      >
      <el-button
        size="small"
        @click="handleExport"
        type="success"
        :disabled="selected"
        >导出</el-button
      >

      <div class="select">
        <span>机构</span>
        <el-cascader
          ref="cascaderAder"
          style="margin-left: 0.5%"
          collapse-tags
          clearable
          placeholder="模糊搜索"
          @visible-change="onChange_aiServer"
          :options="treeData"
          :props="{
            value: 'id',
            label: 'label',
            checkStrictly: true,
            emitPath: false,
          }"
          :show-all-levels="false"
          v-model="queryParams.orgId"
        >
          <template slot-scope="{ node, data }">
            <span
              :class="{ active: queryParams.orgId == data.id }"
              @click="handleNodeClick(node, data)"
              >{{ data.label }}</span
            >
          </template>
        </el-cascader>
      </div>
      <el-button
        size="small"
        @click="handleQuery"
        style="margin-left: 1%"
        type="primary"
        >查询</el-button
      >
      <el-button
        type="warning"
        size="small"
        @click="resetQuery"
        style="margin-left: 1%"
        >重置</el-button
      >
    </el-row>

    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%; background-color: #1a2c3fff"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column
        prop="name"
        label="档案名称"
        width="120"
      ></el-table-column>
      <el-table-column label="详情" class="unique">
        <template slot-scope="scope">
          <div class="icon_con">
            <img
              class="icon"
              v-for="(item, index) in scope.row.facePhotoUrl"
              :key="index"
              :src="item"
            />
          </div>
          <a-button
            class="detail_text"
            @click="showDialog_a(scope.row)"
            icon="solution"
            type="primary"
            :loading="loading"
            >更多</a-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="管理"
        align="center"
        show-overflow-tooltip
        width="340"
      >
        <template slot-scope="scope">
          <!-- <el-button size="small" size="small" @click="handlePlan(scope.row)" type="primary">布控计划</el-button size="small"> -->
          <el-button
            size="small"
            type="success"
            @click="openAddDialog(scope.row)"
            >人脸注册</el-button
          >
          <!-- <el-button
            size="small"
            type="primary"
            @click="showDialog_3(scope.row)"
            :loading="loading2"
            >批量导入</el-button
          > -->
          <el-button size="small" type="danger" @click="layout(scope.row)"
            >布控</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 新建档案的dialog -->
    <el-dialog
      title="新建档案"
      :visible.sync="visible_1"
      width="30%"
      center
      :before-close="handleCancel_1"
      class="file"
    >
      <el-form ref="form" :model="fileForm" :rules="fileFormRules">
        <el-form-item label="选择机构" label-width="80px" prop="orgId">
          <el-cascader
            ref="cascaderAder"
            style="width: 100%"
            collapse-tags
            clearable
            placeholder="请选择机构"
            :options="treeData"
            :props="{
              value: 'id',
              label: 'label',
              checkStrictly: true,
              emitPath: false,
            }"
            :show-all-levels="false"
            v-model="fileForm.orgId"
          >
            <template slot-scope="{ node, data }">
              <i :class="data.icon"></i>
              <span
                :class="{ active: fileForm.orgId == data.id }"
                @click="handleNodeClick2(node, data)"
                >{{ data.label }}</span
              >
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="档案名称" label-width="80px" prop="fileName">
          <el-input
            style="width: 100%"
            v-model="fileForm.fileName"
            placeholder="档案名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOk_1"
          >保 存</el-button
        >
        <el-button size="small" type="danger" @click="handleCancel_1"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 布控 -->
    <el-dialog
      title="布控"
      :visible.sync="visible_4"
      width="30%"
      :before-close="handleCancel_4"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="选择机构">
          <el-cascader
            ref="cascaderAder"
            style="width: 100%"
            collapse-tags
            placeholder="请选择机构"
            clearable
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
              <span
                :class="{ active: petrolStation == data.id }"
                @click="handleNodeClick3(node, data)"
                >{{ data.label }}</span
              >
            </template>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleOk_4"
          >保 存</el-button
        >
        <el-button size="small" type="danger" @click="handleCancel_4"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
    <!-- 详情查看的dialog -->
    <DialogA
      ref="dialog_a"
      typex="a"
      :visible_a="visible_a"
      :detail_list="detail_list"
      :queryParams="queryParams_detail"
      :total="total_1"
      @cancel_a="handleCancel_a"
      @refresh="handleRefresh"
    />

    <!-- 人脸注册的dialog -->
    <DialogB
      :visible_2="visible_2"
      :detail_data="detail_data"
      @cancel_2="handleCancel_2"
      @ok_2="handleOk_2"
    />

    <!-- 批量导入dialog -->
    <DialogC
      typex="a"
      :visible_3="visible_3"
      :detail_list="detail_list"
      @cancel_c="handleCancel_3"
      @refresh_list="getRecord"
    />

    <!-- 布控计划弹窗 -->
    <MonitorPlan
      :planKey="planKey"
      @resetCancel_plan="resetCancel_plan"
      @submitConfirm_plan="submitConfirm_plan"
    />
  </div>
</template>

<script>
import DialogA from '@/components/content/dialog/A/DialogA';
import DialogB from '@/components/content/dialog/A/DialogB';
import DialogC from '@/components/content/dialog/A/DialogC';
import MonitorPlan from '@/components/content/dialog/MonitorPlan';

import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import '@/assets/css/element-reset.css'

import {
  addRecord,
  deleteRecord,
  getRecord,
  getPerson,
  archivesControl,
  savePerson,
  serverList
} from '@/api/control/control';
import { mapGetters } from 'vuex';

export default {
  components: {
    DialogC,
    DialogB,
    DialogA,
    Treeselect,
    MonitorPlan
  },
  props: {
    pageNum: Number,
  },
  data() {
    return {
      planKey: false, // 布控计划弹窗
      imageUrlArr: [],
      // 详情按钮的动画
      loading: false,
      /* 批量导入的按钮动画  */
      loading2: false,

      detail_list: [],
      detail_data: {}, // 详情数据

      total_1: 0, // 总条数
      /* 档案的查询参数 */
      queryParams: {
        orgId: null,
        archivesType: 2,
        pageNum: 1,
        pageSize: 6,
      },

      /* 详情的查询参数 */
      queryParams_detail: {
        archivesId: null,
        pageNum: 1,
        pageSize: 10,
      },

      /* dialog区域 */
      // 新建档案区域
      visible_1: false,
      fileForm: {
        fileName: null,
        orgId: null,
      },
      fileFormRules: {
        fileName: [
          { required: true, message: '档案名称不能为空', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '机构不能为空', trigger: 'blur' }
        ],
      },


      // 详情区域
      visible_a: false,

      // 人脸注册区域
      visible_2: false,

      // 批量导入区域
      visible_3: false,
      list: [1, 2, 3, 4, 5],

      // 布控弹框
      visible_4: false,
      // ai 服务器数据
      aiServerId: '',
      aiServer: [],
      // 加油站 数据
      petrolStation: '',
      treeData: [],
      isChange_aiServer: false, // 选择三角形

      /* 表格区域 */
      multipleSelection: [], // 多选
      selected: true,
      tableData: [],

      tablePage2: { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 20,
        pageSizes: [10, 20, 30, 40, 50, 100]
      },
      facePhotoUrlArr: null,
    };
  },
  created() {
    this.treeData = this.info.deptPermission;
    this.petrolStation = this.treeData[0].id;
    this.getRecord();
  },
  watch: {
    pageNum() {
      this.queryParams.pageNum = this.pageNum;
      // 发送请求
      getRecord(this.queryParams).then((res) => {
        console.log('档案数据: ', res);
        if (res.code === 200) {
          this.tableData = res.rows;
          this.tableData.forEach((item) => {
            if (item.facePhotoUrl) {
              item.facePhotoUrlArr = item.facePhotoUrl.split(',')
              item.facePhotoUrl = item.facePhotoUrlArr.slice(0, 10);
            }
          });
        }
      });
    },
  },
  computed: {
    ...mapGetters(['info']),
  },
  methods: {
    // 加油站下拉框不可选的节点
    my_normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == '1' ? true : false,
      };
    },
    /* 处理搜索 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getRecord();
    },
    /* 重置查询 */
    resetQuery() {
      this.queryParams.orgId = null;
      this.handleQuery()
    },
    /* 单击节点事件 */
    handleNodeClick(node, data) {
      this.queryParams.orgId = data.id;
      this.$refs.cascaderAder.dropDownVisible = false
    },
    handleNodeClick2(node, data) {
      this.fileForm.orgId = data.id;
      this.$refs.cascaderAder.dropDownVisible = false
    },
    handleNodeClick3(node, data) {
      this.petrolStation = data.id;
      this.$refs.cascaderAder.dropDownVisible = false
    },

    // 选择框变化 触发
    onChange_aiServer() {
      this.isChange_aiServer = !this.isChange_aiServer
    },
    /* 网络请求区域 */
    // 获取档案列表
    getRecord() {
      getRecord(this.queryParams).then((res) => {
        console.log('档案数据: ', res);
        if (res.code === 200) {
          this.tablePage2.totalResult = +res.total
          this.tableData = res.rows;
          this.tableData.forEach((item) => {
            if (item.facePhotoUrl) {
              item.facePhotoUrlArr = item.facePhotoUrl.split(',')
              item.facePhotoUrl = item.facePhotoUrlArr.slice(0, 10);
            }
          });
          console.log('this.tableData', this.tableData);
          this.$emit('setParams', this.queryParams, parseInt(res.total));
        }
      });
    },
    // 点击详情 / 批量导入 获取人员列表
    getPerson(archivesId, type) {
      type == 'import' ? this.loading2 = true : this.loading = true;
      this.queryParams_detail.archivesId = archivesId;
      const params = this.queryParams_detail;
      getPerson(params).then((res) => {
        console.log('人员列表数据 ', res);
        if (res.code === 200) {
          this.detail_list = res.rows;
          this.total_1 = parseInt(res.total);

          this.$nextTick(() => {
            type == 'import' ? this.visible_3 = true : this.visible_a = true;
          });
        }
        this.loading = false;
        this.loading2 = false;
      });
    },
    // 自定义事件 刷新刷新详情列表
    handleRefresh() {
      console.log('舒心');
      this.getPerson(this.queryParams_detail.archivesId);
      this.getRecord();
    },

    // 多选
    handleSelectionChange(val) {
      console.log('val: ', val);
      this.selected = val.length == 0 ? true : false;
      this.multipleSelection = val;
    },

    /* Dialog区域 */
    // 处理分页改变
    changePageNum(val) {
      this.queryParams_detail.pageNum = val;
      const params = this.queryParams_detail;
      // 发送请求
      getPerson(params).then((res) => {
        console.log('详情: ', res);
        if (res.code === 200) {
          this.detail_list = res.rows;
          this.total_1 = parseInt(res.total);
          this.$nextTick(() => {
            this.visible_a = true;
          });
        }
        this.loading = false;
      });
    },

    // 处理·新建档案框·关闭
    handleCancel_1() {
      this.$refs.form.resetFields()
      this.visible_1 = false;
    },
    // 处理·新建档案·保存
    handleOk_1() {
      console.log(this.fileForm);
      this.$refs.form.validate(valid => {
        if (valid) {
          const name = this.fileForm.fileName;
          const orgId = this.fileForm.orgId
          let stationName;
          const archivesType = 2;

          this.treeData.forEach(item => {
            if (item.id == orgId) {
              stationName = item.label
            } else {
              item.children.forEach(item2 => {
                if (item2.id == orgId) {
                  stationName = item2.label;
                } else {
                  item2.children.forEach(item3 => {
                    if (item3.id == orgId) {
                      stationName = item3.label;
                    }
                  })
                }
              })
            }
          })
          const data = {
            orgId,
            name,
            stationName,
            archivesType
          };

          // 发送请求
          addRecord(data).then((res) => {
            console.log('添加档案', res);
            if (res.code === 200) {
              this.$message.success('添加成功');
              this.getRecord();
            } else {
              this.$message.error('添加失败');
            }
          });
          // 关闭dialog框
          this.handleCancel_1();
        }
      })


    },
    // 处理删除档案
    handleRemove() {
      const arr = this.multipleSelection.map((item) => {
        return item.id;
      });

      console.log('arr: ', arr);
      const data = {
        ids: arr
      }
      // 发送请求
      deleteRecord(data).then(res => {
        console.log('删除档案的res', res);
        if (res.code === 200) {
          this.$message.success('删除成功');
          this.getRecord()
        } else {
          this.$message.success('删除失败');
        }
      })
    },
    // 处理导出
    handleExport() {
      console.log('导出');
    },

    // 展示详情的dialog
    showDialog_a(record) {
      this.getPerson(record.id, 'detail');
    },
    handleCancel_a() {
      this.visible_a = false;
    },
    // 打开人脸注册dialog
    openAddDialog(record) {
      console.log('record: ', record);
      this.detail_data = record;
      this.visible_2 = true;
    },
    // 处理·人脸注册框·关闭
    handleCancel_2() {
      this.visible_2 = false;
    },
    // 处理·人脸注册·保存
    handleOk_2(form) {
      let data = {};
      data.facePhotoUrl = form.imageUrl;
      data.archivesId = form.archivesId;
      data.name = form.name;
      data.genderStr = form.gender_str;
      data.threshold = form.threshold_value; // 阈值
      data.idCard = form.id_card;
      data.address = form.address;
      data.remark = form.remark;

      savePerson(data).then((res) => {
        console.log('res: ', res);
        if (res.code === 200) {
          this.$message.success('注册成功');
          this.getRecord();
          this.handleCancel_2();
        } else {
          this.$message.error('注册失败');
        }
      });
    },

    // 展示·批量导入框·
    showDialog_3(record) {
      this.getPerson(record.id, 'import');
    },
    handleCancel_3() {
      this.visible_3 = false;
    },
    // 布控
    layout(record) {
      this.visible_4 = true
      this.queryParams_detail.archivesId = record.id
    },
    // 布控 关闭
    handleCancel_4() {
      this.visible_4 = false
      this.aiServer = []
      this.petrolStation = this.treeData[0].id;
      this.aiServerId = ''
    },
    // 布控 保存
    handleOk_4() {
      const params = {
        archivesId: this.queryParams_detail.archivesId,
        orgId: this.petrolStation
      }
      console.log(params);
      archivesControl(params).then(res => {
        console.log('人脸布控', res)
        if (res.code === 200) {
          this.$notify.success('布控成功')
          this.handleCancel_4()
        } else {
          this.$notify.success('布控失败')
        }
      })
    },
    // 点击布控计划
    handlePlan(data) {
      console.log(data)
      this.planKey = true
    },
    // 表格分页 当前是第几页
    handleCurrentChange2(data) {
      this.queryParams.pageNum = data
      this.getRecord()
    },
    // 分页调整每页展示的数量
    handleSizeChange2(data) {
      this.queryParams.pageSize = data
      this.getRecord()
    },
    // 布控计划 取消
    resetCancel_plan() {
      this.planKey = false
    },
    // 布控计划 确定
    submitConfirm_plan() {
      this.planKey = false
    },
  },
};
</script>

<style lang="less" scoped>
.list_a {
  width: 100%;

  .row {
    margin-top: 10px;
    margin-bottom: 20px;

    .select {
      display: inline-block;
      margin-left: 20px;
      span {
        margin-right: 5px;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }

  // 详情查看 批量导入dislog
  .impotDialog {
    &::v-deep .el-dialog__body {
      height: 750px;
      overflow: hidden;

      /* dialog_con li 的样式 */
      li {
        display: flex;
        align-items: center;
        box-sizing: border;
        padding: 2px 12px;
        padding-right: 0;
        margin-bottom: 5px;
        width: 218px;
        height: 21px;
        background: #39566dff !important;
        border-radius: 4px;

        span,
        b {
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          color: #ffffff;
        }
      }

      li:last-child {
        margin: 0;
      }
      /* end */
      .dialog_con {
        overflow: scroll;
        display: flex;
        flex-wrap: wrap;
        // align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;

        .li {
          box-sizing: border-box;
          padding: 13px 16px;
          margin: 5px;
          width: calc(calc(100% / 5) - 10px);
          height: 327px;
          background: #31465aff;
          border-radius: 8px;

          .image {
            margin-bottom: 14px;
            width: 90px;
            height: 90px;
            img {
              width: 100%;
              border-radius: 8px;
            }
          }

          .main {
            ul {
              margin-bottom: 13px;
            }
          }

          .footer {
            display: flex;
            justify-content: space-between;
          }
        }
      }
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
  ::v-deep .el-table--border {
    border-radius: 8px;
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

  ::v-deep .el-table__cell:nth-child(4) .icon_con {
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
  }
  ::v-deep .el-table__cell:nth-child(4) .icon_con img:not(:last-child) {
    margin-right: 5px;
  }
  ::v-deep .el-table__cell:nth-child(4) .cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ::v-deep .el-table__cell:nth-child(5) .cell {
    display: flex;
    justify-content: space-evenly;
  }

  .cell .icon {
    width: 50px;
    height: 50px;
    border-radius: 6px;

    img {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
}

.active {
  color: #409eff;
}
</style>
