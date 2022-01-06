const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);

  return (date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일 ' + 
    date.getHours() + ':' + date.getMinutes());
};

export default timestampToDate;