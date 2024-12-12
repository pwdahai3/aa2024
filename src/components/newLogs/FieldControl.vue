<template>
  <div>
    <div>
      <el-tag
        v-for="(column, index) in visibleColumns"
        :key="index"
        closable
        @close="removeField(column)"
        type="info"
        hit
      >
        {{ column }}
      </el-tag>
    </div>
    <div v-show="availableColumns.length > 0">
      <el-select v-model="selectedField" placeholder="选择字段">
        <el-option
          v-for="(column, index) in availableColumns"
          :key="index"
          :prop="column.field"
          :label="column.field"
          :value="column.field"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="addField">添加字段</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    allColumns: Array,
    visibleColumns: Array,
  },
  data() {
    return {
      selectedField: '',
    };
  },
  computed: {
    availableColumns() {
      // 过滤掉已经显示在表格中的字段
      return this.allColumns.filter((column) => !this.visibleColumns.includes(column.field));
    },
  },
  methods: {
    addField() {
      if (this.selectedField && !this.visibleColumns.includes(this.selectedField)) {
        this.visibleColumns.push(this.selectedField);
        this.$emit('update:visibleColumns', this.visibleColumns); // 发送事件通知父组件更新visibleColumns
        this.selectedField = ''; // 清空选择的字段
      }
    },
    removeField(field) {
      const index = this.visibleColumns.indexOf(field);
      if (index !== -1) {
        this.visibleColumns.splice(index, 1);
        this.$emit('update:visibleColumns', this.visibleColumns); // 发送事件通知父组件更新visibleColumns
      }
    },
  },
};
</script>
