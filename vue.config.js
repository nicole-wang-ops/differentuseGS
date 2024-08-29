const { defineConfig } = require('@vue/cli-service')
//测试原来的
// module.exports = defineConfig({
//   transpileDependencies: true
// })

//github仓库名
module.exports={
  publicPath:process.env.NODE_ENV === 'production'
  ?'/testdiuG/'
  :'/'
}

//测试http-server的
// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//     ? '/'
//     : '/'
// }

