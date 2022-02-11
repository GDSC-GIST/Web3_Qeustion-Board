import { useHistory } from 'react-router-dom'
 
const LinkBtn = ({ path = '/', state = {} }) => {
  // 클릭하면 원하는 페이지로 연결
  const onClick = () => {
    const history = useHistory();
    
    history.push({
      pathname: path,
      state: state,
    });
  };

  return (
    <button onClick={onClick} />
  );
};

export default LinkBtn;
