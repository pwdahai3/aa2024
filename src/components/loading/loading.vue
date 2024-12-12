<template>
  <div class="el-loading-mask" style="background-color: rgba(0, 0, 0, 0.2);">
      <div class="el-loading-spinner">
        <i class="el-icon-loading" style="font-size:34px;"></i>
        <p class="el-loading-text" style="font-size:12px;">{{title}}</p>
      </div>
    </div>
</template>
<script>
export default {
    props:{
      title:{
        type:String,
        default:"loading..."
      }
  }
}
</script>
<style scoped>
.el-loading-spinner{
  top: 46%
}
.el-loading-text{
  color: #333;
}
</style>


