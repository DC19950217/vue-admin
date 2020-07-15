import store from "../store/index"

export function buttonPermission(permission) {
  const button = store.getters['app/buttonPremission'];
  return button.indexOf(permission) != -1;
}