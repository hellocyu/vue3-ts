//统一管理项目用户相关的接口
import request from '@/utils/request'
import { RoleResponseData, RoleData, MenuResponseData } from './type'
//项目用户相关的请求地址
enum API {
  ALLROLE_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  ALLPERMISSION = '/admin/acl/permission/toAssign/',
  SETPERMISSION = '/admin/acl/permission/doAssign/?',
}

export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION + roleId)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION + `roleId=${roleId}&permissionId=${permissionId}`,
  )
