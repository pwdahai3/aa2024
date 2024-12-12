<template>
  <!-- <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
  </div> -->
  <div class="el-loading-mask" style="background-color: rgba(0, 0, 0, 0.2);" v-if="loading">
      <div class="el-loading-spinner">
        <i class="el-icon-loading" style="font-size:34px;"></i>
        <p class="el-loading-text" style="font-size:12px;">loading...</p>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  methods: {
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.1);
  z-index: 9999;
}

.loading-spinner {
  border: 5px solid #1d2232;
  border-top: 5px solid #4d556d;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.el-loading-spinner{
  top: 46%
}
.el-loading-text{
  color: #333;
}
</style>
