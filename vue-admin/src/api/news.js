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

// 子级分类添加
export function AddChildrenCategory(data) {
    return serveice.request({
        method: 'post',
        url: '/news/addChildrenCategory/',
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

// 获取所有分类（包含子级）
export function GetCategoryAll(data) {
    return serveice.request({
        method: 'post',
        url: '/news/getCategoryAll/',
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

// 修改分类
export function EditCategory(data) {
    return serveice.request({
        method: 'post',
        url: '/news/editCategory/',
        data
    })
}

//添加信息接口
export function AddInfo(data) {
    return serveice.request({
        method: 'post',
        url: '/news/add/',
        data
    })
}

//信息列表
export function GetList(data) {
    return serveice.request({
        method: 'post',
        url: '/news/getList/',
        data
    })
}
// 删除信息
export function DeleteInfo(data) {
    return serveice.request({
        method: 'post',
        url: '/news/deleteInfo/',
        data
    })
}


// 编辑信息

export function EditInfo(data) {
    return serveice.request({
        method: 'post',
        url: '/news/editInfo/',
        data
    })
}