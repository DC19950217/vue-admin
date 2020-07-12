import {
    Login
} from "@/api/login";
import {
    setToken,
    getToken,
    setUserName,
    getUserName,
    removeToken,
    removeUserName
} from "@/utils/app"
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_ken: getToken() || '',
    username: getUserName() || '',
    roles: []
}
const getters = {
    isCollapse: state => state.isCollapse,
    roles: state => state.roles
}
const mutations = {
    // 处理nav菜单的收起展开
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        // html5本地储存
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    },
    // 存储token
    SET_TOKEN(state, value) {
        state.to_ken = value;
    },
    SET_USERNAME(state, value) {
        state.username = value;
    },
    SET_ROLES(state, value) {
        state.roles = value
    }
}
const actions = {
    async login({
        commit
    }, data) {
        const resdata = await Login(data);
        commit('SET_TOKEN', resdata.data.data.token);
        commit('SET_USERNAME', resdata.data.data.username);
        setToken(resdata.data.data.token);
        setUserName(resdata.data.data.username);
        return resdata.data;

    },
    async exit({
        commit
    }) {
        removeToken();
        removeUserName();
        commit("SET_TOKEN", "");
        commit("SET_USERNAME", "");
        commit("SET_ROLES", []);
        return "退出成功";
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}