import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index'
import router from '@/router/index'
import { getTimeStamp } from '@/utils/auth'
const TimeOut = 3600 // 定义超时时间
const service = axios.create({
  // 如果执行 npm run dev 根地址为根目录.env.development文件里面的 VUE_APP_BASE_API(/api) 然后根据vue.config.js把/api代理给一个地址
  // 如果执行 npm run build 值为 /prod-api  跟前端没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 成功后把值拿来解析,axios包了层data 所以数据为response.data
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    // 提示错误消息
    Message.error(message)
    // 业务错了,但是数据请求成功不能进then,所以再次写了也promise对象进reject(里面为new一个对象)
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 清除token跟用户信息,vuex里的user模块
    store.dispatch('user/logout')
    // 跳转到登录页
    router.push('/login')
  } else {
    // 提示错误消息
    Message.error(error.message)
  }
  return Promise.reject(error)
})

// 请求拦截器
service.interceptors.request.use(config => {
  // 如果有token,统一请求注入token
  if (store.getters.token) {
    if (IsCheckTimeOut()) {
      // 清除token跟用户信息,vuex里的user模块
      store.dispatch('user/logout')
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须返回请求信息,否则请求无法出去无法发出请求
  return config
}, error => {
  // 提示错误消息
  Message.error(error.message)
  return Promise.reject(error)
})
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
function IsCheckTimeOut () {
  var currentTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currentTime - timeStamp) / 1000 > TimeOut
}
// 导出service
export default service
