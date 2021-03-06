// 这里负责所有公共组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull/index.vue'
import ThemePicker from './ThemePicker'
import Long from './lang'
import TagsView from './TagsView'

export default {
  // install里面的形参是vue全局对象
  install (Vue) {
    // 在Vue中全局注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.use(Print)
    Vue.component('ScreenFull', ScreenFull)
    Vue.component('ThemePicker', ThemePicker)
    Vue.component('Long', Long)
    Vue.component('TagsView', TagsView)
  }
}
// 注册后再在main.js中引入
