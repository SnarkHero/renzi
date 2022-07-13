<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            size="small"
            type="danger"
            @click="exportData"
          >导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="图片" align="center">
            <template v-slot="{ row }">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                alt=""
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="formOfEmployment">
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.formOfEmployment === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                type="text"
                size="small"
                @click="editRole(row.id)"
              >角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delEmployee(row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.size"
            :current-page="page.page"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <AddDemployee :show-dialog.sync="showDialog" />
    </div>
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <assignRole
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import AddDemployee from './components/add-employee.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'// 引入枚举形式
import { formatDate } from '@/filters/index.js'
import QrCode from 'qrcode'
import assignRole from '@/views/employees/components/assign-role.vue'
export default {
  components: {
    AddDemployee,
    assignRole
  },
  data () {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created () {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList () {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage (newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    // 格式化聘用形式row,column表示行列数据,cellValue表示当前表格的值
    formatEmployment (row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee (id) {
      try {
        await this.$confirm('确定要删除吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    exportData () {
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 让所有的数据在一页上展示出来
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        // rows格式为[{name:'11'},{name:'12'}]
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },
    formatJson (headers, rows) {
      // rows格式为[{name:'11',moblie:123456},{name:'12'，moblie:1234567}]
      return rows.map(item => {
        // item是一个对象 {{name:'11',moblie:123456}}
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          // headers数据{'姓名': 'name','手机号': 'name'}
          // headers遍历返回的是['姓名','手机号'],再用map得到headers[key]是item的键名
          return item[headers[key]]
          // ['11','123456']
        })
      })
    },
    showQrCode (url) {
      if (url) {
        this.showCodeDialog = true
        // 因为渲染页面是异步的,所以直接打开弹层后不能显示二维码,需要用$nextTick使数据更新后让页面渲染完毕
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      }
    },
    async editRole (id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      // 为了防止弹窗后先没有效果再渲染,等页面数据传输更新过后再打开弹窗
      this.showRoleDialog = true
    }
  }
}
</script>

<style>
</style>
