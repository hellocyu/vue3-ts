//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo } from '@/api/user'
import type { loginForm, loginResponseData } from '@/api/user/type'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import { constantRoute } from '@/router/routes'
const useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute, //仓库存储生成菜单需要的数组
      userName: '',
      avatar: '',
    }
  },
  //异步、逻辑的地方
  actions: {
    async userLogin(data: loginForm) {
      const result: loginResponseData = await reqLogin(data)
      if (result.code === 200) {
        //由于pinia/vuex存储数据其实利用js对象（非持久化）
        this.token = result.data.token as string
        //本地存储持久化存储一份
        SET_TOKEN(result.data.token as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data.message))
      }
    },
    //获取用户信息
    async userInfo() {
      const result = await reqUserInfo()
      if (result.code === 200) {
        this.userName = result.data.checkUser.username
        this.avatar = result.data.checkUser.avatar
      }
    },
    //退出登录
    userLogout() {
      this.token = ''
      this.userName = ''
      this.avatar = ''
      REMOVE_TOKEN()
    },
  },
  getters: {},
})
export default useUserStore
