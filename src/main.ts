import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-expect-error
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'virtual:svg-icons-register'
//引入自定义插件对象：注册整个项目全局组件
import gloablComponent from '@/components'
import '@/styles/index.scss'
import router from './router'
import pinia from './store'
import './permission'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App)
//引入自定义指令文件
import { isHasButton } from '@/directive/has'
isHasButton(app)
app.use(ElementPlus)
app.use(pinia)
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComponent)
app.use(router)
app.mount('#app')
