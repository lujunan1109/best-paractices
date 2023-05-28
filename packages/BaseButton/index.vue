<template>
  <div>
    <el-button class="btn" type="primary">按钮</el-button>
    <p>{{tip}}</p>
  </div>
</template>

<script>
export default {
  name: 'BaseButton',
  data() {
    return {
      tip: '测试'
    }
  }
}
</script>

<style scoped>
.btn {
  color: red;
}
</style>
