import axios from "axios";
import {
    Message
} from "element-ui"
// 创建axios ，赋值变量server
// 测试地址 http://www.web-jshtml.cn/productapi
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
const server = axios.create({
    baseURL: BASEURL, //http://192.168.3.2:8080/devApi/ ==>http://www.web-jshtml.cn/productapi
    timeout: 5000

});
//请求接口前，做一些数据处理 （请求拦截器）
server.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config.headers)
    config.headers['Tokey'] = '111111111111111';



    return config;

}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
// 请求接口后，返回数据进行拦截（响应拦截器）
server.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    let data = response.data;
    if (data.resCode !== 0) {
        Message.error(data.message);
        return Promise.reject(data);
    } else {
        return response;
        // return Promise.resolve(data);
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default server;