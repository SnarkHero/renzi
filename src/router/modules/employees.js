import Layout from '@/layout'
// 导出员工的路由规则
export default {
  name: 'employees',
  path: '/employees',
  component: Layout,
  children: [
    {
      name: 'employees',
      path: '', // 定义为空,因为表示默认路由为该路由,当跳转到/employees也会出现二级路由
      component: () => import('@/views/employees'),
      // meta属性随意定义,此处是因为左侧导航会肚子meta里面的title遍历拿到
      meta: {
        title: '员工管理',
        icon: 'people'

      }
    },
    {
      path: 'detail/:id', // 定义为空,因为表示默认路由为该路由,当跳转到/employees也会出现二级路由
      component: () => import('@/views/employees/detail'),
      hidden: true,
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id', // 定义为空,因为表示默认路由为该路由,当跳转到/employees也会出现二级路由
      component: () => import('@/views/employees/print'),
      hidden: true,
      meta: {
        title: '打印'
      }
    }
  ]
}
