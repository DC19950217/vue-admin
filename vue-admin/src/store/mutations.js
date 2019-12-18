/**
 * 包含多个由action触发去直接更新状态
 * 
 */
// import Cookie from "cookie_js";
import {
    TEST,
    SET_COLLAPSE
} from "./mutation-types";

export default {
    [SET_COLLAPSE](state) {
        state.isCollapse = !state.isCollapse
        // html5本地存储
        sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
        // Cookie.set("isCollapse", JSON.stringify(state.isCollapse));

    }
}