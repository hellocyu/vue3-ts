<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>9999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts">132个视频</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let people = ref('215908人')
</script>

<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 15px;
      margin-right: 10px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin: 40px 10px 10px 10px;
    display: flex;
    span {
      flex: 1;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 24px;
    }
  }
  .charts {
    width: 100%;
    height: 240px;
    background: red;
  }
}
</style>
