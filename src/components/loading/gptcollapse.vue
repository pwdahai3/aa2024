<template>
  <div>
    <div v-for="(item, index) in items" :key="index">
      <div @click="toggle(index)" class="header">{{ item.header }}</div>
      <div v-if="item.expanded" class="content">{{ item.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { header: "Item 1", content: "Content 1", expanded: false },
        { header: "Item 2", content: "Content 2", expanded: false },
        { header: "Item 3", content: "Content 3", expanded: false },
      ],
    };
  },
  methods: {
    toggle(index) {
      this.items.forEach((item, i) => {
        if (i === index) {
          item.expanded = !item.expanded;
        } else {
          item.expanded = false;
        }
      });
    },
  },
};
</script>

<style>
.header {
  cursor: pointer;
}

.content {
  margin: 10px 0;
}
</style>
