/**
 * 包含接收组件通知触发mutations调用间接更新状态的方法的对象
 * 
 */
import {Login} from "@/api/login";
import {
    SET_LOGIN
} from "./mutation-types";
export default {
    // 异步测试
    async login({commit}, data) {
       const resdata = await Login(data);
    //    console.log(resdata)
       commit(SET_LOGIN,{resdata});
    }
}