import serveice from '@/utils/request';
// 列表
// 新增
// 编辑
// 删除



// 一级分类添加
export function AddFirstCategory(data) {
    return serveice.request({
        method: 'post',
        url: '/news/addFirstCategory/',
        data
    })
}

// 获取分类
export function GetCategory(data) {
    return serveice.request({
        method: 'post',
        url: '/news/getCategory/',
        data
    })
}

// 删除分类
export function DeleteCategory(data) {
    return serveice.request({
        method: 'post',
        url: '/news/deleteCategory/',
        data
    })
}