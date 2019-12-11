import Vue from "vue";
import SvgIcon from './SvgIcon';
Vue.component("svg-icon", SvgIcon);


/**
 * require.context:读取指定目录的所以文件
 * 
 */
const req = require.context("./svg", false, /\.svg$/); //正则里面表示结尾，读取结尾为.svg的文件
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireAll(req);