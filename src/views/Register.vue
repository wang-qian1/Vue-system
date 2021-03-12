<template>
  <div class="loginBox" id="loginBox" :style="{height: getHeight+'px'}">
    <div class="login" login>
      <el-card shadow="always">
        <el-avatar :src="require('../assets/imgs/logo.png')" :size="80" avatar></el-avatar>
        <div class="form" form>
          <el-form :model="registerForm" :rules="rules" ref="register" label-width="70px" label-position="left">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="registerForm.username" @focus="showUnTip = true" autofocus></el-input>
              <div tip v-if="showUnTip == true && this.registerForm.username == '' ">
                <p>
                  1、用户名可以是中文、英文、数字或组合
                </p>
                <p>
                  2、用户名的长度为2~8
                </p>
                <p>
                  3、不能包含特殊字符
                </p>
              </div>
            </el-form-item>
            <el-form-item label="密 码" prop="password">
              <el-input show-password v-model="registerForm.password" @focus="showPsTip=true"></el-input>
              <div tip v-if="showPsTip == true && this.registerForm.password == '' ">
                <p>
                  1、密码可以是中文、英文、数字或组合
                </p>
                <p>
                  2、密码的长度为6~16
                </p>
                <p>
                  3、不能包含特殊字符
                </p>
              </div>
            </el-form-item>
            <el-form-item label="确认密码" prop="verifyPass">
              <el-input show-password v-model="registerForm.verifyPass"></el-input>
            </el-form-item>
            <el-form-item label="邮箱账号" prop="email">
              <el-input v-model="registerForm.email"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
              <div class="code">
                <el-input v-model="registerForm.verifyCode"></el-input>
                <el-image class="checkImg" alt="更换验证码" @click="getVerify" :src="url" :fit="fit">
                  <div slot="placeholder" class="image-slot checkImg" v-loading="loading">
                  </div>
                </el-image>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :style="{width: '100%'}" @click="register('register')">注 册</el-button>
            </el-form-item>
          </el-form>
          <p toLogin><a href="javascript:;" @click="toLogin">已注册，前去登录</a></p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {
    axiosUtil
  } from "../network/axiosUtil"

  export default {
    name: "Register",
    data() {
      let username = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入用户名"))
        } else if (!/^[\u4e00-\u9fa5A-Za-z0-9]{2,16}$/.test(value)) {
          callback(new Error("用户名只能输入中文、英文、数字组合，且长度为2-8"))
        } else {
          this.showUnTip = false
          callback()
        }
      };
      let password = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入密码"))
        } else if (!/^[A-Za-z0-9]{6,16}$/.test(value)) {
          callback(new Error("密码可以是数字、英文，且长度为6-16"))
        } else {
          this.showPsTip = false
          callback()
        }
      };
      let verifyPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入确认密码"))
        } else if (value != this.registerForm.password) {
          callback(new Error("两次密码不一致，请重新输入"))
        } else {
          callback()
        }
      };
      let email = (rule, value, callback) => {
        if (value === '') {
          callback(new Error("请输入邮箱账号"))
        } else if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value)) {
          callback(new Error("请输入正确格式的邮箱账号"))
        } else {
          callback()
        }
      };
      let verifyCode = (rule, value, callback) => {
        if (value != '') {
          axiosUtil({
            url: '/checkVerify',
            method: 'post',
            params: {
              code: value
            }
          }).then(data => {
            if (data) {
              this.checkCode = true
            } else {
              this.checkCode = false
            }
          })
        }
        if (value === '') {
          callback(new Error("请输入邮箱账号"))
        } else {
          callback()
        }
      }
      return {
        showUnTip: false, //是否显示用户名输入提示
        showPsTip: false, //是否显示密码输入提示
        showEmailTip: false, //是否显示发送邮件提示
        mill: 60,
        height: '',
        fit: 'contain',
        checkCode: false,
        url: 'api/getVerify',
        loading: true,
        registerForm: {
          username: '',
          password: '',
          verifyPass: '',
          email: '',
          verifyCode: ''
        },
        rules: {
          username: [{
            validator: username,
            trigger: 'blur'
          }],
          password: [{
            validator: password,
            trigger: 'blur'
          }],
          verifyPass: [{
            validator: verifyPass,
            trigger: 'blur'
          }],
          email: [{
            validator: email,
            trigger: 'blur'
          }],
          verifyCode: [{
            validator: verifyCode,
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      getHeight() {
        this.height = document.documentElement.clientHeight
        return this.height
      },
      millDecrement() {
        let times = setTimeout(() => {
          this.mill--
        }, 1000)
        if (this.mill == 0) {
          this.mill = 60
          this.showEmailTip = false
        }
        return this.mill
      }
    },
    mounted() {
      let _this = this
      window.addEventListener('resize', function () {
        _this.height = document.documentElement.clientHeight
      })
    },
    methods: {
      register(form) {
        this.$refs[form].validate(state => {
          if (state) {
            //判断是否验证码已通过校验
            if (this.checkCode) {
              axiosUtil({
                url: '/register',
                method: 'post',
                params: {
                  username: this.registerForm.username,
                  password: this.registerForm.password,
                  email: this.registerForm.email
                }
              }).then(data => {
                if (data == 'success') {
                  this.$message({
                    type: 'success',
                    message: '注册成功，为您跳转到登录界面'
                  })
                  setTimeout(() => {
                    this.$router.push({
                      path: '/login'
                    })
                  }, 3000)
                } else if (data = 'repeat') {
                  this.$message.error("该用户名已被注册")
                } else {
                  this.$message.error("注册失败！")
                }
              })
            } else {
              this.$message.error("校验码错误,请重新输入!")
            }
          }
        })
      },
      toLogin() {
        this.$router.push({
          path: '/login'
        })
      },
      getVerify() {
        //判断用户名和密码是否填写
        if (this.registerForm.username != '' && this.registerForm.password != '' && this.registerForm.verifyPass !=
          '') {

          //获得校验码
          axiosUtil({
            url: '/getVerify',
            method: 'get',
          }).then(data => {
            if (data) {
              this.showEmailTip = true
              this.url = 'api/getVerify?' + Math.random()
            }
          })
        } else {
          this.$message.error('请先填写用户名和密码')
        }
      }
    }
  }
</script>

<style scoped>
  #loginBox {
    position: relative;
    width: 100%;
    background: url("../assets/imgs/login.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .login[login] {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 500px;
  }

  .login [avatar] {
    position: absolute;
    top: -40px;
    left: 40%;
  }

  .login .form[form] {
    margin-top: 40px;
  }

  .checkImg {
    display: inline-block;
    height: 40px;
    width: 95px;
  }

  .login .form [tip]>p {
    line-height: 1.5em;
    margin: 0;
    padding: 0;
    color: #C0C4CC;
    animation: tip 0.8s ease;
  }

  @keyframes tip {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .code {
    display: flex;
    margin-top: 0px;
  }

  [toLogin] a {
    text-decoration: none;
    float: right;
    margin-bottom: 20px;
  }
</style>