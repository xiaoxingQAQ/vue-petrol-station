<template>
  <el-dialog
    width="500px"
    :close-on-click-modal="false"
    :modal="false"
    :title="title"
    :visible.sync="dialogVisible"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="编号:" prop="numStr">
        <el-input
          placeholder="请输入编号"
          v-model="ruleForm.numStr"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="储油:" prop="oilStorage2">
        <div class="select">
          <el-select
            style="width: 100%"
            @visible-change="onChange_oilStorage"
            v-model="ruleForm.oilStorage2"
            placeholder="请选择储油"
            size="mini"
          >
            <el-option
              v-for="item in oilStorageList"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="体积:" prop="volume2">
        <el-input
          placeholder="请输入体积"
          v-model="ruleForm.volume2"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="温度:" prop="temperature2">
        <el-input
          placeholder="请输入温度"
          v-model="ruleForm.temperature2"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="液位:" prop="liquid2">
        <el-input
          placeholder="请输入液位"
          v-model="ruleForm.liquid2"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item style="display: flex; justify-content: end">
        <el-button size="mini" type="danger" @click="resetForm2('ruleForm')"
          >取消</el-button
        >
        <el-button size="mini" type="primary" @click="submitForm2('ruleForm')"
          >确认</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: '', // 弹窗标题
      dialogVisible: false,
      ruleForm: {
        id: '',
        stationId: '',
        oilStorage2: '',
        volume2: '',
        temperature2: '',
        liquid2: '',
        numStr: ''
      },
      rules: {
        oilStorage2: [
          { required: true, message: '请选择储油', trigger: 'blur' },
        ],
        volume2: [
          { required: true, message: '请输入体积', trigger: 'blur' },
        ],
        temperature2: [
          { required: true, message: '请输入温度', trigger: 'blur' },
        ],
        liquid2: [
          { required: true, message: '请输入液位', trigger: 'blur' },
        ],
        numStr: [
          { required: true, message: '请输入编号', trigger: 'blur' },
        ]
      },
      isChange_oilStorage: false,
      oilStorageList: [
        {
          label: '0#',
          value: '0#',
        },
        {
          label: '92#',
          value: '92#',
        },
        {
          label: '95#',
          value: '95#',
        },
        {
          label: '98#',
          value: '98#',
        },
      ]
    }
  },
  methods: {
    handleCreate(data) {
      this.reset()
      this.title = data ? '编辑油罐状态' : '新增油罐状态'
      this.dialogVisible = true;
      if (data) {
        // 编辑
        this.ruleForm = {
          id: data.id,
          stationId: '',
          oilStorage2: data.oilType,
          volume2: data.volume,
          temperature2: data.temperature,
          liquid2: data.liquid,
          numStr: data.num
        }
      }
    },
    onChange_oilStorage() {
      this.isChange_oilStorage = !this.isChange_oilStorage;
    },
    // 取消
    resetForm2(formName) {
      console.log(this.ruleForm);
      this.dialogVisible = false
      this.$refs[formName].resetFields();
      this.reset()
    },
    reset() {
      this.ruleForm = {
        id: '',
        stationId: '',
        oilStorage2: '',
        volume2: '',
        temperature2: '',
        liquid2: '',
        numStr: ''
      }
    },
    // 确认
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$emit('addTankState', this.ruleForm)
          this.reset()
          return true;
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
</style>