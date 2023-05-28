<template>
  <div>
    <el-button class="btn">按钮123</el-button>
    <p>{{ tip }}</p>

  </div>
</template>

<script>
export default {
  name: "BaseButton",
  data() {
    return {
      tip: "测试我的组件啦，按钮组件好好看捏",
      ipt: "测试input",
      dialogVisible: false,
    };
  },
  methods: {

  },
};
</script>

<style scoped lang="scss">
$color: red;
.btn {
  color: $color;
}
</style>
