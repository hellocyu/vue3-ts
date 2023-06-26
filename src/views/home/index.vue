<template>
  <div>我是一级路由home{{ userStore.userName }}</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
onMounted(() => [userStore.userInfo()])
let userStore = useUserStore()
</script>

<style scoped></style>
