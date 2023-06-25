<template>
  <el-button size="samll" icon="Refresh" circle></el-button>
  <el-button size="samll" icon="FullScreen" circle></el-button>
  <el-button size="samll" icon="Setting" circle></el-button>
  <img
    src="../../../../public/logo.png"
    alt=""
    style="width: 24px; height: 24px; margin: 0 10px"
  />
  <el-dropdown>
    <span class="el-dropdown-link">
      Admin
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts"></script>

<style scoped></style>
