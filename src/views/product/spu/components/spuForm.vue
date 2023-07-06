<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMarkList"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU照片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handleUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <el-select>
        <el-option label="华为"></el-option>
        <el-option label="oppo"></el-option>
      </el-select>
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        style="margin-left: 10px"
      >
        添加属性值
      </el-button>
      <el-table border style="margin: 10px 0" :data="saleAttrList">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="销售属性名字"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="item in row.spuSaleAttrValueList"
              :key="item.id"
              class="mx-1"
              closable
              style="margin: 0 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-button type="primary" size="small" icon="Plus"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作86" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              @click="saleAttrList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import {
  SpuData,
  AllTradeMark,
  Trademark,
  SPuHasImg,
  saleAttrResponseData,
  HasSaleAttrResponseData,
  SpuImage,
  saleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpIamgeList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu/index'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
let $emit = defineEmits(['changeScene'])
let AllTradeMarkList = ref<Trademark[]>([])
let imgList = ref<SpuImage[]>([])
let saleAttrList = ref<saleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
let SpuParams = ref<SpuData>({
  category3Id: '',
  description: '',
  spuName: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')
const cancel = () => {
  $emit('changeScene', 0)
}
const initHasSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  //获取全部品牌数据
  let result: AllTradeMark = await reqAllTradeMark()
  //获取某一个品牌旗下全部售卖商品的图片
  let result1: SPuHasImg = await reqSpIamgeList(spu.id as number)
  //获取已有的spu销售属性数据
  let result2: saleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取整个项目全部spu的销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  AllTradeMarkList.value = result.data
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttrList.value = result2.data
  allSaleAttr.value = result3.data
}
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}
const handleUpload = (file: any) => {
  if (
    file.type == 'img/png' ||
    file.type == 'img/jpg' ||
    file.type == 'img/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小需小于3M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件类型错误',
    })
    return false
  }
}
defineExpose({ initHasSpuData })
</script>

<style scoped></style>
