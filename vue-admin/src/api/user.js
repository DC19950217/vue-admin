import serveice from '@/utils/request';
export function GetRole(data = {}) {
  return serveice.request({
    method: "post",
    url: "/role/",
    data: data
  })
}