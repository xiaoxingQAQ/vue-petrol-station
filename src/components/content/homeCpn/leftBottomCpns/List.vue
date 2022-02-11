<template>
  <div class="app_container">
    <ul>
      <!-- 油站数据 -->
      <li v-for="item in list" :key="item.orgId" @click="goDetail(item)">
        <div class="header">
          <div>{{ item.name }}</div>
          <!-- 绩效分 -->
          <div>
            <span>综合评分</span>
            <span>{{ item.score }}</span>
          </div>
        </div>
        <div class="main">
          <div class="left">
            <div class="li">
              <i></i>
              <span>今日告警</span>
              <b>{{ item.allCount ? item.allCount : 0 }}</b>
            </div>
            <div class="li">
              <i></i>
              <span>客户统计</span>
              <b>{{ item.customerNum ? item.customerNum : 0 }}</b>
            </div>
            <div class="li">
              <i></i>
              <span>店长出勤</span>
              <b>不在岗</b>
            </div>
          </div>
          <div class="right"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getStationList } from '@/api/home/home';
import { getSelectByOrg } from '@/api/oilStation'

export default {
  props: {},
  data() {
    return {
      list: [],
      listClone: [],
      stationObj: {}
    };
  },
  watch: {
    list: {
      handler() {
        setTimeout(() => {
          this.$emit('refresh');
        }, 0);
      },
      deep: true,
    },
  },
  created() {
    this.getStationList();
  },
  mounted() {
    this.handleQuery();
  },
  methods: {
    /* 网络请求区域 */
    async getStationList(StationName) {
      const res = await getStationList({ StationName })
      if (res.code === 200) {
        this.list = res.data;
        this.listClone = res.data;
        const customerNum = this.list.map(it => {
          if (it.customerNum) {
            return it.customerNum
          } else {
            return 0
          }
        })
        const allCount = this.list.map(it => {
          if (it.allCount) {
            return it.allCount
          } else {
            return 0
          }
        })
        const num = customerNum.reduce((a, b) => {
          return parseInt(a) + parseInt(b)
        }, 0)
        const count = allCount.reduce((a, b) => {
          return parseInt(a) + parseInt(b)
        }, 0)
        this.$bus.$emit('customerNumOn', num, count)
      }
    },
    // 自定义事件 本地筛选
    handleQuery() {
      this.$bus.$on('handleQuery', (stationName) => {
        if (!stationName) return this.list = [...this.listClone];
        this.list = [...this.listClone];
        /* 判断选中的值是否有children属性 */
        this.list = this.list.filter(item => {
          return item.name == stationName;
        })

        console.log('this.list', this.list);
      });
    },
    async goDetail(item) {
      this.stationObj.dataResTitle = item
      this.$bus.$emit('showDialog', this.stationObj)
    }
  }
}
</script>

<style lang="less" scoped>
.app_container {
  transform: translateX(12px);
}
ul {
  width: 600px;
  li {
    box-sizing: border-box;
    margin-bottom: 5px;
    padding: 14px 13px;
    width: 283px;
    height: 130px;
    background: rgba(66, 81, 100, 0.92);
    border: 1px solid #6eb5de;
    box-shadow: 1px 1px 8px rgba(33, 179, 255, 0.67);

    border-radius: 4px;
    transition: 0.3s;
    cursor: pointer;

    .header {
      display: flex;
      justify-content: space-between;
      div:first-child {
        font-size: 14px;
        color: #6fe9ce;
        font-weight: 500;
      }

      div:last-child {
        span {
          font-size: 12px;
          font-weight: 500;
          color: #b6f0fc;
        }

        span:first-child {
          margin-right: 16px;
        }
      }
    }

    .main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-right: 10px;

      .left {
        display: flex;
        flex-direction: column;
        .li {
          display: flex;
          height: 17px;
          align-items: center;
          margin-top: 10px;
          i {
            width: 8px;
            height: 8px;
            border-radius: 50%;
          }

          span {
            color: #b6f0fc;
          }

          span,
          b {
            margin-left: 14px;
            font-size: 12px;
            font-weight: 500;
            line-height: 17px;
          }
        }

        .li:nth-child(1) {
          i {
            background-color: #77c8ff;
          }

          b {
            color: #409eff;
          }
        }
        .li:nth-child(2) {
          i {
            // background-color: #ff5b5d;
            background-color: #dca936;
          }

          b {
            // color: #ff5b5d;
            color: #dca936;
          }
        }
        .li:nth-child(3) {
          i {
            background-color: #5feb84;
          }

          b {
            color: #5feb84;
          }
        }
      }
      .right {
        width: 13px;
        height: 13px;
        border-left: 2px solid #fff;
        border-bottom: 2px solid #fff;
        -webkit-transform: translate(0, -50%) rotate(-135deg);
        transform: translate(0, -50%) rotate(-135deg);
      }
    }
  }
}
</style>
