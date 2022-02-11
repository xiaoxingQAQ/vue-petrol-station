'use strict'

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const port = process.env.port || process.env.npm_config_port || 80 // 端口
const name = process.env.VUE_APP_TITLE || '加油站云平台' // 网页标题

module.exports = {
  // px2rem
  css: {
    extract: false, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [   //配置px转rem进行适配
          require('postcss-px2rem')({
            // 根标签字号大小根据设计稿宽度/flexible.js里的份数得到，这里假定设计稿宽度为3840 3840/24 = 160px
            remUnit: 80
          }),
        ]
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_PROXY_API]: {
        // target: `http://192.168.124.37:9211`,
        target: `http://139.159.213.75:9211`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
    disableHostCheck: true
  },
  // 高德地图
  configureWebpack(config) {
    // ...
    config.externals = {
      'AMap': 'AMap' // 高德地图配置
    }
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
}