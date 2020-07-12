import {
    GetUserRole
} from "@/api/login"
import {
    defaultRouterMap,
    asnycRouterMap
} from "@/router"
import router from "../../router"
// 封装验证角色方法
function hasPremission(roles, router) {
    if (router.meta && router.meta.role) {
        return roles.some(item => router.meta.role.indexOf(item) >= 0)
    }
}


const state = {
    allRouters: defaultRouterMap,
    addRouters: []
}
const getters = {
    allRouters: state => state.allRouters, //所有的
    addRouters: state => state.addRouters //匹配的
}
const mutations = {

    SET_ROUTER(state, router) {
        state.addRouters = router;
        state.allRouters = defaultRouterMap.concat(router)
    }
}
const actions = {
    //   获取用户角色
    getRoles({
        commit
    }, requestData) {
        return new Promise((resolve, reject) => {
            GetUserRole().then(response => {
                let role = response.data.data;
                resolve(role)
            }).catch(error => {})
        })
    },
    // 创建动态路由
    createRouetr({
        commit
    }, data) {
        return new Promise((resolve, reject) => {
            let role = data;
            let addRouters = []
            // 超管的状态
            if (role.includes('admin')) {
                addRouters = asnycRouterMap
            } else { //普通管理员
                addRouters = asnycRouterMap.filter(item => {
                    if (hasPremission(role, item)) {
                        if (item.children && item.children.length > 0) {
                            item.children = item.children.filter(child => {
                                if (hasPremission(role, child)) {
                                    return child
                                }
                            })
                            return item
                        }
                        return item
                    }
                })
            }

            // 更新路由
            commit('SET_ROUTER', addRouters)
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}