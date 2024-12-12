<template>
  <div>
    <el-table :data="tableData" v-if="tableData && tableData.length > 0">
      <el-table-column
        v-for="(column, index) in visibleColumns"
        :key="column"
        :prop="column"
        :label="column">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: Array,
    visibleColumns: Array,
  },
};
</script>
