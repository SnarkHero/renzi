import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken()
}
// 修改状态
const mutations = {
  setToken (state, token) {
    state.token = token
    setToken(token)
  },
  removeToken (state, token) {
    state.token = null
    removeToken(token)
  }
}
// 执行异步
const actions = {
  // 登录请求
  async login (contest, data) {
    const result = await login(data)
    // 登录成功请求setToken方法保存token到vuex
    contest.commit('setToken', result)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
