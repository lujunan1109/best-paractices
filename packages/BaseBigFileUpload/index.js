import BaseBigFileUpload from './index.vue';

export const FileUpload = {
    install(Vue) {
        Vue.component(BaseBigFileUpload.name, BaseBigFileUpload);
    }
}