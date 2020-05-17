import Vue from "vue";
import App from "./App.vue";
// elementui
import "./plugins/element.js";
// 转vue3.0
import "./plugins/composition-api";
// 自定义全局方法vue2.0方法
// import global from '@/utils/global.js'
// 自定义全局组件
import "./icons/index.js";
// 引入路由守卫
import "./router/premit";

import router from "./router";
import store from "./store";

// Vue.use(global);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");