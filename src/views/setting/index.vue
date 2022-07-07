<template>
  <div class="dashboard-container">
    <div class="app-container">
      <template>
        <div class="dashboard-container">
          <div class="app-container">
            <el-card>
              <el-tabs>
                <!-- 放置页签 -->
                <el-tab-pane label="角色管理">
                  <!-- 新增角色按钮 -->
                  <el-row style="height: 60px">
                    <el-button
                      icon="el-icon-plus"
                      size="small"
                      type="primary"
                      @click="showDialog = true"
                    >新增角色</el-button>
                  </el-row>
                  <!-- 表格 -->
                  <el-table border="" :data="list">
                    <el-table-column
                      align="center"
                      type="index"
                      label="序号"
                      width="120"
                    />
                    <el-table-column
                      align="center"
                      prop="name"
                      label="角色名称"
                      width="240"
                    />
                    <el-table-column
                      align="center"
                      prop="description"
                      label="描述"
                    />
                    <el-table-column align="center" label="操作">
                      <template slot-scope="{ row }">
                        <el-button
                          size="small"
                          type="success"
                        >分配权限</el-button>
                        <el-button
                          size="small"
                          type="primary"
                          @click="editRole(row.id)"
                        >编辑</el-button>
                        <el-button
                          size="small"
                          type="danger"
                          @click="deleteRole(row.id)"
                        >删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 放置分页组件 -->
                  <el-row
                    type="flex"
                    justify="center"
                    align="middle"
                    style="height: 60px"
                  >
                    <el-pagination
                      :current-page="page.page"
                      :page-size="page.pagesize"
                      :total="page.total"
                      layout="prev, pager, next"
                      @current-change="changePage"
                    />
                  </el-row>
                </el-tab-pane>
                <el-tab-pane label="公司信息">
                  <el-alert
                    title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
                    type="info"
                    show-icon
                    :closable="false"
                  />
                  <el-form label-width="120px" style="margin-top: 50px">
                    <el-form-item label="公司名称">
                      <el-input
                        v-model="formData.name"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="公司地址">
                      <el-input
                        v-model="formData.companyAddress"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input
                        v-model="formData.mailbox"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                    <el-form-item label="备注">
                      <el-input
                        v-model="formData.remarks"
                        type="textarea"
                        :rows="3"
                        disabled
                        style="width: 400px"
                      />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </div>
        </div>
      </template>
      <!-- 弹层 -->

      <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
        <el-form
          ref="roleForm"
          :rules="rules"
          :model="roleForm"
          label-width="120px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button
              size="small"
              type="primary"
              @click="btnOK"
            >确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole } from '@/api/setting'
// 因为要用公司id,在vuex的user的userInfo中
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      list: [], // 定义一个数组,渲染页面的数据
      page: {
        // 页码相关的数据
        page: 1,
        pagesize: 10,
        total: 0// 记录总数
      },
      formData: {},
      showDialog: false,
      // 专门接收新增或者编辑的编辑的表单数据
      roleForm: {},
      rules: { name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }] }
    }
  },
  computed: {
    ...mapGetters['companyId']
  },
  created () {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
      // console.log(this.formData)
    },
    // 组件自带分页的点击事件,传的形参就是所点击
    changePage (newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async deleteRole (id) {
      // $confirm是一个Promise对象,用awawi asynv方法后只有通过才能执行后面代码,需要用try catch接收错误信息(错误信息指点击取消)
      try {
        await this.$confirm('确认删除该角色吗')
        // 数据给后端,需要重新拉取数据给前端渲染页面
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      console.log(this.roleForm)
      this.showDialog = true
    },
    async btnOK () {
      // 这也是个Promise对象可以用await跟async方法(还可以用isOk回调函数)
      // 上面表单验证通过才可以进行后面的函数
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          console.log(1)
        }
        this.getRoleList()
        this.showDialog = false
        this.$message('修改消息成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel () {
      console.log(1)
      // 清空内容
      this.roleForm = {
        name: '',
        description: ''
      }
      // 清除校验规则
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }

}
</script>
<style>
</style>
