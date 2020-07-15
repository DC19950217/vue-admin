import Vue from "vue"
import store from "../store/index"
// 自定义指令
Vue.directive('btnPerm', {
  // 父级渲染
  bind: function (el, bingind, value) {
    if (bingind.def.hasBtnPerm(bingind.value)) {
      el.className = el.className + " show-button";
    }
  },
  // 操作父节点
  inserted: function (el) {},
  update: function () {},
  componentUpdated: function () {},
  unbind: function () {},
  hasBtnPerm: function (permission) {
    const button = store.getters['app/buttonPremission'];
    const roles = store.getters["app/roles"]; // 获取角色 
    // 如果是超级管理员
    if (roles.includes("admin")) {
      return true
    }
    return button.indexOf(permission) != -1;
  }
})