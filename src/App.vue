<template>
  <div>
    我是APP根组件
    <router-view></router-view>
    <h3>测试</h3>
  </div>
  <SvgIcon name="home"></SvgIcon>
</template>

<script setup lang="ts">
import { reqLogin } from './api/user'
import { onMounted } from 'vue'
onMounted(() => {
  reqLogin({ username: 'admin', password: '111111' })
})
</script>

<style scoped lang="scss"></style>
