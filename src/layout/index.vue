<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      39
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">2</div>
    <!-- 内容区 -->
    <div class="layout_main"></div>
  </div>
</template>

<script setup lang="ts">
import Logo from './logo/index.vue'
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  .layout_slider {
    width: $base-menu-width;
    height: 100vh;
    background-color: $base-menu-background;
  }
  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background-color: pink;
  }
  .layout_main {
    position: absolute;
    left: $base-menu-width;
    top: $base-tabbar-height;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    background-color: skyblue;
    padding: 20px;
    overflow: auto;
  }
}
</style>
