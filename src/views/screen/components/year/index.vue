<template>
  <div class="box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup ng="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
let charts = ref()
onMounted(() => {
  let myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {},
    xAxis: {
      type: 'category',
      // show: false,
    },
    yAxis: {
      show: false,
    },
    grid: {
      top: 30,
      bottom: 20,
      right: 20,
      left: 30,
    },
    series: {
      type: 'scatter',
      data: [33, 12, 45, 77],
      symbol: 'arrow',
      label: {
        show: true,
        position: 'top',
      },
    },
  })
})
</script>

<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-rc.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
