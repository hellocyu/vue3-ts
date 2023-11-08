<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名" v-model="keyWord"></el-input>
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
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="primary"
      size="default"
      :disabled="selectIdArr.length ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <el-table
      border
      stripe
      style="margin: 10px 0px"
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="userName"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
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
            @click="setRole(row)"
          ></el-button>
          <el-button
            type="primary"
            size="samll"
            icon="Edit"
            @click="updateUser(row)"
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
      @current-change="getHasUser"
      :current-page="pageNo"
      :page-sizes="[5, 7, 9]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      :background="true"
    ></el-pagination>
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配用户角色</h4>
    </template>
    <template #default>
      <el-form :model="userParams">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表" prop="name">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(item, index) in allRole"
              :key="index"
              :label="item"
            >
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="roleConfirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from '@/api/acl/user'
import {
  UserResponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<Records>([])
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
let formRef = ref<any>()
let checkAll = ref<boolean>(false)
//控制全选按钮不确定的样式
let isIndeterminate = ref<boolean>(true)
//存储全部职位的数据
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
//准备一个数组存储批量删除用户id
let selectIdArr = ref<User[]>([])
let keyWord = ref<string>('')
//获取模板setting仓库
let settingStore = useLayoutSettingStore()
onMounted(() => {
  getHasUser()
})
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyWord.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}
const handleSizeChange = (pageSizes: number) => {
  pageSize.value = pageSizes
  getHasUser()
}
const addUser = () => {
  drawer.value = true
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  //清除form上一次的错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams, row)
  //清除form上一次的错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
const confirmClick = async () => {
  await formRef.value.validate()
  let res: any = await reqAddOrUpdateUser(userParams)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    //浏览器自动刷新一次 为了防止更改当前用户的信息
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}
const validatorUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名称至少五位'))
  }
}
const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('昵称至少五位'))
  }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('密码至少六位'))
  }
}
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
const setRole = async (row: User) => {
  //存储已有的用户信息
  Object.assign(userParams, row)
  let res: AllRoleResponseData = await reqAllRole(userParams.id)
  if (res.code === 200) {
    allRole.value = res.data.allRolesList
    userRole.value = res.data.assignRoles
  }
  drawer1.value = true
}
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}
const roleConfirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id,
    roleIdList: userRole.value.map((item) => item.id),
  }
  let res = await reqSetUserRole(data)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功',
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}
const deleteUser = async (userId: number) => {
  let res: any = await reqRemoveUser(userId)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
const selectChange = (value: any) => {
  selectIdArr.value = value
}
const deleteSelectUser = async () => {
  let idList: any = selectIdArr.value.map((item) => item.id)
  let res = await reqSelectUser(idList)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
const search = () => {
  getHasUser()
  // keyWord.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
