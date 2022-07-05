import request from '@/utils/request'
// 登录--接口
export function login (data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// 登录--获取用户基本资料
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

// 用户--获取用户信息
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
