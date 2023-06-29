<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select v-model="categoryStore.c1Id">
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select>
          <el-option label="67"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select>
          <el-option label="123"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()
onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}
</script>

<style scoped></style>
