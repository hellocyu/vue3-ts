<template>
  <div class="box">
    <img src="../../assets/images/error_images/404.png" />
    <el-button type="primary" size="default" @click="toHome">首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const toHome = () => {
  $router.push('./home')
}
</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
