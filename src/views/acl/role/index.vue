<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户角色：">
        <el-input placeholder="请输入用户角色" v-model="keyWord"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="!keyWord"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加角色
    </el-button>
    <el-table border stripe style="margin: 10px 0px" :data="allRole">
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="260px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="samll"
            icon="User"
            @click="setPermission(row)"
          ></el-button>
          <el-button
            type="primary"
            size="samll"
            icon="Edit"
            @click="updateRole(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定删除${row.username}?`"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="samll" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getHasRole"
      :current-page="pageNo"
      :page-sizes="[5, 7, 9]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      :background="true"
    ></el-pagination>
  </el-card>
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id ? '更新角色' : '添加角色'"
    width="30%"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <el-tree
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
        ref="tree"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
} from '@/api/acl/role'
import {
  RoleResponseData,
  Records,
  RoleData,
  MenuResponseData,
  MenuList,
} from '@/api/acl/role/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyWord = ref<string>('')
let allRole = ref<Records>([])
let settingStore = useLayoutSettingStore()
let dialogVisible = ref<boolean>(false)
let RoleParams = reactive<RoleData>({
  roleName: '',
})
let form = ref<any>()
let drawer = ref<boolean>(false)
let menuArr = ref<MenuList>([])
//存储勾选节点的id（四级）
let selectArr = ref<number[]>([])
let tree = ref<any>()
onMounted(() => {
  getHasRole()
})
const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let res: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyWord.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    allRole.value = res.data.records
  }
}
const handleSizeChange = (pageSizes: number) => {
  pageSize.value = pageSizes
  getHasRole()
}
const search = () => {
  getHasRole()
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
const addRole = () => {
  Object.assign(RoleParams, { roleName: '', id: 0 })
  dialogVisible.value = true
  //清除form上一次的错误信息
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  //清除form上一次的错误信息
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('用户角色名称至少两位'))
  }
}
const rules = {
  roleName: [{ required: true, trigger: blur, validator: validatorRoleName }],
}
const save = async () => {
  await form.value.validate()
  let res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    dialogVisible.value = false
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败',
    })
  }
}
const defaultProps = {
  children: 'children',
  label: 'name',
}
const setPermission = async (row: RoleData) => {
  Object.assign(RoleParams, row)
  let res: MenuResponseData = await reqAllMenuList(RoleParams.id)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
    drawer.value = true
    // 119
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}
const confirmClick = async () => {
  const roleId = RoleParams.id
  //选中节点id
  let arr = tree.value.getCheckedKeys()
  //半选节点id
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  let res: any = await reqSetPermission(roleId, permissionId)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配成功120',
    })
    window.location.reload()
  }
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
