<template>
  <div>
    <el-button type="primary" @click="addMessage" class="pull-right mb20">今日打卡</el-button>
    <el-table :data="data" border style="width: 100%" empty-text="暂无打卡记录，请及时打卡">
      <el-table-column prop="dateId" fixed label="日期" width="160"></el-table-column>
      <el-table-column prop="state" :formatter="tabFormatter" label="目前身体健康状态" width="180"></el-table-column>
      <el-table-column prop="temperature1" label="昨日中午体温"></el-table-column>
      <el-table-column prop="temperature2" label="昨日晚上体温"></el-table-column>
      <el-table-column prop="temperature" label="今日早上体温"></el-table-column>
      <el-table-column prop="healthCode" :formatter="tabFormatter" label="健康码" width="110"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="replyWin(scope.row,false)" type="text" size="small">编辑</el-button>
          <el-button @click="replyWin(scope.row,true)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="健康日报表" :visible.sync="isOpen" width="50%" :before-close="beforeClose">
      <div>
        <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
          <el-form-item label="目前身体状况" prop="content">
            <el-radio-group v-model="dataForm.state" :disabled="isDisabled">
              <el-radio :label="1">健康</el-radio>
              <el-radio :label="2">体温大于37.3度</el-radio>
              <el-radio :label="3">有发烧、干咳等异常情况</el-radio>
              <el-radio :label="4">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="昨日中午体温" prop="content">
            <el-input v-model="dataForm.temperature1" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="昨日晚上体温" prop="content">
            <el-input v-model="dataForm.temperature2" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="今日早上体温" prop="content1">
            <el-input v-model="dataForm.temperature" :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="健康码" prop="content">
            <el-radio-group v-model="dataForm.healthCode" :disabled="isDisabled">
              <el-radio :label="1">绿色</el-radio>
              <el-radio :label="2">黄色</el-radio>
              <el-radio :label="3">红色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isOpen = false">取 消</el-button>
        <el-button type="primary" @click="sendMessage('dataForm')">打卡</el-button>
      </span>
    </el-dialog>
    <Paging @curr-page="currPage" :total="total"></Paging>
  </div>
</template>

<script>
  import Paging from "../components/Paging"
  import {
    axiosUtil
  } from "../network/axiosUtil"

  export default {
    name: "Mail",
    data() {
      return {
        data: [],
        isDisabled: false,
        isOpen: false,
        username: 'test',
        dateId: '',
        dataForm: {
          state: 1,
          dateId: '',
          username: '',
          temperature1: '',
          temperature2: '',
          temperature: '',
          healthCode: 1
        },
        rules: {
          // content1: [{
          //   required: true,
          //   message: '该项不能为空',
          //   max: '20',
          //   trigger: "blur"
          // }]
        },
        total: 0, //返回数据总数
        page: 1 //当前页数
      }
    },
    methods: {
      // 表格数据格式化
      tabFormatter(row, column, cellValue, index) {
        if (column.property == 'state') {
          switch (cellValue) {
            case 1:
              return "健康"
            case 2:
              return "体温大于37.3度"
            case 3:
              return "有发烧、干咳等异常情况"
            case 4:
              return "其他"
          }
        }
        if (column.property == 'healthCode') {
          switch (cellValue) {
            case 1:
              return "绿色"
            case 2:
              return "黄色"
            case 3:
              return "红色"
            default:
              break;
          }
        }
      },
      //时间戳转换时间格式
      dateFormat(row, col) {
        let resDate
        let date = row[col.property]
        if (date != null) {
          resDate = this.formatTime(date)
        }
        return resDate
      },

      formatTime(time) { //格式化时间
        return formatTime(time, "yyyy-MM-dd hh:mm:ss")
      },
      //打开窗口，默认显示对方用户名，且不可修改
      replyWin(row, isDisabled) {
        console.log(row)
        this.isOpen = true
        this.isDisabled = isDisabled
        this.dataForm = row
      },

      addMessage() {
        this.isOpen = true,
          this.isDisabled = false
      },

      //点击右上角的关闭按钮前，也需要询问是否发送当前邮件
      beforeClose(done) {
        let state = confirm("是否放弃提交？")
        if (!state) {
          this.sendMessage('dataForm')
        } else {
          done()
        }
      },

      /**
       * 添加打卡信息，发送请求
       * */
      sendMessage(dataForm) {
        var params = this.$refs[dataForm].model
        params.username = this.username
        axiosUtil({
          url: '/message/add',
          method: 'POST',
          data: {
            message: params,
          }
        }).then(data => {
          if (data) {
            this.$message({
              message: '打卡成功',
              type: 'success'
            });
            this.dataForm = data
            this.isOpen = false
            this.queryTable()
          } else {
            this.$message.error('打卡失败');
          }
        })
      },
      currPage(currPage) {
        this.page = currPage
      },
      queryTable() {
        let profile = JSON.parse(sessionStorage.getItem("profile"))
        this.username = profile.username
        axiosUtil({
          url: '/message/find',
          method: 'get',
          params: {
            username: this.username,
            dateId: this.dateId
          }
        }).then(data => {
          if (data && data != '') {
            this.data = data
            this.total = data.length
          }
        })
      }
    },

    created() {
      this.queryTable()
    },
    components: {
      Paging
    }
  }
</script>

<style scoped>
</style>