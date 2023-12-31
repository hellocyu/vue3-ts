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
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
              @click="addSku(row)"
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
              @click="findSku(row)"
            ></el-button>
            <el-popconfirm
              :title="`你确定删除${row.spuName}?`"
              @confirm="deleteSpu(row)"
            >
              <template #reference>
                <el-button
                  type="primary"
                  size="small"
                  icon="Delete"
                  title="删除SPU"
                ></el-button>
              </template>
            </el-popconfirm>
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
    <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
    <el-dialog title="SKU列表" v-model="show">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName"></el-table-column>
        <el-table-column label="SKU价格" prop="price"></el-table-column>
        <el-table-column label="SKU重量" prop="weight"></el-table-column>
        <el-table-column label="SKU图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu/index'
import {
  HasSpuResponseData,
  Records,
  SpuData,
  // SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import SpuForm from './components/spuForm.vue'
import SkuForm from './components/skuForm.vue'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
let categoryStore = useCategoryStore()
let scene = ref<number>(0) //0 显示已有SPU  1 添加或修改已有SPU  3添加SKU结构
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let records = ref<Records>([])
let spu = ref<any>()
let sku = ref<any>()
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
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
  spu.value.initAddSpu(categoryStore.c3Id)
  scene.value = 1
}
//子组件spuform绑定自定义事件
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    getHasSpu(pageNo.value)
  } else {
    getHasSpu()
  }
}

const updateSpu = (row: SpuData) => {
  //调用子组件实例方法获取完整已有spu数据
  spu.value.initHasSpuData(row)
  scene.value = 1
}
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
const findSku = async (row: SpuData) => {
  let result = await reqSkuList(row.id as number)
  if (result.code === 200) {
    skuArr.value = result.data
    show.value = true
  }
}
const deleteSpu = async (row: SpuData) => {
  let res = await reqRemoveSpu(row.id as number)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取剩余spu数据 若当前页只剩一条数据 则删除之后应跳转到上一页
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
