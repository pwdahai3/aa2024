<template>
  <div>
    <!-- loading组件 -->
    <loading ref="loading"></loading>
    <button @click="loadData">Load data</button>

<hr>
    <!-- collapse组件 -->
    <div>
      <collapse :items="items"></collapse>
    </div>
<hr>
   <!-- computed属性例子 -->
    <div>
      <ul>
        <li v-for="num in numbers" :key="num">{{ num }}</li>
      </ul>
      <p>总和：{{ sum }}</p>
    </div>
    <hr>
<!-- computed属性例子 -->
<div>
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - {{ product.price }} 元
      </li>
    </ul>
    <p>总价：{{ totalPrice }} 元</p>
    <p>平均价：{{ averagePrice }} 元</p>
  </div>
    <hr>
<!-- computed属性例子 -->
  <div>
    <ul>
      <li v-for="order in orders" :key="order.orderNo">
        订单号：{{ order.orderNo }}，
        商品数：{{ order.items.length }}，
        状态：{{ order.status }}
      </li>
    </ul>
    <p>待处理订单数：{{ pendingOrders }}</p>
    <p>已处理订单数：{{ processedOrders }}</p>
  </div>


  </div>
</template>

<script>
import loading from '@/components/loading/gptloading';
import Collapse from '@/components/loading/gptcollapse.vue';
export default {
  components: {
    loading,
    Collapse
  },
  data() {
    return {
      items: [
        {
          header: 'Header 1',
          content: 'Content 1',
          show: false
        },
        {
          header: 'Header 2',
          content: 'Content 2',
          show: false
        },
        {
          header: 'Header 3',
          content: 'Content 3',
          show: false
        }
      ],
      numbers: [1, 2, 3, 4, 5],
      products: [
        { id: 1, name: "商品1", price: 100 },
        { id: 2, name: "商品2", price: 200 },
        { id: 3, name: "商品3", price: 300 },
        { id: 4, name: "商品4", price: 400 },
      ],
      orders: [
        {
          orderNo: "202201010001",
          items: [{ name: "商品1", price: 100 }, { name: "商品2", price: 200 }],
          status: "待处理",
        },
        {
          orderNo: "202201010002",
          items: [{ name: "商品3", price: 300 }],
          status: "已处理",
        },
        {
          orderNo: "202201010003",
          items: [{ name: "商品4", price: 400 }, { name: "商品5", price: 500 }],
          status: "待处理",
        },
      ],
    };
  },
  computed: {
    sum() {
      return this.numbers.reduce((acc, cur) => acc + cur, 0);
    },
    totalPrice() {
      return this.products.reduce((acc, cur) => acc + cur.price, 0);
    },
    averagePrice() {
      return this.totalPrice / this.products.length;
    },
    pendingOrders() {
      return this.orders.filter((order) => order.status === "待处理").length;
    },
    processedOrders() {
      return this.orders.filter((order) => order.status === "已处理").length;
    },
  },
  methods: {
    
    loadData() {
      // 显示loading组件
      //this.$refs.loading.showLoading();
      // 执行一些异步操作
      // ...
      // 隐藏loading组件
     // this.$refs.loading.hideLoading();

     if (this.$refs.loading) {
        this.$refs.loading.showLoading();
      }

     
    }
  }
}
</script>