<template>
  <el-dialog
    title="布控计划"
    :visible="planKey"
    :close-on-click-modal="false"
    width="65%"
    :before-close="resetCancel"
  >
    <el-form
      :model="ruleForm_plan"
      :rules="rules_plan"
      ref="ruleForm_plan"
      label-width="100px"
    >
      <div style="display: flex">
        <el-form-item label="加油站：" style="width: 45.2%">
          <el-cascader
            style="width: 100%"
            collapse-tags
            placeholder="请选择加油站"
            :clearable="true"
            :options="treeData"
            @change="handleInput"
            :props="{
              value: 'id',
              label: 'label',
              checkStrictly: true,
              emitPath: false,
            }"
            :show-all-levels="false"
            v-model="petrolStation"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="AI服务器：" style="margin-left: 3%">
          <div class="select">
            <el-select
              @visible-change="onChange_aiServer"
              @change="handlechangeAi"
              v-model="aiServerId"
              placeholder="请选择"
            >
              <el-option
                v-for="it in aiServer"
                :key="it.value"
                :label="it.label"
                :value="it.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </div>
      <el-form-item label="摄像头：" v-if="cityOptions.length">
        <div style="display: flex; flex-wrap: wrap">
          <el-checkbox
            class="checkbox"
            style="margin-right: 10px"
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >
            <span class="unique">全选</span>
          </el-checkbox>
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            style="display: flex; flex-wrap: wrap"
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              style="display: flex"
              v-for="item in cityOptions"
              :label="item.label"
              :key="item.label"
              >{{ item.value }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="星期选择:" style="width: 45.2%">
        <div class="select">
          <el-select
            multiple
            @visible-change="onChange_weekSelected"
            v-model="weekSelected"
            placeholder="全部"
          >
            <el-option
              v-for="item in weekSelectedList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="时间段一:">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeOne"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeOne"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间段二:">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeTwo"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeTwo"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="时间段三：">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeThree"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeThree"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间段四：">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeFour"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeFour"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div style="display: flex; justify-content: space-between">
        <el-form-item label="时间段五：">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeFive"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeFive"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间段六：">
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.startTimeSix"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <span style="margin: 0 10px; color: #fff">-</span>
          <el-date-picker
            type="datetime"
            placeholder="选择时间"
            v-model="timeRes.endTimeSix"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <el-form-item style="display: flex; justify-content: end">
        <el-button @click="resetCancel('ruleForm')">取消</el-button>
        <el-button type="primary" @click="submitConfirm('ruleForm')"
          >确认</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { serverList, getLayerLists } from '@/api/control/control';
export default {
  props: {
    planKey: {
      type: Boolean
    },
  },
  components: {
    Treeselect
  },
  data() {
    return {
      petrolStation: [], //  选择哪些加油站
      treeData: [], // 加油站数据
      isIndeterminate: false,
      // 多选框全选判断
      checkAll: false,
      // 多选框数据
      cityOptions: [],
      // 选中的数据
      checkedCities: [],
      // 表单数据
      ruleForm_plan: {},
      rules_plan: {},
      // 星期选择数据
      weekSelected: [],
      weekSelectedList: [
        {
          value: '1',
          label: '星期一'
        },
        {
          value: '2',
          label: '星期二'
        },
        {
          value: '3',
          label: '星期三'
        },
        {
          value: '4',
          label: '星期四'
        },
        {
          value: '5',
          label: '星期五'
        },
        {
          value: '6',
          label: '星期六'
        },
        {
          value: '7',
          label: '星期天'
        }
      ],
      isChange_aiServer: false,
      isChange_weekSelected: false,
      aiServerId: '', // 服务器id
      aiServer: [],
      timeRes: {
        startTimeOne: '',
        endTimeOne: '',
        startTimeTwo: '',
        endTimeTwo: '',
        startTimeThree: '',
        endTimeThree: '',
        startTimeFour: '',
        endTimeFour: '',
        startTimeFive: '',
        endTimeFive: '',
        startTimeSix: '',
        endTimeSix: ''
      }
    }
  },
  mounted() {
    this.setTreeselect()
    if (JSON.stringify(this.$route.query) !== '{}') {
      this.petrolStation.push(parseInt(this.$route.query.item.orgId));
    }
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
    // 节点变化触发
    handleInput(node, instanceId) {
      console.log(this.petrolStation)
      serverList({
        orgId: this.petrolStation
      }).then(res => {
        this.aiServer = res.rows.map(it => {
          return {
            label: it.deviceName,
            value: it.id
          }
        })
      })
    },
    setTreeselect() {
      this.treeData = this.$store.getters.info.deptPermission;
    },
    // 选择框变化 触发
    onChange_aiServer() {
      this.isChange_aiServer = !this.isChange_aiServer
    },
    onChange_weekSelected() {
      this.isChange_weekSelected = !this.isChange_weekSelected;
    },
    handlechangeAi(data) {
      console.log(this.aiServerId);
      getLayerLists({
        serverId: this.aiServerId
      }).then(res => {
        this.cityOptions = res.data.map(it => {
          return {
            label: it.serialNo,
            value: it.name
          }
        })
      })
      console.log(this.cityOptions)
    },
    // 点击全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cityOptions.map(it => it.label) : []
      this.isIndeterminate = false
      console.log(this.checkedCities)
    },
    // 单选
    handleCheckedCitiesChange(val) {
      let checkedCount = val.length;
      this.checkAll = checkedCount === this.cityOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cityOptions.length;
      console.log(this.checkedCities)
    },
    // 取消
    resetCancel() {
      this.setReset()
      this.$emit('resetCancel_plan')
    },
    // 确定
    submitConfirm() {
      this.setReset()
      console.log(this.weekSelected);
      this.$emit('submitConfirm_plan')
    },
    getTreeselect(node, instanceId) {
    },
    // 重置
    setReset() {
      this.isIndeterminate = false
      this.checkAll = false
      this.checkedCities = []
      this.weekSelected = []
      this.timeRes = {
        startTimeOne: '',
        endTimeOne: '',
        startTimeTwo: '',
        endTimeTwo: '',
        startTimeThree: '',
        endTimeThree: '',
        startTimeFour: '',
        endTimeFour: '',
        startTimeFive: '',
        endTimeFive: '',
        startTimeSix: '',
        endTimeSix: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .vue-treeselect__placeholder {
  color: #bdbdbd;
  padding-top: 5px;
}

::v-deep .el-select-dropdown__item selected.hover {
  background-color: transparent !important;
}

::v-deep .el-select-dropdown.is-multiple,
.el-select-dropdown__item.selected {
  background-color: transparent !important;
}

.checkbox {
  position: relative;
  top: 9px;
}
.unique {
  position: absolute;
  top: 3px;
  left: 30px;
}
</style>