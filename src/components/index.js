// 这里负责所有公共组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'

export default {
  // install里面的形参是vue全局对象
  install (Vue) {
    // 在Vue中全局注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
  }
}
// 注册后再在main.js中引入
