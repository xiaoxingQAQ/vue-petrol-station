<template>
  <el-dialog
    title="人脸注册"
    :visible.sync="visible_2"
    width="40%"
    :before-close="handleCancel_2"
  >
    <div class="register">
      <div class="upload">
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
              :src="file.url"
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
      </div>
      <div style="flex: 1">
        <el-form
          :model="Form"
          :rules="FormRules"
          ref="form"
          label-position="right"
          label-width="80px"
          class="Form"
        >
          <el-form-item label="姓名：" prop="name">
            <el-input size="small" v-model="Form.name"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender_str">
            <div class="select unique">
              <!-- 查询 -->
              <el-select
                @visible-change="onChange_1"
                size="small"
                v-model="Form.gender_str"
                placeholder="请选择"
              >
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="证件号码：" prop="id_card">
            <el-input size="small" t v-model="Form.id_card"></el-input>
          </el-form-item>
          <el-form-item label="地址：">
            <el-input size="small" v-model="Form.address"></el-input>
          </el-form-item>
          <el-form-item label="阈值：" prop="threshold_value">
            <el-input v-model.number="Form.threshold_value"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              size="small"
              type="textarea"
              v-model="Form.remark"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleOk_2">保 存</el-button>
      <el-button type="danger" @click="handleCancel_2">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";

export default {
  props: {
    visible_2: {
      type: Boolean
    },
    detail_data: {
      type: Object
    }
  },
  data() {
    return {
      /* 上传图片参数 */
      uploadUrl: process.env.VUE_APP_BASE_API + '/file/upload/image',
      headers: { Authorization: "Bearer " + getToken() },
      isUploading: false,

      // 籍贯数据
      isChange_1: false,
      isChange_2: false,
      Form: {
        imageUrl: null,
        archivesId: null, // 档案id
        name: null, // 姓名
        gender_str: null, // 性别 
        id_card: null, // 证件号码
        address: null, // 地址
        threshold_value: null, // 阈值
        remark: null // 备注
      },
      FormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        gender_str: [{ required: true, message: "请输选择性别", trigger: "blur" }],
        threshold_value: [
          { required: true, message: "请输入阈值", trigger: "blur" }
        ],
        id_card: [
          { pattern: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/, message: '请输入正确的证件号', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    visible_2(val) {
      if (!val) {
        return this.handleCancel_2()
      } else {
        this.Form.gender_str = '男'
        this.Form.threshold_value = 85
      }
    },
  },
  methods: {
    resetForm() {
      this.Form = {
        imageUrl: null,
        archivesId: null,
        name: null,
        gender_str: null,
        id_card: null,
        address: null,
        threshold_value: null,
        remark: null
      }
      this.$refs.form.resetFields()
    },
    onChange_1() {
      this.isChange_1 = !this.isChange_1;
    },
    onChange_2() {
      this.isChange_2 = !this.isChange_2;
    },
    handleCancel_2() {
      this.resetForm()
      this.$refs.upload.clearFiles()
      this.Form.imageUrl = null;
      this.$emit("cancel_2");
    },
    // 保存
    handleOk_2() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.Form.imageUrl)
            return this.$message.info('请上传图片')
          this.Form.archivesId = this.detail_data.id
          this.$emit('ok_2', this.Form)
        }
      })
    },
    // 处理上传成功
    handleOk(res, file, fileList) {
      if (res) {
        if (res.code === 200) {
          this.$message.success('上传成功')
          this.Form.imageUrl = res.data.url
        }
      }
    },
    // 处理上传失败
    handleError(err, file, fileList) {
      console.log('err: ', err);
      if (err) {
        this.$message.error('上传失败')
      }
    },
    // 超出限制
    onExceed(files, fileList) {
      console.log('files: ', files);
      this.$message.warning('只能上传一张')
    },
    // 处理删除
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
        this.Form.imageUrl = null;
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
        flag = false
      });
      return flag
    },
  }
};
</script>

<style lang="less" scoped>
// 人脸注册dislog
.register {
  width: 100%;
  height: 340px;
  display: flex;
  justify-content: space-around;
  .upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
    // ant upload 的大小
    ::v-deep .ant-upload {
      margin-bottom: 20px;
      width: 175px;
      height: 175px;
      border-radius: 8px;
    }
  }
}
/* Upload */
.text {
  position: absolute;
  top: 10%;
  left: 31%;
  color: rgba(204, 204, 204, 0.897);
  font-weight: 500;
}

::v-deep .el-upload--picture-card {
  position: relative;
  background-color: transparent;
  border: 0.0125rem dashed #77f1d7;
  border-radius: 0.075rem;
  box-sizing: border-box;
  width: 1.85rem;
  height: 1.85rem;
  line-height: 1.825rem;
  vertical-align: top;
}
::v-deep .el-icon-plus {
  transform: translateY(-25%) !important;
}

::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}

::v-deep .el-upload-list__item-preview,
.el-icon-download {
  display: none !important;
}
</style>