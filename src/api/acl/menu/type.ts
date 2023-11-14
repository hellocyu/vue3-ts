export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//定义登录接口返回数据类型
export interface Permission {
  id?: number
  createTime?: string
  updateTime?: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: PermissionList
  select: boolean
}

export type PermissionList = Permission[]
export interface PermissionResponseData extends ResponseData {
  data: PermissionList
}
export interface MenuParams {
  id?: number
  code: string
  name: string
  pid: number
  level: number
}
