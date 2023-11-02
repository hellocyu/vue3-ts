<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default">搜索</el-button>
        <el-button type="primary" size="default">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button type="primary" size="default">批量删除</el-button>
    <el-table border stripe style="margin: 10px 0px" :data="userArr">
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
          <el-button type="primary" size="samll" icon="User"></el-button>
          <el-button
            type="primary"
            size="samll"
            icon="Edit"
            @click="updateUser(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定删除${row.skuName}?`"
            @confirm="deleteSku(row.id)"
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
        <el-button @click="cancelClick">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
import { UserResponseData, Records, User } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userArr = ref<Records>([])
let drawer = ref<boolean>(false)
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
let formRef = ref<any>()
onMounted(() => {
  getHasUser()
})
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
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
const cancelClick = () => {
  drawer.value = false
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
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
