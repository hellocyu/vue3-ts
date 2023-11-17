<template>
  <div class="box">
    <div class="title">
      <p>未来7天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
let line = ref()
onMounted(() => {
  let myCharts = echarts.init(line.value)
  myCharts.setOption({
    title: {
      text: '访问量',
      textStyle: {
        color: 'white',
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      splitLine: {
        show: false,
      },
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      //y轴轴线
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        data: [100, 932, 700, 200, 1290, 500, 1320],
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'blue', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'white', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
    grid: {
      left: 30,
      right: 20,
      top: 10,
      bottom: 30,
    },
  })
})
</script>

<style lang="scss" scoped>
.box {
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 20px;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
  }
}
</style>
