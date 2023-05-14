import { Button } from './BaseButton/index.js';
import { Form } from './BaseCustomForm/index.js';

// 全局组件导入
const req = require.context('./', false, /\.vue$/);
const requireAll = (requireContext, Vue) => requireContext.keys().map(cur => {
  const module = requireContext(cur).default;
  Vue.component(module.name, module);
});

// 按需引入
export const BaseButton = Button;
export const BaseCustomForm = Form;

/** 完整引入 */
export const BestLibrary = Vue => {
  requireAll(req, Vue); // 注册根目录下所有.vue组件
};