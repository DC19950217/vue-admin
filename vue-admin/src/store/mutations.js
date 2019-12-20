/**
 * 包含多个由action触发去直接更新状态
 * 
 */
// import Cookie from "cookie_js";
import {
    SET_COLLAPSE,
    SET_LOGIN
} from "./mutation-types";

export default {
    [SET_COLLAPSE](state) {
        state.isCollapse = !state.isCollapse
        // html5本地存储
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
        // Cookie.set("isCollapse", JSON.stringify(state.isCollapse));

    },
    // 测试异步请求
    [SET_LOGIN](state,{resdata}){
        console.log(resdata);
    }

}