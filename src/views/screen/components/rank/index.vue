<template>
  <div class="box">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <el-table :data="tableData" class="table" size="large">
      <el-table-column prop="id" label="排名" align="center" width="100" />
      <el-table-column prop="area" label="景区" align="center" width="100" />
      <el-table-column label="预约数量" align="center">
        <template #default="{ row, $index }">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="row.mount"
            :color="row.color"
          />
          <!-- <span>{{ row.mount }}</span> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup ng="ts">
const data = [
  { id: 1, area: '峨眉山', mount: 0.68 },
  { id: 2, area: '稻城亚丁', mount: 0.88 },
  { id: 3, area: '九寨沟', mount: 0.58 },
  { id: 4, area: '万里长城', mount: 0.48 },
  { id: 5, area: '北京故宫', mount: 0.38 },
]
import { ref, onMounted } from 'vue'
let tableData = ref()
onMounted(() => {
  getData()
})
const getData = () => {
  tableData.value = data.map((item) => {
    return {
      ...item,
      id: 'NO.' + item.id,
      mount: Math.floor(item.mount * 100),
      color: item.mount > 0.5 ? 'green' : 'red',
    }
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  --el-table-header-bg-color: #11144e;
  --el-table-tr-bg-color: #11144e;
  --el-table-border-color: #11144e;
  --el-table-border: #11144e;
  background-color: #11144e;
  --el-table-header-text-color: #ce9178;
  color: white;
}
:deep(.el-table thead) {
  font-weight: 900;
  font-size: 16px;
}
:deep(
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
  ) {
  background-color: #294d99;
}
:deep(.el-progress) {
  border: 2px solid #294d99;
  border-radius: 20px;
}
:deep(.el-progress-bar__outer) {
  background-color: #11144e;
}
.box {
  background: url(../../images/dataScreen-main-rt.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
    background: red;
  }
  .table {
    width: 100%;
    height: calc(100% - 60px);
    margin-top: 20px;
  }
}
</style>
