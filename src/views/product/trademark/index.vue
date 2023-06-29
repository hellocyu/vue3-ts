<template>
  <el-card>
    <el-button type="primary" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <el-table :data="trademarkArr" border style="margin: 10px 0">
      <el-table-column
        type="index"
        label="序号"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #default="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>
          <el-popconfirm
            :title="`您确定要删除${row.tmName}？`"
            width="250px"
            icon="Delete"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper, ->,sizes,,total"
      :total="total"
      @size-change="sizeChange"
      @current-change="getHasTrademark"
    />
  </el-card>
  <!-- 对话框组件 -->
  <el-dialog
    v-model="dialogFormVisible"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- action图片上传路径 -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import type {
  Records,
  TradeMarkResponseData,
  TradeMark,
} from '@/api/product/trademark/type'
let pageNo = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false)
//定义收集新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
let formRef = ref()
const getHasTrademark = async (parger = 1) => {
  //当每页显示多少条数改变时 自动跳转到第一页
  pageNo.value = parger
  const result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code === 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
onMounted(() => {
  getHasTrademark()
})
const sizeChange = () => {
  getHasTrademark()
}
const addTrademark = () => {
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  dialogFormVisible.value = true
  nextTick(() => {
    //第一次进来的时候formRef为undefined
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}
const updateTrademark = (row: TradeMark) => {
  //row为当前已有品牌
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.id = row.id
  Object.assign(trademarkParams, row)
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
  dialogFormVisible.value = true
}
const cancel = () => {
  dialogFormVisible.value = false
}
const confirm = async () => {
  //在发请求之前，对整个表单进行校验
  //调用这个方法进行全部表单项校验
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1)
  } else {
    dialogFormVisible.value = false
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
  }
  dialogFormVisible.value = false
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发
  if (
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({ type: 'error', message: '上传文件格式大小应小于4M' })
      return false
    }
  } else {
    ElMessage({ type: 'error', message: '上传文件格式务必PNG|JPG|GIF' })
    return false
  }
}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  //response：即为当前这次上传图片post请求服务器返回的数据
  trademarkParams.logoUrl = response.data
  //图片上传成功 清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl')
}
//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //是当表单元素触发blur的时候 会触发次方法
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于2位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('logo图片务必上传'))
  }
}
//表单校验规则对象
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
