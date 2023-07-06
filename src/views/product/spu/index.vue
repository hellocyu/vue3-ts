<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0">
    <div v-show="scene == 0">
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
        @click="addSpu"
      >
        添加SPU
      </el-button>
      <el-table border style="margin: 10px 0" :data="records">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              title="修改SPU"
              @click="updateSpu(row)"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="View"
              title="查看SKU列表"
            ></el-button>
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              title="删除SPU"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper, ->,sizes,,total"
        :total="total"
        @size-change="sizeChange"
        @current-change="getHasSpu"
      />
    </div>
    <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
    <SkuForm v-show="scene == 2"></SkuForm>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { reqHasSpu } from '@/api/product/spu/index'
import { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
let scene = ref<number>(0) //0 显示已有SPU  1 添加或修改已有SPU  3添加SKU结构
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let records = ref<Records>([])
let spu = ref<any>()
watch(
  () => categoryStore.c3Id,
  () => {
    //务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
const sizeChange = () => {
  getHasSpu()
}
const addSpu = () => {
  scene.value = 1
}
//子组件spuform绑定自定义事件
const changeScene = (num: number) => {
  scene.value = num
}

const updateSpu = (row: SpuData) => {
  //调用子组件实例方法获取完整已有spu数据
  spu.value.initHasSpuData(row)
  scene.value = 1
}
</script>

<style scoped></style>
