import Vue from 'vue'
import App from './App.vue'
import { BaseButton } from '../es'

Vue.config.productionTip = false

Vue.use(BaseButton)

new Vue({
  render: h => h(App),
}).$mount('#app')
