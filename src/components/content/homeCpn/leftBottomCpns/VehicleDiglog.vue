<template>
    <el-dialog 
    title="进站车辆" 
    :visible="stopTheVehicleKey" 
    width="60%"
    :before-close="VehicleDiglogCancel">
      <el-table
        :data="tableData"
        align='center'
        header-align="center"
        height='576px'
        style="width: 100%"
        :header-cell-style="{ background: '#6FE9CE',color: '#000',fontSize: '15px'}">
        <el-table-column
          prop="licence"
          label="车牌">
        </el-table-column>
        <el-table-column
          prop="styleName"
          label="车型">
        </el-table-column>
        <el-table-column
          prop=""
          label="车主">
        </el-table-column>
        <el-table-column
          prop=""
          label="客户类型">
        </el-table-column>
        <el-table-column
          prop="pullin"
          label="抓拍时间">
        </el-table-column>
      </el-table>
    </el-dialog>
</template>

<script>
import { getCaptureSelectLimit } from '@/api/oilStation'
export default {
  props: ['stopTheVehicleKey', 'orgIdVeh'],
  data() {
    return {
      tableData: []
    }
  },
  created() {
    
  },
  mounted() {
  },
  watch: {
    orgIdVeh() {
      getCaptureSelectLimit({ orgId: this.orgIdVeh }).then(res => {
        this.tableData = res.rows
      })
    }
  },
  methods: {
    VehicleDiglogCancel () {
      this.$emit('VehicleDiglogCancel')
    },
  }
}
</script>

<style lang="less" scoped>
  // 表格 边框
  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf,
  ::v-deep .el-table--border th.el-table__cell,
  ::v-deep .el-table__fixed-right-patch,
  ::v-deep .el-table--border {
    border-color: #6FE9CE;
  }
  ::v-deep .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #6FE9CE;
  }
  ::v-deep .el-table td.el-table__cell,
  ::v-deep .el-table th.el-table__cell.is-leaf {
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background-color: #1a2c3fff;
  }
// 滚动条的宽度
/deep/.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块
/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: #6FE9CE;
  border-radius: 3px;
}
/deep/.el-table__body-wrapper::-webkit-scrollbar-track {
  background-color: #fff;
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
</style>