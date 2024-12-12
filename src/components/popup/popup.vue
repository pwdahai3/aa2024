<template>
<div>
    <el-dialog :width="width" :title="title" :visible.sync="isShow" :close-on-click-modal="false" :before-close="closePop">
        <slot></slot>
    </el-dialog>
</div>    
</template>
<script>
export default {
    props:{
      title:{
        type:String,
        default:""
      },
      width:{
        type:String,
        default:"70%"
      },
      isShow:{
        type:Boolean,
        default:false
      },
      closePop:{
        type:Function
      }
  }
}
</script>
<style scoped>

</style>


