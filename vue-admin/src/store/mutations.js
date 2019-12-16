/**
 * 包含多个由action触发去直接更新状态
 * 
 */

import {
    TEST,
    SET_COLLAPSE
} from "./mutation-types";

export default {
    [SET_COLLAPSE](state) {
        state.isCollapse = !state.isCollapse
    }
}