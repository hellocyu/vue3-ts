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
          <el-button
            type="primary"
            size="samll"
            icon="InfoFilled"
            @click="findSpu(row)"
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
      @current-change="getHasSku"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
      :background="true"
    ></el-pagination>
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">平台属性</el-col>
          <el-col :span="16">
            <el-tag
              v-for="(item, index) in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">销售属性</el-col>
          <el-col :span="16">
            <el-tag
              v-for="(item, index) in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="8">商品图片</el-col>
          <el-col :span="16">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqSaleSku,
  reqCancelSale,
  reqSkuInfo,
  reqRemoveSku,
} from '@/api/product/sku'
import { SkuResponseData, SkuData, SkuInfoData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
const drawer = ref<boolean>(false)
let skuInfo = ref<any>({})
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
const findSpu = async (row: SkuData) => {
  drawer.value = true
  let res: SkuInfoData = await reqSkuInfo(row.id)
  skuInfo.value = res.data
}
const deleteSku = async (id: number) => {
  let res: any = await reqRemoveSku(id)
  if (res.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 获取剩余spu数据 若当前页只剩一条数据 则删除之后应跳转到上一页
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
