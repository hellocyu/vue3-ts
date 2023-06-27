//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { loginForm, loginResponseData, userResponseData } from '@/api/user/type'
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
        this.token = result.data as string
        //本地存储持久化存储一份
        SET_TOKEN(result.data as string)
        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    //获取用户信息
    async userInfo() {
      const result: userResponseData = await reqUserInfo()
      if (result.code === 200) {
        this.userName = result.data.name
        this.avatar = result.data.avatar
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    //退出登录
    async userLogout() {
      const result: any = await reqLogout()
      if (result.code === 200) {
        this.token = ''
        this.userName = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
export default useUserStore
