export function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = padding0(date.getMonth() + 1, 2) + '-';
  var D = padding0(date.getDate(), 2) + ' ';
  var h = padding0(date.getHours(), 2) + ':';
  var m = padding0(date.getMinutes(), 2) + ':';
  var s = padding0(date.getSeconds(), 2);
  return Y + M + D + h + m + s;
}

function padding0(num, length) {
  if ((num + "").length >= length) {
    return num;
  }
  return padding0("0" + num, length)
}