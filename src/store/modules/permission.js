import { constantRoutes } from '@/router/index'
const state = {
  routes: constantRoutes
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes (state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes]这样写不对
    // 有可能张三登录了获取动态路由追加到李四上
    // 所以每次都应该是更新
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {}
export default {
  state,
  mutations,
  actions
}
