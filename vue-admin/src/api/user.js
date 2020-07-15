import serveice from '@/utils/request';
// 获取按钮列表
export function GetPermButton(data) {
  return serveice.request({
    method: "post",
    url: "/permButton/",
    data: data
  });
}
// 获取用户列表
export function GetRole(data = {}) {
  return serveice.request({
    method: "post",
    url: "/role/",
    data: data
  })
}
// 系统列表
export function GetSystem(data) {
  return serveice.request({
    method: "post",
    url: "/system/",
    data: data
  })
}

// 添加用户
export function UserAdd(data = {}) {
  return serveice.request({
    method: "post",
    url: "/user/add/",
    data: data
  })
}
// 删除用户
export function UserDel(data) {
  return serveice.request({
    method: "post",
    url: "/user/delete/",
    data: data
  })
}

// 用户禁启用
export function UserActives(data) {
  return serveice.request({
    method: "post",
    url: "/user/actives/",
    data: data
  })
}

// 用户编辑
export function UserEdit(data) {
  return serveice.request({
    method: "post",
    url: "/user/edit/",
    data: data
  })
}