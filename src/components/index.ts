import SvgIcon from './SvgIcon/index.vue'
const allGlobalComponent: any = {
  SvgIcon,
}
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key])
    })
  },
}
