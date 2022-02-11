// timestamp를 년웡일 시간:분 형식으로 변경
const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);

  return (date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일 ' + 
    date.getHours() + ':' + date.getMinutes());
};

export default timestampToDate;
export { timestampToDate };
