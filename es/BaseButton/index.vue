<template>
  <div>
    <button class="btn">按钮</button>
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
