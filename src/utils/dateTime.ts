export function getDateTime(dateTimeNumber:number) {
  // 将字符串解析为Date对象
const dateObject = new Date(dateTimeNumber);
if (isNaN(dateObject.getTime())) {
  console.error('Invalid date');
  return 'Invalid date';
} else {
  // 继续处理日期
  // 获取年、月、日、小时、分钟、秒
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // getMonth() 返回0-11，因此需要加1
  const day = dateObject.getDate();
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  return year+"/"+month+"/"+day+":"+hours+":"+minutes+":"+seconds;
}
}
