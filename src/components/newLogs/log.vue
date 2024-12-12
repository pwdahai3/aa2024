<template>
  <div>
    <field-control
      :allColumns="allColumns"
      :visibleColumns.sync="visibleColumns"
    ></field-control>
    <log-table
      :tableData="tableData"
      :visibleColumns="visibleColumns"
    ></log-table>
  </div>
</template>

<script>
import LogTable from './LogTable.vue';
import FieldControl from './FieldControl.vue';

export default {
  components: {
    LogTable,
    FieldControl,
  },
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          age: 12,
          name: '王小虎',
          address: '上海市普陀沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          age: 22,
          name: '王小',
          address: '上海市普陀区金沙江路弄',
        },
        {
          date: '2016-05-01',
          age: 32,
          name: '王虎',
          address: '上海市普沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          age: 14,
          name: '小虎',
          address: '上海市普陀区金沙江路6 弄',
        },
      ],
      allColumns: [
        { field: 'date', zh: 'ID', colWidth: '50' },
        { field: 'name', zh: 'Name', colWidth: '150' },
        { field: 'address', zh: 'address', colWidth: '80' },
        { field: 'age', zh: 'age', colWidth: '80' },

      ],
      visibleColumns: ['name', 'age'], // 初始可见字段
    };
  },
};
</script>
