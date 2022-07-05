import Layout from '@/layout'
// 导出公司设置的路由规则
export default {
  name: 'setting',
  path: '/setting',
  component: Layout,
  children: [
    {
      path: '', // 定义为空,因为表示默认路由为该路由,当跳转到/employees也会出现二级路由
      component: () => import('@/views/setting'),
      // meta属性随意定义,此处是因为左侧导航会肚子meta里面的title遍历拿到
      meta: {
        title: '公司设置',
        icon: 'setting'

      }
    }
  ]
}
