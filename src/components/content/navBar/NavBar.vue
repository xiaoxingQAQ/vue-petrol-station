<template>
  <div class="nav">
    <!-- user -->
    <el-dropdown
      class="avatar-container right-menu-item hover-effect"
      trigger="click"
    >
      <div class="user-container">
        <div class="left">
          <span class="avatar-wrapper">
            <img :src="avatar" />
          </span>
        </div>
        <div class="right">
          <span>{{ userName }}</span>
          <span>{{ nickName }}</span>
        </div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item divided @click.native="logout">
          <span class="logout-exit">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 导航 -->
    <div class="nav_container">
      <!-- 控制导航区 -->
      <div class="control_container">
        <div class="control">
          <div @click="$router.go(-1)">
            <i
              style="transform: translateY(-1px)"
              class="iconfont icon-fanhui1 refresh"
            ></i>
          </div>
          <div @click="refresh" v-show="false">
            <i class="iconfont icon-shuaxin refresh"></i>
          </div>
          <div>
            <span>在线用户：</span>
            <span>{{ onlineUser }}</span>
          </div>
        </div>

        <div class="image">
          <img
            v-if="$route.path != '/index'"
            src="@/assets/images/home/title.png"
            alt=""
          />
        </div>
      </div>
      <!-- 菜单导航区 -->
      <div class="memu_container">
        <ul>
          <el-tooltip
            v-for="(item, index) in menuList"
            :key="item.id"
            class="item"
            effect="dark"
            :content="item.title"
            placement="bottom-start"
          >
            <li @click="onChange(item.id)">
              <i
                :class="[
                  'iconfont',
                  item.icon,
                  { active_i: currentIndex == index },
                ]"
              ></i>
            </li>
          </el-tooltip>
          <div :class="['block', setClass()]"></div>
        </ul>
        <div>
          <el-checkbox v-model="isPopup" style="transform: translateY(1px)"
            >弹窗预警</el-checkbox
          >

          <el-tooltip
            class="item"
            effect="dark"
            content="后台管理"
            placement="bottom-start"
          >
            <div @click="$notify.info('没有权限')" v-if="roleKey == 'duty'">
              <i class="iconfont icon-shezhi"></i>
            </div>
            <a v-else :href="urlStr">
              <div>
                <i class="iconfont icon-shezhi"></i>
              </div>
            </a>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getSelectPerson } from "@/api/analyse/analyse"
export default {
  data() {
    return {
      url: 'http://36.138.4.104:9220/index?token=',
      isPopup: false, // 是否弹窗预警
      nickName: null,
      userName: null,
      avatar: null, // 用户头像

      currentIndex: 0,
      menuList: [
        { id: 0, title: '值班界面', icon: 'icon-zhiban' },
        { id: 1, title: '监控中心', icon: 'icon-jiankongzhongxin' },
        { id: 2, title: '名单布控', icon: 'icon-renyuanmingdan' },
        { id: 3, title: '数据管理', icon: 'icon-shujuguanli1' },
      ],
      onlineUser: '' // 在线用户
    };
  },
  computed: {
    ...mapGetters(['token', 'info']),
    urlStr() {
      return this.url + this.token
    },
    roleKey() {
      return this.info.user.roles[0].roleKey
    },
  },
  watch: {
    /* 监听改变 是否弹框 */
    isPopup(val) {
      this.$bus.$emit('isPopup', val)
    },
  },
  created() {
    this.selected();
    this.avatar = this.$store.getters.info.user.avatar;
    this.nickName = this.$store.getters.info.user.nickName;
    this.userName = this.$store.getters.info.user.userName;
    getSelectPerson().then(res => {
      this.onlineUser = res.data
    })
  },
  mounted() {
    // 是否弹框
    this.$bus.$emit('isPopup', this.isPopup)

    this.name = this.$store.getters.name;
    console.log('this.$store.getters: ', this.$store.getters);
  },
  methods: {
    setClass() {
      switch (this.currentIndex) {
        case 0:
          return 'active'
        case 1:
          return 'active2'
        case 2:
          return 'active3'
        case 3:
          return 'active4'
      }
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index';
          });
        })
        .catch(() => { });
    },
    onChange(index) {
      this.currentIndex = index;
      const path = this.$route.path;
      switch (index) {
        case 0:
          if (path == '/index') return;
          this.$router.push('/index');
          break;
        case 1:
          if (path == '/monitoring') return;
          this.$router.push('/monitoring');
          break;
        case 2:
          if (path == '/control') return;
          this.$router.push('/control');
          break;
        case 3:
          if (path == '/analyse') return;
          this.$router.push('/analyse');
          break;
      }
    },
    selected() {
      let path = this.$route.path;
      let index = '/index';
      let monitoring = '/monitoring';
      let control = '/control';
      let analyse = '/analyse';

      switch (path) {
        case index:
          this.currentIndex = 0;
          break;
        case monitoring:
          this.currentIndex = 1;
          break;
        case control:
          this.currentIndex = 2;
          break;
        case analyse:
          this.currentIndex = 3;
          break;
      }
    },
    /* 处理刷新 */
    refresh() { },
  },
};
</script>

<style lang="less" scoped>
.nav {
  display: flex;
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  background-color: #090909;

  // user
  .user-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 176px;
    height: 100%;
    padding-left: 10px;
    background: #090909;

    .el-dropdown {
      display: flex;
    }

    .left {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      span {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #cacccc;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      position: absolute;
      top: -5px;
      left: 50px;
      width: 80px;
      // transform: translate(60%, -80%);
      box-sizing: border-box;
      span {
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #cacccc;
      }

      span:first-child {
        font-size: 12px !important;
      }
    }
  }
  // 导航
  .nav_container {
    display: flex;
    width: 1744px;
    background: #181818;
    opacity: 1;

    // 控制区
    .control_container {
      display: flex;
      width: 1328px;
      height: 64px;

      .control {
        display: flex;
        align-items: center;
        width: 230px;

        div:nth-child(1),
        div:nth-child(2),
        div:nth-child(3) {
          margin-left: 24px;
          cursor: pointer;
        }
        div:nth-child(1),
        div:nth-child(2) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          height: 20px;
          i {
            font-size: 20px;
            color: #fff;
          }
        }
        .refresh:hover {
          color: #6fe9ce;
        }

        div:nth-child(3) {
          border: 1px solid transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          padding: 0 10px;
          width: 118px;
          height: 30px;

          border-radius: 4px;
          color: #cacccc;
          background: #4a4a4a;
          opacity: 1;
          span {
            font-size: 12px;
            font-weight: 500;
          }
        }
      }

      .image {
        width: 1070px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 37%;
        }
      }
    }

    // 菜单导航区
    .memu_container {
      display: flex;
      width: 480px;
      height: 64px;
      ul {
        display: flex;
        margin-right: 8px;
        position: relative;
      }
      li {
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 64px;
        height: 64px;
        cursor: pointer;
        transition: all 500ms;

        i {
          position: relative;
          z-index: 2;
          font-size: 22px;
          color: #fff;
          transition: all 500ms;

          &.active_i {
            color: #6fe9ce !important;
          }
        }
      }
      ul .block {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 64px;
        height: 64px;
        background: #4a4a4a;
        border-radius: 0 0 13px 13px;
        transition: all 500ms;
        &.active {
          width: 64px;
          height: 64px;
          border-radius: 0 0 13px 13px;
        }
        &.active2 {
          transform: translateX(64px);
          border-radius: 0 0 13px 13px;
        }
        &.active3 {
          transform: translateX(64px * 2);
          border-radius: 0 0 13px 13px;
        }
        &.active4 {
          transform: translateX(64px * 3);
          border-radius: 0 0 13px 13px;
        }
      }

      > div {
        width: 160px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 13px;
          width: 20px;
          height: 20px;
          cursor: pointer;
          i {
            font-size: 22px;
            color: #fff;
          }
        }
      }
    }
  }
}
.el-dropdown-menu__item--divided:before {
  height: 0;
  display: block;
  margin: 0 0;
  background-color: #fff;
}
.logout-exit {
  color: #cacccc;
}

::v-deep .el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: transparent;
}

::v-deep .logout-exit:hover {
  color: #66b1ff;
}
</style>
