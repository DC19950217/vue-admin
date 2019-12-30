import router from "./index";
import store from "../store/index";
import {removeToken,removeUserName} from "@/utils/app";

import {
    getToken
} from "@/utils/app";
const whiteRouter = ['/login'];
router.beforeEach((to, from, next) => {
    if (getToken()) {
       if(to.path==="/login"){
        removeToken();
        removeUserName();
        store.commit("SET_TOKEN","")
        store.commit("SET_USERNAME","")
        next();
       }else{
        next();
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