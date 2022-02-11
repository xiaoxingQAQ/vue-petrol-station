<template>
  <div class="detail_row">
    <template v-if="typex == 'a'">
      <div class="name">
        <span>姓名</span>
        <el-input v-model="form.name" placeholder="模糊搜索"></el-input>
      </div>
    </template>

    <template v-if="typex == 'a'">
      <div class="sex">
        <span>性别</span>
        <div class="select">
          <el-select
            @visible-change="onChange_1"
            v-model="form.genderStr"
            placeholder="模糊搜索"
          >
            <el-option label="无" value=""></el-option>
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </div>
      </div>

      <div class="id_number">
        <span>证件号码</span>
        <el-input v-model="form.idCard" placeholder="模糊搜索"></el-input>
      </div>

      <div class="address">
        <span>地址</span>
        <el-input v-model="form.address" placeholder="模糊搜索"></el-input>
      </div>
      <div class="threshold">
        <span>阈值</span>
        <el-input placeholder="模糊搜索" v-model="form.threshold"></el-input>
      </div>
      <div class="search">
        <el-button type="primary" size="mini" @click="handleSearch"
          >查询</el-button
        >
        <el-button type="warning" size="mini" @click="resetSearch"
          >重置</el-button
        >
      </div>
    </template>

    <!-- <template v-if="isShow">
      <div class="equally">
        <span>{{ setLabel.label_1 }}</span>
        <div class="select">
          <el-select
            @visible-change="onChange_1"
            v-model="value"
            placeholder="模糊搜索"
          >
            <el-option
              v-for="item in options_1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="equally">
        <span>{{ setLabel.label_2 }}</span>
        <div class="select">
          <el-select
            @visible-change="onChange_2"
            v-model="value"
            placeholder="模糊搜索"
          >
            <el-option
              v-for="item in options_2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="equally">
        <span>{{ setLabel.label_3 }}</span>
        <div class="select">
          <el-select
            @visible-change="onChange_3"
            v-model="value"
            placeholder="模糊搜索"
          >
            <el-option
              v-for="item in options_3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div>
        <el-button type="primary" size="mini" @click="handleSearch_2"
          >查询</el-button
        >
      </div>
    </template> -->
  </div>
</template>

<script>
export default {
  props: {
    typex: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      input: null,
      // 人脸布控的form
      form: {
        name: null,
        genderStr: null,
        idCard: null,
        address: null,
        threshold: null,
      },
      // 人车布控的form
      form_2: {

      },

      isChange_1: false, // true 旋转三角形
      isChange_2: false, // true 旋转三角形
      isChange_3: false, // true 旋转三角形

      value: null,
      options_1: [],
      options_2: [],
      options_3: [],
    }
  },
  computed: {
    setLabel() {
      switch (this.typex) {
        case 'b':
          return {
            label_1: '车牌',
            label_2: '颜色',
            label_3: '款式',
          }
        case 'c':
          return {
            label_1: '帽子',
            label_2: '口罩',
            label_3: '上装颜色',
          }
      }
    },
    isShow() {
      if (this.typex === 'b' || this.typex === 'c') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    // 选择框变化 触发
    onChange_1() {
      this.isChange_1 = !this.isChange_1
    },
    onChange_2() {
      this.isChange_2 = !this.isChange_2
    },
    onChange_3() {
      this.isChange_3 = !this.isChange_3
    },

    // 处理查询
    handleSearch() {
      this.$emit('querySearch', this.form)
    },
    // 重置
    resetSearch() {
      this.form = {
        name: null,
        genderStr: null,
        idCard: null,
        address: null,
        threshold: null,
      }
      this.handleSearch()
    },
    handleSearch_2() {

    },
  },
}
</script>

<style lang="less" scoped>
.detail_row {
  display: flex;
  margin-bottom: 10px;
  div {
    display: flex;
    align-items: center;
    margin-right: 10px;

    span {
      margin-right: 8px;
      font-size: 17px;
      font-weight: 500;
      color: #ffffff;
    }

    ::v-deep .el-input__inner {
      width: 159px !important;
      height: 32px !important;
    }
  }
  > .name {
    ::v-deep .el-input__inner {
      width: 120px !important;
      height: 32px !important;
    }
  }
  .sex {
    &::v-deep .el-input__inner {
      width: 120px !important;
      height: 32px !important;
    }
  }
  .threshold,
  .address {
    &::v-deep .el-input__inner {
      width: 136px !important;
      height: 32px !important;
    }
  }
  .id_number {
    &::v-deep .el-input__inner {
      width: 214px !important;
      height: 32px !important;
    }
  }
}

::v-deep .el-select .el-input .el-select__caret {
  display: grid;
  place-content: center;
}

/* 选择框 */
::v-deep .el-input__inner {
  color: #fff !important;
  background: rgba(35, 63, 87, 0.65) !important;
  border: 1px solid #84ece4 !important;
}
</style>