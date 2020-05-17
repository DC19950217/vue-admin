import {
    MessageBox,
    Message
} from 'element-ui';
export default {
    install(Vue, options) {
        Vue.prototype.confirm = (params) => {
                MessageBox.confirm(params.content, params.tip || '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: params.type || "warning",
                        center: true
                    })
                    .then(() => {
                        params.fn && params.fn(params.id);
                    })
                    .catch(() => {
                        /*   Message({
                              type: "info",
                              message: "已取消删除"
                          }); */
                    });
            },
            Vue.prototype.message = (params) => {
                Message({
                    type: params.type||'info',
                    message: params.message
                })
            }
    }
}