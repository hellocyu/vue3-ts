export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//定义登录接口返回数据类型
export interface RoleData {
  id?: number
  createTime?: string
  updateTime?: string
  roleName?: string
  remark?: null
}
export type Records = RoleData[]
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}
//菜单与按钮数据类型
export interface MenuData {
  id: number
  createTime?: string
  updateTime?: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null
  level: number
  children?: MenuList
  select: boolean
}
export type MenuList = MenuData[]
export interface MenuResponseData extends ResponseData {
  data: MenuList
}
