import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}
// 设置时间戳
const timeKey = 'hrsaas-timestamp-key'
export function setTimeStamp () {
  return Cookies.set(timeKey, new Date().getTime())
}
// 获取时间戳
export function getTimeStamp () {
  return Cookies.get(timeKey)
}
