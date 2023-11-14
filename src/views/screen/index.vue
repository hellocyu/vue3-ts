<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">中间</div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Top from './components/top/index.vue'
import Age from './components/age/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
//监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    //以左上角为基点
    transform-origin: left top;
  }
  .top {
    width: 100%;
    height: 40px;
  }
  .bottom {
    display: flex;
    .right {
      flex: 1;
    }
    .left {
      flex: 1;
      height: 1020px;
      display: flex;
      flex-direction: column;
      .tourist {
        flex: 1.2;
      }
      .sex {
        flex: 1;
      }
      .age {
        flex: 1;
      }
    }
    .center {
      flex: 2;
    }
  }
}
</style>
