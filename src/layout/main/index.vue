<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { watch, ref, nextTick } from 'vue'
let LayoutSettingStore = useLayoutSettingStore()
//控制当前组件是否销毁重建
let flag = ref(true)
//监听仓库内部数据是否发生变化
watch(
  () => LayoutSettingStore.refresh,
  () => {
    //实现刷新效果
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
