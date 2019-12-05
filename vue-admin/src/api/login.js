import server from "../utils/request";
/**
 * 获取验证码
 */
export function GetSms(data) {
    return server.request({
        method: "POST",
        url: "/getSms/",
        data
    })
}
/**
 * 获取用户角色
 */

/**
 * 登录
 */
export function Login(data) {
    return server.request({
        method: "POST",
        url: "/login/",
        data
    })
}
/**
 * 注册
 */
export function Register(data) {
    return server.request({
        method: 'POST',
        url: '/register/',
        data
    })
}