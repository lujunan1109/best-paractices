# best-practices

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### reference link
https://juejin.cn/post/6919125800637693959
https://juejin.cn/post/6844903593896574990#heading-10

### resolve problem & plan
1. 按需加载，全量加载
2. 样式需要单独编译
3. 扩充组件库，完成我的最佳实践

### other
1. umd格式也就是官方lib打包方式是全量引入，做不到按需加载
所以es模式也是就ele官方采用组件打包可以支持tree Shaking方式应运而生
2. 如果要仿照element-ui方式，就需要單獨抽離style，然后用一个文件夹去报装，最后配置babaelrc就行了

### 扩展部分
今天终于修复了elemnt的按需加载问题，也明白了babel-plugin-component到底这玩意做了什么事情
以后我决定自己实现按需加载，根据不同的库写一个utils，只要库支持就行，不就是路径引用加一个前缀的事情嘛。

https://juejin.cn/post/7046187185615142949#heading-10  vue3版本打包支持es 6啊
