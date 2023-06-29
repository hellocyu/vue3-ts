//商品分类全局组件小仓库
import { defineStore } from 'pinia'
import { reqC1 } from '@/api/product/attr'
import { CategoryResponseData } from '@/api/product/attr/type'
import { CategoryState } from './types/type'
const useCategoryStore = defineStore('category', {
  state: (): CategoryState => {
    return {
      c1Arr: [],
      c1Id: '',
    }
  },
  actions: {
    async getC1() {
      const result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
  },
  getters: {},
})
export default useCategoryStore
