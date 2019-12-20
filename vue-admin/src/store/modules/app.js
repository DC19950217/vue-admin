const state = {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
}
const getters = {}
const mutations = {
    SET_COLLAPSE(state) {
        console.log(state.isCollapse);
        state.isCollapse = !state.isCollapse;
        // html5本地储存
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    }
}
const actions = {
    async login({commit}, data) {
        const resdata = await Login(data);
     }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}