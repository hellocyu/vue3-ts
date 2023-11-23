<template>
  <div class="box">
    <div class="title">
      <p>预约渠道数据统计</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let charts = ref()
onMounted(() => {
  let myCharts = echarts.init(charts.value)
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 30,
      top: 60,
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '智慧文旅平台' },
          { value: 735, name: '携程' },
          { value: 580, name: '飞猪' },
          { value: 484, name: '美团' },
        ],
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
    ],
  }
  myCharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: 260px;
  }
}
</style>
