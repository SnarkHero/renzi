<template>
  <div>
    <div class="dashboard-container">
      <div class="app-container">
        <el-card>
          <el-tabs>
            <el-tab-pane label="登录账户设置">
              <!-- 放置表单 -->
              <el-form
                :model="userInfo"
                :rules="rules"
                label-width="120px"
                style="margin-left: 120px; margin-top: 30px"
              >
                <el-form-item label="姓名:" prop="username">
                  <el-input v-model="userInfo.username" style="width: 300px" />
                </el-form-item>
                <el-form-item label="密码:" prop="password2">
                  <el-input
                    v-model="userInfo.password2"
                    style="width: 300px"
                    type="password"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="saveUserDetailById"
                  >更新</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="个人详情">
              <el-row type="flex" justify="end">
                <el-tooltip content="打印个人基本信息">
                  <router-link :to="`/employees/print/${userId}?type=personal`">
                    <i class="el-icon-printer" />
                  </router-link>
                </el-tooltip>
              </el-row>
              <!-- is需要用动态方法加:,is后面跟的是变量,component标签可以插入组件用来切换组件 -->
              <component :is="UserComponents" />
            </el-tab-pane>
            <el-tab-pane label="岗位信息">
              <el-row type="flex" justify="end">
                <el-tooltip content="打印岗位信息">
                  <router-link :to="`/employees/print/${userId}?type=job`">
                    <i class="el-icon-printer" />
                  </router-link>
                </el-tooltip>
              </el-row>
              <component :is="JobComponents" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info.vue'
export default {
  components: {
    UserInfo, JobInfo
  },
  data () {
    return {
      UserComponents: 'UserInfo',
      JobComponents: 'JobInfo',
      userInfo: {
        //   专门存放基本信息
        username: '',
        password2: ''
      },
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据 /:id?用params获取数据
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      this.userInfo = await getUserDetailById(this.userId)
    },
    async saveUserDetailById () {
      // 因为this.uesrInfo里面已经没有password2属性,所以当传入数据时候应该用浅拷贝拷贝password:this.userInfo.password2覆盖前面的原始密码
      await saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 })
      this.$message.success('保存成功')
    }
  }
}
</script>

<style scoped>
</style>
