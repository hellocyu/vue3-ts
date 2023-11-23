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
      boundaryGap: false,
      data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      axisLine: {
        show: true,
        lineStyle: {
          color: 'white',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: '(人数)',
      axisLine: {
        show: true,
        lineStyle: {
          color: 'white',
        },
      },
      splitLine: {
        show: false,
      },
    },
    legend: {
      data: ['2021年', '2022年', '2023年'],
      right: '5%',
      itemStyle: {
        color: 'inherit',
      },
      textStyle: {
        color: 'white',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    grid: {
      top: 30,
      bottom: 20,
      right: 20,
      left: 30,
    },
    series: [
      {
        name: '2021年',
        type: 'line',
        data: [33, 12, 45, 77, 35, 90, 12, 55, 89, 24, 76, 14],
        smooth: true,
        showSymbol: false,
        areaStyle: {},
      },
      {
        name: '2022年',
        type: 'line',
        showSymbol: false,
        data: [13, 52, 85, 27, 55, 10, 72, 25, 19, 84, 36, 84],
        smooth: true,
        areaStyle: {},
      },
      {
        name: '2023年',
        type: 'line',
        data: [63, 82, 15, 77, 5, 50, 82, 45, 39, 14, 46, 24],
        smooth: true,
        showSymbol: false,
        areaStyle: {},
      },
    ],
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
