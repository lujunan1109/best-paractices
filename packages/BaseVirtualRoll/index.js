import BaseVirtualRoll from './index.vue';

export const VRoll = {
    install(Vue) {
        Vue.component(BaseVirtualRoll.name, BaseVirtualRoll);
    }
}