<template>
  <div>
    <el-table :data="mails" border style="width: 100%" empty-text="暂无打卡记录，请及时打卡">
      <el-table-column fixed :formatter="dateFormat" label="日期" width="160"></el-table-column>
      <el-table-column label="目前身体健康状态" width="180"></el-table-column>
      <el-table-column label="昨日中午体温"></el-table-column>
      <el-table-column label="昨日晚上体温"></el-table-column>
      <el-table-column label="今日早上体温"></el-table-column>
      <el-table-column label="健康码" width="110"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isReply == 0" @click="replyWin(scope.row)" type="text" size="small">编辑</el-button>
          <el-button v-if="scope.row.isReply == 1" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="每日打卡" :visible.sync="isOpen" width="50%" :before-close="beforeClose">
      <div>
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
          <el-form-item label="目前身体状况">
            <el-input v-model="dataForm.state" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="昨日中午体温" prop="content">
            <el-input v-model="dataForm.temperature1" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="昨日晚上体温" prop="content">
            <el-input v-model="dataForm.temperature2" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="今日早上体温" prop="content">
            <el-input v-model="dataForm.temperature" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="健康码" prop="content">
            <el-input v-model="dataForm.healthCode" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="addMessage('dataForm')">打卡</el-button>
      </span>
    </el-dialog>
    <Paging @curr-page="currPage" :total="total"></Paging>
  </div>
</template>

<script>
import Paging from "../components/Paging"
import { axiosUtil } from "../network/axiosUtil"

export default {
  name: "Mail",
  data () {
    return {
      mails: [
        {
          date: '1589360053',
          sendAccount: '154954266',
          sendEmail: '18454245441',
          advises: '测试数据1',
          isReply: 0
        },
        {
          date: '1589360053',
          sendAccount: '154954266',
          sendEmail: '18454245441',
          advises: '测试数据2',
          isReply: 1
        },
        {
          date: '1589360053',
          sendAccount: '154954266',
          sendEmail: '18454245441',
          advises: '测试数据3',
          isReply: 0
        },
        {
          date: '1589360053',
          sendAccount: '154954266',
          sendEmail: '18454245441',
          advises: '测试数据4',
          isReply: 0
        }
      ],
      isOpen: false,
      username: 'test',
      dateId: 20201206,
      dataForm: {
        state: '',
        dataId: '',
        username: '',
        temperature1: '',
        temperature2: '',
        temperature: '',
        healthCode: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入200字以内的回复内容', max: '200', trigger: "blur" }
        ]
      },
      total: 0, //返回数据总数
      page: 1 //当前页数
    }
  },
  methods: {
    //时间戳转换时间格式
    dateFormat (row, col) {
      let resDate
      let date = row[col.property]
      if (date != null) {
        resDate = this.formatTime(date)
      }
      return resDate
    },
    formatTime (time) { //格式化时间
      return formatTime(time, "yyyy-MM-dd hh:mm:ss")
    },
    //打开窗口，默认显示对方用户名，且不可修改
    replyWin (row) {
      this.isOpen = true
      this.dataForm.dataId = row.dataId
    },
    //点击右上角的关闭按钮前，也需要询问是否发送当前邮件
    beforeClose (done) {
      let state = confirm("是否放弃提交？")
      if (state) {
        this.sendMessage('dataForm')
      } else {
        done()
      }
    },
    /**
    * 添加打卡信息，发送请求
    * */
    sendMessage (dataForm) {
      let data = this.$refs[dataForm].model
      axiosUtil({
        url: '/message/add',
        method: 'GET',
        params: {
          username: data.username,
          dateId: data.dateId
        }
      }).then(res => {
        if (res.code === 200) {
          this.mails = res.data
          this.isOpen = false
        }
      })
    }
  },
  created () {
    this.total = this.mails.length
    // axiosUtil({
    //   url: '/message/find',
    //   method: 'get',
    //   params: {
    //     username: this.username,
    //     dateId: this.dateId
    //   }
    // }).then(res => {
    //   if (res.code === 200) {
    //     this.mails = res.data
    //     this.total = res.data.length
    //   }
    // })
  },
  components: {
    Paging
  }
}
</script>

<style scoped>
</style>