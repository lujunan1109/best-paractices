import Vue from 'vue'
import App from './App.vue'
import { BaseButton } from '../es'
import  ElButton  from 'element-ui/packages/button';
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/button.css';


Vue.config.productionTip = false

Vue.use(BaseButton)
// Vue.use(ElementUI)
Vue.use(ElButton);
// Vue.component(Button.name, Button);

new Vue({
  render: h => h(App),
}).$mount('#app')
