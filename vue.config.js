const { defineConfig } = require('@vue/cli-service')
//测试原来的
// module.exports = defineConfig({
//   transpileDependencies: true
// })

//测试github的
module.exports={
  publicPath:process.env.NODE_ENV === 'production'
  ?'/differentuseGS/'
  :'/'
}

//测试http-server的
// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/'
//     : '/'
// }

