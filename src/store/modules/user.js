import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 状态
const state = {
  token: getToken(),
  userInfo: {}// 需要定义一个对象,如果定义null的话getters中null.属性会报错,而{}.属性不会报错
}
// 修改状态
const mutations = {
  // 存储token
  setToken (state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 把获取的用户信息存储在state变量中
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo // 这也是响应式
    // 或者state.userInfo = {...userInfo}浅拷贝方法完成响应式
  },
  // 删除用户信息
  reomveUserInfo (state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 登录请求
  async login (contest, data) {
    const result = await login(data)
    // 登录成功请求setToken方法保存token到vuex
    contest.commit('setToken', result)
    // 保存登录时候的时间戳
    setTimeStamp()
  },
  // 获取用户信息
  async getUserInfo (contest) {
    const result = await getUserInfo()
    // 获取用户头像,因为信息列表中没有头像的地址,所以重新调用一个接口里面有图像然后再把两个值合并
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo }
    contest.commit('setUserInfo', baseResult)
    return result // 这里为什么要返回 为后期做权限埋下伏笔
  },
  // 退出登录
  logout (contest) {
    // 清除token
    contest.commit('removeToken')
    // 清除用户信息
    contest.commit('reomveUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
