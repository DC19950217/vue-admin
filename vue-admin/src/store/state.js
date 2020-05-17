/**
 * 数据存储
 */
// import Cookie from "cookie_js";
export default {
    isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false
    // isCollapse: JSON.parse(Cookie.get('isCollapse')) || false

}