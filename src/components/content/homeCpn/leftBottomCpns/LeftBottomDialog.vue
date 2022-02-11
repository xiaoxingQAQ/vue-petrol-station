<template>
  <el-dialog
    :title="stationObj ? stationObj.dataResTitle.name : ''"
    :visible="visible"
    top="5%"
    width="70%"
    :before-close="resetCancel"
  >
    <el-row type="flex" justify="space-between">
      <el-col
        :span="8"
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        "
      >
        <el-row style="width: 100%; height: 38%; background: #213447">
          <div class="marketClass textTitle">
            <div style="position: relative">
              今日销售数据
              <el-button
                v-if="marketing"
                @click="marketingEdit"
                style="position: absolute; right: 10px"
                size="mini"
                type="primary"
                >编辑</el-button
              >
              <el-button
                v-if="!marketing"
                @click="marketingCancel"
                style="position: absolute; right: 100px"
                size="mini"
                type="danger"
                >取消</el-button
              >
              <el-button
                v-if="!marketing"
                @click="marketingComfig"
                style="position: absolute; right: 10px"
                size="mini"
                type="primary"
                >保存</el-button
              >
            </div>
            <div class="business textTitle">
              <div>
                <div class="textClass">营业额</div>
                <div v-if="marketing" class="numClass">{{ todayMarketing.turnover | standardNum }}</div>
                <el-input v-model="todayMarketing.turnover" size="mini" v-else></el-input>
              </div>
              <div>
                <div class="textClass">客单量</div>
                <div v-if="marketing" class="numClass">{{ todayMarketing.upt | standardNum }}</div>
                <el-input v-model="todayMarketing.upt" size="mini" v-else></el-input>
              </div>
              <div>
                <div class="textClass">加油量</div>
                <div v-if="marketing" class="numClass">{{ todayMarketing.fuelCharge | standardNum }}</div>
                <el-input v-model="todayMarketing.fuelCharge" size="mini" v-else></el-input>
              </div>
              <div>
                <div style="color:#FF6161;text-align:center">客单价</div>
                <div class="numClass">{{ perCustomer }}</div>
              </div>
            </div>
          </div>
          </el-row>
          <el-row style="width:100%;height:60%;overflow-y:auto;background:#213447;">
            <div class="marketClass textTitle" style="position: relative;">
              油罐实时状态
              <el-button @click="oilTankAdd" style="position: absolute;right: 10px;" size="mini" type="primary">添加</el-button>
            </div>
            <div style="display:flex;flex-wrap:wrap">
              <div class="oilTankClass" v-for="(item, index) in oilTank" :key="index">
                <img @dblclick="handleDblclick(item)" style="width: 65px;margin:0 5px;cursor: pointer;" src="@/assets/images/oilTank.png" alt="">
                <div style="display:flex;flex-direction:column;align-self:center;flex:1">
                  <span class="textData">编号：{{ item.num }}</span>
                  <span class="textData">储油：{{ item.oilType }}</span>
                  <span class="textData">体积：{{ item.volume }}</span>
                  <span class="textData">温度：{{ item.temperature }}</span>
                  <span class="textData">液位：{{ item.liquid }}</span>
                </div>
                <el-popconfirm
                  title="确定要删除这个油罐状态吗？"
                  @confirm="handleStatusConfirm(item)"
                  @cancel="handleStatusCancel"
                >
                  <i class="el-icon-close" slot="reference" style="color:#fff;cursor: pointer;"></i>
                </el-popconfirm>
              </div>
            </div>
          </el-row>
      </el-col>
      <el-col :span="4" style="margin:0 10px">
          <div class="warpReport" style="height: 640px">
            <div class="titleClass">
              今日告警
            </div>
            <ul class="ulClass">
              <li v-for="it in reportArr" :key="it.name">
                  <div style=""><div class="circle"></div></div>
                  <div style=""><span>{{ it.name }}</span></div>
                  <div style="" class="textClass">{{ it.name === '人脸抓拍' ?  0 : it.count }}</div>
              </li>
            </ul>
          </div>
      </el-col>
      <el-col :span="12">
        <el-row class="echartClass">
          <StreamEcharts
            :orgIdEchar="stationObj ? stationObj.dataResTitle.orgId : ''"
          />
        </el-row>
        <el-row class="echartClass">
          <StoreEcharts
            :orgIdEchar="stationObj ? stationObj.dataResTitle.orgId : ''"
          />
        </el-row>
        <button class="vehiclesCls" type="primary" plain @click="getVehicles">
          详情
        </button>
      </el-col>
    </el-row>
    <div class="positincImage">
      <img src="@/assets/images/home/map-gas-full.svg" alt="" />
    </div>
    <AddTankState @addTankState="addTankState" ref="updateForm" />
  </el-dialog>
</template>

<script>
// '12345678912345678'.replace(/\B(?=(?:\d{3})+\b)/g, ',')
import StreamEcharts from '@/components/content/homeCpn/leftBottomCpns/StreamEcharts'
import StoreEcharts from '@/components/content/homeCpn/leftBottomCpns/StoreEcharts'
import AddTankState from '@/components/content/homeCpn/leftBottomCpns/AddTankState'
import {
  getOilOmeterSelect, getOilOmeterSave, getOilOmeterDelete,
  getMarketingSelect, getMarketingSave, getSelectByOrg
} from '@/api/oilStation'
export default {
  props: ['visible', 'stationObj', 'orgId'],
  components: {
    StreamEcharts,
    StoreEcharts,
    AddTankState
  },
  filters: {
    standardNum(val) {
      if (val) {
        let str = +val
        return str.toFixed(2).replace(/\B(?=(?:\d{3})+\b)/g, ',')
      } else {
        return val
      }
    },
  },
  data() {
    return {
      // 油罐数据
      oilTank: [],
      marketing: true, // 今日营销是否可修改状态
      todayMarketing: {
        id: '',
        orgId: '',
        turnover: '', //营销额
        upt: '', //客单量
        fuelCharge: '', // 加油量
      },
      // turnover: '282063.35', //营销额
      // guestOrders: '1673.00', //客单量
      // fuelCharge: '66925.00', // 加油量
      perCustomer: '', // 客单价
      reportArr: [], // 今日告警数据
    }
  },
  created() {
    
  },
  mounted() {

  },
  watch: {
    orgId() {
      this.handleOpen()
    }
  },
  methods: {
    async handleOpen() {
      await this.getSelectByOrg()
      await this.getMarketingSelect()
      await this.getOilOmeterSelect()
    },
    // 今日营销 编辑
    marketingEdit() {
      this.marketing = false
    },
    // 今日营销 保存
    marketingComfig() {
      this.marketing = true
      this.todayMarketing.orgId = this.stationObj.dataResTitle.orgId
      getMarketingSave(this.todayMarketing).then(res => {
        this.getMarketingSelect()
        this.$bus.$emit('turnoverOn')
        this.$notify.success('保存成功')
      })
    },
    // 今日营销 取消
    marketingCancel() {
      this.marketing = true
  
    },
    resetCancel() {
      this.$emit('resetCancel')
    },
    // 查看进站车辆详情车辆
    getVehicles() {
      this.$emit('getVehicles')
    },
    // 编辑
    handleDblclick(data) {
      this.$refs.updateForm.handleCreate(data)
    },
    // 添加
    oilTankAdd() {
      console.log(this.stationObj)
      this.$refs.updateForm.handleCreate()
    },
    // 点击油罐状态 删除确定
    handleStatusConfirm(data) {
      getOilOmeterDelete({ id: data.id }).then(res => {
        this.$notify.success('删除成功')
        this.getOilOmeterSelect()
      })
    },
    // 点击油罐状态 删除  取消
    handleStatusCancel() {

    },
    // 添加或修改油罐状态
    addTankState(data) {
      const params = {
        id: data.id,
        orgId: this.stationObj.dataResTitle.orgId,
        oilType: data.oilStorage2,
        volume: data.volume2,
        temperature: data.temperature2,
        liquid: data.liquid2,
        num: data.numStr
      }
      if (params.id) {
        getOilOmeterSave(params).then(res => {
          this.$notify.success('修改成功')
          this.getOilOmeterSelect()
        })
      } else {
        getOilOmeterSave(params).then(res => {
          this.$notify.success('添加成功')
          this.getOilOmeterSelect()
        })
      }
    },
    // 查询油罐数据
    getOilOmeterSelect() {
      getOilOmeterSelect({ orgId: this.stationObj.dataResTitle.orgId }).then(res => {
        this.oilTank = res.rows
      })
    },
    // 查看今日营销数据
    getMarketingSelect() {
      getMarketingSelect({ orgId: this.stationObj.dataResTitle.orgId }).then(res => {
        if (res.data) {
          this.todayMarketing = {
            id: res.data[0].id,
            orgId: res.data[0].orgId,
            turnover: res.data[0].turnover,
            upt: res.data[0].upt,
            fuelCharge: res.data[0].fuelCharge
          }
          this.perCustomer = (+this.todayMarketing.turnover / +this.todayMarketing.upt).toFixed(2)
        } else {
          this.todayMarketing = {
            id: '',
            orgId: '',
            turnover: 0,
            upt: 0,
            fuelCharge: 0
          }
          this.perCustomer = 0
        }
      }).catch(() => {
        this.todayMarketing = {
          id: '',
          orgId: '',
          turnover: 0,
          upt: 0,
          fuelCharge: 0
        }
        this.perCustomer = 0
      })
    },
    // 查看今日告警数据
    getSelectByOrg() {
      getSelectByOrg({ orgId: this.stationObj.dataResTitle.orgId }).then(res => {
        this.reportArr = res.data
      })
    },
  }
}
</script>

<style lang="less" scoped>
// 今日销售数据
.marketClass {
  color: #54ffbb;
  text-align: center;
  margin: 20px 0 0 0;
}
.business {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  height: 72%;
  > div {
    width: 50%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
.textClass {
  color: #ff6161;
  text-align: center;
}
.numClass {
  color: #54ffbb;
  text-align: center;
}
.circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8effea;
}
.positincImage {
  position: absolute;
  top: 19px;
  left: 20px;
}
.textData {
  color: #fff;
  font-size: 12px;
}
.textTitle {
  font-size: 16px;
  font-weight: 600;
}
.vehiclesCls {
  position: absolute;
  top: 15px;
  right: 8px;
  font-size: 10px;
  color: #fff;
  background: #1890ff;
  border: none;
  cursor: pointer;
}
.oilTankClass {
  display: flex;
  // justify-content:space-around;
  width: 47%;
  margin-top: 40px;
  // border:1px solid #ccc;
  position: relative;
  overflow-x: auto;
  margin-left: 7px;
  i {
    position: absolute;
    right: 0;
    font-size: 18px;
  }
}
.warpReport {
  width: 100%;
  height: 100%;
  background: #213447;
  .titleClass {
    color: #54FFBB;
    text-align: center;
    padding-top: 20px;
    font-size: 16px;
    font-weight: 600
  }
  .ulClass {
    li {
      display:flex;
      justify-content:center;
      align-items:center;
      margin-top:10px;
      :nth-child(1) {
        width:20%;
        text-align:center
      }
      :nth-child(2) {
        width:40%;
        color:#8EFFEA;
        text-align:center
      }
      :nth-child(3) {
        width:20%;
        text-align:center
      }
    }
  }
}
.echartClass {
  width: 100%; 
  height: 50%; 
  background: #213447
}
/deep/.el-dialog__title {
  color: #6fe9ce !important;
  margin-left: 30px;
}
/deep/.el-dialog__body {
  padding: 20px 20px;
}
</style>