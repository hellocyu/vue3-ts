<template>
  <el-card class="box-card">
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        prop="skuName"
        label="名称"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column
        prop="skuDesc"
        label="描述"
        show-overflow-tooltip
        width="150px"
      ></el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量"
        width="150px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格"
        width="150px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="samll"
            :icon="row.isSale ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button type="primary" size="samll" icon="Edit"></el-button>
          <el-button type="primary" size="samll" icon="InfoFilled"></el-button>
          <el-button type="primary" size="samll" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getHasSku"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      :background="true"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale } from '@/api/product/sku'
import { SkuResponseData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
onMounted(() => {
  getHasSku()
})
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (res.code === 200) {
    total.value = res.data.total
    skuArr.value = res.data.records
  }
}
const handleSizeChange = (pageSizes: number) => {
  pageSize.value = pageSizes
  getHasSku()
}
const updateSale = async (row: SkuData) => {
  if (row.isSale) {
    await reqCancelSale(row.id)
    ElMessage({
      type: 'success',
      message: '下架成功99',
    })
  } else {
    await reqSaleSku(row.id)
    ElMessage({
      type: 'success',
      message: '上架成功',
    })
  }
  getHasSku(pageNo.value)
}
</script>

<style scoped></style>
