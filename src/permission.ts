//路由鉴权：项目当中路由能不能被访问的权限的设置(某一个路由 什么条件下可以被访问
import router from './router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
import pinia from './store'
import useUserStore from '@/store/modules/user'
import setting from './setting'
const userStore = useUserStore(pinia)

//全局守卫：项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title}-${to.meta.title}`
  //访问某一个路由之前的守卫
  //to: 将要访问哪个路由
  //from: 从哪个路由而来
  //next：放行
  nprogress.start()
  const token = userStore.token
  const userName = userStore.userName
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      if (userName) {
        next()
      } else {
        try {
          await userStore.userInfo()
          //万一刷新的时候是异步路由，有可能获取到用户信息、异步路由还没加载完毕，出现空白的效果
          next({ ...to })
        } catch (error) {
          //token过期
          //用户手动修改本地存储token
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  next()
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

//第一个问题：任意路由切换实现进度条--nprogress
//第二个问题：路由鉴权(路由访问权限的设置)
//用户未登录：可以访问login，其他路由不能访问(指向login)
//用户登录成功：不可以访问login(指向首页)，其他路由可以访问
