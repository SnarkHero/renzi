import Vue from 'vue'
import Component from '@/components'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// import * as全部导出
import * as directives from '@/directives/index'
import * as filters from '@/filters' // 引入工具类
import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component)
// 全局注册自定义事件,遍历directives对象,Object.keys(遍历directives对象),得出来的值是[所有键名数组],再遍历数组,在遍历中完成注册自定义事件
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
Object.keys(filters).forEach(item => {
  // 注册过滤器
  Vue.filter(item, filters[item])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
