<template>
  <div :class="mystyle">
    <p class="text">{{$t('lg.nodata')}}</p>
  </div>
</template>
<script>
export default{
  props:{
    mystyle:{
      type:String
    }
  }
}
</script>
<style lang="stylus" scoped>
.pienodata
  text-align:center
  background:#fff
  position:absolute
  top:42%
  left:50%
  margin-left:-90px
  margin-top:-90px
  width:180px
  height:180px
  border-radius:50%
  .text
    text-align:center
    top:50%
    left:0
    position:absolute
    width:100%
.linenodata
  text-align:center
  background: #fff
  position:absolute
  top:45%
  left:2%
  width:96%
  height:15%
  .text
    text-align:center
    top:35%
    left:0
    position:absolute
    width:100%
</style>
