<template>
  <el-table
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
    :data="PermissionArr"
  >
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="code" label="权限值" />
    <el-table-column prop="updateTime" label="修改时间" />
    <el-table-column label="操作" width="260px" align="center">
      <template #="{ row }">
        <el-button
          type="primary"
          size="samll"
          icon="Plus"
          :disabled="row.level === 4"
          @click="addPermission(row)"
        ></el-button>
        <el-button
          type="primary"
          size="samll"
          icon="Edit"
          :disabled="row.level === 1"
          @click="updatePermission(row)"
        ></el-button>
        <el-popconfirm
          :title="`你确定删除${row.name}?`"
          @confirm="deletePermission(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="samll"
              icon="Delete"
              :disabled="row.level === 1"
            ></el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    width="30%"
  >
    <el-form>
      <el-form-item label="名称" prop="roleName">
        <el-input v-model="menuData.name"></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="roleName">
        <el-input v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqRemoveMenu,
} from '@/api/acl/menu'
import {
  PermissionResponseData,
  PermissionList,
  Permission,
  MenuParams,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
let PermissionArr = ref<PermissionList>([])
let dialogVisible = ref<boolean>(false)
let menuData = reactive<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0,
})

onMounted(() => {
  getHasPermission()
})
const getHasPermission = async () => {
  let res: PermissionResponseData = await reqAllPermission()
  if (res.code === 200) {
    PermissionArr.value = res.data
  }
}
const addPermission = (row: Permission) => {
  Object.assign(menuData, {
    code: '',
    level: 0,
    name: '',
    pid: 0,
    id: 0,
  })
  dialogVisible.value = true
  menuData.level = row.level + 1
  menuData.pid = row.id
}
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}
const save = async () => {
  let res: any = await reqAddOrUpdateMenu(menuData)
  if (res.code === 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.pid ? '更新成功' : '添加成功',
    })
    getHasPermission()
  } else {
    dialogVisible.value = false
    ElMessage({
      type: 'error',
      message: menuData.pid ? '更新失败' : '添加失败',
    })
  }
}
const deletePermission = async (id: number) => {
  let res: any = await reqRemoveMenu(id)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasPermission()
  }
}
</script>

<style scoped></style>
