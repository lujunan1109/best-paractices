import VirtualRoll from './index.vue';

const plugin = {
    install(Vue) {
        Vue.component(VirtualRoll.name, VirtualRoll);
    }
}

export default plugin;