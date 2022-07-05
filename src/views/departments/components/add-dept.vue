<template>
  <div>
    <template>
      <!-- 新增部门的弹层 -->
      <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
        <!-- 表单组件  el-form   label-width设置label的宽度   -->
        <!-- 匿名插槽 -->
        <el-form
          ref="deptForm"
          label-width="120px"
          :model="formData"
          :rules="rules"
        >
          <el-form-item label="部门名称" prop="name">
            <el-input
              v-model="formData.name"
              style="width: 80%"
              placeholder="1-50个字符"
            />
          </el-form-item>
          <el-form-item label="部门编码" prop="code">
            <el-input
              v-model="formData.code"
              style="width: 80%"
              placeholder="1-50个字符"
            />
          </el-form-item>
          <el-form-item label="部门负责人" prop="manager">
            <el-select
              v-model="formData.manager"
              style="width: 80%"
              placeholder="请选择"
              @focus="getEmployeeSimple"
            ><el-option
              v-for="item in peoples"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
            </el-select>
          </el-form-item>
          <el-form-item label="部门介绍" prop="introduce">
            <el-input
              v-model="formData.introduce"
              style="width: 80%"
              placeholder="1-300个字符"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
        </el-form>
        <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
        <el-row slot="footer" type="flex" justify="center">
          <!-- 列被分为24 -->
          <el-col :span="6">
            <el-button
              type="primary"
              size="small"
              @click="btnOK"
            >确定</el-button>
            <el-button size="small" @click="btnCancel">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object, // 对象类型
      required: true // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    }
  },
  data () {
    const checkNameRepeat = async (rules, value, callback) => {
      const { depts } = await getDepartments()
      let isRepea = false
      if (this.formData.id) {
        // 如果有formData.id说明是编辑页面,校验规则不一样
        // 先找到所有相同子节点的值,再排除掉自己,确保修改信息的除了自己别的重复的值不能用
        isRepea = depts.filter(item => item.pid === this.formData.pid && item.id !== this.formData.id).some(item => item.name === value)
      } else {
        // 新增部门
        // filter过滤数组(此处为找到子节点下的所有符合要求的值)返回一个数组,some判断数组是否符合条件,返回布尔值
        isRepea = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepea ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    const checkCodeRepeat = async (rules, value, callback) => {
      const { depts } = await getDepartments()
      let isRepea = false
      if (this.formData.id) {
        // 如果有formData.id说明是编辑页面,校验规则不一样
        // 先排除自己,再在剩余的项里面找没有相同的
        isRepea = depts.filter(item => item.id !== this.formData.id).some(item => item.code === value && value)
      } else {
        // 新增部门
        // 要求编码和所有部门编码都不能重复,由于历史数据有可能没有code 所以加一个强制性条件value不为空
        isRepea = depts.some(item => item.code === value && value)
      }
      isRepea ? callback(new Error(`组织架构中已经有${value}的相同的code了`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        // 部门名称校验规则
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        // 部门编码校验规则
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCodeRepeat }
        ],
        // 部门管理者校验规则
        manager: [
          { required: true, message: '部门管理者不能为空', trigger: 'blur' }
        ],
        // 部门介绍校验规则
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-50个字符', trigger: 'blur' }
        ]
      },
      peoples: {}
    }
  },
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async getEmployeeSimple () {
      this.peoples = await getEmployeeSimple()
    },
    btnOK () {
      this.$refs.deptForm.validate(async isOK => {
        // 表单验证通过才可以提交
        if (isOK) {
          if (this.formData.id) {
            console.log(this.formData)
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          // 后台传送了数据,前端(页面)并没有改变需要重新拉取数据
          this.$emit('addDepts')
          // sync修饰符更改弹层,原始方法用子传父修改showDialog属性,现用update跟sync修改,是原始方法的语法糖
          this.$emit('update:showDialog', false)// 在原来传入的地方加sync
          // 这里不用重置表单字段,因为确认可以触发close事件,close调用了btnCancel方法重置校验字段
        }
      })
    },
    btnCancel () {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      // 为了title而设置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$refs.deptForm.resetFields() // 重置校验字段,resetFields组件自带的重置校验方法
      this.$emit('update:showDialog', false)// 在原来传入的地方加sync
    },
    // 获取部门详情
    async getDepartDetail (id) {
      this.formData = await getDepartDetail(id)
    }
  }
}
</script>

<style scoped>
</style>
