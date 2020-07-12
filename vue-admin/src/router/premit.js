import router from "./index";
import store from "../store/index";
import {
    removeToken,
    removeUserName
} from "@/utils/app";

import {
    getToken
} from "@/utils/app";
const whiteRouter = ['/login'];
router.beforeEach((to, from, next) => {
    if (getToken()) {
        if (to.path === "/login") {
            removeToken();
            removeUserName();
            store.commit("SET_TOKEN", "")
            store.commit("SET_USERNAME", "")
            next();
        } else {
            if (store.getters['app/roles'].length === 0) {
                store.dispatch('permission/getRoles').then(response => {
                    let role = response.role
                    store.commit('app/SET_ROLES', role)
                    store.dispatch('permission/createRouetr', role).then(response => {
                        let addRouters = store.getters['permission/addRouters'];
                        let allRouters = store.getters['permission/allRouters'];
                        // 路由更新
                        router.options.routes = allRouters;
                        // 添加动态路由
                        router.addRoutes(addRouters)
                        next({
                            ...to,
                            replace: true
                        });
                    })
                })
            } else {
                next();
            }
        }
        console.log("存在");
    } else {
        if (whiteRouter.indexOf(to.path) !== -1) {
            next();
        } else {
            next('/login')
        }
    }

})