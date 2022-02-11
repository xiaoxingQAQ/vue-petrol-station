const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  // 去掉console.log
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      'plugins': ['dynamic-import-node']
    },
    // 发布产品时候的插件
    'production': {
      'plugins': [
        ...prodPlugins,
        "@babel/plugin-syntax-dynamic-import"
      ]
    }
  },
  plugins: [
    [
      "component",
      { "libraryName": "element-ui", "styleLibraryName": "theme-chalk" }
    ],
    [
      "import",
      { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }
    ],
  ],
}
