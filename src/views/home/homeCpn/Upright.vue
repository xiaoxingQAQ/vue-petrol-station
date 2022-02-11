<template>
  <div class="upright">
    <div v-show="clientShow">
      <div class="header" style="display: flex; justify-content: space-between">
        <h3 style="font-weight: 500">客流统计</h3>
        <el-button @click="clientShow = false" size="mini" type="primary"
          >客户登记</el-button
        >
      </div>
      <newHeader />
      <h3>客流态势</h3>
      <Echarts />
    </div>

    <div v-show="!clientShow">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="50px"
      >
        <div
          style="
            color: #fff;
            font-weight: 500;
            margin-bottom: 10px;
            font-size: 15px;
          "
        >
          客户统计
        </div>
        <el-form-item label="机构" prop="department">
          <div class="select">
            <el-cascader
              style="width: 100%"
              size="mini"
              ref="cascaderAder"
              collapse-tags
              placeholder="请选择机构"
              :options="treeData"
              :props="{
                value: 'id',
                label: 'label',
                checkStrictly: true,
                emitPath: false,
              }"
              @visible-change="onChange_department"
              :show-all-levels="false"
              v-model="ruleForm.department"
            >
              <template slot-scope="{ node, data }">
                <span
                  :class="{ active: ruleForm.department == data.id }"
                  @click="handleNodeClick(node, data)"
                  >{{ data.label }}</span
                >
              </template>
            </el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="档案" prop="archivesId">
          <div class="select">
            <el-select
              style="width: 100%"
              @visible-change="onChange_record"
              v-model="ruleForm.archivesId"
              placeholder="请选择档案"
              size="mini"
            >
              <el-option
                v-for="item in recordList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="姓名:" prop="name">
          <el-input
            style="width: 100%"
            placeholder="请输入姓名"
            v-model="ruleForm.name"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话:" prop="mobile">
          <el-input
            placeholder="请输入联系方式"
            v-model="ruleForm.mobile"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌:" prop="carNum">
          <el-input
            placeholder="格式：粤B8888"
            v-model="ruleForm.carNum"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item style="display: flex; justify-content: end">
          <el-button size="mini" type="danger" @click="resetForm('ruleForm')"
            >关 闭</el-button
          >
          <el-button size="mini" type="primary" @click="submitForm('ruleForm')"
            >确 认</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import Header from '@/components/content/homeCpn/uprightCpn/Header'
import Echarts from '@/components/content/homeCpn/uprightCpn/Echarts'
import newHeader from '@/components/content/homeCpn/uprightCpn/newHeader'
import { getStatisticss, getRecord } from '@/api/control/control'


export default {
  components: {
    // Header,
    newHeader,
    Echarts
  },
  data() {
    return {
      clientShow: true, // 是显示客流还是显示客户登记
      treeData: [], // 机构数据

      ruleForm: { // 表单数据
        department: '',
        archivesId: null, // 档案id
        name: '',
        genderStr: '',
        mobile: '',
        carNum: '',
        threshold: 85, // 阈值
      },
      rules: {
        // department: [
        //   { required: true, message: '请选择机构', trigger: 'blur' },
        // ],
        // name: [
        //   { required: true, message: '请输入姓名', trigger: 'blur' },
        // ],
        // sex: [
        //   { required: true, message: '请选择性别', trigger: 'blur' },
        // ],
        mobile: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          },
        ],
        carNum: [
          { required: true, message: '请输入车牌', trigger: 'blur' },
        ]
      },
      sexList: [
        {
          label: '男',
          value: '男'
        },
        {
          label: '女',
          value: '女'
        }
      ],
      recordList: [], // 档案数据
      isChange_sex: false,
      isChange_record: false,
      isChange_department: false,
      queryParams: { // 查询数据
        pageNum: 1,
        pageSize: 100,
        orgId: null,
        archivesType: 3, // 只查客户类型
      },
    }
  },
  created() {
    this.treeData = this.$store.getters.info.deptPermission;
    this.ruleForm.department = this.treeData[0].id
    this.queryParams.orgId = this.treeData[0].id
    getRecord(this.queryParams).then(res => {
      this.recordList = res.rows.map(it => {
        return {
          label: it.name,
          value: it.id
        }
      })
    })
  },
  methods: {
    onChange_department() {
      this.isChange_department = !this.isChange_department;
    },
    onChange_record() {
      this.isChange_record = !this.isChange_record;
    },
    // 取消
    resetForm(formName) {
      this.clientShow = true
      this.reset()
    },
    reset() {
      this.ruleForm = {
        department: this.ruleForm.department,
        archivesId: this.ruleForm.archivesId, // 档案id
        name: '',
        genderStr: '',
        mobile: '',
        carNum: '',
        threshold: 85, // 阈值
      }
      // this.recordList = []
    },
    // 确认
    submitForm(formName) {
      if (this.recordList.length > 0) {
        if (!this.ruleForm.archivesId) {
          this.$notify.warning('当前机构是有客户档案的请选择一个')
          return
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          getStatisticss(this.ruleForm).then(res => {
            if (res.code === 200) {
              this.$notify.success('登记成功')
              this.reset()
            }
          })
          return true;
        } else {
          return false;
        }
      });
    },
    // 单击 机构节点
    handleNodeClick(node, data) {
      const id = data.id;
      this.ruleForm.department = id;
      this.$refs.cascaderAder.dropDownVisible = false
      this.queryParams.orgId = id
      getRecord(this.queryParams).then(res => {
        this.recordList = res.rows.map(it => {
          return {
            label: it.name,
            value: it.id
          }
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.upright {
  box-sizing: border-box;
  padding: 20px 16px;
  width: 325px;
  height: 367px;
  background: rgba(43, 55, 84, 0.5);
  border: 1px solid #84ece4;
  border-radius: 19px;

  h3 {
    margin: 0;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.header ::v-deep .el-button--mini,
.el-button--mini.is-round {
  padding: 3px 10px;
  height: 24px;
}
.active {
  color: #409eff;
}

/deep/ .el-form-item {
  margin-bottom: 5px;
}
/deep/.el-form-item__error {
  top: 81%;
}
</style>