<template>
  <!-- 头部 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeNode :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <treeNode
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
        <AddDept
          ref="addDept"
          :show-dialog.sync="showDialog"
          :tree-node="node"
          @addDepts="getDepartments"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import AddDept from './components/add-dept' // 引入新增部门组件
import treeNode from './components/tree-tools'
import { tranListToTreeData } from '@/utils/index'
import { getDepartments } from '@/api/departments'
export default {
  components: {
    treeNode, AddDept
  },
  data () {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false, // 显示窗体
      node: {}// 添加到哪一个子组件下

    }
  },
  created () {
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      const res = await getDepartments()
      this.company = { name: res.companyName, manager: '负责人', id: '' }
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts (node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    // 编辑部门详情
    editDepts (node) {
      this.showDialog = true
      // 此处可以用同一个node,因为不能同时打开两个弹窗
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
