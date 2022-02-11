<template>
  <el-dialog
    title="批量导入"
    :visible.sync="visible_3"
    width="72%"
    :before-close="handleCancel_3"
    class="impotDialog"
  >
    <div v-if="open" class="dialog_con unique">
      <div class="li" v-for="(item, index) in detail_list" :key="index">
        <div class="image">
          <img :src="item.facePhotoUrl" />
          <el-checkbox
            v-model="item.checked"
            tran
            @change="(val) => change(val, item)"
          ></el-checkbox>
        </div>
        <ul>
          <li>
            <span>{{ setTitle(typex).label_1 }}</span>
            <input v-model="item.name" type="text" />
          </li>
          <li>
            <span>{{ setTitle(typex).label_2 }}</span>
            <input v-model="item.genderStr" type="text" />
          </li>
          <li>
            <span>{{ setTitle(typex).label_3 }}</span>
            <input v-model="item.nativePlace" type="text" />
          </li>
          <li>
            <span>{{ setTitle(typex).label_4 }}</span>
            <input v-model="item.idCard" type="text" />
          </li>
          <li>
            <span>{{ setTitle(typex).label_5 }}</span>
            <input v-model="item.address" type="text" />
          </li>
          <li v-if="typex == 'a'">
            <span>{{ setTitle(typex).label_6 }}</span>
            <input :value="item.remark" type="text" />
          </li>
        </ul>
        <div class="footer">
          <el-button size="small" type="primary" @click="handleEdit(item)"
            >修改</el-button
          >
          <el-button size="small" type="danger" @click="delPerson(item)"
            >删除</el-button
          >
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button style="margin-right: 130px" type="primary" @click="handleOk_3"
        >保 存</el-button
      >
      <el-button type="danger" @click="handleCancel_3">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { savePerson, delPerson } from '@/api/control/control';

export default {
  props: {
    typex: {
      type: String,
      default: ''
    },
    visible_3: {
      type: Boolean,
    },
    detail_list: {
      type: Array,
      default() {
        return []
      }
    },
  },
  data() {
    return {
      open: true,
      checkList: [],
      Form: {
        value_1: null,
        value_2: null,
        value_3: null, // 籍贯
        value_4: null, // 证件号码
        value_5: null, // 地址
        value_6: null, // 备注
      },
    }
  },
  computed: {
  },
  methods: {
    // 处理·批量导入框·关闭
    handleCancel_3() {
      this.open = false;
      this.$nextTick(() => {
        this.open = true
      })
      this.$emit('cancel_c')
    },
    // 处理修改信息
    handleEdit(item) {
      const id = item.id;
      const facePhotoUrl = this.imageUrl;
      const name = item.name;
      const genderStr = item.genderStr;
      const nativePlace = item.nativePlace;
      const idCard = item.idCard;
      const address = item.address;
      const remark = item.remark;
      const data = {
        id,
        facePhotoUrl,
        name,
        genderStr,
        nativePlace,
        idCard,
        address,
        remark,
      };
      savePerson(data).then((res) => {
        if (res.code === 200) {
          this.$message.success('修改成功');
          this.imageUrl = null;
        } else {
          this.$message.error('修改失败');
        }
      });
    },
    // 处理人员删除
    delPerson(item) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = [item.id];
        delPerson({ ids }).then((res) => {
          console.log('res: ', res);
          if (res.code === 200) {
            this.$message.success('删除成功');
            const params = {
              archivesId: this.queryParams.archivesId,
              pageNum: this.tablePage.currentPage,
              pageSize: this.tablePage.pageSize
            }
            getQuerySearch(params).then(res => {
              this.tablePage.totalResult = +res.total
              this.dataList = res.rows
            })
            this.$emit('refresh');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 处理·批量导入框·保存
    handleOk_3() {
      this.checkList = []
      this.detail_list.forEach(item => {
        item.checked ? this.checkList.unshift(item) : null;
      })
      this.checkList = this.checkList.map(item => {
        return item.id;
      })
      console.log(this.checkList);
    },
    change(val, item) {
      item.checked = val

    },
    setTitle(typex) {
      switch (typex) {
        case 'a':
          return {
            label_1: '姓名：',
            label_2: '性别：',
            label_3: '籍贯：',
            label_4: '证件号：',
            label_5: '地址：',
            label_6: '备注：',
          };
        case 'b':
          return {
            label_1: '姓名：',
            label_2: '车牌：',
            label_3: '颜色：',
            label_4: '款式：',
            label_5: '备注：',
            label_6: '',
          };
        case 'c':
          return {
            label_1: '姓名：',
            label_2: '帽子：',
            label_3: '口罩：',
            label_4: '上装颜色：',
            label_5: '备注：',
            label_6: '',
          };
      }
    }
  },
}
</script>

<style lang="less" scoped>
.li {
  .image {
    width: 90px;
    height: 90px;
    img {
      width: 100%;
      height: 100%;
    }
    .el-checkbox {
      transform: translate(105px, -25px);
    }
  }
}

.unique {
  li {
    input {
      box-sizing: border-box;
      width: 100%;
      height: 21px;
      border: none;
      color: #fff;
      padding-left: 5px;
      background-color: transparent;
    }
    input:focus {
      outline: none;
      border-radius: 4px;
    }
  }
}

.dialog-footer {
  transform: translateY(-10px);
}
::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}
</style>
