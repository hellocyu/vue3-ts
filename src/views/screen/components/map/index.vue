<template>
  <div class="box" ref="map">135</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import chinaJSON from './china.json'
let map = ref()
echarts.registerMap('china', chinaJSON)
onMounted(() => {
  let myChart = echarts.init(map.value)
  myChart.setOption({
    geo: {
      map: 'china',
      roam: true,
      top: 100,
      // bottom: 50,
      left: 50,
      right: 50,
      label: {
        show: true,
        color: 'white',
        fontSize: 14,
      },
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#5470c6',
            },
            {
              offset: 1,
              color: '#1668ab',
            },
          ],
          global: false,
        },
        opacity: 0.8,
      },
      emphasis: {
        label: {
          fontSize: 20,
        },
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989],
              [119.306239, 26.075302],
            ],
            lineStyle: {
              color:'red',
              width: 5
            }
          },
          {
            coords: [
              //经纬度
              [ 87.617733,43.792818],
              [108.320004,22.82402],
            ],
            lineStyle: {
              color:'red',
              width: 5
            }
          },
        ],
        effect: {
              show: true,
              symbol:'arrow',
              symbolSize: 20 
            }
      },
    ],
  })
})
</script>

<style lang="scss" scoped></style>
