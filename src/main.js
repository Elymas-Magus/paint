import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import konva from 'konva';

Vue.config.productionTip = false;
window.konva = konva;

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
