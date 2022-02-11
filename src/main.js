import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
import './permission' // permission control
// 引入flexible 
import '@/utils/flexible'
// 引入normalize
import './assets/css/normalize.css'
// 公共css文件
import './assets/css/common.css'
// 引入iconfont
import './assets/css/iconfont.css'
// 引入element-ui
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css';
// 引入ant-design
import './plugins/ant-design.js'
import 'ant-design-vue/dist/antd.css'
// 引入 ECharts
import echarts from '@/plugins/echarts'
// 引入西瓜视频播放器
import Player from 'xgplayer'
// 引入lodash
import _ from 'lodash';

Vue.use(Player)

// 全局挂载
Vue.prototype.$bus = new Vue()
Vue.prototype.$echarts = echarts
Vue.prototype._ = _
Vue.prototype.isJSON = function isJSON(str) {
  return new Promise((resolve, reject) => {
    try {
      if (typeof JSON.parse(str) == "object") {
        resolve(true)
        return true;
      }
    } catch (e) {
    }
    reject(false)
    return false;
  })
}

Vue.config.ignoredElements = [
  'webrtc-streamer'
]

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
