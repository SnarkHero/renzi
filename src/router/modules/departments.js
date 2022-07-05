import Layout from '@/layout'
// 导出组织架构的路由规则
export default {
  name: 'departments',
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '', // 定义为空,因为表示默认路由为该路由,当跳转到/employees也会出现二级路由
      component: () => import('@/views/departments'),
      // meta属性随意定义,此处是因为左侧导航会肚子meta里面的title遍历拿到
      meta: {
        title: '组织架构',
        icon: 'tree'

      }
    }
  ]
}
