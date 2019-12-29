import {
    Login
} from "@/api/login";
import {
    setToken,
    setUserName,
    getUserName
} from "@/utils/app"
const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
    to_ken: '',
    username: getUserName()||''
}
const getters = {
    isCollapse: (state)=>{state.isCollapse},
}
const mutations = {
    // 处理nav菜单的收起展开
    SET_COLLAPSE(state) {
        console.log(state.isCollapse);
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

    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}