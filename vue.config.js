const path = require('path');
const resolve = dir => {
  return path.join(__dirname, dir);
};
module.exports = {
  publicPath: "./",
  assetsDir: "static",
  outputDir: 'dist',
  lintOnSave: false,

  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
      .set('_v', resolve('src/views'));
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/foo': {
        target: '<other_url>'
      }
    }
  }
};