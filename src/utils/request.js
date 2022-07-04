import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create({
  // 如果执行 npm run dev 根地址为根目录.env.development文件里面的 VUE_APP_BASE_API(/api) 然后根据vue.config.js把/api代理给一个地址
  // 如果执行 npm run build 值为 /prod-api  跟前端没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
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
  // 提示错误消息
  Message.error(error.message)
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.request.use()
// 导出service
export default service
