import VirtualRoll from './index.vue';
export const plugin = {
  install(Vue) {
    Vue.component(VirtualRoll.name, VirtualRoll);
  }
};