import Vue from 'vue'
import App from './App.vue'
import { BaseButton } from '../es'
import { Button } from 'element-ui';
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false

Vue.use(BaseButton)
// Vue.use(ElementUI)
Vue.use(Button);
// Vue.component(Button.name, Button);

new Vue({
  render: h => h(App),
}).$mount('#app')
