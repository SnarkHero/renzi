// 引入路由router 做权限拦截
import router from '@/router/index'
// 引入vuex store 实例 等同于this.$store
import store from '@/store/index'
// 创建白名单,跳转进里面不需要权限token
const whiteList = ['/login', '/404']
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// 路由的前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start() // 开启进度条
  // 判断是否有token
  if (store.getters.token) {
    // 有token时,需要主动跳转到主页时,需要调到主页
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        // 必须先把异步的获取用户资料变成同步的,否则就会先放行,应该获取资料后放行
        await store.dispatch('user/getUserInfo')
      }
      // 直接放行
      next()
    }
    // 没有token时
  } else {
    // 判断是否跳转到白名单里面的页面,如果是则返回索引大于-1
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      // 跳转登录
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭进度条  为了解决手动切换地址时 进度条不关闭的情况
})

// 后置守卫
router.afterEach(function () {
  NProgress.done() // 关闭进度条
})
