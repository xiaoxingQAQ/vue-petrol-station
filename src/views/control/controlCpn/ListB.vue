<template>
  <div class="carClass">
    <el-row
      class="queryClass"
      type="flex"
      style="align-items: center"
      justify="space-between"
    >
      <div style="display: flex; align-items: center">
        <div class="select">
          <el-select
            size="small"
            @visible-change="onChange_deployArr"
            v-model="activeIndex"
          >
            <el-option
              v-for="item in deployArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="btns">
          <el-button size="small" type="primary" @click="handleAppend"
            >添加布控</el-button
          >
          <el-button size="small" type="danger" @click="deleteBatches"
            >批量删除</el-button
          >
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div style="display: flex">
          <div class="inputClass">
            <span>开始时间</span>
            <el-date-picker
              size="small"
              type="datetime"
              placeholder="选择日期"
              v-model="queryParams.startTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
          <div class="inputClass">
            <span>结束时间</span>
            <el-date-picker
              size="small"
              type="datetime"
              placeholder="选择日期"
              v-model="queryParams.endTime"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </div>
        </div>
        <div v-if="activeIndex === 'vehicleDeploy'">
          <div class="inputClass">
            <span>车牌</span>
            <el-input
              size="small"
              class="input"
              v-model="queryParams.plate"
              placeholder="格式：粤B8888"
              style="width: 140px"
            />
          </div>
        </div>
        <div>
          <div class="select">
            <span>机构</span>
            <el-cascader
              ref="cascaderAder"
              collapse-tags
              placeholder="请选择机构"
              @visible-change="onChange_organization"
              :options="treeDataArr"
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
                <i :class="data.icon"></i>&nbsp
                <span
                  :class="{ active: queryParams.orgId == data.id }"
                  @click="handleNodeClick(node, data)"
                  >{{ data.label }}</span
                >
              </template>
            </el-cascader>
          </div>
        </div>
        <div>
          <el-button class="btn" size="small" type="primary" @click="getQuery"
            >查询</el-button
          >
          <el-button class="btn" size="small" type="warning" @click="resetQuery"
            >重置</el-button
          >
        </div>
      </div>
    </el-row>
    <el-row v-if="activeIndex === 'vehicleDeploy'">
      <VehicleDeploy ref="VehicleDeploy" />
    </el-row>
    <el-row v-if="activeIndex === 'motorcycleType'">
      <MotorcycleType ref="MotorcycleType" />
    </el-row>
    <el-row v-if="activeIndex === 'imageDeploy'">
      <ImageDeploy ref="ImageDeploy" />
    </el-row>
  </div>
</template>

<script>
import VehicleDeploy from '@/views/control/controlCpn/deploy/VehicleDeploy'
import MotorcycleType from '@/views/control/controlCpn/deploy/MotorcycleType'
import ImageDeploy from '@/views/control/controlCpn/deploy/ImageDeploy'

export default {
  components: {
    VehicleDeploy,
    MotorcycleType,
    ImageDeploy
  },
  data() {
    return {
      activeIndex: 'vehicleDeploy', // 默认为车牌布控
      deployArr: [
        {
          label: '车牌布控',
          value: 'vehicleDeploy'
        },
        {
          label: '车型布控',
          value: 'motorcycleType'
        },
        {
          label: '图片布控',
          value: 'imageDeploy'
        }
      ],
      isChange_deployArr: false,
      isChange_organization: false,
      treeDataArr: [], // 机构数据
      // 查询参数
      queryParams: {
        startTime: '',
        endTime: '',
        orgId: '',
        plate: '',
      },
    }
  },
  created() {
    this.treeDataArr = this.$store.getters.info.deptPermission;
  },
  methods: {
    onChange_deployArr() {
      this.isChange_deployArr = !this.isChange_deployArr;
    },
    onChange_organization() {
      this.isChange_organization = !this.isChange_organization;
    },
    // 添加布控
    handleAppend() {
      if (this.activeIndex === 'vehicleDeploy') {
        // 车牌布控添加
        this.$refs.VehicleDeploy.handleAppend()
      } else if (this.activeIndex === 'motorcycleType') {
        // 车辆布控添加
        this.$refs.MotorcycleType.handleAppend2()
      } else {
        // 图片布控添加
        this.$refs.ImageDeploy.handleAppend3()
      }
    },
    // 批量删除
    deleteBatches() {
      if (this.activeIndex === 'vehicleDeploy') {
        // 车牌布控批量删除
        this.$refs.VehicleDeploy.deleteBatches()
      } else if (this.activeIndex === 'motorcycleType') {
        // 车辆布控批量删除
        this.$refs.MotorcycleType.deleteBatches2()
      } else {
        // 图片布控批量删除
        this.$refs.ImageDeploy.deleteBatches3()
      }
    },
    // 查询
    getQuery() {
      if (this.activeIndex === 'vehicleDeploy') {
        // 车牌布控批量查询
        this.$refs.VehicleDeploy.getQuery(this.queryParams)
      } else if (this.activeIndex === 'motorcycleType') {
        // 车辆布控批量查询
        this.$refs.MotorcycleType.getQuery2(this.queryParams)
      } else {
        // 图片布控批量查询
        this.$refs.ImageDeploy.getQuery3(this.queryParams)
      }
    },
    // 重置查询
    resetQuery() {
      this.queryParams = {
        startTime: null,
        endTime: null,
        orgId: null,
        plate: null,
      }
      this.getQuery()
    },
    // 机构节点变化
    handleNodeClick(node, data) {
      this.queryParams.orgId = data.id
    }
  }
}
</script>

<style lang="less" scoped>
.carClass {
  width: 100%;
  height: 100%;
  .queryClass {
    margin-bottom: 20px;
  }
  .select {
    span {
      color: #fff;
      font-size: 14px;
      display: inline-block;
      margin-right: 10px;
    }
  }
}
.btns {
  padding-left: 20px;
}
.inputClass {
  font-size: 14px;
  color: #fff;
  margin-right: 20px;
  span {
    display: inline-block;
    margin-right: 10px;
  }
}
.btn {
  margin-left: 20px;
}
.active {
  color: #409eff;
}
// 每一行的背景颜色
::v-deep
  .el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell {
  background-color: #1a2c3fff;
}
// 暂无数据
::v-deep .el-table__empty-block {
  background-color: #1a2c3fff;
}
.el-menu-demo li {
  background: none !important;
}
::v-deep .el-pagination__sizes {
  display: none !important;
}
</style>