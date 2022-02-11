<template>
  <div class="amap-page-container">
    <div class="con" v-show="drawer">
      <el-button type="primary" round plain @click="editClose"
        >结束编辑</el-button
      >
    </div>
    <div class="amap-demo" id="container"></div>
    <el-dialog
      title="添加站点"
      :visible.sync="visible"
      width="600px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col
            :span="24"
            v-if="form.parentId !== 0"
            style="margin-bottom: 10px"
          >
            <el-form-item label="机构名称" prop="orgId">
              <treeselect
                v-model="form.orgId"
                :options="deptOptions"
                :show-count="true"
                :flat="true"
                :normalizer="normalizer"
                placeholder="选择机构名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">保 存</el-button>
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑站点平面图的dialog -->
    <el-dialog
      title="平面图"
      :visible.sync="visible_a"
      top="3%"
      width="1339px"
      :modal="true"
      :before-close="handleCancel_a"
    >
      <div
        v-if="open"
        ref="image"
        class="image"
        @click.right="rightEvent"
        @contextmenu.prevent
      >
        <el-image
          style="width: 1300px; height: 800px"
          :src="mapUrl"
          width="100%"
        >
          <div class="image-slot" slot="placeholder">
            <div>加载中...</div>
          </div>
          <div slot="error" class="image-slot">
            <div>暂无图片</div>
          </div>
        </el-image>
      </div>
      <!-- <div slot="footer">
        <el-button type="primary" @click="handleOk_a">保 存</el-button>
        <el-button type="danger" @click="handleCancel_a">关 闭</el-button>
      </div> -->
    </el-dialog>

    <!-- 选择摄像头的dialog -->
    <el-dialog
      title="选择摄像头"
      :visible.sync="cameraVisible"
      width="500px"
      :before-close="handleCloseCamera"
    >
      <el-form ref="formCamera" :model="formCamera" :rules="formCameraRules">
        <el-form-item label="机构名称" prop="orgId" label-width="100px">
          <el-cascader
            ref="cascaderAder"
            style="width: 100%"
            collapse-tags
            placeholder="请选择机构"
            :options="deptOptions"
            :disabled="true"
            :props="{
              value: 'id',
              label: 'label',
              checkStrictly: true,
              emitPath: false,
            }"
            :show-all-levels="false"
            v-model="formCamera.orgId"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="摄像机名称" prop="id" label-width="100px">
          <el-select
            style="width: 100%"
            v-model="formCamera.id"
            placeholder="选择摄像机"
          >
            <el-option
              v-for="item in cameraOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCloseCamera" type="danger">关 闭</el-button>
        <el-button type="primary" @click="handleOkCamera">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 监控的dialog -->
    <el-dialog
      :close-on-click-modal="false"
      title="远程监控"
      :visible.sync="visible2"
      top="3%"
      width="80%"
      :modal="true"
      center
      :before-close="handleCancel2"
      class="monitoring-dialog"
    >
      <div class="monitoring">
        <cus-player ref="video0"></cus-player>
      </div>
      <div class="footer">
        <div class="left">
          <img src="@/assets/images/monitoring/组 545.svg" alt="" />
          <div class="dpi">
            <div class="split">
              <span>分辨率调整</span>
              <span></span>
            </div>
            <ul>
              <li
                v-for="(item, index) in list3"
                :key="index"
                :class="{ active: currentIndex == item.id }"
                @click="changeIndex(item.id)"
              >
                {{ item.name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="right">
          <div>
            <div>分页预览</div>
            <span></span>
          </div>

          <ul>
            <li
              v-for="(item, index) in list2"
              :key="index"
              :class="{ active: currentIndex2 == item.id }"
              @click="changeIndex2(item.id)"
            >
              {{ item.name }}
            </li>
          </ul>

          <div>
            <span></span>
            <img src="@/assets/images/monitoring/组 544.svg" alt="" />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import CusPlayer from './from/CusPlayer';

import {
  getStationIcon,
  getCameraMarker,
  addStation,
  unMarkerStation,
  getCenterLevel,
  addCenterLevel,
  getPetrolStation,
  saveCamera,
  getCameraList,
  deleteCamera,
  getPolygonList,
  savePolygon,
  delPolygon
} from '@/api/home/home';
import { mapGetters } from 'vuex';

const lineArr = [
  [116.478935, 39.997761],
  [116.478939, 39.997825],
  [116.478912, 39.998549],
  [116.478998, 39.998555],
  [116.479282, 39.99856],
  [116.479658, 39.998528],
  [116.480151, 39.998453],
  [116.480784, 39.998302],
  [116.481149, 39.998184],
  [116.481573, 39.997997],
  [116.481863, 39.997846],
  [116.482072, 39.997718],
  [116.483633, 39.998935],
  [116.48367, 39.998968],
  [116.484648, 39.999861],
];
export default {
  components: { Treeselect, CusPlayer },
  props: {},
  data() {
    return {
      /* 轨迹区域 */
      polyline: null, // 轨迹实例
      carMarker: null, // 车辆实列
      lineArr: lineArr,
      timer: null, // 定时器id
      lineArr2: [
        [116.478935, 39.997761],
        [116.478939, 39.997825]
      ],

      /* 地图右键菜单 */
      contextMenu: null,
      /* 区域数组数据 */
      polygonList: [],
      open: true,
      // 摄像机数据
      cameraOptions: [],
      formCamera: {
        id: null,
        orgId: null,
      },
      formCameraRules: {
        orgId: [
          { required: true, message: "机构名称不能为空", trigger: "blur" },
        ],
        id: [
          { required: true, message: "摄像机名称不能为空", trigger: "blur" },
        ],
      },
      /* 选择摄像机的 */
      cameraVisible: false,
      currentIndex: 1,
      currentIndex2: 1,
      visible2: false,
      mapUrl: null, // 平面图的链接
      orgId: null, // 当前用户id
      visible_menu: false,
      list2: [
        { id: 1, name: 1 },
      ],
      list3: [
        { id: 1, name: '高' },
        // { id: 2, name: '中' },
        // { id: 3, name: '低' },
      ],

      polygonMenu: null /* 区域的右键菜单 */,
      editStatus: false, // 编辑状态

      path: [], // 多边形的数组
      polyEditor: null,
      polygon: null,
      mouseTool: null,
      drawer: false,

      marker: false,
      zoom: null,
      zoom_: null,
      center: [],
      size: [],
      cameraMarkerList: [],

      message: '请打开或关闭信息窗体试试！',
      infoWindow: null,

      visible_pop: true,
      /* 鼠标在图片上的坐标 */
      offsetX: null,
      offsetY: null,
      /* 点前点击的加油站 数据 */
      current_stand_data: {},
      visible_a: false,
      iconList: [], // 加油站站点图标
      /* 当前的位置 */
      current_XY: [],
      fileList: [], // 文件数组
      // 部门树选项
      deptOptions: [],
      mapStyle: 'amap://styles/5289fde4cf78937626b1d9119a07bede',

      menuvisible: false,
      visible: false, // dialog
      // 添加加油站站点
      form: {
        orgId: null, // 上级部门
        lng: null,
        lat: null,
      },
      rules: {
        parentId: [
          { required: true, message: '上级部门不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.deptOptions = this.info.deptPermission;
    this.orgId = this.info.user.orgId;
    this.getCenterLevel();
  },
  mounted() {
    this.getStationIcon().then(res => {
      console.log('获取加油站图标: ', res);
      this.iconList = res.data;
      this.getCameraMarker()
    }, err => {
    });
  },
  destroyed() {
    this.map && this.map.destroy();
  },
  computed: {
    ...mapGetters(['info']),
  },
  watch: {
    visible_a(val) {
      this.$emit('changeVal', val)
    },
    visible(val) {
      this.$emit('changeVal', val)
    },
    visible2(val) {
      this.$emit('changeVal', val)
    },
  },
  methods: {
    /* 网络请求 */
    // 获取加油站图标
    getStationIcon() {
      return new Promise((resolve, reject) => {
        getStationIcon().then((res) => {
          resolve(res)
        });
      })
    },
    /* 获取地图上的摄像头图标 */
    getCameraMarker() {
      getCameraMarker().then(res => {
        console.log('查询地图上的摄像头图标res: ', res);
        if (res.code === 200) {
          this.cameraMarkerList = res.data
          this.initAMap();
        }
      })
    },
    // 获取中心点
    getCenterLevel() {
      getCenterLevel({ userId: this.orgId }).then((res) => {
        console.log('获取中心点的res: ', res);
        if (res.code === 200) {
          this.size[0] = parseInt(res.data.iconW);
          this.size[1] = parseInt(res.data.iconH);
          this.zoom = parseFloat(res.data.mapRank);
          this.center[0] = parseFloat(res.data.centreLongitude);
          this.center[1] = parseFloat(res.data.centreLatitude);
        }
      });
    },
    // 获取地图站点信息
    getPetrolStation(orgId) {
      getPetrolStation({ orgId }).then((res) => {
        console.log("查询地图信息res: ", res);
        this.mapUrl = res.mapUrl
        this.visible_a = true;
        this.$nextTick(() => {
          this.renderImage()
        })
      });
    },

    /* 获取摄像头列表 */
    getCameraList() {
      getCameraList({ orgId: this.formCamera.orgId }).then(res => {
        console.log('获取摄像头列表', res);
        if (res.code === 200) {
          this.cameraOptions = res.rows;
        }
      })
    },
    /* 选择摄像机对话框关闭 */
    handleCloseCamera() {
      this.formCamera.id = null;
      this.cameraVisible = false;
    },

    /* 创建dom节点 */
    createNode(item) {
      let image = this.$refs.image;
      let div = document.createElement("div");
      let img = document.createElement("img");
      let p = document.createElement("p");
      div.style.position = "absolute";
      div.style.top = parseInt(item.mapPositionY) - 17.5 + "px";
      div.style.left = parseInt(item.mapPositionX) - 17.5 + "px";
      div.style.width = "40px";
      div.style.height = "40px";
      div.style.borderRadius = "10px";
      div.style.textAlign = "center";
      div.className = "camera-icon";
      div.style.cursor = "pointer";

      img.src = require("@/assets/images/home/监控.png");
      img.style.width = "40px";

      p.style.position = "absolute";
      p.style.boxSizing = "borderBox";
      p.style.padding = "0 8px";
      p.style.height = "30px";
      p.style.lineHeight = "30px";
      p.style.textAlign = "center";
      p.style.boxShadow = "0 1px 2px rgb(0 0 0 / 10%)";
      p.style.backgroundColor = "#fff";
      p.style.borderRadius = "4px";
      p.style.fontSize = "14px";
      p.style.fontWeight = "500";
      p.style.color = "#409EFF";
      p.style.whiteSpace = "nowrap";
      p.style.transform = "translate(-30px, -70px)";
      p.innerText = item.name;

      div.appendChild(img);
      div.appendChild(p);
      image.appendChild(div);
      div.addEventListener("click", (e) => {
        this.$confirm("此操作将永久删除该图标, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        })
          .then(() => {
            this.handleRemovePlanCamera(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      });
    },
    /* 删除平面图上的所有图标 */
    removeCameraIcon() {
      const cameraIcons = document.querySelectorAll('.camera-icon');
      cameraIcons.forEach(item => {
        item.remove()
      })
    },
    /* 渲染平面图上的图标 */
    renderImage() {
      getCameraList({ orgId: this.formCamera.orgId }).then(res => {
        console.log('获取摄像头列表', res);
        if (res.code === 200) {
          this.cameraOptions = res.rows
          if (this.cameraOptions.length > 0) {
            this.cameraOptions.forEach(item => {
              if (item.isMap === 1) {
                this.createNode(item)
              }
            })
          }
        }
      })
    },
    /* 平面图添加摄像头 保存 */
    handleOkCamera() {
      this.$refs.formCamera.validate(valid => {
        if (!valid) return
        const arr = this.cameraOptions.filter(item => {
          return item.id == this.formCamera.id
        })
        const obj = arr[0]
        /* 发送请求 */
        const data = {
          id: this.formCamera.id,
          orgId: this.formCamera.orgId,
          mapPositionX: this.offsetX,
          mapPositionY: this.offsetY,
          isMap: 1
        }
        saveCamera(data).then(res => {
          console.log('平面图添加摄像头: ', res);
          if (res.code == 200) {
            this.$notify.success('添加成功')
            this.removeCameraIcon()
            this.renderImage();
          } else {
            this.$notify.success('添加失败')
          }
          this.handleCloseCamera()
        })
      })

    },
    /* 处理删除平面图 摄像头图标 */
    handleRemovePlanCamera(item) {
      const params = {
        id: item.id,
        isMap: 0
      }
      deleteCamera(params).then(res => {
        console.log('处理删除摄像头图标: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功')
          this.removeCameraIcon()
          this.renderImage()
        } else {
          this.$message.success('删除失败')
        }
      })
    },

    /* dialog */
    // 添加站点 处理保存
    handleOk() {
      if (!this.form.orgId) return this.$message.warning('请选择部门');
      const that = this;
      this.$refs.form.validate((valid) => {
        console.log('valid: ', valid);
        if (valid) {
          const orgId = this.form.orgId;
          const longitude = this.form.lng;
          const latitude = this.form.lat;
          const data = {
            orgId,
            longitude,
            latitude,
          };
          addStation(data).then((res) => {
            console.log('添加加油站', res);
            if (res.code === 200) {
              this.$message.success('添加成功');
              that.handleCancel();
            }
            that.getStationIcon();
          });
        }
      });
    },
    // 处理添加站点框 关闭
    handleCancel() {
      this.$refs.form.resetFields();
      this.visible = false;
      this.$emit('handleVisible', false);
    },
    /* 处理远程监控预览框 关闭 */
    handleCancel2() {
      this.$refs.video0.closePlayer()
      this.visible2 = false;
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      return {
        id: node.id,
        label: node.label,
        children: node.children,
        isDisabled: node.type == '1' ? true : false,
      };
    },
    /* 初始化地图 */
    initAMap() {
      let that = this;
      let lng, lat;
      let iconW;
      let iconH;
      let zoom;
      const obj = JSON.parse(sessionStorage.getItem('centerObj'));
      if (obj instanceof Object) {
        iconW = obj.size[0];
        iconH = obj.size[1];
        lng = obj.center[0];
        lat = obj.center[1];
        zoom = obj.zoom;
      } else {
        if (this.center.length) {
          iconW = this.size[0];
          iconH = this.size[1];
          lng = this.center[0];
          lat = this.center[1];
          zoom = this.zoom;
        } else {
          iconW = 30;
          iconH = 30;
          lat = 39.919124;
          lng = 116.37353;
          zoom = 14;
        }
      }

      that.center = [lng, lat];

      // 实例化地图
      that.map = new AMap.Map('container', {
        center: that.center, //初始地图中心点
        zoom: zoom,
        resizeEnable: true, //是否监控地图容器尺寸变化
        features: ['bg', 'road', 'building'],
      });
      const map = that.map;

      // 创建一个右键菜单实例
      let contextMenu = new AMap.ContextMenu();
      this.contextMenu = contextMenu;
      //右键菜单距离量测
      contextMenu.addItem(
        '添加站点',
        function (e) {
          console.log('that.contextMenuPositon: ', that.contextMenuPositon);
          that.form.lng = that.contextMenuPositon.lng;
          that.form.lat = that.contextMenuPositon.lat;
          that.visible = true;
          that.$emit('handleVisible', true);
          contextMenu.close();
        },
        0
      );
      contextMenu.addItem(
        '添加防区',
        () => {
          if (this.editStatus == false) {
            this.drawPolygon();
          }
          contextMenu.close();
        },
        0
      );
      contextMenu.addItem('设置中心点', function (e) {
        that.form.lng = that.contextMenuPositon.lng;
        that.form.lat = that.contextMenuPositon.lat;
        const center = [that.form.lng, that.form.lat];
        // 获取缩放级别
        const zoom = that.map.getZoom();
        // 获取图标大小
        const size = that.marker._size;
        that.form.center = center;
        that.form.zoom = zoom;
        that.form.size = size;
        sessionStorage.setItem('centerObj', JSON.stringify(that.form));

        const userId = that.orgId;
        const iconW = size[0];
        const iconH = size[1];
        const centreLongitude = that.form.lng;
        const centreLatitude = that.form.lat;
        const mapRank = zoom;
        const data = {
          userId,
          iconW,
          iconH,
          centreLongitude,
          centreLatitude,
          mapRank,
        };
        // 发送请求
        addCenterLevel(data).then((res) => {
          console.log('添加中心点 ', res);
          if (res.code === 200) {
            that.$message.success('设置成功');
          } else {
            that.$message.success('设置失败');
          }
        });
        contextMenu.close();
      });
      //地图绑定鼠标右击事件——弹出右键菜单
      that.map.on('rightclick', function (e) {
        //右键菜单位置
        that.contextMenuPositon = e.lnglat;
        contextMenu.open(that.map, e.lnglat);
      });
      /* 渲染加油站图标 */
      if (that.iconList.length > 0) {
        that.iconList.forEach((item) => {
          if (item.status === 1) {
            item.longitude = item.longitude ? item.longitude : 0;
            item.latitude = item.latitude ? item.latitude : 0;
            let lnglat = new AMap.LngLat(
              parseFloat(item.longitude),
              parseFloat(item.latitude)
            );
            let icon = item.handleStatus
              ? require('@/assets/images/home/warning.gif')
              : require('@/assets/images/home/icon.gif');

            const marker = new AMap.Marker({
              position: lnglat,
              icon: new AMap.Icon({
                image: icon,
                size: new AMap.Size(iconW, iconH), //图标所处区域大小
                imageSize: new AMap.Size(iconW, iconH), //图标大小
              }),
              offset: new AMap.Pixel(0, 0)
            });
            this.marker = marker;

            item.marker = marker;
            // 创建Marker右键菜单
            let contextMarkerMenu = new AMap.ContextMenu();
            marker.on('click', () => {
              console.log('item: ', item);
              this.getPetrolStation(item.orgId)
              this.formCamera.orgId = parseInt(item.orgId);

              this.$emit('visibleA', true);
              contextMarkerMenu.close();
            });
            // 右键菜单
            contextMarkerMenu.addItem(
              '删除站点',
              function () {
                that
                  .$confirm('此操作将删除该图标, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  })
                  .then(() => {
                    that.handleRemoveMarker(that.map, item);
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除',
                    });
                  });
                contextMarkerMenu.close();
              },
              0
            );

            //绑定鼠标右击事件——弹出右键菜单
            marker.on('rightclick', function (e) {
              contextMarkerMenu.open(that.map, lnglat);
            });
            /* 添加marker到地图 */
            that.map.add(marker);

            marker.on('mouseover', () => {
              this.openInfo(item);
            });
            marker.on('mouseout', () => {
              this.closeInfo();
            });

            // 监听地图的缩放
            that.map.on('zoomchange', () => {
              that.logMapinfo();
              if (this.zoom_ >= 15) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(40, 40), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 15 && this.zoom_ >= 14) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(35, 35), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(35, 35), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 14 && this.zoom_ >= 13) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(30, 30), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(30, 30), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 13 && this.zoom_ >= 12) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(23, 23), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(23, 23), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 12 && this.zoom_ >= 11) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(15, 15), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(15, 15), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 11 && this.zoom_ >= 10) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(10, 10), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(10, 10), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              } else if (this.zoom_ < 10 && this.zoom_ >= 9) {
                const newIcon = new AMap.Icon({
                  size: new AMap.Size(5, 5), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(5, 5), // 根据所设置的大小拉伸或压缩图片
                });
                marker.setIcon(newIcon);
              }
            });
          }
        });
      }

      /* 处理监控图标的渲染 */
      if (that.cameraMarkerList.length > 0) {
        that.cameraMarkerList.forEach((item) => {
          if (item.isMark === 1) {
            item.longitude = item.longitude ? item.longitude : 0;
            item.latitude = item.latitude ? item.latitude : 0;
            let lnglat = new AMap.LngLat(
              parseFloat(item.longitude),
              parseFloat(item.latitude)
            );
            let icon = require("@/assets/images/home/监控.png");
            const cameraMarker = new AMap.Marker({
              position: lnglat,
              icon: new AMap.Icon({
                image: icon,
                size: new AMap.Size(iconW, iconH), //图标所处区域大小
                imageSize: new AMap.Size(iconW, iconH), //图标大小
              }),
              offset: new AMap.Pixel(0, 0),
            });
            this.map.add(cameraMarker);
            this.cameraMarker = cameraMarker;

            /* 创建一个右键菜单实例 */
            let contextMarkerMenu = new AMap.ContextMenu();
            /* 摄像机图标右键单击事件 */
            cameraMarker.on("rightclick", (e) => {
              //右键菜单位置
              this.contextMenuPositon = e.lnglat;
              contextMarkerMenu.open(this.map, e.lnglat);
            });

            cameraMarker.on("click", () => {
              this.visible2 = true;
              this.$nextTick(() => {
                this.setVideo([item])
              })
              console.log('item', item);
              contextMarkerMenu.close();
            });

            cameraMarker.on("mouseover", () => {
              this.openInfoCamera(item);
            });
            cameraMarker.on("mouseout", () => {
              this.closeInfoCamera();
            });


            // 监听地图的缩放
            that.map.on("zoomchange", () => {
              that.logMapinfo();
              if (this.zoom_ >= 15) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(40, 40), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);

              } else if (this.zoom_ < 15 && this.zoom_ >= 14) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(35, 35), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(35, 35), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 14 && this.zoom_ >= 13) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(30, 30), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(30, 30), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 13 && this.zoom_ >= 12) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(23, 23), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(23, 23), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 12 && this.zoom_ >= 11) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(15, 15), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(15, 15), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 11 && this.zoom_ >= 10) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(10, 10), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(10, 10), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              } else if (this.zoom_ < 10 && this.zoom_ >= 9) {
                const newIcon2 = new AMap.Icon({
                  size: new AMap.Size(5, 5), // 图标尺寸
                  image: icon, // Icon的图像
                  imageSize: new AMap.Size(5, 5), // 根据所设置的大小拉伸或压缩图片
                });
                cameraMarker.setIcon(newIcon2);
              }
            });
          }
        });
      }

      /* 渲染区域 */
      this.renderPolygon()

      /* 绘制轨迹 */
      this.drawPolyline()

      //绑定地图移动与缩放事件
      that.map.on('moveend', that.logMapinfo);
      that.map.on('zoomend', that.logMapinfo);
    },
    /* 删除加油站图标 */
    handleRemoveMarker(map, item) {
      unMarkerStation({ id: item.id }).then((res) => {
        console.log('删除加油站图标: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功');
          map.remove(item.marker);
          this.getStationIcon();
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    /* 加油站图标的信息窗体 */
    openInfo(item) {
      //构建信息窗体中显示的内容
      let info = [];
      let lnglat = new AMap.LngLat(
        parseFloat(item.longitude),
        parseFloat(item.latitude)
      );
      info.push(
        `<div>
          <span style="font-weight:500;font-size: 20px;color: #409EFF;transform: translate(5px)">${item.name}</span>
         </div>`
      );
      this.infoWindow = new AMap.InfoWindow({
        content: info.join(''), //使用默认信息窗体框样式，显示信息内容
        offset: new AMap.Pixel(6, 0),
      });
      this.infoWindow.on('open', this.showInfoOpen);
      this.infoWindow.on('close', this.showInfoClose);
      this.infoWindow.open(this.map, lnglat);
    },
    /* 加油站图标的信息窗体 */
    closeInfo() {
      //先判断 否则this.infoWindow可能为null
      if (this.infoWindow == null) {
        this.message = '信息窗体已经关闭了！';
      } else {
        this.infoWindow.close();
        this.message = '您关闭了信息窗体！';
      }
    },

    /* 摄像机图标的信息窗体 */
    openInfoCamera(item) {
      //构建信息窗体中显示的内容
      let info = [];
      let lnglat = new AMap.LngLat(
        parseFloat(item.longitude),
        parseFloat(item.latitude)
      );
      info.push(
        `<div>
          <span style="font-weight:500;font-size: 20px;color: #409EFF;transform: translate(5px)">${item.name}</span>
         </div>`
      );
      this.infoWindow = new AMap.InfoWindow({
        content: info.join(""), //使用默认信息窗体框样式，显示信息内容
        offset: new AMap.Pixel(10, 0),
      });
      this.infoWindow.on("open", this.showInfoOpen);
      this.infoWindow.on("close", this.showInfoClose);
      this.infoWindow.open(this.map, lnglat);
    },
    closeInfoCamera() {
      //先判断 否则this.infoWindow可能为null
      if (this.infoWindow == null) {
        this.message = "信息窗体已经关闭了！";
      } else {
        this.infoWindow.close();
        this.message = "您关闭了信息窗体！";
      }
    },

    /* 处理保存图片标记dialog */
    handleOk_a() {
      this.handleCancel_a();
    },

    /* 处理关闭图片标记dialog */
    handleCancel_a() {
      this.open = false;
      this.$nextTick(() => {
        this.open = true;
      })
      this.visible_a = false;
      this.mapUrl = null;
      this.formCamera.id = null;
      this.formCamera.orgId = null;

      this.$emit('visibleA', false);
    },
    /* 鼠标右键事件 */
    rightEvent(e) {
      if (!this.mapUrl) return this.$message.info('暂无图片')
      this.cameraVisible = true
      this.getCameraList()
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    // 获取当前地图级别 获取当前地图中心位置
    logMapinfo() {
      const zoom = this.map.getZoom(); //获取当前地图级别
      const center = this.map.getCenter(); //获取当前地图中心位置

      this.zoom_ = zoom;
      this.center = [center.lng, center.lat];
      const size = this.marker._size;
      const obj = {
        zoom: zoom,
        center: center,
        size,
      };
      sessionStorage.setItem('centerObj', JSON.stringify(obj));
    },
    /* 获取并清除 某类覆盖物 */
    delAllOverlays(type) {
      const arr = this.map.getAllOverlays(type)
      this.map.remove(arr)
    },
    /* 渲染多边形-防区 */
    renderPolygon() {
      getPolygonList().then(res => {
        this.polygonList = res.rows;
        if (this.polygonList.length) {
          this.polygonList.forEach(item => {
            let polygon = new AMap.Polygon({
              map: this.map,
              path: JSON.parse(item.coord),//设置多边形边界路径
              strokeColor: "#FF33FF", //线颜色
              strokeOpacity: 0.2, //线透明度
              strokeWeight: 3,    //线宽
              fillColor: "#1791fc", //填充色
              fillOpacity: 0.35,//填充透明度
              zIndex: 99
            });
            let contextMenu = new AMap.ContextMenu();
            contextMenu.addItem(
              '编辑防区',
              (e) => {
                this.drawer = true;
                this.editStatus = true;
                this.Editor(polygon, item.id)
                contextMenu.close()
              },
              0
            );
            contextMenu.addItem(
              '删除防区',
              () => {
                this
                  .$confirm('此操作将删除该防区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                  })
                  .then(() => {
                    this.handleRemovePolygon(item.id)
                  })
                  .catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除',
                    });
                  });
                contextMenu.close()
              },
              0
            );
            polygon.on('rightclick', (e) => {
              contextMenu.open(this.map, e.lnglat);
            })
          })
        }
      })
    },
    /* 删除多边形-防区 */
    handleRemovePolygon(id) {
      delPolygon({ id }).then((res) => {
        console.log('删除防区: ', res);
        if (res.code === 200) {
          this.$message.success('删除成功');
          // 重新渲染
          this.delAllOverlays('polygon')
          this.renderPolygon()
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    // 绘制多边形
    drawPolygon() {
      // 设置鼠标样式
      this.map.setDefaultCursor('crosshair');
      // 创建绘图工具
      this.mouseTool = new AMap.MouseTool(this.map);
      // 画图工具
      this.mouseTool.polygon({
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35,//填充透明度
        strokeStyle: 'solid',
      });
      /* 覆盖物对象绘制完成 */
      this.mouseTool.on('draw', (event) => {
        this.map.setDefaultCursor('default');
        //清除绘制的多边形
        this.mouseTool.close(true);

        this.contextMenu.close()
        const arr = event.obj.getPath();
        if (arr.length < 3) return

        // event.obj 为绘制出来的覆盖物对象
        console.log('绘制出来的覆盖物', arr);
        const newArr = []
        arr.forEach((item) => {
          const lng = item.lng;
          const lat = item.lat;
          const arrItem = [lng, lat]
          newArr.push(arrItem)
        });

        const data = {
          coord: JSON.stringify(newArr)
        }
        savePolygon(data).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功')
            // 重新渲染
            this.delAllOverlays('polygon')
            this.renderPolygon()
          } else {
            this.$message.error('添加失败')
          }
        })
      });
    },
    // 编辑多变形
    Editor(polygon, id) {
      this.map.setDefaultCursor('crosshair');
      let polyEditor = new AMap.PolyEditor(this.map, polygon);
      this.polyEditor = polyEditor;
      this.polyEditor.setTarget(polygon);

      polyEditor.open();
      this.editStatus = true;

      /* 编辑结束触发 */
      polyEditor.on('end', (event) => {
        this.map.setDefaultCursor('default');
        // event.target 即为编辑后的多边形对象
        console.log(event.target.getPath());
        const arr = event.target.getPath();
        if (arr.length < 3) return
        const newArr = []
        arr.forEach((item) => {
          const lng = item.lng;
          const lat = item.lat;
          const arrItem = [lng, lat]
          newArr.push(arrItem)
        });

        const data = {
          id,
          coord: JSON.stringify(newArr)
        }
        savePolygon(data).then(res => {
          if (res.code === 200) {
            this.$message.success('编辑成功')
            // 重新渲染
            this.delAllOverlays('polygon')
            this.renderPolygon()
          } else {
            this.$message.error('编辑失败')
          }
        })
      });
    },
    // 结束编辑
    editClose() {
      this.polyEditor.close();
      this.drawer = false;
      this.editStatus = false;
    },

    /* 初始化轨迹 */
    drawPolyline() {
      // 方案一
      const lineArr = this.animationPolyline()
      // 小车
      this.carMarker = new AMap.Marker({
        map: this.map,
        position: lineArr[0],
        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
        offset: new AMap.Pixel(-13, -26),
      });

      this.carMarker.on('moving', (e) => {
        // 移动端适合开启
        this.map.setCenter(e.target.getPosition(), true)
      });

      // 起点
      new AMap.Marker({
        map: this.map,
        position: this.lineArr2[0],
        icon: new AMap.Icon({
          image: require('@/assets/images/home/origin.png'),
          size: new AMap.Size(35, 35),
          imageSize: new AMap.Size(35, 35), //图标大小
        }),
        offset: new AMap.Pixel(-17, -28),
      });

      this.timer = setInterval(() => {
        if (this.lineArr2.length === this.lineArr.length) {
          clearInterval(this.timer)
          this.timer = null;
          return
        }
        // 避坑 数组【length】比索引大1
        this.lineArr2.push(this.lineArr[this.lineArr2.length])
        this.initPolyline()
        this.startAnimation()
      }, 1000);
    },
    // 车辆的动画轨迹
    animationPolyline() {
      let lineArr;
      if (this.lineArr2.length > 2) {
        lineArr = this.lineArr2.slice(this.lineArr2.length - 2)
      } else {
        // 深拷贝
        lineArr = JSON.parse(JSON.stringify(this.lineArr2));
      }
      return lineArr
    },
    // 开启动画
    startAnimation() {
      const lineArr = this.animationPolyline();
      this.carMarker.moveAlong(lineArr, {
        // 每一段的时长
        duration: 1000,//可根据实际采集时间间隔设置
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
      });
    },
    // 绘制轨迹
    initPolyline() {
      // 绘制轨迹
      this.polyline = new AMap.Polyline({
        map: this.map,
        path: this.lineArr2,
        showDir: true,
        strokeColor: "#28F",  //线颜色
        strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        strokeStyle: "solid"  //线样式
      });

      // 终点
      if (this.lineArr2.length === this.lineArr.length) {
        new AMap.Marker({
          map: this.map,
          position: this.lineArr[this.lineArr.length - 1],
          icon: new AMap.Icon({
            image: require('@/assets/images/home/terminus.png'),
            size: new AMap.Size(35, 35),
            imageSize: new AMap.Size(35, 35), //图标大小
          }),
          offset: new AMap.Pixel(-18, -30),
        });
      }
    },

    /* 处理分辨率改变 */
    changeIndex(index) {
      this.currentIndex = index;
    },
    /* 处理分页改变 */
    changeIndex2(val) {
      this.currentIndex2 = val;
    },
    setVideo(list) {
      if (list.length > 0) {
        let ref = 'video0';
        this.$nextTick(() => {
          this.$refs[ref].createPlayer(
            // item.cameraUrl + item.mainStreamUrl, 
            list[0].cameraUrl + list[0].subStreamUrl,
            true,
            0
          );
        })
      }
    },
  },
};
</script>

<style lang="less" scoped>
.amap-page-container {
  position: relative;
}

.amap-demo {
  position: relative;
  transform: translateY(110px);
  width: 1178px;
  height: 663px;
  border-radius: 8px;
}
/* dialog编辑图片 */
.image {
  position: relative;
  width: 100%;
  height: 800px;

  cursor: pointer;
  .el-image {
    width: 100%;
    height: 100%;
  }
  img {
    width: 100%;
  }
}
.el-image,
.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // background: #eee;
  background: linear-gradient(90deg, #0084b5 0%, #3de8e8 48%, #a8ffc5 100%);
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  color: #19adca;
}

.con {
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  bottom: -100px;
  right: 10px;

  padding: 15px 20px;
  width: 300px;
  background-color: #fff;
  border-radius: 12px;
  z-index: 9;
}

.monitoring-dialog::v-deep .el-dialog--center .el-dialog__body {
  height: 900px;
  padding-bottom: 60px;
  .monitoring {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.83);
    border-radius: 6px;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;

  .left {
    display: flex;
    align-items: center;
    img {
      margin-right: 8px;
    }

    .dpi {
      display: flex;
      align-items: center;
      .split {
        display: flex;
        align-items: center;
        span:first-child {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
        }
        span:last-child {
          margin-left: 11px;
          width: 2px;
          height: 20px;
          background-color: #30e9f8ff;
        }
      }
      ul {
        display: flex;
        align-items: center;
        margin: 0 !important;
        li {
          width: 42px;
          height: 30px;
          margin-left: 8px;
          text-align: center;
          line-height: 30px;
          border-radius: 15px;

          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          color: #fff;
          &.active {
            color: #000;
            background: linear-gradient(
              90deg,
              #0084b5 0%,
              #3de8e8 48%,
              #a8ffc5 100%
            );
          }
        }
      }
    }
  }

  .right {
    display: flex;
    > div:nth-child(1) {
      display: flex;
      align-items: center;
      div {
        font-size: 12px;
        color: #fff;
        font-weight: 500;
        margin-right: 12px;
      }
      span {
        margin-right: 15px;
        width: 2px;
        height: 20px;
        background-color: #30e9f8ff;
      }
    }

    ul {
      display: flex;
      transform: translateY(6px);
      li {
        width: 42px;
        height: 30px;
        margin-left: 8px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        font-weight: bold;
        color: #ffffff;
        border-radius: 15px;
        cursor: pointer;
        &.active {
          color: #000;
          background: linear-gradient(
            90deg,
            #0084b5 0%,
            #3de8e8 48%,
            #a8ffc5 100%
          );
        }
      }

      li:first-child {
        margin: 0 !important;
      }
    }

    > div:last-child {
      display: flex;
      align-items: center;
      margin-left: 15px;
      span:first-child {
        margin-right: 15px;
        width: 2px;
        height: 20px;
        background-color: #30e9f8ff;
      }

      div:nth-child(2) {
        display: flex;
        i {
          display: flex;
          justify-content: center;
          align-items: center;

          color: #fff;
          margin-right: 5px;
          width: 17px;
          height: 17px;
          &.active {
            color: #f56c6c;
          }
        }
        span {
          font-size: 12px;
          color: #fff;
          font-weight: 500;
          margin-right: 12px;
          &.active {
            color: #f56c6c;
          }
        }
      }
      img {
        margin-left: 8px;
      }
    }
  }
}

.con ::v-deep .el-button {
  width: 100%;
  transform: translate(2%);
}

.con ::v-deep .el-button:last-child {
  margin: 0;
  transform: translate(2%);
}

::v-deep .amap-info-content,
.amap-info-outer {
  border-radius: 8px;
}

/deep/ .amap-info-content,
.amap-info-outer {
  text-align: center;
  font-weight: 500;
}
/deep/ .amap-info-close {
  display: none;
}

/deep/ .amap-menu-outer {
  font-weight: 500;
  border-radius: 8px;
}
/deep/ ul.amap-menu-outer li:hover {
  background-color: #f3f3eed5;
  border-radius: 8px;
}

/deep/ .el-input__inner {
  color: #000 !important;
  background: #fff !important;
}
/deep/.el-input-number.is-controls-right .el-input-number__decrease {
  color: #000 !important;
}
/deep/ .el-input-number__increase {
  color: #000 !important;
}

/deep/.el-icon-arrow-up::after {
  content: '\e6e1' !important;
}
/deep/.amap-logo {
  display: none !important;
}
/deep/.amap-copyright {
  display: none !important;
}
::v-deep .bottom-center .amap-info-sharp,
.bottom-center .amap-info-sharp:after {
  display: none;
}
</style>
