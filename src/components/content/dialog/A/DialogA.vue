<template>
  <el-dialog
    title="详情查看"
    :visible.sync="visible_a"
    width="75%"
    :before-close="handleCancel_a"
    class="impotDialog"
    top="5vh"
  >
    <div>
      <DetailRow @querySearch="querySearch" typex="a" />
    </div>
    <div class="dialog_con">
      <div class="li" v-for="(item, index) in dataList" :key="index">
        <div class="image">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="(res, file) => handleAvatarSuccess(res, file, item)"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="item.facePhotoUrl"
              :src="item.facePhotoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="main">
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
              <input v-model="item.threshold" type="text" />
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
              <input v-model="item.remark" type="text" />
            </li>
          </ul>
        </div>
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
      <div class="pagination_con">
        <el-pagination
          style="display: flex; justify-content: center; margin-top: 10px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tablePage.currentPage"
          :page-sizes="tablePage.pageSizes"
          :page-size="tablePage.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tablePage.totalResult === 0 ? total : tablePage.totalResult"
        >
        </el-pagination>
      </div>
    </span>
  </el-dialog>
</template>

<script>
import DetailRow from '@/components/content/detailRow/DetailRow';
import Pagination from '@/components/content/pagination/Pagination';

import { savePerson, delPerson, getQuerySearch, getPerson } from '@/api/control/control';

import { getToken } from '@/utils/auth';

export default {
  components: {
    DetailRow,
    Pagination,
  },
  props: {
    typex: {
      type: String,
      default: null,
    },
    visible_a: {
      type: Boolean,
    },
    detail_list: {
      type: Array,
      default() {
        return [];
      },
    },
    queryParams: {
      type: Object,
      default() {
        return {
          pageNum: 1,
          pageSize: 10,
        };
      },
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      openUpload: false,

      /* 上传图片参数 */
      uploadUrl: process.env.VUE_APP_BASE_API + '/file/upload/image',
      headers: { Authorization: 'Bearer ' + getToken() },

      imageUrl: null, // 上传成功后图片的Url
      dataList: [],
      tablePage: { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
    };
  },
  watch: {
    detail_list(val) {
      this.dataList = val;
    }
  },
  mounted() {

  },
  methods: {
    handleCancel_a() {
      this.openUpload = false;
      this.dataList = []
      this.tablePage = { // 表格分页数据
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
        pageSizes: [10, 20, 30, 40, 50, 100]
      }
      this.$emit('cancel_a');
    },
    handleOk_a() { },
    // 处理修改信息
    handleEdit(item) {
      const id = item.id;
      const facePhotoUrl = this.imageUrl;
      const name = item.name;
      const genderStr = item.genderStr;
      const threshold = item.threshold;
      const idCard = item.idCard;
      const address = item.address;
      const remark = item.remark;
      const data = {
        id,
        facePhotoUrl,
        name,
        genderStr,
        threshold,
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

    /* 设置label */
    setTitle(typex) {
      switch (typex) {
        case 'a':
          return {
            label_1: '姓名：',
            label_2: '性别：',
            label_3: '阈值：',
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
    },

    /* 分页区域 */
    // 处理分页改变
    // handleCurrentChange(val) {
    //   this.$emit('changePageNum', val);
    // },

    /* 双击展示上传 */
    showUpload(item) {
      const id = item.id;
      this.openUpload = true;
    },

    handleAvatarSuccess(res, file, item) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      item.facePhotoUrl = res.data.url;
      this.imageUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    handleCancel() {
      this.openUpload = false;
    },
    // 查询
    querySearch(data) {
      debugger
      const params = {
        address: data.address,
        genderStr: data.genderStr,
        idCard: data.idCard,
        name: data.name,
        nativePlace: data.nativePlace,
        archivesId: this.queryParams.archivesId,
        pageNum: 1,
        pageSize: this.tablePage.pageSize
      }
      getQuerySearch(params).then(res => {
        this.tablePage.totalResult = +res.total;
        this.dataList = res.rows;
        console.log('this.dataList: ', this.dataList);
      })
    },
    // 表格分页 当前是第几页
    handleCurrentChange(data) {
      this.tablePage.currentPage = data
      const params = {
        archivesId: this.queryParams.archivesId,
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize
      }
      getQuerySearch(params).then(res => {
        this.tablePage.totalResult = +res.total
        this.dataList = res.rows
      })
    },
    // 分页调整每页展示的数量
    handleSizeChange(data) {
      this.tablePage.pageSize = data
      const params = {
        archivesId: this.queryParams.archivesId,
        pageNum: this.tablePage.currentPage,
        pageSize: this.tablePage.pageSize
      }
      getQuerySearch(params).then(res => {
        this.tablePage.totalResult = +res.total
        this.dataList = res.rows
      })
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  li {
    input {
      box-sizing: border-box;
      width: 100%;
      height: 21px;
      border: none;
      color: #fff;
      font-weight: 500;
      padding-left: 5px;
      background-color: transparent;
    }
    input:focus {
      outline: none;
      border-radius: 4px;
    }
  }
}
.pagination_con {
  display: flex;

  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%);

  > div {
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
  }

  .left {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }

  .right {
    width: 82px;
    height: 30px;
    background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
    opacity: 1;
    border-radius: 4px;
  }
}

.dialog-footer {
  height: 30px;
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
//::v-deep .el-icon-plus {
//  transform: translateY(-25%) !important;
//}

::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}

::v-deep .el-upload-list__item-preview,
.el-icon-download {
  display: none !important;
}

::v-deep .el-dialog__footer {
  display: flex !important;
  justify-content: space-around !important;
}
::v-deep .el-upload {
  display: inline-block;
  text-align: center;
  cursor: pointer;
  outline: 0;
  border: 0.5px solid #cccccc69;
  border-radius: 8px;
}
.avatar-uploader .el-upload {
  border: 0.5px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 90px;
  height: 90px;
  line-height: 90px;
  text-align: center;
}
.avatar {
  width: 90px;
  height: 90px;
  display: block;
  border-radius: 6px;
}
/deep/.el-pagination__jump {
  color: #fff;
}
/deep/.el-pagination__total {
  color: #fff;
}
/deep/.el-pagination .btn-prev {
  padding: 0;
}
</style>
