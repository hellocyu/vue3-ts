//定义小仓库数据state的类型
import type { RouteRecordRaw } from 'vue-router'
import { CategoryObj } from '@/api/product/attr/type'
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  userName: string
  avatar: string
}
//定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c2Id: string | number
  c3Id: string | number
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
}
