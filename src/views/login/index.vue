<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
          class="login_form"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              :loading="loading"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'
import useUserStore from '@/store/modules/user'
let useStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let loading = ref(false)
//收集账号与密码数据
let loginForm = reactive({
  username: 'admin',
  password: '111111',
})
const validateUserName = (rule: any, value: any, callback: any) => {
  // rule: 即为校验规则对象  value: 即为表单元素文本内容  callback:函数，如果符合条件callback放行，如果不符合条件callback条件，注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('用户名至少5位'))
  }
}
const validatePassword = (rule: any, value: any, callback: any) => {
  // rule: 即为校验规则对象  value: 即为表单元素文本内容  callback:函数，如果符合条件callback放行，如果不符合条件callback条件，注入错误信息
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码至少6位'))
  }
}
let rules = reactive({
  username: [
    {
      trigger: 'change',
      validator: validateUserName,
    },
  ],
  password: [
    {
      trigger: 'change',
      validator: validatePassword,
    },
  ],
})
let loginForms = ref()
const login = async () => {
  //保证全部表单的校验项通过
  await loginForms.value.validate()
  loading.value = true
  //通知仓库发登录请求
  //请求成功跳转首页
  //请求失败-弹出失败信息
  try {
    await useStore.userLogin(loginForm)
    //判断登录的时候是否有query参数
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })
    //编程式导航跳转首页
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    padding: 40px;
    background: url('@/assets/images/login_form.png');
    h1 {
      font-size: 40px;
      color: white;
    }
    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
