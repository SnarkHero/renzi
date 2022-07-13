<template>
  <div>
    <!-- file-list是上传的列表文件, 让上传的组件显示出来-->
    <!-- on-preview是点击预览界面 -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="">
    </el-dialog>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDXrvjGWVDespVu1sTnqeBRQ9bnjOmshFY',
  SecretKey: '3pKbbKlvZ1D8nBIDtIQHrBE0VjgLkfOs'
})
export default {
  filters: {},
  components: {},
  data () {
    return {
      fileList: [], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: '', // 储存uid
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  watch: {},
  created () { },
  methods: {
    preview (file) {
      // 这里应该弹出一个层 层里是点击的图片地址

      this.imgUrl = file.url
      this.showDialog = true
    },
    // file是点击删除的文件,当前文件,fileList是最新数组
    handleRemove (file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile (file, fileList) {
      // file是当前文件,fileList是最新数组
      this.fileList = fileList.map(item => item)
      console.log(this.fileList)
    },
    beforeUpload (file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload (params) {
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'renzi-1312849288', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          console.log(err || data)
          if (!err || data.statusCode === 200) {
            // 说明上传成功了,需要去找上传的是哪一张图片
            this.fileList = this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
          }
          setTimeout(() => {
            this.showPercent = false
            this.percent = 0
          }, 0)
        })
      }
    }
  }
}

</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
